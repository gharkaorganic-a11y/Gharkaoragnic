/* ─────────────────────────────────────
   DATABASE / FALLBACK
───────────────────────────────────── */
// Keeping this as a fallback in case the dynamic fetch fails or is still loading
export const PRODUCTS = [
  {
    id: "p1",
    name: "A2 Bilona Desi Ghee",
    description: "Cultured from pure A2 cow milk using the traditional hand-churned Bilona method.",
    image: "https://res.cloudinary.com/dwgro3zo7/image/upload/w_200,h_200,c_fill,q_auto,f_auto/v1779804926/uttarakhand-desi-ghee_mhth1n_kwdmv9.webp",
    originalPrice: "₹1,599",
    price: "₹1,299",
    discount: "19% OFF",
    tag: "Bestseller 🔥",
    waMessage: "Hi, I want to buy A2 Bilona Desi Ghee at the discounted price of ₹1,299.",
    keywords: ["ghee", "a2", "bilona", "butter", "fat", "cow", "ghe", "ghi", "desi"],
  },
  {
    id: "p2",
    name: "Raw Forest Honey",
    description: "Unprocessed, unheated, and loaded with natural pollen and enzymes straight from the forest.",
    image: "https://res.cloudinary.com/dwgro3zo7/image/upload/w_200,h_200,c_fill,q_auto,f_auto/v1779805346/6b28f8bd-630a-4ad8-99c2-38a0fb306d15.png",
    originalPrice: "₹899",
    price: "₹699",
    discount: "22% OFF",
    tag: "Pure Organic 🌿",
    waMessage: "Hi, I want to buy Raw Forest Honey for ₹699.",
    keywords: ["honey", "raw", "forest", "sweet", "shahad", "hony", "shhad"],
  },
  {
    id: "p3",
    name: "Bhang Ki Chutney",
    description: "Traditional Pahadi style hemp seed chutney. A perfect tangy and nutty side dip.",
    image: "https://res.cloudinary.com/dwgro3zo7/image/upload/w_200,h_200,c_fill,q_auto,f_auto/v1779806954/5fbff796-8d70-4624-931e-f7d36a5ec9a9_leazcc.png",
    originalPrice: "₹299",
    price: "₹249",
    discount: "16% OFF",
    tag: "Local Favorite ⛰️",
    waMessage: "Hi, I want to buy Bhang Ki Chutney for ₹249.",
    keywords: ["bhang", "chutney", "sauce", "dip", "hemp", "chutni", "chatni", "pahadi"],
  },
];

/* ─────────────────────────────────────
   SMART MATCHING & NLP HELPERS
───────────────────────────────────── */

const getRandomResponse = (responsesArray) => {
  return responsesArray[Math.floor(Math.random() * responsesArray.length)];
};

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

/* ─────────────────────────────────────
   CORE EXPORTS
───────────────────────────────────── */

// 🔄 Updated to accept dynamicProducts, defaulting to PRODUCTS if undefined
export const getMatchedProducts = (text, dynamicProducts = PRODUCTS) => {
  const cleanText = text.toLowerCase().replace(/[^\w\s]/gi, '').trim();
  const words = cleanText.split(" ");

  return dynamicProducts.filter((p) => {
    // Check custom keywords if they exist
    if (p.keywords && p.keywords.length > 0) {
      if (p.keywords.some((k) => words.includes(k) || cleanText.includes(k))) {
        return true;
      }
    }
    // Fallback: check name and description for dynamically fetched products
    const nameMatch = (p.name || "").toLowerCase().includes(cleanText);
    const descMatch = (p.description || "").toLowerCase().includes(cleanText);
    
    return nameMatch || descMatch;
  });
};

