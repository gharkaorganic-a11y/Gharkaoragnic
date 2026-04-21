import React from "react";

const RunningPromotionalBanner = ({ speed = 20 }) => {
  const messages = [
    "FREE SHIPPING ON ORDERS ABOVE ₹350 • A2 DESI GHEE • RAW HONEY • PHAADI PICKLES",
    "100% NATURAL • NO PRESERVATIVES • DIRECT FROM FARMERS • GHAR KA ORGANIC",
  ];

  const loopedItems = Array(6).fill(messages).flat();
  const duration = `${speed}s`;

  return (
    <>
      <style>{`
        @keyframes scroll-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .promo-track {
          display: flex;
          width: max-content;
          animation: scroll-x ${duration} linear infinite;
        }

        .promo-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full bg-green-600 text-white border-b border-white/10 flex items-center h-[34px] overflow-hidden relative">
        {/* LEFT SOCIAL ICONS */}
        <div className="flex items-center space-x-5 px-5 h-full bg-green-600 z-10 relative shadow-[10px_0_15px_-5px_rgba(21,128,61,0.8)]">
          <a
            href="https://facebook.com/gharkaorganic"
            className="hover:opacity-80 transition"
            aria-label="Facebook">
            <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>

          <a
            href="https://instagram.com/gharkaorganic"
            className="hover:opacity-80 transition"
            aria-label="Instagram">
            <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
            </svg>
          </a>
        </div>

        {/* RUNNING TEXT */}
        <div className="flex-1 overflow-hidden">
          <div className="promo-track">
            {loopedItems.map((text, i) => (
              <div
                key={i}
                className="flex items-center whitespace-nowrap px-6 text-[12px] font-medium tracking-wide uppercase">
                {text}
                <span className="ml-10 text-white/40">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(RunningPromotionalBanner);
