import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { slugify } from "../../utils/slugify";

const CollectionGrid = ({
  items = [],
  title = "Shop by Collection",
  subtitle = "Authentic • Pure • Homemade",
}) => {
  const scrollRef = useRef(null);

  if (!Array.isArray(items) || !items.length) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="w-full bg-white py-12 md:py-16 overflow-hidden">
      {/* Ensure fonts are loaded (can be removed if already in index.html) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header Section (Matching ProductSection) ── */}
        <div className="relative mb-10 md:mb-14">
          <div className="text-center flex flex-col items-center">
            {/* Title */}
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-2xl sm:text-3xl md:text-[38px] font-bold text-[#111] leading-tight tracking-[-0.02em]">
              {title}
            </h2>

            {/* Subtitle with Custom Line-Dot Divider */}
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
          </div>

          {/* Navigation Arrows (Absolute on Desktop, Centered below on Mobile) */}
          <div className="flex items-center justify-center gap-3 mt-6 md:mt-0 md:absolute md:right-0 md:bottom-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full border border-[#e8e8e8] bg-white text-gray-600 hover:border-[#c8102e] hover:bg-[#c8102e] hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#c8102e]">
              <ChevronLeftIcon className="w-5 h-5 stroke-[2.5px]" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full border border-[#e8e8e8] bg-white text-gray-600 hover:border-[#c8102e] hover:bg-[#c8102e] hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#c8102e]">
              <ChevronRightIcon className="w-5 h-5 stroke-[2.5px]" />
            </button>
          </div>
        </div>

        {/* ── Horizontal Scroll Grid ── */}
        <div
          ref={scrollRef}
          className="flex gap-5 sm:gap-6 lg:gap-8 overflow-x-auto pb-8 pt-4 px-2 -mx-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, idx) => {
            const name = String(item?.name ?? "").trim();
            const imageUrl = item?.imageUrl || "/placeholder.png";
            const slug = slugify(item?.name || "collection");
            const count = item?.count;

            return (
              <Link
                key={item?.id || idx}
                to={`/collection/${slug}`}
                className="group flex-shrink-0 snap-start w-[75vw] sm:w-[280px] lg:w-[320px] outline-none">
                <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-[#f3f3f3] transition-all duration-500 ease-out py-10 px-6 flex flex-col items-center text-center group-hover:-translate-y-1.5">
                  {/* Circular Image with inner shadow/ring */}
                  <div className="w-44 h-44 sm:w-52 sm:h-52 mb-8 rounded-full overflow-hidden bg-[#fdf7f2] ring-8 ring-[#fdf0f2]/50 group-hover:ring-[#fdf0f2] transition-all duration-500 relative">
                    <img
                      src={imageUrl}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none border border-black/5" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#111] group-hover:text-[#c8102e] transition-colors duration-300 tracking-wide mb-2">
                    {name}
                  </h3>

                  {/* Item Count */}
                  {count != null && (
                    <p className="text-[11px] font-medium text-[#6b6b6b] uppercase tracking-[0.1em]">
                      {count} {count === 1 ? "Item" : "Items"}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CollectionGrid;
