import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import SectionBanner from "../features/userProfile/components/SectionBanner";

const BRAND_GREEN = "#315c3c";

// Must match JSON-LD in index.html exactly
const faqData = [
  {
    id: 1,
    category: "Quality",
    question: "Are Ghar Ka Organic products 100% natural?",
    answer:
      "Yes. All our products are made with natural Himalayan ingredients, free from artificial preservatives, colors or additives.",
  },
  {
    id: 2,
    category: "Shipping",
    question: "Do you deliver across India?",
    answer:
      "Yes, we deliver our Pahadi products across all major cities and states in India.",
  },
  {
    id: 3,
    category: "Products",
    question: "What is Bilona Desi Ghee?",
    answer:
      "Bilona Desi Ghee is made using the traditional bilona method where curd from A2 cow milk is hand-churned to extract butter, which is then slow-cooked into ghee. It is purer and more nutritious than commercially produced ghee.",
  },
  {
    id: 4,
    category: "Products",
    question: "What makes Pahadi Honey different from regular honey?",
    answer:
      "Pahadi honey is collected from wild Himalayan forest bees. It is raw, unfiltered and free from any processing or added sugar, giving it a richer flavor and more natural nutrients than store-bought honey.",
  },
  {
    id: 5,
    category: "Storage",
    question: "How long do your pickles last?",
    answer:
      "Our homemade pahadi pickles have a shelf life of 12 months when stored in a cool, dry place away from direct sunlight. Always use a clean, dry spoon.",
  },
];

const FaqSection = () => {
  const [activeId, setActiveId] = useState(1);

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-16" id="faq">
      <div className="relative mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10 text-center sm:mb-12">
          <SectionBanner title="Frequently Asked Questions" />

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#687267] sm:text-base sm:leading-8">
            Everything you need to know about our Himalayan organic journey,
            traditional pahadi products, and homemade goodness.
          </p>
        </header>

        {/* FAQ Items */}
        <div className="space-y-5">
          {faqData.map((faq) => {
            const isOpen = activeId === faq.id;

            return (
              <article
                key={faq.id}
                className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-[#b8cdb8] bg-white shadow-sm"
                    : "border-[#e7e5dc] bg-white hover:border-[#b8cdb8]"
                }`}>
                <button
                  onClick={() => setActiveId(isOpen ? null : faq.id)}
                  className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}>
                  <div>
                    <span
                      className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#47724d] sm:text-xs"
                      style={{ color: BRAND_GREEN }}>
                      {faq.category}
                    </span>

                    <h3
                      className={`text-sm font-semibold leading-6 transition-colors sm:text-base sm:leading-7 ${
                        isOpen ? "text-[#263329]" : "text-[#445047]"
                      }`}>
                      {faq.question}
                    </h3>
                  </div>

                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform duration-500 flex-shrink-0 ${
                      isOpen
                        ? "rotate-180 text-[#315c3c]"
                        : "text-[#8b7651] group-hover:text-[#315c3c]"
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    className="animate-in px-5 pb-5 text-sm leading-7 text-[#687267] duration-300 slide-in-from-top-2 sm:px-6 sm:pb-6 sm:text-base sm:leading-8">
                    {faq.answer}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Bottom Brand Block */}
        <div className="mt-12 rounded-2xl border border-[#e7e5dc] bg-white p-6 text-center shadow-sm sm:mt-16 sm:p-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8b7651] sm:text-sm">
            Pure Taste • Pahadi Roots • Zero Preservatives
          </p>

          <h3 className="mb-5 font-sans text-2xl font-semibold text-[#263329] md:text-3xl">
            Crafted with the Soul of the Mountains
          </h3>

          <p className="mx-auto max-w-3xl text-sm leading-7 text-[#687267] sm:text-base sm:leading-8">
            <strong>GHAR KA ORGANIC</strong> brings authentic Himalayan flavors
            directly from Uttarakhand to your home. Every product reflects
            traditional pahadi food wisdom, natural ingredients, homemade
            authenticity, and the warmth of real “ghar ka khaana”.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <span className="rounded-full border border-[#e7e5dc] bg-white px-5 py-2 text-sm font-medium text-[#52644d]">
              Homemade Goodness
            </span>

            <span className="rounded-full border border-[#e7e5dc] bg-white px-5 py-2 text-sm font-medium text-[#52644d]">
              Traditional Pahadi Taste
            </span>

            <span className="rounded-full border border-[#e7e5dc] bg-white px-5 py-2 text-sm font-medium text-[#52644d]">
              Chemical Free
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
