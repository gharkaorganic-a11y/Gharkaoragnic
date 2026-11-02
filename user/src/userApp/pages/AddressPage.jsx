import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  ArrowLeft,
  Check,
  Truck,
  Tag,
  MessageCircle,
  PackageCheck,
  HelpCircle,
  Lock,
} from "lucide-react";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../../config/firebaseDB";
import { useAuth } from "../features/auth/context/UserContext";
import { useCart } from "../features/cart/context/CartContext";
import { calculatePricing } from "../services/pricingEngine";
import {
  createOrder,
  makeOrderId,
} from "../features/orders/services/orderService";
import SITE_CONFIG from "../../config/siteConfig";

const EMPTY_FORM = {
  email: "",
  name: "",
  firstName: "",
  lastName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

// Fallback demo product if user visits directly without active cart
const DEMO_CHECKOUT_ITEM = {
  id: "prod-a2-badri-ghee-500ml",
  productId: "prod-a2-badri-ghee-500ml",
  name: "A2 Badri Cow Desi Ghee (Bilona Churned)",
  image: "/banners/ghee-1500x500.webp",
  price: 1350,
  originalPrice: 1550,
  quantity: 1,
  selectedQuantity: 1,
  selectedSize: "500 ml",
};

const readStoredItems = () => {
  try {
    const stored = sessionStorage.getItem("checkoutItems");
    const items = stored ? JSON.parse(stored) : [];
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error("Could not restore checkout items:", error);
    return [];
  }
};

const formatPrice = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const AddressPage = () => {
  const { user, address, saveAddress } = useAuth();
  const { cart, remove, setCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const placingRef = useRef(false);
  const orderIdRef = useRef(null);

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [createdOrderId, setCreatedOrderId] = useState(
    location.state?.orderCreated || "",
  );
  const [saveAddressForLater, setSaveAddressForLater] = useState(true);
  const [newsOffersOptIn, setNewsOffersOptIn] = useState(true);
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // Discount code state (Shopify hallmark)
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState("");

  // Fallback ladder: location.state -> sessionStorage -> CartContext -> Demo item
  const sourceItems = useMemo(() => {
    if (location.state?.items?.length) return location.state.items;
    const stored = readStoredItems();
    if (stored.length) return stored;
    if (cart && cart.length) return cart;
    return [DEMO_CHECKOUT_ITEM];
  }, [location.state?.items, cart]);

  const items = useMemo(
    () =>
      sourceItems.map((item) => ({
        ...item,
        id: item.id || item.productId || "",
        productId: item.id || item.productId || "",
        image:
          item.image ||
          item.banner ||
          item.images?.[0] ||
          item.thumbnail ||
          "",
        price: Number(item.price) || 0,
        quantity: Number(item.selectedQuantity || item.quantity) || 1,
        selectedSize: item.selectedSize || item.size || "",
      })),
    [sourceItems],
  );

  // Base pricing
  const rawPricing = useMemo(() => calculatePricing(items), [items]);

  // Discount computation (e.g. 10% off if code "GHARKA10" or "WELCOME")
  const discountAmount = useMemo(() => {
    if (!discountApplied) return 0;
    return Math.round(rawPricing.subtotal * 0.1);
  }, [discountApplied, rawPricing.subtotal]);

  const pricing = useMemo(() => {
    const finalTotal = Math.max(0, rawPricing.subtotal - discountAmount);
    return {
      ...rawPricing,
      discountAmount,
      totalPayable: finalTotal,
    };
  }, [rawPricing, discountAmount]);

  // Split name helper
  const parseFullName = (fullName = "") => {
    const parts = fullName.trim().split(/\s+/);
    return {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
    };
  };

  const [form, setForm] = useState(() => {
    let saved = null;
    try {
      const raw = localStorage.getItem("gharka_saved_delivery_address");
      if (raw) saved = JSON.parse(raw);
    } catch (e) {}

    const initialNameParts = parseFullName(
      saved?.name || address?.name || user?.name || "",
    );

    return {
      ...EMPTY_FORM,
      email: saved?.email || user?.email || "",
      name: saved?.name || address?.name || user?.name || "",
      firstName: saved?.firstName || initialNameParts.firstName,
      lastName: saved?.lastName || initialNameParts.lastName,
      phone: saved?.phone || address?.phone || user?.phone || "",
      addressLine1:
        saved?.addressLine1 ||
        saved?.line1 ||
        address?.line1 ||
        address?.addressLine1 ||
        address?.address ||
        "",
      addressLine2: saved?.addressLine2 || saved?.line2 || address?.line2 || "",
      city: saved?.city || address?.city || "",
      state: saved?.state || address?.state || "",
      pincode: saved?.pincode || address?.pincode || "",
    };
  });

  useEffect(() => {
    if (!address && !user?.email && !user?.name) return;
    const names = parseFullName(address?.name || user?.name || "");

    setForm((current) => ({
      ...current,
      email: current.email || user?.email || "",
      name: current.name || address?.name || user?.name || "",
      firstName: current.firstName || names.firstName,
      lastName: current.lastName || names.lastName,
      phone: current.phone || address?.phone || user?.phone || "",
      addressLine1:
        current.addressLine1 ||
        address?.line1 ||
        address?.addressLine1 ||
        address?.address ||
        "",
      addressLine2: current.addressLine2 || address?.line2 || "",
      city: current.city || address?.city || "",
      state: current.state || address?.state || "",
      pincode: current.pincode || address?.pincode || "",
    }));
  }, [address, user?.email, user?.name, user?.phone]);

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "firstName" || name === "lastName") {
        next.name = `${next.firstName || ""} ${next.lastName || ""}`.trim();
      }
      return next;
    });
  };

  const handleApplyDiscount = (e) => {
    e.preventDefault();
    const clean = discountCode.trim().toUpperCase();
    if (!clean) return;

    if (
      clean === "GHARKA10" ||
      clean === "WELCOME" ||
      clean === "PAHADI" ||
      clean === "ORGANIC"
    ) {
      setDiscountApplied(true);
      setDiscountError("");
    } else {
      setDiscountError("Enter a valid discount code (Try: GHARKA10)");
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (placingRef.current) return;

    placingRef.current = true;
    setPlacing(true);
    setError("");

    try {
      const firebaseUser =
        auth.currentUser || (await signInAnonymously(auth)).user;
      const orderUser = {
        uid: firebaseUser.uid,
        email: form.email.trim(),
        name:
          `${form.firstName} ${form.lastName}`.trim() ||
          form.name.trim() ||
          "Customer",
        phone: form.phone.trim(),
        isAnonymous: true,
      };

      const orderId = orderIdRef.current || makeOrderId();
      orderIdRef.current = orderId;

      const deliveryAddress = {
        ...form,
        name:
          `${form.firstName} ${form.lastName}`.trim() ||
          form.name.trim() ||
          "Customer",
        line1: form.addressLine1.trim(),
        line2: form.addressLine2.trim(),
        tag: "HOME",
      };

      if (saveAddressForLater) {
        try {
          localStorage.setItem(
            "gharka_saved_delivery_address",
            JSON.stringify(deliveryAddress),
          );
        } catch (storageErr) {
          console.warn("Storage save ignored:", storageErr);
        }
      }

      await createOrder({
        orderId,
        user: orderUser,
        selectedAddress: deliveryAddress,
        paymentMethod: "cod",
        items,
        pricing,
      });

      navigate(location.pathname, {
        replace: true,
        state: { ...location.state, orderCreated: orderId },
      });
      setCreatedOrderId(orderId);

      for (const item of items) {
        if (item.cartKey) await remove(item.cartKey);
      }

      try {
        sessionStorage.removeItem("checkoutItems");
      } catch (err) {
        console.warn("Storage cleanup ignored:", err);
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["orders", orderUser.uid],
        }),
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
      ]).catch(() => {});
    } catch (orderError) {
      console.error("Order placement error:", orderError);
      if (
        orderError?.code === "auth/operation-not-allowed" ||
        orderError?.code === "auth/admin-restricted-operation"
      ) {
        setError(
          "We could not complete your order right now. Please reach us on WhatsApp (+91 98974 47525) for instant direct dispatch.",
        );
      } else {
        setError(
          orderError?.message ||
            "Unable to place order. Please review your details and try again.",
        );
      }
    } finally {
      placingRef.current = false;
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#121212] font-sans selection:bg-[#315c3c] selection:text-white">
      {/* ── TOP HEADER: CLEAN LOGO & SECURE BADGE ── */}
      <header className="border-b border-neutral-200/80 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center transition-opacity hover:opacity-90"
            aria-label="Ghar Ka Organic Home">
            <img
              src={SITE_CONFIG.logo}
              alt="Ghar Ka Organic"
              className="h-14 sm:h-16 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                if (e.currentTarget.nextSibling) {
                  e.currentTarget.nextSibling.style.display = "flex";
                }
              }}
            />
            {/* Fallback only if image fails */}
            <div className="hidden flex-col leading-tight">
              <span className="text-lg font-bold tracking-wide text-[#121212]">
                GHAR KA
              </span>
              <span className="text-[10px] tracking-[3px] text-[#475569]">
                ORGANIC
              </span>
            </div>
          </Link>

          {/* Right side: Single secure badge + Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WhatsApp Support – desktop only */}
            <a
              href={`https://wa.me/${(SITE_CONFIG.whatsapp || "919897447525").replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hi Ghar Ka Organic, I have a question about my order.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs text-neutral-600 hover:text-[#315c3c] transition-colors py-1.5 px-3 rounded-full hover:bg-neutral-50 border border-neutral-200"
              title="Chat with Customer Support on WhatsApp">
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>
                Need Help?{" "}
                <strong className="font-semibold text-neutral-800">Support</strong>
              </span>
            </a>

            {/* Single Secure Checkout Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 rounded-full bg-[#f3f7f4] border border-[#d6e5d8] text-[#2c5336]">
              <Lock size={14} className="text-[#315c3c] shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold leading-none whitespace-nowrap">
                Secure Checkout
              </span>
            </div>

            {/* Cart drawer button */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-neutral-700 hover:text-[#315c3c] hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="View Cart"
              title="View Cart">
              <ShoppingBag className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#315c3c] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-sm">
                  {items.reduce((sum, it) => sum + (it.quantity || 1), 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE COLLAPSIBLE ORDER SUMMARY ── */}
      <div className="lg:hidden border-b border-neutral-200 bg-[#fbfbfa]">
        <button
          type="button"
          onClick={() => setShowMobileSummary((prev) => !prev)}
          className="w-full py-3.5 px-4 sm:px-6 flex items-center justify-between text-xs sm:text-sm font-medium text-neutral-700 hover:text-black transition-colors"
          aria-expanded={showMobileSummary}>
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} className="text-[#315c3c]" />
            <span>{showMobileSummary ? "Hide order summary" : "Show order summary"}</span>
            {showMobileSummary ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
          <span className="font-semibold text-base text-gray-900">
            {formatPrice(pricing.totalPayable)}
          </span>
        </button>

        {showMobileSummary && (
          <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-neutral-200 divide-y divide-neutral-200/80">
            <ul className="py-3.5 space-y-3 max-h-72 overflow-y-auto">
              {items.map((item, index) => (
                <li
                  key={item.cartKey || `${item.id}-${index}`}
                  className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg bg-white border border-neutral-200 p-1 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={item.image || "/banners/ghee-1500x500.webp"}
                      alt={item.name}
                      className="w-full h-full object-contain rounded"
                      onError={(e) => {
                        e.target.src = "/banners/ghee-1500x500.webp";
                      }}
                    />
                    <span className="absolute -top-1.5 -right-1.5 bg-neutral-600 text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    {item.selectedSize && (
                      <p className="text-[11px] text-gray-500">
                        {item.selectedSize}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Mobile Discount Form */}
            <form onSubmit={handleApplyDiscount} className="py-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Discount code (e.g. GHARKA10)"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 rounded-lg text-xs text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#315c3c] uppercase"
                  />
                  <Tag size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  disabled={!discountCode.trim() || discountApplied}
                  className="px-3.5 h-10 rounded-lg bg-neutral-900 text-white text-xs font-medium transition-colors disabled:opacity-40">
                  {discountApplied ? "Applied" : "Apply"}
                </button>
              </div>
              {discountApplied && (
                <p className="text-xs text-emerald-700 font-medium mt-1.5 flex items-center gap-1">
                  <Check size={12} />
                  <span>Promo code applied! 10% discount subtracted.</span>
                </p>
              )}
              {discountError && (
                <p className="text-xs text-red-600 mt-1.5">{discountError}</p>
              )}
            </form>

            <div className="pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">{formatPrice(pricing.subtotal)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-[#315c3c] font-medium">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-bold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(pricing.totalPayable)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 2-COLUMN CHECKOUT GRID ── */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-80px)]">
        {/* ── LEFT COLUMN: CHECKOUT FORM (7 COLS) ── */}
        <main className="lg:col-span-7 px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          {/* BREADCRUMB */}
          <nav aria-label="Checkout Progress" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setCartOpen(true);
                    navigate("/");
                  }}
                  className="text-[#315c3c] hover:underline font-medium">
                  Cart
                </button>
              </li>
              <li className="text-neutral-300">›</li>
              <li className="font-semibold text-neutral-900" aria-current="step">
                Information & Delivery
              </li>
              <li className="text-neutral-300">›</li>
              <li className="text-neutral-400">Payment</li>
            </ol>
          </nav>

          {/* ERROR ALERT */}
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700 leading-relaxed flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-7">
            {/* ── SECTION 1: CONTACT INFORMATION ── */}
            <section aria-labelledby="contact-heading">
              <div className="flex items-center justify-between mb-3">
                <h2
                  id="contact-heading"
                  className="text-base font-semibold text-neutral-900">
                  Contact Information
                </h2>
              </div>

              <div className="space-y-2.5">
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={updateField}
                  placeholder="Email address for order confirmation"
                  className="w-full h-11 px-3.5 bg-white border border-gray-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#315c3c] focus:ring-1 focus:ring-[#315c3c] transition-colors"
                />

                <label className="flex items-center gap-2 text-xs text-neutral-600 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsOffersOptIn}
                    onChange={(e) => setNewsOffersOptIn(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#315c3c] focus:ring-[#315c3c] accent-[#315c3c]"
                  />
                  <span>Email me with Himalayan harvest updates and exclusive offers</span>
                </label>
              </div>
            </section>

            {/* ── SECTION 2: DELIVERY ADDRESS ── */}
            <section aria-labelledby="delivery-heading" className="pt-1">
              <h2
                id="delivery-heading"
                className="text-base font-semibold text-neutral-900 mb-3">
                Delivery Address
              </h2>

              <div className="space-y-3">
                {/* COUNTRY / REGION */}
                <div>
                  <div className="w-full h-11 px-3.5 bg-neutral-50 border border-gray-200 rounded-lg text-sm text-neutral-700 flex items-center justify-between font-medium">
                    <span>India (PAN-India Delivery)</span>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">All States</span>
                  </div>
                </div>

                {/* FIRST & LAST NAME */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={form.firstName}
                    onChange={updateField}
                    placeholder="First name"
                    className="w-full h-11 px-3.5 bg-white border border-gray-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#315c3c] focus:ring-1 focus:ring-[#315c3c] transition-colors"
                  />
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={form.lastName}
                    onChange={updateField}
                    placeholder="Last name"
                    className="w-full h-11 px-3.5 bg-white border border-gray-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#315c3c] focus:ring-1 focus:ring-[#315c3c] transition-colors"
                  />
                </div>

                {/* ADDRESS LINE 1 */}
                <input
                  type="text"
                  name="addressLine1"
                  required
                  value={form.addressLine1}
                  onChange={updateField}
                  placeholder="Address (House No., Building, Street Name)"
                  className="w-full h-11 px-3.5 bg-white border border-gray-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#315c3c] focus:ring-1 focus:ring-[#315c3c] transition-colors"
                />

                {/* ADDRESS LINE 2 */}
                <input
                  type="text"
                  name="addressLine2"
                  value={form.addressLine2}
                  onChange={updateField}
                  placeholder="Apartment, suite, unit, landmark (optional)"
                  className="w-full h-11 px-3.5 bg-white border border-gray-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#315c3c] focus:ring-1 focus:ring-[#315c3c] transition-colors"
                />

                {/* CITY, STATE, PINCODE */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    name="city"
                    required
                    value={form.city}
                    onChange={updateField}
                    placeholder="City"
                    className="w-full h-11 px-3.5 bg-white border border-gray-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#315c3c] focus:ring-1 focus:ring-[#315c3c] transition-colors"
                  />
                  <input
                    type="text"
                    name="state"
                    required
                    value={form.state}
                    onChange={updateField}
                    placeholder="State"
                    className="w-full h-11 px-3.5 bg-white border border-gray-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#315c3c] focus:ring-1 focus:ring-[#315c3c] transition-colors"
                  />
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={form.pincode}
                    onChange={updateField}
                    placeholder="PIN code"
                    className="w-full h-11 px-3.5 bg-white border border-gray-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#315c3c] focus:ring-1 focus:ring-[#315c3c] transition-colors"
                  />
                </div>

                {/* PHONE */}
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={updateField}
                    placeholder="Phone number for delivery WhatsApp updates"
                    className="w-full h-11 px-3.5 bg-white border border-gray-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#315c3c] focus:ring-1 focus:ring-[#315c3c] transition-colors"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 pointer-events-none hidden sm:inline">
                    WhatsApp confirmation
                  </span>
                </div>

                {/* SAVE ADDRESS */}
                <label className="flex items-center gap-2 text-xs text-neutral-600 select-none cursor-pointer pt-0.5">
                  <input
                    type="checkbox"
                    checked={saveAddressForLater}
                    onChange={(e) => setSaveAddressForLater(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#315c3c] focus:ring-[#315c3c] accent-[#315c3c]"
                  />
                  <span>Save this address for next time</span>
                </label>
              </div>
            </section>

            {/* ── SECTION 3: SHIPPING METHOD ── */}
            <section aria-labelledby="shipping-method-heading" className="pt-1">
              <h2
                id="shipping-method-heading"
                className="text-base font-semibold text-neutral-900 mb-3">
                Shipping Method
              </h2>
              <div className="p-3.5 sm:p-4 rounded-xl border border-gray-200 bg-neutral-50/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck size={18} className="text-[#315c3c] flex-shrink-0" />
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-neutral-900 block">
                      Standard Mountain Express (PAN-India)
                    </span>
                    <span className="text-[11px] text-neutral-500 block">
                      3–5 business days • Bubble-wrapped food-grade glass jars
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#315c3c]">
                  FREE
                </span>
              </div>
            </section>

            {/* ── SECTION 4: PAYMENT ── */}
            <section aria-labelledby="payment-heading" className="pt-1">
              <h2
                id="payment-heading"
                className="text-base font-semibold text-neutral-900 mb-1">
                Payment
              </h2>
              <p className="text-xs text-neutral-500 mb-3">
                All transactions are secure and encrypted.
              </p>

              <div className="border border-[#315c3c] rounded-xl overflow-hidden bg-white">
                <div className="p-3.5 sm:p-4 bg-emerald-50/50 flex items-center justify-between border-b border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-[#315c3c] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#315c3c]" />
                    </div>
                    <span className="text-sm font-semibold text-neutral-900">
                      Cash on Delivery (COD)
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    Available
                  </span>
                </div>

                <div className="p-3.5 sm:p-4 bg-white text-xs text-neutral-600 leading-relaxed">
                  <p>
                    Pay with cash or UPI upon delivery. Our Bhimtal kitchen team will
                    contact you on WhatsApp to confirm your package dispatch and
                    delivery window.
                  </p>
                </div>
              </div>
            </section>

            {/* ── SECTION 5: ACTION BUTTONS ── */}
            <div className="pt-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setCartOpen(true);
                  navigate("/");
                }}
                className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm text-[#315c3c] hover:underline font-medium py-2">
                <ArrowLeft size={15} />
                <span>Return to cart</span>
              </button>

              <button
                type="submit"
                disabled={placing}
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#315c3c] hover:bg-[#25462e] text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {placing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Complete order</span>
                  </>
                )}
              </button>
            </div>

            {/* ── SECTION 6: FOOTER POLICY LINKS ── */}
            <footer className="pt-6 border-t border-gray-100 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-neutral-500">
              <Link to="/pages/shipping" className="hover:text-black hover:underline">
                Shipping policy
              </Link>
              <span>•</span>
              <Link to="/pages/privacy-policy" className="hover:text-black hover:underline">
                Privacy policy
              </Link>
              <span>•</span>
              <Link to="/our-story" className="hover:text-black hover:underline">
                Our Story
              </Link>
              <span>•</span>
              <Link to="/contact" className="hover:text-black hover:underline">
                Contact Kitchen
              </Link>
            </footer>
          </form>
        </main>

        {/* ───────── RIGHT COLUMN: STICKY ORDER SUMMARY (5 COLS) ───────── */}
        <aside className="hidden lg:block lg:col-span-5 bg-[#fafaf9] border-l border-gray-200/80 px-6 lg:px-8 py-8 lg:py-10">
          <div className="sticky top-28 space-y-5">
            <h2 className="text-sm font-semibold text-neutral-900 pb-2 border-b border-gray-200">
              Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
            </h2>

            {/* PRODUCT ITEMS LIST */}
            <ul className="space-y-3 max-h-[340px] overflow-y-auto pr-1 divide-y divide-neutral-200/60">
              {items.map((item, index) => (
                <li
                  key={item.cartKey || `${item.id}-${index}`}
                  className="flex items-center gap-3 pt-3 first:pt-0">
                  <div className="relative w-14 h-14 rounded-lg bg-white border border-gray-200 p-1 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={item.image || "/banners/ghee-1500x500.webp"}
                      alt={item.name}
                      className="w-full h-full object-contain rounded"
                      onError={(e) => {
                        e.target.src = "/banners/ghee-1500x500.webp";
                      }}
                    />
                    <span className="absolute -top-1.5 -right-1.5 bg-neutral-600 text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-neutral-900 line-clamp-2 leading-snug">
                      {item.name}
                    </p>
                    {item.selectedSize && (
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {item.selectedSize}
                      </p>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-neutral-900 whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            {/* DISCOUNT CODE FORM */}
            <form onSubmit={handleApplyDiscount} className="pt-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Discount code (e.g. GHARKA10)"
                    className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#315c3c] focus:ring-1 focus:ring-[#315c3c] uppercase"
                  />
                  <Tag size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  disabled={!discountCode.trim() || discountApplied}
                  className="px-3.5 h-10 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition-colors disabled:opacity-40">
                  {discountApplied ? "Applied" : "Apply"}
                </button>
              </div>
              {discountApplied && (
                <p className="text-xs text-emerald-700 font-medium mt-1.5 flex items-center gap-1">
                  <Check size={12} />
                  <span>Promo code applied! 10% discount subtracted.</span>
                </p>
              )}
              {discountError && (
                <p className="text-xs text-red-600 mt-1.5">{discountError}</p>
              )}
            </form>

            {/* PRICE BREAKDOWN */}
            <div className="border-t border-gray-200 pt-3.5 space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900">{formatPrice(pricing.subtotal)}</span>
              </div>

              {discountApplied && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-[#315c3c]">FREE</span>
              </div>

              <div className="flex justify-between text-neutral-400 text-[11px]">
                <span>Taxes</span>
                <span>Included</span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex items-baseline justify-between">
                <span className="text-sm font-bold text-neutral-900">Total</span>
                <span className="text-xl font-bold text-neutral-950">
                  {formatPrice(pricing.totalPayable)}
                </span>
              </div>
            </div>

            {/* TRUST GUARANTEE BOX */}
            <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-1 text-xs text-neutral-600">
              <div className="flex items-center gap-2 text-neutral-900 font-medium">
                <ShieldCheck size={15} className="text-[#315c3c]" />
                <span>100% Himalayan Purity Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed text-neutral-500">
                Direct from Bhimtal, Nainital. Carefully bubble-wrapped food-grade glass jars. Free replacement if damaged in transit.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* ─────────────────────────────────────────────────────────────
         ORDER PLACED SUCCESS MODAL
      ───────────────────────────────────────────────────────────── */}
      {createdOrderId && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 py-8"
          role="presentation">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-created-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 text-center shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
              <Check size={28} />
            </div>

            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full inline-block mb-2">
              Order Confirmed
            </span>

            <h2
              id="order-created-title"
              className="text-xl sm:text-2xl font-serif text-[#263329]">
              Thank you for your order!
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
              We’ve received your order and our Bhimtal kitchen team will contact
              you on WhatsApp to confirm delivery schedule.
            </p>

            <div className="mt-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
              <span className="text-gray-500">Order Reference:</span>{" "}
              <strong className="text-gray-900 font-mono font-bold text-sm block mt-0.5">
                {createdOrderId}
              </strong>
            </div>

            <a
              href={`https://wa.me/${String(SITE_CONFIG.whatsapp).replace(
                /\D/g,
                "",
              )}?text=${encodeURIComponent(
                `Hello, I placed order ${createdOrderId} for ${formatPrice(
                  pricing.totalPayable,
                )}. Please confirm the dispatch and delivery timeline.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-5 py-3.5 text-xs sm:text-sm font-semibold text-white transition-all shadow-md">
              <MessageCircle size={17} />
              <span>Message Us on WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => navigate("/", { replace: true })}
              className="mt-3 w-full rounded-xl border border-neutral-300 px-5 py-3 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50">
              Continue Shopping
            </button>
          </section>
        </div>
      )}
    </div>
  );
};

export default AddressPage;
