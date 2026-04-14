import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  PencilSquareIcon,
  TicketIcon,
  TruckIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";
import { useProducts } from "../../product/hook/useProducts";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const FREE_SHIPPING_THRESHOLD = 999;

const CartDrawer = () => {
  const { cartOpen, setCartOpen, cart, updateQuantity, removeFromCart } =
    useCart();
  const { getProductsByIds } = useProducts();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ─────────────────────────────
     Fetch product details
  ───────────────────────────── */
  const cartIds = useMemo(
    () =>
      cart
        .map((i) => String(i.id))
        .sort()
        .join(","),
    [cart],
  );

  const prevIds = useRef("");

  useEffect(() => {
    if (!cart.length) {
      setProducts([]);
      prevIds.current = "";
      return;
    }

    if (cartIds === prevIds.current) return;

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const ids = cartIds.split(",").filter(Boolean);

        const cached = ids
          .map((id) => queryClient.getQueryData(["products", "id", id]))
          .filter(Boolean);

        const missing = ids.filter(
          (id) => !queryClient.getQueryData(["products", "id", id]),
        );

        let fetched = [];
        if (missing.length) {
          fetched = await getProductsByIds(missing);
        }

        if (!cancelled) {
          setProducts([...cached, ...fetched]);
          prevIds.current = cartIds;
        }
      } catch (e) {
        console.error("Drawer fetch error:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => (cancelled = true);
  }, [cartIds, cart, getProductsByIds, queryClient]);

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
        return {
          ...product,
          cartKey: item.cartKey,
          selectedQuantity: item.selectedQuantity,
        };
      })
      .filter(Boolean);
  }, [cart, productMap]);

  const subtotal = useMemo(() => {
    return mergedCart.reduce(
      (sum, item) => sum + item.price * item.selectedQuantity,
      0,
    );
  }, [mergedCart]);

  const freeShippingProgress = Math.min(
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100,
  );
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  /* Lock body scroll */
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [cartOpen]);

  /* Close on Escape */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    if (cartOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [cartOpen, setCartOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 bg-black/40 z-[200] transition-opacity duration-300 ${
          cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer - compact width for small UI */}
      <aside
        className={`fixed top-0 right-0 h- w-full xs:w- sm:w- bg-white z-[201] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
          <button
            onClick={() => setCartOpen(false)}
            className="p-1.5 -mr-1.5 rounded-full hover:bg-gray-100 transition"
            aria-label="Close cart">
            <XMarkIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Free Shipping Bar */}
        {mergedCart.length > 0 && (
          <div className="px-4 py-3 bg-green-50 border-b border-green-100">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs text-gray-800 mb-1.5">
                Add{" "}
                <span className="font-semibold">
                  ₹{remainingForFreeShipping.toLocaleString("en-IN")}
                </span>{" "}
                more for FREE Shipping
              </p>
            ) : (
              <div className="flex items-center gap-1.5 mb-1.5">
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                <p className="text-xs font-medium text-green-700">
                  Congrats! You are eligible for FREE Shipping
                </p>
              </div>
            )}
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items - compact list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3.5 bg-gray-100 rounded w-4/5" />
                    <div className="h-3 bg-gray-100 rounded w-2/5" />
                    <div className="h-7 bg-gray-100 rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : mergedCart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-6 text-center">
              <TruckIcon className="w-12 h-12 text-gray-300 mb-3" />
              <p className="font-medium text-gray-900 mb-1">
                Your cart is empty
              </p>
              <p className="text-sm text-gray-500 mb-5">
                Add items to get started
              </p>
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate("/collections/all");
                }}
                className="text-sm font-semibold text-white bg-gray-900 px-6 py-2.5 rounded-lg hover:bg-black transition">
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {mergedCart.map((item) => (
                <li key={item.cartKey} className="p-4">
                  <div className="flex gap-3">
                    {/* Image with badge */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-100"
                      />
                      {item.discount && (
                        <span className="absolute -top-1 -left-1 bg-red-500 text-white text- font-bold px-1.5 py-0.5 rounded">
                          {item.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 mb-1">
                        {item.name}
                      </p>
                      {item.weight && (
                        <p className="text-xs text-gray-500 mb-1">
                          Weight: {item.weight}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        Rs. {item.price.toLocaleString("en-IN")}
                      </p>

                      {/* Qty + Remove */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.cartKey,
                                item.selectedQuantity - 1,
                              )
                            }
                            disabled={item.selectedQuantity <= 1}
                            className="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-30">
                            <MinusIcon className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">
                            {item.selectedQuantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.cartKey,
                                item.selectedQuantity + 1,
                              )
                            }
                            className="px-2 py-1 text-gray-600 hover:text-gray-900">
                            <PlusIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartKey)}
                          className="text-xs text-gray-500 hover:text-red-600 underline underline-offset-2">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer - compact */}
        {mergedCart.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50">
            {/* Note + Coupon */}
            <div className="flex divide-x divide-gray-200 border-b border-gray-100">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition">
                <PencilSquareIcon className="w-4 h-4" />
                Note
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition">
                <TicketIcon className="w-4 h-4" />
                Coupon
              </button>
            </div>

            {/* Totals */}
            <div className="px-4 py-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="font-semibold text-gray-900">Subtotal</span>
                <span className="font-bold text-gray-900">
                  Rs. {subtotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Checkout */}
            <div className="px-4 pb-4">
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate("/checkout");
                }}
                className="w-full bg-[#E91E63] hover:bg-[#D81B60] text-white py-3.5 rounded-lg font-semibold text-sm tracking-wide transition">
                CHECKOUT
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
