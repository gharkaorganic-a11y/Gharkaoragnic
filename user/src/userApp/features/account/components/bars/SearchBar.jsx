import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, ArrowRight, Check, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchSiteUrls } from "../../search/siteUrlsIndex";

const SearchBar = ({ scrolled }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute live suggestions
  const suggestions = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return searchSiteUrls(q).slice(0, 6);
  }, [query]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const clean = query.trim();
    setIsOpen(false);
    if (clean) {
      navigate(`/search?q=${encodeURIComponent(clean)}`);
    } else {
      navigate("/search");
    }
  };

  const handleSelect = (item) => {
    setIsOpen(false);
    if (item?.path) {
      navigate(item.path);
    }
  };

  const handleCopy = (e, fullUrl) => {
    e.stopPropagation();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(fullUrl);
      setCopiedUrl(fullUrl);
      setTimeout(() => setCopiedUrl(null), 2000);
    }
  };

  return (
    <div ref={containerRef} className="flex-1 flex justify-center relative">
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-[450px] h-10 rounded-full flex items-center px-4 gap-3 border transition-all ${
          scrolled
            ? "bg-gray-100 border-gray-300 focus-within:border-[#315c3c] focus-within:bg-white"
            : "bg-white/20 border-white/40 backdrop-blur-md focus-within:bg-white focus-within:text-gray-900"
        }`}>
        <button
          type="submit"
          className="p-0 border-none bg-transparent cursor-pointer flex items-center"
          aria-label="Search">
          <Search
            size={18}
            className={`${
              scrolled
                ? "text-gray-600"
                : "text-white group-focus-within:text-gray-700"
            }`}
          />
        </button>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          placeholder="Search A2 ghee, raw honey, pahadi achar..."
          className={`bg-transparent w-full outline-none text-sm ${
            scrolled
              ? "text-gray-800 placeholder-gray-500"
              : "text-white placeholder-white/80 focus:text-gray-900 focus:placeholder-gray-400"
          }`}
        />
      </form>

      {/* LIVE SUGGESTIONS DROPDOWN WITH URL DISPLAY */}
      {isOpen && query.trim() && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-full max-w-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden divide-y divide-gray-100">
          <div className="p-2.5 bg-[#faf7f2] flex items-center justify-between text-[11px] text-gray-500 font-medium">
            <span>Matching Pages & Products</span>
            <span className="text-[#8F6646] font-semibold">
              Exact Destination URL
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="p-3 hover:bg-[#f6f2ec] transition-colors cursor-pointer flex items-center justify-between group gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-gray-900 group-hover:text-[#315c3c] truncate">
                        {item.title || item.name}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 flex-shrink-0">
                        {item.type}
                      </span>
                    </div>
                    {/* VISIBLE CLEAN URL */}
                    <div className="text-[11px] font-mono text-[#315c3c] truncate mt-0.5">
                      {item.fullUrl}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      title="Copy URL"
                      onClick={(e) => handleCopy(e, item.fullUrl)}
                      className="p-1 text-gray-400 hover:text-gray-700 rounded">
                      {copiedUrl === item.fullUrl ? (
                        <Check size={14} className="text-emerald-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                    <ArrowRight
                      size={14}
                      className="text-gray-400 group-hover:text-[#315c3c] group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-gray-500">
                No matching pages or products for "{query}".
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-2 bg-[#faf7f2] hover:bg-[#f1ebe0] text-center text-xs font-semibold text-[#714d33] transition-colors block">
            See all results on Search Page →
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
