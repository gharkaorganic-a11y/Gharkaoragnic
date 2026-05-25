/**
 * ProductCreatePage.jsx
 * Admin page for creating and editing organic e-commerce products.
 */

import React, { useMemo, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  X,
  CheckCircle2,
  Star,
  MessageSquare,
} from "lucide-react";

import { CATEGORIES } from "../../constants/categories";
import { COLLECTIONS } from "../../constants/collections";

import { useProductForm } from "../../components/productManage/hook/useProductForm";

import ProductInfoCard from "../../components/productManage/createProduct/productForm/ProductInfoCard";
import PriceInventoryCard from "../../components/productManage/createProduct/productForm/PriceInventoryCard";
import SizesCard from "../../components/productManage/createProduct/productForm/SizesCard";
import ProductImageCard from "../../components/productManage/createProduct/productForm/ProductImageCard";
import ProductGalleryCard from "../../components/productManage/createProduct/productForm/ProductGalleryCard";
import ProductOrganizationCard from "../../components/productManage/createProduct/productForm/ProductOrganizationCard";
import ProductStatusCard from "../../components/productManage/createProduct/productForm/ProductStatusCard";
import MobileStickySaveButton from "../../components/productManage/createProduct/ui/MobileStickySaveButton";
import { useReviewForm } from "../../components/productManage/hook/useReviewForm";
import AdminReviewCard from "../../components/productManage/createProduct/productForm/AdminReviewCard";

// Import your product service to fetch existing reviews
import { productService } from "../../services/firebase/product/productService";

