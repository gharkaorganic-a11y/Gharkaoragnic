/**
 * productCacheService.js
 * High-performance, zero-waste Firestore product cache.
 * Protects Firebase billing by ensuring at most ONE read per hour/session across the app.
 * All subsequent searches, keystrokes, and filters run 100% in JavaScript memory (0 cost).
 */

import { productService } from "./ProductService";

const STORAGE_KEY = "gharka_cached_store_products_v2";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour TTL (prevents excessive Firestore reads)

let memoryCache = null;
let inFlightPromise = null;

export const getCachedProductsFromStorage = () => {
  if (memoryCache && Array.isArray(memoryCache) && memoryCache.length > 0) {
    return memoryCache;
  }

  try {
    const raw =
      sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (
      parsed &&
      Date.now() - (parsed.timestamp || 0) < CACHE_TTL_MS &&
      Array.isArray(parsed.products) &&
      parsed.products.length > 0
    ) {
      memoryCache = parsed.products;
      return memoryCache;
    }
  } catch (err) {
    console.warn("Storage cache read failed:", err);
  }
  return null;
};

export const saveProductsToStorage = (products) => {
  if (!Array.isArray(products) || products.length === 0) return;
  memoryCache = products;
  try {
    const payload = JSON.stringify({
      timestamp: Date.now(),
      products,
    });
    sessionStorage.setItem(STORAGE_KEY, payload);
    localStorage.setItem(STORAGE_KEY, payload);
  } catch (err) {
    // Quota exceeded or private browsing mode
  }
};

/**
 * Fetch latest products with strict single-read caching.
 * Will only touch Firestore if there is no fresh local cache!
 */
export const getLatestProductsCached = async () => {
  // 1. Return cached instantly if available (0 Firebase reads)
  const cached = getCachedProductsFromStorage();
  if (cached) {
    return cached;
  }

  // 2. Prevent duplicate in-flight requests
  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      // 3. Fetch from Firestore once
      const rawProducts = await productService.getAllProducts();
      if (Array.isArray(rawProducts) && rawProducts.length > 0) {
        saveProductsToStorage(rawProducts);
        return rawProducts;
      }
    } catch (error) {
      console.warn("Firestore fetch failed, checking stale cache:", error);
      // If network fails, try stale cache before giving up
      try {
        const raw =
          sessionStorage.getItem(STORAGE_KEY) ||
          localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.products)) return parsed.products;
        }
      } catch (e) {
        // ignore
      }
    } finally {
      inFlightPromise = null;
    }
    return memoryCache || [];
  })();

  return inFlightPromise;
};

