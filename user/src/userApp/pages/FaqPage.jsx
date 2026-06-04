import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const BASE_URL = "https://gharkaorganic.com";
const CANONICAL = `${BASE_URL}/faq`;

const faqs = [
  {
    question: "Are your pickles really homemade?",
    answer:
      "Yes, all our pickles are prepared in small batches using traditional recipes from Uttarakhand. We use natural ingredients and no artificial preservatives. Each batch is made with care to ensure authentic taste and quality.",
    category: "Quality",
  },
  {
    question: "Do you use any preservatives or chemicals?",
    answer:
      "No. Ghar Ka Organic products are 100% natural. We do not use any artificial preservatives, chemicals, or additives. All our pickles, honey, and ghee are made using traditional methods with natural ingredients only.",
    category: "Quality",
  },
  {
    question: "What is A2 Bilona Ghee?",
    answer:
      "A2 Bilona Ghee is made using traditional hand-churning methods from A2 milk of desi cows. This ancient method is considered more nutritious and easier to digest compared to commercial ghee. Our A2 Bilona Desi Ghee retains all natural nutrients and authentic aroma.",
    category: "Products",
  },
  {
    question: "Where are your products made?",
    answer:
      "Our products are sourced and prepared in Uttarakhand using traditional methods and locally sourced ingredients. We work directly with local farmers and follow Kumaoni and Pahadi recipes passed down through generations.",
    category: "Company",
  },
  {
    question: "Do you offer Cash on Delivery (COD)?",
    answer:
      "Yes, we offer Cash on Delivery across most locations in India. You can also pay online via credit card, debit card, or digital wallets. Choose the payment method that's most convenient for you during checkout.",
    category: "Shipping",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are usually delivered within 3–5 business days depending on your location. We ship across all major cities and states in India with free shipping on all orders. You'll receive a tracking number to monitor your shipment.",
    category: "Shipping",
  },
  {
    question: "Is your honey raw and unprocessed?",
    answer:
      "Yes, our Raw Pahadi Honey is raw, unprocessed, and sourced directly from natural forest regions in Uttarakhand. We do not filter, heat, or add any additives. The honey you receive is pure forest honey in its natural state.",
    category: "Products",
  },
  {
    question: "How should I store pickles and ghee?",
    answer:
      "Store pickles in a cool, dry place and always use a dry spoon to prevent moisture. Our pickles naturally last 6-12 months when stored properly. Ghee should be kept in an airtight container away from moisture and sunlight. Properly stored ghee can last 12+ months.",
    category: "Storage",
  },
  {
    question: "What is your return and refund policy?",
    answer:
      "We offer a 7-day return policy on all products. If you're unsatisfied with your purchase, you can return it within 7 days for a full refund. No restocking fees apply. Contact our customer support team to initiate a return.",
    category: "Shipping",
  },
];

const MASTER_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": `${CANONICAL}#faqpage`,
      url: CANONICAL,
      name: "FAQ - Ghar Ka Organic",
      description:
        "Frequently asked questions about Ghar Ka Organic homemade organic products, including pickles, A2 ghee, honey, delivery, and quality.",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },

    {
      "@type": "BreadcrumbList",
      "@id": `${CANONICAL}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "FAQ",
          item: CANONICAL,
        },
      ],
    },

    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "FAQ - Ghar Ka Organic Organic Products",
      description:
        "Answers to common questions about our homemade Himalayan pickles, A2 ghee, raw honey, and organic food products.",
      isPartOf: {
        "@id": `${BASE_URL}/#website`,
      },
    },
  ],
};

