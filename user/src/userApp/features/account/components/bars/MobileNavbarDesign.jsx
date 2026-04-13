import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  HeartIcon,
  ShoppingBagIcon,
  Bars3BottomLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import PromotionalNavbar from "./PromotionalNavbar";
import NavbarDropdown from "../dropdown/NavbarDropdwown";

import { productSections } from "../../../homepage/config/productCollection";
import { accountMenuData } from "../../data/accountMenuData";
import { IMAGES } from "../../../../../assets/images";

const BadgeCount = ({ count }) => {
  if (!count || count <= 0) return null;
  return (
    <span className="absolute -top-1 -right-1.5 bg-[#A65E00] text-white text-[10px] font-bold rounded-full min-w-[17px] h-[17px] flex items-center justify-center border-2 border-white shadow-sm z-10">
      {count > 99 ? "99" : count}
    </span>
  );
};

const MobileNavbar = ({ cartCount = 0, wishlistCount = 0, promoData }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAccountPage = location.pathname.startsWith("/user");
  const activeMenuItems = isAccountPage ? accountMenuData : productSections;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`md:hidden fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-white border-b border-gray-100"
        }`}>
        {/* Organic Promo Bar (Matches Desktop Green) */}
        {promoData && promoData.length > 0 && (
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden bg-[#1B4332] text-[#F5F5DC] ${
              scrolled ? "max-h-0 opacity-0" : "max-h-[36px] opacity-100"
            }`}>
            <PromotionalNavbar items={promoData} speed={45} />
          </div>
        )}

        <div className="flex items-center justify-between h-[64px] px-4 w-full">
          {/* LEFT: Menu & Search (Consistently Brand Colored) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 -ml-2 text-[#A65E00] active:scale-90 transition-transform"
              aria-label="Open menu">
              <Bars3BottomLeftIcon className="w-7 h-7" strokeWidth={2} />
            </button>

            <button
              onClick={() => navigate("/search")}
              className="p-2 text-[#A65E00] active:scale-90">
              <MagnifyingGlassIcon className="w-6 h-6" strokeWidth={1.8} />
            </button>
          </div>

          {/* CENTER: Logo */}
          <div
            onClick={() => navigate("/")}
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center cursor-pointer active:scale-95 transition-transform">
            <img
              src={IMAGES.brand.logo}
              className={`transition-all duration-300 object-contain ${
                scrolled ? "h-10" : "h-12"
              }`}
              alt="Ghar Ka Organic"
            />
          </div>

          {/* RIGHT: Wishlist & Cart (Using Brand Color for Icons) */}
          <div className="flex items-center gap-1">
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `relative p-2 active:scale-90 transition-all ${
                  isActive
                    ? "text-[#A65E00]"
                    : "text-[#A65E00]/70 hover:text-[#A65E00]"
                }`
              }>
              <HeartIcon className="w-6 h-6" strokeWidth={1.8} />
              <BadgeCount count={wishlistCount} />
            </NavLink>

            <NavLink
              to="/checkout/cart"
              className={({ isActive }) =>
                `relative p-2 active:scale-90 transition-all ${
                  isActive
                    ? "text-[#A65E00]"
                    : "text-[#A65E00]/70 hover:text-[#A65E00]"
                }`
              }>
              <ShoppingBagIcon className="w-6 h-6" strokeWidth={1.8} />
              <BadgeCount count={cartCount} />
            </NavLink>
          </div>
        </div>
      </header>

      {/* Dynamic Spacer for Content */}
      <div
        className={`md:hidden transition-all duration-300 ${promoData && !scrolled ? "h-[100px]" : "h-[64px]"}`}
      />

      <NavbarDropdown
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        menuItems={activeMenuItems}
      />
    </>
  );
};

export default MobileNavbar;
