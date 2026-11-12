import React, { useEffect } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

const ConfirmImageRemoveModal = ({
  isOpen,
  imageUrl,
  title = "Remove Image?",
  description = "Are you sure you want to remove this uploaded image from this product?",
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onCancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white border border-[#e3e3e3] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-4 py-3 bg-[#2874F0] text-white flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#FFE500] text-[#212121] flex items-center justify-center">
              <AlertTriangle size={14} />
            </span>
            <h3 className="text-xs sm:text-sm font-bold">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close confirmation dialog"
            className="p-1 rounded-md hover:bg-white/15 text-white transition cursor-pointer">
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3.5">
          {imageUrl && (
            <div className="w-full h-36 rounded-lg border border-[#e3e3e3] bg-[#fafafa] overflow-hidden flex items-center justify-center p-2">
              <img
                src={imageUrl}
                alt="Image to remove"
                className="max-w-full max-h-full object-contain rounded"
              />
            </div>
          )}

          <p className="text-xs text-[#616161] leading-relaxed">{description}</p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#ebebeb]">
            <button
              type="button"
              onClick={onCancel}
              className="px-3.5 py-2 text-xs font-semibold text-[#303030] bg-[#f1f2f4] hover:bg-[#e5e7eb] rounded-lg transition cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition cursor-pointer">
              <Trash2 size={13} />
              Yes, Remove Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmImageRemoveModal;

