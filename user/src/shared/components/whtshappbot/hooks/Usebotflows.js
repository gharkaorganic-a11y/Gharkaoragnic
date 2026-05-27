// ─────────────────────────────────────────────
// HOOK: useBotFlows  (secured + enhanced)
// • All order fetches now pass userId for ownership validation
// • Payment retry flow (pay_now / pay_wa chips)
// • Order cancellation flow
// • Return / refund request flow
// • Reorder flow
// ─────────────────────────────────────────────

import { useCallback } from "react";
import {
  STORE_INFO,
  PROMO_CODES,
  BUNDLE_MAP,
  INFO_PAGES,
  POST_SHOP_QR,
  FREE_SHIPPING_THRESHOLD,
} from "../constants/botData";
import {
  getGreeting,
  getEstimatedDelivery,
  getFestival,
} from "../constants/botUtils";
import { fetchPincodeDetails, formatPincodeAddress } from "../services/Pincodeservice";
import {
  // search & fetch
  searchUserOrders,
  getBotOrderDetails,
  buildOrderSummary,
  looksLikeOrderId,
  extractPhone,
  // status helpers
  isPaymentPending,
  isCancellable,
  isReturnable,
  // payment retry
  buildPaymentRetryFlow,
  parsePaymentChip,
  // cancel
  cancelOrder,
  buildCancelFlow,
  parseCancelChip,
  // return
  requestReturn,
  buildReturnFlow,
  parseReturnChip,
  getReturnReasonLabel,
  // reorder
  buildReorderFlow,
  parseReorderChip,
  // rating
  hasRatedOrder,
  buildRatingFlow,
  buildFeedbackTagFlow,
  parseRatingChip,
  parseFeedbackTagChip,
  submitOrderRating,
} from "../services/botOrderServices";

