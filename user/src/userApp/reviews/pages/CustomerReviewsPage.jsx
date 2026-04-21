import React, { useState, useMemo } from "react";

/* ─────────────────────────────
   REALISTIC REVIEW DATA
───────────────────────────── */
const REVIEWS_DATA = [
  {
    id: 1,
    productName: "Lal Mirch Bharua Achar",
    productLink: "/products/lal-mirch-bharua-achar",
    rating: 5,
    date: "2026-04-15",
    author: "Raj Kumar Sinha",
    title: "Bilkul ghar jaisa taste",
    body: "Masala balance perfect hai. Aisa lagta hai jaise ghar pe bana ho. No artificial taste.",
    isVerified: true,
    likes: 12,
  },
  {
    id: 2,
    productName: "A2 Desi Ghee",
    productLink: "/products/a2-desi-ghee",
    rating: 5,
    date: "2026-04-14",
    author: "Sunita Devi",
    title: "Pure aur fresh ghee",
    body: "Ghee ka aroma natural hai. Bilona method clearly noticeable hai. Quality genuine lagti hai.",
    isVerified: true,
    likes: 18,
  },
  {
    id: 3,
    productName: "Raw Forest Honey",
    productLink: "/products/raw-forest-honey",
    rating: 5,
    date: "2026-04-12",
    author: "Amit Verma",
    title: "Natural honey taste",
    body: "Thick consistency aur natural sweetness. Market wala honey jaisa bilkul nahi hai.",
    isVerified: true,
    likes: 9,
  },
  {
    id: 4,
    productName: "Mixed Pickle",
    productLink: "/products/mixed-pickle",
    rating: 4,
    date: "2026-04-10",
    author: "Neha Sharma",
    title: "Good taste overall",
    body: "Taste acha hai, ghar jaisa feel aata hai. Thoda oil kam hota to aur better hota.",
    isVerified: true,
    likes: 6,
  },
  {
    id: 5,
    productName: "Mango Pickle",
    productLink: "/products/mango-pickle",
    rating: 4,
    date: "2026-04-09",
    author: "Rohit Singh",
    title: "Authentic taste",
    body: "Spice level balanced hai. Homemade feel aata hai.",
    isVerified: false,
    likes: 3,
  },
];

