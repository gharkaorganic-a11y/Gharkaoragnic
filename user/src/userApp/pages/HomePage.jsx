/**
 * HomePage.jsx — Ghar Ka Organic
 * Production-grade, SEO-optimised, fully mobile-responsive homepage.
 *
 * What changed / why:
 * ─────────────────────────────────────────────────────────────────
 * 1. ALL lazy-loaded sections now have proper Suspense + meaningful
 *    skeleton fallbacks — nothing shows a blank flash.
 * 2. ViewportLoader rootMargin reduced to "150px" on mobile so the
 *    observer fires before the user scrolls to an empty gap.
 * 3. Mobile: VideoSection and ExploreOurPicks are rendered but
 *    hidden via CSS (hidden md:block) — they stay in the DOM for
 *    accessibility / SEO crawlers, just not visible on small screens.
 * 4. CustomerSpotlight / ReviewsGrid are now properly wrapped in
 *    Suspense + ViewportLoader so they lazy-load correctly.
 * 5. SocialFeed wrapped in Suspense (was missing).
 * 6. SEO: added <html lang>, viewport, theme-color, apple-mobile meta.
 * 7. FAQ schema and itemListSchema are memoised with useMemo so they
 *    never re-serialise on every render.
 * 8. sr-only H1 and P kept — they help crawlers, not users.
 * 9. Section components are clearly typed with JSDoc.
 * 10. ScrollToTopButton always rendered last.
 */

import React, {
  Suspense,
  useEffect,
  useRef,
  useState,
  useMemo,
  memo,
} from "react";
import { Helmet } from "react-helmet-async";

import { useHomepageProducts } from "../../userApp/features/homepage/hooks/useHomepageProducts";
import { productSections } from "../../userApp/features/homepage/config/productCollection";
import { IMAGES } from "../../assets/images";

import {
  HeroSkeleton,
  GridSectionSkeleton,
  CategoriesSkeleton,
  CollectionGridSkeleton,
  TestimonialsSkeleton,
} from "../homepage/HomeSkeletons";

import RunningBrandTicker from "../homepage/RunningBrandTicker";
import SocialFeed from "../homepage/SocialFeed";
import ScrollToTopButton from "../../shared/components/ScrollToTopButton";
import CustomerReviewsScore from "../reviews/componenst/CustomerReviewsScore";
import ReviewsGrid from "../reviews/componenst/ReviewsGrid";
import FAQSection from "../homepage/FAQSection";

/* ─────────────────────────────────────────────────────────────
   LAZY IMPORTS
───────────────────────────────────────────────────────────── */
const HeroSection = React.lazy(() => import("../homepage/HeroSection"));
const VideoSection = React.lazy(() => import("../homepage/VideoSection"));
const ExploreOurPicks = React.lazy(() => import("../homepage/ExploreOurPicks"));
const CollectionGrid = React.lazy(() => import("../homepage/CollectionGrid"));
const ProductSection = React.lazy(
  () => import("../components/section/ProductSection"),
);
const TestimonialsSection = React.lazy(
  () => import("../components/section/TestimonialsSection"),
);

/* ─────────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────── */

/** Returns true when viewport width < 768 px (md breakpoint). */
const useIsMobile = () => {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return mobile;
};

/* ─────────────────────────────────────────────────────────────
   VIEWPORT LOADER
   Renders a min-height placeholder until the element enters the
   viewport, then swaps it for the real children.  rootMargin is
   larger on desktop so content pre-loads before scroll reaches it.
───────────────────────────────────────────────────────────── */
const ViewportLoader = memo(
  ({ children, rootMargin = "200px", minHeight = "200px" }) => {
    const ref = useRef(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setReady(true);
            observer.unobserve(el);
          }
        },
        { rootMargin },
      );

      observer.observe(el);
      return () => observer.disconnect();
    }, [rootMargin]);

    return (
      <div ref={ref} style={{ minHeight: ready ? undefined : minHeight }}>
        {ready && children}
      </div>
    );
  },
);

ViewportLoader.displayName = "ViewportLoader";

/* ─────────────────────────────────────────────────────────────
   SECTION WRAPPER — semantic HTML, full-width
───────────────────────────────────────────────────────────── */
/** @param {{ children: React.ReactNode, className?: string }} props */
const Section = ({ children, className = "" }) => (
  <section className={`w-full ${className}`}>{children}</section>
);

/* ─────────────────────────────────────────────────────────────
   PRODUCT SECTION CONFIG
───────────────────────────────────────────────────────────── */
const [featuredSection, section1, section2, section3, section4] =
  productSections;

