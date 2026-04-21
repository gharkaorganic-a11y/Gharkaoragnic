import React, { useMemo } from "react";

/* ─────────────────────────────
   SAMPLE DATA
───────────────────────────── */
const DEFAULT_REVIEWS = [
  {
    id: 1,
    productName: "A2 Desi Ghee (Bilona)",
    productLink: "#",
    rating: 5,
    date: "12/04/2026",
    author: "Sample User",
    title: "Very close to homemade taste",
    body: "The aroma and texture feel very traditional. Reminds me of village-made ghee.",
    isVerified: true,
  },
  {
    id: 2,
    productName: "Raw Forest Honey",
    productLink: "#",
    rating: 5,
    date: "10/04/2026",
    author: "Sample User",
    title: "Natural and pure",
    body: "Thick consistency and natural taste. Works well in warm water and tea.",
    isVerified: true,
  },
  {
    id: 3,
    productName: "Pahadi Mixed Pickle",
    productLink: "#",
    rating: 4,
    date: "08/04/2026",
    author: "Sample User",
    title: "Authentic Himalayan flavour",
    body: "Taste is strong and traditional. Feels like homemade achar from hills.",
    isVerified: false,
  },
  {
    id: 4,
    productName: "Pahadi Haldi Powder",
    productLink: "#",
    rating: 5,
    date: "05/04/2026",
    author: "Sample User",
    title: "Pure and aromatic",
    body: "Color and fragrance are very natural compared to store-bought turmeric.",
    isVerified: true,
  },
  {
    id: 5,
    productName: "Pahadi Masala Blend",
    productLink: "#",
    rating: 4,
    date: "02/04/2026",
    author: "Sample User",
    title: "Good traditional mix",
    body: "Balanced spice mix, works well in daily cooking.",
    isVerified: true,
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
   MAIN COMPONENT
───────────────────────────── */
const ReviewsGrid = ({ reviews = DEFAULT_REVIEWS }) => {
  if (!reviews?.length) {
    return <div className="text-center text-gray-500">No reviews yet</div>;
  }

  /* ✅ structured data (safe in React) */
  const schemaData = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Ghar Ka Organic Himalayan Products",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: reviews.length,
      },
      review: reviews.map((r) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: r.author,
        },
        datePublished: r.date,
        reviewBody: r.body,
        name: r.title || "Customer Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: "5",
        },
      })),
    };
  }, [reviews]);

  return (
    <section className="w-full bg-white" aria-label="Customer Reviews Section">
      {/* SEO HIDDEN HEADING */}
      <h2 className="sr-only">
        Customer Reviews for Ghar Ka Organic Himalayan Organic Food Products
      </h2>

      {/* JSON-LD SEO */}
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="border border-gray-200 rounded-md p-5 bg-white"
              itemScope
              itemType="https://schema.org/Review">
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
                  <span className="text-xs bg-teal-600 text-white px-2 py-0.5">
                    Verified
                  </span>
                )}
              </div>

              {/* CONTENT */}
              <div className="text-gray-800 leading-relaxed mb-3">
                {r.title && <p className="font-medium mb-1">{r.title}</p>}
                <p>{r.body}</p>
              </div>
            </article>
          ))}
        </div>

        {/* VIEW ALL REVIEWS LINK */}
        <div className="flex justify-center mt-10">
          <a
            href="/reviews"
            className="text-sm font-medium text-teal-700 hover:underline">
            View All Customer Reviews →
          </a>
        </div>
      </div>
    </section>
  );
};

export default ReviewsGrid;