const useBotFlows = ({
  botSay,
  push,
  cart,
  addToCart,          // ← pass from parent so reorder can add items
  userName,
  userId,
  COLLECTIONS,
  setAskingPincode,
  setAskingOrderSearch,
  allProducts,
  setAllProducts,
  homepageService,
  openWA,
  setPendingRating,
  pendingRating,
}) => {

  // ── GUARD: require login ─────────────────────
  const _requireLogin = useCallback((action) => {
    if (userId) return true;
    botSay([
      { text: "Please log in to view your orders. 🔐", delay: 600 },
      {
        text: "", type: "chips", delay: 800,
        data: [
          { id: "login", label: "Log in", icon: "info" },
          { id: "main",  label: "Main menu", icon: "home" },
        ],
      },
    ]);
    return false;
  }, [userId, botSay]);

  // ── MAIN MENU ────────────────────────────────
  const showMainMenu = useCallback(
    (name) => {
      const festival  = getFestival();
      const cartCount = cart.reduce((s, i) => s + (i.selectedQuantity || 1), 0);

      const MAIN_MENU_LOCAL = [
        { id: "shop",    label: "Shop products",        desc: "Browse our organic range",   icon: "bag"     },
        { id: "cart",    label: cartCount ? `My cart (${cartCount})` : "My cart", desc: "View items & checkout", icon: "cart" },
        { id: "orders",  label: "My orders",            desc: "Track or search by name/ID", icon: "package" },
        { id: "promo",   label: "Offers & promo codes", desc: "Active deals for you",        icon: "tag"     },
        { id: "pages",   label: "Info pages",           desc: "FAQ, about, shipping",        icon: "file"    },
        { id: "support", label: "Talk to support",      desc: "Get help from our team",      icon: "headset" },
      ];

      const responses = [
        { text: `${getGreeting()}, *${name}*! How can I help you today?`, delay: 700 },
        { text: "", type: "menu", delay: 900, data: MAIN_MENU_LOCAL },
      ];

      if (festival) {
        responses.push({
          text: "", type: "chips", delay: 400,
          data: [{ id: "promo", label: `${festival.emoji} ${festival.name} Offers`, icon: "tag", isBig: true }],
        });
      }

      botSay(responses);
    },
    [botSay, cart],
  );

  // ── SHOP / COLLECTIONS ───────────────────────
  const showShopMenu = useCallback(() => {
    botSay([
      { text: "What are you looking for today? 🛍️", delay: 600 },
      { text: "", type: "collections", delay: 800, data: COLLECTIONS },
    ]);
  }, [botSay, COLLECTIONS]);

  // ── SINGLE COLLECTION ────────────────────────
  const showCollection = useCallback(
    async (col) => {
      if (!col) return;
      try {
        const data = await homepageService.getProductsByCollection(col.id, 10);
        setAllProducts((prev) => {
          const map = new Map(prev.map((p) => [p.id, p]));
          data.forEach((p) => map.set(p.id, p));
          return Array.from(map.values());
        });

        if (!data.length) {
          botSay([
            { text: `We're restocking *${col.label}* soon — check back shortly!`, delay: 500 },
            { text: "", type: "collections", delay: 800, data: COLLECTIONS.slice(0, 4) },
          ]);
          return;
        }

        const responses = [
          { text: `Here's our *${col.label}* range 🌿`, delay: 400 },
          { text: "", type: "carousel", delay: 600, data },
        ];

        const bundles = BUNDLE_MAP[col.id];
        if (bundles?.length) {
          const names = bundles.map((b) => b.label).join(", ");
          responses.push({
            text: `🛒 *Often paired with:* ${names} — grab them together for a complete pantry!`,
            delay: 800,
          });
          responses.push({
            text: "", type: "chips", delay: 400,
            data: bundles.map((b) => ({ id: b.id, label: b.label, icon: "bag" })),
          });
        }

        responses.push({ text: "", type: "qr", delay: 500, data: POST_SHOP_QR });
        botSay(responses);
      } catch {
        botSay([{ text: "Couldn't load products right now. Please try again!", delay: 500 }]);
      }
    },
    [botSay, COLLECTIONS, homepageService, setAllProducts],
  );

  // ── CART ─────────────────────────────────────
  const showCart = useCallback(() => {
    if (!cart.length) {
      botSay([
        { text: "Your cart is empty 🛒 Start browsing to add items!", delay: 600 },
        {
          text: "", type: "chips", delay: 800,
          data: [
            { id: "shop", label: "Shop now",   icon: "bag"  },
            { id: "main", label: "Main menu",  icon: "home" },
          ],
        },
      ]);
      return;
    }

    const total       = cart.reduce((s, i) => s + (i.price || 0) * (i.selectedQuantity || 1), 0);
    const count       = cart.reduce((s, i) => s + (i.selectedQuantity || 1), 0);
    const amountNeeded = FREE_SHIPPING_THRESHOLD - total;

    const itemizedList = cart
      .map((i) => `▪ ${i.name} ×${i.selectedQuantity} — ₹${(i.price * i.selectedQuantity).toLocaleString("en-IN")}`)
      .join("\n");

    const checkoutMessage =
      `Hi! I'd like to place an order. 🛒\n\n*Order Summary:*\n${itemizedList}\n\n` +
      `*Total: ₹${total.toLocaleString("en-IN")}*\n\nHow do I proceed with payment and delivery?`;

    const responses = [
      {
        text: `You have *${count} item${count > 1 ? "s" : ""}* in your cart\n*Total: ₹${total.toLocaleString("en-IN")}*`,
        delay: 600,
      },
    ];

    if (amountNeeded > 0) {
      responses.push({
        text: `🚚 Add ₹${amountNeeded.toLocaleString("en-IN")} more for *FREE delivery*!`,
        delay: 700,
      });
    } else {
      responses.push({ text: "✅ You've unlocked *FREE delivery*!", delay: 700 });
    }

    responses.push({ text: `📅 Estimated delivery: *${getEstimatedDelivery()}*`, delay: 500 });
    responses.push({ text: "", type: "cart", delay: 900 });
    responses.push({
      text: "Ready to place your order?",
      type: "qr",
      delay: 600,
      data: [
        {
          id: "checkout",
          label: "Confirm & Buy via WhatsApp",
          icon: "wa",
          waText: checkoutMessage,
          style: { background: "#C8102E", color: "#fff", borderColor: "#C8102E" },
        },
        { id: "shop", label: "Add more items", icon: "plus" },
      ],
    });

    botSay(responses);
  }, [cart, botSay]);

  // ── PROMO ─────────────────────────────────────
  const showPromo = useCallback(() => {
    const entries = Object.entries(PROMO_CODES).map(([code, info]) => ({ code, info }));
    if (!entries.length) {
      botSay([
        { text: "No active promo codes right now. Check back soon! 🙌", delay: 600 },
        {
          text: "", type: "qr", delay: 900,
          data: [
            { id: "shop", label: "Shop now",  icon: "bag"  },
            { id: "main", label: "Main menu", icon: "home" },
          ],
        },
      ]);
      return;
    }
    botSay([
      { text: `🏷️ *${entries.length} active offer${entries.length > 1 ? "s" : ""} for you!* Tap to copy:`, delay: 600 },
      { text: "", type: "promos", delay: 900,  data: entries },
      {
        text: "", type: "qr", delay: 1200,
        data: [
          { id: "shop", label: "Shop now",  icon: "bag"  },
          { id: "main", label: "Main menu", icon: "home" },
        ],
      },
    ]);
  }, [botSay]);

  // ── PAGES MENU ────────────────────────────────
  const showPagesMenu = useCallback(() => {
    botSay([
      { text: "Which page are you looking for?", delay: 600 },
      {
        text: "", type: "chips", delay: 800,
        data: INFO_PAGES.map((p) => ({ id: p.id, label: p.label, icon: p.icon })),
      },
    ]);
  }, [botSay]);

  // ── SUPPORT ───────────────────────────────────
  const showSupport = useCallback(() => {
    const hour         = new Date().getHours();
    const isAfterHours = hour < 9 || hour >= 22;
    const afterHoursNote = isAfterHours
      ? "\n\n⏰ Our team is currently offline. We'll reply first thing in the morning!"
      : "\n\n🟢 Our team is online and ready to help!";

    botSay([
      { text: `We're here to help! How would you like to connect?${afterHoursNote}`, delay: 600 },
      {
        text: "", type: "menu", delay: 900,
        data: [
          {
            id: "support_wa",
            label: "WhatsApp Chat",
            desc:  isAfterHours ? "Reply by morning" : "Replies instantly",
            icon:  "wa",
            waText: "Hi! I need help with my order.",
          },
          {
            id: "support_call",
            label: "Call Us",
            desc:  "Mon–Sat, 9 AM – 6 PM",
            icon:  "phone",
            url:   `tel:${STORE_INFO.number}`,
          },
          {
            id: "support_ig",
            label: "Instagram",
            desc:  "DM us @GharKaOrganic",
            icon:  "info",
            url:   "https://instagram.com/gharkaorganic",
          },
        ],
      },
      { text: "", type: "qr", delay: 500, data: [{ id: "main", label: "Main menu", icon: "home" }] },
    ]);
  }, [botSay]);

  // ── TRACK / ORDERS ───────────────────────────
  const showTrack = useCallback(() => {
    if (!_requireLogin()) return;
    botSay([
      { text: "Let's find your order! How would you like to search?", delay: 600 },
      {
        text: "", type: "chips", delay: 800,
        data: [
          { id: "order_by_id",    label: "By Order ID",   icon: "package" },
          { id: "order_by_name",  label: "By Name",       icon: "info"    },
          { id: "order_by_phone", label: "By Phone No.",  icon: "phone"   },
        ],
      },
      { text: "", type: "qr", delay: 500, data: [{ id: "main", label: "Main menu", icon: "home" }] },
    ]);
  }, [botSay, _requireLogin]);

  // ── ORDER SEARCH ─────────────────────────────
const handleOrderSearch = useCallback(
    async (query) => {
      setAskingOrderSearch(false);

      // Auth guard — must be first
      if (!_requireLogin()) return;

      push("🔍 Searching your orders…", "bot");

      try {
        // Direct order ID lookup — always pass userId for ownership check
        if (looksLikeOrderId(query)) {
          const order = await getBotOrderDetails(query.trim(), userId);
          if (order) {
            await _showOrderDetail(order);
            return;
          }
          // If null → either doesn't exist OR belongs to someone else → same message
          botSay([
            {
              text: `No order found with ID *"${query}"*.\nPlease check the ID and try again.`,
              delay: 600,
            },
            {
              text: "", type: "qr", delay: 800,
              data: [
                { id: "orders", label: "Try again",  icon: "package" },
                { id: "main",   label: "Main menu",  icon: "home"    },
              ],
            },
          ]);
          return;
        }

        // Phone number lookup — scoped to userId
        const phone   = extractPhone(query);
        const results = await searchUserOrders(userId, phone || query);

        if (!results.length) {
          botSay([
            {
              text: `No orders found for *"${query}"*.\nTry your Order ID, delivery name, or phone number.`,
              delay: 600,
            },
            {
              text: "", type: "qr", delay: 800,
              data: [
                { id: "orders", label: "Try again",  icon: "package" },
                { id: "main",   label: "Main menu",  icon: "home"    },
              ],
            },
          ]);
          return;
        }

        // Single result → straight to detail
        if (results.length === 1) {
          await _showOrderDetail(results[0]);
          return;
        }

        // Multiple results → Carousel (Updated Fix!)
        const msgs = [
          { text: `Found *${results.length} orders* matching *"${query}"*:`, delay: 500 },
          { 
            text: "", 
            type: "orders_carousel", // Triggers the horizontal OrderCardOfWhatsapp UI
            delay: 900, 
            data: results.slice(0, 5) // Shows up to 5 recent orders in the carousel
          }
        ];
        
        if (results.length > 5) {
          msgs.push({
            text: `_+ ${results.length - 5} more orders found. Refine your search to narrow it down._`,
            delay: 1400,
          });
        }

        msgs.push({
          text: "Need help with a specific order?",
          type: "qr",
          delay: 1800,
          data: [
            {
              id: "support_wa",
              label: "Chat on WhatsApp",
              icon: "wa",
              waText: `Hi! I need help with my order. Customer: ${query}`,
            },
            { id: "main", label: "Main menu", icon: "home" },
          ],
        });
        
        botSay(msgs);
        
      } catch (err) {
        console.error("[useBotFlows] handleOrderSearch error:", err);
        botSay([{ text: "Something went wrong while searching. Please try again.", delay: 500 }]);
      }
    },
    [botSay, push, userId, setAskingOrderSearch, _requireLogin],
  );

  // ─────────────────────────────────────────────
  // INTERNAL: show a single order's detail
  // + conditionally appends payment / rating / action flows
  // ─────────────────────────────────────────────
  const _showOrderDetail = useCallback(
    async (order) => {
      const msgs = [
        { text: buildOrderSummary(order), delay: 400 },
        { text: "", type: "tracker", delay: 600 },
      ];

      // ── Action buttons based on order state ──
      const actionChips = [
        { id: "orders",     label: "Search another",  icon: "package" },
        { id: "support_wa", label: "Get help",        icon: "wa",
          waText: `Hi! I need help with order: ${order.orderId}` },
        { id: "main",       label: "Main menu",       icon: "home" },
      ];

      // Cancel button — only for placed/confirmed
      if (isCancellable(order)) {
        actionChips.unshift({ id: `cancel_${order.orderId}`, label: "❌ Cancel order", icon: "tag" });
      }

      // Return button — only for delivered within 7 days
      if (isReturnable(order)) {
        actionChips.unshift({ id: `return_${order.orderId}`, label: "↩️ Return / Refund", icon: "tag" });
      }

      // Reorder button — delivered or cancelled
      const reorderEligible = ["delivered", "cancelled"].includes(order?.orderStatus?.toLowerCase());
      if (reorderEligible) {
        actionChips.unshift({ id: `reorder_${order.orderId}`, label: "🔁 Reorder", icon: "bag" });
      }

      msgs.push({ text: "", type: "qr", delay: 800, data: actionChips });
      botSay(msgs);

      // ── Payment pending flow ──────────────────
      if (isPaymentPending(order)) {
        botSay(buildPaymentRetryFlow(order));
        return; // don't show rating flow if payment is pending
      }

      // ── Rating flow ───────────────────────────
      if (order.orderStatus === "delivered") {
        const alreadyRated = await hasRatedOrder(order.orderId);
        if (alreadyRated) {
          const stars = order.rating ?? "?";
          botSay([{ text: `You already rated this order: ${"⭐".repeat(Number(stars))} — thanks! 🙏`, delay: 800 }]);
        } else {
          botSay(buildRatingFlow(order));
        }
      }
    },
    [botSay],
  );

  // ── PAYMENT RETRY CHIP HANDLER ───────────────
  const handlePaymentChip = useCallback(
    async (chipId) => {
      const parsed = parsePaymentChip(chipId);
      if (!parsed) return false;

      const { action, orderId } = parsed;

      // Verify ownership before doing anything
      const order = await getBotOrderDetails(orderId, userId);
      if (!order) {
        botSay([{ text: "Order not found. Please try again.", delay: 400 }]);
        return true;
      }

      if (action === "now") {
        // Redirect to your payment page — adjust the URL to your actual payment gateway route
        push("💳 Proceeding to payment…", "user");
        botSay([
          {
            text: `Redirecting you to complete payment of *₹${Number(order.totalAmount || 0).toLocaleString("en-IN")}*…`,
            delay: 400,
          },
        ]);
        setTimeout(() => {
          window.location.href = `/checkout/pay?orderId=${orderId}`;
        }, 1200);
      }

      if (action === "wa") {
        push("📲 Contacting support for payment…", "user");
        openWA(
          `Hi! I need to complete payment for order *${orderId}* — ₹${Number(order.totalAmount || 0).toLocaleString("en-IN")}. Please help!`,
        );
      }

      if (action === "cancel") {
        // Trigger the cancellation confirm flow
        push("Cancel this order", "user");
        botSay(buildCancelFlow(order));
      }

      return true;
    },
    [botSay, push, userId, openWA],
  );

  // ── CANCEL CHIP HANDLER ──────────────────────
  // Handles both the initial "cancel_<orderId>" chip and the confirm chip
  const handleCancelChip = useCallback(
    async (chipId) => {
      // Initial cancel intent — show confirmation
      const initMatch = chipId.match(/^cancel_(.+)$/);
      if (initMatch && !chipId.startsWith("confirm_cancel_")) {
        const orderId = initMatch[1];
        const order   = await getBotOrderDetails(orderId, userId);
        if (!order) {
          botSay([{ text: "Order not found.", delay: 400 }]);
          return true;
        }
        push("❌ Cancel order", "user");
        botSay(buildCancelFlow(order));
        return true;
      }

      // Confirmed cancellation
      const parsed = parseCancelChip(chipId);
      if (!parsed) return false;

      push("✅ Yes, cancel it", "user");
      botSay([{ text: "Cancelling your order… ⏳", delay: 400 }]);

      try {
        await cancelOrder({ orderId: parsed.orderId, userId });
        botSay([
          { text: "✅ Your order has been *successfully cancelled*.\nIf you paid online, a refund will be processed in 5–7 business days.", delay: 600 },
          {
            text: "", type: "qr", delay: 900,
            data: [
              { id: "shop",       label: "Shop again",     icon: "bag"  },
              { id: "support_wa", label: "Refund query",   icon: "wa",
                waText: `Hi! I cancelled order ${parsed.orderId} and want to check refund status.` },
              { id: "main",       label: "Main menu",      icon: "home" },
            ],
          },
        ]);
      } catch (err) {
        if (err.message === "NOT_CANCELLABLE") {
          botSay([
            { text: "Sorry, this order can no longer be cancelled as it has already been packed or shipped. Please contact support.", delay: 600 },
            {
              text: "", type: "qr", delay: 800,
              data: [
                { id: "support_wa", label: "Contact support", icon: "wa",
                  waText: `Hi! I want to cancel order ${parsed.orderId} but couldn't via bot.` },
                { id: "main", label: "Main menu", icon: "home" },
              ],
            },
          ]);
        } else {
          botSay([{ text: "Something went wrong. Please try again or contact support.", delay: 500 }]);
        }
      }

      return true;
    },
    [botSay, push, userId],
  );

  // ── RETURN CHIP HANDLER ──────────────────────
  // Handles both "return_<orderId>" and "return_<reason>_<orderId>"
  const handleReturnChip = useCallback(
    async (chipId) => {
      // Initial return intent — chipId = "return_<orderId>"
      // But reason chips look like "return_damaged_<orderId>" — so we must distinguish
      // Reason chips always have a known keyword after "return_"
      const REASON_KEYS = ["damaged", "wrong", "quality", "notwant", "other"];
      const reasonMatch = chipId.match(/^return_([a-z]+)_(.+)$/);

      if (reasonMatch && REASON_KEYS.includes(reasonMatch[1])) {
        // This is a reason chip → submit the return
        const reason   = reasonMatch[1];
        const orderId  = reasonMatch[2];
        const label    = getReturnReasonLabel(reason);

        push(label, "user");
        botSay([{ text: "Submitting your return request… ⏳", delay: 400 }]);

        try {
          await requestReturn({ orderId, userId, reason: label });
          botSay([
            { text: `✅ *Return request submitted!*\nReason: _${label}_\n\nOur team will contact you within 24–48 hours to arrange a pickup.`, delay: 600 },
            {
              text: "", type: "qr", delay: 900,
              data: [
                { id: "support_wa", label: "Talk to support", icon: "wa",
                  waText: `Hi! I submitted a return request for order ${orderId}. Reason: ${label}` },
                { id: "main", label: "Main menu", icon: "home" },
              ],
            },
          ]);
        } catch (err) {
          if (err.message === "NOT_RETURNABLE") {
            botSay([
              { text: "Sorry, this order is no longer eligible for return (return window may have expired or a request already exists).", delay: 600 },
              {
                text: "", type: "qr", delay: 800,
                data: [
                  { id: "support_wa", label: "Contact support", icon: "wa",
                    waText: `Hi! I want to return order ${orderId} but couldn't via bot.` },
                  { id: "main", label: "Main menu", icon: "home" },
                ],
              },
            ]);
          } else {
            botSay([{ text: "Couldn't submit return right now. Please contact support.", delay: 500 }]);
          }
        }

        return true;
      }

      // Initial return intent — chipId = "return_<orderId>"
      const initMatch = chipId.match(/^return_([^_].+)$/);
      if (initMatch) {
        const orderId = initMatch[1];
        const order   = await getBotOrderDetails(orderId, userId);
        if (!order) {
          botSay([{ text: "Order not found.", delay: 400 }]);
          return true;
        }
        push("↩️ Return / Refund", "user");
        botSay(buildReturnFlow(order));
        return true;
      }

      return false;
    },
    [botSay, push, userId],
  );

  // ── REORDER CHIP HANDLER ─────────────────────
  const handleReorderChip = useCallback(
    async (chipId) => {
      const parsed = parseReorderChip(chipId);
      if (!parsed) return false;

      push("🔁 Reorder this", "user");

      const order = await getBotOrderDetails(parsed.orderId, userId);
      if (!order) {
        botSay([{ text: "Couldn't load order details. Please try again.", delay: 400 }]);
        return true;
      }

      const items = order.items || (order.previewItem ? [order.previewItem] : []);
      if (!items.length) {
        botSay([{ text: "No items found in this order.", delay: 400 }]);
        return true;
      }

      // Add each item back to cart via the addToCart prop
      if (typeof addToCart === "function") {
        items.forEach((item) => addToCart({ ...item, selectedQuantity: item.quantity ?? 1 }));
        botSay([
          { text: `✅ *${items.length} item${items.length > 1 ? "s" : ""}* added back to your cart!`, delay: 500 },
          {
            text: "", type: "qr", delay: 700,
            data: [
              { id: "cart", label: "View cart 🛒", icon: "cart" },
              { id: "shop", label: "Add more",     icon: "bag"  },
            ],
          },
        ]);
      } else {
        // Fallback — open WhatsApp with order details
        const itemList = items.map((i) => `▪ ${i.name} ×${i.quantity ?? 1}`).join("\n");
        openWA(`Hi! I'd like to reorder from order ${parsed.orderId}:\n\n${itemList}`);
        botSay([{ text: "Opening WhatsApp to place your reorder…", delay: 400 }]);
      }

      return true;
    },
    [botSay, push, userId, addToCart, openWA],
  );

  // ── RATING CHIP HANDLER ──────────────────────
  const handleRatingChip = useCallback(
    async (chipId) => {
      const parsed = parseRatingChip(chipId);
      if (!parsed) return false;

      const { stars, orderId } = parsed;
      setPendingRating({ stars, orderId });

      push(`${"⭐".repeat(stars)} (${stars}/5)`, "user");
      botSay(buildFeedbackTagFlow(orderId));
      return true;
    },
    [push, botSay, setPendingRating],
  );

  // ── FEEDBACK TAG CHIP HANDLER ────────────────
  const handleFeedbackTagChip = useCallback(
    async (chipId) => {
      const parsed = parseFeedbackTagChip(chipId);
      if (!parsed) return false;

      const { tag, orderId } = parsed;

      if (!pendingRating || pendingRating.orderId !== orderId) {
        botSay([{ text: "Something went wrong. Please try rating again.", delay: 400 }]);
        setPendingRating(null);
        return true;
      }

      const isSkip = tag === "skip";
      push(isSkip ? "Skip →" : tag, "user");

      try {
        await submitOrderRating({
          orderId,
          userId,
          stars:    pendingRating.stars,
          tag:      isSkip ? "" : tag,
        });

        const thankMsg =
          pendingRating.stars >= 4
            ? "Thanks so much! 🌟 We're thrilled you loved it!"
            : pendingRating.stars === 3
              ? "Thanks for your feedback! We'll keep improving 🙏"
              : "Really sorry to hear that 😔 We'll work to do better. Would you like to reach our team?";

        const followUp =
          pendingRating.stars < 3
            ? [
                {
                  text: "", type: "qr", delay: 800,
                  data: [
                    { id: "support_wa", label: "Talk to support", icon: "wa",
                      waText: `Hi! I had an issue with order ${orderId} — rated ${pendingRating.stars}⭐` },
                    { id: "main", label: "Main menu", icon: "home" },
                  ],
                },
              ]
            : [{ text: "", type: "qr", delay: 800, data: POST_SHOP_QR }];

        botSay([{ text: thankMsg, delay: 500 }, ...followUp]);
      } catch (err) {
        if (err.message === "ALREADY_RATED") {
          botSay([{ text: "You've already rated this order. Thanks! 🙏", delay: 400 }]);
        } else {
          botSay([{ text: "Couldn't save your rating right now. Please try again.", delay: 400 }]);
        }
      }

      setPendingRating(null);
      return true;
    },
    [botSay, push, pendingRating, setPendingRating, userId],
  );

  // ── PINCODE CHECK ─────────────────────────────
  const checkPincode = useCallback(
    async (pincode) => {
      setAskingPincode(false);
      const clean = String(pincode).replace(/\D/g, "").slice(0, 6);

      if (clean.length !== 6) {
        botSay([{ text: "Please enter a valid 6-digit pincode.", delay: 500 }]);
        return;
      }

      push("📍 Checking delivery availability…", "bot");

      const details = await fetchPincodeDetails(clean);

      if (!details.valid) {
        botSay([
          {
            text: `Sorry, we couldn't find details for *${clean}*. ${details.error || ""}`,
            delay: 500,
          },
          {
            text: "We deliver across India! Contact us to confirm your area.",
            type: "qr",
            delay: 700,
            data: [
              {
                id: "support_wa",
                label: "Ask on WhatsApp",
                icon: "wa",
                waText: `Hi! Can you deliver to pincode ${clean}?`,
              },
              { id: "main", label: "Main menu", icon: "home" },
            ],
          },
        ]);
        return;
      }

      const address   = formatPincodeAddress(details);
      const cachedNote = details.fromCache ? " _(saved)_" : "";

      botSay([
        {
          text: `✅ We deliver to *${clean}*!${cachedNote}\n\n📍 *${address}*\n\n📅 Estimated delivery: *3–5 business days*`,
          delay: 600,
        },
        { text: `🏤 Post offices in this area: *${details.totalCount}*`, delay: 700 },
        {
          text: "", type: "qr", delay: 800,
          data: [
            { id: "shop", label: "Shop now",   icon: "bag"  },
            { id: "cart", label: "Go to cart", icon: "cart" },
            { id: "main", label: "Main menu",  icon: "home" },
          ],
        },
      ]);
    },
    [botSay, push, setAskingPincode],
  );

  // ── SEARCH RESULTS ───────────────────────────
  const showSearchResults = useCallback(
    (query) => {
      const q = query.toLowerCase().trim();

      const results = allProducts.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.collectionTypes?.some((t) => t.toLowerCase().includes(q)),
      );

      const promoResults = Object.entries(PROMO_CODES)
        .filter(
          ([code, info]) =>
            code.toLowerCase().includes(q) ||
            info.desc?.toLowerCase().includes(q) ||
            info.discount?.toLowerCase().includes(q),
        )
        .map(([code, info]) => ({ code, info }));

      if (!results.length && !promoResults.length) {
        botSay([
          { text: `No results found for *"${query}"* 😕\nTry browsing our categories below:`, delay: 500 },
          { text: "", type: "collections", delay: 800, data: COLLECTIONS.slice(0, 5) },
        ]);
        return;
      }

      const msgs = [];

      if (results.length) {
        msgs.push({
          text: `Found *${results.length} product${results.length > 1 ? "s" : ""}* for *"${query}"* 🔍`,
          delay: 500,
        });
        msgs.push({ text: "", type: "carousel", delay: 800, data: results.slice(0, 10) });
      }

      if (promoResults.length) {
        msgs.push({
          text: `🏷️ Also found *${promoResults.length} promo code${promoResults.length > 1 ? "s" : ""}*:`,
          delay: results.length ? 1100 : 500,
        });
        promoResults.forEach((p, i) => {
          msgs.push({
            text: "", type: "promo",
            delay: (results.length ? 1400 : 800) + i * 300,
            data: p,
          });
        });
      }

      msgs.push({
        text: "Need help choosing? We'll recommend the best option.",
        type: "qr",
        delay: 1300 + promoResults.length * 300,
        data: [
          {
            id: "talk_to_us",
            label: "Ask for a recommendation",
            icon: "wa",
            waText: `Hi! I was searching for "${query}" but need help deciding. What do you recommend?`,
          },
          ...POST_SHOP_QR,
        ],
      });

      botSay(msgs);
    },
    [allProducts, botSay, COLLECTIONS],
  );

  // ── SURPRISE ME ──────────────────────────────
  const showSurpriseProduct = useCallback(() => {
    if (!allProducts.length) {
      botSay([
        { text: "Let me find something special! Browse a category first so I have products to pick from 😊", delay: 600 },
        { text: "", type: "collections", delay: 900, data: COLLECTIONS.slice(0, 4) },
      ]);
      return;
    }
    const pick = allProducts[Math.floor(Math.random() * allProducts.length)];
    botSay([
      { text: "🎲 Here's a surprise pick just for you!", delay: 600 },
      { text: "", type: "carousel", delay: 800, data: [pick] },
      {
        text: "", type: "qr", delay: 500,
        data: [
          { id: "surprise", label: "Another one! 🎲", icon: "refresh" },
          ...POST_SHOP_QR,
        ],
      },
    ]);
  }, [allProducts, botSay, COLLECTIONS]);

  // ─────────────────────────────────────────────
  // MASTER CHIP DISPATCHER
  // Call this from handleOptionTap for any chip id
  // Returns true if the chip was handled here
  // ─────────────────────────────────────────────
  const handleOrderChips = useCallback(
    async (chipId) => {
      if (await handlePaymentChip(chipId))   return true;
      if (await handleCancelChip(chipId))    return true;
      if (await handleReturnChip(chipId))    return true;
      if (await handleReorderChip(chipId))   return true;
      if (await handleRatingChip(chipId))    return true;
      if (await handleFeedbackTagChip(chipId)) return true;
      return false;
    },
    [
      handlePaymentChip,
      handleCancelChip,
      handleReturnChip,
      handleReorderChip,
      handleRatingChip,
      handleFeedbackTagChip,
    ],
  );

  return {
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
    // unified chip dispatcher — replaces the old two handlers
    handleOrderChips,
    // still export individually for backward compat if needed
    handleRatingChip,
    handleFeedbackTagChip,
    handlePaymentChip,
    handleCancelChip,
    handleReturnChip,
    handleReorderChip,
  };
};

export default useBotFlows;