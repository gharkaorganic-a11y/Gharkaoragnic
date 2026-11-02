/**
 * CollectionPage.jsx
 * Production-ready collection/category listing page.
 *
 * Layout matches Namakwali (Image 2):
 * - Circular green category navigation at top (Image 3)
 * - Clean title & preserved SEO description and "Why Choose Us" trust strip
 * - Sleek Filter & Sort bar (Availability, Price, Product | Sort by, Product count)
 * - Borderless spacious product cards
 * - Preserved Editorial SEO block & Trust Bar
 *
 * Route shapes handled:
 * /collections → "all" section (canonical: /collections NOT /)
 * /collections/:slug → specific section
 * /:preferredSlug → canonical URL (e.g. /organic-honey)
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

import { productSections } from "../homepage/config/productCollection";
import ProductSectionTabs from "./components/ProductSectionTabs";
import { preferredSlug, routeAliases } from "./utils/SECTIONKEY";
import { useCollection } from "./Usecollection";
import Breadcrumb from "./components/NewBreadcrumb";
import ProductGrid from "./components/ProductGrid";
import CollectionFilterToolbar from "./components/CollectionFilterToolbar";

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */

const BASE_URL = "https://gharkaorganic.com";
const BRAND_GREEN = "#0B8A52";
const INFINITE_SCROLL_MARGIN = "500px";

const SORT_OPTIONS = [
  { value: "popularity_desc", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "createdAt_desc", label: "Newest First" },
  { value: "name_asc", label: "Name: A–Z" },
];

/* ─────────────────────────────────────────────────────────────
   SECTION MAP
───────────────────────────────────────────────────────────── */

const sectionMap = Object.fromEntries(productSections.map((s) => [s.key, s]));

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────────────────────
   SENTINEL HOOK
───────────────────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────────────────────
   SKELETONS
───────────────────────────────────────────────────────────── */

const ProductSkeleton = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="w-full aspect-square bg-[#f4f2e9] rounded-2xl" />
    <div className="mt-3 sm:mt-4 space-y-2">
      <div className="h-4 bg-[#f4f2e9] rounded w-4/5" />
      <div className="h-3.5 bg-[#f4f2e9] rounded w-1/2" />
      <div className="h-4 bg-[#f4f2e9] rounded w-1/3" />
      <div className="h-8 bg-[#f4f2e9] rounded w-full mt-2" />
    </div>
  </div>
);

