import React from "react";

const CustomerReviewsScore = () => {
  const totalReviews = 8056;
  const averageRating = 4.72;

  const ratingBreakdown = [
    { stars: 5, count: 6669 },
    { stars: 4, count: 820 },
    { stars: 3, count: 374 },
    { stars: 2, count: 85 },
    { stars: 1, count: 110 },
  ];

  // Helper to render static stars for the breakdown rows
  const renderRowStars = (count) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < count ? "text-amber-500" : "text-gray-200"}`}
            fill="currentColor"
            viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Helper for the trust badges
  const TrustBadge = ({ color, title, subtitle, value, icon }) => (
    <div className="flex flex-col items-center justify-center p-2 text-center w-24 h-24 relative group">
      {/* Laurel Wreath Background - Made softer and more elegant */}
      <svg
        className="absolute inset-0 w-full h-full text-gray-100 group-hover:text-gray-200 transition-colors duration-300"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        <path
          d="M50 95 C 20 95, 5 70, 10 40 C 15 20, 30 10, 50 15 C 70 10, 85 20, 90 40 C 95 70, 80 95, 50 95 Z"
          strokeDasharray="4 4"
        />
        <path d="M15 60 Q 5 45 15 30" strokeLinecap="round" />
        <path d="M85 60 Q 95 45 85 30" strokeLinecap="round" />
      </svg>

      {/* Content inside the wreath */}
      <div className={`z-10 flex flex-col items-center ${color}`}>
        {icon && <div className="mb-0.5">{icon}</div>}
        {title && (
          <span className="text-[9px] font-bold uppercase tracking-widest mt-1 text-gray-500">
            {title}
          </span>
        )}
        {value && (
          <span className="text-xl font-bold font-serif leading-none mt-1 text-gray-900">
            {value}
          </span>
        )}
        {subtitle && (
          <span className="text-[8px] font-bold uppercase tracking-widest mt-1 text-gray-500">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <section className="w-full bg-white py-16 md:py-24 font-sans">
      {/* Ensure fonts are loaded (can be removed if already in index.html) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;700&display=swap');
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Customer Reviews
          </h2>
          <div className="flex items-center justify-center gap-3.5 mt-4">
            <div className="h-[1px] w-12 bg-gray-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8102e] opacity-60" />
            <div className="h-[1px] w-12 bg-gray-200" />
          </div>
        </div>

        {/* Main Reviews Block */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 mb-16">
          {/* Left: Overall Score */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <span
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
              {averageRating}
            </span>
            <div className="flex items-center gap-1 mb-2 text-amber-500">
              {/* 4 Solid Stars */}
              {[...Array(4)].map((_, i) => (
                <svg
                  key={i}
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              {/* 1 Half Star */}
              <svg className="w-6 h-6" viewBox="0 0 20 20">
                <defs>
                  <linearGradient id="half-star-gradient">
                    <stop offset="72%" stopColor="currentColor" />
                    <stop
                      offset="72%"
                      stopColor="#e5e7eb"
                      stopOpacity="1"
                    />{" "}
                    {/* Tailwind gray-200 */}
                  </linearGradient>
                </defs>
                <path
                  fill="url(#half-star-gradient)"
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">
              Based on {totalReviews.toLocaleString()} reviews
            </p>
          </div>

          {/* Middle: Progress Bars */}
          <div className="w-full max-w-sm lg:max-w-md lg:border-x border-gray-100 lg:px-12">
            <div className="flex flex-col gap-2.5">
              {ratingBreakdown.map((row) => (
                <div
                  key={row.stars}
                  className="flex items-center gap-4 text-sm group">
                  <div className="flex-shrink-0 w-24">
                    {renderRowStars(row.stars)}
                  </div>
                  {/* Progress Bar Track */}
                  <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                    {/* Progress Bar Fill */}
                    <div
                      className="h-full bg-gray-800 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${(row.count / totalReviews) * 100}%`,
                      }}></div>
                  </div>
                  <div className="w-10 text-right text-xs font-bold text-gray-400 group-hover:text-gray-600 transition-colors">
                    {row.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: CTA Button */}
          <div className="flex flex-col items-center">
            <button className="px-8 py-3.5 bg-[#c8102e] hover:bg-[#a80d27] text-white text-[12px] font-bold uppercase tracking-[0.15em] rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#c8102e]">
              Write a Review
            </button>
            <p className="text-[11px] text-gray-400 mt-4 max-w-[200px] text-center">
              Share your experience and help others make better choices.
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-100 mb-12 max-w-4xl mx-auto" />

        {/* Bottom: Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-16">
          <TrustBadge
            color="text-blue-500"
            value="7k+"
            subtitle="Verified Reviews"
            icon={
              <svg
                className="w-5 h-5 mb-1"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
          <TrustBadge
            color="text-blue-400"
            title="Monthly Record"
            value="277"
            subtitle="Verified Reviews"
            icon={
              <svg
                className="w-4 h-4 mb-0.5"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
          <TrustBadge
            color="text-gray-500"
            subtitle="Silver Authenticity"
            icon={
              <svg
                className="w-7 h-7 mb-1"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.293 10.293a1 1 0 011.414 0L10 12.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
          <TrustBadge
            color="text-amber-500"
            title="Top"
            value="1%"
            subtitle="Stores"
          />
          <TrustBadge
            color="text-amber-600"
            title="Top"
            value="1%"
            subtitle="Trending"
          />
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewsScore;
