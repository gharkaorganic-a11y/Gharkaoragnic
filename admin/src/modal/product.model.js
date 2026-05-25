/**
 * product.model.js
 * Single source of truth for product shape, writable fields, and validation.
 */

/* ─────────────────────────────
   FIELD DEFINITIONS
───────────────────────────── */
export const PRODUCT_FIELDS = {
  /* ── BASIC INFO ── */
  name: "",
  slug: "",
  description: "",
  shortDescription: "",

  /* ── MEDIA ── */
  banner: "",
  images: [],            // string[]

  /* ── PRICING ── */
  price: 0,
  originalPrice: 0,
  stock: 0,

  /* ── VARIANTS ── */
  sizes: [],             // string[]
  colors: [],            // string[]

  /* ── PRODUCT META ── */
  material: "",
  brand: "",
  categoryId: "",
  collectionTypes: [],   // string[]
  tags: [],              // string[]

  /* ── ORGANIC / ECO-SPECIFIC ── */
  ingredients: "",       // comma-separated or prose
  shelfLife: "",         // e.g. "12 months"
  benefits: "",          // prose
  certifications: [],    // e.g. ["USDA Organic", "Non-GMO"]
  faq: [],               // { question: string, answer: string }[]

  /* ── AGGREGATE RATINGS (denormalised) ── */
  totalReviews: 0,
  ratingSum: 0,
  // Computed on read: rating = ratingSum / totalReviews

  /* ── ANALYTICS ── */
  views: 0,
  purchases: 0,
  salesLast24h: 0,

  /* ── STATUS ── */
  isActive: true,
  isDeleted: false,

  /* ── SEO ── */
  metaTitle: "",
  metaDescription: "",
  canonicalUrl: "",
  ogImage: "",

  /* ── TIMESTAMPS ── */
  createdAt: null,
  updatedAt: null,
};

/**
 * Fields that admins are allowed to write/update.
 * Excludes server-managed fields: createdAt, updatedAt, totalReviews, ratingSum,
 * views, purchases, salesLast24h.
 */
export const WRITABLE_FIELDS = [
  "name",
  "slug",
  "description",
  "shortDescription",
  "banner",
  "images",
  "price",
  "originalPrice",
  "stock",
  "sizes",
  "colors",
  "material",
  "brand",
  "categoryId",
  "collectionTypes",
  "tags",
  "ingredients",
  "shelfLife",
  "benefits",
  "certifications",
  "faq",
  "isActive",
  "isDeleted",
  "metaTitle",
  "metaDescription",
  "canonicalUrl",
  "ogImage",
];

/**
 * Returns a fresh, mutable empty product.
 * Always spread so callers can't mutate the shared PRODUCT_FIELDS object.
 */
export const createEmptyProduct = () => ({
  ...PRODUCT_FIELDS,
  images: [],
  sizes: [],
  colors: [],
  collectionTypes: [],
  tags: [],
  certifications: [],
  faq: [],
});

/* ─────────────────────────────
   VALIDATION
───────────────────────────── */

/**
 * Validates a product payload before create/update.
 * Returns { valid: boolean, errors: string[] }
 */
export const validateProduct = (product) => {
  const errors = [];

  if (!product.name?.trim()) errors.push("Product name is required.");
  if (!product.price || Number(product.price) <= 0)
    errors.push("Price must be greater than 0.");
  if (!product.description?.trim()) errors.push("Description is required.");
  if (!product.banner?.trim()) errors.push("Banner image is required.");

  const price = Number(product.price);
  const originalPrice = Number(product.originalPrice);
  if (originalPrice > 0 && originalPrice < price)
    errors.push("Original price cannot be less than current price.");

  const stock = Number(product.stock);
  if (isNaN(stock) || stock < 0) errors.push("Stock cannot be negative.");

  return { valid: errors.length === 0, errors };
};