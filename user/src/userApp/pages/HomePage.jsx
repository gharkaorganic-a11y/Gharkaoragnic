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

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

const SITE_URL = "https://gharkaorganic.com";
const SITE_NAME = "Ghar Ka Organic";
const HOMEPAGE_KEYS = ["new", "pickle", "honey", "ghee"];

const homepageSections = productSections
  .filter((s) => HOMEPAGE_KEYS.includes(s.key))
  .sort((a, b) => HOMEPAGE_KEYS.indexOf(a.key) - HOMEPAGE_KEYS.indexOf(b.key));

// IMPORTANT: Replace these URLs with your actual product images from Cloudinary
// Each product needs 3 ratios: 1x1, 4x3, 16x9 for best rich results
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

// ─── STRUCTURED DATA SCHEMAS ────────────────────────────────────────────────

const HOMEPAGE_PRODUCT_SCHEMAS = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://gharkaorganic.com/buy-desi-ghee-online#product",
    name: "Bilona Desi Ghee from Uttarakhand",
    description:
      "Traditional Bilona Desi Ghee made using the ancient hand-churning method from A2 cow milk in Uttarakhand. Pure, chemical-free and rich in natural nutrients.",
    image: [
      PRODUCT_IMAGES.GHEE["1x1"],
      PRODUCT_IMAGES.GHEE["4x3"],
      PRODUCT_IMAGES.GHEE["16x9"],
    ],
    sku: "GKO-GHEE-001",
    brand: { "@type": "Brand", name: "Ghar Ka Organic" },
    manufacturer: { "@id": "https://gharkaorganic.com/#organization" },
    category: "Dairy & Ghee",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: 24,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/buy-desi-ghee-online`,
      priceCurrency: "INR",
      price: 1299,
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": "https://gharkaorganic.com/#organization" },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 15,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://gharkaorganic.com/raw-honey-uttarakhand#product",
    name: "Raw Pahadi Honey from Uttarakhand",
    description:
      "Natural Himalayan Pahadi Honey collected from wild forest bees in Uttarakhand. Raw, unfiltered, unprocessed and free from any additives or sugar.",
    image: [
      PRODUCT_IMAGES.HONEY["1x1"],
      PRODUCT_IMAGES.HONEY["4x3"],
      PRODUCT_IMAGES.HONEY["16x9"],
    ],
    sku: "GKO-HONEY-001",
    brand: { "@type": "Brand", name: "Ghar Ka Organic" },
    manufacturer: { "@id": "https://gharkaorganic.com/#organization" },
    category: "Honey & Sweeteners",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: 18,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/raw-honey-uttarakhand`,
      priceCurrency: "INR",
      price: 699,
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": "https://gharkaorganic.com/#organization" },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 15,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://gharkaorganic.com/pahadi-achar-online#product",
    name: "Kumaoni Aam Achar – Traditional Mango Pickle",
    description:
      "Traditional Kumaoni mango pickle prepared with pahadi raw mangoes, Himalayan spices and homemade mountain mustard oil. Authentic homemade taste with no preservatives.",
    image: [
      PRODUCT_IMAGES.AAM_ACHAR["1x1"],
      PRODUCT_IMAGES.AAM_ACHAR["4x3"],
      PRODUCT_IMAGES.AAM_ACHAR["16x9"],
    ],
    sku: "GKO-PICKLE-AAM-001",
    brand: { "@type": "Brand", name: "Ghar Ka Organic" },
    manufacturer: { "@id": "https://gharkaorganic.com/#organization" },
    category: "Pickles & Achar",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 5.0,
      reviewCount: 14,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/pahadi-achar-online`,
      priceCurrency: "INR",
      price: 349,
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": "https://gharkaorganic.com/#organization" },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 15,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://gharkaorganic.com/nimbu-achar-online#product",
    name: "Pahadi Nimbu Achar – Homemade Lemon Pickle",
    description:
      "Homemade Pahadi lemon pickle inspired by traditional Kumaoni recipes. Tangy, spicy and made with pure mountain ingredients. No artificial preservatives.",
    image: [
      PRODUCT_IMAGES.NIMBU_ACHAR["1x1"],
      PRODUCT_IMAGES.NIMBU_ACHAR["4x3"],
      PRODUCT_IMAGES.NIMBU_ACHAR["16x9"],
    ],
    sku: "GKO-PICKLE-NIMBU-001",
    brand: { "@type": "Brand", name: "Ghar Ka Organic" },
    manufacturer: { "@id": "https://gharkaorganic.com/#organization" },
    category: "Pickles & Achar",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.8,
      reviewCount: 11,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/nimbu-achar-online`,
      priceCurrency: "INR",
      price: 299,
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": "https://gharkaorganic.com/#organization" },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 15,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://gharkaorganic.com/pahadi-products-online#product",
    name: "Bhang Ki Chutney – Traditional Kumaoni Hemp Seed Chutney",
    description:
      "Traditional Kumaoni Bhang Ki Chutney made with Himalayan hemp seeds and mountain spices. A classic Uttarakhand condiment — nutty, earthy and preservative-free.",
    image: [
      PRODUCT_IMAGES.BHANG_CHUTNEY["1x1"],
      PRODUCT_IMAGES.BHANG_CHUTNEY["4x3"],
      PRODUCT_IMAGES.BHANG_CHUTNEY["16x9"],
    ],
    sku: "GKO-CHUTNEY-BHANG-001",
    brand: { "@type": "Brand", name: "Ghar Ka Organic" },
    manufacturer: { "@id": "https://gharkaorganic.com/#organization" },
    category: "Chutneys & Condiments",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: 9,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/pahadi-products-online`,
      priceCurrency: "INR",
      price: 249,
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": "https://gharkaorganic.com/#organization" },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 15,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
    },
  },
];

const HOMEPAGE_ITEMLIST_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Ghar Ka Organic Best Sellers",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      url: "https://gharkaorganic.com/buy-desi-ghee-online",
    },
    {
      "@type": "ListItem",
      position: 2,
      url: "https://gharkaorganic.com/raw-honey-uttarakhand",
    },
    {
      "@type": "ListItem",
      position: 3,
      url: "https://gharkaorganic.com/pahadi-achar-online",
    },
    {
      "@type": "ListItem",
      position: 4,
      url: "https://gharkaorganic.com/nimbu-achar-online",
    },
    {
      "@type": "ListItem",
      position: 5,
      url: "https://gharkaorganic.com/pahadi-products-online",
    },
  ],
};

const HOMEPAGE_WEBPAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://gharkaorganic.com/#webpage",
  url: "https://gharkaorganic.com/",
  name: "Ghar Ka Organic – Himalayan Homemade Pickles, Kumaoni Chutney & Uttarakhand Organic Products",
  description:
    "Buy homemade Himalayan food products from Uttarakhand — pahadi pickles, kumaoni achar, traditional chutneys, natural pahadi honey, bilona desi ghee and organic village food products delivered across India.",
  isPartOf: { "@id": "https://gharkaorganic.com/#website" },
  about: { "@id": "https://gharkaorganic.com/#organization" },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: "https://gharkaorganic.com/og-cover.png",
  },
  inLanguage: "en-IN",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".hero-description", ".our-story-text"],
  },
};

// ─── HOOKS ──────────────────────────────────────────────────────────────────

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

// ─── VIEWPORT LAZY LOADER ───────────────────────────────────────────────────

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

// ─── PAGE ────────────────────────────────────────────────────────────────────

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
      <Helmet>
        <title>
          Ghar Ka Organic – Himalayan Homemade Pickles, Kumaoni Chutney &
          Uttarakhand Organic Products
        </title>
        <meta
          name="description"
          content="Buy homemade Himalayan food products from Uttarakhand — pahadi pickles, kumaoni achar, traditional chutneys, natural pahadi honey, bilona desi ghee and organic village food products delivered across India."
        />
        <meta
          name="keywords"
          content="pahadi achar, kumaoni achar, bilona desi ghee, pahadi honey, Uttarakhand organic food, homemade pickles India, Ghar Ka Organic"
        />
        <link rel="canonical" href="https://gharkaorganic.com/" />
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
          content="https://gharkaorganic.com/og-cover.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
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
          content="https://gharkaorganic.com/og-cover.png"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(HOMEPAGE_WEBPAGE_SCHEMA),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(HOMEPAGE_ITEMLIST_SCHEMA),
          }}
        />
        {HOMEPAGE_PRODUCT_SCHEMAS.map((schema) => (
          <script
            key={schema["@id"]}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </Helmet>

      <section className="w-full">
        <div className="w-full aspect-[16/9] sm:aspect-[16/7] md:aspect-[16/6]">
          <HeroSection
            desktopSlides={desktopSlides}
            mobileSlides={mobileSlides}
          />
        </div>
      </section>

      <section className="w-full mt-6 md:mt-10 max-w-7xl mx-auto px-4">
        <ProductSectionTabs productSections={productSections} />
      </section>

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

      <ViewportLoader rootMargin="300px">
        <CustomerReviewsSection showSchema={false} />
      </ViewportLoader>
      <ViewportLoader rootMargin="300px">
        <ReviewsGrid showSchema={false} />
      </ViewportLoader>

      <FAQSection />

      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Explore Categories
          </h2>
          <div className="flex-1 h-px bg-gray-200 ml-4 hidden sm:block" />
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
          {[
            { label: "Pahadi Achar Online", link: "/pahadi-achar-online" },
            {
              label: "Homemade Mango Pickle",
              link: "/buy-mango-pickle-online",
            },
            { label: "Nimbu Achar Online", link: "/nimbu-achar-online" },
            { label: "Mixed Pickle India", link: "/homemade-pickle-india" },
            { label: "Buy Desi Ghee Online", link: "/buy-desi-ghee-online" },
            {
              label: "Bilona Ghee Uttarakhand",
              link: "/bilona-ghee-uttarakhand",
            },
            { label: "A2 Cow Ghee India", link: "/a2-ghee-india" },
            { label: "Raw Honey Uttarakhand", link: "/raw-honey-uttarakhand" },
            { label: "Natural Forest Honey", link: "/natural-honey-india" },
            { label: "Chemical-Free Food", link: "/chemical-free-food-india" },
            {
              label: "Pahadi Products Online",
              link: "/pahadi-products-online",
            },
            {
              label: "Uttarakhand Food Products",
              link: "/uttarakhand-food-products",
            },
            {
              label: "Traditional Kumaoni Food",
              link: "/traditional-kumaoni-food",
            },
            { label: "Himalayan Organic Food", link: "/organic-food-india" },
          ].map((item) => (
            <a
              key={item.link}
              href={item.link}
              className="text-[#6b4f2c] hover:text-black transition-colors hover:underline underline-offset-4">
              {item.label}
            </a>
          ))}
        </div>

        <div className="my-8 h-px w-full bg-gray-200" />
      </section>

      <ScrollToTopButton />
    </main>
  );
};

export default HomePage;
