import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { IMAGES } from "../../../../../assets/images";

const FarmStyleNavbar = ({ cartCount = 2 }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full fixed top-0 z-50 hidden lg:block">
      <nav className="w-full h-[72px] bg-[#F6F3EA] border-b border-[#E6E1D3] px-10 flex items-center justify-between">
        {/* LEFT - LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer">
          <img
            src={IMAGES.brand.logo}
            alt="logo"
            className="h-10 object-contain"
          />
        </div>

        {/* CENTER - MENU */}
        <div className="flex items-center gap-10 text-[15px] font-medium text-[#A45A1C]">
          <button className="hover:text-[#7C3F00] transition">
            Shop by Ingredients
          </button>
          <button className="hover:text-[#7C3F00] transition">
            Shop by taste
          </button>
          <button
            onClick={() => navigate("/our-story")}
            className="hover:text-[#7C3F00] transition">
            Our story
          </button>
          <button
            onClick={() => navigate("/blogs")}
            className="hover:text-[#7C3F00] transition">
            Blogs and Recipes
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="hover:text-[#7C3F00] transition">
            Contact us
          </button>
        </div>

        {/* RIGHT - SEARCH + ICONS */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search our store"
              className="w-64 bg-[#EFECE3] border border-[#D6D1C4] rounded-full py-2.5 pl-5 pr-10 text-sm outline-none focus:ring-1 focus:ring-[#C17A2A]"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Lightning Icon */}
          <button className="text-[#C17A2A] hover:scale-110 transition">
            <BoltIcon className="w-6 h-6" />
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="relative text-[#C17A2A]">
            <ShoppingCartIcon className="w-7 h-7" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default FarmStyleNavbar;
