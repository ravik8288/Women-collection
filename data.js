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
  const forceTestAds = new URLSearchParams(window.location.search).get("test_ads") === "true" ||
                       new URLSearchParams(window.location.search).get("live_ads") === "false";

  window.isLocalTest = forceTestAds || (!forceProdAds && (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "" ||
    window.location.protocol === "file:" ||
    window.location.hostname.endsWith(".github.io") ||
    /^192\.168\./.test(window.location.hostname) ||
    /^10\./.test(window.location.hostname) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(window.location.hostname) ||
    window.location.hostname.endsWith(".local")
  ));

  window.AD_SLOT_PATHS = window.isLocalTest
    ? {
        banner1: "/6355419/Travel/Europe/France/Paris",
        banner2: "/6355419/Travel/Europe/France",
        banner3: "/6355419/Travel/Europe",
        interstitial: "/6355419/Travel/Europe/Italy",
        anchor: "/6355419/Travel",
        rewarded: "/22639388115/rewarded_web_example",
        sponsorBanner: "/6355419/Travel/Europe/France/Paris",
        headerBanner: "/6355419/Travel/Europe/France/Paris",
        footerBanner: "/6355419/Travel/Europe/France",
      }
    : {
        banner1: "/22846411849,23358456112/23358456112_shoping.parivahanindia.com_Banner",
        banner2: "/22846411849,23358456112/23358456112_shoping.parivahanindia.com_Banner2",
        banner3: "/22846411849,23358456112/23358456112_shoping.parivahanindia.com_Banner2",
        interstitial: "/22846411849,23358456112/23358456112_shoping.parivahanindia.com_inter",
        anchor: "/22846411849,23358456112/23358456112_shoping.parivahanindia.com_anchor",
        rewarded: "/22846411849,23358456112/23358456112_shoping.parivahanindia.com_rewarded",
        sponsorBanner: "/22846411849,23358456112/23358456112_shoping.parivahanindia.com_Banner",
        headerBanner: "/22846411849,23358456112/23358456112_shoping.parivahanindia.com_Banner",
        footerBanner: "/22846411849,23358456112/23358456112_shoping.parivahanindia.com_Banner2",
      };

  window.AD_SLOT_SIZES = {
    banner1: [[300, 250], [336, 280]],
    banner2: [[300, 250], [336, 280]],
    banner3: [[300, 250], [336, 280]],
    interstitial: [[480, 320], [1, 1], [300, 250], [320, 480], [336, 280]],
    anchor: [[320, 50], [728, 90], [320, 100]],
    rewarded: [[320, 480], [480, 320], [300, 50], [300, 75], [300, 100]],
    sponsorBanner: [[300, 250], [336, 280]],
    headerBanner: [[300, 250], [336, 280]],
    footerBanner: [[300, 250], [336, 280]],
  };

  console.log("Storefront Data initialized. Environment: " + (window.isLocalTest ? "Local Test" : "Production Live"));
})();
