import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { db } from "../../config/firebaseDB";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import {
  ArrowRight,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Check,
} from "lucide-react";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const BASE_URL = "https://gharkaorganic.com";

const CANONICAL = `${BASE_URL}/pages/contact`;

const OG_IMAGE =
  "https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1776770687/Organic_Himalayan_food_from_Bhimtal_Uttarakhand_by_Ghar_Ka_Organic_wbolwx.webp";

const JSONLD = JSON.stringify({
  "@context": "https://schema.org",

  "@graph": [
    {
      "@type": "ContactPage",

      "@id": `${CANONICAL}#contactpage`,

      url: CANONICAL,

      name: "Contact Ghar Ka Organic",

      description:
        "Contact Ghar Ka Organic for Himalayan homemade pickles, raw forest honey, bilona desi ghee, chutneys and organic food support across India.",

      inLanguage: "en-IN",

      isPartOf: {
        "@type": "WebSite",

        name: "Ghar Ka Organic",

        url: BASE_URL,
      },

      primaryImageOfPage: {
        "@type": "ImageObject",
        url: OG_IMAGE,
      },

      mainEntity: {
        "@id": `${BASE_URL}/#business`,
      },
    },

    {
      "@id": `${BASE_URL}/#business`,

      "@type": ["LocalBusiness", "OnlineStore", "FoodManufacturer"],

      name: "Ghar Ka Organic",

      image: [OG_IMAGE],

      logo: `${BASE_URL}/gharka-logo.png`,

      url: BASE_URL,

      telephone: "+91-7983990550",

      email: "gharkaorganic@gmail.com",

      priceRange: "₹₹",

      description:
        "Traditional Himalayan organic food brand from Uttarakhand offering homemade pickles, chutneys, raw forest honey and bilona desi ghee.",

      address: {
        "@type": "PostalAddress",

        streetAddress: "Ward No. 2, Nalni",

        addressLocality: "Nainital",

        addressRegion: "Uttarakhand",

        postalCode: "263002",

        addressCountry: "IN",
      },

      geo: {
        "@type": "GeoCoordinates",

        latitude: 29.3459,

        longitude: 79.5618,
      },

      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",

          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],

          opens: "10:00",

          closes: "19:00",
        },
      ],

      areaServed: {
        "@type": "Country",

        name: "India",
      },

      sameAs: ["https://www.instagram.com/gharkaorganic/"],

      contactPoint: {
        "@type": "ContactPoint",

        telephone: "+91-7983990550",

        contactType: "customer support",

        areaServed: "IN",

        availableLanguage: ["English", "Hindi"],
      },

      knowsAbout: [
        "Pahadi Pickles",
        "Kumaoni Chutney",
        "Raw Forest Honey",
        "Bilona Desi Ghee",
        "Himalayan Organic Products",
        "Traditional Uttarakhand Food",
      ],
    },

    {
      "@type": "BreadcrumbList",

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

          name: "Contact",

          item: CANONICAL,
        },
      ],
    },
  ],
});

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderId: "",
    subject: "General Inquiry",
    message: "",
  });

  const [status, setStatus] = useState("idle");

  /* ─────────────────────────────────────────────
     HANDLE INPUT
  ───────────────────────────────────────────── */

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  /* ─────────────────────────────────────────────
     HANDLE SUBMIT
  ───────────────────────────────────────────── */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("loading");

    try {
      await addDoc(collection(db, "inquiries"), {
        ...formData,

        brand: "Ghar Ka Organic",

        createdAt: serverTimestamp(),
      });

      setStatus("success");

      setFormData({
        name: "",
        email: "",
        phone: "",
        orderId: "",
        subject: "General Inquiry",
        message: "",
      });

      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    } catch (error) {
      console.error(error);

      setStatus("error");

      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* ───────────────── SEO ───────────────── */}

      <Helmet>
        <title>
          Contact Ghar Ka Organic | Himalayan Pickles, Honey & Organic Products
        </title>

        <meta
          name="description"
          content="Contact Ghar Ka Organic for homemade Himalayan pickles, raw forest honey, bilona desi ghee, organic chutneys and Uttarakhand food products delivered across India."
        />

        <meta
          name="keywords"
          content="contact Ghar Ka Organic, Himalayan organic products, pahadi pickles, raw honey Uttarakhand, bilona ghee India, organic food support"
        />

        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1"
        />

        <link rel="canonical" href={CANONICAL} />

        <meta name="author" content="Ghar Ka Organic" />

        <meta name="geo.region" content="IN-UT" />

        <meta name="geo.placename" content="Bhimtal, Uttarakhand, India" />

        <meta name="theme-color" content="#ffffff" />

        {/* OPEN GRAPH */}

        <meta property="og:type" content="website" />

        <meta property="og:site_name" content="Ghar Ka Organic" />

        <meta property="og:title" content="Contact Ghar Ka Organic" />

        <meta
          property="og:description"
          content="Get support for Himalayan homemade pickles, raw honey, bilona desi ghee and organic food products from Uttarakhand."
        />

        <meta property="og:url" content={CANONICAL} />

        <meta property="og:image" content={OG_IMAGE} />

        <meta property="og:locale" content="en_IN" />

        {/* TWITTER */}

        <meta name="twitter:card" content="summary_large_image" />

        <meta name="twitter:title" content="Contact Ghar Ka Organic" />

        <meta
          name="twitter:description"
          content="Questions about your order or products? Contact Ghar Ka Organic."
        />

        <meta name="twitter:image" content={OG_IMAGE} />

        {/* JSON-LD */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSONLD,
          }}
        />
      </Helmet>

      {/* ───────────────── HERO ───────────────── */}

      <section className="relative w-full h-[40vh] md:h-[55vh] overflow-hidden">
        <img
          src={OG_IMAGE}
          alt="Ghar Ka Organic Himalayan Products"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center max-w-3xl">
            <h1 className="text-white text-3xl md:text-5xl font-light">
              Contact Ghar Ka Organic
            </h1>

            <p className="text-white/80 mt-4 text-sm md:text-base">
              Himalayan Pickles • Raw Honey • Bilona Desi Ghee • Organic Food
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────── HEADER ───────────────── */}

      <header className="text-center px-6 pt-16 pb-10">
        <div className="max-w-3xl mx-auto">
          <span className="uppercase tracking-[0.3em] text-xs text-amber-600 font-bold">
            Customer Support
          </span>

          <h2 className="text-3xl md:text-5xl text-gray-900 mt-4 font-light">
            We’d Love to Hear From You
          </h2>

          <p className="mt-5 text-gray-600 leading-relaxed">
            Contact us for product support, bulk orders, partnerships, Himalayan
            homemade pickles, organic chutneys, raw forest honey, bilona desi
            ghee and Uttarakhand organic food products.
          </p>
        </div>
      </header>

      {/* ───────────────── MAIN ───────────────── */}

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* ───────── FORM ───────── */}

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Send a Message
            </h2>

            {/* SUCCESS */}

            {status === "success" && (
              <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <Check size={16} />
                Message sent successfully.
              </div>
            )}

            {/* ERROR */}

            {status === "error" && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                Something went wrong. Please try again.
              </div>
            )}

            {/* FORM */}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500"
              />

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500"
              />

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500"
              />

              <input
                type="text"
                name="orderId"
                value={formData.orderId}
                onChange={handleChange}
                placeholder="Order ID (Optional)"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-amber-500"
              />

              <textarea
                rows={5}
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none resize-none focus:border-amber-500"
              />

              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition">
                {status === "loading" ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Send Message
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </section>

          {/* ───────── CONTACT INFO ───────── */}

          <aside className="bg-gray-50 rounded-2xl p-8 space-y-8 border border-gray-100">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Contact Information
              </h2>

              <p className="text-gray-600 mt-2 text-sm">
                Reach out for product inquiries, support, or wholesale orders.
              </p>
            </div>

            {/* ADDRESS */}

            <div className="flex items-start gap-4">
              <MapPin className="text-amber-600 mt-1" size={20} />

              <div>
                <p className="text-xs uppercase text-gray-500 mb-1">Address</p>

                <p className="text-sm text-gray-700 leading-relaxed">
                  Ward No. 2, Nalni
                  <br />
                  Nainital, Uttarakhand – 263136
                  <br />
                  India
                </p>
              </div>
            </div>

            {/* PHONE */}

            <div className="flex items-start gap-4">
              <Phone className="text-amber-600 mt-1" size={20} />

              <div>
                <p className="text-xs uppercase text-gray-500 mb-1">Phone</p>

                <a
                  href="tel:+919897447525"
                  className="text-sm text-gray-700 hover:text-amber-600">
                  +91 98974 47525
                </a>
              </div>
            </div>

            {/* EMAIL */}

            <div className="flex items-start gap-4">
              <Mail className="text-amber-600 mt-1" size={20} />

              <div>
                <p className="text-xs uppercase text-gray-500 mb-1">Email</p>

                <a
                  href="mailto:gharkaorganic@gmail.com"
                  className="text-sm text-gray-700 hover:text-amber-600">
                  gharkaorganic@gmail.com
                </a>
              </div>
            </div>

            {/* HOURS */}

            <div className="flex items-start gap-4">
              <Clock className="text-amber-600 mt-1" size={20} />

              <div>
                <p className="text-xs uppercase text-gray-500 mb-1">
                  Working Hours
                </p>

                <p className="text-sm text-gray-700">
                  Monday – Saturday
                  <br />
                  10:00 AM – 7:00 PM
                </p>
              </div>
            </div>

            {/* INSTAGRAM */}

            <div className="flex items-start gap-4">
              <Instagram className="text-amber-600 mt-1" size={20} />

              <div>
                <p className="text-xs uppercase text-gray-500 mb-1">
                  Instagram
                </p>

                <a
                  href="https://instagram.com/gharkaorganic"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gray-700 hover:text-amber-600">
                  @gharkaorganic
                </a>
              </div>
            </div>

            {/* SEO TEXT */}

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 leading-relaxed">
                Ghar Ka Organic is an Uttarakhand-based Himalayan organic food
                brand offering homemade pickles, Kumaoni chutneys, raw forest
                honey, bilona desi ghee and traditional village food products
                across India.
              </p>
            </div>
          </aside>
        </div>

        {/* ───────────────── INTERNAL LINKS ───────────────── */}

        <section className="mt-16 pt-10 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">
            Explore Products
          </h3>

          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href="/collections/all"
              className="text-amber-700 hover:underline">
              Himalayan Organic Products
            </a>

            <a
              href="/buy-mango-pickle-online"
              className="text-amber-700 hover:underline">
              Homemade Mango Pickle
            </a>

            <a href="/organic-honey" className="text-amber-700 hover:underline">
              Raw Forest Honey
            </a>

            <a
              href="/buy-desi-ghee-online"
              className="text-amber-700 hover:underline">
              Bilona Desi Ghee
            </a>

            <a
              href="/pahadi-achar-online"
              className="text-amber-700 hover:underline">
              Pahadi Pickles
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactUsPage;
