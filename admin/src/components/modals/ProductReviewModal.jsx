import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Loader2,
  ShieldCheck,
  Star,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import {
  getReviewSource,
  productService,
} from "../../services/firebase/product/productService";
import { uploadImageToCloudinary } from "../../services/cloudinary/uploadImage";

const buildInitialForm = (initialReview, defaultProductId) => {
  if (initialReview) {
    return {
      productId: initialReview.productId || defaultProductId || "",
      rating: Number(initialReview.rating) || 5,
      name: initialReview.name || "",
      title: initialReview.title || "",
      comment: initialReview.comment || "",
      date: initialReview.date || "",
      reply: initialReview.reply || "",
      imageUrl: initialReview.imageUrl || "",
      verified: Boolean(initialReview.verified),
      isApproved: initialReview.isApproved !== false,
    };
  }
  return {
    productId: defaultProductId || "",
    rating: 5,
    name: "",
    title: "",
    comment: "",
    date: new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    reply: "",
    imageUrl: "",
    verified: true,
    isApproved: true,
  };
};

const ProductReviewModal = ({
  isOpen,
  onClose,
  initialReview = null,
  products = [],
  fixedProductId = null,
  onSaved,
}) => {
  const isEditing = Boolean(initialReview?.id);
  const authorSource = isEditing ? getReviewSource(initialReview) : "admin";
  const resolvedProductId =
    fixedProductId || initialReview?.productId || products[0]?.id || "";

  const [form, setForm] = useState(() =>
    buildInitialForm(initialReview, resolvedProductId),
  );
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setForm(buildInitialForm(initialReview, resolvedProductId));
      setImageFile(null);
      setError("");
    }
  }, [isOpen, initialReview, resolvedProductId]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, saving, onClose]);

  if (!isOpen) return null;

  const handleField = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Review photo must be under 5 MB.");
      return;
    }
    setImageFile(file);
    setError("");
  };

  const uploadOptionalPhoto = async () => {
    if (!imageFile) return form.imageUrl.trim();
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Cloudinary environment variables are missing. Paste an image URL instead.",
      );
    }
    const ext = imageFile.name.split(".").pop() || "jpg";
    const renamed = new File(
      [imageFile],
      `review_${Date.now()}.${ext}`,
      { type: imageFile.type },
    );
    const result = await uploadImageToCloudinary(renamed, cloudName, uploadPreset);
    return result.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const targetProductId = fixedProductId || form.productId;
    if (!targetProductId) {
      setError("Please select a product for this review.");
      return;
    }
    if (!form.rating || form.rating < 1 || form.rating > 5) {
      setError("Please select a rating between 1 and 5 stars.");
      return;
    }
    if (!form.name.trim()) {
      setError("Please enter the reviewer's name.");
      return;
    }
    if (!form.comment.trim()) {
      setError("Please write the review comment.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const finalImageUrl = await uploadOptionalPhoto();
      const payload = {
        rating: Number(form.rating),
        name: form.name.trim(),
        title: form.title.trim(),
        comment: form.comment.trim(),
        date: form.date.trim(),
        reply: form.reply.trim(),
        imageUrl: finalImageUrl,
        verified: Boolean(form.verified),
        isApproved: Boolean(form.isApproved),
      };

      let saved;
      if (isEditing) {
        saved = await productService.updateReview(
          targetProductId,
          initialReview.id,
          payload,
        );
      } else {
        saved = await productService.addReview(targetProductId, payload);
      }

      if (onSaved) onSaved(saved, isEditing ? "edit" : "create", targetProductId);
      onClose();
    } catch (err) {
      setError(err.message || "Could not save review. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[130] bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={() => !saving && onClose()}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white border border-[#e3e3e3] rounded-xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#2874F0] text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <h2 className="text-sm font-bold truncate">
              {isEditing ? "Edit Product Review" : "Add Product Review"}
            </h2>
            {authorSource === "user" ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#1c5fba] shrink-0">
                <User size={10} />
                User Made
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFE500] text-[#212121] shrink-0">
                <ShieldCheck size={10} />
                Admin Made
              </span>
            )}
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/15 text-white/90 hover:text-white transition cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Attribution Banner */}
          {isEditing && authorSource === "user" ? (
            <div className="rounded-lg border border-[#bfd7ff] bg-[#eaf2ff] px-3 py-2 text-[11px] text-[#1c5fba] leading-relaxed">
              <p className="font-bold">Customer-Submitted Review</p>
              <p className="text-[#304a78]">
                Any changes you save (stars, reviewer name, comment, verification, visibility, or store reply) update immediately while keeping{" "}
                <span className="font-semibold">User Made</span> attribution
                {initialReview?.userId ? ` (UID: ${initialReview.userId})` : ""}.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-[#f5d000] bg-[#FFF8D6] px-3 py-2 text-[11px] text-[#594400]">
              {isEditing
                ? "Editing an Admin-created review. Changes reflect immediately on the storefront."
                : "New reviews added here are labeled Admin Made in the dashboard and appear publicly if Visible is enabled."}
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700 font-medium">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Product Selector (when creating from All Products or showing context) */}
          {!fixedProductId && products.length > 0 && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#616161] mb-1">
                Product *
              </label>
              <select
                name="productId"
                value={form.productId}
                onChange={handleField}
                disabled={isEditing}
                className="w-full px-3 py-2 text-xs font-medium text-[#212121] bg-white border border-[#d1d5db] rounded-lg focus:outline-none focus:border-[#2874F0] disabled:bg-[#f7f7f7] disabled:text-[#616161]">
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Rating & Display Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-end">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#616161] mb-1.5">
                Star Rating *
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = star <= form.rating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, rating: star }))
                      }
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                        active
                          ? "bg-[#FFF8D6] border-[#f5d000] text-[#b45309]"
                          : "bg-white border-[#d1d5db] text-[#9ca3af] hover:border-[#2874F0]"
                      }`}
                      title={`${star} Star${star > 1 ? "s" : ""}`}>
                      <Star
                        size={15}
                        className={
                          active
                            ? "fill-[#FFE500] text-[#d97706]"
                            : "text-[#9ca3af]"
                        }
                      />
                    </button>
                  );
                })}
                <span className="ml-1.5 text-xs font-bold text-[#2874F0]">
                  {form.rating}/5
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#616161] mb-1">
                Display Date
              </label>
              <input
                type="text"
                name="date"
                value={form.date}
                onChange={handleField}
                placeholder="e.g. Nov 12, 2026"
                className="w-full px-3 py-2 text-xs text-[#212121] border border-[#d1d5db] rounded-lg focus:outline-none focus:border-[#2874F0]"
              />
            </div>
          </div>

          {/* Reviewer Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#616161] mb-1">
                Reviewer Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleField}
                placeholder="e.g. Priya Rawat"
                className="w-full px-3 py-2 text-xs text-[#212121] border border-[#d1d5db] rounded-lg focus:outline-none focus:border-[#2874F0]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#616161] mb-1">
                Review Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleField}
                placeholder="e.g. Pure Pahadi Taste!"
                className="w-full px-3 py-2 text-xs text-[#212121] border border-[#d1d5db] rounded-lg focus:outline-none focus:border-[#2874F0]"
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#616161] mb-1">
              Review Comment *
            </label>
            <textarea
              name="comment"
              rows={3}
              value={form.comment}
              onChange={handleField}
              placeholder="Write or edit the customer feedback..."
              className="w-full px-3 py-2 text-xs text-[#212121] border border-[#d1d5db] rounded-lg focus:outline-none focus:border-[#2874F0] resize-y"
            />
          </div>

          {/* Store Owner Reply */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#616161] mb-1">
              Store Reply (Ghar Ka Organic)
            </label>
            <textarea
              name="reply"
              rows={2}
              value={form.reply}
              onChange={handleField}
              placeholder="Optional public reply shown beneath this review..."
              className="w-full px-3 py-2 text-xs text-[#212121] border border-[#d1d5db] rounded-lg focus:outline-none focus:border-[#2874F0] resize-y bg-[#fafafa]"
            />
          </div>

          {/* Optional Image Upload or URL */}
          <div className="rounded-lg border border-[#e3e3e3] bg-[#fafafa] p-3 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#616161]">
                Review Photo (Optional)
              </label>
              <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white border border-[#d1d5db] text-[#303030] hover:border-[#2874F0] hover:text-[#2874F0] cursor-pointer transition">
                <Upload size={12} />
                {imageFile ? "Change Photo" : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagePick}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleField}
                placeholder="https://... or upload above"
                className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-[#d1d5db] rounded-md focus:outline-none focus:border-[#2874F0]"
              />
              {(form.imageUrl || imageFile) && (
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setForm((prev) => ({ ...prev, imageUrl: "" }));
                  }}
                  title="Remove photo"
                  className="p-1.5 rounded-md border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
            {(imageFile || form.imageUrl) && (
              <div className="flex items-center gap-2 text-[11px] text-[#616161]">
                {imageFile ? (
                  <span className="font-medium text-[#2874F0]">
                    Selected: {imageFile.name}
                  </span>
                ) : (
                  <img
                    src={form.imageUrl}
                    alt="Review preview"
                    className="w-12 h-12 rounded-md object-cover border border-[#e3e3e3] bg-white"
                  />
                )}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-2.5 rounded-lg border border-[#e3e3e3] px-3 py-2.5 cursor-pointer hover:bg-[#fafafa]">
              <input
                type="checkbox"
                name="verified"
                checked={form.verified}
                onChange={handleField}
                className="w-4 h-4 accent-[#2874F0] rounded"
              />
              <div>
                <p className="text-xs font-semibold text-[#212121]">
                  Verified Buyer
                </p>
                <p className="text-[10px] text-[#616161]">
                  Show verified purchase badge
                </p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 rounded-lg border border-[#e3e3e3] px-3 py-2.5 cursor-pointer hover:bg-[#fafafa]">
              <input
                type="checkbox"
                name="isApproved"
                checked={form.isApproved}
                onChange={handleField}
                className="w-4 h-4 accent-[#2874F0] rounded"
              />
              <div>
                <p className="text-xs font-semibold text-[#212121]">
                  Approved & Visible
                </p>
                <p className="text-[10px] text-[#616161]">
                  Display on public product page
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#ebebeb]">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#616161] bg-[#f1f2f4] hover:bg-[#e5e7eb] rounded-lg transition cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#2874F0] hover:bg-[#1c5fba] rounded-lg shadow-xs transition disabled:opacity-60 cursor-pointer">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Publish Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductReviewModal;
