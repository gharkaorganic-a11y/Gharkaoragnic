import React from "react";

const RunningPromotionalBanner = ({ speed = 25 }) => {
  const messages = [
    "OFF ABOVE ₹3000",
    "EXTRA 2% OFF ON ALL PREPAID ORDERS",
    "CASH ON DELIVERY AVAILABLE",
    "DELIVERY CHARGES CONFIRMED WITH YOU ON WHATSAPP",
    "100% PURE HIMALAYAN ORGANIC",
  ];

  const loopedItems = [...messages, ...messages];

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

        @media (prefers-reduced-motion: reduce) {
          .promo-track-container {
            animation: none;
          }
        }
      `}</style>

      <div
        style={{
          "--marquee-speed": `${speed}s`,
          backgroundColor: "var(--storefront-announcement-color, #009762)",
        }}
        className="flex h-8 sm:h-9 w-full select-none items-center overflow-hidden text-white">
        <div className="relative flex h-full w-full items-center overflow-hidden">
          <div className="promo-track-container">
            {loopedItems.map((text, i) => (
              <div
                key={i}
                className="flex items-center whitespace-nowrap px-6 text-[10px] font-semibold tracking-[0.1em] text-white sm:px-8 sm:text-[11px] md:text-xs">
                {text}
                <span className="ml-8 text-white/80 sm:ml-12" aria-hidden="true">
                  ✦
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(RunningPromotionalBanner);
