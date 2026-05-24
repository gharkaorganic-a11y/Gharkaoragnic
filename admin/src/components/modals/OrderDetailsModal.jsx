import React from "react";
import { ShoppingBag } from "lucide-react";

import {
  FaXmark,
  FaPrint,
  FaWhatsapp,
  FaCircleCheck,
  FaTrashCan,
  FaBox,
  FaClock,
  FaTruck,
} from "react-icons/fa6";

const OrderDetailsModal = ({
  selectedOrder,
  setSelectedOrder,
  handleAction,
  handleDelete,
  STATUS_FLOW,
}) => {
  if (!selectedOrder) return null;

  const STATUS_STEPS = [
    { key: "placed", label: "Order Placed", icon: FaClock },
    { key: "confirmed", label: "Confirmed", icon: FaCircleCheck },
    { key: "packaging", label: "Packed", icon: FaBox },
    { key: "shipping", label: "Shipping", icon: FaTruck },
    { key: "delivered", label: "Delivered", icon: FaCircleCheck },
  ];

  const statusMap = {
    pending: "placed",
    placed: "placed",
    confirmed: "confirmed",
    packaging: "packaging",
    shipping: "shipping",
    delivered: "delivered",
  };

  const normalizedStatus = statusMap[selectedOrder.status] || "placed";

  const currentStatusIndex = STATUS_STEPS.findIndex(
    (s) => s.key === normalizedStatus,
  );

  const flowConfig =
    STATUS_FLOW[selectedOrder.status] || STATUS_FLOW["pending"];

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm">
      <div className="w-full h-full overflow-y-auto bg-[#f1f3f6]">
        {/* HEADER */}
        <div className="sticky top-0 z-30 bg-[#2874f0] text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>

              <div>
                <h2 className="text-[18px] md:text-[20px] font-semibold tracking-tight">
                  Order #{selectedOrder.id?.slice(-8).toUpperCase() || "N/A"}
                </h2>

                <div className="flex flex-wrap items-center gap-2 mt-1 text-[12px] text-blue-100">
                  <span>Placed on {formatDate(selectedOrder.createdAt)}</span>

                  <span className="w-1 h-1 rounded-full bg-blue-200" />

                  <span className="capitalize font-medium">
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition">
              <FaXmark size={18} />
            </button>
          </div>
        </div>

        {/* STATUS TRACKER */}
        <div className="bg-white border-b border-[#e0e0e0]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="flex items-center justify-between overflow-x-auto">
              {STATUS_STEPS.map((step, idx) => {
                const isDone = idx <= currentStatusIndex;
                const isActive = idx === currentStatusIndex;
                const Icon = step.icon;

                return (
                  <React.Fragment key={step.key}>
                    <div className="flex flex-col items-center min-w-[100px]">
                      <div
                        className={`
                          w-11 h-11 rounded-full flex items-center justify-center
                          border-[3px] transition-all duration-300
                          ${
                            isDone
                              ? "bg-[#2874f0] border-blue-100 text-white"
                              : "bg-[#f1f3f6] border-[#e0e0e0] text-[#878787]"
                          }
                        `}>
                        <Icon size={15} />
                      </div>

                      <span
                        className={`
                          text-[11px] mt-2 font-medium text-center
                          ${
                            isActive
                              ? "text-[#2874f0]"
                              : isDone
                                ? "text-[#212121]"
                                : "text-[#878787]"
                          }
                        `}>
                        {step.label}
                      </span>
                    </div>

                    {idx < STATUS_STEPS.length - 1 && (
                      <div className="flex-1 h-[3px] mx-2 rounded-full bg-[#e0e0e0] overflow-hidden mb-6 min-w-[40px]">
                        <div
                          className={`
                            h-full bg-[#2874f0] transition-all duration-500
                            ${idx < currentStatusIndex ? "w-full" : "w-0"}
                          `}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* META CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Payment",
                value: selectedOrder.paymentMethod || "COD",
              },
              {
                label: "Items",
                value: selectedOrder.items?.length || 0,
              },
              {
                label: "Order Value",
                value: `₹${Number(
                  selectedOrder.totalAmount || 0,
                ).toLocaleString("en-IN")}`,
              },
              {
                label: "Status",
                value: selectedOrder.status,
                color: "text-[#2874f0]",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border border-[#e0e0e0] rounded-xl p-4 shadow-sm">
                <p className="text-[11px] text-[#878787] uppercase tracking-wider font-medium">
                  {item.label}
                </p>

                <h4
                  className={`text-[18px] font-semibold mt-2 capitalize ${
                    item.color || "text-[#212121]"
                  }`}>
                  {item.value}
                </h4>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* LEFT */}
            <div className="xl:col-span-7 space-y-5">
              {/* CUSTOMER */}
              <div className="bg-white border border-[#e0e0e0] rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between flex-wrap gap-5">
                  <div>
                    <p className="text-[11px] text-[#878787] uppercase tracking-wider font-medium">
                      Customer
                    </p>

                    <h3 className="text-[22px] font-semibold text-[#212121] mt-1 tracking-tight">
                      {selectedOrder.addressSnapshot?.name ||
                        selectedOrder.customerName ||
                        "Customer"}
                    </h3>

                    <p className="text-[13px] text-[#878787] mt-2">
                      {selectedOrder.email || "No Email"}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-[11px] text-[#878787] uppercase tracking-wider font-medium">
                      Lifetime Value
                    </p>

                    <h3 className="text-[28px] font-bold text-[#2874f0] mt-2">
                      ₹
                      {Number(selectedOrder.totalAmount || 0).toLocaleString(
                        "en-IN",
                      )}
                    </h3>
                  </div>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="bg-white border border-[#e0e0e0] rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#f0f0f0]">
                  <h3 className="text-[17px] font-semibold text-[#212121] tracking-tight">
                    Delivery Address
                  </h3>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start gap-5">
                    <div>
                      <p className="text-[15px] font-semibold text-[#212121]">
                        {selectedOrder.addressSnapshot?.name ||
                          selectedOrder.customerName ||
                          "Customer"}
                      </p>

                      <p className="text-[14px] text-[#616161] mt-3 leading-7">
                        {selectedOrder.addressSnapshot?.line1}
                        {selectedOrder.addressSnapshot?.line2 &&
                          `, ${selectedOrder.addressSnapshot.line2}`}
                        <br />
                        {selectedOrder.addressSnapshot?.city},{" "}
                        {selectedOrder.addressSnapshot?.state} -
                        <span className="font-semibold text-[#212121] ml-1">
                          {selectedOrder.addressSnapshot?.pincode}
                        </span>
                      </p>

                      <p className="text-[14px] font-medium text-[#212121] mt-4">
                        {selectedOrder.addressSnapshot?.phone ||
                          selectedOrder.phone ||
                          "No phone"}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const phoneNum = (
                          selectedOrder.phone ||
                          selectedOrder.addressSnapshot?.phone ||
                          ""
                        ).replace(/\D/g, "");

                        if (phoneNum) {
                          window.open(
                            `https://wa.me/${
                              phoneNum.length === 10
                                ? "91" + phoneNum
                                : phoneNum
                            }`,
                            "_blank",
                          );
                        }
                      }}
                      className="w-11 h-11 rounded-full bg-green-50 hover:bg-green-100 flex items-center justify-center transition">
                      <FaWhatsapp size={18} className="text-[#25D366]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ITEMS */}
              <div className="bg-white border border-[#e0e0e0] rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#f0f0f0]">
                  <h3 className="text-[17px] font-semibold text-[#212121] tracking-tight">
                    Order Items ({selectedOrder.items?.length || 0})
                  </h3>
                </div>

                <div className="divide-y divide-[#f3f3f3]">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="p-5 hover:bg-[#fafcff] transition">
                      <div className="flex gap-5">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          className="w-24 h-24 object-contain bg-[#f8f8f8] rounded-xl p-2 border border-[#ececec]"
                        />

                        <div className="flex-1">
                          <p className="text-[15px] md:text-[16px] font-semibold text-[#212121] hover:text-[#2874f0] cursor-pointer transition leading-6">
                            {item.name}
                          </p>

                          <div className="flex gap-3 mt-3 flex-wrap">
                            {item.selectedSize && (
                              <span className="px-3 py-1 rounded-full bg-[#f5f5f5] text-[11px] font-medium text-[#616161]">
                                Size: {item.selectedSize}
                              </span>
                            )}

                            <span className="px-3 py-1 rounded-full bg-[#f5f5f5] text-[11px] font-medium text-[#616161]">
                              Qty: {item.quantity}
                            </span>
                          </div>

                          <div className="flex gap-2 mt-4 flex-wrap">
                            <span className="px-3 py-1 text-[11px] rounded-full bg-blue-50 text-[#2874f0] font-medium">
                              SKU: {item.sku || "N/A"}
                            </span>

                            <span className="px-3 py-1 text-[11px] rounded-full bg-green-50 text-green-700 font-medium">
                              In Stock
                            </span>
                          </div>

                          <p className="text-[22px] font-bold text-[#212121] mt-5">
                            ₹{Number(item.price || 0).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="xl:col-span-5 space-y-5">
              {/* PRICE */}
              <div className="bg-white border border-[#e0e0e0] rounded-xl shadow-sm p-5">
                <h4 className="text-[17px] font-semibold text-[#212121] tracking-tight mb-5 pb-4 border-b border-[#f0f0f0]">
                  Price Details
                </h4>

                <div className="space-y-5 text-[14px]">
                  <div className="flex justify-between">
                    <span className="text-[#616161]">
                      Price ({selectedOrder.items?.length || 0} items)
                    </span>

                    <span className="font-medium text-[#212121]">
                      ₹
                      {Number(
                        selectedOrder.subtotal ||
                          selectedOrder.totalAmount ||
                          0,
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#616161]">Delivery Charges</span>

                    <span className="font-semibold text-green-600">
                      {selectedOrder.shippingCost
                        ? `₹${selectedOrder.shippingCost}`
                        : "FREE"}
                    </span>
                  </div>

                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#616161]">Discount</span>

                      <span className="font-semibold text-green-600">
                        -₹
                        {Number(selectedOrder.discount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between pt-5 border-t border-dashed border-[#dcdcdc]">
                    <span className="text-[16px] font-semibold text-[#212121]">
                      Total Amount
                    </span>

                    <span className="text-[22px] font-bold text-[#212121]">
                      ₹
                      {Number(selectedOrder.totalAmount || 0).toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#f0f0f0]">
                  <p className="text-[13px] text-green-600 font-medium">
                    You saved ₹
                    {(selectedOrder.discount || 0) +
                      (selectedOrder.shippingCost ? 0 : 40)}{" "}
                    on this order
                  </p>
                </div>
              </div>

              {/* PAYMENT */}
              <div className="bg-white border border-[#e0e0e0] rounded-xl shadow-sm p-5">
                <h4 className="text-[17px] font-semibold text-[#212121] tracking-tight mb-5">
                  Payment Details
                </h4>

                <div className="space-y-5 text-[14px]">
                  <div className="flex justify-between">
                    <span className="text-[#616161]">Payment Method</span>

                    <span className="font-semibold uppercase text-[#212121]">
                      {selectedOrder.paymentMethod || "COD"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#616161]">Payment Status</span>

                    <span
                      className={`
                        px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide
                        ${
                          selectedOrder.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }
                      `}>
                      {selectedOrder.paymentStatus?.toUpperCase() || "PENDING"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="bg-white border border-[#e0e0e0] rounded-xl shadow-sm p-5 space-y-3">
                {flowConfig?.next && (
                  <button
                    onClick={() => handleAction(selectedOrder, flowConfig.next)}
                    className="w-full py-3.5 bg-[#2874f0] text-white rounded-lg text-[14px] font-semibold hover:bg-[#1f6fe5] transition">
                    {flowConfig.btn}
                  </button>
                )}

                <button
                  onClick={() => handleAction(selectedOrder, "cancelled")}
                  className="w-full py-3.5 border border-red-200 text-red-600 bg-red-50 rounded-lg text-[14px] font-semibold hover:bg-red-100 transition">
                  Cancel Order
                </button>

                <button className="w-full py-3.5 bg-[#f5f5f5] text-[#212121] rounded-lg text-[14px] font-semibold hover:bg-[#ebebeb] transition flex items-center justify-center gap-2">
                  <FaPrint size={13} />
                  Download Invoice
                </button>

                {handleDelete && (
                  <button
                    onClick={() => handleDelete(selectedOrder.id)}
                    className="w-full py-2 text-[#878787] hover:text-red-600 text-[13px] font-medium transition flex items-center justify-center gap-2">
                    <FaTrashCan size={11} />
                    Delete Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
