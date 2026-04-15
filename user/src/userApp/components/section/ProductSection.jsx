import React, { useMemo, useRef, useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import ProductCard from "../cards/ProductCard";

/* ─────────────────────────────────────────────
   Skeleton Card
───────────────────────────────────────────── */
const SkeletonCard = memo(() => (
  <div
    className="w-full bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
    aria-hidden="true">
    <div className="w-full aspect-[3/4] bg-gray-100" />
    <div className="p-4 space-y-2.5">
      <div className="h-3 w-3/4 bg-gray-100 rounded" />
      <div className="h-3 w-1/2 bg-gray-100 rounded" />
      <div className="h-2.5 w-1/3 bg-gray-100 rounded" />
    </div>
  </div>
));

/* ─────────────────────────────────────────────
   SVG Background Pattern
───────────────────────────────────────────── */
const BackgroundPattern = memo(() => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.02] text-gray-900"
    aria-hidden="true">
    <defs>
      <pattern
        id="product-section-pattern"
        x="0"
        y="0"
        width="60"
        height="60"
        patternUnits="userSpaceOnUse">
        <circle cx="30" cy="30" r="0.8" fill="currentColor" />
        <circle
          cx="30"
          cy="30"
          r="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#product-section-pattern)" />
  </svg>
));

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const ProductSection = ({
  title,
  subtitle,
  badge,
  products = [],
  loading = false,
  maxItems = 8,
  navigateTo = "/products",
  skeletonCount,
}) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const safeProducts = Array.isArray(products) ? products : [];
  const visibleProducts = useMemo(
    () => safeProducts.slice(0, Math.max(0, maxItems)),
    [safeProducts, maxItems],
  );

  const skeletonItems = skeletonCount ?? Math.min(maxItems, 8);

  // Check scroll position for arrows + fades
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkScroll = () => {
      setCanScrollLeft(el.scrollLeft > 8);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    };

    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [loading, visibleProducts.length]);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth * 0.85;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -width : width,
      behavior: "smooth",
    });
  };

  if (!loading && safeProducts.length === 0) return null;

  const showButton = !loading && safeProducts.length >= 4;

  return (
    <section
      className="relative w-full py-12 md:py-20 bg-white overflow-hidden"
      aria-busy={loading}>
      <BackgroundPattern />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center px-4 sm:px-6 mb-10 md:mb-14">
          {badge && (
            <span className="inline-block mb-3 text- font-medium uppercase tracking-[0.15em] text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
              {badge}
            </span>
          )}

          {title && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
              {title}
            </h2>
          )}

          {subtitle && (
            <>
              <div
                className="flex items-center justify-center gap-2 mt-4 mb-3"
                aria-hidden="true">
                <div className="h- w-10 bg-gray-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <div className="h- w-10 bg-gray-200" />
              </div>
              <p className="text-sm sm:text-base text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            </>
          )}

          {!loading && safeProducts.length > 0 && (
            <p className="mt-2 text-xs text-gray-400 tracking-wide">
              {safeProducts.length}{" "}
              {safeProducts.length === 1 ? "item" : "items"}
            </p>
          )}

          {/* Desktop arrows */}
          {visibleProducts.length > 4 && (
            <div className="hidden md:flex justify-center gap-3 mt-6">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600
                  hover:bg-gray-50 hover:border-gray-300 transition disabled:opacity-30
                  disabled:cursor-not-allowed flex items-center justify-center shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
                  motion-reduce:transition-none">
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600
                  hover:bg-gray-50 hover:border-gray-300 transition disabled:opacity-30
                  disabled:cursor-not-allowed flex items-center justify-center shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
                  motion-reduce:transition-none">
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Products: One responsive layout */}
        <div className="relative">
          {/* Mobile fade edges */}
          <div
            className={`pointer-events-none absolute left-0 top-0 bottom-4 z-10 w-8 bg-gradient-to-r from-white to-transparent transition-opacity md:hidden ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          />
          <div
            className={`pointer-events-none absolute right-0 top-0 bottom-4 z-10 w-8 bg-gradient-to-l from-white to-transparent transition-opacity md:hidden ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          />

          <div
            ref={scrollRef}
            role="list"
            aria-label={title || "Products"}
            className="
              flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 scroll-smooth
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
              [scroll-padding-inline:1rem] motion-reduce:scroll-auto
              md:grid md:overflow-visible md:snap-none md:grid-cols-3 md:gap-6 md:px-6 lg:grid-cols-4 lg:px-8
            ">
            {loading
              ? Array.from({ length: skeletonItems }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    role="listitem"
                    className="snap-start flex-none w-[70%] sm:w-[45%] md:w-auto">
                    <SkeletonCard />
                  </div>
                ))
              : visibleProducts.map((product, i) => (
                  <div
                    key={product.id ?? product.slug ?? `${product.name}-${i}`}
                    role="listitem"
                    className="snap-start flex-none w-[70%] sm:w-[45%] md:w-auto
                      transition-transform duration-300 hover:-translate-y-1
                      motion-reduce:transition-none motion-reduce:hover:transform-none
                      [content-visibility:auto]">
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </div>

        {/* CTA */}
        {showButton && (
          <div className="mt-10 md:mt-14 flex justify-center px-4">
            <button
              onClick={() => navigate(navigateTo)}
              aria-label={`View full ${title || "product"} collection`}
              className="group flex items-center gap-2 px-7 py-3 text-sm font-medium rounded-xl
                border border-amber-500 text-amber-700 bg-white
                hover:bg-amber-500 hover:text-white hover:shadow-lg hover:shadow-amber-500/20
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400
                focus:ring-offset-2 motion-reduce:transition-none">
              View Collection
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transform transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(ProductSection);
