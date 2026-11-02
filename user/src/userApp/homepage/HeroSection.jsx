import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const desktopSlides = [
  {
    image: "/banner/pahadiseid.png",
    alt: "Ghar Ka Organic Himalayan product range",
    href: "/all-products",
  },
  {
    image: "/banner/himlayanbanner.png",
    alt: "Himalayan products from Ghar Ka Organic",
    href: "/all-products",
  },
  {
    image: "/banner/pahadipickle.png",
    alt: "Traditional Pahadi pickles from Ghar Ka Organic",
    href: "/buy-mango-pickle-online",
  },
  {
    image: "/banner/natural.png",
    alt: "Natural Himalayan food products from Ghar Ka Organic",
    href: "/all-products",
  },
];

const HeroSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % desktopSlides.length);
    }, 5500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      aria-label="Featured products"
      aria-roledescription="carousel"
      className="w-full overflow-hidden">
      <div className="relative h-[200px] w-full bg-[#f7f3e8] sm:h-[clamp(280px,41.7vw,600px)]">
        {desktopSlides.map((slide, index) => (
          <Link
            key={slide.image}
            to={slide.href}
            aria-label={slide.alt}
            aria-hidden={activeSlide !== index}
            tabIndex={activeSlide === index ? 0 : -1}
            className={`block transition-opacity duration-500 ${
              activeSlide === index
                ? "absolute inset-0 opacity-100"
                : "pointer-events-none absolute inset-0 opacity-0"
            }`}>
            <img
              src={slide.image}
              alt={slide.alt}
              fetchPriority={index === 0 ? "high" : "auto"}
              className="h-full w-full object-cover object-center"
            />
          </Link>
        ))}

        <div
          className="absolute inset-x-0 bottom-4 flex justify-center gap-2"
          role="group"
          aria-label="Choose featured banner">
          {desktopSlides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Show banner ${index + 1}`}
              aria-current={activeSlide === index ? "true" : undefined}
              className={`h-2.5 rounded-full border border-white/80 shadow-sm transition-all ${
                activeSlide === index
                  ? "w-6 bg-white"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
