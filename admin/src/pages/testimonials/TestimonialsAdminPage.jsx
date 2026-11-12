import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Star,
  MessageCircle,
  Loader2,
  AlertCircle,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import { testimonialService } from "../../services/firebase/testimonial/testimonialService";
import TestimonialModal from "../../components/testimonials/TestimonialModal";

const EMPTY_FORM = { name: "", img: "", message: "", rating: 5 };

const TestimonialsAdminPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Toast handler
  const showToast = useCallback((type, msg) => {
    clearTimeout(toastTimer.current);
    setToast({ type, msg });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  // Load testimonials
  const loadTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const data = await testimonialService.getAll();
      setTestimonials(data);
    } catch (err) {
      showToast("error", err.message || "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  // Form handlers
  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };
  const openEdit = (t) => {
    setFormData({
      name: t.name || "",
      img: t.img || "",
      message: t.message || "",
      rating: t.rating || 5,
    });
    setEditingId(t.id);
    setShowForm(true);
  };
  const closeForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };
  const handleFieldChange = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    const name = formData.name.trim();
    const message = formData.message.trim();
    const img = formData.img.trim();
    const rating = Number(formData.rating);

    if (!name || !message) {
      showToast("error", "Customer name and review message are required.");
      return;
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      showToast("error", "Choose a rating between 1 and 5 stars.");
      return;
    }
    if (img) {
      try {
        if (new URL(img).protocol !== "https:") {
          throw new Error("The customer photo URL must use HTTPS.");
        }
      } catch {
        showToast("error", "Enter a valid HTTPS customer photo URL.");
        return;
      }
    }

    const reviewData = { name, img, message, rating };
    setSaving(true);
    try {
      if (editingId) {
        await testimonialService.update(editingId, reviewData);
        showToast("success", "Review updated successfully!");
      } else {
        await testimonialService.create(reviewData);
        showToast("success", "New review added successfully!");
      }
      await loadTestimonials();
      closeForm();
    } catch (err) {
      showToast("error", err.message || "Failed to save review.");
    } finally {
      setSaving(false);
    }
  };

  // Toggle review visibility
  const handleToggle = async (t) => {
    if (toggling) return;
    setToggling(t.id);
    try {
      await testimonialService.update(t.id, { isActive: !t.isActive });
      showToast(
        "success",
        `Review is now ${!t.isActive ? "visible" : "hidden"}.`,
      );
      await loadTestimonials();
    } catch (err) {
      showToast("error", err.message || "Failed to toggle review.");
    } finally {
      setToggling(null);
    }
  };

  // Delete review
  const handleDelete = async (t) => {
    if (!window.confirm(`Delete review from ${t.name}?`)) return;
    try {
      await testimonialService.delete(t.id);
      showToast("success", "Review deleted.");
      await loadTestimonials();
    } catch (err) {
      showToast("error", err.message || "Failed to delete review.");
    }
  };

  const total = testimonials.length;
  const live = testimonials.filter((t) => t.isActive !== false).length;
  const avgRating = total
    ? (testimonials.reduce((s, t) => s + (t.rating || 5), 0) / total).toFixed(1)
    : "—";

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#f1f2f4] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2874F0]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f2f4] font-sans text-[#303030] pb-16">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-16 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold max-w-sm ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}>
          {toast.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span className="flex-1">{toast.msg}</span>
          <button
            onClick={() => setToast(null)}
            className="opacity-60 hover:opacity-100">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Modal Form */}
      <TestimonialModal
        isOpen={showForm}
        formData={formData}
        onChange={handleFieldChange}
        onSave={handleSave}
        onCancel={closeForm}
        saving={saving}
        isEdit={Boolean(editingId)}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 space-y-5">
        {/* Shopify-Style Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#212121] tracking-tight">
                Customer Reviews
              </h1>
              <span className="px-2 py-0.5 rounded bg-[#FFE500] text-[#212121] text-[10px] font-bold uppercase tracking-wider">
                Testimonials
              </span>
            </div>
            <p className="text-xs text-[#616161] mt-0.5">
              Manage the customer testimonials shown on your storefront.
            </p>
          </div>
          <button
            onClick={openAdd}
            className="self-start sm:self-auto flex items-center justify-center gap-1.5 bg-[#2874F0] hover:bg-[#1c5fba] text-white px-4 py-2 rounded-lg font-semibold shadow-2xs active:scale-95 transition-all text-xs cursor-pointer">
            <Plus size={15} /> Add New Review
          </button>
        </div>

        {/* Compact Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-[#e3e3e3] border-t-[3px] border-t-[#2874F0] rounded-xl p-4 flex items-center gap-3.5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#eaf2ff] text-[#2874F0]">
              <MessageCircle size={18} />
            </div>
            <div>
              <p className="text-[11px] text-[#616161] font-semibold uppercase tracking-wider">
                Total Reviews
              </p>
              <p className="text-xl font-bold text-[#212121] mt-0.5">
                {total}
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#e3e3e3] border-t-[3px] border-t-emerald-500 rounded-xl p-4 flex items-center gap-3.5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600">
              <UserCheck size={18} />
            </div>
            <div>
              <p className="text-[11px] text-[#616161] font-semibold uppercase tracking-wider">
                Visible on Store
              </p>
              <p className="text-xl font-bold text-emerald-700 mt-0.5">
                {live}
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#e3e3e3] border-t-[3px] border-t-[#FFE500] rounded-xl p-4 flex items-center gap-3.5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#FFF8D6] text-[#b27b00]">
              <Star size={18} />
            </div>
            <div>
              <p className="text-[11px] text-[#616161] font-semibold uppercase tracking-wider">
                Average Rating
              </p>
              <p className="text-xl font-bold text-[#212121] mt-0.5">
                {avgRating}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {testimonials.length === 0 ? (
            <p className="col-span-full rounded-xl border border-dashed border-[#d4d4d4] bg-white px-6 py-10 text-center text-xs text-[#616161]">
              No customer reviews yet. Add a review to publish it on your
              storefront.
            </p>
          ) : (
            testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-[#e3e3e3] hover:border-[#2874F0] rounded-xl shadow-[0_1px_0_rgba(0,0,0,0.03)] flex flex-col transition-colors">
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#e3e3e3] bg-[#f7f7f7] shrink-0">
                        <img
                          src={t.img || ""}
                          alt={t.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#212121]">
                          {t.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < (t.rating || 5)
                                  ? "text-[#e5a800] fill-[#FFE500]"
                                  : "text-gray-200 fill-gray-200"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#4a4a4a] leading-relaxed italic">
                    "{t.message}"
                  </p>
                </div>

                <div className="border-t border-[#ebebeb] bg-[#fafafa] px-4 py-2.5 flex items-center justify-between gap-2 rounded-b-xl">
                  <button
                    onClick={() => handleToggle(t)}
                    disabled={toggling === t.id}
                    className="flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer">
                    <div
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${t.isActive ? "bg-[#2874F0]" : "bg-gray-300"}`}>
                      {toggling === t.id ? (
                        <Loader2
                          size={10}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-spin"
                        />
                      ) : (
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${t.isActive ? "translate-x-4" : "translate-x-0.5"}`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${t.isActive ? "text-[#2874F0]" : "text-gray-500"}`}>
                      {t.isActive ? "Visible" : "Hidden"}
                    </span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(t)}
                      title="Edit Review"
                      className="p-1.5 text-[#616161] hover:text-[#2874F0] hover:bg-[#eaf2ff] rounded-md transition-colors cursor-pointer">
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(t)}
                      title="Delete Review"
                      className="p-1.5 text-[#616161] hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsAdminPage;
