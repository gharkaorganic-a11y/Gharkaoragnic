import React from "react";

const ResponsiveBanner = ({
  desktopImage,
  mobileImage,
  alt = "banner",
  onClick,
  className = "",
}) => {
  return (
    <div className={`w-full overflow-hidden ${className}`} onClick={onClick}>
      {/* Desktop */}
      <img
        src={desktopImage}
        alt={alt}
        className="hidden md:block w-full object-cover"
      />

      {/* Mobile */}
      <img
        src={mobileImage || desktopImage}
        alt={alt}
        className="block md:hidden w-full object-cover"
      />
    </div>
  );
};

export default ResponsiveBanner;
