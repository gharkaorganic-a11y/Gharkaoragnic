import React from "react";
import { Star, CheckSquare, User, ChevronDown } from "lucide-react";

const ReviewsSection = ({
  reviews = [],
  totalReviews = 0,
  averageRating = "0.00",
  ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
}) => {
  // Helper to render stars (filled and outlined)
  const renderStars = (rating, size = 18) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < Math.floor(rating) ? "#fbbf24" : "none"} // Amber-400
        color="#fbbf24"
        strokeWidth={2}
        className="mr-1"
      />
    ));
  };

  // Helper to calculate the percentage for the progress bars
  const getPercentage = (count) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white font-sans text-gray-800">
      {/* Top Section: Title & Aggregate Stats */}
      <h2 className="text-3xl font-medium text-center mb-10">
        Customer Reviews
      </h2>

      <div className="flex flex-col md:flex-row justify-center items-center gap-12 mb-10">
        {/* Left Side: Average Rating */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex">{renderStars(Number(averageRating), 22)}</div>
            <span className="text-gray-600 text-lg">
              {averageRating} out of 5
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            Based on {totalReviews} reviews
            <CheckSquare size={16} className="text-teal-500 bg-white" />
          </div>
        </div>

        {/* Vertical Separator */}
        <div className="hidden md:block w-px h-28 bg-gray-200"></div>

        {/* Middle Side: Rating Distribution Bars */}
        <div className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-4">
              <div className="flex w-28">{renderStars(star, 16)}</div>

              {/* Progress Bar */}
              <div className="w-48 h-3 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-500"
                  style={{
                    width: `${getPercentage(ratingCounts[star])}%`,
                  }}></div>
              </div>

              {/* Count */}
              <span className="text-gray-500 text-sm w-10 text-right">
                {ratingCounts[star]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Thin Horizontal Divider */}
      <hr className="border-gray-200 mb-6" />

      {/* Filter / Sort Dropdown */}
      <div className="mb-6 flex items-center">
        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-black">
          Most Recent <ChevronDown size={14} />
        </button>
      </div>

      {/* Reviews List */}
      <div className="flex flex-col">
        {reviews.map((review, index) => (
          <div
            key={review.id || index}
            className="border-t border-gray-100 py-8">
            {/* Stars & Date Row */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex">{renderStars(review.rating, 16)}</div>
              <span className="text-gray-400 text-sm">{review.date}</span>
            </div>

            {/* Author Info Row */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                <User size={16} className="text-gray-600" />
                <CheckSquare
                  size={12}
                  className="absolute -bottom-1 -right-1 text-black bg-white"
                />
              </div>
              <span className="text-gray-800 text-sm">{review.author}</span>
              {review.verified && (
                <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded tracking-wide">
                  Verified
                </span>
              )}
            </div>

            {/* Review Content */}
            <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {review.content}
            </p>

            {/* Render Images if they exist */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {review.images.map((imgUrl, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={imgUrl}
                    alt={`Review attachment ${imgIndex + 1}`}
                    className="w-20 h-20 object-cover rounded-md border border-gray-200 shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
