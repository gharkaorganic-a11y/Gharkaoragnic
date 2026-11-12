import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  META_OPTS,
  PRODUCT_KEYS,
} from "../../product/hook/useProducts";
import { productService } from "../../product/services/ProductService";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { calculatePricing } from "../../../services/pricingEngine";
import { DEFAULT_PRODUCTS } from "../../search/siteUrlsIndex";
import BrandLogo from "../../../../components/common/BrandLogo";

const CartDrawer = () => {
  const { cartOpen, setCartOpen, cart, updateQuantity, remove, addToCart } =
    useCart();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const [addingId, setAddingId] = useState(null);
  const [bestsellers, setBestsellers] = useState(() => [
    {
      id: "prod-pahadi-salt-dhaniya-garlic",
      name: "Pahadi Salt with dhaniya, Garlic and green chillies.",
      slug: "pahadi-pisyu-loon-herb-salt-200g",
      weight: "100g",
      price: 99,
      originalPrice: 199,
      discount: 50,
      rating: 4.8,
      reviews: 4,
      image:
        "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790512823/gharka-organic/products/fttrz26ukuxngr2knc7f.jpg",
    },
    {
      id: "prod-mirch-ka-achar",
      name: "GHAR KA Mirch Ka Achar(Green chilly pickle)",
      slug: "pahadi-aam-ka-achar-400g",
      weight: "400g",
      price: 219,
      originalPrice: 299,
      discount: 27,
      rating: 4.8,
      reviews: 42,
      image: "/banner/pahadipickle.png",
    },
    {
      id: "prod-ghar-ka-honey",
      name: "GHAR KA HONEY",
      slug: "bhimtal-raw-forest-honey-500g",
      weight: "200ml",
      price: 299,
      originalPrice: 329,
      discount: 9,
      rating: 4.8,
      reviews: 42,
      image:
        "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790510595/gharka-organic/products/e6qmitnpen0qsgfimte0.jpg",
    },
    {
      id: "prod-a2-badri-ghee-500ml",
      name: "A2 Badri Cow Desi Ghee (Bilona Churned)",
      slug: "a2-badri-cow-desi-ghee-500ml",
      weight: "500ml",
      price: 1350,
      originalPrice: 1550,
      discount: 13,
      rating: 4.9,
      reviews: 86,
      image: "/products/desi-ghee.jpeg",
    },
    {
      id: "prod-pahadi-aam-ka-achar-400g",
      name: "Authentic Pahadi Mango Pickle (Aam Ka Achar)",
      slug: "pahadi-aam-ka-achar-400g",
      weight: "400g",
      price: 349,
      originalPrice: 399,
      discount: 13,
      rating: 4.8,
      reviews: 38,
      image: "/products/mango-pickle.jpeg",
    },
    {
      id: "prod-kumaoni-nimbu-achar-400g",
      name: "Kumaoni Sun-Cured Lemon Pickle (Nimbu Achar)",
      slug: "kumaoni-nimbu-achar-400g",
      weight: "400g",
      price: 329,
      originalPrice: 380,
      discount: 13,
      rating: 4.8,
      reviews: 29,
      image: "/banner/pahadipickle.png",
    },
  ]);

  useEffect(() => {
    let isMounted = true;
    const loadLiveBestsellers = async () => {
      try {
        const res = await productService.getProducts({ pageSize: 6 });
        if (isMounted && res?.products?.length > 0) {
          const liveItems = res.products.slice(0, 6).map((p) => {
            const price = Number(p.price) || 0;
            const originalPrice = Number(p.originalPrice ?? p.mrp) || 0;
            const discount =
              originalPrice > price
                ? Math.round(((originalPrice - price) / originalPrice) * 100)
                : 0;
            const weight =
              p.weight ||
              p.netWeight ||
              (Array.isArray(p.sizes) ? p.sizes[0] : "") ||
              "";

            return {
              id: p.id,
              name: p.name,
              slug: p.slug || p.id,
              price,
              originalPrice,
              discount,
              weight,
              rating: Number(p.rating || 4.8),
              reviews: Number(p.reviews ?? p.totalReviews ?? 42),
              image:
                p.banner ||
                p.images?.[0] ||
                "/products/desi-ghee.jpeg",
            };
          });
          if (liveItems.length >= 3) {
            setBestsellers(liveItems);
          }
        }
      } catch (err) {
        // Fallback to initial curated bestsellers
      }
    };
    loadLiveBestsellers();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddBestseller = async (item, e) => {
    if (e) e.stopPropagation();
    if (addingId === item.id) return;
    setAddingId(item.id);
    try {
      await addToCart({
        id: item.id,
        name: item.name,
        price: Number(item.price) || 0,
        image: item.image,
        selectedSize: item.weight || "Standard",
        selectedQuantity: 1,
      });
    } catch (err) {
      console.error("Failed to add bestseller:", err);
    } finally {
      setTimeout(() => setAddingId(null), 600);
    }
  };

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
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  /* Close on Escape */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    if (cartOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [cartOpen, setCartOpen]);

  if (typeof document === "undefined") return null;

  return createPortal(
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
        className={`fixed inset-y-0 right-0 h-dvh max-h-dvh w-full sm:max-w-[440px] bg-white z-[201] shadow-2xl transition-transform duration-300 ease-out flex flex-col overflow-hidden ${
          cartOpen
            ? "translate-x-0 pointer-events-auto"
            : "translate-x-full pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!cartOpen}>
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <BrandLogo symbolOnly size="sm" />
            <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="p-1.5 -mr-1.5 rounded-full hover:bg-gray-100 transition"
            aria-label="Close cart">
            <XMarkIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Items - compact list */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
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
            <div className="min-h-full flex flex-col justify-between">
              {/* Top: Start with Bestsellers */}
              <div className="pt-4 pb-2 border-b border-[#f0eee6]">
                <div className="px-4 pb-2 flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold tracking-[0.14em] text-[#7B4627] uppercase flex items-center gap-1.5">
                    <span>⚡</span> Start with Bestsellers
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium">
                    Swipe to explore
                  </span>
                </div>

                {/* Horizontal scrollable bestseller cards matching website ProductCard style */}
                <div className="px-4 pb-3 overflow-x-auto no-scrollbar flex gap-3 snap-x snap-mandatory scroll-smooth">
                  {bestsellers.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setCartOpen(false);
                        navigate(`/product/${item.slug || item.id}`);
                      }}
                      className="w-[170px] sm:w-[185px] flex-shrink-0 snap-start bg-white border border-[#eae8e1] hover:border-[#315c3c]/50 rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all cursor-pointer select-none group">
                      <div>
                        {/* Image Container with Badges */}
                        <div className="relative aspect-square w-full rounded-xl bg-[#faf9f5] overflow-hidden mb-2.5 border border-[#f0eee6] flex items-center justify-center p-2">
                          {/* Brown % OFF Badge (Top-Left) */}
                          {item.discount > 0 && (
                            <div className="absolute top-1.5 left-1.5 z-10 bg-[#7B4627] text-white rounded px-1.5 py-0.5 text-center leading-none shadow-xs pointer-events-none">
                              <span className="block text-[9px] sm:text-[10px] font-bold tracking-tight">
                                {item.discount}%
                              </span>
                              <span className="block text-[7px] sm:text-[8px] font-bold tracking-wider uppercase opacity-90 mt-0.5">
                                OFF
                              </span>
                            </div>
                          )}

                          {/* Golden-Yellow Circle Weight Badge (Top-Right) */}
                          {item.weight && (
                            <div className="absolute top-1.5 right-1.5 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FAB81E] text-gray-950 font-bold text-[8px] sm:text-[9px] flex items-center justify-center shadow-xs pointer-events-none">
                              {item.weight}
                            </div>
                          )}

                          {/* Selling Fast Pill (Bottom-Left) */}
                          <div className="absolute bottom-1.5 left-1.5 z-10 inline-flex items-center gap-1 bg-[#D89C3A] text-white text-[8px] sm:text-[9px] font-medium px-2 py-0.5 rounded-full shadow-xs pointer-events-none">
                            <span className="text-[9px] leading-none">⚡</span>
                            <span>Selling Fast</span>
                          </div>

                          {/* Image */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain max-h-[140px] group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>

                        {/* Title */}
                        <h4 className="text-[12px] sm:text-[13px] font-normal text-gray-800 line-clamp-2 leading-snug min-h-[34px] group-hover:text-[#315c3c] transition-colors">
                          {item.name}
                        </h4>

                        {/* Rating */}
                        <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 pt-1 pb-0.5">
                          <span className="text-[#F59E0B] text-xs">★</span>
                          <span className="font-bold text-gray-900 text-xs">
                            {item.rating || "4.8"}
                          </span>
                          <span className="text-gray-500 font-normal text-xs">
                            ({item.reviews || 42} reviews)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-1.5 pt-0.5 pb-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-900">
                            Rs. {Number(item.price).toFixed(2)}
                          </span>
                          {item.originalPrice > item.price && (
                            <span className="text-[11px] text-gray-400 line-through font-normal">
                              Rs. {Number(item.originalPrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart button */}
                      <button
                        type="button"
                        onClick={(e) => handleAddBestseller(item, e)}
                        disabled={addingId === item.id}
                        className={`w-full py-2.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] ${
                          addingId === item.id
                            ? "bg-[#47724d] text-white"
                            : "bg-[#2D5A38] text-white hover:bg-[#23472c]"
                        }`}>
                        {addingId === item.id ? (
                          <>
                            <Check size={14} strokeWidth={2.5} />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} strokeWidth={2} />
                            <span>Add to cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center: Empty Cart Basket with 0 badge */}
              <div className="py-8 px-4 flex flex-col items-center justify-center text-center my-auto">
                <div className="relative inline-flex items-center justify-center mb-3">
                  <svg
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 h-16 text-[#1c1c1c]"
                    aria-hidden="true">
                    {/* Basket handles */}
                    <path
                      d="M21 21L27 10M43 21L37 10"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Basket top rim */}
                    <rect
                      x="9"
                      y="21"
                      width="46"
                      height="5.5"
                      rx="2.75"
                      fill="currentColor"
                    />
                    {/* Basket body */}
                    <path
                      d="M13.5 26.5L18.5 50.5C18.8 52.8 20.6 54.5 22.8 54.5H41.2C43.4 54.5 45.2 52.8 45.5 50.5L50.5 26.5"
                      fill="currentColor"
                    />
                    {/* Vertical slats */}
                    <line
                      x1="24.5"
                      y1="31"
                      x2="25.5"
                      y2="47"
                      stroke="white"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <line
                      x1="32"
                      y1="31"
                      x2="32"
                      y2="47"
                      stroke="white"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <line
                      x1="39.5"
                      y1="31"
                      x2="38.5"
                      y2="47"
                      stroke="white"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Badge 0 */}
                  <span className="absolute -bottom-1 -right-1 bg-white text-[#121212] text-[11px] font-bold w-6 h-6 rounded-full border-2 border-[#121212] flex items-center justify-center shadow-xs">
                    0
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold tracking-[0.14em] text-[#121212] uppercase">
                  Your cart is empty
                </h3>
                <p className="mt-1 text-xs text-[#737373]">
                  Add items to get started
                </p>
              </div>
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
          <div className="shrink-0 border-t border-gray-100 bg-gray-50 pb-[env(safe-area-inset-bottom)]">
            {/* Totals */}
            <div className="px-4 py-2.5 sm:py-3 space-y-1.5">
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
                type="button"
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

        {/* Empty Cart Footer Action (Matches Screenshot) */}
        {cart.length === 0 && !fetchError && (
          <div className="shrink-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-[#eeeeea] bg-[#fafaf9]">
            <button
              type="button"
              onClick={() => {
                setCartOpen(false);
                navigate("/all-products");
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#121212] hover:text-black bg-[#ededeb] hover:bg-[#e2e2df] active:scale-[0.99] rounded-lg transition-colors shadow-xs">
              <ShoppingBag size={17} strokeWidth={2.2} />
              <span>Continue Shopping</span>
            </button>
          </div>
        )}
      </aside>
    </>,
    document.body,
  );
};

export default CartDrawer;
