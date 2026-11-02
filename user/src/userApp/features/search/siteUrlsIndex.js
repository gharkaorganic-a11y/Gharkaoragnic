/**
 * siteUrlsIndex.js
 * Single Source of Truth for all site URLs across gharkaorganic.com and the codebase.
 * Provides unified indexing, categorization, clean URL generation, and real-time search.
 */

import { allBlogs } from "../../pages/data/blogData.js";

export const BASE_URL = "https://gharkaorganic.com";

/**
 * 1. STATIC & CORE BRAND PAGES
 */
export const STATIC_PAGES = [
  {
    id: "page-home",
    title: "Ghar Ka Organic | Pure Himalayan Foods",
    path: "/",
    fullUrl: `${BASE_URL}/`,
    type: "page",
    category: "Brand",
    categoryLabel: "Brand Page",
    badge: "Official",
    description:
      "Pure authentic Himalayan organic foods, A2 bilona desi ghee, raw forest honey & traditional sun-cured pickles from Bhimtal, Nainital.",
    keywords: [
      "home",
      "homepage",
      "gharkaorganic",
      "ghar ka organic",
      "main",
      "store",
      "organic",
      "uttarakhand",
      "nainital",
      "bhimtal",
    ],
  },
  {
    id: "page-our-story",
    title: "Our Story – Pure Pahadi Taste from Bhimtal, Nainital",
    path: "/our-story",
    fullUrl: `${BASE_URL}/our-story`,
    type: "page",
    category: "About",
    categoryLabel: "Brand Heritage",
    badge: "Heritage",
    description:
      "Born in Bhimtal, Nainital. Traditional Kumaoni recipes handcrafted by local mountain women communities with zero artificial preservatives.",
    keywords: [
      "our story",
      "about us",
      "story",
      "heritage",
      "bhimtal",
      "nainital",
      "kumaon",
      "women empowerment",
      "kumaoni",
      "handmade",
      "mission",
      "founder",
    ],
  },
  {
    id: "page-contact",
    title: "Contact Us & Nainital Kitchen Location",
    path: "/contact",
    fullUrl: `${BASE_URL}/contact`,
    type: "page",
    category: "Support",
    categoryLabel: "Customer Support",
    badge: "Support",
    description:
      "Reach our Bhimtal Nainital kitchen team via WhatsApp, direct call, or email. Ward No. 2, Nalni, Bhimtal, Nainital, Uttarakhand - 263136.",
    keywords: [
      "contact",
      "contact us",
      "phone",
      "call",
      "whatsapp",
      "email",
      "address",
      "kitchen",
      "bhimtal",
      "nainital",
      "customer care",
      "support",
      "help",
      "location",
    ],
  },
  {
    id: "page-reviews",
    title: "Customer Reviews & Verified Himalayan Ratings",
    path: "/reviews",
    fullUrl: `${BASE_URL}/reviews`,
    type: "page",
    category: "Reviews",
    categoryLabel: "Verified Reviews",
    badge: "4.9 ★ Rating",
    description:
      "Real customer reviews, testimonials and ratings from families across India enjoying our A2 ghee, forest honey, and pahadi pickles.",
    keywords: [
      "reviews",
      "customer reviews",
      "ratings",
      "feedback",
      "testimonials",
      "star ratings",
      "verified reviews",
      "customer trust",
    ],
  },
  {
    id: "page-blogs",
    title: "Pahadi Blog & Uttarakhand Heritage Stories",
    path: "/blogs",
    fullUrl: `${BASE_URL}/blogs`,
    type: "page",
    category: "Blog",
    categoryLabel: "Articles & Recipes",
    badge: "Stories",
    description:
      "Explore traditional Ayurvedic insights, Himalayan harvest stories, authentic pahadi recipes, and organic wellness guides.",
    keywords: [
      "blog",
      "blogs",
      "articles",
      "recipes",
      "stories",
      "ayurveda",
      "health tips",
      "pahadi food",
      "uttarakhand culture",
    ],
  },
  {
    id: "page-faq",
    title: "Frequently Asked Questions (FAQs)",
    path: "/faq",
    fullUrl: `${BASE_URL}/faq`,
    type: "page",
    category: "Help",
    categoryLabel: "FAQs & Guide",
    badge: "Help",
    description:
      "Everything you need to know about our purity standards, shelf-life, airtight glass jar packaging, bilona churning, and shipping times.",
    keywords: [
      "faq",
      "faqs",
      "frequently asked questions",
      "questions",
      "purity",
      "shelf life",
      "packaging",
      "storage",
      "delivery time",
      "help",
    ],
  },
  {
    id: "page-bestsellers",
    title: "Best Sellers – Most Loved Himalayan Products",
    path: "/shop/best-sellers",
    fullUrl: `${BASE_URL}/shop/best-sellers`,
    type: "page",
    category: "Shop",
    categoryLabel: "Featured Collection",
    badge: "Top Seller",
    description:
      "Most loved organic foods from Uttarakhand: A2 Badri cow bilona ghee, Bhimtal raw honey, and traditional pahadi mango achar.",
    keywords: [
      "best sellers",
      "bestsellers",
      "top products",
      "most loved",
      "popular",
      "trending",
      "hot selling",
      "top rated",
    ],
  },
  {
    id: "page-collections",
    title: "All Collections – Authentic Himalayan Pantry",
    path: "/collections",
    fullUrl: `${BASE_URL}/collections`,
    type: "page",
    category: "Shop",
    categoryLabel: "Full Catalog",
    badge: "Pantry",
    description:
      "Explore our entire range of natural, chemical-free Himalayan organic staples handcrafted with love in Uttarakhand.",
    keywords: [
      "collections",
      "shop",
      "all products",
      "store",
      "catalog",
      "himalayan pantry",
      "buy online",
      "browse",
    ],
  },
  {
    id: "page-shipping",
    title: "Shipping & Delivery Policy – PAN India Courier",
    path: "/pages/shipping",
    fullUrl: `${BASE_URL}/pages/shipping`,
    type: "page",
    category: "Policy",
    categoryLabel: "Shipping Details",
    badge: "3-7 Days",
    description:
      "Safe bubble-wrapped glass jar dispatch from Nainital. Delivery within 3 to 7 business days across all states and pin codes in India.",
    keywords: [
      "shipping",
      "shipping policy",
      "delivery",
      "delivery time",
      "courier",
      "dispatch",
      "pan india",
      "tracking",
      "charges",
      "free delivery",
    ],
  },
  {
    id: "page-privacy",
    title: "Privacy Policy & Data Security Guidelines",
    path: "/pages/privacy-policy",
    fullUrl: `${BASE_URL}/pages/privacy-policy`,
    type: "page",
    category: "Policy",
    categoryLabel: "Legal & Privacy",
    badge: "Protected",
    description:
      "Learn how Ghar Ka Organic protects your personal information, contact numbers, addresses, and payment data with end-to-end security.",
    keywords: [
      "privacy",
      "privacy policy",
      "terms",
      "security",
      "data protection",
      "customer safety",
      "legal",
    ],
  },
  {
    id: "page-sitemap",
    title: "Complete Website Sitemap & Page Directory",
    path: "/sitemap",
    fullUrl: `${BASE_URL}/sitemap`,
    type: "page",
    category: "Directory",
    categoryLabel: "Website Directory",
    badge: "All Pages",
    description:
      "Visual and structured catalog of all pages, category collections, customer services, and direct links on gharkaorganic.com.",
    keywords: [
      "sitemap",
      "site map",
      "all links",
      "page list",
      "directory",
      "index",
      "navigation",
    ],
  },
];

