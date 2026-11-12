import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ImageIcon,
  Loader2,
  RefreshCw,
  Trash2,
  UploadCloud,
} from "lucide-react";
import ConfirmImageRemoveModal from "../../../modals/ConfirmImageRemoveModal";

const ProductImageCard = ({
  uploadingBanner,
  product,
  handleBannerUpload,
  removeBannerImage,
  uploadError,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [brokenUrl, setBrokenUrl] = useState("");
  const imgFailed = Boolean(product.banner && brokenUrl === product.banner);

  return (
    <>
      <div className="bg-white border border-[#e3e3e3] rounded-xl shadow-[0_1px_0_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#ebebeb] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ImageIcon size={17} className="text-[#2874F0]" />
            <h2 className="text-sm font-bold text-[#212121]">
              Primary Image <span className="text-rose-500">*</span>
            </h2>
          </div>
          {product.banner && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF8D6] text-[#594400] border border-[#FFE500]">
              <CheckCircle2 size={10} />
              Uploaded
            </span>
          )}
        </div>

        <div className="p-4 space-y-3">
          {uploadError && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 font-medium">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}

          {product.banner ? (
            <div className="space-y-2.5">
              {/* Always-visible preview frame (clicking does NOT auto-delete or reopen picker) */}
              <div className="relative w-full aspect-square rounded-xl border border-[#e3e3e3] bg-[#fafafa] overflow-hidden flex items-center justify-center p-2">
                {imgFailed ? (
                  <div className="flex flex-col items-center text-center gap-2 p-4">
                    <AlertCircle size={22} className="text-amber-500" />
                    <p className="text-xs font-medium text-[#616161]">
                      Image preview could not load in browser.
                    </p>
                    <button
                      type="button"
                      onClick={() => setBrokenUrl("")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#2874F0] bg-[#eaf2ff] rounded-md cursor-pointer">
                      <RefreshCw size={12} />
                      Retry Preview
                    </button>
                  </div>
                ) : (
                  <img
                    src={product.banner}
                    onError={() => setBrokenUrl(product.banner)}
                    className="w-full h-full object-contain rounded-lg"
                    alt="Primary product preview"
                  />
                )}

                {uploadingBanner && (
                  <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 text-[#2874F0]">
                    <Loader2 className="w-7 h-7 animate-spin" />
                    <span className="text-xs font-semibold">
                      Uploading new image...
                    </span>
                  </div>
                )}
              </div>

              {/* Explicit Action Strip */}
              <div className="flex items-center gap-2">
                <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#eaf2ff] text-[#2874F0] hover:bg-[#dcebff] border border-[#bfd7ff] transition cursor-pointer">
                  <UploadCloud size={14} />
                  <span>{uploadingBanner ? "Uploading..." : "Change Image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerUpload}
                    disabled={uploadingBanner}
                  />
                </label>

                <a
                  href={product.banner}
                  target="_blank"
                  rel="noreferrer"
                  title="Open full image"
                  className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold bg-white text-[#303030] border border-[#e3e3e3] hover:bg-[#f1f2f4] transition">
                  <ExternalLink size={13} />
                </a>

                {removeBannerImage && (
                  <button
                    type="button"
                    disabled={uploadingBanner}
                    onClick={() => setConfirmOpen(true)}
                    title="Remove Primary Image"
                    className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition cursor-pointer disabled:opacity-50">
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <label className="relative flex flex-col items-center justify-center w-full aspect-square border border-dashed border-[#cbd5e1] rounded-xl cursor-pointer bg-[#fafafa] hover:border-[#2874F0] hover:bg-[#eaf2ff]/30 transition-all overflow-hidden">
              {uploadingBanner ? (
                <div className="flex flex-col items-center text-[#2874F0]">
                  <Loader2 className="w-8 h-8 animate-spin mb-3" />
                  <span className="text-xs font-semibold">
                    Uploading image...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center p-6">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-2xs border border-[#e3e3e3] mb-3">
                    <ImageIcon size={20} className="text-[#2874F0]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#212121]">
                    Add Primary Image
                  </span>
                  <span className="text-[11px] text-[#616161] mt-1 px-4">
                    Main product thumbnail. JPG, PNG, or WEBP recommended.
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerUpload}
                disabled={uploadingBanner}
              />
            </label>
          )}
        </div>
      </div>

      <ConfirmImageRemoveModal
        isOpen={confirmOpen}
        imageUrl={product.banner}
        title="Remove Primary Image?"
        description="Are you sure you want to remove this primary product image? You will need a primary image before saving."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          setBrokenUrl("");
          if (removeBannerImage) removeBannerImage();
        }}
      />
    </>
  );
};

export default ProductImageCard;
