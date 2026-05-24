import { useMemo, useRef, useState } from "react";
import { useAuth } from "../features/auth/context/UserContext";
import { useCart } from "../features/cart/context/CartContext";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import {
  createOrder,
  makeOrderId,
} from "../features/orders/services/orderService";
import { calculatePricing } from "../services/pricingEngine";

import AddressCard from "../components/cards/AddressCard";
import AddressFormPopup from "../components/form/AddressFormPopup";
import CartSummary from "../features/cart/components/CartSummary";
import PaymentSelector from "../components/cards/PaymentComponent";
import ConfirmOrderModal from "../components/cards/ConfirmOrderModal";

import { Plus, MapPin, AlertCircle, ShieldCheck } from "lucide-react";

// Logo colors:
// Red accent:    #D32F2F
// Golden yellow: #F5A623
// Dark text:     #2C2416

/* ────────────────────────────────
   Constants
──────────────────────────────── */

const EMPTY_FORM = {
  id: null,
  name: "",
  phone: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: "",
  tag: "HOME",
};

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? "";

/* ────────────────────────────────
   Error Banner
──────────────────────────────── */

const ErrorBanner = ({ message, onDismiss }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-6">
      <AlertCircle
        size={16}
        className="shrink-0"
        style={{ color: "#D32F2F" }}
      />
      <p className="text-[13px] flex-1" style={{ color: "#D32F2F" }}>
        {message}
      </p>
      <button
        onClick={onDismiss}
        className="text-[11px] font-semibold uppercase tracking-wide"
        style={{ color: "#D32F2F" }}>
        Dismiss
      </button>
    </div>
  );
};

/* ────────────────────────────────
   Address Page
──────────────────────────────── */

