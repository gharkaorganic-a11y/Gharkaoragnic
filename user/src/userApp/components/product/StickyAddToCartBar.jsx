import React, { useState, useEffect } from "react";
import { Minus, Plus, ChevronDown, Loader2 } from "lucide-react";

const StickyAddToCartBar = ({
  product,
  selectedSize,
  setSelectedSize,
  quantity = 1,
  setQuantity,
  onAddToCart,
  isAdding = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let observer = null;
    let fallbackHandler = null;

    const setupObserver = () => {
      const mainBtn = document.getElementById("main-add-to-cart");

      if (mainBtn && "IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          ([entry]) => {
            // Only show sticky bar when user has scrolled DOWN past the main Add to Cart button
            const isScrolledPast = entry.boundingClientRect.top < 0;
            setIsVisible(!entry.isIntersecting && isScrolledPast);
          },
          {
            root: null,
            threshold: 0,
          }
        );
        observer.observe(mainBtn);
      } else {
        // Fallback if main button element is not yet in DOM or observer not supported
        fallbackHandler = () => {
          setIsVisible(window.scrollY > 600);
        };
        window.addEventListener("scroll", fallbackHandler, { passive: true });
        fallbackHandler();
      }
    };

    // Slight delay to allow DOM render of main button
    const timer = setTimeout(setupObserver, 150);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
      if (fallbackHandler) {
        window.removeEventListener("scroll", fallbackHandler);
      }
    };
  }, [product?.id]);

  if (!product) return null;

  const price = Number(product.price || 0);
  const formattedPrice = price.toLocaleString("en-IN");
  const stock = Number(product.stock ?? 10);
  const isOutOfStock = stock === 0;

  const productImage =
    product.banner ||
    (Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "");

  const sizes =
    Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes
      : [];

  const handleSizeChange = (e) => {
    if (setSelectedSize) {
      setSelectedSize(e.target.value);
    }
  };

  const handleDecrement = () => {
    if (setQuantity) {
      setQuantity((prev) => Math.max(1, prev - 1));
    }
  };

  const handleIncrement = () => {
    if (setQuantity) {
      setQuantity((prev) => Math.min(stock, prev + 1));
    }
  };

  return (
    <div
      aria-label="Sticky Add to Cart Bar"
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}>
      <div className="mx-auto max-w-[1450px] px-3 py-2 sm:px-7 sm:py-3.5 lg:px-10">
        <div className="flex items-center justify-between gap-2.5 sm:gap-6">
          {/* ── LEFT: Product Image + Product Title + Mobile Price/Variant ── */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            {productImage ? (
              <img
                src={productImage}
                alt={product.name || "Product image"}
                className="h-9 w-9 sm:h-12 sm:w-12 shrink-0 rounded-lg border border-gray-100 bg-[#faf9f5] object-contain p-0.5 sm:p-1"
                loading="lazy"
              />
            ) : (
              <div className="h-9 w-9 sm:h-12 sm:w-12 shrink-0 rounded-lg border border-gray-100 bg-gray-50" />
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs sm:text-[15px] font-medium text-gray-800 leading-tight">
                {product.name}
                <span className="hidden sm:inline font-normal text-gray-500">
                  {" "}
                  | Ghar Ka Organic
                </span>
              </p>

              {/* Mobile-only Price / Size selector under title */}
              <div className="sm:hidden mt-0.5 flex items-center gap-1.5">
                {sizes.length > 1 ? (
                  <div className="relative inline-flex items-center">
                    <select
                      value={selectedSize || sizes[0]}
                      onChange={handleSizeChange}
                      aria-label="Select size variant"
                      className="appearance-none bg-gray-100 text-[11px] font-semibold text-gray-800 rounded pl-1.5 pr-4 py-0.5 border border-gray-200/70 focus:outline-none cursor-pointer">
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size} • ₹{formattedPrice}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={10}
                      className="pointer-events-none absolute right-1 text-gray-500"
                    />
                  </div>
                ) : (
                  <p className="text-xs font-bold text-gray-900">
                    ₹ {formattedPrice}
                    {selectedSize && (
                      <span className="text-[11px] font-normal text-gray-500 ml-1">
                        ({selectedSize})
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Controls ── */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
            {/* Desktop Variant / Size Dropdown */}
            <div className="hidden sm:block">
              {sizes.length > 0 ? (
                <div className="relative">
                  <select
                    value={selectedSize || sizes[0]}
                    onChange={handleSizeChange}
                    aria-label="Select product size variant"
                    className="h-10 sm:h-11 appearance-none rounded-lg border border-gray-200 bg-white pl-3.5 pr-8 text-xs sm:text-sm font-medium text-gray-700 shadow-2xs hover:border-gray-300 focus:border-[#315c3c] focus:outline-none focus:ring-1 focus:ring-[#315c3c] cursor-pointer transition-colors">
                    {sizes.map((size) => (
                      <option key={size} value={size}>
                        {size} - ₹ {formattedPrice}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                </div>
              ) : (
                <div className="h-10 sm:h-11 flex items-center rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 text-xs sm:text-sm font-medium text-gray-700">
                  Standard - ₹ {formattedPrice}
                </div>
              )}
            </div>

            {/* Quantity Stepper */}
            <div className="flex h-9 sm:h-11 items-center rounded-lg border border-gray-200 bg-white shadow-2xs">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1 || isOutOfStock}
                aria-label="Decrease quantity"
                className="flex h-full w-7 sm:w-9 items-center justify-center text-gray-500 hover:text-gray-900 transition hover:bg-gray-50 rounded-l-lg disabled:opacity-30 disabled:cursor-not-allowed">
                <Minus size={13} />
              </button>

              <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-bold sm:font-semibold text-gray-800 select-none">
                {quantity}
              </span>

              <button
                type="button"
                onClick={handleIncrement}
                disabled={quantity >= stock || isOutOfStock}
                aria-label="Increase quantity"
                className="flex h-full w-7 sm:w-9 items-center justify-center text-gray-500 hover:text-gray-900 transition hover:bg-gray-50 rounded-r-lg disabled:opacity-30 disabled:cursor-not-allowed">
                <Plus size={13} />
              </button>
            </div>

            {/* Add To Cart Button */}
            <button
              type="button"
              onClick={onAddToCart}
              disabled={isAdding || isOutOfStock}
              className={`h-9 sm:h-11 px-3.5 sm:px-7 rounded-xl sm:rounded-2xl font-medium text-xs sm:text-sm tracking-wide text-white shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                isOutOfStock
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-[#e54833] hover:bg-[#cf3a25] cursor-pointer"
              }`}>
              {isAdding ? (
                <>
                  <Loader2 size={15} className="animate-spin text-white" />
                  <span>Adding...</span>
                </>
              ) : isOutOfStock ? (
                <span>Out Of Stock</span>
              ) : (
                <span>Add To Cart</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyAddToCartBar;
