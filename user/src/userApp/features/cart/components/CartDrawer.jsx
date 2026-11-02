import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";
import {
  META_OPTS,
  PRODUCT_KEYS,
} from "../../product/hook/useProducts";
import { productService } from "../../product/services/ProductService";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  calculatePricing,
} from "../../../services/pricingEngine";

const CartDrawer = () => {
  const { cartOpen, setCartOpen, cart, updateQuantity, remove } =
    useCart();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

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
    if (!cartIds) {
      setProducts([]);
      setFetchError("");
      prevIds.current = "";
      return;
    }

    if (cartIds === prevIds.current) return;

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const ids = cartIds.split(",").filter(Boolean);

        const cached = ids
          .map((id) => queryClient.getQueryData(["storeProducts", "id", id]))
          .filter(Boolean);

        const missing = ids.filter(
          (id) => !queryClient.getQueryData(["storeProducts", "id", id]),
        );

        let fetched = [];
        if (missing.length) {
          fetched = await queryClient.fetchQuery({
            queryKey: PRODUCT_KEYS.byIds(missing),
            queryFn: () => productService.getProductsByIds(missing),
            ...META_OPTS,
          });
        }

        if (!cancelled) {
          setProducts([...cached, ...fetched]);
          prevIds.current = cartIds;
        }
      } catch (e) {
        console.error("Drawer fetch error:", e);
        if (!cancelled) {
          prevIds.current = cartIds;
          setFetchError("We couldn't load your cart items. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => (cancelled = true);
  }, [cartIds, queryClient, retryCount]);

  const productMap = useMemo(() => {
    const map = new Map();
    products.forEach((p) => map.set(String(p.id), p));
    return map;
  }, [products]);

  const mergedCart = useMemo(() => {
    return cart.map((item) => {
      const product = productMap.get(String(item.id));
      return {
        ...product,
        isAvailable: Boolean(product),
        name: product?.name || item.name || "Product",
        price: product ? Number(product.price) || 0 : 0,
        images:
          product?.images?.length
            ? product.images
            : [product?.banner || (product ? item.image : "")].filter(Boolean),
        cartKey: item.cartKey,
        selectedQuantity: item.selectedQuantity || 1,
      };
    });
  }, [cart, productMap]);

  const availableCartItems = useMemo(
    () => mergedCart.filter((item) => item.isAvailable),
    [mergedCart],
  );
  const pricing = useMemo(
    () => calculatePricing(availableCartItems),
    [availableCartItems],
  );
  const { subtotal, totalPayable } = pricing;

  const handleCheckout = () => {
    const checkoutItems = availableCartItems.map((item) => ({
      ...item,
      image: item.images?.[0] || item.banner || item.image || "",
      quantity: item.selectedQuantity || 1,
    }));

    try {
      sessionStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
    } catch (storageError) {
      console.error("Could not save drawer checkout items:", storageError);
    }

    setCartOpen(false);
    navigate("/checkout/address", {
      state: {
        items: checkoutItems,
        pricing,
        totalAmount: subtotal,
        source: "cart-drawer",
      },
    });
  };

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
        className={`fixed top-0 right-0 h-screen w-full sm:max-w-[440px] bg-white z-[201] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
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

        {/* Items - compact list */}
        <div className="flex-1 overflow-y-auto">
          {fetchError ? (
            <div
              className="flex h-full flex-col items-center justify-center px-6 text-center"
              role="alert">
              <p className="text-sm text-[#687267]">{fetchError}</p>
              <button
                type="button"
                onClick={() => {
                  prevIds.current = "";
                  setRetryCount((count) => count + 1);
                }}
                className="mt-4 rounded-full bg-[#315c3c] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#24472e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315c3c]">
                Try again
              </button>
            </div>
          ) : loading ? (
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
          ) : cart.length === 0 ? (
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
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="h-20 w-20 rounded-lg border border-gray-100 object-cover"
                        />
                      ) : (
                        <div
                          className="flex h-20 w-20 items-center justify-center rounded-lg border border-gray-100 bg-[#f7f8f6] text-xs text-gray-400"
                          aria-label="Product image unavailable">
                          GKO
                        </div>
                      )}
                      {item.discount && (
                        <span className="absolute -left-1 -top-1 rounded bg-[#315c3c] px-1.5 py-0.5 text-xs font-bold text-white">
                          {item.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 mb-1">
                        {item.name}
                      </p>
                      {!item.isAvailable ? (
                        <>
                          <p className="mb-2 text-sm text-amber-700">
                            No longer available
                          </p>
                          <button
                            onClick={() => remove(item.cartKey)}
                            className="text-xs text-gray-500 underline underline-offset-2 hover:text-red-600">
                            Remove
                          </button>
                        </>
                      ) : (
                        <>
                          {item.weight && (
                            <p className="mb-1 text-xs text-gray-500">
                              Weight: {item.weight}
                            </p>
                          )}
                          <p className="mb-2 text-sm font-semibold text-gray-900">
                            ₹
                            {(item.price * item.selectedQuantity).toLocaleString(
                              "en-IN",
                              { maximumFractionDigits: 2 },
                            )}
                          </p>
                          {item.selectedQuantity > 1 && (
                            <p className="mb-2 text-xs text-gray-500">
                              ₹{item.price.toLocaleString("en-IN")} each
                            </p>
                          )}

                          <div className="flex items-center gap-3">
                            <div className="flex items-center rounded-md border border-gray-200">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.cartKey,
                                    item.selectedQuantity - 1,
                                  )
                                }
                                disabled={item.selectedQuantity <= 1}
                                className="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-30">
                                <MinusIcon className="h-3.5 w-3.5" />
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
                                <PlusIcon className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => remove(item.cartKey)}
                              className="text-xs text-gray-500 underline underline-offset-2 hover:text-red-600">
                              Remove
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer - compact */}
        {cart.length > 0 && !fetchError && (
          <div className="border-t border-gray-100 bg-gray-50">
            {/* Totals */}
            <div className="px-4 py-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-gray-900">
                  ₹{subtotal.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-gray-900">
                  ₹{totalPayable.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Checkout */}
            <div className="px-4 pb-4">
              <button
                onClick={handleCheckout}
                disabled={availableCartItems.length === 0}
                className="w-full rounded-lg bg-[#315c3c] py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-[#244b2e] disabled:cursor-not-allowed disabled:opacity-50">
                {availableCartItems.length > 0
                  ? "CHECKOUT"
                  : "No available items to checkout"}
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
