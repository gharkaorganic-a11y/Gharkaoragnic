import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroSection = ({ desktopSlides = [], mobileSlides = [] }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [index, setIndex] = useState(0);

  // ✅ Detect screen size properly
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen(); // run once
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // ✅ Choose slides safely
  const currentSlides =
    isMobile && mobileSlides.length > 0 ? mobileSlides : desktopSlides;

  const length = currentSlides.length;

  const nextSlide = () => setIndex((prev) => (prev + 1) % length);

  const prevSlide = () => setIndex((prev) => (prev - 1 + length) % length);

  // ✅ Auto slide
  useEffect(() => {
    if (length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [length]);

  // ✅ Reset index if slides change
  useEffect(() => {
    setIndex(0);
  }, [isMobile]);

  if (length === 0) return null;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {" "}
      {/* Slides */}
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
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        </div>
      ))}
      {/* ⬅️➡️ Arrows */}
      {length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition">
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition">
            <ChevronRight size={20} />
          </button>
        </>
      )}
      {/* 🔘 Dots */}
      {length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {currentSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-[#c8102e]" : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSection;
