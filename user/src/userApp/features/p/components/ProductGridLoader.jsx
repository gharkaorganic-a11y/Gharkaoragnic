import { SkeletonCard } from "./SkeletonCard";

const ProductGridLoader = ({ gridClass, count = 8 }) => {
  const defaultClass =
    "grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 md:grid-cols-3 md:gap-x-10 lg:grid-cols-4 lg:gap-x-12 xl:gap-x-14 lg:gap-y-14";
  return (
    <div className={`grid ${gridClass || defaultClass}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default ProductGridLoader;
