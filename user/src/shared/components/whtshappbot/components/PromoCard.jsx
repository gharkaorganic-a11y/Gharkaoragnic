import React, { useState } from "react";
import { useDark } from "../../context/DarkCtx";
import { Icon } from "./ResubleComponents";

const PromoCard = ({ code, info = {}, onCopy }) => {
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
      className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl max-w-[95%]
      ${dark ? "bg-[#1f2c34] border-[#2a3942]" : "bg-white border-gray-200"}`}>
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#25D366]/20 blur-3xl rounded-full" />
      </div>

      {/* HEADER */}
      <div className="relative bg-gradient-to-r from-[#008069] via-[#0aa36c] to-[#25D366] px-5 py-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/80 text-[10px] uppercase tracking-[0.25em] font-semibold">
              Exclusive Offer
            </p>

            <h2 className="text-white text-[22px] font-extrabold tracking-widest mt-1">
              {code}
            </h2>
          </div>

          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/10">
            <Icon name="tag" size={20} className="text-white" />
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="px-5 py-4">
        <h3
          className={`text-[15px] font-semibold leading-snug ${
            dark ? "text-[#e9edef]" : "text-[#111B21]"
          }`}>
          {info.discount || "Special Discount Available"}
        </h3>

        {info.desc && (
          <p
            className={`text-[12.5px] mt-1 leading-relaxed ${
              dark ? "text-[#8696a0]" : "text-[#667781]"
            }`}>
            {info.desc}
          </p>
        )}

        {/* MIN ORDER */}
        {info.min && (
          <div
            className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-[11px] font-medium
            ${
              dark
                ? "bg-[#111b21] text-[#25D366]"
                : "bg-green-50 text-green-700"
            }`}>
            <Icon name="bag" size={12} />
            Min order ₹{info.min}
          </div>
        )}

        {/* COPY BUTTON */}
        <div className="mt-4 flex items-center justify-between">
          <span
            className={`text-[11px] ${
              dark ? "text-[#8696a0]" : "text-gray-500"
            }`}>
            Tap to copy & apply at checkout
          </span>

          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all duration-200 active:scale-95 shadow-sm flex items-center gap-1.5
            ${
              copied
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-[#008069] text-white hover:bg-[#016855] hover:shadow-md"
            }`}>
            <Icon name={copied ? "check" : "copy"} size={14} />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* bottom accent bar */}
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

export default React.memo(PromoCard);
