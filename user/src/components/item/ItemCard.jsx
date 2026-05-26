import React, { useState, useCallback } from "react";
import { FaPlus, FaSpinner, FaRupeeSign, FaCheck } from "react-icons/fa";
import { CartService } from "../../services/cartService";
import { COLORS } from "../../style/theme";

const ItemCard = ({ item, onDetailClick }) => {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const handleAddToCart = useCallback(
    async (e) => {
      e.stopPropagation();
      if (adding || added) return;

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) {
        setError("Please login to add items to cart");
        setTimeout(() => setError(""), 3000);
        return;
      }

      const unit = item?.price?.[0]?.unit;
      if (!unit) return;

      try {
        setAdding(true);
        setError("");
        await CartService.addToCart(user._id, item._id, 1, unit);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to add to cart");
        setTimeout(() => setError(""), 3000);
      } finally {
        setAdding(false);
      }
    },
    [adding, added, item._id, item?.price],
  );

  const firstPrice = item?.price?.[0];

  return (
    <div
      onClick={onDetailClick}
      className="group flex flex-col rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 overflow-hidden h-full cursor-pointer relative"
      style={{ background: COLORS.light, borderColor: COLORS.secondary }}>
      {/* Error Toast */}
      {error && (
        <div className="absolute top-2 left-2 right-2 z-10 bg-red-500 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-md text-center">
          {error}
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square w-full bg-[#f8f9fa] overflow-hidden p-4 flex items-center justify-center">
        <img
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
          src={
            item.banner ||
            "https://via.placeholder.com/300x300?text=Product+Image"
          }
          alt={item.name}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col p-4 flex-1 gap-2">
        <h3
          className="text-[14px] font-medium leading-snug line-clamp-2 h-10"
          style={{ color: COLORS.text }}
          title={item.name}>
          {item.name}
        </h3>

        {firstPrice && (
          <div className="flex items-end justify-between mt-auto pt-2">
            {/* Price */}
            <div className="flex flex-col">
              <span
                className="text-[12px] mb-0.5 font-medium uppercase tracking-wider"
                style={{ color: COLORS.textAlt }}>
                {firstPrice.unit}
              </span>
              <div
                className="flex items-center font-bold text-[16px]"
                style={{ color: COLORS.text }}>
                <FaRupeeSign className="text-[14px]" />
                <span>{firstPrice.price?.toFixed(2)}</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={adding || added}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full shadow-sm border transition-colors duration-200 disabled:cursor-not-allowed
                ${
                  added
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-white border-gray-200 hover:bg-[#2874f0] hover:text-white hover:border-[#2874f0]"
                }`}
              style={{ color: added ? undefined : COLORS.text }}
              aria-label="Add to cart">
              {adding ? (
                <FaSpinner className="animate-spin text-[14px] text-gray-500" />
              ) : added ? (
                <FaCheck className="text-[14px]" />
              ) : (
                <FaPlus className="text-[14px]" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ItemCard);
