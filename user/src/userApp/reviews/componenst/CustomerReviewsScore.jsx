import React from "react";

const CustomerReviewsSection = ({
  averageRating = 4.72,
  totalReviews = 8062,
  breakdown = [
    { stars: 5, count: 6675 },
    { stars: 4, count: 820 },
    { stars: 3, count: 374 },
    { stars: 2, count: 85 },
    { stars: 1, count: 110 },
  ],
  badges = {
    verified: {
      img: "/badges/verified-reviews.png", // full image without number
      value: 7329,
    },

    silver: {
      img: "/badges/silver-authenticity.png", // complete image, no dynamic text
    },
    topStores: {
      img: "/badges/top-1-stores.png", // complete image, no dynamic text
    },
    trending: {
      img: "/badges/top-1-trending.png", // complete image, no dynamic text
    },
  },
  onWriteReview = () => {},
}) => {
  const Star = ({ filled = true }) => (
    <svg
      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${filled ? "text-gray-900" : "text-gray-300"}`}
      fill="currentColor"
      viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  const BadgeImage = ({ badge }) => (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0">
      <img
        src={badge.img}
        alt=""
        height={80}
        width={80}
        className="  object-contain"
        loading="lazy"
      />
      {/* Only render value if it exists */}
      {badge.value != null && (
        <div className="absolute inset-0  px-6  py-9">
          <span className="text-sm   font-bold leading-none text-[#4C8EDA]">
            {badge.value}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <section className="w-full bg-white py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-10">
          Customer Reviews
        </h2>

        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center mb-8 sm:mb-10">
          {/* Left: Rating */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start">
            <div className="flex gap-0.5 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} filled={i < Math.round(averageRating)} />
              ))}
            </div>
            <p className="text-sm text-gray-900 font-medium">
              {averageRating} out of 5
            </p>
            <p className="text-sm text-gray-600">
              Based on {totalReviews.toLocaleString()} reviews
            </p>
          </div>

          {/* Divider */}
          <div className="hidden lg:block lg:col-span-1 h-16 w-px bg-gray-200 mx-auto" />

          {/* Middle: Bars */}
          <div className="lg:col-span-5 w-full max-w-sm mx-auto lg:mx-0">
            <div className="space-y-1.5">
              {breakdown.map((row) => (
                <div key={row.stars} className="flex items-center gap-2.5">
                  <div className="flex gap-0.5 w- flex-shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} filled={i < row.stars} />
                    ))}
                  </div>
                  <div className="flex-grow h-2 bg-gray-100 rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-gray-900"
                      style={{
                        width: `${(row.count / totalReviews) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="w-10 text-right text-xs text-gray-500 tabular-nums">
                    {row.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block lg:col-span-1 h-16 w-px bg-gray-200 mx-auto" />

          {/* Right: CTA */}
          <div className="lg:col-span-2 flex justify-center">
            <button
              onClick={onWriteReview}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600">
              Write a Store Review
            </button>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-100 mb-6 sm:mb-8" />

        {/* Badges Row - each has unique image */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          <BadgeImage badge={badges.verified} />
          <BadgeImage badge={badges.silver} />
          <BadgeImage badge={badges.topStores} />
          <BadgeImage badge={badges.trending} />
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewsSection;
