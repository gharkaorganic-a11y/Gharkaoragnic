import { productSections } from "./productCollection";

/**
 * SEO URL → internal collection key mapping
 */
const routeAliases = {
  "pahadi-achar-online": "pickle",
  "buy-desi-ghee-online": "ghee",
    "buy-pahadi-achar-online": "pickle",

  "raw-honey-uttarakhand": "honey",
  "organic-food-uttarakhand": "all",
  "pahadi-products-online": "all",
  "uttarakhand-food-products": "all",
  "traditional-kumaoni-food": "all",
  "organic-food-india": "all",
  "chemical-free-food-india": "all",
  "homemade-pickle-india": "pickle",
  "pahadi-spices-online": "spices",
};

/**
 * fallback → section list
 */
const sectionMap = Object.fromEntries(
  productSections.map((s) => [s.key, s]),
);

/**
 * Resolve route → collection
 */
export const resolveCollection = (slug) => {
  if (!slug) return sectionMap.all;

  // direct match (collection key)
  if (sectionMap[slug]) return sectionMap[slug];

  // SEO alias match
  const mapped = routeAliases[slug];
  if (mapped && sectionMap[mapped]) return sectionMap[mapped];

  return sectionMap.all;
};