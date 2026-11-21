import React, {
  Suspense,
  useEffect,
  useRef,
  useState,
  memo,
  useCallback,
  useMemo,
} from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { useHomepageProducts } from "../../userApp/features/homepage/hooks/useHomepageProducts";
import { productSections } from "../../userApp/features/homepage/config/productCollection";
import { preferredSlug } from "../features/p/utils/SECTIONKEY";

import { GridSectionSkeleton } from "../homepage/HomeSkeletons";
import ScrollToTopButton from "../../shared/components/ScrollToTopButton";
import ReviewsGrid from "../reviews/componenst/ReviewsGrid";
import FAQSection from "../homepage/FAQSection";
import HeroSection from "../homepage/HeroSection";
import OurStoryComponent from "../homepage/OurStoryComponent";
import ProductSectionTabs from "../features/p/components/ProductSectionTabs";

const ProductSection = React.lazy(
  () => import("../components/section/ProductSection"),
);
const LatestBlogSection = React.lazy(
  () => import("../homepage/LatestBlogSection"),
);

// ────────────────────────────────────────────────────────────────────────────
// SITE & CATALOG CONSTANTS (SYNCED WITH products.xml)
// ────────────────────────────────────────────────────────────────────────────

const SITE_URL = "https://gharkaorganic.com";
const SITE_NAME = "Ghar Ka Organic";
const OG_COVER =
  "https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/og-cover-gko.webp";

const HOMEPAGE_KEYS = [
  "new",
  "pickle",
  "honey",
  "ghee",
  "spices",
  "pahadiSalts",
  "pahadiDals",
  "chutney",
];

const homepageSections = productSections
  .filter((s) => HOMEPAGE_KEYS.includes(s.key))
  .sort((a, b) => HOMEPAGE_KEYS.indexOf(a.key) - HOMEPAGE_KEYS.indexOf(b.key));

