import React, { useRef, useState, useEffect } from "react";
import CollectionCard from "./CollectionCard";
import { Icon } from "./ResubleComponents";

const CollectionCarousel = ({
  collections = [],
  onSelect,
  dark,
  loading = false,
}) => {
  const ref = useRef(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  // Check if arrows should show
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const checkScroll = () => {
      setCanScroll({
        left: el.scrollLeft > 5,
        right: el.scrollLeft < el.scrollWidth - el.clientWidth - 5,
      });
    };

    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [collections]);

  const scroll = (dir) =>
    ref.current?.scrollBy({ left: dir * 270, behavior: "smooth" });

  // Loading skeleton
  if (loading) {
    return (
      <div style={{ display: "flex", gap: 8, overflowX: "hidden" }}>
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            style={{
              flex: "0 0 260px",
              height: 280,
              borderRadius: 16,
              background: dark ? "#2a3942" : "#e5e7eb",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        ))}
      </div>
    );
  }

  if (!collections?.length) return null;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340 }}>
      {/* Left Arrow */}
      {canScroll.left && (
        <button
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          style={{
            position: "absolute",
            left: -10,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: dark ? "#2a3942" : "#fff",
            border: "0.5px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
            color: "#008069",
            transition: "opacity 0.2s",
          }}>
          <Icon name="back" size={14} />
        </button>
      )}

      {/* Scroll Container */}
      <div
        ref={ref}
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingBottom: 4,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          paddingLeft: 2,
          paddingRight: 2,
        }}
        className="hide-scrollbar">
        {collections.map((col) => (
          <CollectionCard key={col.id} collection={col} onSelect={onSelect} />
        ))}
      </div>

      {/* Right Arrow */}
      {canScroll.right && (
        <button
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          style={{
            position: "absolute",
            right: -10,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: dark ? "#2a3942" : "#fff",
            border: "0.5px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
            color: "#008069",
            transition: "opacity 0.2s",
          }}>
          <Icon name="chevronRight" size={14} />
        </button>
      )}

      <style>{`
       .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default React.memo(CollectionCarousel);
