import { QueryClient } from "@tanstack/react-query";
import { get, set, del } from "idb-keyval";

/**
 * =========================
 * QUERY CLIENT (SAFE DEFAULT)
 * =========================
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,      // 2 min freshness window
      gcTime: 1000 * 60 * 30,        // 30 min cache in memory
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
});

/**
 * =========================
 * SAFE PERSISTER (CONTROLLED)
 * =========================
 * NOTE:
 * We DO NOT persist full cache to avoid stale price issues.
 * This ensures Firestore remains source of truth.
 */
export const idbPersister = {
  persistClient: async () => {
    // ❌ Intentionally disabled for safety (e-commerce best practice)
  },

  restoreClient: async () => {
    // ❌ Do not restore stale cache
    return undefined;
  },

  removeClient: async () => {
    await del("REACT_QUERY_CACHE");
  },
};