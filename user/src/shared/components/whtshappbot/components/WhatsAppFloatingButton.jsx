import React, { useState, useEffect } from "react";
import { Icon } from "./ResubleComponents";

const WhatsAppFloatingButton = ({ open, setOpen, unread = 0 }) => {
  const [badgeText, setBadgeText] = useState("");
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (open || unread <= 0) {
      setBadgeText("");
      setShowPulse(false);
      return;
    }

    const texts = [
      `${unread} new message${unread > 1 ? "s" : ""}`,
      "Need help?",
      "Tap for offers 🎁",
      `${unread}+ unread`,
    ];

    let index = 0;

    setBadgeText(texts[0]);
    setShowPulse(true);

    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setBadgeText(texts[index]);
    }, 3500);

    return () => clearInterval(interval);
  }, [open, unread]);

  if (open) return null;

  return (
    <button
      onClick={() => setOpen(true)}
      aria-label="Open WhatsApp chat"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[10000] group">
      {/* Floating Badge */}
      {badgeText && (
        <div
          className={`
            absolute bottom-full right-0 mb-3
            px-3 py-1.5 rounded-xl
            bg-white text-[#111B21]
            text-[12px] font-semibold
            shadow-xl whitespace-nowrap
            border border-gray-100
            ${showPulse ? "animate-bounce" : ""}
          `}>
          {badgeText}

          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
        </div>
      )}

      {/* Glow Ring */}
      {showPulse && unread > 0 && (
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      )}

      {/* Main Button */}
      <div
        className={`
          relative
          w-14 h-14 rounded-full
          bg-[#25D366]
          flex items-center justify-center
          shadow-[0_8px_25px_rgba(37,211,102,0.45)]
          transition-all duration-300
          group-hover:scale-110
          active:scale-95
        `}>
        <Icon name="wa" size={28} className="text-white" />

        {/* Unread Count */}
        {unread > 0 && (
          <span
            className="
              absolute -top-1 -right-1
              min-w-[22px] h-[22px]
              px-1 rounded-full
              bg-[#FF3B30]
              text-white text-[11px]
              font-bold
              flex items-center justify-center
              border-2 border-white
            ">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </div>
    </button>
  );
};

export default React.memo(WhatsAppFloatingButton);
