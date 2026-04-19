import React from "react";
import { Helmet } from "react-helmet";

const ShippingPolicyPage = () => {
  return (
    <div className="bg-[#F9F5EF] text-gray-800 px-6 py-12">
      {/* SEO META */}
      <Helmet>
        <title>Shipping Policy | GharKaOrganic</title>
        <meta
          name="description"
          content="Read GharKaOrganic shipping policy. Fast delivery across India, secure packaging, and cash on delivery available."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* TITLE */}
        <h1 className="text-4xl font-bold text-center mb-6">Shipping Policy</h1>

        <p className="text-center text-gray-600 mb-10">
          We ensure safe, fast, and reliable delivery of your homemade organic
          products.
        </p>

        {/* SECTION */}
        <div className="space-y-8">
          {/* SHIPPING TIME */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">📦 Delivery Time</h2>
            <p className="text-gray-600">
              Orders are typically delivered within{" "}
              <strong>3–7 business days</strong> across India. Delivery time may
              vary depending on your location.
            </p>
          </div>

          {/* SHIPPING COST */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">🚚 Shipping Charges</h2>
            <p className="text-gray-600">
              We offer <strong>free shipping</strong> on most orders. Any
              applicable charges will be shown at checkout.
            </p>
          </div>

          {/* COD */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              💵 Cash on Delivery (COD)
            </h2>
            <p className="text-gray-600">
              Cash on Delivery is available for most locations in India.
              Additional COD charges may apply.
            </p>
          </div>

          {/* PROCESSING TIME */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">⏳ Order Processing</h2>
            <p className="text-gray-600">
              Orders are processed within <strong>24–48 hours</strong> after
              confirmation. You will receive a tracking link once your order is
              shipped.
            </p>
          </div>

          {/* TRACKING */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">📍 Order Tracking</h2>
            <p className="text-gray-600">
              Once shipped, you will receive tracking details via SMS or email.
              You can track your order in real-time.
            </p>
          </div>

          {/* PACKAGING */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">📦 Packaging</h2>
            <p className="text-gray-600">
              We use secure and hygienic packaging to ensure your products reach
              you safely without any damage.
            </p>
          </div>

          {/* DELAY */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">⚠️ Delays</h2>
            <p className="text-gray-600">
              Delivery may be delayed due to unforeseen circumstances such as
              weather, holidays, or courier issues. We appreciate your patience.
            </p>
          </div>

          {/* CONTACT */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">📞 Need Help?</h2>
            <p className="text-gray-600">
              If you have any questions regarding shipping, feel free to contact
              us anytime.
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

export default ShippingPolicyPage;
