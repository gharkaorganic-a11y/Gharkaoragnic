// product.model.js

export const PRODUCT_FIELDS = {
  name: "",
  slug: "",
  description: "",
  banner: "",
  images: [],
  price: 0,
  originalPrice: 0,
  stock: 0,

  sizes: [],
  colors: [],

  material: "",
  brand: "",
  categoryId: "",

  collectionTypes: [],
  tags: [],

  // 👇 new fields (now centralized)
  ingredients: "",
  shelfLife: "",

  isActive: true,
};

// Fields allowed to be written to Firestore
export const WRITABLE_FIELDS = new Set(Object.keys(PRODUCT_FIELDS));

// Default form initializer
export const createEmptyProduct = () => ({
  ...PRODUCT_FIELDS,
});