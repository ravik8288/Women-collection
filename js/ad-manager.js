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

  const googletag = window.googletag || { cmd: [] };

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

    googletag.cmd.push(() => {
      googletag.pubads().addEventListener("slotRenderEnded", (event) => {
        const id = event.slot.getSlotElementId();
        const cb = _renderCallbacks[id];
        if (cb) cb(event);
      });
    });
  }

  /** Default render callback — hides the container when the ad is empty. */
  function defaultEmptyHandler(containerId, event) {
    if (!event.isEmpty) return;
    const container = document.getElementById(containerId);
    if (!container) return;
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
      googletag.cmd.push(() => {
        const path = window.AD_SLOT_PATHS && window.AD_SLOT_PATHS.anchor;
        if (!path) return;

        _anchorSlot = googletag.defineOutOfPageSlot(
          path,
          document.body.clientWidth <= 500
            ? googletag.enums.OutOfPageFormat.TOP_ANCHOR
            : googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR
        );

        if (_anchorSlot) {
          _anchorSlot.addService(googletag.pubads()).setConfig({
            targeting: { test: "anchor" },
          });
        }
      });
    },

    /**
     * Define an interstitial ad slot with navigation triggers.
     * Must be called before enableAndDisplay().
     */
    initInterstitial() {
      googletag.cmd.push(() => {
        const path =
          window.AD_SLOT_PATHS && window.AD_SLOT_PATHS.interstitial;
        if (!path) return;

        const slot = googletag.defineOutOfPageSlot(
          path,
          googletag.enums.OutOfPageFormat.INTERSTITIAL
        );

        if (slot) {
          slot.addService(googletag.pubads()).setConfig({
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

      googletag.cmd.push(() => {
        // Register rewarded-specific event listeners
        googletag.pubads().addEventListener("rewardedSlotReady", (event) => {
          console.log("Rewarded: Ad ready.");
          rewardedEvent = event;
          if (callbacks.onReady) callbacks.onReady(event);
        });

        googletag.pubads().addEventListener("rewardedSlotGranted", () => {
          console.log("Rewarded: Reward granted.");
          if (callbacks.onGranted) callbacks.onGranted();
        });

        googletag.pubads().addEventListener("rewardedSlotClosed", () => {
          console.log("Rewarded: Closed.");
          if (callbacks.onClosed) callbacks.onClosed();
          if (rewardedSlot) {
            googletag.destroySlots([rewardedSlot]);
            rewardedSlot = null;
          }
        });

        // Define the rewarded out-of-page slot
        var path = window.AD_SLOT_PATHS && window.AD_SLOT_PATHS.rewarded;
        if (!path) return;

        rewardedSlot = googletag.defineOutOfPageSlot(
          path,
          googletag.enums.OutOfPageFormat.REWARDED
        );

        if (rewardedSlot) {
          console.log("Rewarded: Slot created successfully.");
          rewardedSlot.addService(googletag.pubads());
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
          googletag.cmd.push(() => {
            if (rewardedSlot) {
              googletag.display(rewardedSlot);
              googletag.pubads().refresh([rewardedSlot]);
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
      googletag.cmd.push(() => {
        if (!_servicesEnabled) {
          googletag.pubads().enableSingleRequest();
          googletag.enableServices();
          _servicesEnabled = true;
        }

        // Display anchor slot
        if (_anchorSlot) {
          googletag.display(_anchorSlot);
        }

        // Display pending out-of-page slots (interstitial, etc.)
        for (var i = 0; i < _outOfPageSlots.length; i++) {
          googletag.display(_outOfPageSlots[i]);
        }
        _outOfPageSlots.length = 0;

        // Display + refresh pending banner slots
        for (var j = 0; j < _pendingBanners.length; j++) {
          var b = _pendingBanners[j];
          googletag.display(b.containerId);
          googletag.pubads().refresh([b.slot]);
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

      googletag.cmd.push(() => {
        var adPath = window.AD_SLOT_PATHS && window.AD_SLOT_PATHS[type];
        var adSizes = window.AD_SLOT_SIZES && window.AD_SLOT_SIZES[type];
        if (!adPath || !adSizes) return;

        // Destroy any existing slot with the same container ID
        var existingSlots = googletag.pubads().getSlots();
        for (var i = 0; i < existingSlots.length; i++) {
          if (existingSlots[i].getSlotElementId() === containerId) {
            googletag.destroySlots([existingSlots[i]]);
            break;
          }
        }

        var slot = googletag.defineSlot(adPath, adSizes, containerId);
        if (!slot) return;

        slot.addService(googletag.pubads());
        _managedSlots[containerId] = slot;

        if (_servicesEnabled) {
          // Services already enabled — display + refresh immediately
          googletag.display(containerId);
          googletag.pubads().refresh([slot]);
        } else {
          // Queue for batch display after enableAndDisplay()
          _pendingBanners.push({ containerId: containerId, slot: slot });
        }
      });
    },

    /**
     * Destroy a managed banner slot by its container ID and remove its callback.
     * @param {string} containerId
     */
    destroyBanner(containerId) {
      googletag.cmd.push(() => {
        if (_managedSlots[containerId]) {
          googletag.destroySlots([_managedSlots[containerId]]);
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
