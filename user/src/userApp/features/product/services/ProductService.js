/**
 * productService.js
 * Production-ready Firestore product service with LRU cache, TTL, and request coalescing.
 *
 * Architecture Highlights:
 * - LRU Cache + TTL: 200-entry cap, 5-minute TTL, auto-eviction on access.
 * - Request Coalescing: Identical in-flight requests share a single Promise.
 * - Slug ↔ ID Bidirectional Map: Avoids redundant Firestore queries for slug lookups.
 * - Typed Errors: ProductNotFoundError / ProductServiceError for precise catch handling.
 * - Chunked Batch Fetching: getProductsByIds respects Firestore's 10-item "in" clause limit.
 * - reviewsRef helper: Shared sub-collection reference used by getProductReviews.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  runTransaction,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { auth, db } from "../../../../config/firebaseDB";

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────────── */

const COL = "storeProducts";
const REVIEWS_COL = "reviews";
const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_REVIEW_PAGE_SIZE = 5;
const MAX_CACHE_ENTRIES = 200;
const CACHE_TTL_MS = 5 * 60 * 1000;   // 5 minutes
const FIRESTORE_IN_LIMIT = 10;          // Firestore "in" / "__name__ in" clause max

/* ─────────────────────────────────────────────────────────────────────────────
   TYPED ERRORS
───────────────────────────────────────────────────────────────────────────── */

export class ProductNotFoundError extends Error {
  constructor(identifier) {
    super(`Product not found: ${identifier}`);
    this.name = "ProductNotFoundError";
    this.identifier = identifier;
  }
}

export class ProductServiceError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "ProductServiceError";
    this.cause = cause;
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   LRU CACHE WITH TTL
   A lightweight Map-based LRU. Each entry stores { value, expiresAt }.
   On get: evict if expired. On set: evict LRU entry when over capacity.
───────────────────────────────────────────────────────────────────────────── */

class LRUCache {
  #map = new Map();
  #maxSize;
  #ttlMs;

  constructor(maxSize = MAX_CACHE_ENTRIES, ttlMs = CACHE_TTL_MS) {
    this.#maxSize = maxSize;
    this.#ttlMs = ttlMs;
  }

