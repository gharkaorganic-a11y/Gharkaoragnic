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
    // Generous responsive grid matching RelatedProducts spacing
    const defaultGridClass =
      "grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 md:grid-cols-3 md:gap-x-10 lg:grid-cols-4 lg:gap-x-12 xl:gap-x-14 lg:gap-y-14";
    const finalGridClass = gridClass || defaultGridClass;

    if (isError) return <ErrorState retry={() => window.location.reload()} />;
    if (isLoading) return <ProductGridLoader gridClass={finalGridClass} />;
    if (!displayProducts?.length)
      return <EmptyState clearFilters={clearFilters} />;

    return (
      <>
        <div className={`grid ${finalGridClass}`}>
          {displayProducts.map((product, idx) => (
            <ProductCard
              key={product.id || idx}
              product={product}
              index={idx}
            />
          ))}
        </div>

        {isFetchingNextPage && (
          <div className={`grid ${finalGridClass} mt-10`}>
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
