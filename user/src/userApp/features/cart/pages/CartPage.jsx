import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useCart } from "../context/CartContext";
import {
  useProducts,
  PRODUCT_KEYS,
  META_OPTS,
} from "../../product/hook/useProducts";
import { useQueryClient } from "@tanstack/react-query";
import { productService } from "../../product/services/ProductService";

import CartItemCard from "../components/cards/CartItemCard";
import CartControlHeader from "../components/header/CartControlHeader";
import CartSummary from "../components/CartSummary";
import EmptyCart from "../components/EmptyCart";
import CartSkeleton from "../components/skeleton/CartSkeleton";

import { Link, useNavigate } from "react-router-dom";
import LoginPopup from "../../../components/pop-up/LoginPoup";
import { useAuth } from "../../auth/context/UserContext";
import NewBreadcrumb from "../../p/components/NewBreadcrumb";
import { Leaf, ShieldCheck, Truck } from "lucide-react";

const round = (num) => Math.round(num * 100) / 100;
const FREE_SHIPPING_THRESHOLD = 999;

const CartPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoggedIn } = useAuth();
  const { cart, updateQuantity, updateSize, remove, clear } = useCart();
  const { invalidateAll } = useProducts();

  const [products, setProducts] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Stable string key to detect real cart changes
  const cartIds = useMemo(() => {
    return cart
      .map((i) => String(i.id))
      .sort()
      .join(",");
  }, [cart]);

  const prevCartIds = useRef("");

  useEffect(() => {
    if (!cart.length) {
      setProducts([]);
      setLoadingDetails(false);
      prevCartIds.current = "";
      return;
    }

    // Skip fetch if cart composition hasn't changed
    if (cartIds === prevCartIds.current) return;

    const controller = new AbortController();

    const fetchDetails = async () => {
      setLoadingDetails(true);
      setError(null);

      try {
        const ids = cart.map((i) => String(i.id));

        // FIX: Use queryClient.fetchQuery directly so signal works correctly
        // and we get proper React Query caching without the spurious invalidation
        const results = await queryClient.fetchQuery({
          queryKey: PRODUCT_KEYS.byIds(ids),
          queryFn: ({ signal }) => productService.getProductsByIds(ids, signal),
          ...META_OPTS,
        });

        setProducts(results || []);
        prevCartIds.current = cartIds;
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Cart fetch error:", err);
          setError("Failed to load cart items. Please refresh and try again.");
        }
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
    return () => controller.abort();
  }, [cartIds, queryClient]);
  // FIX: Removed `cart.length` and `getProductsByIds` from deps —
  // cartIds already encodes length changes; getProductsByIds was causing
  // re-runs on every render because it's a new function reference each time

  const productMap = useMemo(() => {
    const map = new Map();
    products.forEach((p) => map.set(String(p.id), p));
    return map;
  }, [products]);

  const mergedCart = useMemo(() => {
    return cart
      .map((item) => {
        const product = productMap.get(String(item.id));
        if (!product) return null;

        const selectedQuantity = item.selectedQuantity || 1;

        return {
          ...product,
          cartKey: item.cartKey,
          selectedQuantity,
          quantity: selectedQuantity,
          selectedSize: item.selectedSize || "",
        };
      })
      .filter(Boolean);
  }, [cart, productMap]);

  useEffect(() => {
    setSelected((prev) => {
      const keys = mergedCart.map((i) => i.cartKey);
      // Keep previously selected keys that still exist; select all if nothing was selected yet
      return prev.length ? keys.filter((k) => prev.includes(k)) : keys;
    });
  }, [mergedCart]);

  const handleSelectItem = (cartKey) => {
    setSelected((prev) =>
      prev.includes(cartKey)
        ? prev.filter((x) => x !== cartKey)
        : [...prev, cartKey],
    );
  };

  const handleSelectAll = () => {
    setSelected(
      selected.length === mergedCart.length
        ? []
        : mergedCart.map((i) => i.cartKey),
    );
  };

  const selectedItems = useMemo(() => {
    return mergedCart.filter((i) => selected.includes(i.cartKey));
  }, [mergedCart, selected]);

  const pricing = useMemo(() => {
    let subtotal = 0;
    let originalTotalPrice = 0;

    selectedItems.forEach((item) => {
      const qty = item.selectedQuantity || 1;
      const price = item.price || 0;
      const mrp = item.mrp || item.originalPrice || price;

      subtotal += price * qty;
      originalTotalPrice += mrp * qty;
    });

    const gstRate = 0.18;
    const gstAmount = round(subtotal * gstRate);
    const platformFee =
      subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? 50 : 0;
    const totalSavings = round(originalTotalPrice - subtotal);

    return {
      subtotal: round(subtotal),
      originalTotalPrice: round(originalTotalPrice),
      totalSavings,
      gstAmount,
      platformFee,
      totalPayable: round(subtotal + gstAmount + platformFee),
    };
  }, [selectedItems]);

  const amountToFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - pricing.subtotal,
  );
  const shippingProgress = Math.min(
    100,
    (pricing.subtotal / FREE_SHIPPING_THRESHOLD) * 100,
  );

  const validateCart = useCallback(() => {
    for (const item of selectedItems) {
      if (item.stock !== undefined && item.selectedQuantity > item.stock) {
        return `"${item.name}" only has ${item.stock} units left in stock`;
      }
    }
    return null;
  }, [selectedItems]);

  const handleCheckout = useCallback(async () => {
    if (!selectedItems.length) {
      alert("Please select at least one item to proceed.");
      return;
    }

    const validationError = validateCart();
    if (validationError) {
      alert(validationError);
      return;
    }

    if (!isLoggedIn) {
      setIsLoginOpen(true);
      return;
    }

    // FIX: Only invalidate at checkout, not on every cart change.
    // This ensures stock/price are fresh before payment without spamming Firestore.
    await invalidateAll();

    navigate("/checkout/address", {
      state: {
        items: selectedItems,
        pricing,
        totalAmount: pricing.totalPayable,
        source: "cart",
      },
    });
  }, [
    selectedItems,
    validateCart,
    isLoggedIn,
    invalidateAll,
    navigate,
    pricing,
  ]);

  if (loadingDetails && cart.length > 0) return <CartSkeleton />;

  if (error)
    return (
      <div className="p-4 font-medium text-[#2D6A4F] bg-[#D8F3DC] rounded-md m-4">
        {error}
      </div>
    );

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="min-h-screen pb-12">
      <div className="bg-white border-b border-gray-200">
        <NewBreadcrumb
          items={[{ label: "Home", to: "/" }, { label: "Cart" }]}
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 mt-6">
        {/* LEFT SIDE: Cart Items */}
        <div className="flex-1">
          <CartControlHeader
            cartItems={mergedCart}
            selectedItems={selected}
            onToggleSelect={handleSelectAll}
            onClearCart={clear}
            totalPrice={pricing.totalPayable}
          />

          <div className="space-y-4 mt-4">
            {mergedCart.map((item) => (
              <CartItemCard
                key={item.cartKey}
                product={item}
                selected={selected.includes(item.cartKey)}
                onSelect={() => handleSelectItem(item.cartKey)}
                onRemove={() => remove(item.cartKey)}
                onQtyChange={(qty) => updateQuantity(item.cartKey, qty)}
                onSizeChange={(size) => updateSize(item.cartKey, size)}
                className="border-transparent shadow-sm hover:border-[#52B788] transition-colors bg-white rounded-xl"
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: Summary & Trust Factors */}
        <div className="w-full lg:w-[400px] space-y-6">
          {/* Free Shipping Tracker */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#D8F3DC]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-[#1B4332]">
                {amountToFreeShipping > 0
                  ? `Add ₹${amountToFreeShipping} for Free Delivery`
                  : "🎉 You unlocked Free Delivery!"}
              </span>
              <Truck size={20} className="text-[#2D6A4F]" />
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-[#2D6A4F] h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <CartSummary
              subtotal={pricing.subtotal}
              originalTotalPrice={pricing.originalTotalPrice}
              gstAmount={pricing.gstAmount}
              platformFee={pricing.platformFee}
              selectedItems={selectedItems}
              onPlaceOrder={handleCheckout}
            />
            {pricing.totalSavings > 0 && (
              <div className="bg-[#D8F3DC] px-6 py-3 text-center text-sm font-medium text-[#1B4332]">
                You are saving ₹{pricing.totalSavings} on this order!
              </div>
            )}
          </div>

          {/* Organic Trust Badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Leaf size={24} />, label: "100% Pure & Traditional" },
              { icon: <ShieldCheck size={24} />, label: "Secure Checkout" },
              { icon: <Truck size={24} />, label: "Direct from Farms" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-50 text-center">
                <span className="text-[#2D6A4F] mb-2">{icon}</span>
                <span className="text-xs font-semibold text-gray-700">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <LoginPopup isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};

export default CartPage;
