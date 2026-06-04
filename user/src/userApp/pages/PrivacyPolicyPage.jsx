import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const PrivacyPolicyPage = () => {
  const lastUpdated = "June 4, 2026";

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans selection:bg-[#990000] selection:text-white">
      {/* ┌─────────────────────────────────────────────────────────────┐ */}
      {/* │ SEO & META TAGS                                             │ */}
      {/* └─────────────────────────────────────────────────────────────┘ */}
      <Helmet>
        <title>Privacy Policy | Ghar Ka Organic</title>
        <meta
          name="description"
          content="Privacy Policy for Ghar Ka Organic. Learn how we collect, use, and protect your personal information while shopping for authentic Himalayan food."
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://gharkaorganic.com/pages/privacy-policy"
        />
      </Helmet>

      {/* ┌─────────────────────────────────────────────────────────────┐ */}
      {/* │ HEADER SECTION                                              │ */}
      {/* └─────────────────────────────────────────────────────────────┘ */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 text-center">
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm tracking-wide uppercase">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* ┌─────────────────────────────────────────────────────────────┐ */}
      {/* │ MAIN DOCUMENT CONTENT                                       │ */}
      {/* └─────────────────────────────────────────────────────────────┘ */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white p-8 md:p-12 shadow-sm border-t-4 border-[#990000] rounded-b-lg text-[15px] leading-relaxed text-gray-600 space-y-10">
          <section>
            <p>
              Welcome to <strong>Ghar Ka Organic</strong> ("we," "our," or
              "us"). We are committed to protecting your personal information
              and your right to privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              visit our website and purchase our authentic Himalayan organic
              products.
            </p>
            <p className="mt-4">
              By accessing or using our website, you agree to the terms of this
              Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              1. Information We Collect
            </h2>
            <p className="mb-4">
              To provide you with our homemade Kumaoni products and ensure
              smooth pan-India delivery, we collect the following types of
              information:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-gray-800">
                  Personal Identification:
                </strong>{" "}
                Name, email address, phone number, and billing/shipping
                addresses.
              </li>
              <li>
                <strong className="text-gray-800">Payment Information:</strong>{" "}
                Processed securely through our third-party payment gateways
                (UPI, Credit/Debit cards). We do not store your full credit card
                numbers or UPI PINs on our servers.
              </li>
              <li>
                <strong className="text-gray-800">Account Data:</strong> Login
                credentials, order history, and saved preferences.
              </li>
              <li>
                <strong className="text-gray-800">
                  Automatically Collected Data:
                </strong>{" "}
                IP address, browser type, device specifications, and browsing
                behavior.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Order Fulfillment:</strong> To process transactions,
                verify payments, and deliver products to your doorstep.
              </li>
              <li>
                <strong>Customer Support:</strong> To resolve issues, process
                refunds, and respond to your inquiries.
              </li>
              <li>
                <strong>Communication:</strong> To send order confirmations,
                shipping updates, and administrative emails.
              </li>
              <li>
                <strong>Website Optimization:</strong> To analyze user behavior,
                improve our UI/UX, and ensure our platform runs securely.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              3. Information Sharing and Disclosure
            </h2>
            <p className="mb-4">
              We respect your privacy and do not sell or rent your personal
              information to third parties. We only share your data in the
              following operational circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Logistics Partners:</strong> Sharing your name, phone
                number, and shipping address with courier partners for order
                delivery.
              </li>
              <li>
                <strong>Payment Processors:</strong> Sharing transaction details
                with secure gateway partners to process payments safely.
              </li>
              <li>
                <strong>Legal Compliance:</strong> Disclosing information if
                required by law, such as to comply with FSSAI regulations or
                government requests.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              4. Data Security
            </h2>
            <p>
              We implement robust administrative, technical, and physical
              security measures to protect your personal information. Our
              website uses secure data networks protected by industry-standard
              SSL encryption. While we strive to protect your data, no method of
              transmission over the internet or electronic storage is 100%
              secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              5. Cookies and Tracking Technologies
            </h2>
            <p>
              Our website uses cookies and similar tracking technologies to
              track activity and improve your shopping experience. You can
              instruct your browser to refuse all cookies; however, if you do
              not accept cookies, some portions of our website (like your
              shopping cart) may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              6. Your Data Privacy Rights
            </h2>
            <p className="mb-4">
              Depending on your location, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Request access to the personal data we hold about you.</li>
              <li>Request corrections to any inaccurate or incomplete data.</li>
              <li>
                Request the deletion of your personal data, subject to legal
                exceptions.
              </li>
              <li>Opt-out of marketing communications at any time.</li>
            </ul>
          </section>

          <section className="bg-pink-50/50 p-6 rounded-md border border-pink-100 mt-8">
            <h2 className="text-lg font-semibold text-[#990000] mb-3">
              7. Contact Us
            </h2>
            <p className="mb-4 text-gray-700">
              If you have questions, concerns, or requests regarding this
              Privacy Policy, please reach out to our team:
            </p>
            <address className="not-italic text-gray-600 space-y-1">
              <p>
                <strong>Ghar Ka Organic</strong>
              </p>
              <p>Ward No. 2, Nalni</p>
              <p>Nainital, Uttarakhand 263136, India</p>
              <p className="pt-2">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:gharkaorganic@gmail.com"
                  className="text-[#990000] hover:underline">
                  gharkaorganic@gmail.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong> +91-9897447525
              </p>
            </address>
            <div className="mt-6">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-sm text-white bg-[#990000] hover:bg-[#7a0000] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#990000]">
                Contact Support
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
