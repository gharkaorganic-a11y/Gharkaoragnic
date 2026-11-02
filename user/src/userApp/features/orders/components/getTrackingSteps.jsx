import React from "react";
import { formatDate, normalizeOrderStatus } from "../utils/orders";

// ─── TRACKING STEPS HELPER ───
const getTrackingSteps = (order) => {
  if (!order) return [];

  const orderStatus = normalizeOrderStatus(order.orderStatus || order.status);
  const steps = [
    {
      status: "Order Placed",
      date: formatDate(order.createdAt),
      completed: true,
    },
  ];

  // Add processing step if order is beyond placed
  if (
    ["shipped", "processing", "delivered", "cancelled"].includes(orderStatus)
  ) {
    steps.push({
      status: "Processing",
      date: formatDate(order.createdAt),
      completed: ["shipped", "processing", "delivered"].includes(orderStatus),
    });
  }

  // Add shipped step if order is shipped or later
  if (["shipped", "delivered", "cancelled"].includes(orderStatus)) {
    steps.push({
      status: "Shipped",
      date: order.shippedAt
        ? formatDate(order.shippedAt)
        : formatDate(order.updatedAt),
      completed: orderStatus === "delivered",
    });
  }

  // Add delivered step if order is delivered
  if (orderStatus === "delivered") {
    steps.push({
      status: "Delivered",
      date: order.deliveredAt
        ? formatDate(order.deliveredAt)
        : formatDate(order.updatedAt),
      completed: true,
    });
  }

  // Add cancelled step if order is cancelled
  if (orderStatus === "cancelled") {
    steps.push({
      status: "Cancelled",
      date: formatDate(order.updatedAt),
      completed: true,
      isError: true,
      description: "Order has been cancelled.",
    });
  }

  return steps;
};

export default getTrackingSteps;
