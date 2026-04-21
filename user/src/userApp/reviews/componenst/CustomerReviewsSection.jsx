import React from "react";

const CustomerReviewsSection = ({
  averageRating = 4.7,
  totalReviews = 100,

  breakdown = [
    { stars: 5, percent: 80.3 },
    { stars: 4, percent: 9.9 },
    { stars: 3, percent: 4.5 },
    { stars: 2, percent: 1.0 },
    { stars: 1, percent: 1.3 },
  ],

  onWriteReview = () => {},
}) => {
  const Star = ({ filled = true }) => (
    <svg
      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
        filled ? "text-gray-900" : "text-gray-300"
      }`}
      fill="currentColor"
      viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <section className="w-full bg-white py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SEO HEADER */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
          Trusted Reviews from Ghar Ka Organic Families
        </h2>

        <p className="text-center text-sm text-gray-600 mb-6 max-w-3xl mx-auto">
          Honest feedback from families who use our Himalayan organic food
          products — including A2 Desi Ghee, Raw Forest Honey, Pahadi Pickles,
          and traditional Uttarakhand spices.
        </p>

        {/* BRAND STORY (MATCHED WITH YOUR "OUR STORY" TONE) */}
        <div className="text-sm text-gray-600 text-center max-w-4xl mx-auto mb-10 leading-relaxed">
          <strong>Ghar Ka Organic</strong> is rooted in the Himalayan region of
          Uttarakhand, where we work closely with{" "}
          <strong>women-led rural communities</strong> and local farmers to
          preserve traditional food practices and natural farming methods.
          <br />
          <br />
          Our range includes{" "}
          <strong>
            A2 Bilona Desi Ghee, Raw Forest Honey, Pahadi Pickles (Achar),
            Himalayan Spices, Haldi, and handcrafted village products
          </strong>
          , all made in small batches without chemicals or preservatives.
          <br />
          <br />
          We believe in <strong>
            pure, honest food from the Himalayas
          </strong>{" "}
          that supports local livelihoods and brings authentic taste to urban
          homes. Every purchase supports the idea of
          <strong> “Vocal for Local”</strong> and sustainable rural empowerment.
        </div>

        {/* RATING SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center mb-8 sm:mb-10">
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start">
            <div className="flex gap-0.5 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} filled={i < Math.round(averageRating)} />
              ))}
            </div>

            <p className="text-sm font-medium text-gray-900">
              {averageRating} / 5 Trusted Rating
            </p>

            <p className="text-sm text-gray-600">
              Based on {totalReviews.toLocaleString()} verified customer reviews
            </p>
          </div>

          <div className="hidden lg:block lg:col-span-1 h-16 w-px bg-gray-200 mx-auto" />

          {/* BARS */}
          <div className="lg:col-span-5 w-full max-w-sm mx-auto lg:mx-0">
            <div className="space-y-1.5">
              {breakdown.map((row) => (
                <div key={row.stars} className="flex items-center gap-2.5">
                  <div className="flex gap-0.5">
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

          <div className="hidden lg:block lg:col-span-1 h-16 w-px bg-gray-200 mx-auto" />

          <div className="lg:col-span-2 flex justify-center">
            <button
              onClick={onWriteReview}
              className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-medium transition-colors rounded-sm">
              Share Your Experience
            </button>
          </div>
        </div>

        <hr className="border-gray-100 mb-6 sm:mb-8" />
      </div>
    </section>
  );
};

export default CustomerReviewsSection;
