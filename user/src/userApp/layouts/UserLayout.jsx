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
    <div className="relative min-h-screen flex flex-col bg-white font-sans selection:bg-[#ff3f6c] selection:text-white">
      {/* HEADER SECTION */}
      <header className="fixed top-0 left-0 z-[101] w-full shadow-sm">
        {/* Main Navigation */}
        <UserNavbar />
      </header>

      {/* MAIN CONTENT - Added pt (padding-top) to account for fixed header height */}
      <main className="flex-1 w-full flex flex-col pt-[110px] md:mt-[99px]">
        <div
          key={location.pathname}
          className="flex-1 w-full animate-in fade-in duration-500 fill-mode-both">
          <Outlet />
        </div>
      </main>

      {/* POPUPS & UTILITIES */}
      <div className="z-[102]">
        <UnverifiedEmailPopup />
      </div>

      <WhatsAppButton />
      <SalesNotificationPopup />

      {/* FOOTER */}
      <div className="relative z-[100]">
        <Footer className="md:pb-0 pb-[70px]" />
      </div>

      {/* MOBILE NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-[110] md:hidden bg-white border-t">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default UserLayout;
