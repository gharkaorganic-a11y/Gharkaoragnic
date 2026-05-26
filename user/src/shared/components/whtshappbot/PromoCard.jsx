import React, { useState } from "react";
import { useDark } from "../context/DarkCtx";

const PromoCard = ({ code, info, onCopy }) => {
  const dark = useDark();
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    onCopy?.(code);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-sm border max-w-[90%] ${dark ? "bg-[#1f2c34] border-[#2a3942]" : "bg-white border-gray-100"}`}>
      <div className="bg-gradient-to-r from-[#008069] to-[#25D366] px-4 py-3">
        <p className="text-white text-[11px] font-medium uppercase tracking-widest">
          Promo Code
        </p>
        <p className="text-white text-[22px] font-black tracking-widest mt-0.5">
          {code}
        </p>
      </div>
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p
            className={`text-[13px] font-semibold ${dark ? "text-[#e9edef]" : "text-[#111B21]"}`}>
            {info.discount}
          </p>
          <p className="text-[11.5px] text-gray-400">{info.desc}</p>
          <p className="text-[10.5px] text-gray-400">Min. order: {info.min}</p>
        </div>
        <button
          onClick={handleCopy}
          className={`shrink-0 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all active:scale-95
            ${copied ? "bg-green-100 text-green-600" : "bg-[#008069] text-white hover:bg-[#016855]"}`}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
};

export default PromoCard;
