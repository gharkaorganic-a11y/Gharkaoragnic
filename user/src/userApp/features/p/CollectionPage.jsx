/**
 * CollectionPage.jsx
 * Production-ready collection/category listing page.
 *
 * Route shapes handled:
 * /collections → "all" section (canonical: /collections NOT /)
 * /collections/:slug → specific section
 * /:preferredSlug → canonical URL (e.g. /organic-rice)
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  AdjustmentsHorizontalIcon,
  CheckBadgeIcon,
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
const INFINITE_SCROLL_MARGIN = "500px";

const SORT_OPTIONS = [
  { value: "popularity_desc", label: "Most Popular" },
  { value: "createdAt_desc", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A–Z" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION MAP
───────────────────────────────────────────────────────────────────────────── */

const sectionMap = Object.fromEntries(productSections.map((s) => [s.key, s]));

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */

const resolveSection = (param) => {
  if (!param) return sectionMap["all"] ?? null;
  if (sectionMap[param]) return sectionMap[param];
  const alias = routeAliases[param];
  if (alias && sectionMap[alias]) return sectionMap[alias];
  return null;
};

const buildCanonical = (sectionKey) => {
  if (!sectionKey || sectionKey === "all") return `${BASE_URL}/collections`;
  const slug = preferredSlug[sectionKey];
  return slug ? `${BASE_URL}/${slug}` : `${BASE_URL}/collections/${sectionKey}`;
};