/**
 * 2. SEO CATEGORY & COLLECTION URLS
 * Derived from SECTIONKEY.jsx and productCollection.js
 */
export const SEO_COLLECTIONS = [
  // GHEE
  {
    id: "col-buy-desi-ghee-online",
    title: "Buy Pure Desi Cow Ghee Online – A2 Bilona Ghee",
    path: "/buy-desi-ghee-online",
    fullUrl: `${BASE_URL}/buy-desi-ghee-online`,
    type: "category",
    collectionKey: "ghee",
    categoryLabel: "A2 Desi Ghee",
    badge: "Bilona Method",
    description:
      "Pure A2 cow ghee handcrafted using the ancient wooden bilona churning method in the clean mountain air of Uttarakhand. 100% natural aroma.",
    keywords: [
      "ghee",
      "desi ghee",
      "a2 ghee",
      "bilona ghee",
      "cow ghee",
      "buy desi ghee online",
      "pure ghee",
      "badri cow",
      "danedar ghee",
    ],
  },
  {
    id: "col-bilona-ghee-uttarakhand",
    title: "Bilona Ghee Uttarakhand – Authentic Handcrafted Ghee",
    path: "/bilona-ghee-uttarakhand",
    fullUrl: `${BASE_URL}/bilona-ghee-uttarakhand`,
    type: "category",
    collectionKey: "ghee",
    categoryLabel: "A2 Desi Ghee",
    badge: "Uttarakhand",
    description:
      "Authentic hand-churned Bilona Ghee sourced from indigenous hill cows grazing on wild Himalayan herbs. Rich in CLA and Omega-3.",
    keywords: [
      "bilona ghee uttarakhand",
      "uttarakhand ghee",
      "pahadi ghee",
      "kumaon ghee",
      "hand churned ghee",
      "traditional ghee",
    ],
  },
  {
    id: "col-buy-a2-ghee-online",
    title: "Buy A2 Ghee Online – Pure Grass-Fed Cow Ghee",
    path: "/buy-a2-ghee-online",
    fullUrl: `${BASE_URL}/buy-a2-ghee-online`,
    type: "category",
    collectionKey: "ghee",
    categoryLabel: "A2 Desi Ghee",
    badge: "A2 Certified",
    description:
      "Grass-fed pure A2 cow ghee with traditional grainy (danedar) texture and golden color. Lab tested with zero adulteration.",
    keywords: [
      "buy a2 ghee online",
      "a2 cow ghee price",
      "grass fed ghee",
      "pure desi cow ghee price",
      "ayurvedic ghee",
    ],
  },
  {
    id: "col-pure-desi-ghee-uttarakhand",
    title: "Pure Desi Ghee Uttarakhand – Traditional Himalayan Purity",
    path: "/pure-desi-ghee-uttarakhand",
    fullUrl: `${BASE_URL}/pure-desi-ghee-uttarakhand`,
    type: "category",
    collectionKey: "ghee",
    categoryLabel: "A2 Desi Ghee",
    badge: "100% Pure",
    description:
      "Straight from the high altitude valleys of Kumaon. Made from grass-fed mountain cows, slow-simmered over gentle firewood.",
    keywords: [
      "pure desi ghee uttarakhand",
      "nainital ghee",
      "organic ghee uttarakhand",
      "best ghee india",
    ],
  },

  // HONEY
  {
    id: "col-raw-honey-uttarakhand",
    title: "Raw Forest Honey Uttarakhand – 100% Pure & Unfiltered",
    path: "/raw-honey-uttarakhand",
    fullUrl: `${BASE_URL}/raw-honey-uttarakhand`,
    type: "category",
    collectionKey: "honey",
    categoryLabel: "Raw Honey",
    badge: "Raw & Unprocessed",
    description:
      "Direct from wild forest hives in Bhimtal and Nainital. Unpasteurized, unfiltered honey packed with natural pollen, enzymes, and antioxidants.",
    keywords: [
      "honey",
      "raw honey",
      "forest honey",
      "raw honey uttarakhand",
      "bhimtal honey",
      "wild honey",
      "unprocessed honey",
      "pure honey",
    ],
  },
  {
    id: "col-buy-forest-honey-india",
    title: "Buy Pure Himalayan Forest Honey Online in India",
    path: "/buy-forest-honey-india",
    fullUrl: `${BASE_URL}/buy-forest-honey-india`,
    type: "category",
    collectionKey: "honey",
    categoryLabel: "Raw Honey",
    badge: "Wild Multiflora",
    description:
      "Naturally harvested multifloral wild bee honey collected from mountain flora. No added sugar, corn syrup, or heating.",
    keywords: [
      "buy forest honey india",
      "organic honey online",
      "natural honey online",
      "wild bee honey",
      "himalayan flower honey",
    ],
  },
  {
    id: "col-organic-honey-online",
    title: "Organic Natural Honey Online – Forest Harvested",
    path: "/organic-honey-online",
    fullUrl: `${BASE_URL}/organic-honey-online`,
    type: "category",
    collectionKey: "honey",
    categoryLabel: "Raw Honey",
    badge: "Natural Purity",
    description:
      "100% natural, chemical-free forest honey. Delicious with warm water, herbal teas, toast, or traditional Ayurvedic tonics.",
    keywords: [
      "organic honey online",
      "pure natural honey",
      "raw forest honey india",
      "best honey online",
    ],
  },

  // PICKLE
  {
    id: "col-pahadi-achar-online",
    title: "Buy Pahadi Achar Online – Authentic Kumaoni Pickles",
    path: "/pahadi-achar-online",
    fullUrl: `${BASE_URL}/pahadi-achar-online`,
    type: "category",
    collectionKey: "pickle",
    categoryLabel: "Pahadi Achar",
    badge: "Zero Preservatives",
    description:
      "Traditional Kumaoni pickles made with cold-pressed mustard oil, whole mountain spices, and sun-cured over months in clear glass jars.",
    keywords: [
      "achar",
      "pickle",
      "pickles",
      "pahadi achar",
      "buy pahadi achar online",
      "kumaoni pickle",
      "sun dried achar",
      "homemade pickle",
      "mustard oil pickle",
    ],
  },
  {
    id: "col-buy-mango-pickle-online",
    title: "Buy Pahadi Mango Pickle Online – Sun-Dried Aam Ka Achar",
    path: "/buy-mango-pickle-online",
    fullUrl: `${BASE_URL}/buy-mango-pickle-online`,
    type: "category",
    collectionKey: "pickle",
    categoryLabel: "Pahadi Achar",
    badge: "Sun Cured",
    description:
      "Crisp green mangoes diced and blended with mountain fenugreek, fennel, turmeric, and pure mustard oil. Real home taste without vinegar.",
    keywords: [
      "mango pickle",
      "aam ka achar",
      "buy mango pickle online",
      "pahadi aam achar",
      "kumaoni mango pickle",
      "spicy mango pickle",
    ],
  },
  {
    id: "col-nimbu-achar-online",
    title: "Pahadi Nimbu Achar Online – Mountain Lemon Pickle",
    path: "/nimbu-achar-online",
    fullUrl: `${BASE_URL}/nimbu-achar-online`,
    type: "category",
    collectionKey: "pickle",
    categoryLabel: "Pahadi Achar",
    badge: "Sweet & Tangy",
    description:
      "Juicy mountain lemons (Pahadi Nimbu/Galgal) sun-fermented with natural black salt, ajwain, and jaggery. Excellent for digestion.",
    keywords: [
      "nimbu achar online",
      "lemon pickle",
      "pahadi nimbu achar",
      "galgal achar",
      "khatta meetha nimbu achar",
      "digestive pickle",
    ],
  },
  {
    id: "col-kumaoni-achar-online",
    title: "Kumaoni Achar Online – Handcrafted by Village Women",
    path: "/kumaoni-achar-online",
    fullUrl: `${BASE_URL}/kumaoni-achar-online`,
    type: "category",
    collectionKey: "pickle",
    categoryLabel: "Pahadi Achar",
    badge: "Handmade",
    description:
      "Authentic heritage recipes preserved across generations by the skilled women artisans of Bhimtal, Nainital.",
    keywords: [
      "kumaoni achar online",
      "kumaon pickle",
      "uttarakhand pickle",
      "nainital pickle",
      "village women achar",
    ],
  },
  {
    id: "col-homemade-pickle-india",
    title: "Homemade Pickles India – 100% Traditional Taste",
    path: "/homemade-pickle-india",
    fullUrl: `${BASE_URL}/homemade-pickle-india`,
    type: "category",
    collectionKey: "pickle",
    categoryLabel: "Pahadi Achar",
    badge: "Homemade",
    description:
      "Real homemade pickles made just like grandmother's pantry. No chemical additives, artificial colors, or acidic preservatives.",
    keywords: [
      "homemade pickle india",
      "ghar ka achar",
      "dadi nani achar",
      "natural pickle",
      "chemical free pickle",
    ],
  },

  // SPICES & MASALAS
  {
    id: "col-pahadi-spices-online",
    title: "Buy Pahadi Spices Online – Hand-Ground Himalayan Masalas",
    path: "/pahadi-spices-online",
    fullUrl: `${BASE_URL}/pahadi-spices-online`,
    type: "category",
    collectionKey: "spices",
    categoryLabel: "Pahadi Spices",
    badge: "Stone Ground",
    description:
      "Aromatic hand-ground spices from Uttarakhand including Jakhiya (wild mustard seeds), Timur pepper, mountain haldi, and coriander.",
    keywords: [
      "spices",
      "masala",
      "pahadi spices online",
      "jakhiya",
      "timur",
      "stone ground masala",
      "uttarakhand spices",
      "curry masala",
    ],
  },
  {
    id: "col-organic-masala-online",
    title: "Organic Masala Online – High Altitude Pure Spices",
    path: "/organic-masala-online",
    fullUrl: `${BASE_URL}/organic-masala-online`,
    type: "category",
    collectionKey: "spices",
    categoryLabel: "Pahadi Spices",
    badge: "Natural Aroma",
    description:
      "Naturally grown, pesticide-free mountain spices. Sourced directly from local farmers in Uttarakhand and stone-milled for peak potency.",
    keywords: [
      "organic masala online",
      "himalayan spices",
      "pure haldi",
      "natural spices india",
      "jakhiya seeds",
    ],
  },

  // SALTS
  {
    id: "col-himalayan-salt-india",
    title: "Buy Himalayan Salt India – Authentic Pahadi Pisyu Loon",
    path: "/himalayan-salt-india",
    fullUrl: `${BASE_URL}/himalayan-salt-india`,
    type: "category",
    collectionKey: "pahadiSalts",
    categoryLabel: "Herbal Salts",
    badge: "Pisyu Loon",
    description:
      "Unique Himalayan pink rock salt and Pahadi Pisyu Loon hand-ground on sil-batta with wild mountain garlic, roasted cumin, and fresh herbs.",
    keywords: [
      "salt",
      "namak",
      "pisyu loon",
      "himalayan salt india",
      "pahadi namak",
      "herbal salt",
      "sil batta namak",
      "pink salt",
    ],
  },
  {
    id: "col-sendha-namak-online",
    title: "Sendha Namak Online – Pure Mineral Mountain Rock Salt",
    path: "/sendha-namak-online",
    fullUrl: `${BASE_URL}/sendha-namak-online`,
    type: "category",
    collectionKey: "pahadiSalts",
    categoryLabel: "Herbal Salts",
    badge: "Mineral Rich",
    description:
      "Raw unrefined rock salt rich in 84 natural minerals. Essential for fasting (vrat), salads, fruits, and clean daily seasoning.",
    keywords: [
      "sendha namak online",
      "rock salt",
      "vrat ka namak",
      "mineral salt",
      "lahori namak",
    ],
  },

  // DALS
  {
    id: "col-organic-dal-india",
    title: "Buy Organic Dal Online – Pahadi Pulses Uttarakhand",
    path: "/organic-dal-india",
    fullUrl: `${BASE_URL}/organic-dal-india`,
    type: "category",
    collectionKey: "pahadiDals",
    categoryLabel: "Organic Dals",
    badge: "Chemical-Free",
    description:
      "Authentic mountain dals grown in mineral-rich Himalayan soil: Bhatt Ki Dal (Black Soybean), Gahat (Kulath/Horsegram), and Pahadi Urad.",
    keywords: [
      "dal",
      "dals",
      "pulses",
      "organic dal india",
      "bhatt ki dal",
      "gahat dal",
      "pahadi dal",
      "uttarakhand pulses",
      "kulath",
    ],
  },
  {
    id: "col-pahadi-rajma-online",
    title: "Buy Pahadi Rajma Online – Authentic Munsiyari Kidney Beans",
    path: "/pahadi-rajma-online",
    fullUrl: `${BASE_URL}/pahadi-rajma-online`,
    type: "category",
    collectionKey: "pahadiDals",
    categoryLabel: "Organic Dals",
    badge: "Munsiyari Origin",
    description:
      "World-famous Munsiyari and Joshimath white speckled Pahadi Rajma. Melts like butter when cooked, packed with pure protein.",
    keywords: [
      "rajma",
      "pahadi rajma online",
      "munsiyari rajma",
      "chitra rajma",
      "joshimath rajma",
      "himalayan rajma",
    ],
  },

  // REGIONAL UTTARAKHAND
  {
    id: "col-traditional-kumaoni-food",
    title: "Traditional Kumaoni Food – Authentic Uttarakhand Delicacies",
    path: "/traditional-kumaoni-food",
    fullUrl: `${BASE_URL}/traditional-kumaoni-food`,
    type: "category",
    collectionKey: "all",
    categoryLabel: "Heritage Food",
    badge: "Kumaoni Heritage",
    description:
      "Experience the true culinary culture of the Kumaon hills. Pure ghee, forest honey, traditional pickles, and authentic mountain staples.",
    keywords: [
      "traditional kumaoni food",
      "kumaon food",
      "pahadi food online",
      "uttarakhand food",
      "nainital food products",
    ],
  },
  {
    id: "col-pahadi-products-online",
    title: "Pahadi Products Online – 100% Authentic Uttarakhand Goods",
    path: "/pahadi-products-online",
    fullUrl: `${BASE_URL}/pahadi-products-online`,
    type: "category",
    collectionKey: "all",
    categoryLabel: "All Pahadi Foods",
    badge: "Himalayan",
    description:
      "Browse and order all natural products from the Uttarakhand hills delivered directly to your doorstep anywhere in India.",
    keywords: [
      "pahadi products online",
      "uttarakhand products online",
      "buy pahadi items",
      "organic food from hills",
    ],
  },
  {
    id: "col-uttarakhand-food-products",
    title: "Uttarakhand Food Products – Natural Mountain Harvest",
    path: "/uttarakhand-food-products",
    fullUrl: `${BASE_URL}/uttarakhand-food-products`,
    type: "category",
    collectionKey: "all",
    categoryLabel: "Uttarakhand Harvest",
    badge: "Direct Sourced",
    description:
      "Pure organic foods sourced directly from village clusters in Bhimtal, Almora, Mukteshwar, and Chamoli.",
    keywords: [
      "uttarakhand food products",
      "pahadi grocery",
      "organic food uttarakhand",
      "himalayan organic store",
    ],
  },
];

