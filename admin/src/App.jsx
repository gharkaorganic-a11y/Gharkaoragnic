import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";

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
      <div className="flex items-center gap-3 mb-8">
        <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-[#2874F0] shadow-sm">
          <span className="pr-1 text-2xl font-bold tracking-tighter text-white">
            G
          </span>
          <div className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-[#FFE500]" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-semibold tracking-tight text-[#202124] leading-none">
            Ghar Ka Organic
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-[#2874F0]">
            Store management
          </span>
        </div>
      </div>

      {/* Pure CSS Loading Indicator (Zero Dependencies) */}
      <div className="flex flex-col items-center gap-4 bg-white px-8 py-5 rounded-sm border border-gray-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        {/* Tailwind CSS Spinner */}
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#e0e0e0] border-t-[#2874F0]" />
        <span className="text-[13px] font-medium text-[#878787] tracking-wide">
          Securely connecting to workspace...
        </span>
      </div>
    </div>
  </div>
);

/* ---------------- APP ENTRY POINT ---------------- */
const App = () => {
  return (
    <div className="min-h-screen bg-[#F1F3F6] font-sans text-[#202124] selection:bg-[#2874F0] selection:text-white antialiased">
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
