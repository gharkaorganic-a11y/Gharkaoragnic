import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export const faqData = [
  {
    question: "How long does shipping usually take?",
    answer:
      "Orders are processed within 24 hours. Standard shipping typically takes 3-5 business days, while express shipping arrives in 1-2 business days.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day happiness guarantee. If you're not completely satisfied, you can return it within 30 days for a full refund.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship worldwide. Shipping rates vary depending on your location and will be calculated at checkout.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once shipped, you’ll receive a tracking link via email. You can also track it from your account dashboard.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "You can request changes within 1 hour of placing your order. After that, processing begins and changes aren’t guaranteed.",
  },
];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-[#FFFDF7] py-16 sm:py-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold tracking-wide uppercase mb-4">
            Support
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-gray-500 text- sm:text-base mt-3 max-w-xl mx-auto">
            Clear, honest answers to help you shop with confidence.
          </p>
        </div>

        {/* FAQ Card */}
        <div className="bg-white border border-yellow-100 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-yellow-100">
          {faqData.map((faq, index) => {
            const isOpen = activeIndex === index;
            const buttonId = `faq-button-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <div
                key={index}
                className={`transition-colors duration-200 motion-reduce:transition-none ${
                  isOpen ? "bg-yellow-50/40" : "hover:bg-yellow-50/20"
                }`}>
                <h3>
                  <button
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between gap-4 px-6 sm:px-8 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 rounded-lg">
                    <span
                      className={`text- sm:text- font-semibold transition-colors duration-200 ${
                        isOpen ? "text-yellow-700" : "text-gray-900"
                      }`}>
                      {faq.question}
                    </span>

                    <div
                      className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 ${
                        isOpen
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                      <ChevronDownIcon
                        className={`w-5 h-5 transform transition-transform duration-200 motion-reduce:transition-none ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                </h3>

                {/* Answer */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`overflow-hidden transition-all duration-300 ease-in-out motion-reduce:transition-none ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}>
                  <div className="px-6 sm:px-8 pb-6 pt-0 text-gray-600 text- leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-gradient-to-br from-yellow-50 to-white border border-yellow-100 rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Still have questions?
          </h3>

          <p className="text-gray-500 text-sm mb-5">
            Our team is here to help you anytime.
          </p>

          <button className="bg-yellow-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-yellow-600 hover:shadow-lg hover:shadow-yellow-500/30 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
