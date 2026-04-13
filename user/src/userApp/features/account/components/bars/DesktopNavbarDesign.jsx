import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
  MapPinIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";
import PromotionalNavbar from "./PromotionalNavbar";
import { IMAGES } from "../../../../../assets/images";
import LoginPopup from "../../../../components/pop-up/LoginPoup";
import { useAuth } from "../../../auth/context/UserContext";

const DesktopNavbar = ({ app_name = "FarmDidi", cartCount = 0, promoData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProtectedRoute = (path) => {
    if (user) navigate(path);
    else setLoginOpen(true);
  };
  const isHomePage = location.pathname === "/";
  return (
    <div className="hidden lg:block w-full">
      {/* 1. TOP UTILITY BAR */}
      <div className="w-full text-[12px] font-light tracking-wide">
        {/* FULL WIDTH PROMO */}
        {isHomePage && (
          <div className="w-full">
            <PromotionalNavbar items={promoData} />
          </div>
        )}
      </div>

      {/* 2. MAIN BRANDING ROW */}
      <header
        className={`bg-white transition-all duration-300 border-b border-gray-100 ${isScrolled ? "py-2" : "py-5"}`}>
        <div className="max-w-[1600px] mx-auto px-12 flex items-center justify-between">
          {/* Search (Left) */}
          <div className="flex-1">
            <div className="relative max-w-[320px]">
              <input
                type="text"
                placeholder="Find organic goodness..."
                className="w-full bg-gray-50 border-none rounded-lg py-2.5 pl-4 pr-10 text-sm focus:ring-1 focus:ring-[#1B4332] transition-all"
              />
              <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Logo (Center) */}
          <div className="flex-1 flex justify-center">
            <img
              src={IMAGES.brand.logo}
              alt={app_name}
              className={`cursor-pointer transition-all duration-300 object-contain ${isScrolled ? "h-12" : "h-20"}`}
              onClick={() => navigate("/")}
            />
          </div>

          {/* Actions (Right) */}
          <div className="flex-1 flex justify-end items-center gap-8">
            <button
              onClick={() => handleProtectedRoute("/user/profile")}
              className="flex items-center gap-2 group">
              <UserIcon className="w-6 h-6 text-gray-700 group-hover:text-[#1B4332]" />
              <div className="text-left leading-tight hidden xl:block">
                <p className="text-[10px] text-gray-400">Account</p>
                <p className="text-[13px] font-semibold text-gray-800 uppercase tracking-tighter">
                  {user ? user.name.split(" ")[0] : "Login"}
                </p>
              </div>
            </button>

            <button
              onClick={() => handleProtectedRoute("/checkout/cart")}
              className="flex items-center gap-2 group relative">
              <div className="relative">
                <ShoppingBagIcon className="w-6 h-6 text-gray-700 group-hover:text-[#1B4332]" />
                <span className="absolute -top-2 -right-2 bg-[#E67E22] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              </div>
              <div className="text-left leading-tight hidden xl:block">
                <p className="text-[10px] text-gray-400">My Basket</p>
                <p className="text-[13px] font-semibold text-gray-800 uppercase tracking-tighter">
                  View Cart
                </p>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* 3. NAVIGATION CATEGORY STRIP */}
      <nav
        className={`w-full bg-white border-b border-gray-200 sticky top-0 z-40 transition-shadow ${isScrolled ? "shadow-md" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-center gap-10 py-3">
          {[
            { label: "New Arrivals", path: "/new", highlight: true },
            {
              label: "Pickles & Chutneys",
              path: "/category/pickles",
              dropdown: true,
            },
            {
              label: "Hand-pounded Masala",
              path: "/category/masala",
              dropdown: true,
            },
            { label: "A2 Desi Ghee", path: "/category/ghee" },
            { label: "Healthy Snacks", path: "/category/snacks" },
            { label: "Our Story", path: "/our-story" },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className={`group relative text-[14px] font-medium tracking-wide flex items-center gap-1 transition-colors
                ${item.highlight ? "text-[#E67E22]" : "text-gray-700 hover:text-[#1B4332]"}
              `}>
              {item.label}
              {item.dropdown && (
                <ChevronDownIcon className="w-3 h-3 text-gray-400 group-hover:rotate-180 transition-transform" />
              )}
              {/* Animated Underline */}
              <span className="absolute bottom-[-13px] left-0 w-0 h-[2px] bg-[#1B4332] transition-all duration-300 group-hover:w-full"></span>
            </button>
          ))}
        </div>
      </nav>

      <LoginPopup isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
};

export default DesktopNavbar;
