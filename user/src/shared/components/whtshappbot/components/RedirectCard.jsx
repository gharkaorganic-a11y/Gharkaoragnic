import { ChevronRightIcon, SparklesIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useDark } from "../../context/DarkCtx";

const RedirectCard = ({ suggestions }) => {
  const dark = useDark();
  return (
    <div
      className={`rounded-xl overflow-hidden shadow-sm border max-w-[95%] w-full ${dark ? "bg-[#1f2c34] border-[#2a3942]" : "bg-white border-gray-100"}`}>
      <div
        className={`px-4 py-2.5 border-b flex items-center gap-1.5 ${dark ? "bg-[#182028] border-[#2a3942]" : "bg-[#f0f9f4] border-[#008069]/10"}`}>
        <SparklesIcon className="w-4 h-4 text-[#008069]" />
        <p className="text-[12px] font-semibold text-[#008069] uppercase tracking-wider">
          Explore Next
        </p>
      </div>
      <div className="flex flex-col">
        {suggestions.map((s, i) => (
          <a
            key={i}
            href={s.url}
            className={`flex items-center justify-between px-4 py-3 transition-all group ${i !== suggestions.length - 1 ? (dark ? "border-b border-[#2a3942]" : "border-b border-gray-50") : ""} ${dark ? "hover:bg-[#2a3942]" : "hover:bg-[#f5f6f6]"}`}>
            <span
              className={`text-[14px] transition-colors group-hover:text-[#008069] ${dark ? "text-[#e9edef]" : "text-[#111B21]"}`}>
              {s.label}
            </span>
            <ChevronRightIcon className="w-4 h-4 text-[#8696a0] opacity-70 group-hover:opacity-100 group-hover:text-[#008069] transition-all transform group-hover:translate-x-1" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default RedirectCard;
