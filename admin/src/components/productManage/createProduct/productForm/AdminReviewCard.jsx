import { Loader2, ShieldCheck, Star } from "lucide-react";

/* ─────────────────────────────
   ADMIN REVIEW CARD (Sidebar Quick-Add Component)
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
  if (!isEditing) {
    return (
      <div className="bg-white border border-[#e3e3e3] rounded-xl p-4 space-y-1.5 opacity-80 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xs font-bold text-[#212121] uppercase tracking-wider">
            Add Admin Review
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF8D6] text-[#594400] border border-[#FFE500]">
            Admin Made
          </span>
        </div>
        <p className="text-xs text-[#616161]">
          Save this product first before adding manual admin reviews.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e3e3e3] border-t-[3px] border-t-[#FFE500] rounded-xl p-4 space-y-3.5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-[#212121]">Quick Add Review</h2>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF8D6] text-[#594400] border border-[#FFE500]">
          <ShieldCheck size={10} />
          Admin Made
        </span>
      </div>

      {success && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-lg">
          Admin review added successfully!
        </div>
      )}
      {error && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {/* Rating Stars */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#616161] mb-1">
            Rating *
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = review.rating >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                    active
                      ? "bg-[#FFF8D6] border-[#f5d000] text-[#b45309]"
                      : "bg-white border-[#d1d5db] text-[#9ca3af] hover:border-[#2874F0]"
                  }`}>
                  <Star
                    size={13}
                    className={
                      active
                        ? "fill-[#FFE500] text-[#d97706]"
                        : "text-[#9ca3af]"
                    }
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#616161] mb-1">
            Reviewer Name *
          </label>
          <input
            type="text"
            name="name"
            value={review.name}
            onChange={handleChange}
            placeholder="e.g. Priya Rawat"
            className="w-full border border-[#d1d5db] px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-[#2874F0]"
          />
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#616161] mb-1">
            Review Title
          </label>
          <input
            type="text"
            name="title"
            value={review.title}
            onChange={handleChange}
            placeholder="e.g. Authentic Pahadi taste!"
            className="w-full border border-[#d1d5db] px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-[#2874F0]"
          />
        </div>

        {/* Comment Textarea */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#616161] mb-1">
            Comment *
          </label>
          <textarea
            name="comment"
            value={review.comment}
            onChange={handleChange}
            placeholder="Write the review..."
            rows={3}
            className="w-full border border-[#d1d5db] px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-[#2874F0] resize-none"
          />
        </div>

        {/* Store Owner Reply */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#616161] mb-1">
            Store Reply (Optional)
          </label>
          <textarea
            name="reply"
            value={review.reply || ""}
            onChange={handleChange}
            placeholder="Reply from Ghar Ka Organic..."
            rows={2}
            className="w-full border border-[#d1d5db] px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-[#2874F0] resize-none bg-[#fafafa]"
          />
        </div>

        {/* Date Override */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#616161] mb-1">
            Custom Date (Optional)
          </label>
          <input
            type="text"
            name="date"
            value={review.date}
            onChange={handleChange}
            placeholder="e.g. Nov 12, 2026"
            className="w-full border border-[#d1d5db] px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-[#2874F0]"
          />
        </div>

        {/* Toggles */}
        <div className="space-y-1.5 pt-1">
          <label className="flex items-center gap-2 text-xs text-[#212121] cursor-pointer">
            <input
              type="checkbox"
              name="verified"
              checked={review.verified}
              onChange={handleChange}
              className="w-4 h-4 accent-[#2874F0] rounded"
            />
            <span>Mark as Verified Buyer</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-[#212121] cursor-pointer">
            <input
              type="checkbox"
              name="isApproved"
              checked={review.isApproved !== false}
              onChange={handleChange}
              className="w-4 h-4 accent-[#2874F0] rounded"
            />
            <span>Visible on Storefront</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="w-full bg-[#2874F0] hover:bg-[#1c5fba] text-white font-bold py-2 rounded-lg text-xs transition-colors flex justify-center items-center gap-2 mt-1 cursor-pointer disabled:opacity-60">
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {loading ? "Saving Review..." : "Publish Admin Review"}
        </button>
      </div>
    </div>
  );
};

export default AdminReviewCard;
