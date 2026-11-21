import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  collection,
  query,
  limit,
  startAfter,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../../../../config/firebaseDB";
import {
  SlidersHorizontal,
  Grid2X2,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  ArrowUpDown,
} from "lucide-react";
import ProductCard from "../../../components/cards/ProductCard";

/* ─────────────────────────────────────
   CONSTANTS
───────────────────────────────────── */
const SITE_URL = "https://gharkaorganic.com";
const OG_IMAGE =
  "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790511602/gharka-organic/products/oqkqmdl1gul3fapq2vvc.jpg";
const PAGE_SIZE = 20;
const collectionRef = collection(db, "storeProducts");

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A–Z" },
];

const SIZES = ["100g", "200g", "400g", "500g", "200ml", "Standard"];

const PRICE_RANGES = [
  { label: "Under ₹150", min: 0, max: 149 },
  { label: "₹150 – ₹299", min: 150, max: 299 },
  { label: "₹300 – ₹499", min: 300, max: 499 },
  { label: "Above ₹499", min: 500, max: Infinity },
];

const MERCHANT_RETURN_POLICY = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "IN",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 7,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/FreeReturn",
};

const OFFER_SHIPPING_DETAILS = {
  "@type": "OfferShippingDetails",
  shippingRate: {
    "@type": "MonetaryAmount",
    value: "0.00",
    currency: "INR",
  },
  shippingDestination: {
    "@type": "DefinedRegion",
    addressCountry: "IN",
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: 0,
      maxValue: 1,
      unitCode: "DAY",
    },
    transitTime: {
      "@type": "QuantitativeValue",
      minValue: 4,
      maxValue: 7,
      unitCode: "DAY",
    },
  },
};

/* ─────────────────────────────────────
   HELPERS
───────────────────────────────────── */
const sortProducts = (products, sortValue) => {
  const arr = [...products];
  switch (sortValue) {
    case "price_asc":
      return arr.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    case "price_desc":
      return arr.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    case "name_asc":
      return arr.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    case "createdAt_desc":
    default:
      return arr.sort((a, b) => {
        const ta = a.createdAt?.seconds ?? 0;
        const tb = b.createdAt?.seconds ?? 0;
        return tb - ta;
      });
  }
};

