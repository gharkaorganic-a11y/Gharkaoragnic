import React from "react";
import { Helmet } from "react-helmet";

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-[#F9F5EF] text-gray-800 px-6 py-12">
      {/* SEO META */}
      <Helmet>
        <title>Privacy Policy | GharKaOrganic</title>
        <meta
          name="description"
          content="Read GharKaOrganic privacy policy. Learn how we collect, use, and protect your personal information."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* TITLE */}
        <h1 className="text-4xl font-bold text-center mb-6">Privacy Policy</h1>

        <p className="text-center text-gray-600 mb-10">
          Your privacy is important to us. This policy explains how we collect,
          use, and protect your information.
        </p>

        {/* CONTENT */}
        <div className="space-y-8">
          {/* INFO COLLECTION */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              📌 Information We Collect
            </h2>
            <p className="text-gray-600">
              We may collect personal information such as your name, phone
              number, email address, and shipping address when you place an
              order or contact us.
            </p>
          </div>

          {/* USE INFO */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              📊 How We Use Your Information
            </h2>
            <ul className="list-disc ml-5 text-gray-600 space-y-1">
              <li>To process and deliver your orders</li>
              <li>To communicate order updates</li>
              <li>To improve our products and services</li>
              <li>To send promotional offers (only if you opt-in)</li>
            </ul>
          </div>

          {/* DATA PROTECTION */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">🔒 Data Protection</h2>
            <p className="text-gray-600">
              We implement appropriate security measures to protect your
              personal information from unauthorized access, misuse, or
              disclosure.
            </p>
          </div>

          {/* SHARING */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              🤝 Sharing of Information
            </h2>
            <p className="text-gray-600">
              We do not sell or rent your personal information. We may share it
              with trusted partners such as delivery services to fulfill your
              orders.
            </p>
          </div>

          {/* COOKIES */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">🍪 Cookies</h2>
            <p className="text-gray-600">
              Our website may use cookies to enhance user experience, track
              usage, and improve our services.
            </p>
          </div>

          {/* RIGHTS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">⚖️ Your Rights</h2>
            <p className="text-gray-600">
              You have the right to access, update, or delete your personal
              information. You can contact us anytime for such requests.
            </p>
          </div>

          {/* THIRD PARTY */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              🌐 Third-Party Services
            </h2>
            <p className="text-gray-600">
              We may use third-party services like payment gateways and
              analytics tools, which have their own privacy policies.
            </p>
          </div>

          {/* CONTACT */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">📞 Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, feel free to
              contact us.
            </p>
            <a
              href="/contact"
              className="inline-block mt-3 text-[#F05A3E] font-semibold">
              Contact Us →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
