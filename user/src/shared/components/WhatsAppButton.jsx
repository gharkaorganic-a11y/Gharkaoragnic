import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { DarkCtx } from "./context/DarkCtx";

// 1. Services
import {
  fetchAndStorePincode,
  fetchOrderForBot,
} from "./whtshappbot/services/botOrderServices";
import {
  initDB,
  saveMessage,
  getMessages,
  cleanOldMessages,
  clearAllMessages,
} from "./whtshappbot/services/chatStorage";
import { homepageService } from "../../userApp/features/homepage/services/homepageService";

// 2. Contexts / App Hooks
import { useCart } from "../../userApp/features/cart/context/CartContext";
import { useAuth } from "../../userApp/features/auth/context/UserContext";

// 3. Constants & Helpers
import {
  MAIN_MENU,
  INFO_PAGES,
  POST_SHOP_QR,
  STORE_INFO,
  PROMO_CODES,
  welcomeMessages,
  getFestival,
  BUNDLE_MAP,
} from "./whtshappbot/config/botConstants";
import {
  getTime,
  fmtDate,
  groupByDate,
  humanDelay,
  playNotificationSound,
  getEstimatedDelivery,
} from "./whtshappbot/utills/botHelpers";
import { productSections } from "../../userApp/features/homepage/config/productCollection";

// 4. UI Components
import {
  IconTile,
  OptionList,
  ChipBar,
  QRStrip,
  PromoBanner,
  AnimatedDoubleTick,
  OrderTracker,
  PagesPopup,
} from "./whtshappbot/components/BotUIComponents";
import { Icon } from "./whtshappbot/components/ResubleComponents";
import WhatsAppFloatingButton from "./whtshappbot/components/WhatsAppFloatingButton";
import CollectionCarousel from "./whtshappbot/components/CollectionCarousel";
import PromoCarousel from "./whtshappbot/components/PromoCarousel";
import SearchPromoCard from "./whtshappbot/components/SearchPromoCard";
import BotProductCard from "./whtshappbot/components/BotProductCard";
import CartItemCardOfWhathapp from "./CartItemCardOfWhathapp";

// Temporary helper until moved to botConstants
const getBotCollections = (sections = []) =>
  sections
    .filter((s) => s.key !== "all" && s.key !== "new")
    .map((s) => ({
      id: s.key,
      label: s.title,
      image: s.chipImage,
      desc: s.subtitle,
      badge: s.badge,
    }));

