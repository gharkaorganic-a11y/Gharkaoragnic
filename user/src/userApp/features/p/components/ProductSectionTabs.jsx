import React, { memo } from "react";
import { Link } from "react-router-dom";
import { productSections as defaultSections } from "../../homepage/config/productCollection";
import { preferredSlug } from "../utils/SECTIONKEY";

/**
 * ProductSectionTabs.jsx
 * Unified Category Section matching width everywhere:
 * Exactly max-w-7xl px-4 sm:px-6 lg:px-8 aligning with header, hero, and product cards.
 */
const ProductSectionTabs = memo(
  ({
    productSections = defaultSections,
    currentKey,
    onSelect,
    title,
    subtitle,
  }) => {
    return (
      <section
        aria-label={title || "Shop by category"}
        className={`w-full border-y border-[#ece9df] bg-white ${
          title ? "py-7 sm:py-10" : "py-3.5 sm:py-4.5"
        }`}>
        {/* Exactly matching storefront content width (max-w-7xl px-4 sm:px-6 lg:px-8) */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {title && (
            <div className="mb-6 sm:mb-8 text-center">
              <h2
                className="text-center text-2xl font-medium tracking-tight sm:text-[28px]"
                style={{ color: "var(--storefront-heading-color, #263329)" }}>
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1.5 text-xs sm:text-sm text-gray-500 font-normal">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div className="flex snap-x snap-mandatory items-start gap-3.5 sm:gap-4 lg:gap-0 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-start lg:justify-between">
            {productSections.map((category) => {
              const isActive = currentKey && category.key === currentKey;
              const targetUrl =
                category.key === "all"
                  ? "/collections"
                  : `/${preferredSlug[category.key] ?? category.key}`;

              return (
                <Link
                  key={category.key}
                  to={targetUrl}
                  onClick={
                    onSelect
                      ? (e) => {
                          e.preventDefault();
                          onSelect(category.key);
                        }
                      : undefined
                  }
                  className={`group flex w-[76px] sm:w-[86px] lg:w-[96px] shrink-0 snap-start flex-col items-center text-center transition-all ${
                    isActive ? "opacity-100" : "opacity-95 hover:opacity-100"
                  }`}>
                  {/* Outer circle with brand background */}
                  <span
                    className={`flex h-[54px] w-[54px] sm:h-[62px] sm:w-[62px] lg:h-[68px] lg:w-[68px] items-center justify-center rounded-full p-1 transition-transform group-hover:scale-105 ${
                      isActive
                        ? "ring-2 ring-offset-2 ring-[#009f68] scale-105 shadow-sm"
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        "var(--storefront-category-color, #009f68)",
                    }}>
                    <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                      <img
                        src={category.chipImage}
                        alt=""
                        loading="lazy"
                        className="h-full w-full rounded-full object-contain"
                      />
                    </span>
                  </span>

                  {/* Centered clean label */}
                  <span
                    className={`mt-1.5 sm:mt-2 max-w-[76px] sm:max-w-[88px] lg:max-w-[96px] text-[11px] sm:text-xs font-medium leading-tight line-clamp-2 transition-colors ${
                      isActive ? "font-bold" : ""
                    }`}
                    style={{
                      color: isActive
                        ? "var(--storefront-category-color, #009f68)"
                        : "var(--storefront-text-color, #253448)",
                    }}>
                    {category.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    );
  },
);

ProductSectionTabs.displayName = "ProductSectionTabs";

export default ProductSectionTabs;
