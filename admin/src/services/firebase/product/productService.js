/**
 * productService.js
 * Scalable, production-ready Firebase service for organic e-commerce products.
 *
 * Architecture Highlights:
 * - TTL In-Memory Cache: Reduces Firestore read costs by caching recent queries for 60 seconds.
 * - Soft Deletion: Products are marked `isDeleted: true` instead of hard deleted, preserving order history.
 * - Atomic Transactions: Reviews and stock updates use Firestore transactions to prevent race conditions.
 * - Batched Writes: Bulk operations are safely chunked into limits of 500 to respect Firestore constraints.
 * - Data Coercion: The sanitize() function ensures no bad data types (like strings instead of numbers) enter the DB.
 */

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
  runTransaction,
} from "firebase/firestore";

import { db } from "../../../config/firebase";
import {
  createEmptyProduct,
  WRITABLE_FIELDS,
} from "../../../modal/product.model";

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS & CONFIG
───────────────────────────────────────────────────────────────────────────── */
const COLLECTION = "products";
const PAGE_SIZE = 20;
const CACHE_TTL_MS = 60_000; // 1 minute (Adjust based on how realtime you need the UI)
const FIRESTORE_BATCH_LIMIT = 500; // Firestore hard limit for batched writes

/* ─────────────────────────────────────────────────────────────────────────────
   IN-MEMORY TTL CACHE
   Why? Prevents identical, rapid-fire queries from hitting Firestore multiple
   times, drastically reducing Google Cloud billing costs.
───────────────────────────────────────────────────────────────────────────── */
const cache = new Map();

const cacheGet = (key) => {
  const item = cache.get(key);
  if (!item) return null;
  // Invalidate if the time-to-live has expired
  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }
  return item.value;
};

const cacheSet = (key, value, ttl = CACHE_TTL_MS) =>
  cache.set(key, { value, expiresAt: Date.now() + ttl });

const cacheDelete = (key) => cache.delete(key);
const cacheClear = () => cache.clear();
const buildKey = (params) => JSON.stringify(params);

/* ─────────────────────────────────────────────────────────────────────────────
   UTILITY HELPERS
───────────────────────────────────────────────────────────────────────────── */

/** Sub-collection reference for reviews */
const reviewsRef = (productId) =>
  collection(db, COLLECTION, productId, "reviews");

/**
 * Splits a large array into smaller arrays to safely bypass Firestore limits.
 */
const chunkArray = (arr, size) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
};

/**
 * Maps a Firestore DocumentSnapshot into a clean UI-ready product object.
 * Safely falls back to defaults so the UI never crashes on undefined fields.
 */
const mapDoc = (snap) => {
  const d = snap.data();
  return {
    id: snap.id,

    // Strings
    name: d.name ?? "",
    slug: d.slug ?? "",
    description: d.description ?? "",
    shortDescription: d.shortDescription ?? "",
    banner: d.banner ?? "",
    material: d.material ?? "",
    brand: d.brand ?? "",
    categoryId: d.categoryId ?? "",
    ingredients: d.ingredients ?? "",
    shelfLife: d.shelfLife ?? "",
    benefits: d.benefits ?? "",
    
    // Arrays
    images: Array.isArray(d.images) ? d.images : [],
    sizes: Array.isArray(d.sizes) ? d.sizes : [],
    colors: Array.isArray(d.colors) ? d.colors : [],
    collectionTypes: Array.isArray(d.collectionTypes) ? d.collectionTypes : [],
    tags: Array.isArray(d.tags) ? d.tags : [],
    certifications: Array.isArray(d.certifications) ? d.certifications : [],
    faq: Array.isArray(d.faq) ? d.faq : [],

    // Numbers & Finance
    price: d.price ?? 0,
    originalPrice: d.originalPrice ?? 0,
    stock: d.stock ?? 0,

    // Analytics & Social Proof
    totalReviews: d.totalReviews ?? 0,
    ratingSum: d.ratingSum ?? 0,
    rating: d.totalReviews > 0 ? d.ratingSum / d.totalReviews : 0, // Dynamic derivation
    views: d.views ?? 0,
    purchases: d.purchases ?? 0,
    salesLast24h: d.salesLast24h ?? 0,

    // Flags
    isActive: !!d.isActive,
    isDeleted: !!d.isDeleted,

    // SEO
    metaTitle: d.metaTitle ?? "",
    metaDescription: d.metaDescription ?? "",
    canonicalUrl: d.canonicalUrl ?? "",
    ogImage: d.ogImage ?? "",

    // Timestamps
    createdAt: d.createdAt ?? null,
    updatedAt: d.updatedAt ?? null,
  };
};

