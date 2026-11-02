import React, { useState, useEffect, useMemo } from "react";
import {
  FaRotate,
  FaWhatsapp,
  FaEye,
  FaRegFileLines,
} from "react-icons/fa6";
import { BiLoaderAlt, BiSearch } from "react-icons/bi";
import OrderDetailsModal from "../components/modals/OrderDetailsModal";
import { adminOrderService } from "../services/firebase/adminOrderService";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    next: "confirmed",
    btn: "Confirm Order",
  },
  placed: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    next: "confirmed",
    btn: "Confirm Order",
  },
  confirmed: {
    label: "Confirmed",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    next: "delivered",
    btn: "Mark Delivered",
  },
  packaging: {
    label: "Packaging",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
    next: "shipping",
    btn: "Ship Order",
  },
  shipping: {
    label: "Shipping",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
    next: "delivered",
    btn: "Mark Delivered",
  },
  delivered: {
    label: "Delivered",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    next: null,
    btn: null,
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    next: null,
    btn: null,
  },
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "packaging", label: "Packaging" },
  { value: "shipping", label: "Shipping" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderError, setOrderError] = useState("");

  // Real-time subscription to orders
  useEffect(() => {
    return adminOrderService.subscribeToLatestOrders(
      (latestOrders, latestDoc, moreOrdersAvailable) => {
        setOrders((currentOrders) => {
          const latestIds = new Set(latestOrders.map((order) => order.id));
          const previouslyLoadedOlderOrders = currentOrders.filter(
            (order) => !latestIds.has(order.id),
          );
          return [...latestOrders, ...previouslyLoadedOlderOrders];
        });
        setLastDoc(latestDoc);
        setHasMore(moreOrdersAvailable);
        setOrderError("");
        setLoading(false);
      },
      (error) => {
        console.error("[AdminOrdersPage] Live order updates failed:", error);
        setOrderError("Live order updates failed. Refresh to try again.");
        setLoading(false);
      },
    );
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
      setOrderError("");
    } catch (error) {
      console.error("[AdminOrdersPage] loadOrders:", error);
      setOrderError("Could not load orders. Please try again.");
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
      } else {
        setOrderError("Order details were not found.");
      }
    } catch (err) {
      console.error("[AdminOrdersPage] openOrderDetails:", err);
      setOrderError("Could not load order details. Please try again.");
    }
  };

  const handleStatusChange = async (order, newStatus) => {
    const currentStatus = order.orderStatus || order.status || "placed";
    if (currentStatus === newStatus) return;

    try {
      let updatedPaymentStatus = order.paymentStatus || "pending";

      if ((order.paymentMethod || "").toLowerCase() === "cod") {
        if (newStatus === "delivered") {
          updatedPaymentStatus = "paid";
        }
      }

      if (newStatus === "cancelled") {
        updatedPaymentStatus = "cancelled";
      }

      await adminOrderService.updateOrderStatus({
        orderId: order.id,
        userId: order.userId,
        userOrderMirror: order.userOrderMirror !== false,
        newStatus,
        paymentStatus: updatedPaymentStatus,
        adminName: "Admin Dashboard",
      });

      if (newStatus === "confirmed") {
        executeWhatsApp(order);
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
                ...o,
                status: newStatus,
                orderStatus: newStatus,
                paymentStatus: updatedPaymentStatus,
              }
            : o,
        ),
      );

      if (selectedOrder?.id === order.id) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: newStatus,
          orderStatus: newStatus,
          paymentStatus: updatedPaymentStatus,
        }));
      }
    } catch (err) {
      console.error("[AdminOrdersPage] handleStatusChange:", err);
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
      }, your Ghar Ka Organic order #${order.id.slice(-6).toUpperCase()} is confirmed! Thank you for choosing our authentic Himalayan products.`;
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
      const d = date?.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recent";
    }
  };

  // Analytics calculation
  const stats = useMemo(
    () => adminOrderService.calculateOrderAnalytics(orders),
    [orders],
  );

  // Filtered orders
  const filtered = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    return orders.filter((o) => {
      const currentStatus = o.orderStatus || o.status || "placed";

      // Status filter
      if (statusFilter === "pending") {
        if (!["pending", "placed"].includes(currentStatus)) return false;
      } else if (statusFilter !== "all" && currentStatus !== statusFilter) {
        return false;
      }

      // Search filter
      if (!s) return true;
      return (
        o?.id?.toLowerCase()?.includes(s) ||
        o?.customerName?.toLowerCase()?.includes(s) ||
        o?.phone?.includes(s)
      );
    });
  }, [orders, searchTerm, statusFilter]);

  if (loading && !orders.length) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-12 bg-white">
        <BiLoaderAlt className="animate-spin text-neutral-400 mb-3" size={36} />
        <p className="text-sm text-neutral-500 font-medium">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-8 md:px-8 font-sans text-[#121212]">
      <div className="max-w-[1400px] mx-auto">
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#121212] tracking-tight">
              Orders
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Manage and fulfill customer orders in a clean grid view.
            </p>
          </div>

          <button
            onClick={() => loadOrders(false)}
            aria-label="Refresh orders"
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#e5e5e5] hover:border-[#121212] text-xs font-medium text-neutral-700 rounded-lg transition-all shadow-2xs cursor-pointer active:scale-95">
            <FaRotate size={12} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {orderError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {orderError}
          </div>
        )}

        {/* ── 4 CLEAN METRIC STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 mb-6">
          <div className="bg-white border border-[#e5e5e5] rounded-xl p-4 shadow-2xs">
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
              Total Orders
            </p>
            <p className="text-2xl font-bold text-[#121212] mt-1">
              {stats.totalOrders}
            </p>
          </div>

          <div className="bg-white border border-[#e5e5e5] rounded-xl p-4 shadow-2xs">
            <p className="text-[11px] font-medium text-amber-600 uppercase tracking-wider">
              Pending Orders
            </p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {stats.pendingOrders}
            </p>
          </div>

          <div className="bg-white border border-[#e5e5e5] rounded-xl p-4 shadow-2xs">
            <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider">
              Delivered
            </p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {stats.deliveredOrders}
            </p>
          </div>

          <div className="bg-white border border-[#e5e5e5] rounded-xl p-4 shadow-2xs">
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
              Total Revenue
            </p>
            <p className="text-2xl font-bold text-[#121212] mt-1">
              ₹
              {stats.totalRevenue.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>

        {/* ── FILTER TABS & SEARCH BAR ── */}
        <div className="bg-white border border-[#e5e5e5] rounded-xl p-3 sm:p-4 mb-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { key: "all", label: `All (${orders.length})` },
              { key: "pending", label: `Pending (${stats.pendingOrders})` },
              { key: "confirmed", label: `Confirmed (${stats.confirmedOrders})` },
              { key: "delivered", label: `Delivered (${stats.deliveredOrders})` },
              { key: "cancelled", label: `Cancelled (${stats.cancelledOrders})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  statusFilter === tab.key
                    ? "bg-[#121212] text-white shadow-xs"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <BiSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Search by ID, name, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#fafafa] border border-[#e5e5e5] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#121212] placeholder-neutral-400 focus:outline-none focus:border-[#121212] transition"
            />
          </div>
        </div>

        {/* ── ORDER CARDS GRID DESIGN ── */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#e5e5e5] p-8 shadow-2xs">
            <p className="text-base font-semibold text-neutral-800">
              No orders found
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Try selecting another status tab or clearing your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((order) => {
              const currentStatus =
                order.orderStatus || order.status || "placed";
              const config =
                STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;

              const itemCount =
                order.itemCount || order.items?.length || 1;

              return (
                <div
                  key={order.id}
                  className="bg-white border border-[#e5e5e5] hover:border-[#121212] rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
                  <div>
                    {/* 1. CARD TOP: ORDER ID + DATE + STATUS SELECTOR */}
                    <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-[#f0f0f0]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#121212] tracking-wide">
                            #{order.id.slice(-6).toUpperCase()}
                          </span>
                          <span
                            className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                              order.paymentStatus === "paid"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-neutral-100 text-neutral-600"
                            }`}>
                            {order.paymentMethod || "COD"} •{" "}
                            {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                          </span>
                        </div>

                        <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1 font-light">
                          <FaRegFileLines size={10} />
                          <span>{formatDate(order.createdAt)}</span>
                        </p>
                      </div>

                      {/* In-Card Status Dropdown */}
                      <select
                        value={
                          currentStatus === "placed" ? "pending" : currentStatus
                        }
                        onChange={(e) =>
                          handleStatusChange(order, e.target.value)
                        }
                        aria-label="Change status"
                        className={`text-xs font-semibold border rounded-lg px-2.5 py-1.5 cursor-pointer outline-none transition shadow-2xs ${config.badge}`}>
                        {STATUS_OPTIONS.map((opt) => (
                          <option
                            key={opt.value}
                            value={opt.value}
                            className="bg-white text-neutral-900">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 2. CUSTOMER ROW: NAME + WHATSAPP */}
                    <div className="py-3.5 border-b border-[#f0f0f0]">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-[#121212] truncate">
                            {order.customerName || "Customer"}
                          </p>
                          {(order.addressSnapshot?.city || order.city) && (
                            <p className="text-[11px] text-neutral-500 font-light truncate mt-0.5">
                              {[
                                order.addressSnapshot?.city,
                                order.addressSnapshot?.state,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>

                        {order.phone && (
                          <button
                            onClick={() =>
                              window.open(
                                `https://wa.me/${order.phone.replace(/\D/g, "")}`,
                                "_blank",
                              )
                            }
                            aria-label={`WhatsApp ${order.customerName}`}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full transition-colors cursor-pointer shrink-0">
                            <FaWhatsapp size={12} className="text-emerald-600" />
                            <span>WhatsApp</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 3. ORDER ITEMS PREVIEW */}
                    <div className="py-3.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2.5">
                        {itemCount} Item{itemCount > 1 ? "s" : ""}
                      </p>

                      <div className="space-y-2">
                        {(order.items || []).slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2.5">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt=""
                                className="w-9 h-9 rounded-lg object-cover border border-[#e5e5e5] bg-neutral-50 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-neutral-100 border border-[#e5e5e5] flex items-center justify-center text-xs text-neutral-400 shrink-0">
                                📦
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-neutral-800 truncate">
                                {item.name || item.title || "Organic Product"}
                              </p>
                              <p className="text-[11px] text-neutral-400 font-light">
                                Qty: {item.quantity || item.selectedQuantity || 1}
                                {item.price ? ` • ₹${item.price}` : ""}
                              </p>
                            </div>
                          </div>
                        ))}

                        {(order.items?.length || 0) > 2 && (
                          <p className="text-[11px] text-neutral-500 font-medium pl-1">
                            +{(order.items?.length || 0) - 2} more item
                            {(order.items?.length || 0) - 2 > 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 4. CARD BOTTOM: TOTAL AMOUNT + VIEW DETAILS BUTTON */}
                  <div className="pt-3.5 mt-2 border-t border-[#f0f0f0] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                        Total Amount
                      </p>
                      <p className="text-base font-bold text-[#121212]">
                        ₹
                        {Number(order.totalAmount || 0).toLocaleString(
                          "en-IN",
                          { maximumFractionDigits: 2 },
                        )}
                      </p>
                    </div>

                    <button
                      onClick={() => openOrderDetails(order.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#121212] hover:bg-black text-white text-xs font-medium rounded-lg transition-all cursor-pointer shadow-xs active:scale-95">
                      <FaEye size={12} />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── LOAD MORE BUTTON ── */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => loadOrders(true)}
              disabled={loadingMore}
              className="px-6 py-2.5 bg-white border border-[#e5e5e5] hover:border-[#121212] text-xs font-medium text-neutral-700 rounded-lg shadow-2xs transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer">
              {loadingMore && <BiLoaderAlt className="animate-spin" size={14} />}
              <span>{loadingMore ? "Loading..." : "Load Older Orders"}</span>
            </button>
          </div>
        )}
      </div>

      {/* ── ORDER DETAILS MODAL ── */}
      {selectedOrder && (
        <OrderDetailsModal
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          handleAction={handleStatusChange}
          STATUS_FLOW={STATUS_CONFIG}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;