const PRODUCT_IMAGES = {
  MIRCH_ACHAR: [
    "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790511602/gharka-organic/products/oqkqmdl1gul3fapq2vvc.jpg",
    "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790511797/gharka-organic/products/avxfuurudyzfkfxr5tuk.jpg",
    "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790511855/gharka-organic/products/gdem6cwiwmqstxfmcevg.jpg",
  ],
  HONEY: [
    "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790510595/gharka-organic/products/e6qmitnpen0qsgfimte0.jpg",
    "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790510847/gharka-organic/products/kuphlur3ibfrxvvtedyn.jpg",
    "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790510937/gharka-organic/products/ytvgvtbryywgo8lping9.jpg",
    "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790510934/gharka-organic/products/mreipmyktszouigab3ym.jpg",
  ],
  PAHADI_SALT: [
    "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790512823/gharka-organic/products/fttrz26ukuxngr2knc7f.jpg",
    "https://res.cloudinary.com/dwgro3zo7/image/upload/v1783342423/gharka-organic/products/ub37cgkucwvi3soe6eay.jpg",
    "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790512828/gharka-organic/products/n3afebifisjqjmavitwi.jpg",
    "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790512877/gharka-organic/products/pil8isw0yt2souupx8bj.jpg",
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// VALID MERCHANT LISTING POLICY & SHIPPING (ZERO GSC WARNINGS)
// ────────────────────────────────────────────────────────────────────────────

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

const buildOffer = (url, price) => ({
  "@type": "Offer",
  url,
  priceCurrency: "INR",
  price,
  availability: "https://schema.org/InStock",
  itemCondition: "https://schema.org/NewCondition",
  seller: { "@id": `${SITE_URL}/#organization` },
  hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
  shippingDetails: OFFER_SHIPPING_DETAILS,
});

// ────────────────────────────────────────────────────────────────────────────
// PRODUCT & PRODUCTGROUP SCHEMAS (1:1 PARITY WITH products.xml)
// ────────────────────────────────────────────────────────────────────────────

const BASE_CATALOG_SCHEMAS = [
  // 1. MIRCH KA ACHAR (ProductGroup with 400g & 200g variants)
  {
    "@type": "ProductGroup",
    "@id": `${SITE_URL}/product/ghar-ka-mirch-ka-achar-green-chilly-pickle#productgroup`,
    name: "GHAR KA Mirch Ka Achar (Green Chilly Pickle)",
    description:
      "Add a bold, chilli-forward accompaniment to everyday meals with Ghar Ka Mirch Ka Achar. Serve alongside dal, rice, roti, or paratha. Made with green chillies, mustard oil, salt and spices.",
    url: `${SITE_URL}/product/ghar-ka-mirch-ka-achar-green-chilly-pickle`,
    image: PRODUCT_IMAGES.MIRCH_ACHAR,
    brand: { "@type": "Brand", name: SITE_NAME },
    productGroupID: "ZWofOslgko0mL5rSPn70",
    variesBy: ["https://schema.org/size"],
    hasVariant: [
      {
        "@type": "Product",
        "@id": `${SITE_URL}/product/ghar-ka-mirch-ka-achar-green-chilly-pickle#400g`,
        sku: "ZWofOslgko0mL5rSPn70",
        mpn: "GKO-MKA-400",
        name: "GHAR KA Mirch Ka Achar (Green Chilly Pickle) - 400g",
        description:
          "Add a bold, chilli-forward accompaniment to everyday meals with Ghar Ka Mirch Ka Achar. Serve alongside dal, rice, roti, or paratha. 400g pack.",
        size: "400g",
        image: PRODUCT_IMAGES.MIRCH_ACHAR,
        brand: { "@type": "Brand", name: SITE_NAME },
        countryOfOrigin: { "@type": "Country", name: "India" },
        category:
          "Food, Beverages & Tobacco > Food Items > Condiments & Sauces > Pickles",
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Ingredients",
            value: "Green chillies, mustard oil, salt and spices",
          },
          {
            "@type": "PropertyValue",
            name: "Pack Size",
            value: "400g",
          },
        ],
        offers: buildOffer(
          `${SITE_URL}/product/ghar-ka-mirch-ka-achar-green-chilly-pickle`,
          "219.00",
        ),
      },
      {
        "@type": "Product",
        "@id": `${SITE_URL}/product/ghar-ka-mirch-ka-achar-green-chilly-pickle#200g`,
        sku: "ZWofOslgko0mL5rSPn70-200g",
        mpn: "GKO-MKA-200",
        name: "GHAR KA Mirch Ka Achar - 200g",
        description:
          "Add a bold, chilli-forward accompaniment to everyday meals with Ghar Ka Mirch Ka Achar. Convenient 200g pack.",
        size: "200g",
        image: PRODUCT_IMAGES.MIRCH_ACHAR,
        brand: { "@type": "Brand", name: SITE_NAME },
        countryOfOrigin: { "@type": "Country", name: "India" },
        category:
          "Food, Beverages & Tobacco > Food Items > Condiments & Sauces > Pickles",
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Ingredients",
            value: "Green chillies, mustard oil, salt and spices",
          },
          {
            "@type": "PropertyValue",
            name: "Pack Size",
            value: "200g",
          },
        ],
        offers: buildOffer(
          `${SITE_URL}/product/ghar-ka-mirch-ka-achar-green-chilly-pickle`,
          "219.00",
        ),
      },
    ],
  },

  // 2. GHAR KA HONEY (ProductGroup with 200ml & 500g variants)
  {
    "@type": "ProductGroup",
    "@id": `${SITE_URL}/product/ghar-ka-honey#productgroup`,
    name: "GHAR KA HONEY",
    description:
      "Enjoy the natural sweetness, delicate floral notes, and rich aroma of Ghar Ka Honey. Drizzle over breakfast, stir into a warm drink, or use in desserts.",
    url: `${SITE_URL}/product/ghar-ka-honey`,
    image: PRODUCT_IMAGES.HONEY,
    brand: { "@type": "Brand", name: SITE_NAME },
    productGroupID: "ao89cm2OF6P7grMhxriz",
    variesBy: ["https://schema.org/size"],
    hasVariant: [
      {
        "@type": "Product",
        "@id": `${SITE_URL}/product/ghar-ka-honey#200ml`,
        sku: "ao89cm2OF6P7grMhxriz",
        mpn: "GKO-HNY-200",
        name: "GHAR KA HONEY - 200ml",
        description:
          "Natural raw honey with delicate floral notes and a rich aroma. 200ml pack.",
        size: "200ml",
        image: PRODUCT_IMAGES.HONEY,
        brand: { "@type": "Brand", name: SITE_NAME },
        countryOfOrigin: { "@type": "Country", name: "India" },
        category:
          "Food, Beverages & Tobacco > Food Items > Condiments & Sauces > Honey",
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Ingredients",
            value: "Natural raw honey",
          },
          {
            "@type": "PropertyValue",
            name: "Pack Size",
            value: "200ml",
          },
        ],
        offers: buildOffer(`${SITE_URL}/product/ghar-ka-honey`, "299.00"),
      },
      {
        "@type": "Product",
        "@id": `${SITE_URL}/product/ghar-ka-honey#500g`,
        sku: "ao89cm2OF6P7grMhxriz-500g",
        mpn: "GKO-HNY-500",
        name: "GHAR KA HONEY - 500g",
        description:
          "Enjoy the natural sweetness, delicate floral notes, and rich aroma of Ghar Ka Honey. Convenient 500g pack.",
        size: "500g",
        image: PRODUCT_IMAGES.HONEY,
        brand: { "@type": "Brand", name: SITE_NAME },
        countryOfOrigin: { "@type": "Country", name: "India" },
        category:
          "Food, Beverages & Tobacco > Food Items > Condiments & Sauces > Honey",
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Ingredients",
            value: "Natural raw honey",
          },
          {
            "@type": "PropertyValue",
            name: "Pack Size",
            value: "500g",
          },
        ],
        offers: buildOffer(`${SITE_URL}/product/ghar-ka-honey`, "499.00"),
      },
    ],
  },

  // 3. PAHADI SALT (Single Product - 100g)
  {
    "@type": "Product",
    "@id": `${SITE_URL}/product/pahadi-salt-with-dhaniya-garlic-and-green-chillies#product`,
    sku: "ehZZCz1I6DHi4w6dhLRg",
    mpn: "GKO-SLT-100",
    name: "Pahadi Salt with Dhaniya, Garlic and Green Chillies",
    description:
      "Bring an aromatic Pahadi-style seasoning to everyday meals. Himalayan salt is combined with coriander, garlic, and green chilli for savory, herby flavor with a gentle chilli kick.",
    size: "100g",
    image: PRODUCT_IMAGES.PAHADI_SALT,
    brand: { "@type": "Brand", name: SITE_NAME },
    countryOfOrigin: { "@type": "Country", name: "India" },
    category: "Food, Beverages & Tobacco > Food Items > Seasonings & Spices",
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Ingredients",
        value: "Salt, garlic, coriander and green chilli",
      },
      {
        "@type": "PropertyValue",
        name: "Pack Size",
        value: "100g",
      },
    ],
    offers: buildOffer(
      `${SITE_URL}/product/pahadi-salt-with-dhaniya-garlic-and-green-chillies`,
      "99.00",
    ),
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
// VIEWPORT LAZY LOADER
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
// MAIN HOMEPAGE COMPONENT
// ────────────────────────────────────────────────────────────────────────────

