import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  ImagePlus,
  Sparkles,
  X,
} from "lucide-react";
import {
  CHATGPT_URL,
  GEMINI_URL,
  buildProductInfographicPrompt,
} from "../../config/generateInfographicPrompt";

const InfographicPromptModal = ({ isOpen, onClose, product }) => {
  const [copiedAction, setCopiedAction] = useState("");
  const textareaRef = useRef(null);

  const fullPrompt = useMemo(
    () => buildProductInfographicPrompt(product),
    [product],
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyPromptToClipboard = async (actionKey = "copy") => {
    try {
      await navigator.clipboard.writeText(fullPrompt);
      setCopiedAction(actionKey);
    } catch {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
        document.execCommand("copy");
        setCopiedAction(actionKey);
      }
    }
    setTimeout(() => {
      setCopiedAction((prev) => (prev === actionKey ? "" : prev));
    }, 3000);
  };

  const handleOpenAssistant = async (targetUrl, actionKey) => {
    await copyPromptToClipboard(actionKey);
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  const prefilledFields = [
    { label: "Name", ready: Boolean(product?.name?.trim()) },
    {
      label: "Weight/Sizes",
      ready: Array.isArray(product?.sizes) && product.sizes.length > 0,
    },
    { label: "Ingredients", ready: Boolean(product?.ingredients?.trim()) },
    { label: "Benefits", ready: Boolean(product?.benefits?.trim()) },
    { label: "Usage", ready: Boolean(product?.usageInstructions?.trim()) },
    { label: "Shelf Life", ready: Boolean(product?.shelfLife?.trim()) },
  ];

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/55 backdrop-blur-[2px] p-3 sm:p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="infographic-prompt-title">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl border border-[#e3e3e3] shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#2874F0] text-white px-5 py-4 flex items-start justify-between gap-4 border-b border-[#1c5fba]">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFE500] text-[#212121] flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles size={18} />
            </div>
            <div>
              <h3
                id="infographic-prompt-title"
                className="text-sm sm:text-base font-bold tracking-tight">
                Generate Detailed Product Infographic Image (AI Prompt)
              </h3>
              <p className="text-xs text-blue-100 mt-0.5 leading-snug">
                Use this prompt with your product details in{" "}
                <strong className="text-white">ChatGPT</strong> or{" "}
                <strong className="text-white">Gemini</strong> — they will
                generate a ready-to-upload 2:3 cream (#FAF9F5) infographic.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close AI prompt modal"
            className="p-1.5 rounded-lg text-white/90 hover:bg-white/15 transition cursor-pointer shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#F1F3F6]">
          {/* Quick 3-step guide */}
          <div className="bg-white rounded-xl border border-[#e3e3e3] p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="rounded-lg bg-[#eaf2ff]/60 border border-[#bfd7ff] p-2.5">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2874F0] text-white text-[10px] font-bold mr-1.5">
                  1
                </span>
                <span className="font-bold text-[#212121]">Copy Prompt</span>
                <p className="text-[11px] text-[#616161] mt-1">
                  Auto-filled with your current product details below.
                </p>
              </div>

              <div className="rounded-lg bg-[#FFF8D6]/70 border border-[#FFE500] p-2.5">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#212121] text-[#FFE500] text-[10px] font-bold mr-1.5">
                  2
                </span>
                <span className="font-bold text-[#212121]">
                  Attach Photo &amp; Logo
                </span>
                <p className="text-[11px] text-[#616161] mt-1">
                  Upload product image + Ghar Ka logo in ChatGPT or Gemini.
                </p>
              </div>

              <div className="rounded-lg bg-emerald-50/70 border border-emerald-200 p-2.5">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold mr-1.5">
                  3
                </span>
                <span className="font-bold text-[#212121]">
                  Generate &amp; Upload
                </span>
                <p className="text-[11px] text-[#616161] mt-1">
                  Paste prompt, download PNG, and upload to Details Banner.
                </p>
              </div>
            </div>

            {/* Auto-fill status chips + Logo helper */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#ebebeb]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[#616161] mr-1">
                  Form info included:
                </span>
                {prefilledFields.map((field) => (
                  <span
                    key={field.label}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      field.ready
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-gray-50 text-gray-500 border-gray-200"
                    }`}>
                    {field.ready ? <Check size={10} /> : null}
                    {field.label}
                  </span>
                ))}
              </div>

              <a
                href="/logo/gharka-logo-full.png"
                download="gharka-logo-full.png"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-[#e3e3e3] text-[#2874F0] hover:bg-[#eaf2ff] transition">
                <Download size={12} />
                Download Brand Logo
              </a>
            </div>
          </div>

          {copiedAction && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-800 font-medium flex items-center gap-2">
              <Check size={15} className="shrink-0 text-emerald-600" />
              <span>
                {copiedAction === "copy"
                  ? "Full infographic prompt & product details copied to clipboard!"
                  : `Prompt copied! Upload your product photo + logo and paste (Ctrl+V) inside ${
                      copiedAction === "chatgpt" ? "ChatGPT" : "Gemini"
                    }.`}
              </span>
            </div>
          )}

          {/* Prompt Preview Box */}
          <div className="bg-white rounded-xl border border-[#e3e3e3] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[#ebebeb] flex items-center justify-between gap-2 bg-[#fafafa]">
              <span className="text-xs font-bold text-[#212121] flex items-center gap-1.5">
                <ImagePlus size={14} className="text-[#2874F0]" />
                Master Prompt + Product Information
              </span>
              <button
                type="button"
                onClick={() => copyPromptToClipboard("copy")}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#eaf2ff] text-[#2874F0] hover:bg-[#dcebff] transition cursor-pointer">
                {copiedAction === "copy" ? (
                  <>
                    <Check size={12} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy Prompt
                  </>
                )}
              </button>
            </div>

            <textarea
              ref={textareaRef}
              readOnly
              value={fullPrompt}
              rows={13}
              onClick={(e) => e.currentTarget.select()}
              className="w-full p-4 text-xs leading-relaxed font-mono text-[#29251F] bg-[#FAF9F5] outline-none resize-y"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-5 py-3.5 bg-white border-t border-[#ebebeb] flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#616161] hover:bg-[#f1f2f4] border border-[#e3e3e3] transition cursor-pointer">
            Close
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => copyPromptToClipboard("copy")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#eaf2ff] text-[#2874F0] hover:bg-[#dcebff] border border-[#bfd7ff] transition cursor-pointer">
              {copiedAction === "copy" ? (
                <>
                  <Check size={14} />
                  Copied Prompt
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy Prompt
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleOpenAssistant(CHATGPT_URL, "chatgpt")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#212121] text-white hover:bg-[#333333] transition cursor-pointer shadow-2xs">
              <Sparkles size={14} className="text-[#FFE500]" />
              Copy &amp; Open ChatGPT
              <ExternalLink size={12} />
            </button>

            <button
              type="button"
              onClick={() => handleOpenAssistant(GEMINI_URL, "gemini")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#2874F0] text-white hover:bg-[#1e63d6] transition cursor-pointer shadow-2xs">
              <Sparkles size={14} className="text-[#FFE500]" />
              Copy &amp; Open Gemini
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfographicPromptModal;
