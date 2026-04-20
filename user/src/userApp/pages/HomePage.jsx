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
import CustomerReviewsScore from "../reviews/componenst/CustomerReviewsScore";
import ReviewsGrid from "../reviews/componenst/ReviewsGrid";
import FAQSection from "../homepage/FAQSection";
import ProductSectionTabs from "../features/p/components/ProductSectionTabs";
import HeroSection from "../homepage/HeroSection";
import ExploreOurPicks from "../homepage/ExploreOurPicks";

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
        <title>Ghar Ka Organic | Organic Achar & Honey</title>
        <meta
          name="description"
          content="Buy pahadi organic food online — achar, ghee, honey & more from Uttarakhand. 100% natural, homemade."
        />
        <link rel="canonical" href={`${SITE_URL}/`} />
      </Helmet>

      <h1 className="sr-only">
        Ghar Ka Organic - Pure Pahadi Organic Food from Uttarakhand
      </h1>
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
        <ProductSectionTabs productSections={productSections} />
      </section>

      {/* section 1 — Most Loved / Bestsellers */}
      {renderSection("new")}

      {/* section 2 — Pahadi Pickles */}
      {renderSection("pickle")}

      {/* explore banner 1 */}
      <ViewportLoader>
        <ExploreOurPicks
          data={{
            img: "/banner/pahadiseid.png",
            label: "Explore Our Picks",
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
            label: "Explore More",
            link: "/collections/all",
          }}
        />
      </ViewportLoader>

      {/* section 4 — Ghee */}
      {renderSection("ghee")}

      {/* reviews */}
      <ViewportLoader rootMargin="300px">
        <CustomerReviewsScore />
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