const applyClientFilters = (products, filters) => {
  return products.filter((p) => {
    if (filters.categories.length > 0) {
      const cat = (p.category ?? "").toLowerCase();
      if (!filters.categories.some((c) => cat.includes(c.toLowerCase())))
        return false;
    }
    if (filters.sizes.length > 0) {
      const pSizes = [...(p.sizes ?? []), ...(p.availableSizes ?? []), p.size]
        .filter(Boolean)
        .map((s) => String(s).toLowerCase());
      if (!filters.sizes.some((s) => pSizes.includes(String(s).toLowerCase())))
        return false;
    }
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      const priceVal = Number(p.price || 0);
      if (priceVal < min || priceVal > max) return false;
    }
    if (filters.inStock) {
      if (p.stock === 0 || p.inStock === false) return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack =
        `${p.name ?? ""} ${p.category ?? ""} ${p.description ?? ""} ${p.ingredients ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
};

/* ─────────────────────────────────────
   FILTER ACCORDION ITEM
───────────────────────────────────── */
const FilterSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left cursor-pointer">
        <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-gray-700">
          {title}
        </span>
        {open ? (
          <ChevronUp size={14} className="text-gray-400" />
        ) : (
          <ChevronDown size={14} className="text-gray-400" />
        )}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
};

/* ─────────────────────────────────────
   FILTER SIDEBAR
───────────────────────────────────── */
const FilterSidebar = ({
  filters,
  setFilters,
  allCategories,
  onClose,
  isMobile,
}) => {
  const toggle = (key, value) =>
    setFilters((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });

  const clearAll = () =>
    setFilters({
      categories: [],
      sizes: [],
      priceRange: null,
      inStock: false,
      search: "",
    });

  const activeCount =
    filters.categories.length +
    filters.sizes.length +
    (filters.priceRange ? 1 : 0) +
    (filters.inStock ? 1 : 0);

  return (
    <div
      className={`bg-white flex flex-col h-full ${
        isMobile ? "w-full" : "w-[220px] lg:w-[240px] flex-shrink-0"
      }`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-gray-500" />
          <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-gray-800">
            Filters
          </span>
          {activeCount > 0 && (
            <span className="rounded-full bg-[#315c3c] px-1.5 py-0.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-[11px] font-semibold text-[#315c3c] hover:underline cursor-pointer">
              Clear all
            </button>
          )}
          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="cursor-pointer">
              <X size={18} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        {allCategories.length > 0 && (
          <FilterSection title="Category" defaultOpen>
            <div className="flex flex-col gap-2">
              {allCategories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat)}
                    onChange={() => toggle("categories", cat)}
                    className="h-3.5 w-3.5 cursor-pointer accent-[#315c3c]"
                  />
                  <span className="text-[12px] text-gray-600 group-hover:text-gray-900 capitalize">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        <FilterSection title="Pack Size" defaultOpen>
          <div className="flex flex-wrap gap-1.5">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggle("sizes", s)}
                className={`text-[11px] font-semibold px-2.5 py-1 border transition-colors duration-200 cursor-pointer ${
                  filters.sizes.includes(s)
                    ? "border-[#315c3c] bg-[#315c3c] text-white"
                    : "border-gray-200 text-gray-600 hover:border-[#315c3c] hover:text-[#315c3c]"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Price">
          <div className="flex flex-col gap-2">
            {PRICE_RANGES.map((r) => (
              <label
                key={r.label}
                className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="price"
                  checked={
                    filters.priceRange?.min === r.min &&
                    filters.priceRange?.max === r.max
                  }
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange:
                        prev.priceRange?.min === r.min
                          ? null
                          : { min: r.min, max: r.max },
                    }))
                  }
                  className="cursor-pointer accent-[#315c3c]"
                />
                <span className="text-[12px] text-gray-600 group-hover:text-gray-900">
                  {r.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Availability">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={() =>
                setFilters((prev) => ({ ...prev, inStock: !prev.inStock }))
              }
              className="h-3.5 w-3.5 cursor-pointer accent-[#315c3c]"
            />
            <span className="text-[12px] text-gray-600">In stock only</span>
          </label>
        </FilterSection>
      </div>

      {isMobile && (
        <div className="px-4 py-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-[#315c3c] py-3 text-[12px] font-bold uppercase tracking-widest text-white cursor-pointer">
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────
   SKELETON CARD
───────────────────────────────────── */
const SkeletonCard = () => (
  <div className="flex flex-col w-full animate-pulse">
    <div className="w-full aspect-square bg-[#f4f2e9] rounded-2xl sm:rounded-none" />
    <div className="mt-3 sm:mt-4 space-y-2">
      <div className="h-4 bg-[#f4f2e9] rounded w-4/5" />
      <div className="h-3.5 bg-[#f4f2e9] rounded w-1/2" />
      <div className="h-4 bg-[#f4f2e9] rounded w-1/3" />
      <div className="h-8 bg-[#f4f2e9] rounded w-full mt-2" />
    </div>
  </div>
);

/* ─────────────────────────────────────
   ACTIVE FILTER CHIPS
───────────────────────────────────── */
const ActiveChips = ({ filters, setFilters }) => {
  const chips = [
    ...filters.categories.map((c) => ({
      label: c,
      remove: () =>
        setFilters((p) => ({
          ...p,
          categories: p.categories.filter((x) => x !== c),
        })),
    })),
    ...filters.sizes.map((s) => ({
      label: `Pack: ${s}`,
      remove: () =>
        setFilters((p) => ({ ...p, sizes: p.sizes.filter((x) => x !== s) })),
    })),
    ...(filters.priceRange
      ? [
          {
            label:
              PRICE_RANGES.find(
                (r) =>
                  r.min === filters.priceRange.min &&
                  r.max === filters.priceRange.max,
              )?.label ?? "Price",
            remove: () => setFilters((p) => ({ ...p, priceRange: null })),
          },
        ]
      : []),
    ...(filters.inStock
      ? [
          {
            label: "In stock",
            remove: () => setFilters((p) => ({ ...p, inStock: false })),
          },
        ]
      : []),
  ];

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map((chip, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 border border-[#d6e8d8] bg-[#edf5ee] px-2.5 py-1 text-[11px] font-semibold text-[#315c3c]">
          {chip.label}
          <button
            type="button"
            onClick={chip.remove}
            aria-label={`Remove ${chip.label}`}
            className="cursor-pointer">
            <X size={11} />
          </button>
        </span>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────
   MAIN PAGE
───────────────────────────────────── */
const ProductListPage = () => {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";

  const [allFetched, setAllFetched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [gridCols, setGridCols] = useState(4);
  const [sort, setSort] = useState("createdAt_desc");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [filters, setFilters] = useState({
    categories: categorySlug ? [categorySlug] : [],
    sizes: [],
    priceRange: null,
    inStock: false,
    search: queryParam,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categories: categorySlug ? [categorySlug] : [],
    }));
  }, [categorySlug]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: queryParam,
    }));
  }, [queryParam]);

  const cursorRef = useRef(null);
  const hasMoreRef = useRef(true);

  const allCategories = useMemo(() => {
    const cats = new Set(allFetched.map((p) => p.category).filter(Boolean));
    return [...cats].sort();
  }, [allFetched]);

  const displayProducts = useMemo(() => {
    const filtered = applyClientFilters(allFetched, filters);
    return sortProducts(filtered, sort);
  }, [allFetched, filters, sort]);

  const fetchProducts = useCallback(
    async (isFirstLoad = false) => {
      if (isFirstLoad) {
        setLoading(true);
        setFetchError("");
        cursorRef.current = null;
        hasMoreRef.current = true;
        setHasMore(true);
      } else {
        if (!hasMoreRef.current) return;
        setLoadingMore(true);
      }

      try {
        const constraints = [];
        if (categorySlug) {
          constraints.push(where("category", "==", categorySlug));
        }

        if (cursorRef.current) {
          constraints.push(startAfter(cursorRef.current));
        }
        constraints.push(limit(PAGE_SIZE));

        const snap = await getDocs(query(collectionRef, ...constraints));

        const docs = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter(
            (product) =>
              product.isDeleted !== true && product.isActive !== false,
          );

        cursorRef.current = snap.docs[snap.docs.length - 1] ?? null;
        const moreAvailable = snap.docs.length === PAGE_SIZE;
        hasMoreRef.current = moreAvailable;
        setHasMore(moreAvailable);

        setAllFetched((prev) => (isFirstLoad ? docs : [...prev, ...docs]));
      } catch (err) {
        console.error("[ProductListPage] fetch error:", err);
        setFetchError("We couldn't load products. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [categorySlug],
  );

  useEffect(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasMore &&
          !loadingMore &&
          !loading &&
          !fetchError
        ) {
          fetchProducts(false);
        }
      },
      { rootMargin: "300px" },
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, loading, fetchError, fetchProducts]);

  useEffect(() => {
    if (!showSortMenu) return;
    const handler = () => setShowSortMenu(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [showSortMenu]);

  const pageTitle = categorySlug
    ? categorySlug.charAt(0).toUpperCase() +
      categorySlug.slice(1).replace(/-/g, " ")
    : "Ghar Ka Organic Products";

  const canonicalUrl = categorySlug
    ? `${SITE_URL}/category/${categorySlug}`
    : `${SITE_URL}/products`;

  const collectionSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${canonicalUrl}#webpage`,
          name: `${pageTitle} | Ghar Ka Organic`,
          description:
            "Shop Ghar Ka Organic products from Uttarakhand — Mirch Ka Achar (Green Chilly Pickle), natural raw honey, and Pahadi Salt with free shipping across India.",
          url: canonicalUrl,
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: { "@id": `${SITE_URL}/#organization` },
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `${SITE_URL}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: pageTitle,
              item: canonicalUrl,
            },
          ],
        },
        {
          "@type": "ItemList",
          "@id": `${canonicalUrl}#itemlist`,
          name: pageTitle,
          itemListElement: displayProducts.slice(0, 12).map((p, idx) => {
            const pUrl = `${SITE_URL}/product/${p.slug || p.id}`;
            const itemNode = {
              "@type": "Product",
              name: p.name,
              url: pUrl,
              image: p.banner || p.images?.[0] || OG_IMAGE,
              brand: { "@type": "Brand", name: "Ghar Ka Organic" },
            };
            if (Number(p.price) > 0) {
              itemNode.offers = {
                "@type": "Offer",
                url: pUrl,
                priceCurrency: "INR",
                price: Number(p.price).toFixed(2),
                availability:
                  Number(p.stock ?? 1) > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                itemCondition: "https://schema.org/NewCondition",
                hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
                shippingDetails: OFFER_SHIPPING_DETAILS,
              };
            }
            return {
              "@type": "ListItem",
              position: idx + 1,
              url: pUrl,
              name: p.name,
              item: itemNode,
            };
          }),
        },
      ],
    }),
    [canonicalUrl, pageTitle, displayProducts],
  );

  const gridClass = {
    2: "grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12",
    3: "grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 md:gap-x-10",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 md:gap-x-10 lg:gap-x-12 xl:gap-x-14 lg:gap-y-14",
  }[gridCols];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Helmet>
        <title>{`${pageTitle} | Ghar Ka Organic`}</title>
        <meta
          name="description"
          content="Shop Ghar Ka Organic products from Uttarakhand — Mirch Ka Achar (Green Chilly Pickle), natural raw honey, and Pahadi Salt. Free shipping across India."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Ghar Ka Organic" />
        <meta property="og:title" content={`${pageTitle} | Ghar Ka Organic`} />
        <meta
          property="og:description"
          content="Authentic Himalayan organic food products from Uttarakhand with free shipping across India."
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:locale" content="en_IN" />
        <script type="application/ld+json">
          {JSON.stringify(collectionSchema)}
        </script>
      </Helmet>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="w-[80vw] max-w-[320px] h-full bg-white shadow-xl overflow-hidden flex flex-col">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              allCategories={allCategories}
              onClose={() => setShowMobileFilters(false)}
              isMobile
            />
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-0">
        <p className="text-[11px] text-gray-400 font-medium">
          <Link to="/" className="hover:text-gray-700">
            Home
          </Link>{" "}
          / <span className="text-gray-600">{pageTitle}</span>
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex gap-0 px-4 sm:px-6 lg:px-8 pt-4">
        {/* Sidebar (desktop only) */}
        <div className="hidden lg:flex flex-col mr-8 flex-shrink-0 w-[220px]">
          <div className="sticky top-4">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              allCategories={allCategories}
              onClose={() => {}}
              isMobile={false}
            />
          </div>
        </div>

        {/* Products Column */}
        <div className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-1.5 border border-gray-200 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-700 hover:border-gray-400 transition-colors cursor-pointer">
                <SlidersHorizontal size={13} />
                Filter
                {filters.categories.length +
                  filters.sizes.length +
                  (filters.priceRange ? 1 : 0) +
                  (filters.inStock ? 1 : 0) >
                  0 && (
                  <span className="ml-1 rounded-full bg-[#315c3c] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                    {filters.categories.length +
                      filters.sizes.length +
                      (filters.priceRange ? 1 : 0) +
                      (filters.inStock ? 1 : 0)}
                  </span>
                )}
              </button>

              <div className="relative hidden sm:block">
                <h1 className="text-[18px] sm:text-[22px] font-black uppercase tracking-tight text-gray-900 leading-none">
                  {pageTitle}
                </h1>
                <div
                  className="absolute -bottom-1 left-0 h-[6px] w-full opacity-40 -z-10"
                  style={{ background: "#315c3c", borderRadius: 6 }}
                />
              </div>

              {!loading && (
                <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">
                  {displayProducts.length} products
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, search: e.target.value }))
                  }
                  className="w-[130px] border border-gray-200 py-2 pl-7 pr-3 text-[11px] transition-colors focus:border-[#315c3c] focus:outline-none sm:w-[180px]"
                />
              </div>

              <div className="hidden sm:flex border border-gray-200 divide-x divide-gray-200">
                {[
                  { cols: 2, Icon: List },
                  { cols: 3, Icon: Grid2X2 },
                  { cols: 4, Icon: LayoutGrid },
                ].map(({ cols, Icon }) => (
                  <button
                    key={cols}
                    type="button"
                    onClick={() => setGridCols(cols)}
                    className={`p-2 transition-colors cursor-pointer ${
                      gridCols === cols
                        ? "bg-[#315c3c] text-white"
                        : "text-gray-400 hover:text-gray-700"
                    }`}>
                    {React.createElement(Icon, { size: 14 })}
                  </button>
                ))}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSortMenu((v) => !v);
                  }}
                  className="flex items-center gap-1.5 border border-gray-200 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-700 hover:border-gray-400 transition-colors cursor-pointer">
                  <ArrowUpDown size={13} />
                  <span className="hidden sm:inline">
                    {SORT_OPTIONS.find((o) => o.value === sort)?.label ??
                      "Sort"}
                  </span>
                  <span className="sm:hidden">Sort</span>
                </button>
                {showSortMenu && (
                  <div
                    className="absolute right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg z-30 w-[190px]"
                    onClick={(e) => e.stopPropagation()}>
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setSort(opt.value);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[12px] hover:bg-gray-50 transition-colors cursor-pointer ${
                          sort === opt.value
                            ? "font-bold text-[#315c3c]"
                            : "text-gray-600"
                        }`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sm:hidden mb-3 relative w-fit">
            <h1 className="text-[20px] font-black uppercase tracking-tight text-gray-900 leading-none">
              {pageTitle}
            </h1>
            <div
              className="absolute -bottom-0.5 left-0 h-[5px] w-full opacity-40 -z-10"
              style={{ background: "#315c3c" }}
            />
          </div>

          <ActiveChips filters={filters} setFilters={setFilters} />

          {loading ? (
            <div className={`grid ${gridClass}`}>
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : fetchError ? (
            <div
              className="flex flex-col items-center justify-center py-24 text-center"
              role="alert">
              <p className="text-[15px] font-bold text-gray-800 mb-1">
                Products couldn&apos;t load
              </p>
              <p className="text-[13px] text-gray-500 mb-5">{fetchError}</p>
              <button
                type="button"
                onClick={() => fetchProducts(true)}
                className="rounded-lg bg-[#315c3c] px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-white cursor-pointer">
                Try again
              </button>
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-[15px] font-bold text-gray-800 mb-1">
                No products found
              </p>
              <p className="text-[13px] text-gray-400 mb-5">
                Try adjusting your filters or search term
              </p>
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    categories: [],
                    sizes: [],
                    priceRange: null,
                    inStock: false,
                    search: "",
                  })
                }
                className="rounded-lg bg-[#315c3c] px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-white cursor-pointer">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className={`grid ${gridClass}`}>
                {displayProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id || idx}
                    product={product}
                    index={idx}
                  />
                ))}
              </div>

              {loadingMore && (
                <div className={`grid ${gridClass} mt-10`}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              <div ref={sentinelRef} className="h-1" />

              {!hasMore && displayProducts.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-300">
                    &mdash; End of results &mdash;
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
