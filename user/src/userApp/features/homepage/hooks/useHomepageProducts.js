import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { homepageService } from "../services/homepageService";

const STALE = {
  products:     1000 * 60 * 10,  // 10 min
  categories:   1000 * 60 * 60,  // 1 hour
  collections:  1000 * 60 * 60,  // 1 hour
  testimonials: 1000 * 60 * 30,  // 30 min
};

export const useHomepageProducts = (sections = []) => {
  const queryClient = useQueryClient();

  const productResults = useQueries({
    queries: sections.map((section) => ({
      queryKey: ["homepage", "products", section.key],
      queryFn: async () => {
        const data = await homepageService.getProductsByCollection(section.key, 8);

        // BUG FIX: guard against non-array (service returned null/undefined on error)
        if (!Array.isArray(data)) return [];

        data.forEach((product) => {
          if (!product?.id) return;
          queryClient.setQueryData(
            ["products", "id", product.id],
            (old) => old ?? product,
          );
          if (product.slug) {
            queryClient.setQueryData(
              ["products", "slug", product.slug],
              (old) => old ?? product,
            );
          }
        });

        return data;
      },
      staleTime: STALE.products,
      // BUG FIX: gcTime must be >= staleTime, otherwise React Query
      // discards the cache before it goes stale — you get unnecessary refetches
      gcTime: STALE.products,
      retry: 1,
      enabled: !!section.key,
    })),
  });

  // categories, testimonials, collections — fetched once, not used in UI
  // but kept here so they warm the cache for other pages
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["homepage", "categories"],
    queryFn:  () => homepageService.getHomepageCategories(),
    staleTime: STALE.categories,
    gcTime:    STALE.categories,
    retry: 1,
  });

  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery({
    queryKey: ["homepage", "testimonials"],
    queryFn:  () => homepageService.getTestimonials(),
    staleTime: STALE.testimonials,
    gcTime:    STALE.testimonials,
    retry: 1,
  });

  const { data: collections = [], isLoading: collectionsLoading } = useQuery({
    queryKey: ["homepage", "collections"],
    queryFn:  () => homepageService.getCollections(),
    staleTime: STALE.collections,
    gcTime:    STALE.collections,
    retry: 1,
  });

  const products = {};
  const errors   = {};
  const loadingKeys = [];

  sections.forEach((section, i) => {
    const r = productResults[i];
    products[section.key] = r?.data ?? [];
    if (r?.isLoading) loadingKeys.push(section.key);
    if (r?.isError)   errors[section.key] = r.error?.message ?? "Failed to load";
  });

  return {
    products,
    categories,
    testimonials,
    collections,
    loading:
      productResults.some((r) => r.isLoading) ||
      categoriesLoading ||
      testimonialsLoading ||
      collectionsLoading,
    loadingKeys,
    errors,
    hasError: Object.keys(errors).length > 0,
  };
};