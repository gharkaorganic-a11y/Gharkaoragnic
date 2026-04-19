import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
  memo,
} from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import ProductCard from "../cards/ProductCard";

/* Skeleton */
const SkeletonCard = memo(() => (
  <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="w-full aspect-[3/4] bg-gray-100" />
    <div className="p-3 space-y-2">
      <div className="h-3 w-3/4 bg-gray-100 rounded" />
      <div className="h-3 w-1/2 bg-gray-100 rounded" />
    </div>
  </div>
));
SkeletonCard.displayName = "SkeletonCard";

/* Arrow */
const ArrowButton = memo(({ dir, disabled, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
    className="w-9 h-9 rounded-full bg-white border border-gray-300 text-gray-700 hover:border-black hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-black">
    {dir === "left" ? (
      <ChevronLeftIcon className="w-5 h-5" />
    ) : (
      <ChevronRightIcon className="w-5 h-5" />
    )}
  </button>
));
ArrowButton.displayName = "ArrowButton";

/* Main */
const ProductSection = ({
  title,
  subtitle,
  badge,
  products = [],
  loading = false,
  maxItems = 8,
  navigateTo = "/products",
}) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const safeProducts = Array.isArray(products) ? products : [];
  const visibleProducts = useMemo(
    () => safeProducts.slice(0, maxItems),
    [safeProducts, maxItems],
  );

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, loading, visibleProducts.length]);

  const scroll = useCallback((dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "left" ? -el.offsetWidth * 0.8 : el.offsetWidth * 0.8,
      behavior: "smooth",
    });
  }, []);

  if (!loading && safeProducts.length === 0) return null;

  const showButton = !loading && safeProducts.length > maxItems;
  const showArrows = visibleProducts.length > 4;

  return (
    <section className="w-full py-4 sm:py-5 bg-white" aria-label={title}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          {badge && (
            <span className="inline-block mb-3 text- font-semibold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full">
              {badge}
            </span>
          )}
          {title && (
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          {!loading && safeProducts.length > 0 && (
            <p className="mt-2 text-xs text-gray-500">
              {safeProducts.length}{" "}
              {safeProducts.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>

        {/* Products */}
        <ul
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 pb-2 px-1 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:grid md:overflow-visible md:snap-none md:grid-cols-3 lg:grid-cols-4 md:gap-5 md:px-0">
          {loading
            ? Array.from({ length: Math.min(maxItems, 8) }).map((_, i) => (
                <li
                  key={i}
                  className="snap-start flex-none w-[65%] sm:w-[45%] md:w-auto">
                  <SkeletonCard />
                </li>
              ))
            : visibleProducts.map((product, i) => (
                <li
                  key={product.id ?? product.slug ?? i}
                  className="snap-start flex-none w-[65%] sm:w-[45%] md:w-auto">
                  <ProductCard product={product} />
                </li>
              ))}
        </ul>

        {/* CTA */}
        {showButton && (
          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              onClick={() => navigate(navigateTo)}
              className="px-6 py-2.5 text-sm font-medium rounded-lg border-2 border-black text-black bg-white hover:bg-black hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              View Collection
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(ProductSection);
