import React from "react";

const OrderCardOfWhatsapp = ({ order, onAction, onSendId }) => {
  if (!order) return null;

  const status = (order.orderStatus || "pending").toLowerCase();

  // Status UI formatting
  const statusConfig = {
    delivered: {
      color: "text-[#008069]",
      bg: "bg-[#D9FDD3]",
      label: "Delivered",
    },
    cancelled: { color: "text-red-600", bg: "bg-red-50", label: "Cancelled" },
    pending: {
      color: "text-[#B7791F]",
      bg: "bg-yellow-50",
      label: "Processing",
    },
    shipped: { color: "text-blue-600", bg: "bg-blue-50", label: "Shipped" },
  };
  const activeStatus = statusConfig[status] || statusConfig.pending;

  // Derive "Next Action" buttons based on status
  const isCancellable = ["pending", "processing"].includes(status);
  const isReorderable = ["delivered", "cancelled"].includes(status);

  // Create item summary (e.g., "Raw Honey + 2 more")
  const items = order.items || (order.previewItem ? [order.previewItem] : []);
  const firstItem = items[0]?.name || "Items";
  const itemSummary =
    items.length > 1 ? `${firstItem} + ${items.length - 1} more` : firstItem;

  return (
    <div className="bg-white rounded-2xl border border-[#E9EDEF] shadow-sm flex flex-col flex-shrink-0 w-[240px] overflow-hidden snap-center">
      {/* Header: ID & Status */}
      <div className="p-3 border-b border-[#F0F2F5] flex justify-between items-start">
        <div>
          <p className="text-[10px] text-[#8696A0] font-semibold uppercase tracking-wider mb-0.5">
            Order ID
          </p>
          <p className="text-[12px] font-bold text-[#111B21]">
            {order.orderId}
          </p>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-md ${activeStatus.bg} ${activeStatus.color}`}>
          {activeStatus.label}
        </span>
      </div>

      {/* Body: Details */}
      <div className="p-3 flex-1 flex flex-col justify-center">
        <p className="text-[13.5px] font-medium text-[#111B21] line-clamp-1">
          {itemSummary}
        </p>
        <p className="text-[12px] text-[#667781] mt-1">
          {order.date || "Recent"} • ₹
          {Number(order.totalAmount || order.total || 0).toLocaleString(
            "en-IN",
          )}
        </p>
      </div>

      {/* Footer: Contextual Buttons */}
      <div className="p-2 bg-[#F8F9FA] flex gap-2">
        {/* Always show "View Details" */}
        <button
          onClick={() => onSendId(order.orderId)}
          className="flex-1 py-2 text-[12px] font-semibold text-[#54656F] bg-white border border-[#E9EDEF] rounded-xl hover:bg-gray-50 transition-colors">
          View Details
        </button>

        {/* Dynamic Action Button */}
        {isReorderable ? (
          <button
            onClick={() => onAction(`reorder_${order.orderId}`)}
            className="flex-1 py-2 text-[12px] font-semibold text-white bg-[#008069] rounded-xl shadow-sm hover:bg-[#006956] transition-colors">
            Reorder
          </button>
        ) : isCancellable ? (
          <button
            onClick={() => onAction(`cancel_${order.orderId}`)}
            className="flex-1 py-2 text-[12px] font-semibold text-red-500 bg-white border border-red-100 rounded-xl hover:bg-red-50 transition-colors">
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default OrderCardOfWhatsapp;
