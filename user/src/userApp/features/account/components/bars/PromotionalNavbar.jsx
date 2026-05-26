import React from "react";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

const RunningPromotionalBanner = ({ speed = 25 }) => {
  // Simplified, high-impact messaging
  const messages = [
    "ENJOY FREE SHIPPING ON ALL PREPAID ORDERS",
    "A2 DESI GHEE • RAW HONEY • FARM FRESH PICKLES",
    "100% NATURAL • DIRECT FROM FARMERS",
  ];

  // Flattening ensures continuous scroll loop
  const loopedItems = Array(8).fill(messages).flat();

  return (
    <>
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .promo-track-container {
          display: flex;
          width: max-content;
          animation: marquee-scroll var(--marquee-speed, 25s) linear infinite;
          will-change: transform;
        }

        .promo-track-container:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* SOLID BRAND GREEN BACKGROUND */}
      <div
        style={{ "--marquee-speed": `${speed}s` }}
        className="w-full bg-[#009762] text-white h-10 flex items-center overflow-hidden select-none">
        {/* LEFT SIDE: SOCIAL MEDIA LINKS (With matching vertical separator) */}
        <div className="flex items-center gap-5 px-5 h-full border-r border-[#006e47] z-20 shrink-0 bg-[#009762]">
          <a
            href="https://facebook.com/gharkaorganic"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="hover:opacity-80 transition-opacity duration-200 focus:outline-none">
            <FaFacebookF className="text-white w-3.5 h-3.5" />
          </a>

          <a
            href="https://instagram.com/gharkaorganic"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="hover:opacity-80 transition-opacity duration-200 focus:outline-none">
            <FaInstagram className="text-white w-4 h-4" />
          </a>
        </div>

        {/* RIGHT SIDE: CONTINUOUS SCROLLING TEXT TRACK */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center z-10">
          <div className="promo-track-container">
            {loopedItems.map((text, i) => (
              <div
                key={i}
                className="flex items-center whitespace-nowrap px-8 text-[11px] sm:text-[12px] md:text-[13px] font-medium tracking-widest uppercase text-white/95">
                {text}
                {/* Minimalist vertical pipe separator instead of glowing dots */}
                <span className="ml-16 text-[#006e47] text-sm">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(RunningPromotionalBanner);
