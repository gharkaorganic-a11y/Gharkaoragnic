import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBagIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import NavbarDropdown from "../dropdown/NavbarDropdwown";
import { productSections } from "../../../homepage/config/productCollection";
import { useCart } from "../../../../features/cart/context/CartContext";
import BrandLogo from "../../../../../components/common/BrandLogo";

// Compact black dot badge matching screenshot
const BadgeCount = ({ count }) => {
  if (!count || count <= 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white shadow-sm">
      {count > 99 ? "99+" : count}
    </span>
  );
};

const MobileNavbar = ({ cartCount = 0 }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setCartOpen } = useCart();

  const isAccountPage = location.pathname.startsWith("/user");
  const activeMenuItems = isAccountPage ? [] : productSections;

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* MOBILE NAVBAR CONTAINER */}
      <div className="w-full bg-white border-b border-[#eeeeea] md:hidden">
        <div className="pt-[env(safe-area-inset-top)]">
          <div className="relative flex items-center justify-between px-3 h-14 sm:h-16">
            {/* LEFT: HAMBURGER MENU */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="p-2 -ml-1 rounded-full text-[#121212] active:bg-gray-100 active:scale-95 transition-all duration-150">
              <Bars3Icon className="h-6 w-6 stroke-[1.75]" />
            </button>

            {/* CENTER: COMPACT RECONSTRUCTED BRAND LOGO */}
            <BrandLogo
              variant="compact"
              size="sm"
              to="/"
              fetchPriority="high"
              className="absolute left-1/2 -translate-x-1/2"
            />

            {/* RIGHT: SEARCH & CART (NO PROFILE ICON) */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={() => navigate("/search")}
                aria-label="Search products"
                className="p-2 rounded-full text-[#121212] active:bg-gray-100 active:scale-95 transition-all duration-150">
                <MagnifyingGlassIcon className="h-6 w-6 stroke-[1.75]" />
              </button>

              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label={`Cart with ${cartCount} items`}
                className="relative p-2 rounded-full text-[#121212] active:bg-gray-100 active:scale-95 transition-all duration-150">
                <ShoppingBagIcon className="h-6 w-6 stroke-[1.75]" />
                <BadgeCount count={cartCount} />
              </button>
            </div>
          </div>
        </div>
      </div>

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
