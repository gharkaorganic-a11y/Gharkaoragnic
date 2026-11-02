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
// ---------------- PROFESSIONAL LOADING SPINNER ----------------
// Flipkart Seller Hub Style - Pure CSS (Zero Icon Dependencies for faster render)
const LoadingSpinner = ({ message = "Loading module..." }) => (
  <div className="flex min-h-[70vh] w-full flex-col items-center justify-center bg-[#F1F3F6] p-4">
    <div className="flex animate-in flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white px-8 py-6 shadow-sm fade-in zoom-in-95 duration-300">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#e0e0e0] border-t-[#2874F0]" />
      <p className="text-[13px] font-medium text-[#878787] tracking-wide">
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminLayoutRoutes;
