import React from "react";
import { Link } from "react-router-dom";
import TestimonialCard from "../../../shared/components/TestimonialCard";
import useTestimonials from "../../features/testimonials/hooks/useTestimonials";

const FALLBACK_TESTIMONIALS = [
  {
    id: "f-1",
    name: "Anita Joshi",
    location: "Nainital, Uttarakhand",
    rating: 5,
    message:
      "The authentic Kumaoni Mango Pickle tastes exactly like my grandmother used to make in Almora. Zero chemical aftertaste, purely homemade mustard oil taste. 10/10.",
    date: "24 Oct",
    verified: true,
  },
  {
    id: "f-2",
    name: "Rahul Verma",
    location: "New Delhi",
    rating: 5,
    message:
      "The A2 Bilona Desi Ghee has that rich golden granule texture and mountain aroma. My entire family loves the quality. So glad we discovered Ghar Ka Organic.",
    date: "18 Oct",
    verified: true,
  },
  {
    id: "f-3",
    name: "Meenakshi Pant",
    location: "Dehradun, Uttarakhand",
    rating: 5,
    message:
      "Raw Pahadi forest honey is genuinely unprocessed. You can taste the wild floral notes and natural warmth. Fast WhatsApp response and very safe packaging.",
    date: "12 Oct",
    verified: true,
  },
];

const TestimonialsSection = () => {
  const { testimonials, loading } = useTestimonials();
  const visible =
    testimonials && testimonials.length > 0
      ? testimonials.slice(0, 3)
      : FALLBACK_TESTIMONIALS;

  return (
    <section className="w-full py-16 md:py-20 bg-white border-t border-[#eeeeea]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── HEADER ── */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-neutral-500 mb-2">
            Loved Across India
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#121212] tracking-tight">
            What Our Customers Say
          </h2>
          <div
            className="w-8 h-[1px] bg-[#121212]/20 mx-auto mt-3"
            aria-hidden="true"
          />
        </div>

        {/* ── GRID ── */}
        {loading ? (
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl border border-neutral-100 bg-neutral-50 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {visible.map((t) => (
              <div
                key={t.id}
                className="h-full transition-transform duration-300 hover:-translate-y-1">
                <TestimonialCard
                  name={t.name}
                  img={t.img}
                  message={t.message || t.content}
                  rating={t.rating}
                  date={t.date}
                  location={t.location}
                  verified={t.verified !== false}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── CTA TO FULL REVIEWS PAGE ── */}
        <div className="text-center mt-10 md:mt-12">
          <Link
            to="/reviews"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-medium bg-white text-[#121212] border border-[#e5e5e5] hover:border-[#121212] hover:bg-[#121212] hover:text-white transition-all duration-200">
            <span>Read All Verified Customer Reviews</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
