// ─────────────────────────────────────────────
// BOT UTILITY HELPERS
// ─────────────────────────────────────────────

import { FESTIVAL_MAP } from "./botData";

/** Returns active festival or null */
export const getFestival = () => {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  return (
    FESTIVAL_MAP.find(({ start, end }) => {
      const after = m > start[0] || (m === start[0] && d >= start[1]);
      const before = m < end[0]  || (m === end[0]  && d <= end[1]);
      return after && before;
    }) || null
  );
};

/** Festival-aware or time-based greeting */
export const getGreeting = () => {
  const festival = getFestival();
  if (festival) return `Happy ${festival.name} ${festival.emoji}`;
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

/** Human-feeling random typing delay */
export const humanDelay = (base = 900) =>
  Math.floor(base * 0.7 + Math.random() * base * 0.6);

/** Estimated delivery date (3–5 business days from now) */
export const getEstimatedDelivery = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3 + Math.floor(Math.random() * 3));
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

/** Current time string */
export const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/** Format a date string for chat separators */
export const fmtDate = (d) => {
  const date = new Date(d);
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yest.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/** Group messages with date separators */
export const groupByDate = (msgs) => {
  const out = [];
  let last = null;
  msgs.forEach((m) => {
    const dk = m.date || new Date().toDateString();
    if (dk !== last) {
      out.push({ type: "sep", label: fmtDate(dk), key: `sep-${dk}` });
      last = dk;
    }
    out.push(m);
  });
  return out;
};

/** WhatsApp-style notification sound via Web Audio API */
export const playNotificationSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.01);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.18);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch (_) {
    /* Autoplay blocked — silent fail */
  }
};

/** Get collections list from productSections (filter out 'all' and 'new') */
export const getBotCollections = (sections = []) =>
  sections
    .filter((s) => s.key !== "all" && s.key !== "new")
    .map((s) => ({
      id: s.key,
      label: s.title,
      image: s.chipImage,
      desc: s.subtitle,
      badge: s.badge,
    }));