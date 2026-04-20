/**
 * CollectionPage.jsx
 * Production-ready collection/category listing page.
 *
 * Route shapes handled:
 * /collections → "all" section
 * /collections/:slug → specific section (may redirect to canonical)
 * /:preferredSlug → canonical URL (e.g. /organic-rice)
 */

import { Navigate, useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { productSections } from "../homepage/config/productCollection";
import ProductSectionTabs from "./components/ProductSectionTabs";
import { preferredSlug, routeAliases } from "./utils/SECTIONKEY";
import { useCollection } from "./Usecollection";
import Breadcrumb from "./components/NewBreadcrumb";
import SortDropdown from "../account/components/dropdown/SortDropdown";
import ProductGrid from "./components/ProductGrid";

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────────── */

const BASE_URL = "https://gharkaorganic.com";
const BRAND_GREEN = "#0B8A52";

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A–Z" },
];

const INFINITE_SCROLL_MARGIN = "500px";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION MAP
───────────────────────────────────────────────────────────────────────────── */

const sectionMap = Object.fromEntries(productSections.map((s) => [s.key, s]));

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
const resolveSection = (param) => {
  if (!param) return sectionMap["all"] ?? null;

  // direct section key (rare but safe)
  if (sectionMap[param]) return sectionMap[param];

  // alias match
  const alias = routeAliases[param];
  if (alias && sectionMap[alias]) return sectionMap[alias];

  // fallback → all (instead of null for better UX)
  return null;
};

const buildCanonical = (sectionKey) => {
  if (!sectionKey || sectionKey === "all") return `${BASE_URL}/`;
  const slug = preferredSlug[sectionKey];
  return slug ? `${BASE_URL}/${slug}` : `${BASE_URL}/collections/${sectionKey}`;
};

const toRelativePath = (canonical) => canonical.replace(BASE_URL, "") || "/";

/* ─────────────────────────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────────────────────────── */

const useSentinel = (
  onIntersect,
  { enabled = true, rootMargin = "0px" } = {},
) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersect();
      },
      { rootMargin },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [onIntersect, enabled, rootMargin]);

  return ref;
};

/* ─────────────────────────────────────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────────────────────────────────────── */

const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 aspect-square rounded-xl mb-3" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

const GridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
    {[...Array(8)].map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────────────────── */

const CollectionPage = () => {
  const { slug: urlSlug } = useParams();
  const { pathname } = useLocation();

  const [sort, setSort] = useState("createdAt_desc");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const handleSortChange = useCallback((v) => setSort(v), []);

  /* ── 1. Resolve section ─────────────────────────────────────────────── */
  const isCollectionsRoot = pathname.startsWith("/collections");
  const section = useMemo(
    () => (isCollectionsRoot ? sectionMap["all"] : resolveSection(urlSlug)),
    [urlSlug, isCollectionsRoot],
  );

  /* ── 2. Canonical URLs ──────────────────────────────────────────────── */
  const canonical = useMemo(
    () => (section ? buildCanonical(section.key) : null),
    [section],
  );

  const preferredPath = useMemo(
    () => (canonical ? toRelativePath(canonical) : null),
    [canonical],
  );

  /* ── 4. Data fetching ───────────────────────────────────────────────── */
  const {
    displayProducts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useCollection({
    collectionType: section?.key ?? "all",
    sort,
    enabled: !!section,
  });

  /* ── 5. Infinite scroll ─────────────────────────────────────────────── */
  const handleSentinelIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const sentinelRef = useSentinel(handleSentinelIntersect, {
    enabled: hasNextPage && !isFetchingNextPage,
    rootMargin: INFINITE_SCROLL_MARGIN,
  });

  /* ── 6. Early returns ───────────────────────────────────────────────── */

  if (!section) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Page not found
          </h1>
          <p className="text-gray-500">
            The collection you're looking for doesn't exist.
          </p>
        </div>
      </main>
    );
  }

  /* ── 7. Render ──────────────────────────────────────────────────────── */
  const productCount = displayProducts?.length ?? 0;

  return (
    <main className="min-h-screen bg-white">
      <Helmet>
        {/* Robots */}
        <meta
          name="robots"
          content={productCount === 0 ? "noindex, follow" : "index, follow"}
        />

        {/* Title + Description */}
        <title>{section.seoTitle}</title>
        {section.seoDescription && (
          <meta name="description" content={section.seoDescription} />
        )}

        {/* Canonical */}
        <link rel="canonical" href={canonical} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={section.seoTitle} />
        <meta property="og:description" content={section.seoDescription} />
        <meta property="og:url" content={canonical} />

        {/* OG IMAGE (your cloudinary one) */}
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/uttarakhand-desi-ghee_mhth1n.webp"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/uttarakhand-desi-ghee_mhth1n.webp"
        />
      </Helmet>

      {/* Hero Banner */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: section.title, href: canonical },
            ]}
          />
          <div className="mt-6 text-center sm:text-left">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {section.title} from Uttarakhand Himalayas{" "}
            </h1>
            {section.seoDescription && (
              <p className="mt-3 text-gray-600 text-sm sm:text-base max-w-2xl">
                {section.seoDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductSectionTabs
            productSections={productSections}
            currentKey={section.key}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">
                {isLoading ? "..." : productCount}
              </span>{" "}
              {productCount === 1 ? "product" : "products"}
            </p>
            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
              style={{ "--tw-ring-color": BRAND_GREEN }}>
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              Filters
            </button>
          </div>
          <SortDropdown
            options={SORT_OPTIONS}
            value={sort}
            onChange={handleSortChange}
          />
        </div>

        {/* Products */}
        {isLoading && productCount === 0 ? (
          <GridSkeleton />
        ) : isError ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <p className="text-gray-500 font-medium">Failed to load products</p>
            <p className="text-sm text-gray-400 mt-1">
              Please refresh the page
            </p>
          </div>
        ) : productCount === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <p className="text-gray-700 font-medium">No products found</p>
            <p className="text-sm text-gray-500 mt-1">
              Try a different category or check back later
            </p>
          </div>
        ) : (
          <>
            <ProductGrid
              isLoading={false}
              isError={false}
              displayProducts={displayProducts}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              sentinelRef={sentinelRef}
            />
            {isFetchingNextPage && (
              <div className="mt-8">
                <GridSkeleton />
              </div>
            )}
          </>
        )}
      </div>

      {/* Trust Bar */}
      <section
        className="mt-12 py-8 text-white"
        style={{ backgroundColor: BRAND_GREEN }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-xs uppercase tracking-wider text-green-100 mt-1">
                Organic
              </div>
              <div>
                <div className="text-2xl font-bold">48hr</div>
                <div className="text-xs uppercase tracking-wider text-green-100 mt-1">
                  Dispatch
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">15 Days</div>
                <div className="text-xs uppercase tracking-wider text-green-100 mt-1">
                  Guarantee
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">Free</div>
                <div className="text-xs uppercase tracking-wider text-green-100 mt-1">
                  Shipping ₹499+
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CollectionPage;
