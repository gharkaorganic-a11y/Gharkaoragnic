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

const round = (num) => Math.round(num * 100) / 100;

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

  /**
   * =========================
   * FETCH FRESH PRODUCT DATA
   * =========================
   * IMPORTANT: avoids stale price issues
   */
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

        // ❗ Force fresh data (no stale cache dependency)
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
  }, [cartIds, cart.length]);

  /**
   * =========================
   * PRODUCT MAP
   * =========================
   */
  const productMap = useMemo(() => {
    const map = new Map();
    products.forEach((p) => map.set(String(p.id), p));
    return map;
  }, [products]);

  /**
   * =========================
   * MERGED CART
   * =========================
   */
  const mergedCart = useMemo(() => {
    return cart
      .map((item) => {
        const product = productMap.get(String(item.id));
        if (!product) return null;

        return {
          ...product,
          cartKey: item.cartKey,
          selectedQuantity: item.selectedQuantity || 1,
          selectedSize: item.selectedSize || "",
        };
      })
      .filter(Boolean);
  }, [cart, productMap]);

  /**
   * =========================
   * SELECTION SYNC
   * =========================
   */
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

  /**
   * =========================
   * PRICING (LIVE CALC)
   * =========================
   */
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
    const platformFee = subtotal > 0 && subtotal < 999 ? 50 : 0;

    return {
      subtotal: round(subtotal),
      originalTotalPrice: round(originalTotalPrice),
      gstAmount,
      platformFee,
      totalPayable: round(subtotal + gstAmount + platformFee),
    };
  }, [selectedItems]);

  /**
   * =========================
   * STOCK VALIDATION
   * =========================
   */
  const validateCart = useCallback(() => {
    for (const item of selectedItems) {
      if (item.stock !== undefined && item.selectedQuantity > item.stock) {
        return `Item ${item.name} is out of stock`;
      }
    }
    return null;
  }, [selectedItems]);

  /**
   * =========================
   * CHECKOUT (SAFE)
   * =========================
   */
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

    // 🔥 FORCE FRESH DATA BEFORE PAYMENT
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
      },
    });
  };

  /**
   * =========================
   * UI STATES
   * =========================
   */
  if (loadingDetails && cart.length > 0) return <CartSkeleton />;

  if (error) return <div className="p-4 text-red-600 font-medium">{error}</div>;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="min-h-screen  ">
      {/* Breadcrumb */}
      <NewBreadcrumb items={[{ label: "Home", to: "/" }, { label: "Cart" }]} />
      <div className="flex flex-col lg:flex-row gap-8 px-4">
        {/* LEFT SIDE */}
        <div className="flex-1">
          <CartControlHeader
            cartItems={mergedCart}
            selectedItems={selected}
            onToggleSelect={handleSelectAll}
            onClearCart={clear}
            totalPrice={pricing.totalPayable}
          />

          {mergedCart.map((item) => (
            <CartItemCard
              key={item.cartKey}
              product={item}
              selected={selected.includes(item.cartKey)}
              onSelect={() => handleSelectItem(item.cartKey)}
              onRemove={() => remove(item.cartKey)}
              onQtyChange={(qty) => updateQuantity(item.cartKey, qty)}
              onSizeChange={(size) => updateSize(item.cartKey, size)}
              className="border-red-200 hover:border-red-500"
            />
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-[400px]">
          <CartSummary
            subtotal={pricing.subtotal}
            originalTotalPrice={pricing.originalTotalPrice}
            gstAmount={pricing.gstAmount}
            platformFee={pricing.platformFee}
            selectedItems={selectedItems}
            onPlaceOrder={handleCheckout}
            className="bg-white border border-red-200 shadow-md"
          />
        </div>
      </div>

      {/* LOGIN POPUP */}
      <LoginPopup isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};

export default CartPage;