const AddressPage = () => {
  const { user, address, saveAddress } = useAuth();
  const { clear } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { source, items } = location.state || {};

  // ── Seed saved addresses from context ──
  // BEFORE
  // const [addresses, setAddresses] = useState(() =>
  //   address
  //     ? [{ ...address, addressLine1: address.line1 || address.addressLine1 }]
  //     : [],
  // );

  // AFTER
  const [addresses, setAddresses] = useState(() => {
    if (!address) return [];
    return [
      {
        ...address,
        addressLine1:
          address.addressLine1 ||
          address.line1 ||
          address.address_line1 ||
          address.address ||
          "",
      },
    ];
  });

  /*
   * ── Normalize cart items ──
   *
   * Carries ALL fields orderService.createOrder() needs:
   *   - productId    → navigation in OrderCard
   *   - description  → shown under product name
   *   - image        → product thumbnail
   *   - mrp          → discount display in CartSummary   ✅ FIX #3 (was missing)
   *   - quantity     → selectedQuantity first            ✅ FIX #2 (wrong priority)
   *   - selectedSize → size badge in OrderCard
   */
  const normalizedItems = useMemo(() => {
    if (!items?.length) return [];
    return items.map((item) => ({
      // ── Identity ──
      id: item.id || item.productId || "",
      productId: item.id || item.productId || "",

      // ── Display ──
      name: item.name ?? "",
      description: item.description ?? item.shortDescription ?? "",
      image:
        item.image || item.banner || item.images?.[0] || item.thumbnail || "",

      // ── Pricing ──
      price: Number(item.price) || 0,
      mrp: Number(item.mrp || item.originalPrice || item.price) || 0, // ✅ FIX #3: was missing, discount shows ₹0 without this

      // ── Quantity ──
      // ✅ FIX #2: selectedQuantity first — CartContext stores cart qty as selectedQuantity
      // item.quantity on a Firestore product doc means stock count, NOT cart qty
      quantity: item.selectedQuantity || item.quantity || 1,

      // ── Variant ──
      size: item.size || item.selectedSize || "",
      selectedSize: item.size || item.selectedSize || "",
    }));
  }, [items]);

  const pricing = useMemo(
    () => calculatePricing(normalizedItems),
    [normalizedItems],
  );

  const orderIdRef = useRef(null);
  if (!orderIdRef.current && user?.name) {
    orderIdRef.current = makeOrderId(user.name);
  }

  // ── UI state ──
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState("");
  const placingRef = useRef(false);

  if (!normalizedItems.length) return <Navigate to="/" replace />;

  /* ── Open popup for new address ── */
  const handleAddNew = () => {
    setForm(EMPTY_FORM);
    setPopupOpen(true);
  };

  /* ── Open popup for editing ── */
  const handleEdit = (e, addr) => {
    e.preventDefault();
    setForm({
      ...addr,
      addressLine1: addr.line1 || addr.addressLine1,
      id: addr.id,
    });
    setPopupOpen(true);
  };

  /* ── Save address from popup ── */
  const handleSaveAddress = async () => {
    try {
      const saved = await saveAddress({
        ...form,
        line1: form.addressLine1,
      });

      const normalized = {
        ...saved,
        addressLine1: saved.line1 || saved.addressLine1,
      };

      if (form.id) {
        setAddresses((prev) =>
          prev.map((a) => (a.id === form.id ? normalized : a)),
        );
      } else {
        setAddresses((prev) => {
          const updated = [...prev, normalized];
          setSelectedAddressIndex(updated.length - 1);
          return updated;
        });
      }

      setForm(EMPTY_FORM);
      setPopupOpen(false);
    } catch (err) {
      console.error("Failed to save address:", err);
      setError("Failed to save address. Please try again.");
    }
  };

  /* ── Place order ── */
  const placeOrder = async () => {
    if (placingRef.current) return;
    if (!addresses.length) {
      setError("Please add a delivery address.");
      return;
    }
    if (!orderIdRef.current) {
      setError("Order ID not ready. Please refresh.");
      return;
    }

    placingRef.current = true;
    setPlacing(true);

    try {
      const selectedAddress = addresses[selectedAddressIndex];

      await createOrder({
        orderId: orderIdRef.current,
        user,
        selectedAddress,
        paymentMethod,
        items: normalizedItems,
        pricing,
      });

      // ✅ source: "cart" sent by CartPage — clears IndexedDB after order
      if (source === "cart") await clear();

      await queryClient.invalidateQueries({ queryKey: ["orders", user.uid] });
      await queryClient.invalidateQueries({ queryKey: ["orders"] });

      if (paymentMethod === "whatsapp" && WHATSAPP_NUMBER) {
        const msg = `Hello ${user.name}, your order ${orderIdRef.current} has been placed. Total: ₹${pricing.totalPayable}`;
        window.open(
          `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
          "_blank",
        );
      }

      navigate(`/order-success/${orderIdRef.current}`, { replace: true });
    } catch (err) {
      console.error("Order placement error:", err);
      setError("Checkout failed. Please try again.");
    } finally {
      placingRef.current = false;
      setPlacing(false);
    }
  };

  const btnText = placing ? "Processing..." : "Continue";
  const disabled = placing || !addresses.length || !orderIdRef.current;

  const confirmDescription =
    paymentMethod === "whatsapp"
      ? "Confirm order and pay via WhatsApp?"
      : "Confirm order with Cash on Delivery?";

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* ── LEFT — Address section ── */}
        <div className="flex-1">
          <ErrorBanner message={error} onDismiss={() => setError("")} />

          {/* Section header */}
          <div className="flex justify-between items-center border border-gray-100 px-4 py-3 mb-4">
            <h2
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: "#2C2416" }} // ✅ logo dark text
            >
              Select Delivery Address
            </h2>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-1.5 text-sm font-medium hover:underline"
              style={{ color: "#D32F2F" }} // ✅ logo red
            >
              <Plus size={15} /> Add New
            </button>
          </div>

          {/* Saved address cards */}
          {addresses.length > 0 ? (
            <div className="space-y-3">
              {addresses.map((addr, idx) => {
                const isSelected = selectedAddressIndex === idx;
                return (
                  <label
                    key={addr.id || idx}
                    className="block bg-white border cursor-pointer transition-colors"
                    style={{
                      borderColor: isSelected ? "#D32F2F" : "#e5e7eb", // ✅ logo red when selected
                      backgroundColor: isSelected ? "#fff5f5" : "#ffffff", // ✅ soft red tint
                    }}>
                    <input
                      type="radio"
                      checked={isSelected}
                      onChange={() => setSelectedAddressIndex(idx)}
                      className="hidden"
                    />
                    <AddressCard
                      address={addr}
                      onEdit={(e) => handleEdit(e, addr)}
                    />
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border rounded-xl">
              <MapPin
                size={28}
                className="mx-auto"
                style={{ color: "#D32F2F" }} // ✅ logo red
              />
              <p className="mt-4 text-gray-500 text-sm">No saved addresses</p>
              <button
                onClick={handleAddNew}
                className="mt-4 text-white px-6 py-3 rounded-lg text-sm font-medium"
                style={{ backgroundColor: "#D32F2F" }} // ✅ logo red
              >
                Add Address
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT — Summary + payment ── */}
        <div className="w-full lg:w-[380px]">
          <div className="sticky top-24 space-y-4">
            <PaymentSelector
              availableMethods={["cod", "whatsapp"]}
              defaultMethod={paymentMethod}
              onSelectPayment={setPaymentMethod}
            />
            <CartSummary
              subtotal={pricing.subtotal}
              originalTotalPrice={pricing.originalTotalPrice}
              deliveryFee={pricing.deliveryFee}
              totalPayable={pricing.totalPayable}
              selectedItems={normalizedItems}
              onPlaceOrder={() => setConfirmModalOpen(true)}
              placing={placing}
              btnText={btnText}
              disabled={disabled}
              addressPage="true"
            />
            <div
              className="flex items-center justify-center gap-2 bg-white border p-4 rounded-xl"
              style={{ borderColor: "#F5A623" }} // ✅ logo golden border
            >
              <ShieldCheck
                size={15}
                style={{ color: "#D32F2F" }} // ✅ logo red
              />
              <p className="text-xs font-semibold text-gray-500">
                100% Secure Payments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Address Form Popup ── */}
      <AddressFormPopup
        isOpen={popupOpen}
        form={form}
        setForm={setForm}
        onSave={handleSaveAddress}
        onCancel={() => {
          setPopupOpen(false);
          setForm(EMPTY_FORM);
        }}
      />

      {/* ── Confirm Order Modal ── */}
      <ConfirmOrderModal
        isOpen={confirmModalOpen}
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={() => {
          setConfirmModalOpen(false);
          placeOrder();
        }}
        title="Confirm Your Order"
        description={confirmDescription}
        confirmText="Place Order"
        cancelText="Go Back"
        placing={placing}
      />
    </div>
  );
};

export default AddressPage;
