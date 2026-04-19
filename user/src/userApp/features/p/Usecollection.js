/**
 * useCollection.js
 * Infinite-scroll collection hook backed by React Query.
 * Handles pagination, client-side sorting, and type normalization.
 */

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { productService } from "../product/services/ProductService";

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────────── */

const DEFAULT_PAGE_SIZE = 20;
const STALE_TIME = 5 * 60 * 1000; // 5 min
const GC_TIME = 30 * 60 * 1000; // 30 min

/* ─────────────────────────────────────────────────────────────────────────────
   TIMESTAMP HELPER
───────────────────────────────────────────────────────────────────────────── */

const toTimestamp = (value) => {
  if (!value) return 0;
  if (typeof value.seconds === "number") return value.seconds;
  if (typeof value._seconds === "number") return value._seconds;
  if (value instanceof Date) return value.getTime() / 1000;
  if (typeof value === "string") {
    const ms = Date.parse(value);
    return Number.isNaN(ms)? 0 : ms / 1000;
  }
  return 0;
};

/* ─────────────────────────────────────────────────────────────────────────────
   SORT COMPARATORS
───────────────────────────────────────────────────────────────────────────── */

const SORT_COMPARATORS = {
  price_asc: (a, b) => (a.price?? 0) - (b.price?? 0),
  price_desc: (a, b) => (b.price?? 0) - (a.price?? 0),
  name_asc: (a, b) => (a.name?? "").localeCompare(b.name?? "", "en-IN"),
  name_desc: (a, b) => (b.name?? "").localeCompare(a.name?? "", "en-IN"),
  createdAt_desc: (a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt),
};

const DEFAULT_SORT = "createdAt_desc";

const sortProducts = (products, sort) => {
  const comparator = SORT_COMPARATORS[sort]?? SORT_COMPARATORS[DEFAULT_SORT];
  return products.slice().sort(comparator);
};

/* ─────────────────────────────────────────────────────────────────────────────
   QUERY KEY FACTORY
───────────────────────────────────────────────────────────────────────────── */

export const collectionKeys = {
  all: (pageSize) => ["collection", "all", pageSize],
  type: (type, pageSize) => ["collection", type, pageSize],
  list: (type, pageSize) =>
    type? collectionKeys.type(type, pageSize) : collectionKeys.all(pageSize),
};

/* ─────────────────────────────────────────────────────────────────────────────
   HOOK
───────────────────────────────────────────────────────────────────────────── */

export const useCollection = ({
  collectionType,
  sort = DEFAULT_SORT,
  pageSize = DEFAULT_PAGE_SIZE,
  enabled = true,
}) => {
  // null / undefined / "all" / "" → no filter (show every product)
  const effectiveType =
    collectionType && collectionType!== "all" && collectionType.trim()!== ""
     ? collectionType.trim()
      : null;

  const queryKey = collectionKeys.list(effectiveType, pageSize);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey,

    queryFn: ({ pageParam = null }) => {
      // DEBUG: This should log null when you're on /collections
      if (process.env.NODE_ENV === "development") {
        console.log("[useCollection] fetching with collectionType:", effectiveType);
      }

      return productService.getProducts({
        collectionType: effectiveType, // null means NO WHERE filter
        lastDoc: pageParam,
        pageSize,
      });
    },

    getNextPageParam: (lastPage) =>
      lastPage?.hasMore? lastPage.lastDoc : undefined,

    initialPageParam: null,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    enabled,
  });

  const allProducts = useMemo(
    () => data?.pages?.flatMap((page) => page.products?? [])?? [],
    [data]
  );

  const displayProducts = useMemo(
    () => sortProducts(allProducts, sort),
    [allProducts, sort]
  );

  return {
    displayProducts,
    allProducts,
    fetchNextPage,
    hasNextPage: hasNextPage?? false,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  };
};