import React from "react";
import { ShoppingBag, Loader2 } from "lucide-react";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const ProductBottomBar = ({ product, handleAddToCart, isAdding }) => {
  if (!product) return null;

  const price = Number(product.price || 0);
  const originalPrice = Number(product.originalPrice || price);

  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const isOutOfStock = product.stock === 0;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex items-center justify-between px-5 py-4 gap-4">
        {/* ── LEFT: Editorial Price Block ── */}
        <div className="flex flex-col justify-center shrink-0">
          <div className="flex items-baseline gap-2">
            <span className="text-[22px] font-bold text-[#1B4332] tracking-tight">
              {fmt(price)}
            </span>
            {discount > 0 && (
              <span className="text-[13px] font-medium text-gray-400 line-through">
                {fmt(originalPrice)}
              </span>
            )}
          </div>

          {discount > 0 ? (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="bg-[#BC6C25]/10 text-[#BC6C25] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                Save {discount}%
              </span>
            </div>
          ) : (
            <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mt-1">
              Pure & Organic
            </span>
          )}
        </div>

        {/* ── RIGHT: Premium Action Button ── */}
        <div className="flex-1 max-w-[200px]">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock}
            className={`w-full h-[52px] flex items-center justify-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 active:scale-95
              ${
                isOutOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-[#1B4332] text-white shadow-lg shadow-[#1B4332]/20 hover:bg-[#143225]"
              }
            `}>
            {isAdding ? (
              <Loader2 size={20} className="animate-spin text-white/70" />
            ) : (
              <>
                {!isOutOfStock && (
                  <ShoppingBag
                    size={18}
                    strokeWidth={2}
                    className="opacity-90"
                  />
                )}
                <span>{isOutOfStock ? "Sold Out" : "Add to Bag"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductBottomBar;
