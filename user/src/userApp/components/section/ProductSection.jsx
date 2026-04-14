import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../cards/ProductCard";

/* ─────────────────────────────────────────────
   Skeleton Card
───────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="w-full bg-[#f3f3f3] rounded-xl overflow-hidden animate-pulse">
    <div className="w-full aspect-[3/4] bg-[#ebebeb]" />
    <div className="p-3 md:p-4">
      <div className="h-3 w-3/4 bg-[#e8e8e8] rounded mb-2" />
      <div className="h-3 w-[45%] bg-[#e8e8e8] rounded mb-2.5" />
      <div className="h-2.5 w-[55%] bg-[#e8e8e8] rounded" />
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const ProductSection = ({
  title,
  subtitle,
  badge,
  products = [],
  loading = false,
  themeColor = "",
  maxItems = 8,
  navigateTo = "/products",
}) => {
  const navigate = useNavigate();

  const safeProducts = Array.isArray(products) ? products : [];
  const visibleProducts = useMemo(
    () => safeProducts.slice(0, maxItems),
    [safeProducts, maxItems],
  );

  if (!loading && safeProducts.length === 0) return null;

  const showButton = !loading && safeProducts.length >= 4;

  return (
    <section
      style={{
        backgroundColor: themeColor || "#ffffff",
        fontFamily: "'DM Sans', sans-serif",
      }}
      className="w-full py-10 md:py-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* ── Header ── */}
        <div className="px-4 sm:px-6 text-center mb-8 md:mb-12">
          {badge && (
            <span className="inline-block mb-2.5 text-[10px] font-medium tracking-[0.16em] uppercase text-[#c8102e] bg-[#fdf0f2] rounded-sm px-2.5 py-1">
              {badge}
            </span>
          )}

          {title && (
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-2xl sm:text-3xl md:text-[38px] font-bold text-[#111] leading-tight tracking-[-0.02em]">
              {title}
            </h2>
          )}

          {subtitle && (
            <>
              <div className="flex items-center justify-center gap-3.5 mt-3 mb-2.5">
                <div className="h-[1px] w-12 bg-[#e8e8e8]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#c8102e] opacity-60" />
                <div className="h-[1px] w-12 bg-[#e8e8e8]" />
              </div>
              <p className="text-[13px] sm:text-[15px] text-[#6b6b6b] font-light tracking-[0.01em] max-w-xl mx-auto">
                {subtitle}
              </p>
            </>
          )}

          {!loading && safeProducts.length > 0 && (
            <p className="mt-2 text-[11px] text-[#6b6b6b] tracking-[0.04em]">
              {safeProducts.length} item
              {safeProducts.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* ── Products Layout ── */}
        <div className="w-full">
          {/* 📱 Mobile Scroll */}
          <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-3 px-4 pb-4 pt-2 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {loading
              ? Array.from({ length: maxItems }).map((_, i) => (
                  <div
                    key={i}
                    className="snap-start flex-none w-[75vw] sm:w-[60vw]">
                    <SkeletonCard />
                  </div>
                ))
              : visibleProducts.map((product, i) => (
                  <div
                    key={product.id ?? product.name ?? i}
                    className="snap-start flex-none w-[75vw] sm:w-[60vw] transition-transform duration-300 hover:-translate-y-1">
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>

          {/* 💻 Desktop Grid */}
          <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6 px-6 lg:px-8">
            {loading
              ? Array.from({ length: maxItems }).map((_, i) => (
                  <div key={i}>
                    <SkeletonCard />
                  </div>
                ))
              : visibleProducts.map((product, i) => (
                  <div
                    key={product.id ?? product.name ?? i}
                    className="transition-transform duration-300 hover:-translate-y-1">
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </div>

        {/* ── CTA Button ── */}
        {showButton && (
          <div className="mt-6 md:mt-10 flex justify-center px-4">
            <button
              onClick={() => navigate(navigateTo)}
              className="group flex items-center gap-2 px-7 py-2.5 border-[1.5px] border-[#c8102e] text-[#c8102e] hover:bg-[#c8102e] hover:text-white text-xs font-medium uppercase tracking-[0.12em] rounded transition-all duration-200 bg-transparent">
              View Collection
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="transform transition-transform duration-200 group-hover:translate-x-1">
                <path
                  d="M2 7h10M8 3l4 4-4 4"
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
