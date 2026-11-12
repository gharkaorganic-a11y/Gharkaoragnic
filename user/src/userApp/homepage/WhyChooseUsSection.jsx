import React, { useState, memo } from "react";
import { ChevronDown } from "lucide-react";

const COMPARISON_ROWS = [
  {
    feature: "Zero unnecessary chemicals & artificial preservatives",
    gharka: true,
    others: false,
  },
  {
    feature: "Traditional recipes inspired by mothers' kitchens",
    gharka: true,
    others: false,
  },
  {
    feature: "Carefully selected natural & honest ingredients",
    gharka: true,
    others: false,
  },
  {
    feature: "Pure homemade taste (Ghar Ka Khana) — not factory made",
    gharka: true,
    others: false,
  },
];

const FAQ_ITEMS = [
  {
    id: 1,
    question: "Where did GHAR KA begin its journey?",
    answer:
      "GHAR KA began its journey in the small town of Mangoli, Nainital, Uttarakhand, surrounded by the natural beauty, traditions, and food culture of the hills. Growing up around the simplicity of pahadi food inspired us to preserve the authentic taste of Ghar Ka Khana.",
  },
  {
    id: 2,
    question: "Are your products free from chemicals and preservatives?",
    answer:
      "Yes, 100%. At GHAR KA, we believe that food does not need unnecessary chemicals or artificial preservatives to taste good. Our focus is on keeping things as natural and simple as possible so families know exactly what goes into their food.",
  },
  {
    id: 3,
    question: "What makes GHAR KA different from commercial food corporations?",
    answer:
      "We are not a large food corporation, nor did we start with the ambition of becoming one. In a world where food is heavily commercialized and processed, we make products the way they belong in our homes—using carefully selected ingredients and traditional recipes that respect natural goodness.",
  },
  {
    id: 4,
    question: "What products do you make at GHAR KA?",
    answer:
      "From traditional homemade pickles and pure bilona ghee to natural raw forest honey, authentic pahadi dals, mountain spices, and traditional pahadi salts—every product represents our effort to bring familiar flavours and wholesome goodness to modern kitchens.",
  },
  {
    id: 5,
    question: "How are your pickles and traditional recipes prepared?",
    answer:
      "Our recipes are drawn from our mothers' kitchens and traditional methods passed down in homes for generations. We don't believe in changing food just to make it commercial; we preserve the taste, warmth, and simplicity of genuine home cooking.",
  },
  {
    id: 6,
    question: "Do you deliver across India from Uttarakhand?",
    answer:
      "Yes. Our journey started in Mangoli, Nainital, but our dream is to take the familiar taste of home to households everywhere across India. Every order is packed with care and shipped directly to your doorstep.",
  },
  {
    id: 7,
    question: "How do you source your ingredients?",
    answer:
      "We source honest, natural ingredients directly from local mountain farmers and traditional growers in Uttarakhand. We pay fair prices to the growers and ensure every jar is crafted with love and care.",
  },
  {
    id: 8,
    question: "What does 'From Our Home to Yours' mean to GHAR KA?",
    answer:
      "GHAR KA is not just about selling food—it is about bringing back a feeling. It's about opening a jar of pickle and remembering childhood, enjoying simple pahadi flavours, and knowing the food you serve your family is made with love and honest ingredients.",
  },
];

