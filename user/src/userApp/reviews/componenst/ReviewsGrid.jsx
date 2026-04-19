import React from "react";

/* ─────────────────────────────
   SAMPLE DATA - 10 REVIEWS
───────────────────────────── */
const DEFAULT_REVIEWS = [
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
    productName: "Lal Mirch ka Bharua Achar | Stuffed Red Chilli Pickle",
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
];

/* ─────────────────────────────
   ICONS
───────────────────────────── */
const Star = ({ filled }) => (
  <svg
    className={`w-3.5 h-3.5 ${filled ? "text-gray-900" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Avatar = ({ name }) => (
  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold">
    {name.charAt(0).toUpperCase()}
  </div>
);

/* ─────────────────────────────
   MAIN GRID - NO REPLY
───────────────────────────── */
const ReviewsGrid = ({ reviews = DEFAULT_REVIEWS }) => {
  if (!reviews?.length) {
    return <div className="text-center  text-gray-500">No reviews yet</div>;
  }

  return (
    <section className="w-full bg-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="border border-gray-200 rounded-md p-5 hover:shadow-sm transition-shadow bg-white">
              {/* PRODUCT */}
              <p className="text-xs text-gray-600 mb-2">
                about{" "}
                <a
                  href={r.productLink}
                  className="text-teal-700 hover:underline font-medium">
                  {r.productName}
                </a>
              </p>

              {/* STARS + DATE */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} filled={i < r.rating} />
                  ))}
                </div>
                <span className="text-xs text-gray-500">{r.date}</span>
              </div>

              {/* USER */}
              <div className="flex items-center gap-2 mb-3">
                <Avatar name={r.author} />
                <span className="text-sm font-medium text-gray-900">
                  {r.author}
                </span>
                {r.isVerified && (
                  <span className="text- bg-teal-600 text-white px-1.5 py-0.5 font-semibold">
                    Verified
                  </span>
                )}
              </div>

              {/* CONTENT */}
              <div className="text- text-gray-800 leading-relaxed mb-3 whitespace-pre-line">
                {r.title && <p className="font-medium mb-1">{r.title}</p>}
                <p>{r.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsGrid;