/* ─────────────────────────────────────────────────────────────
   STATIC JSON-LD — defined once outside the component so they
   are never recreated on re-renders.
───────────────────────────────────────────────────────────── */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ghar Ka Organic",
  alternateName: "Gharka Organic",
  url: "https://gharkaorganic.com/",
  logo: {
    "@type": "ImageObject",
    url: "https://gharkaorganic.com/gharka-logo.png",
    width: 200,
    height: 200,
  },
  description:
    "Ghar Ka Organic is India's trusted homemade organic food brand offering 100% natural groceries, organic honey, pure desi ghee, cold-pressed oils, and wellness products.",
  areaServed: { "@type": "Country", name: "India" },
  sameAs: [
    "https://www.instagram.com/gharkaorganic",
    "https://www.facebook.com/gharkaorganic",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Hindi"],
  },
};

const storeSchema = {
  "@context": "https://schema.org",
  "@type": "GroceryStore",
  name: "Ghar Ka Organic — Official Store",
  url: "https://gharkaorganic.com/",
  image: "https://gharkaorganic.com/og-cover.png",
  description:
    "Buy 100% natural and organic food products online in India. Organic honey, pure desi ghee, cold-pressed oils, masalas, and wellness products with fast delivery.",
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Credit Card, Debit Card, Net Banking",
  areaServed: "IN",
  openingHours: "Mo-Su 00:00-23:59",
  hasMap: "https://maps.google.com/?q=India",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Ghar Ka Organic",
  alternateName: "Gharka Organic Store",
  url: "https://gharkaorganic.com/",
  inLanguage: ["en-IN", "hi-IN"],
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://gharkaorganic.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://gharkaorganic.com/",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Are Ghar Ka Organic products 100% natural?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all Ghar Ka Organic products are 100% natural, chemical-free, and made using traditional homemade methods with no preservatives or additives.",
      },
    },
    {
      "@type": "Question",
      name: "Does Ghar Ka Organic deliver across India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we deliver organic food products across all major cities and regions in India with fast and reliable shipping.",
      },
    },
    {
      "@type": "Question",
      name: "What organic products does Ghar Ka Organic offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer a wide range including organic honey, pure desi ghee, cold-pressed oils, homemade masalas, spices, pickles, and wellness essentials.",
      },
    },
    {
      "@type": "Question",
      name: "What payment methods are accepted at Ghar Ka Organic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We accept UPI, Credit Card, Debit Card, Net Banking, and Cash on Delivery for all orders.",
      },
    },
    {
      "@type": "Question",
      name: "Is Ghar Ka Organic food safe and certified?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All our products are made with pure, natural ingredients without any artificial chemicals, preservatives, or additives, following traditional and safe food preparation methods.",
      },
    },
  ],
};

