import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { productService } from "../product/services/ProductService";

/* ─────────────────────────────
   SORT ONLY
───────────────────────────── */
const sortProducts = (products, sort) => {
  const arr = [...products];

  switch (sort) {
    case "a_z":
      return arr.sort((a, b) =>
        (a.name || "").localeCompare(b.name || ""),
      );

    case "z_a":
      return arr.sort((a, b) =>
        (b.name || "").localeCompare(a.name || ""),
      );

    case "newest":
    default:
      return arr.sort(
        (a, b) =>
          (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
      );
  }
};

/* ─────────────────────────────
   HOOK (FIXED FOR DYNAMIC COLLECTIONS)
───────────────────────────── */
export const useCollection = ({
  collectionType,
  sort = "newest",
  pageSize = 20,
}) => {
  const query = useInfiniteQuery({
    queryKey: ["collection", collectionType, pageSize],

    queryFn: ({ pageParam = null }) =>
      productService.getProducts({
        // 🔥 IMPORTANT FIX
        collectionType:
          collectionType && collectionType !== "all"
            ? collectionType
            : null,

        lastDoc: pageParam,
        pageSize,
      }),

    getNextPageParam: (lastPage) =>
      lastPage?.hasMore ? lastPage.lastDoc : undefined,

    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const allProducts =
    query.data?.pages?.flatMap((p) => p.products) ?? [];

  const displayProducts = useMemo(
    () => sortProducts(allProducts, sort),
    [allProducts, sort],
  );

  return {
    displayProducts,
    allProducts,

    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,

    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};