/**
 * 3. CURATED DEFAULT PRODUCTS (Catalog Fallback)
 * Ensures search works 100% instantly even before Firestore responds
 */
export const DEFAULT_PRODUCTS = [
  {
    id: "prod-a2-badri-ghee-500ml",
    name: "A2 Badri Cow Desi Ghee (Bilona Churned)",
    slug: "a2-badri-cow-desi-ghee-500ml",
    path: "/product/a2-badri-cow-desi-ghee-500ml",
    fullUrl: `${BASE_URL}/product/a2-badri-cow-desi-ghee-500ml`,
    type: "product",
    category: "ghee",
    categoryLabel: "A2 Desi Ghee",
    badge: "Bestseller",
    weight: "500 ml",
    price: 1350,
    originalPrice: 1550,
    banner: "/banners/ghee-1500x500.webp",
    images: ["/banners/ghee-1500x500.webp"],
    description:
      "Authentic hand-churned A2 bilona ghee from indigenous Badri cows grazing on Himalayan medicinal shrubs in Uttarakhand. Golden, aromatic, and rich in natural nutrients.",
    keywords: [
      "ghee",
      "a2 ghee",
      "badri ghee",
      "bilona ghee",
      "cow ghee",
      "desi ghee 500ml",
      "pure desi ghee",
      "danedar ghee",
    ],
  },
  {
    id: "prod-bhimtal-raw-forest-honey-500g",
    name: "Bhimtal Raw Forest Honey (100% Unprocessed)",
    slug: "bhimtal-raw-forest-honey-500g",
    path: "/product/bhimtal-raw-forest-honey-500g",
    fullUrl: `${BASE_URL}/product/bhimtal-raw-forest-honey-500g`,
    type: "product",
    category: "honey",
    categoryLabel: "Raw Honey",
    badge: "Pure Forest",
    weight: "500 g",
    price: 549,
    originalPrice: 650,
    banner: "/banners/honey-1500x500.webp",
    images: ["/banners/honey-1500x500.webp"],
    description:
      "100% raw, unheated, unfiltered multifloral honey hand-collected from wild forest hives in Bhimtal, Nainital. Retains natural propolis, bee pollen, and enzymes.",
    keywords: [
      "honey",
      "raw honey",
      "forest honey",
      "bhimtal honey",
      "wild honey",
      "pure honey 500g",
      "unprocessed honey",
    ],
  },
  {
    id: "prod-pahadi-aam-ka-achar-400g",
    name: "Authentic Pahadi Mango Pickle (Aam Ka Achar)",
    slug: "pahadi-aam-ka-achar-400g",
    path: "/product/pahadi-aam-ka-achar-400g",
    fullUrl: `${BASE_URL}/product/pahadi-aam-ka-achar-400g`,
    type: "product",
    category: "pickle",
    categoryLabel: "Pahadi Achar",
    badge: "Sun-Cured",
    weight: "400 g",
    price: 349,
    originalPrice: 399,
    banner: "/banners/pickle-1500x500.webp",
    images: ["/banners/pickle-1500x500.webp"],
    description:
      "Traditional Kumaoni sun-cured mango pickle made with pure cold-pressed mustard oil, fenugreek, and aromatic mountain spices. Zero artificial preservatives.",
    keywords: [
      "mango pickle",
      "aam achar",
      "pahadi achar",
      "aam ka achar",
      "homemade mango pickle",
      "kumaoni pickle",
    ],
  },
  {
    id: "prod-kumaoni-nimbu-achar-400g",
    name: "Kumaoni Sun-Cured Lemon Pickle (Nimbu Achar)",
    slug: "kumaoni-nimbu-achar-400g",
    path: "/product/kumaoni-nimbu-achar-400g",
    fullUrl: `${BASE_URL}/product/kumaoni-nimbu-achar-400g`,
    type: "product",
    category: "pickle",
    categoryLabel: "Pahadi Achar",
    badge: "Digestive",
    weight: "400 g",
    price: 329,
    originalPrice: 380,
    banner: "/banners/pickle-1500x500.webp",
    images: ["/banners/pickle-1500x500.webp"],
    description:
      "Juicy mountain lemon pieces sun-fermented over 45 days with roasted carom seeds (ajwain), Himalayan rock salt, and spices. Tangy, zesty, and gut-healthy.",
    keywords: [
      "lemon pickle",
      "nimbu achar",
      "nimbu pickle",
      "pahadi nimbu achar",
      "khatta nimbu achar",
      "galgal achar",
    ],
  },
  {
    id: "prod-pahadi-pisyu-loon-herb-salt-200g",
    name: "Pahadi Pisyu Loon – Himalayan Herbal Salt",
    slug: "pahadi-pisyu-loon-herb-salt-200g",
    path: "/product/pahadi-pisyu-loon-herb-salt-200g",
    fullUrl: `${BASE_URL}/product/pahadi-pisyu-loon-herb-salt-200g`,
    type: "product",
    category: "pahadiSalts",
    categoryLabel: "Herbal Salts",
    badge: "Sil-Batta Ground",
    weight: "200 g",
    price: 199,
    originalPrice: 249,
    banner: "/banners/salts-1500x500.webp",
    images: ["/banners/salts-1500x500.webp"],
    description:
      "Traditional Uttarakhand flavored rock salt hand-pounded on a stone sil-batta with mountain garlic leaves, roasted cumin, and red chillies.",
    keywords: [
      "pisyu loon",
      "pahadi namak",
      "herbal salt",
      "flavored salt",
      "sil batta namak",
      "garlic salt",
    ],
  },
  {
    id: "prod-wild-himalayan-timur-pepper-100g",
    name: "Wild Himalayan Timur Pepper (Sichuan Pepper)",
    slug: "wild-himalayan-timur-pepper-100g",
    path: "/product/wild-himalayan-timur-pepper-100g",
    fullUrl: `${BASE_URL}/product/wild-himalayan-timur-pepper-100g`,
    type: "product",
    category: "spices",
    categoryLabel: "Pahadi Spices",
    badge: "Wild Foraged",
    weight: "100 g",
    price: 249,
    originalPrice: 299,
    banner: "/banners/spices-1500x500.webp",
    images: ["/banners/spices-1500x500.webp"],
    description:
      "Rare high-altitude mountain berry with distinct citrusy notes and tongue-tingling spice. Essential for authentic pahadi chutneys and broths.",
    keywords: [
      "timur",
      "timur pepper",
      "sichuan pepper",
      "pahadi timur",
      "timbur",
      "citrus pepper",
    ],
  },
  {
    id: "prod-jakhiya-seeds-uttarakhand-150g",
    name: "Jakhiya Seeds – Uttarakhand Tempering Seeds",
    slug: "jakhiya-seeds-uttarakhand-150g",
    path: "/product/jakhiya-seeds-uttarakhand-150g",
    fullUrl: `${BASE_URL}/product/jakhiya-seeds-uttarakhand-150g`,
    type: "product",
    category: "spices",
    categoryLabel: "Pahadi Spices",
    badge: "Authentic Tadka",
    weight: "150 g",
    price: 179,
    originalPrice: 220,
    banner: "/banners/spices-1500x500.webp",
    images: ["/banners/spices-1500x500.webp"],
    description:
      "The soul of Pahadi cooking! Tiny crunchy seeds that give everyday aloo gutke, curries, and dals their signature nutty crunch and aroma.",
    keywords: [
      "jakhiya",
      "jakhiya seeds",
      "pahadi tadka",
      "wild mustard",
      "cleome viscosa",
      "kumaoni tadka",
    ],
  },
  {
    id: "prod-organic-bhatt-ki-dal-500g",
    name: "Organic Uttarakhand Bhatt Ki Dal (Black Soybean)",
    slug: "organic-bhatt-ki-dal-500g",
    path: "/product/organic-bhatt-ki-dal-500g",
    fullUrl: `${BASE_URL}/product/organic-bhatt-ki-dal-500g`,
    type: "product",
    category: "pahadiDals",
    categoryLabel: "Organic Dals",
    badge: "High Protein",
    weight: "500 g",
    price: 229,
    originalPrice: 280,
    banner: "/banners/dals-1500x500.webp",
    images: ["/banners/dals-1500x500.webp"],
    description:
      "Nutrient-dense black soybean harvested in the hills of Kumaon. Used to prepare the famous winter delicacies 'Bhatt ki Churkani' and 'Jaula'.",
    keywords: [
      "bhatt ki dal",
      "bhatt dal",
      "black soybean",
      "pahadi bhatt",
      "churkani",
      "uttarakhand dal",
    ],
  },
  {
    id: "prod-munsiyari-pahadi-rajma-500g",
    name: "Munsiyari White Pahadi Rajma (Organic Kidney Beans)",
    slug: "munsiyari-pahadi-rajma-500g",
    path: "/product/munsiyari-pahadi-rajma-500g",
    fullUrl: `${BASE_URL}/product/munsiyari-pahadi-rajma-500g`,
    type: "product",
    category: "pahadiDals",
    categoryLabel: "Organic Dals",
    badge: "Munsiyari Origin",
    weight: "500 g",
    price: 299,
    originalPrice: 360,
    banner: "/banners/dals-1500x500.webp",
    images: ["/banners/dals-1500x500.webp"],
    description:
      "Premium white-spotted kidney beans cultivated at 7,200+ ft altitude in Munsiyari, Pithoragarh. Naturally tender, aromatic, and easy to digest.",
    keywords: [
      "munsiyari rajma",
      "pahadi rajma",
      "white rajma",
      "organic rajma",
      "himalayan rajma 500g",
    ],
  },
  {
    id: "prod-pahadi-haldi-powder-250g",
    name: "Pure Pahadi Haldi Powder – High Curcumin Turmeric",
    slug: "pahadi-haldi-powder-250g",
    path: "/product/pahadi-haldi-powder-250g",
    fullUrl: `${BASE_URL}/product/pahadi-haldi-powder-250g`,
    type: "product",
    category: "spices",
    categoryLabel: "Pahadi Spices",
    badge: "High Curcumin",
    weight: "250 g",
    price: 189,
    originalPrice: 240,
    banner: "/banners/spices-1500x500.webp",
    images: ["/banners/spices-1500x500.webp"],
    description:
      "Sun-dried organic mountain turmeric with 6%+ natural curcumin content. Free of lead chromate or starch polishing.",
    keywords: [
      "haldi",
      "turmeric",
      "pahadi haldi",
      "curcumin turmeric",
      "organic haldi powder",
      "lakadong",
    ],
  },
];

