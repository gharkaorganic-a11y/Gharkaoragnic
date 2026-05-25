import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Truck,
  Award,
  Star,
  CheckCircle2,
  Box,
  Percent,
  User,
  Heart,
  Image as ImageIcon,
  Loader2,
  Bookmark,
} from "lucide-react";

/* HOOKS */
import {
  useProductBySlug,
  useRelatedProducts,
  useProductReviews,
} from "../features/product/hook/useProducts";
import { useReviewForm } from "../../../../admin/src/components/productManage/hook/useReviewForm";
import { useCart } from "../features/cart/context/CartContext";
import { useAuth } from "../features/auth/context/UserContext";

/* COMPONENTS */
import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductBottomBar from "../features/account/components/bars/ProductBottomBar";
import LoginPoup from "../components/pop-up/LoginPoup";
import NotificationProduct from "../components/cards/NotificationProduct";
import NewBreadcrumb from "../features/p/components/NewBreadcrumb";
import ProductSection from "../components/section/ProductSection";
import SectionBanner from "../features/userProfile/components/SectionBanner";
import FaqSection from "../homepage/FAQSection";
import {
  MapPinIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import OurStoryComponent from "../homepage/OurStoryComponent";
import CustomerReviewsSectionNew from "../reviews/componenst/CustomerReviewsSectionnew";

const WEBSITE_URL = "https://gharkaorganic.com";

/* ─────────────────────────────
   FALLBACK COMPONENTS
───────────────────────────── */
const LoadingSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-10 h-10 border-4 border-pink-100 border-t-[#c1121f] rounded-full animate-spin" />
  </div>
);

const ErrorState = ({ navigate }) => (
  <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
    <div className="text-7xl font-black text-gray-100">404</div>
    <h2 className="text-3xl font-bold text-gray-900 mt-4">Product Not Found</h2>
    <p className="text-gray-500 mt-3 max-w-md">
      The product you're looking for does not exist or may have been removed.
    </p>
    <button
      onClick={() => navigate("/")}
      className="mt-6 bg-[#c1121f] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#a00f1a] transition-all">
      Back To Home
    </button>
  </div>
);

/* ─────────────────────────────
   MAIN PAGE
───────────────────────────── */
const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  /* PAGE STATE */
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [notification, setNotification] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [extractedPhotos, setExtractedPhotos] = useState([]);

  /* ─────────────────────────────────────────
      DATA FETCHING
  ───────────────────────────────────────── */
  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
  } = useProductBySlug(slug);
  console.log(product);
  const { data: relatedProducts = [] } = useRelatedProducts(product, 4);

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    isError: reviewsError,
    error: reviewsFetchError,
  } = useProductReviews(product?.id, { pageSize: 5, approvedOnly: true });

  /* Review Submission Hook */
  const {
    review,
    loading: reviewSubmitting,
    error: reviewError,
    success: reviewSuccess,
    handleChange: handleReviewChange,
    handleRatingChange,
    handleImageChange,
    handleSubmit: handleReviewSubmit,
    reset: resetReviewForm,
  } = useReviewForm(product?.id);

  const reviews = useMemo(() => reviewsData?.reviews ?? [], [reviewsData]);

  /* ─────────────────────────────────────────
      EFFECTS
  ───────────────────────────────────────── */
  useEffect(() => {
    if (product?.sizes?.length) {
      setSelectedSize(product.sizes[0]);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product]);

  // Extract photos automatically whenever the live query data returns reviews
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const photos = reviews
        .filter((r) => r.imageUrl && r.imageUrl.trim() !== "")
        .map((r) => ({
          id: r.id,
          url: r.imageUrl,
          author: r.name || "Anonymous",
        }));
      setExtractedPhotos(photos);
    } else {
      setExtractedPhotos([]);
    }
  }, [reviews]);

  useEffect(() => {
    if (reviewSuccess) {
      setShowReviewForm(false);
      notify("success", "Review submitted! It will appear after approval.");
      resetReviewForm();
    }
  }, [reviewSuccess, resetReviewForm]);

  /* ─────────────────────────────────────────
      HANDLERS
  ───────────────────────────────────────── */
  const notify = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleAddToCart = async (redirect = false) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setIsAdding(true);
    try {
      await addToCart({
        id: product.id,
        selectedSize,
        selectedQuantity: quantity,
      });
      if (redirect) {
        navigate("/checkout/cart");
      } else {
        notify("success", "Added To Cart");
      }
    } catch {
      notify("error", "Something went wrong");
    } finally {
      setIsAdding(false);
    }
  };

  const handleWriteReviewClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setShowReviewForm((prev) => !prev);
  };

  const scrollToReviews = useCallback(() => {
    const el = document.getElementById("reviews");
    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
  }, []);

  /* ─────────────────────────────────────────
      DERIVED DATA
  ───────────────────────────────────────── */
  const allImages = useMemo(() => {
    return [product?.banner, ...(product?.images || [])].filter(Boolean);
  }, [product]);

  if (productLoading) return <LoadingSkeleton />;
  if (productError || !product) return <ErrorState navigate={navigate} />;

  const price = Number(product.price || 0);
  const originalPrice = Number(product.originalPrice || 0);
  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;
  console.log(product.totalReviews);
  const reviewStats = {
    average: Number(product.rating || 0).toFixed(1),
    total: Number(product.totalReviews || 0),
  };

  const seoDescription =
    product.metaDescription ||
    product.shortDescription ||
    `Buy ${product.name} online from Ghar Ka Organic`;
  const canonicalUrl =
    product.canonicalUrl || `${WEBSITE_URL}/product/${product.slug}`;

  /* ─────────────────────────────────────────
      RENDER
  ───────────────────────────────────────── */
  return (
    <>
      <Helmet>
        <title>
          {product.metaTitle || `${product.name} | Ghar Ka Organic`}
        </title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        {product.ogImage && (
          <meta property="og:image" content={product.ogImage} />
        )}
      </Helmet>

      {/* Notification Toast Alert Banner */}
      {notification && (
        <NotificationProduct
          type={notification.type}
          message={notification.message}
        />
      )}

      {/* Login Popup Window Component */}
      {showLoginModal && (
        <LoginPoup
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}

      <div className="bg-white min-h-screen pb-24 font-sans">
        <NewBreadcrumb product={product} />

        <main className="max-w-[1350px] mx-auto px-4 md:px-8">
          {/* ── TOP SECTION ── */}
          <section className="grid lg:grid-cols-12 gap-10 mt-6 items-start">
            {/* LEFT: Image Gallery */}
            <div className="lg:col-span-6 xl:col-span-7">
              <ProductImageGallery
                images={allImages}
                activeIndex={activeImageIndex}
                onImageChange={setActiveImageIndex}
                productName={product.name}
              />
            </div>

            {/* RIGHT: Product Info */}
            <div className="lg:col-span-6 xl:col-span-5 lg:sticky lg:top-24 h-fit pt-2 space-y-4">
              {/* TITLE */}
              <h1 className="text-[22px] font-bold leading-tight text-gray-900">
                {product.name}
              </h1>

              {/* ── LIVE REVIEW STATS ── */}
              <div className="space-y-1">
                {/* Row 1: Direct Store Reviews */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const avg = Number(reviewStats.average);
                      const filled = star <= Math.floor(avg);
                      const partial =
                        !filled && star === Math.ceil(avg) && avg % 1 !== 0;
                      return (
                        <span
                          key={star}
                          className="relative w-4 h-4 inline-block">
                          <Star className="absolute inset-0 text-gray-200 fill-gray-200 w-4 h-4" />
                          {(filled || partial) && (
                            <span
                              className="absolute inset-0 overflow-hidden"
                              style={{
                                width: filled ? "100%" : `${(avg % 1) * 100}%`,
                              }}>
                              <Star className="text-[#f4b400] fill-[#f4b400] w-4 h-4" />
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                  <button
                    onClick={scrollToReviews}
                    className="flex items-center gap-1 text-xs text-gray-600 hover:underline">
                    <span className="font-bold text-gray-800">
                      {Number(reviewStats.average).toFixed(1)}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span>{reviewStats.total} Reviews</span>
                  </button>
                </div>
              </div>

              {/* ── TRUST BADGES ── */}
              <div className="flex flex-wrap gap-2 pt-1">
                <div className="flex flex-col items-center justify-center border border-gray-300 rounded bg-white w-[64px] h-[52px] text-center shadow-sm">
                  <Box size={18} className="text-gray-700" />
                  <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-tight mt-0.5">
                    Pack of 8
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center border border-gray-300 rounded bg-white w-[64px] h-[52px] text-center shadow-sm">
                  <Award size={18} strokeWidth={2} className="text-red-500" />
                  <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-tight mt-0.5">
                    Best Seller
                  </span>
                </div>
              </div>

              {/* ── OFFERS ── */}
              <div className="flex flex-wrap gap-2 pt-1">
                <div className="bg-[#fffbf4] border border-orange-100 text-gray-700 px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 shadow-sm">
                  <Truck className="text-orange-400 w-3.5 h-3.5 shrink-0" />
                  FREE Shipping on order above ₹599
                </div>
                <div className="bg-[#fffbf4] border border-orange-100 text-gray-700 px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 shadow-sm">
                  <Percent className="text-orange-400 w-3.5 h-3.5 shrink-0" />
                  FLAT 3% OFF On Prepaid Orders
                </div>
              </div>

              {/* ── SCARCITY TICKER ── */}
              <div className="flex items-center gap-1.5 text-[#c1121f] text-xs font-semibold bg-red-50/60 w-fit px-2.5 py-1 rounded-md border border-red-100/50">
                <span className="animate-pulse">🔥</span>
                52 sold in last 11 hours
              </div>

              {/* ── PRICE ── */}
              <div>
                <div className="flex items-end gap-1.5 flex-wrap">
                  <span className="text-2xl font-bold text-[#cd283b] leading-none">
                    ₹{price.toFixed(2)}
                  </span>
                  {originalPrice > price && (
                    <span className="text-xs text-gray-400 leading-none pb-0.5">
                      ( MRP{" "}
                      <span className="line-through">
                        ₹{originalPrice.toFixed(2)}
                      </span>{" "}
                      )
                    </span>
                  )}
                  <span className="text-xs text-gray-400 leading-none pb-0.5 ml-1">
                    (Inclusive of all taxes)
                  </span>
                </div>
              </div>

              {/* SHELF LIFE */}
              {product.shelfLife && (
                <p className="text-xs text-gray-700 font-medium">
                  Shelf Life :{" "}
                  <span className="font-normal text-gray-600">
                    {product.shelfLife}
                  </span>
                </p>
              )}

              {/* ── PRICING VARIANT SELECTOR CARD ── */}
              <div className="border-[1.5px] border-amber-400 rounded-lg overflow-hidden max-w-md shadow-sm">
                <div className="bg-amber-400 text-white text-center py-1 font-bold text-xs uppercase tracking-wider">
                  Pack of 8
                </div>
                <div className="bg-white p-2.5 text-center space-y-0.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="font-bold text-gray-900 text-sm">
                      ₹{price.toFixed(1)}
                    </span>
                    {originalPrice > price && (
                      <>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{originalPrice.toFixed(1)}
                        </span>
                        <span className="text-xs text-red-500 font-bold">
                          {discount}% off
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium">
                    ₹99.9/100gm
                  </div>
                </div>
              </div>

              {/* ── QUANTITY & ADD TO CART ── */}
              <div className="flex gap-2 max-w-md pt-1">
                <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden h-9 w-[90px] shrink-0 shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex-1 flex justify-center items-center h-full text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold text-gray-800 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock || 10, q + 1))
                    }
                    className="flex-1 flex justify-center items-center h-full text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={() => handleAddToCart(false)}
                  disabled={isAdding || product.stock === 0}
                  className="flex-1 bg-[#c9182b] hover:bg-[#a61221] active:scale-[0.99] text-white font-bold rounded text-sm transition-all h-9 shadow-sm">
                  {isAdding
                    ? "Adding..."
                    : product.stock === 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                </button>
              </div>

              {product.stock > 0 && product.stock <= 5 && (
                <p className="text-xs font-medium text-orange-600 flex items-center gap-1.5 pl-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse inline-block" />
                  Only {product.stock} left in stock — order soon!
                </p>
              )}
            </div>
          </section>

          {/* ── DESCRIPTION & PRODUCT DETAILS ── */}
          <section className="mt-20 border-t border-gray-200 pt-12">
            <div className="w-full bg-[#ffeb00] text-center py-2.5 mb-6">
              <h2 className="text-xl font-black text-gray-900 tracking-wide uppercase">
                Product details:
              </h2>
            </div>

            <p className="text-center text-gray-700 font-medium max-w-4xl mx-auto px-4 text-sm md:text-base leading-relaxed mb-12">
              The products delivered in the pack could differ as per the
              availability of the inventory as some of our pickles are seasonal
              and we prepare in small batches.
            </p>

            <div className="grid md:grid-cols-2 gap-12 mt-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Heart className="text-[#c1121f]" /> Why You'll Love This
                </h3>
                {product.description ? (
                  <div className="prose text-gray-600 max-w-none whitespace-pre-wrap">
                    {product.description}
                  </div>
                ) : (
                  <p className="text-gray-600 leading-relaxed">
                    Experience the authentic taste of pure, unadulterated
                    ingredients. Handcrafted using traditional methods passed
                    down through generations.
                  </p>
                )}
              </div>

              <div className="bg-[#fffdfa] border border-orange-100 rounded-2xl p-8 h-fit">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Ingredients & Care
                </h3>
                <p className="text-gray-600 mb-6">
                  {product.ingredients ||
                    "Carefully selected ingredients to bring you health and taste in every bite."}
                </p>
                <div className="space-y-4 border-t border-orange-100 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Storage</span>
                    <span className="font-medium text-gray-900 text-right">
                      Store in a cool, dry place.
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Origin</span>
                    <span className="font-medium text-gray-900">
                      Proudly made in India
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── REVIEWS DASHBOARD SECTION ── */}
          <CustomerReviewsSectionNew productId={product?.id} />
          {/* ── SUBMIT FEEDBACK MODAL POPUP WINDOW ── */}
          {showReviewForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 max-w-md w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-150">
                {/* Modal Static Sticky Top Bar Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                  <h4 className="font-black text-gray-900 text-base">
                    Write A Product Review
                  </h4>
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="p-1 text-gray-400 hover:text-gray-700 font-light transition-colors">
                    ✕
                  </button>
                </div>

                {/* Input Fields Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Overall Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="transition-transform hover:scale-105">
                          <Star
                            size={26}
                            className={
                              star <= review.rating
                                ? "fill-[#f4a222] text-[#f4a222]"
                                : "text-gray-200"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={review.name || ""}
                      onChange={handleReviewChange}
                      placeholder="E.g. John Doe"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Review Message
                    </label>
                    <textarea
                      name="comment"
                      value={review.comment || ""}
                      onChange={handleReviewChange}
                      rows="4"
                      placeholder="Share details of your experience with flavor profiles, notes, or packaging..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none resize-none focus:border-gray-900 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Upload Photos (Optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 w-12 h-12 rounded-lg hover:bg-gray-100 transition-all">
                        <ImageIcon size={18} className="text-gray-400" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                      <span className="text-xs text-gray-400 truncate max-w-[240px]">
                        {review.image ? review.image.name : "No file selected"}
                      </span>
                    </div>
                  </div>

                  {reviewError && (
                    <p className="text-xs text-red-500 font-semibold bg-red-50 p-2.5 rounded border border-red-100">
                      {reviewError.message ||
                        "Failed to accept submission. Please check all metrics."}
                    </p>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={handleReviewSubmit}
                      disabled={reviewSubmitting}
                      className="w-full bg-[#f4a222] hover:bg-[#e09112] text-white font-bold py-2.5 rounded-lg text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      {reviewSubmitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        "Submit Review"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <FaqSection />
          <OurStoryComponent />
        </main>

        <ProductBottomBar
          product={product}
          onAddToCart={() => handleAddToCart(false)}
        />
      </div>
    </>
  );
};

export default ProductDetailsPage;
