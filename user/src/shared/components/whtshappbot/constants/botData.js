// ─────────────────────────────────────────────
// BOT CONSTANTS & STATIC DATA
// ─────────────────────────────────────────────

export const FREE_SHIPPING_THRESHOLD = 599;

/* ─────────────────────────────
   STORE INFO
───────────────────────────── */
export const STORE_INFO = {
  name: "GharKa Organic",
  number: "+919897447525", // Fixed: Added + for international format
  logo: "https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1779815172/8ee1518a-2c8d-436b-ad23-592620cb0d71.png",
  bgImage: "https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png",
};

/* ─────────────────────────────
   WELCOME MESSAGES
───────────────────────────── */
export const welcomeMessages = [
  { text: "👋 Welcome to *GharKa Organic*! 🌿", delay: 600, type: "text" },
  { text: "We bring you 100% pure, farm-fresh organic products straight from the Pahadi region.", delay: 1200, type: "text" },
  { text: "How can I help you today?", delay: 900, type: "text" },
];

/* ─────────────────────────────
   PROMO CODES (FIXED: Updated expiry dates to 2026)
───────────────────────────── */
export const PROMO_CODES = {
  ORGANIC10: {
    discount: "10% OFF",
    desc: "10% off on your first order",
    min: 500,
    expires: "31 Dec 2026", // Fixed: Was 2025 (expired)
  },
  FRESH50: {
    discount: "₹50 OFF",
    desc: "₹50 off on orders above ₹999",
    min: 999,
    expires: "31 Dec 2026", // Fixed: Was 2025 (expired)
  },
  PAHADI20: {
    discount: "20% OFF",
    desc: "20% off on Pahadi products",
    min: 300,
    expires: "15 Jan 2027", // Fixed: Was 2026 (expired)
  },
  HONEY20: {
    discount: "20% OFF",
    desc: "20% off on honey range",
    min: 199,
    expires: "31 Dec 2026", // Fixed: Was 2025 (expired)
  },
};

/* ─────────────────────────────
   NEW MAPPINGS & MENUS
───────────────────────────── */
export const FESTIVAL_MAP = [
  { name: "Diwali",    start: [10, 20], end: [10, 27], emoji: "🪔" },
  { name: "Holi",      start: [3,  10], end: [3,  16], emoji: "🎨" },
  { name: "Eid",       start: [3,  29], end: [4,   3], emoji: "🌙" },
  { name: "Christmas", start: [12, 23], end: [12, 27], emoji: "🎄" },
  { name: "New Year",  start: [12, 30], end: [1,   2], emoji: "🎆" },
  { name: "Navratri",  start: [10,  2], end: [10, 11], emoji: "🌸" },
];

export const BUNDLE_MAP = {
  honey:       [{ label: "Pahadi Salt", id: "pahadiSalts" }, { label: "Raw Ghee", id: "ghee" }],
  ghee:        [{ label: "Pahadi Honey", id: "honey" },      { label: "Spices", id: "spices" }],
  spices:      [{ label: "Pahadi Dals", id: "pahadiDals" },  { label: "Pickle", id: "pickle" }],
  pickle:      [{ label: "Ghee", id: "ghee" },               { label: "Pahadi Dals", id: "pahadiDals" }],
  pahadiSalts: [{ label: "Honey", id: "honey" },             { label: "Spices", id: "spices" }],
  pahadiDals:  [{ label: "Ghee", id: "ghee" },               { label: "Spices", id: "spices" }],
  // chutney removed - no chutney page exists in SITE_PAGES
};

export const MAIN_MENU = [
  { id: "shop",    label: "Shop products",       desc: "Browse organic range",   icon: "bag" },
  { id: "cart",    label: "My cart",             desc: "View items & checkout",  icon: "cart" },
  { id: "orders",  label: "Track order",         desc: "Check order status",     icon: "package" },
  { id: "promo",   label: "Offers & promo codes", desc: "Active deals for you",  icon: "tag" },
  { id: "pages",   label: "Info pages",          desc: "FAQ, about, shipping",   icon: "file" },
  { id: "support", label: "Talk to support",     desc: "Get help from our team", icon: "headset" },
];