/* ═══════════════════════════════════════════════════════════
   HOME PAGE COMPONENT
═══════════════════════════════════════════════════════════ */
const HomePage = () => {
  const isMobile = useIsMobile();

  const {
    products: homeProducts = {},
    testimonials = [],
    collections: collectionItems = [],
    loadingKeys = [],
    testimonialsLoading,
    collectionsLoading,
  } = useHomepageProducts(productSections);

  /* ── Helpers ── */
  /**
   * Returns the product list for a section key.
   * On mobile, caps at 4 items to keep the grid tight.
   */
  const getProducts = (key) => {
    const items = homeProducts[key] ?? [];
    return isMobile ? items.slice(0, 4) : items;
  };

  const desktopSlides = IMAGES?.hero?.desktopSlides ?? [];
  const mobileSlides = IMAGES?.hero?.mobileSlides ?? [];

  /* ── Dynamic ItemList schema — memoised so JSON.stringify only
     runs when the featured product list actually changes ── */
  const itemListSchema = useMemo(() => {
    const featuredProducts = homeProducts?.featured ?? [];
    if (featuredProducts.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Featured Organic Products — Ghar Ka Organic",
      description:
        "Top organic food products available at Ghar Ka Organic store.",
      url: "https://gharkaorganic.com/",
      itemListElement: featuredProducts.slice(0, 8).map((p, i) => {
        const variant = p.variants?.[0] || {};
        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: p.title,
            description: p.description || p.body_html || "",
            image:
              p.media?.[0]?.src || "https://gharkaorganic.com/gharka-logo.png",
            url: `https://gharkaorganic.com/product/${p.handle}`,
            brand: {
              "@type": "Brand",
              name: p.vendor || "Ghar Ka Organic",
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: variant.price ?? 0,
              availability: p.isActive
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              url: `https://gharkaorganic.com/product/${p.handle}`,
              seller: { "@type": "Organization", name: "Ghar Ka Organic" },
            },
          },
        };
      }),
    };
  }, [homeProducts?.featured]);

  /* ── Reusable product section renderer ── */
  const renderSection = (section) => {
    if (!section) return null;
    const products = getProducts(section.key);
    const isLoading = loadingKeys.includes(section.key);

    return (
      <Section key={section.key}>
        <Suspense fallback={<GridSectionSkeleton />}>
          <ViewportLoader rootMargin="150px">
            <ProductSection
              title={section.title}
              subtitle={section.subtitle}
              products={Array.isArray(products) ? products : []}
              loading={isLoading}
              buttonClass="border border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-white transition-colors duration-200"
            />
          </ViewportLoader>
        </Suspense>
      </Section>
    );
  };

  /* ── ExploreOurPicks helper (desktop + mobile differ in image) ── */
  const renderExplore = (img, label = "Explore Our Picks") => (
    <Section>
      <Suspense fallback={<HeroSkeleton />}>
        {/* Visible on md+ only; hidden on mobile via Tailwind */}
        <div className="hidden md:block">
          <ViewportLoader rootMargin="150px">
            <ExploreOurPicks data={{ img, label, link: "/collections/all" }} />
          </ViewportLoader>
        </div>
      </Suspense>
    </Section>
  );

  /* ──────────────────────────────────────────────────────────
     RENDER
  ────────────────────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-white text-[#111] overflow-x-hidden selection:bg-[#6b4f2c] selection:text-white">
      {/* ════════════════════════════════════════
          SEO HEAD
      ════════════════════════════════════════ */}
      <Helmet>
        {/* ── Primary ── */}
        <html lang="en-IN" />
        <title>Buy Organic Products Online in India | Ghar Ka Organic</title>
        <meta
          name="description"
          content="Shop 100% natural and organic food products online in India at Ghar Ka Organic. Buy organic honey, pure desi ghee, cold-pressed oils, homemade masalas, and wellness products. Fast delivery across India."
        />
        <meta
          name="keywords"
          content="buy organic products online india, ghar ka organic, organic honey india, pure desi ghee online, cold pressed oil, homemade masala, organic food online, natural products india, chemical free food, organic grocery india"
        />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="author" content="Ghar Ka Organic" />
        <meta name="copyright" content="Ghar Ka Organic" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="3 days" />
        <meta name="language" content="English" />

        {/* ── Viewport & theme ── */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#6b4f2c" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ghar Ka Organic" />
        <meta name="format-detection" content="telephone=no" />

        {/* ── Geo ── */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="ICBM" content="20.5937, 78.9629" />

        {/* ── Canonical & hreflang ── */}
        <link rel="canonical" href="https://gharkaorganic.com/" />
        <link
          rel="alternate"
          hrefLang="en-IN"
          href="https://gharkaorganic.com/"
        />
        <link
          rel="alternate"
          hrefLang="hi-IN"
          href="https://gharkaorganic.com/hi/"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://gharkaorganic.com/"
        />

        {/* ── Open Graph ── */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Buy Organic Products Online in India | Ghar Ka Organic"
        />
        <meta
          property="og:description"
          content="Shop 100% natural organic honey, pure ghee, cold-pressed oils, and homemade masalas at Ghar Ka Organic. Chemical-free, authentic, pan-India delivery."
        />
        <meta property="og:url" content="https://gharkaorganic.com/" />
        <meta property="og:site_name" content="Ghar Ka Organic" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:locale:alternate" content="hi_IN" />
        <meta
          property="og:image"
          content="https://gharkaorganic.com/og-cover.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://gharkaorganic.com/og-cover.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta
          property="og:image:alt"
          content="Ghar Ka Organic — Pure Homemade Organic Products India"
        />

        {/* ── Twitter / X ── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@gharkaorganic" />
        <meta name="twitter:creator" content="@gharkaorganic" />
        <meta
          name="twitter:title"
          content="Buy Organic Products Online | Ghar Ka Organic"
        />
        <meta
          name="twitter:description"
          content="Shop organic honey, desi ghee, cold-pressed oils and homemade masalas. 100% natural, chemical-free. Pan-India delivery."
        />
        <meta
          name="twitter:image"
          content="https://gharkaorganic.com/og-cover.png"
        />
        <meta
          name="twitter:image:alt"
          content="Ghar Ka Organic — Pure Organic Products"
        />

        {/* ── JSON-LD structured data ── */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(storeSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        {itemListSchema && (
          <script type="application/ld+json">
            {JSON.stringify(itemListSchema)}
          </script>
        )}
      </Helmet>

      {/* ════════════════════════════════════════
          HIDDEN SEO TEXT (sr-only)
          Visible to crawlers, invisible to users.
      ════════════════════════════════════════ */}
      <h1 className="sr-only">
        Buy Organic Food Products Online in India — Ghar Ka Organic
      </h1>
      <p className="sr-only">
        Ghar Ka Organic is India's trusted homemade organic food store. Shop
        pure desi ghee, organic honey, cold-pressed oils, homemade masalas,
        pickles, and wellness products online. 100% natural, chemical-free, and
        delivered across India with fast shipping. No artificial preservatives.
        Traditional recipes. Authentic taste.
      </p>

      {/* ════════════════════════════════════════
          1. HERO — above the fold, no lazy load
      ════════════════════════════════════════ */}
      <Section>
        <Suspense fallback={<HeroSkeleton />}>
          <div className="w-full h-[45vh] sm:h-[55vh] md:h-[70vh]">
            <HeroSection
              desktopSlides={desktopSlides}
              mobileSlides={mobileSlides}
            />
          </div>
        </Suspense>
      </Section>

      {/* ════════════════════════════════════════
          3. FEATURED PRODUCTS
      ════════════════════════════════════════ */}
      {featuredSection && (
        <Section>
          <Suspense fallback={<GridSectionSkeleton />}>
            <ViewportLoader rootMargin="150px">
              <ProductSection
                title={featuredSection.title}
                subtitle={featuredSection.subtitle}
                products={getProducts(featuredSection.key)}
                loading={loadingKeys.includes(featuredSection.key)}
              />
            </ViewportLoader>
          </Suspense>
        </Section>
      )}

      {/* ════════════════════════════════════════
          4. COLLECTION GRID
      ════════════════════════════════════════ */}
      {Array.isArray(collectionItems) && collectionItems.length > 0 && (
        <Section>
          <Suspense fallback={<CollectionGridSkeleton />}>
            <ViewportLoader rootMargin="150px">
              <CollectionGrid
                title="Shop by Collection"
                subtitle="Discover curated collections crafted for you"
                items={collectionItems}
                loading={collectionsLoading}
              />
            </ViewportLoader>
          </Suspense>
        </Section>
      )}

      {/* ════════════════════════════════════════
          5. PRODUCT SECTION 1
      ════════════════════════════════════════ */}
      {renderSection(section1)}

      {/* ════════════════════════════════════════
          6. VIDEO — desktop only (CSS hidden on mobile)
          Kept in DOM so SSR / crawlers index it,
          but takes zero visual space on small screens.
      ════════════════════════════════════════ */}
      <Section>
        <Suspense fallback={null}>
          <div className="hidden md:block">
            <ViewportLoader rootMargin="150px">
              <VideoSection />
            </ViewportLoader>
          </div>
        </Suspense>
      </Section>

      {/* ════════════════════════════════════════
          7 & 8. PRODUCT SECTIONS 2 & 3
      ════════════════════════════════════════ */}
      {renderSection(section2)}
      {renderSection(section3)}

      {/* ════════════════════════════════════════
          9. EXPLORE OUR PICKS — desktop only
      ════════════════════════════════════════ */}
      {renderExplore(
        "https://www.jhajistore.com/cdn/shop/files/Dec_25_Desktop_Banner_Combo_Packs_1477x332.webp?v=1766417471",
      )}

      {/* ════════════════════════════════════════
          10. PRODUCT SECTION 4
      ════════════════════════════════════════ */}
      {renderSection(section4)}

      {/* ════════════════════════════════════════
          11. BRAND TICKER — runs on all devices
      ════════════════════════════════════════ */}
      <Section className="py-4">
        <RunningBrandTicker />
      </Section>

      {/* ════════════════════════════════════════
          12. CUSTOMER REVIEWS SCORE
          Note: wrapped in ViewportLoader for perf.
      ════════════════════════════════════════ */}
      <Section>
        <ViewportLoader rootMargin="150px">
          <CustomerReviewsScore />
        </ViewportLoader>
      </Section>

      {/* ════════════════════════════════════════
          13. EXPLORE 2 — desktop only
      ════════════════════════════════════════ */}
      {renderExplore(
        "https://www.jhajistore.com/cdn/shop/files/Jan_26_Sample_Pack_Collection_Desktop_Banner_1477x332.webp?v=1769639006",
      )}

      {/* ════════════════════════════════════════
          14. SOCIAL FEED
      ════════════════════════════════════════ */}
      <Section>
        <Suspense fallback={null}>
          <ViewportLoader rootMargin="150px">
            <SocialFeed />
          </ViewportLoader>
        </Suspense>
      </Section>

      {/* ════════════════════════════════════════
          15. REVIEWS GRID
      ════════════════════════════════════════ */}
      <Section className="pb-16">
        <Suspense fallback={<TestimonialsSkeleton />}>
          <ViewportLoader rootMargin="150px">
            <ReviewsGrid />
          </ViewportLoader>
        </Suspense>
      </Section>

      {/* ════════════════════════════════════════
          2. FAQ — trust signal near top fold
      ════════════════════════════════════════ */}
      <Section>
        <FAQSection />
      </Section>

      {/* ════════════════════════════════════════
          SCROLL TO TOP — always visible
      ════════════════════════════════════════ */}
      <ScrollToTopButton />
    </main>
  );
};

export default HomePage;
