import React from "react";
import { Helmet } from "react-helmet";

const ReturnPolicyPage = () => {
  return (
    <div className="bg-[#F9F5EF] text-gray-800 px-6 py-12">
      {/* SEO META */}
      <Helmet>
        <title>Return & Refund Policy | GharKaOrganic</title>
        <meta
          name="description"
          content="Read GharKaOrganic return and refund policy. Easy returns for damaged products, quick refunds, and customer-friendly support."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* TITLE */}
        <h1 className="text-4xl font-bold text-center mb-6">
          Return & Refund Policy
        </h1>

        <p className="text-center text-gray-600 mb-10">
          We care about your satisfaction and ensure a smooth return and refund
          process.
        </p>

        {/* CONTENT */}
        <div className="space-y-8">
          {/* RETURNS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">🔁 Returns</h2>
            <p className="text-gray-600">
              Due to the nature of our food products, we do not accept general
              returns. However, if you receive a damaged, defective, or
              incorrect product, we will gladly assist you.
            </p>
          </div>

          {/* ELIGIBILITY */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              ✅ Return Eligibility
            </h2>
            <ul className="list-disc ml-5 text-gray-600 space-y-1">
              <li>Product received is damaged or leaking</li>
              <li>Wrong product delivered</li>
              <li>Quality issue with the product</li>
            </ul>
          </div>

          {/* TIME */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              ⏳ Return Request Time
            </h2>
            <p className="text-gray-600">
              You must raise a return request within{" "}
              <strong>48 hours of delivery</strong> with proper proof
              (images/videos).
            </p>
          </div>

          {/* REFUNDS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">💰 Refunds</h2>
            <p className="text-gray-600">
              Once your request is approved, refunds will be processed within{" "}
              <strong>5–7 business days</strong> to your original payment
              method.
            </p>
          </div>

          {/* COD */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              💵 Cash on Delivery Orders
            </h2>
            <p className="text-gray-600">
              For COD orders, refunds will be issued via bank transfer or UPI
              after verification.
            </p>
          </div>

          {/* REPLACEMENT */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">🔄 Replacement</h2>
            <p className="text-gray-600">
              In some cases, we may offer a replacement instead of a refund,
              depending on product availability.
            </p>
          </div>

          {/* NON RETURNABLE */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              🚫 Non-Returnable Items
            </h2>
            <p className="text-gray-600">
              Opened or used products cannot be returned unless there is a
              genuine quality issue.
            </p>
          </div>

          {/* CONTACT */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">📞 Need Help?</h2>
            <p className="text-gray-600">
              For any return or refund queries, feel free to reach out to us.
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

export default ReturnPolicyPage;