/**
 * 4. ALL BLOG ARTICLES INDEX
 */
export const BLOG_ARTICLES = (allBlogs || []).map((blog) => ({
  id: `blog-${blog.slug}`,
  title: blog.title,
  slug: blog.slug,
  path: `/blogs/${blog.slug}`,
  fullUrl: `${BASE_URL}/blogs/${blog.slug}`,
  type: "article",
  category: blog.category || "Heritage",
  categoryLabel: `Blog: ${blog.category || "Heritage"}`,
  badge: blog.trending ? "Trending" : blog.featured ? "Featured" : "Story",
  image: blog.image || "/banners/bestsellers-1500x500.webp",
  description: blog.excerpt || blog.seo_description || "",
  keywords: Array.isArray(blog.tags) ? blog.tags : [],
  readTime: blog.read_time || "5 min read",
  date: blog.date,
}));

/**
 * Normalizes a live Firestore product for search indexing
 */
export const normalizeProductForSearch = (product) => {
  const slug = product.slug || product.id;
  const path = `/product/${slug}`;
  return {
    id: `prod-${product.id}`,
    name: product.name,
    title: product.name,
    slug: slug,
    path: path,
    fullUrl: `${BASE_URL}${path}`,
    type: "product",
    category:
      Array.isArray(product.collectionTypes) && product.collectionTypes[0]
        ? product.collectionTypes[0]
        : "all",
    categoryLabel: "Product",
    badge: product.badge || "Pure Organic",
    weight:
      product.weight ||
      product.netWeight ||
      (Array.isArray(product.sizes) && product.sizes[0]) ||
      null,
    price: Number(product.price || 0),
    originalPrice: Number(product.originalPrice || product.price || 0),
    banner: product.banner || product.images?.[0] || "/banners/bestsellers-1500x500.webp",
    images: Array.isArray(product.images) ? product.images : [],
    description: product.description || "",
    keywords: [
      ...(Array.isArray(product.tags) ? product.tags : []),
      ...(Array.isArray(product.collectionTypes) ? product.collectionTypes : []),
      product.name?.toLowerCase() || "",
    ],
    // keep raw product object for ProductCard compatibility
    rawProduct: product,
  };
};

