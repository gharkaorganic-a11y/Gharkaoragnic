import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Truck, Clock, MapPin, Package, ArrowRight } from "lucide-react";

const BASE_URL = "https://gharkaorganic.com";
const CANONICAL = `${BASE_URL}/pages/shipping`;

const MASTER_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Shipping Policy - Ghar Ka Organic",
      description:
        "Comprehensive shipping policy for Ghar Ka Organic. Free delivery across India, delivery timelines, tracking, and shipping information.",
      inLanguage: "en-IN",
      isPartOf: {
        "@id": `${BASE_URL}/#website`,
      },
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
          name: "Shipping Policy",
          item: CANONICAL,
        },
      ],
    },

    {
      "@type": "FAQPage",
      "@id": `${CANONICAL}#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Do you offer free shipping?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, Ghar Ka Organic offers free shipping on all orders across India. There are no minimum order requirements for free delivery.",
          },
        },
        {
          "@type": "Question",
          name: "How long does delivery take?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Delivery typically takes 3-5 business days from the date of order placement. Remote areas may take up to 7 business days.",
          },
        },
        {
          "@type": "Question",
          name: "How do I track my order?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Once your order ships, you'll receive a tracking number via email and SMS. You can track your package in real-time using this number.",
          },
        },
        {
          "@type": "Question",
          name: "What if my order doesn't arrive?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Contact our customer support team immediately. If your order is lost, we'll either reship it or provide a full refund within 7 days.",
          },
        },
        {
          "@type": "Question",
          name: "Do you ship internationally?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Currently, we ship only within India. International shipping will be available soon. Contact us for more information.",
          },
        },
      ],
    },
  ],
};

const ShippingPage = () => {
  return (
    <>
      <Helmet>
        {/* SEO TAGS */}
        <title>
          Shipping Policy | Ghar Ka Organic – Free Delivery Across India
        </title>

        <meta
          name="description"
          content="Ghar Ka Organic shipping policy. Free delivery across India, 3-5 business days delivery, order tracking, and shipping information for organic products."
        />

        <meta
          name="keywords"
          content="shipping policy, free delivery, order tracking, delivery time, Ghar Ka Organic, organic products delivery"
        />

        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1"
        />

        <link rel="canonical" href={CANONICAL} />

        <meta name="author" content="Ghar Ka Organic" />

        {/* OPEN GRAPH */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Shipping Policy - Ghar Ka Organic" />
        <meta
          property="og:description"
          content="Free shipping across India, 3-5 day delivery, real-time tracking. Learn about our shipping policy."
        />
        <meta property="og:url" content={CANONICAL} />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/og-cover-gko.webp"
        />
        <meta property="og:locale" content="en_IN" />

        {/* TWITTER CARD */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Shipping Policy - Ghar Ka Organic"
        />
        <meta
          name="twitter:description"
          content="Free delivery, fast shipping, order tracking. See our shipping policy."
        />

        {/* JSON-LD SCHEMA */}
        <script type="application/ld+json">
          {JSON.stringify(MASTER_SCHEMA)}
        </script>
      </Helmet>

      <div className="bg-white text-gray-900 min-h-screen">
        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-600">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="hover:text-black transition">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900" aria-current="page">
              Shipping Policy
            </li>
          </ol>
        </nav>

        {/* HERO SECTION */}
        <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shipping Policy
            </h1>

            <p className="text-lg text-gray-600">
              Fast, Free, and Reliable Delivery Across India. Track Your Order
              in Real-Time.
            </p>
          </div>

          {/* SHIPPING HIGHLIGHTS */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-200">
              <Truck className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">
                Free Shipping
              </h3>
              <p className="text-sm text-gray-600">
                On all orders across India
              </p>
            </div>

            <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-200">
              <Clock className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">
                Fast Delivery
              </h3>
              <p className="text-sm text-gray-600">
                3-5 business days delivery
              </p>
            </div>

            <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-200">
              <Package className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">
                Secure Packing
              </h3>
              <p className="text-sm text-gray-600">Safe packaging & handling</p>
            </div>

            <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-200">
              <MapPin className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">
                Real-Time Tracking
              </h3>
              <p className="text-sm text-gray-600">Track your order anytime</p>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="max-w-6xl mx-auto px-6 py-12 border-t border-gray-200">
          <div className="grid md:grid-cols-3 gap-12">
            {/* MAIN TEXT */}
            <div className="md:col-span-2 space-y-10">
              {/* DELIVERY TIMELINES */}
              <article>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Delivery Timelines
                </h2>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  We strive to deliver your orders as quickly as possible. Our
                  delivery timelines vary based on your location:
                </p>

                <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Metro Cities (Delhi, Mumbai, Bangalore, etc.)
                    </h3>
                    <p className="text-gray-600">
                      Delivery within 2-3 business days
                    </p>
                  </div>

                  <hr className="border-gray-200" />

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Tier 1 Cities
                    </h3>
                    <p className="text-gray-600">
                      Delivery within 3-4 business days
                    </p>
                  </div>

                  <hr className="border-gray-200" />

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Other Cities & Towns
                    </h3>
                    <p className="text-gray-600">
                      Delivery within 5-7 business days
                    </p>
                  </div>

                  <hr className="border-gray-200" />

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Remote Areas
                    </h3>
                    <p className="text-gray-600">
                      Delivery within 7-10 business days
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  *Business days exclude weekends and public holidays.
                </p>
              </article>

              {/* SHIPPING RATES */}
              <article>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Shipping Rates
                </h2>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  We believe in transparent and affordable shipping. Here's our
                  shipping policy:
                </p>

                <div className="bg-green-50 border border-green-300 p-6 rounded-lg mb-6">
                  <h3 className="font-bold text-green-900 text-lg mb-2">
                    ✓ Free Shipping on All Orders
                  </h3>
                  <p className="text-green-800">
                    There are no minimum order requirements. Whether you order a
                    single product or bulk items, shipping is completely free
                    across India.
                  </p>
                </div>

                <p className="text-gray-600">
                  We absorb shipping costs to ensure our customers get the best
                  value. No hidden charges or surprise fees at checkout.
                </p>
              </article>

              {/* ORDER TRACKING */}
              <article>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Order Tracking
                </h2>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Once your order is dispatched, you'll receive a tracking
                  number via email and SMS. Follow these steps to track your
                  order:
                </p>

                <ol className="space-y-4 bg-blue-50 p-6 rounded-lg">
                  <li className="flex gap-4">
                    <span className="font-bold text-blue-600 flex-shrink-0">
                      1.
                    </span>
                    <div>
                      <strong className="text-gray-900">
                        Check Your Email
                      </strong>
                      <p className="text-gray-600 text-sm">
                        Look for the shipping notification with your tracking
                        number
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="font-bold text-blue-600 flex-shrink-0">
                      2.
                    </span>
                    <div>
                      <strong className="text-gray-900">
                        Copy Your Tracking
                      </strong>
                      <p className="text-gray-600 text-sm">
                        Copy the tracking number from the email
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="font-bold text-blue-600 flex-shrink-0">
                      3.
                    </span>
                    <div>
                      <strong className="text-gray-900">Track Online</strong>
                      <p className="text-gray-600 text-sm">
                        Visit the courier's website and enter your tracking
                        number
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="font-bold text-blue-600 flex-shrink-0">
                      4.
                    </span>
                    <div>
                      <strong className="text-gray-900">Monitor Status</strong>
                      <p className="text-gray-600 text-sm">
                        Get real-time updates on your package location
                      </p>
                    </div>
                  </li>
                </ol>
              </article>

              {/* PACKAGING & SAFETY */}
              <article>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Safe Packaging & Handling
                </h2>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  We take great care to ensure your organic products arrive in
                  perfect condition:
                </p>

                <ul className="space-y-3 text-gray-600">
                  <li className="flex gap-3">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>
                      <strong>Eco-Friendly Packaging:</strong> We use recyclable
                      materials to pack your orders sustainably
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>
                      <strong>Secure Wrapping:</strong> Products are wrapped
                      individually to prevent damage
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>
                      <strong>Temperature Protection:</strong> Ghee and honey
                      are packed with care to maintain quality
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>
                      <strong>Professional Handling:</strong> All packages are
                      handled with care throughout the shipping process
                    </span>
                  </li>
                </ul>
              </article>

              {/* ISSUES & SOLUTIONS */}
              <article>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  What if Something Goes Wrong?
                </h2>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Your satisfaction is our priority. Here's what we do in case
                  of shipping issues:
                </p>

                <div className="space-y-6">
                  <div className="border-l-4 border-amber-600 pl-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Order Delayed
                    </h3>
                    <p className="text-gray-600">
                      If your order is delayed beyond the promised delivery
                      date, contact us immediately. We'll investigate with the
                      courier and provide an update within 24 hours.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-600 pl-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Package Lost
                    </h3>
                    <p className="text-gray-600">
                      If your package is lost in transit, we'll file a claim
                      with the courier. Once confirmed, we'll either reship your
                      order or issue a full refund, whichever you prefer.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-600 pl-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Damaged Package
                    </h3>
                    <p className="text-gray-600">
                      Inspect your package upon delivery. If it arrives damaged,
                      report it within 24 hours with photos. We'll send a
                      replacement immediately.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-600 pl-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Wrong Item Delivered
                    </h3>
                    <p className="text-gray-600">
                      If you receive the wrong item, contact us with your order
                      details and a photo. We'll correct the mistake and send
                      the right product at no cost.
                    </p>
                  </div>
                </div>
              </article>

              {/* CONTACT SUPPORT */}
              <article className="bg-amber-50 border border-amber-200 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Questions About Your Shipment?
                </h2>

                <p className="text-gray-700 mb-6">
                  Our customer support team is here to help! Reach out anytime
                  with your shipping questions or concerns.
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">📞 Phone</p>
                    <a
                      href="tel:+919897447525"
                      className="text-amber-600 font-semibold hover:underline">
                      +91 98974 47525
                    </a>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">📧 Email</p>
                    <a
                      href="mailto:gharkaorganic@gmail.com"
                      className="text-amber-600 font-semibold hover:underline">
                      gharkaorganic@gmail.com
                    </a>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">💬 WhatsApp</p>
                    <a
                      href="https://wa.me/919897447525"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 font-semibold hover:underline">
                      Chat with us
                    </a>
                  </div>
                </div>
              </article>
            </div>

            {/* SIDEBAR */}
            <aside className="md:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* QUICK LINKS */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Related Policies
                  </h3>

                  <nav className="space-y-3">
                    <Link
                      to="/pages/return-policy"
                      className="block text-amber-600 hover:text-amber-700 font-medium text-sm">
                      ← Return Policy
                    </Link>

                    <Link
                      to="/pages/privacy-policy"
                      className="block text-amber-600 hover:text-amber-700 font-medium text-sm">
                      ← Privacy Policy
                    </Link>

                    <Link
                      to="/pages/faq"
                      className="block text-amber-600 hover:text-amber-700 font-medium text-sm">
                      ← FAQ
                    </Link>

                    <Link
                      to="/pages/contact"
                      className="block text-amber-600 hover:text-amber-700 font-medium text-sm">
                      ← Contact Us
                    </Link>
                  </nav>
                </div>

                {/* INFO BOX */}
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                  <h3 className="font-bold text-blue-900 mb-3">💡 Pro Tip</h3>

                  <p className="text-sm text-blue-800 leading-relaxed">
                    Save your tracking number to easily check your order status
                    anytime. Most orders arrive within 3-5 business days.
                  </p>
                </div>

                {/* CTA */}
                <Link
                  to="/all-products"
                  className="flex items-center gap-2 w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium text-center justify-center">
                  Shop Now <ArrowRight size={18} />
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="max-w-6xl mx-auto px-6 py-12 border-t border-gray-200 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Order?
          </h2>

          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Enjoy free shipping and fast delivery on all our authentic Himalayan
            organic products.
          </p>

          <Link
            to="/all-products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium">
            Explore Products <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </>
  );
};

export default ShippingPage;
