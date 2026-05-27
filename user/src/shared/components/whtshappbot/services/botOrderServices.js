// ─────────────────────────────────────────────
// BOT ORDER SERVICE  (secured + enhanced)
// • Ownership validation on every order fetch
// • Payment status + retry payment support
// • Cancellation flow
// • Return / refund request flow
// • Reorder (add previous order items to cart)
// • ETA helper
// ─────────────────────────────────────────────

import { orderService } from "../../../../userApp/features/orders/services/orderService";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  writeBatch,
  addDoc,
} from "firebase/firestore";
import { db } from "../../../../config/firebaseDB";

// ─────────────────────────────────────────────
// SECURITY HELPER
// ─────────────────────────────────────────────

/**
 * Verify that the fetched order belongs to the requesting user.
 * Returns the order if ownership is confirmed, otherwise null.
 *
 * @param {object|null} order
 * @param {string}      userId
 * @returns {object|null}
 */
const verifyOwnership = (order, userId) => {
  if (!order) return null;
  if (!userId) return null; // never return order to unauthenticated callers
  if (order.userId !== userId) {
    console.warn(
      `[Security] User ${userId} attempted to access order ${order.orderId} owned by ${order.userId}`,
    );
    return null; // silently deny — don't leak whether the order exists
  }
  return order;
};

// ─────────────────────────────────────────────
// ORDER SEARCH & FETCH
// ─────────────────────────────────────────────

/**
 * Search a user's own orders. Always scoped to userId.
 *
 * @param {string} userId
 * @param {string} searchQuery
 * @returns {Promise<Array>}
 */
export const searchUserOrders = async (userId, searchQuery = "") => {
  if (!userId) return [];

  try {
    const { orders } = await orderService.getUserOrders(userId, 50);
    if (!orders.length) return [];

    const q = searchQuery.trim().toLowerCase();
    if (!q) return orders.slice(0, 5);

    return orders.filter((order) => {
      const snap  = order.addressSnapshot || {};
      const phone = extractPhone(q);

      return (
        order.orderId?.toLowerCase().includes(q) ||
        snap.name?.toLowerCase().includes(q) ||
        (phone && snap.phone?.replace(/\D/g, "").includes(phone)) ||
        snap.city?.toLowerCase().includes(q) ||
        snap.pincode?.toString().includes(q) ||
        order.items?.some((i) => i.name?.toLowerCase().includes(q)) ||
        order.previewItem?.name?.toLowerCase().includes(q)
      );
    });
  } catch (err) {
    console.error("[BotOrderService] searchUserOrders error:", err);
    return [];
  }
};

/**
 * Get full details for a single order — with ownership check.
 *
 * @param {string} orderId
 * @param {string} userId   — required; returns null if order doesn't belong to this user
 * @returns {Promise<object|null>}
 */
export const getBotOrderDetails = async (orderId, userId) => {
  if (!orderId || !userId) return null;
  try {
    const order = await orderService.getOrderDetails(orderId);
    return verifyOwnership(order, userId);
  } catch (err) {
    console.error("[BotOrderService] getBotOrderDetails error:", err);
    return null;
  }
};

// ─────────────────────────────────────────────
// STATUS FORMATTERS
// ─────────────────────────────────────────────

export const formatOrderStatus = (status = "") => {
  const map = {
    placed:           "✅ Order Placed",
    confirmed:        "✅ Confirmed",
    packed:           "📦 Packed",
    shipped:          "🚚 Shipped",
    out_for_delivery: "🛵 Out for Delivery",
    delivered:        "🏠 Delivered",
    cancelled:        "❌ Cancelled",
    returned:         "↩️ Returned",
    return_requested: "↩️ Return Requested",
    refund_initiated: "💸 Refund Initiated",
    refunded:         "💸 Refunded",
  };
  return map[status?.toLowerCase()] ?? status ?? "Unknown";
};

export const formatPaymentStatus = (status = "") => {
  const map = {
    pending:  "⏳ Payment Pending",
    paid:     "💳 Paid",
    failed:   "❌ Payment Failed",
    refunded: "↩️ Refunded",
    partial:  "⚠️ Partially Paid",
  };
  return map[status?.toLowerCase()] ?? status ?? "";
};

