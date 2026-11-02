// helpers/orderStatusMeta.js

export const ORDER_STATUS_META = {
  placed: {
    label: "Order Placed",
    color: "text-amber-500",
    bg: "bg-amber-50",
    dot: "bg-amber-400",
    pulse: true,
  },
  processing: {
    label: "Processing",
    color: "text-blue-500",
    bg: "bg-blue-50",
    dot: "bg-blue-400",
    pulse: true,
  },
  shipped: {
    label: "Out for delivery",
    color: "text-amber-500",
    bg: "bg-amber-50",
    dot: "bg-amber-400",
    pulse: true,
  },
  delivered: {
    label: "Delivered",
    color: "text-green-600",
    bg: "bg-green-50",
    dot: "bg-green-500",
    pulse: false,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bg: "bg-red-50",
    dot: "bg-red-500",
    pulse: false,
  },
  default: {
    label: "Confirmed",
    color: "text-green-600",
    bg: "bg-green-50",
    dot: "bg-green-500",
    pulse: true,
  },
};

export const normalizeOrderStatus = (status = "") => {
  const normalized = String(status ?? "").toLowerCase();

  if (["pending", "placed"].includes(normalized)) return "placed";
  if (["confirmed", "packaging", "processing"].includes(normalized)) {
    return "processing";
  }
  if (["shipping", "shipped"].includes(normalized)) return "shipped";

  return normalized;
};

export const getStatusMeta = (status = "") =>
  ORDER_STATUS_META[normalizeOrderStatus(status)] || ORDER_STATUS_META.default;

export const formatDate = (ts) => {
  if (!ts) return "—";
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};