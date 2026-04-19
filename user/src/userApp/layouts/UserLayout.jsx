import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import UserNavbar from "../features/account/components/bars/UserNavbar";
import PromotionalNavbar from "../features/account/components/bars/PromotionalNavbar";
import BottomNavbar from "../features/account/components/bars/BottomHomeNavbar";

import Footer from "../components/footer/Footer";
import UnverifiedEmailPopup from "../features/auth/pages/UnverifiedEmailPopup";
import WhatsAppButton from "../../shared/components/WhatsAppButton";
import SalesNotificationPopup from "../components/pop-up/SalesNotificationPopup";

const UserLayout = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased selection:bg-black selection:text-white">
      {/* 🔷 HEADER WITH PROMO BAR */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
        <PromotionalNavbar />
        <div className="bg-white/95 backdrop-blur ">
          <UserNavbar />
        </div>
      </header>

      {/* 🔻 MAIN CONTENT */}
      <main className="flex-1 w-full flex flex-col pb-[70px] md:pb-0">
        <div
          key={location.pathname}
          className="flex-1 w-full animate-in fade-in duration-300">
          <Outlet />
        </div>
      </main>

      {/* 🔶 FOOTER (desktop only) */}
      <div className=" relative z-10">
        <Footer />
      </div>

      {/* 🔔 POPUPS */}
      <div className="z-40">
        <UnverifiedEmailPopup />
        <SalesNotificationPopup />
      </div>

      {/* 💬 WHATSAPP BUTTON */}
      <div className="fixed bottom-[80px] md:bottom-6 right-4 z-40">
        <WhatsAppButton />
      </div>
    </div>
  );
};

export default UserLayout;
