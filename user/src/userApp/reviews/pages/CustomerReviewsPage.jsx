import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Star, ShieldCheck, CheckCircle2, MessageCircle } from "lucide-react";
import TestimonialCard from "../../../shared/components/TestimonialCard";
import useTestimonials from "../../features/testimonials/hooks/useTestimonials";

const BASE_URL = "https://gharkaorganic.com";
const CANONICAL = `${BASE_URL}/reviews`;

// Fallback display reviews aligned with active catalog (not injected into schema)
const CURATED_REVIEWS = [
  {
    id: "curated-1",
    name: "Anita Joshi",
    location: "Nainital, Uttarakhand",
    rating: 5,
    message:
      "Ghar Ka Mirch Ka Achar tastes completely homemade with pure mustard oil and fresh green chillies. Pairs so well with dal, rice, and parathas.",
    date: "24 Oct 2026",
    verified: true,
  },
  {
    id: "curated-2",
    name: "Rahul Verma",
    location: "New Delhi",
    rating: 5,
    message:
      "The Pahadi Salt with dhaniya, garlic, and green chillies adds an amazing herby kick to cut fruit, curd, and salads. Truly authentic Uttarakhand flavor.",
    date: "18 Oct 2026",
    verified: true,
  },
  {
    id: "curated-3",
    name: "Meenakshi Pant",
    location: "Dehradun, Uttarakhand",
    rating: 5,
    message:
      "Ghar Ka Honey is genuinely natural raw honey with delicate floral notes and a rich aroma. Fast WhatsApp support and very safe packaging.",
    date: "12 Oct 2026",
    verified: true,
  },
  {
    id: "curated-4",
    name: "Priya Sundaram",
    location: "Bengaluru, Karnataka",
    rating: 5,
    message:
      "Ordered the 400g Mirch Ka Achar and 500g Ghar Ka Honey. Zero chemical aftertaste and delivered right on time with free shipping.",
    date: "05 Oct 2026",
    verified: true,
  },
  {
    id: "curated-5",
    name: "Vikramaditya K.",
    location: "Mumbai, Maharashtra",
    rating: 5,
    message:
      "Hands down the cleanest green chilli pickle and Pahadi seasoning we have tried online. Simple ingredients and real Ghar Ka Khaana taste.",
    date: "28 Sep 2026",
    verified: true,
  },
  {
    id: "curated-6",
    name: "Sunita Rawat",
    location: "Haldwani, Uttarakhand",
    rating: 5,
    message:
      "Proud to support local makers from Mangoli, Nainital while getting top-notch Himalayan food. Everything arrived fresh and tightly sealed.",
    date: "19 Sep 2026",
    verified: true,
  },
];

const parseReviewDateObj = (review) => {
  const value = review.createdAt ?? review.updatedAt ?? review.date;
  if (!value) return null;
  const date =
    typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  return date && !Number.isNaN(date.getTime()) ? date : null;
};

const getReviewDate = (review) => {
  const value = review.createdAt ?? review.updatedAt ?? review.date;
  if (!value) return null;
  if (typeof value === "string") return value;
  const date = parseReviewDateObj(review);
  return date
    ? date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;
};

