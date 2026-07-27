// Shared Layout Controller for Vanilla HTML Storefront

(function() {
  // Use relative base paths to support direct file loading (file:///), localhost, and sub-folders
  const base = "";

  // Re-route clean URLs to target specific local .html files
  const linkTo = (pageName) => {
    return pageName;
  };

  // Initialize Ad Manager and define the anchor slot early (before enableServices)
  AdManager.init();
  AdManager.initAnchor();

  // Inject Header and Footer on load
  document.addEventListener("DOMContentLoaded", () => {
    injectHeader();
    injectFooter();
    updateCartCount();
    AdManager.enableAndDisplay();

    // Listen to custom cart update events
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);
  });

  function injectHeader() {
    const mount = document.getElementById("header-mount");
    if (!mount) return;

    // Retrieve categories dynamically from window.categories in data.js
    const categories = window.categories || [];
    const cart = window.readCart();
    const count = cart ? cart.quantity : 0;

    let categoryLinks = categories.map(c => 
      `<a href="${linkTo('category.html')}?cat=${c.slug}" class="category-link-item">${c.name}</a>`
    ).join("");

    let drawerCategoryLinks = categories.map(c => 
      `<a href="${linkTo('category.html')}?cat=${c.slug}">${c.name}<span>→</span></a>`
    ).join("");

    mount.innerHTML = `
      <div class="header-ad-wrapper" style="display: flex; justify-content: center; background: var(--paper, #f6f7fb); border-bottom: 1px solid var(--line, #e5e7eb); padding: 10px 0;">
        <div id="div-gpt-ad-header-banner1" style="min-width: 300px; min-height: 50px; margin: 0 auto;"></div>
      </div>
      <header class="site-header">
        <div class="nav-shell">
          <div class="brand-wrap">
            <img class="brand-icon" src="${base}icons/women-collection-mark.svg" alt="" aria-hidden="true" />
            <a class="brand" href="${linkTo('index.html')}">
              <strong>women.collection.in</strong>
              <small>Modern festive fashion</small>
            </a>
          </div>
          <nav class="desktop-nav">
            <a href="${linkTo('index.html')}" class="nav-item">Home</a>
            <button id="category-trigger" class="nav-item-btn">
              Categories
              <img class="category-arrow" src="${base}icons/chevron-down.svg" alt="" aria-hidden="true" />
            </button>
            <a href="${linkTo('faq.html')}" class="nav-item">FAQ</a>
            <a href="${linkTo('about.html')}" class="nav-item">About</a>
            <a href="${linkTo('contact.html')}" class="nav-item">Contact</a>
            <a href="${linkTo('policies.html')}" class="nav-item">Policies</a>
          </nav>
          <div class="nav-actions">
            <a href="${linkTo('index.html')}#featured-products" class="new-arrivals-btn">New arrivals</a>
            <a aria-label="Shopping cart, ${count} items" class="bag ${count ? "has-items" : ""}" href="${linkTo('cart.html')}">
              <svg class="cart-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="19" cy="20" r="1.5" />
                <path d="M2 3h3l2.4 11.5a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6" />
              </svg>
              <b id="cart-badge">${count}</b>
            </a>
            <button class="menu" id="drawer-open-btn" aria-label="Open navigation">☰</button>
          </div>
          <div class="category-popover" id="category-menu" style="display: none;">
            <p>Browse edits</p>
            ${categoryLinks}
          </div>
        </div>
      </header>

      <!-- Mobile Drawer Navigation -->
      <div class="drawer-backdrop" id="drawer-backdrop" style="display: none;">
        <aside class="drawer">
          <button class="drawer-close" id="drawer-close-btn">×</button>
          <p class="eyebrow">Navigation</p>
          <h2>Discover</h2>
          <p class="muted">Market Place, E-Commerce, Buy new fashion</p>
          <nav>
            <a href="${linkTo('index.html')}">Home<span>→</span></a>
            <a href="${linkTo('faq.html')}">FAQ<span>→</span></a>
            <a href="${linkTo('about.html')}">About Us<span>→</span></a>
            <a href="${linkTo('contact.html')}">Contact Us<span>→</span></a>
            <a href="${linkTo('policies.html')}">Policies<span>→</span></a>
          </nav>
          <p class="eyebrow drawer-label">Collections</p>
          <h3>Shop by Category</h3>
          <nav>
            ${drawerCategoryLinks}
          </nav>
        </aside>
      </div>
    `;

    // Initialize interactive navigation events
    const catTrigger = document.getElementById("category-trigger");
    const catMenu = document.getElementById("category-menu");
    const drawerOpen = document.getElementById("drawer-open-btn");
    const drawerClose = document.getElementById("drawer-close-btn");
    const drawerBackdrop = document.getElementById("drawer-backdrop");

    if (catTrigger && catMenu) {
      catTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = catMenu.style.display === "block";
        catMenu.style.display = isOpen ? "none" : "block";
        catTrigger.classList.toggle("categories-open", !isOpen);
      });
      document.addEventListener("click", () => {
        catMenu.style.display = "none";
        catTrigger.classList.remove("categories-open");
      });
    }

    if (drawerOpen && drawerBackdrop) {
      drawerOpen.addEventListener("click", () => {
        drawerBackdrop.style.display = "flex";
      });
    }

    if (drawerClose && drawerBackdrop) {
      drawerClose.addEventListener("click", () => {
        drawerBackdrop.style.display = "none";
      });
    }
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener("click", () => {
        drawerBackdrop.style.display = "none";
      });
      drawerBackdrop.querySelector(".drawer")?.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    // Load header banner ad slot dynamically
    AdManager.renderBanner("headerBanner", "div-gpt-ad-header-banner1");
  }

  function injectFooter() {
    const mount = document.getElementById("footer-mount");
    if (!mount) return;

    mount.innerHTML = `
      <div class="footer-ad-wrapper" style="display: flex; justify-content: center; background: var(--paper, #f6f7fb); border-top: 1px solid var(--line, #e5e7eb); padding: 20px 0;">
        <div id="div-gpt-ad-footer-banner2" style="min-width: 300px; min-height: 50px; margin: 0 auto;"></div>
      </div>
      <footer>
        <div class="footer-grid container">
          <section>
            <p class="eyebrow gold">House of premium edits</p>
            <h3>women.collection.in</h3>
            <p>women.collection.in offers daily new arrivals and curated modern fashion for women.</p>
            <div class="footer-pills">
              <span>Modern silhouettes</span>
              <span>Premium finish</span>
              <span>Quick support</span>
            </div>
          </section>
          <section>
            <p class="eyebrow gold">Explore</p>
            <a href="${linkTo('index.html')}">Shop</a>
            <a href="${linkTo('about.html')}">About Us</a>
            <a href="${linkTo('faq.html')}">FAQ</a>
            <a href="${linkTo('contact.html')}">Contact</a>
            <a href="${linkTo('policies.html')}">Policies</a>
          </section>
          <section>
            <p class="eyebrow gold">Client promise</p>
            <p>Carefully presented styles with a refined shopping journey from browsing to checkout.</p>
            <p>Need assistance with your order, sizing, or delivery? Use the contact page and we will respond quickly.</p>
          </section>
        </div>
        <div class="footer-bottom container">
          <span>© 2026 women.collection.in. All rights reserved.</span>
          <span>Designed for a premium storefront experience.</span>
        </div>
      </footer>
    `;

    // Load footer banner ad slot dynamically
    AdManager.renderBanner("footerBanner", "div-gpt-ad-footer-banner2");
  }

  function updateCartCount() {
    const cart = window.readCart();
    const count = cart ? cart.quantity : 0;
    const badge = document.getElementById("cart-badge");
    const bagIcon = document.querySelector(".bag");
    if (badge) badge.innerText = count;
    if (bagIcon) {
      if (count > 0) {
        bagIcon.classList.add("has-items");
      } else {
        bagIcon.classList.remove("has-items");
      }
    }
  }

})();
