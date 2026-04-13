import React, { useState, useEffect } from "react";
import {
  Star,
  ThumbsUp,
  ChevronDown,
  AlertCircle,
  MessageSquareX,
  Loader2,
} from "lucide-react";

const ReviewsSection = () => {
  // States for API integration
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // States for UI interactivity
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Most helpful");

  // --- API Simulation (Replace this with your actual fetch call later) ---
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // SIMULATE API CALL HERE
        // const response = await fetch('/api/reviews');
        // const data = await response.json();

        // For now, setting it to empty to show the empty state as requested
        setReviews([]);

        // To test error state, uncomment the line below:
        // throw new Error("Failed to load reviews. Please try again later.");
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // --- Dynamic Calculations ---
  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews
        ).toFixed(1)
      : "0.0";

  const getPercentage = (starCount) => {
    if (totalReviews === 0) return 0;
    const count = reviews.filter((rev) => rev.rating === starCount).length;
    return Math.round((count / totalReviews) * 100);
  };

  // --- Render Helpers ---
  const renderStars = (rating, size = 20) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < Math.floor(rating) ? "#facc15" : "none"}
        color={i < Math.floor(rating) ? "#facc15" : "#d1d5db"}
        className="mr-0.5"
      />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white font-sans text-slate-800">
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar: Dynamic Rating Summary */}
        <div className="w-full lg:w-1/4">
          <div className="border rounded-lg p-6 flex flex-col items-center shadow-sm">
            <div className="text-6xl font-bold mb-2">{averageRating}</div>
            <div className="flex mb-1 justify-center">
              {renderStars(Number(averageRating))}
            </div>
            <p className="text-sm text-gray-500 mb-6">{totalReviews} Reviews</p>

            <div className="w-full space-y-2 mb-8">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center text-sm">
                  <span className="w-4 font-medium text-gray-600">{star}</span>
                  <Star
                    size={12}
                    fill="#facc15"
                    color="#facc15"
                    className="ml-1 mr-2"
                  />
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-500 ease-in-out"
                      style={{ width: `${getPercentage(star)}%` }}></div>
                  </div>
                  <span className="w-8 text-right text-gray-400 ml-2 text-xs font-medium">
                    {getPercentage(star)}%
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full border-t pt-6 text-center">
              <h4 className="font-semibold mb-1 text-gray-800">
                Review this product
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Share your thoughts with other customers
              </p>
              <button className="w-full bg-[#3d4451] text-white py-2.5 rounded-md font-medium hover:bg-slate-700 active:scale-[0.98] transition-all">
                Write a review
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Interactive Reviews List */}
        <div className="flex-1">
          {/* Interactive Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {["All", "Review with videos", "Review with photos"].map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded text-sm transition-colors ${
                    activeFilter === filter
                      ? "bg-[#3d4451] text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}>
                  {filter}
                </button>
              ),
            )}

            {[5, 4, 3, 2, 1].map((num) => (
              <button
                key={num}
                onClick={() => setActiveFilter(num.toString())}
                className={`px-3 py-2 rounded text-sm flex items-center gap-1 transition-colors ${
                  activeFilter === num.toString()
                    ? "bg-[#3d4451] text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}>
                <Star
                  size={14}
                  fill={
                    activeFilter === num.toString() ? "currentColor" : "#facc15"
                  }
                  color={
                    activeFilter === num.toString() ? "currentColor" : "#facc15"
                  }
                />{" "}
                {num}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2 text-sm mt-2 sm:mt-0">
              <span className="text-gray-500 hidden sm:inline">Sort by</span>
              <button className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded bg-white hover:bg-gray-50 shadow-sm transition-colors">
                {sortBy} <ChevronDown size={16} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Conditional Rendering: Loading, Error, Empty, or Data */}
          <div className="min-h-[300px] flex flex-col">
            {/* 1. Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center flex-1 py-12 text-gray-400">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Loading reviews...</p>
              </div>
            )}

            {/* 2. Error State */}
            {!isLoading && error && (
              <div className="flex flex-col items-center justify-center flex-1 py-12 text-red-500 bg-red-50 rounded-lg border border-red-100">
                <AlertCircle size={40} className="mb-3" />
                <h3 className="font-semibold text-lg mb-1">
                  Oops, something went wrong
                </h3>
                <p className="text-sm text-red-400">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors text-sm font-medium">
                  Try Again
                </button>
              </div>
            )}

            {/* 3. Empty State */}
            {!isLoading && !error && reviews.length === 0 && (
              <div className="flex flex-col items-center justify-center flex-1 py-16 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <MessageSquareX size={28} className="text-gray-300" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                  We don't have any reviews for this product yet. Be the first
                  to share your thoughts and help others!
                </p>
                <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-50 shadow-sm transition-all">
                  Write the first review
                </button>
              </div>
            )}

            {/* 4. Data State (Grid of Reviews) */}
            {!isLoading && !error && reviews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b md:border-none pb-8 md:pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-sm">
                        {review.initials}
                      </div>
                      <span className="font-bold text-sm uppercase tracking-wide">
                        {review.author}
                      </span>
                    </div>

                    <div className="flex mb-2">
                      {renderStars(review.rating, 18)}
                    </div>

                    {review.title && (
                      <h3 className="font-bold text-gray-900 mb-2">
                        {review.title}
                      </h3>
                    )}

                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {review.content}
                    </p>

                    <p className="text-xs text-gray-400 mb-4">
                      Reviewed on {review.date}
                    </p>

                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 border border-gray-200 px-4 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        <ThumbsUp size={16} />{" "}
                        <span className="font-medium">({review.likes})</span>
                      </button>
                      <button className="text-sm text-gray-500 hover:text-gray-800 hover:underline transition-colors">
                        Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
