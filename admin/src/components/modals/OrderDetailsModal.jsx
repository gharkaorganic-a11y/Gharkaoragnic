import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Mail,
  MapPin,
  Package,
  Phone,
  Printer,
  ShoppingBag,
  X,
  XCircle,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

const STATUS_STEPS = [
  { key: "placed", label: "Pending", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const STATUS_ALIASES = {
  pending: "placed",
  placed: "placed",
  confirmed: "confirmed",
  packaging: "confirmed",
  shipping: "confirmed",
  delivered: "delivered",
  cancelled: "cancelled",
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const parseDate = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value?.seconds === "number") {
    return new Date(value.seconds * 1000);
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDateTime = (value) => {
  const dateObj = parseDate(value);
  if (!dateObj) return "N/A";
  return dateObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatINR = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const normalizePhoneDigits = (rawPhone = "") => {
  const digits = String(rawPhone).replace(/\D/g, "");
  if (!digits) return "";
  return digits.length === 10 ? `91${digits}` : digits;
};

const OrderDetailsModal = ({
  selectedOrder,
  setSelectedOrder,
  handleAction,
  STATUS_FLOW = {},
}) => {
  const [copiedField, setCopiedField] = useState("");
  const [confirmCancelId, setConfirmCancelId] = useState("");

  useEffect(() => {
    if (!selectedOrder) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedOrder(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedOrder, setSelectedOrder]);

  const orderData = useMemo(() => {
    if (!selectedOrder) return null;

    const rawStatus =
      selectedOrder.orderStatus || selectedOrder.status || "placed";
    const normalizedStatus = STATUS_ALIASES[rawStatus] || "placed";
    const selectValue =
      rawStatus === "placed"
        ? "pending"
        : ["packaging", "shipping"].includes(rawStatus)
          ? "confirmed"
          : rawStatus;

    const address = selectedOrder.addressSnapshot || {};
    const customerName =
      address.name || selectedOrder.customerName || "Customer";
    const customerPhone = address.phone || selectedOrder.phone || "";
    const customerEmail = address.email || selectedOrder.email || "";

    const items = Array.isArray(selectedOrder.items)
      ? selectedOrder.items
      : [];
    const totalUnits = items.reduce(
      (sum, item) =>
        sum + (Number(item.quantity ?? item.selectedQuantity) || 1),
      0,
    );

    const computedSubtotal = items.reduce((sum, item) => {
      const qty = Number(item.quantity ?? item.selectedQuantity) || 1;
      const price = Number(item.price) || 0;
      return sum + price * qty;
    }, 0);

    const pricing = selectedOrder.pricing || {};
    const subtotal =
      Number(pricing.subtotal ?? selectedOrder.subtotal ?? computedSubtotal) ||
      0;
    const originalTotalPrice = Number(pricing.originalTotalPrice || 0);
    const couponDiscount =
      Number(
        pricing.couponDiscount ??
          pricing.discountAmount ??
          selectedOrder.discount ??
          0,
      ) || 0;
    const couponCode = pricing.couponCode || selectedOrder.couponCode || "";
    const totalAmount =
      Number(
        selectedOrder.totalAmount ?? pricing.totalPayable ?? subtotal,
      ) || 0;

    const mrpSavings =
      originalTotalPrice > subtotal
        ? Math.round((originalTotalPrice - subtotal) * 100) / 100
        : 0;

    const fullOrderId = selectedOrder.orderId || selectedOrder.id || "N/A";
    const shortOrderId =
      selectedOrder.id?.slice(-6).toUpperCase() ||
      fullOrderId.slice(-6).toUpperCase();

    const formattedAddress = [
      address.line1,
      address.line2,
      [address.city, address.state].filter(Boolean).join(", "),
      address.pincode ? `PIN: ${address.pincode}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return {
      rawStatus,
      normalizedStatus,
      selectValue,
      address,
      customerName,
      customerPhone,
      customerEmail,
      formattedAddress,
      items,
      totalUnits,
      subtotal,
      originalTotalPrice,
      couponDiscount,
      couponCode,
      totalAmount,
      mrpSavings,
      fullOrderId,
      shortOrderId,
      timeline: Array.isArray(selectedOrder.timeline)
        ? selectedOrder.timeline
        : [],
    };
  }, [selectedOrder]);

  if (!selectedOrder || !orderData) return null;

  const {
    rawStatus,
    normalizedStatus,
    selectValue,
    address,
    customerName,
    customerPhone,
    customerEmail,
    formattedAddress,
    items,
    totalUnits,
    subtotal,
    originalTotalPrice,
    couponDiscount,
    couponCode,
    totalAmount,
    mrpSavings,
    fullOrderId,
    shortOrderId,
    timeline,
  } = orderData;

  const currentOrderKey = selectedOrder.id || fullOrderId;
  const confirmCancel = confirmCancelId === currentOrderKey;
  const currentStepIndex = STATUS_STEPS.findIndex(
    (step) => step.key === normalizedStatus,
  );
  const flowConfig =
    STATUS_FLOW[rawStatus] ||
    STATUS_FLOW[normalizedStatus] ||
    STATUS_FLOW.pending;

  const paymentStatus = (selectedOrder.paymentStatus || "pending").toLowerCase();

  const handleCopy = async (text, key) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(String(text));
      setCopiedField(key);
      setTimeout(() => setCopiedField(""), 1800);
    } catch {
      // Clipboard blocked in restricted origin
    }
  };

  const openWhatsAppOrder = () => {
    const waNumber = normalizePhoneDigits(customerPhone);
    if (!waNumber) return;

    const itemSummary = items
      .map((it) => {
        const qty = Number(it.quantity ?? it.selectedQuantity) || 1;
        const variant = it.selectedSize || it.size;
        return `• ${it.name || "Product"}${variant ? ` (${variant})` : ""} × ${qty}`;
      })
      .join("\n");

    const message = [
      `Hi ${customerName}, your Ghar Ka Organic order #${shortOrderId}:`,
      itemSummary,
      couponDiscount > 0
        ? `Promo (${couponCode || "Applied"}): -${formatINR(couponDiscount)}`
        : null,
      `Total (${(selectedOrder.paymentMethod || "COD").toUpperCase()}): ${formatINR(totalAmount)}`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shopify-order-title"
      onClick={() => setSelectedOrder(null)}
      className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-[1px] flex items-center justify-center p-2 sm:p-4 font-sans text-[#303030]">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[92vh] bg-[#f1f2f4] border border-[#dcdcdc] rounded-2xl shadow-2xl flex flex-col overflow-hidden print:max-h-none print:border-0 print:shadow-none">
        {/* SHOPIFY-STYLE TOP BAR IN FLIPKART BLUE & YELLOW ACCENTS */}
        <header className="bg-white border-b border-[#e3e3e3] px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#2874F0] text-white flex items-center justify-center shrink-0 relative">
              <ShoppingBag size={14} />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#FFE500] border border-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id="shopify-order-title"
                  className="text-sm sm:text-base font-bold text-[#212121] tracking-tight">
                  #{shortOrderId}
                </h2>

                {/* Payment Pill */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                    paymentStatus === "paid"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : paymentStatus === "cancelled"
                        ? "bg-rose-50 border-rose-200 text-rose-700"
                        : "bg-[#FFF8D6] border-[#FFE500] text-[#6b4800]"
                  }`}>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      paymentStatus === "paid"
                        ? "bg-emerald-600"
                        : paymentStatus === "cancelled"
                          ? "bg-rose-600"
                          : "bg-[#d99b00]"
                    }`}
                  />
                  {paymentStatus === "paid"
                    ? "Paid"
                    : paymentStatus === "cancelled"
                      ? "Cancelled"
                      : "Payment pending"}
                </span>

                {/* Fulfillment / Status Pill */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    normalizedStatus === "delivered"
                      ? "bg-emerald-50 text-emerald-700"
                      : normalizedStatus === "confirmed"
                        ? "bg-[#eaf2ff] text-[#2874F0]"
                        : normalizedStatus === "cancelled"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-[#FFE500]/50 text-[#594400]"
                  }`}>
                  {normalizedStatus === "delivered"
                    ? "Delivered"
                    : normalizedStatus === "confirmed"
                      ? "Confirmed"
                      : normalizedStatus === "cancelled"
                        ? "Cancelled"
                        : "Pending"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[11px] text-[#616161]">
                <span>{formatDateTime(selectedOrder.createdAt)}</span>
                <span>•</span>
                <span>Online Store</span>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleCopy(fullOrderId, "orderId")}
                  title="Copy Order Reference"
                  className="inline-flex items-center gap-1 font-mono text-[10px] text-[#2874F0] hover:underline transition">
                  <span>{fullOrderId}</span>
                  {copiedField === "orderId" ? (
                    <Check size={10} className="text-emerald-600" />
                  ) : (
                    <Copy size={10} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* COMPACT TOP ACTIONS */}
          <div className="flex items-center gap-2 shrink-0 print:hidden">
            {flowConfig?.next && normalizedStatus !== "cancelled" && (
              <button
                type="button"
                onClick={() => handleAction(selectedOrder, flowConfig.next)}
                className="h-8 px-3.5 rounded-lg bg-[#2874F0] hover:bg-[#1c5fba] text-white text-xs font-semibold shadow-2xs transition cursor-pointer">
                {flowConfig.btn}
              </button>
            )}

            <select
              value={selectValue}
              onChange={(e) => handleAction(selectedOrder, e.target.value)}
              aria-label="Order status"
              className="h-8 px-2.5 rounded-lg border border-[#d4d4d4] bg-white hover:border-[#8a8a8a] text-xs font-medium text-[#303030] cursor-pointer outline-none transition">
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => window.print()}
              title="Print order"
              className="hidden sm:inline-flex h-8 px-2.5 rounded-lg border border-[#d4d4d4] bg-white hover:bg-[#f7f7f7] text-xs font-medium text-[#303030] items-center gap-1.5 transition cursor-pointer">
              <Printer size={13} />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              aria-label="Close"
              className="w-8 h-8 rounded-lg hover:bg-[#f1f2f4] flex items-center justify-center text-[#616161] hover:text-[#303030] transition cursor-pointer">
              <X size={16} />
            </button>
          </div>
        </header>

        {/* SHOPIFY 2-COLUMN DASHBOARD CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* LEFT PRIMARY COLUMN (ITEMS + PAYMENT SUMMARY + TIMELINE) */}
            <div className="lg:col-span-8 space-y-3.5">
              {/* 1. ORDER ITEMS CARD */}
              <section className="bg-white border border-[#e3e3e3] rounded-xl shadow-[0_1px_0_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#ebebeb] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#303030]">
                      Order Items ({items.length})
                    </span>
                    <span className="text-[11px] text-[#616161]">
                      • {totalUnits} unit{totalUnits === 1 ? "" : "s"}
                    </span>
                  </div>

                  {/* Slim 3-Step Inline Fulfillment Bar (Pending -> Confirmed -> Delivered) */}
                  {normalizedStatus === "cancelled" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8e1f0b]">
                      <XCircle size={12} /> Cancelled
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = idx <= currentStepIndex;
                        const StepIcon = step.icon;
                        return (
                          <React.Fragment key={step.key}>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                isDone
                                  ? "bg-[#2874F0] text-white"
                                  : "bg-[#f1f2f4] text-[#8a8a8a]"
                              }`}>
                              <StepIcon size={10} />
                              {step.label}
                            </span>
                            {idx < STATUS_STEPS.length - 1 && (
                              <span className="w-3 h-[1px] bg-[#d4d4d4]" />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  )}
                </div>

                {items.length === 0 ? (
                  <p className="px-4 py-6 text-xs text-[#616161] text-center">
                    No items recorded on this order.
                  </p>
                ) : (
                  <div className="divide-y divide-[#ebebeb]">
                    {items.map((item, idx) => {
                      const qty =
                        Number(item.quantity ?? item.selectedQuantity) || 1;
                      const unitPrice = Number(item.price) || 0;
                      const lineTotal =
                        Math.round(unitPrice * qty * 100) / 100;
                      const variant = item.selectedSize || item.size;

                      return (
                        <div
                          key={item.id || `${item.productId}-${idx}`}
                          className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#fafafa] transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name || "Product"}
                                className="w-11 h-11 rounded-lg object-cover border border-[#e3e3e3] bg-[#f7f7f7] shrink-0"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-lg bg-[#f7f7f7] border border-[#e3e3e3] flex items-center justify-center text-[#8a8a8a] shrink-0">
                                <Package size={15} />
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#303030] truncate">
                                {item.name || "Ghar Ka Organic Product"}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                {variant && (
                                  <span className="px-1.5 py-0.5 rounded bg-[#f1f2f4] text-[10px] font-medium text-[#4a4a4a]">
                                    {variant}
                                  </span>
                                )}
                                {item.productId && (
                                  <span className="text-[10px] font-mono text-[#8a8a8a]">
                                    {item.productId}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0 text-right">
                            <span className="text-[11px] text-[#616161]">
                              {formatINR(unitPrice)} × {qty}
                            </span>
                            <span className="text-xs font-semibold text-[#303030] min-w-[58px]">
                              {formatINR(lineTotal)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* 2. SHOPIFY-STYLE PAYMENT BREAKDOWN CARD */}
              <section className="bg-white border border-[#e3e3e3] rounded-xl shadow-[0_1px_0_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#ebebeb] flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#303030]">
                    Payment Summary
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#f1f2f4] text-[#4a4a4a] uppercase">
                    {selectedOrder.paymentMethod || "COD"}
                  </span>
                </div>

                <div className="p-4">
                  <div className="border border-[#ebebeb] rounded-lg overflow-hidden text-xs">
                    <div className="divide-y divide-[#ebebeb]">
                      {mrpSavings > 0 && (
                        <div className="px-3.5 py-2 flex items-center justify-between text-[#616161]">
                          <span>Total MRP</span>
                          <span className="line-through">
                            {formatINR(originalTotalPrice)}
                          </span>
                        </div>
                      )}

                      {mrpSavings > 0 && (
                        <div className="px-3.5 py-2 flex items-center justify-between">
                          <span className="text-[#616161]">Offer Savings</span>
                          <span className="text-[#0c5132] font-medium">
                            -{formatINR(mrpSavings)}
                          </span>
                        </div>
                      )}

                      <div className="px-3.5 py-2 flex items-center justify-between">
                        <span className="text-[#616161]">
                          Subtotal ({totalUnits} item{totalUnits === 1 ? "" : "s"})
                        </span>
                        <span className="font-medium text-[#303030]">
                          {formatINR(subtotal)}
                        </span>
                      </div>

                      {couponDiscount > 0 && (
                        <div className="px-3.5 py-2 flex items-center justify-between">
                          <span className="text-[#616161] flex items-center gap-1.5">
                            <span>Discount</span>
                            {couponCode && (
                              <span className="px-1.5 py-0.5 rounded bg-[#cdfee1]/60 text-[10px] font-mono font-semibold text-[#0c5132]">
                                {couponCode}
                              </span>
                            )}
                          </span>
                          <span className="text-[#0c5132] font-medium">
                            -{formatINR(couponDiscount)}
                          </span>
                        </div>
                      )}

                      <div className="px-3.5 py-2 flex items-center justify-between">
                        <span className="text-[#616161]">Delivery</span>
                        <span className="font-medium text-[#303030]">
                          {selectedOrder.shippingCost > 0
                            ? formatINR(selectedOrder.shippingCost)
                            : "Free"}
                        </span>
                      </div>

                      <div className="px-3.5 py-2.5 flex items-center justify-between font-bold text-[#303030] bg-white">
                        <span>Total</span>
                        <span>{formatINR(totalAmount)}</span>
                      </div>
                    </div>

                    <div className="px-3.5 py-2 bg-[#f7f7f7] border-t border-[#ebebeb] flex items-center justify-between text-[11px] font-medium">
                      <span className="text-[#616161]">
                        {paymentStatus === "paid"
                          ? "Paid by customer"
                          : paymentStatus === "cancelled"
                            ? "Order cancelled"
                            : "Due on delivery (COD)"}
                      </span>
                      <span className="font-semibold text-[#303030]">
                        {formatINR(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. TIMELINE FEED CARD */}
              <section className="bg-white border border-[#e3e3e3] rounded-xl shadow-[0_1px_0_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#ebebeb] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#303030]">
                    Timeline
                  </span>
                  <span className="text-[11px] text-[#616161]">
                    {timeline.length || 1} update
                    {timeline.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="divide-y divide-[#ebebeb]">
                  {timeline.length > 0 ? (
                    timeline.map((entry, idx) => (
                      <div
                        key={entry.id || idx}
                        className="px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              idx === 0 ? "bg-[#0c5132]" : "bg-[#c9cccf]"
                            }`}
                          />
                          <div className="min-w-0">
                            <span className="font-medium text-[#303030] capitalize">
                              {entry.note || `Status: ${entry.status}`}
                            </span>
                            {entry.actor && (
                              <span className="text-[11px] text-[#616161] ml-1.5">
                                • {entry.actor}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] text-[#616161] shrink-0">
                          {formatDateTime(entry.timestamp)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2.5 flex items-center justify-between text-xs">
                      <span className="text-[#303030]">Order placed</span>
                      <span className="text-[11px] text-[#616161]">
                        {formatDateTime(selectedOrder.createdAt)}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* RIGHT SIDEBAR COLUMN (CUSTOMER + ADDRESS + COMPACT ACTIONS) */}
            <div className="lg:col-span-4 space-y-3.5">
              {/* 1. CUSTOMER CARD */}
              <section className="bg-white border border-[#e3e3e3] rounded-xl shadow-[0_1px_0_rgba(0,0,0,0.03)] p-4">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <h3 className="text-xs font-semibold text-[#303030]">
                    Customer
                  </h3>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#f1f2f4] text-[#616161]">
                    {selectedOrder.userOrderMirror === false
                      ? "Guest checkout"
                      : "Account"}
                  </span>
                </div>

                <p className="text-xs font-semibold text-[#303030]">
                  {customerName}
                </p>

                <div className="mt-3 pt-3 border-t border-[#ebebeb] space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#616161] inline-flex items-center gap-1.5">
                      <Phone size={12} />
                      {customerPhone ? (
                        <a
                          href={`tel:${customerPhone}`}
                          className="text-[#2874F0] hover:underline font-medium">
                          {customerPhone}
                        </a>
                      ) : (
                        <span>No phone</span>
                      )}
                    </span>

                    {customerPhone && (
                      <button
                        type="button"
                        onClick={openWhatsAppOrder}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#cdfee1]/60 hover:bg-[#cdfee1] text-[#0c5132] text-[10px] font-semibold transition cursor-pointer">
                        <FaWhatsapp size={11} />
                        <span>WhatsApp</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[#616161] truncate">
                    <Mail size={12} className="shrink-0" />
                    <span className="truncate">
                      {customerEmail || "No email provided"}
                    </span>
                  </div>
                </div>
              </section>

              {/* 2. SHIPPING / DELIVERY ADDRESS CARD */}
              <section className="bg-white border border-[#e3e3e3] rounded-xl shadow-[0_1px_0_rgba(0,0,0,0.03)] p-4">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <h3 className="text-xs font-semibold text-[#303030] flex items-center gap-1.5">
                    <MapPin size={12} className="text-[#616161]" />
                    Delivery address
                  </h3>

                  {formattedAddress && (
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          `${customerName}\n${customerPhone}\n${formattedAddress}`,
                          "address",
                        )
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2874F0] hover:underline cursor-pointer">
                      {copiedField === "address" ? (
                        <>
                          <Check size={11} className="text-[#0c5132]" />
                          <span className="text-[#0c5132]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="text-xs text-[#303030] leading-relaxed space-y-0.5">
                  <p className="font-medium">{customerName}</p>
                  <p className="text-[#616161]">
                    {address.line1 || "No address line"}
                    {address.line2 ? `, ${address.line2}` : ""}
                  </p>
                  <p className="text-[#616161]">
                    {[address.city, address.state].filter(Boolean).join(", ")}
                    {address.pincode ? ` - ${address.pincode}` : ""}
                  </p>
                  <p className="text-[#616161]">India</p>
                </div>
              </section>

              {/* 3. REDUCED ORDER ACTIONS CARD */}
              <section className="bg-white border border-[#e3e3e3] rounded-xl shadow-[0_1px_0_rgba(0,0,0,0.03)] p-4 space-y-2.5 print:hidden">
                <h3 className="text-xs font-semibold text-[#303030]">
                  Quick actions
                </h3>

                <button
                  type="button"
                  disabled={!customerPhone}
                  onClick={openWhatsAppOrder}
                  className="w-full h-8 rounded-lg border border-[#d4d4d4] bg-white hover:bg-[#f7f7f7] text-xs font-medium text-[#303030] flex items-center justify-center gap-1.5 transition disabled:opacity-40 cursor-pointer">
                  <FaWhatsapp size={13} className="text-[#25D366]" />
                  <span>Send summary on WhatsApp</span>
                </button>

                {normalizedStatus !== "cancelled" && (
                  <div>
                    {confirmCancel ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleAction(selectedOrder, "cancelled");
                            setConfirmCancelId("");
                          }}
                          className="flex-1 h-8 rounded-lg bg-[#d72c0d] hover:bg-[#b52208] text-white text-xs font-semibold transition cursor-pointer">
                          Confirm cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmCancelId("")}
                          className="h-8 px-3 rounded-lg border border-[#d4d4d4] bg-white hover:bg-[#f7f7f7] text-xs font-medium text-[#303030] cursor-pointer">
                          Keep
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmCancelId(currentOrderKey)}
                        className="w-full h-8 rounded-lg border border-[#f5c7c2] bg-[#fff5f4] hover:bg-[#fee9e8] text-xs font-medium text-[#8e1f0b] transition cursor-pointer">
                        Cancel order
                      </button>
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
