import React from "react";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import { productSections } from "../../data/productSections";

const Filters = ({
  collectionFilter,
  setCollectionFilter,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
  clearFilters,
  hasActiveFilters,
}) => (
  <div className="bg-white border border-[#e3e3e3] rounded-xl shadow-[0_1px_0_rgba(0,0,0,0.03)]">
    {/* Header */}
    <div className="px-4 py-2.5 border-b border-[#ebebeb] bg-[#fafafa] rounded-t-xl flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Filter size={13} className="text-[#2874F0]" />
        <span className="text-[11px] font-bold text-[#303030] uppercase tracking-wider">
          Filter &amp; Search
        </span>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-[11px] font-semibold text-[#2874F0] hover:underline flex items-center gap-1 cursor-pointer">
          <X size={12} /> Clear all
        </button>
      )}
    </div>

    {/* Filters */}
    <div className="p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#616161]"
        />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by product name or ID..."
          className="w-full h-9 pl-9 pr-3 border border-[#d4d4d4] rounded-lg bg-[#fafafa] text-xs text-[#303030] placeholder-[#878787] outline-none focus:border-[#2874F0] focus:bg-white transition"
        />
      </div>

      {/* Collection Types */}
      <div className="relative">
        <select
          value={collectionFilter}
          onChange={(e) => setCollectionFilter(e.target.value)}
          className="w-full h-9 appearance-none pl-3 pr-8 border border-[#d4d4d4] rounded-lg text-xs font-medium text-[#303030] bg-white outline-none cursor-pointer focus:border-[#2874F0] transition">
          <option value="all">All Sections</option>

          {productSections.map((section) => (
            <option key={section.key} value={section.key}>
              {section.title}
            </option>
          ))}
        </select>

        <ChevronDown
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#616161] pointer-events-none"
          size={14}
        />
      </div>

      {/* Status */}
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full h-9 appearance-none pl-3 pr-8 border border-[#d4d4d4] rounded-lg text-xs font-medium text-[#303030] bg-white outline-none cursor-pointer focus:border-[#2874F0] transition">
          <option value="all">All Status</option>
          <option value="active">Live Only</option>
          <option value="inactive">Drafts Only</option>
        </select>

        <ChevronDown
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#616161] pointer-events-none"
          size={14}
        />
      </div>
    </div>
  </div>
);

export default Filters;