/**
 * MASTER SEARCH ENGINE:
 * Searches across static pages, SEO collection routes, products, and blog stories.
 * Ranks results by relevance and attaches exact clean destination URLs.
 */
export const searchSiteUrls = (queryText = "", dynamicProducts = []) => {
  const cleanQuery = (queryText || "").trim().toLowerCase();
  if (!cleanQuery) return [];

  const queryTokens = cleanQuery
    .split(/\s+/)
    .filter((token) => token.length > 0);

  // 1. Prepare products list (merge dynamic from Firestore with curated default fallbacks)
  const productEntries = [];
  const seenProductSlugs = new Set();

  if (Array.isArray(dynamicProducts) && dynamicProducts.length > 0) {
    dynamicProducts.forEach((p) => {
      const normalized = normalizeProductForSearch(p);
      if (normalized.slug && !seenProductSlugs.has(normalized.slug)) {
        seenProductSlugs.add(normalized.slug);
        productEntries.push(normalized);
      }
    });
  }

  // Add default products if not already included
  DEFAULT_PRODUCTS.forEach((dp) => {
    if (!seenProductSlugs.has(dp.slug)) {
      seenProductSlugs.add(dp.slug);
      productEntries.push({
        ...dp,
        rawProduct: dp,
      });
    }
  });

  // 2. Combine all master sources
  const allEntities = [
    ...STATIC_PAGES,
    ...SEO_COLLECTIONS,
    ...productEntries,
    ...BLOG_ARTICLES,
  ];

  // 3. Score each entity
  const scoredResults = [];

  for (const item of allEntities) {
    const title = (item.title || item.name || "").toLowerCase();
    const description = (item.description || "").toLowerCase();
    const path = (item.path || "").toLowerCase();
    const fullUrl = (item.fullUrl || "").toLowerCase();
    const keywords = (item.keywords || []).map((k) => String(k).toLowerCase());
    const category = (item.category || "").toLowerCase();

    let score = 0;

    // Exact Title Match
    if (title === cleanQuery) {
      score += 150;
    } else if (title.startsWith(cleanQuery)) {
      score += 100;
    } else if (title.includes(cleanQuery)) {
      score += 70;
    }

    // Exact or partial URL path match
    if (path.includes(cleanQuery) || fullUrl.includes(cleanQuery)) {
      score += 60;
    }

    // Token matching across title, keywords, path, and description
    let matchedTokenCount = 0;
    for (const token of queryTokens) {
      let tokenMatched = false;

      if (title.includes(token)) {
        score += 30;
        tokenMatched = true;
      }
      if (keywords.some((kw) => kw.includes(token))) {
        score += 25;
        tokenMatched = true;
      }
      if (category.includes(token)) {
        score += 20;
        tokenMatched = true;
      }
      if (path.includes(token)) {
        score += 20;
        tokenMatched = true;
      }
      if (description.includes(token)) {
        score += 10;
        tokenMatched = true;
      }

      if (tokenMatched) matchedTokenCount++;
    }

    // Boost if all tokens matched
    if (matchedTokenCount === queryTokens.length) {
      score += 40;
    }

    // Priority boost for Products and Categories
    if (item.type === "product") score += 15;
    if (item.type === "category") score += 12;

    if (score > 0) {
      scoredResults.push({
        ...item,
        score,
      });
    }
  }

  // Sort by score descending
  scoredResults.sort((a, b) => b.score - a.score);

  return scoredResults;
};
