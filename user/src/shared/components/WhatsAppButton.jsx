import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  MoonIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { DarkCtx, useDark } from "./context/DarkCtx";
import {
  initDB,
  saveMessage,
  getMessages,
  cleanOldMessages,
  clearAllMessages,
} from "../../lib/chatStorage";
import { useCart } from "../../userApp/features/cart/context/CartContext";
import {
  getMatchedProducts,
  detectIntent,
  buildBotFlow,
} from "../../lib/botEngine";
import { useAuth } from "../../userApp/features/auth/context/UserContext";
import CartItemCardOfWhathapp from "./CartItemCardOfWhathapp";

import { homepageService } from "../../userApp/features/homepage/services/homepageService";
import {
  CHAT_STEPS,
  GLOBAL_OPTIONS,
  PROMO_CODES,
  QUICK_REPLIES,
  STORE_INFO,
  SUGGESTION_MAP,
  welcomeMessages,
} from "../../lib/BotData";
import { PagesMenu } from "./PagesMenu";
import BotProductCard from "./BotProductCard";
import PromoCard from "./whtshappbot/PromoCard";
import QuickReplies from "./whtshappbot/QuickReplies";
import RedirectCard from "./whtshappbot/RedirectCard";
import { DoubleTick } from "./whtshappbot/ResubleComponents";
import WhatsAppFloatingButton from "./WhatsAppFloatingButton";

