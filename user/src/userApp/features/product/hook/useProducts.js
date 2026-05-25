/**
 * useProducts.js
 * Production-ready React Query hooks for Product & Review management.
 * Features: Request cancellation (AbortSignal), stable query keys, and strict cache normalization.
 */

import { useState, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/ProductService";

/* ─────────────────────────────────────────────────────────────────────────────
   QUERY KEYS (Strictly typed & fallback protected to prevent crashes)
   RULE: Every hook that touches reviews MUST use PRODUCT_KEYS.reviews().
         Never build review query keys inline — key shape mismatches are
         the silent killer of invalidation and cache reads.
───────────────────────────────────────────────────────────────────────────── */
export const PRODUCT_KEYS = {
  all: () => ["products", "all"],
  byId: (id) => ["products", "id", String(id || "")],
  bySlug: (slug) => ["products", "slug", String(slug || "")],
  byCollection: (collection) => ["products", "collection", String(collection || "")],
  related: (productId, collections, limit) => [
    "products",
    "related",
    String(productId || ""),
    collections,
    limit,
  ],
  byIds: (ids = []) => ["products", "ids", [...(ids || [])].sort().join(",")],
  search: (term) => ["products", "search", String(term || "").trim().toLowerCase()],

  // FIX: Canonical order is (productId, approvedOnly, pageSize).
  // invalidateReviews uses just the productId prefix to bust all variants.
  reviews: (productId, approvedOnly, pageSize) => [
    "products",
    "reviews",
    String(productId || ""),
    Boolean(approvedOnly),   // Force boolean so true !== "true" never happens
    Number(pageSize || 5),   // Force number so 5 !== "5" never happens
  ],
};

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED QUERY OPTIONS
───────────────────────────────────────────────────────────────────────────── */
export const META_OPTS = {
  staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
  gcTime: 60 * 60 * 1000,   // Unused cache is garbage collected after 60 mins
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: "always",
  retry: 2,
  networkMode: "online",
};

export const PRICE_OPTS = {
  staleTime: 0, // Prices should never be considered "fresh" without checking
  gcTime: 2 * 60 * 1000,
  refetchOnMount: "always",
  refetchOnWindowFocus: true,
  refetchOnReconnect: "always",
  retry: 2,
  networkMode: "online",
};

/* ─────────────────────────────────────────────────────────────────────────────
   STANDARD HOOKS
───────────────────────────────────────────────────────────────────────────── */

export const useProductBySlug = (slug) =>
  useQuery({
    queryKey: PRODUCT_KEYS.bySlug(slug),
    queryFn: ({ signal }) => productService.getProductBySlug(slug, signal),
    enabled: Boolean(slug),
    ...META_OPTS,
  });

export const useProductById = (id) =>
  useQuery({
    queryKey: PRODUCT_KEYS.byId(id),
    queryFn: ({ signal }) => productService.getProductById(id, signal),
    enabled: Boolean(id),
    ...META_OPTS,
  });

export const useProductsByCollection = (collection, limit) =>
  useQuery({
    queryKey: PRODUCT_KEYS.byCollection(collection),
    queryFn: ({ signal }) =>
      productService.getProductsByCollections([collection], { limit, signal }),
    enabled: Boolean(collection),
    ...META_OPTS,
  });

/* ─────────────────────────────────────────────────────────────────────────────
   COMPLEX HOOKS
───────────────────────────────────────────────────────────────────────────── */

export const useRelatedProducts = (product, limit = 5) => {
  // Memoize to prevent unstable array references causing infinite re-renders
  const collections = useMemo(() => {
    if (!product?.collectionTypes) return [];
    return Array.isArray(product.collectionTypes)
      ? product.collectionTypes
      : [product.collectionTypes];
  }, [product?.collectionTypes]);

  return useQuery({
    queryKey: PRODUCT_KEYS.related(product?.id, collections, limit),
    queryFn: async ({ signal }) => {
      const items = await productService.getProductsByCollections(collections, {
        limit: limit + 8, // Over-fetch to ensure we have enough after filtering
        signal,
      });

      const unique = new Map();
      items?.forEach((item) => {
        if (item.id !== product?.id) {
          unique.set(item.id, item);
        }
      });

      return [...unique.values()].slice(0, limit);
    },
    enabled: Boolean(product?.id && collections.length > 0),
    ...META_OPTS,
  });
};

export const useProductsByIds = (ids = []) => {
  // Memoize sort to keep key stable
  const sorted = useMemo(() => [...(ids || [])].sort(), [ids]);

  return useQuery({
    queryKey: PRODUCT_KEYS.byIds(sorted),
    queryFn: ({ signal }) => productService.getProductsByIds(sorted, signal),
    enabled: sorted.length > 0,
    ...META_OPTS,
  });
};

export const useProductSearch = (term) =>
  useQuery({
    queryKey: PRODUCT_KEYS.search(term),
    queryFn: ({ signal }) => productService.searchProducts(term, { signal }),
    enabled: Boolean(term?.trim()),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });

/* ─────────────────────────────────────────────────────────────────────────────
   PRODUCT REVIEWS
   FIX 1: Now uses PRODUCT_KEYS.reviews() instead of an inline key array.
   FIX 2: Key argument order is now (productId, approvedOnly, pageSize) —
           matching the canonical definition in PRODUCT_KEYS above.
   This means invalidateReviews(productId) will correctly bust this cache.
───────────────────────────────────────────────────────────────────────────── */
export const useProductReviews = (productId, { pageSize = 5, approvedOnly = true } = {}) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.reviews(productId, approvedOnly, pageSize),
    queryFn: () =>
      productService.getProductReviews(productId, { pageSize, approvedOnly }),
    enabled: Boolean(productId),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN IMPERATIVE HOOK (For Data Fetching outside of UI Render Cycle)
───────────────────────────────────────────────────────────────────────────── */

// Helper to safely compare Firebase timestamps vs primitive numbers
const getTs = (val) => {
  if (!val) return 0;
  if (typeof val.toMillis === "function") return val.toMillis();
  if (typeof val === "number") return val;
  const parsed = new Date(val).getTime();
  return isNaN(parsed) ? 0 : parsed;
};

export const useProducts = () => {
  const qc = useQueryClient();
  const [errors, setErrors] = useState({});

  /* ───────────────────────────── */

  const normalizeProducts = useCallback(
    (data) => {
      if (!data) return;
      const list = Array.isArray(data) ? data : [data];

      list.forEach((p) => {
        if (!p?.id) return;
        const idKey = PRODUCT_KEYS.byId(p.id);
        const existing = qc.getQueryData(idKey);

        const existingTs = getTs(existing?.updatedAt);
        const incomingTs = getTs(p?.updatedAt);

        // Only overwrite cache if incoming data is newer or cache is empty
        if (!existing || incomingTs >= existingTs) {
          qc.setQueryData(idKey, p);
          if (p.slug) {
            qc.setQueryData(PRODUCT_KEYS.bySlug(p.slug), p);
          }
        }
      });
    },
    [qc],
  );

  /* ───────────────────────────── */

  const fetchProduct = useCallback(
    async (queryKey, queryFn, opts = META_OPTS, fallback = null) => {
      const keyStr = JSON.stringify(queryKey);
      try {
        const cached = qc.getQueryData(queryKey);
        if (cached) return cached;

        const result = await qc.fetchQuery({ queryKey, queryFn, ...opts });
        normalizeProducts(result);
        return result;
      } catch (err) {
        setErrors((prev) => ({ ...prev, [keyStr]: err.message }));
        return fallback;
      }
    },
    [qc, normalizeProducts],
  );

  /* ─────────────────────────────
     GETTERS
  ───────────────────────────── */

  const getProductBySlug = useCallback(
    (slug) =>
      fetchProduct(
        PRODUCT_KEYS.bySlug(slug),
        ({ signal }) => productService.getProductBySlug(slug, signal),
      ),
    [fetchProduct],
  );

  const getProductById = useCallback(
    (id) =>
      fetchProduct(
        PRODUCT_KEYS.byId(id),
        ({ signal }) => productService.getProductById(id, signal),
      ),
    [fetchProduct],
  );

  const getProductsByCollection = useCallback(
    (collection, opts = {}) =>
      fetchProduct(
        PRODUCT_KEYS.byCollection(collection),
        ({ signal }) =>
          productService.getProductsByCollections([collection], { ...opts, signal }),
      ),
    [fetchProduct],
  );

  /* ─────────────────────────────
     PREFETCH (For UX speedups on hover)
  ───────────────────────────── */

  const prefetchBySlug = useCallback(
    (slug) => {
      if (slug)
        qc.prefetchQuery({
          queryKey: PRODUCT_KEYS.bySlug(slug),
          queryFn: ({ signal }) => productService.getProductBySlug(slug, signal),
          ...META_OPTS,
        });
    },
    [qc],
  );

  const prefetchById = useCallback(
    (id) => {
      if (id)
        qc.prefetchQuery({
          queryKey: PRODUCT_KEYS.byId(id),
          queryFn: ({ signal }) => productService.getProductById(id, signal),
          ...META_OPTS,
        });
    },
    [qc],
  );

  /* ─────────────────────────────
     INVALIDATION (For Admins / Mutations)
  ───────────────────────────── */

  const invalidateProduct = useCallback(
    (id) => qc.invalidateQueries({ queryKey: PRODUCT_KEYS.byId(id) }),
    [qc],
  );

  const invalidateAll = useCallback(
    () => qc.invalidateQueries({ queryKey: ["products"] }),
    [qc],
  );

  // FIX: Uses ["products", "reviews", productId] as a prefix.
  // React Query invalidates ALL keys that START WITH this prefix,
  // so every pageSize/approvedOnly variant for this product gets busted.
  const invalidateReviews = useCallback(
    (productId) =>
      qc.invalidateQueries({
        queryKey: ["products", "reviews", String(productId || "")],
      }),
    [qc],
  );

  /* ─────────────────────────────
     ERRORS
  ───────────────────────────── */

  const clearError = useCallback((queryKey) => {
    const keyStr = JSON.stringify(queryKey);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[keyStr];
      return next;
    });
  }, []);

  const clearAllErrors = useCallback(() => setErrors({}), []);

  /* ───────────────────────────── */

  return {
    errors,
    clearError,
    clearAllErrors,
    getProductBySlug,
    getProductById,
    getProductsByCollection,
    prefetchBySlug,
    prefetchById,
    normalizeProducts,
    invalidateProduct,
    invalidateAll,
    invalidateReviews,
  };
};