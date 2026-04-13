import React from "react";

const ProductStorySection = () => {
  const badges = [
    {
      image:
        "https://www.farmdidi.com/cdn/shop/files/USP.jpg?v=1767697893&width=1100",
      label: "Hygenically Handmade",
    },
    {
      image: "/images/premium.png",
      label: "Premium Ingredients",
    },
    {
      image: "/images/sundried.png",
      label: "Sun Dried in Barnis",
    },
    {
      image: "/images/nochemicals.png",
      label: "No Chemical Preservatives",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 space-y-16 font-sans">
      {/* 1. BADGES SECTION */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center space-y-4">
            <div className="relative w-24 h-24 rounded-full border-2 border-black flex items-center justify-center bg-white shadow-sm p-3">
              <img
                src={badge.image}
                alt={badge.label}
                className="w-full h-full object-contain"
              />

              {/* Optional "No" cross mark */}
              {badge.label.includes("No") && (
                <div className="absolute bottom-1 right-1 bg-white rounded-full">
                  <span className="text-red-600 font-bold text-lg">✕</span>
                </div>
              )}
            </div>

            <p className="font-bold text-gray-800 text-lg leading-tight max-w-[150px]">
              {badge.label}
            </p>
          </div>
        ))}
      </div>

      {/* 2. CHALKBOARD SECTION */}
      <div className="relative pt-10">
        <div className="relative mx-auto max-w-4xl bg-[#1e1e1e] border-[14px] border-[#c08e5d] rounded-sm shadow-2xl p-8 md:p-20 min-h-[320px] flex items-center justify-center">
          <div className="text-center z-10">
            <h2 className="text-white text-3xl md:text-5xl font-bold tracking-wide flex flex-wrap justify-center items-center gap-x-4">
              <span className="text-[#fff9e6] drop-shadow-md">
                My Secret Ingredient is
              </span>

              <span className="relative inline-block mt-4 md:mt-0">
                <span className="relative line-through decoration-[#ff8a3d] decoration-[6px] text-gray-300">
                  Chemical
                </span>

                <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[#ff6b81] font-serif italic text-5xl md:text-6xl drop-shadow-sm">
                  love
                </span>
              </span>
            </h2>
          </div>

          {/* Chalk */}
          <div className="absolute bottom-3 right-12 flex items-end gap-3 opacity-90">
            <div className="w-10 h-3 bg-gray-100 rounded-sm rotate-[15deg] shadow-sm"></div>
            <div className="w-8 h-3 bg-white rounded-sm -rotate-[10deg] shadow-sm"></div>
          </div>

          {/* Eraser */}
          <div className="absolute bottom-3 left-10 w-14 h-7 bg-[#6d4c41] rounded-t-md border-b-4 border-[#3e2723] shadow-md"></div>
        </div>

        {/* Illustration Image */}
        <div className="absolute -bottom-6 -right-6 md:right-[-20px] w-40 md:w-64 z-20">
          <img
            src="https://www.farmdidi.com/cdn/shop/files/USP.jpg?v=1767697893&width=1100"
            alt="Woman pointing at board"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductStorySection;
