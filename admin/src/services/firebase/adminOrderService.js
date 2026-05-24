/**
 * =========================================================
 * ADMIN ORDER SERVICE — FIXED CONSISTENT VERSION
 * =========================================================
 */

import {
  collection,
  doc,
  writeBatch,
  serverTimestamp,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../config/firebase";

export const adminOrderService = {

  /* ───────────────────────────────
     GET ORDERS (ADMIN LIST)
  ─────────────────────────────── */
  async getOrders(maxResults = 20, lastDoc = null) {
    const constraints = [
      orderBy("createdAt", "desc"),
      limit(maxResults),
    ];

    if (lastDoc) constraints.push(startAfter(lastDoc));

    const q = query(collection(db, "orders"), ...constraints);

    try {
      const snap = await getDocs(q);

      const orders = snap.docs.map((d) => {
        const data = d.data();

        const status = data.orderStatus || data.status || "placed";

        return {
          id: d.id,
          ...data,

          // 🔥 NORMALIZED FIELDS (CRITICAL FIX)
          status,
          orderStatus: status,

          customerName: data.addressSnapshot?.name || "Guest",
          phone: data.addressSnapshot?.phone || "",

          totalAmount: Number(data.totalAmount || 0),
          itemCount: Number(data.itemCount || 0),

          items: data.items || [],
        };
      });

      return {
        orders,
        lastDoc: snap.docs[snap.docs.length - 1] ?? null,
        hasMore: snap.docs.length === maxResults,
      };
    } catch (err) {
      console.error("[adminOrderService] getOrders error:", err);
      return { orders: [], lastDoc: null, hasMore: false };
    }
  },

  /* ───────────────────────────────
     GET ORDER DETAILS
  ─────────────────────────────── */
  async getOrderDetails(orderId) {
    if (!orderId) return null;

    try {
      const [orderSnap, itemsSnap, timelineSnap] = await Promise.all([
        getDoc(doc(db, "orders", orderId)),
        getDocs(collection(db, "orders", orderId, "items")),
        getDocs(
          query(
            collection(db, "orders", orderId, "timeline"),
            orderBy("timestamp", "desc")
          )
        ),
      ]);

      if (!orderSnap.exists()) return null;

      const data = orderSnap.data();
      const status = data.orderStatus || data.status || "placed";

      return {
        id: orderSnap.id,
        ...data,

        // 🔥 NORMALIZED STATUS
        status,
        orderStatus: status,

        items: itemsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })),

        timeline: timelineSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })),
      };
    } catch (err) {
      console.error("[adminOrderService] getOrderDetails error:", err);
      return null;
    }
  },

  /* ───────────────────────────────
     UPDATE ORDER STATUS (SYNC FIXED)
  ─────────────────────────────── */
  async updateOrderStatus({
    orderId,
    userId,
    newStatus,
    paymentStatus,
    adminName = "admin",
  }) {
    if (!orderId) throw new Error("Missing orderId");

    try {
      const now = serverTimestamp();
      const batch = writeBatch(db);

      /* ───────────────────────────────
         FIXED PAYMENT LOGIC (COD + ONLINE)
      ─────────────────────────────── */
      let finalPaymentStatus =
        paymentStatus || "pending";

      if (!paymentStatus) {
        if (newStatus === "confirmed") {
          finalPaymentStatus = "confirmed";
        }

        if (newStatus === "delivered") {
          finalPaymentStatus = "paid";
        }

        if (newStatus === "cancelled") {
          finalPaymentStatus = "cancelled";
        }
      }

      /* ───────────────────────────────
         ROOT ORDER UPDATE (FIXED)
      ─────────────────────────────── */
      const rootRef = doc(db, "orders", orderId);

      batch.update(rootRef, {
        orderStatus: newStatus,
        status: newStatus,
        paymentStatus: finalPaymentStatus,
        updatedAt: now,
      });

      /* ───────────────────────────────
         USER MIRROR UPDATE
      ─────────────────────────────── */
      if (userId) {
        batch.update(
          doc(db, "users", userId, "orders", orderId),
          {
            orderStatus: newStatus,
            status: newStatus,
            paymentStatus: finalPaymentStatus,
            updatedAt: now,
          }
        );
      }

      /* ───────────────────────────────
         PAYMENT COLLECTION SYNC
      ─────────────────────────────── */
      const paymentsSnap = await getDocs(
        collection(db, "orders", orderId, "payments")
      );

      paymentsSnap.forEach((paymentDoc) => {
        batch.update(paymentDoc.ref, {
          status: finalPaymentStatus,
          updatedAt: now,
        });
      });

      /* ───────────────────────────────
         TIMELINE LOG
      ─────────────────────────────── */
      batch.set(
        doc(collection(db, "orders", orderId, "timeline")),
        {
          status: newStatus,
          paymentStatus: finalPaymentStatus,
          note: `Order moved to ${newStatus}`,
          actor: adminName,
          timestamp: now,
        }
      );

      await batch.commit();

      return true;
    } catch (err) {
      console.error("[adminOrderService] updateOrderStatus error:", err);
      throw err;
    }
  },

  /* ───────────────────────────────
     CANCEL ITEM
  ─────────────────────────────── */
  async cancelOrderItem({
    orderId,
    itemId,
    reason = "",
    adminName = "admin",
  }) {
    try {
      const now = serverTimestamp();
      const batch = writeBatch(db);

      batch.update(
        doc(db, "orders", orderId, "items", itemId),
        {
          itemStatus: "cancelled",
          cancelReason: reason,
          updatedAt: now,
        }
      );

      batch.set(
        doc(collection(db, "orders", orderId, "timeline")),
        {
          status: "item_cancelled",
          itemId,
          note: reason || "Item cancelled",
          actor: adminName,
          timestamp: now,
        }
      );

      await batch.commit();
      return true;
    } catch (err) {
      console.error("[adminOrderService] cancelOrderItem error:", err);
      throw err;
    }
  },

  /* ───────────────────────────────
     ANALYTICS (FIXED SYNC LOGIC)
  ─────────────────────────────── */
  calculateOrderAnalytics(orders = []) {
    return orders.reduce(
      (acc, order) => {
        const status =
          order.orderStatus || order.status || "placed";

        acc.totalRevenue += Number(order.totalAmount) || 0;

        if (["placed", "pending"].includes(status)) {
          acc.pendingOrders++;
        } else if (status === "confirmed") {
          acc.confirmedOrders++;
        } else if (status === "shipping") {
          acc.shippedOrders++;
        } else if (status === "delivered") {
          acc.deliveredOrders++;
        } else if (status === "cancelled") {
          acc.cancelledOrders++;
        }

        return acc;
      },
      {
        totalOrders: orders.length,
        pendingOrders: 0,
        confirmedOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
      }
    );
  },
};