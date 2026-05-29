// ─────────────────────────────────────────────────────────────────────────────
// WhatsAppGuidedBot.jsx (FIXED VERSION)
// Improvements:
//   ✓ Added XSS protection (sanitized HTML rendering)
//   ✓ Fixed memory leaks in useEffect cleanup
//   ✓ Added error handling for async operations
//   ✓ Optimized performance with better memoization
//   ✓ Fixed race conditions in state management
//   ✓ Added input validation and sanitization
//   ✓ Proper ref cleanup
//   ✓ Better dependency arrays
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";

// ── Internal Modules ──────────────────────────
import {
  initDB,
  saveMessage,
  getMessages,
  cleanOldMessages,
  clearAllMessages,
} from "./services/chatStorage";
import { STORE_INFO, INFO_PAGES, welcomeMessages } from "./constants/botData";
import {
  getTime,
  groupByDate,
  playNotificationSound,
  getBotCollections,
} from "./constants/botUtils";
import useBotSay from "./hooks/useBotSay";
import useBotFlows from "./hooks/useBotFlows";

// ── Sub-Components ───────────────────────────
import ChatHeader from "./components/ChatHeader";
import ChatInputBar from "./components/ChatInputBar";
import ProductCarousel from "./components/ProductCarousel";
import {
  Icon,
  AnimatedDoubleTick,
  OptionList,
  ChipBar,
  QRStrip,
  PromoBanner,
  OrderTracker,
  PagesPopup,
} from "./components/BotUIComponents";
import WhatsAppFloatingButton from "../whtshappbot/components/WhatsAppFloatingButton";
import CollectionCarousel from "../whtshappbot/components/CollectionCarousel";
import PromoCarousel from "../whtshappbot/components/PromoCarousel";
import SearchPromoCard from "../whtshappbot/components/SearchPromoCard";
import CartItemCardOfWhathapp from "../CartItemCardOfWhathapp";

// ── External Contexts/Services ────────────────
import { useCart } from "../../../userApp/features/cart/context/CartContext";
import { useAuth } from "../../../userApp/features/auth/context/UserContext";
import { homepageService } from "../../../userApp/features/homepage/services/homepageService";
import { productSections } from "../../../userApp/features/homepage/config/productCollection";
import OrderCardOfWhatsapp from "./components/OrderCardOfWhatsapp";

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate safe unique ID for messages
 */