const FAQPage = () => {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const toggleExpanded = (index) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  const categories = [...new Set(faqs.map((faq) => faq.category))];

  return (
    <>
      <Helmet>
        {/* ┌─────────────────────────────────────────────────────┐ */}
        {/* │ BASIC SEO TAGS                                      │ */}
        {/* └─────────────────────────────────────────────────────┘ */}
        <title>FAQ | Ghar Ka Organic – Questions About Organic Products</title>

        <meta
          name="description"
          content="Find answers to common questions about Ghar Ka Organic homemade pickles, A2 Bilona Desi Ghee, raw forest honey, delivery, quality, and storage."
        />

        <meta
          name="keywords"
          content="FAQ, questions, organic products, A2 ghee, pickles, honey, delivery, Ghar Ka Organic, Himalayan food"
        />

        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1"
        />

        <link rel="canonical" href={CANONICAL} />

        <meta name="author" content="Ghar Ka Organic" />

        {/* ┌─────────────────────────────────────────────────────┐ */}
        {/* │ OPEN GRAPH - SOCIAL SHARING                         │ */}
        {/* └─────────────────────────────────────────────────────┘ */}
        <meta property="og:type" content="website" />

        <meta property="og:title" content="FAQ - Ghar Ka Organic" />

        <meta
          property="og:description"
          content="Common questions and answers about our organic pickles, ghee, honey, and delivery."
        />

        <meta property="og:url" content={CANONICAL} />

        <meta property="og:site_name" content="Ghar Ka Organic" />

        <meta
          property="og:image"
          content="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/og-cover-gko.webp"
        />

        <meta property="og:locale" content="en_IN" />

        {/* ┌─────────────────────────────────────────────────────┐ */}
        {/* │ TWITTER CARD                                        │ */}
        {/* └─────────────────────────────────────────────────────┘ */}
        <meta name="twitter:card" content="summary_large_image" />

        <meta name="twitter:title" content="FAQ - Ghar Ka Organic" />

        <meta
          name="twitter:description"
          content="Questions about organic products, delivery, and quality"
        />

        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/og-cover-gko.webp"
        />

        {/* ┌─────────────────────────────────────────────────────┐ */}
        {/* │ JSON-LD SCHEMA                                      │ */}
        {/* └─────────────────────────────────────────────────────┘ */}
        <script type="application/ld+json">
          {JSON.stringify(MASTER_SCHEMA)}
        </script>
      </Helmet>

      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-amber-500 text-white px-4 py-2 rounded z-50">
        Skip to main content
      </a>

      <div className="bg-[#F9F5EF] text-gray-800 px-6 py-12 min-h-screen">
        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="max-w-4xl mx-auto mb-8 text-sm text-gray-600">
          <ol className="flex items-center gap-2">
            <li>
              <a href="/" className="hover:text-black transition">
                Home
              </a>
            </li>
            <li>/</li>
            <li className="text-gray-900" aria-current="page">
              FAQ
            </li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* PAGE HEADER */}
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our homemade organic products
              from Uttarakhand. Can't find your answer? Contact us anytime.
            </p>
          </header>

          {/* QUICK LINKS BY CATEGORY */}
          <div className="mb-12 p-6 bg-white rounded-lg border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">
              Browse by category:
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <a
                  key={category}
                  href={`#${category.toLowerCase()}`}
                  className="px-4 py-2 rounded-full bg-amber-100 text-amber-900 hover:bg-amber-200 transition text-sm font-medium">
                  {category}
                </a>
              ))}
            </div>
          </div>

          {/* FAQ ITEMS - SEMANTIC HTML WITH DETAILS/SUMMARY */}
          <div id="main-content" className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                id={`faq-${index}`}
                className="group bg-white rounded-lg border border-gray-200 overflow-hidden transition hover:shadow-md"
                open={expandedIndex === index}
                onToggle={() => toggleExpanded(index)}>
                <summary
                  className="cursor-pointer flex items-center justify-between p-6 hover:bg-gray-50 transition"
                  role="button"
                  tabIndex={0}>
                  <h2 className="text-lg font-semibold text-gray-900 group-open:text-amber-600 transition pr-4">
                    {faq.question}
                  </h2>
                  <ChevronDown
                    size={24}
                    className="text-gray-400 group-open:rotate-180 transition flex-shrink-0"
                    aria-hidden="true"
                  />
                </summary>

                <div className="px-6 pb-6 border-t border-gray-100 text-gray-700 leading-relaxed">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>

          {/* INTERNAL LINKS TO PRODUCTS */}
          <section className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Products
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Link
                to="/buy-desi-ghee-online"
                className="p-6 bg-white rounded-lg border border-gray-200 hover:border-amber-500 hover:shadow-md transition">
                <h3 className="font-semibold text-gray-900 mb-2 hover:text-amber-600 transition">
                  → A2 Bilona Desi Ghee
                </h3>
                <p className="text-sm text-gray-600">
                  Traditional hand-churned ghee from A2 cow milk
                </p>
              </Link>

              <Link
                to="/raw-honey-uttarakhand"
                className="p-6 bg-white rounded-lg border border-gray-200 hover:border-amber-500 hover:shadow-md transition">
                <h3 className="font-semibold text-gray-900 mb-2 hover:text-amber-600 transition">
                  → Raw Pahadi Honey
                </h3>
                <p className="text-sm text-gray-600">
                  Pure raw forest honey from Himalayan regions
                </p>
              </Link>

              <Link
                to="/pahadi-achar-online"
                className="p-6 bg-white rounded-lg border border-gray-200 hover:border-amber-500 hover:shadow-md transition">
                <h3 className="font-semibold text-gray-900 mb-2 hover:text-amber-600 transition">
                  → Kumaoni Aam Achar
                </h3>
                <p className="text-sm text-gray-600">
                  Traditional mango pickle with no preservatives
                </p>
              </Link>

              <Link
                to="/contact"
                className="p-6 bg-white rounded-lg border border-gray-200 hover:border-amber-500 hover:shadow-md transition">
                <h3 className="font-semibold text-gray-900 mb-2 hover:text-amber-600 transition">
                  → Contact Us
                </h3>
                <p className="text-sm text-gray-600">
                  Can't find your answer? Get in touch with our team
                </p>
              </Link>
            </div>
          </section>

          {/* CTA SECTION */}
          <section className="mt-16 p-8 bg-amber-50 rounded-lg border border-amber-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Still have questions?
            </h2>

            <p className="text-gray-700 mb-6">
              Reach out to our customer support team. We're here to help!
            </p>

            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium">
              Contact Us →
            </a>
          </section>
        </div>
      </div>
    </>
  );
};

export default FAQPage;
