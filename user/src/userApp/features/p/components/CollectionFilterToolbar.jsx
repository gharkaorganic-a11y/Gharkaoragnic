import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";

export const CollectionFilterToolbar = ({
  totalCount,
  currentSort,
  onSortChange,
  sortOptions = [],
  availabilityFilter,
  onAvailabilityChange,
  priceFilter,
  onPriceChange,
  productFilter,
  onProductChange,
  productSections = [],
  onResetFilters,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null); // 'avail' | 'price' | 'prod' | 'sort' | null
  const toolbarRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const hasActiveFilters =
    availabilityFilter !== "all" ||
    priceFilter !== "all" ||
    (productFilter && productFilter !== "all");

  const currentSortObj =
    sortOptions.find((o) => o.value === currentSort) || sortOptions[0];

  return (
    <div ref={toolbarRef} className="w-full border-b border-gray-200 py-3 mb-6 mt-2">
      <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-sm text-gray-700">
        {/* Left: Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="text-gray-500 font-medium select-none">Filter:</span>

          {/* Availability Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("avail")}
              className={`inline-flex items-center gap-1.5 py-1 text-sm font-medium transition-colors hover:text-gray-900 ${
                availabilityFilter !== "all"
                  ? "text-[#008060] font-semibold"
                  : "text-gray-700"
              }`}>
              <span>
                {availabilityFilter === "in_stock"
                  ? "In stock"
                  : availabilityFilter === "out_of_stock"
                  ? "Out of stock"
                  : "Availability"}
              </span>
              <ChevronDownIcon
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === "avail" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "avail" && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-40 py-1.5 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => {
                    onAvailabilityChange("all");
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                    availabilityFilter === "all"
                      ? "text-[#008060] font-semibold bg-green-50/50"
                      : "text-gray-700"
                  }`}>
                  All
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAvailabilityChange("in_stock");
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                    availabilityFilter === "in_stock"
                      ? "text-[#008060] font-semibold bg-green-50/50"
                      : "text-gray-700"
                  }`}>
                  In stock
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAvailabilityChange("out_of_stock");
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                    availabilityFilter === "out_of_stock"
                      ? "text-[#008060] font-semibold bg-green-50/50"
                      : "text-gray-700"
                  }`}>
                  Out of stock
                </button>
              </div>
            )}
          </div>

          {/* Price Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("price")}
              className={`inline-flex items-center gap-1.5 py-1 text-sm font-medium transition-colors hover:text-gray-900 ${
                priceFilter !== "all"
                  ? "text-[#008060] font-semibold"
                  : "text-gray-700"
              }`}>
              <span>
                {priceFilter === "under_300"
                  ? "Under ₹300"
                  : priceFilter === "300_600"
                  ? "₹300 - ₹600"
                  : priceFilter === "above_600"
                  ? "Above ₹600"
                  : "Price"}
              </span>
              <ChevronDownIcon
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === "price" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "price" && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-40 py-1.5 animate-fadeIn">
                {[
                  { id: "all", label: "All Prices" },
                  { id: "under_300", label: "Under ₹300" },
                  { id: "300_600", label: "₹300 - ₹600" },
                  { id: "above_600", label: "Above ₹600" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onPriceChange(opt.id);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                      priceFilter === opt.id
                        ? "text-[#008060] font-semibold bg-green-50/50"
                        : "text-gray-700"
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product / Category Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("prod")}
              className={`inline-flex items-center gap-1.5 py-1 text-sm font-medium transition-colors hover:text-gray-900 ${
                productFilter && productFilter !== "all"
                  ? "text-[#008060] font-semibold"
                  : "text-gray-700"
              }`}>
              <span>
                {productSections.find((s) => s.key === productFilter)?.title ||
                  "Product"}
              </span>
              <ChevronDownIcon
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === "prod" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "prod" && (
              <div className="absolute left-0 mt-2 w-56 max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-40 py-1.5 animate-fadeIn scrollbar-thin">
                <button
                  type="button"
                  onClick={() => {
                    onProductChange("all");
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                    !productFilter || productFilter === "all"
                      ? "text-[#008060] font-semibold bg-green-50/50"
                      : "text-gray-700"
                  }`}>
                  All Categories
                </button>
                {productSections
                  .filter((s) => s.key !== "all")
                  .map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => {
                        onProductChange(s.key);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                        productFilter === s.key
                          ? "text-[#008060] font-semibold bg-green-50/50"
                          : "text-gray-700"
                      }`}>
                      {s.title}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Sort and Count matching Image 2 */}
        <div className="flex items-center gap-5 sm:gap-7 ml-auto">
          {/* Sort By Dropdown */}
          <div className="relative flex items-center gap-2">
            <span className="text-gray-500 font-medium select-none">Sort by:</span>
            <button
              type="button"
              onClick={() => toggleDropdown("sort")}
              className="inline-flex items-center gap-1.5 py-1 text-sm font-medium text-gray-800 hover:text-black transition-colors">
              <span>{currentSortObj?.label || "Featured"}</span>
              <ChevronDownIcon
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === "sort" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "sort" && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-40 py-1.5 animate-fadeIn">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSortChange(opt.value);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                      currentSort === opt.value
                        ? "text-[#008060] font-semibold bg-green-50/50"
                        : "text-gray-700"
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Count matching Image 2 */}
          <div className="text-sm text-gray-500 font-normal whitespace-nowrap">
            {totalCount} {totalCount === 1 ? "product" : "products"}
          </div>
        </div>
      </div>

      {/* Active Filter Badges Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">Active filters:</span>
          {availabilityFilter !== "all" && (
            <button
              type="button"
              onClick={() => onAvailabilityChange("all")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-[#008060] hover:bg-emerald-100 transition">
              <span>
                {availabilityFilter === "in_stock" ? "In stock" : "Out of stock"}
              </span>
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          )}

          {priceFilter !== "all" && (
            <button
              type="button"
              onClick={() => onPriceChange("all")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-[#008060] hover:bg-emerald-100 transition">
              <span>
                {priceFilter === "under_300"
                  ? "Under ₹300"
                  : priceFilter === "300_600"
                  ? "₹300 - ₹600"
                  : "Above ₹600"}
              </span>
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          )}

          {productFilter && productFilter !== "all" && (
            <button
              type="button"
              onClick={() => onProductChange("all")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-[#008060] hover:bg-emerald-100 transition">
              <span>
                {productSections.find((s) => s.key === productFilter)?.title ||
                  productFilter}
              </span>
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-gray-500 hover:text-gray-900 underline ml-2">
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default CollectionFilterToolbar;

