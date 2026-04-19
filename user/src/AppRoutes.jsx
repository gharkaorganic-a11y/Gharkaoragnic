import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "./userApp/features/auth/context/UserContext";

/* ───────── EAGER ───────── */
import UserLayout from "./userApp/layouts/UserLayout";
import LoadingScreen from "./userApp/components/loading/LoadingScreen";
import NotFoundPage from "./userApp/pages/NotFoundPage";
import ErrorBoundary from "./shared/components/ErrorBoundary";
import SitemapPage from "./userApp/pages/SitemapPage";
import ReviewsPage from "./userApp/reviews/pages/CustomerReviewsPage";
import BlogListPage from "./userApp/pages/blog/BlogListPage";
import BlogDetailPage from "./userApp/pages/blog/BlogDetailPage";

/* ───────── LAZY ───────── */
const AuthRoutes = lazy(() => import("./userApp/routes/AuthRoutes"));
const HomePage = lazy(() => import("./userApp/pages/HomePage"));
const CollectionPage = lazy(
  () => import("./userApp/features/p/CollectionPage"),
);
const CategoriesPage = lazy(
  () => import("./userApp/features/category/pages/CategoriesPage"),
);
const ProductDetailsPage = lazy(
  () => import("./userApp/pages/ProductDetailsPage"),
);
// const BlogListPage = lazy(() => import("./userApp/pages/blog/BlogListPage"));
const ContactUsPage = lazy(() => import("./userApp/pages/ContactUsPage"));
const OurStoryPage = lazy(() => import("./userApp/pages/OurStoryPage"));
const FaqPage = lazy(() => import("./userApp/pages/FaqPage"));
const AccountRoutes = lazy(() => import("./userApp/routes/AccountRoutes"));
const CheckoutRoutes = lazy(() => import("./userApp/routes/CheckoutRoutes"));

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
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

/* ───────── AUTH GUARD ───────── */
const ProtectedRoute = () => {
  const { isLoggedIn, user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <FullScreenLoader />;

  if (!isLoggedIn || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
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
      {/* ───────── AUTH ───────── */}
      <Route
        path="/auth/*"
        element={
          <Suspense fallback={<FullScreenLoader />}>
            <AuthRoutes />
          </Suspense>
        }
      />

      {/* ───────── SITEMAP ───────── */}
      <Route
        path="/sitemap.xml"
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
        <Route path="/collections" element={<CollectionPage />} />
        <Route path="/shop" element={<Navigate to="/collections" replace />} />

        {/* BLOGS */}
        <Route path="/blogs" element={<BlogListPage />} />
        <Route path="/blogs/:slug" element={<BlogDetailPage />} />

        <Route path="/pages/blogs" element={<BlogListPage />} />
        <Route path="/pages/blogs/:slug" element={<BlogDetailPage />} />

        {/* STATIC PAGES */}
        <Route path="/pages/our-story" element={<OurStoryPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/pages/faq" element={<FaqPage />} />
        <Route path="/pages/contact" element={<ContactUsPage />} />

        {/* CLEAN REDIRECTS */}
        <Route
          path="/about-us"
          element={<Navigate to="/pages/our-story" replace />}
        />
        <Route
          path="/contact-us"
          element={<Navigate to="/pages/contact" replace />}
        />
        <Route path="/faq" element={<Navigate to="/pages/faq" replace />} />

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

      {/* ───────── PROTECTED ───────── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/user/*" element={<AccountRoutes />} />
        <Route path="/checkout/*" element={<CheckoutRoutes />} />
      </Route>
    </Routes>
  </>
);

export default AppRoutes;
