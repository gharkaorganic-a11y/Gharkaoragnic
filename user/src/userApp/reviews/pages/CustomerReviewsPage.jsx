import React, { useMemo, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import SITE_CONFIG from "../../../config/siteConfig";

/* ─────────────────────────────────────────────────────
   PRODUCTS
───────────────────────────────────────────────────── */
const PRODUCTS = {
  mangoPickle: {
    name: "Homemade Mango Pickle (Aam Ka Achar)",
    link: "/product/homemade-mango-pickle-aam-ka-achar",
  },
  pickle: {
    name: "Pahadi Achar (Mixed Pickle)",
    link: "/product/pickle",
  },
  ghee: {
    name: "A2 Bilona Desi Ghee",
    link: "/products/a2-bilona-ghee",
  },
  honey: {
    name: "Raw Forest Honey",
    link: "/products/raw-forest-honey",
  },
  chutney: {
    name: "Kumaoni Pahadi Chutney",
    link: "/products/pahadi-chutney",
  },
};

/* ─────────────────────────────────────────────────────
   REVIEWS DATA
───────────────────────────────────────────────────── */
const REVIEWS_DATA = [
  {
    id: 1,
    product: PRODUCTS.mangoPickle,
    rating: 5,
    date: "2026-05-18",
    author: "Sunita Rawat",
    city: "Dehradun",
    title: "Bilkul ghar jaisa swad",
    body: "Authentic pahadi taste, no preservatives.",
  },
  {
    id: 2,
    product: PRODUCTS.ghee,
    rating: 5,
    date: "2026-05-20",
    author: "Raj Sharma",
    city: "Jaipur",
    title: "Best bilona ghee",
    body: "Pure aroma and rich texture.",
  },
];

/* ─────────────────────────────
   STAR
───────────────────────────── */
const Star = ({ filled }) => (
  <svg
    className={`w-4 h-4 ${filled ? "text-amber-500" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

/* ─────────────────────────────
   JSON-LD (FIXED + RICH RESULTS SAFE)
───────────────────────────── */
function JsonLd({ data }) {
  useEffect(() => {
    const existing = document.getElementById("reviews-jsonld");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "reviews-jsonld";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => script.remove();
  }, [data]);

  return null;
}

/* ─────────────────────────────
   PAGE
───────────────────────────── */
export default function ReviewsPage() {
  const [ratingFilter, setRatingFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");

  const BASE_URL = "https://gharkaorganic.com";
  const CANONICAL = `${BASE_URL}/reviews`;

  const avgRating = useMemo(() => {
    return Number(
      (
        REVIEWS_DATA.reduce((a, b) => a + b.rating, 0) / REVIEWS_DATA.length
      ).toFixed(1),
    );
  }, []);

  /* ───────── FILTERED ───────── */
  const filtered = useMemo(() => {
    let data = [...REVIEWS_DATA];
    if (ratingFilter !== "all")
      data = data.filter((r) => r.rating === Number(ratingFilter));
    if (productFilter !== "all")
      data = data.filter((r) => r.product.link === productFilter);
    return data;
  }, [ratingFilter, productFilter]);

  /* ───────── STAR COUNT ───────── */
  const starCounts = useMemo(() => {
    const c = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    REVIEWS_DATA.forEach((r) => c[r.rating]++);
    return c;
  }, []);

  /* ───────── RICH RESULT JSON-LD ───────── */
  const schemaData = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": CANONICAL,
          url: CANONICAL,
          name: "Customer Reviews",
        },

        {
          "@type": "ItemList",
          itemListElement: REVIEWS_DATA.map((r, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Review",
              "@id": `${CANONICAL}#review-${r.id}`,

              author: {
                "@type": "Person",
                name: r.author,
              },

              datePublished: r.date,
              name: r.title,
              reviewBody: r.body,

              reviewRating: {
                "@type": "Rating",
                ratingValue: r.rating,
                bestRating: 5,
                worstRating: 1,
              },

              itemReviewed: {
                "@type": "Product",
                name: r.product.name,
                url: `${BASE_URL}${r.product.link}`,
                brand: {
                  "@type": "Brand",
                  name: "Ghar Ka Organic",
                },
              },
            },
          })),
        },

        {
          "@type": "AggregateRating",
          itemReviewed: {
            "@type": "Organization",
            name: "Ghar Ka Organic",
            url: BASE_URL,
          },
          ratingValue: avgRating,
          reviewCount: REVIEWS_DATA.length,
          bestRating: 5,
        },
      ],
    };
  }, [avgRating]);

  return (
    <>
      <Helmet>
        <title>Customer Reviews | Ghar Ka Organic</title>
        <meta
          name="description"
          content={`Read ${REVIEWS_DATA.length} verified reviews.`}
        />
        <link rel="canonical" href={CANONICAL} />
      </Helmet>

      <JsonLd data={schemaData} />

      <main className="min-h-screen bg-[#faf8f3] p-6">
        <h1 className="text-3xl font-bold mb-6">Customer Reviews</h1>

        <div className="mb-6">
          <p className="text-amber-600 font-bold text-xl">⭐ {avgRating} / 5</p>
        </div>

        {filtered.map((r) => (
          <article key={r.id} className="bg-white p-4 rounded-lg mb-4">
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} filled={i < r.rating} />
              ))}
            </div>

            <h2 className="font-semibold">{r.title}</h2>

            <p className="text-sm text-gray-500">
              {r.author} • {r.city}
            </p>

            <p className="mt-2 text-gray-700">{r.body}</p>

            <a
              href={r.product.link}
              className="text-amber-600 text-sm underline">
              {r.product.name}
            </a>
          </article>
        ))}
      </main>
    </>
  );
}
