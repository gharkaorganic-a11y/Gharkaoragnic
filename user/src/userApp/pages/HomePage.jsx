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

const SITE_URL = "https://gharkaorganic.com";
const SITE_NAME = "Ghar Ka Organic";

// Only these 4 keys are shown on homepage — order here = render order
const HOMEPAGE_KEYS = ["new", "pickle", "honey", "ghee"];

// Derived once at module level — stable reference, no re-computation on render
const homepageSections = productSections
  .filter((s) => HOMEPAGE_KEYS.includes(s.key))
  .sort((a, b) => HOMEPAGE_KEYS.indexOf(a.key) - HOMEPAGE_KEYS.indexOf(b.key));

/* ── hooks ─────────────────────────────────────────────────── */

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

/* ── viewport lazy loader ───────────────────────────────────── */

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

/* ── page ───────────────────────────────────────────────────── */

const HomePage = () => {
  const isMobile = useIsMobile();

  // FIX: pass only 4 sections — was passing all 9, firing 9 Firestore queries
  const { products: homeProducts = {}, loadingKeys = [] } =
    useHomepageProducts(homepageSections);

  const getProducts = useCallback(
    (key) => {
      const items = homeProducts[key] ?? [];
      return isMobile ? items.slice(0, 4) : items;
    },
    [homeProducts, isMobile],
  );

  // FIX: renderSection now takes a key string, not a section object
  // looks up from homepageSections — safe against reordering productSections
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
      {/* SEO — light, heavy meta already in index.html */}
      <Helmet>
        {/* PRIMARY SEO */}
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
          content="Ghar Ka Organic, Himalayan products, homemade pickles, pahadi achar, kumaoni achar, pahadi chutney, Uttarakhand organic food, bilona desi ghee, pahadi honey, Himalayan food products"
        />

        <meta property="og:site_name" content="Ghar Ka Organic" />

        <meta
          property="og:title"
          content="Ghar Ka Organic – Himalayan Organic Products"
        />

        <meta
          property="og:description"
          content="Traditional Uttarakhand homemade pickles, pahadi honey and Himalayan food products."
        />

        <meta
          property="og:image"
          content="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/uttarakhand-desi-ghee_mhth1n.webp"
        />

        <meta property="og:url" content="https://gharkaorganic.com/" />

        <meta name="twitter:card" content="summary_large_image" />

        <link rel="canonical" href="https://gharkaorganic.com/" />

        <meta name="author" content="Ghar Ka Organic" />

        {/* ORGANIZATION SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",

              name: "Ghar Ka Organic",

              url: "https://gharkaorganic.com",

              logo: "https://gharkaorganic.com/gharka-logo.png",

              sameAs: ["https://www.instagram.com/gharkaorganic/"],

              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91 98974 47525",
                contactType: "customer support",
                areaServed: "IN",
              },
            }),
          }}
        />

        {/* LOCAL BUSINESS SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",

              "@type": ["LocalBusiness", "FoodManufacturer", "OnlineStore"],

              name: "Ghar Ka Organic",

              image:
                "https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/uttarakhand-desi-ghee_mhth1n.webp",

              url: "https://gharkaorganic.com",

              telephone: "+91 98974 47525",

              priceRange: "₹₹",

              description:
                "Traditional Himalayan organic food brand from Uttarakhand offering homemade pickles, chutneys, pahadi honey and bilona desi ghee.",

              address: {
                "@type": "PostalAddress",
                streetAddress: "Ward No.2",
                addressLocality: "Nalni",
                addressRegion: "Uttarakhand",
                postalCode: "263002",
                addressCountry: "IN",
              },

              geo: {
                "@type": "GeoCoordinates",
                latitude: 29.3459,
                longitude: 79.5618,
              },

              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "00:00",
                closes: "23:59",
              },
            }),
          }}
        />

        {/* PRODUCT SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",

              "@type": "Product",

              name: "Kumaoni Aam Achar",

              image:
                "https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/uttarakhand-desi-ghee_mhth1n.webp",

              description:
                "Traditional homemade Kumaoni mango pickle prepared with Himalayan spices.",

              brand: {
                "@type": "Brand",
                name: "Ghar Ka Organic",
              },

              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "28",
              },

              offers: {
                "@type": "Offer",
                url: "https://gharkaorganic.com/",
                priceCurrency: "INR",
                price: "349",
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />
      </Helmet>
      {/* hero */}
      <section className="w-full">
        <div className="w-full aspect-[16/9] sm:aspect-[16/7] md:aspect-[16/6]">
          <HeroSection
            desktopSlides={desktopSlides}
            mobileSlides={mobileSlides}
          />
        </div>
      </section>
      {/* category tabs — full productSections for complete tab list */}
      <section className="w-full mt-6 md:mt-10 max-w-7xl mx-auto px-4">
        <ProductSectionTabs productSections={productSections} />{" "}
      </section>
      {/* section 1 — Most Loved / Bestsellers */}
      {renderSection("new")}
      <h2 className="sr-only">
        Ghar Ka Organic – Organic A2 Ghee, Honey & Pahadi Products from
        Uttarakhand
      </h2>
      {renderSection("pickle")}
      <OurStoryComponent />
      {/* explore banner 1 */}
      <ViewportLoader>
        <ExploreOurPicks
          data={{
            img: "/banner/pahadiseid.png",
            label: "Uttarakhand Himalayan Organic Pickles Collection",
            link: "/collections/all",
          }}
        />
      </ViewportLoader>
      {/* section 3 — Honey */}
      {renderSection("honey")}
      {/* explore banner 2 */}
      <ViewportLoader>
        <ExploreOurPicks
          data={{
            img: "/banner/pahadipickle.png",
            label: "Traditional Pahadi Organic Products from Uttarakhand",
            link: "/collections/all",
          }}
        />
      </ViewportLoader>
      {/* section 4 — Ghee */}
      {renderSection("ghee")}
      {/* reviews */}
      <ViewportLoader rootMargin="300px">
        <CustomerReviewsSection />
      </ViewportLoader>
      <ViewportLoader rootMargin="300px">
        <ReviewsGrid />
      </ViewportLoader>
      {/* FAQ */}
      <FAQSection />
      {/* ─── INTERNAL SEO LINKS ─── */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Explore Categories
          </h2>

          {/* subtle line */}
          <div className="flex-1 h-px bg-gray-200 ml-4 hidden sm:block" />
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
          {[
            { label: "Pahadi Achar", link: "/pahadi-achar-online" },
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

            { label: "Organic Food India", link: "/organic-food-india" },
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
          ].map((item) => (
            <a
              key={item.link}
              href={item.link}
              className="text-[#6b4f2c] hover:text-black transition-colors hover:underline underline-offset-4">
              {item.label}
            </a>
          ))}
        </div>

        {/* bottom divider */}
        <div className="my-8 h-px w-full bg-gray-200" />
      </section>
      <ScrollToTopButton />
    </main>
  );
};

export default HomePage;
