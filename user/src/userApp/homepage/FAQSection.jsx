import React, { useState, useMemo } from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const BRAND_GREEN = "#0B8A52";

export const faqData = [
  {
    id: 1,
    category: "Shipping",
    question: "How long does shipping usually take?",
    answer:
      "Orders are processed within 24 hours. Standard shipping takes 3-5 business days across India. Express shipping arrives in 1-2 business days for metro cities.",
  },
  {
    id: 2,
    category: "Quality",
    question: "Are your products 100% organic & preservative free?",
    answer:
      "Yes. All our Pahadi products are sourced directly from farmers and made in small batches. No artificial preservatives, colors, or chemicals added.",
  },
  {
    id: 3,
    category: "Returns",
    question: "What if I don't like the taste?",
    answer:
      "We offer a 15-day taste guarantee. If you're not satisfied with the quality or taste, contact us and we'll refund or replace it. No questions asked.",
  },
  {
    id: 4,
    category: "Orders",
    question: "How can I track my order?",
    answer:
      "You’ll get SMS + WhatsApp updates with live tracking link once your order ships. You can also check status in 'My Orders' section.",
  },
  {
    id: 5,
    category: "Products",
    question: "Is your Desi Cow Ghee A2 grade?",
    answer:
      "Yes. Our Pure Desi Cow Ghee is made from A2 milk of Pahadi cows using traditional bilona method. Lab tested for purity.",
  },
  {
    id: 6,
    category: "Payment",
    question: "Is Cash on Delivery available?",
    answer:
      "COD is available for orders above ₹299 in most pin codes. UPI, Cards, and Net Banking also accepted with secure checkout.",
  },
];

const categories = ["All", ...new Set(faqData.map((f) => f.category))];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const filteredFaqs = useMemo(() => {
    return faqData.filter((faq) => {
      const matchesCategory =
        activeCategory === "All" || faq.category === activeCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-white text- font-semibold tracking-wider uppercase mb-4"
            style={{ backgroundColor: BRAND_GREEN }}>
            Support
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-3">
            Questions? We’ve Got Answers
          </h2>

          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Everything you need to know about our Pahadi products, shipping, and
            quality promise.
          </p>
        </div>

        {/* Search + Categories */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search FAQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:border-transparent transition-all"
              style={{ "--tw-ring-color": BRAND_GREEN }}
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all border ${
                  activeCategory === cat
                    ? "text-white shadow-sm"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
                style={{
                  backgroundColor: activeCategory === cat ? BRAND_GREEN : "",
                  borderColor: activeCategory === cat ? BRAND_GREEN : "",
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        {filteredFaqs.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {filteredFaqs.map((faq) => {
              const isOpen = activeIndex === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`border-b border-gray-100 last:border-b-0 transition-colors ${
                    isOpen ? "bg-green-50/30" : "hover:bg-gray-50/40"
                  }`}>
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-start justify-between gap-4 px-5 py-4 sm:py-5 text-left group">
                    <div className="flex-1">
                      <span
                        className="text- font-semibold uppercase tracking-wide mb-1 block"
                        style={{ color: BRAND_GREEN }}>
                        {faq.category}
                      </span>
                      <span className="text- sm:text-base font-semibold leading-snug text-gray-900">
                        {faq.question}
                      </span>
                    </div>

                    <div
                      className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200 ${
                        isOpen
                          ? "text-white rotate-180"
                          : "bg-gray-100 text-gray-500"
                      }`}
                      style={{ backgroundColor: isOpen ? BRAND_GREEN : "" }}>
                      <ChevronDownIcon className="w-4 h-4" />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}>
                    <div className="px-5 pb-5 pt-0 text-gray-700 text- leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-2xl">
            <p className="text-gray-500 font-medium text-sm">No FAQs found</p>
            <p className="text-xs text-gray-400 mt-1">
              Try a different search term
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <div
          className="mt-10 text-center rounded-2xl p-6 sm:p-8 text-white"
          style={{ backgroundColor: BRAND_GREEN }}>
          <h3 className="text-lg sm:text-xl font-bold mb-2">
            Still need help?
          </h3>
          <p className="text-green-100 text-sm mb-5 max-w-lg mx-auto">
            Our Pahadi team responds within 2 hours on WhatsApp. Ask us anything
            about products, orders, or sourcing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/91XXXXXXXXXX"
              className="bg-white text-gray-900 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-gray-50 hover:shadow-md">
              WhatsApp Us
            </a>
            <a
              href="mailto:support@yourdomain.com"
              className="bg-green-700/40 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-green-700/60 border border-green-600">
              Email Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
