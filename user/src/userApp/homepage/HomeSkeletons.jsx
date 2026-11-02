import React from "react";

export const HeroSkeleton = () => (
  <div className="w-full h-[60vh] bg-gray-100 animate-pulse" />
);

export const GridSectionSkeleton = () => (
  <div className="w-full py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 md:grid-cols-3 md:gap-x-10 lg:grid-cols-4 lg:gap-x-12 xl:gap-x-14 lg:gap-y-14">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col h-full animate-pulse">
          <div className="w-full aspect-square bg-[#f4f2e9] rounded-2xl sm:rounded-none" />
          <div className="mt-3 sm:mt-4 space-y-2">
            <div className="h-4 bg-[#f4f2e9] rounded w-4/5" />
            <div className="h-3.5 bg-[#f4f2e9] rounded w-1/2" />
            <div className="h-4 bg-[#f4f2e9] rounded w-1/3" />
            <div className="h-8 bg-[#f4f2e9] rounded w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const CategoriesSkeleton = () => (
  <div className="w-full py-16 px-4 md:px-10 animate-pulse">
    <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-24 w-24 bg-gray-200 rounded-full mx-auto" />
      ))}
    </div>
  </div>
);

export const CollectionGridSkeleton = () => (
  <div className="w-full py-16 px-4 md:px-10 animate-pulse">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-72 bg-gray-200 rounded-lg" />
      ))}
    </div>
  </div>
);

export const TestimonialsSkeleton = () => (
  <div className="w-full py-20 animate-pulse">
    <div className="grid md:grid-cols-3 gap-10">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded" />
      ))}
    </div>
  </div>
);
