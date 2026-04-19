import React, { useState } from "react";
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
  MessageCircle,
} from "lucide-react";

const ACCENT = "#F59E0B"; // amber-500
const ACCENT_LIGHT = "#FEF3C7"; // amber-100

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
    <div className="min-h-screen bg-white font-sans selection:bg-amber-500 selection:text-white pb-20">
      {/* ── HEADER ── */}
      <header className="w-full pt-24 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-amber-600 text- sm:text- font-bold uppercase tracking-[0.3em] mb-4 block">
            Customer Care
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl text-gray-900 font-light mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            We’re Here to Help
          </h1>
          <p className="text-gray-500 text- md:text- font-light leading-relaxed max-w-lg mx-auto">
            Questions about A2 ghee, raw honey, or your recent order? Our team
            in Bareilly responds within 24 hours. Real people, no bots.
          </p>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w- mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row border border-gray-100 rounded-sm overflow-hidden shadow-[0_4px_40px_rgba(0,0,0,0.02)]">
          {/* ── LEFT: Form ── */}
          <section className="flex-[1.5] bg-white p-8 sm:p-12 lg:p-16">
            <h2
              className="text-2xl text-gray-900 mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Send us a <span className="italic text-gray-600">Message</span>
            </h2>

            {status === "success" && (
              <div
                className="mb-8 border-l-2 bg-amber-50 p-4 flex items-start gap-3 text-amber-800 text- font-medium animate-in fade-in slide-in-from-top-2"
                style={{ borderColor: ACCENT }}>
                <Check size={18} className="shrink-0 mt-0.5" />
                <p>
                  Thank you! Your message is with the Ghar Ka Organic team.
                  We’ll reply to your email within 24 hours.
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="mb-8 border-l-2 border-red-500 bg-red-50 p-4 flex items-start gap-3 text-red-700 text- font-medium">
                <p>
                  Something went wrong. Please WhatsApp us directly at +91 98999
                  12345 and we’ll help immediately.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group relative">
                  <label className="text- font-bold uppercase tracking-widest text-gray-400 block mb-2 transition-colors group-focus-within:text-amber-600">
                    Full Name *
                  </label>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pb-2 text- text-gray-800 bg-transparent border-b border-gray-200 outline-none focus:border-amber-500 transition-colors placeholder:text-gray-300"
                    placeholder="Your name"
                  />
                </div>
                <div className="group relative">
                  <label className="text- font-bold uppercase tracking-widest text-gray-400 block mb-2 transition-colors group-focus-within:text-amber-600">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pb-2 text- text-gray-800 bg-transparent border-b border-gray-200 outline-none focus:border-amber-500 transition-colors placeholder:text-gray-300"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group relative">
                  <label className="text- font-bold uppercase tracking-widest text-gray-400 block mb-2 transition-colors group-focus-within:text-amber-600">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pb-2 text- text-gray-800 bg-transparent border-b border-gray-200 outline-none focus:border-amber-500 transition-colors placeholder:text-gray-300"
                    placeholder="+91 99999 99999"
                  />
                </div>
                <div className="group relative">
                  <label className="text- font-bold uppercase tracking-widest text-gray-400 block mb-2 transition-colors group-focus-within:text-amber-600">
                    Order ID
                  </label>
                  <input
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleChange}
                    className="w-full pb-2 text- text-gray-800 bg-transparent border-b border-gray-200 outline-none focus:border-amber-500 transition-colors placeholder:text-gray-300"
                    placeholder="Optional #GKO-1234"
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="text- font-bold uppercase tracking-widest text-gray-400 block mb-2 transition-colors group-focus-within:text-amber-600">
                  What’s this about?
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full pb-2 text- text-gray-800 bg-transparent border-b border-gray-200 outline-none focus:border-amber-500 transition-colors cursor-pointer appearance-none rounded-none">
                  <option>General Inquiry</option>
                  <option>Order Status & Tracking</option>
                  <option>Product Question - A2 Ghee</option>
                  <option>Product Question - Raw Honey</option>
                  <option>Product Question - Pickles</option>
                  <option>Returns & Replacement</option>
                  <option>Bulk / Corporate Order</option>
                </select>
              </div>

              <div className="group relative">
                <label className="text- font-bold uppercase tracking-widest text-gray-400 block mb-2 transition-colors group-focus-within:text-amber-600">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full pb-2 text- text-gray-800 bg-transparent border-b border-gray-200 outline-none focus:border-amber-500 transition-colors resize-none placeholder:text-gray-300"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full sm:w-auto bg-gray-900 text-white px-10 py-4 text- font-bold uppercase tracking-[0.2em] hover:bg-amber-500 transition-colors duration-500 disabled:opacity-70 flex items-center justify-center gap-3">
                  {status === "loading" ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <>
                      Send Message <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* ── RIGHT: Info ── */}
          <aside className="flex-1 bg-stone-50 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100">
            <div className="space-y-12">
              <div>
                <span className="text-gray-900 text- font-bold uppercase tracking-widest mb-5 block flex items-center gap-2">
                  <MapPin size={14} style={{ color: ACCENT }} /> Our Kitchen
                </span>
                <p className="text- text-gray-600 leading-relaxed font-light">
                  Ghar Ka Organic
                  <br />
                  Civil Lines, Bareilly
                  <br />
                  Uttar Pradesh 243001
                  <br />
                  India
                </p>
                <a
                  href="https://maps.google.com/?q=Bareilly"
                  target="_blank"
                  rel="noreferrer"
                  className="text- font-bold uppercase tracking-widest text-amber-600 mt-3 inline-block hover:underline underline-offset-4">
                  Get Directions
                </a>
              </div>

              <div>
                <span className="text-gray-900 text- font-bold uppercase tracking-widest mb-5 block flex items-center gap-2">
                  <Phone size={14} style={{ color: ACCENT }} /> Talk to Us
                </span>
                <div className="space-y-4">
                  <a
                    href="mailto:care@gharkaorganic.com"
                    className="flex items-center gap-3 group">
                    <Mail
                      size={16}
                      strokeWidth={1.5}
                      className="text-gray-400 group-hover:text-amber-600 transition-colors"
                    />
                    <span className="text- text-gray-600 group-hover:text-gray-900 transition-colors font-light">
                      care@gharkaorganic.com
                    </span>
                  </a>
                  <a
                    href="tel:+919899912345"
                    className="flex items-center gap-3 group">
                    <Phone
                      size={16}
                      strokeWidth={1.5}
                      className="text-gray-400 group-hover:text-amber-600 transition-colors"
                    />
                    <span className="text- text-gray-600 group-hover:text-gray-900 transition-colors font-light">
                      +91 98999 12345
                    </span>
                  </a>
                  <a
                    href="https://wa.me/919899912345"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 group">
                    <MessageCircle
                      size={16}
                      strokeWidth={1.5}
                      className="text-gray-400 group-hover:text-green-600 transition-colors"
                    />
                    <span className="text- text-gray-600 group-hover:text-gray-900 transition-colors font-light">
                      WhatsApp Support
                    </span>
                  </a>
                </div>
              </div>

              <div>
                <span className="text-gray-900 text- font-bold uppercase tracking-widest mb-4 block flex items-center gap-2">
                  <Clock size={14} style={{ color: ACCENT }} /> Support Hours
                </span>
                <p className="text- text-gray-600 leading-relaxed font-light">
                  Monday — Saturday
                  <br />
                  10:00 AM — 7:00 PM (IST)
                  <br />
                  <span className="text-xs text-gray-400 mt-1 block">
                    Closed on Sundays & National Holidays
                  </span>
                </p>
              </div>
            </div>

            <div className="pt-12 mt-12 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <span className="text- font-bold uppercase tracking-widest text-gray-400">
                  Follow us
                </span>
                <a
                  href="https://instagram.com/gharkaorganic"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-amber-600 transition-colors">
                  <Instagram size={16} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ContactUsPage;
