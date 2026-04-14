import React, { useEffect, useState } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/solid";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed z-50 flex items-center justify-center
        bottom-[90px] left-4 sm:bottom-6 sm:left-6
        w-10 h-10 sm:w-11 sm:h-11 rounded-full
        
        bg-[#c8102e] text-white shadow-md
        
        transition-all duration-300
        
        hover:bg-[#a50d25]
        active:scale-95
        
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }
      `}>
      <ArrowUpIcon className="w-5 h-5" />
    </button>
  );
};

export default React.memo(ScrollToTopButton);
