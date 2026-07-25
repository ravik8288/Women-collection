import catalogue from "./products.json";

const categorySlugs = {
  EveryOne_Hit: "everyone-hit",
  summer_special2026: "summer-special-2026",
  Trend_WEAR: "trend-wear",
  run_wear: "run-wear",
};

const localThumbs = {
  1: "/images/product-1.png", 2: "/images/product-2.webp",
  3: "/images/product-3.png", 4: "/images/product-4.webp",
  5: "/images/product-5.webp", 6: "/images/product-6.png",
  7: "/images/product-7.webp", 8: "/images/product-8.png",
  9: "/images/product-9.png", 10: "/images/product-10.webp",
};

const assetUrl = (path) =>
  path ? `https://jobstola.com${path.replaceAll("\\/", "/")}` : "";

const slugify = (value) =>
  value.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "")
    .trim().replace(/\s+/g, "-").replace(/-+/g, "-");

export const categories = Object.entries(categorySlugs).map(([name, slug]) => ({ name, slug }));

export const products = catalogue.map((item) => {
  const gallery = Object.keys(item)
    .filter((key) => /^img\d+$/.test(key) && item[key])
    .sort((a, b) => Number(a.slice(3)) - Number(b.slice(3)))
    .map((key) => assetUrl(item[key]));
  return {
    ...item,
    name: item.title,
    slug: `${item.id}-${slugify(item.title)}`,
    categoryName: item.category,
    category: categorySlugs[item.category],
    image: localThumbs[item.id] || gallery[0],
    gallery,
  };
});

export const getProduct = (slug) => products.find((product) => product.slug === slug);
export const getCategory = (slug) => categories.find((category) => category.slug === slug);
