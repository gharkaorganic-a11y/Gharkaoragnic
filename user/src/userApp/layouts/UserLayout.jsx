import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import UserNavbar from "../features/account/components/bars/UserNavbar";
import BottomNavbar from "../features/account/components/bars/BottomHomeNavbar";
import Footer from "../components/footer/Footer";
import UnverifiedEmailPopup from "../features/auth/pages/UnverifiedEmailPopup";
import WhatsAppButton from "../../shared/components/WhatsAppButton";
import SalesNotificationPopup from "../components/pop-up/SalesNotificationPopup";

const UserLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="min-h- flex flex-col bg-white font-sans antialiased selection:bg-gray-900 selection:text-white">
      {/* 🔷 HEADER - sticky instead of fixed to avoid layout shift */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-100">
        <UserNavbar />
      </header>

      {/* 🔻 MAIN CONTENT - no more hardcoded padding */}
      <main className="flex-1 w-full flex flex-col pb- md:pb-0">
        <div
          key={location.pathname}
          className="flex-1 w-full animate-in fade-in duration-300">
          <Outlet />
        </div>
      </main>

      {/* 🔶 FOOTER - hidden on mobile if bottom nav exists */}
      <div className="hidden md:block relative z-10">
        <Footer />
      </div>

      {/* 🔔 POPUPS & FLOATERS - managed z-index layer */}
      <div className="z-30">
        <UnverifiedEmailPopup />
        <SalesNotificationPopup />
      </div>

      {/* WhatsApp - above bottom nav but below modals */}
      <div className="fixed bottom- md:bottom-6 right-4 z-30">
        <WhatsAppButton />
      </div>

      {/* 📱 FLOATING MOBILE NAV - safe area aware */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)] bg-white border-t border-gray-100">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default UserLayout;
