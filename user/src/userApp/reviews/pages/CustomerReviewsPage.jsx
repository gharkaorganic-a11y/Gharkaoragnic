import React, { useState, useMemo } from "react";

/* ─────────────────────────────
   DATA
───────────────────────────── */
const REVIEWS_DATA = [
  {
    id: 1,
    productName: "Lal Mirch Bharua Achar",
    productLink: "#",
    rating: 5,
    date: "15/04/2026",
    author: "Raj Kumar Sinha",
    title: "Excellent taste",
    body: "Exactly ghar jaisa taste. Masala balance is perfect.",
    isVerified: true,
    likes: 2,
    dislikes: 0,
  },
  {
    id: 2,
    productName: "Desi Ghee",
    productLink: "#",
    rating: 5,
    date: "14/04/2026",
    author: "Anonymous",
    title: "Pure quality",
    body: "100% pure, natural aroma and taste like home.",
    isVerified: true,
    likes: 5,
    dislikes: 0,
  },
  {
    id: 3,
    productName: "The Heritage Bihar Pickle Pack",
    productLink: "#",
    rating: 5,
    date: "13/04/2026",
    author: "Priya Sharma",
    title: "Taste 😋 yummy",
    body: "Less oil content, good balance of salt & no preservatives, liked the product.",
    isVerified: false,
    likes: 1,
    dislikes: 0,
  },
  {
    id: 4,
    productName: "Jackfruit Pickle | Kathal ka Achaar",
    productLink: "#",
    rating: 4,
    date: "12/04/2026",
    author: "Amit Verma",
    title: "Very good",
    body: "Very tasty. Will order again for sure.",
    isVerified: true,
    likes: 0,
    dislikes: 0,
  },
  {
    id: 5,
    productName: "Lal Mirch ka Bharua Achar",
    productLink: "#",
    rating: 5,
    date: "11/04/2026",
    author: "Neha Gupta",
    title: "",
    body: "Lal mirch ka ye bhura achar ekdum lajawab hai! Iska masala bahut hi chatpata aur swadisht hai. Bilkul waisa hi swaad hai jaisa ghar pe dadi-nani banati thi.",
    isVerified: true,
    likes: 8,
    dislikes: 0,
  },
  {
    id: 6,
    productName: "Mango Pickle",
    productLink: "#",
    rating: 4,
    date: "10/04/2026",
    author: "Rohit Singh",
    title: "Good product",
    body: "Taste acha hai but thoda aur spicy ho sakta hai.",
    isVerified: true,
    likes: 0,
    dislikes: 1,
  },
  {
    id: 7,
    productName: "Mixed Vegetable Pickle",
    productLink: "#",
    rating: 5,
    date: "09/04/2026",
    author: "Sunita Devi",
    title: "Ghar jaisi feeling",
    body: "Bahut hi badhiya achar hai. Sabzi ka mix perfect hai.",
    isVerified: true,
    likes: 3,
    dislikes: 0,
  },
  {
    id: 8,
    productName: "Lemon Pickle",
    productLink: "#",
    rating: 4,
    date: "08/04/2026",
    author: "Anonymous",
    title: "Nice",
    body: "Khatta meetha balance ekdum sahi. Thoda salty laga.",
    isVerified: false,
    likes: 0,
    dislikes: 0,
  },
  {
    id: 9,
    productName: "Garlic Pickle",
    productLink: "#",
    rating: 5,
    date: "07/04/2026",
    author: "Vikash Jha",
    title: "Must try",
    body: "Garlic ka strong flavor aur oil quality dono best hai. Roti ke saath perfect.",
    isVerified: true,
    likes: 4,
    dislikes: 0,
  },
  {
    id: 10,
    productName: "Amla Murabba",
    productLink: "#",
    rating: 5,
    date: "06/04/2026",
    author: "Meera Patel",
    title: "Healthy & tasty",
    body: "Not too sweet, very good for health. Kids also liked it.",
    isVerified: true,
    likes: 6,
    dislikes: 0,
  },
];

