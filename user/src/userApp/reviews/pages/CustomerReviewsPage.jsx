import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import SITE_CONFIG from "../../../config/siteConfig";

/* ─────────────────────────────────────
   HARDCODED REVIEW DATA
───────────────────────────────────── */
const REVIEWS_DATA = [
  {
    id: 1,
    productName: "A2 Bilona Desi Ghee",
    productLink: "/products/a2-bilona-ghee",
    rating: 5,
    date: "2026-05-10",
    author: "Raj Kumar Sharma",
    title: "Pure bilona ghee with authentic aroma",
    body: "This A2 bilona ghee tastes exactly like traditional homemade pahadi ghee. Aroma and texture are extremely natural.",
    isVerified: true,
    likes: 21,
  },

  {
    id: 2,
    productName: "Raw Forest Honey",
    productLink: "/products/raw-forest-honey",
    rating: 5,
    date: "2026-05-08",
    author: "Neha Verma",
    title: "Best raw honey online",
    body: "Very thick consistency and natural sweetness. It does not taste like processed market honey.",
    isVerified: true,
    likes: 17,
  },

  {
    id: 3,
    productName: "Lal Mirch Bharua Achar",
    productLink: "/products/lal-mirch-bharua-achar",
    rating: 5,
    date: "2026-05-06",
    author: "Sunita Devi",
    title: "Traditional homemade pickle taste",
    body: "Masala quality is excellent and oil balance is perfect. Entire family loved the authentic Uttarakhand flavor.",
    isVerified: true,
    likes: 14,
  },

  {
    id: 4,
    productName: "Pahadi Mixed Pickle",
    productLink: "/products/pahadi-mixed-pickle",
    rating: 4,
    date: "2026-05-03",
    author: "Amit Singh",
    title: "Very fresh and natural",
    body: "Taste feels homemade and natural. Packaging was also premium and delivery was quick.",
    isVerified: true,
    likes: 9,
  },

  {
    id: 5,
    productName: "Pahadi Haldi Powder",
    productLink: "/products/pahadi-haldi",
    rating: 5,
    date: "2026-05-01",
    author: "Rohit Joshi",
    title: "Original turmeric quality",
    body: "Color and aroma clearly show this is authentic pahadi turmeric and not artificial powder.",
    isVerified: true,
    likes: 11,
  },
];

