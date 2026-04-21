import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

import { productSections } from "../homepage/config/productCollection";
import ProductSectionTabs from "./components/ProductSectionTabs";
import { useCollection } from "./Usecollection";
import Breadcrumb from "./components/NewBreadcrumb";
import SortDropdown from "../account/components/dropdown/SortDropdown";
import ProductGrid from "./components/ProductGrid";

/* ───────── CONSTANTS ───────── */
const BASE_URL = "https://gharkaorganic.com";
const BRAND_GREEN = "#0B8A52";
const INFINITE_SCROLL_MARGIN = "500px";
const CANONICAL = "https://gharkaorganic.com/shop/best-sellers";
const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A–Z" },
];

/* ───────── JSON-LD ───────── */
const JSONLD_WEBPAGE = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Best Selling Organic Products | Ghar Ka Organic",
  description:
    "Shop our most loved organic products from Uttarakhand Himalayas — A2 desi ghee, raw pahadi honey, pahadi pickles, and more. Trusted by thousands of customers across India.",
  url: CANONICAL,
  image:
    "https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/uttarakhand-desi-ghee_mhth1n.webp",
  inLanguage: "en-IN",
  isPartOf: {
    "@type": "WebSite",
    name: "Ghar Ka Organic",
    url: BASE_URL,
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Best Sellers",
        item: CANONICAL,
      },
    ],
  },
});

/* ───────── SKELETON ───────── */
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

/* ───────── SENTINEL HOOK ───────── */
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

