import React from "react";

const DEFAULT_ITEMS = [
  { message: "Buy 3 Get 3 Gifts" },
  { message: "Extra 3% Off on Prepaid orders" },
  { message: "Buy 2 Get Freeshipping" },
  { message: "Buy 6 Get Tote bag Free" },
  { message: "Offers automatically applied at checkout" },
];

const PromotionalNavbar = ({ items = DEFAULT_ITEMS, speed = 25 }) => {
  const looped = [...items, ...items, ...items]; // Using 3x for smoother continuous loop
  const duration = `${items.length * speed}s`;

  return (
    <>
      <style>{`
        @keyframes scroll-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }

        .promo-track {
          display: flex;
          width: max-content;
          animation: scroll-x ${duration} linear infinite;
        }

        .promo-track:hover {
          animation-play-state: paused;
        }

        .promo-text b {
          font-weight: 700;
        }
      `}</style>

      {/* Background Color: #F39C12 (Vibrant Orange) */}
      <div className="w-full overflow-hidden bg-[#F39C12] border-y border-black/10">
        <div className="h-[40px] flex items-center w-full">
          <div className="promo-track">
            {looped.map((item, i) => (
              <div
                key={i}
                className="promo-text flex items-center whitespace-nowrap px-8 text-[13px] font-medium text-[#2D2D2D] tracking-tight">
                {/* Logic to bold numbers or specific words like in the image */}
                <span
                  dangerouslySetInnerHTML={{
                    __html: item.message.replace(
                      /(\d+%?|Get|Prepaid|at checkout|Tote bag Free)/g,
                      "<b>$1</b>",
                    ),
                  }}
                />

                {/* Separator Pipe: Darker shade or black with low opacity */}
                <span className="ml-8 text-[#2D2D2D]/40 font-light">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(PromotionalNavbar);
