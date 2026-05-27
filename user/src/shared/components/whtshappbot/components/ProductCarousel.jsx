import React, { useRef, useState, useEffect } from "react";
import BotProductCard from "./BotProductCard";
import { Icon } from "./BotUIComponents"; // Adjust path as needed

const ProductCarousel = ({ items = [], onOrder, dark }) => {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // ── Smart Scroll Detection ───────────────────────
  // Hides/shows arrows based on scroll position
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    // Check if we are at the start
    setShowLeft(scrollLeft > 0);
    // Check if we reached the end (adding 2px buffer for rounding errors)
    setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [items]);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 170, behavior: "smooth" });
  };

  if (!items || items.length === 0) return null;

  // ── Theme Classes ────────────────────────────────
  const btnBase =
    "absolute top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full border flex items-center justify-center cursor-pointer shadow-md transition-all duration-200 hover:scale-110 active:scale-95";
  const btnTheme = dark
    ? "bg-[#2a3942] border-[#3a4a54] text-[#25D366]"
    : "bg-white border-gray-200 text-[#008069]";

  return (
    <div className="relative w-full max-w-[340px] group">
      {/* ── Left Navigation Button ── */}
      <button
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className={`${btnBase} ${btnTheme} -left-3 ${showLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <Icon name="back" size={14} />
      </button>

      {/* ── Carousel Track ── */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-1 px-0.5"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
          WebkitOverflowScrolling: "touch",
        }}>
        {/* Hide Scrollbar for Webkit browsers */}
        <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>

        {items.map((item) => (
          <div
            key={item.id || item.name}
            className="snap-start shrink-0 hide-scroll">
            <BotProductCard item={item} onOrder={onOrder} />
          </div>
        ))}
      </div>

      {/* ── Right Navigation Button ── */}
      <button
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className={`${btnBase} ${btnTheme} -right-3 ${showRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {/* Reusing the back icon and rotating it 180 degrees for consistency */}
        <span className="rotate-180 flex items-center justify-center">
          <Icon name="back" size={14} />
        </span>
      </button>
    </div>
  );
};

export default React.memo(ProductCarousel);
