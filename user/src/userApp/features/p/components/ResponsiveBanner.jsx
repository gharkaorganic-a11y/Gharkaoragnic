import React from "react";

const ResponsiveBanner = ({
  desktopImage,
  mobileImage,
  alt = "Collection Banner",
  className = "",
}) => {
  return (
    <picture className={`block w-full ${className}`}>
      <source media="(max-width: 768px)" srcSet={mobileImage} />
      <img
        src={desktopImage}
        alt={alt}
        className="w-full h-auto object-cover object-center aspect-[3/1] md:aspect-[15/5]"
        loading="eager"
        fetchPriority="high"
        width={1500}
        height={500}
      />
    </picture>
  );
};

export default ResponsiveBanner;
