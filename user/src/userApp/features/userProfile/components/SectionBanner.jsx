import React from "react";

const SectionBanner = ({
  title = "Frequently Bought Pickles",
  className = "",
}) => {
  return (
    <div className={`w-full flex justify-center px-4 ${className}`}>
      {/* Outer Border (Green) - Achieved via background color + padding */}
      <div className="w-full max-w-lg p-[2px] bg-green-600 rounded-xl shadow-sm">
        {/* Inner Background (Green) + White Border */}
        <div className="w-full bg-green-500 border-[3px] border-white rounded-[10px] px-6 py-3 flex justify-center items-center">
          {/* Text Content */}
          <h2 className="text-black font-extrabold text-lg sm:text-xl md:text-2xl tracking-wide text-center">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SectionBanner;
