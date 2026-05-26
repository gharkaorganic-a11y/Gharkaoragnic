import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const WHATSAPP_NUMBER = "919897447525";

const WhatsAppFooterBar = () => {
  const [visible, setVisible] = useState(true);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hi! 👋 I want to order from Ghar Ka Organic. Please share your best products & offers.",
    );

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "whatsapp_footer_click", {
        event_category: "engagement",
        event_label: "footer_cta",
      });
    }

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes slide-up-simple {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up-simple {
          animation: slide-up-simple 0.3s ease-out forwards;
        }
      `}</style>

      {/* MATCHING THE UPLOADED IMAGE: Solid Flat Green Background */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#009762] text-white animate-slide-up-simple select-none shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          {/* Constrain height to match the sleek look of the image */}
          <div className="flex items-center justify-between h-10 sm:h-12">
            {/* SPACING ELEMENT (Keeps text centered) */}
            <div className="w-8 shrink-0"></div>

            {/* CENTERED INTERACTIVE TEXT */}
            <button
              onClick={handleWhatsAppClick}
              className="flex-1 flex items-center justify-center gap-1.5 focus:outline-none group">
              <span className="text-[13px] sm:text-[15px] font-medium tracking-wide text-white group-hover:underline flex items-center gap-2">
                Order Directly on WhatsApp | 🪙 WhatsApp Orders →
              </span>
            </button>

            {/* CLOSE BUTTON (Right aligned) */}
            <button
              onClick={() => setVisible(false)}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/10 focus:outline-none transition shrink-0"
              aria-label="Dismiss bar">
              <XMarkIcon className="w-5 h-5 text-white/90 hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsAppFooterBar;
