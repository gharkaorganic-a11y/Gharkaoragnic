import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useCart } from "../context/CartContext";
import { useProducts } from "../../product/hook/useProducts";
import { useQueryClient } from "@tanstack/react-query";

import CartItemCard from "../components/cards/CartItemCard";
import CartControlHeader from "../components/header/CartControlHeader";
import CartSummary from "../components/CartSummary";
import EmptyCart from "../components/EmptyCart";
import CartSkeleton from "../components/skeleton/CartSkeleton";

import { Link, useNavigate } from "react-router-dom";
import LoginPopup from "../../../components/pop-up/LoginPoup";
import { useAuth } from "../../auth/context/UserContext";
import NewBreadcrumb from "../../p/components/NewBreadcrumb";
import { Leaf, ShieldCheck, Truck } from "lucide-react"; // Make sure lucide-react is installed

// ─── Organic Theme Colors ──────────────────────
// Primary Green: #2D6A4F (Trust, freshness, nature)
// Light Green:   #D8F3DC (Backgrounds, subtle highlights)
// Harvest Yellow:#E9C46A (Accents, warnings, like raw honey)
// Dark Text:     #1B4332 (Deep forest green for text readability)
// ───────────────────────────────────────────────

const round = (num) => Math.round(num * 100) / 100;
const FREE_SHIPPING_THRESHOLD = 999;

const CartPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoggedIn } = useAuth();
  const { cart, updateQuantity, updateSize, remove, clear } = useCart();
  const { getProductsByIds } = useProducts();

  const [products, setProducts] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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

    if (cartIds === prevCartIds.current) return;

    const controller = new AbortController();

    const fetchDetails = async () => {
      setLoadingDetails(true);
      setError(null);

      try {
        const ids = cart.map((i) => String(i.id));
        queryClient.invalidateQueries({ queryKey: ["products"] });

        const results = await getProductsByIds(ids, {
          signal: controller.signal,
          force: true,
        });

        setProducts(results || []);
        prevCartIds.current = cartIds;
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Cart fetch error:", err);
          setError("Failed to load cart items");
        }
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
    return () => controller.abort();
  }, [cartIds, cart.length, getProductsByIds, queryClient]);

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
      return keys.filter((k) => prev.includes(k) || !prev.length);
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

    const gstRate = 0.18; // Note: Organic raw items like honey/produce might have lower GST depending on local laws. Adjust as needed.
    const gstAmount = round(subtotal * gstRate);

    // Waive platform fee if subtotal hits the free shipping threshold
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
        return `Item ${item.name} is out of stock`;
      }
    }
    return null;
  }, [selectedItems]);

  const handleCheckout = async () => {
    if (!selectedItems.length) {
      alert("Select at least one item");
      return;
    }

    const validationError = validateCart();
    if (validationError) {
      alert(validationError);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["products"] });

    if (!isLoggedIn) {
      setIsLoginOpen(true);
      return;
    }

    navigate("/checkout/address", {
      state: {
        items: selectedItems,
        pricing,
        totalAmount: pricing.totalPayable,
        source: "cart",
      },
    });
  };

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

        {/* RIGHT SIDE: Summary & Organic Trust Factors */}
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
                style={{ width: `${shippingProgress}%` }}></div>
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

            {/* Savings Callout */}
            {pricing.totalSavings > 0 && (
              <div className="bg-[#D8F3DC] px-6 py-3 text-center text-sm font-medium text-[#1B4332]">
                You are saving ₹{pricing.totalSavings} on this order!
              </div>
            )}
          </div>

          {/* Organic Trust Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-50 text-center">
              <Leaf className="text-[#2D6A4F] mb-2" size={24} />
              <span className="text-xs font-semibold text-gray-700">
                100% Pure & Traditional
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-50 text-center">
              <ShieldCheck className="text-[#2D6A4F] mb-2" size={24} />
              <span className="text-xs font-semibold text-gray-700">
                Secure Checkout
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-50 text-center">
              <Truck className="text-[#2D6A4F] mb-2" size={24} />
              <span className="text-xs font-semibold text-gray-700">
                Direct from Farms
              </span>
            </div>
          </div>
        </div>
      </div>

      <LoginPopup isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};

export default CartPage;
