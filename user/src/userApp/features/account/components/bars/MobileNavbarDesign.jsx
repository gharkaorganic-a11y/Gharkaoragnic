import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBagIcon,
  Bars3BottomLeftIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import NavbarDropdown from "../dropdown/NavbarDropdwown"; // fixed typo
import { productSections } from "../../../homepage/config/productCollection";
import { IMAGES } from "../../../../../assets/images";

// Compact dot badge
const BadgeCount = ({ count }) => {
  if (!count || count <= 0) return null;

  return (
    <span className="absolute -top-0.5 -right-0.5 bg-green-600 rounded-full w-2.5 h-2.5 border border-white shadow-sm animate-in zoom-in-50 duration-200" />
  );
};

const MobileNavbar = ({ cartCount = 0 }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isAccountPage = location.pathname.startsWith("/user");
  const activeMenuItems = isAccountPage ? [] : productSections;

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Add shadow when page scrolls for depth
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* HEADER */}
      <header
        className={`md:hidden fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? "shadow-sm" : "border-b border-gray-100"
        }`}>
        {/* Safe area for iOS notch */}
        <div className="pt-[env(safe-area-inset-top)]">
          <div className="relative flex items-center justify-between px-3 h-14">
            {/* LEFT */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="p-2.5 -ml-1 rounded-full active:bg-gray-100 active:scale-90 transition-all duration-150">
              <Bars3BottomLeftIcon className="w-6 h-6 text-gray-900" />
            </button>

            {/* CENTER LOGO */}
            <button
              onClick={() => navigate("/")}
              aria-label="Go to homepage"
              className="absolute left-1/2 -translate-x-1/2 active:scale-95 transition">
              <img
                src={IMAGES?.brand?.logo}
                alt="Ghar Ka Organic"
                className="h-9 w-auto object-contain"
              />
            </button>

            {/* RIGHT */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate("/user/profile")}
                aria-label="Go to profile"
                className="p-2.5 rounded-full active:bg-gray-100 active:scale-90 transition-all duration-150">
                <UserIcon className="w-6 h-6 text-gray-900" />
              </button>

              <NavLink
                to="/cart"
                aria-label={`Cart with ${cartCount} items`}
                className={({ isActive }) =>
                  `relative p-2.5 rounded-full transition-all duration-150 active:scale-90 ${
                    isActive ? "bg-gray-100" : "active:bg-gray-100"
                  }`
                }>
                <ShoppingBagIcon className="w-6 h-6 text-gray-900" />
                <BadgeCount count={cartCount} />
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      {/* SPACER - matches header height + safe area */}
      <div className="md:hidden h-[calc(3.5rem+env(safe-area-inset-top))]" />

      {/* DRAWER */}
      <NavbarDropdown
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        menuItems={activeMenuItems}
      />
    </>
  );
};

export default MobileNavbar;