/**
 * Data sanitizer. Strips out unexpected fields and coerces types.
 * Why? Prevents a UI bug from accidentally saving a string into a number field,
 * which would break Firestore queries later.
 */
const sanitize = (data) => {
  const clean = {};
  for (const key of WRITABLE_FIELDS) {
    if (data[key] !== undefined) clean[key] = data[key];
  }

  // Force Numeric Coercions
  if (clean.price !== undefined) clean.price = Number(clean.price) || 0;
  if (clean.originalPrice !== undefined) clean.originalPrice = Number(clean.originalPrice) || 0;
  if (clean.stock !== undefined) clean.stock = Number(clean.stock) || 0;

  // Force Array Coercions
  const arrFields = ["images", "sizes", "colors", "collectionTypes", "tags", "certifications", "faq"];
  for (const f of arrFields) {
    if (clean[f] !== undefined && !Array.isArray(clean[f])) clean[f] = [];
  }

  return clean;
};

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN SERVICE EXPORT
───────────────────────────────────────────────────────────────────────────── */
export const productService = {
  
  /* ──────────────────────────
     CREATE
  ────────────────────────── */
  async createProduct(productData) {
    try {
      const payload = {
        ...createEmptyProduct(),
        ...sanitize(productData),
        // Force server-side defaults
        totalReviews: 0,
        ratingSum: 0,
        views: 0,
        purchases: 0,
        salesLast24h: 0,
        isDeleted: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const ref = await addDoc(collection(db, COLLECTION), payload);
      cacheClear(); // Bust cache so lists update immediately

      return { id: ref.id, ...payload };
    } catch (err) {
      throw new Error(`createProduct failed: ${err.message}`);
    }
  },

  /* ──────────────────────────
     LIST (Paginated & Filtered)
  ────────────────────────── */
  async getProducts({
    lastDoc = null,
    collectionType = "all",
    status = "all",           // "all" | "active" | "inactive"
    categoryId = null,
    tag = null,
    pageSize = PAGE_SIZE,
    includeDeleted = false,   // Admins can pass true to audit deleted items
  } = {}) {
    const cacheKey = buildKey({ lastDoc: lastDoc?.id ?? null, collectionType, status, categoryId, tag, pageSize, includeDeleted });
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    const constraints = [];

    // Apply Filters safely
    if (!includeDeleted) constraints.push(where("isDeleted", "==", false));
    if (collectionType !== "all") constraints.push(where("collectionTypes", "array-contains", collectionType));
    if (status !== "all") constraints.push(where("isActive", "==", status === "active"));
    if (categoryId) constraints.push(where("categoryId", "==", categoryId));
    if (tag) constraints.push(where("tags", "array-contains", tag));

    // Order and Paginate
    constraints.push(orderBy("createdAt", "desc"));
    if (lastDoc) constraints.push(startAfter(lastDoc));
    constraints.push(limit(pageSize));

    try {
      const snap = await getDocs(query(collection(db, COLLECTION), ...constraints));
      const result = {
        products: snap.docs.map(mapDoc),
        lastDoc: snap.docs.at(-1) ?? null,
        hasMore: snap.docs.length === pageSize,
      };

      cacheSet(cacheKey, result);
      return result;
    } catch (err) {
      throw new Error(`getProducts failed: ${err.message}`);
    }
  },

  /* ──────────────────────────
     READ (Single Product)
  ────────────────────────── */
  async getProduct(id) {
    const key = `product_${id}`;
    const cached = cacheGet(key);
    if (cached) return cached;

    try {
      const snap = await getDoc(doc(db, COLLECTION, id));
      if (!snap.exists()) throw new Error("Product not found");

      const product = mapDoc(snap);
      cacheSet(key, product);
      return product;
    } catch (err) {
      throw new Error(`getProduct failed: ${err.message}`);
    }
  },

  async getProductBySlug(slug) {
    const key = `slug_${slug}`;
    const cached = cacheGet(key);
    if (cached) return cached;

    try {
      const snap = await getDocs(
        query(
          collection(db, COLLECTION),
          where("slug", "==", slug),
          where("isDeleted", "==", false),
          limit(1)
        )
      );
      if (snap.empty) throw new Error("Product not found");

      const product = mapDoc(snap.docs[0]);
      cacheSet(key, product);
      return product;
    } catch (err) {
      throw new Error(`getProductBySlug failed: ${err.message}`);
    }
  },

  /* ──────────────────────────
     UPDATE
  ────────────────────────── */
  async updateProduct(id, data) {
    try {
      const clean = sanitize(data);
      await updateDoc(doc(db, COLLECTION, id), {
        ...clean,
        updatedAt: serverTimestamp(),
      });

      // Bust specific item caches
      cacheDelete(`product_${id}`);
      if (data.slug) cacheDelete(`slug_${data.slug}`);
      cacheClear(); // Clear lists

      return true;
    } catch (err) {
      throw new Error(`updateProduct failed: ${err.message}`);
    }
  },

  /* ──────────────────────────
     SOFT DELETE (Recommended for E-Commerce)
     Hides product from storefront but keeps it for past order references.
  ────────────────────────── */
  async softDeleteProduct(id) {
    try {
      await updateDoc(doc(db, COLLECTION, id), {
        isDeleted: true,
        isActive: false, // Ensure it doesn't show in active queries
        updatedAt: serverTimestamp(),
      });

      cacheDelete(`product_${id}`);
      cacheClear();
      return true;
    } catch (err) {
      throw new Error(`softDeleteProduct failed: ${err.message}`);
    }
  },

  /* ──────────────────────────
     HARD DELETE (Use Sparingly)
     Permanently removes product and its nested reviews.
  ────────────────────────── */
  async deleteProduct(id) {
    try {
      const reviewSnap = await getDocs(reviewsRef(id));
      
      // Scalability safeguard: Chunk the deletes if reviews > 500
      const reviewChunks = chunkArray(reviewSnap.docs, FIRESTORE_BATCH_LIMIT - 1); // -1 to save room for the product doc
      
      for (let i = 0; i < reviewChunks.length; i++) {
        const batch = writeBatch(db);
        reviewChunks[i].forEach((d) => batch.delete(d.ref));
        
        // Append the product deletion to the final batch
        if (i === reviewChunks.length - 1) {
          batch.delete(doc(db, COLLECTION, id));
        }
        await batch.commit();
      }

      // If there were 0 reviews, the loop above doesn't run, so we delete it directly
      if (reviewSnap.empty) {
        await deleteDoc(doc(db, COLLECTION, id));
      }

      cacheDelete(`product_${id}`);
      cacheClear();
      return true;
    } catch (err) {
      throw new Error(`deleteProduct failed: ${err.message}`);
    }
  },

  /* ──────────────────────────
     STOCK & ANALYTICS
  ────────────────────────── */
  async updateProductStock(id, delta) {
    try {
      await updateDoc(doc(db, COLLECTION, id), {
        stock: increment(delta),
        updatedAt: serverTimestamp(),
      });
      cacheDelete(`product_${id}`);
      return true;
    } catch (err) {
      throw new Error(`updateProductStock failed: ${err.message}`);
    }
  },

  async incrementViews(id) {
    try {
      await updateDoc(doc(db, COLLECTION, id), { views: increment(1) });
      // Intentionally NOT busting cache here to save read costs, views don't need real-time UI sync
    } catch {
      // Non-critical — fail silently so it doesn't break the user journey
    }
  },

  /* ──────────────────────────
     REVIEWS: ADD (Customer & Admin Unified)
     Uses transactions to keep product's total rating/count perfectly in sync.
  ────────────────────────── */
  async addReview(productId, review) {
    try {
      // Intelligently detect if an Admin submitted this (they pass verified/date fields)
      const isAdminSubmission = review.verified !== undefined || review.date !== undefined;

      const reviewData = {
        name: (review.name || "Anonymous").trim(),
        rating: Math.min(5, Math.max(1, Number(review.rating) || 0)),
        comment: (review.comment || "").trim(),
        
        // Admin fields (saved if present, otherwise cleanly omitted)
        ...(review.title && { title: review.title.trim() }),
        ...(review.verified !== undefined && { verified: review.verified }),
        
        // Use custom date string if Admin provided it, otherwise rely on serverTimestamp
        date: review.date ? review.date : null, 
        createdAt: serverTimestamp(),
        
        // Admins bypass moderation. Customers must wait for manual approval.
        isApproved: isAdminSubmission ? true : false, 
      };

      await runTransaction(db, async (tx) => {
        const productRef = doc(db, COLLECTION, productId);
        const productSnap = await tx.get(productRef);

        if (!productSnap.exists()) throw new Error("Product not found");

        const reviewRef = doc(reviewsRef(productId));
        tx.set(reviewRef, reviewData);

        // Atomically bump the aggregated counts on the parent product
        tx.update(productRef, {
          totalReviews: increment(1),
          ratingSum: increment(reviewData.rating),
          updatedAt: serverTimestamp(),
        });
      });

      cacheDelete(`product_${productId}`);
      cacheClear();
      return true;
    } catch (err) {
      throw new Error(`addReview failed: ${err.message}`);
    }
  },

  
  /* ──────────────────────────
     REVIEWS: GET
  ────────────────────────── */
  async getProductReviews(productId, {
    pageSize = 10,
    lastDoc = null,
    approvedOnly = true,
  } = {}) {
    try {
      const constraints = [orderBy("createdAt", "desc"), limit(pageSize)];
      if (approvedOnly) constraints.unshift(where("isApproved", "==", true));
      if (lastDoc) constraints.push(startAfter(lastDoc));

      const snap = await getDocs(query(reviewsRef(productId), ...constraints));

      return {
        reviews: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
        lastDoc: snap.docs.at(-1) ?? null,
        hasMore: snap.docs.length === pageSize,
        totalCount: snap.docs.length // Added for UI counters
      };
    } catch (err) {
      throw new Error(`getProductReviews failed: ${err.message}`);
    }
  },

  /* ──────────────────────────
     REVIEWS: MODERATION
  ────────────────────────── */
  async approveReview(productId, reviewId) {
    try {
      await updateDoc(doc(db, COLLECTION, productId, "reviews", reviewId), {
        isApproved: true,
      });
      return true;
    } catch (err) {
      throw new Error(`approveReview failed: ${err.message}`);
    }
  },

  async deleteReview(productId, reviewId) {
    try {
      const reviewRef = doc(db, COLLECTION, productId, "reviews", reviewId);

      await runTransaction(db, async (tx) => {
        const reviewSnap = await tx.get(reviewRef);
        if (!reviewSnap.exists()) throw new Error("Review not found");

        const { rating } = reviewSnap.data();
        const productRef = doc(db, COLLECTION, productId);

        tx.delete(reviewRef);
        tx.update(productRef, {
          totalReviews: increment(-1),
          ratingSum: increment(-Number(rating || 0)),
          updatedAt: serverTimestamp(),
        });
      });

      cacheDelete(`product_${productId}`);
      return true;
    } catch (err) {
      throw new Error(`deleteReview failed: ${err.message}`);
    }
  },

  /* ──────────────────────────
     BULK OPERATIONS
     Safely chunked to avoid Firestore's 500-write limit.
  ────────────────────────── */
  async bulkSetActive(ids = [], isActive) {
    if (!ids.length) return true;

    try {
      const chunks = chunkArray(ids, FIRESTORE_BATCH_LIMIT);

      for (const chunk of chunks) {
        const batch = writeBatch(db);
        chunk.forEach((id) => {
          batch.update(doc(db, COLLECTION, id), {
            isActive,
            updatedAt: serverTimestamp(),
          });
        });
        await batch.commit();
      }

      ids.forEach((id) => cacheDelete(`product_${id}`));
      cacheClear();
      return true;
    } catch (err) {
      throw new Error(`bulkSetActive failed: ${err.message}`);
    }
  },

  /* ──────────────────────────
     CACHE UTILITIES
  ────────────────────────── */
  clearCache: cacheClear,
};