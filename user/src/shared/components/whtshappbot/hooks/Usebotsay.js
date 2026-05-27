// ─────────────────────────────────────────────
// HOOK: useBotSay
// Manages typing indicator + staggered bot messages
// ─────────────────────────────────────────────

import { useCallback, useRef } from "react";
import { humanDelay } from "../constants/botUtils";

/**
 * @param {Function} push - fn(text, sender, type, data)
 * @param {Function} setTyping - boolean setter
 * @returns {{ botSay, clearTimers }}
 */
const useBotSay = (push, setTyping) => {
  const timers = useRef([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  /**
   * Send a sequence of bot messages with human-like delays
   * Each response: { text, type?, data?, delay? }
   */
  const botSay = useCallback(
    (responses) => {
      clearTimers();
      setTyping(true);

      let cumulativeDelay = 0;

      responses.forEach((r, i) => {
        const wordCount = (r.text || "").split(" ").length;
        const baseDelay = r.delay ?? 900;
        const finalDelay = r.text
          ? humanDelay(Math.min(baseDelay + wordCount * 40, 1800))
          : baseDelay;

        cumulativeDelay += finalDelay;

        const t = setTimeout(() => {
          push(r.text ?? "", "bot", r.type ?? "text", r.data ?? null);
          if (i === responses.length - 1) setTyping(false);
        }, cumulativeDelay);

        timers.current.push(t);
      });
    },
    [push, clearTimers, setTyping],
  );

  return { botSay, clearTimers, timers };
};

export default useBotSay;