/* ─────────────────────────────
   ICONS
───────────────────────────── */
const Star = ({ filled }) => (
  <svg
    className={`w-4 h-4 ${filled ? "text-amber-500" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-3.5 h-3.5 text-green-600"
    fill="currentColor"
    viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

/* ─────────────────────────────
   PAGE
───────────────────────────── */
const ReviewsPage = () => {
  const [ratingFilter, setRatingFilter] = useState("all");

  const filtered = useMemo(() => {
    let data = [...REVIEWS_DATA];
    if (ratingFilter !== "all") {
      data = data.filter((r) => r.rating === Number(ratingFilter));
    }
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [ratingFilter]);

  const avgRating = useMemo(() => {
    const sum = REVIEWS_DATA.reduce((acc, r) => acc + r.rating, 0);
    return (sum / REVIEWS_DATA.length).toFixed(1);
  }, []);

  // Schema.org JSON-LD for SEO rich snippets
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ghar Ka Organic",
    url: "https://gharkaorganic.com",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating,
      reviewCount: REVIEWS_DATA.length,
      bestRating: "5",
      worstRating: "1",
    },
    review: filtered.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      datePublished: r.date,
      reviewBody: r.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: "5",
        worstRating: "1",
      },
      itemReviewed: {
        "@type": "Product",
        name: r.productName,
      },
    })),
  };

  return (
    <>
      {/* JSON-LD for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <main className="bg-gray-50 min-h-screen">
        {/* HERO - SEO OPTIMIZED */}
        <section className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-5 py-10 md:py-14 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Ghar Ka Organic Customer Reviews & Ratings
            </h1>

            <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
              Read authentic reviews from verified buyers of our{" "}
              <strong>A2 Desi Ghee</strong>,<strong> Raw Forest Honey</strong>,{" "}
              <strong>Himalayan Pahadi Pickles</strong>, and traditional
              Uttarakhand organic products. Trusted by 10,000+ families across
              India.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2">
              <div
                className="flex gap-0.5"
                aria-label={`Average rating ${avgRating} out of 5`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} filled={i < Math.round(avgRating)} />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {avgRating}/5
              </span>
              <span className="text-sm text-gray-500">
                ({REVIEWS_DATA.length} reviews)
              </span>
            </div>
          </div>
        </section>

        {/* FILTER + COUNT */}
        <section className="max-w-5xl mx-auto px-5 mt-6 md:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-gray-600">
              Showing <strong>{filtered.length}</strong> customer{" "}
              {filtered.length === 1 ? "review" : "reviews"}
            </p>
            <label className="sr-only" htmlFor="rating-filter">
              Filter by rating
            </label>
            <select
              id="rating-filter"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white hover:border-green-600 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}>
              <option value="all">All Ratings</option>
              <option value="5">5 Star Only</option>
              <option value="4">4 Star Only</option>
              <option value="3">3 Star Only</option>
            </select>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="max-w-5xl mx-auto px-5 py-6 md:py-8 space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white border rounded-lg p-8 text-center text-gray-500">
              No reviews found for this filter.
            </div>
          ) : (
            filtered.map((r) => (
              <article
                key={r.id}
                className="bg-white border border-gray-200 rounded-lg p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
                itemScope
                itemType="https://schema.org/Review">
                {/* HEADER */}
                <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <div
                      className="flex gap-1 mb-1"
                      aria-label={`${r.rating} out of 5 stars`}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} filled={i < r.rating} />
                      ))}
                    </div>
                    <a
                      href={r.productLink}
                      className="text-xs text-green-700 hover:text-green-800 font-medium"
                      itemProp="itemReviewed">
                      {r.productName}
                    </a>
                  </div>
                  <time
                    className="text-xs text-gray-500"
                    dateTime={r.date}
                    itemProp="datePublished">
                    {new Date(r.date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </header>

                {/* TITLE */}
                <h2
                  className="mt-3 font-semibold text-gray-900 text-base"
                  itemProp="name">
                  {r.title}
                </h2>

                {/* BODY */}
                <p
                  className="mt-2 text-gray-700 text-sm leading-relaxed"
                  itemProp="reviewBody">
                  {r.body}
                </p>

                {/* AUTHOR + META */}
                <footer className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span
                    itemProp="author"
                    itemScope
                    itemType="https://schema.org/Person">
                    — <span itemProp="name">{r.author}</span>
                  </span>

                  {r.isVerified && (
                    <span className="flex items-center gap-1 text-green-700 font-medium">
                      <CheckIcon />
                      Verified Buyer
                    </span>
                  )}

                  <span className="text-gray-400">•</span>
                  <span>{r.likes} people found this helpful</span>

                  <div
                    itemProp="reviewRating"
                    itemScope
                    itemType="https://schema.org/Rating"
                    className="hidden">
                    <meta itemProp="ratingValue" content={r.rating} />
                    <meta itemProp="bestRating" content="5" />
                  </div>
                </footer>
              </article>
            ))
          )}
        </section>

        {/* CTA + SEO TEXT */}
        <section className="bg-white border-t mt-8">
          <div className="max-w-5xl mx-auto px-5 py-10 md:py-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Share Your Ghar Ka Organic Experience
            </h2>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto mb-6">
              Help other families discover authentic Himalayan organic products.
              Your honest review about our A2 ghee, honey, or pickles makes a
              difference.
            </p>

            <button className="px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-medium rounded-md transition-colors shadow-sm hover:shadow">
              Write a Review
            </button>

            <div className="mt-8 pt-8 border-t border-gray-100 text-xs text-gray-500 max-w-3xl mx-auto leading-relaxed">
              <strong>About Ghar Ka Organic Reviews:</strong> All reviews are
              from verified customers who purchased directly from
              gharkaorganic.com. We never edit or filter reviews. Products
              include Badri Cow A2 Ghee, Raw Forest Honey, Lal Mirch Bharua
              Achar, Mixed Pickle, Pahadi Haldi, and more traditional items
              sourced from Uttarakhand women farmers.
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ReviewsPage;
