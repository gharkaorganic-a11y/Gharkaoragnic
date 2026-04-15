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
import { IMAGES } from "../../../../../assets/images";

const PRIMARY = "#c8102e";
const PRIMARY_LIGHT = "#fdf0f2";

const BadgeCount = ({ count }) => {
  if (!count || count <= 0) return null;
  return (
    <span
      className="absolute -top-1 -right-1.5 text-white text-[10px] font-bold rounded-full min-w-[17px] h-[17px] flex items-center justify-center border-2 border-white shadow-sm z-10"
      style={{ backgroundColor: PRIMARY }}>
      {count > 99 ? "99+" : count}
    </span>
  );
};
const accountMenuData = [
  {
    label: "My Profile",
    desc: "All your personal details",
    path: "/user/profile",
  },
  {
    label: "My Orders",
    desc: "All your confirmed orders",
    path: "/orders",
  },
  {
    label: "My Wishlist",
    desc: "All your curated favorites",
    path: "/wishlist",
  },
  {
    label: "My Cart",
    desc: "All your curated favorites",
    path: "/cart",
  },
];
const MobileNavbar = ({ cartCount = 0, promoData }) => {
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
        {/* 🔴 Promo Bar */}
        {promoData && promoData.length > 0 && (
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden text-white ${
              scrolled ? "max-h-0 opacity-0" : "max-h-[36px] opacity-100"
            }`}
            style={{ backgroundColor: PRIMARY }}>
            <PromotionalNavbar items={promoData} speed={45} />
          </div>
        )}

        {/* 🔻 Main Row */}
        <div className="flex items-center justify-between h-[64px] px-4 w-full">
          {/* LEFT */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 -ml-2 active:scale-90 transition-transform"
              style={{ color: PRIMARY }}>
              <Bars3BottomLeftIcon className="w-7 h-7" strokeWidth={2} />
            </button>

            <button
              onClick={() => navigate("/search")}
              className="p-2 active:scale-90"
              style={{ color: PRIMARY }}>
              <MagnifyingGlassIcon className="w-6 h-6" strokeWidth={1.8} />
            </button>
          </div>

          {/* CENTER LOGO */}
          <div
            onClick={() => navigate("/")}
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center cursor-pointer active:scale-95 transition-transform">
            <img
              src={IMAGES.brand.logo}
              className={`transition-all duration-300 object-contain ${
                scrolled ? "h-10" : "h-12"
              }`}
              alt="Logo"
            />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-1">
            <NavLink
              to="/checkout/cart"
              className={({ isActive }) =>
                `relative p-2 transition-all active:scale-90 ${
                  isActive
                    ? "text-[#c8102e]"
                    : "text-gray-500 hover:text-[#c8102e]"
                }`
              }>
              <ShoppingBagIcon className="w-6 h-6" strokeWidth={1.8} />
              <BadgeCount count={cartCount} />
            </NavLink>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div
        className={`md:hidden transition-all duration-300 ${
          promoData && !scrolled ? "h-[100px]" : "h-[64px]"
        }`}
      />

      {/* Drawer */}
      <NavbarDropdown
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        menuItems={activeMenuItems}
      />
    </>
  );
};

export default MobileNavbar;
