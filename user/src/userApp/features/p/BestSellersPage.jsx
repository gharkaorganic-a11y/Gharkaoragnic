import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
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
const CANONICAL = `${BASE_URL}/shop/best-sellers`;
const HERO_IMAGE =
  "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790511602/gharka-organic/products/oqkqmdl1gul3fapq2vvc.jpg";

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A–Z" },
  { value: "popularity_desc", label: "Most Popular" },
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

/* ───────── SKELETON ───────── */
const ProductSkeleton = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="w-full aspect-square bg-[#f4f2e9] rounded-2xl sm:rounded-none" />
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
  const [, setMobileFiltersOpen] = useState(false);
  const handleSortChange = useCallback((v) => setSort(v), []);

  useMemo(() => productSections.find((s) => s.key === "new"), []);

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

  const handleSentinelIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const sentinelRef = useSentinel(handleSentinelIntersect, {
    enabled: hasNextPage && !isFetchingNextPage,
    rootMargin: INFINITE_SCROLL_MARGIN,
  });

  const productCount = displayProducts?.length ?? 0;

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${CANONICAL}#webpage`,
          name: "Best Selling Organic Products | Ghar Ka Organic",
          description:
            "Shop Ghar Ka Organic products from Uttarakhand — Mirch Ka Achar (Green Chilly Pickle), natural raw honey, and Pahadi Salt with free shipping across India.",
          url: CANONICAL,
          image: HERO_IMAGE,
          inLanguage: "en-IN",
          isPartOf: {
            "@type": "WebSite",
            "@id": `${BASE_URL}/#website`,
            name: "Ghar Ka Organic",
            url: `${BASE_URL}/`,
          },
          about: {
            "@type": "Organization",
            "@id": `${BASE_URL}/#organization`,
          },
          breadcrumb: {
            "@type": "BreadcrumbList",
            "@id": `${CANONICAL}#breadcrumb`,
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `${BASE_URL}/`,
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
          "@id": `${CANONICAL}#itemlist`,
          name: "Ghar Ka Organic Best Sellers",
          itemListElement:
            displayProducts?.slice(0, 10).map((p, i) => {
              const productUrl = `${BASE_URL}/product/${p.slug || p.id}`;
              const itemNode = {
                "@type": "Product",
                name: p.name,
                url: productUrl,
                image: p.banner || p.images?.[0] || HERO_IMAGE,
                brand: {
                  "@type": "Brand",
                  name: "Ghar Ka Organic",
                },
              };

              if (Number(p.price) > 0) {
                itemNode.offers = {
                  "@type": "Offer",
                  url: productUrl,
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
                position: i + 1,
                url: productUrl,
                name: p.name,
                item: itemNode,
              };
            }) || [],
        },
      ],
    }),
    [displayProducts],
  );

  return (
    <main className="min-h-screen bg-white">
      <Helmet>
        <title>
          Best Selling Organic Products from Uttarakhand | Ghar Ka Organic
        </title>
        <meta
          name="description"
          content="Shop Ghar Ka Organic products from Uttarakhand — Mirch Ka Achar (Green Chilly Pickle), natural raw honey, and Pahadi Salt. Free shipping across India."
        />
        <link rel="canonical" href={CANONICAL} />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        <meta name="geo.region" content="IN-UT" />
        <meta
          name="geo.placename"
          content="Nalni, Nainital, Uttarakhand, India"
        />
        <meta name="language" content="en-IN" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Ghar Ka Organic" />
        <meta
          property="og:title"
          content="Best Selling Organic Products from Uttarakhand | Ghar Ka Organic"
        />
        <meta
          property="og:description"
          content="Shop homemade Mirch Ka Achar, natural raw honey, and Pahadi Salt from Uttarakhand with free shipping across India."
        />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Ghar Ka Organic products from Uttarakhand"
        />
        <meta property="og:locale" content="en_IN" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Best Selling Organic Products | Ghar Ka Organic"
        />
        <meta
          name="twitter:description"
          content="Shop homemade Mirch Ka Achar, natural raw honey, and Pahadi Salt from Uttarakhand."
        />
        <meta name="twitter:image" content={HERO_IMAGE} />

        <link rel="preload" as="image" href={HERO_IMAGE} />

        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* 1. PAGE TITLE & SEO CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Best Sellers", href: "/shop/best-sellers" },
          ]}
        />

        <div className="mt-4 sm:mt-5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider bg-emerald-50 text-[#008060] mb-2.5">
            &#9733; Customer Favourites
          </span>

          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-tight leading-snug">
            Best Selling Organic Products from Uttarakhand
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-500 font-normal max-w-3xl leading-relaxed">
            Hand-picked for everyday meals — homemade Mirch Ka Achar (Green
            Chilly Pickle), natural raw honey, and Pahadi Salt with dhaniya,
            garlic, and green chillies crafted in Nalni, Nainital, Uttarakhand
            without unnecessary chemicals or artificial preservatives.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-gray-500 font-normal">
            <span className="inline-flex items-center gap-1">
              <span className="text-[#008060] font-semibold">&#10003;</span>{" "}
              100% natural ingredients
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="text-[#008060] font-semibold">&#10003;</span> No
              unnecessary preservatives
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="text-[#008060] font-semibold">&#10003;</span>{" "}
              From Nainital, Uttarakhand
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="text-[#008060] font-semibold">&#10003;</span>{" "}
              Free shipping across India
            </span>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY NAVIGATION */}
      <div className="mt-6">
        <ProductSectionTabs
          productSections={productSections}
          currentKey="new"
        />
      </div>

      {/* 3. PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
              type="button"
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
              Best Selling Organic Products
            </h2>
            <p className="mt-3 text-gray-600">
              Our Himalayan organic food products from Uttarakhand.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Explore our full collection of Mirch Ka Achar, natural raw honey,
              and Pahadi Salt.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <Link
                to="/collections"
                className="text-green-700 hover:underline font-medium">
                View All Collections
              </Link>
              <span className="text-gray-300">&bull;</span>
              <Link
                to="/"
                className="text-green-700 hover:underline font-medium">
                Go to Homepage
              </Link>
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

      {/* 4. EDITORIAL SEO BLOCK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why These Are Our Best Selling Organic Products
          </h2>
          <div className="prose prose-sm text-gray-600 max-w-none space-y-4">
            <p>
              <strong>Ghar Ka Organic&rsquo;s products</strong> bring
              traditional Uttarakhand flavors to everyday tables —{" "}
              <strong>GHAR KA Mirch Ka Achar (Green Chilly Pickle)</strong> made
              with green chillies, mustard oil, salt, and spices;{" "}
              <strong>GHAR KA HONEY</strong> with natural sweetness, delicate
              floral notes, and rich aroma; and{" "}
              <strong>
                Pahadi Salt with Dhaniya, Garlic and Green Chillies
              </strong>{" "}
              for seasoning fruit, curd, salads, chaas, vegetables, and snacks.
            </p>
            <p>
              Every item is rooted in our{" "}
              <strong>home kitchen in Nalni, Nainital, Uttarakhand</strong> —
              prepared using carefully selected ingredients and traditional
              recipes without unnecessary chemicals or artificial preservatives.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 !mb-2">
              Shipping &amp; Return Promise
            </h3>
            <p>
              Orders ship across India with <strong>free shipping (₹0)</strong>{" "}
              and typical delivery in <strong>4–7 business days</strong>, backed
              by our <strong>7-day return policy</strong> with free mail-in
              returns.
            </p>
          </div>
        </div>
      </section>

      {/* 5. TRUST BAR */}
      <section
        className="py-8 text-white"
        style={{ backgroundColor: BRAND_GREEN }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-xs uppercase tracking-wider text-green-100 mt-1">
                Natural Ingredients
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">4–7 Days</div>
              <div className="text-xs uppercase tracking-wider text-green-100 mt-1">
                India Delivery
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">7 Days</div>
              <div className="text-xs uppercase tracking-wider text-green-100 mt-1">
                Easy Returns
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">Free</div>
              <div className="text-xs uppercase tracking-wider text-green-100 mt-1">
                Shipping Across India
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BestSellersPage;