const WhyChooseUsSection = () => {
  const [openFaq, setOpenFaq] = useState(1);

  const toggleFaq = (id) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="why-choose-us"
      aria-label="Why choose Ghar Ka Organic"
      className="w-full bg-[#fcfbf7] py-14 sm:py-20 font-sans border-t border-[#f0eee6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* ══════════════════════════════════════════════
              LEFT COLUMN: WHY CHOOSE US? COMPARISON TABLE
             ══════════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl border border-[#eceae1] p-6 sm:p-8 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] h-full">
            <div>
              <div className="text-center lg:text-left mb-6 sm:mb-8">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7B4627] block mb-1">
                  Honest & Natural
                </span>
                <h2 className="text-2xl sm:text-3xl font-normal sm:font-medium text-[#121212] tracking-tight">
                  Why choose us?
                </h2>
              </div>

              <div className="relative pt-2">
                {/* 3-Column Comparison Grid */}
                <div className="grid grid-cols-[1fr_125px_65px] sm:grid-cols-[1fr_160px_85px] items-stretch">
                  {/* Header Row */}
                  <div className="pb-3 sm:pb-4" />
                  <div className="bg-[#244d37] text-white pt-4 pb-3 px-2 sm:px-4 rounded-t-3xl text-center flex items-center justify-center shadow-md">
                    <span className="text-xs sm:text-sm font-semibold tracking-tight text-white">
                      Ghar Ka Organic
                    </span>
                  </div>
                  <div className="pb-3 sm:pb-4 flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">
                      Others
                    </span>
                  </div>

                  {/* Rows */}
                  {COMPARISON_ROWS.map((row, idx) => {
                    const isLast = idx === COMPARISON_ROWS.length - 1;
                    return (
                      <React.Fragment key={idx}>
                        {/* Feature text */}
                        <div className="py-4 sm:py-5 pr-2 sm:pr-4 flex items-center border-b border-gray-100">
                          <span className="text-xs sm:text-[13px] md:text-sm text-gray-800 font-normal leading-snug">
                            {row.feature}
                          </span>
                        </div>

                        {/* Ghar Ka Organic Cell (Inside floating green pill) */}
                        <div
                          className={`bg-[#244d37] text-white flex items-center justify-center py-4 sm:py-5 shadow-md ${
                            isLast ? "rounded-b-3xl pb-6" : ""
                          }`}>
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white flex items-center justify-center text-white">
                            <svg
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        </div>

                        {/* Others Cell */}
                        <div className="py-4 sm:py-5 flex items-center justify-center border-b border-gray-100">
                          <svg
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700 stroke-[2.2]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium text-gray-700">Born in Mangoli, Nainital</span>
              <span>From Our Home to Yours</span>
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              RIGHT COLUMN: THINGS PEOPLE ASK US (FAQ)
             ══════════════════════════════════════════════ */}
          <div
            id="faq"
            className="bg-[#fcfaf2] rounded-3xl border border-[#f0ebd8] p-6 sm:p-8 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] h-full">
            <div>
              <div className="text-center mb-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7B4627] block mb-1">
                  Questions & Answers
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#121212] tracking-tight">
                  Things People Ask Us
                </h2>
              </div>

              <div className="divide-y divide-[#ece7d3]">
                {FAQ_ITEMS.map((faq) => {
                  const isOpen = openFaq === faq.id;
                  return (
                    <article key={faq.id} className="py-3.5 first:pt-0 last:pb-0">
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex items-center justify-between gap-3 text-left py-1 group focus:outline-none"
                        aria-expanded={isOpen}>
                        <span
                          className={`text-xs sm:text-[13px] md:text-sm font-medium leading-snug transition-colors ${
                            isOpen
                              ? "text-[#244d37] font-semibold"
                              : "text-[#222222] group-hover:text-[#244d37]"
                          }`}>
                          {faq.question}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`shrink-0 text-gray-500 transition-transform duration-300 ${
                            isOpen ? "rotate-180 text-[#244d37]" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="pt-2 pb-1 pr-4 animate-in fade-in duration-200">
                          <p className="text-xs sm:text-[13px] text-[#555555] font-light leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Bottom Support Callout */}
            <div className="mt-8 pt-4 border-t border-[#ece7d3] flex items-center justify-between text-xs text-[#737373]">
              <span>Have more questions?</span>
              <a
                href="https://wa.me/919897447525"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#244d37] hover:underline">
                Chat on WhatsApp (+91 98974 47525) →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(WhyChooseUsSection);
