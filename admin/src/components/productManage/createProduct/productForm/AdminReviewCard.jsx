import { Loader2 } from "lucide-react";

/* ─────────────────────────────
   ADMIN REVIEW CARD (Sidebar Component)
───────────────────────────── */
const AdminReviewCard = ({
  review,
  loading,
  error,
  success,
  handleChange,
  handleRatingChange,
  onSubmit,
  isEditing,
}) => {
  // If creating a brand new product, tell the admin they must save it first.
  if (!isEditing) {
    return (
      <div className="bg-white border border-[#e0e0e0] rounded-sm p-4 space-y-2 opacity-70">
        <h2 className="text-[14px] font-semibold text-[#212121]">Add Review</h2>
        <p className="text-[13px] text-[#878787]">
          Save this product first before adding manual reviews.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e0e0e0] rounded-sm p-4 space-y-4">
      <h2 className="text-[14px] font-semibold text-[#212121]">
        Add Manual Review
      </h2>

      {/* Success/Error Alerts */}
      {success && (
        <div className="p-2 bg-[#f2f8f5] border border-[#388e3c] text-[#388e3c] text-[12px] font-medium rounded-sm">
          Review added successfully!
        </div>
      )}
      {error && (
        <div className="p-2 bg-[#ffebee] border border-[#ffcdd2] text-[#c62828] text-[12px] font-medium rounded-sm">
          {error}
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-3">
        {/* Rating Stars */}
        <div>
          <label className="block text-[12px] font-medium text-[#878787] mb-1">
            Rating *
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`w-6 h-6 rounded-sm border ${
                  review.rating >= star
                    ? "bg-[#2874F0] border-[#2874F0] text-white"
                    : "bg-white border-[#ddd] text-[#878787]"
                }`}>
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-[12px] font-medium text-[#878787] mb-1">
            Reviewer Name *
          </label>
          <input
            type="text"
            name="name"
            value={review.name}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            className="w-full border border-[#ddd] px-3 py-1.5 text-[13px] rounded-sm focus:outline-none focus:border-[#2874F0]"
          />
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-[12px] font-medium text-[#878787] mb-1">
            Review Title
          </label>
          <input
            type="text"
            name="title"
            value={review.title}
            onChange={handleChange}
            placeholder="e.g. Great Product!"
            className="w-full border border-[#ddd] px-3 py-1.5 text-[13px] rounded-sm focus:outline-none focus:border-[#2874F0]"
          />
        </div>

        {/* Comment Textarea */}
        <div>
          <label className="block text-[12px] font-medium text-[#878787] mb-1">
            Comment
          </label>
          <textarea
            name="comment"
            value={review.comment}
            onChange={handleChange}
            placeholder="Write the review..."
            rows={3}
            className="w-full border border-[#ddd] px-3 py-1.5 text-[13px] rounded-sm focus:outline-none focus:border-[#2874F0] resize-none"
          />
        </div>

        {/* Date Override */}
        <div>
          <label className="block text-[12px] font-medium text-[#878787] mb-1">
            Custom Date (Optional)
          </label>
          <input
            type="text"
            name="date"
            value={review.date}
            onChange={handleChange}
            placeholder="e.g. May 25, 2026"
            className="w-full border border-[#ddd] px-3 py-1.5 text-[13px] rounded-sm focus:outline-none focus:border-[#2874F0]"
          />
        </div>

        {/* Verified Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            name="verified"
            id="verified_check"
            checked={review.verified}
            onChange={handleChange}
            className="w-4 h-4 text-[#2874F0] rounded border-gray-300 focus:ring-[#2874F0]"
          />
          <label
            htmlFor="verified_check"
            className="text-[13px] text-[#212121] cursor-pointer">
            Mark as Verified Buyer
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="w-full bg-[#f1f3f6] hover:bg-[#e0e0e0] text-[#212121] font-medium py-2 rounded-sm text-[13px] transition-colors flex justify-center items-center gap-2 mt-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Saving Review..." : "Publish Review"}
        </button>
      </div>
    </div>
  );
};

export default AdminReviewCard;