/* ─────────────────────────────
   PAGE
───────────────────────────── */
const ProductCreatePage = () => {
  const navigate = useNavigate();

  const {
    product,
    setProduct,
    patchProduct,

    errors,
    fieldError,
    setErrors,
    setFieldError,
    success,

    loading,
    pageLoading,
    uploadingBanner,
    uploadingGallery,

    handleChange,
    handleSubmit,

    handleBannerUpload,
    handleGalleryUpload,
    removeGalleryImage,

    togglePresetSize,
    addCustomSize,
    removeSize,
    customSizeInput,
    setCustomSizeInput,
    customSizeRef,
    PRESET_SIZES,

    addTag,
    removeTag,
    toggleCollectionType,

    addFaqItem,
    updateFaqItem,
    removeFaqItem,

    isEditing,
  } = useProductForm();

  /* ─────────────────────────────
     REVIEWS LOGIC
  ───────────────────────────── */
  const {
    review,
    loading: reviewLoading,
    error: reviewError,
    success: reviewSuccess,
    handleChange: handleReviewChange,
    handleRatingChange,
    handleAdminSubmit,
  } = useReviewForm(isEditing ? product?.id : null);

  const [existingReviews, setExistingReviews] = useState([]);
  const [fetchingReviews, setFetchingReviews] = useState(false);
  const [totalReviewsCount, setTotalReviewsCount] = useState(0);

  // Fetch up to 4 reviews when the component mounts (if editing)
  useEffect(() => {
    let isMounted = true; // <-- Safety flag

    const fetchReviews = async () => {
      if (isEditing && product?.id) {
        try {
          setFetchingReviews(true);

          const res = await productService.getProductReviews(product.id, {
            pageSize: 5,
            approvedOnly: false,
          });

          if (isMounted) {
            // <-- Only update state if the user hasn't left the page
            setExistingReviews(res.reviews.slice(0, 4));
            setTotalReviewsCount(res.totalCount || res.reviews.length);
          }
        } catch (err) {
          if (isMounted)
            console.error("Failed to fetch existing reviews:", err);
        } finally {
          if (isMounted) setFetchingReviews(false);
        }
      }
    };

    fetchReviews();

    // Cleanup function runs if the component unmounts
    return () => {
      isMounted = false;
    };
  }, [isEditing, product?.id, reviewSuccess]);

  /* ─────────────────────────────
     DERIVED
  ───────────────────────────── */
  const isBusy = useMemo(
    () => loading || uploadingBanner || uploadingGallery,
    [loading, uploadingBanner, uploadingGallery],
  );

  const price = Number(product?.price) || 0;
  const originalPrice = Number(product?.originalPrice) || 0;
  const discount =
    originalPrice > price && originalPrice > 0
      ? Math.round((1 - price / originalPrice) * 100)
      : 0;

  const showSuccess = success && !loading;
  const hasErrors = errors.length > 0;

  /* ─────────────────────────────
     PAGE LOADING
  ───────────────────────────── */
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#F1F3F6] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#2874F0]" />
        <p className="text-[#878787] font-medium">Loading product data…</p>
      </div>
    );
  }

  /* ─────────────────────────────
     RENDER
  ───────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F1F3F6] font-sans text-[#212121] pb-24">
      {/* ── STICKY HEADER ── */}
      <header className="bg-white border-b border-[#e0e0e0] sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Back + title */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/products")}
              aria-label="Go back to products"
              className="p-2 rounded-sm hover:bg-[#f1f3f6] text-[#878787] hover:text-[#212121] transition-colors">
              <ArrowLeft size={22} />
            </button>

            <div>
              <h1 className="text-[20px] font-semibold">
                {isEditing ? "Edit Product Listing" : "Add New Product"}
              </h1>
              <p className="text-[#878787] text-[13px] hidden sm:block mt-0.5">
                {isEditing
                  ? `Editing ID: ${product?.id || "N/A"}`
                  : "Fill in the details below to publish."}
              </p>
            </div>
          </div>

          {/* Desktop save */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isBusy}
            aria-label={isEditing ? "Save product changes" : "Publish product"}
            className="hidden sm:flex items-center justify-center gap-2 bg-[#2874F0] text-white px-8 py-2.5 rounded-sm font-medium text-[15px] shadow-sm hover:bg-[#1d5ed8] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed min-w-[200px]">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : showSuccess ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>
              {loading
                ? "Saving…"
                : showSuccess
                  ? "Saved!"
                  : isEditing
                    ? "Save Changes"
                    : "Publish Product"}
            </span>
          </button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Alerts... */}
        {fieldError && (
          <div
            role="alert"
            className="flex items-start gap-3 p-4 bg-[#fff3e0] border border-[#ffcc80] rounded-sm text-[#e65100]">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-[14px] font-medium flex-1">{fieldError}</p>
            <button
              onClick={() => setFieldError(null)}
              className="text-[#ffb74d] hover:text-[#e65100]">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {hasErrors && (
          <div
            role="alert"
            className="flex items-start gap-3 p-4 bg-[#ffebee] border border-[#ffcdd2] rounded-sm text-[#c62828]">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              {errors.map((e, i) => (
                <p key={i} className="text-[14px] font-medium">
                  {e}
                </p>
              ))}
            </div>
            <button
              onClick={() => setErrors([])}
              className="text-[#e57373] hover:text-[#c62828]">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {showSuccess && (
          <div
            role="status"
            className="flex items-center gap-3 p-4 bg-[#f2f8f5] border border-[#388e3c] rounded-sm text-[#388e3c]">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-[14px] font-medium">
              Product {isEditing ? "updated" : "published"} successfully!
              Redirecting…
            </p>
          </div>
        )}

        {/* ── TWO-COLUMN GRID ── */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT — primary content */}
          <div className="flex-1 space-y-6">
            <ProductInfoCard product={product} handleChange={handleChange} />
            <PriceInventoryCard
              product={product}
              handleChange={handleChange}
              discount={discount}
            />
            <SizesCard
              product={product}
              togglePresetSize={togglePresetSize}
              addCustomSize={addCustomSize}
              removeSize={removeSize}
              PRESET_SIZES={PRESET_SIZES}
              customSizeInput={customSizeInput}
              setCustomSizeInput={setCustomSizeInput}
              customSizeRef={customSizeRef}
            />

            {/* ── EXISTING REVIEWS DISPLAY CARD ── */}
            {isEditing && (
              <ExistingReviewsCard
                productId={product.id}
                reviews={existingReviews}
                loading={fetchingReviews}
                totalCount={totalReviewsCount}
              />
            )}
          </div>

          {/* RIGHT — sidebar */}
          <div className="w-full lg:w-[420px] space-y-6">
            <ProductStatusCard product={product} setProduct={setProduct} />
            <ProductOrganizationCard
              product={product}
              setProduct={setProduct}
              handleChange={handleChange}
              CATEGORIES={CATEGORIES}
              COLLECTIONS={COLLECTIONS}
              addTag={addTag}
              removeTag={removeTag}
              toggleCollectionType={toggleCollectionType}
              patchProduct={patchProduct}
            />
            <ProductImageCard
              product={product}
              uploadingBanner={uploadingBanner}
              handleBannerUpload={handleBannerUpload}
            />
            <ProductGalleryCard
              product={product}
              setProduct={setProduct}
              uploadingGallery={uploadingGallery}
              handleGalleryUpload={handleGalleryUpload}
              removeGalleryImage={removeGalleryImage}
            />
            <FaqCard
              faq={product.faq || []}
              addFaqItem={addFaqItem}
              updateFaqItem={updateFaqItem}
              removeFaqItem={removeFaqItem}
            />

            {/* ── ADMIN REVIEW CARD ── */}
            <AdminReviewCard
              review={review}
              loading={reviewLoading}
              error={reviewError}
              success={reviewSuccess}
              handleChange={handleReviewChange}
              handleRatingChange={handleRatingChange}
              onSubmit={handleAdminSubmit}
              isEditing={isEditing}
            />
          </div>
        </div>
      </main>

      {/* ── MOBILE SAVE ── */}
      <MobileStickySaveButton
        handleSubmit={handleSubmit}
        isBusy={isBusy}
        isEditing={isEditing}
        loading={loading}
        success={success}
      />
    </div>
  );
};

/* ─────────────────────────────
   EXISTING REVIEWS CARD (Inline Component)
───────────────────────────── */
/* ─────────────────────────────
   EXISTING REVIEWS CARD (Inline Component)
───────────────────────────── */
const ExistingReviewsCard = ({ productId, reviews, loading, totalCount }) => {
  // Helper to format Firestore timestamps for customer reviews
  const formatReviewDate = (r) => {
    if (r.date) return r.date; // Admin custom date
    if (r.createdAt?.toDate) {
      // Convert Firestore timestamp to readable string
      return r.createdAt.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "Recently added";
  };

  return (
    <div className="bg-white border border-[#e0e0e0] rounded-sm p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-[#878787]" />
          <h2 className="text-[16px] font-semibold text-[#212121]">
            Customer Reviews
          </h2>
          {!loading && (
            <span className="bg-[#f1f3f6] text-[#878787] text-[12px] px-2 py-0.5 rounded-full font-medium">
              {totalCount}
            </span>
          )}
        </div>
        {totalCount > 4 && (
          <Link
            to={`/products/reviews/${productId}`}
            className="text-[13px] text-[#2874F0] font-medium hover:underline">
            Manage All
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[#878787] text-[13px] py-4">
          <Loader2 className="w-4 h-4 animate-spin" /> Fetching reviews...
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-[13px] text-[#878787] py-2">
          No reviews for this product yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="border border-[#e0e0e0] rounded-sm p-3 bg-[#fafafa]">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-[13px] font-semibold text-[#212121]">
                    {r.name}
                  </h4>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        className={
                          s <= r.rating
                            ? "fill-[#2874F0] text-[#2874F0]"
                            : "fill-gray-200 text-gray-200"
                        }
                      />
                    ))}
                  </div>
                </div>
                <span className="text-[11px] text-[#878787]">
                  {formatReviewDate(r)}
                </span>
              </div>

              {r.title && (
                <p className="text-[12px] font-semibold text-[#212121] mb-1">
                  {r.title}
                </p>
              )}

              <p className="text-[12px] text-[#555] line-clamp-3 mb-2">
                {r.comment}
              </p>

              {/* Render the image if the review has one */}
              {r.imageUrl && (
                <div className="mt-2 w-16 h-16 rounded-sm overflow-hidden border border-[#ddd]">
                  <img
                    src={r.imageUrl}
                    alt="Review attachment"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* NEW: "Check more reviews" link at the bottom */}
      {totalCount > 4 && (
        <div className="mt-4 pt-3 border-t border-[#f0f0f0] text-center">
          <Link
            to={`/products/reviews/${productId}`}
            className="text-[13px] font-medium text-[#2874F0] hover:text-[#1d5ed8] hover:underline">
            Check all {totalCount} reviews →
          </Link>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────
   FAQ CARD
───────────────────────────── */
const FaqCard = ({ faq, addFaqItem, updateFaqItem, removeFaqItem }) => (
  <div className="bg-white border border-[#e0e0e0] rounded-sm p-4 space-y-3">
    <div className="flex items-center justify-between">
      <h2 className="text-[14px] font-semibold text-[#212121]">FAQ</h2>
      <button
        type="button"
        onClick={addFaqItem}
        className="text-[12px] text-[#2874F0] font-medium hover:underline">
        + Add question
      </button>
    </div>
    {faq.length === 0 && (
      <p className="text-[13px] text-[#878787]">
        No FAQ items yet. Add questions customers often ask about this product.
      </p>
    )}
    {faq.map((item, i) => (
      <div key={i} className="space-y-1.5 border-t border-[#f0f0f0] pt-3">
        <div className="flex items-start gap-2">
          <input
            type="text"
            value={item.question}
            onChange={(e) => updateFaqItem(i, "question", e.target.value)}
            placeholder="Question"
            className="flex-1 border border-[#ddd] px-3 py-1.5 text-[13px] rounded-sm focus:outline-none focus:border-[#2874F0]"
          />
          <button
            type="button"
            onClick={() => removeFaqItem(i)}
            aria-label="Remove FAQ item"
            className="p-1.5 text-[#bbb] hover:text-[#c62828] transition-colors">
            <X size={15} />
          </button>
        </div>
        <textarea
          value={item.answer}
          onChange={(e) => updateFaqItem(i, "answer", e.target.value)}
          placeholder="Answer"
          rows={2}
          className="w-full border border-[#ddd] px-3 py-1.5 text-[13px] rounded-sm focus:outline-none focus:border-[#2874F0] resize-none"
        />
      </div>
    ))}
  </div>
);

export default ProductCreatePage;
