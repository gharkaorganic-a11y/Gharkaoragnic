import React, { useMemo } from "react";
import { useDark } from "../../context/DarkCtx";
import StarRating from "./StarRating";

const BotProductCard = React.memo(({ item, onOrder }) => {
  const { dark } = useDark();

  if (item?.isDeleted) return null;

  const name = (item.name || item.title || "").replace(/\n/g, "").trim();
  const price = Number(item.price || 0);
  const originalPrice = Number(item.originalPrice || 0);

  const hasDiscount = originalPrice > 0 && price > 0 && originalPrice > price;
  const discountPct = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const rating = item.rating ?? 4.3;
  const reviews = item.reviews ?? 120;

  // More robust currency formatter
  const formatPrice = (v) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(v);

  const message = useMemo(
    () => item.waMessage || `Hi! I want to order ${name}`,
    [item, name],
  );

  return (
    <div
      className={`group relative flex-shrink-0 w-[260px] sm:w-[280px] snap-start rounded-2xl overflow-hidden transition-all duration-300 shadow-sm
      ${
        // WhatsApp incoming message bubble colors
        dark
          ? "bg-[#202c33] border border-[#2a3942]"
          : "bg-white border border-gray-200"
      }
      `}>
      {/* IMAGE SECTION */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
        {item.banner || item.images?.[0] ? (
          <img
            src={item.banner || item.images?.[0]}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center text-5xl ${
              dark ? "bg-[#111b21]" : "bg-[#f0f2f5]"
            }`}>
            🌿
          </div>
        )}

        {/* DISCOUNT BADGE */}
        {discountPct && (
          <span className="absolute top-2 left-2 bg-[#25D366] text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-sm">
            {discountPct}% OFF
          </span>
        )}

        {/* ORGANIC TAG */}
        <span
          className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-1 rounded-md shadow-sm
          ${
            dark
              ? "bg-[#111b21]/80 text-[#25D366] backdrop-blur"
              : "bg-white/90 text-green-700 backdrop-blur"
          }`}>
          🌿 Organic
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-3 sm:p-3.5">
        {/* TITLE */}
        <h4
          className={`text-[15px] sm:text-[16px] font-medium leading-snug line-clamp-1 ${
            dark ? "text-[#e9edef]" : "text-[#111B21]"
          }`}>
          {name}
        </h4>

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className={`text-[15px] sm:text-[16px] font-bold ${
              dark ? "text-[#e9edef]" : "text-[#111b21]"
            }`}>
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span
              className={`text-[12px] line-through ${
                dark ? "text-[#8696a0]" : "text-gray-400"
              }`}>
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* RATING */}
        <div className="mt-1.5">
          <StarRating rating={rating} count={reviews} />
        </div>

        {/* DESCRIPTION */}
        {item.description && (
          <p
            className={`text-[13px] mt-1.5 line-clamp-2 leading-relaxed ${
              dark ? "text-[#8696a0]" : "text-[#667781]"
            }`}>
            {item.description}
          </p>
        )}
      </div>

      {/* WHATSAPP INTERACTIVE BUTTONS SECTION */}
      <div className="flex flex-col w-full">
        {/* Separator line native to WA interactive messages */}
        <div
          className={`h-[1px] w-full ${dark ? "bg-[#2a3942]" : "bg-gray-200"}`}></div>

        <div className="flex flex-col">
          {/* VIEW LINK (Optional Secondary Action) */}
          {item.slug && (
            <>
              <a
                href={`/product/${item.slug}`}
                className={`w-full flex items-center justify-center py-3 text-[14px] font-medium hover:opacity-80 transition-opacity
                  ${dark ? "text-[#00a884]" : "text-[#008069]"}`}>
                View full details
              </a>
              <div
                className={`h-[1px] w-full ${
                  dark ? "bg-[#2a3942]" : "bg-gray-200"
                }`}></div>
            </>
          )}

          {/* PRIMARY ORDER BUTTON */}
          <button
            onClick={() => onOrder?.(message)}
            className={`w-full flex items-center justify-center gap-2 py-3 text-[14px] font-medium transition-all active:scale-[0.98]
              ${
                dark
                  ? "text-[#00a884] hover:bg-[#2a3942]/50"
                  : "text-[#008069] hover:bg-gray-50"
              }
            `}>
            {/* Native WhatsApp SVG Icon */}
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              className="fill-current">
              <path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.12.553 4.118 1.536 5.869L.015 24l6.29-1.649A11.956 11.956 0 0011.999 24c6.627 0 12-5.373 12-12s-5.373-12-12-12zM12 21.955c-1.802 0-3.513-.464-5.019-1.3l-.36-.201-3.73.978.995-3.633-.22-.35A9.957 9.957 0 012.045 12c0-5.494 4.47-9.965 9.955-9.965 5.485 0 9.955 4.471 9.955 9.965 0 5.494-4.47 9.955-9.955 9.955zm5.48-7.514c-.301-.151-1.782-.88-2.059-.981-.277-.101-.479-.151-.681.151-.201.302-.781.981-.958 1.182-.176.201-.353.226-.654.075-1.319-.661-2.457-1.467-3.411-2.738-.246-.328-.026-.48.125-.63.134-.134.301-.352.452-.529.151-.176.201-.301.301-.502.101-.201.05-.377-.025-.528-.075-.151-.681-1.642-.933-2.25-.246-.593-.496-.513-.681-.523-.176-.008-.378-.008-.579-.008-.201 0-.528.075-.805.377-.277.301-1.056 1.03-1.056 2.511 0 1.482 1.082 2.914 1.232 3.115.151.201 2.122 3.238 5.14 4.542 2.02.871 2.766.78 3.32.655.632-.142 1.782-.728 2.033-1.432.251-.703.251-1.306.176-1.432-.075-.126-.277-.201-.579-.352z"></path>
            </svg>
            Order on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
});

export default BotProductCard;
