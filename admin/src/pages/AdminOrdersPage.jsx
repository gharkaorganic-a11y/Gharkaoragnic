import React, { useState, useEffect, useMemo } from "react";

import {
  FaRotate,
  FaWhatsapp,
  FaTrashCan,
  FaEye,
  FaBoxOpen,
  FaTruckFast,
  FaCheckDouble,
  FaCircleCheck,
  FaXmark,
  FaClock,
  FaRegFileLines,
} from "react-icons/fa6";

import { BiLoaderAlt, BiFilterAlt } from "react-icons/bi";

import OrderDetailsModal from "../components/modals/OrderDetailsModal";

import { adminOrderService } from "../services/firebase/adminOrderService";

const STATUS_FLOW = {
  pending: {
    label: "Pending",
    color: "text-rose-600",
    bg: "bg-rose-50",
    next: "confirmed",
    btn: "Authorize Order",
    icon: <FaClock />,
  },

  placed: {
    label: "Placed",
    color: "text-rose-600",
    bg: "bg-rose-50",
    next: "confirmed",
    btn: "Authorize Order",
    icon: <FaClock />,
  },

  confirmed: {
    label: "Confirmed",
    color: "text-blue-600",
    bg: "bg-blue-50",
    next: "packaging",
    btn: "Start Pack",
    icon: <FaCircleCheck />,
  },

  packaging: {
    label: "Packaging",
    color: "text-amber-600",
    bg: "bg-amber-50",
    next: "shipping",
    btn: "Dispatch",
    icon: <FaBoxOpen />,
  },

  shipping: {
    label: "Shipping",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    next: "delivered",
    btn: "Complete",
    icon: <FaTruckFast />,
  },

  delivered: {
    label: "Delivered",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    next: null,
    btn: null,
    icon: <FaCheckDouble />,
  },

  cancelled: {
    label: "Cancelled",
    color: "text-slate-400",
    bg: "bg-slate-50",
    next: null,
    btn: null,
    icon: <FaXmark />,
  },
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [loadingMore, setLoadingMore] = useState(false);

  const [lastDoc, setLastDoc] = useState(null);

  const [hasMore, setHasMore] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const {
        orders: fetched,
        lastDoc: newLastDoc,
        hasMore: newHasMore,
      } = await adminOrderService.getOrders(20, isLoadMore ? lastDoc : null);

      setOrders((prev) => (isLoadMore ? [...prev, ...fetched] : fetched || []));

      setLastDoc(newLastDoc);

      setHasMore(newHasMore);
    } catch (error) {
      console.error("[AdminOrdersPage] loadOrders:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const openOrderDetails = async (orderId) => {
    try {
      const fullOrder = await adminOrderService.getOrderDetails(orderId);

      if (fullOrder) {
        setSelectedOrder(fullOrder);
      }
    } catch (err) {
      console.error("[AdminOrdersPage] openOrderDetails:", err);
    }
  };

  const handleAction = async (order, nextStatus) => {
    try {
      /* -----------------------------------
       PAYMENT STATUS LOGIC
    ----------------------------------- */

      let updatedPaymentStatus = order.paymentStatus || "pending";

      // COD FLOW
      if ((order.paymentMethod || "").toLowerCase() === "cod") {
        if (nextStatus === "confirmed") {
          updatedPaymentStatus = "confirmed";
        }

        if (nextStatus === "delivered") {
          updatedPaymentStatus = "paid";
        }

        if (nextStatus === "cancelled") {
          updatedPaymentStatus = "cancelled";
        }
      }

      // ONLINE PAYMENT FLOW
      else {
        if (nextStatus === "confirmed") {
          updatedPaymentStatus = "paid";
        }

        if (nextStatus === "cancelled") {
          updatedPaymentStatus = "refund_pending";
        }
      }

      /* -----------------------------------
       FIREBASE UPDATE
    ----------------------------------- */

      await adminOrderService.updateOrderStatus({
        orderId: order.id,
        userId: order.userId,
        newStatus: nextStatus,
        paymentStatus: updatedPaymentStatus,
        adminName: "Admin Dashboard",
      });

      /* -----------------------------------
       WHATSAPP
    ----------------------------------- */

      if (nextStatus === "confirmed") {
        executeWhatsApp(order);
      }

      /* -----------------------------------
       LOCAL UI UPDATE
    ----------------------------------- */

      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
                ...o,
                status: nextStatus,
                orderStatus: nextStatus,
                paymentStatus: updatedPaymentStatus,
              }
            : o,
        ),
      );

      /* -----------------------------------
       MODAL UPDATE
    ----------------------------------- */

      if (selectedOrder?.id === order.id) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: nextStatus,
          orderStatus: nextStatus,
          paymentStatus: updatedPaymentStatus,
        }));
      }
    } catch (err) {
      console.error("[AdminOrdersPage] handleAction:", err);

      alert("Order update failed");
    }
  };

  const executeWhatsApp = (order) => {
    try {
      let phone = order?.phone?.replace(/\D/g, "");

      if (!phone) return;

      if (phone.length === 10) {
        phone = "91" + phone;
      }

      const msg = `Hi ${
        order?.customerName || "Customer"
      }, your order #${order.id.slice(-6).toUpperCase()} is CONFIRMED.`;

      window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
        "_blank",
      );
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (date) => {
    try {
      if (!date) return "Recent";

      if (date?.toDate) {
        return date.toDate().toLocaleDateString();
      }

      return new Date(date).toLocaleDateString();
    } catch {
      return "Recent";
    }
  };

  const filtered = useMemo(() => {
    const s = searchTerm.toLowerCase();

    return orders.filter(
      (o) =>
        o?.id?.toLowerCase()?.includes(s) ||
        o?.customerName?.toLowerCase()?.includes(s) ||
        o?.phone?.includes(s),
    );
  }, [orders, searchTerm]);

  const stats = useMemo(
    () => adminOrderService.calculateOrderAnalytics(orders),
    [orders],
  );

  if (loading && !orders.length) {
    return <LoadingHUD />;
  }

  return (
    <div className="min-h-screen bg-[#F4F7F9] pt-24 pb-12 px-4 md:px-8 font-sans">
      <div className="max-w-[1600px] mx-auto">
        {/* TOP STRIP */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatBox
            label="Total Orders"
            value={stats.totalOrders}
            color="blue"
          />

          <StatBox
            label="Pending Orders"
            value={stats.pendingOrders}
            color="rose"
          />

          <StatBox
            label="Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            color="emerald"
          />

          <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-sm">
            <button
              onClick={() => loadOrders(false)}
              className="w-full h-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#ff356c] transition-all active:scale-95">
              <FaRotate />
              Refresh Registry
            </button>
          </div>
        </div>

        {/* SEARCH */}

        <div className="bg-white border border-slate-200 p-3 mb-4 rounded-sm flex items-center shadow-sm">
          <BiFilterAlt className="text-slate-300 ml-2" />

          <input
            type="text"
            placeholder="Search Order ID, Customer, or Contact..."
            className="flex-1 px-4 py-2 text-[11px] font-bold uppercase tracking-wider outline-none text-slate-900 bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="bg-slate-50 px-3 py-1 text-[9px] font-black text-slate-400 uppercase border border-slate-100 rounded-sm">
            Records: {filtered.length}
          </div>
        </div>

        {/* TABLE */}

        <div className="bg-white border border-[#e0e0e0] rounded-xl shadow-sm overflow-hidden mb-6">
          {/* TOP BAR */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f0f0] bg-gradient-to-r from-white to-[#fafcff]">
            <div>
              <h2 className="text-[18px] font-semibold tracking-tight text-[#212121]">
                Orders Management
              </h2>

              <p className="text-[13px] text-[#878787] mt-1">
                Monitor customer orders, payments and delivery updates.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-2 rounded-lg bg-[#f5f7ff] border border-[#dfe7ff]">
                <p className="text-[10px] uppercase tracking-wider text-[#2874f0] font-bold">
                  Total Orders
                </p>

                <h3 className="text-[18px] font-bold text-[#212121]">
                  {filtered.length}
                </h3>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1100px]">
              {/* HEAD */}
              <thead>
                <tr className="bg-[#fafafa] border-b border-[#f0f0f0]">
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#878787]">
                    Order
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#878787]">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#878787]">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#878787]">
                    Items
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#878787]">
                    Payment
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#878787]">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-[#878787]">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-[#f3f3f3]">
                {filtered.map((order) => {
                  const currentStatus =
                    order.orderStatus || order.status || "placed";

                  const config =
                    STATUS_FLOW[currentStatus] || STATUS_FLOW.placed;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#fafcff] transition-colors duration-200">
                      {/* ORDER */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-[13px] font-semibold text-[#212121] tracking-tight">
                            #{order.id.slice(-8).toUpperCase()}
                          </p>

                          <div className="flex items-center gap-1 mt-1">
                            <FaRegFileLines
                              size={10}
                              className="text-[#878787]"
                            />

                            <p className="text-[11px] text-[#878787]">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CUSTOMER */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-[13px] font-semibold text-[#212121]">
                            {order.customerName || "Guest User"}
                          </p>

                          <button
                            onClick={() =>
                              window.open(
                                `https://wa.me/${order.phone?.replace(
                                  /\D/g,
                                  "",
                                )}`,
                                "_blank",
                              )
                            }
                            className="flex items-center gap-1.5 mt-2 text-[11px] text-[#878787] hover:text-[#25D366] transition-colors">
                            <FaWhatsapp size={11} />

                            {order.phone || "No Contact"}
                          </button>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">
                        <div
                          className={`
                    inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                    text-[10px] font-semibold uppercase tracking-wide
                    border
                    ${config.bg}
                    ${config.color}
                    border-current/10
                  `}>
                          {config.icon}

                          {config.label}
                        </div>
                      </td>

                      {/* ITEMS */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {/* PRODUCT STACK */}
                          <div className="flex -space-x-2">
                            {order.items?.slice(0, 3)?.map((item, index) => (
                              <img
                                key={index}
                                src={item.image}
                                alt=""
                                className="w-9 h-9 rounded-lg border-2 border-white bg-[#f5f5f5] object-cover shadow-sm"
                              />
                            ))}
                          </div>

                          <div>
                            <p className="text-[13px] font-semibold text-[#212121]">
                              {order.itemCount || order.items?.length || 0}{" "}
                              Items
                            </p>

                            <p className="text-[11px] text-[#878787]">
                              {order.items?.[0]?.name?.slice(0, 24)}
                              {order.items?.length > 1 && " + more"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* PAYMENT */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-[12px] font-medium uppercase text-[#212121]">
                            {order.paymentMethod || "COD"}
                          </p>

                          <span
                            className={`
                      inline-block mt-2 px-2.5 py-1 rounded-full
                      text-[10px] font-semibold uppercase
                      ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }
                    `}>
                            {order.paymentStatus || "Pending"}
                          </span>
                        </div>
                      </td>

                      {/* AMOUNT */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-[15px] font-bold text-[#212121]">
                            ₹{Number(order.totalAmount || 0).toLocaleString()}
                          </p>

                          {order.discount > 0 && (
                            <p className="text-[11px] text-green-600 mt-1 font-medium">
                              Saved ₹{order.discount}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          {config.next && (
                            <button
                              onClick={() => handleAction(order, config.next)}
                              className="
                        px-4 py-2 rounded-lg
                        bg-[#2874f0]
                        hover:bg-[#1c63d5]
                        text-white
                        text-[11px]
                        font-semibold
                        transition-all
                        active:scale-95
                        shadow-sm
                      ">
                              {config.btn}
                            </button>
                          )}

                          {/* VIEW */}
                          <button
                            onClick={() => openOrderDetails(order.id)}
                            className="
                      w-10 h-10 rounded-lg
                      border border-[#e0e0e0]
                      text-[#878787]
                      hover:text-[#2874f0]
                      hover:border-[#2874f0]
                      hover:bg-[#f5f9ff]
                      transition-all
                      flex items-center justify-center
                    ">
                            <FaEye size={15} />
                          </button>

                          {/* DELETE */}
                          {currentStatus !== "cancelled" && (
                            <button
                              onClick={() => handleAction(order, "cancelled")}
                              className="
                        w-10 h-10 rounded-lg
                        border border-[#e0e0e0]
                        text-[#878787]
                        hover:text-red-600
                        hover:border-red-200
                        hover:bg-red-50
                        transition-all
                        flex items-center justify-center
                      ">
                              <FaTrashCan size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* EMPTY STATE */}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center mb-4">
                          <Sparkles size={24} className="text-[#878787]" />
                        </div>

                        <h3 className="text-[16px] font-semibold text-[#212121]">
                          No Orders Found
                        </h3>

                        <p className="text-[13px] text-[#878787] mt-1">
                          Orders will appear here once customers place them.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* LOAD MORE */}

        {hasMore && (
          <div className="flex justify-center pb-8">
            <button
              onClick={() => loadOrders(true)}
              disabled={loadingMore}
              className="px-8 py-3 bg-white border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest shadow-sm rounded-sm hover:border-slate-300 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
              {loadingMore && <BiLoaderAlt className="animate-spin" />}

              {loadingMore ? "Fetching Records..." : "Load Older Records"}
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}

      {selectedOrder && (
        <OrderDetailsModal
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          handleAction={handleAction}
          STATUS_FLOW={STATUS_FLOW}
        />
      )}
    </div>
  );
};

/* =========================================================
   UTILITY COMPONENTS
========================================================= */

const StatBox = ({ label, value, color }) => {
  const colors = {
    blue: "border-l-blue-500",
    rose: "border-l-rose-500",
    emerald: "border-l-emerald-500",
  };

  return (
    <div
      className={`bg-white p-4 border border-slate-200 border-l-4 ${colors[color]} rounded-sm shadow-sm`}>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </p>

      <p className="text-xl font-black text-slate-950">{value}</p>
    </div>
  );
};

const LoadingHUD = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center p-20">
    <BiLoaderAlt className="animate-spin text-slate-200 mb-6" size={50} />

    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 animate-pulse">
      Scanning Logistics Registry
    </p>
  </div>
);

export default AdminOrdersPage;