const toRelativePath = (canonical) =>
  canonical.replace(BASE_URL, "") || "/collections";

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

  const [sort, setSort] = useState("popularity_desc");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const handleSortChange = useCallback((v) => setSort(v), []);

  /* ── 1. Resolve section ─────────────────────────────────────────────── */
  const isCollectionsRoot =
    pathname === "/collections" || pathname === "/collections/";
  const section = useMemo(
    () => (isCollectionsRoot ? sectionMap["all"] : resolveSection(urlSlug)),
    [urlSlug, isCollectionsRoot],
  );

  /* ── 2. Canonical + preferred path ─────────────────────────────────── */
  const canonical = useMemo(
    () => (section ? buildCanonical(section.key) : null),
    [section],
  );

  const preferredPath = useMemo(
    () => (canonical ? toRelativePath(canonical) : null),
    [canonical],
  );

  /* ── 3. Data fetching ───────────────────────────────────────────────── */
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

  /* ── 4. Infinite scroll ─────────────────────────────────────────────── */
  const handleSentinelIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const sentinelRef = useSentinel(handleSentinelIntersect, {
    enabled: hasNextPage && !isFetchingNextPage,
    rootMargin: INFINITE_SCROLL_MARGIN,
  });

  /* ── 5. 404 state ───────────────────────────────────────────────────── */
  if (!section) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <Helmet>
          <title>Page Not Found | Ghar Ka Organic</title>
          <meta name="robots" content="noindex, follow" />
          <meta
            name="description"
            content="The page you're looking for does not exist. Explore organic products from Uttarakhand Himalayas."
          />
        </Helmet>
        <div className="text-center max-w-lg px-4">
          <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-gray-500 mt-3">
            The collection you're looking for doesn't exist or may have been
            removed.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href="/"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Go to Homepage
            </a>
            <a
              href="/collections"
              className="text-green-600 font-medium hover:underline">
              Browse All Collections
            </a>
          </div>
        </div>
      </main>
    );
  }

  /* ── 6. Render ──────────────────────────────────────────────────────── */
  const productCount = displayProducts?.length ?? 0;
  const isAllSection = section.key === "all";

  /* Build JSON-LD with ItemList + Product + FAQ for rich results */
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": canonical,
          name: section.seoTitle ?? section.title,
          description: section.seoDescription ?? "",
          url: canonical,
          image:
            section.bannerImage ||
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
                name: section.title,
                item: canonical,
              },
            ],
          },
        },
        {
          "@type": "ItemList",
          name: `${section.title} - Product List`,
          itemListElement:
            displayProducts?.slice(0, 24).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${BASE_URL}/products/${p.slug}`,
              item: {
                "@type": "Product",
                name: p.name,
                image: p.image,
                description: p.description?.substring(0, 160),
                sku: p.sku || p.slug,
                brand: { "@type": "Brand", name: "Ghar Ka Organic" },
                offers: {
                  "@type": "Offer",
                  price: String(p.price),
                  priceCurrency: "INR",
                  availability: p.inStock
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                  url: `${BASE_URL}/products/${p.slug}`,
                },
                ...(p.rating && {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: String(p.rating),
                    reviewCount: String(p.reviewCount || 1),
                  },
                }),
              },
            })) || [],
        },
        {
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: `Is ${section.title} from Ghar Ka Organic 100% natural?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: `Yes, all ${section.title.toLowerCase()} from Ghar Ka Organic are sourced directly from verified farmers in Uttarakhand. We use no preservatives, chemicals, or artificial additives.`,
              },
            },
            {
              "@type": "Question",
              name: "What is the delivery time for Uttarakhand products?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We dispatch all orders within 48 hours. Delivery across India takes 3-7 business days. Free shipping on orders above ₹499.",
              },
            },
            {
              "@type": "Question",
              name: "Do you offer a freshness guarantee?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, we offer a 15-day freshness guarantee. If you're not satisfied with the quality, we’ll replace it or refund you.",
              },
            },
          ],
        },
      ],
    }),
    [section, canonical, displayProducts],
  );

  return (
    <main className="min-h-screen bg-white">
      {/* ═══════════════════════════════════════════
          SEO — INDEXING SIGNALS
      ═══════════════════════════════════════════ */}
      <Helmet>
        <title>{section.seoTitle}</title>
        {section.seoDescription && (
          <meta name="description" content={section.seoDescription} />
        )}
        <link rel="canonical" href={canonical} />
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
        <meta property="og:title" content={section.seoTitle} />
        <meta property="og:url" content={canonical} />
        <meta property="og:locale" content="en_IN" />
        {section.seoDescription && (
          <meta property="og:description" content={section.seoDescription} />
        )}
        <meta
          property="og:image"
          content={
            section.bannerImage ||
            "https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/uttarakhand-desi-ghee_mhth1n.webp"
          }
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content={`${section.title} — Ghar Ka Organic`}
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={section.seoTitle} />
        {section.seoDescription && (
          <meta name="twitter:description" content={section.seoDescription} />
        )}
        <meta
          name="twitter:image"
          content={
            section.bannerImage ||
            "https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/uttarakhand-desi-ghee_mhth1n.webp"
          }
        />

        {/* Preload LCP */}
        {section.bannerImage && (
          <link rel="preload" as="image" href={section.bannerImage} />
        )}

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* ───────── HERO BANNER ───────── */}
      <section className="bg-gradient-to-b from-green-50/60 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: section.title, href: canonical },
            ]}
          />
          <div className="mt-6 sm:mt-8 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ backgroundColor: "#E8F5EE", color: BRAND_GREEN }}>
                <CheckBadgeIcon className="w-4 h-4" /> From Uttarakhand Farms
              </span>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {section.title} from Uttarakhand Himalayas
              </h1>
              {section.seoDescription && (
                <p className="mt-4 text-gray-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                  {section.seoDescription}
                </p>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Why Choose Us
                </p>
                <ul className="space-y-3 text-sm">
                  {[
                    "100% natural & chemical-free",
                    "Directly from Uttarakhand farmers",
                    "48hr dispatch, 15-day guarantee",
                    "Free shipping on orders ₹499+",
                  ].map((text) => (
                    <li
                      key={text}
                      className="flex items-start gap-2.5 text-gray-700">
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
            currentKey={section.key}
          />
        </div>
      </div>

      {/* ───────── PRODUCT GRID ───────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h2 className="sr-only">Product List</h2>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">
                {isLoading ? "..." : productCount}
              </span>{" "}
              {productCount === 1 ? "product" : "products"} found
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
              {section.title}
            </h2>
            {section.seoDescription && (
              <p className="mt-3 text-gray-600">{section.seoDescription}</p>
            )}
            <p className="mt-4 text-sm text-gray-500">
              We're updating inventory for this category. Explore our range of
              authentic organic products from the Uttarakhand Himalayas. New
              items coming soon.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <a
                href="/collections"
                className="text-green-700 hover:underline font-medium">
                View All Collections
              </a>
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
          EDITORIAL SEO BLOCK - CRITICAL FOR RANKING
      ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isAllSection
              ? "Pure Organic Products from Uttarakhand Himalayas"
              : `About Our ${section.title}`}
          </h2>
          <div className="prose prose-sm text-gray-600 max-w-none space-y-4">
            <p>
              <strong>
                Ghar Ka Organic{" "}
                {isAllSection ? "best sellers" : section.title.toLowerCase()}
              </strong>
              {isAllSection
                ? " represent products our customers trust most — pure A2 Badri Desi Ghee churned using the traditional bilona method, raw forest honey harvested from Himalayan wildflowers, and pahadi pickles made with age-old Kumaoni recipes."
                : ` are sourced directly from women-led farmer groups in Uttarakhand. We use no preservatives, chemicals, or artificial additives — only traditional methods passed down generations.`}
            </p>
            <p>
              Every product comes from verified farmers across Kumaon and
              Garhwal regions — Bhimtal, Almora, Pithoragarh, and Nainital. No
              middlemen, no cold storage. We pack within 48 hours of your order
              and ship with our <strong>15-day freshness guarantee</strong>.
              Free shipping across India on orders above ₹499.
            </p>
            <h3 className="text-lg font-semibold text-gray-900!mb-2!mt-6">
              Related Categories
            </h3>
            <p>
              Explore our popular collections:{" "}
              <a
                href="/organic-honey"
                className="text-green-700 hover:underline font-medium">
                raw organic honey
              </a>
              ,{" "}
              <a
                href="/desi-ghee"
                className="text-green-700 hover:underline font-medium">
                A2 desi ghee
              </a>
              ,{" "}
              <a
                href="/pahadi-pickles"
                className="text-green-700 hover:underline font-medium">
                traditional pahadi pickles
              </a>
              , and{" "}
              <a
                href="/organic-pulses"
                className="text-green-700 hover:underline font-medium">
                Himalayan pulses
              </a>
              .
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

export default CollectionPage;
