import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../../config/firebase";
import {
  createEmptyProduct,
  WRITABLE_FIELDS,
} from "../../../modal/product.model";

const PRODUCTS_COLLECTION = "products";
const PAGE_SIZE = 20;
const CACHE_TTL_MS = 60_000;

// ─────────────────────────────────────────────
// CACHE (simple TTL memory cache)
// ─────────────────────────────────────────────
const cache = new Map();

const cacheGet = (key) => {
  const item = cache.get(key);
  if (!item) return null;

  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }

  return item.value;
};

const cacheSet = (key, value, ttl = CACHE_TTL_MS) => {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttl,
  });
};

const cacheDelete = (key) => cache.delete(key);
const cacheClear = () => cache.clear();

const buildCacheKey = (params) => JSON.stringify(params);

// ─────────────────────────────────────────────
// SANITIZE UPDATE (prevents Firestore pollution)
// ─────────────────────────────────────────────
const sanitizeUpdate = (data) => {
  const clean = {};

  for (const key of WRITABLE_FIELDS) {
    if (data[key] !== undefined) clean[key] = data[key];
  }

  return {
    ...clean,
    price: Number(clean.price) || 0,
    originalPrice: Number(clean.originalPrice) || 0,
    stock: Number(clean.stock) || 0,

    images: Array.isArray(clean.images) ? clean.images : [],
    sizes: Array.isArray(clean.sizes) ? clean.sizes : [],
    collectionTypes: Array.isArray(clean.collectionTypes)
      ? clean.collectionTypes
      : [],
    tags: Array.isArray(clean.tags) ? clean.tags : [],
  };
};

// ─────────────────────────────────────────────
// MAP FIRESTORE DOC → PRODUCT OBJECT
// ─────────────────────────────────────────────
const mapDoc = (d) => {
  const data = d.data();

  return {
    id: d.id,
    name: data.name ?? "",
    slug: data.slug ?? "",
    description: data.description ?? "",
    banner: data.banner ?? "",
    images: Array.isArray(data.images) ? data.images : [],
    price: data.price ?? 0,
    originalPrice: data.originalPrice ?? 0,
    stock: data.stock ?? 0,
    sizes: Array.isArray(data.sizes) ? data.sizes : [],
    colors: Array.isArray(data.colors) ? data.colors : [],
    material: data.material ?? "",
    brand: data.brand ?? "",
    categoryId: data.categoryId ?? "",
    collectionTypes: Array.isArray(data.collectionTypes)
      ? data.collectionTypes
      : [],
    tags: Array.isArray(data.tags) ? data.tags : [],
    isActive: !!data.isActive,
    isDeleted: !!data.isDeleted,
    deletedAt: data.deletedAt ?? null,
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
};

// ─────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────
export const productService = {
  // ───────── CREATE ─────────
  async createProduct(productData) {
    try {
      const product = {
        ...createEmptyProduct(),
        ...productData,

        price: Number(productData.price) || 0,
        originalPrice: Number(productData.originalPrice) || 0,
        stock: Number(productData.stock) || 0,

        images: Array.isArray(productData.images)
          ? productData.images
          : [],
        sizes: Array.isArray(productData.sizes)
          ? productData.sizes
          : [],
        collectionTypes: Array.isArray(productData.collectionTypes)
          ? productData.collectionTypes
          : [],
        tags: Array.isArray(productData.tags)
          ? productData.tags
          : [],

        isDeleted: false,
        deletedAt: null,

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, PRODUCTS_COLLECTION),
        product
      );

      cacheClear();

      return { id: docRef.id, ...product };
    } catch (err) {
      throw new Error(`Create product failed: ${err.message}`);
    }
  },

  // ───────── LIST (PAGINATION) ─────────
  async getProducts({
    lastDoc = null,
    collectionType = "all",
    status = "all",
    pageSize = PAGE_SIZE,
  } = {}) {
    const cacheKey = buildCacheKey({
      lastDoc: lastDoc?.id || null,
      collectionType,
      status,
      pageSize,
    });

    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    try {
      const constraints = [];

     

      if (collectionType !== "all") {
        constraints.push(
          where("collectionTypes", "array-contains", collectionType)
        );
      }

      if (status !== "all") {
        constraints.push(
          where("isActive", "==", status === "active")
        );
      }

      constraints.push(orderBy("createdAt", "desc"));

      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      constraints.push(limit(pageSize));

      const snapshot = await getDocs(
        query(collection(db, PRODUCTS_COLLECTION), ...constraints)
      );

      const products = snapshot.docs.map(mapDoc);

      const result = {
        products,
        lastDoc:
          snapshot.docs.length > 0
            ? snapshot.docs[snapshot.docs.length - 1]
            : null,
        hasMore: snapshot.docs.length === pageSize,
      };

      cacheSet(cacheKey, result);

      return result;
    } catch (err) {
      throw new Error(`Fetch products failed: ${err.message}`);
    }
  },

  // ───────── SINGLE PRODUCT ─────────
  async getProduct(id) {
    const key = `product_${id}`;
    const cached = cacheGet(key);
    if (cached) return cached;

    const snap = await getDoc(doc(db, PRODUCTS_COLLECTION, id));

    if (!snap.exists()) {
      throw new Error("Product not found");
    }

    const product = mapDoc(snap);
    cacheSet(key, product);

    return product;
  },

  // ───────── UPDATE ─────────
  async updateProduct(id, data) {
    const clean = sanitizeUpdate(data);

    await updateDoc(doc(db, PRODUCTS_COLLECTION, id), {
      ...clean,
      updatedAt: serverTimestamp(),
    });

    cacheDelete(`product_${id}`);
    cacheClear();

    return true;
  },

 // ───────── HARD DELETE ─────────
async deleteProduct(id) {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));

    // clear cache after deletion
    cacheDelete(`product_${id}`);
    cacheClear();

    return true;
  } catch (err) {
    throw new Error(`Hard delete failed: ${err.message}`);
  }
},

  // ───────── RESTORE ─────────
  async restoreProduct(id) {
    await updateDoc(doc(db, PRODUCTS_COLLECTION, id), {
      isDeleted: false,
      isActive: true,
      deletedAt: null,
      updatedAt: serverTimestamp(),
    });

    cacheDelete(`product_${id}`);
    cacheClear();

    return true;
  },

  async deleteProductsBulk(ids = []) {
  const batch = writeBatch(db);

  ids.forEach((id) => {
    batch.delete(doc(db, "products", id));
  });

  await batch.commit();

  cacheClear();
},
  // ───────── STOCK UPDATE ─────────
  async updateProductStock(id, delta) {
    await updateDoc(doc(db, PRODUCTS_COLLECTION, id), {
      stock: increment(delta),
      updatedAt: serverTimestamp(),
    });

    cacheDelete(`product_${id}`);
    cacheClear();

    return true;
  },

  // ───────── SEARCH (PREFIX ONLY) ─────────
  async searchProducts(term, { pageSize = PAGE_SIZE } = {}) {
    if (!term?.trim()) return [];

    const t = term.trim();
    const cacheKey = `search_${t}_${pageSize}`;

    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("isDeleted", "==", false),
      where("name", ">=", t),
      where("name", "<", t + "\uf8ff"),
      orderBy("name"),
      limit(pageSize)
    );

    const snap = await getDocs(q);
    const result = snap.docs.map(mapDoc);

    cacheSet(cacheKey, result, 30000);

    return result;
  },

  // ───────── CLEAR CACHE ─────────
  clearCache() {
    cacheClear();
  },
};