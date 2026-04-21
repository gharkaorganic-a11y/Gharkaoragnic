import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const BRAND_GREEN = "#0B8A52";

const faqData = [
  {
    id: 1,
    category: "Shipping",
    question: "How long does delivery take across India?",
    answer:
      "Orders are dispatched within 24 hours. Delivery typically takes 3–5 business days across India and 1–2 days in metro cities.",
  },
  {
    id: 2,
    category: "Quality",
    question: "Are your products truly natural and chemical-free?",
    answer:
      "Yes. All products are made in small batches using traditional Himalayan methods with no preservatives, artificial colors, or additives.",
  },
  {
    id: 3,
    category: "Returns",
    question: "What if I am not satisfied with the product?",
    answer:
      "We offer a 7–15 day satisfaction support. If you face any issue, we provide replacement or resolution based on product condition.",
  },
  {
    id: 4,
    category: "Orders",
    question: "How will I track my order?",
    answer:
      "Once shipped, you receive WhatsApp and SMS tracking links with real-time delivery updates.",
  },
  {
    id: 5,
    category: "Products",
    question: "Is your A2 Desi Ghee made using traditional methods?",
    answer:
      "Yes. Our A2 ghee is prepared using the Bilona method from indigenous cows, ensuring purity and nutrition.",
  },
  {
    id: 6,
    category: "Payments",
    question: "Do you offer Cash on Delivery (COD)?",
    answer:
      "Yes, COD is available on most pincodes for orders above ₹299. We also support UPI, cards, and net banking.",
  },
];

const FaqSection = () => {
  const [activeId, setActiveId] = useState(1);

  const toggle = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* SEO HEADER */}
        <header className="text-center mb-12">
          <span
            className="inline-block px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white rounded-full mb-4"
            style={{ backgroundColor: BRAND_GREEN }}>
            Support
          </span>

          <h2 className="text-2xl sm:text-4xl font-semibold text-gray-900">
            Frequently Asked Questions
          </h2>

          <p className="text-gray-600 mt-3 text-sm sm:text-base max-w-2xl mx-auto">
            Learn about our Himalayan organic products, shipping process,
            quality standards, and customer support.
          </p>
        </header>

        {/* FAQ LIST */}
        <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {faqData.map((faq) => {
            const isOpen = activeId === faq.id;

            return (
              <article
                key={faq.id}
                className={`border-b last:border-b-0 transition ${
                  isOpen ? "bg-green-50/40" : "hover:bg-gray-50"
                }`}>
                {/* QUESTION */}
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex justify-between items-start gap-4 px-5 py-5 text-left"
                  aria-expanded={isOpen}>
                  <div>
                    <p
                      className="text-[11px] font-semibold uppercase tracking-widest mb-1"
                      style={{ color: BRAND_GREEN }}>
                      {faq.category}
                    </p>

                    <h3 className="text-base font-semibold text-gray-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <ChevronDownIcon
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* ANSWER */}
                <div
                  className={`px-5 pb-5 text-sm text-gray-700 leading-relaxed transition-all ${
                    isOpen ? "block" : "hidden sm:block"
                  }`}>
                  {faq.answer}
                </div>
              </article>
            );
          })}
        </div>

        {/* BRAND TRUST BLOCK (SEO + STORY BOOST) */}
        <div className="mt-14 text-center text-sm text-gray-600 leading-relaxed max-w-3xl mx-auto">
          <strong className="text-gray-900">Ghar Ka Organic</strong> works
          directly with Himalayan women-led communities producing A2 Desi Ghee,
          Raw Forest Honey, Pahadi Pickles, and traditional spices.
          <br />
          <br />
          Our mission is simple: deliver authentic, chemical-free food to urban
          families while supporting “Vocal for Local” and sustainable rural
          livelihoods.
        </div>

        {/* SEO fallback */}
        <noscript>
          <div className="mt-6 text-sm text-gray-700">
            All FAQs are available on this page including shipping, returns,
            payments, and product quality information.
          </div>
        </noscript>
      </div>
    </section>
  );
};

export default FaqSection;
