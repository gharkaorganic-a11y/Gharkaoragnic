import React from "react";

const SectionBanner = ({
  title = "Frequently Bought Pickles",
  className = "",
}) => {
  return (
    <div className={`w-full flex justify-center px-4 ${className}`}>
      <div className="w-full max-w-lg rounded-2xl border border-[#d6e8d8] bg-white px-5 py-4 shadow-sm">
        <div className="flex w-full items-center justify-center">
          <h2 className="text-center font-sans text-lg font-semibold tracking-wide text-[#263329] sm:text-xl md:text-2xl">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SectionBanner;
