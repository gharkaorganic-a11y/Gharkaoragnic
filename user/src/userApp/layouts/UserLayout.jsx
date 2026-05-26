import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

// Layout Components
import UserNavbar from "../features/account/components/bars/UserNavbar";
import PromotionalNavbar from "../features/account/components/bars/PromotionalNavbar";
import BottomNavbar from "../features/account/components/bars/BottomHomeNavbar";
import Footer from "../components/footer/Footer";

// Popups & Floating Elements
import UnverifiedEmailPopup from "../features/auth/pages/UnverifiedEmailPopup";
import SalesNotificationPopup from "../components/pop-up/SalesNotificationPopup";
import WhatsAppButton from "../../shared/components/WhatsAppButton";
import WhatsAppFooterBar from "../../shared/components/WhatsAppFooterBar";

const UserLayout = () => {
  const location = useLocation();

  // Scroll to top instantly on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased selection:bg-black selection:text-white relative">
      {/* 🔷 HEADER WITH PROMO BAR */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
        <PromotionalNavbar />
        <div className="bg-white/95 backdrop-blur-md">
          <UserNavbar />
        </div>
      </header>

      {/* 🔻 MAIN CONTENT */}
      {/* pb-[70px] accounts for the BottomNavbar on mobile */}
      <main className="flex-1 w-full flex flex-col pb-[70px] md:pb-0">
        <div
          key={location.pathname}
          className="flex-1 w-full animate-in fade-in duration-300">
          <Outlet />
        </div>
      </main>

      {/* 🔶 FOOTER */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* 🔔 POPUPS (Fixed: Raised z-index to overlay z-50 header) */}
      <div className="relative z-[60]">
        <UnverifiedEmailPopup />
        <SalesNotificationPopup />
      </div>

      {/* 💬 FLOATING ACTIONS */}
      {/* Assuming these components manage their own fixed positioning internally */}
      <WhatsAppButton />
      <WhatsAppFooterBar />
    </div>
  );
};

export default UserLayout;
