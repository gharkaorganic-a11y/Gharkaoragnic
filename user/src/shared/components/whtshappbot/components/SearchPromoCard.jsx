import React, { useState } from "react";
import { useDark } from "../../context/DarkCtx";
import { Icon } from "./ResubleComponents";

const SearchPromoCard = ({ code, info = {}, onCopy }) => {
  const { dark } = useDark();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopy?.(code);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed");
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 max-w-[95%]
      ${dark ? "bg-[#1f2c34] border-[#2a3942]" : "bg-white border-gray-200"}`}>
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#25D366]/20 blur-3xl rounded-full" />
      </div>

      {/* TOP HEADER (Gradient like PromoCard) */}
      <div className="relative bg-gradient-to-r from-[#008069] via-[#0aa36c] to-[#25D366] px-5 py-4 overflow-hidden">
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full" />
        <div className="absolute bottom-0 right-10 w-10 h-10 bg-white/10 rounded-full" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-white/80 text-[11px] uppercase tracking-[0.2em] font-semibold">
              Search Result Offer
            </p>

            <h3 className="text-white text-[22px] font-black tracking-[0.12em] mt-1">
              {code}
            </h3>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/10">
            <Icon
              name="tag"
              size={20}
              className="text-white"
              strokeWidth={1.8}
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          {/* LEFT CONTENT */}
          <div className="flex-1">
            <h4
              className={`text-[15px] font-bold leading-snug ${
                dark ? "text-[#e9edef]" : "text-[#111B21]"
              }`}>
              {info.discount || "Special Discount Available"}
            </h4>

            {info.desc && (
              <p
                className={`text-[12.5px] mt-1 leading-relaxed ${
                  dark ? "text-[#8696a0]" : "text-[#667781]"
                }`}>
                {info.desc}
              </p>
            )}

            {/* Min Order */}
            {info.min && (
              <div
                className={`inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full text-[11px] font-medium
                ${
                  dark
                    ? "bg-[#111b21] text-[#25D366]"
                    : "bg-green-50 text-green-700"
                }`}>
                <Icon name="bag" size={12} />
                Min order: {info.min}
              </div>
            )}

            {/* COPY STATUS */}
            {copied && (
              <div className="mt-2 text-[11px] font-semibold text-green-500 animate-pulse">
                ✓ Copied to clipboard
              </div>
            )}
          </div>

          {/* COPY BUTTON */}
          <button
            onClick={handleCopy}
            className={`shrink-0 min-w-[96px] px-4 py-2.5 rounded-2xl text-[13px] font-bold transition-all duration-300 active:scale-95 shadow-sm
            ${
              copied
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-[#008069] text-white hover:bg-[#016855]"
            }`}>
            <span className="flex items-center justify-center gap-1.5">
              <Icon
                name={copied ? "check" : "copy"}
                size={15}
                strokeWidth={2}
              />
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Accent Bar */}
      <div
        className={`h-[3px] w-full ${
          dark
            ? "bg-gradient-to-r from-[#25D366]/40 via-[#25D366] to-[#25D366]/40"
            : "bg-gradient-to-r from-green-200 via-[#25D366] to-green-200"
        }`}
      />
    </div>
  );
};

export default React.memo(SearchPromoCard);
