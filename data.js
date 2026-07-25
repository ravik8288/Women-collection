// Centralized Storefront Database & Ad Configuration Helper

(function() {
  const categorySlugs = {
    EveryOne_Hit: "everyone-hit",
    summer_special2026: "summer-special-2026",
    Trend_WEAR: "trend-wear",
    run_wear: "run-wear",
  };

  // Use relative base paths to support direct file loading (file:///), localhost, and sub-folders
  const base = "";

  const localThumbs = {
    1: `${base}images/product-1.png`,
    2: `${base}images/product-2.webp`,
    3: `${base}images/product-3.png`,
    4: `${base}images/product-4.webp`,
    5: `${base}images/product-5.webp`,
    6: `${base}images/product-6.png`,
    7: `${base}images/product-7.webp`,
    8: `${base}images/product-8.png`,
    9: `${base}images/product-9.png`,
    10: `${base}images/product-10.webp`,
  };

  const assetUrl = (path) =>
    path ? `https://jobstola.com${path.replaceAll("\\/", "/")}` : "";

  const slugify = (value) =>
    value.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "")
      .trim().replace(/\s+/g, "-").replace(/-+/g, "-");

  window.categories = Object.entries(categorySlugs).map(([name, slug]) => {
    let displayName = name.replaceAll("_", " ");
    if (name === "EveryOne_Hit") displayName = "Everyone Hit";
    if (name === "summer_special2026") displayName = "Summer Special 2026";
    if (name === "Trend_WEAR") displayName = "Trend Wear";
    if (name === "run_wear") displayName = "Run Wear";
    return { name: displayName, rawName: name, slug };
  });

  // Map products catalogue data loaded from products-data.js
  const rawCatalogue = window.catalogue || [];
  window.products = rawCatalogue.map((item) => {
    const gallery = Object.keys(item)
      .filter((key) => /^img\d+$/.test(key) && item[key])
      .sort((a, b) => Number(a.slice(3)) - Number(b.slice(3)))
      .map((key) => assetUrl(item[key]));
    return {
      ...item,
      name: item.title,
      slug: `${item.id}-${slugify(item.title)}`,
      categoryName: window.categories.find(c => c.rawName === item.category)?.name || item.category,
      category: categorySlugs[item.category] || item.category,
      image: localThumbs[item.id] || gallery[0],
      gallery,
    };
  });

  // Data helpers
  window.getProduct = (slug) => window.products.find((p) => p.slug === slug);
  window.getCategory = (slug) => window.categories.find((c) => c.slug === slug);

  // Cart operations (LocalStorage)
  window.readCart = () => {
    try {
      const data = localStorage.getItem("women_collection_cart");
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Cart: Error reading cart", e);
      return null;
    }
  };

  window.writeCart = (item) => {
    try {
      if (item) {
        localStorage.setItem("women_collection_cart", JSON.stringify(item));
      } else {
        localStorage.removeItem("women_collection_cart");
      }
      // Dispatch custom event to tell main.js to update header badge immediately
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (e) {
      console.error("Cart: Error writing cart", e);
    }
  };

  // Ad slot configuration environment resolver
  const forceProdAds = new URLSearchParams(window.location.search).get("live_ads") === "true" || 
                       new URLSearchParams(window.location.search).get("prod_ads") === "true";

  window.isLocalTest = !forceProdAds && (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "" ||
    window.location.protocol === "file:" ||
    /^192\.168\./.test(window.location.hostname) ||
    /^10\./.test(window.location.hostname) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(window.location.hostname) ||
    window.location.hostname.endsWith(".local")
  );

  window.AD_SLOT_PATHS = window.isLocalTest
    ? {
        banner1: "/6355419/Travel/Europe/France/Paris",
        banner2: "/6355419/Travel/Europe/France",
        banner3: "/6355419/Travel/Europe",
        interstitial: "/6355419/Travel/Europe/Italy",
        anchor: "/6355419/Travel",
        rewarded: "/22601054/gift-cards",
        headerBanner: "/6355419/Travel/Europe/France/Paris",
        footerBanner: "/6355419/Travel/Europe/France",
      }
    : {
        banner1: "/22846411849,23358456112/JBM_parivahanindia.com_Banner1_new",
        banner2: "/22846411849,23358456112/JBM_parivahanindia.com_Banner2_new",
        banner3: "/22846411849,23358456112/JBM_parivahanindia.com_Banner2_new",
        interstitial: "/22846411849,23358456112/JBM_parivahanindia.com_Inter_new",
        anchor: "/22846411849,23358456112/JBM_parivahanindia.com_Anchor_new",
        rewarded: "/22846411849,23358456112/JBM_parivahanindia.com_Rewarded_new",
        headerBanner: "/22846411849,23358456112/JBM_parivahanindia.com_Banner1_new",
        footerBanner: "/22846411849,23358456112/JBM_parivahanindia.com_Banner2_new",
      };

  window.AD_SLOT_SIZES = {
    banner1: [[300, 250], [336, 280], "fluid"],
    banner2: [[300, 250], [336, 280], "fluid"],
    banner3: [[300, 250], [336, 280], "fluid"],
    interstitial: [[1, 1], [300, 250], [320, 480], [480, 320], [336, 280]],
    anchor: [[320, 50], [728, 90], [320, 100], "fluid"],
    rewarded: [[480, 320], [300, 100], [300, 75], [300, 50], [320, 480]],
    headerBanner: [[300, 250], [336, 280], "fluid"],
    footerBanner: [[300, 250], [336, 280], "fluid"],
  };

  console.log("Storefront Data initialized. Environment: " + (window.isLocalTest ? "Local Test" : "Production Live"));
})();
