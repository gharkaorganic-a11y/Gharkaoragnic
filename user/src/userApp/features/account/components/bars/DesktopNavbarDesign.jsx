import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "../../../../features/cart/context/CartContext";
import { IMAGES } from "../../../../../assets/images";

const DesktopNavbar = ({ cartCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCartOpen } = useCart();
  const [shopOpen, setShopOpen] = useState(false);
  const shopTimeoutRef = useRef(null);

  const logoUrl = IMAGES.brand.logo;

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://gharkaorganic.com";

  // Navigation items exactly matching screenshot
  const navItems = [
    { label: "Home", path: "/", name: "home" },
    { label: "Shop", path: "/all-products", dropdown: true, name: "shop" },
    { label: "Best Sellers", path: "/shop/best-sellers", name: "best-sellers" },
    { label: "Reviews", path: "/reviews", name: "reviews" },
    { label: "Our Story", path: "/our-story", name: "our-story" },
    { label: "Contact", path: "/contact", name: "contact" },
    { label: "Blogs", path: "/blogs", name: "blogs" },
  ];

  // Shop dropdown categories / collections
  const shopCategories = [
    { label: "All Products", path: "/all-products" },
    { label: "Best Sellers", path: "/shop/best-sellers" },
    { label: "Pickles & Chutneys", path: "/all-products?category=pickles" },
    { label: "A2 Desi Ghee", path: "/all-products?category=ghee" },
    { label: "Raw Forest Honey", path: "/all-products?category=honey" },
    { label: "Himalayan Spices & Salt", path: "/all-products?category=spices" },
  ];

  const handleMouseEnterShop = () => {
    if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
    setShopOpen(true);
  };

  const handleMouseLeaveShop = () => {
    shopTimeoutRef.current = setTimeout(() => {
      setShopOpen(false);
    }, 150);
  };

  // Close dropdown on route change
  useEffect(() => {
    setShopOpen(false);
  }, [location.pathname, location.search]);

  // SEO Structured Data
  useEffect(() => {
    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: baseUrl,
        name: "Ghar Ka Organic",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/search?q={search_term_string}`,
          },
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        url: baseUrl,
        name: "Ghar Ka Organic",
        logo: logoUrl,
        sameAs: [
          "https://www.facebook.com/gharka",
          "https://www.instagram.com/gharka",
        ],
      },
    ];

    const scripts = schemas.map((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      return script;
    });

    return () => {
      scripts.forEach((script) => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      });
    };
  }, [baseUrl]);

  // Determine active item based on current route
  const isActive = (item) => {
    if (item.path === "/") {
      return location.pathname === "/";
    }
    if (item.name === "shop") {
      if (location.pathname === "/shop/best-sellers") return false;
      return (
        location.pathname === "/all-products" ||
        location.pathname.startsWith("/collections") ||
        location.pathname.startsWith("/product/") ||
        location.pathname.startsWith("/category/")
      );
    }
    if (item.path === "/shop/best-sellers") {
      return location.pathname === "/shop/best-sellers";
    }
    return (
      location.pathname === item.path ||
      location.pathname.startsWith(`${item.path}/`)
    );
  };

  return (
    <div className="w-full bg-white border-b border-[#eeeeea] shadow-[0_1px_4px_rgba(0,0,0,0.03)] font-sans">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO (LEFT) */}
        <div
          className="flex min-w-0 cursor-pointer items-center shrink-0"
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate("/");
          }}
          aria-label="Ghar Ka Organic Home">
          <img
            src={logoUrl}
            alt="Ghar Ka Organic"
            className="h-[46px] w-auto max-w-[150px] object-contain sm:h-[52px] sm:max-w-[170px]"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              if (e.currentTarget.nextSibling) {
                e.currentTarget.nextSibling.style.display = "flex";
              }
            }}
          />

          {/* Fallback Logo */}
          <div className="hidden flex-col leading-tight">
            <span className="text-[19px] font-bold tracking-wide text-[#121212]">
              GHAR KA
            </span>
            <span className="text-[10px] tracking-[3px] text-[#475569]">
              ORGANIC
            </span>
          </div>
        </div>

        {/* NAVIGATION LINKS (CENTER) - EXACT DESIGN FROM SCREENSHOT */}
        <nav
          className="hidden items-center justify-center gap-7 md:flex lg:gap-9 xl:gap-11"
          aria-label="Main navigation">
          {navItems.map((item) => {
            const active = isActive(item);

            if (item.dropdown) {
              return (
                <div
                  key={item.name}
                  className="relative group py-5"
                  onMouseEnter={handleMouseEnterShop}
                  onMouseLeave={handleMouseLeaveShop}>
                  <Link
                    to={item.path}
                    aria-current={active ? "page" : undefined}
                    aria-expanded={shopOpen}
                    className="relative flex items-center gap-1.5 whitespace-nowrap text-[15px] transition-colors duration-200">
                    <span
                      className={`transition-colors ${
                        active
                          ? "font-semibold text-black"
                          : "font-normal text-[#475569] group-hover:text-black"
                      }`}>
                      {item.label}
                    </span>

                    <ChevronDownIcon
                      className={`h-3.5 w-3.5 stroke-[1.75] transition-transform duration-200 ${
                        active
                          ? "text-black"
                          : "text-[#64748b] group-hover:text-black"
                      } ${shopOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />

                    {/* Active Underline matching screenshot */}
                    <span
                      className={`absolute -bottom-1.5 left-0 right-0 h-[2px] bg-black transition-all duration-200 ${
                        active
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-40"
                      }`}
                    />
                  </Link>

                  {/* Minimalist Dropdown Menu */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-1 transition-all duration-200 z-50 ${
                      shopOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2 pointer-events-none"
                    }`}>
                    <div className="w-56 bg-white border border-[#eaeaea] rounded-sm shadow-xl py-2">
                      {shopCategories.map((cat) => (
                        <Link
                          key={cat.label}
                          to={cat.path}
                          onClick={() => setShopOpen(false)}
                          className="block px-4 py-2.5 text-[14px] text-[#475569] hover:text-black hover:bg-neutral-50 transition-colors">
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                aria-current={active ? "page" : undefined}
                className="group relative flex items-center py-5 whitespace-nowrap text-[15px] transition-colors duration-200">
                <span
                  className={`transition-colors ${
                    active
                      ? "font-semibold text-black"
                      : "font-normal text-[#475569] group-hover:text-black"
                  }`}>
                  {item.label}
                </span>

                {/* Active Underline matching screenshot */}
                <span
                  className={`absolute -bottom-1.5 left-0 right-0 h-[2px] bg-black transition-all duration-200 ${
                    active
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-40"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* ICONS (RIGHT): SEARCH & CART */}
        <div className="flex items-center justify-self-end gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => navigate("/search")}
            aria-label="Search products"
            className="group flex h-10 w-10 items-center justify-center rounded-full text-[#121212] transition-colors hover:bg-neutral-100 active:scale-95 sm:h-11 sm:w-11">
            <MagnifyingGlassIcon
              className="h-5 w-5 stroke-[1.6] transition-transform duration-300 group-hover:scale-110 text-[#121212]"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Open cart with ${cartCount} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#121212] transition-colors hover:bg-neutral-100 active:scale-95 sm:h-11 sm:w-11">
            <ShoppingBagIcon
              className="h-5 w-5 stroke-[1.6] text-[#121212]"
              aria-hidden="true"
            />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DesktopNavbar);