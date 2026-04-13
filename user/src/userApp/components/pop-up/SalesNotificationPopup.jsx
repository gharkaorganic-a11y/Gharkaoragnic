import React, { useState, useEffect } from "react";
// npm install @heroicons/react
import { XMarkIcon } from "@heroicons/react/24/outline";

const SalesNotificationPopup = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [data] = useState({
    location: "Mumbai",
    productName: "Pisyu Loon Flavoured Salt (6 Flavour Combo), 600g",
    timeAgo: "2 minutes ago",
    image:
      "https://www.farmdidi.com/cdn/shop/files/1._Product_page_1Kg_Traditional_Mango_01.jpg?format=webp&quality=80&v=1766033286&width=450",
  });

  useEffect(() => {
    // 1. Initial delay to show
    const showTimer = setTimeout(() => {
      setShouldRender(true);
      // Small delay to trigger Tailwind transition after mounting
      setTimeout(() => setIsVisible(true), 10);
    }, 3000);

    // 2. Auto-hide timer
    const hideTimer = setTimeout(() => {
      handleClose();
    }, 10000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Remove from DOM after transition finishes (300ms)
    setTimeout(() => setShouldRender(false), 300);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 z-[9999] w-[calc(100%-2rem)] max-w-[400px] sm:w-[380px] 
      transition-all duration-300 ease-out transform
      ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 scale-95"}`}>
      <div className="bg-white shadow-[0_8proux_30px_rgb(0,0,0,0.12)] border border-gray-100 p-4 flex gap-4 relative overflow-hidden">
        {/* Close Button using Heroicons */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors p-1">
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="flex-shrink-0 w-20 h-20 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center border border-gray-50">
          <img
            src={data.image}
            alt="Product"
            className="w-full h-full object-contain p-1"
          />
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-center pr-4">
          <p className="text-[13px] text-gray-600 leading-tight">
            Someone from{" "}
            <span className="font-semibold text-gray-800">
              {data.location || "India"}
            </span>{" "}
            added this product to their...
          </p>

          <h4 className="text-[14px] font-bold text-gray-900 mt-1 line-clamp-2 leading-snug">
            {data.productName}
          </h4>

          <span className="text-[12px] text-gray-400 mt-1 font-medium italic">
            {data.timeAgo}
          </span>
        </div>
      </div>

      {/* Internal CSS for the progress bar animation */}
      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default SalesNotificationPopup;