/**
 * Returns true when the order has an actionable unpaid state.
 */
export const isPaymentPending = (order) =>
  ["pending", "failed"].includes(order?.paymentStatus?.toLowerCase()) &&
  !["cancelled", "returned"].includes(order?.orderStatus?.toLowerCase());

/**
 * Returns true when the order can still be cancelled.
 */
export const isCancellable = (order) =>
  ["placed", "confirmed"].includes(order?.orderStatus?.toLowerCase());

/**
 * Returns true when the order is eligible for a return request.
 */
export const isReturnable = (order) => {
  if (order?.orderStatus?.toLowerCase() !== "delivered") return false;
  if (order?.returnRequested) return false;

  const deliveredAt = order.deliveredAt?.toDate?.() || order.deliveredAt;
  if (!deliveredAt) return true; // if we can't tell, allow it

  const daysSince = (Date.now() - new Date(deliveredAt).getTime()) / 86_400_000;
  return daysSince <= 7; // 7-day return window
};

// ─────────────────────────────────────────────
// ORDER SUMMARY BUILDER
// ─────────────────────────────────────────────

/**
 * Build a readable order summary string for bot messages.
 * Includes payment-pending warning when applicable.
 */
export const buildOrderSummary = (order) => {
  if (!order) return "Order not found.";

  const snap    = order.addressSnapshot || {};
  const items   = order.items || [];
  const preview = order.previewItem;

  const statusLine  = formatOrderStatus(order.orderStatus);
  const paymentLine = formatPaymentStatus(order.paymentStatus);
  const methodLabel =
    order.paymentMethod === "cod"
      ? "Cash on Delivery"
      : order.paymentMethod?.toUpperCase() ?? "";

  const displayItems = items.length
    ? items.slice(0, 3)
    : preview
      ? [{ name: preview.name, quantity: 1, price: preview.price }]
      : [];

  const itemLines = displayItems
    .map((i) => {
      const qty   = i.quantity ?? i.selectedQuantity ?? 1;
      const total = (Number(i.price) || 0) * qty;
      const size  = i.selectedSize ? ` (${i.selectedSize})` : "";
      return `  ▪ ${i.name}${size} × ${qty} — ₹${total.toLocaleString("en-IN")}`;
    })
    .join("\n");

  const moreCount = items.length > 3 ? items.length - 3 : 0;
  const moreLabel = moreCount > 0 ? `\n  + ${moreCount} more item(s)` : "";

  const addressLine = [snap.name, snap.line1, snap.city, snap.state, snap.pincode]
    .filter(Boolean)
    .join(", ");

  const ratingHint =
    order.orderStatus === "delivered" && !order.rating
      ? "\n\n💬 _Tap below to rate your order!_"
      : "";

  // ⚠️ Payment pending warning
  const paymentWarn = isPaymentPending(order)
    ? "\n\n⚠️ *Payment is incomplete!* Tap below to complete payment."
    : "";

  return [
    `*Order ID:* ${order.orderId}`,
    `*Status:* ${statusLine}`,
    `*Payment:* ${paymentLine} (${methodLabel})`,
    `*Amount:* ₹${Number(order.totalAmount || 0).toLocaleString("en-IN")}`,
    addressLine ? `*Deliver to:* ${addressLine}` : "",
    itemLines   ? `\n*Items:*\n${itemLines}${moreLabel}` : "",
  ]
    .filter(Boolean)
    .join("\n") + paymentWarn + ratingHint;
};

// ─────────────────────────────────────────────
// PAYMENT RETRY
// ─────────────────────────────────────────────

/**
 * Build a payment-retry chip strip for a pending/failed payment order.
 * The `pay_now_{orderId}` chip is handled in useBotFlows.
 *
 * @param {object} order
 * @returns {Array} bot message objects
 */
