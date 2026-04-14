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
   CACHE SYSTEM
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

const savePersistentCache = (key, data) => {
  const cache = loadPersistentCache();
  cache[key] = { data, timestamp: Date.now() };
  localStorage.setItem("homepageCache", JSON.stringify(cache));
};

/* ─────────────────────────────
   SERVICE
───────────────────────────── */
export const homepageService = {

  /* ───────── PRODUCTS BY COLLECTION ───────── */
  async getProductsByCollection(type, size = 8) {
    const key = `${type}-${size}`;
    const now = Date.now();

    /* memory cache */
    if (memoryCache.has(key)) {
      const cached = memoryCache.get(key);
      if (now - cached.timestamp < CACHE_TTL) return cached.data;
    }

    /* persistent cache */
    const persistent = loadPersistentCache();
    if (persistent[key] && now - persistent[key].timestamp < CACHE_TTL) {
      memoryCache.set(key, persistent[key]);
      return persistent[key].data;
    }

    /* dedupe */
    if (promiseCache.has(key)) return promiseCache.get(key);

    const promise = (async () => {
      try {
        const cleanType = type.toLowerCase().trim();

        const qRef = query(
          collection(db, "products"),
          where("isActive", "==", true),
          where("collectionTypes", "array-contains", cleanType),
          orderBy("createdAt", "desc"),
          limit(size)
        );

        const snap = await getDocs(qRef);

        const products = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        const cacheEntry = { data: products, timestamp: now };

        memoryCache.set(key, cacheEntry);
        savePersistentCache(key, products);

        return products;
      } catch (err) {
        console.error(`[homepageService] ${type} error:`, err.message);
        return memoryCache.get(key)?.data || [];
      } finally {
        promiseCache.delete(key);
      }
    })();

    promiseCache.set(key, promise);
    return promise;
  },

  /* ───────── CATEGORIES ───────── */
  async getHomepageCategories(size = 8) {
    const key = "categories";
    const now = Date.now();

    if (memoryCache.has(key)) {
      const cached = memoryCache.get(key);
      if (now - cached.timestamp < CACHE_TTL) return cached.data;
    }

    const promise = (async () => {
      try {
        const snap = await getDocs(collection(db, "categories"));

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        memoryCache.set(key, { data, timestamp: now });
        savePersistentCache(key, data);

        return data;
      } catch (err) {
        console.error("Categories error:", err);
        return [];
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

    if (memoryCache.has(key)) {
      const cached = memoryCache.get(key);
      if (now - cached.timestamp < CACHE_TTL) return cached.data;
    }

    const promise = (async () => {
      try {
        const qRef = query(
          collection(db, "testimonials"),
          where("isActive", "==", true),
          orderBy("createdAt", "desc"),
          limit(size)
        );

        const snap = await getDocs(qRef);

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        memoryCache.set(key, { data, timestamp: now });
        savePersistentCache(key, data);

        return data;
      } catch (err) {
        console.error("Testimonials error:", err);
        return [];
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

    if (memoryCache.has(key)) {
      const cached = memoryCache.get(key);
      if (now - cached.timestamp < CACHE_TTL) return cached.data;
    }

    const promise = (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "itemsCollection"), limit(size))
        );

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        memoryCache.set(key, { data, timestamp: now });
        savePersistentCache(key, data);

        return data;
      } catch (err) {
        console.error("Collections error:", err);
        return [];
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
    localStorage.removeItem("homepageCache");
  },
};