export const detectIntent = (text) => {
  const lower = text.toLowerCase();

  const intents = {
    GREETING: /\b(hi|hello|hey|namaste|morning|evening|afternoon)\b/,
    TRACK: /\b(track|status|where|dispatch|delivered|order)\b/,
    SHOP: /\b(buy|shop|price|menu|list|products|catalog|discount|offer)\b/,
    SUPPORT: /\b(help|support|agent|human|talk|issue|problem|fake|wrong)\b/,
  };

  if (intents.GREETING.test(lower)) return "GREETING";
  if (intents.TRACK.test(lower)) return "TRACK";
  if (intents.SHOP.test(lower)) return "SHOP";
  if (intents.SUPPORT.test(lower)) return "SUPPORT";

  return "UNKNOWN";
};

// 🔄 Updated to accept dynamicProducts in the arguments object
export const buildBotFlow = ({ type, userName, matchedProducts, rawText, dynamicProducts = PRODUCTS }) => {
  const nameStr = userName ? ` ${userName}` : "";
  const timeGreeting = getTimeBasedGreeting();

  switch (type) {
    case "WELCOME_NEW_USER":
      return [
        {
          text: `Namaste! 🙏 Welcome to **Ghar Ka Organic**.`,
          type: "text",
          delay: 800,
        },
        {
          text: "Before we continue, may I know your good name?",
          type: "text",
          delay: 1500,
        },
      ];

    case "WELCOME_BACK":
      return [
        {
          text: getRandomResponse([
            `${timeGreeting}${nameStr}! 🌿 Great to see you back at Ghar Ka Organic.`,
            `Namaste${nameStr} 🙏 Welcome back to your favorite organic store.`,
          ]),
          type: "text",
          delay: 800,
        },
        {
          text: "Here are our current farm-fresh bestsellers:",
          type: "text",
          delay: 1200,
        },
        {
          text: "",
          type: "products",
          // 🔄 Swapped fallback to dynamicProducts
          data: matchedProducts || dynamicProducts,
          delay: 1500,
        },
      ];

    case "MATCHED_PRODUCTS":
      return [
        {
          text: getRandomResponse([
            "I found exactly what you're looking for! 🍯",
            "Great choice! Here are the details:",
            "We have that in stock right now. Take a look 🏔️:",
          ]),
          type: "text",
          delay: 800,
        },
        {
          text: "",
          type: "products",
          data: matchedProducts,
          delay: 1200,
        },
      ];

    case "SHOP":
      return [
        {
          text: "Let me pull up the organic catalog for you 👇",
          type: "text",
          delay: 800,
        },
        {
          text: "",
          type: "products",
          // 🔄 Swapped to dynamicProducts
          data: dynamicProducts,
          delay: 1200,
        },
      ];

    case "TRACK":
      return [
        {
          text: "I can absolutely help you track your order.",
          type: "text",
          delay: 800,
        },
        {
          text: "I will connect you directly to our fulfillment team on WhatsApp.",
          type: "text",
          delay: 1200,
        },
        {
          text: "",
          type: "action",
          data: {
            label: "Track via WhatsApp",
            waText: "Hi, I want to track my order. My order ID is: ",
          },
          delay: 1500,
        },
      ];

    case "SUPPORT":
      return [
        {
          text: "I understand you need some help.",
          type: "text",
          delay: 800,
        },
        {
          text: "",
          type: "action",
          data: {
            label: "Connect with Agent",
            waText: "Hi team, I need some assistance with Ghar Ka Organic.",
          },
          delay: 1200,
        },
      ];

    case "FALLBACK":
    default:
      return [
        {
          text: getRandomResponse([
            "I'm still learning and didn't quite catch that. 🤔",
            "Oops, my organic brain didn't understand that request.",
          ]),
          type: "text",
          delay: 1000,
        },
        {
          text: "Let me connect you directly to our human team on WhatsApp so they can assist you right away!",
          type: "text",
          delay: 1500,
        },
        {
          text: "",
          type: "action",
          data: {
            label: "Chat with a Human",
            waText: rawText,
          },
          delay: 2000,
        },
      ];
  }
};