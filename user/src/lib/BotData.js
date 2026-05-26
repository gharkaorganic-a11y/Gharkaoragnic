import {
  HomeIcon,
  ShoppingBagIcon,
  SparklesIcon,
  ListBulletIcon,
  BeakerIcon,
  FunnelIcon,
  FireIcon,
  InformationCircleIcon,
  PhoneIcon,
  QuestionMarkCircleIcon,
  TruckIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

/* ─────────────────────────────
   WELCOME MESSAGES
───────────────────────────── */
export const welcomeMessages = [
  {
    text: "👋 Welcome to *Ghar Ka Organic*! 🌿",
    type: "text",
    delay: 800,
  },
  {
    text: "Farm-fresh organic products delivered to your door.",
    type: "text",
    delay: 1200,
  },
  {
    text: "To give you the best experience, please choose:",
    type: "options",
    delay: 2200,
    data: [
      { label: "🔐 Login / Register", action: "login" },
      { label: "👤 Continue as Guest", action: "guest" },
    ],
  },
];

/* ─────────────────────────────
   SITE PAGES
───────────────────────────── */
export const SITE_PAGES = [
  { label: "Home", url: "/", hint: "Go to homepage", icon: HomeIcon },
  { label: "All Products", url: "/all-products", hint: "Browse everything", icon: ShoppingBagIcon },
  { label: "Honey", url: "/honey", hint: "Pure organic honey", icon: SparklesIcon },
  { label: "Grains & Rice", url: "/grains", hint: "Organic grains", icon: ListBulletIcon },
  { label: "Dairy", url: "/dairy", hint: "Farm-fresh dairy", icon: BeakerIcon },
  { label: "Oils & Ghee", url: "/oils", hint: "Cold-pressed oils", icon: FunnelIcon },
  { label: "Spices", url: "/spices", hint: "Natural spices", icon: FireIcon },
  { label: "About Us", url: "/pages/about", hint: "Our story", icon: InformationCircleIcon },
  { label: "Contact", url: "/pages/contact", hint: "Get in touch", icon: PhoneIcon },
  { label: "FAQ", url: "/pages/faq", hint: "Common questions", icon: QuestionMarkCircleIcon },
  { label: "Track Order", url: "/track-order", hint: "Track your delivery", icon: TruckIcon },
  { label: "Login", url: "/auth/login", hint: "Sign in to account", icon: LockClosedIcon },
];

/* ─────────────────────────────
   STORE INFO
───────────────────────────── */
export const STORE_INFO = {
  name: "Ghar Ka Organic",
  number: "919897447525",
  logo: "https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1779815172/8ee1518a-2c8d-436b-ad23-592620cb0d71.png",
  bgImage:
    "https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png",
};

/* ─────────────────────────────
   PROMO CODES
───────────────────────────── */
export const PROMO_CODES = {
  ORGANIC10: {
    discount: "10% OFF",
    desc: "10% off on all products",
    min: "₹299",
  },
  HONEY20: {
    discount: "20% OFF",
    desc: "20% off on honey range",
    min: "₹199",
  },
  FRESH50: {
    discount: "₹50 OFF",
    desc: "₹50 off on first order",
    min: "₹499",
  },
};

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
    { label: "📞 Need Help?", url: "/pages/contact" },
  ],
  track: [
    { label: "📦 Track Order Page", url: "/track-order" },
    { label: "📞 Contact Support", url: "/pages/contact" },
  ],
  support: [
    { label: "❓ FAQ", url: "/pages/faq" },
    { label: "📞 Contact Us", url: "/pages/contact" },
  ],
  product: [
    { label: "🛍️ All Products", url: "/all-products" },
    { label: "🍯 Honey Range", url: "/honey" },
    { label: "🌿 Spices", url: "/spices" },
  ],
  default: [
    { label: "🛍️ Shop Now", url: "/all-products" },
    { label: "🍯 Try Our Honey", url: "/honey" },
    { label: "📞 Contact Us", url: "/pages/contact" },
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