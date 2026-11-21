import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

/* ───────── EAGER ───────── */
import UserLayout from "./userApp/layouts/UserLayout";
import LoadingScreen from "./userApp/components/loading/LoadingScreen";
import NotFoundPage from "./userApp/pages/NotFoundPage";
import ErrorBoundary from "./shared/components/ErrorBoundary";
import SitemapPage from "./userApp/pages/SitemapPage";
import ReviewsPage from "./userApp/reviews/pages/CustomerReviewsPage";
import BlogListPage from "./userApp/pages/blog/BlogListPage";
import BlogDetailPage from "./userApp/pages/blog/BlogDetailPage";
import BestSellersPage from "./userApp/features/p/BestSellersPage";
import ShippingPage from "./userApp/pages/ShippingPolicyPage";
import PrivacyPolicyPage from "./userApp/pages/PrivacyPolicyPage";

/* ───────── LAZY ───────── */
const lazyWithChunkRecovery = (loadPage) =>
  lazy(() => {
    const reloadKey = `chunk-reload:${window.location.pathname}`;
    return loadPage()
      .then((module) => {
        sessionStorage.removeItem(reloadKey);
        return module;
      })
      .catch((error) => {
        const alreadyReloaded = sessionStorage.getItem(reloadKey);

        if (
          !alreadyReloaded &&
          /importing a module script|failed to fetch dynamically imported module|loading chunk/i.test(
            error?.message ?? "",
          )
        ) {
          sessionStorage.setItem(reloadKey, "1");
          window.location.reload();
        }

        throw error;
      });
  });

const HomePage = lazyWithChunkRecovery(() => import("./userApp/pages/HomePage"));
const CollectionPage = lazyWithChunkRecovery(
  () => import("./userApp/features/p/CollectionPage"),
);
const CategoriesPage = lazy(
  () => import("./userApp/features/category/pages/CategoriesPage"),
);
const ProductDetailsPage = lazyWithChunkRecovery(
  () => import("./userApp/pages/ProductDetailsPage"),
);
// const BlogListPage = lazy(() => import("./userApp/pages/blog/BlogListPage"));
const ContactUsPage = lazyWithChunkRecovery(() => import("./userApp/pages/ContactUsPage"));
const OurStoryPage = lazy(() => import("./userApp/pages/OurStoryPage"));
const FaqPage = lazy(() => import("./userApp/pages/FaqPage"));
const WebsiteDeveloperPage = lazy(
  () => import("./userApp/pages/WebsiteDeveloperPage"),
);
const SearchPage = lazy(() => import("./userApp/pages/SearchPage"));
const CheckoutRoutes = lazy(() => import("./userApp/routes/CheckoutRoutes"));
const OrderConfirmationPage = lazy(
  () => import("./userApp/components/pop-up/OrderConfirmationPage"),
);

/* ───────── LOADERS ───────── */
const FullScreenLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
    <LoadingScreen text="Loading..." />
  </div>
);

const InlineLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <LoadingScreen text="Loading..." />
  </div>
);

/* ───────── SCROLL RESTORE ───────── */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/* ───────── SAFE WRAPPER ───────── */
const SafeCollectionPage = () => (
  <ErrorBoundary>
    <Suspense fallback={<InlineLoader />}>
      <CollectionPage />
    </Suspense>
  </ErrorBoundary>
);

/* ─────────────────────────────────────────────
   CENTRAL SEO SLUG ROUTE (IMPORTANT CHANGE)
   ─────────────────────────────────────────────
   Instead of 50+ routes → ONE dynamic SEO router
   CollectionPage handles slug resolution itself.
───────────────────────────────────────────── */
const SEOCollectionRoute = () => <SafeCollectionPage />;

/* ══════════════════════════════════════════════
   APP ROUTES (OPTIMIZED)
══════════════════════════════════════════════ */
const AppRoutes = () => (
  <>
    <ScrollToTop />

    <Routes>
      {/* ───────── REDIRECT LEGACY AUTH & ACCOUNT ROUTES TO HOME ───────── */}
      <Route path="/auth/*" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/signup" element={<Navigate to="/" replace />} />
      <Route path="/account/*" element={<Navigate to="/" replace />} />
      <Route path="/user/*" element={<Navigate to="/" replace />} />

      {/* ───────── SITEMAP ───────── */}
      <Route
        path="/sitemap"
        element={
          <Suspense fallback={<InlineLoader />}>
            <SitemapPage />
          </Suspense>
        }
      />

      {/* ───────── MAIN LAYOUT ───────── */}
      <Route
        element={
          <Suspense fallback={<InlineLoader />}>
            <UserLayout />
          </Suspense>
        }>
        {/* HOME */}
        <Route
          index
          element={
            <ErrorBoundary>
              <Suspense fallback={<InlineLoader />}>
                <HomePage />
              </Suspense>
            </ErrorBoundary>
          }
        />

        <Route path="/shop/best-sellers" element={<BestSellersPage />} />

        {/* PRODUCT DETAIL */}
        <Route
          path="/product/:slug"
          element={
            <ErrorBoundary>
              <Suspense fallback={<InlineLoader />}>
                <ProductDetailsPage />
              </Suspense>
            </ErrorBoundary>
          }
        />

        {/* LEGACY */}
        <Route
          path="/products/:slug"
          element={<Navigate to="/product/:slug" replace />}
        />

        {/* COLLECTION LISTING */}
        <Route path="/collections" element={<SafeCollectionPage />} />
        <Route path="/all-products" element={<SafeCollectionPage />} />
        <Route path="/shop" element={<SafeCollectionPage />} />

        {/* BLOGS */}
        <Route path="/blogs" element={<BlogListPage />} />
        {/* POLICIES & PAGES */}
        <Route path="/pages/shipping" element={<ShippingPage />} />
        <Route path="/pages/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route
          path="/privacy-policy"
          element={<Navigate to="/pages/privacy-policy" replace />}
        />
        <Route
          path="/privacy"
          element={<Navigate to="/pages/privacy-policy" replace />}
        />

        <Route path="/blogs/:slug" element={<BlogDetailPage />} />

        <Route path="/blogs" element={<BlogListPage />} />
        <Route path="/blogs/:slug" element={<BlogDetailPage />} />

        {/* STATIC PAGES */}
        <Route path="/our-story" element={<OurStoryPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/website-developer" element={<WebsiteDeveloperPage />} />

        {/* SEARCH PAGE WITH URL ROUTING */}
        <Route path="/search" element={<SearchPage />} />

        {/* CLEAN REDIRECTS */}
        <Route
          path="/about-us"
          element={<Navigate to="/our-story" replace />}
        />
        <Route
          path="/contact-us"
          element={<Navigate to="/contact" replace />}
        />
        <Route path="/faq" element={<Navigate to="/faq" replace />} />

        {/* ─────────────────────────────────────────
           🚀 SINGLE SEO COLLECTION ROUTE (FIXED)
           ─────────────────────────────────────────
           Instead of 50+ routes:
           ALL SEO slugs are handled here
           inside CollectionPage resolver
        ───────────────────────────────────────── */}
        <Route path="/:slug" element={<SEOCollectionRoute />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* ───────── CHECKOUT ───────── */}
      <Route path="/checkout/*" element={<CheckoutRoutes />} />

      {/* ───────── ORDER CONFIRMATION (PUBLIC GUEST CONFIRMATION) ───────── */}
      <Route
        path="/order-success/:orderId"
        element={
          <Suspense fallback={<FullScreenLoader />}>
            <OrderConfirmationPage />
          </Suspense>
        }
      />
    </Routes>
  </>
);

export default AppRoutes;
