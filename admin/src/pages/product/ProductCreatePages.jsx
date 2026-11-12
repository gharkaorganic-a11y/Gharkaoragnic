/**
 * ProductCreatePage.jsx
 * Admin page for creating and editing organic e-commerce products.
 */

import React, { useMemo, useEffect, useState, useCallback } from "react";
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
  Edit2,
  Eye,
  EyeOff,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";

import { CATEGORIES } from "../../constants/categories";
import { COLLECTIONS } from "../../constants/collections";

import { useProductForm } from "../../components/productManage/hook/useProductForm";

import ProductInfoCard from "../../components/productManage/createProduct/productForm/ProductInfoCard";
import PriceInventoryCard from "../../components/productManage/createProduct/productForm/PriceInventoryCard";
import SizesCard from "../../components/productManage/createProduct/productForm/SizesCard";
import ProductImageCard from "../../components/productManage/createProduct/productForm/ProductImageCard";
import ProductGalleryCard from "../../components/productManage/createProduct/productForm/ProductGalleryCard";
import ProductDetailsImageCard from "../../components/productManage/createProduct/productForm/ProductDetailsImageCard";
import ProductOrganizationCard from "../../components/productManage/createProduct/productForm/ProductOrganizationCard";
import ProductStatusCard from "../../components/productManage/createProduct/productForm/ProductStatusCard";
import MobileStickySaveButton from "../../components/productManage/createProduct/ui/MobileStickySaveButton";
import { useReviewForm } from "../../components/productManage/hook/useReviewForm";
import AdminReviewCard from "../../components/productManage/createProduct/productForm/AdminReviewCard";
import ProductReviewModal from "../../components/modals/ProductReviewModal";
import ReviewAuthorBadges from "../../components/productManage/ReviewAuthorBadges";

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
    uploadingDetailsImage,
    imageErrors,

    handleChange,
    handleSubmit,

    handleBannerUpload,
    handleGalleryUpload,
    handleDetailsImageUpload,
    removeBannerImage,
    removeGalleryImage,
    removeDetailsImage,

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

  const [newCollection, setNewCollection] = useState("");
  const [existingReviews, setExistingReviews] = useState([]);
  const [fetchingReviews, setFetchingReviews] = useState(false);
  const [totalReviewsCount, setTotalReviewsCount] = useState(0);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editingReviewItem, setEditingReviewItem] = useState(null);

  const reloadExistingReviews = useCallback(async () => {
    if (!isEditing || !product?.id) return;
    try {
      setFetchingReviews(true);
      const res = await productService.getProductReviews(product.id, {
        pageSize: 6,
        approvedOnly: false,
      });
      setExistingReviews(res.reviews.slice(0, 6));
      setTotalReviewsCount(res.totalCount ?? res.reviews.length);
    } catch (err) {
      console.error("Failed to fetch existing reviews:", err);
    } finally {
      setFetchingReviews(false);
    }
  }, [isEditing, product?.id]);

  // Fetch up to 6 reviews when the component mounts (if editing)
  useEffect(() => {
    let isMounted = true; // <-- Safety flag

    const fetchReviews = async () => {
      if (isEditing && product?.id) {
        try {
          setFetchingReviews(true);

          const res = await productService.getProductReviews(product.id, {
            pageSize: 6,
            approvedOnly: false,
          });

          if (isMounted) {
            setExistingReviews(res.reviews.slice(0, 6));
            setTotalReviewsCount(res.totalCount ?? res.reviews.length);
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

    return () => {
      isMounted = false;
    };
  }, [isEditing, product?.id, reviewSuccess]);

  const handleDeleteInlineReview = async (rev) => {
    if (!product?.id || !rev?.id) return;
    if (!window.confirm(`Delete review by ${rev.name || "Customer"}?`)) return;
    try {
      await productService.deleteReview(product.id, rev.id);
      await reloadExistingReviews();
    } catch (err) {
      console.error("Delete review error:", err);
    }
  };

  const handleToggleInlineReviewVisibility = async (rev) => {
    if (!product?.id || !rev?.id) return;
    try {
      await productService.approveReview(
        product.id,
        rev.id,
        rev.isApproved === false,
      );
      await reloadExistingReviews();
    } catch (err) {
      console.error("Toggle review visibility error:", err);
    }
  };

  /* ─────────────────────────────
     DERIVED
  ───────────────────────────── */
  const isBusy = useMemo(
    () =>
      loading || uploadingBanner || uploadingGallery || uploadingDetailsImage,
    [loading, uploadingBanner, uploadingGallery, uploadingDetailsImage],
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
    <div className="min-h-screen bg-[#f1f2f4] font-sans text-[#303030] pb-24">
      {/* ── STICKY HEADER ── */}
      <header className="bg-white border-b border-[#e3e3e3] sticky top-14 z-30 shadow-2xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Back + title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/products")}
              aria-label="Go back to products"
              className="p-2 rounded-lg hover:bg-[#f1f2f4] text-[#616161] hover:text-[#212121] transition-colors">
              <ArrowLeft size={19} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-[#212121]">
                  {isEditing ? "Edit Product Listing" : "Add New Product"}
                </h1>
                <span className="px-2 py-0.5 rounded bg-[#FFE500] text-[#212121] text-[10px] font-bold uppercase">
                  {isEditing ? "Edit" : "New"}
                </span>
              </div>
              <p className="text-[#616161] text-xs hidden sm:block mt-0.5">
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
            className="hidden sm:flex items-center justify-center gap-2 bg-[#2874F0] text-white px-6 py-2 rounded-lg font-semibold text-xs sm:text-sm shadow-xs hover:bg-[#1c5fba] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
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
                onAddReview={() => {
                  setEditingReviewItem(null);
                  setReviewModalOpen(true);
                }}
                onEditReview={(rev) => {
                  setEditingReviewItem({ ...rev, productId: product.id });
                  setReviewModalOpen(true);
                }}
                onToggleVisibility={handleToggleInlineReviewVisibility}
                onDeleteReview={handleDeleteInlineReview}
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
              newCollection={newCollection}
              setNewCollection={setNewCollection}
              FolderTree={Tag}
            />
            <ProductImageCard
              product={product}
              uploadingBanner={uploadingBanner}
              handleBannerUpload={handleBannerUpload}
              removeBannerImage={removeBannerImage}
              uploadError={imageErrors?.banner}
            />
            <ProductGalleryCard
              product={product}
              setProduct={setProduct}
              uploadingGallery={uploadingGallery}
              handleGalleryUpload={handleGalleryUpload}
              removeGalleryImage={removeGalleryImage}
              uploadError={imageErrors?.gallery}
            />
            <ProductDetailsImageCard
              product={product}
              uploadingDetailsImage={uploadingDetailsImage}
              handleDetailsImageUpload={handleDetailsImageUpload}
              removeDetailsImage={removeDetailsImage}
              uploadError={imageErrors?.details}
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

      {isEditing && product?.id && (
        <ProductReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setEditingReviewItem(null);
          }}
          initialReview={editingReviewItem}
          fixedProductId={product.id}
          onSaved={reloadExistingReviews}
        />
      )}
    </div>
  );
};

