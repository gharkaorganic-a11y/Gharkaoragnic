import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { db } from "../../config/firebaseDB";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  ArrowRight,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Check,
  MessageCircle,
  Mountain,
  HeartHandshake,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

/* ─────────────────────────────────────────────
   CONSTANTS & SEO
───────────────────────────────────────────── */
const BASE_URL = "https://gharkaorganic.com";
const CANONICAL = `${BASE_URL}/contact`;
const OG_IMAGE =
  "https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1776770687/Organic_Himalayan_food_from_Bhimtal_Uttarakhand_by_Ghar_Ka_Organic_wbolwx.webp";

// Unified contact details
const CONTACT_PHONE = "+919897447525";
const CONTACT_PHONE_DISPLAY = "+91 98974 47525";
const CONTACT_EMAIL = "gharkaorganic@gmail.com";

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
      logo: `${BASE_URL}/logo/gharka-logo.png`,
      url: BASE_URL,
      telephone: CONTACT_PHONE,
      email: CONTACT_EMAIL,
      priceRange: "₹₹",
      description:
        "Traditional Himalayan organic food brand from Uttarakhand offering homemade pickles, chutneys, raw forest honey and bilona desi ghee.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Ward No. 2, Nalni",
        addressLocality: "Nainital",
        addressRegion: "Uttarakhand",
        postalCode: "263136",
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
        telephone: CONTACT_PHONE,
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
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How can I contact Ghar Ka Organic?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can reach us at +91 98974 47525 (WhatsApp available) or email gharkaorganic@gmail.com. Our customer support team responds within 24 hours.",
          },
        },
        {
          "@type": "Question",
          name: "What are your working hours?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We are open Monday to Saturday, 10:00 AM to 7:00 PM IST.",
          },
        },
        {
          "@type": "Question",
          name: "Do you offer bulk orders or wholesale?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, we offer bulk orders and wholesale prices. Contact us for bulk inquiry details and customized packages.",
          },
        },
        {
          "@type": "Question",
          name: "Where are your products made and shipped from?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "All our products are handmade by local mountain women in Bhimtal, Nainital, Uttarakhand, and shipped directly across India.",
          },
        },
      ],
    },
  ],
});

