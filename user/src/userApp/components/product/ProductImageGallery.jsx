import React, { useState, useRef } from "react";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import FullScreenViewer from "../view/FullScreenImageViewer";

const ProductImageGallery = ({ images = [], productName = "Product" }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const openFullScreen = (index) => {
    setActiveIndex(index);
    setIsFullScreen(true);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleMobileScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, offsetWidth } = scrollContainerRef.current;
      const currentIndex = Math.round(scrollLeft / offsetWidth);
      if (currentIndex !== mobileActiveIndex) {
        setMobileActiveIndex(currentIndex);
      }
    }
  };

  if (!images?.length) return null;

  return (
    <>
      <div className="w-full relative">
        {/* ── DESKTOP: Thumbnail Sidebar + Main Image ── */}
        <div className="hidden lg:flex gap-4 w-full h-[500px]">
          {/* Vertical Thumbnails */}
          <div className="flex flex-col gap-3 w-20 overflow-y-auto no-scrollbar py-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative aspect-square w-full rounded-sm overflow-hidden border-2 transition-all ${
                  activeIndex === i
                    ? "border-orange-500 shadow-md"
                    : "border-gray-100 hover:border-gray-300"
                }`}>
                <img
                  src={img}
                  alt={`Thumb ${i}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Image Area */}
          <div
            className="relative flex-1 bg-white  overflow-hidden cursor-zoom-in group border border-gray-100 "
            onClick={() => openFullScreen(activeIndex)}>
            <img
              src={images[activeIndex]}
              alt={productName}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50">
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50">
              <ChevronRight size={24} className="text-gray-700" />
            </button>

            {/* Top Right Zoom Button */}
            <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-md shadow-md text-gray-600">
              <ZoomIn size={20} />
            </div>
          </div>
        </div>

        {/* ── MOBILE: Full-bleed Swipe Carousel ── */}
        <div className="lg:hidden relative -mx-4 sm:mx-0">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
            onScroll={handleMobileScroll}>
            {images.map((img, i) => (
              <div
                key={i}
                className="w-full flex-shrink-0 snap-center aspect-square bg-white relative"
                onClick={() => openFullScreen(i)}>
                <img
                  src={img}
                  alt={`${productName} view ${i + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>

          {/* Mobile Image Counter Pill */}
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-widest pointer-events-none">
            {mobileActiveIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Fullscreen viewer */}
      {isFullScreen && (
        <FullScreenViewer
          images={images}
          activeIndex={activeIndex}
          onImageChange={setActiveIndex}
          onClose={() => setIsFullScreen(false)}
        />
      )}
    </>
  );
};

export default ProductImageGallery;
