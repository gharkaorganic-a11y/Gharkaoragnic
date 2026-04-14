import React from "react";

const DEFAULT_ITEMS = [
  { message: "Buy 3 Get 3 Free Gifts" },
  { message: "Extra 3% Off on Prepaid Orders" },
  { message: "Free Shipping on 2+ Items" },
  { message: "Free Tote Bag on 6 Items" },
  { message: "Offers Applied Automatically at Checkout" },
];

const PromotionalNavbar = ({ items = DEFAULT_ITEMS, speed = 22 }) => {
  const looped = [...items, ...items];
  const duration = `${items.length * speed}s`;

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

      <div className="w-full overflow-hidden bg-[#c8102e] text-white border-b border-white/10">
        <div className="h-[36px] flex items-center">
          <div className="promo-track">
            {looped.map((item, i) => (
              <div
                key={i}
                className="flex items-center whitespace-nowrap px-6 text-[12.5px] font-medium tracking-wide">
                {/* Text */}
                <span
                  dangerouslySetInnerHTML={{
                    __html: item.message.replace(
                      /(\d+%?|Free|Get|Prepaid|Shipping|Tote Bag)/g,
                      "<b class='font-semibold'>$1</b>",
                    ),
                  }}
                />

                {/* Divider */}
                <span className="ml-6 text-white/40">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(PromotionalNavbar);
