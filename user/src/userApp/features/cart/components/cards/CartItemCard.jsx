import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import QuantityPopup from "../../../../components/pop-up/QuantityPopup";
import SizePopup from "../../../../components/pop-up/SizePopup";
import { ChevronDown, Trash2, Heart, Truck } from "lucide-react";

// ─── Premium D2C Theme Colors ──────────────────
// Primary Brand Green: #00A859 (Trust, delivery, success)
// Deep Crimson Red:    #8B0000 (Urgency, discount, removal actions)
// Dark Text:           #2C2416 (Readability)
// ───────────────────────────────────────────────

const CartItemCard = ({
  product,
  onRemove,
  onSelect,
  selected,
  onQtyChange,
  onSizeChange,
}) => {
  const [selectedQuantity, setQuantity] = useState(
    product.selectedQuantity || 1,
  );
  const [selectedSize, setSelectedSize] = useState(product.selectedSize || "");
  const [showQuantityPopup, setShowQuantityPopup] = useState(false);
  const [showSizePopup, setShowSizePopup] = useState(false);

  // Sync local state when cart changes externally
  useEffect(() => {
    setQuantity(product.selectedQuantity || 1);
    setSelectedSize(product.selectedSize || "");
  }, [product.selectedQuantity, product.selectedSize]);

  // Price calculations
  const price = Number(product.price) || 0;
  const mrp =
    Number(product.mrp || product.originalPrice || product.price) || 0;
  const hasDiscount = mrp > price;
  const discountPercent = hasDiscount
    ? Math.round(((mrp - price) / mrp) * 100)
    : 0;

  // Image fallback chain — banner → image → images[0] → thumbnail
  const imageUrl =
    product.banner ||
    product.image ||
    product.images?.[0] ||
    product.thumbnail ||
    "";

  // Slug fallback — some products use `id` as route param
  const productLink = product.slug
    ? `/product/${product.slug}`
    : `/product/${product.id}`;

  // Safe check for sizes array
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;

  // Stock uses product.stock, falls back to product.qty
  const stockLimit = product.stock ?? product.qty ?? 10;

  // Handlers
  const handleQuantityChange = (val) => {
    setQuantity((prev) => {
      let newQty = prev;

      if (val === "increment") newQty = prev + 1;
      else if (val === "decrement" && prev > 1) newQty = prev - 1;
      else if (typeof val === "number" && val > 0) newQty = val;

      if (newQty !== prev && onQtyChange) {
        onQtyChange(newQty);
      }

      return newQty;
    });
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    if (onSizeChange) onSizeChange(size);
    setShowSizePopup(false);
  };

  // Delivery date — 4 days from now
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const formattedDelivery = deliveryDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="w-full bg-white sm:rounded-xl flex flex-col font-sans shadow-sm sm:border border-gray-100 transition-all hover:border-gray-200">
      {/* TOP: Checkbox + Image + Info */}
      <div className="p-4 flex items-start gap-4">
        {/* 1. Checkbox */}
        <div className="pt-8 shrink-0">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="w-5 h-5 cursor-pointer rounded border-gray-300 transition-colors"
            style={{ accentColor: "#8B0000" }}
          />
        </div>

        {/* 2. Product Image */}
        <Link
          to={productLink}
          className="shrink-0 block overflow-hidden rounded-md border border-gray-100 bg-[#FAFAFA]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-[80px] h-[100px] sm:w-[100px] sm:h-[125px] object-cover mix-blend-multiply hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-[80px] h-[100px] sm:w-[100px] sm:h-[125px] flex items-center justify-center text-[11px] text-gray-400 font-medium">
              No image
            </div>
          )}
        </Link>

        {/* 3. Product Details */}
        <div className="flex-1 min-w-0 flex flex-col">
          <Link to={productLink}>
            <h3
              title={product.name}
              className="text-[14px] sm:text-[15px] font-semibold leading-snug line-clamp-2 hover:text-[#00A859] transition-colors"
              style={{ color: "#2C2416" }}>
              {product.name}
            </h3>
          </Link>

          {/* Brand / Seller */}
          <p className="text-[12px] text-gray-500 mt-1 truncate">
            Sold by:{" "}
            <span className="font-medium" style={{ color: "#2C2416" }}>
              Ghar Ka Organic
            </span>
          </p>

          {/* Pricing */}
          <div className="flex items-baseline flex-wrap gap-2 mt-2">
            <span className="text-[18px] sm:text-[20px] font-bold text-gray-900 tracking-tight">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <>
                <span className="text-[13px] text-gray-400 line-through decoration-gray-300">
                  ₹{mrp.toLocaleString("en-IN")}
                </span>
                <span className="text-[12px] font-bold px-1.5 py-0.5 bg-red-50 rounded text-[#8B0000]">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          {/* Size & Qty selectors */}
          <div className="flex flex-wrap items-center gap-2 mt-3.5">
            {hasSizes ? (
              <button
                onClick={() => setShowSizePopup(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-[12px] font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                Size:{" "}
                <span className="font-bold text-gray-900">
                  {selectedSize || "Select"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
            ) : (
              <div className="flex items-center px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-md text-[12px] font-medium text-gray-500">
                Size:{" "}
                <span className="ml-1 text-gray-700 font-semibold">
                  Free Size
                </span>
              </div>
            )}

            <button
              onClick={() => setShowQuantityPopup(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-[12px] font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              Qty:{" "}
              <span className="font-bold text-gray-900">
                {selectedQuantity}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[11.5px] text-gray-600 font-medium">
              <Heart size={14} className="text-gray-400" />
              14 days return available
            </div>
            <div className="flex items-center gap-2 text-[11.5px] text-gray-600 font-medium">
              <Truck size={14} className="text-[#00A859]" />
              Delivery by{" "}
              <span className="font-bold text-gray-800">
                {formattedDelivery}
              </span>
              <span className="text-gray-300 mx-0.5">|</span>
              <span className="font-bold text-[#00A859]">FREE</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: Remove button */}
      <div className="flex items-center border-t border-gray-50 bg-white sm:rounded-b-xl overflow-hidden">
        <button
          onClick={onRemove}
          className="flex-1 flex justify-center items-center gap-2 py-3.5 text-[12px] font-bold uppercase tracking-wider text-gray-500 hover:bg-red-50 hover:text-[#8B0000] transition-colors group">
          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-[#8B0000] transition-colors" />
          Remove Item
        </button>
      </div>

      {/* POPUPS */}
      {showQuantityPopup && (
        <QuantityPopup
          quantity={selectedQuantity}
          handleQuantityChange={handleQuantityChange}
          stock={stockLimit}
          onClose={() => setShowQuantityPopup(false)}
        />
      )}

      {showSizePopup && hasSizes && (
        <SizePopup
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSizeChange={handleSizeChange}
          onClose={() => setShowSizePopup(false)}
        />
      )}
    </div>
  );
};

export default CartItemCard;
