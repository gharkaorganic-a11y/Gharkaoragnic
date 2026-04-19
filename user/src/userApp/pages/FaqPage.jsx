import React from "react";
import { Helmet } from "react-helmet-async";

const faqs = [
  {
    question: "Are your pickles really homemade?",
    answer:
      "Yes, all our pickles are prepared in small batches using traditional recipes from Uttarakhand. We use natural ingredients and no artificial preservatives.",
  },
  {
    question: "Do you use any preservatives or chemicals?",
    answer:
      "No. GharKaOrganic products are 100% natural. We do not use any artificial preservatives, chemicals, or additives.",
  },
  {
    question: "What is A2 Bilona Ghee?",
    answer:
      "A2 Bilona Ghee is made using traditional hand-churning methods from A2 milk of desi cows. It is considered more nutritious and easier to digest.",
  },
  {
    question: "Where are your products made?",
    answer:
      "Our products are sourced and prepared in Uttarakhand using traditional methods and locally sourced ingredients.",
  },
  {
    question: "Do you offer Cash on Delivery (COD)?",
    answer: "Yes, we offer Cash on Delivery across most locations in India.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are usually delivered within 3–7 business days depending on your location.",
  },
  {
    question: "Is your honey raw and unprocessed?",
    answer:
      "Yes, our honey is raw, unprocessed, and sourced directly from natural forest regions in Uttarakhand.",
  },
  {
    question: "How should I store pickles and ghee?",
    answer:
      "Store pickles in a cool, dry place and always use a dry spoon. Ghee should be kept in an airtight container away from moisture.",
  },
];

const FAQPage = () => {
  return (
    <div className="bg-[#F9F5EF] text-gray-800 px-6 py-12">
      {/* SEO META */}
      <Helmet>
        <title>FAQ | GharKaOrganic - Homemade Organic Products</title>
        <meta
          name="description"
          content="Find answers to common questions about GharKaOrganic products including pickles, A2 ghee, honey, delivery, and quality."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* PAGE TITLE */}
        <h1 className="text-4xl font-bold text-center mb-6">
          Frequently Asked Questions
        </h1>

        <p className="text-center text-gray-600 mb-10">
          Everything you need to know about our homemade organic products.
        </p>

        {/* FAQ LIST */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow">
              <h2 className="font-semibold text-lg mb-2">{faq.question}</h2>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ SCHEMA (VERY IMPORTANT FOR SEO) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        })}
      </script>
    </div>
  );
};

export default FAQPage;
