import React, { useState, useMemo, useCallback } from "react";
import { Check, Star } from "lucide-react";
import { useCart } from "../../features/cart/context/CartContext";
import { useNavigate } from "react-router-dom";
import NotificationProduct from "./NotificationProduct";

const priceFormatter = new Intl.NumberFormat("en-IN");

const ProductCard = ({ product }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const { addToCart, syncing: cartSyncing } = useCart();
  const navigate = useNavigate();

  const mainImage = product.banner || product.images?.[0];

  // Defaults
  const rating = product.rating || 4.7;
  const reviews = product.reviews || 1823;
  const tags = product.tags || [
    "Medium spicy",
    "Jain Friendly",
    "Sunflower Oil",
  ];

  const discount = useMemo(() => {
    if (!product.originalPrice || !product.price) return 0;

    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100,
    );
  }, [product.originalPrice, product.price]);

  const formatPrice = (price) => priceFormatter.format(price);

  const handleNavigate = useCallback(() => {
    navigate(`/product/${product.slug || product.id}`);
  }, [navigate, product.slug, product.id]);

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    try {
      await addToCart({
        id: product.id,
        selectedSize: "",
        selectedQuantity: 1,
      });

      setIsAdded(true);

      setNotification({
        show: true,
        message: "Added to cart",
        type: "success",
      });

      setTimeout(() => setIsAdded(false), 2000);
    } catch {
      setNotification({
        show: true,
        message: "Error adding to cart",
        type: "error",
      });
    }
  };

  return (
    <>
      {notification.show && (
        <NotificationProduct
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
        />
      )}

      <div
        className="group flex flex-col w-full cursor-pointer font-[Poppins]"
        onClick={handleNavigate}>
        {/* Image */}
        <div className="relative w-full aspect-[3/4] bg-[#fdf7f2] overflow-hidden">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}

          <img
            src={mainImage}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Info */}
        <div className="pt-2 pb-3 px-1.5 sm:px-2 text-center">
          {/* Name */}
          <h3 className="text-[12px] sm:text-[14px] font-semibold text-gray-800 leading-snug line-clamp-2 min-h-[34px]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center justify-center gap-1 mt-1 text-[11px] sm:text-sm text-gray-700">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{rating}</span>
            <span className="text-gray-500">| {reviews}</span>
          </div>

          {/* Tags (limit on mobile) */}
          <div className="flex justify-center gap-1.5 mt-2">
            {(window.innerWidth < 640 ? tags.slice(0, 2) : tags).map(
              (tag, i) => (
                <span
                  key={i}
                  className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-yellow-200 text-gray-800 font-medium whitespace-nowrap">
                  {tag}
                </span>
              ),
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-center gap-1 mt-2">
            <span className="text-[13px] sm:text-[15px] font-semibold text-gray-900">
              ₹{formatPrice(product.price)}
            </span>

            {discount > 0 && (
              <span className="text-[10px] sm:text-[12px] text-gray-400 line-through">
                ₹{formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={cartSyncing || isAdded}
            className={`mt-2 w-full py-2 text-[11px] sm:text-[13px] font-semibold tracking-wide rounded transition-all duration-300 ${
              isAdded
                ? "bg-green-600 text-white"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}>
            {isAdded ? (
              <span className="flex items-center justify-center gap-1">
                <Check size={14} /> Added
              </span>
            ) : (
              "ADD TO CART"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default React.memo(ProductCard);
