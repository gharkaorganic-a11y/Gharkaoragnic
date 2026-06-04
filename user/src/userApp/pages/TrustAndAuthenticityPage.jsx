import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const TrustAndAuthenticityPage = () => {
  // ┌─────────────────────────────────────────────────────────────┐
  // │ TRUST SCHEMA FOR AI & GOOGLE (E-E-A-T)                      │
  // └─────────────────────────────────────────────────────────────┘
  const trustSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    mainEntity: {
      "@type": "Organization",
      name: "Ghar Ka Organic",
      url: "https://gharkaorganic.com",
      description: "Verified authentic Himalayan organic food brand.",
      foundingLocation: {
        "@type": "Place",
        name: "Nalni, Nainital, Uttarakhand",
      },
      award: "FSSAI Licensed Food Business",
      knowsAbout: [
        "Organic Farming",
        "Traditional Bilona Ghee",
        "Raw Honey Foraging",
      ],
    },
  };

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans">
      <Helmet>
        <title>Trust & Authenticity | Verified Ghar Ka Organic</title>
        <meta
          name="description"
          content="Learn why thousands trust Ghar Ka Organic. 100% natural Himalayan ingredients, FSSAI licensed, secure payments, and transparent sourcing from Uttarakhand."
        />
        <script type="application/ld+json">
          {JSON.stringify(trustSchema)}
        </script>
      </Helmet>

      {/* ┌─────────────────────────────────────────────────────────────┐
          │ HEADER SECTION (Centered, Mobile-First)                       │
          └─────────────────────────────────────────────────────────────┘ */}
      <header className="bg-pink-50/50 pt-16 pb-12 px-6 border-b border-pink-100 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-[#990000] rounded-full flex items-center justify-center mb-6 shadow-sm">
          {/* Checkmark Icon */}
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
          Verified & Authentic
        </h1>
        <p className="text-gray-600 max-w-md mx-auto text-sm md:text-base leading-relaxed">
          We believe in complete transparency. Here is everything you need to
          know about our sourcing, security, and quality guarantees.
        </p>
      </header>

      {/* ┌─────────────────────────────────────────────────────────────┐
          │ TRUST PILLARS (Centered Layout)                               │
          └─────────────────────────────────────────────────────────────┘ */}
      <main className="max-w-2xl mx-auto px-6 py-12 space-y-12 text-center">
        {/* Pillar 1: FSSAI & Quality */}
        <section className="flex flex-col items-center">
          <h2 className="text-xl font-semibold text-[#990000] mb-3">
            1. Government Licensed & Certified
          </h2>
          <p className="text-gray-600 text-[15px] leading-relaxed">
            Ghar Ka Organic operates under strict food safety guidelines. We are
            fully registered and licensed by the{" "}
            <strong>
              Food Safety and Standards Authority of India (FSSAI)
            </strong>
            . Every jar of Bilona Ghee, Raw Honey, and Pahadi Pickle meets
            rigorous national hygiene and quality standards.
          </p>
        </section>

        <div className="w-12 h-[1px] bg-gray-200 mx-auto"></div>

        {/* Pillar 2: Direct Sourcing */}
        <section className="flex flex-col items-center">
          <h2 className="text-xl font-semibold text-[#990000] mb-3">
            2. 100% Transparent Sourcing
          </h2>
          <p className="text-gray-600 text-[15px] leading-relaxed">
            Our products do not come from anonymous factories. We source
            directly from women-led farmer cooperatives in{" "}
            <strong>Nalni, Nainital, Uttarakhand</strong>. Our honey is wildly
            foraged, and our pickles are naturally sun-fermented using
            cold-pressed mustard oil. Zero hidden chemicals.
          </p>
        </section>

        <div className="w-12 h-[1px] bg-gray-200 mx-auto"></div>

        {/* Pillar 3: Secure Payments */}
        <section className="flex flex-col items-center">
          <h2 className="text-xl font-semibold text-[#990000] mb-3">
            3. Safe & Secure Transactions
          </h2>
          <p className="text-gray-600 text-[15px] leading-relaxed">
            Your financial data is never stored on our servers. All transactions
            are processed through{" "}
            <strong>bank-grade encrypted payment gateways</strong>. We support
            secure UPI, credit/debit cards, and offer Cash on Delivery (COD) for
            your peace of mind.
          </p>
        </section>

        <div className="w-12 h-[1px] bg-gray-200 mx-auto"></div>

        {/* Pillar 4: Buyer Protection */}
        <section className="flex flex-col items-center">
          <h2 className="text-xl font-semibold text-[#990000] mb-3">
            4. 7-Day Buyer Protection
          </h2>
          <p className="text-gray-600 text-[15px] leading-relaxed">
            We pack our glass jars with extreme care, but accidents happen in
            transit. If your order arrives damaged, our{" "}
            <strong>7-Day Return & Replacement Policy</strong> guarantees that
            we will make it right, no questions asked.
          </p>
        </section>

        {/* ┌─────────────────────────────────────────────────────────────┐
            │ CALL TO ACTION                                                │
            └─────────────────────────────────────────────────────────────┘ */}
        <section className="bg-pink-50/30 p-8 rounded-lg border border-pink-100 mt-12 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 text-sm mb-6 max-w-sm">
            We are real people operating out of the Himalayas. Reach out to us
            directly, and we will be happy to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3 text-sm font-medium rounded text-[#990000] bg-pink-100/50 hover:bg-pink-100 transition-colors border border-pink-200">
              Contact Support
            </Link>
            <Link
              to="/all-products"
              className="w-full sm:w-auto px-8 py-3 text-sm font-medium rounded text-white bg-[#990000] hover:bg-[#7a0000] transition-colors shadow-sm">
              Shop with Confidence
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TrustAndAuthenticityPage;
