import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Normalise slide entries so rest of component always works with { src, alt }
const normalise = (slides, label) =>
  slides.map((s, i) =>
    typeof s === "string" ? { src: s, alt: `${label} — slide ${i + 1}` } : s,
  );

const useIsMobile = () => {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
};

const HeroSection = ({ desktopSlides = [], mobileSlides = [] }) => {
  const isMobile = useIsMobile();
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  // Normalise once per prop change — stable reference for effect deps
  const slides = useMemo(() => {
    const raw =
      isMobile && mobileSlides.length > 0 ? mobileSlides : desktopSlides;
    return normalise(raw, "Ghar Ka Organic");
  }, [isMobile, desktopSlides, mobileSlides]);

  const total = slides.length;

  const goTo = useCallback((i) => setIndex((i + total) % total), [total]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);
  const next = useCallback(() => goTo(index + 1), [index, goTo]);

  // Auto-play — restart only when slides list changes
  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [total]);

  // Pause on hover
  const pauseTimer = () => clearInterval(timerRef.current);
  const resumeTimer = () => {
    if (total <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 5000);
  };

  if (total === 0) return null;

  return (
    <div
      className="relative w-full h-[200px] sm:h-80 md:h-[460px] lg:h-[560px] overflow-hidden bg-[#f5ede0]"
      role="region"
      aria-label="Homepage banner"
      aria-roledescription="carousel"
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}>
      {/* ── SLIDES ── */}
      {slides.map(({ src, alt }, i) => (
        <img
          key={src} // stable key — not index
          src={src}
          alt={alt}
          role="img"
          aria-hidden={i !== index}
          // LCP optimisations for first image
          loading={i === 0 ? "eager" : "lazy"}
          fetchpriority={i === 0 ? "high" : "low"}
          decoding={i === 0 ? "sync" : "async"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 will-change-opacity ${
            i === index ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          // Remove scale — causes composite-layer jank on mobile
        />
      ))}

      {/* ── GRADIENT OVERLAY ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent z-10 pointer-events-none"
      />

      {/* ── SLIDE COUNTER (screen-reader live region) ── */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Slide {index + 1} of {total}: {slides[index]?.alt}
      </div>

      {/* ── CONTROLS ── */}
      {total > 1 && (
        <>
          {/* Prev */}
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20
              bg-white/70 backdrop-blur-md hover:bg-yellow-100 active:scale-95
              text-gray-800 p-2 sm:p-2.5 rounded-full shadow-md transition-all duration-200
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400">
            <ChevronLeft size={20} aria-hidden="true" />
          </button>

          {/* Next */}
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20
              bg-white/70 backdrop-blur-md hover:bg-yellow-100 active:scale-95
              text-gray-800 p-2 sm:p-2.5 rounded-full shadow-md transition-all duration-200
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400">
            <ChevronRight size={20} aria-hidden="true" />
          </button>

          {/* Dots */}
          <div
            role="tablist"
            aria-label="Select slide"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map(({ alt }, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to slide ${i + 1}: ${alt}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400 ${
                  i === index
                    ? "w-6 bg-yellow-400"
                    : "w-2 bg-white/60 hover:bg-white/90"
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
