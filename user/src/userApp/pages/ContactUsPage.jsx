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

const ACCENT = "#F59E0B";

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
      {/* ───────── SEO ───────── */}
      <Helmet>
        <title>Contact Ghar Ka Organic | Organic Food Support India</title>

        <meta
          name="description"
          content="Contact Ghar Ka Organic for A2 ghee, raw honey, pahadi pickles, orders or support. Fast response across India."
        />

        <link rel="canonical" href="https://gharkaorganic.com/pages/contact" />

        <meta name="robots" content="index, follow" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "ContactPage",
                "@id": "https://gharkaorganic.com/pages/contact",
                url: "https://gharkaorganic.com/pages/contact",
                name: "Contact Ghar Ka Organic",
                description:
                  "Customer support for organic Himalayan food products including A2 ghee, honey, and pickles.",
                mainEntity: {
                  "@id": "https://gharkaorganic.com/#business",
                },
              },
              {
                "@id": "https://gharkaorganic.com/#business",
                "@type": ["LocalBusiness", "OnlineStore"],
                name: "Ghar Ka Organic",
                url: "https://gharkaorganic.com/",
                telephone: "+91-7983990550",
                image:
                  "https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/uttarakhand-desi-ghee_mhth1n.webp",

                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Bhimtal",
                  addressRegion: "Uttarakhand",
                  addressCountry: "IN",
                },

                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 29.3459,
                  longitude: 79.5618,
                },

                areaServed: {
                  "@type": "Country",
                  name: "India",
                },

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
          })}
        </script>
      </Helmet>

      {/* ── HEADER ── */}
      <header className="w-full pt-24 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-amber-600 text-sm font-bold uppercase tracking-[0.3em] mb-4 block">
            Customer Care
          </span>

          {/* ✅ Improved H1 */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl text-gray-900 font-light mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Contact Ghar Ka Organic
          </h1>

          <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed max-w-lg mx-auto">
            Questions about A2 ghee, raw honey, or your recent order? Our team
            responds within 24 hours. Real people, no bots.
          </p>

          {/* ✅ SEO Content Boost */}
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

            {status === "success" && (
              <div className="mb-8 border-l-2 bg-amber-50 p-4 flex gap-3 text-amber-800 text-sm font-medium">
                <Check size={18} />
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
                className="w-full border-b py-2 outline-none"
              />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border-b py-2 outline-none"
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full border-b py-2 outline-none"
              />
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                className="w-full border-b py-2 outline-none"
              />

              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-gray-900 text-white px-6 py-3 flex items-center gap-2">
                {status === "loading" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Send <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </section>

          {/* INFO */}
          <aside className="flex-1 bg-stone-50 p-8 sm:p-12 lg:p-16 border-t lg:border-l">
            <div className="space-y-8">
              <div>
                <MapPin size={16} style={{ color: ACCENT }} />
                <p className="text-sm text-gray-600 mt-2">
                  Bhimtal, Uttarakhand, India
                </p>
              </div>

              <div>
                <Phone size={16} style={{ color: ACCENT }} />
                <p className="text-sm text-gray-600 mt-2">+91 7983990550</p>
              </div>

              <div>
                <Mail size={16} style={{ color: ACCENT }} />
                <p className="text-sm text-gray-600 mt-2">
                  care@gharkaorganic.com
                </p>
              </div>

              <div>
                <Clock size={16} style={{ color: ACCENT }} />
                <p className="text-sm text-gray-600 mt-2">
                  Mon - Sat, 10AM - 7PM
                </p>
              </div>

              <a
                href="https://instagram.com/gharkaorganic"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-gray-600">
                <Instagram size={16} /> Instagram
              </a>
            </div>
          </aside>
        </div>

        {/* ✅ Internal Linking Boost */}
        <div className="mt-12 text-sm text-gray-500 text-center">
          Explore our{" "}
          <a href="/collections" className="text-amber-600 underline">
            organic Himalayan products
          </a>{" "}
          including ghee, honey, and pickles.
        </div>
      </main>
    </div>
  );
};

export default ContactUsPage;
