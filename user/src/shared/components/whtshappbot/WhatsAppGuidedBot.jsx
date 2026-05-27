// ─────────────────────────────────────────────
// WhatsAppGuidedBot.jsx  (updated)
// Changes vs original:
//   • Uses handleOrderChips unified dispatcher
//   • Passes addToCart to useBotFlows for reorder support
//   • handleOptionTap calls handleOrderChips before other logic
// ─────────────────────────────────────────────

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

const generateSafeId = () =>
  window.crypto && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 15);

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

  const chatRef = useRef(null);
  const cartNudgeRef = useRef(null);
  const COLLECTIONS = useMemo(() => getBotCollections(productSections), []);

  const { user, logout } = useAuth();
  const { cart, updateQuantity, remove, addToCart } = useCart();

  const userName = useMemo(
    () => user?.name || capturedName || "Friend",
    [user, capturedName],
  );
  const userId = user?.uid || null;

  // ── push ────────────────────────────────────
  const push = useCallback(
    (text, sender, type = "text", data = null) => {
      const msg = {
        id: generateSafeId(),
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
      if (!open && sender === "bot") setUnread((n) => n + 1);
    },
    [open],
  );

  const { botSay, clearTimers } = useBotSay(push, setTyping);

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

  // ── restart ──────────────────────────────────
  const restart = useCallback(async () => {
    clearTimers();
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
  }, [clearTimers]);

  // ── Flows ────────────────────────────────────
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
    // unified dispatcher — handles payment, cancel, return, reorder, rating
    handleOrderChips,
  } = useBotFlows({
    botSay,
    push,
    cart,
    addToCart, // ← for reorder
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

  // ── LIFECYCLE: init ─────────────────────────
  useEffect(() => {
    if (!open || started) return;
    setStarted(true);
    (async () => {
      await initDB();
      const old = await getMessages();
      cleanOldMessages();

      if (old?.length) {
        setMessages(old);
        setAllProducts(homepageService.getCachedProductsForBot?.() || []);
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

      if (user?.name) {
        showMainMenu(user.name);
        return;
      }

      clearTimers();
      setTyping(true);
      let cum = 0;
      welcomeMessages.forEach((r, i) => {
        cum += r.delay;
        setTimeout(() => {
          push(r.text, "bot", r.type || "text", r.data || null);
          if (i === welcomeMessages.length - 1) {
            setTyping(false);
            setTimeout(() => {
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
          }
        }, cum);
      });
    })();
  }, [open, started, user, userName, showMainMenu, clearTimers, push, botSay]);

  // ── LIFECYCLE: Unread reset ──────────────────
  useEffect(() => {
    if (open) {
      setUnread(0);
      setLastOpened(Date.now());
    }
  }, [open]);

  // ── LIFECYCLE: Auto-scroll ───────────────────
  useEffect(() => {
    if (!chatRef.current || !open) return;
    const el = chatRef.current;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 140)
      el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  // ── LIFECYCLE: Clear timers ──────────────────
  useEffect(() => () => clearTimers(), [clearTimers]);

  // ── LIFECYCLE: Proactive nudge ───────────────
  useEffect(() => {
    if (open || unread === 0) return;
    const t = setTimeout(() => {
      if (Date.now() - lastOpened > 10000) {
        push("Still there? I've got fresh deals for you 👇", "bot");
        setUnread((n) => n + 1);
      }
    }, 10000);
    return () => clearTimeout(t);
  }, [open, unread, lastOpened, push]);

  // ── LIFECYCLE: Cart nudge ────────────────────
  useEffect(() => {
    if (cartNudgeRef.current) clearTimeout(cartNudgeRef.current);
    if (!open || !cart.length) return;
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
    return () => clearTimeout(cartNudgeRef.current);
  }, [open, cart.length, push]);

  // ── handleOptionTap ──────────────────────────
  const handleOptionTap = useCallback(
    async (opt) => {
      // Hard redirects (no push)
      if (opt.id === "login") return (window.location.href = "/auth/login");
      if (opt.waText) return openWA(opt.waText);
      if (opt.url)
        return window.open(
          opt.url,
          opt.url.startsWith("tel:") ? "_self" : "_blank",
        );

      const page = INFO_PAGES.find((p) => p.id === opt.id);
      if (page) return (window.location.href = page.url);

      // ── Unified order chip dispatcher ────────
      // Handles: payment, cancel, return, reorder, rating, feedback tag
      if (await handleOrderChips(opt.id)) return;

      // Guest name capture
      if (opt.id === "guest") {
        push(opt.label, "user");
        setAskingName(true);
        return botSay([
          { text: "No problem! What should I call you?", delay: 700 },
        ]);
      }

      push(opt.label, "user");

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
      if (actions[opt.id]) return actions[opt.id]();

      if (opt.id === "pincode") {
        setAskingPincode(true);
        return botSay([
          { text: "Sure! Please type your 6-digit pincode:", delay: 600 },
        ]);
      }

      if (["order_by_id", "order_by_name", "order_by_phone"].includes(opt.id)) {
        setAskingOrderSearch(true);
        const label =
          opt.id === "order_by_id"
            ? "Order ID"
            : opt.id === "order_by_name"
              ? "name"
              : "phone number";
        return botSay([{ text: `Please type your ${label}:`, delay: 600 }]);
      }

      const col = COLLECTIONS.find((c) => c.id === opt.id);
      if (col) showCollection(col);
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

  // ── handleSend ───────────────────────────────
  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setShowPages(false);
    setShowSuggestions(false);

    if (askingPincode) {
      push(text, "user");
      return checkPincode(text);
    }
    if (askingOrderSearch) {
      push(text, "user");
      return handleOrderSearch(text);
    }
    if (askingName) {
      setAskingName(false);
      setCapturedName(text);
      push(text, "user");
      return showMainMenu(text);
    }

    push(text, "user");
    const newId = generateSafeId();
    setTimeout(() => setReadMsgId(newId), 1200);

    const lower = text.toLowerCase();
    const clean6 = text.replace(/\D/g, "");

    if (/^\d{6}$/.test(clean6) && clean6 === text.trim())
      return checkPincode(clean6);
    if (lower.includes("pincode") || lower.includes("deliver to")) {
      setAskingPincode(true);
      return botSay([
        { text: "Sure! Please type your 6-digit pincode:", delay: 600 },
      ]);
    }

    if (/^[a-z0-9]{2,8}-[a-z0-9]{5,12}$/i.test(text.trim()))
      return handleOrderSearch(text.trim());

    if (lower.includes("surprise") || lower.includes("random"))
      return showSurpriseProduct();
    if (lower.startsWith("search ") || lower.startsWith("find "))
      return showSearchResults(text.replace(/^(search|find)\s+/i, ""));
    if (lower.includes("cart")) return showCart();
    if (["track", "my order", "order status"].some((k) => lower.includes(k)))
      return showTrack();
    if (["promo", "code", "coupon", "offer"].some((k) => lower.includes(k)))
      return showPromo();

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
      if (lower.includes(key))
        return showCollection(COLLECTIONS.find((c) => c.id === id));
    }

    if (["shop", "product", "browse"].some((k) => lower.includes(k)))
      return showShopMenu();
    if (lower.includes("support") || lower.includes("help"))
      return showSupport();
    if (lower.includes("menu") || lower.includes("home"))
      return showMainMenu(userName);
    if (lower.includes("faq")) return (window.location.href = "/pages/faq");
    if (lower.includes("about")) return (window.location.href = "/pages/about");

    showSearchResults(text);
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

  const handleInputChange = useCallback(
    (e) => {
      const val = e.target.value;
      setInput(val);
      if (val.trim().length >= 2 && allProducts.length) {
        const q = val.toLowerCase();
        const hits = allProducts
          .filter((p) => p.name?.toLowerCase().includes(q))
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

  // ── Render Message Helper ──────────────────
  const renderMsg = useCallback(
    (msg) => {
      const isUser = msg.sender === "user";

      const ts = (
        <span
          className={`text-[10px] float-right mt-1.5 ml-3 flex items-center gap-[3px]
          ${isUser ? "text-[#4a7c5f]" : "text-[#9ca3af]"}`}>
          {msg.time}{" "}
          {isUser && <AnimatedDoubleTick read={msg.id === readMsgId} />}
        </span>
      );

      const FeedbackRow = !isUser ? (
        <div className="flex gap-1.5 mt-1 justify-end opacity-50">
          <button
            title="Helpful"
            onClick={() => push("👍 Helpful", "user")}
            className="text-[13px] bg-transparent hover:scale-110">
            👍
          </button>
          <button
            title="Not helpful"
            onClick={() =>
              openWA(
                "Hi! I found a bot response unhelpful and want to give feedback.",
              )
            }
            className="text-[13px] bg-transparent hover:scale-110">
            👎
          </button>
        </div>
      ) : null;

      const bubbleClass = isUser
        ? "bg-[#D9FDD3] text-[#111B21] rounded-[18px_4px_18px_18px]"
        : `${dark ? "bg-[#1f2c34] text-[#e9edef]" : "bg-white text-[#111B21]"} rounded-[4px_18px_18px_18px]`;

      switch (msg.type) {
        case "text":
          return (
            <div
              className={`relative max-w-[85%] px-3.5 py-2.5 shadow-sm text-[13.5px] leading-relaxed ${bubbleClass}`}>
              <p
                dangerouslySetInnerHTML={{
                  __html: (msg.text || "")
                    .replace(/\n/g, "<br/>")
                    .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
                    .replace(/_(.*?)_/g, "<em>$1</em>"),
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
                push(`Copied code: ${c}`, "user");
                showCopyToast(c);
              }}
            />
          );
        case "promo":
          return msg.data ? (
            <SearchPromoCard
              code={msg.data.code}
              info={msg.data.info}
              onCopy={(c) => {
                push(`Copied code: ${c}`, "user");
                showCopyToast(c);
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
            // Changed to flex-row, added overflow-x-auto, and snap behavior
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
          if (!msg.data || !Array.isArray(msg.data) || msg.data.length === 0)
            return null;

          return (
            <div className="flex flex-row overflow-x-auto gap-3 w-full mt-1 pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {msg.data.map((order, idx) => (
                <OrderCardOfWhatsapp
                  key={order.orderId || idx}
                  order={order}
                  // Passes the action (reorder/cancel) to your central chip handler
                  onAction={(actionId) => handleOptionTap({ id: actionId })}
                  // Sends the Order ID into the chat to pull up the full tracker
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
          return (
            <button
              onClick={() => openWA(msg.data.waText)}
              className="mt-1.5 flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold bg-[#25D366] text-white shadow-[0_2px_8px_rgba(37,211,102,0.3)] hover:scale-105 transition-transform">
              <Icon name="wa" size={17} /> {msg.data.label}
            </button>
          );
        default:
          return null;
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
    ],
  );

  // ── Render ───────────────────────────────────
  return (
    <>
      {copyToast && (
        <div className="fixed bottom-28 right-6 z-[10000] bg-[#1f2c34] text-white text-[12px] px-3 py-1.5 rounded-full shadow-lg animate-fade-in-up">
          {copyToast}
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
            if (logout) await logout();
            restart();
          }}
        />

        {showBanner && (
          <PromoBanner dark={dark} onDismiss={() => setShowBanner(false)} />
        )}

        <div
          ref={chatRef}
          onScroll={() =>
            setScrollBtn(
              chatRef.current.scrollHeight -
                chatRef.current.scrollTop -
                chatRef.current.clientHeight >
                160,
            )
          }
          className={`flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth ${dark ? "bg-[#0b141a]" : ""}`}
          style={
            !dark
              ? {
                  backgroundImage: `url('${STORE_INFO.bgImage}')`,
                  backgroundSize: "cover",
                }
              : {}
          }>
          {useMemo(() => groupByDate(messages), [messages]).map((item) =>
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
            onClick={() =>
              chatRef.current?.scrollTo({
                top: chatRef.current.scrollHeight,
                behavior: "smooth",
              })
            }
            className={`absolute bottom-20 right-4 z-10 w-8 h-8 rounded-full shadow-md flex items-center justify-center
              ${dark ? "bg-[#1f2c34] text-white" : "bg-white text-gray-600"}`}>
            ↓
          </button>
        )}

        {showPages && (
          <PagesPopup
            dark={dark}
            onClose={() => setShowPages(false)}
            onSelect={(p) => {
              setShowPages(false);
              push(p.label, "user");
              window.location.href = p.url;
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
          scrollDown={() =>
            chatRef.current?.scrollTo({
              top: chatRef.current.scrollHeight,
              behavior: "smooth",
            })
          }
        />
      </div>

      <WhatsAppFloatingButton open={open} setOpen={setOpen} unread={unread} />
    </>
  );
};

export default React.memo(WhatsAppGuidedBot);
