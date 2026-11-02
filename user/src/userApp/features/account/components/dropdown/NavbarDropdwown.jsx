import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";
import { IMAGES } from "../../../../../assets/images";

const MENU_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/all-products" },
  { label: "Best Sellers", path: "/shop/best-sellers" },
  { label: "Reviews", path: "/reviews" },
  { label: "Our Story", path: "/our-story" },
  { label: "Contact", path: "/contact" },
];

const NavbarDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const asideRef = useRef(null);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  const handleNav = (path) => {
    onClose();
    navigate(path);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      />

      {/* Drawer Menu */}
      <aside
        ref={asideRef}
        aria-label="Navigation drawer"
        className={`fixed top-0 left-0 bottom-0 z-[9999] w-[82vw] max-w-[320px] bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[#eeeeea]">
          <button
            onClick={() => handleNav("/")}
            aria-label="Ghar Ka Organic Home"
            className="flex items-center">
            <img
              src={IMAGES.brand.logo}
              alt="Ghar Ka Organic"
              className="h-9 w-auto object-contain"
            />
          </button>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 -mr-1 rounded-full text-[#121212] hover:bg-neutral-100 active:scale-95 transition-all">
            <X size={22} strokeWidth={1.75} />
          </button>
        </div>

        {/* 6 Core Navigation Items - Dark Black Fonts like Homepage */}
        <nav
          className="flex-1 overflow-y-auto px-4 py-6"
          aria-label="Mobile links">
          <ul className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-lg text-[16px] sm:text-[17px] font-semibold tracking-wide transition-colors ${
                      isActive
                        ? "text-[#121212] bg-neutral-100/80 font-bold"
                        : "text-[#121212] hover:bg-neutral-50 active:bg-neutral-100"
                    }`}>
                    <span>{item.label}</span>
                    <ChevronRight
                      size={18}
                      strokeWidth={1.75}
                      className={`transition-transform text-[#121212]/40 ${
                        isActive ? "text-[#121212] translate-x-0.5" : ""
                      }`}
                    />
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Minimalist Brand Footer */}
        <div className="p-5 border-t border-[#eeeeea] bg-[#fafafa]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#315c3c]">
            Ghar Ka Organic
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">
            Pure taste • Pahadi roots • Zero preservatives
          </p>
        </div>
      </aside>
    </>,
    document.body,
  );
};

export default NavbarDropdown;
