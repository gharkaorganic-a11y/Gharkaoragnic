import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

// Layout Components
import UserNavbar from "../features/account/components/bars/UserNavbar";
import PromotionalNavbar from "../features/account/components/bars/PromotionalNavbar";
import BottomNavbar from "../features/account/components/bars/BottomHomeNavbar";
import Footer from "../components/footer/Footer";

// Popups & Floating Elements
import WhatsAppFooterBar from "../../shared/components/WhatsAppFooterBar";
import WhatsAppButton from "../../shared/components/WhatsAppButton";
import CartDrawer from "../features/cart/components/CartDrawer";
import RecentPurchasePopup from "../components/notifications/RecentPurchasePopup";
import { StorefrontDesignProvider } from "../features/storefront/StorefrontDesignProvider";

const UserLayout = () => {
  const location = useLocation();

  // Scroll to top instantly on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <StorefrontDesignProvider>
      <div className="relative flex min-h-screen flex-col bg-[#fbfaf5] font-sans antialiased selection:bg-[#315c3c] selection:text-white">
        <header className="sticky top-0 z-50 w-full bg-white border-b border-[#eeeeea] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <PromotionalNavbar />
          <div className="bg-white">
            <UserNavbar />
          </div>
        </header>

        <main className="flex w-full flex-1 flex-col pb-[70px] md:pb-0">
          <div
            key={location.pathname}
            className="w-full flex-1 animate-in fade-in duration-300">
            <Outlet />
          </div>
        </main>

        <div className="relative z-10">
          <Footer />
        </div>

        <WhatsAppButton />
        <WhatsAppFooterBar />
        <RecentPurchasePopup />
        <CartDrawer />
      </div>
    </StorefrontDesignProvider>
  );
};

export default UserLayout;
