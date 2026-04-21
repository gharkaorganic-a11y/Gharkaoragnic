import React, { memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ─────────────────────────────
   PRODUCT SECTION TABS
   SEO + UX optimized category nav
───────────────────────────── */

const ProductSectionTabs = memo(({ productSections = [], currentKey }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (key) => {
    if (key === "all") navigate("/all-products");
    else navigate(`/${key}`);
  };

  return (
    <nav aria-label="Product categories" className="mb-8">
      <div className="relative">
        {/* Gradient fade edges (UX polish) */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-6  z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-6  z-10" />

        {/* Scroll container */}
        <div
          className="
            flex gap-5 md:gap-8
            overflow-x-auto
            pb-2 px-1
            scrollbar-hide
            scroll-smooth
            snap-x snap-mandatory
          ">
          {productSections.map((s) => {
            const isActive = s.key === currentKey;

            return (
              <button
                key={s.key}
                onClick={() => handleNavigate(s.key)}
                className="
                  flex-shrink-0
                  flex flex-col items-center gap-2
                  w-20 md:w-24
                  text-center
                  group
                  snap-start
                  focus:outline-none
                "
                aria-current={isActive ? "page" : undefined}>
                {/* ICON CIRCLE */}
                <div
                  className={`
                    relative
                    w-14 h-14 md:w-16 md:h-16
                    rounded-full
                    overflow-hidden
                    flex items-center justify-center
                     transition-all duration-300
                    ${isActive ? " scale-105 shadow-md" : "border-gray-200 "}
                  `}>
                  {/* Active glow ring */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full ring-2 ring-black/10" />
                  )}

                  <img
                    src={s.chipImage}
                    alt={s.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* LABEL */}
                <span
                  className={`
                    text-xs md:text-sm
                    leading-tight
                    font-medium
                    transition-colors
                    ${
                      isActive
                        ? "text-black font-semibold"
                        : "text-gray-600 group-hover:text-black"
                    }
                  `}>
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
});

ProductSectionTabs.displayName = "ProductSectionTabs";

export default ProductSectionTabs;
