/**
 * productService.js
 * Production-ready Firestore product service with LRU cache, TTL, and request coalescing.
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
} from "firebase/firestore";
import { db } from "../../../../config/firebaseDB";

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────────── */

const COL = "products";
const DEFAULT_PAGE_SIZE = 20;
const MAX_CACHE_ENTRIES = 200;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const FIRESTORE_IN_LIMIT = 10; // Firestore "in" / "__name__ in" clause max

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

// Bidirectional slug ↔ id lookup (these are identity maps, no TTL needed)
const slugToId = new Map();
const idToSlug = new Map();

// In-flight request coalescing: key → Promise
const inFlight = new Map();

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */

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
  isActive: data.isActive ?? true,
  createdAt: data.createdAt ?? null,
  tags: Array.isArray(data.tags) ? data.tags : [],
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

    if (activeOnly) {
      constraints.push(where("isActive", "==", true));
    }

    if (collectionType) {
      console.log("[ProductService] Filtering by collectionType:", collectionType);
      constraints.push(where("collectionTypes", "array-contains", collectionType));
    } else {
      console.log("[ProductService] Fetching ALL products - no collectionTypes filter");
    }

    constraints.push(orderBy("createdAt", "desc"));
    if (lastDoc) constraints.push(startAfter(lastDoc));
    constraints.push(limit(pageSize));

    const snapshot = await getDocs(query(collection(db, COL),...constraints));
    console.log("[ProductService] Found", snapshot.docs.length, "docs");

    const products = snapshot.docs.map((d) => {
      const p = normalize(d.id, d.data());
      primeRefs(p);
      return p;
    });

    return {
      products,
      lastDoc: snapshot.docs.at(-1)?? null,
      hasMore: snapshot.docs.length === pageSize,
    };
  } catch (err) {
    console.error("[ProductService] Error:", err);
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
          query(
            collection(db, COL),
            where("isActive", "==", true),
            orderBy("createdAt", "desc")
          )
        );

        const products = snapshot.docs.map((d) => {
          const p = normalize(d.id, d.data());
          primeRefs(p);
          return p;
        });

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
            primeRefs(p);
            byId.set(p.id, p);
          }
        }
      }

      // Return in original input order, skipping not-found IDs
      return ids.map(String).reduce((acc, id) => {
        const p = byId.get(id);
        if (p) acc.push(p);
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
  async getProductsByCollections(types = [], maxResults = 8) {
    if (!types.length) return [];

    try {
      const normalizedTypes = [...new Set(types.map((t) => t.toLowerCase()))];
      const cacheKey = `collection_${normalizedTypes.join(",")}__${maxResults}`;

      if (cache.has(cacheKey)) return cache.get(cacheKey);

      return dedupe(cacheKey, async () => {
        const snapshot = await getDocs(
          query(
            collection(db, COL),
            where("isActive", "==", true),
            where("collectionTypes", "array-contains-any", normalizedTypes.slice(0, FIRESTORE_IN_LIMIT)),
            orderBy("createdAt", "desc"),
            limit(maxResults)
          )
        );

        const products = snapshot.docs.map((d) => {
          const p = normalize(d.id, d.data());
          primeRefs(p);
          return p;
        });

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
          query(collection(db, COL), where("slug", "==", slug), limit(1))
        );

        if (snap.empty) return null;

        const product = normalize(snap.docs[0].id, snap.docs[0].data());
        primeRefs(product);
        return product;
      } catch (err) {
        throw new ProductServiceError(`Failed to fetch product by slug: ${slug}`, err);
      }
    });
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