import React, {
  Suspense,
  useEffect,
  useRef,
  useState,
  memo,
  useCallback,
} from "react";
import { Helmet } from "react-helmet-async";

import { useHomepageProducts } from "../../userApp/features/homepage/hooks/useHomepageProducts";
import { productSections } from "../../userApp/features/homepage/config/productCollection";
import { IMAGES } from "../../assets/images";

import { GridSectionSkeleton } from "../homepage/HomeSkeletons";
import ScrollToTopButton from "../../shared/components/ScrollToTopButton";
import CustomerReviewsSection from "../reviews/componenst/CustomerReviewsSection";
import ReviewsGrid from "../reviews/componenst/ReviewsGrid";
import FAQSection from "../homepage/FAQSection";
import ProductSectionTabs from "../features/p/components/ProductSectionTabs";
import HeroSection from "../homepage/HeroSection";
import ExploreOurPicks from "../homepage/ExploreOurPicks";
import OurStoryComponent from "../homepage/OurStoryComponent";

const ProductSection = React.lazy(
  () => import("../components/section/ProductSection"),
);

// ────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE SEO & AI CRAWLER OPTIMIZATION
// ────────────────────────────────────────────────────────────────────────────

const SITE_URL = "https://gharkaorganic.com";
const SITE_NAME = "Ghar Ka Organic";
const HOMEPAGE_KEYS = ["new", "pickle", "honey", "ghee"];

const homepageSections = productSections
  .filter((s) => HOMEPAGE_KEYS.includes(s.key))
  .sort((a, b) => HOMEPAGE_KEYS.indexOf(a.key) - HOMEPAGE_KEYS.indexOf(b.key));

// ────────────────────────────────────────────────────────────────────────────
// PRODUCT IMAGES - OPTIMIZED FOR ALL CONTEXTS
// ────────────────────────────────────────────────────────────────────────────

const PRODUCT_IMAGES = {
  GHEE: {
    "1x1":
      "https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1779804926/uttarakhand-desi-ghee_mhth1n_kwdmv9.webp",
    "4x3":
      "https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1779805154/uttarakhand-desi-ghee_mhth1n2nd_lepmtt.webp",
    "16x9":
      "https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1779805222/uttarakhand-desi-ghee_mhth1n5nd_eluqhy.webp",
  },
  HONEY: {
    "1x1":
      "https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1779805346/6b28f8bd-630a-4ad8-99c2-38a0fb306d15.png",
    "4x3":
      "https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1779805494/64314e95-3424-4dec-b811-3707065f6882.png",
    "16x9":
      "https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1779805631/b44580c5-a84c-4c0d-9c73-190f5af1bca3.png",
  },
  AAM_ACHAR: {
    "1x1":
      "https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1779805758/a332c4ef-1765-4f47-b4d4-4012140de26e.png",
    "4x3":
      "https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1779806010/f9e71e6e-8685-46a6-b571-1c09f3ca6a84.png",
    "16x9":
      "https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1779806096/0f2bd60d-2817-4e02-b125-9ee966568267.png",
  },
  NIMBU_ACHAR: {
    "1x1":
      "https://res.cloudinary.com/dwgro3zo7/image/upload/w_1200,h_1200,c_fill,q_auto,f_auto/v1779806656/c2153e88-16ac-498e-a526-1976f375a691_un6xul.png",
    "4x3":
      "https://res.cloudinary.com/dwgro3zo7/image/upload/w_1200,h_900,c_fill,q_auto,f_auto/v1779806656/c2153e88-16ac-498e-a526-1976f375a691_un6xul.png",
    "16x9":
      "https://res.cloudinary.com/dwgro3zo7/image/upload/w_1200,h_675,c_fill,q_auto,f_auto/v1779806656/c2153e88-16ac-498e-a526-1976f375a691_un6xul.png",
  },
  BHANG_CHUTNEY: {
    "1x1":
      "https://res.cloudinary.com/dwgro3zo7/image/upload/w_1200,h_1200,c_fill,q_auto,f_auto/v1779806954/5fbff796-8d70-4624-931e-f7d36a5ec9a9_leazcc.png",
    "4x3":
      "https://res.cloudinary.com/dwgro3zo7/image/upload/w_1200,h_900,c_fill,q_auto,f_auto/v1779806954/5fbff796-8d70-4624-931e-f7d36a5ec9a9_leazcc.png",
    "16x9":
      "https://res.cloudinary.com/dwgro3zo7/image/upload/w_1200,h_675,c_fill,q_auto,f_auto/v1779806954/5fbff796-8d70-4624-931e-f7d36a5ec9a9_leazcc.png",
  },
};

