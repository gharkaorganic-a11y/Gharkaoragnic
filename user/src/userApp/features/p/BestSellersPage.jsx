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
  { value: "popularity_desc", label: "Most Popular" },
];

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

  /* ── 1. Correct section key ── */
  const section = useMemo(
    () => productSections.find((s) => s.key === "new"),
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
    collectionType: "new",
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

  /* ── 4. JSON-LD with ItemList for products ── */
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": CANONICAL,
          name: "Best Selling Organic Products | Ghar Ka Organic",
          description:
            "Shop our most loved organic products from Uttarakhand Himalayas — A2 desi ghee, raw pahadi honey, pahadi pickles, and more. Trusted by thousands across India.",
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
        },
        {
          "@type": "ItemList",
          name: "Best Selling Organic Products",
          itemListElement:
            displayProducts?.slice(0, 10).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${BASE_URL}/products/${p.slug}`,
              name: p.name,
            })) || [],
        },
      ],
    }),
    [displayProducts],
  );

  return (
    <main className="min-h-screen bg-white">
      {/* ═══════════════════════════════════════════
          SEO — INDEXING SIGNALS
      ═══════════════════════════════════════════ */}
      <Helmet>
        <title>
          Best Selling Organic Products from Uttarakhand | Ghar Ka Organic
        </title>
        <meta
          name="description"
          content="Shop Ghar Ka Organic's best sellers — A2 desi ghee, raw pahadi honey, pickles & more from Uttarakhand Himalayas. 100% natural, farm-sourced. Free shipping ₹499+."
        />
        <link rel="canonical" href={CANONICAL} />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        {/* Geo + Language */}
        <meta name="geo.region" content="IN-UT" />
        <meta name="geo.placename" content="Uttarakhand, India" />
        <meta name="language" content="en-IN" />

        {/* Open Graph */}
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

        {/* Twitter */}
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

        {/* Preload LCP image */}
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/uttarakhand-desi-ghee_mhth1n.webp"
        />

        {/* JSON-LD: CollectionPage + ItemList + Breadcrumb */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-green-50/70 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Best Sellers", href: "/shop/best-sellers" },
            ]}
          />
          <div className="mt-6 sm:mt-8 grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ backgroundColor: "#E8F5EE", color: BRAND_GREEN }}>
                ★ Customer Favourites
              </span>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Best Selling Organic Products from Uttarakhand
              </h1>

              <p className="mt-4 text-gray-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                Hand-picked by thousands of families — pure A2 Badri ghee, raw
                forest honey, traditional pahadi pickles, and Himalayan spices.
                Sourced directly from women-led farms in Uttarakhand, delivered
                fresh to your door.
              </p>
            </div>

            {/* Trust checklist */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Why Our Best Sellers?
                </p>
                <ul className="space-y-2.5 text-sm">
                  {[
                    "100% natural & chemical-free",
                    "No preservatives or additives",
                    "Directly from Uttarakhand farms",
                    "15-day freshness guarantee",
                  ].map((text) => (
                    <li
                      key={text}
                      className="flex items-start gap-2 text-gray-700">
                      <span
                        className="font-bold text-base mt-0.5"
                        style={{ color: BRAND_GREEN }}>
                        ✓
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── CATEGORY TABS ───────── */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductSectionTabs
            productSections={productSections}
            currentKey="best"
          />
        </div>
      </div>

      {/* ───────── PRODUCT GRID ───────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h2 className="sr-only">Products</h2>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">
                {isLoading ? "..." : productCount}
              </span>{" "}
              {productCount === 1 ? "product" : "products"}
            </p>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
              aria-label="Open filters">
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
              We're updating our best sellers inventory. Explore our full range
              of authentic organic products sourced directly from Uttarakhand.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <a
                href="/all-products"
                className="text-green-700 hover:underline font-medium">
                View All Collections
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="/"
                className="text-green-700 hover:underline font-medium">
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
          EDITORIAL SEO BLOCK - CRITICAL FOR INDEXING
          Google needs crawlable text, not just tiles
      ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why These Are Our Best Selling Organic Products
          </h2>
          <div className="prose prose-sm text-gray-600 max-w-none space-y-4">
            <p>
              <strong>Ghar Ka Organic’s best sellers</strong> represent the
              products our customers trust and reorder most — pure{" "}
              <strong>A2 Badri Desi Ghee</strong> churned using the traditional
              bilona method, <strong>raw forest honey</strong> harvested from
              Himalayan wildflowers, and <strong>pahadi pickles</strong> made
              with age-old Kumaoni recipes without preservatives or artificial
              vinegar.
            </p>
            <p>
              Every item is{" "}
              <strong>
                sourced directly from women-led farmer groups in Uttarakhand
              </strong>
              across Kumaon and Garhwal regions. We work with communities in
              Bhimtal, Almora, and Pithoragarh who use chemical-free,
              small-batch methods passed down generations. No middlemen, no cold
              storage — just fresh produce from the Himalayas to your kitchen.
            </p>
            <h3 className="text-lg font-semibold text-gray-900!mb-2">
              Freshness & Quality Promise
            </h3>
            <p>
              All best seller orders are packed within 48 hours of your order
              and ship with our
              <strong> 15-day freshness guarantee</strong>. If you’re not
              satisfied with the aroma, taste, or quality, we’ll replace it or
              refund you — no questions asked. Free shipping across India on
              orders above ₹499.
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
                Organic Certified
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">48hr</div>
              <div className="text-xs uppercase tracking-wider text-green-100 mt-1">
                Dispatch Time
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
