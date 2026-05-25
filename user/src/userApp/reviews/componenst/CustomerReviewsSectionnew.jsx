import React, { useMemo, useState, useEffect } from "react";
import { UserIcon, XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { Pin } from "lucide-react";

// Import your production hooks
import {
  useProductReviews,
  useProducts,
} from "../../features/product/hook/useProducts";

// ❌ COMMENTED OUT TO PREVENT BUILD ERROR
// import { useReviewForm } from "../../../../../admin/src/components/productManage/hook/useReviewForm";

// Custom Star icon matching the solid orange/yellow look
const StarIcon = ({
  className = "w-4 h-4",
  filled = true,
  onClick,
  cursor = "default",
}) => (
  <svg
    viewBox="0 0 24 24"
    onClick={onClick}
    className={`${className} ${
      filled ? "text-[#f99f24] fill-current" : "text-gray-200 fill-current"
    } ${cursor}`}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

/* ─────────────────────────────
    WRITE REVIEW MODAL COMPONENT
───────────────────────────── */
const ReviewModal = ({ isOpen, onClose, reviewForm }) => {
  const [hoverRating, setHoverRating] = useState(0);

  // ❌ COMMENTED OUT TO PREVENT ERRORS
  /*
  const {
    review,
    loading,
    error,
    handleChange,
    handleRatingChange,
    handleImageChange,
    removeImage,
    handleSubmit,
    reset,
  } = reviewForm;
  */

  // ❌ TEMP DUMMY VALUES
  const review = {
    rating: 0,
    name: "",
    title: "",
    comment: "",
    image: null,
  };

  const loading = false;
  const error = "";

  const handleChange = () => {};
  const handleRatingChange = () => {};
  const handleImageChange = () => {};
  const removeImage = () => {};
  const handleSubmit = () => {};
  const reset = () => {};

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-800">Write a Review</h3>

          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Overall Rating <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}>
                  <StarIcon
                    filled={star <= (hoverRating || review.rating)}
                    onClick={() => handleRatingChange(star)}
                    className="w-8 h-8 transition-transform hover:scale-110"
                    cursor="cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Your Name
            </label>

            <input
              type="text"
              name="name"
              value={review.name}
              onChange={handleChange}
              placeholder="How should we call you?"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f99f24] focus:border-[#f99f24] outline-none text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Review Title
            </label>

            <input
              type="text"
              name="title"
              value={review.title}
              onChange={handleChange}
              placeholder="Summary of your experience"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f99f24] focus:border-[#f99f24] outline-none text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Your Review <span className="text-red-500">*</span>
            </label>

            <textarea
              rows="4"
              name="comment"
              value={review.comment}
              onChange={handleChange}
              placeholder="What did you like or dislike?"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f99f24] focus:border-[#f99f24] outline-none text-sm resize-none transition-all"></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add a Photo (Optional)
            </label>

            <div className="flex items-center gap-4">
              <label className="cursor-pointer flex items-center justify-center w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                <PhotoIcon className="w-6 h-6 text-gray-400" />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {review.image && (
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-600 truncate max-w-[150px]">
                    {review.image.name}
                  </span>

                  <button
                    onClick={removeImage}
                    className="text-gray-400 hover:text-red-500">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-full transition-colors disabled:opacity-50">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 text-sm font-bold text-white bg-[#f99f24] hover:bg-orange-500 rounded-full shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2">
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────
    MAIN SECTION
───────────────────────────── */

export default function CustomerReviewsSectionNew({ productId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reviews fetch
  const { data: reviewsData, isLoading } = useProductReviews(productId, {
    pageSize: 100,
    approvedOnly: true,
  });

  // Invalidation logic
  const { invalidateReviews } = useProducts();

  // ❌ COMMENTED OUT TO FIX BUILD ERROR
  // const reviewForm = useReviewForm(productId);

  const reviews = useMemo(() => reviewsData?.reviews ?? [], [reviewsData]);

  // ❌ COMMENTED OUT TO FIX reviewForm undefined
  /*
  useEffect(() => {
    if (reviewForm.success) {
      invalidateReviews(productId);
      setIsModalOpen(false);
      reviewForm.reset();
    }
  }, [reviewForm.success, productId, invalidateReviews, reviewForm]);
  */

  return (
    <section
      id="reviews"
      className="mt-16 max-w-[1400px] mx-auto px-4 font-sans antialiased bg-gray-50/20 py-8">
      {/* HEADER */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col">
        {/* Tabs */}
        <div className="flex gap-8 px-8 border-b border-gray-100">
          <button className="py-4 text-[#f99f24] font-medium text-sm border-b-2 border-[#f99f24]">
            Reviews ({isLoading ? "..." : reviews.length})
          </button>

          <button className="py-4 text-gray-400 hover:text-gray-600 font-medium text-sm border-b-2 border-transparent">
            Questions (11)
          </button>
        </div>

        {/* Filter + Button */}
        <div className="flex items-center justify-between px-8 py-4">
          <div className="relative">
            <select className="text-sm text-[#f99f24] font-medium outline-none cursor-pointer bg-transparent border-none appearance-none pr-6">
              <option>Most Recent</option>
              <option>Highest Rated</option>
              <option>Lowest Rated</option>
            </select>

            <svg
              className="w-3 h-3 text-[#f99f24] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* ❌ DISABLED REVIEW BUTTON */}
          <button
            onClick={() => console.log("Review form disabled")}
            className="bg-[#f99f24] hover:bg-orange-500 transition-colors text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-sm whitespace-nowrap">
            Write a Review
          </button>
        </div>
      </div>

      {/* REVIEWS */}
      {isLoading ? (
        <div className="text-center text-gray-500 py-10 flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#f99f24] border-t-transparent rounded-full animate-spin"></div>
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white border border-gray-100 rounded-xl shadow-sm">
          No reviews yet. Be the first to write one!
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-gray-100 rounded-[14px] p-6 break-inside-avoid shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] flex flex-col">
              {/* Top */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-[2px]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon
                      key={s}
                      filled={s <= r.rating}
                      className="w-[15px] h-[15px]"
                    />
                  ))}
                </div>

                <span className="text-[11px] font-medium text-gray-400">
                  {r.date}
                </span>
              </div>

              {/* User */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 shrink-0 overflow-hidden relative">
                    {r.imageUrl ? (
                      <img
                        src={r.imageUrl}
                        alt={r.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-5 h-5 stroke-2" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-[14px] text-[#f99f24] capitalize">
                      {r.name || "Customer"}
                    </h4>

                    {(r.isVerified ?? true) && (
                      <span className="bg-[#f99f24] text-white font-semibold text-[10px] px-2 py-[2px] rounded-sm">
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {r.isPinned && (
                  <Pin className="w-4 h-4 text-[#f99f24] fill-[#f99f24] transform rotate-45 shrink-0" />
                )}
              </div>

              {/* Title */}
              {r.title && (
                <h5 className="font-bold text-gray-800 text-[14px] mb-2 leading-tight">
                  {r.title}
                </h5>
              )}

              {/* Comment */}
              <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-line mb-1">
                {r.comment}
              </p>

              {/* Reply */}
              {r.reply && (
                <div className="mt-4 bg-[#fcf9f2] rounded-lg p-4 text-sm text-gray-700 flex-1 border border-[#faecd4]">
                  <p className="text-gray-500 mb-3 text-[12px]">
                    &gt;&gt;
                    <span className="font-bold text-gray-800">
                      www.farmdidi.com
                    </span>
                    replied:
                  </p>

                  <div className="space-y-2 text-gray-600 leading-relaxed text-[13px] whitespace-pre-line">
                    {r.reply}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ❌ COMMENTED OUT MODAL */}
      {/*
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reviewForm={reviewForm}
      />
      */}
    </section>
  );
}
