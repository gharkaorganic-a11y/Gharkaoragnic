import React, { useState } from "react";

const CartItemCardOfWhathapp = ({ item, onAdd, onRemove, onDelete }) => {
  const [removing, setRemoving] = useState(false);
  const [removed, setRemoved] = useState(false);

  const handleDelete = () => {
    setRemoving(true);
    // Smooth exit animation before unmounting
    setTimeout(() => {
      setRemoved(true);
      onDelete(item.cartKey);
    }, 380);
  };

  // Derived display values
  const displayName = item.name || String(item.id);
  const unitPrice = typeof item.price === "number" ? item.price : null;
  const totalPrice =
    unitPrice != null
      ? `₹${(unitPrice * item.selectedQuantity).toLocaleString("en-IN")}`
      : null;
  const unitLabel =
    unitPrice != null ? `₹${unitPrice.toLocaleString("en-IN")}/each` : null;

  if (removed) return null;

  return (
    <div
      style={{
        transition:
          "opacity 0.3s ease, transform 0.3s ease, max-height 0.3s ease, margin 0.3s ease",
        opacity: removing ? 0 : 1,
        transform: removing ? "translateX(10px)" : "translateX(0)",
        maxHeight: removing ? "0" : "150px",
        marginBottom: removing ? "0" : "12px",
        overflow: "hidden",
      }}
      className="bg-white rounded-xl border border-[#E9EDEF] shadow-sm relative group">
      <div className="flex gap-3 p-3">
        {/* ── Image Section (Compact WhatsApp Style) ── */}
        <div className="w-16 h-16 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-[#F0F2F5] flex-shrink-0 border border-[#E9EDEF] relative">
          {item.image ? (
            <img
              src={item.image}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          {/* Fallback Icon */}
          <div
            style={{ display: item.image ? "none" : "flex" }}
            className="w-full h-full items-center justify-center text-[#8696A0]">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        </div>

        {/* ── Details & Controls Section ── */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Top Row: Title & Trash */}
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="text-[14px] font-semibold text-[#111B21] leading-tight line-clamp-1">
                {displayName}
              </h3>
              {item.selectedSize && (
                <p className="text-[12px] text-[#667781] mt-0.5">
                  Size:{" "}
                  <span className="font-medium text-[#54656F]">
                    {item.selectedSize}
                  </span>
                </p>
              )}
            </div>

            {/* Minimalist Top-Right Remove Button */}
            <button
              onClick={handleDelete}
              className="text-[#8696A0] hover:text-red-500 p-1 -mt-1 -mr-1 rounded-full transition-colors flex-shrink-0"
              aria-label="Remove item">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          {/* Bottom Row: Pricing & Qty Pill */}
          <div className="flex items-end justify-between mt-2">
            <div className="flex flex-col">
              {totalPrice && (
                <span className="text-[15px] font-bold text-[#008069] leading-none">
                  {totalPrice}
                </span>
              )}
              {unitLabel && item.selectedQuantity > 1 && (
                <span className="text-[11px] font-medium text-[#8696A0] mt-1">
                  {unitLabel}
                </span>
              )}
            </div>

            {/* Flat Chat-Style Qty Controls */}
            <div className="flex items-center bg-[#F0F2F5] rounded-full h-8 px-1">
              <button
                onClick={() =>
                  item.selectedQuantity > 1
                    ? onRemove(item.cartKey, item.selectedQuantity - 1)
                    : handleDelete()
                }
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#54656F] hover:bg-[#E9EDEF] transition-colors">
                {item.selectedQuantity === 1 ? (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 12H4"
                    />
                  </svg>
                )}
              </button>

              <span className="text-[13px] font-semibold text-[#111B21] w-6 text-center tabular-nums">
                {item.selectedQuantity}
              </span>

              <button
                onClick={() => onAdd(item.cartKey, item.selectedQuantity + 1)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#008069] hover:bg-[#D9FDD3] transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCardOfWhathapp;
