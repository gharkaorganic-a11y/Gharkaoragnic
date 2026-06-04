import React, { useEffect } from "react";
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
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://gharka.com";

  // Navigation items with proper structure for sitelinks
  const navItems = [
    { label: "Home", path: "/", name: "home" },
    { label: "Shop", path: "/all-products", dropdown: true, name: "shop" },
    { label: "Best Sellers", path: "/shop/best-sellers", name: "best-sellers" },
    { label: "Reviews", path: "/reviews", name: "reviews" },
    { label: "Our Story", path: "/our-story", name: "our-story" },
    { label: "Contact", path: "/contact", name: "contact" },
    { label: "Blogs", path: "/blogs", name: "blogs" },
  ];

  // Add Schema.org structured data for sitelinks
  useEffect(() => {
    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.innerHTML = JSON.stringify({
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
    });
    document.head.appendChild(schemaScript);

    // Add sitelinks structured data
    const sitelinksScript = document.createElement("script");
    sitelinksScript.type = "application/ld+json";
    sitelinksScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      url: baseUrl,
      name: "Ghar Ka Organic",
      logo: `${baseUrl}${logoUrl}`,
      sameAs: [
        "https://www.facebook.com/gharka",
        "https://www.instagram.com/gharka",
        "https://www.twitter.com/gharka",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-XXX-XXX-XXXX",
        contactType: "Customer Support",
      },
    });
    document.head.appendChild(sitelinksScript);

    return () => {
      document.head.removeChild(schemaScript);
      document.head.removeChild(sitelinksScript);
    };
  }, [baseUrl]);

  return (
    <header
      className="w-full bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm"
      role="banner">
      <div className="max-w-[1400px] mx-auto px-8 h-[80px] flex items-center justify-between relative">
        {/* LEFT: LOGO */}
        <div
          className="flex items-center cursor-pointer shrink-0"
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/")}
          aria-label="Ghar Ka Organic - Home">
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

        {/* CENTER: NAV LINKS - with proper semantic nav */}
        <nav
          className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-10"
          aria-label="Main navigation">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            const fullUrl = `${baseUrl}${item.path}`;

            return (
              <a
                key={idx}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
                className={`group relative flex items-center gap-1 text-[14.5px] transition-all duration-300
                  ${
                    isActive
                      ? "text-black font-medium"
                      : "text-gray-600 hover:text-black"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
                data-sitelink={item.name}>
                {item.label}

                {item.dropdown && (
                  <ChevronDownIcon
                    className="w-3.5 h-3.5 mt-[1px] text-gray-400 group-hover:text-black"
                    aria-hidden="true"
                  />
                )}

                {/* Underline */}
                <span
                  className={`absolute -bottom-2 left-0 h-[1.5px] bg-black transition-all duration-300
                    ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                  aria-hidden="true"
                />
              </a>
            );
          })}
        </nav>

        {/* RIGHT: ICONS */}
        <div className="flex items-center gap-6">
          {/* User */}
          <a
            href="/user/profile"
            onClick={(e) => {
              e.preventDefault();
              navigate("/user/profile");
            }}
            className="text-black hover:text-gray-500 transition active:scale-95"
            aria-label="User Profile">
            <UserIcon className="w-6 h-6 stroke-[1.5px]" aria-hidden="true" />
          </a>

          {/* Cart */}
          <a
            href="/checkout/cart"
            onClick={(e) => {
              e.preventDefault();
              navigate("/checkout/cart");
            }}
            className="text-black hover:text-gray-500 transition relative active:scale-95"
            aria-label={`Shopping cart${cartCount > 0 ? ` with ${cartCount} items` : ""}`}>
            <ShoppingBagIcon
              className="w-6 h-6 stroke-[1.5px]"
              aria-hidden="true"
            />

            {cartCount > 0 && (
              <span
                className="absolute -top-1.5 -right-2 bg-black text-white text-[10px] font-medium w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                aria-label={`${cartCount > 99 ? "99+" : cartCount} items in cart`}>
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </a>
        </div>
      </div>
    </header>
  );
};

export default React.memo(DesktopNavbar);
