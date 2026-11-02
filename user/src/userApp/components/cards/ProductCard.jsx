import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  memo,
} from "react";
import {
  CheckIcon,
  ShoppingBagIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { useCart } from "../../features/cart/context/CartContext";
import { useNavigate } from "react-router-dom";

/* ─── Indian Currency Formatter (Matching RelatedProducts e.g. 449 -> 449.00) ─── */
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

/* ─────────────────────────────────────────────────────────────
   ProductCard - Matches RelatedProducts Typography & Aesthetics
───────────────────────────────────────────────────────────── */
const ProductCard = ({ product, index = 0, compact = true }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const timerRef = useRef(null);

  const { addToCart, syncing: cartSyncing } = useCart();
  const navigate = useNavigate();

  const mainImage = product.banner || product.images?.[0];
  const price = Number(product.price || 0);
  const originalPrice = Number(product.originalPrice ?? product.mrp ?? 0);

  const discount = useMemo(() => {
    if (!originalPrice || !price || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }, [originalPrice, price]);

  const rating = Number(product.rating || 4.8);
  const reviews = Number(product.reviews ?? product.totalReviews ?? 42);
  const weight = useMemo(() => getProductWeight(product), [product]);

  const isSharkTank =
    Boolean(product.isSharkTank) ||
    Boolean(product.sharkTank) ||
    (Array.isArray(product.tags) &&
      product.tags.some((t) => String(t).toLowerCase().includes("shark")));

  const isSellingFast =
    Boolean(product.sellingFast) ||
    Boolean(product.isBestSeller) ||
    (rating >= 4.7 && reviews >= 40) ||
    index === 0;

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleNavigate = useCallback(() => {
    navigate(`/product/${product.slug || product.id}`);
  }, [navigate, product.slug, product.id]);

  const handleAddToCart = useCallback(
    async (e) => {
      e.stopPropagation();
      if (isAdded || cartSyncing) return;

      try {
        await addToCart({
          id: product.id,
          selectedSize: "",
          selectedQuantity: 1,
          name: product.name ?? "",
          price: product.price ?? null,
          image: product.banner ?? product.images?.[0] ?? "",
        });

        setIsAdded(true);
        timerRef.current = setTimeout(() => setIsAdded(false), 2000);
      } catch (err) {
        console.error("Couldn't add to cart", err);
      }
    },
    [
      isAdded,
      cartSyncing,
      addToCart,
      product.id,
      product.name,
      product.price,
      product.banner,
      product.images,
    ],
  );

  return (
    <article
      onClick={handleNavigate}
      className="group flex flex-col h-full w-full text-left bg-white rounded-xl cursor-pointer select-none transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315c3c]">
        {/* ── IMAGE WRAPPER ── */}
        <div className="relative w-full aspect-square bg-[#faf9f5]/50 sm:bg-transparent rounded-2xl sm:rounded-none overflow-hidden flex items-center justify-center p-3 sm:p-5">
          {/* Skeleton while image loads */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-[#f4f2e9] animate-pulse rounded-xl" />
          )}

          {/* ── Discount Badge (Top Left, Earthy Deep Brown #7B4627) ── */}
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

          {/* ── Weight / Size Badge (Top Right, Golden Yellow Circle #FAB81E) ── */}
          {weight && (
            <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FAB81E] text-gray-950 font-bold text-[9px] sm:text-[10px] flex items-center justify-center shadow-xs pointer-events-none">
              {weight}
            </div>
          )}

          {/* ── Optional Shark Tank Badge ── */}
          {isSharkTank && (
            <div className="absolute top-2 right-10 sm:top-2.5 sm:right-12 z-10 bg-[#0B2545] text-[#FAB81E] font-black text-[7px] sm:text-[8px] uppercase px-1.5 py-0.5 rounded leading-tight tracking-wider text-center pointer-events-none">
              SHARK
              <br />
              APPROVED
            </div>
          )}

          {/* ── Selling Fast Pill (Bottom of Image #D89C3A) ── */}
          {isSellingFast && (
            <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 z-10 inline-flex items-center gap-1 bg-[#D89C3A] text-white text-[9px] sm:text-[10px] font-medium px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs pointer-events-none">
              <span className="text-[10px] sm:text-[11px] leading-none">⚡</span>
              <span>Selling Fast</span>
            </div>
          )}

          {/* ── Centered Image with Hover Zoom ── */}
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

        {/* ── PRODUCT DETAILS (Matching RelatedProducts Typography) ── */}
        <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-1.5 flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-xs sm:text-sm md:text-[15px] font-normal sm:font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-[#315c3c] transition-colors">
            {product.name}
          </h3>

          {/* Star Rating & Review Count */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm pt-0.5">
            <StarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F59E0B] fill-current shrink-0" />
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

          {/* Add to Cart Button */}
          <div className="mt-auto pt-2.5">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={cartSyncing || isAdded}
              className={`flex w-full items-center justify-center gap-1.5 rounded-lg py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#315c3c]/30 active:scale-[0.98] disabled:opacity-70 ${
                isAdded
                  ? "bg-[#47724d] text-white"
                  : "bg-[#315c3c] text-white hover:bg-[#25482f]"
              }`}>
              {isAdded ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBagIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Add to cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </article>
    );
  };

export default memo(ProductCard);
