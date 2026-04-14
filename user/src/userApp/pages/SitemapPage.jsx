import React from "react";
import { Link } from "react-router-dom";

const sitemapData = [
  {
    title: "Shop Categories",
    links: [
      { name: "All Products", path: "/collections/all" },
      { name: "Homemade Pickles", path: "/collection/homemade-pickles" },
      { name: "Mustard Oil Pickles", path: "/collection/mustard-oil-pickles" },
      { name: "Spicy Pickles", path: "/collection/spicy-pickles" },
      { name: "Tangy Pickles", path: "/collection/tangy-pickles" },
      { name: "Sweet Pickles", path: "/collection/sweet-pickles" },
      { name: "Mango Pickles", path: "/collection/mango-pickles" },
      { name: "Oil-Free Pickles", path: "/collection/oil-free" },
      { name: "Hand-pounded Masala", path: "/collection/masala" },
      { name: "A2 Desi Ghee", path: "/collection/ghee" },
      { name: "Healthy Snacks", path: "/collection/snacks" },
    ],
  },
  {
    title: "About Ghar Ka Organic",
    links: [
      { name: "Our Story", path: "/our-story" },
      { name: "Our Mission", path: "/mission" },
      { name: "Meet the Makers", path: "/meet-the-makers" },
      { name: "Blogs & Recipes", path: "/blog" },
      { name: "Press & Media", path: "/press" },
      { name: "Careers", path: "/careers" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { name: "Contact Us", path: "/contact" },
      { name: "Track Your Order", path: "/track-order" },
      { name: "Shipping & Delivery", path: "/shipping" },
      { name: "Cancellation & Returns", path: "/cancellation" },
      { name: "FAQs", path: "/faqs" },
      { name: "Bulk Orders / Corporate", path: "/bulk-orders" },
    ],
  },
  {
    title: "Legal & Policies",
    links: [
      { name: "Terms and Conditions", path: "/terms" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Cookie Policy", path: "/cookies" },
      { name: "Disclaimer", path: "/disclaimer" },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "My Account", path: "/user/profile" },
      { name: "Order History", path: "/user/orders" },
      { name: "Wishlist", path: "/wishlist" },
      { name: "Shopping Bag", path: "/checkout/cart" },
      { name: "Login / Register", path: "/auth/login" },
    ],
  },
];

const SitemapPage = () => {
  return (
    <main
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="min-h-screen bg-[#FAF9F6] py-16 md:py-24">
      {/* Ensure fonts are loaded (can be removed if already in index.html) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Page Header ── */}
        <div className="text-center mb-16 flex flex-col items-center">
          <h1
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Sitemap
          </h1>

          {/* Custom Line & Dot Divider */}
          <div className="flex items-center justify-center gap-3.5 mt-5 mb-4">
            <div className="h-[1px] w-16 bg-gray-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8102e] opacity-60" />
            <div className="h-[1px] w-16 bg-gray-200" />
          </div>

          <p className="text-sm md:text-base text-gray-500 font-light max-w-xl mx-auto">
            Looking for something specific? Use our directory below to easily
            navigate to any page on Ghar Ka Organic.
          </p>
        </div>

        {/* ── Sitemap Grid ── */}
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 p-8 md:p-12 lg:p-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {sitemapData.map((section, index) => (
              <div key={index} className="flex flex-col">
                {/* Category Title */}
                <h2
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-1 h-6 bg-[#c8102e] rounded-full block" />
                  {section.title}
                </h2>

                {/* Links List */}
                <ul className="space-y-3.5 flex-1">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.path}
                        className="group flex items-center gap-2 text-[15px] text-gray-600 hover:text-[#c8102e] transition-colors duration-300">
                        {/* Hover Arrow */}
                        <svg
                          className="w-3.5 h-3.5 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-[#c8102e]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>

                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SitemapPage;
