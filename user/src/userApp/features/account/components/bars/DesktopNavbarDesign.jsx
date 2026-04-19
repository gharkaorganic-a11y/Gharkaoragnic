import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  UserIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const DesktopNavbar = ({ cartCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logoUrl = "/logo/gharka-logo.png";

  // ✅ Added more links
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop", dropdown: true },
    { label: "Best Sellers", path: "/best-sellers" },
    { label: "Our Story", path: "/pages/our-story" },
    { label: "Contact", path: "/pages/contact" },
    { label: "Blogs", path: "/pages/blogs" },
  ];

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-8 h-[80px] flex items-center justify-between relative">
        {/* 🟢 LEFT: LOGO */}
        <div
          className="flex items-center cursor-pointer shrink-0"
          onClick={() => navigate("/")}>
          <img
            src={logoUrl}
            alt="Ghar Ka Organic Logo"
            className="h-[50px] w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              if (e.currentTarget.nextSibling) {
                e.currentTarget.nextSibling.style.display = "flex";
              }
            }}
          />

          {/* Fallback */}
          <div className="hidden flex-col">
            <span className="font-bold text-[20px] tracking-widest text-[#4B5E3C]">
              GHAR KA
            </span>
            <span className="text-xs text-gray-500">organic</span>
          </div>
        </div>

        {/* 🟡 CENTER: NAV LINKS */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-10">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className={`group relative flex items-center gap-1 text-[14.5px] transition-all duration-300
                  ${
                    isActive
                      ? "text-black font-medium"
                      : "text-gray-600 hover:text-black"
                  }
                `}>
                {item.label}

                {item.dropdown && (
                  <ChevronDownIcon className="w-3.5 h-3.5 mt-[1px] text-gray-400 group-hover:text-black" />
                )}

                {/* Underline */}
                <span
                  className={`absolute -bottom-2 left-0 h-[1.5px] bg-black transition-all duration-300
                    ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                />
              </button>
            );
          })}
        </nav>

        {/* 🔴 RIGHT: ICONS */}
        <div className="flex items-center gap-6">
          {/* User */}
          <button
            onClick={() => navigate("/user/profile")}
            className="text-black hover:text-gray-500 transition active:scale-95">
            <UserIcon className="w-6 h-6 stroke-[1.5px]" />
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate("/checkout/cart")}
            className="text-black hover:text-gray-500 transition relative active:scale-95">
            <ShoppingBagIcon className="w-6 h-6 stroke-[1.5px]" />

            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-black text-white text-[10px] font-medium w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default React.memo(DesktopNavbar);
