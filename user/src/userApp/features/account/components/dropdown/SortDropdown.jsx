import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "A → Z", value: "a_z" },
  { label: "Z → A", value: "z_a" },
];

const SortDropdown = ({ sort, setSort }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label || "Sort";

  /* Close on click outside */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Close on Escape */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        aria-haspopup="listbox"
        aria-expanded={open}>
        <span className="font-medium text-gray-900">Sort:</span>
        <span className="text-gray-600">{currentLabel}</span>
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg shadow-gray-200/70 ring-1 ring-black/5 z-50 animate-in fade-in-0 zoom-in-95 duration-100">
          <div role="listbox" className="focus:outline-none">
            {SORT_OPTIONS.map((opt) => {
              const isActive = sort === opt.value;
              return (
                <button
                  key={opt.value}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setSort(opt.value);
                    setOpen(false);
                  }}
                  className={`group flex w-full items-center justify-between px-3.5 py-2.5 text-sm transition ${
                    isActive
                      ? "bg-gray-50 text-gray-900 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}>
                  {opt.label}
                  {isActive && <Check size={16} className="text-gray-900" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
