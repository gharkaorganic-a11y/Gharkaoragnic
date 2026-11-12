import React, { useState } from "react";
import {
  AlertCircle,
  ExternalLink,
  ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import ConfirmImageRemoveModal from "../../../modals/ConfirmImageRemoveModal";

const ProductGalleryCard = ({
  product,
  setProduct,
  handleGalleryUpload,
  removeGalleryImage,
  uploadingGallery,
  uploadError,
}) => {
  const images = Array.isArray(product?.images) ? product.images : [];
  const [confirmTarget, setConfirmTarget] = useState(null); // { index, url }
  const [brokenUrls, setBrokenUrls] = useState({});

  const performDelete = (index) => {
    if (removeGalleryImage) {
      removeGalleryImage(index);
    } else if (setProduct) {
      setProduct((p) => ({
        ...p,
        images: (p.images || []).filter((_, i) => i !== index),
      }));
    }
  };

  return (
    <>
      <div className="bg-white border border-[#e3e3e3] rounded-xl shadow-[0_1px_0_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#ebebeb] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ImageIcon size={17} className="text-[#2874F0]" />
            <h2 className="text-sm font-bold text-[#212121]">Gallery Images</h2>
          </div>
          <span className="text-[11px] font-bold text-[#594400] bg-[#FFF8D6] border border-[#FFE500] px-2 py-0.5 rounded-full">
            {images.length} / 6
          </span>
        </div>

        <div className="p-4 space-y-3">
          {uploadError && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 font-medium">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2.5">
            {images.map((img, idx) => {
              const isBroken = Boolean(brokenUrls[img]);
              return (
                <div
                  key={`${img}_${idx}`}
                  className="flex flex-col rounded-xl overflow-hidden border border-[#e3e3e3] bg-[#fafafa]">
                  {/* Image frame (never auto-deletes on click) */}
                  <div className="relative aspect-square w-full bg-[#fafafa] flex items-center justify-center p-1">
                    {isBroken ? (
                      <button
                        type="button"
                        onClick={() =>
                          setBrokenUrls((prev) => ({ ...prev, [img]: false }))
                        }
                        className="flex flex-col items-center gap-1 text-[10px] text-[#2874F0] font-semibold p-2 text-center cursor-pointer">
                        <RefreshCw size={14} />
                        <span>Retry</span>
                      </button>
                    ) : (
                      <img
                        src={img}
                        onError={() =>
                          setBrokenUrls((prev) => ({ ...prev, [img]: true }))
                        }
                        className="w-full h-full object-contain rounded"
                        alt={`Product gallery ${idx + 1}`}
                      />
                    )}

                    {/* Index tag */}
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#212121]/75 text-white text-[9px] font-bold">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Dedicated Action Strip (Preview + Confirm Delete One-by-One) */}
                  <div className="flex items-center justify-between gap-1 px-1.5 py-1 bg-white border-t border-[#ebebeb]">
                    <a
                      href={img}
                      target="_blank"
                      rel="noreferrer"
                      title={`Preview image #${idx + 1}`}
                      className="p-1 rounded text-[#616161] hover:text-[#2874F0] hover:bg-[#eaf2ff] transition">
                      <ExternalLink size={12} />
                    </a>
                    <button
                      type="button"
                      onClick={() => setConfirmTarget({ index: idx, url: img })}
                      title={`Delete image #${idx + 1}`}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer">
                      <Trash2 size={11} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {images.length < 6 && (
              <label className="aspect-square rounded-xl border border-dashed border-[#cbd5e1] bg-[#fafafa] flex flex-col items-center justify-center cursor-pointer hover:border-[#2874F0] hover:bg-[#eaf2ff]/30 transition-colors text-[#616161]">
                {uploadingGallery ? (
                  <div className="flex flex-col items-center gap-1 text-[#2874F0]">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-[10px] font-semibold">
                      Uploading...
                    </span>
                  </div>
                ) : (
                  <>
                    <Plus size={20} className="mb-1 text-[#2874F0]" />
                    <span className="text-[11px] font-semibold text-[#303030]">
                      Add Image
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleGalleryUpload}
                  disabled={uploadingGallery}
                />
              </label>
            )}
          </div>

          <p className="text-[11px] text-[#616161]">
            Uploaded images stay saved here. Click <span className="font-semibold">Remove</span> on any image to delete it after confirmation.
          </p>
        </div>
      </div>

      <ConfirmImageRemoveModal
        isOpen={Boolean(confirmTarget)}
        imageUrl={confirmTarget?.url}
        title={
          confirmTarget
            ? `Remove Gallery Image #${confirmTarget.index + 1}?`
            : "Remove Gallery Image?"
        }
        description="Confirm if you want to remove this gallery image from this product listing."
        onCancel={() => setConfirmTarget(null)}
        onConfirm={() => {
          if (confirmTarget !== null) {
            performDelete(confirmTarget.index);
          }
          setConfirmTarget(null);
        }}
      />
    </>
  );
};

export default ProductGalleryCard;
