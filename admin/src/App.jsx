import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import BrandLogo from "./components/common/BrandLogo";

/* ---------------- LAZY ROUTES ---------------- */
// Lazy loading splits your code into smaller chunks, speeding up initial load
const AdminInquiryRoutes = lazy(() => import("./routes/AdminInquiryRoutes"));
const AdminLayoutRoutes = lazy(() => import("./routes/AdminLayoutRoutes"));
// const AdminSignupPage = lazy(() => import("./pages/AdminSignUpPage"));
const AdminAuthPage = lazy(() => import("./pages/AdminAuthPage"));

/* ---------------- ULTRA-FAST SYSTEM LOADER ---------------- */
// Removed external icon libraries here. Using pure CSS/Tailwind for instant rendering.
const InitializingSystem = () => (
  <div className="fixed inset-0 z-[9999] flex min-h-screen flex-col items-center justify-center bg-[#F1F3F6] antialiased">
    <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300 ease-out">
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="rounded-2xl bg-white px-5 py-3 border border-[#D99A36]/40 shadow-2xs">
          <BrandLogo variant="default" size="md" />
        </div>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-[#2874F0]">
          Store management
        </span>
      </div>

      {/* Pure CSS Loading Indicator (Zero Dependencies) */}
      <div className="flex flex-col items-center gap-4 bg-white px-8 py-5 rounded-xl border border-[#e3e3e3] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        {/* Tailwind CSS Spinner */}
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#FFE500] border-t-[#2874F0]" />
        <span className="text-xs font-medium text-[#616161] tracking-wide">
          Securely connecting to workspace...
        </span>
      </div>
    </div>
  </div>
);

/* ---------------- APP ENTRY POINT ---------------- */
const App = () => {
  return (
    <div className="min-h-screen bg-[#f1f2f4] font-sans text-[#303030] selection:bg-[#2874F0] selection:text-white antialiased">
      <main>
        <Suspense fallback={<InitializingSystem />}>
          <Routes>
            {/* PUBLIC AUTH ROUTES */}
            <Route path="/auth" element={<AdminAuthPage />} />
            {/* <Route path="/signup" element={<AdminSignupPage />} /> */}

            {/* PROTECTED ADMIN ROUTES */}
            <Route
              path="/customers/*"
              element={
                <ProtectedRoute>
                  <AdminInquiryRoutes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AdminLayoutRoutes />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default App;
