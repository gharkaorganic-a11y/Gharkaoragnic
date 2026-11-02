import React, { useState, useEffect, useMemo, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import ProductCard from "../components/cards/ProductCard";
import { getLatestProductsCached } from "../features/product/services/productCacheService";
import {
  STATIC_PAGES,
  SEO_COLLECTIONS,
} from "../features/search/siteUrlsIndex";
import { productSections } from "../features/homepage/config/productCollection";

/* Combined list of all static & collection pages (100% in-memory, 0 Firebase reads) */
const ALL_SITE_PAGES = [...STATIC_PAGES, ...SEO_COLLECTIONS];

/* ─────────────── INDIAN CURRENCY FORMATTER ─────────────── */
const formatPrice = (val) => {
  const num = Number(val || 0);
  return `Rs. ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)}`;
};

/* ─────────────────────────────────────────────────────────────
   SEARCH RESULTS PAGE
───────────────────────────────────────────────────────────── */
const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Query sync
  const queryParam = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(queryParam);
  const [showLiveDropdown, setShowLiveDropdown] = useState(false);

  // Filters state (matching Screenshot: Availability, Price, Product)
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");

  // Dropdown menus visibility
  const [openFilterMenu, setOpenFilterMenu] = useState(null);

  // All products loaded (from cache / Firestore once)
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchBoxRef = useRef(null);
  const filterRowRef = useRef(null);

  // Load products ONCE via zero-waste cache (prevents duplicate Firestore billing)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const prods = await getLatestProductsCached();
        if (isMounted && Array.isArray(prods)) {
          setAllProducts(prods);
        }
      } catch (err) {
        console.warn("Could not load products:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync input when URL param changes
  useEffect(() => {
    setInputValue(queryParam);
  }, [queryParam]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowLiveDropdown(false);
      }
      if (filterRowRef.current && !filterRowRef.current.contains(e.target)) {
        setOpenFilterMenu(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  /* ─────────────────────────────────────────────────────────────
     MATCHING PAGES (IN-MEMORY SEARCH OVER ALL SITE URLS)
  ───────────────────────────────────────────────────────────── */
  const matchingPages = useMemo(() => {
    const q = (queryParam || inputValue || "").trim().toLowerCase();
    if (!q) return [];

    return ALL_SITE_PAGES.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const path = (p.path || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const keywords = (p.keywords || []).map((k) => String(k).toLowerCase());
      return (
        title.includes(q) ||
        path.includes(q) ||
        keywords.some((k) => k.includes(q)) ||
        desc.includes(q)
      );
    });
  }, [queryParam, inputValue]);

  /* ─────────────────────────────────────────────────────────────
     DYNAMIC IN-MEMORY AUTOCOMPLETE (ZERO FIRESTORE CALLS)
     Generates SUGGESTIONS (left), PAGES (left), and PRODUCTS (right)
  ───────────────────────────────────────────────────────────── */
  const autocompleteData = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    if (!q) return { suggestions: [], pages: [], products: [] };

    // 1. Matching Products for Right Column
    const matchingProducts = allProducts
      .filter((p) => {
        const name = (p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const slug = (p.slug || "").toLowerCase();
        const tags = Array.isArray(p.tags)
          ? p.tags.join(" ").toLowerCase()
          : "";
        return (
          name.includes(q) ||
          desc.includes(q) ||
          slug.includes(q) ||
          tags.includes(q)
        );
      })
      .slice(0, 5);

    // 2. Matching Pages & Collections for Left Column
    const matchingSitePages = ALL_SITE_PAGES.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const path = (p.path || "").toLowerCase();
      const keywords = (p.keywords || []).map((k) => String(k).toLowerCase());
      return (
        title.includes(q) ||
        path.includes(q) ||
        keywords.some((k) => k.includes(q))
      );
    }).slice(0, 4);

    // 3. Generate Search Query Suggestions
    const rawSuggestions = new Set();
    allProducts.forEach((p) => {
      const name = p.name || "";
      const lowerName = name.toLowerCase();
      if (lowerName.includes(q)) {
        const words = lowerName.split(/[,–\-\(\)\/\+]+/)[0].trim();
        if (words.length <= 35) {
          rawSuggestions.add(words);
        }
      }
    });

    const staplePhrases = [
      "a2 badri cow ghee",
      "himalayan village a2 ghee",
      "bhimtal raw forest honey",
      "pahadi aam achar",
      "kumaoni nimbu achar",
      "pisyu loon flavoured salt",
      "himalayan herbal salt",
      "wild himalayan timur pepper",
      "jakhiya seeds uttarakhand",
      "munsiyari white pahadi rajma",
      "organic bhatt ki dal",
      "pure pahadi haldi powder",
    ];

    staplePhrases.forEach((phrase) => {
      if (phrase.includes(q) && rawSuggestions.size < 6) {
        rawSuggestions.add(phrase);
      }
    });

    const suggestionsArray = Array.from(rawSuggestions).slice(0, 5);
    if (!suggestionsArray.some((s) => s.toLowerCase() === q)) {
      suggestionsArray.unshift(q);
    }

    return {
      suggestions: suggestionsArray.slice(0, 5),
      pages: matchingSitePages,
      products: matchingProducts,
    };
  }, [inputValue, allProducts]);

  /* ─────────────────────────────────────────────────────────────
     MAIN PRODUCTS FILTERING & SORTING (100% IN-MEMORY)
  ───────────────────────────────────────────────────────────── */
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    const q = queryParam.trim().toLowerCase();
    if (q) {
      result = result.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const slug = (p.slug || "").toLowerCase();
        const tags = Array.isArray(p.tags)
          ? p.tags.join(" ").toLowerCase()
          : "";
        return (
          name.includes(q) ||
          desc.includes(q) ||
          slug.includes(q) ||
          tags.includes(q)
        );
      });
    }

    // Availability filter
    if (filterAvailability === "inStock") {
      result = result.filter((p) => (p.stock ?? 1) > 0);
    } else if (filterAvailability === "outOfStock") {
      result = result.filter((p) => (p.stock ?? 1) <= 0);
    }

    // Price filter
    if (filterPrice === "under500") {
      result = result.filter((p) => Number(p.price || 0) < 500);
    } else if (filterPrice === "500to1500") {
      result = result.filter(
        (p) => Number(p.price || 0) >= 500 && Number(p.price || 0) <= 1500
      );
    } else if (filterPrice === "above1500") {
      result = result.filter((p) => Number(p.price || 0) > 1500);
    }

    // Product Category filter
    if (filterProduct !== "all") {
      result = result.filter((p) => {
        const text = `${p.name} ${p.collectionTypes?.join(" ")} ${p.slug}`.toLowerCase();
        return text.includes(filterProduct.toLowerCase());
      });
    }

    // Sorting
    if (sortBy === "priceAsc") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === "priceDesc") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === "newest") {
      const getMs = (val) =>
        val?.toMillis?.() ?? (typeof val?.seconds === "number" ? val.seconds * 1000 : 0);
      result.sort((a, b) => getMs(b.createdAt) - getMs(a.createdAt));
    }

    return result;
  }, [allProducts, queryParam, filterAvailability, filterPrice, filterProduct, sortBy]);

  /* ─────────────────────────────────────────────────────────────
     DYNAMIC SECTION HEADER (MATCHING USER SCREENSHOT EXACTLY)
     e.g. "Pure Pahadi Honey"
     "Raw forest honey collected from Himalayan flowers, unprocessed and chemical-free."
  ───────────────────────────────────────────────────────────── */
  const sectionHeader = useMemo(() => {
    const q = queryParam.trim().toLowerCase();
    const effectiveKey = filterProduct !== "all" ? filterProduct : q;

    // Check matching section from productCollection.js
    if (effectiveKey.includes("honey")) {
      const s = productSections.find((x) => x.key === "honey");
      return {
        title: s?.title || "Pure Pahadi Honey",
        subtitle:
          s?.subtitle ||
          "Raw forest honey collected from Himalayan flowers, unprocessed and chemical-free.",
      };
    }
    if (effectiveKey.includes("ghee")) {
      const s = productSections.find((x) => x.key === "ghee");
      return {
        title: s?.title || "Pure Desi Cow Ghee",
        subtitle:
          s?.subtitle ||
          "Traditional A2 cow ghee made using bilona method for authentic taste and nutrition.",
      };
    }
    if (effectiveKey.includes("pickle") || effectiveKey.includes("achar") || effectiveKey.includes("aam") || effectiveKey.includes("nimbu")) {
      const s = productSections.find((x) => x.key === "pickle");
      return {
        title: s?.title || "Homemade Pahadi Pickles",
        subtitle:
          s?.subtitle ||
          "Traditional Kumaoni pickles made using authentic recipes without preservatives.",
      };
    }
    if (effectiveKey.includes("spice") || effectiveKey.includes("masala") || effectiveKey.includes("timur") || effectiveKey.includes("jakhiya")) {
      const s = productSections.find((x) => x.key === "spices");
      return {
        title: s?.title || "Fresh Pahadi Spices",
        subtitle:
          s?.subtitle ||
          "Aromatic hand-ground spices from Uttarakhand for authentic Indian cooking.",
      };
    }
    if (effectiveKey.includes("salt") || effectiveKey.includes("loon") || effectiveKey.includes("namak")) {
      const s = productSections.find((x) => x.key === "pahadiSalts");
      return {
        title: s?.title || "Pahadi Herbal Salts",
        subtitle:
          s?.subtitle ||
          "Unique Himalayan salts infused with natural herbs and traditional minerals.",
      };
    }
    if (effectiveKey.includes("dal") || effectiveKey.includes("rajma") || effectiveKey.includes("bhatt")) {
      const s = productSections.find((x) => x.key === "pahadiDals");
      return {
        title: s?.title || "Organic Pahadi Dals",
        subtitle:
          s?.subtitle ||
          "Nutritious and naturally grown pulses from Himalayan farms.",
      };
    }

    if (q) {
      return {
        title: `Results for "${queryParam}"`,
        subtitle: `Found ${filteredProducts.length} authentic Himalayan staple${
          filteredProducts.length === 1 ? "" : "s"
        } matching your search.`,
      };
    }

    return {
      title: "All Himalayan Organic Products",
      subtitle:
        "Browse our complete range of natural Himalayan foods handcrafted in Uttarakhand.",
    };
  }, [queryParam, filterProduct, filteredProducts.length]);

  // Search submission
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const clean = inputValue.trim();
    setShowLiveDropdown(false);
    if (clean) {
      setSearchParams({ q: clean });
    } else {
      setSearchParams({});
    }
  };

  // Clear input
  const handleClear = () => {
    setInputValue("");
    setSearchParams({});
    setShowLiveDropdown(false);
  };

  // Select suggestion
  const handleSelectSuggestion = (sug) => {
    setInputValue(sug);
    setSearchParams({ q: sug });
    setShowLiveDropdown(false);
  };

  // Select page suggestion
  const handleSelectPage = (page) => {
    setShowLiveDropdown(false);
    navigate(page.path);
  };

  // Select product from dropdown
  const handleSelectProduct = (prod) => {
    setShowLiveDropdown(false);
    navigate(`/product/${prod.slug || prod.id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <Loader2 className="animate-spin text-[#315c3c] w-12 h-12" />
        </div>
      )}
      {/* ─────────────── SEO HELMET ─────────────── */}
      <Helmet>
        <title>
          {queryParam
            ? `Search: ${filteredProducts.length} results found for "${queryParam}" | Ghar Ka Organic`
            : "Search Organic Himalayan Products & Pages | Ghar Ka Organic"}
        </title>
        <meta
          name="description"
          content="Search authentic Himalayan A2 cow ghee, raw forest honey, sun-dried pickles, and direct site pages on Ghar Ka Organic."
        />
        <link rel="canonical" href="https://gharkaorganic.com/search" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* ─────────────── PAGE TITLE ─────────────── */}
        <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 tracking-tight text-center mb-6">
          Search results
        </h1>

        {/* ─────────────── SEARCH INPUT (MATCHING SCREENSHOT) ─────────────── */}
        <div ref={searchBoxRef} className="relative max-w-2xl mx-auto mb-8">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center border border-gray-400 focus-within:border-gray-900 bg-white transition-colors">
            {/* INPUT WRAPPER WITH TINY "Search" LABEL */}
            <div className="flex-1 py-1.5 px-4">
              <label
                htmlFor="search-results-input"
                className="block text-[11px] text-gray-400 font-normal leading-tight">
                Search
              </label>
              <input
                id="search-results-input"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowLiveDropdown(true);
                }}
                onFocus={() => {
                  if (inputValue.trim()) setShowLiveDropdown(true);
                }}
                placeholder=""
                className="w-full text-sm text-gray-900 bg-transparent border-none outline-none p-0 focus:ring-0"
              />
            </div>

            {/* ICONS: CLEAR (×) & SEARCH MAGNIFYING GLASS */}
            <div className="flex items-center pr-3 gap-2">
              {inputValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label="Clear input">
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
              <div className="w-[1px] h-4 bg-gray-300" />
              <button
                type="submit"
                className="p-1 text-gray-700 hover:text-black transition-colors"
                aria-label="Search">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* ─────────────────────────────────────────────────────────────
             AUTOCOMPLETE DROPDOWN (MATCHING SCREENSHOT + PAGE SUGGESTIONS)
             Left: SUGGESTIONS & PAGE SUGGESTIONS
             Right: PRODUCTS
             Bottom: Search for "{query}" →
          ───────────────────────────────────────────────────────────── */}
          {showLiveDropdown && inputValue.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full bg-white border border-gray-300 border-t-0 shadow-2xl z-50 overflow-hidden text-left">
              <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-100 p-4">
                {/* LEFT COLUMN: SUGGESTIONS & PAGE SUGGESTIONS */}
                <div className="md:col-span-5 pr-0 md:pr-4 flex flex-col justify-between">
                  {/* QUERY SUGGESTIONS */}
                  <div>
                    <h4 className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase mb-2.5">
                      Suggestions
                    </h4>
                    <ul className="space-y-1.5">
                      {autocompleteData.suggestions.length > 0 ? (
                        autocompleteData.suggestions.map((sug, i) => (
                          <li key={i}>
                            <button
                              type="button"
                              onClick={() => handleSelectSuggestion(sug)}
                              className="text-left w-full text-xs sm:text-sm text-gray-900 hover:text-[#8F6646] hover:underline font-normal py-0.5 truncate block">
                              {sug}
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="text-xs text-gray-400">No suggestions</li>
                      )}
                    </ul>
                  </div>

                  {/* PAGE SUGGESTIONS (SHOWING URL & DIRECT REDIRECT) */}
                  {autocompleteData.pages.length > 0 && (
                    <div className="pt-3 mt-3 border-t border-gray-100">
                      <h4 className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase mb-2">
                        Pages & Collections
                      </h4>
                      <ul className="space-y-2">
                        {autocompleteData.pages.map((pg) => (
                          <li key={pg.id}>
                            <div
                              onClick={() => handleSelectPage(pg)}
                              className="cursor-pointer group flex items-center justify-between py-0.5">
                              <div className="min-w-0 pr-2">
                                <span className="text-xs text-gray-900 group-hover:text-[#8F6646] group-hover:underline truncate block">
                                  {pg.title}
                                </span>
                                <span className="text-[10px] font-mono text-[#315c3c] font-semibold truncate block">
                                  {pg.path}
                                </span>
                              </div>
                              <ArrowRightIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#8F6646] flex-shrink-0" />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN: PRODUCTS */}
                <div className="md:col-span-7 pt-3 md:pt-0 pl-0 md:pl-4">
                  <h4 className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase mb-3">
                    Products
                  </h4>
                  <div className="space-y-3">
                    {autocompleteData.products.length > 0 ? (
                      autocompleteData.products.map((prod) => {
                        const price = Number(prod.price || 0);
                        const orig = Number(prod.originalPrice ?? prod.mrp ?? 0);
                        const img =
                          prod.banner ||
                          prod.images?.[0] ||
                          "/banners/ghee-1500x500.webp";

                        return (
                          <div
                            key={prod.id}
                            onClick={() => handleSelectProduct(prod)}
                            className="flex items-center gap-3 cursor-pointer group py-1">
                            {/* MINI SQUARE THUMBNAIL */}
                            <div className="w-11 h-11 flex-shrink-0 bg-gray-50 border border-gray-200 p-0.5 rounded overflow-hidden flex items-center justify-center">
                              <img
                                src={img}
                                alt={prod.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.target.src = "/banners/ghee-1500x500.webp";
                                }}
                              />
                            </div>

                            {/* DETAILS */}
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm text-gray-900 group-hover:text-[#8F6646] group-hover:underline truncate font-normal leading-snug">
                                {prod.name}
                              </p>
                              <div className="flex items-baseline gap-2 mt-0.5">
                                <span className="text-xs font-semibold text-gray-900">
                                  {formatPrice(price)}
                                </span>
                                {orig > price && (
                                  <span className="text-[11px] text-gray-400 line-through">
                                    {formatPrice(orig)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-gray-400">No products found</p>
                    )}
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW: Search for "{query}" → */}
              <div
                onClick={handleSubmit}
                className="border-t border-gray-200 px-4 py-3 flex items-center justify-between text-xs sm:text-sm text-gray-800 hover:bg-gray-50 cursor-pointer font-normal">
                <span>Search for "{inputValue}"</span>
                <ArrowRightIcon className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          )}
        </div>

        {/* ─────────────── FILTER & SORT BAR ─────────────── */}
        <div
          ref={filterRowRef}
          className="flex flex-wrap items-center justify-between border-t border-b border-gray-200 py-3 mb-8 gap-y-3 text-xs text-gray-700">
          {/* LEFT: FILTERS */}
          <div className="flex items-center flex-wrap gap-4 relative">
            <span className="text-gray-500">Filter:</span>

            {/* AVAILABILITY FILTER */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenFilterMenu(
                    openFilterMenu === "avail" ? null : "avail"
                  )
                }
                className="flex items-center gap-1 hover:text-black">
                Availability{" "}
                <ChevronDownIcon className="w-3.5 h-3.5 text-gray-500" />
              </button>
              {openFilterMenu === "avail" && (
                <div className="absolute left-0 top-full mt-2 w-36 bg-white border border-gray-200 shadow-lg rounded py-1 z-30">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterAvailability("all");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      filterAvailability === "all" ? "font-bold text-[#8F6646]" : ""
                    }`}>
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterAvailability("inStock");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      filterAvailability === "inStock"
                        ? "font-bold text-[#8F6646]"
                        : ""
                    }`}>
                    In Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterAvailability("outOfStock");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      filterAvailability === "outOfStock"
                        ? "font-bold text-[#8F6646]"
                        : ""
                    }`}>
                    Out of Stock
                  </button>
                </div>
              )}
            </div>

            {/* PRICE FILTER */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenFilterMenu(
                    openFilterMenu === "price" ? null : "price"
                  )
                }
                className="flex items-center gap-1 hover:text-black">
                Price <ChevronDownIcon className="w-3.5 h-3.5 text-gray-500" />
              </button>
              {openFilterMenu === "price" && (
                <div className="absolute left-0 top-full mt-2 w-44 bg-white border border-gray-200 shadow-lg rounded py-1 z-30">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterPrice("all");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      filterPrice === "all" ? "font-bold text-[#8F6646]" : ""
                    }`}>
                    All Prices
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterPrice("under500");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      filterPrice === "under500" ? "font-bold text-[#8F6646]" : ""
                    }`}>
                    Under ₹500
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterPrice("500to1500");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      filterPrice === "500to1500"
                        ? "font-bold text-[#8F6646]"
                        : ""
                    }`}>
                    ₹500 – ₹1,500
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterPrice("above1500");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      filterPrice === "above1500"
                        ? "font-bold text-[#8F6646]"
                        : ""
                    }`}>
                    Above ₹1,500
                  </button>
                </div>
              )}
            </div>

            {/* PRODUCT CATEGORY FILTER */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenFilterMenu(
                    openFilterMenu === "product" ? null : "product"
                  )
                }
                className="flex items-center gap-1 hover:text-black">
                Product <ChevronDownIcon className="w-3.5 h-3.5 text-gray-500" />
              </button>
              {openFilterMenu === "product" && (
                <div className="absolute left-0 top-full mt-2 w-44 bg-white border border-gray-200 shadow-lg rounded py-1 z-30">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterProduct("all");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      filterProduct === "all" ? "font-bold text-[#8F6646]" : ""
                    }`}>
                    All Products
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterProduct("ghee");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      filterProduct === "ghee" ? "font-bold text-[#8F6646]" : ""
                    }`}>
                    Desi Ghee
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterProduct("honey");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      filterProduct === "honey" ? "font-bold text-[#8F6646]" : ""
                    }`}>
                    Raw Honey
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterProduct("pickle");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      filterProduct === "pickle" ? "font-bold text-[#8F6646]" : ""
                    }`}>
                    Pahadi Pickles
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterProduct("salt");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      filterProduct === "salt" ? "font-bold text-[#8F6646]" : ""
                    }`}>
                    Herbal Salts
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterProduct("spices");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      filterProduct === "spices" ? "font-bold text-[#8F6646]" : ""
                    }`}>
                    Pahadi Spices
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterProduct("dal");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      filterProduct === "dal" ? "font-bold text-[#8F6646]" : ""
                    }`}>
                    Organic Dals
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: SORT BY & RESULT COUNT */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenFilterMenu(openFilterMenu === "sort" ? null : "sort")
                }
                className="flex items-center gap-1 hover:text-black">
                <span className="text-gray-500">Sort by:</span>{" "}
                <span className="font-medium">
                  {sortBy === "relevance"
                    ? "Relevance"
                    : sortBy === "newest"
                    ? "Date, new to old"
                    : sortBy === "priceAsc"
                    ? "Price, low to high"
                    : "Price, high to low"}
                </span>
                <ChevronDownIcon className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {openFilterMenu === "sort" && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded py-1 z-30">
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("relevance");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      sortBy === "relevance" ? "font-bold text-[#8F6646]" : ""
                    }`}>
                    Relevance
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("newest");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      sortBy === "newest" ? "font-bold text-[#8F6646]" : ""
                    }`}>
                    Date, new to old
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("priceAsc");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      sortBy === "priceAsc" ? "font-bold text-[#8F6646]" : ""
                    }`}>
                    Price, low to high
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("priceDesc");
                      setOpenFilterMenu(null);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      sortBy === "priceDesc" ? "font-bold text-[#8F6646]" : ""
                    }`}>
                    Price, high to low
                  </button>
                </div>
              )}
            </div>

            <span className="text-gray-500 font-normal">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "result" : "results"}
            </span>
          </div>
        </div>

        {/* ─────────────── MATCHING PAGES & COLLECTIONS BAR (IF MATCHED) ─────────────── */}
        {matchingPages.length > 0 && (
          <div className="mb-10 p-4 sm:p-5 bg-[#fbfaf8] border border-gray-200 rounded-sm">
            <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4 text-[#8F6646]" />
                <h3 className="text-xs font-semibold tracking-wider text-gray-700 uppercase">
                  Matching Pages & Categories ({matchingPages.length})
                </h3>
              </div>
              <span className="text-xs text-[#8F6646] font-medium hidden sm:inline">
                Click any page to visit directly
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {matchingPages.slice(0, 6).map((pg) => (
                <div
                  key={pg.id}
                  onClick={() => navigate(pg.path)}
                  className="p-3 bg-white border border-gray-200 hover:border-[#8F6646] cursor-pointer transition-all flex items-center justify-between group shadow-sm hover:shadow">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F6646] block">
                      {pg.categoryLabel || pg.type}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-[#8F6646] group-hover:underline truncate block">
                      {pg.title}
                    </span>
                    <span className="text-[11px] font-mono text-[#315c3c] font-semibold truncate block mt-0.5">
                      {pg.fullUrl || `https://gharkaorganic.com${pg.path}`}
                    </span>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-[#8F6646] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────── DYNAMIC SECTION HEADER (MATCHING USER SCREENSHOT) ─────────────── */}
        <div className="mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 tracking-tight">
            {sectionHeader.title}
          </h2>
          {sectionHeader.subtitle && (
            <p className="mt-1 text-sm sm:text-base text-gray-500 font-light">
              {sectionHeader.subtitle}
            </p>
          )}
        </div>

        {/* ─────────────── PRODUCTS GRID (USING FULL PRODUCTCARD) ─────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 py-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-square bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-9 bg-gray-100 rounded w-full mt-2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12">
            {filteredProducts.map((prod, index) => (
              <ProductCard
                key={prod.id || index}
                product={prod}
                index={index}
                compact={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <h3 className="text-lg font-normal text-gray-800 mb-2">
              No results found for "{queryParam}"
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Check your spelling or use different keywords like "ghee", "honey", or "pickle".
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="px-5 py-2 border border-gray-400 hover:border-black text-xs font-semibold uppercase tracking-wider text-gray-900 transition-colors">
              View all products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