export const buildPaymentRetryFlow = (order) => {
  if (!order?.orderId) return [];

  const amount = Number(order.totalAmount || 0).toLocaleString("en-IN");

  return [
    {
      text: `💳 *Complete your payment of ₹${amount}* to confirm your order.\nChoose how you'd like to pay:`,
      delay: 500,
    },
    {
      text: "",
      type: "chips",
      delay: 750,
      data: [
        { id: `pay_now_${order.orderId}`,    label: "💳 Pay Online Now",      icon: "tag" },
        { id: `pay_wa_${order.orderId}`,     label: "📲 Pay via WhatsApp",    icon: "wa"  },
        { id: `pay_cancel_${order.orderId}`, label: "❌ Cancel this order",   icon: "tag" },
        { id: "main",                        label: "Main menu",              icon: "home" },
      ],
    },
  ];
};

/**
 * Parse a payment chip id.
 * e.g. "pay_now_john-LX4F2KA" → { action: "now", orderId: "john-LX4F2KA" }
 *
 * @param {string} chipId
 * @returns {{ action: string, orderId: string } | null}
 */
export const parsePaymentChip = (chipId = "") => {
  const match = chipId.match(/^pay_(now|wa|cancel)_(.+)$/);
  if (!match) return null;
  return { action: match[1], orderId: match[2] };
};

// ─────────────────────────────────────────────
// ORDER CANCELLATION
// ─────────────────────────────────────────────

/**
 * Cancel an order — with ownership verification.
 *
 * @param {{ orderId, userId, reason? }} params
 * @returns {Promise<void>}
 */
export const cancelOrder = async ({ orderId, userId, reason = "Cancelled by customer via bot" }) => {
  if (!orderId || !userId) throw new Error("orderId and userId are required");

  // Ownership check before write
  const order = await getBotOrderDetails(orderId, userId);
  if (!order) throw new Error("ORDER_NOT_FOUND");
  if (!isCancellable(order)) throw new Error("NOT_CANCELLABLE");

  const now   = serverTimestamp();
  const batch = writeBatch(db);

  batch.update(doc(db, "orders", orderId), {
    orderStatus: "cancelled",
    cancelledAt: now,
    cancelReason: reason,
    updatedAt: now,
  });

  batch.update(doc(db, "users", userId, "orders", orderId), {
    orderStatus: "cancelled",
    cancelledAt: now,
    updatedAt: now,
  });

  batch.set(doc(collection(db, "orders", orderId, "timeline")), {
    status: "cancelled",
    note: reason,
    timestamp: now,
  });

  await batch.commit();
};

/**
 * Build the cancellation confirmation flow.
 *
 * @param {object} order
 * @returns {Array} bot message objects
 */
export const buildCancelFlow = (order) => {
  if (!order?.orderId) return [];
  return [
    {
      text: `Are you sure you want to cancel *Order ${order.orderId}*?\nThis action cannot be undone.`,
      delay: 400,
    },
    {
      text: "",
      type: "chips",
      delay: 650,
      data: [
        { id: `confirm_cancel_${order.orderId}`, label: "✅ Yes, cancel it",  icon: "tag" },
        { id: `orders`,                          label: "↩️ No, keep order",  icon: "package" },
      ],
    },
  ];
};

/**
 * Parse a cancellation confirmation chip.
 * e.g. "confirm_cancel_john-LX4F2KA" → { orderId: "john-LX4F2KA" }
 */
export const parseCancelChip = (chipId = "") => {
  const match = chipId.match(/^confirm_cancel_(.+)$/);
  if (!match) return null;
  return { orderId: match[1] };
};

// ─────────────────────────────────────────────
// RETURN / REFUND REQUEST
// ─────────────────────────────────────────────

/**
 * Submit a return request for a delivered order.
 *
 * @param {{ orderId, userId, reason }} params
 * @returns {Promise<void>}
 */
