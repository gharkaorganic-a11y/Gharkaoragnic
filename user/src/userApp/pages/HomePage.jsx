import React, { Suspense, useEffect, useRef, useState } from "react";
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

/* ---------- Lazy Components ---------- */
const HeroSection = React.lazy(() => import("../homepage/HeroSection"));
const CustomerSpotlight = React.lazy(
  () => import("../homepage/CustomerSpotlight"),
);
const VideoSection = React.lazy(() => import("../homepage/VideoSection"));
const CategoriesHeader = React.lazy(() => import("../homepage/ReviewsSection"));
const ExploreOurPicks = React.lazy(() => import("../homepage/ExploreOurPicks"));
const CategoryScroller = React.lazy(
  () => import("../homepage/CategoryScroller"),
);
const CollectionGrid = React.lazy(() => import("../homepage/CollectionGrid"));
const ProductSection = React.lazy(
  () => import("../components/section/ProductSection"),
);
const TestimonialsSection = React.lazy(
  () => import("../components/section/TestimonialsSection"),
);

/* ---------- Mobile Detection ---------- */
const useIsMobile = () => {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  useEffect(() => {
    const handleResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return mobile;
};

/* ---------- Viewport Loader ---------- */
const ViewportLoader = ({ children, rootMargin = "250px" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { rootMargin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? children : <div className="min-h-[200px]" />}
    </div>
  );
};

/* ---------- Section Wrapper ---------- */
const Section = ({ children, className = "" }) => (
  <section className={`w-full ${className}`}>{children}</section>
);

/* ---------- Section Split ---------- */
const featuredSection = productSections[0];
const section1 = productSections[1];
const section2 = productSections[2];
const section3 = productSections[3];
const section4 = productSections[4];

/* ─────────────────────────────────────────────────────────────
   STATIC JSON-LD SCHEMAS
   Outside component — never re-created on re-render
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

// 🔥 FAQ Schema — triggers Google FAQ rich results in SERP (huge CTR boost)
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

/* ============================================================
   HOME PAGE
============================================================ */
const HomePage = () => {
  const isMobile = useIsMobile();

  const {
    products: homeProducts = {},
    categories = [],
    testimonials = [],
    collections: collectionItems = [],
    loadingKeys,
    categoriesLoading,
    testimonialsLoading,
    collectionsLoading,
  } = useHomepageProducts(productSections);

  /* ---------- Product Getter ---------- */
  const getProducts = (key) => {
    const items = homeProducts[key] ?? [];
    return isMobile ? items.slice(0, 4) : items;
  };

  const desktopSlides = IMAGES?.hero?.desktopSlides ?? [];
  const mobileSlides = IMAGES?.hero?.mobileSlides ?? [];

  /* ---------- Dynamic ItemList Schema — safe, renders only when products loaded ---------- */
  const featuredProducts = homeProducts?.featured ?? [];
  const itemListSchema =
    featuredProducts.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Featured Organic Products — Ghar Ka Organic",
          description:
            "Top organic food products available at Ghar Ka Organic store.",
          url: "https://gharkaorganic.com/",
          itemListElement: featuredProducts.slice(0, 8).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Product",
              name: p.name,
              image:
                p.images?.[0] ?? "https://gharkaorganic.com/gharka-logo.png",
              url: `https://gharkaorganic.com/product/${p.slug}`,
              description:
                p.description ?? `Buy ${p.name} online at Ghar Ka Organic`,
              brand: {
                "@type": "Brand",
                name: "Ghar Ka Organic",
              },
              offers: {
                "@type": "Offer",
                priceCurrency: "INR",
                price: p.price,
                availability: "https://schema.org/InStock",
                url: `https://gharkaorganic.com/product/${p.slug}`,
                seller: {
                  "@type": "Organization",
                  name: "Ghar Ka Organic",
                },
              },
            },
          })),
        }
      : null;

  /* ---------- Reusable Section Renderer ---------- */
  const renderSection = (section) => {
    if (!section) return null;
    const products = getProducts(section.key);
    const isLoading = loadingKeys.includes(section.key);

    return (
      <Section>
        <Suspense fallback={<GridSectionSkeleton />}>
          <ViewportLoader>
            <ProductSection
              title={section.title}
              subtitle={section.subtitle}
              products={Array.isArray(products) ? products : []}
              loading={isLoading}
              buttonClass="border border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-white"
            />
          </ViewportLoader>
        </Suspense>
      </Section>
    );
  };

  return (
    <main className="w-full min-h-screen bg-white text-[#111] overflow-x-hidden selection:bg-[#6b4f2c] selection:text-white">
      {/* ══════════════════════════════════════════
          SEO HEAD — Maximum Coverage
      ══════════════════════════════════════════ */}
      <Helmet>
        {/* ── PRIMARY ── */}
        <title>Buy Organic Products Online in India | Ghar Ka Organic</title>
        <meta
          name="description"
          content="Shop 100% natural and organic food products online in India at Ghar Ka Organic. Buy organic honey, pure desi ghee, cold-pressed oils, homemade masalas, and wellness products. Fast delivery across India."
        />
        <meta
          name="keywords"
          content="buy organic products online india, ghar ka organic, organic honey india, pure desi ghee online, cold pressed oil, homemade masala, organic food online, natural products india, chemical free food, organic grocery india, organic store india"
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

        {/* ── GEO ── */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="ICBM" content="20.5937, 78.9629" />

        {/* ── CANONICAL ── */}
        <link rel="canonical" href="https://gharkaorganic.com/" />

        {/* ── HREFLANG ── */}
        <link
          rel="alternate"
          hreflang="en-IN"
          href="https://gharkaorganic.com/"
        />
        <link
          rel="alternate"
          hreflang="hi-IN"
          href="https://gharkaorganic.com/hi/"
        />
        <link
          rel="alternate"
          hreflang="x-default"
          href="https://gharkaorganic.com/"
        />

        {/* ── OPEN GRAPH ── */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Buy Organic Products Online in India | Ghar Ka Organic"
        />
        <meta
          property="og:description"
          content="Shop 100% natural organic honey, pure ghee, cold-pressed oils, and homemade masalas at Ghar Ka Organic. Chemical-free, authentic, and delivered across India."
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

        {/* ── TWITTER / X ── */}
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

        {/* ── STATIC JSON-LD SCHEMAS ── */}
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

        {/* ── DYNAMIC PRODUCT LIST — only when products loaded ── */}
        {itemListSchema && (
          <script type="application/ld+json">
            {JSON.stringify(itemListSchema)}
          </script>
        )}
      </Helmet>

      {/* ══════════════════════════════════════════
          HIDDEN SEO TEXT — Google reads, users don't see
          sr-only = position:absolute, width:1px,
          height:1px, overflow:hidden (Tailwind built-in)
      ══════════════════════════════════════════ */}
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

      {/* HERO */}
      <Section>
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSection
            desktopSlides={desktopSlides}
            mobileSlides={mobileSlides}
          />
        </Suspense>
      </Section>

      {/* FEATURED */}
      {featuredSection && (
        <Section>
          <Suspense fallback={<GridSectionSkeleton />}>
            <ViewportLoader>
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

      {/* COLLECTION GRID */}
      {Array.isArray(collectionItems) && collectionItems.length > 0 && (
        <Section>
          <Suspense fallback={<CollectionGridSkeleton />}>
            <ViewportLoader>
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

      {/* SECTION 1 */}
      {renderSection(section1)}

      {/* SECTION 2 */}
      {renderSection(section2)}

      {/* VIDEO (desktop only) */}
      {!isMobile && (
        <Section>
          <Suspense fallback={<HeroSkeleton />}>
            <ViewportLoader>
              <VideoSection />
            </ViewportLoader>
          </Suspense>
        </Section>
      )}

      {/* SECTION 3 */}
      {renderSection(section3)}

      {/* EXPLORE (desktop only) */}
      {!isMobile && (
        <Section>
          <Suspense fallback={<HeroSkeleton />}>
            <ViewportLoader>
              <ExploreOurPicks
                data={{
                  img: "https://girorganic.com/cdn/shop/files/Frame_1000011713_1_1.png?v=1739520647",
                  label: "Explore Our Picks",
                  link: "/collections/all",
                }}
              />
            </ViewportLoader>
          </Suspense>
        </Section>
      )}

      {/* SECTION 4 */}
      {renderSection(section4)}

      {/* BRAND TICKER */}
      <Section className="py-4">
        <RunningBrandTicker />
      </Section>

      {/* CUSTOMER SPOTLIGHT */}
      <Section>
        <Suspense fallback={<HeroSkeleton />}>
          <ViewportLoader>
            <CustomerSpotlight />
          </ViewportLoader>
        </Suspense>
      </Section>

      {/* EXPLORE 2 (desktop only) */}
      {!isMobile && (
        <Section>
          <Suspense fallback={<HeroSkeleton />}>
            <ViewportLoader>
              <ExploreOurPicks />
            </ViewportLoader>
          </Suspense>
        </Section>
      )}

      {/* SOCIAL FEED */}
      <Section>
        <SocialFeed />
      </Section>

      {/* TESTIMONIALS */}
      <Section className="pb-16">
        <Suspense fallback={<TestimonialsSkeleton />}>
          <ViewportLoader>
            <TestimonialsSection
              testimonials={testimonials}
              loading={testimonialsLoading}
            />
          </ViewportLoader>
        </Suspense>
      </Section>

      <ScrollToTopButton />
    </main>
  );
};

export default HomePage;