// ────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE PRODUCT SCHEMAS WITH REVIEWS (FOR RICH RESULTS & AI)
// ────────────────────────────────────────────────────────────────────────────

const HOMEPAGE_PRODUCT_SCHEMAS = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://gharkaorganic.com/buy-desi-ghee-online#product",
    name: "Bilona Desi Ghee from Uttarakhand – A2 Cow Milk Ghee",
    description:
      "Traditional Bilona Desi Ghee made using the ancient hand-churning method from A2 cow milk in Uttarakhand. Pure, chemical-free, rich in natural nutrients, and full of authentic aroma.",
    image: [
      PRODUCT_IMAGES.GHEE["1x1"],
      PRODUCT_IMAGES.GHEE["4x3"],
      PRODUCT_IMAGES.GHEE["16x9"],
    ],
    sku: "GKO-GHEE-001",
    brand: { "@type": "Brand", name: "Ghar Ka Organic" },
    category: "Organic Food Products > Dairy > Ghee",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: 24,
      bestRating: 5,
      worstRating: 1,
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: 5,
          bestRating: 5,
          worstRating: 1,
        },
        author: { "@type": "Person", name: "Priya Sharma" },
        reviewBody:
          "Best bilona ghee I've ever tasted. Pure, aromatic, and you can taste the difference immediately. Worth every penny!",
        datePublished: "2025-05-15",
      },
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: 5,
          bestRating: 5,
          worstRating: 1,
        },
        author: { "@type": "Person", name: "Rakesh Kumar" },
        reviewBody:
          "Authentic Uttarakhand ghee. The smell is incredible and it doesn't have that commercial aftertaste.",
        datePublished: "2025-05-10",
      },
    ],
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/buy-desi-ghee-online`,
      priceCurrency: "INR",
      price: "1299",
      priceLowerBound: "999",
      priceUpperBound: "1499",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    mainEntityOfPage: {
      "@id": "https://gharkaorganic.com/#webpage",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://gharkaorganic.com/raw-honey-uttarakhand#product",
    name: "Raw Pahadi Honey from Uttarakhand – Pure Forest Honey",
    description:
      "Natural Himalayan Pahadi Honey collected from wild forest bees in Uttarakhand mountains. Raw, unfiltered, unprocessed and free from any additives or refined sugar.",
    image: [
      PRODUCT_IMAGES.HONEY["1x1"],
      PRODUCT_IMAGES.HONEY["4x3"],
      PRODUCT_IMAGES.HONEY["16x9"],
    ],
    sku: "GKO-HONEY-001",
    brand: { "@type": "Brand", name: "Ghar Ka Organic" },
    category: "Organic Food Products > Honey > Raw Honey",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: 18,
      bestRating: 5,
      worstRating: 1,
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: 5,
          bestRating: 5,
          worstRating: 1,
        },
        author: { "@type": "Person", name: "Anjali Pant" },
        reviewBody:
          "Real raw honey! No processing, no additives. Can feel the authentic taste and the health benefits are genuine.",
        datePublished: "2025-05-12",
      },
    ],
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/raw-honey-uttarakhand`,
      priceCurrency: "INR",
      price: "699",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    mainEntityOfPage: {
      "@id": "https://gharkaorganic.com/#webpage",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://gharkaorganic.com/pahadi-achar-online#product",
    name: "Kumaoni Aam Achar – Traditional Mango Pickle",
    description:
      "Traditional Kumaoni mango pickle prepared with pahadi raw mangoes, Himalayan spices and homemade mountain mustard oil. Authentic taste of Uttarakhand.",
    image: [
      PRODUCT_IMAGES.AAM_ACHAR["1x1"],
      PRODUCT_IMAGES.AAM_ACHAR["4x3"],
      PRODUCT_IMAGES.AAM_ACHAR["16x9"],
    ],
    sku: "GKO-PICKLE-AAM-001",
    brand: { "@type": "Brand", name: "Ghar Ka Organic" },
    category: "Organic Food Products > Pickles > Mango Pickle",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 5.0,
      reviewCount: 14,
      bestRating: 5,
      worstRating: 1,
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: 5,
          bestRating: 5,
          worstRating: 1,
        },
        author: { "@type": "Person", name: "Mohit Joshi" },
        reviewBody:
          "Exact taste of home pickles. No artificial flavor, no preservatives. This is how real achar should taste!",
        datePublished: "2025-05-08",
      },
    ],
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/pahadi-achar-online`,
      priceCurrency: "INR",
      price: "349",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    mainEntityOfPage: {
      "@id": "https://gharkaorganic.com/#webpage",
    },
  },
];

// ────────────────────────────────────────────────────────────────────────────
// HOOKS FOR RESPONSIVE DESIGN & VIEWPORT DETECTION
// ────────────────────────────────────────────────────────────────────────────

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

// ────────────────────────────────────────────────────────────────────────────
// VIEWPORT LAZY LOADER - REDUCES INITIAL LOAD, IMPROVES CORE WEB VITALS
// ────────────────────────────────────────────────────────────────────────────

const ViewportLoader = memo(({ children, rootMargin = "250px" }) => {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return <div ref={ref}>{ready && children}</div>;
});

ViewportLoader.displayName = "ViewportLoader";

// ────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE MASTER SCHEMA FOR AI CRAWLERS (Perplexity, ChatGPT, SGE)
// ────────────────────────────────────────────────────────────────────────────

const MASTER_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://gharkaorganic.com/#organization",
      name: "Ghar Ka Organic",
      alternateName: [
        "Ghar Ka Organic Uttarakhand",
        "Ghar Ka Organic Pickles",
        "GKO",
      ],
      url: "https://gharkaorganic.com/",
      logo: "https://gharkaorganic.com/logo/gharka-logo.png",
      description:
        "Authentic Himalayan organic food brand from Uttarakhand offering homemade pickles, natural honey, chutneys, and bilona desi ghee.",
      telephone: "+91-9897447525",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-9897447525",
        contactType: "customer service",
        availableLanguage: ["English", "Hindi"],
      },
      sameAs: [
        "https://www.instagram.com/gharkaorganic/",
        "https://www.facebook.com/gharkaorganic",
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://gharkaorganic.com/#localbusiness",
      name: "Ghar Ka Organic",
      image:
        "https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/og-cover-gko.webp",
      telephone: "+91-9897447525",
      url: "https://gharkaorganic.com/",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Nalni",
        addressLocality: "Nainital",
        addressRegion: "Uttarakhand",
        postalCode: "263002",
        addressCountry: "IN",
      },
      priceRange: "₹₹",
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://gharkaorganic.com/#website",
      url: "https://gharkaorganic.com/",
      name: "Ghar Ka Organic",
      publisher: { "@id": "https://gharkaorganic.com/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target:
          "https://gharkaorganic.com/collections?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://gharkaorganic.com/#webpage",
      url: "https://gharkaorganic.com/",
      name: "Ghar Ka Organic – Himalayan Homemade Pickles, Kumaoni Chutney & Uttarakhand Organic Products",
      isPartOf: { "@id": "https://gharkaorganic.com/#website" },
      about: { "@id": "https://gharkaorganic.com/#organization" },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/og-cover-gko.webp",
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [
          "h1",
          "h2",
          ".brand-story",
          ".product-features",
          ".our-story",
        ],
      },
    },
    {
      "@type": "ItemList",
      name: "Ghar Ka Organic Best Sellers",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Bilona Desi Ghee from Uttarakhand",
          url: "https://gharkaorganic.com/buy-desi-ghee-online",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Raw Pahadi Honey from Uttarakhand",
          url: "https://gharkaorganic.com/raw-honey-uttarakhand",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Kumaoni Aam Achar – Traditional Mango Pickle",
          url: "https://gharkaorganic.com/pahadi-achar-online",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Nimbu Achar – Lemon Pickle",
          url: "https://gharkaorganic.com/nimbu-achar-online",
        },
        {
          "@type": "ListItem",
          position: 5,
          name: "Bhang Chutney – Traditional Kumaoni Recipe",
          url: "https://gharkaorganic.com/pahadi-products-online",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Are Ghar Ka Organic products 100% natural?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. All our products are made with natural Himalayan ingredients sourced directly from Uttarakhand farms, completely free from artificial preservatives or chemicals.",
          },
        },
        {
          "@type": "Question",
          name: "Do you deliver across India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, we deliver our Pahadi products across all major cities and states in India with free shipping on orders above ₹499.",
          },
        },
        {
          "@type": "Question",
          name: "What makes your Bilona Desi Ghee special?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our Bilona Desi Ghee is made using the ancient hand-churning method from A2 cow milk in Uttarakhand, retaining all natural nutrients and pure aroma.",
          },
        },
      ],
    },
    ...HOMEPAGE_PRODUCT_SCHEMAS,
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// MAIN HOMEPAGE COMPONENT WITH HELMET SEO OPTIMIZATION
// ────────────────────────────────────────────────────────────────────────────

const HomePage = () => {
  const isMobile = useIsMobile();
  const { products: homeProducts = {}, loadingKeys = [] } =
    useHomepageProducts(homepageSections);

  const getProducts = useCallback(
    (key) => {
      const items = homeProducts[key] ?? [];
      return isMobile ? items.slice(0, 4) : items;
    },
    [homeProducts, isMobile],
  );

  const renderSection = useCallback(
    (key) => {
      const section = homepageSections.find((s) => s.key === key);
      if (!section) return null;
      return (
        <section key={section.key} className="w-full">
          <Suspense fallback={<GridSectionSkeleton />}>
            <ProductSection
              title={section.title}
              subtitle={section.subtitle}
              products={getProducts(section.key)}
              loading={loadingKeys.includes(section.key)}
            />
          </Suspense>
        </section>
      );
    },
    [getProducts, loadingKeys],
  );

  const desktopSlides = IMAGES?.hero?.desktopSlides ?? [];
  const mobileSlides = IMAGES?.hero?.mobileSlides ?? [];

  return (
    <main className="min-h-screen bg-white">
      {/* ┌─────────────────────────────────────────────────────────────┐ */}
      {/* │ HELMET - DYNAMIC SEO TAGS (TITLE, OG, SCHEMA, PRELOAD)     │ */}
      {/* └─────────────────────────────────────────────────────────────┘ */}
      <Helmet>
        {/* PERFORMANCE: RESOURCE HINTS FOR CORE WEB VITALS */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        {/* ┌───────────────────────────────────────────────────────┐ */}
        {/* │ CRITICAL SEO TAGS - TITLE, DESCRIPTION, CANONICAL    │ */}
        {/* └───────────────────────────────────────────────────────┘ */}
        <title>
          Ghar Ka Organic – Himalayan Homemade Pickles, Pahadi Honey & Desi Ghee
        </title>
        <meta
          name="description"
          content="Buy authentic Himalayan organic food from Uttarakhand. Ghar Ka Organic offers homemade pahadi pickles, kumaoni achar, raw forest honey, bilona desi ghee & traditional chutneys. Free shipping across India."
        />
        <meta
          name="keywords"
          content="pahadi achar, kumaoni achar, bilona desi ghee, pahadi honey, Uttarakhand organic food, homemade pickles, organic desi ghee, traditional food products"
        />
        <link rel="canonical" href="https://gharkaorganic.com/" />

        {/* ┌───────────────────────────────────────────────────────┐ */}
        {/* │ OPEN GRAPH - SOCIAL & AI CRAWLER SHARING             │ */}
        {/* └───────────────────────────────────────────────────────┘ */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta
          property="og:title"
          content="Ghar Ka Organic – Himalayan Homemade Pickles, Honey & Desi Ghee"
        />
        <meta
          property="og:description"
          content="Traditional Uttarakhand food products — pahadi pickles, kumaoni achar, raw pahadi honey, bilona desi ghee. Made at home, delivered across India."
        />
        <meta property="og:url" content="https://gharkaorganic.com/" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/og-cover-gko.webp"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />

        {/* ┌───────────────────────────────────────────────────────┐ */}
        {/* │ TWITTER CARD - X / TWITTER SHARING                   │ */}
        {/* └───────────────────────────────────────────────────────┘ */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Ghar Ka Organic – Pahadi Pickles, Honey & Desi Ghee"
        />
        <meta
          name="twitter:description"
          content="Pure Pahadi food products from Uttarakhand. Homemade, chemical-free, delivered across India."
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/og-cover-gko.webp"
        />

        {/* ┌───────────────────────────────────────────────────────┐ */}
        {/* │ 🚀 MASTER SCHEMA GRAPH 🚀                             │ */}
        {/* │ - Organization, LocalBusiness, Products with Reviews │ */}
        {/* │ - FAQPage, ItemList, Breadcrumb                      │ */}
        {/* │ - AI Crawler Support (Perplexity, ChatGPT, Google)  │ */}
        {/* └───────────────────────────────────────────────────────┘ */}
        <script type="application/ld+json">
          {JSON.stringify(MASTER_SCHEMA)}
        </script>
      </Helmet>

      {/* ┌─────────────────────────────────────────────────────────────┐ */}
      {/* │ HERO SECTION                                                 │ */}
      {/* └─────────────────────────────────────────────────────────────┘ */}
      <section className="w-full">
        <h1 className="sr-only">
          Ghar Ka Organic - Authentic Uttarakhand Himalayan Food Products
        </h1>
        <div className="w-full aspect-[16/9] sm:aspect-[16/7] md:aspect-[16/6]">
          <HeroSection
            desktopSlides={desktopSlides}
            mobileSlides={mobileSlides}
          />
        </div>
      </section>

      {/* ┌─────────────────────────────────────────────────────────────┐ */}
      {/* │ PRODUCT CATEGORY TABS                                        │ */}
      {/* └─────────────────────────────────────────────────────────────┘ */}
      <section
        className="w-full mt-6 md:mt-10 max-w-7xl mx-auto px-4"
        aria-label="Product Categories">
        <ProductSectionTabs productSections={productSections} />
      </section>

      {/* ┌─────────────────────────────────────────────────────────────┐ */}
      {/* │ PRODUCT SECTIONS - NEW ARRIVALS, PICKLES, HONEY, GHEE      │ */}
      {/* └─────────────────────────────────────────────────────────────┘ */}
      {renderSection("new")}

      <h2 className="sr-only">
        Shop Ghar Ka Organic — Authentic Pahadi Pickles, Raw Honey & Bilona Desi
        Ghee from Uttarakhand
      </h2>

      {renderSection("pickle")}
      <OurStoryComponent />

      <ViewportLoader>
        <ExploreOurPicks
          data={{
            img: "/banner/pahadiseid.png",
            label: "Uttarakhand Himalayan Organic Pickles Collection",
            link: "/collections/all",
          }}
        />
      </ViewportLoader>

      {renderSection("honey")}

      <ViewportLoader>
        <ExploreOurPicks
          data={{
            img: "/banner/pahadipickle.png",
            label: "Traditional Pahadi Organic Products from Uttarakhand",
            link: "/collections/all",
          }}
        />
      </ViewportLoader>

      {renderSection("ghee")}

      {/* ┌─────────────────────────────────────────────────────────────┐ */}
      {/* │ CUSTOMER REVIEWS - SOCIAL PROOF FOR RICH RESULTS            │ */}
      {/* └─────────────────────────────────────────────────────────────┘ */}
      <ViewportLoader rootMargin="300px">
        <CustomerReviewsSection showSchema={false} />
      </ViewportLoader>
      <ViewportLoader rootMargin="300px">
        <ReviewsGrid showSchema={false} />
      </ViewportLoader>

      {/* ┌─────────────────────────────────────────────────────────────┐ */}
      {/* │ FAQ SECTION - FEATURED SNIPPETS                             │ */}
      {/* └─────────────────────────────────────────────────────────────┘ */}
      <FAQSection />

      {/* ┌─────────────────────────────────────────────────────────────┐ */}
      {/* │ FOOTER CATEGORY LINKS - SEMANTIC NAV FOR SEO                │ */}
      {/* └─────────────────────────────────────────────────────────────┘ */}
      <nav
        className="max-w-7xl mx-auto px-4 py-8"
        aria-label="Footer category links">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
          {[
            { label: "Pahadi Achar Online", link: "/pahadi-achar-online" },
            {
              label: "Homemade Mango Pickle",
              link: "/buy-mango-pickle-online",
            },
            { label: "Nimbu Achar Online", link: "/nimbu-achar-online" },
            { label: "Buy Desi Ghee Online", link: "/buy-desi-ghee-online" },
            {
              label: "Bilona Ghee Uttarakhand",
              link: "/bilona-ghee-uttarakhand",
            },
            { label: "Raw Honey Uttarakhand", link: "/raw-honey-uttarakhand" },
            { label: "Natural Forest Honey", link: "/natural-honey-india" },
            {
              label: "Pahadi Products Online",
              link: "/pahadi-products-online",
            },
            {
              label: "Traditional Kumaoni Food",
              link: "/traditional-kumaoni-food",
            },
          ].map((item) => (
            <a
              key={item.link}
              href={item.link}
              className="text-gray-500 hover:text-[#C1121F] transition-colors font-medium hover:underline underline-offset-4">
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <ScrollToTopButton />
    </main>
  );
};

export default HomePage;