const HomePage = () => {
  const isMobile = useIsMobile();
  const {
    products: homeProducts = {},
    loadingKeys = [],
    errors = {},
    refetchProducts,
  } = useHomepageProducts(homepageSections);

  const allHomepageProducts = useMemo(() => {
    const productsById = new Map();
    Object.values(homeProducts)
      .flat()
      .forEach((product) => {
        if (product?.id && !productsById.has(product.id)) {
          productsById.set(product.id, product);
        }
      });
    return [...productsById.values()];
  }, [homeProducts]);

  // Attach genuine backend ratings & reviews dynamically (never static fake reviews)
  const enrichedCatalogSchemas = useMemo(() => {
    const attachRealReviews = (productNode, groupId) => {
      const matched = allHomepageProducts.find(
        (p) =>
          p?.id === productNode.sku ||
          p?.id === groupId ||
          (p?.slug && productNode.offers?.url?.includes(p.slug)),
      );
      if (!matched) return productNode;

      const updated = { ...productNode };
      const ratingVal = Number(matched.rating || matched.averageRating || 0);
      const countVal = Number(
        matched.reviewCount || matched.reviews?.length || 0,
      );

      if (ratingVal > 0 && countVal > 0) {
        updated.aggregateRating = {
          "@type": "AggregateRating",
          ratingValue: ratingVal.toFixed(1),
          reviewCount: String(countVal),
          bestRating: "5",
          worstRating: "1",
        };
      }

      if (Array.isArray(matched.reviews) && matched.reviews.length > 0) {
        const validReviews = matched.reviews
          .filter((r) => Number(r?.rating) > 0 && (r?.comment || r?.reviewBody))
          .slice(0, 3)
          .map((r) => ({
            "@type": "Review",
            author: {
              "@type": "Person",
              name: r.userName || r.author || "Verified Buyer",
            },
            datePublished: r.createdAt
              ? new Date(r.createdAt).toISOString().split("T")[0]
              : "2026-11-01",
            reviewBody: r.comment || r.reviewBody,
            reviewRating: {
              "@type": "Rating",
              ratingValue: String(r.rating),
              bestRating: "5",
              worstRating: "1",
            },
          }));

        if (validReviews.length > 0) {
          updated.review = validReviews;
        }
      }

      return updated;
    };

    return BASE_CATALOG_SCHEMAS.map((entry) => {
      if (
        entry["@type"] === "ProductGroup" &&
        Array.isArray(entry.hasVariant)
      ) {
        return {
          ...entry,
          hasVariant: entry.hasVariant.map((variant) =>
            attachRealReviews(variant, entry.productGroupID),
          ),
        };
      }
      return attachRealReviews(entry, entry.sku);
    });
  }, [allHomepageProducts]);

  // Master Schema.org Graph unlocking Google Shopping, Brand Profile & Rich Snippets
  const masterSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          "@id": `${SITE_URL}/#localbusiness`,
          name: SITE_NAME,
          alternateName: ["Ghar Ka Organic Uttarakhand", "GKO"],
          description:
            "Authentic Himalayan organic food brand from Nainital, Uttarakhand offering homemade Mirch Ka Achar (Green Chilly Pickle), natural raw honey, and Pahadi Salt.",
          image: OG_COVER,
          logo: `${SITE_URL}/logo/gharka-logo-full.png`,
          telephone: "+91-9897447525",
          email: "gharkaorganic@gmail.com",
          url: `${SITE_URL}/`,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Ward No. 2, Nalni",
            addressLocality: "Nainital",
            addressRegion: "Uttarakhand",
            postalCode: "263002",
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 29.3459,
            longitude: 79.5618,
          },
          areaServed: {
            "@type": "Country",
            name: "India",
          },
          sameAs: [
            "https://www.instagram.com/gharkaorganic/",
            "https://www.facebook.com/gharkaorganic",
          ],
          priceRange: "₹99 – ₹499",
          openingHoursSpecification: [
            {
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
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Sunday",
              opens: "10:00",
              closes: "16:00",
            },
          ],
        },
        {
          "@type": "WebPage",
          "@id": `${SITE_URL}/#webpage`,
          url: `${SITE_URL}/`,
          name: "Ghar Ka Organic – Mirch Ka Achar, Natural Raw Honey & Pahadi Salt from Uttarakhand",
          description:
            "Buy authentic Himalayan organic food from Uttarakhand. Ghar Ka Organic offers homemade Mirch Ka Achar, natural raw honey & Pahadi Salt with free shipping across India.",
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: { "@id": `${SITE_URL}/#organization` },
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: OG_COVER,
            width: 1200,
            height: 630,
          },
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: [
              "h1",
              "h2",
              ".our-story",
              "[data-testid='product-title']",
            ],
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${SITE_URL}/#breadcrumb`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `${SITE_URL}/`,
            },
          ],
        },
        {
          "@type": "SiteLinksSearchBox",
          "@id": `${SITE_URL}/#searchbox`,
          url: `${SITE_URL}/`,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/collections?search={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        },
        {
          "@type": "ItemList",
          "@id": `${SITE_URL}/#bestsellers`,
          name: "Ghar Ka Organic Products",
          description:
            "Authentic Himalayan organic food products from Ghar Ka Organic",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "GHAR KA Mirch Ka Achar (Green Chilly Pickle)",
              url: `${SITE_URL}/product/ghar-ka-mirch-ka-achar-green-chilly-pickle`,
              image: PRODUCT_IMAGES.MIRCH_ACHAR[0],
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "GHAR KA HONEY",
              url: `${SITE_URL}/product/ghar-ka-honey`,
              image: PRODUCT_IMAGES.HONEY[0],
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Pahadi Salt with Dhaniya, Garlic and Green Chillies",
              url: `${SITE_URL}/product/pahadi-salt-with-dhaniya-garlic-and-green-chillies`,
              image: PRODUCT_IMAGES.PAHADI_SALT[0],
            },
          ],
        },
        {
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What products does Ghar Ka Organic offer?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Ghar Ka Organic offers authentic Himalayan organic food products from Uttarakhand including GHAR KA Mirch Ka Achar (Green Chilly Pickle in 200g and 400g packs), GHAR KA HONEY (natural raw honey in 200ml and 500g packs), and Pahadi Salt with Dhaniya, Garlic and Green Chillies (100g pack).",
              },
            },
            {
              "@type": "Question",
              name: "Are Ghar Ka Organic products free from artificial preservatives?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Every product is made in small batches in Uttarakhand using simple, natural ingredients—such as green chillies, mustard oil, Himalayan salt, coriander, garlic, and raw honey—without artificial colors or synthetic preservatives.",
              },
            },
            {
              "@type": "Question",
              name: "Do you offer free shipping across India?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, we deliver across India with free shipping (₹0) and typical delivery in 4–7 business days.",
              },
            },
            {
              "@type": "Question",
              name: "What is your return policy?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We offer a 7-day return window via mail-in return with free return shipping and no restocking fees.",
              },
            },
          ],
        },
        ...enrichedCatalogSchemas,
      ],
    }),
    [enrichedCatalogSchemas],
  );

  const getProducts = useCallback(
    (key) => {
      const items =
        key === "all" ? allHomepageProducts : (homeProducts[key] ?? []);
      return isMobile ? items.slice(0, 4) : items;
    },
    [allHomepageProducts, homeProducts, isMobile],
  );

  const renderSection = useCallback(
    (key) => {
      const section = productSections.find((s) => s.key === key);
      if (!section) return null;
      const sectionProducts = getProducts(section.key);
      const sectionError =
        section.key === "all"
          ? (Object.values(errors)[0] ?? "")
          : (errors[section.key] ?? "");
      return (
        <section key={section.key} className="w-full">
          <Suspense fallback={<GridSectionSkeleton />}>
            <ProductSection
              title={section.title}
              subtitle={section.subtitle}
              badge={section.badge}
              products={sectionProducts}
              compact
              loading={
                section.key === "all"
                  ? loadingKeys.length > 0
                  : loadingKeys.includes(section.key)
              }
              error={sectionError}
              onRetry={() => refetchProducts()}
              navigateTo={
                section.key === "all"
                  ? "/collections"
                  : `/${preferredSlug[section.key] ?? section.key}`
              }
            />
          </Suspense>
        </section>
      );
    },
    [errors, getProducts, loadingKeys, refetchProducts],
  );

  return (
    <main className="min-h-screen bg-white">
      <Helmet>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        <title>
          Ghar Ka Organic – Mirch Ka Achar, Raw Honey &amp; Pahadi Salt from
          Uttarakhand
        </title>
        <meta
          name="description"
          content="Shop authentic Himalayan organic food from Uttarakhand. Ghar Ka Organic offers homemade Mirch Ka Achar (Green Chilly Pickle), natural raw honey &amp; Pahadi Salt with dhaniya, garlic and green chillies. Free shipping across India."
        />
        <meta
          name="keywords"
          content="ghar ka organic, mirch ka achar, green chilly pickle, pahadi achar, ghar ka honey, raw honey uttarakhand, pahadi salt, himalayan organic food"
        />
        <link rel="canonical" href={`${SITE_URL}/`} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta
          property="og:title"
          content="Ghar Ka Organic – Mirch Ka Achar, Raw Honey &amp; Pahadi Salt"
        />
        <meta
          property="og:description"
          content="Authentic Himalayan organic food products from Uttarakhand — Mirch Ka Achar, natural raw honey, and Pahadi Salt. Free shipping across India."
        />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:image" content={OG_COVER} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Ghar Ka Organic – Mirch Ka Achar, Raw Honey &amp; Pahadi Salt"
        />
        <meta
          name="twitter:description"
          content="Pure Himalayan organic food products from Uttarakhand with free shipping across India."
        />
        <meta name="twitter:image" content={OG_COVER} />

        <script type="application/ld+json">
          {JSON.stringify(masterSchema)}
        </script>
      </Helmet>

      {/* HERO SECTION */}
      <section className="w-full">
        <HeroSection />
      </section>

      <ProductSectionTabs title="New to Ghar Ka Organic? Start Here" />

      {/* NEW ARRIVALS / BEST SELLERS */}
      {renderSection("new")}

      {/* OUR STORY */}
      <ViewportLoader>
        <OurStoryComponent />
      </ViewportLoader>

      {/* SIGNATURE PAHADI PICKLES & ACHAR */}
      {renderSection("pickle")}

      {/* RAW FOREST HONEY */}
      {renderSection("honey")}

      {/* TRADITIONAL A2 BILONA GHEE */}
      {renderSection("ghee")}

      {/* CUSTOMER REVIEWS */}
      <ViewportLoader rootMargin="300px">
        <ReviewsGrid showSchema={false} />
      </ViewportLoader>

      {/* LATEST BLOGS */}
      <ViewportLoader rootMargin="300px">
        <Suspense fallback={null}>
          <LatestBlogSection />
        </Suspense>
      </ViewportLoader>

      {/* FAQ SECTION */}
      <FAQSection />

      {/* FOOTER CATEGORY & PRODUCT LINKS */}
      <nav
        className="max-w-7xl mx-auto px-4 py-8"
        aria-label="Footer category links">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
          {[
            {
              label: "Mirch Ka Achar (Green Chilly Pickle)",
              to: "/product/ghar-ka-mirch-ka-achar-green-chilly-pickle",
            },
            {
              label: "GHAR KA HONEY",
              to: "/product/ghar-ka-honey",
            },
            {
              label: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
              to: "/product/pahadi-salt-with-dhaniya-garlic-and-green-chillies",
            },
            {
              label: "All Organic Products",
              to: "/collections",
            },
            {
              label: "Customer Reviews",
              to: "/reviews",
            },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="font-medium text-gray-500 transition-colors hover:text-[#315c3c] hover:underline underline-offset-4">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <ScrollToTopButton />
    </main>
  );
};

export default HomePage;
