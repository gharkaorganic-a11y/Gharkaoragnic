import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import BottomNavbar from "../features/account/components/bars/BottomHomeNavbar";
import Footer from "../components/footer/Footer";
import UnverifiedEmailPopup from "../features/auth/pages/UnverifiedEmailPopup";
import WhatsAppButton from "../../shared/components/WhatsAppButton";
import CompactFloatingNavbar from "../features/account/components/bars/CompactFloatingNavbar";

const CompactLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FDFCF8] font-sans selection:bg-[#BC6C25] selection:text-white">
      {/* ── FLOATING NAVBAR (Desktop) ── */}
      {/* Set to fixed and z-50 to ensure it floats over all page content */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50">
        <CompactFloatingNavbar />
      </header>

      {/* ── MAIN CONTENT AREA ── */}
      <main
        className={`
          flex-1 w-full flex flex-col
         
          pt-10 md:pt-12 
          pb-[env(safe-area-inset-bottom)]
        `}>
        <div
          key={location.pathname}
          className="flex-1 w-full animate-in fade-in slide-in-from-bottom-1 duration-700 fill-mode-both">
          <Outlet />
        </div>
      </main>

      {/* ── OVERLAYS & UTILITIES ── */}
      {/* Highest Z-index for critical popups */}
      <div className="z-[200]">
        <UnverifiedEmailPopup />
      </div>

      <WhatsAppButton />

      {/* ── FOOTER ── */}
      <div className="relative z-10">
        {/* pb-[80px] ensures mobile bottom nav doesn't cover footer content */}
        <Footer className="md:pb-0 pb-[80px]" />
      </div>
    </div>
  );
};

export default CompactLayout;
