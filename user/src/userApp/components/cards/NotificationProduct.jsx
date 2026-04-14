import React, { useEffect, useState } from "react";
import { X, Check } from "lucide-react";

const NotificationProduct = ({
  productName = "",
  image,
  subtitle = "Added to cart successfully",
  onClose,
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
    }, 100);

    const hideTimer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      onClose?.();
    }, 250);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 z-[9999] w-[calc(100%-2rem)] max-w-[420px]
      transition-all duration-300 ease-out transform
      ${
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-8 scale-95"
      }`}>
      <div className="bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.12)] rounded-xl p-4 flex gap-4 relative overflow-hidden">
        {/* Icon / Image */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-emerald-50 flex items-center justify-center flex-shrink-0 border border-emerald-100">
          {image ? (
            <img
              src={image}
              alt={productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <Check className="text-emerald-600" size={22} />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center pr-6">
          {/* Title */}
          <h4 className="text-[14px] font-semibold text-gray-900 line-clamp-2">
            {productName}
          </h4>

          {/* Subtitle */}
          <p className="text-[12px] text-gray-500 mt-1">{subtitle}</p>
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificationProduct;
