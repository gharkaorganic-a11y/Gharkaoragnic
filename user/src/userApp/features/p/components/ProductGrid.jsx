import { memo } from "react";
import ProductCard from "../../../components/cards/ProductCard";
import ProductGridLoader from "./ProductGridLoader";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import InfiniteSentinel from "./InfiniteSentinel";
import { SkeletonCard } from "./SkeletonCard";

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
    // Simple responsive grid: 2 cols mobile, 3 tablet, 4 desktop
    const defaultGridClass = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
    const finalGridClass = gridClass || defaultGridClass;

    if (isError) return <ErrorState retry={() => window.location.reload()} />;
    if (isLoading) return <ProductGridLoader gridClass={finalGridClass} />;
    if (!displayProducts?.length)
      return <EmptyState clearFilters={clearFilters} />;

    return (
      <>
        <div className={`grid ${finalGridClass}`}>
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {isFetchingNextPage && (
          <div className={`grid ${finalGridClass} mt-6`}>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))}
          </div>
        )}

        <InfiniteSentinel sentinelRef={sentinelRef} />

        {!hasNextPage && displayProducts.length > 8 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">You've reached the end</p>
          </div>
        )}
      </>
    );
  },
);

export default ProductGrid;