  has(key) {
    const entry = this.#map.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.#map.delete(key);
      return false;
    }
    return true;
  }

  get(key) {
    const entry = this.#map.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.#map.delete(key);
      return undefined;
    }
    // Refresh position (LRU touch)
    this.#map.delete(key);
    this.#map.set(key, entry);
    return entry.value;
  }

  set(key, value) {
    // Evict existing key first to re-insert at end (most-recent position)
    if (this.#map.has(key)) this.#map.delete(key);

    // Evict LRU entry if at capacity
    if (this.#map.size >= this.#maxSize) {
      const lruKey = this.#map.keys().next().value;
      this.#map.delete(lruKey);
    }

    this.#map.set(key, { value, expiresAt: Date.now() + this.#ttlMs });
  }

  delete(key) {
    this.#map.delete(key);
  }

  /** Delete all keys matching a predicate. */
  deleteWhere(predicate) {
    for (const key of this.#map.keys()) {
      if (predicate(key)) this.#map.delete(key);
    }
  }

  clear() {
    this.#map.clear();
  }

  get size() {
    return this.#map.size;
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   MODULE-LEVEL STATE
───────────────────────────────────────────────────────────────────────────── */

const cache = new LRUCache();

// Bidirectional slug ↔ id lookup (identity maps, no TTL needed)
const slugToId = new Map();
const idToSlug = new Map();

// In-flight request coalescing: key → Promise
const inFlight = new Map();

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */

/**
 * Sub-collection reference for a product's reviews.
 * FIX: This was missing from the original user service, causing a ReferenceError
 * when getProductReviews was called.
 */
const reviewsRef = (productId) =>
  collection(db, COL, productId, REVIEWS_COL);

/**
 * Wrap a single async fetch with in-flight deduplication.
 * If an identical request is already pending, return the same Promise.
 */
const dedupe = (key, fetchFn) => {
  if (inFlight.has(key)) return inFlight.get(key);
  const promise = fetchFn().finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
};

/**
 * Prime both slug↔id maps and populate the cache after a successful fetch.
 */
const primeRefs = (product) => {
  if (!product?.id) return;
  if (product.slug) {
    slugToId.set(product.slug, product.id);
    idToSlug.set(product.id, product.slug);
    cache.set(`slug_${product.slug}`, product);
  }
  cache.set(`product_${product.id}`, product);
};

/**
 * Normalize a raw Firestore document into a clean product shape.
 * All fields have safe defaults — consumers never need to guard for undefined.
 */
const normalize = (id, data) => ({
  id: String(id),
  name: data.name ?? "",
  slug: data.slug ?? "",
  description: data.description ?? "",
  banner: data.banner ?? "",
  images: Array.isArray(data.images) ? data.images : [],
  price: Number(data.price ?? 0),
  originalPrice: Number(data.originalPrice ?? data.price ?? 0),
  stock: Number(data.stock ?? 0),
  sizes: Array.isArray(data.sizes) ? data.sizes : [],
  collectionTypes: Array.isArray(data.collectionTypes) ? data.collectionTypes : [],
  isActive: data.isDeleted !== true && (data.isActive ?? true),
  createdAt: data.createdAt ?? null,
  totalReviews: Number(data.totalReviews ?? 0),
  ratingSum: Number(data.ratingSum ?? 0),
  rating:
    Number(data.totalReviews ?? 0) > 0
      ? Number(data.ratingSum ?? 0) / Number(data.totalReviews)
      : 0,

  tags: Array.isArray(data.tags) ? data.tags : [],
});

/**
 * Normalize a raw Firestore review document into a clean shape.
 */
const normalizeReview = (id, data) => ({
  id: String(id),
  name: data.name ?? "Anonymous",
  rating: Number(data.rating ?? 0),
  comment: data.comment ?? "",
  title: data.title ?? "",
  verified: data.verified ?? false,
  isApproved: data.isApproved ?? false,
  date: data.date ?? null,
  createdAt: data.createdAt ?? null,
});

/**
 * Split an array into chunks of at most `size` elements.
 */
const chunk = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
};

/* ─────────────────────────────────────────────────────────────────────────────
   SERVICE
───────────────────────────────────────────────────────────────────────────── */

export const productService = {

  /* ───────────────────────────────────────────────────────────────────────
     getProducts — cursor-paginated list, optionally filtered by collection type.
     Returns { products, lastDoc, hasMore }.
  ─────────────────────────────────────────────────────────────────────── */
  async getProducts({
    lastDoc = null,
    collectionType = null,
    pageSize = DEFAULT_PAGE_SIZE,
    activeOnly = true,
  } = {}) {
    try {
      const constraints = [];

      if (collectionType) {
        constraints.push(where("collectionTypes", "array-contains", collectionType));
      }

      if (lastDoc) constraints.push(startAfter(lastDoc));
      constraints.push(limit(pageSize));

      const snapshot = await getDocs(query(collection(db, COL), ...constraints));

      const products = snapshot.docs
        .map((d) => normalize(d.id, d.data()))
        .filter((product) => !activeOnly || product.isActive)
        .sort((a, b) => {
          const toMillis = (value) =>
            value?.toMillis?.() ??
            (typeof value?.seconds === "number" ? value.seconds * 1000 : 0);
          return toMillis(b.createdAt) - toMillis(a.createdAt);
        });
      products.forEach(primeRefs);

      return {
        products,
        lastDoc: snapshot.docs.at(-1) ?? null,
        hasMore: snapshot.docs.length === pageSize,
      };
    } catch (err) {
      throw new ProductServiceError("Failed to fetch products page", err);
    }
  },

  /* ───────────────────────────────────────────────────────────────────────
     getAllProducts — cached full list of active products (use sparingly).
  ─────────────────────────────────────────────────────────────────────── */
  async getAllProducts() {
    const cacheKey = "all_products";
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    return dedupe(cacheKey, async () => {
      try {
        const snapshot = await getDocs(
          collection(db, COL)
        );

        const products = snapshot.docs
          .map((d) => normalize(d.id, d.data()))
          .filter((product) => product.isActive)
          .sort((a, b) => {
            const toMillis = (value) =>
              value?.toMillis?.() ??
              (typeof value?.seconds === "number" ? value.seconds * 1000 : 0);
            return toMillis(b.createdAt) - toMillis(a.createdAt);
          });
        products.forEach(primeRefs);

        cache.set(cacheKey, products);
        return products;
      } catch (err) {
        throw new ProductServiceError("Failed to fetch all products", err);
      }
    });
  },

  /* ───────────────────────────────────────────────────────────────────────
     getProductById — fetch a single product by Firestore document ID.
     Returns null if not found (does NOT throw ProductNotFoundError).
  ─────────────────────────────────────────────────────────────────────── */
  async getProductById(id) {
    if (!id) return null;
    const safeId = String(id);
    const cacheKey = `product_${safeId}`;

    if (cache.has(cacheKey)) return cache.get(cacheKey);

    return dedupe(cacheKey, async () => {
      try {
        const snapshot = await getDoc(doc(db, COL, safeId));
        if (!snapshot.exists()) return null;

        const product = normalize(snapshot.id, snapshot.data());
        if (!product.isActive) return null;
        primeRefs(product);
        return product;
      } catch (err) {
        throw new ProductServiceError(`Failed to fetch product by id: ${safeId}`, err);
      }
    });
  },

  /* ───────────────────────────────────────────────────────────────────────
     getProductsByIds — batch-fetch multiple products.
     Hits cache first; fetches missing IDs in parallel Firestore chunks.
     Returns results in the same order as the input `ids` array.
  ─────────────────────────────────────────────────────────────────────── */
  async getProductsByIds(ids = []) {
    if (!ids.length) return [];

    try {
      const unique = [...new Set(ids.map(String))];
      const byId = new Map();

      // Populate from cache
      const missing = [];
      for (const id of unique) {
        const cached = cache.get(`product_${id}`);
        if (cached) byId.set(id, cached);
        else missing.push(id);
      }

      // Fetch missing in Firestore-safe chunks
      if (missing.length) {
        const snapshots = await Promise.all(
          chunk(missing, FIRESTORE_IN_LIMIT).map((c) =>
            getDocs(query(collection(db, COL), where("__name__", "in", c)))
          )
        );

        for (const snap of snapshots) {
          for (const d of snap.docs) {
            const p = normalize(d.id, d.data());
            if (!p.isActive) continue;
            primeRefs(p);
            byId.set(p.id, p);
          }
        }
      }

      // Return in original input order, skipping not-found IDs
      return ids.map(String).reduce((acc, id) => {
        const p = byId.get(id);
        if (p?.isActive) acc.push(p);
        return acc;
      }, []);
    } catch (err) {
      throw new ProductServiceError("Failed to fetch products by ids", err);
    }
  },

  /* ───────────────────────────────────────────────────────────────────────
     getProductsByCollections — fetch active products matching any of the
     given collection type strings (array-contains-any).
  ─────────────────────────────────────────────────────────────────────── */
  async getProductsByCollections(types = [], options = {}) {
    const maxResults = options.limit || 8;

    if (!types.length) return [];

    try {
      const normalizedTypes = [...new Set(types.map((t) => t.toLowerCase()))];
      const cacheKey = `collection_${normalizedTypes.join(",")}__${maxResults}`;

      if (cache.has(cacheKey)) return cache.get(cacheKey);

      return dedupe(cacheKey, async () => {
        const snapshot = await getDocs(
          query(
            collection(db, COL),
            where("collectionTypes", "array-contains-any", normalizedTypes.slice(0, FIRESTORE_IN_LIMIT)),
          )
        );

        const products = snapshot.docs
          .map((d) => normalize(d.id, d.data()))
          .filter((product) => product.isActive)
          .sort((a, b) => {
            const toMillis = (value) =>
              value?.toMillis?.() ??
              (typeof value?.seconds === "number" ? value.seconds * 1000 : 0);
            return toMillis(b.createdAt) - toMillis(a.createdAt);
          })
          .slice(0, maxResults);
        products.forEach(primeRefs);

        cache.set(cacheKey, products);
        return products;
      });
    } catch (err) {
      throw new ProductServiceError("Failed to fetch products by collections", err);
    }
  },

  /* ───────────────────────────────────────────────────────────────────────
     getProductBySlug — fetch a single product by its URL slug.
     Returns null if not found.
  ─────────────────────────────────────────────────────────────────────── */
  async getProductBySlug(slug) {
    if (!slug) return null;

    const slugCacheKey = `slug_${slug}`;
    if (cache.has(slugCacheKey)) return cache.get(slugCacheKey);

    // Try resolving through slug→id map without a new network call
    const knownId = slugToId.get(slug);
    if (knownId) {
      const cached = cache.get(`product_${knownId}`);
      if (cached) return cached;
    }

    return dedupe(slugCacheKey, async () => {
      try {
        const snap = await getDocs(
          query(
            collection(db, COL),
            where("slug", "==", slug),
            limit(1),
          )
        );

        if (snap.empty) return null;

        const product = normalize(snap.docs[0].id, snap.docs[0].data());
        if (!product.isActive) return null;
        primeRefs(product);
        return product;
      } catch (err) {
        throw new ProductServiceError(`Failed to fetch product by slug: ${slug}`, err);
      }
    });
  },

  /* ───────────────────────────────────────────────────────────────────────
     getProductReviews — paginated reviews sub-collection fetch.
     
     FIX: Added missing `reviewsRef` helper above (was causing ReferenceError).
     FIX: Moved `where` before `orderBy` — Firestore requires filter clauses
          first, then sort, then pagination. Wrong order causes index errors.
     FIX: Added normalizeReview() for consistent, safe review shape.
     NOTE: Requires a composite Firestore index on reviews:
           { isApproved: ASC, createdAt: DESC }
           Firebase will print a direct creation link in the console on first run.

     Returns { reviews, lastDoc, hasMore }.
  ─────────────────────────────────────────────────────────────────────── */
  async getProductReviews(productId, {
    pageSize = DEFAULT_REVIEW_PAGE_SIZE,
    lastDoc = null,
    approvedOnly = true,
  } = {}) {
    if (!productId) return { reviews: [], lastDoc: null, hasMore: false };

    try {
      const constraints = [];

      // WHERE must come before ORDER BY — Firestore index requirement
      if (approvedOnly) {
        constraints.push(where("isApproved", "==", true));
      }

      constraints.push(orderBy("createdAt", "desc"));
      constraints.push(limit(pageSize));

      // startAfter must be last
      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      const snap = await getDocs(
        query(reviewsRef(productId), ...constraints)
      );

      return {
        reviews: snap.docs.map((d) => normalizeReview(d.id, d.data())),
        lastDoc: snap.docs.at(-1) ?? null,
        hasMore: snap.docs.length === pageSize,
      };
    } catch {
      // Fallback query if composite index is pending
      try {
        const fallbackSnap = await getDocs(
          query(reviewsRef(productId), limit(pageSize))
        );
        const docs = fallbackSnap.docs
          .map((d) => normalizeReview(d.id, d.data()))
          .filter((r) => !approvedOnly || r.isApproved !== false);
        return {
          reviews: docs,
          lastDoc: fallbackSnap.docs.at(-1) ?? null,
          hasMore: false,
        };
      } catch {
        return { reviews: [], lastDoc: null, hasMore: false };
      }
    }
  },

  /* ───────────────────────────────────────────────────────────────────────
     addReview — post a genuine customer review to storeProducts/{id}/reviews.
  ─────────────────────────────────────────────────────────────────────── */
  async addReview(productId, review) {
    if (!productId) throw new Error("Product ID is required");
    let user = auth.currentUser;
    if (!user) {
      try {
        const { signInAnonymously } = await import("firebase/auth");
        const cred = await signInAnonymously(auth);
        user = cred.user;
      } catch (e) {
        // Continue with guest fallback identifier
      }
    }
    const userId = user?.uid || `guest-${Date.now()}`;

    const cleanRating = Math.min(5, Math.max(1, Number(review.rating) || 5));
    const newReview = {
      userId,
      name: (review.name || "Happy Customer").trim(),
      rating: cleanRating,
      title: (review.title || "").trim(),
      comment: (review.comment || "").trim(),
      verified: false,
      isApproved: true,
      createdAt: serverTimestamp(),
      date: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };

    try {
      const productRef = doc(db, COL, productId);
      const reviewRef = doc(reviewsRef(productId));

      await runTransaction(db, async (transaction) => {
        const productSnapshot = await transaction.get(productRef);
        if (!productSnapshot.exists()) {
          throw new ProductNotFoundError(productId);
        }

        transaction.set(reviewRef, newReview);
        transaction.update(productRef, {
          totalReviews: increment(1),
          ratingSum: increment(cleanRating),
          lastReviewId: reviewRef.id,
          updatedAt: serverTimestamp(),
        });
      });

      cache.clear();
      slugToId.clear();
      idToSlug.clear();
      return { id: reviewRef.id, ...newReview };
    } catch (err) {
      console.error("[productService] addReview error:", err);
      throw new ProductServiceError(
        `Failed to add review for product: ${productId}`,
        err
      );
    }
  },

  /* ───────────────────────────────────────────────────────────────────────
     searchProducts — client-side full-text search over a pre-fetched list.
     Searches name, description, and tags.
  ─────────────────────────────────────────────────────────────────────── */
  searchProducts(term, allProducts = []) {
    if (!term?.trim()) return [];
    const lower = term.toLowerCase();

    return allProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(lower) ||
        p.description?.toLowerCase().includes(lower) ||
        p.tags?.some((t) => t.toLowerCase().includes(lower))
    );
  },

  /* ───────────────────────────────────────────────────────────────────────
     bustCache — invalidate cache entries for a specific product and/or
     all collection/list queries. Call this after any write operation.
  ─────────────────────────────────────────────────────────────────────── */
  bustCache({ id, slug } = {}) {
    if (id) {
      cache.delete(`product_${id}`);
      const s = idToSlug.get(String(id));
      if (s) {
        cache.delete(`slug_${s}`);
        slugToId.delete(s);
        idToSlug.delete(String(id));
      }
    }

    if (slug) {
      cache.delete(`slug_${slug}`);
      const resolvedId = slugToId.get(slug);
      if (resolvedId) {
        cache.delete(`product_${resolvedId}`);
        idToSlug.delete(resolvedId);
      }
      slugToId.delete(slug);
    }

    // Always clear list/collection caches on any write
    cache.delete("all_products");
    cache.deleteWhere(
      (key) => key.startsWith("collection_") || key.startsWith("{")
    );
  },

  /* ───────────────────────────────────────────────────────────────────────
     clearCache — nuke everything. Useful for logout / user switch.
  ─────────────────────────────────────────────────────────────────────── */
  clearCache() {
    cache.clear();
    slugToId.clear();
    idToSlug.clear();
  },
};