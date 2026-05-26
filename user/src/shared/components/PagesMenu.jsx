import React, { useState } from "react";
import { SITE_PAGES } from "../../lib/BotData";
import { useDark } from "./context/DarkCtx";

export const PagesMenu = ({ onClose }) => {
  const dark = useDark();
  const [search, setSearch] = useState("");
  const filtered = SITE_PAGES.filter(
    (p) =>
      p.label.toLowerCase().includes(search.toLowerCase()) ||
      p.hint.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div
      className={`absolute bottom-14 left-2 z-50 rounded-2xl shadow-2xl border w-68 overflow-hidden ${dark ? "bg-[#1f2c34] border-[#2a3942]" : "bg-white border-gray-100"}`}>
      <div className="bg-[#008069] px-3 py-2.5 flex items-center justify-between">
        <span className="text-white text-[13px] font-semibold">
          Quick Navigate
        </span>
        <button onClick={onClose} className="text-white/70 hover:text-white">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto py-1">
        {filtered.map((p, i) => {
          const Icon = p.icon;
          return (
            <a
              key={i}
              href={p.url}
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 transition-colors group ${dark ? "hover:bg-[#2a3942]" : "hover:bg-[#f0f9f4]"}`}>
              <Icon className="w-4 h-4 text-[#008069] shrink-0" />
              <span
                className={`text-[13px] flex-1 ${dark ? "text-[#e9edef]" : "text-[#111B21]"}`}>
                {p.label}
              </span>
              <span
                className={`text-[10.5px] group-hover:text-[#008069] transition-colors ${dark ? "text-gray-500" : "text-gray-400"}`}>
                {p.hint}
              </span>
            </a>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-[12px] text-gray-400 text-center py-4">
            No pages found
          </p>
        )}
      </div>
    </div>
  );
};
