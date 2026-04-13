import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroSection = ({ desktopSlides = [], mobileSlides = [] }) => {
  // 1. Determine length based on device to avoid "empty" slides
  // We check window width or pass isMobile as a prop
  const isMobileView = window.innerWidth < 768;
  const currentSlides = isMobileView ? mobileSlides : desktopSlides;
  const length = currentSlides.length;

  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + length) % length);

  useEffect(() => {
    if (length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [length]);

  if (length === 0) return null;

  return (
    <div className="relative w-full h-[45vh] md:h-[70vh] overflow-hidden bg-[#FAFAFA] group">
      {/* 2. Map only through the slides available for the current device */}
      {currentSlides.map((slideUrl, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}>
          <div
            className={`w-full h-full transform transition-transform ease-out ${
              i === index
                ? "scale-105 duration-[6000ms]"
                : "scale-100 duration-0"
            }`}>
            <img
              src={slideUrl}
              alt={`Banner ${i + 1}`}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      ))}

      {/* Arrows and Dots logic remains the same, using 'length' */}
    </div>
  );
};

export default HeroSection;