export const requestReturn = async ({ orderId, userId, reason = "Return requested via bot" }) => {
  if (!orderId || !userId) throw new Error("orderId and userId are required");

  const order = await getBotOrderDetails(orderId, userId);
  if (!order) throw new Error("ORDER_NOT_FOUND");
  if (!isReturnable(order)) throw new Error("NOT_RETURNABLE");

  const now   = serverTimestamp();
  const batch = writeBatch(db);

  batch.update(doc(db, "orders", orderId), {
    orderStatus:     "return_requested",
    returnRequested: true,
    returnReason:    reason,
    returnRequestAt: now,
    updatedAt:       now,
  });

  batch.update(doc(db, "users", userId, "orders", orderId), {
    orderStatus:     "return_requested",
    returnRequested: true,
    returnRequestAt: now,
    updatedAt:       now,
  });

  batch.set(doc(collection(db, "orders", orderId, "timeline")), {
    status:    "return_requested",
    note:      reason,
    timestamp: now,
  });

  await batch.commit();
};

/**
 * Build return request reason chip flow.
 *
 * @param {object} order
 * @returns {Array}
 */
export const buildReturnFlow = (order) => {
  if (!order?.orderId) return [];
  return [
    {
      text: "We're sorry to hear that! What's the reason for returning?",
      delay: 400,
    },
    {
      text: "",
      type: "chips",
      delay: 650,
      data: [
        { id: `return_damaged_${order.orderId}`,  label: "📦 Item damaged/broken" },
        { id: `return_wrong_${order.orderId}`,    label: "❓ Wrong item received" },
        { id: `return_quality_${order.orderId}`,  label: "⚠️ Quality issue" },
        { id: `return_notwant_${order.orderId}`,  label: "🙅 Changed my mind" },
        { id: `return_other_${order.orderId}`,    label: "💬 Other reason" },
      ],
    },
  ];
};

/**
 * Parse a return reason chip.
 * e.g. "return_damaged_john-LX4F2KA" → { reason: "damaged", orderId: "john-LX4F2KA" }
 */
export const parseReturnChip = (chipId = "") => {
  const match = chipId.match(/^return_([a-z]+)_(.+)$/);
  if (!match) return null;
  return { reason: match[1], orderId: match[2] };
};

const RETURN_REASON_LABELS = {
  damaged:  "Item damaged/broken",
  wrong:    "Wrong item received",
  quality:  "Quality issue",
  notwant:  "Changed my mind",
  other:    "Other reason",
};

export const getReturnReasonLabel = (key) =>
  RETURN_REASON_LABELS[key] ?? "Return requested";

// ─────────────────────────────────────────────
// REORDER
// ─────────────────────────────────────────────

/**
 * Build reorder chip for a delivered/cancelled order.
 *
 * @param {object} order
 * @returns {Array}
 */
export const buildReorderFlow = (order) => {
  if (!order?.orderId) return [];
  const eligible = ["delivered", "cancelled"].includes(order?.orderStatus?.toLowerCase());
  if (!eligible) return [];

  return [
    {
      text: "Want to order the same items again? 🔁",
      delay: 400,
    },
    {
      text: "",
      type: "chips",
      delay: 600,
      data: [
        { id: `reorder_${order.orderId}`, label: "🔁 Reorder this", icon: "bag" },
        { id: "shop",                     label: "Browse products",  icon: "bag" },
      ],
    },
  ];
};

/**
 * Parse a reorder chip.
 * e.g. "reorder_john-LX4F2KA" → { orderId: "john-LX4F2KA" }
 */
export const parseReorderChip = (chipId = "") => {
  const match = chipId.match(/^reorder_(.+)$/);
  if (!match) return null;
  return { orderId: match[1] };
};

// ─────────────────────────────────────────────
// ORDER RATING & FEEDBACK  (unchanged logic, secured)
// ─────────────────────────────────────────────

export const hasRatedOrder = async (orderId) => {
  if (!orderId) return false;
  try {
    const snap = await getDoc(doc(db, "orders", orderId, "rating", "review"));
    return snap.exists();
  } catch {
    return false;
  }
};