const WhatsAppGuidedBot = () => {
  /* ── Core State ── */
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [started, setStarted] = useState(false);
  const [dark, setDark] = useState(false);
  const [unread, setUnread] = useState(0);
  const [scrollBtn, setScrollBtn] = useState(false);

  /* ── Flow & Feature States ── */
  const [askingPincode, setAskingPincode] = useState(false);
  const [askingOrderTrack, setAskingOrderTrack] = useState(false);
  const [capturedName, setCapturedName] = useState("");
  const [askingName, setAskingName] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [showBanner, setShowBanner] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [copyToast, setCopyToast] = useState("");
  const [readMsgId, setReadMsgId] = useState(null);

  const chatRef = useRef(null);
  const timers = useRef([]);
  const cartNudgeRef = useRef(null);
  const COLLECTIONS = useMemo(() => getBotCollections(productSections), []);

  const { user, logout } = useAuth();
  const { cart, updateQuantity, remove } = useCart();
  const userName = useMemo(
    () => user?.name || capturedName || "Friend",
    [user, capturedName],
  );

  /* ─────────────────────────────────────────────
     CORE PUSH / BOTSAY
  ───────────────────────────────────────────── */
  const push = useCallback(
    (text, sender, type = "text", data = null) => {
      const msg = {
        id: crypto.randomUUID(),
        text,
        sender,
        time: getTime(),
        date: new Date().toDateString(),
        type,
        data,
      };
      setMessages((p) => [...p, msg]);
      saveMessage(msg);

      if (sender === "bot" && open) playNotificationSound();
      if (!open && sender === "bot") setUnread((prev) => prev + 1);
    },
    [open],
  );

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const botSay = useCallback(
    (responses) => {
      clearTimers();
      setTyping(true);
      let delay = 0;
      responses.forEach((r, i) => {
        const wordCount = (r.text || "").split(" ").length;
        const baseDelay = r.delay ?? 900;
        const finalDelay = r.text
          ? humanDelay(Math.min(baseDelay + wordCount * 40, 1800))
          : baseDelay;
        delay += finalDelay;
        const t = setTimeout(() => {
          push(r.text ?? "", "bot", r.type ?? "text", r.data ?? null);
          if (i === responses.length - 1) setTyping(false);
        }, delay);
        timers.current.push(t);
      });
    },
    [push, clearTimers],
  );

  const openWA = useCallback((msg) => {
    window.open(
      `https://wa.me/${STORE_INFO.number}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  }, []);

  const showCopyToast = useCallback((code) => {
    setCopyToast(`✓ Copied: ${code}`);
    setTimeout(() => setCopyToast(""), 2200);
  }, []);

  /* ─────────────────────────────────────────────
     FLOW HELPERS (NEW SERVICES INTEGRATED)
  ───────────────────────────────────────────── */
  const checkPincode = useCallback(
    async (pincode) => {
      setAskingPincode(false);
      const clean = pincode.replace(/\D/g, "").slice(0, 6);

      if (clean.length !== 6) {
        botSay([{ text: "Please enter a valid 6-digit pincode.", delay: 500 }]);
        return;
      }

      push("Checking delivery availability...", "bot");
      const result = await fetchAndStorePincode(clean);

      if (result.valid) {
        botSay([
          {
            text: `✅ Great news! We deliver to **${result.district}, ${result.state}** (${clean}) in 3–5 business days.`,
            delay: 600,
          },
          {
            text: "",
            type: "qr",
            delay: 600,
            data: [{ id: "shop", label: "Shop now", icon: "bag" }],
          },
        ]);
      } else {
        botSay([
          {
            text: `Sorry, we don't deliver to ${clean} right now. We are expanding fast!`,
            delay: 600,
          },
        ]);
      }
    },
    [botSay, push],
  );

  const trackOrderFlow = useCallback(
    async (searchTerm) => {
      setAskingOrderTrack(false);
      botSay([{ text: "Checking our systems for your order...", delay: 500 }]);

      const foundOrders = await fetchOrderForBot(searchTerm, user?.uid);

      if (foundOrders.length === 0) {
        botSay([
          {
            text: `I couldn't find any orders matching "${searchTerm}". Please verify the Order ID or phone number.`,
            delay: 800,
          },
          {
            text: "",
            type: "qr",
            delay: 400,
            data: [{ id: "support", label: "Talk to support", icon: "wa" }],
          },
        ]);
        return;
      }

      const order = foundOrders[0];
      botSay([
        {
          text: `Here is the status for order **${order.orderId}**:`,
          delay: 600,
        },
        { text: "", type: "tracker", delay: 800, data: order },
        {
          text: "",
          type: "qr",
          delay: 1000,
          data: [{ id: "main", label: "Main menu", icon: "home" }],
        },
      ]);
    },
    [botSay, user],
  );

  const showMainMenu = useCallback(
    (name) => {
      const festival = getFestival();
      const responses = [
        { text: `Hello *${name}*! How can I help you today?`, delay: 700 },
        { text: "", type: "menu", delay: 900, data: MAIN_MENU },
      ];
      if (festival) {
        responses.push({
          text: "",
          type: "chips",
          delay: 400,
          data: [
            {
              id: "promo",
              label: `${festival.emoji} ${festival.name} Offers`,
              icon: "tag",
              isBig: true,
            },
          ],
        });
      }
      botSay(responses);
    },
    [botSay],
  );

  const showShopMenu = useCallback(() => {
    botSay([
      { text: "What are you looking for today?", delay: 600 },
      { text: "", type: "collections", delay: 800, data: COLLECTIONS },
    ]);
  }, [botSay, COLLECTIONS]);

  const showSurpriseProduct = useCallback(() => {
    if (!allProducts.length) {
      botSay([
        {
          text: "Let me fetch something special for you! Browse a category first.",
          delay: 600,
        },
      ]);
      return;
    }
    const pick = allProducts[Math.floor(Math.random() * allProducts.length)];
    botSay([
      { text: "🎲 Here's a surprise pick just for you!", delay: 600 },
      { text: "", type: "carousel", delay: 800, data: [pick] },
      {
        text: "",
        type: "qr",
        delay: 500,
        data: [
          { id: "surprise", label: "Another one!", icon: "refresh" },
          ...POST_SHOP_QR,
        ],
      },
    ]);
  }, [allProducts, botSay]);

  /* ─────────────────────────────────────────────
     USER INTERACTION HANDLERS
  ───────────────────────────────────────────── */
  const handleOptionTap = useCallback(
    (opt) => {
      if (opt.waText) return openWA(opt.waText);
      if (opt.url)
        return window.open(
          opt.url,
          opt.url.startsWith("tel:") ? "_self" : "_blank",
        );

      push(opt.label, "user");

      switch (opt.id) {
        case "main":
          return showMainMenu(userName);
        case "shop":
          return showShopMenu();
        case "orders":
          setAskingOrderTrack(true);
          return botSay([
            {
              text: "Happy to help! Please reply with your **Order ID**, **Name**, or **Phone Number**.",
              delay: 600,
            },
          ]);
        case "pincode":
          setAskingPincode(true);
          return botSay([
            { text: "Sure! Please type your 6-digit pincode:", delay: 600 },
          ]);
        case "surprise":
          return showSurpriseProduct();
        case "guest":
          setAskingName(true);
          return botSay([
            { text: "No problem! What should I call you?", delay: 700 },
          ]);
        default:
          // Handle specific collections/pages (simplified for brevity)
          break;
      }
    },
    [
      userName,
      push,
      openWA,
      showMainMenu,
      showShopMenu,
      showSurpriseProduct,
      botSay,
    ],
  );

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setShowPages(false);
    setShowSuggestions(false);

    push(text, "user");
    setTimeout(() => setReadMsgId(crypto.randomUUID()), 1200);

    if (askingPincode) return checkPincode(text);
    if (askingOrderTrack) return trackOrderFlow(text);
    if (askingName) {
      setAskingName(false);
      setCapturedName(text);
      return showMainMenu(text);
    }

    const lower = text.toLowerCase();
    if (lower.includes("pincode") || lower.includes("deliver")) {
      setAskingPincode(true);
      return botSay([
        { text: "Sure! Please type your 6-digit pincode:", delay: 600 },
      ]);
    }
    if (lower.includes("track") || lower.includes("order status")) {
      setAskingOrderTrack(true);
      return botSay([
        {
          text: "Happy to help! Please reply with your **Order ID**, **Name**, or **Phone Number**.",
          delay: 600,
        },
      ]);
    }
    if (lower.includes("shop") || lower.includes("buy")) return showShopMenu();
    if (lower.includes("menu")) return showMainMenu(userName);

    // Fallback: trigger search logic (placeholder)
    botSay([
      {
        text: `Let me find "${text}" for you... (Search Logic Here)`,
        delay: 600,
      },
    ]);
  }, [
    input,
    askingPincode,
    askingOrderTrack,
    askingName,
    userName,
    checkPincode,
    trackOrderFlow,
    push,
    botSay,
    showMainMenu,
    showShopMenu,
  ]);

  /* ─────────────────────────────────────────────
     LIFECYCLE & AUTO-SCROLL
  ───────────────────────────────────────────── */
  useEffect(() => {
    if (!open || started) return;
    setStarted(true);
    (async () => {
      await initDB();
      const old = await getMessages();
      cleanOldMessages();

      if (old?.length) {
        setMessages(old);
        setAllProducts(homepageService.getCachedProductsForBot());
        botSay([
          { text: `Welcome back, *${userName}*! 👋`, delay: 700 },
          { text: "", type: "menu", delay: 900, data: MAIN_MENU },
        ]);
        return;
      }
      if (user?.name) return showMainMenu(user.name);

      botSay([
        ...welcomeMessages,
        {
          text: "",
          type: "chips",
          delay: 700,
          data: [
            {
              id: "shop",
              label: "Shop Organic Range",
              icon: "bag",
              isBig: true,
            },
            { id: "pincode", label: "Check delivery", icon: "truck" },
            { id: "orders", label: "Track Order", icon: "package" },
          ],
        },
      ]);
    })();
  }, [open, started, user, userName, showMainMenu, botSay]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  useEffect(() => {
    if (!chatRef.current || !open) return;
    const el = chatRef.current;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 140)
      el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  const scrollDown = useCallback(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  const onScroll = useCallback(() => {
    if (!chatRef.current) return;
    const el = chatRef.current;
    setScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 160);
  }, []);

  /* ─────────────────────────────────────────────
     RENDER UI
  ───────────────────────────────────────────── */
  const grouped = useMemo(() => groupByDate(messages), [messages]);
  const bg = dark ? "#0b141a" : "#EFEAE2";
  const barBg = dark ? "#1f2c34" : "#F0F2F5";
  const inpBg = dark ? "#2a3942" : "#ffffff";
  const inpClr = dark ? "#e9edef" : "#111B21";

  const renderMsg = (msg) => {
    const isUser = msg.sender === "user";
    const ts = (
      <span
        className={`text-[10px] float-right mt-1.5 ml-3 flex items-center gap-1 ${isUser ? "text-green-700" : "text-gray-400"}`}>
        {msg.time}
        {isUser && <AnimatedDoubleTick read={msg.id === readMsgId} />}
      </span>
    );

    switch (msg.type) {
      case "text":
        return (
          <div
            className={`relative max-w-[85%] px-3.5 py-2.5 shadow-sm text-[13.5px] leading-relaxed ${isUser ? "bg-[#D9FDD3] text-[#111B21] rounded-tl-2xl rounded-bl-2xl rounded-tr-sm rounded-br-2xl" : dark ? "bg-[#1f2c34] text-[#e9edef] rounded-tr-2xl rounded-br-2xl rounded-tl-sm rounded-bl-2xl" : "bg-white text-[#111B21] rounded-tr-2xl rounded-br-2xl rounded-tl-sm rounded-bl-2xl"}`}>
            <p
              dangerouslySetInnerHTML={{
                __html: (msg.text || "")
                  .replace(/\n/g, "<br/>")
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
              }}
            />
            {ts}
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
      case "tracker":
        return <OrderTracker orderData={msg.data} dark={dark} />;
      case "collections":
        return (
          <CollectionCarousel
            collections={msg.data || []}
            onSelect={handleOptionTap}
            dark={dark}
          />
        );
      // Handle cart, promo, carousel here...
      default:
        return null;
    }
  };

  return (
    <>
      <DarkCtx.Provider value={dark}>
        <div
          className={`fixed z-[9999] flex flex-col transition-all duration-500 origin-bottom-right bottom-0 right-0 w-full h-full sm:w-[360px] sm:h-[640px] sm:max-h-[85vh] sm:rounded-2xl sm:bottom-20 sm:right-6 shadow-2xl lg:w-[380px] lg:h-[680px] lg:bottom-24 lg:right-8 ${open ? "opacity-100 translate-y-0 sm:scale-100 pointer-events-auto" : "opacity-0 translate-y-full sm:scale-50 pointer-events-none"}`}
          style={{ background: bg }}>
          {/* Header */}
          <div className="px-3 py-2.5 flex items-center justify-between sm:rounded-t-2xl z-10 bg-[#008069] shadow-sm">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setOpen(false)}
                className="sm:hidden text-white p-1">
                <Icon name="back" size={22} />
              </button>
              <div className="w-10 h-10 rounded-full bg-[#005c4b] overflow-hidden flex items-center justify-center text-white font-bold text-sm">
                GK
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-white text-[15px]">
                  {STORE_INFO.name}
                </h3>
                <p className="text-[11.5px] text-white/80">
                  {typing ? "typing..." : "online"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="hidden sm:block text-white p-1">
              <Icon name="x" size={20} />
            </button>
          </div>

          {showBanner && (
            <PromoBanner dark={dark} onDismiss={() => setShowBanner(false)} />
          )}

          {/* Chat Feed */}
          <div
            ref={chatRef}
            onScroll={onScroll}
            className="flex-1 overflow-y-auto p-4 space-y-3">
            {grouped.map((item) =>
              item.type === "sep" ? (
                <div key={item.key} className="flex justify-center my-2">
                  <span className="text-[11px] bg-white/80 px-3 py-1 rounded-full">
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
              <div className="p-3 w-16 bg-white rounded-2xl animate-pulse">
                ...
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div
            style={{ background: barBg }}
            className="px-3 py-2.5 flex items-center gap-2 border-t">
            <div
              className="flex-1 rounded-full flex items-center overflow-hidden border"
              style={{ background: inpBg }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={
                  askingPincode
                    ? "Enter 6-digit pincode..."
                    : askingOrderTrack
                      ? "Enter Order ID..."
                      : "Message..."
                }
                className="w-full px-4 py-2.5 text-[14px] bg-transparent outline-none"
                style={{ color: inpClr }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`w-11 h-11 rounded-full flex items-center justify-center ${input.trim() ? "bg-[#008069] text-white" : "bg-gray-200 text-gray-400"}`}>
              <Icon name="send" size={20} />
            </button>
          </div>
        </div>
      </DarkCtx.Provider>
      <WhatsAppFloatingButton open={open} setOpen={setOpen} unread={unread} />
    </>
  );
};

export default React.memo(WhatsAppGuidedBot);
