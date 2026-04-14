import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  CheckIcon,
  ShoppingBagIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { useCart } from "../../features/cart/context/CartContext";
import { useNavigate } from "react-router-dom";
import NotificationProduct from "./NotificationProduct";

/* ─── Price formatter ─── */
const priceFormatter = new Intl.NumberFormat("en-IN");
const formatPrice = (price) => priceFormatter.format(price);

/* ─────────────────────────────────────────────
   ProductCard - Heroicons + Clean Design
───────────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const timerRef = useRef(null);

  const { addToCart, syncing: cartSyncing, setCartOpen } = useCart();
  const navigate = useNavigate();

  const mainImage = product.banner || product.images?.[0];
  const rating = product.rating ?? 4.7;
  const reviews = product.reviews ?? 1823;
  const tags = product.tags ?? [
    "Medium Spicy",
    "Jain Friendly",
    "Sunflower Oil",
  ];

  const discount = useMemo(() => {
    if (!product.originalPrice || !product.price) return 0;
    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100,
    );
  }, [product.originalPrice, product.price]);

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
        });

        setIsAdded(true);
        setNotification({
          show: true,
          message: "Item Added to cart!",
          type: "success",
        });

        setTimeout(() => {
          setCartOpen(true);
        }, 400);

        timerRef.current = setTimeout(() => setIsAdded(false), 2000);
      } catch {
        setNotification({
          show: true,
          message: "Couldn't add to cart",
          type: "error",
        });
      }
    },
    [isAdded, cartSyncing, addToCart, product.id, setCartOpen],
  );

  const closeNotification = useCallback(
    () => setNotification((p) => ({ ...p, show: false })),
    [],
  );

  return (
    <>
      {notification.show && (
        <NotificationProduct
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <article
        className="group flex flex-col w-full cursor-pointer bg-white  border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 active:scale-[0.98]"
        onClick={handleNavigate}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleNavigate()}>
        {/* ── Image ── */}
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-50">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gray-100" />
          )}
          <img
            src={mainImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition duration-500 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {discount > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-[#c8102e] text-white  px-2 py-1 ">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* ── Info ── */}
        <div className="flex flex-col p-3 sm:p-3.5 gap-2 flex-1">
          {/* Name */}
          <h3 className="text- sm:text-sm font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[2.5em]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <StarIcon className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-gray-900">{rating}</span>
            <span>·</span>
            <span>
              {reviews > 999 ? `${(reviews / 1000).toFixed(1)}k` : reviews}
            </span>
          </div>

          {/* Tags - max 2 on mobile */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className="text- font-medium px-2 py-0.5 bg-[#fef9ee] text-[#92640a] ">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-auto pt-1">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              ₹{formatPrice(product.price)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through">
                ₹{formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Cart button */}
          <button
            className={`w-full py-2.5  text-xs font-bold tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.97] disabled:opacity-70
            ${
              isAdded
                ? "bg-[#1a7f4b] text-white focus:ring-[#1a7f4b]/30"
                : "bg-[#c8102e] text-white hover:bg-[#a80d27] focus:ring-[#c8102e]/30"
            }`}
            onClick={handleAddToCart}
            disabled={cartSyncing || isAdded}>
            {isAdded ? (
              <>
                <CheckIcon className="w-3.5 h-3.5" />
                Added
              </>
            ) : (
              <>
                <ShoppingBagIcon className="w-3.5 h-3.5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </article>
    </>
  );
};

export default React.memo(ProductCard);