/* ───────── COMPONENT ───────── */
const BestSellersPage = () => {
  const [sort, setSort] = useState("createdAt_desc");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const handleSortChange = useCallback((v) => setSort(v), []);

  /* ── 1. Fixed section — always "best" ── */
  const section = useMemo(
    () => productSections.find((s) => s.key === "new"), // ✅ FIXED — was "new"
    [],
  );

  /* ── 2. Data fetching ── */
  const {
    displayProducts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useCollection({
    collectionType: "new", // ✅ FIXED — was "new"
    sort,
    enabled: true,
  });

  /* ── 3. Infinite scroll ── */
  const handleSentinelIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const sentinelRef = useSentinel(handleSentinelIntersect, {
    enabled: hasNextPage && !isFetchingNextPage,
    rootMargin: INFINITE_SCROLL_MARGIN,
  });

  const productCount = displayProducts?.length ?? 0;

  return (
    <main className="min-h-screen bg-white">
      {/* ═══════════════════════════════════════════
          SEO — ALL signals Google needs to index
      ═══════════════════════════════════════════ */}
      <Helmet>
        {/* Core indexing signals */}
        <title>
          Best Selling Organic Products from Uttarakhand | Ghar Ka Organic
        </title>
        <meta
          name="description"
          content="Shop Ghar Ka Organic's best selling products — A2 desi ghee, raw pahadi honey, pickles, pulses and more from Uttarakhand Himalayas. 100% natural, farm-sourced, free shipping on ₹499+."
        />
        <link rel="canonical" href={CANONICAL} />
        {/* max-snippet etc. tells Google it can show rich snippets */}
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        {/* Geo signals — helps for Uttarakhand local SEO */}
        <meta name="geo.region" content="IN-UT" />
        <meta name="geo.placename" content="Uttarakhand, India" />
        <meta name="language" content="en-IN" />

        {/* Open Graph — required for Google rich results + sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Ghar Ka Organic" />
        <meta
          property="og:title"
          content="Best Selling Organic Products from Uttarakhand | Ghar Ka Organic"
        />
        <meta
          property="og:description"
          content="Our most loved organic products — A2 desi ghee, raw honey, pahadi pickles and more. Sourced directly from Uttarakhand Himalayas."
        />
        <meta property="og:url" content={CANONICAL} />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/uttarakhand-desi-ghee_mhth1n.webp"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Best selling organic products from Uttarakhand — Ghar Ka Organic"
        />
        <meta property="og:locale" content="en_IN" />
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/uttarakhand-desi-ghee_mhth1n.webp"
        />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Best Selling Organic Products | Ghar Ka Organic"
        />
        <meta
          name="twitter:description"
          content="Shop our most loved organic products from the Uttarakhand Himalayas."
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/uttarakhand-desi-ghee_mhth1n.webp"
        />

        {/* JSON-LD: CollectionPage + BreadcrumbList */}
        <script type="application/ld+json">{JSONLD_WEBPAGE}</script>
      </Helmet>

      {/* ═══════════════════════════════════════════
          HERO — Best Sellers specific
      ═══════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-green-50 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Best Sellers", href: "/shop/best-sellers" },
            ]}
          />
          <div className="mt-6 sm:flex sm:items-end sm:justify-between gap-8">
            <div>
              {/* Badge — signals this is a curated bestseller list */}
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ backgroundColor: "#E8F5EE", color: BRAND_GREEN }}>
                <span>★</span> Customer Favourites
              </span>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Best Selling Organic
                <br className="hidden sm:block" />
                Products from Uttarakhand
              </h1>

              <p className="mt-4 text-gray-600 text-sm sm:text-base max-w-xl leading-relaxed">
                Hand-picked by thousands of customers — our A2 desi ghee, raw
                pahadi honey, Himalayan pickles and more. Sourced directly from
                farms in Uttarakhand, delivered fresh to your door.
              </p>
            </div>

            {/* Trust checklist — desktop only */}
            <div className="hidden lg:flex flex-col gap-2 text-sm shrink-0">
              {[
                "100% natural & organic",
                "No preservatives or additives",
                "Directly from Uttarakhand farms",
                "15-day freshness guarantee",
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-gray-700">
                  <span
                    className="font-bold text-base"
                    style={{ color: BRAND_GREEN }}>
                    ✓
                  </span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── CATEGORY TABS ───────── */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductSectionTabs
            productSections={productSections}
            currentKey="best" // ✅ correct
          />
        </div>
      </div>

      {/* ───────── PRODUCT GRID ───────── */}
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
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900">
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

        {/* States */}
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
          <div className="py-16 px-4 bg-gray-50 rounded-2xl max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              Best Selling Organic Products
            </h2>
            <p className="mt-3 text-gray-600">
              Our most loved organic products from the Uttarakhand Himalayas.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              We are currently updating our best sellers inventory. Explore our
              full range of authentic organic products sourced directly from
              Uttarakhand. New items will be available soon.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="/collections" className="text-green-600 hover:underline">
                View All Collections
              </a>
              <a href="/" className="text-green-600 hover:underline">
                Go to Homepage
              </a>
            </div>
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

      {/* ═══════════════════════════════════════════
          WHY BEST SELLERS — keyword-rich editorial
          Google needs crawlable text to understand
          what this page is about beyond product tiles
      ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
        <div className="grid sm:grid-cols-3 gap-8 text-sm text-gray-600">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Why Customers Love These Products
            </h2>
            <p className="leading-relaxed">
              Our best sellers are the products customers come back for — pure
              A2 desi ghee churned by hand, raw pahadi honey harvested from
              Himalayan forests, and traditional pickles made with no
              preservatives.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Sourced from Uttarakhand Himalayas
            </h3>
            <p className="leading-relaxed">
              Every product in this collection comes directly from verified
              farmers in Uttarakhand — Kumaon and Garhwal regions. No middlemen,
              no chemicals, just pure mountain goodness.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Freshness &amp; Quality Guarantee
            </h3>
            <p className="leading-relaxed">
              Each order is dispatched within 48 hours. We stand behind every
              product with a 15-day freshness guarantee — if you're not
              satisfied, we'll make it right.
            </p>
          </div>
        </div>
      </section>

      {/* ───────── TRUST BAR ───────── */}
      <section
        className="py-8 text-white"
        style={{ backgroundColor: BRAND_GREEN }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-xs uppercase tracking-wider text-green-100 mt-1">
                Organic
              </div>
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
      </section>
    </main>
  );
};

export default BestSellersPage;
