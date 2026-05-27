import React, { useState } from "react";
import { Icon } from "./ResubleComponents";
import { useDark } from "../../context/DarkCtx";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop";

const CollectionCard = React.memo(({ collection, onSelect }) => {
  const { dark } = useDark();
  const [imgError, setImgError] = useState(false);

  if (!collection) return null;

  const handleClick = () => onSelect?.(collection);

  const imageSrc =
    !imgError && collection?.image ? collection.image : FALLBACK_IMAGE;

  return (
    <div
      onClick={handleClick}
      className={`group relative flex-shrink-0 
      w-[220px] sm:w-[250px] md:w-[280px]
      snap-start rounded-2xl overflow-hidden
      transition-all duration-300 shadow-sm cursor-pointer
      hover:-translate-y-1 hover:shadow-xl
      ${
        dark
          ? "bg-[#202c33] border border-[#2a3942] hover:bg-[#1f2c34]"
          : "bg-white border border-gray-200 hover:bg-gray-50"
      }`}>
      {/* IMAGE SECTION */}
      <div className="relative w-full h-[180px] sm:h-[210px] md:h-[230px] overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={collection?.label || "Collection"}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="p-3 sm:p-4">
        <h4
          className={`text-sm sm:text-base font-semibold leading-snug line-clamp-1
          ${dark ? "text-[#e9edef]" : "text-[#111B21]"}`}>
          {collection?.label || "Organic Collection"}
        </h4>

        {collection?.desc ? (
          <p
            className={`text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed
            ${dark ? "text-[#8696a0]" : "text-[#667781]"}`}>
            {collection.desc}
          </p>
        ) : (
          <p
            className={`text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed
            ${dark ? "text-[#8696a0]" : "text-[#667781]"}`}>
            Explore premium organic and farm-fresh products from this
            collection.
          </p>
        )}
      </div>

      {/* DIVIDER */}
      <div
        className={`h-[1px] w-full ${dark ? "bg-[#2a3942]" : "bg-gray-200"}`}
      />

      {/* BUTTON */}
      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.98]
        ${
          dark
            ? "text-[#00a884] hover:bg-[#2a3942]/50"
            : "text-[#008069] hover:bg-gray-50"
        }`}>
        <span>Browse {collection?.label || "Collection"}</span>

        <Icon
          name="chevronRight"
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </button>
    </div>
  );
});

export default CollectionCard;
