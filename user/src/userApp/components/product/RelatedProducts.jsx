import React, { memo, useState } from "react";
import { Link } from "react-router-dom";

/* ─── Indian Currency Formatter (e.g. 449 -> 449.00) ─── */
const formatPrice = (val) => {
  const num = Number(val || 0);
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/* ─── Extract weight/size for yellow circular badge (e.g. "300g", "200g", "100g") ─── */
const getProductWeight = (product) => {
  if (product.weight) return String(product.weight);
  if (product.netWeight) return String(product.netWeight);
  if (Array.isArray(product.sizes) && product.sizes.length > 0) {
    return String(product.sizes[0]);
  }
  // Fallback: extract weight from product title (e.g. "300g", "1kg", "250ml", "100 gm")
  const match = product.name?.match(/\b(\d+\s*(?:g|kg|ml|l|gm))\b/i);
  return match ? match[1].replace(/\s+/g, "") : null;
};

/* ─── Single Clean Borderless Card (Matching Reference Design) ─── */
const RelatedProductCard = memo(({ product, index = 0 }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const mainImage = product.banner || product.images?.[0];

  const price = Number(product.price || 0);
  const originalPrice = Number(product.originalPrice ?? product.mrp ?? 0);
  const discount =
    originalPrice > price && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const rating = Number(product.rating || 4.8);
  const reviews = Number(product.reviews ?? product.totalReviews ?? 42);
  const weight = getProductWeight(product);

  const isSharkTank =
    Boolean(product.isSharkTank) ||
    Boolean(product.sharkTank) ||
    (Array.isArray(product.tags) &&
      product.tags.some((t) => String(t).toLowerCase().includes("shark")));

  const isSellingFast =
    Boolean(product.sellingFast) ||
    Boolean(product.isBestSeller) ||
    (rating >= 4.7 && reviews >= 50) ||
    index === 0;

  const productUrl = `/product/${product.slug || product.id}`;

  return (
    <Link
      to={productUrl}
      className="group flex flex-col h-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315c3c] rounded-xl transition-all duration-300">
      {/* ── IMAGE WRAPPER ── */}
      <div className="relative w-full aspect-square bg-[#faf9f5]/50 sm:bg-transparent rounded-2xl sm:rounded-none overflow-hidden flex items-center justify-center p-3 sm:p-5 select-none">
        {/* Skeleton while loading */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-[#f4f2e9] animate-pulse rounded-xl" />
        )}

        {/* ── Discount Badge (Top Left, Deep Earthy Brown) ── */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 bg-[#7B4627] text-white rounded-md px-1.5 py-1 sm:px-2 sm:py-1.5 text-center leading-none shadow-xs pointer-events-none">
            <span className="block text-[10px] sm:text-[11px] font-bold tracking-tight">
              {discount}%
            </span>
            <span className="block text-[8px] sm:text-[9px] font-bold tracking-wider uppercase opacity-90 mt-0.5">
              OFF
            </span>
          </div>
        )}

        {/* ── Weight / Size Badge (Top Right, Golden Yellow Circle) ── */}
        {weight && (
          <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FAB81E] text-gray-950 font-bold text-[9px] sm:text-[10px] flex items-center justify-center shadow-xs pointer-events-none">
            {weight}
          </div>
        )}

        {/* ── Optional Shark Tank Approved Badge ── */}
        {isSharkTank && (
          <div className="absolute top-2 right-10 sm:top-2.5 sm:right-12 z-10 bg-[#0B2545] text-[#FAB81E] font-black text-[7px] sm:text-[8px] uppercase px-1.5 py-0.5 rounded leading-tight tracking-wider text-center pointer-events-none">
            SHARK
            <br />
            APPROVED
          </div>
        )}

        {/* ── Selling Fast Pill (Bottom of Image) ── */}
        {isSellingFast && (
          <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 z-10 inline-flex items-center gap-1 bg-[#D89C3A] text-white text-[9px] sm:text-[10px] font-medium px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs pointer-events-none">
            <span className="text-[10px] sm:text-[11px] leading-none">⚡</span>
            <span>Selling Fast</span>
          </div>
        )}

        {/* ── Clean Centered Product Image with Hover Zoom ── */}
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)}
            className={`w-full h-full object-contain max-h-[220px] sm:max-h-[260px] md:max-h-[280px] transition-transform duration-500 ease-out group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400 font-medium">
            Ghar Ka Organic
          </div>
        )}
      </div>

      {/* ── PRODUCT DETAILS (Below Image) ── */}
      <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-1.5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-xs sm:text-sm md:text-[15px] font-normal sm:font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-[#315c3c] transition-colors">
          {product.name}
        </h3>

        {/* Star Rating & Review Count */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm pt-0.5">
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F59E0B] fill-current shrink-0"
            viewBox="0 0 20 20"
            aria-hidden="true">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-bold text-gray-900 text-xs sm:text-sm">
            {rating.toFixed(1)}
          </span>
          <span className="text-gray-500 font-normal text-xs sm:text-sm">
            ({reviews > 0 ? reviews.toLocaleString("en-IN") : "0"} reviews)
          </span>
        </div>

        {/* Price Line (Matching Reference: Rs. 449.00  Rs. 640.00) */}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-0.5">
          <span className="text-sm sm:text-base font-medium text-gray-900">
            Rs. {formatPrice(price)}
          </span>
          {originalPrice > price && (
            <span className="text-xs sm:text-sm text-gray-400 line-through font-normal">
              Rs. {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});

RelatedProductCard.displayName = "RelatedProductCard";

/* ─── Skeleton Loading Cards (Matching Layout & Expanded Gap) ─── */
const SkeletonRelatedCard = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="w-full aspect-square bg-[#f4f2e9] rounded-2xl sm:rounded-none" />
    <div className="mt-3 sm:mt-4 space-y-2">
      <div className="h-4 bg-[#f4f2e9] rounded w-4/5" />
      <div className="h-3.5 bg-[#f4f2e9] rounded w-1/2" />
      <div className="h-4 bg-[#f4f2e9] rounded w-1/3" />
    </div>
  </div>
);

/* ─── Main Related Products Section ─── */
const RelatedProducts = ({
  products = [],
  loading = false,
  title = "You may also like",
  maxItems = 4,
}) => {
  const visibleProducts = (Array.isArray(products) ? products : []).slice(
    0,
    maxItems,
  );

  if (!loading && visibleProducts.length === 0) return null;

  return (
    <section className="w-full bg-white py-12 sm:py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Title ── */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 tracking-tight">
            {title}
          </h2>
        </div>

        {/* ── Responsive Grid with Generous Gap ("gap use more and please make repsoive") ── */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 md:grid-cols-3 md:gap-x-10 lg:grid-cols-4 lg:gap-x-12 xl:gap-x-14 lg:gap-y-14">
          {loading
            ? Array.from({ length: maxItems }).map((_, i) => (
                <SkeletonRelatedCard key={i} />
              ))
            : visibleProducts.map((p, idx) => (
                <RelatedProductCard
                  key={p.id || p.slug || idx}
                  product={p}
                  index={idx}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default memo(RelatedProducts);
