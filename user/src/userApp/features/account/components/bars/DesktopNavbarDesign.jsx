import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UserIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
  MapPinIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import PromotionalNavbar from "./PromotionalNavbar";
import { IMAGES } from "../../../../../assets/images";
import LoginPopup from "../../../../components/pop-up/LoginPoup";
import { useAuth } from "../../../auth/context/UserContext";

const PRIMARY = "#c8102e";
const PRIMARY_LIGHT = "#fdf0f2";

const DesktopNavbar = ({ app_name = "FarmDidi", cartCount = 0, promoData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProtectedRoute = (path) => {
    if (user) navigate(path);
    else setLoginOpen(true);
  };

  const isHomePage = location.pathname === "/";

  const navItems = [
    { label: "New Arrivals", path: "/new", highlight: true },
    { label: "Pickles & Chutneys", path: "/category/pickles" },
    { label: "Hand-pounded Masala", path: "/category/masala" },
    { label: "A2 Desi Ghee", path: "/category/ghee" },
    { label: "Healthy Snacks", path: "/category/snacks" },
    { label: "Our Story", path: "/our-story" },
  ];

  return (
    <div className="hidden lg:block w-full">
      {/* 🔶 Promo */}
      {isHomePage && (
        <div className="w-full">
          <PromotionalNavbar items={promoData} />
        </div>
      )}

      {/* 🔷 Header */}
      <header
        className={`bg-white border-b border-gray-100 transition-all duration-300 ${
          isScrolled ? "shadow-sm" : ""
        }`}>
        <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between h-[80px]">
          {/* 📍 Left */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPinIcon className="w-4 h-4" />
              <span className="font-medium">Delivering to India</span>
            </div>

            <div className="hidden xl:flex items-center gap-1 text-gray-500">
              <TruckIcon className="w-4 h-4" />
              <span>Free shipping above ₹499</span>
            </div>
          </div>

          {/* 🟢 Logo (FIXED SIZE) */}
          <div className="flex justify-center">
            <img
              src={IMAGES.brand.logo}
              alt={app_name}
              className="h-16 object-contain cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          {/* 🛒 Right */}
          <div className="flex items-center gap-8">
            {/* Account */}
            <button
              onClick={() => handleProtectedRoute("/user/profile")}
              className="flex items-center gap-2 group">
              <UserIcon className="w-6 h-6 text-gray-700 group-hover:text-[#c8102e]" />
              <div className="text-left hidden xl:block">
                <p className="text-[10px] text-gray-400">Account</p>
                <p className="text-[13px] font-semibold text-gray-800 uppercase">
                  {user ? user.name.split(" ")[0] : "Login"}
                </p>
              </div>
            </button>

            {/* Cart */}
            <button
              onClick={() => handleProtectedRoute("/checkout/cart")}
              className="flex items-center gap-2 group relative">
              <div className="relative">
                <ShoppingBagIcon className="w-6 h-6 text-gray-700 group-hover:text-[#c8102e]" />
                <span
                  className="absolute -top-2 -right-2 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: PRIMARY }}>
                  {cartCount}
                </span>
              </div>

              <div className="text-left hidden xl:block">
                <p className="text-[10px] text-gray-400">My Basket</p>
                <p className="text-[13px] font-semibold text-gray-800 uppercase">
                  View Cart
                </p>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* 🔻 Navigation */}
      <nav
        className={`w-full bg-white sticky top-0 z-40 border-b border-gray-200 transition-all ${
          isScrolled ? "shadow-md" : ""
        }`}>
        <div className="max-w-6xl mx-auto flex justify-center gap-10 py-4">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className={`group relative px-3 py-1 rounded-md text-[14px] font-medium tracking-wide transition-all duration-300
                  ${
                    isActive
                      ? "text-[#c8102e]"
                      : "text-gray-700 hover:text-[#c8102e] hover:bg-[#fdf0f2]"
                  }
                `}>
                {item.label}

                {/* underline */}
                <span
                  className={`absolute left-0 -bottom-2 h-[2px] bg-[#c8102e] transition-all duration-300
                    ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                />

                {item.dropdown && (
                  <ChevronDownIcon className="w-3 h-3 inline ml-1 opacity-60" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <LoginPopup isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
};

export default React.memo(DesktopNavbar);
