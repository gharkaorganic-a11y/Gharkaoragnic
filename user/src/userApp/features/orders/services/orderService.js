/**
 * ORDER SERVICE — FIXED CONSISTENT VERSION
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

import { db } from "../../../../config/firebaseDB";

/* ───────────────────────────────
   ORDER ID GENERATOR
────────────────────────────── */
export const makeOrderId = (name = "user") => {
  const prefix = name.replace(/\s+/g, "").toLowerCase().slice(0, 4);
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}-${time}${rand}`;
};

/* ───────────────────────────────
   CREATE ORDER (FIXED SYNC MODEL)
────────────────────────────── */
export const createOrder = async ({
  orderId,
  user,
  selectedAddress,
  items,
  pricing,
  paymentMethod = "cod",
}) => {
  if (!user?.uid) throw new Error("User not authenticated");
  if (!items?.length) throw new Error("Order items missing");
  if (!selectedAddress) throw new Error("Delivery address missing");

  const now = serverTimestamp();
  const batch = writeBatch(db);
  const orderRef = doc(db, "orders", orderId);

  /* ───────── NORMALIZED ITEMS ───────── */
  const normalisedItems = items.map((item) => ({
    productId: item.id || item.productId || "",
    name: item.name ?? "",
    image: item.image ?? "",
    description: item.description ?? "",
    price: Number(item.price) || 0,
    quantity: item.quantity || item.selectedQuantity || 1,
    selectedSize: item.size || item.selectedSize || "",
    itemStatus: "placed",
    shipmentStatus: "pending",
  }));

  const totalAmount =
    pricing.totalPayable ?? pricing.totalAmount ?? 0;

  /* ───────── SINGLE SOURCE OF TRUTH ───────── */
  const baseOrderData = {
    orderId,
    userId: user.uid,

    orderStatus: "placed",
    paymentStatus: "pending",
    paymentMethod,

    itemCount: normalisedItems.length,
    totalAmount,
    pricing,

    items: normalisedItems,

    addressSnapshot: {
      name: selectedAddress.name,
      phone: selectedAddress.phone,
      line1:
        selectedAddress.line1 ||
        selectedAddress.addressLine1 ||
        "",
      city: selectedAddress.city,
      state: selectedAddress.state,
      pincode: selectedAddress.pincode,
    },

    createdAt: now,
    updatedAt: now,
  };

  /* ───────── ROOT ORDER (FIXED) ───────── */
  batch.set(orderRef, baseOrderData);

  /* ───────── ITEMS SUBCOLLECTION ───────── */
  normalisedItems.forEach((item) => {
    const itemRef = doc(collection(orderRef, "items"));
    batch.set(itemRef, { ...item, createdAt: now, updatedAt: now });
  });

  /* ───────── PAYMENT ───────── */
  batch.set(doc(collection(orderRef, "payments")), {
    method: paymentMethod,
    status: "pending",
    amount: totalAmount,
    createdAt: now,
  });

  /* ───────── TIMELINE ───────── */
  batch.set(doc(collection(orderRef, "timeline")), {
    status: "placed",
    note: "Order created",
    timestamp: now,
  });

  /* ───────── USER MIRROR (LIST VIEW) ───────── */
  const previewItem = normalisedItems[0];

  batch.set(doc(db, "users", user.uid, "orders", orderId), {
    ...baseOrderData,

    previewItem: {
      name: previewItem?.name ?? "",
      image: previewItem?.image ?? "",
      price: previewItem?.price ?? 0,
      description: previewItem?.description ?? "",
    },
  });

  await batch.commit();
  return { orderId };
};

/* ───────────────────────────────
   ORDER SERVICE API
────────────────────────────── */
export const orderService = {
  /* ───────── USER ORDERS ───────── */
  async getUserOrders(userId, maxResults = 20, lastDoc = null) {
    if (!userId) return { orders: [], lastDoc: null };

    const constraints = [orderBy("createdAt", "desc"), limit(maxResults)];
    if (lastDoc) constraints.push(startAfter(lastDoc));

    const q = query(
      collection(db, "users", userId, "orders"),
      ...constraints
    );

    try {
      const snap = await getDocs(q);
      const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      return {
        orders,
        lastDoc: snap.docs[snap.docs.length - 1] ?? null,
      };
    } catch (err) {
      console.error(err);
      return { orders: [], lastDoc: null };
    }
  },

  /* ───────── ORDER DETAILS ───────── */
  async getOrderDetails(orderId) {
    if (!orderId) return null;

    try {
      const [orderSnap, itemsSnap] = await Promise.all([
        getDoc(doc(db, "orders", orderId)),
        getDocs(collection(db, "orders", orderId, "items")),
      ]);

      if (!orderSnap.exists()) return null;

      return {
        id: orderSnap.id,
        ...orderSnap.data(),
        items: itemsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })),
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  /* ───────── STATUS SYNC ───────── */
  async updateOrderStatusInUserDoc(userId, orderId, updates = {}) {
    if (!userId || !orderId) return;

    await updateDoc(
      doc(db, "users", userId, "orders", orderId),
      {
        ...updates,
        updatedAt: serverTimestamp(),
      }
    );
  },

  /* ───────── CANCEL ITEM ───────── */
  async cancelItem(orderId, itemId, reason = "") {
    const now = serverTimestamp();
    const batch = writeBatch(db);

    batch.update(doc(db, "orders", orderId, "items", itemId), {
      itemStatus: "cancelled",
      cancelReason: reason,
      updatedAt: now,
    });

    batch.set(doc(collection(db, "orders", orderId, "timeline")), {
      status: "item_cancelled",
      itemId,
      note: reason,
      timestamp: now,
    });

    await batch.commit();
  },

  /* ───────── RETURN REQUEST ───────── */
  async requestReturn(orderId, itemId, reason = "") {
    await updateDoc(doc(db, "orders", orderId, "items", itemId), {
      itemStatus: "return_requested",
      returnReason: reason,
      updatedAt: serverTimestamp(),
    });
  },
};