export const INFO_PAGES = [
  { id: "about",    label: "About us",   url: "/pages/about",   icon: "info" },
  { id: "faq",      label: "FAQ",        url: "/faq",     icon: "help" },
  { id: "contact",  label: "Contact",    url: "/contact", icon: "phone" },
  { id: "blog",     label: "Blog",       url: "/blog",          icon: "article" },
  { id: "returns",  label: "Returns",    url: "/pages/returns", icon: "return" },
  { id: "shipping", label: "Shipping",   url: "/pages/shipping",icon: "truck" },
];

export const POST_SHOP_QR = [
  { id: "cart",  label: "My cart",     icon: "cart" },
  { id: "promo", label: "Promo codes", icon: "tag" },
  { id: "main",  label: "Main menu",   icon: "home" },
];

/* ─────────────────────────────
   SITE PAGES (Added Chutney page)
───────────────────────────── */
export const SITE_PAGES = [
  { label: "Home", url: "/", hint: "Go to homepage", icon: "home" },
  { label: "All Products", url: "/all-products", hint: "Browse everything", icon: "bag" },
  { label: "Honey", url: "/honey", hint: "Pure organic honey", icon: "sparkles" },
  { label: "Grains & Rice", url: "/grains", hint: "Organic grains", icon: "list" },
  { label: "Dairy", url: "/dairy", hint: "Farm-fresh dairy", icon: "beaker" },
  { label: "Oils & Ghee", url: "/oils", hint: "Cold-pressed oils", icon: "droplet" },
  { label: "Spices", url: "/spices", hint: "Natural spices", icon: "flame" },
  { label: "Pickle", url: "/pickle", hint: "Homemade pickles", icon: "jar" },
  { label: "About Us", url: "/pages/about", hint: "Our story", icon: "info" },
  { label: "Contact", url: "/contact", hint: "Get in touch", icon: "phone" },
  { label: "FAQ", url: "/faq", hint: "Common questions", icon: "help" },
  { label: "Track Order", url: "/track-order", hint: "Track your delivery", icon: "truck" },
  { label: "Login", url: "/auth/login", hint: "Sign in to account", icon: "lock" },
];

/* ─────────────────────────────
   SUGGESTIONS
───────────────────────────── */
export const SUGGESTION_MAP = {
  shop: [
    { label: "🍯 View Honey", url: "/honey" },
    { label: "🛍️ All Products", url: "/all-products" },
    { label: "🫚 Oils & Ghee", url: "/oils" },
  ],
  cart: [
    { label: "🛍️ Continue Shopping", url: "/all-products" },
    { label: "📞 Need Help?", url: "/contact" },
  ],
  track: [
    { label: "📦 Track Order Page", url: "/track-order" },
    { label: "📞 Contact Support", url: "/contact" },
  ],
  support: [
    { label: "❓ FAQ", url: "/faq" },
    { label: "📞 Contact Us", url: "contact" },
  ],
  product: [
    { label: "🛍️ All Products", url: "/all-products" },
    { label: "🍯 Honey Range", url: "/honey" },
    { label: "🌿 Spices", url: "/spices" },
  ],
  default: [
    { label: "🛍️ Shop Now", url: "/all-products" },
    { label: "🍯 Try Our Honey", url: "/honey" },
    { label: "📞 Contact Us", url: "/contact" },
  ],
};

/* ─────────────────────────────
   QUICK REPLIES
───────────────────────────── */
export const QUICK_REPLIES = {
  shop: ["Show bestsellers", "What's on sale?", "Show honey", "Browse oils"],
  cart: ["View my cart", "Apply promo code", "Checkout help"],
  track: ["Track my order", "Delivery time?", "Contact support"],
  support: ["Refund policy", "Change order", "Talk to human"],
  product: ["Add to cart", "More like this", "Any discounts?"],
  default: ["Show products", "My cart", "Track order", "Get promo code"],
};

/* ─────────────────────────────
   GLOBAL OPTIONS
───────────────────────────── */
export const GLOBAL_OPTIONS = [
  { label: "🛍️ Shop", action: "shop" },
  { label: "🛒 Cart", action: "cart" },
  { label: "📦 Track", action: "track" },
  { label: "💬 Support", action: "support" },
];

/* ─────────────────────────────
   CHAT STEPS
───────────────────────────── */
export const CHAT_STEPS = {
  INIT: "INIT",
  ASK_AUTH: "ASK_AUTH",
  ASK_NAME: "ASK_NAME",
  FREE_CHAT: "FREE_CHAT",
};