/* ─────────────────────────────
   ICONS
───────────────────────────── */
const Star = ({ filled, className = "w-4 h-4" }) => (
  <svg
    className={`${className} ${filled ? "text-amber-400" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Avatar = ({ name }) => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
    {name.charAt(0).toUpperCase()}
  </div>
);

const CheckBadge = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    className="w-4 h-4 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

/* ─────────────────────────────
   RATING SUMMARY
───────────────────────────── */
const RatingSummary = ({ reviews }) => {
  const total = reviews.length;
  const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(
    2,
  );

  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percent = (count / total) * 100;
    return { stars, count, percent };
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Big Rating */}
        <div className="lg:col-span-4 text-center lg:text-left">
          <div className="text-5xl font-bold text-gray-900 mb-2">{avg}</div>
          <div className="flex gap-1 justify-center lg:justify-start mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} filled={i < Math.round(avg)} className="w-5 h-5" />
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Based on {total.toLocaleString()} reviews
          </p>
        </div>

        {/* Right: Bars */}
        <div className="lg:col-span-8 space-y-2">
          {breakdown.map(({ stars, count, percent }) => (
            <div key={stars} className="flex items-center gap-3 text-sm">
              <span className="w-8 text-gray-700 font-medium">{stars}★</span>
              <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-10 text-right text-gray-500 tabular-nums">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────
   FILTER BAR
───────────────────────────── */
const FilterBar = ({
  search,
  setSearch,
  ratingFilter,
  setRatingFilter,
  sortBy,
  setSortBy,
  totalResults,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500">
        Showing {totalResults} reviews
      </div>
    </div>
  );
};

/* ─────────────────────────────
   REVIEW CARD
───────────────────────────── */
const ReviewCard = ({ review }) => {
  const [liked, setLiked] = useState(false);

  return (
    <article className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200">
      {/* Product */}
      <p className="text-xs text-gray-600 mb-2.5">
        about{" "}
        <a
          href={review.productLink}
          className="text-teal-700 hover:underline font-medium">
          {review.productName}
        </a>
      </p>

      {/* Stars + Date */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} filled={i < review.rating} />
          ))}
        </div>
        <span className="text-xs text-gray-500">{review.date}</span>
      </div>

      {/* User */}
      <div className="flex items-center gap-2.5 mb-3">
        <Avatar name={review.author} />
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-gray-900">
            {review.author}
          </span>
          {review.isVerified && (
            <span className="flex items-center gap-1 text- bg-teal-600 text-white px-1.5 py-0.5 font-bold">
              <CheckBadge />
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="text- text-gray-800 leading-relaxed mb-4 whitespace-pre-line">
        {review.title && <p className="font-semibold mb-1.5">{review.title}</p>}
        <p className="text-gray-700">{review.body}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-5 text-xs">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-1.5 ${liked ? "text-teal-600" : "text-gray-500"} hover:text-teal-600 transition`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          <span className="font-medium">{review.likes + (liked ? 1 : 0)}</span>
        </button>
      </div>
    </article>
  );
};

/* ─────────────────────────────
   MAIN PAGE
───────────────────────────── */
const ReviewsPage = () => {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredReviews = useMemo(() => {
    let filtered = [...REVIEWS_DATA];

    // Search
    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.body.toLowerCase().includes(search.toLowerCase()) ||
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.author.toLowerCase().includes(search.toLowerCase()) ||
          r.productName.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Rating filter
    if (ratingFilter !== "all") {
      filtered = filtered.filter((r) => r.rating === parseInt(ratingFilter));
    }

    // Sort
    if (sortBy === "newest") {
      filtered.sort(
        (a, b) =>
          new Date(b.date.split("/").reverse().join("-")) -
          new Date(a.date.split("/").reverse().join("-")),
      );
    } else if (sortBy === "oldest") {
      filtered.sort(
        (a, b) =>
          new Date(a.date.split("/").reverse().join("-")) -
          new Date(b.date.split("/").reverse().join("-")),
      );
    } else if (sortBy === "highest") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      filtered.sort((a, b) => a.rating - b.rating);
    }

    return filtered;
  }, [search, ratingFilter, sortBy]);

  return (
    <main className="w-full bg-gray-50 min-h-screen">
      {/* HERO */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h1>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-16 bg-gray-300" />
              <div className="w-2 h-2 rounded-full bg-teal-600" />
              <div className="h-px w-16 bg-gray-300" />
            </div>
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              Authentic reviews from real customers across India. Every review
              helps us serve you better.
            </p>
            <a
              href="#write-review"
              className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-md transition-colors shadow-sm">
              Write a Review
            </a>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Summary */}
          <RatingSummary reviews={REVIEWS_DATA} />

          {/* Filters */}
          <FilterBar
            search={search}
            setSearch={setSearch}
            ratingFilter={ratingFilter}
            setRatingFilter={setRatingFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            totalResults={filteredReviews.length}
          />

          {/* Grid */}
          {filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-500">No reviews match your filters</p>
            </div>
          )}
        </div>
      </section>

      {/* WRITE REVIEW CTA */}
      <section
        id="write-review"
        className="py-12 sm:py-16 bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Share Your Experience
          </h3>
          <p className="text-gray-600 mb-6">
            Bought from us? Tell others what you think. Your review matters.
          </p>
          <button className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md transition-colors shadow-sm">
            Write Your Review
          </button>
        </div>
      </section>
    </main>
  );
};

export default ReviewsPage;
