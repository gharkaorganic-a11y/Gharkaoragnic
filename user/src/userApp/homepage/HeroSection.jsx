import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroSection = ({ desktopSlides = [], mobileSlides = [] }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const slides =
    isMobile && mobileSlides.length > 0 ? mobileSlides : desktopSlides;

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-[200px] sm:h-80 md:h-[460px]  lg:h-[560px] overflow-hidden bg-gray-100 ">
      {/* Slides */}
      {slides.map((slide, i) => (
        <img
          key={i}
          src={slide}
          alt={`Banner ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            i === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent z-10" />

      {/* Controls */}
      {slides.length > 1 && (
        <>
          {/* Left */}
          <button
            onClick={() =>
              setIndex((index - 1 + slides.length) % slides.length)
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 
            bg-white/70 backdrop-blur-md hover:bg-yellow-100 
            text-gray-800 p-2.5 rounded-full shadow-md transition">
            <ChevronLeft size={20} />
          </button>

          {/* Right */}
          <button
            onClick={() => setIndex((index + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 
            bg-white/70 backdrop-blur-md hover:bg-yellow-100 
            text-gray-800 p-2.5 rounded-full shadow-md transition">
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-yellow-400" : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSection;
