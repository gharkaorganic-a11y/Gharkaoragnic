import React, { useState } from "react";

const CartItemCardOfWhathapp = ({ item, onAdd, onRemove, onDelete }) => {
  // ── Early return to prevent fatal crashes if data is missing ──
  if (!item) return null;

  const [removing, setRemoving] = useState(false);
  const [removed, setRemoved] = useState(false);

  const handleDelete = () => {
    setRemoving(true);
    // Smooth exit animation before unmounting (shrinks horizontally for carousel)
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
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: removing ? 0 : 1,
        transform: removing
          ? "scale(0.8) translateY(10px)"
          : "scale(1) translateY(0)",
        width: removing ? "0px" : "180px", // Fixed width for carousel
        marginRight: removing ? "0px" : "12px",
      }}
      className="bg-white rounded-2xl border border-[#E9EDEF] shadow-sm flex flex-col flex-shrink-0 overflow-hidden relative group snap-center">
      {/* ── Top Image Section ── */}
      <div className="w-full h-32 bg-[#F0F2F5] relative flex-shrink-0">
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
            className="w-8 h-8 opacity-50"
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

        {/* Floating Delete Button */}
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-md text-[#8696A0] hover:text-red-500 hover:bg-white p-1.5 rounded-full shadow-sm transition-all"
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

      {/* ── Details & Controls Section ── */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-[13.5px] font-semibold text-[#111B21] leading-tight line-clamp-2 min-h-[34px]">
            {displayName}
          </h3>

          <div className="flex items-center justify-between mt-1.5">
            {item.selectedSize ? (
              <span className="text-[11px] font-medium text-[#667781] bg-[#F0F2F5] px-2 py-0.5 rounded-md">
                {item.selectedSize}
              </span>
            ) : (
              <span />
            )}

            {unitLabel && item.selectedQuantity > 1 && (
              <span className="text-[10px] text-[#8696A0]">{unitLabel}</span>
            )}
          </div>

          {totalPrice && (
            <div className="text-[15px] font-bold text-[#008069] mt-2">
              {totalPrice}
            </div>
          )}
        </div>

        {/* Full-width Qty Controls */}
        <div className="flex items-center justify-between bg-[#F0F2F5] rounded-full h-9 px-1.5 mt-3">
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

          <span className="text-[13px] font-bold text-[#111B21] w-8 text-center tabular-nums">
            {item.selectedQuantity}
          </span>

          <button
            onClick={() => onAdd(item.cartKey, item.selectedQuantity + 1)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white bg-[#008069] shadow-sm hover:bg-[#006956] transition-colors">
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
  );
};

export default CartItemCardOfWhathapp;
