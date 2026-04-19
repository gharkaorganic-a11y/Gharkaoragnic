import React from "react";

const ResponsiveBanner = ({
  desktopImage,
  mobileImage,
  alt, // Don't default this - force meaningful alt for SEO
  className = "",
  priority = true, // true for above-the-fold banners
}) => {
  if (!alt) {
    console.warn("ResponsiveBanner: alt prop is required for SEO");
  }

  return (
    <picture className={`block w-full overflow-hidden ${className}`}>
      {/* Mobile: < 640px */}
      <source
        media="(max-width: 640px)"
        srcSet={mobileImage}
        width={1200}
        height={400}
      />
      {/* Tablet: 641px - 1024px - uses desktop img but we hint the size */}
      <source
        media="(max-width: 1024px)"
        srcSet={desktopImage}
        width={1500}
        height={500}
      />
      {/* Desktop: > 1024px */}
      <img
        src={desktopImage}
        alt={alt || "Banner"}
        className="w-full h-auto object-cover object-center"
        width={1500}
        height={500}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        style={{ aspectRatio: "3 / 1" }} // Fallback + prevents CLS
      />
    </picture>
  );
};

export default ResponsiveBanner;
