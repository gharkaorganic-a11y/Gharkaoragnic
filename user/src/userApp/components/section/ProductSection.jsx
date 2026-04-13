import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../cards/ProductCard";

const ProductSection = ({
  title,
  subtitle,
  products = [],
  loading = false,
  themeColor = "",
  buttonClass = "bg-red-500 text-white hover:bg-red-600",
}) => {
  const navigate = useNavigate();

  const safeProducts = Array.isArray(products) ? products : [];
  console.log(safeProducts);
  const visibleProducts = useMemo(() => {
    return safeProducts.slice(0, 4);
  }, [safeProducts]);

  // ✅ SAFE: after hooks
  if (!loading && safeProducts.length === 0) return null;

  return (
    <section
      style={{ backgroundColor: themeColor || "#ffffff" }}
      className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8 py-6 md:py-10">
      {/* Header */}
      <div className="text-center mb-6 md:mb-10">
        {title && (
          <h2 className="text-[18px] sm:text-[22px] md:text-[26px] font-semibold text-gray-900">
            {title}
          </h2>
        )}

        {subtitle && (
          <p className="mt-2 text-[13px] sm:text-[15px] text-gray-600">
            {subtitle}
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-[3/4] bg-gray-100 rounded-md" />
                <div className="h-3 bg-gray-200 w-3/4 mt-3 mx-auto" />
                <div className="h-3 bg-gray-200 w-1/2 mt-2 mx-auto" />
              </div>
            ))
          : visibleProducts.map((product) => (
              <div key={product.id || product.name} className="w-full">
                <ProductCard product={product} />
              </div>
            ))}
      </div>

      {/* Button */}
      {!loading && safeProducts.length > 4 && (
        <div className="mt-8 md:mt-12 flex justify-center">
          <button
            onClick={() => navigate("/products")}
            className={`px-6 py-2.5 text-[12px] sm:text-[13px] font-semibold rounded-md transition ${buttonClass}`}>
            VIEW COLLECTION
          </button>
        </div>
      )}
    </section>
  );
};

export default React.memo(ProductSection);
