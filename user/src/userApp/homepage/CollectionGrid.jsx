import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { slugify } from "../../utils/slugify";

const CollectionGrid = ({
  items = [],
  title = "Shop by Collection",
  subtitle = "Authentic • Pure • Homemade",
}) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  if (!Array.isArray(items) || !items.length) return null;

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

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
  }, [items.length]);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth * 0.8;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -width : width,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative w-full bg-white py-14 md:py-20 overflow-hidden">
      {/* SVG Background Pattern */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03] text-amber-900"
        aria-hidden="true">
        <defs>
          <pattern
            id="collection-pattern"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="1.5" fill="currentColor" />
            <circle
              cx="40"
              cy="40"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle
              cx="40"
              cy="40"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
            />
            <path
              d="M40 24 L44 32 L40 40 L36 32 Z M40 56 L44 48 L40 40 L36 48 Z M24 40 L32 44 L40 40 L32 36 Z M56 40 L48 44 L40 40 L48 36 Z"
              fill="currentColor"
              opacity="0.4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#collection-pattern)" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="relative mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-gray-500 font-light tracking-wide">
              {subtitle}
            </p>
          )}

          {/* Divider */}
          <div
            className="flex items-center justify-center gap-2 mt-5"
            aria-hidden="true">
            <div className="h- w-8 bg-gray-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <div className="h- w-8 bg-gray-200" />
          </div>

          {/* Arrows */}
          <div className="flex justify-center gap-3 mt-6 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-600
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
              className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-600
                hover:bg-gray-50 hover:border-gray-300 transition disabled:opacity-30
                disabled:cursor-not-allowed flex items-center justify-center shadow-sm
                focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
                motion-reduce:transition-none">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scroll Row */}
        <div className="relative">
          {/* Fade edges on mobile */}
          <div
            className={`pointer-events-none absolute left-0 top-0 bottom-6 z-10 w-8 bg-gradient-to-r from-white to-transparent transition-opacity ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          />
          <div
            className={`pointer-events-none absolute right-0 top-0 bottom-6 z-10 w-8 bg-gradient-to-l from-white to-transparent transition-opacity ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          />

          <div
            ref={scrollRef}
            role="list"
            aria-label={title}
            className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
              [scroll-padding-inline:1rem] motion-reduce:scroll-auto">
            {items.map((item, idx) => {
              const name = item?.name || "";
              const slug = slugify(name || "collection");
              const imageUrl = item?.imageUrl || "/placeholder.png";
              const count = item?.count;

              return (
                <Link
                  key={item?.id ?? `collection-${idx}`}
                  to={`/collection/${slug}`}
                  role="listitem"
                  className="snap-start flex-shrink-0 w- sm:w- group focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-4 rounded-2xl">
                  <div
                    className="bg-white rounded-2xl border border-gray-100 p-6 text-center
                      shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300
                      hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:border-gray-200
                      motion-reduce:transition-none motion-reduce:hover:transform-none
                      [content-visibility:auto]">
                    {/* Image */}
                    <div className="w-36 h-36 mx-auto mb-5 rounded-full overflow-hidden bg-gray-50 ring-4 ring-gray-50 group-hover:ring-amber-50 transition">
                      <img
                        src={imageUrl}
                        alt={name}
                        loading="lazy"
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-amber-700 transition">
                      {name}
                    </h3>

                    {/* Count */}
                    {count != null && (
                      <p className="text-xs text-gray-500 mt-1 font-light">
                        {count} {count === 1 ? "item" : "items"}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(CollectionGrid);
