import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import AdminLayout from "../layouts/AdminLayout";

// ---------------- LAZY-LOADED PAGES ----------------
const ProductsManagementPage = lazy(
  () => import("../pages/product/ProductsManagementPage"),
);
const ProductCreatePage = lazy(
  () => import("../pages/product/ProductCreatePages"),
);
const TestimonialsAdminPage = lazy(
  () => import("../pages/testimonials/TestimonialsAdminPage"),
);
const AdminOrdersPage = lazy(() => import("../pages/AdminOrdersPage"));
const AdminInquiriesPage = lazy(
  () => import("../pages/AdminInquiriesPage"),
);
const AdminDiscountCodesPage = lazy(
  () => import("../pages/AdminDiscountCodesPage"),
);
const AdminProductReviewsPage = lazy(
  () => import("../pages/product/AdminProductReviewsPage"),
);
// ---------------- PROFESSIONAL LOADING SPINNER ----------------
// Shopify Admin × Flipkart Blue & Yellow Loading Spinner
const LoadingSpinner = ({ message = "Loading module..." }) => (
  <div className="flex min-h-[70vh] w-full flex-col items-center justify-center bg-[#f1f2f4] p-4">
    <div className="flex animate-in flex-col items-center gap-3 rounded-xl border border-[#e3e3e3] bg-white px-7 py-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] fade-in zoom-in-95 duration-300">
      <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#FFE500] border-t-[#2874F0]" />
      <p className="text-xs font-medium text-[#616161] tracking-wide">
        {message}
      </p>
    </div>
  </div>
);

// ---------------- ROUTE CONFIGURATION ----------------
const AdminLayoutRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        {/* DASHBOARD / PRODUCTS (Default Route) */}
        <Route
          index
          element={
            <Suspense
              fallback={
                <LoadingSpinner message="Loading Product Catalog..." />
              }>
              <ProductsManagementPage />
            </Suspense>
          }
        />

        {/* PRODUCT ROUTES */}
        <Route
          path="products"
          element={
            <Suspense
              fallback={
                <LoadingSpinner message="Loading Product Catalog..." />
              }>
              <ProductsManagementPage />
            </Suspense>
          }
        />
        <Route
          path="products/create"
          element={
            <Suspense
              fallback={
                <LoadingSpinner message="Preparing Product Editor..." />
              }>
              <ProductCreatePage />
            </Suspense>
          }
        />
        <Route
          path="products/edit/:id"
          element={
            <Suspense
              fallback={
                <LoadingSpinner message="Loading Product Details..." />
              }>
              <ProductCreatePage />
            </Suspense>
          }
        />

        {/* ORDERS & TESTIMONIALS */}
        <Route
          path="orders"
          element={
            <Suspense
              fallback={
                <LoadingSpinner message="Loading Order Management..." />
              }>
              <AdminOrdersPage />
            </Suspense>
          }
        />
        <Route
          path="inquiries"
          element={
            <Suspense
              fallback={<LoadingSpinner message="Loading Inquiries..." />}>
              <AdminInquiriesPage />
            </Suspense>
          }
        />
        <Route
          path="inquiries/:id"
          element={
            <Suspense
              fallback={<LoadingSpinner message="Loading Inquiries..." />}>
              <AdminInquiriesPage />
            </Suspense>
          }
        />
        <Route
          path="messages"
          element={<Navigate to="/inquiries" replace />}
        />
        <Route
          path="testimonials"
          element={
            <Suspense
              fallback={<LoadingSpinner message="Loading Testimonials..." />}>
              <TestimonialsAdminPage />
            </Suspense>
          }
        />
        <Route
          path="discount-codes"
          element={
            <Suspense
              fallback={<LoadingSpinner message="Loading Discount Codes..." />}>
              <AdminDiscountCodesPage />
            </Suspense>
          }
        />
        <Route
          path="reviews"
          element={
            <Suspense
              fallback={<LoadingSpinner message="Loading Product Reviews..." />}>
              <AdminProductReviewsPage />
            </Suspense>
          }
        />
        <Route
          path="products/reviews/:productId"
          element={
            <Suspense
              fallback={<LoadingSpinner message="Loading Product Reviews..." />}>
              <AdminProductReviewsPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminLayoutRoutes;
