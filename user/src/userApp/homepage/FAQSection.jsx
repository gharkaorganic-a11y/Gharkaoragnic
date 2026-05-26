import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import SectionBanner from "../features/userProfile/components/SectionBanner";

const BRAND_GREEN = "#4c908a";
const BRAND_YELLOW = "#f4a51c";

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
    <section className="relative py-20 bg-[#f7ecd7] overflow-hidden" id="faq">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w- h- rounded-full bg-[#f7d26a]/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w- h- rounded-full bg-[#4c908a]/10 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-16">
          <SectionBanner title="Frequently Asked Questions" />

          <p className="text-[#5c3a1f] mt-5 text-base max-w-2xl mx-auto leading-8">
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
                className={`group rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-white shadow-xl border-[#e7c36d]"
                    : "bg-[#fff7e7] border-[#f0dfb2] hover:border-[#d8a032] hover:bg-white"
                }`}>
                <button
                  onClick={() => setActiveId(isOpen ? null : faq.id)}
                  className="w-full flex justify-between items-center gap-5 px-6 py-6 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}>
                  <div>
                    <span
                      className="text- font-bold uppercase tracking-[0.2em] mb-3 block"
                      style={{ color: BRAND_GREEN }}>
                      {faq.category}
                    </span>

                    <h3
                      className={`text- md:text-lg font-semibold transition-colors leading-7 ${
                        isOpen ? "text-[#3b2412]" : "text-[#4f3422]"
                      }`}>
                      {faq.question}
                    </h3>
                  </div>

                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform duration-500 flex-shrink-0 ${
                      isOpen
                        ? "rotate-180 text-[#4c908a]"
                        : "text-[#b07a1c] group-hover:text-[#4c908a]"
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    className="px-6 pb-6 text- text-[#6a4a2f] leading-8 animate-in slide-in-from-top-2 duration-300">
                    {faq.answer}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Bottom Brand Block */}
        <div className="mt-20 p-10 rounded- bg-white border border-[#ecd39b] shadow-xl text-center">
          <p className="text-sm text-[#9c6200] uppercase tracking-[0.3em] font-semibold mb-5">
            Pure Taste • Pahadi Roots • Zero Preservatives
          </p>

          <h3 className="text-2xl md:text-3xl font-semibold text-[#3b2412] mb-6">
            Crafted with the Soul of the Mountains
          </h3>

          <p className="text-[#5c3a1f] leading-8 max-w-3xl mx-auto text- md:text-base">
            <strong>GHAR KA ORGANIC</strong> brings authentic Himalayan flavors
            directly from Uttarakhand to your home. Every product reflects
            traditional pahadi food wisdom, natural ingredients, homemade
            authenticity, and the warmth of real “ghar ka khaana”.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <span className="px-5 py-2 rounded-full bg-[#fff7e7] border border-[#efd9a2] text-[#6a4a2f] text-sm font-medium">
              Homemade Goodness
            </span>

            <span className="px-5 py-2 rounded-full bg-[#fff7e7] border border-[#efd9a2] text-[#6a4a2f] text-sm font-medium">
              Traditional Pahadi Taste
            </span>

            <span className="px-5 py-2 rounded-full bg-[#fff7e7] border border-[#efd9a2] text-[#6a4a2f] text-sm font-medium">
              Chemical Free
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
