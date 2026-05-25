import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import SectionBanner from "../features/userProfile/components/SectionBanner";

const BRAND_GREEN = "#4c908a";
const BRAND_YELLOW = "#f4a51c";

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

  return (
    <section className="relative py-20 bg-[#f7ecd7] overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[#f7d26a]/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-[#4c908a]/10 blur-3xl" />
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
                  className="w-full flex justify-between items-center gap-5 px-6 py-6 text-left">
                  <div>
                    <span
                      className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3 block"
                      style={{ color: BRAND_GREEN }}>
                      {faq.category}
                    </span>

                    <h3
                      className={`text-[16px] md:text-lg font-semibold transition-colors leading-7 ${
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
                  <div className="px-6 pb-6 text-[15px] text-[#6a4a2f] leading-8 animate-in slide-in-from-top-2 duration-300">
                    {faq.answer}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Bottom Brand Block */}
        <div className="mt-20 p-10 rounded-[32px] bg-white border border-[#ecd39b] shadow-xl text-center">
          <p className="text-sm text-[#9c6200] uppercase tracking-[0.3em] font-semibold mb-5">
            Pure Taste • Pahadi Roots • Zero Preservatives
          </p>

          <h3 className="text-2xl md:text-3xl font-semibold text-[#3b2412] mb-6">
            Crafted with the Soul of the Mountains
          </h3>

          <p className="text-[#5c3a1f] leading-8 max-w-3xl mx-auto text-[15px] md:text-base">
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