export const submitOrderRating = async ({
  orderId,
  userId,
  stars,
  feedback = "",
  tag = "",
}) => {
  if (!orderId || !userId) throw new Error("orderId and userId are required");
  if (stars < 1 || stars > 5) throw new Error("Stars must be between 1 and 5");

  // Ownership check before rating write
  const order = await getBotOrderDetails(orderId, userId);
  if (!order) throw new Error("ORDER_NOT_FOUND_OR_UNAUTHORIZED");

  const already = await hasRatedOrder(orderId);
  if (already) throw new Error("ALREADY_RATED");

  const now   = serverTimestamp();
  const batch = writeBatch(db);

  batch.set(doc(db, "orders", orderId, "rating", "review"), {
    orderId,
    userId,
    stars,
    feedback: feedback.trim(),
    tag,
    createdAt: now,
  });

  batch.update(doc(db, "orders", orderId), {
    rating:    stars,
    ratedAt:   now,
    updatedAt: now,
  });

  batch.update(doc(db, "users", userId, "orders", orderId), {
    rating:    stars,
    ratedAt:   now,
    updatedAt: now,
  });

  batch.set(doc(collection(db, "orders", orderId, "timeline")), {
    status: "rated",
    note: `User rated ${stars}⭐${tag ? ` · ${tag}` : ""}${feedback ? ` · "${feedback.slice(0, 60)}"` : ""}`,
    timestamp: now,
  });

  await batch.commit();
};

export const getOrderRating = async (orderId) => {
  if (!orderId) return null;
  try {
    const snap = await getDoc(doc(db, "orders", orderId, "rating", "review"));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
};

// ─────────────────────────────────────────────
// RATING FLOW BUILDERS  (unchanged)
// ─────────────────────────────────────────────

export const buildRatingFlow = (order) => {
  if (!order?.orderId) return [];
  const previewName = order.previewItem?.name || order.items?.[0]?.name || "your order";
  return [
    { text: `How was *${previewName}*? 😊\nTap a star to rate your order:`, delay: 500 },
    {
      text: "",
      type: "chips",
      delay: 800,
      data: [
        { id: `rate_5_${order.orderId}`, label: "⭐⭐⭐⭐⭐ Excellent", icon: "tag" },
        { id: `rate_4_${order.orderId}`, label: "⭐⭐⭐⭐ Good",      icon: "tag" },
        { id: `rate_3_${order.orderId}`, label: "⭐⭐⭐ Okay",         icon: "tag" },
        { id: `rate_2_${order.orderId}`, label: "⭐⭐ Poor",           icon: "tag" },
        { id: `rate_1_${order.orderId}`, label: "⭐ Bad",              icon: "tag" },
      ],
    },
  ];
};

export const buildFeedbackTagFlow = (orderId) => [
  { text: "Thanks! What stood out? _(optional)_", delay: 400 },
  {
    text: "",
    type: "chips",
    delay: 650,
    data: [
      { id: `tag_quality_${orderId}`,   label: "🌿 Product Quality" },
      { id: `tag_packaging_${orderId}`, label: "📦 Packaging" },
      { id: `tag_delivery_${orderId}`,  label: "🚚 Fast Delivery" },
      { id: `tag_value_${orderId}`,     label: "💰 Good Value" },
      { id: `tag_skip_${orderId}`,      label: "Skip →" },
    ],
  },
];

export const parseRatingChip = (chipId = "") => {
  const match = chipId.match(/^rate_(\d)_(.+)$/);
  if (!match) return null;
  return { stars: Number(match[1]), orderId: match[2] };
};

export const parseFeedbackTagChip = (chipId = "") => {
  const match = chipId.match(/^tag_([a-z]+)_(.+)$/);
  if (!match) return null;
  return { tag: match[1], orderId: match[2] };
};

// ─────────────────────────────────────────────
// EXISTING HELPERS  (unchanged)
// ─────────────────────────────────────────────

export const looksLikeOrderId = (text = "") =>
  /^[a-z0-9]{2,8}-[a-z0-9]{5,12}$/i.test(text.trim());

export const extractPhone = (text = "") => {
  const match = text.replace(/\s/g, "").match(/(\+?91)?([6-9]\d{9})/);
  return match ? match[2] : null;
};