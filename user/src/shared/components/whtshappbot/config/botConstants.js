/* ─────────────────────────────────────────────
   FESTIVAL & SEASONAL GREETINGS
───────────────────────────────────────────── */
export const FESTIVAL_MAP = [
  { name: "Diwali", start: [10, 20], end: [10, 27], emoji: "🪔" },
  { name: "Holi", start: [3, 10], end: [3, 16], emoji: "🎨" },
  { name: "Eid", start: [3, 29], end: [4, 3], emoji: "🌙" },
  { name: "Christmas", start: [12, 23], end: [12, 27], emoji: "🎄" },
  { name: "New Year", start: [12, 30], end: [1, 2], emoji: "🎆" },
  { name: "Navratri", start: [10, 2], end: [10, 11], emoji: "🌸" },
];

/* ─────────────────────────────────────────────
   PRODUCT BUNDLE / CROSS-SELL SUGGESTIONS
───────────────────────────────────────────── */
export const BUNDLE_MAP = {
  honey: [
    { label: "Pahadi Salt", id: "pahadiSalts" },
    { label: "Raw Ghee", id: "ghee" },
  ],
  ghee: [
    { label: "Pahadi Honey", id: "honey" },
    { label: "Spices", id: "spices" },
  ],
  spices: [
    { label: "Pahadi Dals", id: "pahadiDals" },
    { label: "Pickle", id: "pickle" },
  ],
  pickle: [
    { label: "Ghee", id: "ghee" },
    { label: "Pahadi Dals", id: "pahadiDals" },
  ],
  pahadiSalts: [
    { label: "Honey", id: "honey" },
    { label: "Spices", id: "spices" },
  ],
  pahadiDals: [
    { label: "Ghee", id: "ghee" },
    { label: "Spices", id: "spices" },
  ],
  chutney: [
    { label: "Pickle", id: "pickle" },
    { label: "Pahadi Dals", id: "pahadiDals" },
  ],
};

/* ─────────────────────────────────────────────
   MAIN MENU OPTIONS
───────────────────────────────────────────── */
export const MAIN_MENU = [
  {
    id: "shop",
    label: "Shop products",
    desc: "Browse organic range",
    icon: "bag",
  },
  {
    id: "cart",
    label: "My cart",
    desc: "View items & checkout",
    icon: "cart",
  },
  {
    id: "orders",
    label: "Track order",
    desc: "Check order status",
    icon: "package",
  },
  {
    id: "promo",
    label: "Offers & promo codes",
    desc: "Active deals for you",
    icon: "tag",
  },
  {
    id: "pages",
    label: "Info pages",
    desc: "FAQ, about, shipping",
    icon: "file",
  },
  {
    id: "support",
    label: "Talk to support",
    desc: "Get help from our team",
    icon: "headset",
  },
];

/* ─────────────────────────────────────────────
   INFORMATION PAGES
───────────────────────────────────────────── */
export const INFO_PAGES = [
  { id: "about", label: "About us", url: "/pages/about", icon: "info" },
  { id: "faq", label: "FAQ", url: "/faq", icon: "help" },
  { id: "contact", label: "Contact", url: "/contact", icon: "phone" },
  { id: "blog", label: "Blog", url: "/blog", icon: "article" },
  { id: "returns", label: "Returns", url: "/pages/returns", icon: "return" },
  { id: "shipping", label: "Shipping", url: "/pages/shipping", icon: "truck" },
];

/* ─────────────────────────────────────────────
   POST-SHOPPING QUICK REPLIES
───────────────────────────────────────────── */
export const POST_SHOP_QR = [
  { id: "cart", label: "My cart", icon: "cart" },
  { id: "promo", label: "Promo codes", icon: "tag" },
  { id: "main", label: "Main menu", icon: "home" },
];

/* ─────────────────────────────────────────────
   HELPER FUNCTIONS
───────────────────────────────────────────── */
export const getFestival = () => {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  
  return FESTIVAL_MAP.find(({ start, end }) => {
    const after = m > start[0] || (m === start[0] && d >= start[1]);
    const before = m < end[0] || (m === end[0] && d <= end[1]);
    return after && before;
  }) || null;
};

/* ─────────────────────────────────────────────
   RE-EXPORTS (Optional: Route external bot data through here)
───────────────────────────────────────────── */
// Assuming STORE_INFO, PROMO_CODES, and welcomeMessages live in your lib folder
export { STORE_INFO, PROMO_CODES, welcomeMessages } from "../constants/botData";