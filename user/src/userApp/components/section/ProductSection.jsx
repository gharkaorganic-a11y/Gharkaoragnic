import React, { useMemo, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../cards/ProductCard";

/* Skeleton matching RelatedProducts layout */
const SkeletonCard = memo(() => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="w-full aspect-square bg-[#f4f2e9] rounded-2xl sm:rounded-none" />
    <div className="mt-3 sm:mt-4 space-y-2">
      <div className="h-4 bg-[#f4f2e9] rounded w-4/5" />
      <div className="h-3.5 bg-[#f4f2e9] rounded w-1/2" />
      <div className="h-4 bg-[#f4f2e9] rounded w-1/3" />
      <div className="h-8 bg-[#f4f2e9] rounded w-full mt-2" />
    </div>
  </div>
));
SkeletonCard.displayName = "SkeletonCard";

/* Main */
const ProductSection = ({
  title,
  subtitle,
  badge,
  products = [],
  loading = false,
  error = "",
  onRetry,
  maxItems = 8,
  compact = false,
  navigateTo = "/products",
  panelId,
  panelLabelledBy,
}) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const visibleProducts = useMemo(
    () => (Array.isArray(products) ? products : []).slice(0, maxItems),
    [products, maxItems],
  );

  const showButton = !loading && visibleProducts.length > 0;

  if (compact && !loading && visibleProducts.length === 0) return null;

  return (
    <section
      id={panelId}
      role={panelId ? "tabpanel" : undefined}
      aria-labelledby={panelLabelledBy}
      className={`w-full bg-white ${compact ? "py-7 sm:py-9" : "py-9 sm:py-12"}`}
      aria-label={title}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`mb-6 flex items-end justify-between gap-4 ${
            compact ? "pb-1" : "border-b border-[#e7e5dc] pb-5 sm:mb-8"
          }`}>
          <div className="text-left">
          {badge && (
            <span className="mb-2 inline-flex text-[10px] font-semibold uppercase tracking-[0.16em] text-[#47724d]">
              {badge}
            </span>
          )}
          {title && (
            <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className="mt-1.5 max-w-2xl text-sm sm:text-base"
              style={{ color: "var(--storefront-muted-color, #687267)" }}>
              {subtitle}
            </p>
          )}
          </div>
          {showButton && (
            <button
              onClick={() => navigate(navigateTo)}
              className="hidden shrink-0 rounded-full border border-[#315c3c] px-5 py-2.5 text-sm font-semibold text-[#315c3c] transition hover:bg-[#315c3c] hover:text-white sm:inline-flex">
              Shop all
            </button>
          )}
        </div>

        {/* Products */}
        {error && visibleProducts.length === 0 && !loading ? (
          <div
            className="rounded-lg border border-[#e7e5dc] bg-[#fbfaf5] px-5 py-9 text-center"
            role="alert">
            <p className="font-medium text-[#263329]">
              We couldn't load this collection.
            </p>
            <p className="mt-2 text-sm text-[#687267]">
              Please try again in a moment.
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 rounded-full bg-[#315c3c] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#244b2e]">
                Try again
              </button>
            )}
          </div>
        ) : !loading && visibleProducts.length === 0 ? (
          <div className="rounded-lg border border-[#e7e5dc] bg-[#fbfaf5] px-5 py-9 text-center">
            <p className="font-medium text-[#263329]">
              No products are available in this collection right now.
            </p>
            <button
              type="button"
              onClick={() => navigate("/collections")}
              className="mt-4 text-sm font-semibold text-[#315c3c] underline underline-offset-4">
              Browse all products
            </button>
          </div>
        ) : (
          <ul
            ref={scrollRef}
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 md:grid-cols-3 md:gap-x-10 lg:grid-cols-4 lg:gap-x-12 xl:gap-x-14 lg:gap-y-14">
            {loading
              ? Array.from({ length: Math.min(maxItems, 8) }).map((_, i) => (
                <li
                  key={i}
                  className="min-w-0">
                  <SkeletonCard />
                </li>
              ))
              : visibleProducts.map((product, i) => (
                <li
                  key={product.id ?? product.slug ?? i}
                  className="min-w-0">
                  <ProductCard product={product} index={i} />
                </li>
              ))}
          </ul>
        )}

        {/* CTA */}
        {showButton && (
          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              onClick={() => navigate(navigateTo)}
              className="rounded-full border border-[#315c3c] bg-white px-7 py-3 text-sm font-semibold text-[#315c3c] transition-colors hover:bg-[#315c3c] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#315c3c] sm:hidden">
              View all products
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(ProductSection);
