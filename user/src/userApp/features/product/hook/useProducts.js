import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/ProductService";

/*
────────────────────────────────────────
Query Keys
────────────────────────────────────────
*/

export const PRODUCT_KEYS = {
  all:            ()              => ["products", "all"],
  byId:           (id)            => ["products", "id", String(id)],
  bySlug:         (slug)          => ["products", "slug", slug],
  byCategory:     (cat)           => ["products", "category", cat],
  byCategoryLimit:(cat, limit)    => ["products", "category", cat, "limit", limit],
  byCollection:   (types, limit)  => ["products", "collection", [...types].sort().join(","), limit],
  byIds:          (ids)           => ["products", "ids", [...ids].sort().join(",")],
};

/*
────────────────────────────────────────
Query Config
────────────────────────────────────────
  Two tiers:
  - META_OPTS  → descriptions, images, categories (safe to cache 5 min)
  - PRICE_OPTS → prices, stock (always fresh, never stale)
────────────────────────────────────────
*/

const META_STALE  = 5  * 60 * 1000;  // 5 min
const PRICE_STALE = 0;                // always stale — always re-fetched
const GC_TIME     = 60 * 60 * 1000;  // 1 hr in-memory retention

const META_OPTS = {
  staleTime:            META_STALE,
  gcTime:               GC_TIME,
  refetchOnMount:       true,
  refetchOnWindowFocus: true,
  refetchOnReconnect:   "always",
};

// Export so price/stock queries in other files can use the same config
export const PRICE_OPTS = {
  staleTime:            PRICE_STALE,
  gcTime:               5 * 60 * 1000,  // evict from memory after 5 min
  refetchOnMount:       "always",
  refetchOnWindowFocus: true,
  refetchOnReconnect:   "always",
};

/*
────────────────────────────────────────
Hook
────────────────────────────────────────
*/

export const useProducts = () => {
  const qc = useQueryClient();
  const [errors, setErrors] = useState({});

  /*
  ──────────────────
  Normalize Helper
  Cross-populates byId and bySlug caches from any product fetch
  ──────────────────
  */
  const normalizeProducts = useCallback(
    (products) => {
      if (!products) return;
      const list = Array.isArray(products) ? products : [products];
      list.forEach((p) => {
        if (!p) return;
        qc.setQueryData(PRODUCT_KEYS.byId(p.id), p);
        if (p.slug) qc.setQueryData(PRODUCT_KEYS.bySlug(p.slug), p);
      });
    },
    [qc]
  );

  /*
  ──────────────────
  Cache-first Fetch
  Single source of truth for all fetching + error handling
  ──────────────────
  */
  const fetchIt = useCallback(
    async (key, fetchFn, opts = META_OPTS, fallback = null) => {
      try {
        const cached = qc.getQueryData(key);
        if (cached) return cached;

        const res = await qc.fetchQuery({
          queryKey: key,
          queryFn:  fetchFn,
          ...opts,
        });

        if (res) normalizeProducts(res);
        return res;
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          [JSON.stringify(key)]: err.message,
        }));
        return fallback;
      }
    },
    [qc, normalizeProducts]
  );

  /*
  ──────────────────
  Prefetch (hover)
  ──────────────────
  */
  const prefetchBySlug = useCallback(
    (slug) => {
      if (!slug) return;
      qc.prefetchQuery({
        queryKey: PRODUCT_KEYS.bySlug(slug),
        queryFn:  () => productService.getProductBySlug(slug),
        staleTime: META_STALE,
      });
    },
    [qc]
  );

  const prefetchById = useCallback(
    (id) => {
      if (!id) return;
      qc.prefetchQuery({
        queryKey: PRODUCT_KEYS.byId(id),
        queryFn:  () => productService.getProductById(id),
        staleTime: META_STALE,
      });
    },
    [qc]
  );

  const prefetchCategory = useCallback(
    (categoryId) => {
      if (!categoryId) return;
      qc.prefetchQuery({
        queryKey: PRODUCT_KEYS.byCategory(categoryId),
        queryFn:  () => productService.getProductsByCategory(categoryId),
        staleTime: META_STALE,
      });
    },
    [qc]
  );

  const prefetchNextPage = useCallback(
    (lastDoc) => {
      if (!lastDoc) return;
      qc.prefetchQuery({
        queryKey: ["products", "page", lastDoc?.id],
        queryFn:  () => productService.getProducts({ lastDoc }),
        staleTime: META_STALE,
      });
    },
    [qc]
  );

  /*
  ──────────────────
  Queries
  ──────────────────
  */
  const getProductBySlug = useCallback(
    (slug) => {
      if (!slug) return Promise.resolve(null);
      return fetchIt(
        PRODUCT_KEYS.bySlug(slug),
        () => productService.getProductBySlug(slug),
        META_OPTS,
        null
      );
    },
    [fetchIt]
  );

  const getProductById = useCallback(
    (id) => {
      if (!id) return Promise.resolve(null);
      return fetchIt(
        PRODUCT_KEYS.byId(id),
        () => productService.getProductById(id),
        META_OPTS,
        null
      );
    },
    [fetchIt]
  );

  const getProductsByCategory = useCallback(
    (cat) => {
      if (!cat) return Promise.resolve([]);
      return fetchIt(
        PRODUCT_KEYS.byCategory(cat),
        () => productService.getProductsByCategory(cat),
        META_OPTS,
        []
      );
    },
    [fetchIt]
  );

  const getProductsByCategoryLimited = useCallback(
    (categoryId, limit = 5) => {
      if (!categoryId) return Promise.resolve([]);
      return fetchIt(
        PRODUCT_KEYS.byCategoryLimit(categoryId, limit),
        // Pass limit to Firestore — do NOT fetch all then slice
        () => productService.getProductsByCategory(categoryId, { limit }),
        META_OPTS,
        []
      );
    },
    [fetchIt]
  );

  const getProductsByIds = useCallback(
    (ids = []) => {
      if (!ids.length) return Promise.resolve([]);
      const sortedIds = [...ids].sort();
      return fetchIt(
        PRODUCT_KEYS.byIds(sortedIds),
        () => productService.getProductsByIds(sortedIds),
        META_OPTS,
        []
      );
    },
    [fetchIt]
  );

  /*
  ──────────────────
  Search
  NOTE: client-side search on full catalog is a scalability risk.
  Consider Algolia/Typesense for catalogs > ~500 products.
  ──────────────────
  */
  const searchProducts = useCallback(
    async (term) => {
      if (!term?.trim()) return [];

      const cached = qc.getQueryData(PRODUCT_KEYS.all());
      if (cached) return productService.searchProducts(term, cached);

      const products = await fetchIt(
        PRODUCT_KEYS.all(),
        () => productService.getAllProducts(),
        META_OPTS,
        []
      );

      return productService.searchProducts(term, products);
    },
    [fetchIt, qc]
  );

  /*
  ──────────────────
  Return API
  ──────────────────
  */
  return {
    errors,

    // Queries
    getProductBySlug,
    getProductById,
    getProductsByCategory,
    getProductsByCategoryLimited,
    getProductsByIds,
    searchProducts,

    // Prefetch
    prefetchBySlug,
    prefetchById,
    prefetchCategory,
    prefetchNextPage,
  };
};