const GridSkeleton = () => (
  <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 md:grid-cols-3 md:gap-x-10 lg:grid-cols-4 lg:gap-x-12 xl:gap-x-14 lg:gap-y-14">
    {[...Array(8)].map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */

const CollectionPage = () => {
  const { slug: urlSlug } = useParams();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const [sort, setSort] = useState("popularity_desc");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");

  const handleSortChange = useCallback((v) => setSort(v), []);

  /* ── 1. Resolve section (Query Param or Slug) ────────────────────────── */
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const categoryQuery =
    searchParams.get("category") ||
    searchParams.get("cat") ||
    searchParams.get("collection") ||
    searchParams.get("type");

  const section = useMemo(() => {
    // 1. If query parameter is provided (e.g. ?category=pickles, ?category=ghee, ?category=honey)
    if (categoryQuery) {
      const resolved = resolveSection(categoryQuery);
      if (resolved) return resolved;
    }

    // 2. If visiting root collection paths without category query
    const isCollectionsRoot =
      pathname === "/collections" ||
      pathname === "/collections/" ||
      pathname === "/all-products" ||
      pathname === "/all-products/" ||
      pathname === "/shop" ||
      pathname === "/shop/";

    if (isCollectionsRoot) {
      return sectionMap["all"] ?? null;
    }

    // 3. Resolve via dynamic slug (e.g. /pahadi-achar-online, /buy-desi-ghee-online)
    return resolveSection(urlSlug);
  }, [categoryQuery, pathname, urlSlug]);

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

  /* ── 4. Client-side filtering (Availability, Price, Product) ────────── */
  const filteredProducts = useMemo(() => {
    if (!displayProducts) return [];
    return displayProducts.filter((product) => {
      // Availability filter
      if (availabilityFilter === "in_stock" && product.inStock === false) {
        return false;
      }
      if (availabilityFilter === "out_of_stock" && product.inStock !== false) {
        return false;
      }

      // Price filter
      const p = Number(product.price || 0);
      if (priceFilter === "under_300" && p >= 300) return false;
      if (priceFilter === "300_600" && (p < 300 || p > 600)) return false;
      if (priceFilter === "above_600" && p <= 600) return false;

      // Product/category filter (when active on client)
      if (productFilter && productFilter !== "all" && productFilter !== section?.key) {
        const cat = String(
          product.category || product.collectionType || "",
        ).toLowerCase();
        const matchesCat = cat.includes(productFilter.toLowerCase());
        const matchesTag =
          Array.isArray(product.tags) &&
          product.tags.some((t) =>
            String(t).toLowerCase().includes(productFilter.toLowerCase()),
          );
        if (!matchesCat && !matchesTag) return false;
      }

      return true;
    });
  }, [displayProducts, availabilityFilter, priceFilter, productFilter, section?.key]);

  const handleProductFilterSelect = useCallback(
    (key) => {
      if (key === "all") {
        if (pathname.includes("all-products")) {
          navigate("/all-products");
        } else {
          navigate("/collections");
        }
      } else {
        if (pathname.includes("all-products")) {
          navigate(`/all-products?category=${key}`);
        } else {
          navigate(`/${preferredSlug[key] ?? key}`);
        }
      }
    },
    [navigate, pathname],
  );

  const handleResetFilters = useCallback(() => {
    setAvailabilityFilter("all");
    setPriceFilter("all");
    setProductFilter("all");
    if (categoryQuery) {
      if (pathname.includes("all-products")) {
        navigate("/all-products");
      } else {
        navigate("/collections");
      }
    } else if (urlSlug && section?.key !== "all") {
      navigate("/collections");
    }
  }, [categoryQuery, pathname, urlSlug, section?.key, navigate]);

  /* ── 5. Infinite scroll sentinel ────────────────────────────────────── */
  const handleSentinelIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const sentinelRef = useSentinel(handleSentinelIntersect, {
    enabled: hasNextPage && !isFetchingNextPage,
    rootMargin: INFINITE_SCROLL_MARGIN,
  });

  /* ── 6. 404 state ───────────────────────────────────────────────────── */
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
              className="px-6 py-2 bg-[#008060] text-white rounded-lg hover:bg-green-700 transition font-medium">
              Go to Homepage
            </a>
            <a
              href="/collections"
              className="text-[#008060] font-medium hover:underline">
              Browse All Collections
            </a>
          </div>
        </div>
      </main>
    );
  }

  /* ── 7. Render ──────────────────────────────────────────────────────── */
  const totalCount = filteredProducts?.length ?? 0;
  const isAllSection = section.key === "all";

  /* JSON-LD Schema strictly preserved */
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
            filteredProducts?.slice(0, 24).map((p, i) => ({
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
    [section, canonical, filteredProducts],
  );

  return (
    <main className="min-h-screen bg-white">
      {/* ═══════════════════════════════════════════
          SEO — INDEXING SIGNALS (PRESERVED 100%)
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

        {/* JSON-LD Schema */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* ═══════════════════════════════════════════
          1. PAGE TITLE & PRESERVED SEO CONTENT (TEXT FIRST)
      ═══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: section.title, href: canonical },
          ]}
        />

        <div className="mt-4 sm:mt-5">
          {/* Authentic Himalayan Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider bg-emerald-50 text-[#008060] mb-2.5">
            <CheckBadgeIcon className="w-3.5 h-3.5" /> From Uttarakhand Farms
          </span>

          {/* Primary H1 Heading - Simple, clean, elegant font */}
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-tight leading-snug">
            {isAllSection
              ? "All Organic Products from Uttarakhand Himalayas"
              : `${section.title} from Uttarakhand Himalayas`}
          </h1>

          {/* SEO Description paragraph - Simple, clean font */}
          {section.seoDescription && (
            <p className="mt-2 text-sm sm:text-base text-gray-500 font-normal max-w-3xl leading-relaxed">
              {section.seoDescription}
            </p>
          )}

          {/* Trust points - Simple, clean inline strip */}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-gray-500 font-normal">
            <span className="inline-flex items-center gap-1">
              <span className="text-[#008060] font-semibold">✓</span> 100% natural &
              chemical-free
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="text-[#008060] font-semibold">✓</span> Directly from
              Uttarakhand farmers
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="text-[#008060] font-semibold">✓</span> 48hr dispatch,
              15-day guarantee
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="text-[#008060] font-semibold">✓</span> Free shipping on
              orders ₹499+
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          2. CATEGORY NAVIGATION (SHOP BY CATEGORY)
      ═══════════════════════════════════════════ */}
      <div className="mt-6">
        <ProductSectionTabs
          productSections={productSections}
          currentKey={section.key}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ═══════════════════════════════════════════
            3. SLEEK FILTER & SORT TOOLBAR (IMAGE 2)
        ═══════════════════════════════════════════ */}
        <CollectionFilterToolbar
          totalCount={totalCount}
          currentSort={sort}
          onSortChange={handleSortChange}
          sortOptions={SORT_OPTIONS}
          availabilityFilter={availabilityFilter}
          onAvailabilityChange={setAvailabilityFilter}
          priceFilter={priceFilter}
          onPriceChange={setPriceFilter}
          productFilter={section?.key || "all"}
          onProductChange={handleProductFilterSelect}
          productSections={productSections}
          onResetFilters={handleResetFilters}
        />

        {/* ═══════════════════════════════════════════
            4. PRODUCT GRID (IMAGE 2 BORDERLESS CARDS)
        ═══════════════════════════════════════════ */}
        <div className="pb-12 sm:pb-16">
          {isLoading && totalCount === 0 ? (
            <GridSkeleton />
          ) : isError ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
              <p className="text-gray-500 font-medium">
                Failed to load products
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Please refresh the page
              </p>
            </div>
          ) : totalCount === 0 ? (
            <div className="py-16 px-4 bg-gray-50 rounded-2xl max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                {section.title}
              </h2>
              {section.seoDescription && (
                <p className="mt-3 text-gray-600">{section.seoDescription}</p>
              )}
              <p className="mt-4 text-sm text-gray-500">
                We're updating inventory for this category or selected filters.
                Explore our range of authentic organic products from the
                Uttarakhand Himalayas.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#008060] text-white rounded-lg font-medium hover:bg-green-700 transition">
                  Reset Filters
                </button>
                <a
                  href="/collections"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium">
                  View All Collections
                </a>
              </div>
            </div>
          ) : (
            <>
              <ProductGrid
                isLoading={false}
                isError={false}
                displayProducts={filteredProducts}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                sentinelRef={sentinelRef}
                clearFilters={handleResetFilters}
              />
              {isFetchingNextPage && (
                <div className="mt-8">
                  <GridSkeleton />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          5. EDITORIAL SEO BLOCK (STRICTLY PRESERVED)
      ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isAllSection
              ? "Pure Organic Products from Uttarakhand Himalayas"
              : `About Our ${section.title}`}
          </h2>
          <div className="prose prose-sm text-gray-600 max-w-none space-y-4 leading-relaxed">
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
            <h3 className="text-lg font-semibold text-gray-900 !mb-2 !mt-6">
              Related Categories
            </h3>
            <p>
              Explore our popular collections:{" "}
              <a
                href="/organic-honey"
                className="text-[#008060] hover:underline font-medium">
                raw organic honey
              </a>
              ,{" "}
              <a
                href="/desi-ghee"
                className="text-[#008060] hover:underline font-medium">
                A2 desi ghee
              </a>
              ,{" "}
              <a
                href="/pahadi-pickles"
                className="text-[#008060] hover:underline font-medium">
                traditional pahadi pickles
              </a>
              , and{" "}
              <a
                href="/organic-pulses"
                className="text-[#008060] hover:underline font-medium">
                Himalayan pulses
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. TRUST BAR (STRICTLY PRESERVED)
      ═══════════════════════════════════════════ */}
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
