import { memo } from "react";
import ProductCard from "../../../components/cards/ProductCard";
import ProductGridLoader from "./ProductGridLoader";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import InfiniteSentinel from "./InfiniteSentinel";
import { SkeletonCard } from "./SkeletonCard"; // FIXED

const ProductGrid = memo(
  ({
    isLoading,
    isError,
    displayProducts,
    gridClass,
    isFetchingNextPage,
    hasNextPage,
    sentinelRef,
    clearFilters,
  }) => {
    if (isError) return <ErrorState retry={() => window.location.reload()} />;
    if (isLoading) return <ProductGridLoader gridClass={gridClass} />;
    if (!displayProducts?.length)
      return <EmptyState clearFilters={clearFilters} />;

    return (
      <>
        <div className={`grid ${gridClass}`}>
          {displayProducts.map((product, i) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{
                animationDelay: `${Math.min(i % 8, 7) * 35}ms`,
                animationFillMode: "both",
              }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {isFetchingNextPage && (
          <div className={`grid ${gridClass} mt-8 md:mt-12`}>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))}
          </div>
        )}

        <InfiniteSentinel sentinelRef={sentinelRef} />

        {!hasNextPage && displayProducts.length > 8 && (
          <div className="pt-16 pb-8">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-gray-200" />
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
                You’ve reached the end
              </p>
              <div className="h-px w-12 bg-gray-200" />
            </div>
          </div>
        )}

        <style>
          {`
            @keyframes fade-up {
              from { opacity: 0; transform: translateY(12px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-up {
              animation: fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            }
          `}
        </style>
      </>
    );
  },
);

export default ProductGrid;
