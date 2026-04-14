import React from "react";

const REVIEWS_DATA = [
  {
    id: 1,
    productName: "Lal Mirch Bharua Achar",
    rating: 5,
    date: "10/04/2026",
    author: "Navin Jha",
    title: "Perfect taste",
    body: "Exactly ghar jaisa taste. Masala balance is perfect.",
    isVerified: true,
  },
  {
    id: 2,
    productName: "Mango Pickle",
    rating: 4,
    date: "09/04/2026",
    author: "Ritika",
    title: "Very good",
    body: "Taste acha hai but thoda aur spicy ho sakta hai.",
    isVerified: true,
  },
  {
    id: 3,
    productName: "Desi Ghee",
    rating: 5,
    date: "08/04/2026",
    author: "Amit Sharma",
    title: "Pure quality",
    body: "100% pure desi ghee, amazing aroma.",
    isVerified: true,
  },
  {
    id: 4,
    productName: "Jackfruit Pickle",
    rating: 4,
    date: "07/04/2026",
    author: "Priya",
    title: "Nice taste",
    body: "First time tried, really liked it.",
    isVerified: true,
  },
  {
    id: 5,
    productName: "Masala Mix",
    rating: 5,
    date: "06/04/2026",
    author: "Rahul",
    title: "Best masala",
    body: "Homemade feel, no artificial smell.",
    isVerified: true,
  },
  {
    id: 6,
    productName: "Papad",
    rating: 5,
    date: "05/04/2026",
    author: "Neha",
    title: "Crispy",
    body: "Bahut crispy aur fresh hai.",
    isVerified: true,
  },
  {
    id: 7,
    productName: "Lemon Pickle",
    rating: 4,
    date: "04/04/2026",
    author: "Ankit",
    title: "Good",
    body: "Taste acha hai but thoda salty.",
    isVerified: false,
  },
  {
    id: 8,
    productName: "Snack Combo",
    rating: 5,
    date: "03/04/2026",
    author: "Sonia",
    title: "Loved it",
    body: "Family ko bahut pasand aaya.",
    isVerified: true,
    reply:
      "Namaste Sonia Ji! We are so happy to hear that your entire family enjoyed the Snack Combo. Thank you for choosing FarmDidi!",
  },
];

const StarIcon = ({ filled }) => (
  <svg
    className={`w-4 h-4 ${filled ? "text-amber-500" : "text-gray-200"}`}
    fill="currentColor"
    viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const VerifiedIcon = () => (
  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const ReviewsGrid = ({ reviews = REVIEWS_DATA }) => {
  if (!reviews?.length) return null;

  return (
    <section className="w-full bg-[#FAF9F6] py-16 md:py-24 font-sans">
      {/* Ensure fonts are loaded (can be removed if already in index.html) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;700&display=swap');
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header (Matching Brand Design) */}
        <div className="text-center mb-12 flex flex-col items-center">
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

          <p className="text-sm text-gray-500 mt-4 tracking-wide">
            Real experiences from our customers
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 lg:gap-8">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="break-inside-avoid mb-6 lg:mb-8 bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col overflow-hidden group">
              {/* Image (If attached) */}
              {review.image && (
                <div className="w-full h-48 overflow-hidden bg-gray-50">
                  <img
                    src={review.image}
                    alt={`Review by ${review.author}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="p-6">
                {/* Product Context */}
                <div className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-4">
                  Reviewed:{" "}
                  <a
                    href={review.productLink || "#"}
                    className="text-gray-800 hover:text-[#c8102e] transition-colors">
                    {review.productName}
                  </a>
                </div>

                {/* Rating & Date */}
                <div className="flex justify-between items-center mb-5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} filled={i < review.rating} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-400">
                    {review.date}
                  </span>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 mb-5">
                  {/* Circular Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#fdf0f2] text-[#c8102e] flex items-center justify-center text-sm font-bold shadow-sm">
                    {review.author.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">
                      {review.author}
                    </span>
                    {review.isVerified && (
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center mt-0.5">
                        <VerifiedIcon /> Verified Buyer
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Text */}
                <div className="text-gray-600 text-[14px] leading-relaxed mb-2">
                  {review.title && (
                    <h4 className="font-bold text-gray-900 mb-1.5 text-[15px]">
                      {review.title}
                    </h4>
                  )}
                  <p>{review.body}</p>
                </div>

                {/* Store Reply */}
                {review.reply && (
                  <div className="mt-5 bg-[#FAF9F6] border border-gray-100 rounded-xl p-4 relative">
                    {/* Decorative corner accent */}
                    <div className="absolute -top-1.5 left-6 w-3 h-3 bg-[#FAF9F6] border-t border-l border-gray-100 rotate-45" />

                    <span className="text-xs font-bold uppercase tracking-widest text-gray-900 block mb-1.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c8102e]" />
                      FarmDidi Team
                    </span>
                    <p className="text-[13px] text-gray-600 leading-relaxed italic">
                      {review.reply}
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsGrid;