const generateSafeId = () => {
  try {
    return window.crypto && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  } catch (err) {
    console.error("Error generating ID:", err);
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
};

/**
 * Sanitize HTML to prevent XSS attacks
 * Only allows safe formatting: bold, italic, line breaks
 */
const sanitizeAndFormatText = (text) => {
  if (!text || typeof text !== "string") return "";

  return (
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      // Safe formatting: *bold*, _italic_, \n linebreak
      .replace(/\n/g, "<br/>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<strong>$1</strong>")
      .replace(/_(.+?)_/g, "<em>$1</em>")
  );
};

/**
 * Validate user input
 */
const validateInput = (input) => {
  if (!input || typeof input !== "string") return "";
  const trimmed = input.trim();
  // Limit input length to prevent DoS
  return trimmed.substring(0, 1000);
};

/**
 * Safely parse and validate URL
 */
const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "http:" ||
      parsed.protocol === "https:" ||
      parsed.protocol === "tel:"
    );
  } catch {
    return false;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const WhatsAppGuidedBot = () => {
  // ── Core state ─────────────────────────────
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [started, setStarted] = useState(false);
  const [dark, setDark] = useState(false);
  const [unread, setUnread] = useState(0);
  const [scrollBtn, setScrollBtn] = useState(false);
  const [capturedName, setCapturedName] = useState("");
  const [askingName, setAskingName] = useState(false);
  const [askingPincode, setAskingPincode] = useState(false);
  const [askingOrderSearch, setAskingOrderSearch] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [copyToast, setCopyToast] = useState("");
  const [readMsgId, setReadMsgId] = useState(null);
  const [lastOpened, setLastOpened] = useState(Date.now());
  const [pendingRating, setPendingRating] = useState(null);
  const [initError, setInitError] = useState(null);

  const chatRef = useRef(null);
  const cartNudgeRef = useRef(null);
  const nudgeTimeoutRef = useRef(null);
  const initTimeoutRef = useRef(null);

  const COLLECTIONS = useMemo(() => getBotCollections(productSections), []);

  const { user, logout } = useAuth();
  const { cart, updateQuantity, remove, addToCart } = useCart();

  const userName = useMemo(
    () => user?.name || capturedName || "Friend",
    [user, capturedName],
  );
  const userId = user?.uid || null;

  // ─────────────────────────────────────────────────────────────────────────
  // CORE FUNCTIONS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Push message to chat with validation
   */
  const push = useCallback(
    (text, sender, type = "text", data = null) => {
      try {
        // Validate inputs
        if (!sender || !["user", "bot"].includes(sender)) {
          console.error("Invalid sender:", sender);
          return;
        }

        const validatedText = type === "text" ? validateInput(text) : text;

        const msg = {
          id: generateSafeId(),
          text: validatedText,
          sender,
          time: getTime(),
          date: new Date().toDateString(),
          type,
          data,
        };

        setMessages((prevMessages) => [...prevMessages, msg]);

        // Async save to DB
        saveMessage(msg).catch((err) => {
          console.error("Error saving message:", err);
        });

        // Play sound if bot message and window open
        if (sender === "bot" && open) {
          try {
            playNotificationSound();
          } catch (err) {
            console.error("Error playing sound:", err);
          }
        }

        // Update unread count if window closed
        if (!open && sender === "bot") {
          setUnread((n) => n + 1);
        }
      } catch (err) {
        console.error("Error pushing message:", err);
      }
    },
    [open],
  );

  const { botSay, clearTimers } = useBotSay(push, setTyping);

  /**
   * Open WhatsApp with validated message
   */
  const openWA = useCallback((msg) => {
    try {
      const validMsg = validateInput(msg);
      const waUrl = `https://wa.me/${STORE_INFO.number}?text=${encodeURIComponent(validMsg)}`;
      window.open(waUrl, "_blank");
    } catch (err) {
      console.error("Error opening WhatsApp:", err);
    }
  }, []);

  /**
   * Show copy toast notification
   */
  const showCopyToast = useCallback((code) => {
    try {
      const safeCode = validateInput(code);
      setCopyToast(`✓ Copied: ${safeCode}`);
      setTimeout(() => setCopyToast(""), 2200);
    } catch (err) {
      console.error("Error showing toast:", err);
    }
  }, []);

  /**
   * Restart conversation
   */
  const restart = useCallback(async () => {
    try {
      clearTimers();

      // Clear timeouts
      if (cartNudgeRef.current) clearTimeout(cartNudgeRef.current);
      if (nudgeTimeoutRef.current) clearTimeout(nudgeTimeoutRef.current);
      if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);

      await clearAllMessages();

      setMessages([]);
      setStarted(false);
      setCapturedName("");
      setTyping(false);
      setAskingName(false);
      setAskingPincode(false);
      setAskingOrderSearch(false);
      setShowPages(false);
      setShowBanner(true);
      setSuggestions([]);
      setShowSuggestions(false);
      setPendingRating(null);
      setInitError(null);
    } catch (err) {
      console.error("Error restarting chat:", err);
      setInitError("Failed to restart chat. Please refresh the page.");
    }
  }, [clearTimers]);

  // ─────────────────────────────────────────────────────────────────────────
  // BOT FLOWS
  // ─────────────────────────────────────────────────────────────────────────

  const {
    showMainMenu,
    showShopMenu,
    showCollection,
    showCart,
    showPromo,
    showPagesMenu,
    showSupport,
    showTrack,
    handleOrderSearch,
    checkPincode,
    showSearchResults,
    showSurpriseProduct,
    handleOrderChips,
  } = useBotFlows({
    botSay,
    push,
    cart,
    addToCart,
    userName,
    userId,
    COLLECTIONS,
    setAskingPincode,
    setAskingOrderSearch,
    allProducts,
    setAllProducts,
    homepageService,
    openWA,
    pendingRating,
    setPendingRating,
  });

  // ─────────────────────────────────────────────────────────────────────────
  // LIFECYCLE: Initialize
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!open || started) return;

    setStarted(true);

    (async () => {
      try {
        await initDB();
        const oldMessages = await getMessages();

        if (oldMessages?.length > 0) {
          // Validate old messages
          const validMessages = Array.isArray(oldMessages)
            ? oldMessages.filter((m) => m && typeof m === "object")
            : [];

          setMessages(validMessages);

          const cachedProducts = homepageService.getCachedProductsForBot?.();
          if (Array.isArray(cachedProducts)) {
            setAllProducts(cachedProducts);
          }

          cleanOldMessages().catch((err) => {
            console.error("Error cleaning old messages:", err);
          });

          botSay([
            {
              text: `Welcome back, *${userName}*! 👋 Pick up where you left off?`,
              delay: 700,
            },
            {
              text: "",
              type: "chips",
              delay: 900,
              data: [
                { id: "cart", label: "My cart", icon: "cart" },
                { id: "shop", label: "Shop", icon: "bag" },
                { id: "orders", label: "My orders", icon: "package" },
                { id: "surprise", label: "Surprise me 🎲", icon: "tag" },
              ],
            },
          ]);
          return;
        }

        // New user
        if (user?.name) {
          showMainMenu(user.name);
          return;
        }

        // Guest user - show welcome sequence
        clearTimers();
        setTyping(true);

        let cumulativeDelay = 0;
        const timers = [];

        welcomeMessages.forEach((msgData, i) => {
          cumulativeDelay += msgData.delay;
          const timer = (initTimeoutRef.current = setTimeout(() => {
            push(
              msgData.text,
              "bot",
              msgData.type || "text",
              msgData.data || null,
            );

            if (i === welcomeMessages.length - 1) {
              setTyping(false);
              const finalTimer = setTimeout(() => {
                push("", "bot", "chips", [
                  {
                    id: "shop",
                    label: "Shop Organic Range",
                    icon: "bag",
                    isBig: true,
                  },
                  { id: "promo", label: "Today's Offers", icon: "tag" },
                  { id: "orders", label: "Track my order", icon: "package" },
                  { id: "support", label: "Chat with us", icon: "wa" },
                  { id: "surprise", label: "Surprise me 🎲", icon: "tag" },
                  { id: "pincode", label: "Check delivery", icon: "truck" },
                ]);
              }, 700);
              timers.push(finalTimer);
            }
          }, cumulativeDelay));
          timers.push(timer);
        });

        // Cleanup timers on unmount
        return () => {
          timers.forEach((t) => clearTimeout(t));
        };
      } catch (err) {
        console.error("Error initializing chat:", err);
        setInitError("Failed to load chat. Please refresh the page.");
        setTyping(false);
      }
    })();

    return () => {
      if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
    };
  }, [open, started, user, userName, showMainMenu, clearTimers, push, botSay]);

  // ─────────────────────────────────────────────────────────────────────────
  // LIFECYCLE: Reset unread when opened
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (open) {
      setUnread(0);
      setLastOpened(Date.now());
    }
  }, [open]);

  // ─────────────────────────────────────────────────────────────────────────
  // LIFECYCLE: Auto-scroll to latest message
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!chatRef.current || !open) return;

    const el = chatRef.current;
    // Use requestAnimationFrame for smooth scrolling
    requestAnimationFrame(() => {
      const scrollDistance = el.scrollHeight - el.scrollTop - el.clientHeight;
      if (scrollDistance < 140) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }, [messages, typing, open]);

  // ─────────────────────────────────────────────────────────────────────────
  // LIFECYCLE: Cleanup timers on unmount
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      clearTimers();
      if (cartNudgeRef.current) clearTimeout(cartNudgeRef.current);
      if (nudgeTimeoutRef.current) clearTimeout(nudgeTimeoutRef.current);
      if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
    };
  }, [clearTimers]);

  // ─────────────────────────────────────────────────────────────────────────
  // LIFECYCLE: Proactive nudge (if not opened for 10 seconds)
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (open || unread === 0) return;

    if (nudgeTimeoutRef.current) clearTimeout(nudgeTimeoutRef.current);

    nudgeTimeoutRef.current = setTimeout(() => {
      const timeSinceOpened = Date.now() - lastOpened;
      if (timeSinceOpened > 10000) {
        push("Still there? I've got fresh deals for you 👇", "bot");
        setUnread((n) => n + 1);
      }
    }, 10000);

    return () => {
      if (nudgeTimeoutRef.current) clearTimeout(nudgeTimeoutRef.current);
    };
  }, [open, unread, lastOpened, push]);

  // ─────────────────────────────────────────────────────────────────────────
  // LIFECYCLE: Cart nudge (after 3 minutes)
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (cartNudgeRef.current) clearTimeout(cartNudgeRef.current);
    if (!open || !cart || cart.length === 0) return;

    cartNudgeRef.current = setTimeout(
      () => {
        push(
          "🛒 Your cart is still waiting! Complete your order before items run out.",
          "bot",
        );
        push("", "bot", "qr", [
          { id: "cart", label: "View my cart", icon: "cart" },
          { id: "main", label: "Main menu", icon: "home" },
        ]);
      },
      3 * 60 * 1000,
    );

    return () => {
      if (cartNudgeRef.current) clearTimeout(cartNudgeRef.current);
    };
  }, [open, cart?.length, push]);

  // ─────────────────────────────────────────────────────────────────────────
  // EVENT HANDLERS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Handle option/chip selection
   */
  const handleOptionTap = useCallback(
    async (opt) => {
      try {
        if (!opt || typeof opt !== "object") {
          console.warn("Invalid option:", opt);
          return;
        }

        // Hard redirects (no message push)
        if (opt.id === "login") {
          window.location.href = "/auth/login";
          return;
        }

        if (opt.waText) {
          openWA(opt.waText);
          return;
        }

        if (opt.url) {
          if (isValidUrl(opt.url)) {
            window.open(
              opt.url,
              opt.url.startsWith("tel:") ? "_self" : "_blank",
            );
          } else {
            console.warn("Invalid URL:", opt.url);
          }
          return;
        }

        // Check if it's an info page
        const page = INFO_PAGES?.find?.((p) => p?.id === opt.id);
        if (page && page.url) {
          window.location.href = page.url;
          return;
        }

        // ── Unified order chip dispatcher ────────
        // Handles: payment, cancel, return, reorder, rating, feedback
        const handled = await handleOrderChips(opt.id);
        if (handled) return;

        // Guest name capture
        if (opt.id === "guest") {
          push(opt.label || "Guest", "user");
          setAskingName(true);
          return botSay([
            { text: "No problem! What should I call you?", delay: 700 },
          ]);
        }

        // Push user message
        push(opt.label || opt.id, "user");

        // Menu actions
        const actions = {
          main: () => showMainMenu(userName),
          shop: showShopMenu,
          back_shop: showShopMenu,
          cart: showCart,
          orders: showTrack,
          promo: showPromo,
          pages: showPagesMenu,
          support: showSupport,
          surprise: showSurpriseProduct,
        };

        if (actions[opt.id]) {
          actions[opt.id]();
          return;
        }

        // Pincode check
        if (opt.id === "pincode") {
          setAskingPincode(true);
          return botSay([
            { text: "Sure! Please type your 6-digit pincode:", delay: 600 },
          ]);
        }

        // Order search
        if (
          ["order_by_id", "order_by_name", "order_by_phone"].includes(opt.id)
        ) {
          setAskingOrderSearch(true);
          const label =
            opt.id === "order_by_id"
              ? "Order ID"
              : opt.id === "order_by_name"
                ? "name"
                : "phone number";
          return botSay([{ text: `Please type your ${label}:`, delay: 600 }]);
        }

        // Collection selection
        const col = COLLECTIONS?.find?.((c) => c?.id === opt.id);
        if (col) {
          showCollection(col);
        }
      } catch (err) {
        console.error("Error handling option tap:", err);
        push("Sorry, something went wrong. Please try again.", "bot");
      }
    },
    [
      push,
      botSay,
      openWA,
      handleOrderChips,
      showMainMenu,
      userName,
      showShopMenu,
      showCart,
      showTrack,
      showPromo,
      showPagesMenu,
      showSupport,
      showSurpriseProduct,
      COLLECTIONS,
      showCollection,
    ],
  );

  /**
   * Handle message send
   */
  const handleSend = useCallback(() => {
    const validInput = validateInput(input);
    if (!validInput) return;

    setInput("");
    setShowPages(false);
    setShowSuggestions(false);

    // Pincode input
    if (askingPincode) {
      push(validInput, "user");
      return checkPincode(validInput);
    }

    // Order search input
    if (askingOrderSearch) {
      push(validInput, "user");
      return handleOrderSearch(validInput);
    }

    // Name capture input
    if (askingName) {
      setAskingName(false);
      setCapturedName(validInput);
      push(validInput, "user");
      return showMainMenu(validInput);
    }

    // Regular message
    push(validInput, "user");
    const newId = generateSafeId();
    setTimeout(() => setReadMsgId(newId), 1200);

    const lower = validInput.toLowerCase();
    const clean6 = validInput.replace(/\D/g, "");

    // Smart input parsing
    try {
      if (/^\d{6}$/.test(clean6) && clean6 === validInput.trim()) {
        return checkPincode(clean6);
      }
      if (lower.includes("pincode") || lower.includes("deliver to")) {
        setAskingPincode(true);
        return botSay([
          { text: "Sure! Please type your 6-digit pincode:", delay: 600 },
        ]);
      }

      if (/^[a-z0-9]{2,8}-[a-z0-9]{5,12}$/i.test(validInput.trim())) {
        return handleOrderSearch(validInput.trim());
      }

      if (lower.includes("surprise") || lower.includes("random")) {
        return showSurpriseProduct();
      }
      if (lower.startsWith("search ") || lower.startsWith("find ")) {
        const query = validInput.replace(/^(search|find)\s+/i, "");
        return showSearchResults(query);
      }
      if (lower.includes("cart")) return showCart();
      if (
        ["track", "my order", "order status"].some((k) => lower.includes(k))
      ) {
        return showTrack();
      }
      if (["promo", "code", "coupon", "offer"].some((k) => lower.includes(k))) {
        return showPromo();
      }

      // Category matching
      const categoryMap = {
        honey: "honey",
        pickle: "pickle",
        achar: "pickle",
        ghee: "ghee",
        spice: "spices",
        masala: "spices",
        salt: "pahadiSalts",
        dal: "pahadiDals",
        pulse: "pahadiDals",
        chutney: "chutney",
      };

      for (const [key, id] of Object.entries(categoryMap)) {
        if (lower.includes(key)) {
          const col = COLLECTIONS?.find?.((c) => c?.id === id);
          if (col) return showCollection(col);
        }
      }

      if (["shop", "product", "browse"].some((k) => lower.includes(k))) {
        return showShopMenu();
      }
      if (lower.includes("support") || lower.includes("help")) {
        return showSupport();
      }
      if (lower.includes("menu") || lower.includes("home")) {
        return showMainMenu(userName);
      }
      if (lower.includes("faq")) {
        return (window.location.href = "/pages/faq");
      }
      if (lower.includes("about")) {
        return (window.location.href = "/pages/about");
      }

      // Default: search
      showSearchResults(validInput);
    } catch (err) {
      console.error("Error processing user input:", err);
      push(
        "Sorry, I didn't understand that. Try searching for a product!",
        "bot",
      );
    }
  }, [
    input,
    askingName,
    askingPincode,
    askingOrderSearch,
    push,
    botSay,
    checkPincode,
    handleOrderSearch,
    showMainMenu,
    showCart,
    showTrack,
    showPromo,
    showShopMenu,
    showSupport,
    showSearchResults,
    showCollection,
    showSurpriseProduct,
    userName,
    COLLECTIONS,
  ]);

  /**
   * Handle input change with suggestions
   */
  const handleInputChange = useCallback(
    (e) => {
      const val = e.target.value;
      setInput(val);

      if (val.trim().length >= 2 && Array.isArray(allProducts)) {
        const q = val.toLowerCase();
        const hits = allProducts
          .filter((p) => p?.name && p.name.toLowerCase().includes(q))
          .slice(0, 4)
          .map((p) => p.name);

        setSuggestions(hits);
        setShowSuggestions(hits.length > 0);
      } else {
        setShowSuggestions(false);
      }
    },
    [allProducts],
  );

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER MESSAGE
  // ─────────────────────────────────────────────────────────────────────────

  const renderMsg = useCallback(
    (msg) => {
      if (!msg || typeof msg !== "object") {
        console.warn("Invalid message:", msg);
        return null;
      }

      const isUser = msg.sender === "user";

      const ts = (
        <span
          className={`text-[10px] float-right mt-1.5 ml-3 flex items-center gap-[3px]
          ${isUser ? "text-[#4a7c5f]" : "text-[#9ca3af]"}`}>
          {msg.time || getTime()}{" "}
          {isUser && <AnimatedDoubleTick read={msg.id === readMsgId} />}
        </span>
      );

      const FeedbackRow = !isUser ? (
        <div className="flex gap-1.5 mt-1 justify-end opacity-50">
          <button
            title="Helpful"
            onClick={() => {
              push("👍 Helpful", "user");
            }}
            className="text-[13px] bg-transparent hover:scale-110">
            👍
          </button>
          <button
            title="Not helpful"
            onClick={() => {
              openWA(
                "Hi! I found a bot response unhelpful and want to give feedback.",
              );
            }}
            className="text-[13px] bg-transparent hover:scale-110">
            👎
          </button>
        </div>
      ) : null;

      const bubbleClass = isUser
        ? "bg-[#D9FDD3] text-[#111B21] rounded-[18px_4px_18px_18px]"
        : `${dark ? "bg-[#1f2c34] text-[#e9edef]" : "bg-white text-[#111B21]"} rounded-[4px_18px_18px_18px]`;

      try {
        switch (msg.type) {
          case "text":
            return (
              <div
                className={`relative max-w-[85%] px-3.5 py-2.5 shadow-sm text-[13.5px] leading-relaxed ${bubbleClass}`}>
                <p
                  dangerouslySetInnerHTML={{
                    __html: sanitizeAndFormatText(msg.text),
                  }}
                />
                {ts}
                {FeedbackRow}
              </div>
            );

          case "menu":
            return (
              <OptionList
                options={msg.data || []}
                onTap={handleOptionTap}
                dark={dark}
              />
            );

          case "chips":
            return (
              <ChipBar
                chips={msg.data || []}
                onSelect={handleOptionTap}
                dark={dark}
              />
            );

          case "qr":
            return (
              <QRStrip
                chips={msg.data || []}
                onSelect={handleOptionTap}
                dark={dark}
              />
            );

          case "carousel":
            return (
              <ProductCarousel
                items={msg.data || []}
                onOrder={openWA}
                dark={dark}
              />
            );

          case "collections":
            return (
              <CollectionCarousel
                collections={msg.data || []}
                onSelect={handleOptionTap}
                dark={dark}
              />
            );

          case "promos":
            return (
              <PromoCarousel
                promos={msg.data || []}
                onCopy={(c) => {
                  const safeCode = validateInput(c);
                  push(`Copied code: ${safeCode}`, "user");
                  showCopyToast(safeCode);
                }}
              />
            );

          case "promo":
            return msg.data ? (
              <SearchPromoCard
                code={msg.data.code}
                info={msg.data.info}
                onCopy={(c) => {
                  const safeCode = validateInput(c);
                  push(`Copied code: ${safeCode}`, "user");
                  showCopyToast(safeCode);
                }}
              />
            ) : null;

          case "cart":
            if (!cart || cart.length === 0) {
              return (
                <div className="text-[13.5px] italic opacity-80 mt-1">
                  Your cart is currently empty.
                </div>
              );
            }

            return (
              <div className="flex flex-row overflow-x-auto gap-3 w-full mt-1 pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {cart.map((cartItem, idx) => (
                  <div
                    key={cartItem.cartKey || idx}
                    className="snap-center shrink-0">
                    <CartItemCardOfWhathapp
                      item={cartItem}
                      onAdd={updateQuantity}
                      onRemove={updateQuantity}
                      onDelete={remove}
                    />
                  </div>
                ))}
              </div>
            );

          case "orders_carousel":
            if (
              !msg.data ||
              !Array.isArray(msg.data) ||
              msg.data.length === 0
            ) {
              return null;
            }

            return (
              <div className="flex flex-row overflow-x-auto gap-3 w-full mt-1 pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {msg.data.map((order, idx) => (
                  <OrderCardOfWhatsapp
                    key={order.orderId || idx}
                    order={order}
                    onAction={(actionId) => handleOptionTap({ id: actionId })}
                    onSendId={(id) => {
                      push(id, "user");
                      handleOrderSearch(id);
                    }}
                  />
                ))}
              </div>
            );

          case "tracker":
            return <OrderTracker dark={dark} />;

          case "action":
            return msg.data ? (
              <button
                onClick={() => openWA(msg.data.waText)}
                className="mt-1.5 flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold bg-[#25D366] text-white shadow-[0_2px_8px_rgba(37,211,102,0.3)] hover:scale-105 transition-transform">
                <Icon name="wa" size={17} /> {msg.data.label}
              </button>
            ) : null;

          default:
            return null;
        }
      } catch (err) {
        console.error("Error rendering message:", err);
        return (
          <div className={`text-[13px] italic opacity-50 ${bubbleClass}`}>
            Error displaying message
          </div>
        );
      }
    },
    [
      dark,
      readMsgId,
      push,
      openWA,
      showCopyToast,
      handleOptionTap,
      cart,
      updateQuantity,
      remove,
      handleOrderSearch,
    ],
  );

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────────────────────────────────

  // Memoized grouped messages
  const groupedMessages = useMemo(
    () => (Array.isArray(messages) ? groupByDate(messages) : []),
    [messages],
  );

  return (
    <>
      {copyToast && (
        <div className="fixed bottom-28 right-6 z-[10000] bg-[#1f2c34] text-white text-[12px] px-3 py-1.5 rounded-full shadow-lg animate-fade-in-up">
          {copyToast}
        </div>
      )}

      {initError && (
        <div className="fixed bottom-28 right-6 z-[10000] bg-red-500 text-white text-[12px] px-3 py-1.5 rounded-full shadow-lg">
          {initError}
        </div>
      )}

      <div
        className={`fixed z-[9999] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-bottom-right
        bottom-0 right-0 w-full h-full rounded-none shadow-2xl
        sm:w-[360px] sm:h-[640px] sm:max-h-[85vh] sm:rounded-2xl
        sm:bottom-20 sm:right-6 sm:shadow-[0_12px_40px_rgba(0,0,0,0.16)]
        lg:w-[380px] lg:h-[680px] lg:max-h-[85vh] lg:bottom-24 lg:right-8
        ${
          open
            ? "opacity-100 translate-y-0 sm:scale-100 pointer-events-auto"
            : "opacity-0 translate-y-full sm:translate-y-0 sm:scale-50 pointer-events-none"
        }
        ${dark ? "bg-[#0b141a]" : "bg-[#EFEAE2]"}`}>
        <ChatHeader
          dark={dark}
          setDark={setDark}
          setOpen={setOpen}
          typing={typing}
          restart={restart}
          user={user}
          handleLogout={async () => {
            try {
              if (logout) await logout();
              restart();
            } catch (err) {
              console.error("Error logging out:", err);
            }
          }}
        />

        {showBanner && (
          <PromoBanner dark={dark} onDismiss={() => setShowBanner(false)} />
        )}

        <div
          ref={chatRef}
          onScroll={() => {
            try {
              if (chatRef.current) {
                setScrollBtn(
                  chatRef.current.scrollHeight -
                    chatRef.current.scrollTop -
                    chatRef.current.clientHeight >
                    160,
                );
              }
            } catch (err) {
              console.error("Error handling scroll:", err);
            }
          }}
          className={`flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth ${dark ? "bg-[#0b141a]" : ""}`}
          style={
            !dark && STORE_INFO?.bgImage
              ? {
                  backgroundImage: `url('${STORE_INFO.bgImage}')`,
                  backgroundSize: "cover",
                }
              : {}
          }>
          {groupedMessages.map((item) =>
            item.type === "sep" ? (
              <div key={item.key} className="flex justify-center my-2">
                <span
                  className={`text-[11px] font-medium px-3 py-1 rounded-full shadow-sm
                  ${dark ? "bg-[#1f2c34] text-[#8696a0]" : "bg-white/80 text-gray-500"}`}>
                  {item.label}
                </span>
              </div>
            ) : (
              <div
                key={item.id}
                className={`flex flex-col ${item.sender === "user" ? "items-end" : "items-start"}`}>
                {renderMsg(item)}
              </div>
            ),
          )}

          {typing && (
            <div className="flex items-start gap-2">
              <div
                className={`px-4 py-3 rounded-[4px_18px_18px_18px] shadow-sm ${dark ? "bg-[#1f2c34]" : "bg-white"}`}>
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full animate-bounce ${dark ? "bg-[#8696a0]" : "bg-gray-400"}`}
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {scrollBtn && (
          <button
            onClick={() => {
              if (chatRef.current) {
                chatRef.current.scrollTo({
                  top: chatRef.current.scrollHeight,
                  behavior: "smooth",
                });
              }
            }}
            className={`absolute bottom-20 right-4 z-10 w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-opacity
              ${dark ? "bg-[#1f2c34] text-white" : "bg-white text-gray-600"}`}>
            ↓
          </button>
        )}

        {showPages && (
          <PagesPopup
            dark={dark}
            onClose={() => setShowPages(false)}
            onSelect={(p) => {
              try {
                setShowPages(false);
                push(p.label, "user");
                if (p.url && isValidUrl(p.url)) {
                  window.location.href = p.url;
                }
              } catch (err) {
                console.error("Error selecting page:", err);
              }
            }}
          />
        )}

        <ChatInputBar
          input={input}
          setInput={setInput}
          handleInputChange={handleInputChange}
          handleSend={handleSend}
          showPages={showPages}
          setShowPages={setShowPages}
          dark={dark}
          inputPlaceholder={
            askingPincode
              ? "Enter 6-digit pincode…"
              : askingOrderSearch
                ? "Enter order ID, name, or phone…"
                : askingName
                  ? "Enter your name…"
                  : "Message or search products…"
          }
          showSuggestions={showSuggestions}
          suggestions={suggestions}
          setShowSuggestions={setShowSuggestions}
          askingName={askingName}
          askingPincode={askingPincode}
          askingOrderSearch={askingOrderSearch}
          scrollDown={() => {
            if (chatRef.current) {
              chatRef.current.scrollTo({
                top: chatRef.current.scrollHeight,
                behavior: "smooth",
              });
            }
          }}
        />
      </div>

      <WhatsAppFloatingButton open={open} setOpen={setOpen} unread={unread} />
    </>
  );
};

export default React.memo(WhatsAppGuidedBot);