const faqs = [
  {
    q: "How can I contact Ghar Ka Organic?",
    a: "You can reach us via WhatsApp or phone at +91 98974 47525, or email us at gharkaorganic@gmail.com. Our support team typically responds within a few hours during working days.",
  },
  {
    q: "What are your working hours?",
    a: "Our Bhimtal kitchen and customer support are active Monday to Saturday, from 10:00 AM to 7:00 PM IST. Online store orders can be placed 24/7.",
  },
  {
    q: "Do you offer bulk orders or corporate gifting?",
    a: "Yes! We work with corporate partners, organic stores, and events for customized gift hampers and wholesale shipments of our authentic Himalayan pickles, honey, and ghee.",
  },
  {
    q: "Where are your products made and shipped from?",
    a: "All Ghar Ka Organic foods are crafted in small batches by women farmer groups in Bhimtal, Nainital, Uttarakhand, using multi-generational Kumaoni recipes without chemicals or preservatives.",
  },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
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
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Inquiry submission error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#121212] selection:bg-[#ebe7df] selection:text-[#121212]">
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
          content="contact Ghar Ka Organic, Himalayan organic products, pahadi pickles, raw honey Uttarakhand, bilona ghee India, organic food support, customer service"
        />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1"
        />
        <link rel="canonical" href={CANONICAL} />
        <meta name="author" content="Ghar Ka Organic" />
        <meta name="geo.region" content="IN-UT" />
        <meta name="geo.placename" content="Nainital, Uttarakhand, India" />
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
          dangerouslySetInnerHTML={{ __html: JSONLD }}
        />
      </Helmet>

      {/* ───────────────── SUBTLE BREADCRUMB ───────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs tracking-wider text-neutral-400 border-b border-neutral-100">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              to="/"
              className="hover:text-neutral-900 transition-colors uppercase font-medium">
              Home
            </Link>
          </li>
          <li className="text-neutral-300">/</li>
          <li
            className="text-neutral-800 font-medium uppercase"
            aria-current="page">
            Contact Us
          </li>
        </ol>
      </nav>

      {/* ───────────────── HERO HEADER ───────────────── */}
      <header className="py-12 sm:py-16 md:py-20 text-center px-4 max-w-3xl mx-auto">
        <p className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.22em] text-neutral-500 mb-4">
          Bhimtal, Nainital • Uttarakhand
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#121212] leading-tight">
          We'd Love to Hear From You
        </h1>

        <div
          className="w-10 h-[1.5px] bg-[#121212]/30 mx-auto mt-6 mb-6"
          aria-hidden="true"
        />

        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-light max-w-2xl mx-auto">
          Have questions about our authentic Himalayan pickles, wild forest
          honey, or A2 bilona desi ghee? Want to discuss wholesale or custom
          orders? Reach out to our hill kitchen team directly.
        </p>
      </header>

      {/* ───────────────── 4 QUICK ACTION CARDS ───────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 sm:mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* WhatsApp Card */}
          <a
            href="https://wa.me/919897447525?text=Hi%20Ghar%20Ka%20Organic,%20I%20have%20an%20inquiry%20about%20your%20products"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 bg-white rounded-xl border border-[#e5e5e5] hover:border-[#121212] transition-all duration-300 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-lg bg-neutral-100 text-[#121212] flex items-center justify-center mb-4 group-hover:bg-[#121212] group-hover:text-white transition-colors duration-300">
                <MessageCircle size={20} />
              </div>
              <h3 className="text-[15px] font-medium text-[#121212]">
                WhatsApp Chat
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Fastest support response
              </p>
            </div>
            <span className="mt-5 text-xs font-medium text-[#121212] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Chat on WhatsApp →
            </span>
          </a>

          {/* Call Support Card */}
          <a
            href={`tel:${CONTACT_PHONE}`}
            className="group p-6 bg-white rounded-xl border border-[#e5e5e5] hover:border-[#121212] transition-all duration-300 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-lg bg-neutral-100 text-[#121212] flex items-center justify-center mb-4 group-hover:bg-[#121212] group-hover:text-white transition-colors duration-300">
                <Phone size={20} />
              </div>
              <h3 className="text-[15px] font-medium text-[#121212]">
                Direct Phone
              </h3>
              <p className="text-xs text-neutral-600 font-normal mt-1">
                {CONTACT_PHONE_DISPLAY}
              </p>
            </div>
            <span className="mt-5 text-xs text-neutral-500">
              Mon–Sat, 10 AM – 7 PM
            </span>
          </a>

          {/* Email Support Card */}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group p-6 bg-white rounded-xl border border-[#e5e5e5] hover:border-[#121212] transition-all duration-300 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-lg bg-neutral-100 text-[#121212] flex items-center justify-center mb-4 group-hover:bg-[#121212] group-hover:text-white transition-colors duration-300">
                <Mail size={20} />
              </div>
              <h3 className="text-[15px] font-medium text-[#121212]">
                Email Inquiries
              </h3>
              <p className="text-xs text-neutral-600 font-normal mt-1 truncate">
                {CONTACT_EMAIL}
              </p>
            </div>
            <span className="mt-5 text-xs text-neutral-500">
              Replies within 24 hours
            </span>
          </a>

          {/* Location Card */}
          <div className="p-6 bg-white rounded-xl border border-[#e5e5e5] flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-lg bg-neutral-100 text-[#121212] flex items-center justify-center mb-4">
                <MapPin size={20} />
              </div>
              <h3 className="text-[15px] font-medium text-[#121212]">
                Mountain Kitchen
              </h3>
              <p className="text-xs text-neutral-600 mt-1 leading-snug">
                Ward No. 2, Nalni, Bhimtal, Uttarakhand – 263136
              </p>
            </div>
            <span className="mt-5 text-xs font-medium text-neutral-500">
              Made in Uttarakhand
            </span>
          </div>
        </div>
      </section>

      {/* ───────────────── MAIN CONTENT: FORM + KITCHEN STORY ───────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ───────── CONTACT FORM (7 cols) ───────── */}
          <section
            className="lg:col-span-7 bg-white border border-[#e5e5e5] rounded-2xl p-6 sm:p-10 shadow-xs"
            aria-label="Send a message form">
            <div className="mb-8">
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 block mb-1">
                Direct Communication
              </span>
              <h2 className="text-2xl sm:text-3xl font-light text-[#121212] tracking-tight">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-light">
                Fill out the form below. We respond promptly during working
                hours.
              </p>
            </div>

            {/* SUCCESS BANNER */}
            {status === "success" && (
              <div
                className="mb-6 bg-neutral-100 border border-neutral-300 text-neutral-900 px-4 py-3.5 rounded-xl text-sm flex items-center gap-2.5"
                role="alert">
                <Check size={18} className="text-[#121212] shrink-0" />
                <span>
                  Thank you! Your message has been sent to our Bhimtal team. We
                  will get back to you shortly.
                </span>
              </div>
            )}

            {/* ERROR BANNER */}
            {status === "error" && (
              <div
                className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm"
                role="alert">
                Something went wrong. Please reach out via WhatsApp at +91 98974
                47525.
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Anjali Sharma"
                    className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm text-[#121212] placeholder-neutral-400 focus:outline-none focus:border-[#121212] focus:ring-1 focus:ring-[#121212] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. anjali@example.com"
                    className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm text-[#121212] placeholder-neutral-400 focus:outline-none focus:border-[#121212] focus:ring-1 focus:ring-[#121212] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm text-[#121212] placeholder-neutral-400 focus:outline-none focus:border-[#121212] focus:ring-1 focus:ring-[#121212] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Order ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleChange}
                    placeholder="e.g. #ORD-1042"
                    className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm text-[#121212] placeholder-neutral-400 focus:outline-none focus:border-[#121212] focus:ring-1 focus:ring-[#121212] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Subject / Inquiry Type
                </label>
                <div className="relative">
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full appearance-none bg-white border border-[#e5e5e5] rounded-xl px-4 py-3 pr-10 text-sm text-[#121212] focus:outline-none focus:border-[#121212] focus:ring-1 focus:ring-[#121212] transition cursor-pointer">
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Product Support">Product Support</option>
                    <option value="Bulk Order">
                      Bulk Order / Wholesale Inquiry
                    </option>
                    <option value="Partnership">
                      Partnership & Distribution
                    </option>
                    <option value="Order Issue">
                      Order Issue / Shipping Status
                    </option>
                    <option value="Quality Feedback">Quality Feedback</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you're looking for, or share your question..."
                  className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm text-[#121212] placeholder-neutral-400 focus:outline-none focus:border-[#121212] focus:ring-1 focus:ring-[#121212] transition resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#121212] text-white px-8 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-black focus:outline-none focus:ring-2 focus:ring-[#121212] focus:ring-offset-2 active:scale-[0.99] disabled:opacity-70 shadow-xs cursor-pointer">
                  {status === "loading" ? (
                    <>
                      <Loader2 className="animate-spin" size={17} />
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* ───────── MOUNTAIN ORIGIN & STORY CARD (5 cols) ───────── */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-500 block mb-1">
                  Rooted in Uttarakhand
                </span>
                <h3 className="text-xl sm:text-2xl font-light text-[#121212] tracking-tight">
                  Handmade with Mountain Care
                </h3>
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed font-light">
                Ghar Ka Organic is based in Bhimtal, Nainital, Uttarakhand. Every
                jar of pickle, bottle of raw honey, and jar of A2 bilona ghee is
                prepared by mountain women using pure Himalayan ingredients and
                age-old Kumaoni recipes without chemicals or preservatives.
              </p>

              {/* Trust Badges */}
              <div className="space-y-3.5 pt-4 border-t border-[#f0f0f0]">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-700">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 text-[#121212] flex items-center justify-center shrink-0">
                    <Mountain size={16} />
                  </div>
                  <span>Born in Bhimtal, Nainital (Uttarakhand)</span>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-700">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 text-[#121212] flex items-center justify-center shrink-0">
                    <HeartHandshake size={16} />
                  </div>
                  <span>Empowering Local Pahadi Women Artisans</span>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-700">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 text-[#121212] flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <span>Zero Artificial Preservatives or Chemicals</span>
                </div>
              </div>

              {/* FSSAI Badge */}
              <div className="pt-4 border-t border-[#f0f0f0]">
                <div className="bg-white p-3.5 rounded-xl border border-[#e5e5e5] flex items-center gap-3.5 shadow-2xs">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/e/e2/FSSAI_logo.png"
                    alt="FSSAI Certified – Food Safety Authority of India"
                    className="h-8 object-contain"
                  />
                  <div className="flex flex-col">
                    <span className="text-[#121212] text-xs font-semibold tracking-wider uppercase">
                      100% Certified Safe
                    </span>
                    <span className="text-neutral-500 text-[11px]">
                      FSSAI Registered • Nainital, Uttarakhand
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-2">
                <a
                  href="https://wa.me/919897447525?text=Hi%20Ghar%20Ka%20Organic,%20I%20want%20to%20inquire%20about%20your%20products"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#121212] hover:bg-black text-white py-3 px-5 rounded-xl text-xs sm:text-sm font-medium transition shadow-xs">
                  <MessageCircle size={17} />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>

            {/* Instagram Follow */}
            <a
              href="https://instagram.com/gharkaorganic"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 bg-white rounded-2xl border border-[#e5e5e5] hover:border-[#121212] flex items-center justify-between transition group shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-100 text-[#121212] flex items-center justify-center shrink-0">
                  <span className="font-semibold text-sm">IG</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#121212]">
                    @gharkaorganic
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Follow our stories from the Kumaon hills
                  </p>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="text-neutral-400 group-hover:text-[#121212] group-hover:translate-x-1 transition"
              />
            </a>
          </aside>
        </div>

        {/* ───────────────── INTERACTIVE FAQ SECTION ───────────────── */}
        <section
          className="mt-16 sm:mt-20 pt-12 border-t border-[#e8e8e8]"
          aria-label="Frequently Asked Questions">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-[0.18em] text-[#121212] uppercase">
                Frequently Asked Questions
              </h2>
              <div
                className="w-8 h-[1px] bg-[#121212]/20 mx-auto mt-3"
                aria-hidden="true"
              />
            </div>

            <div className="divide-y divide-[#ebebeb] border-y border-[#ebebeb]">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-4">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left flex items-center justify-between gap-4 py-2 hover:text-black transition cursor-pointer">
                      <span className="text-[15px] sm:text-[16px] font-medium text-[#121212]">
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-neutral-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-black" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="text-sm text-neutral-600 leading-relaxed font-light pt-2 pb-2">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────────────── EXPLORE OUR PRODUCTS ───────────────── */}
        <section
          className="mt-16 pt-12 border-t border-[#e8e8e8] text-center"
          aria-label="Related products navigation">
          <h3 className="text-xs uppercase tracking-[0.18em] font-medium text-neutral-500 mb-6">
            Explore Himalayan Organic Products
          </h3>

          <nav className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
            {[
              { name: "All Products", url: "/all-products" },
              { name: "Best Sellers", url: "/shop/best-sellers" },
              { name: "Raw Forest Honey", url: "/all-products?category=honey" },
              {
                name: "A2 Bilona Desi Ghee",
                url: "/all-products?category=ghee",
              },
              {
                name: "Sun-Dried Mango Achar",
                url: "/all-products?category=pickles",
              },
              {
                name: "Authentic Pahadi Pickles",
                url: "/all-products?category=pickles",
              },
            ].map((link, i) => (
              <Link
                key={i}
                to={link.url}
                className="px-4 py-2 rounded-full text-xs font-medium bg-white text-[#121212] border border-[#e5e5e5] hover:border-[#121212] hover:bg-[#121212] hover:text-white transition-all duration-200">
                {link.name}
              </Link>
            ))}
          </nav>
        </section>
      </main>
    </div>
  );
};

export default ContactUsPage;
