import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import CheckoutLayout from "../layouts/CheckoutLayout";
import LoadingScreen from "../components/loading/LoadingScreen";

/* ─── Lazy: Checkout Pages ───────────────────────────────────────────────── */
const AddressPage = lazy(() => import("../pages/AddressPage"));

/* ─── Inline Loader ──────────────────────────────────────────────────────── */
const InlineLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh] w-full bg-[#f4f4f5]">
    <LoadingScreen text="Loading..." />
  </div>
);

const CheckoutRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CheckoutLayout />}>
        <Route
          index
          element={<Navigate to="address" replace />}
        />
        <Route path="cart" element={<Navigate to="/" replace />} />
        <Route
          path="address"
          element={
            <Suspense fallback={<InlineLoader />}>
              <AddressPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default CheckoutRoutes;
