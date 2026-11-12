import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, CreditCard, MapPin, Package } from "lucide-react";
import { orderService } from "../../features/orders/services/orderService";
import BrandLogo from "../../../components/common/BrandLogo";

const STATUS_STEPS = [
  "placed",
  "confirmed",
  "packaging",
  "shipping",
  "delivered",
];
const STATUS_LABELS = {
  placed: "Placed",
  confirmed: "Confirmed",
  packaging: "Packing",
  shipping: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAYMENT_METHOD_LABELS = {
  cod: "Cash on Delivery",
};

const PAYMENT_STATUS_STYLE = {
  pending: "text-yellow-600",
  paid: "text-green-600",
  failed: "text-red-600",
};

const SectionDivider = () => <div className="h-[0.5px] w-full bg-gray-200" />;

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const [orderData, setOrderData] = useState(
    () => location.state?.orderData ?? null,
  );
  const [loading, setLoading] = useState(!location.state?.orderData);
  const fetchedRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (fetchedRef.current || orderData || !orderId) {
      setLoading(false);
      return;
    }
    fetchedRef.current = true;

    const fetchOrder = async () => {
      try {
        const details = await orderService.getOrderDetails(orderId);
        setOrderData(details);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, orderData]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading...
      </div>
    );
  if (!orderData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Order not found
      </div>
    );

  const orderStatus = orderData.orderStatus ?? "placed";
  const address = orderData.addressSnapshot ?? {};
  const pricing = orderData.pricing ?? {};

  // FIX 1: Read paymentMethod and paymentStatus as flat root fields —
  // orderService never writes a nested payment:{} object to the root doc.
  const paymentMethod = orderData.paymentMethod ?? "";
  const paymentStatus = orderData.paymentStatus ?? "pending";

  const items = orderData.items ?? [];
  const displayOrderId =
    orderData.orderId ?? orderId?.slice(0, 10).toUpperCase();
  const progressStatus =
    {
      packed: "packaging",
      processing: "packaging",
      shipped: "shipping",
    }[orderStatus] || orderStatus;
  const progressIndex = STATUS_STEPS.indexOf(progressStatus);

  // FIX 3: Match service key priority — service writes pricing.totalPayable first,
  // then falls back to pricing.totalAmount, then root totalAmount.
  const totalAmount = Number(
    pricing?.totalPayable ?? pricing?.totalAmount ?? orderData.totalAmount ?? 0,
  ).toLocaleString("en-IN");

  // FIX 5: Strip any existing country prefix before prepending +91
  const cleanPhone = address.phone?.replace(/^(\+91|91|0)/, "") ?? "";

  const displayedItems = items;

  return (
    <div className="min-h-screen bg-[#f7f8f6] flex flex-col items-center font-sans px-4 py-8 sm:py-12">
      <div className="w-full max-w-[680px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        {/* Header */}
        <div className="bg-[#F8FAF5] p-5 sm:p-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#D99A36]/25">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 flex items-center justify-center bg-white rounded-full border border-[#168A35]/20 text-[#168A35] shrink-0">
              <CheckCircle2 size={24} aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-[#3D1D0B]">
                Order Successful
              </h1>
              <p className="text-xs text-[#168A35] font-medium">
                Order ID: <span className="font-semibold">{displayOrderId}</span>
              </p>
            </div>
          </div>
          <BrandLogo variant="horizontal" size="sm" to="/" />
        </div>

        {/* Order Progress — FIX 4 (connector line): use a relative wrapper +
            absolute underlay bar so the fill is pixel-accurate on all screen sizes */}
        {orderStatus !== "cancelled" && (
          <div className="px-4 py-3 bg-white">
            <div className="relative flex justify-between items-start">
              {/* Full background track */}
              <div className="absolute top-[5px] left-0 right-0 h-[2px] bg-gray-200 z-0" />

              {/* Filled progress track */}
              <div
                className="absolute top-[5px] left-0 h-[2px] bg-[#03a685] z-0 transition-all duration-500"
                style={{
                  width: `${(Math.max(0, progressIndex) / (STATUS_STEPS.length - 1)) * 100}%`,
                }}
              />

              {STATUS_STEPS.map((s, i) => {
                const done = i <= Math.max(0, progressIndex);
                return (
                  <div
                    key={s}
                    className="relative z-10 flex flex-col items-center"
                    style={{ width: `${100 / STATUS_STEPS.length}%` }}>
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        done
                          ? "bg-[#03a685] border-[#03a685]"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    <span
                      className={`text-[9px] mt-1 text-center leading-tight ${
                        done ? "text-gray-800 font-medium" : "text-gray-400"
                      }`}>
                      {STATUS_LABELS[s]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <SectionDivider />

        {/* Items List */}
        <div className="p-3 bg-white">
          {displayedItems.map((item, idx) => (
            <div
              key={item.id || `${item.productId}-${idx}`}
              className="flex gap-2 p-2 border border-gray-100 rounded-sm bg-gray-50 mb-2">
              <div className="w-16 h-20 bg-gray-100 rounded-sm flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={20} className="text-gray-300 m-auto mt-6" />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
                  {item.name}
                </h4>
                <p className="text-[12px] text-gray-600 mt-1">
                  {item.selectedSize && (
                    <>
                      Size:{" "}
                      <span className="font-medium">{item.selectedSize}</span>
                    </>
                  )}
                  {/* FIX 2: Service normalises quantity to item.quantity, not item.selectedQuantity */}
                  {item.selectedSize &&
                    (item.quantity ?? item.selectedQuantity) && (
                      <span className="mx-1">|</span>
                    )}
                  {(item.quantity ?? item.selectedQuantity) && (
                    <>
                      Qty:{" "}
                      <span className="font-medium">
                        {item.quantity ?? item.selectedQuantity}
                      </span>
                    </>
                  )}
                </p>
                <p className="text-[12px] font-semibold text-gray-800 mt-1">
                  ₹
                  {(
                    Number(item.price || 0) *
                    Number(item.quantity ?? item.selectedQuantity ?? 1)
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Address */}
        <div className="flex items-start justify-between bg-white p-3">
          <div className="flex gap-2 pr-2">
            <MapPin size={18} className="text-gray-600 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                Delivery Address
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {address.name}
              </p>
              <p className="text-[12px] text-gray-600 mt-0.5">
                {[
                  address.line1,
                  address.line2,
                  address.city,
                  address.state,
                ]
                  .filter(Boolean)
                  .join(", ")}{" "}
                {address.pincode && (
                  <>
                    – <span className="font-semibold">{address.pincode}</span>
                  </>
                )}
              </p>
              {/* FIX 5: cleanPhone strips any existing +91/91/0 prefix */}
              {cleanPhone && (
                <p className="text-[12px] text-gray-800 font-medium mt-0.5">
                  +91 {cleanPhone}
                </p>
              )}
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400 mt-1 shrink-0" />
        </div>

        <SectionDivider />

        {/* Payment Mode + Price Breakdown — single unified section */}
        <div className="p-3 bg-white">
          {/* ── Payment mode row ── */}
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
            Payment Details
          </p>
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={18} className="text-gray-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {PAYMENT_METHOD_LABELS[paymentMethod?.toLowerCase()] ??
                  paymentMethod ??
                  "—"}
              </p>
              <p
                className={`text-[11px] font-medium ${PAYMENT_STATUS_STYLE[paymentStatus] ?? "text-gray-500"}`}>
                {paymentStatus === "pending" && "Payment Pending"}
                {paymentStatus === "paid" && "Payment Completed"}
                {paymentStatus === "failed" && "Payment Failed"}
              </p>
            </div>
          </div>

          {/* ── Thin divider between mode and breakdown ── */}
          <div className="h-[0.5px] bg-gray-100 mb-3" />

          {/* ── Price rows ── */}
          <div className="flex flex-col gap-2.5">
            {/* Subtotal */}
            {(pricing.subtotal ?? pricing.totalMRP) != null && (
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-gray-500">
                  Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})
                </span>
                <span className="text-[12px] text-gray-700">
                  ₹
                  {Number(pricing.subtotal ?? pricing.totalMRP).toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>
            )}

            {/* Discount */}
            {pricing.discount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-gray-500">Discount</span>
                <span className="text-[12px] font-semibold text-green-600">
                  − ₹{Number(pricing.discount).toLocaleString("en-IN")}
                </span>
              </div>
            )}

            {/* Coupon discount */}
            {pricing.couponDiscount > 0 && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-gray-500">
                    Coupon Discount
                  </span>
                  {pricing.couponCode && (
                    <span className="rounded bg-[#edf5ee] px-1.5 py-0.5 text-[10px] font-bold text-[#315c3c]">
                      {pricing.couponCode}
                    </span>
                  )}
                </div>
                <span className="text-[12px] font-semibold text-green-600">
                  − ₹{Number(pricing.couponDiscount).toLocaleString("en-IN")}
                </span>
              </div>
            )}

            {/* Platform fee */}
            {pricing.platformFee > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-gray-500">Platform Fee</span>
                <span className="text-[12px] text-gray-700">
                  ₹{Number(pricing.platformFee).toLocaleString("en-IN")}
                </span>
              </div>
            )}

            {/* GST / Tax */}
            {pricing.gstAmount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-gray-500">
                  GST{pricing.gstPercent ? ` (${pricing.gstPercent}%)` : ""}
                </span>
                <span className="text-[12px] text-gray-700">
                  ₹{Number(pricing.gstAmount).toLocaleString("en-IN")}
                </span>
              </div>
            )}

            {/* Total row */}
            <div className="h-[0.5px] bg-gray-200 mt-0.5" />
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-bold text-gray-900">
                Total Amount
              </span>
              <span className="text-[14px] font-extrabold text-[#315c3c]">
                ₹{totalAmount}
              </span>
            </div>

            {/* Savings callout */}
            {(() => {
              const saved =
                (pricing.discount ?? 0) + (pricing.couponDiscount ?? 0);
              if (saved <= 0) return null;
              return (
                <div className="bg-green-50 border border-green-100 rounded px-2.5 py-1.5">
                  <span className="text-[11px] font-semibold text-green-700">
                    🎉 You saved ₹{Number(saved).toLocaleString("en-IN")} on
                    this order!
                  </span>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Buttons */}
        <div className="sticky bottom-0 left-0 w-full bg-white p-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-full rounded-lg bg-[#315c3c] py-3 text-sm font-semibold text-white transition hover:bg-[#244b2e] flex items-center justify-center gap-2">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
