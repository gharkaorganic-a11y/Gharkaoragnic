import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ImageIcon,
  Loader2,
  RefreshCw,
  Sparkles,
  Trash2,
  UploadCloud,
  Wand2,
} from "lucide-react";
import ConfirmImageRemoveModal from "../../../modals/ConfirmImageRemoveModal";
import InfographicPromptModal from "../../../modals/InfographicPromptModal";

const ProductDetailsImageCard = ({
  product,
  uploadingDetailsImage,
  handleDetailsImageUpload,
  removeDetailsImage,
  uploadError,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [brokenUrl, setBrokenUrl] = useState("");
  const imgFailed = Boolean(
    product.detailsImage && brokenUrl === product.detailsImage,
  );

  return (
    <>
      <div className="bg-white border border-[#e3e3e3] rounded-xl shadow-[0_1px_0_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#ebebeb] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={17} className="text-[#2874F0]" />
            <div>
              <h2 className="text-sm font-bold text-[#212121]">
                Product Details Image
              </h2>
              <p className="text-[11px] text-[#616161]">
                Full-width storytelling / infographic banner
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {product.detailsImage && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF8D6] text-[#594400] border border-[#FFE500]">
                <CheckCircle2 size={10} />
                Uploaded
              </span>
            )}
            <button
              type="button"
              onClick={() => setPromptModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#FFE500] hover:bg-[#ffeb3b] text-[#212121] border border-[#f0d500] shadow-2xs transition cursor-pointer">
              <Wand2 size={12} />
              AI Prompt
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* AI Infographic Prompt Callout */}
          <div className="rounded-xl border border-[#bfd7ff] bg-[#eaf2ff]/60 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1d4ed8]">
                Generate Infographic with ChatGPT or Gemini
              </p>
              <p className="text-[11px] text-[#303030] mt-0.5 leading-snug">
                Use this prompt with your product details in ChatGPT or Gemini to
                make your detailed product info image.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPromptModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#2874F0] hover:bg-[#1e63d6] text-white shadow-2xs transition cursor-pointer shrink-0">
              <Sparkles size={13} className="text-[#FFE500]" />
              Use AI Prompt
            </button>
          </div>

          {uploadError && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 font-medium">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}

          {product.detailsImage ? (
            <div className="space-y-2.5">
              <div className="relative rounded-xl overflow-hidden border border-[#e3e3e3] aspect-[16/9] bg-[#fafafa] flex items-center justify-center p-1.5">
                {imgFailed ? (
                  <div className="flex flex-col items-center gap-2 p-3 text-center">
                    <AlertCircle size={20} className="text-amber-500" />
                    <p className="text-xs text-[#616161]">
                      Banner preview failed to load.
                    </p>
                    <button
                      type="button"
                      onClick={() => setBrokenUrl("")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#eaf2ff] text-[#2874F0] cursor-pointer">
                      <RefreshCw size={12} />
                      Retry Preview
                    </button>
                  </div>
                ) : (
                  <img
                    src={product.detailsImage}
                    onError={() => setBrokenUrl(product.detailsImage)}
                    alt="Product Details Banner"
                    className="w-full h-full object-contain rounded-lg"
                  />
                )}

                {uploadingDetailsImage && (
                  <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 text-[#2874F0]">
                    <Loader2 className="w-7 h-7 animate-spin" />
                    <span className="text-xs font-semibold">
                      Uploading banner...
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#eaf2ff] text-[#2874F0] hover:bg-[#dcebff] border border-[#bfd7ff] transition cursor-pointer">
                  <UploadCloud size={14} />
                  <span>
                    {uploadingDetailsImage ? "Uploading..." : "Change Banner"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleDetailsImageUpload}
                    disabled={uploadingDetailsImage}
                  />
                </label>

                <a
                  href={product.detailsImage}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold bg-white text-[#303030] border border-[#e3e3e3] hover:bg-[#f1f2f4] transition">
                  <ExternalLink size={13} />
                  <span>Preview</span>
                </a>

                <button
                  type="button"
                  disabled={uploadingDetailsImage}
                  onClick={() => setConfirmOpen(true)}
                  className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition cursor-pointer disabled:opacity-50">
                  <Trash2 size={13} />
                  <span>Remove</span>
                </button>
              </div>

              <p className="text-[11px] text-[#616161]">
                Displayed full-width on the product details page with full-screen zoom.
              </p>
            </div>
          ) : (
            <label className="relative flex flex-col items-center justify-center w-full aspect-[16/9] border border-dashed border-[#cbd5e1] rounded-xl cursor-pointer bg-[#fafafa] hover:border-[#2874F0] hover:bg-[#eaf2ff]/30 transition-all overflow-hidden p-5 text-center">
              {uploadingDetailsImage ? (
                <div className="flex flex-col items-center text-[#2874F0]">
                  <Loader2 className="w-7 h-7 animate-spin mb-2" />
                  <span className="text-xs font-semibold">
                    Uploading storytelling banner...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-2xs border border-[#e3e3e3] mb-2.5">
                    <ImageIcon size={20} className="text-[#2874F0]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#212121]">
                    Upload Details Banner
                  </span>
                  <span className="text-[11px] text-[#616161] mt-1 max-w-xs leading-snug">
                    High-res banner, infographic, or harvest story (1600x900px recommended).
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleDetailsImageUpload}
                disabled={uploadingDetailsImage}
              />
            </label>
          )}
        </div>
      </div>

      <ConfirmImageRemoveModal
        isOpen={confirmOpen}
        imageUrl={product.detailsImage}
        title="Remove Product Details Banner?"
        description="Are you sure you want to remove this full-width product details image?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          setBrokenUrl("");
          if (removeDetailsImage) removeDetailsImage();
        }}
      />
      <InfographicPromptModal
        isOpen={promptModalOpen}
        onClose={() => setPromptModalOpen(false)}
        product={product}
      />
    </>
  );
};

export default ProductDetailsImageCard;