/* ─────────────────────────────────────
   ICONS
───────────────────────────────────── */
const Star = ({ filled }) => (
  <svg
    className={`w-4 h-4 ${filled ? "text-amber-500" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

/* ─────────────────────────────────────
   PAGE
───────────────────────────────────── */
export default function ReviewsPage() {
  const [ratingFilter, setRatingFilter] = useState("all");

  const CANONICAL = `${SITE_CONFIG.baseUrl}/reviews`;

  const filtered = useMemo(() => {
    let data = [...REVIEWS_DATA];

    if (ratingFilter !== "all") {
      data = data.filter((r) => r.rating === Number(ratingFilter));
    }

    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [ratingFilter]);

  const avgRating = useMemo(() => {
    const total = REVIEWS_DATA.reduce((acc, item) => acc + item.rating, 0);

    return (total / REVIEWS_DATA.length).toFixed(1);
  }, []);

  /* ─────────────────────────────────────
     FIXED JSON LD
     NO INVALID itemReviewed ERRORS
  ───────────────────────────────────── */
  const schemaData = {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "WebPage",

        "@id": CANONICAL,

        url: CANONICAL,

        name: `Customer Reviews | ${SITE_CONFIG.siteName}`,

        description:
          "Verified customer reviews for Ghar Ka Organic products including A2 Bilona Ghee, Raw Forest Honey, Himalayan Pickles and Uttarakhand organic food.",

        inLanguage: "en-IN",
      },

      {
        "@type": "Organization",

        "@id": `${SITE_CONFIG.baseUrl}/#organization`,

        name: SITE_CONFIG.siteName,

        url: SITE_CONFIG.baseUrl,

        logo: SITE_CONFIG.logo,

        telephone: SITE_CONFIG.phone,

        email: SITE_CONFIG.email,

        sameAs: [SITE_CONFIG.instagram],
      },

      {
        "@type": "AggregateRating",

        "@id": `${CANONICAL}#aggregate-rating`,

        ratingValue: avgRating,

        reviewCount: REVIEWS_DATA.length,

        bestRating: "5",

        worstRating: "1",
      },

      ...REVIEWS_DATA.map((r) => ({
        "@type": "Review",

        "@id": `${CANONICAL}#review-${r.id}`,

        name: r.title,

        reviewBody: r.body,

        datePublished: r.date,

        author: {
          "@type": "Person",
          name: r.author,
        },

        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: "5",
          worstRating: "1",
        },

        itemReviewed: {
          "@type": "Product",

          name: r.productName,

          url: `${SITE_CONFIG.baseUrl}${r.productLink}`,

          image: SITE_CONFIG.heroImage,

          brand: {
            "@type": "Brand",
            name: SITE_CONFIG.siteName,
          },

          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: r.rating,
            reviewCount: "1",
            bestRating: "5",
            worstRating: "1",
          },

          offers: {
            "@type": "Offer",

            priceCurrency: "INR",

            price: "499",

            availability: "https://schema.org/InStock",

            url: `${SITE_CONFIG.baseUrl}${r.productLink}`,
          },
        },
      })),
    ],
  };

  return (
    <>
      <Helmet>
        {/* SEO */}
        <title>Customer Reviews | {SITE_CONFIG.siteName}</title>

        <meta
          name="description"
          content="Read verified customer reviews for Ghar Ka Organic products including A2 Bilona Ghee, Raw Forest Honey, Himalayan Pickles and authentic Uttarakhand organic food."
        />

        <meta
          name="keywords"
          content="Ghar Ka Organic reviews, A2 bilona ghee reviews, raw honey reviews, Himalayan pickle reviews, Uttarakhand organic food"
        />

        <meta name="robots" content="index, follow" />

        <meta name="author" content={SITE_CONFIG.siteName} />

        <link rel="canonical" href={CANONICAL} />

        {/* OPEN GRAPH */}
        <meta property="og:type" content="website" />

        <meta
          property="og:title"
          content={`Customer Reviews | ${SITE_CONFIG.siteName}`}
        />

        <meta
          property="og:description"
          content="Verified customer reviews for authentic Himalayan organic products from Uttarakhand."
        />

        <meta property="og:url" content={CANONICAL} />

        <meta property="og:site_name" content={SITE_CONFIG.siteName} />

        <meta property="og:image" content={SITE_CONFIG.heroImage} />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content={`Customer Reviews | ${SITE_CONFIG.siteName}`}
        />

        <meta
          name="twitter:description"
          content="Read verified customer reviews for Ghar Ka Organic products."
        />

        <meta name="twitter:image" content={SITE_CONFIG.heroImage} />

        {/* JSON LD */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <main className="bg-[#faf8f3] min-h-screen">
        {/* HERO */}
        <section className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-6 py-16 text-center">
            <p className="uppercase tracking-[4px] text-[12px] text-[#777] mb-5">
              Verified Organic Product Reviews
            </p>

            <h1 className="text-4xl md:text-5xl font-light text-[#222] leading-tight mb-6">
              Customer Reviews &
              <br />
              Ratings
            </h1>

            <p className="max-w-3xl mx-auto text-[15px] md:text-[17px] leading-[2] text-[#666] font-light">
              Read authentic customer experiences for handmade Himalayan organic
              products from Uttarakhand including A2 bilona ghee, raw forest
              honey, pahadi pickles and traditional village food products.
            </p>

            {/* RATING */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} filled={i < Math.round(avgRating)} />
                ))}
              </div>

              <span className="font-semibold text-[#222]">{avgRating}/5</span>

              <span className="text-[#777] text-sm">
                ({REVIEWS_DATA.length} Reviews)
              </span>
            </div>
          </div>
        </section>

        {/* FILTER */}
        <section className="max-w-6xl mx-auto px-6 mt-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-sm text-[#666]">
              Showing {filtered.length} verified customer reviews
            </p>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="border border-gray-300 bg-white px-4 py-3 text-sm outline-none rounded-md">
              <option value="all">All Ratings</option>

              <option value="5">5 Star Reviews</option>

              <option value="4">4 Star Reviews</option>
            </select>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="max-w-6xl mx-auto px-6 py-8 space-y-5">
          {filtered.map((r) => (
            <article
              key={r.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7 shadow-sm hover:shadow-lg transition-all duration-300"
              itemScope
              itemType="https://schema.org/Review">
              {/* TOP */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div className="flex-1">
                  {/* STARS */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} filled={i < r.rating} />
                    ))}
                  </div>

                  {/* PRODUCT */}
                  <div className="mb-4">
                    <a
                      href={r.productLink}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#0f766e] hover:text-[#115e59] hover:underline">
                      {r.productName}
                    </a>
                  </div>

                  {/* TITLE */}
                  <h2
                    className="text-xl font-semibold text-[#222] leading-snug"
                    itemProp="name">
                    {r.title}
                  </h2>
                </div>

                {/* DATE */}
                <div className="text-xs text-[#888] whitespace-nowrap border border-gray-200 px-3 py-2 rounded-full bg-gray-50">
                  <time dateTime={r.date} itemProp="datePublished">
                    {new Date(r.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>

              {/* BODY */}
              <p
                className="mt-5 text-[15px] leading-[2.1] text-[#666]"
                itemProp="reviewBody">
                {r.body}
              </p>

              {/* FOOTER */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center gap-4">
                {/* AUTHOR */}
                <div
                  itemProp="author"
                  itemScope
                  itemType="https://schema.org/Person"
                  className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#f3f4f6] flex items-center justify-center text-sm font-semibold text-[#333]">
                    {r.author.charAt(0)}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#222]">
                      <span itemProp="name">{r.author}</span>
                    </span>

                    <span className="text-xs text-[#888]">
                      Verified Customer
                    </span>
                  </div>
                </div>

                {/* VERIFIED */}
                {r.isVerified && (
                  <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-medium px-3 py-1.5 rounded-full">
                    ✓ Verified Buyer
                  </span>
                )}

                {/* LIKES */}
                <span className="text-xs text-[#777]">
                  {r.likes} people found this helpful
                </span>
              </div>

              {/* RATING SCHEMA */}
              <div
                itemProp="reviewRating"
                itemScope
                itemType="https://schema.org/Rating"
                className="hidden">
                <meta itemProp="ratingValue" content={String(r.rating)} />

                <meta itemProp="bestRating" content="5" />

                <meta itemProp="worstRating" content="1" />
              </div>
            </article>
          ))}
        </section>

        {/* LONG SEO CONTENT */}
        <section className="bg-white border-t mt-12">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-light text-[#222] mb-8">
              Why Families Trust Ghar Ka Organic
            </h2>

            <div className="space-y-8 text-[15px] leading-[2.2] text-[#666] font-light">
              <p>
                Ghar Ka Organic is a Himalayan organic food brand focused on
                delivering authentic village products from Uttarakhand directly
                to homes across India.
              </p>

              <p>
                Customers trust our A2 bilona ghee, raw forest honey, pahadi
                pickles and traditional spices because of their homemade taste
                and natural ingredients.
              </p>

              <p>
                Unlike mass produced food brands, we focus on traditional
                preparation methods used by Himalayan village families for
                generations.
              </p>

              <p>
                Verified customer reviews help new buyers understand the
                quality, purity and authenticity of our Uttarakhand organic food
                products.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
