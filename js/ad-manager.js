/**
 * Centralized Google Publisher Tag (GPT) Ad Manager
 *
 * Handles all ad types: Banner, Anchor, Interstitial, Rewarded.
 * Ensures enableServices() is called exactly once and event listeners
 * are registered once (no accumulation).
 *
 * Usage:
 *   AdManager.init();                          // Register global listeners
 *   AdManager.initAnchor();                    // Define anchor slot
 *   AdManager.renderBanner("banner1", "id");   // Define display banner
 *   AdManager.initInterstitial();              // Define interstitial
 *   AdManager.initRewarded({ onReady, ... });  // Define rewarded
 *   AdManager.enableAndDisplay();              // Enable services + display all
 */
window.AdManager = (function () {
  "use strict";

  // Dynamic accessor for window.googletag (handles async loading of gpt.js)
  function getGoogletag() {
    window.googletag = window.googletag || { cmd: [] };
    return window.googletag;
  }

  // --- Private State ---
  let _servicesEnabled = false;
  let _listenersRegistered = false;
  let _anchorSlot = null;

  const _outOfPageSlots = [];  // interstitial etc. — display after enableServices
  const _pendingBanners = [];  // banners queued before enableServices
  const _renderCallbacks = {}; // slotElementId → callback(event)
  const _managedSlots = {};    // slotElementId → googletag.Slot

  // --- Helpers ---

  /** Register the global slotRenderEnded listener exactly once. */
  function ensureListeners() {
    if (_listenersRegistered) return;
    _listenersRegistered = true;

    const gt = getGoogletag();
    gt.cmd.push(() => {
      window.googletag.pubads().addEventListener("slotRenderEnded", (event) => {
        const id = event.slot.getSlotElementId();
        const cb = _renderCallbacks[id];
        if (cb) cb(event);
      });
    });
  }

  /** Default render callback — hides container when empty (or shows placeholder in local test). */
  function defaultEmptyHandler(containerId, event) {
    if (!event.isEmpty) return;
    const container = document.getElementById(containerId);
    if (!container) return;

    if (window.isLocalTest) {
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.style.justifyContent = "center";
      container.style.background = "#f1f5f9";
      container.style.border = "1px dashed #cbd5e1";
      container.style.borderRadius = "8px";
      container.style.padding = "10px";
      container.style.color = "#64748b";
      container.style.fontSize = "12px";
      container.style.fontFamily = "sans-serif";
      container.innerHTML = `📢 Ad Placeholder [${containerId}] (Google Test Slot — No Fill)`;
      return;
    }

    container.style.display = "none";
    const wrapper = container.parentElement;
    if (
      wrapper &&
      (wrapper.classList.contains("header-ad-wrapper") ||
        wrapper.classList.contains("footer-ad-wrapper") ||
        wrapper.classList.contains("ad-container-outer"))
    ) {
      wrapper.style.display = "none";
    }
  }

  // --- Public API ---
  return {
    /**
     * Initialize the ad manager. Call once per page.
     * Registers the global slotRenderEnded event listener.
     */
    init() {
      ensureListeners();
    },

    /**
     * Define an anchor ad slot (top on mobile ≤500px, bottom otherwise).
     * Must be called before enableAndDisplay().
     */
    initAnchor() {
      const gt = getGoogletag();
      gt.cmd.push(() => {
        const path = window.AD_SLOT_PATHS && window.AD_SLOT_PATHS.anchor;
        if (!path) return;

        // Use Out-Of-Page TOP_ANCHOR / BOTTOM_ANCHOR format for both local & live GAM
        _anchorSlot = window.googletag.defineOutOfPageSlot(
          path,
          document.body.clientWidth <= 500
            ? window.googletag.enums.OutOfPageFormat.TOP_ANCHOR
            : window.googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR
        );

        if (_anchorSlot) {
          _anchorSlot.addService(window.googletag.pubads());
        }
      });
    },

    /**
     * Define an interstitial ad slot with navigation triggers.
     * Must be called before enableAndDisplay().
     */
    initInterstitial() {
      const gt = getGoogletag();
      gt.cmd.push(() => {
        const path =
          window.AD_SLOT_PATHS && window.AD_SLOT_PATHS.interstitial;
        if (!path) return;

        const slot = window.googletag.defineOutOfPageSlot(
          path,
          window.googletag.enums.OutOfPageFormat.INTERSTITIAL
        );

        if (slot) {
          slot.addService(window.googletag.pubads()).setConfig({
            interstitial: {
              triggers: {
                navBar: true,
                unhideWindow: true,
              },
            },
          });
          _outOfPageSlots.push(slot);
        }
      });
    },

    /**
     * Define a rewarded ad slot and register event callbacks.
     *
     * @param {Object} callbacks
     * @param {Function} [callbacks.onReady]   - Called with (event) when rewarded slot is ready.
     * @param {Function} [callbacks.onGranted] - Called when reward is granted.
     * @param {Function} [callbacks.onClosed]  - Called when rewarded ad is closed.
     * @returns {{ display: Function, makeVisible: Function, isReady: Function }}
     *          Control object for the rewarded ad.
     */
    initRewarded(callbacks) {
      callbacks = callbacks || {};
      let rewardedSlot = null;
      let rewardedEvent = null;

      const gt = getGoogletag();
      gt.cmd.push(() => {
        // Register rewarded-specific event listeners
        window.googletag.pubads().addEventListener("rewardedSlotReady", (event) => {
          console.log("Rewarded: Ad ready.");
          rewardedEvent = event;
          if (callbacks.onReady) callbacks.onReady(event);
        });

        window.googletag.pubads().addEventListener("rewardedSlotGranted", () => {
          console.log("Rewarded: Reward granted.");
          if (callbacks.onGranted) callbacks.onGranted();
        });

        window.googletag.pubads().addEventListener("rewardedSlotClosed", () => {
          console.log("Rewarded: Closed.");
          if (callbacks.onClosed) callbacks.onClosed();
          if (rewardedSlot) {
            window.googletag.destroySlots([rewardedSlot]);
            rewardedSlot = null;
          }
        });

        // Define the rewarded out-of-page slot
        var path = window.AD_SLOT_PATHS && window.AD_SLOT_PATHS.rewarded;
        if (!path) return;

        rewardedSlot = window.googletag.defineOutOfPageSlot(
          path,
          window.googletag.enums.OutOfPageFormat.REWARDED
        );

        if (rewardedSlot) {
          console.log("Rewarded: Slot created successfully.");
          rewardedSlot.addService(window.googletag.pubads());
        } else {
          console.warn(
            "Rewarded: defineOutOfPageSlot returned null — " +
              "rewarded ads not supported on this page/device."
          );
        }
      });

      // Return a control object so the page can trigger display / visibility
      return {
        /** Display and refresh the rewarded slot. Call after enableAndDisplay(). */
        display: function () {
          const gtInner = getGoogletag();
          gtInner.cmd.push(() => {
            if (rewardedSlot) {
              window.googletag.display(rewardedSlot);
              window.googletag.pubads().refresh([rewardedSlot]);
              console.log("Rewarded: Slot displayed and refresh requested.");
            }
          });
        },
        /** Make the rewarded ad visible (call after user clicks "watch"). */
        makeVisible: function () {
          if (rewardedEvent) {
            rewardedEvent.makeRewardedVisible();
          }
        },
        /** Check whether the rewarded ad has loaded and is ready to show. */
        isReady: function () {
          return !!rewardedEvent;
        },
      };
    },

    /**
     * Enable GPT services and display all pending out-of-page slots.
     * Safe to call multiple times — enableServices() only runs once.
     */
    enableAndDisplay() {
      const gt = getGoogletag();
      gt.cmd.push(() => {
        console.log("AdManager: enableAndDisplay triggered. Services enabled:", _servicesEnabled);
        if (!_servicesEnabled) {
          window.googletag.pubads().enableSingleRequest();
          window.googletag.enableServices();
          _servicesEnabled = true;
        }

        // Display anchor slot
        if (_anchorSlot) {
          console.log("AdManager: Displaying anchor slot.");
          window.googletag.display(_anchorSlot);
        }

        // Display pending out-of-page slots (interstitial, etc.)
        for (var i = 0; i < _outOfPageSlots.length; i++) {
          console.log("AdManager: Displaying out-of-page slot:", _outOfPageSlots[i]);
          window.googletag.display(_outOfPageSlots[i]);
        }
        _outOfPageSlots.length = 0;

        // Display + refresh pending banner slots
        for (var j = 0; j < _pendingBanners.length; j++) {
          var b = _pendingBanners[j];
          console.log("AdManager: Displaying banner slot:", b.containerId);
          window.googletag.display(b.containerId);
          window.googletag.pubads().refresh([b.slot]);
        }
        _pendingBanners.length = 0;
      });
    },

    /**
     * Define, display, and refresh a standard display banner ad.
     *
     * @param {string} type        - Key from AD_SLOT_PATHS / AD_SLOT_SIZES (e.g. "banner1").
     * @param {string} containerId - DOM element ID of the ad container div.
     * @param {Object} [options]
     * @param {Function} [options.onRender]    - Custom callback on slotRenderEnded.
     * @param {boolean}  [options.hideOnEmpty] - Hide container when ad is empty (default true).
     */
    renderBanner(type, containerId, options) {
      options = options || {};
      var hideOnEmpty = options.hideOnEmpty !== false;
      ensureListeners();

      // Register render callback for this container
      _renderCallbacks[containerId] = function (event) {
        if (options.onRender) options.onRender(event);
        if (hideOnEmpty) defaultEmptyHandler(containerId, event);
      };

      const gt = getGoogletag();
      gt.cmd.push(() => {
        var adPath = window.AD_SLOT_PATHS && window.AD_SLOT_PATHS[type];
        var adSizes = window.AD_SLOT_SIZES && window.AD_SLOT_SIZES[type];
        if (!adPath || !adSizes) {
          console.warn("AdManager: Missing slot config for type:", type);
          return;
        }

        console.log("AdManager: Defining slot type:", type, "path:", adPath, "container:", containerId);

        // Destroy any existing slot with the same container ID
        var existingSlots = window.googletag.pubads().getSlots();
        for (var i = 0; i < existingSlots.length; i++) {
          if (existingSlots[i].getSlotElementId() === containerId) {
            window.googletag.destroySlots([existingSlots[i]]);
            break;
          }
        }

        var slot = window.googletag.defineSlot(adPath, adSizes, containerId);
        if (!slot) {
          console.warn("AdManager: defineSlot returned null for container:", containerId);
          return;
        }

        slot.addService(window.googletag.pubads());
        _managedSlots[containerId] = slot;

        if (_servicesEnabled) {
          // Services already enabled — display + refresh immediately
          window.googletag.display(containerId);
          window.googletag.pubads().refresh([slot]);
        } else {
          // Queue for batch display after enableAndDisplay()
          _pendingBanners.push({ containerId: containerId, slot: slot });
        }
      });

      // Auto-trigger enableAndDisplay after stack clears if DOM is ready
      if (!_servicesEnabled) {
        setTimeout(() => {
          if (!_servicesEnabled && _pendingBanners.length > 0) {
            AdManager.enableAndDisplay();
          }
        }, 50);
      }
    },

    /**
     * Destroy a managed banner slot by its container ID and remove its callback.
     * @param {string} containerId
     */
    destroyBanner(containerId) {
      const gt = getGoogletag();
      gt.cmd.push(() => {
        if (_managedSlots[containerId]) {
          window.googletag.destroySlots([_managedSlots[containerId]]);
          delete _managedSlots[containerId];
        }
        delete _renderCallbacks[containerId];
      });
    },

    /** Check whether GPT services have been enabled. */
    isServicesEnabled() {
      return _servicesEnabled;
    },
  };
})();
