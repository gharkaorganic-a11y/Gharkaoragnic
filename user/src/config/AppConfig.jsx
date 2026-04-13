// 🌿 Brand Colors (Organic Food Theme)
export const BRAND_PRIMARY = "#3F6F3F"; // Natural Green
export const BRAND_DARK = "#1B4332"; // Deep Forest
export const BRAND_LIGHT = "#F6F9F6"; // Soft Organic Background
export const BRAND_ACCENT = "#A65E00"; // Earthy Orange (CTA)

export const BRAND_NAME = "Ghar Ka Organic";

export const CONFIG = {
  BRAND_NAME: "Ghar Ka Organic",

  // 📞 WhatsApp First Business Model
  WHATSAPP_NUMBER: "919913419927",

  contact: {
    phoneDisplay: "+91 99134 19927",
    phoneLink: "https://wa.me/919913419927",
    phoneNote: "(Order on WhatsApp)",
    email: "gharkaorganic@gmail.com",
  },

  // 🛍️ Customer Navigation (Food Based)
  quickLinks: [
    { label: "About Us", path: "/about-us" },
    { label: "Our Products", path: "/products" },
    { label: "Blogs / Recipes", path: "/blogs" },
    { label: "Contact Us", path: "/contact-us" },
    { label: "FAQ", path: "/faq" },
  ],

  // 📜 Policies (Trust Building)
  policies: [
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms of Service", path: "/terms-of-service" },
    { label: "Shipping Policy", path: "/shipping-policy" },
    { label: "Return & Refund Policy", path: "/exchange-return-policy" },
    { label: "Order Tracking", path: "/track-order" },
    { label: "Sitemap", path: "/sitemap" },
  ],

  // 🌿 Trust Highlights (NEW - very important for food brand)
  highlights: [
    "100% Homemade",
    "No Preservatives",
    "Freshly Prepared",
    "Direct From Kitchen",
  ],

  // 🧾 Product Categories (NEW - helps navbar + homepage)
  categories: [
    { name: "Pickles", path: "/category/pickles" },
    { name: "Masala", path: "/category/masala" },
    { name: "Ghee", path: "/category/ghee" },
    { name: "Papad", path: "/category/papad" },
    { name: "Snacks", path: "/category/snacks" },
  ],

  // 🌐 Socials (Keep clean + real links later)
  socials: [
    {
      name: "Facebook",
      url: "https://facebook.com",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-5 h-5">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: "https://instagram.com",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-5 h-5">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/919913419927",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-5 h-5">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
  ],
};