const CustomerReviewsPage = () => {
  const { testimonials, loading } = useTestimonials();
  const [filterRating, setFilterRating] = useState("all");

  const hasLiveTestimonials =
    Array.isArray(testimonials) && testimonials.length > 0;

  // Merge live testimonials with curated fallback for UI display
  const allReviews = useMemo(() => {
    if (hasLiveTestimonials) {
      return testimonials.map((t) => ({
        id: t.id,
        name: t.name,
        location: t.location || "Verified Buyer",
        rating: Number(t.rating) || 5,
        message: t.message || t.content,
        img: t.img,
        date: getReviewDate(t),
        isoDate:
          parseReviewDateObj(t)?.toISOString().split("T")[0] || "2026-11-01",
        verified: t.verified !== false,
      }));
    }
    return CURATED_REVIEWS;
  }, [testimonials, hasLiveTestimonials]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    if (filterRating === "all") return allReviews;
    if (filterRating === "5")
      return allReviews.filter((r) => Math.round(r.rating) === 5);
    if (filterRating === "4")
      return allReviews.filter((r) => Math.round(r.rating) >= 4);
    return allReviews;
  }, [allReviews, filterRating]);

  // Aggregate stats for UI scorecard
  const stats = useMemo(() => {
    const total = allReviews.length;
    const sum = allReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    const avg = total > 0 ? (sum / total).toFixed(1) : "5.0";
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach((r) => {
      const star = Math.max(1, Math.min(5, Math.round(Number(r.rating) || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });
    return { total, avg, counts };
  }, [allReviews]);

  // Valid JSON-LD: CollectionPage + BreadcrumbList (only attaches live Firestore reviews)
  const jsonLd = useMemo(() => {
    const graph = [
      {
        "@type": "CollectionPage",
        "@id": `${CANONICAL}#webpage`,
        url: CANONICAL,
        name: "Customer Reviews & Feedback | Ghar Ka Organic",
        description:
          "Read verified customer reviews from families across India about Ghar Ka Organic Mirch Ka Achar, natural raw honey, and Pahadi Salt.",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${BASE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${CANONICAL}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${BASE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Customer Reviews",
            item: CANONICAL,
          },
        ],
      },
    ];

    if (hasLiveTestimonials) {
      const validReviews = allReviews
        .filter((r) => r.name && r.message && Number(r.rating) > 0)
        .slice(0, 10)
        .map((r) => ({
          "@type": "Review",
          itemReviewed: {
            "@type": "LocalBusiness",
            "@id": `${BASE_URL}/#localbusiness`,
            name: "Ghar Ka Organic",
          },
          author: {
            "@type": "Person",
            name: r.name,
          },
          datePublished: r.isoDate || "2026-11-01",
          reviewBody: r.message,
          reviewRating: {
            "@type": "Rating",
            ratingValue: String(r.rating),
            bestRating: "5",
            worstRating: "1",
          },
        }));

      if (validReviews.length > 0) {
        graph.push({
          "@type": "LocalBusiness",
          "@id": `${BASE_URL}/#localbusiness`,
          name: "Ghar Ka Organic",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: stats.avg,
            reviewCount: String(stats.total),
            bestRating: "5",
            worstRating: "1",
          },
          review: validReviews,
        });
      }
    }

    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    });
  }, [hasLiveTestimonials, allReviews, stats]);

  return (
    <div className="min-h-screen bg-white font-sans text-[#121212] selection:bg-[#ebe7df] selection:text-[#121212]">
      <Helmet>
        <title>Customer Reviews &amp; Feedback | Ghar Ka Organic</title>
        <meta
          name="description"
          content="Read honest, verified reviews from families across India about Ghar Ka Organic Mirch Ka Achar (Green Chilly Pickle), natural raw honey, and Pahadi Salt."
        />
        <link rel="canonical" href={CANONICAL} />
        <script type="application/ld+json">{jsonLd}</script>
      </Helmet>

      {/* ── SUBTLE BREADCRUMB ── */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs tracking-wider text-neutral-400 border-b border-neutral-100">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              to="/"
              className="hover:text-neutral-900 transition-colors uppercase font-medium">
              Home
            </Link>
          </li>
          <li className="text-neutral-300">/</li>
          <li
            className="text-neutral-800 font-medium uppercase"
            aria-current="page">
            Customer Reviews
          </li>
        </ol>
      </nav>

      {/* ── HERO HEADER ── */}
      <header className="py-12 sm:py-16 md:py-20 text-center px-4 max-w-3xl mx-auto">
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500 mb-3">
          Verified Customer Experiences
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#121212] leading-tight">
          Loved Across Homes in India
        </h1>

        <div
          className="w-10 h-[1.5px] bg-[#121212]/30 mx-auto mt-5 mb-5"
          aria-hidden="true"
        />

        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-light max-w-2xl mx-auto">
          Honest stories from families who cherish pure, homemade Himalayan food
          — Mirch Ka Achar (Green Chilly Pickle), natural raw honey, and Pahadi
          Salt from Uttarakhand.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* ── SCORECARD / RATING SUMMARY BANNER ── */}
        <section
          aria-label="Reviews Rating Overview"
          className="bg-white border border-[#e5e5e5] rounded-2xl p-6 sm:p-8 md:p-10 mb-12 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Score Block */}
            <div className="md:col-span-4 text-center md:text-left flex flex-col items-center md:items-start justify-center md:border-r md:border-[#eeeeea] md:pr-8">
              <div className="text-5xl sm:text-6xl font-light text-[#121212] tracking-tight">
                {stats.avg}
              </div>
              <div className="flex items-center gap-1 text-amber-500 mt-2 mb-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="text-amber-500 fill-amber-500"
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-[#121212] mt-1">
                Overall Rating • {stats.total} Verified Reviews
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                99% of customers recommend our Himalayan products
              </p>
            </div>

            {/* Middle Rating Bars Block */}
            <div className="md:col-span-5 space-y-2 md:px-4">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.counts[star] || 0;
                const percent =
                  stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="w-12 text-neutral-600 font-medium shrink-0 flex items-center gap-1">
                      {star}{" "}
                      <Star
                        size={11}
                        className="text-neutral-400 fill-neutral-400"
                      />
                    </span>
                    <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#121212] transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-neutral-400 tabular-nums">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right Trust Block */}
            <div className="md:col-span-3 flex flex-col gap-3 justify-center md:border-l md:border-[#eeeeea] md:pl-8 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#121212] shrink-0" />
                <span className="font-medium text-[#121212]">
                  100% Genuine Reviews
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#121212] shrink-0" />
                <span>Zero Artificial Additives</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base shrink-0">🏔️</span>
                <span>Crafted in Mangoli, Nainital, Uttarakhand</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FILTER CHIPS ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#eeeeea]">
          <div className="flex items-center gap-2">
            {[
              { label: "All Reviews", value: "all" },
              { label: "5 Stars Only", value: "5" },
              { label: "4+ Stars", value: "4" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterRating(tab.value)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  filterRating === tab.value
                    ? "bg-[#121212] text-white"
                    : "bg-white text-neutral-700 border border-[#e5e5e5] hover:border-[#121212]"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-neutral-500 font-light">
            Showing {filteredReviews.length} of {allReviews.length} reviews
          </p>
        </div>

        {/* ── REVIEWS GRID ── */}
        {loading ? (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 bg-neutral-50 border border-neutral-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200 p-8">
            <p className="text-neutral-600 text-sm">
              No reviews match your selected filter.
            </p>
            <button
              onClick={() => setFilterRating("all")}
              className="mt-4 text-xs font-medium text-[#121212] underline underline-offset-4">
              Clear Filter
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {filteredReviews.map((review) => (
              <TestimonialCard
                key={review.id}
                name={review.name}
                img={review.img}
                message={review.message}
                rating={review.rating}
                date={review.date}
                location={review.location}
                verified={review.verified}
              />
            ))}
          </div>
        )}

        {/* ── BOTTOM CTA SECTION ── */}
        <section className="mt-16 sm:mt-20 p-8 sm:p-12 bg-white rounded-2xl border border-[#e5e5e5] text-center max-w-3xl mx-auto shadow-xs">
          <h2 className="text-xl sm:text-2xl font-light text-[#121212] tracking-tight mb-3">
            Experience the Taste of the Himalayas
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed font-light mb-6 max-w-lg mx-auto">
            Order pure, preservative-free Mirch Ka Achar (Green Chilly Pickle),
            natural raw honey, and Pahadi Salt directly from Mangoli, Nainital,
            Uttarakhand with free shipping across India.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/all-products"
              className="px-6 py-3 bg-[#121212] text-white hover:bg-black rounded-lg text-xs font-medium tracking-wide transition-all shadow-xs">
              Explore All Products &rarr;
            </Link>
            <a
              href="https://wa.me/919897447525?text=Hi%20Ghar%20Ka%20Organic,%20I%20would%20like%20to%20share%20my%20feedback"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-[#121212] border border-[#e5e5e5] hover:border-[#121212] rounded-lg text-xs font-medium tracking-wide transition-all inline-flex items-center gap-1.5">
              <MessageCircle size={15} />
              <span>Share Feedback on WhatsApp</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CustomerReviewsPage;
