import React from "react";

/**
 * CategoryCircleIcon.jsx
 * Vector icons matching Image 3 design for Ghar Ka Organic categories.
 * Pin-sharp on retina screens, scalable, pure white line-art with selective fills.
 */
export const CategoryCircleIcon = ({
  categoryKey,
  className = "w-6 h-6 sm:w-7 sm:h-7",
}) => {
  switch (categoryKey) {
    case "all":
      // All Organic Products: Flour/grain sack with circular organic leaf badge
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          {/* Top gather / tie */}
          <path d="M21 9 L21 6 C21 5 22 4.5 24 4.5 C26 4.5 27 5 27 6 L27 9" />
          <path d="M18 12 C22 13.5 26 13.5 30 12" />
          {/* Sack pouch body */}
          <path d="M16 12 C14 17 12 25 12 34 C12 39 16 41.5 24 41.5 C32 41.5 36 39 36 34 C36 25 34 17 32 12 Z" />
          {/* Organic seal circle */}
          <circle cx="24" cy="27" r="6" strokeWidth="1.8" />
          {/* Leaf inside seal */}
          <path
            d="M21.5 28.5 C21.5 25 25.5 23.5 26 23.5 C26 23.5 26.5 26.5 24 28 C22.8 28.7 21.5 28.5 21.5 28.5 Z"
            fill="currentColor"
            stroke="none"
          />
          <path d="M22.5 27.5 L25 25" stroke="#008060" strokeWidth="1" />
        </svg>
      );

    case "new":
    case "bestseller":
      // Most Loved Products: Heart with sparkles
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          {/* Heart outline */}
          <path d="M24 37 C24 37 12 29.5 12 21 C12 16.5 15.5 13 20 13 C22.5 13 24 14.5 24 14.5 C24 14.5 25.5 13 28 13 C32.5 13 36 16.5 36 21 C36 29.5 24 37 24 37 Z" />
          {/* Big Sparkle Star */}
          <path
            d="M36 8 L37.2 11.8 L41 13 L37.2 14.2 L36 18 L34.8 14.2 L31 13 L34.8 11.8 Z"
            fill="currentColor"
            stroke="none"
          />
          {/* Small Sparkle Star */}
          <path
            d="M40 22 L40.6 23.6 L42 24 L40.6 24.4 L40 26 L39.4 24.4 L38 24 L39.4 23.6 Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );

    case "honey":
      // Pure Pahadi Honey: Jar with honey dipper
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          {/* Jar rim/lid */}
          <rect x="16" y="11" width="16" height="4" rx="2" strokeWidth="2.2" />
          {/* Jar body */}
          <path
            d="M17 15 L15 35 C15 38.5 18 41 24 41 C30 41 33 38.5 33 35 L31 15"
            strokeWidth="2.2"
          />
          {/* Honey level wave inside jar */}
          <path
            d="M16 26 C19 28 22 25.5 26 27 C28.5 28 31 27 32 26"
            strokeWidth="1.8"
          />
          {/* Honey dipper stick */}
          <path d="M31 6 L23 20" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse
            cx="22"
            cy="22"
            rx="3.5"
            ry="2.5"
            transform="rotate(-30 22 22)"
            strokeWidth="1.8"
          />
          {/* Honey drip */}
          <path
            d="M21 27 C21 29 22.2 30.5 22.2 31.5 C22.2 32.3 21.6 33 20.8 33 C20 33 19.5 32.3 19.5 31.5 C19.5 30.5 21 29 21 27 Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );

    case "ghee":
      // Pure Desi Cow Ghee: Traditional bilona pot / handi with tied cloth cover
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          {/* Tied top knob */}
          <path
            d="M21 11 C21 8.5 22.5 7.5 24 7.5 C25.5 7.5 27 8.5 27 11"
            strokeWidth="2"
          />
          {/* Tied cloth cover over rim */}
          <path
            d="M15 15 C19 13.5 29 13.5 33 15 L35 18 C30 19.5 18 19.5 13 18 Z"
            strokeWidth="2.2"
          />
          {/* Handi rounded belly */}
          <path
            d="M16 19 C12 24.5 11 31.5 14 36 C17 40.5 31 40.5 34 36 C37 31.5 36 24.5 32 19"
            strokeWidth="2.2"
          />
          {/* Traditional decorative belly line */}
          <path
            d="M17 25 C21 27 27 27 31 25"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
        </svg>
      );

    case "pickle":
      // Homemade Pahadi Pickles: Glass pickle jar (martaban) with label and chilli
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          {/* Jar lid */}
          <path d="M18 9 L30 9 L30 13 L18 13 Z" strokeWidth="2.2" />
          {/* Jar glass body */}
          <path
            d="M16 13 L32 13 C33 13 34 14 34 15.5 L34 37 C34 40 31.5 41.5 24 41.5 C16.5 41.5 14 40 14 37 L14 15.5 C14 14 15 13 16 13 Z"
            strokeWidth="2.2"
          />
          {/* Label */}
          <rect
            x="18"
            y="21"
            width="12"
            height="12"
            rx="2"
            strokeWidth="1.8"
          />
          {/* Chilli shape on label */}
          <path
            d="M21 25 C24 24.5 27 27 25.5 30.5 C24.5 29.5 23 27.5 21 25 Z"
            fill="currentColor"
            stroke="none"
          />
          <path d="M26 24 C26.8 23 27.5 23.2 27.8 22.5" strokeWidth="1.2" />
        </svg>
      );

    case "spices":
      // Fresh Pahadi Spices: Spice bowl with spices & fresh herbs
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          {/* Spice bowl */}
          <path
            d="M12 25 C12 35 17 39.5 24 39.5 C31 39.5 36 35 36 25 Z"
            strokeWidth="2.2"
          />
          <ellipse cx="24" cy="24" rx="12" ry="3" strokeWidth="2.2" />
          {/* Heap of spices */}
          <path
            d="M17 23 C18 19 21.5 16.5 24 16.5 C26.5 16.5 30 19 31 23"
            strokeWidth="2"
          />
          {/* Leaves / herbs rising */}
          <path
            d="M24 10 C24 13 21.5 14.5 21.5 14.5 C21.5 14.5 24.5 15 25.5 12 Z"
            fill="currentColor"
            stroke="none"
          />
          <path
            d="M24 10 C25.5 12.5 27.5 13 27.5 13 C27.5 13 25.5 14.5 24 12 Z"
            fill="currentColor"
            stroke="none"
          />
          {/* Floating aroma / spice dots */}
          <circle cx="16" cy="14" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="32" cy="13" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );

    case "pahadiSalts":
    case "salt":
      // Pahadi Herbal Salts: Salt shaker dispenser
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          {/* Shaker cap */}
          <path
            d="M20 9 C20 7.5 21.5 6.5 24 6.5 C26.5 6.5 28 7.5 28 9 L28 13 L20 13 Z"
            strokeWidth="2.2"
          />
          {/* Bottle body */}
          <path
            d="M18 13 L30 13 L31 37 C31 40.5 28.5 41.5 24 41.5 C19.5 41.5 17 40.5 17 37 Z"
            strokeWidth="2.2"
          />
          {/* Decorative band */}
          <line x1="18" y1="18" x2="30" y2="18" strokeWidth="1.8" />
          {/* Perforations / dispensing holes */}
          <circle cx="21" cy="27" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="24" cy="25" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="27" cy="27" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="24" cy="30" r="1.3" fill="currentColor" stroke="none" />
          {/* Salt grains outside */}
          <circle cx="34" cy="33" r="1" fill="currentColor" stroke="none" />
          <circle cx="36" cy="36" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );

    case "pahadiDals":
    case "dal":
      // Organic Pahadi Dals: Open dal sack with grains
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          {/* Open burlap sack */}
          <path
            d="M17 17 C15 19 13 25 13 34 C13 39.5 17 41.5 24 41.5 C31 41.5 35 39.5 35 34 C35 25 33 19 31 17 Z"
            strokeWidth="2.2"
          />
          {/* Rolled sack rim */}
          <ellipse cx="24" cy="17" rx="8" ry="3.5" strokeWidth="2.2" />
          {/* Mound of lentils */}
          <path d="M19 16 C21 13.5 27 13.5 29 16" strokeWidth="1.8" />
          {/* Dal lentils falling / spilled */}
          <circle cx="10" cy="38" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="13" cy="40" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="38" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );

    case "chutney":
      // Instant Pahadi Chutney: Mortar and pestle with fresh leaves
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true">
          {/* Mortar bowl */}
          <path
            d="M13 22 L15 36 C15 39.5 18 41.5 24 41.5 C30 41.5 33 39.5 33 36 L35 22 Z"
            strokeWidth="2.2"
          />
          <path
            d="M11.5 22 C11.5 20.8 14 19.5 24 19.5 C34 19.5 36.5 20.8 36.5 22"
            strokeWidth="2.2"
          />
          {/* Pestle grinder handle */}
          <path d="M29 8 L22 23" strokeWidth="3.2" strokeLinecap="round" />
          {/* Mint / coriander leaves */}
          <path
            d="M17 18 C14.5 15 16.5 12 19.5 13 C19.5 16 18 17 17 18 Z"
            fill="currentColor"
            stroke="none"
          />
          <path
            d="M26 14 C28.8 12 31.8 13.5 31 16.5 C28 16.5 27 15 26 14 Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );

    default:
      return null;
  }
};

export default CategoryCircleIcon;

