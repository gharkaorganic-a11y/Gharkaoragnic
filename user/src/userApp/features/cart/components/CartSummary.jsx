import React, { useMemo } from "react";
import { Tag } from "lucide-react";

const CartSummary = ({
  subtotal = 0,
  originalTotalPrice = 0,
  totalPayable,
  onPlaceOrder,
  btnText = "PLACE ORDER",
  selectedItems = [],
  button = true,
}) => {
  const selectedCount = selectedItems.length;

  const discountOnMrp = useMemo(() => {
    const diff = originalTotalPrice - subtotal;
    return diff > 0 ? diff : 0;
  }, [originalTotalPrice, subtotal]);

  const total = useMemo(
    () => totalPayable ?? subtotal,
    [totalPayable, subtotal],
  );

  const formatPrice = (val) =>
    Number(val).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const confetti = Array.from({ length: 14 });

  return (
    <div className="w-full bg-white border border-gray-200 shadow-md overflow-hidden font-sans space-y-3">
      {/* SAVINGS BANNER */}
      {discountOnMrp > 0 && (
        <div className="relative flex items-center gap-2 overflow-hidden bg-[#edf5ee] px-4 py-2 text-[12px] font-semibold text-[#315c3c] sm:text-[13px]">
          <Tag size={16} />
          You'll save ₹{formatPrice(discountOnMrp)} on this order!
          {/* Confetti */}
          <div className="absolute inset-0 pointer-events-none">
            {confetti.map((_, i) => (
              <span
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.8}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* PRICE DETAILS */}
      <div>
        <div className="p-4 sm:px-5 sm:py-2">
          <h3 className="text-[11px] sm:text-[12px] font-bold text-gray-800 uppercase tracking-wide mb-4">
            Price Details ({selectedCount} Item{selectedCount > 1 ? "s" : ""})
          </h3>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between text-[12px] sm:text-[13px] text-gray-600">
              <span>Total MRP</span>
              <span className="text-gray-800">
                ₹{formatPrice(originalTotalPrice)}
              </span>
            </div>

            {discountOnMrp > 0 && (
              <div className="flex justify-between text-[12px] sm:text-[13px] text-gray-600">
                <span>Discount on MRP</span>
                <span className="text-[#038d63] font-medium">
                  −₹{formatPrice(discountOnMrp)}
                </span>
              </div>
            )}

          </div>

          <hr className="border-gray-200 my-3 sm:my-4" />

          <div className="flex justify-between items-center text-[14px] sm:text-[15px]">
            <span className="font-bold text-gray-900">Total Amount</span>
            <span className="font-bold text-gray-900">
              ₹{formatPrice(total)}
            </span>
          </div>
        </div>

        {/* CHECKOUT BUTTON */}
        <div className="fixed bottom-0 left-0 w-full bg-[#f7faf7] pt-2 shadow-lg md:static">
          <div className="pb-2 text-center text-[10px] font-bold text-[#315c3c] sm:text-[11px] md:hidden">
            {selectedCount} Item{selectedCount > 1 ? "s" : ""} selected for
            order
          </div>
          {button && (
            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={onPlaceOrder}
              className="w-full bg-[#315c3c] py-3.5 text-[13px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#244b2e] disabled:cursor-not-allowed disabled:opacity-50 sm:py-3 sm:text-[14px]">
              {btnText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