/* ─── HELPERS ─── */
const formatDateLabel = (dateStr) => {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const groupMessagesByDate = (msgs) => {
  const groups = [];
  let lastDate = null;
  msgs.forEach((msg) => {
    const dateKey = msg.date || new Date().toDateString();
    if (dateKey !== lastDate) {
      groups.push({
        type: "separator",
        label: formatDateLabel(dateKey),
        key: `sep-${dateKey}`,
      });
      lastDate = dateKey;
    }
    groups.push(msg);
  });
  return groups;
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const WhatsAppGuidedBot = () => {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const [dark, setDark] = useState(false);
  const [unread, setUnread] = useState(0);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [lastSuggestKey, setLastSuggestKey] = useState("default");
  const unreadMessagesCount = 3;
  const [chatStep, setChatStep] = useState(CHAT_STEPS.INIT);
  const [capturedData, setCapturedData] = useState({ name: "", phone: "" });

  const chatRef = useRef(null);
  const timeoutsRef = useRef([]);

  const { user, logout } = useAuth();
  const { cart, updateQuantity, remove } = useCart();

  // 1. SINGLE SOURCE OF TRUTH: Local State for products
  const [ALL_DYNAMIC_PRODUCTS, setAllDynamicProducts] = useState([]);

  // 2. Load from cache ONCE when component mounts
  useEffect(() => {
    const cachedData = homepageService.getCachedProductsForBot();
    setAllDynamicProducts(cachedData);
  }, []);

  const activeUserName = useMemo(
    () => user?.name || capturedData.name || "Friend",
    [user, capturedData],
  );

  const getCurrentTime = useCallback(
    () =>
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    [],
  );

  const addMessage = useCallback(
    (text, sender, type = "text", data = null) => {
      const msg = {
        id: crypto.randomUUID(),
        text,
        sender,
        time: getCurrentTime(),
        date: new Date().toDateString(),
        type,
        data,
      };
      setMessages((prev) => [...prev, msg]);
      saveMessage(msg);
      if (!open && sender === "bot") setUnread((n) => n + 1);
    },
    [getCurrentTime, open],
  );

  const clearBotTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const simulateBotResponse = useCallback(
    (responses = [], suggestionKey = "default") => {
      clearBotTimeouts();
      setIsTyping(true);
      setLastSuggestKey(suggestionKey);
      let delay = 0;

      responses.forEach((r, i) => {
        delay += r.delay || 1200;
        const t = setTimeout(() => {
          addMessage(r.text, "bot", r.type, r.data);
          if (i === responses.length - 1) {
            setIsTyping(false);
            const suggestions =
              SUGGESTION_MAP[suggestionKey] || SUGGESTION_MAP.default;
            const chips = QUICK_REPLIES[suggestionKey] || QUICK_REPLIES.default;
            const t2 = setTimeout(() => {
              addMessage("", "bot", "redirect", suggestions);
            }, 500);
            const t3 = setTimeout(() => {
              addMessage("", "bot", "quickreplies", chips);
            }, 700);
            timeoutsRef.current.push(t2, t3);
          }
        }, delay);
        timeoutsRef.current.push(t);
      });
    },
    [addMessage, clearBotTimeouts],
  );

  const RESPONSE_MAP = {
    CART: () => handleCartFlow(),

    PROMO: () => {
      const entries = Object.entries(PROMO_CODES);
      return simulateBotResponse(
        [
          {
            text: "🎁 Active promo codes:",
            type: "text",
            delay: 500,
          },
          ...entries.map(([code, info]) => ({
            text: "",
            type: "promo",
            delay: 700,
            data: { code, info },
          })),
        ],
        "default",
      );
    },

    TRACK: () => {
      simulateBotResponse(
        [
          { text: "📦 Tracking system ready", type: "text", delay: 600 },
          {
            text: "",
            type: "action",
            delay: 800,
            data: {
              label: "Track Order",
              waText: "Hi, I want to track my order ID: ",
            },
          },
        ],
        "track",
      );
    },

    PRODUCT_MATCH: (matched) => {
      simulateBotResponse(
        [
          { text: "🌿 Found matching products", type: "text", delay: 600 },
          { text: "", type: "products", data: matched, delay: 900 },
        ],
        "product",
      );
    },

    SHOP: () => {
      simulateBotResponse(
        [
          { text: "🛍️ Best organic products", type: "text", delay: 600 },
          {
            text: "",
            type: "products",
            data: ALL_DYNAMIC_PRODUCTS,
            delay: 900,
          },
        ],
        "shop",
      );
    },

    FALLBACK: () => {
      simulateBotResponse(
        [
          {
            text: "Sorry, I didn’t understand that. Try browsing products 👇",
            type: "text",
            delay: 600,
          },
          {
            text: "",
            type: "options",
            delay: 800,
            data: GLOBAL_OPTIONS,
          },
        ],
        "default",
      );
    },
  };
  const openWhatsApp = useCallback((msg) => {
    window.open(
      `https://wa.me/${STORE_INFO.number}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  }, []);

  useEffect(() => {
    if (!open || hasStarted) return;
    setHasStarted(true);
    const load = async () => {
      await initDB();
      const old = await getMessages();
      cleanOldMessages();
      if (old && old.length > 0) {
        setMessages(old);
        setChatStep(CHAT_STEPS.FREE_CHAT);
        return;
      }
      if (user?.name) {
        setChatStep(CHAT_STEPS.FREE_CHAT);
        triggerMainMenu(user.name);
        return;
      }
      setChatStep(CHAT_STEPS.ASK_AUTH);
      clearBotTimeouts();
      setIsTyping(true);
      const welcome = welcomeMessages;
      let cum = 0;
      welcome.forEach((r, i) => {
        cum += r.delay;
        const t = setTimeout(() => {
          addMessage(r.text, "bot", r.type, r.data);
          if (i === welcome.length - 1) setIsTyping(false);
        }, cum);
        timeoutsRef.current.push(t);
      });
    };
    load();
  }, [open, hasStarted, user]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  useEffect(() => {
    if (!chatRef.current || !open) return;
    const el = chatRef.current;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (isNearBottom) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, open]);

  const handleScroll = useCallback(() => {
    if (!chatRef.current) return;
    const el = chatRef.current;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 150);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (chatRef.current)
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
  }, []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);
  const triggerMainMenu = useCallback(
    (name) => {
      simulateBotResponse(
        [
          {
            text: `Great to have you here, *${name}*! 😊 How can I help you today?`,
            type: "text",
            delay: 800,
          },
          {
            text: "Pick an option or just type your question:",
            type: "options",
            delay: 1000,
            data: GLOBAL_OPTIONS,
          },
        ],
        "default",
      );
    },
    [simulateBotResponse],
  );

  const handleRestartChat = useCallback(async () => {
    clearBotTimeouts();
    await clearAllMessages();
    setMessages([]);
    setHasStarted(false);
    setChatStep(CHAT_STEPS.INIT);
    setCapturedData({ name: "", phone: "" });
    setIsTyping(false);
  }, [clearBotTimeouts]);

  const handleLogout = useCallback(async () => {
    if (logout) await logout();
    await handleRestartChat();
  }, [logout, handleRestartChat]);

  const handleCartFlow = useCallback(() => {
    if (cart.length === 0) {
      simulateBotResponse(
        [
          {
            text: "Your cart is empty 🛒\nBrowse our organic products and add something!",
            type: "text",
            delay: 700,
          },
          {
            text: "",
            type: "options",
            delay: 1000,
            data: [{ label: "🛍️ Browse Products", action: "shop" }],
          },
        ],
        "cart",
      );
      return;
    }
    simulateBotResponse(
      [
        {
          text: `You have **${cart.length} item${cart.length > 1 ? "s" : ""}** in your cart 🛒`,
          type: "text",
          delay: 700,
        },
        { text: "", type: "cart", delay: 1000, data: cart },
        {
          text: "",
          type: "action",
          delay: 400,
          data: {
            label: "✅ Checkout on WhatsApp",
            waText: `Hi! I want to checkout. Items: ${cart.map((i) => `${i.name || i.id} x${i.selectedQuantity}`).join(", ")}`,
          },
        },
      ],
      "cart",
    );
  }, [cart, simulateBotResponse]);

  const handleQuickReply = useCallback(
    (chip) => {
      addMessage(chip, "user");
      const lower = chip.toLowerCase();

      if (
        lower.includes("promo") ||
        lower.includes("coupon") ||
        lower.includes("discount")
      ) {
        const entries = Object.entries(PROMO_CODES);
        simulateBotResponse(
          [
            {
              text: "🎁 Here are your exclusive promo codes! Use them at checkout:",
              type: "text",
              delay: 700,
            },
            ...entries.map(([code, info], idx) => ({
              text: "",
              type: "promo",
              delay: 900 + idx * 400,
              data: { code, info },
            })),
          ],
          "default",
        );
        return;
      }

      if (lower.includes("honey")) {
        simulateBotResponse(
          [
            {
              text: "🍯 Pure organic honey, straight from the hive!",
              type: "text",
              delay: 600,
            },
            {
              text: "",
              type: "redirect_banner",
              delay: 800,
              data: { url: "/honey", label: "🍯 View Honey Collection →" },
            },
          ],
          "shop",
        );
        return;
      }

      if (lower.includes("cart")) {
        handleCartFlow();
        return;
      }

      if (lower.includes("track")) {
        simulateBotResponse(
          [
            {
              text: "Let me connect you for tracking 📦",
              type: "text",
              delay: 600,
            },
            {
              text: "",
              type: "action",
              delay: 900,
              data: {
                label: "📦 Track on WhatsApp",
                waText: "Hi, I want to track my order. My order ID is: ",
              },
            },
          ],
          "track",
        );
        return;
      }

      if (
        lower.includes("product") ||
        lower.includes("bestseller") ||
        lower.includes("sale")
      ) {
        simulateBotResponse(
          [
            {
              text: "Here are our top organic picks 🌿",
              type: "text",
              delay: 700,
            },
            {
              text: "",
              type: "products",
              data: ALL_DYNAMIC_PRODUCTS,
              delay: 1000,
            },
          ],
          "shop",
        );
        return;
      }

      const matched = getMatchedProducts(chip, ALL_DYNAMIC_PRODUCTS);
      const intent = detectIntent(chip);
      let flowType = "FALLBACK",
        suggestKey = "default";

      if (matched.length > 0) {
        flowType = "MATCHED_PRODUCTS";
        suggestKey = "product";
      } else if (intent === "TRACK") {
        flowType = "TRACK";
        suggestKey = "track";
      } else if (intent === "SHOP") {
        flowType = "SHOP";
        suggestKey = "shop";
      }

      simulateBotResponse(
        buildBotFlow({
          type: flowType,
          userName: activeUserName,
          matchedProducts: matched,
          rawText: chip,
          dynamicProducts: ALL_DYNAMIC_PRODUCTS,
        }),
        suggestKey,
      );
    },
    [
      addMessage,
      simulateBotResponse,
      handleCartFlow,
      activeUserName,
      ALL_DYNAMIC_PRODUCTS,
    ],
  );

  const handleOptionClick = useCallback(
    (option) => {
      addMessage(option.label, "user");
      setShowPages(false);
      switch (option.action) {
        case "login":
          window.location.href = "/auth/login";
          return;
        case "guest":
          setChatStep(CHAT_STEPS.ASK_NAME);
          simulateBotResponse(
            [
              {
                text: "No problem! What should I call you? 😊",
                type: "text",
                delay: 700,
              },
            ],
            "default",
          );
          return;
        case "shop":
          setChatStep(CHAT_STEPS.FREE_CHAT);
          simulateBotResponse(
            [
              {
                text: "Here are our farm-fresh organic bestsellers 🌿",
                type: "text",
                delay: 700,
              },
              {
                text: "",
                type: "products",
                data: ALL_DYNAMIC_PRODUCTS,
                delay: 1000,
              },
            ],
            "shop",
          );
          return;
        case "cart":
          handleCartFlow();
          return;
        case "track":
          simulateBotResponse(
            [
              {
                text: "I'll connect you with our tracking team! 📦",
                type: "text",
                delay: 700,
              },
              {
                text: "",
                type: "action",
                delay: 1000,
                data: {
                  label: "📦 Track on WhatsApp",
                  waText: "Hi, I want to track my order. My order ID is: ",
                },
              },
            ],
            "track",
          );
          return;
        case "support":
          simulateBotResponse(
            [
              {
                text: "Sure! Connecting you with our support team 💬",
                type: "text",
                delay: 700,
              },
              {
                text: "",
                type: "action",
                delay: 1000,
                data: {
                  label: "💬 Chat on WhatsApp",
                  waText: "Hi, I need help with my order.",
                },
              },
            ],
            "support",
          );
          return;
        default:
          return;
      }
    },
    [addMessage, simulateBotResponse, handleCartFlow, ALL_DYNAMIC_PRODUCTS],
  );

  const handleUserText = useCallback(() => {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    addMessage(text, "user");
    setInputText("");
    setShowPages(false);

    if (chatStep === CHAT_STEPS.ASK_NAME) {
      setCapturedData((prev) => ({ ...prev, name: text }));
      setChatStep(CHAT_STEPS.FREE_CHAT);
      triggerMainMenu(text);
      return;
    }

    const lower = text.toLowerCase();
    if (lower.includes("contact")) {
      window.location.href = "/pages/contact";
      return;
    }
    if (lower.includes("faq")) {
      window.location.href = "/pages/faq";
      return;
    }
    if (lower.includes("about")) {
      window.location.href = "/pages/about";
      return;
    }

    if (
      lower.includes("promo") ||
      lower.includes("coupon") ||
      lower.includes("discount")
    ) {
      const entries = Object.entries(PROMO_CODES);
      simulateBotResponse(
        [
          {
            text: "🎁 Here are your exclusive promo codes! Apply at checkout:",
            type: "text",
            delay: 600,
          },
          ...entries.map(([code, info], idx) => ({
            text: "",
            type: "promo",
            delay: 900 + idx * 400,
            data: { code, info },
          })),
        ],
        "default",
      );
      return;
    }

    if (lower.includes("honey")) {
      simulateBotResponse(
        [
          {
            text: "🍯 We have a beautiful range of pure organic honey!",
            type: "text",
            delay: 600,
          },
          {
            text: "",
            type: "redirect_banner",
            delay: 800,
            data: { url: "/honey", label: "🍯 View Honey Collection →" },
          },
        ],
        "shop",
      );
      return;
    }

    if (lower.includes("cart") || lower.includes("show cart")) {
      handleCartFlow();
      return;
    }

    const matchedProducts = getMatchedProducts(text, ALL_DYNAMIC_PRODUCTS);
    const detectedIntent = detectIntent(text);
    let flowType = "FALLBACK",
      suggestKey = "default";

    if (matchedProducts.length > 0) {
      flowType = "MATCHED_PRODUCTS";
      suggestKey = "product";
    } else if (detectedIntent === "TRACK") {
      flowType = "TRACK";
      suggestKey = "track";
    } else if (detectedIntent === "SHOP") {
      flowType = "SHOP";
      suggestKey = "shop";
    }

    simulateBotResponse(
      buildBotFlow({
        type: flowType,
        userName: activeUserName,
        matchedProducts,
        rawText: text,
        dynamicProducts: ALL_DYNAMIC_PRODUCTS,
      }),
      suggestKey,
    );
  }, [
    inputText,
    addMessage,
    chatStep,
    triggerMainMenu,
    handleCartFlow,
    activeUserName,
    simulateBotResponse,
    ALL_DYNAMIC_PRODUCTS,
  ]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") handleUserText();
    },
    [handleUserText],
  );

  const grouped = useMemo(() => groupMessagesByDate(messages), [messages]);

  const widgetBg = dark ? "#0b141a" : "#EFEAE2";
  const headerBg = "#008069";
  const feedStyle = dark
    ? { background: "linear-gradient(180deg,#0b141a 0%,#0b141a 100%)" }
    : {
        backgroundImage: `url('${STORE_INFO.bgImage}')`,
        backgroundSize: "cover",
      };
  const inputBarBg = dark ? "#1f2c34" : "#F0F2F5";
  const inputBg = dark ? "#2a3942" : "#ffffff";
  const inputText_ = dark ? "#e9edef" : "#111B21";

  return (
    <DarkCtx.Provider value={dark}>
      <div
        className={`fixed z-[9999] flex flex-col shadow-2xl transition-all duration-300
          bottom-0 right-0 w-full h-full rounded-none
          sm:bottom-24 sm:right-6 sm:w-[400px] sm:h-[650px] sm:max-h-[85vh] sm:rounded-2xl sm:origin-bottom-right
          ${open ? "opacity-100 translate-y-0 sm:scale-100 pointer-events-auto" : "opacity-0 translate-y-full sm:translate-y-0 sm:scale-50 pointer-events-none"}`}
        style={{ background: widgetBg }}>
        <div
          className="px-4 py-3 flex items-center justify-between sm:rounded-t-2xl shadow-md z-10"
          style={{ background: headerBg }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(false)}
              className="sm:hidden text-white p-1 -ml-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="relative">
              <img
                src={STORE_INFO.logo}
                alt="Logo"
                className="w-10 h-10 rounded-full border border-white/30 object-cover bg-white"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#008069] rounded-full" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-[16px] leading-tight tracking-wide">
                {STORE_INFO.name}
              </h3>
              <p className="text-[12px] text-green-100 leading-tight">
                {isTyping ? (
                  <span className="flex items-center gap-1">
                    <span className="animate-pulse">Typing</span>
                    <span className="flex gap-0.5">
                      {[0, 150, 300].map((d) => (
                        <span
                          key={d}
                          className="w-1 h-1 bg-green-200 rounded-full animate-bounce"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
                    </span>
                  </span>
                ) : (
                  "Typically replies instantly"
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setDark((v) => !v)}
              className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
              title="Toggle dark mode">
              {dark ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleRestartChat}
              className="text-[11px] text-white/70 hover:text-white font-medium transition px-1">
              Restart
            </button>
            {user?.name && (
              <button
                onClick={handleLogout}
                className="text-[11px] text-white/70 hover:text-white font-medium transition">
                Logout
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="hidden sm:flex text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={chatRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth relative"
          style={feedStyle}>
          {grouped.map((item) => {
            if (item.type === "separator")
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-center my-2">
                  <span
                    className={`text-[11px] font-medium px-3 py-1 rounded-full shadow-sm ${dark ? "bg-[#1f2c34] text-[#8696a0]" : "bg-white/80 text-gray-500"}`}>
                    {item.label}
                  </span>
                </div>
              );

            const msg = item;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                {msg.type === "text" && (
                  <div
                    className={`relative max-w-[85%] px-3.5 py-2.5 shadow-sm text-[14px] leading-relaxed
                    ${
                      msg.sender === "user"
                        ? "bg-[#D9FDD3] text-[#111B21] rounded-tl-2xl rounded-bl-2xl rounded-tr-sm rounded-br-2xl"
                        : dark
                          ? "bg-[#1f2c34] text-[#e9edef] rounded-tr-2xl rounded-br-2xl rounded-tl-sm rounded-bl-2xl"
                          : "bg-white text-[#111B21] rounded-tr-2xl rounded-br-2xl rounded-tl-sm rounded-bl-2xl"
                    }`}>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: msg.text
                          .replace(/\n/g, "<br/>")
                          .replace(
                            /\*\*(.*?)\*\*/g,
                            "<strong class='font-semibold'>$1</strong>",
                          )
                          .replace(
                            /\*(.*?)\*/g,
                            "<strong class='font-semibold'>$1</strong>",
                          ),
                      }}
                    />
                    <span
                      className={`text-[10px] float-right mt-1.5 ml-3 flex items-center gap-1 ${msg.sender === "user" ? "text-green-700" : "text-gray-400"}`}>
                      {msg.time}
                      {msg.sender === "user" && <DoubleTick />}
                    </span>
                  </div>
                )}

                {msg.type === "options" && (
                  <div className="flex flex-wrap gap-2 mt-1 w-full max-w-[92%]">
                    {msg.text && (
                      <div
                        className={`px-3.5 py-2.5 rounded-tr-2xl rounded-br-2xl rounded-tl-sm rounded-bl-2xl shadow-sm text-[14px] w-full ${dark ? "bg-[#1f2c34] text-[#e9edef]" : "bg-white text-[#111B21]"}`}>
                        {msg.text}
                      </div>
                    )}
                    {msg.data.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(opt)}
                        className="bg-white text-[#008069] border border-[#008069]/50 font-semibold py-1.5 px-4 rounded-full text-[12.5px] shadow-sm hover:bg-[#008069] hover:text-white active:scale-95 transition-all">
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {msg.type === "quickreplies" && Array.isArray(msg.data) && (
                  <QuickReplies chips={msg.data} onSelect={handleQuickReply} />
                )}

                {msg.type === "redirect" && Array.isArray(msg.data) && (
                  <RedirectCard suggestions={msg.data} />
                )}

                {msg.type === "redirect_banner" && (
                  <a
                    href={msg.data.url}
                    className="mt-1 inline-flex items-center gap-2 bg-[#008069] text-white px-5 py-2.5 rounded-full text-[13px] font-semibold shadow hover:bg-[#016855] active:scale-95 transition-all">
                    {msg.data.label}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                )}

                {msg.type === "promo" && msg.data && (
                  <PromoCard
                    code={msg.data.code}
                    info={msg.data.info}
                    onCopy={(c) => addMessage(`Copied code: ${c}`, "user")}
                  />
                )}

                {msg.type === "cart" && (
                  <div className="space-y-2.5 w-full max-w-[95%]">
                    {cart.length === 0 ? (
                      <div
                        className={`rounded-2xl p-5 text-center shadow-sm ${dark ? "bg-[#1f2c34]" : "bg-white"}`}>
                        <p className="text-3xl mb-2">🛒</p>
                        <p
                          className={`text-[13px] font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>
                          Your cart is empty
                        </p>
                      </div>
                    ) : (
                      <>
                        {cart.map((item) => (
                          <CartItemCardOfWhathapp
                            key={item.cartKey}
                            item={item}
                            onAdd={(k, q) => updateQuantity(k, q)}
                            onRemove={(k, q) => updateQuantity(k, q)}
                            onDelete={(k) => remove(k)}
                          />
                        ))}
                        {(() => {
                          const total = cart.reduce(
                            (s, i) =>
                              s +
                              (typeof i.price === "number" ? i.price : 0) *
                                (i.selectedQuantity || 1),
                            0,
                          );
                          const count = cart.reduce(
                            (s, i) => s + (i.selectedQuantity || 1),
                            0,
                          );
                          return total > 0 ? (
                            <div className="bg-[#008069] rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
                              <span className="text-[12px] text-white/80 font-medium">
                                {count} item{count > 1 ? "s" : ""} · cart total
                              </span>
                              <span className="text-[15px] font-bold text-white">
                                ₹{total.toLocaleString("en-IN")}
                              </span>
                            </div>
                          ) : null;
                        })()}
                      </>
                    )}
                  </div>
                )}

                {msg.type === "products" &&
                  Array.isArray(msg.data) &&
                  msg.data.length > 0 && (
                    <div className="w-full max-w-[95%] space-y-3">
                      <div
                        className={`backdrop-blur-sm rounded-2xl px-3 py-2 shadow-sm text-[12px] text-[#008069] font-semibold border border-[#008069]/10 ${dark ? "bg-[#1f2c34]/80" : "bg-white/80"}`}>
                        🌿 {msg.data.length} product
                        {msg.data.length > 1 ? "s" : ""} available —{" "}
                        <a
                          href="/all-products"
                          className="underline underline-offset-2 font-bold">
                          See all →
                        </a>
                      </div>
                      {msg.data.map((item) => (
                        <BotProductCard
                          key={item.id || item.slug || item.name}
                          item={item}
                          onOrder={openWhatsApp}
                        />
                      ))}
                    </div>
                  )}

                {msg.type === "action" && (
                  <button
                    onClick={() => openWhatsApp(msg.data.waText)}
                    className="mt-1.5 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-[13.5px] font-semibold shadow-md hover:bg-[#1ebe5d] active:scale-95 transition-all flex items-center gap-2">
                    <svg
                      className="w-4 h-4 fill-white flex-shrink-0"
                      viewBox="0 0 32 32">
                      <path d="M19.11 17.59c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.4-1.65-1.56-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.83-2.01-.22-.53-.44-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.28-.96.94-.96 2.29 0 1.35.98 2.65 1.12 2.83.14.18 1.93 2.94 4.67 4.12.65.28 1.15.45 1.54.58.65.21 1.24.18 1.7.11.52-.08 1.65-.67 1.88-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.2-.53-.34z" />
                      <path d="M16.001 3C8.82 3 3 8.82 3 16c0 2.82.93 5.42 2.5 7.52L3 29l5.63-1.47A12.93 12.93 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.5c-2.22 0-4.29-.66-6.03-1.79l-.43-.27-3.34.87.89-3.25-.28-.44A10.46 10.46 0 0 1 5.5 16c0-5.8 4.7-10.5 10.5-10.5S26.5 10.2 26.5 16 21.8 26.5 16 26.5z" />
                    </svg>
                    {msg.data.label}
                  </button>
                )}

                {msg.type === "pages" && (
                  <div className="space-y-2 w-full max-w-[95%]">
                    {msg.data.map((page) => (
                      <a
                        key={page.id}
                        href={page.url}
                        className={`block p-3.5 rounded-2xl border shadow-sm hover:border-[#008069] hover:shadow-md transition-all ${dark ? "bg-[#1f2c34] border-[#2a3942]" : "bg-white border-gray-100"}`}>
                        <h4 className="font-semibold text-[13px] text-[#008069]">
                          {page.title}
                        </h4>
                        {page.suggestion && (
                          <p className="text-[11.5px] text-gray-500 mt-0.5">
                            {page.suggestion}
                          </p>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div
              className={`rounded-tr-2xl rounded-br-2xl rounded-tl-sm p-3 w-16 shadow-sm flex items-center justify-center gap-1.5 h-10 ${dark ? "bg-[#1f2c34]" : "bg-white"}`}>
              {[0, 150, 300].map((d) => (
                <div
                  key={d}
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </div>
          )}
        </div>

        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-20 right-4 z-20 w-9 h-9 rounded-full bg-[#008069] text-white shadow-lg flex items-center justify-center hover:bg-[#016855] active:scale-95 transition-all">
            <ChevronUpDownIcon className="w-5 h-5" />
          </button>
        )}

        <div
          className="px-3 py-2.5 flex items-center gap-2 border-t relative"
          style={{
            background: inputBarBg,
            borderColor: dark ? "#2a3942" : "#e5e7eb",
          }}>
          {showPages && <PagesMenu onClose={() => setShowPages(false)} />}

          <button
            onClick={() => setShowPages((v) => !v)}
            title="Browse Pages"
            className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all shadow-sm
              ${showPages ? "bg-[#008069] text-white rotate-45" : dark ? "bg-[#2a3942] text-[#008069] border border-[#008069]/40 hover:bg-[#008069] hover:text-white" : "bg-white text-[#008069] border border-[#008069]/40 hover:bg-[#008069] hover:text-white"}`}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

          <div
            className="flex-1 rounded-full flex items-center shadow-sm border overflow-hidden"
            style={{
              background: inputBg,
              borderColor: dark ? "#3a4a54" : "#e5e7eb",
            }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message or ask anything…"
              style={{ color: inputText_, caretColor: "#008069" }}
              className="w-full px-4 py-2.5 text-[14px] bg-transparent outline-none placeholder-gray-400"
            />
          </div>

          <button
            onClick={handleUserText}
            disabled={!inputText.trim()}
            className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-all
              ${inputText.trim() ? "bg-[#008069] text-white hover:bg-[#016855] active:scale-95 shadow-sm" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
            <svg
              className="w-5 h-5 ml-0.5"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>

      <WhatsAppFloatingButton
        open={open}
        setOpen={setOpen}
        unread={unreadMessagesCount}
      />
    </DarkCtx.Provider>
  );
};

export default React.memo(WhatsAppGuidedBot);
