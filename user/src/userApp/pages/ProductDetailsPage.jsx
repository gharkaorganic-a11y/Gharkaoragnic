import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Tag,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

import { useProducts } from "../features/product/hook/useProducts";
import { useCart } from "../features/cart/context/CartContext";
import { useAuth } from "../features/auth/context/UserContext";

import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductBottomBar from "../features/account/components/bars/ProductBottomBar";
import LoginPoup from "../components/pop-up/LoginPoup";
import NotificationProduct from "../components/cards/NotificationProduct";
import AccordionRow from "../features/product/copmonents/AccordionRow";
import NewBreadcrumb from "../features/p/components/NewBreadcrumb";
import ProductStorySection from "../features/p/components/ProductStorySection";
import StarRating from "../features/product/copmonents/StarRating";
import ReviewsSection from "../homepage/ReviewsSection";

// ─── Utilities ────────────────────────────────────────────────────────────────
const fmt = (n) => `₹${new Intl.NumberFormat("en-IN").format(n)}`;

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-10 h-10 border-4 border-gray-100 border-t-[#da127d] rounded-full animate-spin" />
  </div>
);

// ─── 404 State ────────────────────────────────────────────────────────────────
const ErrorState = ({ navigate }) => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-4 bg-white">
    <div className="text-8xl font-black text-gray-50 select-none">404</div>
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
      Product Not Found
    </h2>
    <p className="text-gray-500 max-w-sm mb-4">
      We couldn't find what you're looking for. Let's get you back on track.
    </p>
    <button
      onClick={() => navigate("/")}
      className="px-8 py-3.5 bg-[#da127d] text-white font-bold tracking-widest text-sm hover:bg-[#c20d6c] transition-colors rounded-sm">
      BACK TO HOME
    </button>
  </div>
);

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-400 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
};

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { getProductBySlug, getProductsByCategoryLimited } = useProducts();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart, cart } = useCart();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [notification, setNotification] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState("");

  // ─── Fetch Product ───────────────────────────────────────────────────────
  // getProductBySlug is already cache-first internally (checks React Query cache
  // before hitting Firestore), so no manual cache check needed here.
  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      setFetching(true);
      setFetchError(false);
      try {
        const data = await getProductBySlug(slug);
        if (cancelled) return;
        if (data) {
          setProduct(data);
          if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        } else {
          setFetchError(true);
        }
      } catch (err) {
        if (!cancelled) setFetchError(true);
      } finally {
        if (!cancelled) setFetching(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => (cancelled = true);
  }, [slug, getProductBySlug]);

  // ── Fetch related products ──
  useEffect(() => {
    if (!product?.categoryId) return;
    let cancelled = false;

    const fetchRelated = async () => {
      try {
        const data = await getProductsByCategoryLimited(product.categoryId, 5);
        if (!cancelled && data) {
          setRelatedProducts(data.filter((p) => p.id !== product.id));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRelated();
    return () => (cancelled = true);
  }, [product, getProductsByCategoryLimited]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const notify = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleAddToCart = async (redirect = false) => {
    if (!isLoggedIn) return setShowLoginModal(true);
    if (product.sizes?.length > 0 && !selectedSize)
      return notify("error", "Please select a size");

    setIsAdding(true);
    try {
      await addToCart({
        id: product.id,
        selectedSize,
        selectedQuantity: quantity,
      });
      if (redirect) navigate("/checkout/cart");
      else notify("success", "Added to bag!");
    } catch {
      notify("error", "Something went wrong. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const checkPincode = () => {
    if (pincode.length === 6) {
      setPincodeMsg("✓ Delivery available. Expect 3-5 days delivery.");
    } else {
      setPincodeMsg("Please enter a valid 6-digit pincode.");
    }
  };

  // ─── Rendering Guards ─────────────────────────────────────────────────────
  if (fetching) return <LoadingSkeleton />;
  if (fetchError || !product) return <ErrorState navigate={navigate} />;

  // ─── Data Prep ────────────────────────────────────────────────────────────
  const allImages = [product.banner, ...(product.images || [])].filter(Boolean);
  const isOutOfStock = product.stock === 0;

  const price = Number(product.price || 0);
  const originalPrice = Number(product.originalPrice || price);
  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const variantKey = product ? `${product.id}_${selectedSize}` : null;
  const cartItems = cart?.cart || [];
  const alreadyInCart =
    product && variantKey
      ? cartItems.some((item) => item.cartKey === variantKey)
      : false;

  // collectionTypes as tags
  const tags = product.collectionTypes || [];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20 md:pb-0 ">
      {/* ── Breadcrumbs ── */}
      <NewBreadcrumb product={product} />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 pb-16 mt-4">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT - IMAGES */}
          <div className="w-full lg:w-[60%]">
            <ProductImageGallery
              images={allImages}
              activeIndex={activeImageIndex}
              onImageChange={setActiveImageIndex}
              productName={product.name}
            />
          </div>

          {/* RIGHT - DETAILS */}
          <div className="w-full lg:w-[40%] flex flex-col gap-5">
            {/* 1. TITLE & RATINGS */}
            <div>
              <h1 className="text-2xl md:text-xl font-semibold text-gray-900 leading-tight">
                {product.name}
              </h1>
              {/* 2 reviews */}
              <div className="flex items-center gap-2">
                <StarRating rating={4.8} />
                <span className="text-sm text-gray-700">
                  <span className="font-medium">4.8</span>{" "}
                  <span className="text-gray-500">| 774 Reviews</span>
                </span>
              </div>

              {/* 5. TRENDING STAT & PRICE */}
              <div className="space-y-2.5">
                {/* Sold Info */}
                <div className="flex items-center gap-2 text-[14px] text-gray-700">
                  <span className="text-orange-500 text-[16px]">🔥</span>
                  <span className="font-medium">34 sold in last 8 hours</span>
                </div>

                {/* Price Section */}
                <div className="flex items-baseline flex-wrap gap-x-2">
                  {/* Selling Price */}
                  <span className="text-[28px] font-normal text-[#d32f2f]">
                    {fmt(price)}
                  </span>

                  {/* MRP */}
                  <span className="text-[16px] text-gray-500">
                    ( MRP{" "}
                    <span className="line-through text-gray-400">
                      {fmt(originalPrice)}
                    </span>{" "}
                    )
                  </span>

                  {/* Tax Info */}
                  <span className="text-[13px] text-gray-500">
                    (Inclusive of all taxes)
                  </span>
                </div>

                {/* Shelf Life */}
                <div className="text-[15px] text-gray-700">
                  <span className="font-semibold text-gray-800">
                    Shelf Life :
                  </span>{" "}
                  9 months from the date of manufacturing.
                </div>
              </div>
              <div className="mt-2 space-y-1.5">{/* Site Reviews */}</div>
            </div>

            {/* 4. OFFER BANNERS */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 bg-[#fef9f1] border border-[#f5e6d3] px-3 py-2 rounded text-[11px] text-gray-800 flex-1">
                <Truck size={14} className="flex-shrink-0" />
                <span>
                  FREE Shipping on order above{" "}
                  <span className="font-bold text-[#0052cc]">@499</span>
                </span>
              </div>
              <div className="flex items-center gap-2 bg-[#fef9f1] border border-[#f5e6d3] px-3 py-2 rounded text-[11px] text-gray-800 flex-1">
                <span className="font-bold">%</span>
                <span>FLAT 3% OFF On Prepaid Orders</span>
              </div>
            </div>

            {/* 7. QUANTITY & ADD TO CART */}
            <div className="flex gap-4 items-center mt-2">
              <div className="flex items-center border-2 border-[#f1c40f] rounded-lg h-12 bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 h-full hover:bg-gray-50 border-r border-[#f1c40f] text-gray-600">
                  <Minus size={16} strokeWidth={3} />
                </button>
                <span className="px-5 font-bold text-lg text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 h-full hover:bg-gray-50 border-l border-[#f1c40f] text-gray-600">
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(false)}
                disabled={isAdding || isOutOfStock}
                className="flex-1 bg-[#c5112e] hover:bg-[#a30e26] disabled:bg-gray-300 text-white h-12 rounded-lg font-bold text-lg shadow-md transition-all active:scale-[0.98]">
                {isOutOfStock
                  ? "Out of Stock"
                  : isAdding
                    ? "Adding..."
                    : "Add to Cart"}
              </button>
            </div>

            {/* 8. TRUST MARKERS */}
            <div className="flex justify-between py-4 border-t border-gray-100 mt-2">
              <div className="flex flex-col items-center text-center gap-1 group">
                <ShieldCheck
                  size={22}
                  className="text-green-600 group-hover:scale-110 transition-transform"
                />
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                  100% Original
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 group">
                <RefreshCw
                  size={22}
                  className="text-orange-500 group-hover:rotate-180 transition-transform duration-500"
                />
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                  Easy Returns
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 group">
                <Truck
                  size={22}
                  className="text-blue-500 group-hover:translate-x-1 transition-transform"
                />
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                  Pay on Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
        <ReviewsSection />
      </main>

      {/* ── Overlays & Modals ── */}
      {notification && (
        <NotificationProduct
          {...notification}
          onClose={() => setNotification(null)}
        />
      )}

      <ProductBottomBar
        product={product}
        handleAddToCart={() => handleAddToCart(false)}
        isAdding={isAdding}
      />

      {showLoginModal && <LoginPoup setShowLoginModal={setShowLoginModal} />}
    </div>
  );
};

export default ProductDetailsPage;