/* ─────────────────────────────
   EXISTING REVIEWS CARD (Inline Component)
───────────────────────────── */
const ExistingReviewsCard = ({
  productId,
  reviews,
  loading,
  totalCount,
  onAddReview,
  onEditReview,
  onToggleVisibility,
  onDeleteReview,
}) => {
  // Helper to format Firestore timestamps for customer reviews
  const formatReviewDate = (r) => {
    if (r.date) return r.date; // Admin custom date
    if (r.createdAt?.toDate) {
      // Convert Firestore timestamp to readable string
      return r.createdAt.toDate().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return "Recently added";
  };

  return (
    <div className="bg-white border border-[#e3e3e3] rounded-xl p-5 space-y-4 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ebebeb] pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={17} className="text-[#2874F0]" />
          <h2 className="text-sm font-bold text-[#212121]">
            Product Reviews (User &amp; Admin)
          </h2>
          {!loading && (
            <span className="bg-[#FFF8D6] text-[#594400] border border-[#FFE500] text-[11px] px-2 py-0.5 rounded-full font-bold">
              {totalCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddReview}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2874F0] hover:bg-[#1c5fba] text-white text-xs font-semibold transition cursor-pointer">
            <Plus size={13} />
            Add Review
          </button>
          <Link
            to={`/products/reviews/${productId}`}
            className="text-xs text-[#2874F0] font-semibold hover:underline">
            Manage All
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[#616161] text-xs py-4">
          <Loader2 className="w-4 h-4 animate-spin text-[#2874F0]" /> Fetching reviews...
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-xs text-[#616161] py-2">
          No reviews for this product yet. Add an admin review or wait for customer reviews.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {reviews.map((r) => {
            const isApproved = r.isApproved !== false;
            return (
              <div
                key={r.id}
                className={`border rounded-xl p-3.5 space-y-2 transition ${
                  isApproved
                    ? "border-[#e3e3e3] bg-[#fafafa]"
                    : "border-rose-200 bg-rose-50/40"
                }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h4 className="text-xs font-bold text-[#212121] truncate">
                        {r.name}
                      </h4>
                      <span className="text-[10px] text-[#616161]">
                        • {formatReviewDate(r)}
                      </span>
                    </div>
                    <ReviewAuthorBadges review={r} compact />
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onEditReview(r)}
                      title="Edit review"
                      className="p-1.5 rounded-md text-[#2874F0] hover:bg-[#eaf2ff] transition cursor-pointer">
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleVisibility(r)}
                      title={isApproved ? "Hide review" : "Approve review"}
                      className="p-1.5 rounded-md text-[#616161] hover:bg-white transition cursor-pointer">
                      {isApproved ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteReview(r)}
                      title="Delete review"
                      className="p-1.5 rounded-md text-rose-600 hover:bg-rose-50 transition cursor-pointer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={11}
                      className={
                        s <= r.rating
                          ? "fill-[#FFE500] text-[#d97706]"
                          : "fill-gray-200 text-gray-200"
                      }
                    />
                  ))}
                </div>

                {r.title && (
                  <p className="text-xs font-semibold text-[#212121]">
                    {r.title}
                  </p>
                )}

                <p className="text-xs text-[#4b5563] line-clamp-3">
                  {r.comment}
                </p>

                {r.reply && (
                  <p className="text-[11px] text-[#2874F0] bg-[#eaf2ff] px-2 py-1 rounded-md line-clamp-2">
                    <span className="font-bold">Store Reply:</span> {r.reply}
                  </p>
                )}

                {r.imageUrl && (
                  <div className="mt-1.5 w-14 h-14 rounded-lg overflow-hidden border border-[#e3e3e3] bg-white">
                    <img
                      src={r.imageUrl}
                      alt="Review attachment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {totalCount > 0 && (
        <div className="pt-2 border-t border-[#ebebeb] text-center">
          <Link
            to={`/products/reviews/${productId}`}
            className="text-xs font-semibold text-[#2874F0] hover:text-[#1c5fba] hover:underline">
            Open full reviews manager ({totalCount}) →
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
