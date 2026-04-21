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

/* ─── Constants ─── */
const BASE_URL = "https://gharkaorganic.com";
const CANONICAL = `${BASE_URL}/pages/contact`;
const OG_IMAGE =
  "https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/uttarakhand-desi-ghee_mhth1n.webp";
const ACCENT = "#F59E0B";

/* ─── JSON-LD ─── */
const JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": CANONICAL,
      url: CANONICAL,
      name: "Contact Ghar Ka Organic",
      description:
        "Customer support for organic Himalayan food products including A2 ghee, honey, and pickles from Uttarakhand.",
      inLanguage: "en-IN",
      isPartOf: {
        "@type": "WebSite",
        name: "Ghar Ka Organic",
        url: BASE_URL,
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Contact",
            item: CANONICAL,
          },
        ],
      },
      mainEntity: { "@id": `${BASE_URL}/#business` },
    },
    {
      "@id": `${BASE_URL}/#business`,
      "@type": ["LocalBusiness", "OnlineStore"],
      name: "Ghar Ka Organic",
      url: `${BASE_URL}/`,
      telephone: "+91-7983990550",
      email: "care@gharkaorganic.com",
      image: OG_IMAGE,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bhimtal",
        addressRegion: "Uttarakhand",
        postalCode: "263136",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 29.3459,
        longitude: 79.5618,
      },
      openingHoursSpecification: {
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
      areaServed: { "@type": "Country", name: "India" },
      knowsAbout: [
        "Uttarakhand Himalayan Organic Food",
        "Pahadi Pickles (Achar)",
        "Raw Forest Honey",
        "A2 Desi Ghee",
        "Traditional Kumaoni Food",
      ],
      sameAs: ["https://www.instagram.com/gharkaorganic/"],
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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
      setTimeout(() => setStatus("idle"), 6000);
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* ═══════════════════════════════════════════
          SEO — full indexing signals
      ═══════════════════════════════════════════ */}
      <Helmet>
        {/* Core */}
        <title>Contact Us | Ghar Ka Organic — Organic Food Support India</title>
        <meta
          name="description"
          content="Contact Ghar Ka Organic for A2 desi ghee, raw pahadi honey, Himalayan pickles, order support or bulk inquiries. We respond within 24 hours. Based in Bhimtal, Uttarakhand."
        />
        {/* ✅ Canonical — explicitly declared so Google doesn't have to guess */}
        <link rel="canonical" href={CANONICAL} />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        {/* Geo signals */}
        <meta name="geo.region" content="IN-UT" />
        <meta name="geo.placename" content="Bhimtal, Uttarakhand, India" />
        <meta name="language" content="en-IN" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Ghar Ka Organic" />
        <meta
          property="og:title"
          content="Contact Us | Ghar Ka Organic — Organic Food Support India"
        />
        <meta
          property="og:description"
          content="Contact Ghar Ka Organic for A2 desi ghee, raw honey, pahadi pickles, order support or bulk inquiries. Based in Bhimtal, Uttarakhand."
        />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Ghar Ka Organic — homemade organic products from Uttarakhand"
        />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | Ghar Ka Organic" />
        <meta
          name="twitter:description"
          content="Questions about A2 ghee, raw honey, or your order? Contact Ghar Ka Organic — we respond within 24 hours."
        />
        <meta name="twitter:image" content={OG_IMAGE} />

        {/* JSON-LD: ContactPage + BreadcrumbList + LocalBusiness */}
        <script type="application/ld+json">{JSONLD}</script>
      </Helmet>

      {/* ── HEADER ── */}
      <header className="w-full pt-24 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-amber-600 text-sm font-bold uppercase tracking-[0.3em] mb-4 block">
            Customer Care
          </span>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl text-gray-900 font-light mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Contact Ghar Ka Organic
          </h1>

          <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed max-w-lg mx-auto">
            Questions about A2 ghee, raw honey, or your recent order? Our team
            responds within 24 hours. Real people, no bots.
          </p>

          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto mt-4">
            Ghar Ka Organic offers authentic Himalayan products like A2 desi
            ghee, raw forest honey, and traditional pahadi pickles sourced from
            Uttarakhand. Contact us for order support, bulk inquiries, or
            product questions across India.
          </p>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row border border-gray-100 rounded-sm overflow-hidden shadow-sm">
          {/* FORM */}
          <section className="flex-[1.5] bg-white p-8 sm:p-12 lg:p-16">
            <h2 className="text-2xl text-gray-900 mb-8">
              Send us a <span className="italic text-gray-600">Message</span>
            </h2>

            {/* ✅ FIXED: border-l-2 now has a color (was invisible before) */}
            {status === "success" && (
              <div className="mb-8 border-l-2 border-amber-500 bg-amber-50 p-4 flex gap-3 text-amber-800 text-sm font-medium">
                <Check size={18} className="shrink-0 mt-0.5" />
                <p>Thanks! We'll reply within 24 hours.</p>
              </div>
            )}

            {status === "error" && (
              <div className="mb-8 border-l-2 border-red-500 bg-red-50 p-4 text-red-700 text-sm">
                Something went wrong. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border-b border-gray-200 py-2 outline-none focus:border-amber-500 transition-colors bg-transparent"
              />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border-b border-gray-200 py-2 outline-none focus:border-amber-500 transition-colors bg-transparent"
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone (optional)"
                className="w-full border-b border-gray-200 py-2 outline-none focus:border-amber-500 transition-colors bg-transparent"
              />
              <input
                name="orderId"
                value={formData.orderId}
                onChange={handleChange}
                placeholder="Order ID (if applicable)"
                className="w-full border-b border-gray-200 py-2 outline-none focus:border-amber-500 transition-colors bg-transparent"
              />
              <textarea
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                className="w-full border-b border-gray-200 py-2 outline-none focus:border-amber-500 transition-colors bg-transparent resize-none"
              />

              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-gray-900 text-white px-6 py-3 flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-60">
                {status === "loading" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    Send Message <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </section>

          {/* INFO */}
          <aside className="flex-1 bg-stone-50 p-8 sm:p-12 lg:p-16 border-t lg:border-t-0 lg:border-l border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-8">
              Get in Touch
            </h2>
            <div className="space-y-7">
              <div className="flex items-start gap-3">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0"
                  style={{ color: ACCENT }}
                />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                    Location
                  </p>
                  <p className="text-sm text-gray-600">
                    Bhimtal, Uttarakhand, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone
                  size={16}
                  className="mt-0.5 shrink-0"
                  style={{ color: ACCENT }}
                />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                    Phone
                  </p>
                  <a
                    href="tel:+917983990550"
                    className="text-sm text-gray-600 hover:text-amber-600 transition-colors">
                    +91 7983990550
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail
                  size={16}
                  className="mt-0.5 shrink-0"
                  style={{ color: ACCENT }}
                />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:care@gharkaorganic.com"
                    className="text-sm text-gray-600 hover:text-amber-600 transition-colors">
                    care@gharkaorganic.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock
                  size={16}
                  className="mt-0.5 shrink-0"
                  style={{ color: ACCENT }}
                />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                    Hours
                  </p>
                  <p className="text-sm text-gray-600">Mon – Sat, 10AM – 7PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Instagram
                  size={16}
                  className="mt-0.5 shrink-0"
                  style={{ color: ACCENT }}
                />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                    Instagram
                  </p>
                  <a
                    href="https://instagram.com/gharkaorganic"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gray-600 hover:text-amber-600 transition-colors">
                    @gharkaorganic
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Internal linking */}
        <div className="mt-12 text-sm text-gray-500 text-center">
          Explore our{" "}
          <a
            href="/collections"
            className="text-amber-600 underline hover:text-amber-700">
            organic Himalayan products
          </a>{" "}
          including{" "}
          <a
            href="/desi-ghee"
            className="text-amber-600 underline hover:text-amber-700">
            A2 desi ghee
          </a>
          ,{" "}
          <a
            href="/organic-honey"
            className="text-amber-600 underline hover:text-amber-700">
            raw honey
          </a>
          , and{" "}
          <a
            href="/collections"
            className="text-amber-600 underline hover:text-amber-700">
            pahadi pickles
          </a>
          .
        </div>
      </main>
    </div>
  );
};

export default ContactUsPage;
