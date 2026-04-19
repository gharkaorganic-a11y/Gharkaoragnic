import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../../config/firebaseDB";

/* ─────────────────────────────
   CACHE
───────────────────────────── */
const memoryCache = new Map();
const promiseCache = new Map();
const CACHE_TTL = 1000 * 60 * 10; // 10 min

const loadPersistentCache = () => {
  try {
    return JSON.parse(localStorage.getItem("homepageCache") || "{}");
  } catch {
    return {};
  }
};

// BUG FIX: wrap setItem in try/catch — crashes in incognito/private mode
const savePersistentCache = (key, data) => {
  try {
    const cache = loadPersistentCache();
    cache[key] = { data, timestamp: Date.now() };
    localStorage.setItem("homepageCache", JSON.stringify(cache));
  } catch {
    // silent fail — memory cache still works
  }
};

const isMemoryFresh = (key, now) => {
  const cached = memoryCache.get(key);
  return cached && now - cached.timestamp < CACHE_TTL;
};

const isPersistentFresh = (persistent, key, now) => {
  return persistent[key] && now - persistent[key].timestamp < CACHE_TTL;
};

/* ─────────────────────────────
   SERVICE
───────────────────────────── */
export const homepageService = {

  /* ───────── PRODUCTS BY COLLECTION ───────── */
  // Requires products in Firestore to have:
  //   collectionTypes: ["new", "pickle", "honey", ...]
  //   isActive: true
  async getProductsByCollection(type, size = 8) {
    const key = `products-${type}-${size}`;
    const now = Date.now();

    if (isMemoryFresh(key, now)) return memoryCache.get(key).data;

    const persistent = loadPersistentCache();
    if (isPersistentFresh(persistent, key, now)) {
      memoryCache.set(key, persistent[key]);
      return persistent[key].data;
    }

    // BUG FIX: dedupe — if a fetch for this key is already in-flight, return it
    if (promiseCache.has(key)) return promiseCache.get(key);

    const promise = (async () => {
      try {
        const cleanType = type.toLowerCase().trim();

        const qRef = query(
          collection(db, "products"),
          where("isActive", "==", true),
          where("collectionTypes", "array-contains", cleanType),
          orderBy("createdAt", "desc"),
          limit(size),
        );

        const snap = await getDocs(qRef);
        const products = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        memoryCache.set(key, { data: products, timestamp: now });
        savePersistentCache(key, products);

        return products;
      } catch (err) {
        console.error(`[homepageService] getProductsByCollection(${type}):`, err.message);
        // serve stale memory cache on error rather than crashing
        return memoryCache.get(key)?.data ?? [];
      } finally {
        promiseCache.delete(key);
      }
    })();

    promiseCache.set(key, promise);
    return promise;
  },

  /* ───────── CATEGORIES ───────── */
  async getHomepageCategories() {
    const key = "categories";
    const now = Date.now();

    if (isMemoryFresh(key, now)) return memoryCache.get(key).data;

    const persistent = loadPersistentCache();
    if (isPersistentFresh(persistent, key, now)) {
      memoryCache.set(key, persistent[key]);
      return persistent[key].data;
    }

    // BUG FIX: was missing promiseCache check — could double-read Firestore
    if (promiseCache.has(key)) return promiseCache.get(key);

    const promise = (async () => {
      try {
        const snap = await getDocs(collection(db, "categories"));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        memoryCache.set(key, { data, timestamp: now });
        savePersistentCache(key, data);

        return data;
      } catch (err) {
        console.error("[homepageService] getHomepageCategories:", err.message);
        return memoryCache.get(key)?.data ?? [];
      } finally {
        promiseCache.delete(key);
      }
    })();

    promiseCache.set(key, promise);
    return promise;
  },

  /* ───────── TESTIMONIALS ───────── */
  async getTestimonials(size = 8) {
    const key = `testimonials-${size}`;
    const now = Date.now();

    if (isMemoryFresh(key, now)) return memoryCache.get(key).data;

    const persistent = loadPersistentCache();
    if (isPersistentFresh(persistent, key, now)) {
      memoryCache.set(key, persistent[key]);
      return persistent[key].data;
    }

    if (promiseCache.has(key)) return promiseCache.get(key);

    const promise = (async () => {
      try {
        const qRef = query(
          collection(db, "testimonials"),
          where("isActive", "==", true),
          orderBy("createdAt", "desc"),
          limit(size),
        );

        const snap = await getDocs(qRef);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        memoryCache.set(key, { data, timestamp: now });
        savePersistentCache(key, data);

        return data;
      } catch (err) {
        console.error("[homepageService] getTestimonials:", err.message);
        return memoryCache.get(key)?.data ?? [];
      } finally {
        promiseCache.delete(key);
      }
    })();

    promiseCache.set(key, promise);
    return promise;
  },

  /* ───────── COLLECTIONS ───────── */
  async getCollections(size = 8) {
    const key = `collections-${size}`;
    const now = Date.now();

    if (isMemoryFresh(key, now)) return memoryCache.get(key).data;

    const persistent = loadPersistentCache();
    if (isPersistentFresh(persistent, key, now)) {
      memoryCache.set(key, persistent[key]);
      return persistent[key].data;
    }

    if (promiseCache.has(key)) return promiseCache.get(key);

    const promise = (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "itemsCollection"), limit(size)),
        );
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        memoryCache.set(key, { data, timestamp: now });
        savePersistentCache(key, data);

        return data;
      } catch (err) {
        console.error("[homepageService] getCollections:", err.message);
        return memoryCache.get(key)?.data ?? [];
      } finally {
        promiseCache.delete(key);
      }
    })();

    promiseCache.set(key, promise);
    return promise;
  },

  /* ───────── CLEAR CACHE ───────── */
  clearCache() {
    memoryCache.clear();
    promiseCache.clear();
    try {
      localStorage.removeItem("homepageCache");
    } catch {
      // silent
    }
  },
};