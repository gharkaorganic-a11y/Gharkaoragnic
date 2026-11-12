import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Truck,
  Clock,
  MapPin,
  Package,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";

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
        "Delivery information for Ghar Ka Organic. PAN-India courier timelines, safe glass-jar packaging, and live order tracking.",
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
          name: "How are delivery charges confirmed?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Delivery availability, timelines, and any applicable charges are confirmed with you on WhatsApp before your order is finalized.",
          },
        },
        {
          "@type": "Question",
          name: "How long does delivery take?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Delivery typically takes 3-5 business days across Indian metros and tier 1 cities, and up to 7 days for remote regional locations.",
          },
        },
        {
          "@type": "Question",
          name: "How do I track my order?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Once dispatched, you receive a real-time live airway tracking number via email and WhatsApp.",
          },
        },
      ],
    },
  ],
};

const ShippingPage = () => {
  return (
    <div className="bg-white min-h-screen text-[#121212] font-sans selection:bg-[#121212] selection:text-white">
      {/* ─────────────── SEO & META TAGS ─────────────── */}
      <Helmet>
        <title>Shipping & Delivery Policy | Ghar Ka Organic</title>
        <meta
          name="description"
          content="Shipping Policy for Ghar Ka Organic. PAN-India delivery timelines, airtight glass jar packing, and WhatsApp dispatch support."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={CANONICAL} />
        <script type="application/ld+json">
          {JSON.stringify(MASTER_SCHEMA)}
        </script>
      </Helmet>

      {/* ─────────────── HERO SECTION (BLACK & WHITE DESIGN) ─────────────── */}
      <header className="border-b border-[#e5e5e5] bg-white pt-12 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 block mb-3">
            PAN-India Dispatch & Logistics
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#121212] tracking-tight mb-4">
            Shipping & Delivery Policy
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 font-light max-w-2xl mx-auto leading-relaxed">
            Reliable, secure, and bubble-wrapped dispatch direct from our
            mountain kitchen in Mangoli, Nainital to your home anywhere in India.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 text-xs text-neutral-500">
            <Clock size={13} className="text-neutral-400" />
            <span>Delivery Timeline: 3–7 Business Days Nationwide</span>
          </div>
        </div>
      </header>

      {/* ─────────────── 4 TRUST PILLARS ─────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 bg-white border border-[#e5e5e5] rounded-xl shadow-xs hover:border-[#121212] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-[#121212] flex items-center justify-center mb-2.5">
              <Truck size={16} />
            </div>
            <h2 className="text-xs sm:text-sm font-medium text-[#121212]">
              PAN India Delivery
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
              Covering 19,000+ PIN codes safely.
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-white border border-[#e5e5e5] rounded-xl shadow-xs hover:border-[#121212] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-[#121212] flex items-center justify-center mb-2.5">
              <Package size={16} />
            </div>
            <h2 className="text-xs sm:text-sm font-medium text-[#121212]">
              Airtight Glass Packing
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
              Multi-layer cushioned protection.
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-white border border-[#e5e5e5] rounded-xl shadow-xs hover:border-[#121212] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-[#121212] flex items-center justify-center mb-2.5">
              <MapPin size={16} />
            </div>
            <h2 className="text-xs sm:text-sm font-medium text-[#121212]">
              Live GPS Tracking
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
              Real-time SMS & WhatsApp alerts.
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-white border border-[#e5e5e5] rounded-xl shadow-xs hover:border-[#121212] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-[#121212] flex items-center justify-center mb-2.5">
              <ShieldCheck size={16} />
            </div>
            <h2 className="text-xs sm:text-sm font-medium text-[#121212]">
              Transit Guarantee
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
              Free replacement if damaged in transit.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────── MAIN CONTENT ─────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* MAIN POLICY CONTENT (8 cols) */}
          <div className="lg:col-span-8 space-y-12 text-[15px] leading-relaxed text-neutral-700">
            {/* SECTION 1: TIMELINES */}
            <section className="pb-8 border-b border-neutral-100">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 block mb-1">
                Section 01
              </span>
              <h2 className="text-xl sm:text-2xl font-light text-[#121212] tracking-tight mb-4">
                Delivery Timelines by Region
              </h2>
              <p className="text-neutral-600 mb-5">
                All packages originate from our dispatch kitchen in Mangoli &amp;
                Nalni (Nainital District, Uttarakhand). Depending on your
                geographic zone:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-[#121212]">
                      Delhi NCR & Northern Valleys
                    </span>
                    <span className="text-xs font-semibold text-neutral-900 px-2 py-0.5 rounded bg-neutral-100">
                      2 – 3 Days
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Delhi, Noida, Gurgaon, Dehradun, Chandigarh, Lucknow, Jaipur
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-[#121212]">
                      Major Metro Hubs
                    </span>
                    <span className="text-xs font-semibold text-neutral-900 px-2 py-0.5 rounded bg-neutral-100">
                      3 – 5 Days
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad, Pune, Ahmedabad
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-[#121212]">
                      Tier 2 & Tier 3 Cities
                    </span>
                    <span className="text-xs font-semibold text-neutral-900 px-2 py-0.5 rounded bg-neutral-100">
                      4 – 6 Days
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    All major district headquarters and connected postal zones
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-[#121212]">
                      High-Altitude & Remote PIN Codes
                    </span>
                    <span className="text-xs font-semibold text-neutral-900 px-2 py-0.5 rounded bg-neutral-100">
                      6 – 8 Days
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    North-Eastern states, Jammu & Kashmir, Ladakh, and rural taluks
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 2: CHARGES */}
            <section className="pb-8 border-b border-neutral-100">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 block mb-1">
                Section 02
              </span>
              <h2 className="text-xl sm:text-2xl font-light text-[#121212] tracking-tight mb-4">
                Shipping Rates & Transparency
              </h2>
              <p className="text-neutral-600 mb-4">
                We believe in total honesty without hidden markups. Delivery
                charges, packaging details, and transit availability are
                verified directly on WhatsApp with you prior to package seal and
                courier pickup.
              </p>
              <div className="p-5 rounded-xl border border-neutral-200 bg-white">
                <h3 className="text-sm font-medium text-[#121212] mb-1">
                  WhatsApp Dispatch Confirmation
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Once your order is placed, our kitchen dispatch coordinator
                  reaches out to verify your exact delivery address and courier
                  preferences, ensuring complete peace of mind.
                </p>
              </div>
            </section>

            {/* SECTION 3: TRANSIT DAMAGE & REPLACEMENT */}
            <section className="pb-8 border-b border-neutral-100">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 block mb-1">
                Section 03
              </span>
              <h2 className="text-xl sm:text-2xl font-light text-[#121212] tracking-tight mb-4">
                100% Transit Breakage Guarantee
              </h2>
              <p className="text-neutral-600 mb-4">
                Our A2 desi ghee, raw forest honey, and sun-cured pickles are packed
                in thick food-grade glass jars. In the rare event of transit damage:
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-neutral-600">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-neutral-900 mt-0.5 flex-shrink-0" />
                  <span>
                    Simply share a photo or video of the damaged package with our
                    WhatsApp support team at <strong>+91 98974 47525</strong> within 24 hours of receipt.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-neutral-900 mt-0.5 flex-shrink-0" />
                  <span>
                    We immediately dispatch a fresh replacement jar at zero additional cost or issue an instant refund.
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* SIDEBAR (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* CONTACT CARD */}
            <div className="p-6 bg-white border border-[#e5e5e5] rounded-2xl shadow-xs">
              <h3 className="text-sm font-semibold text-[#121212] mb-1">
                Need Dispatch Support?
              </h3>
              <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
                Connect with our Mangoli, Nainital logistics team directly:
              </p>

              <div className="space-y-3 text-xs mb-6">
                <a
                  href="https://wa.me/919897447525"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-lg border border-neutral-200 hover:border-[#121212] text-neutral-700 hover:text-black transition-colors">
                  <MessageCircle size={15} />
                  <span className="font-medium">WhatsApp: +91 98974 47525</span>
                </a>

                <a
                  href="tel:+919897447525"
                  className="flex items-center gap-2.5 p-2.5 rounded-lg border border-neutral-200 hover:border-[#121212] text-neutral-700 hover:text-black transition-colors">
                  <Phone size={15} />
                  <span>Call: +91 98974 47525</span>
                </a>

                <a
                  href="mailto:gharkaorganic@gmail.com"
                  className="flex items-center gap-2.5 p-2.5 rounded-lg border border-neutral-200 hover:border-[#121212] text-neutral-700 hover:text-black transition-colors">
                  <Mail size={15} />
                  <span className="truncate">gharkaorganic@gmail.com</span>
                </a>
              </div>

              <Link
                to="/collections"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#121212] hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-all shadow-xs">
                <span>Explore Himalayan Pantry</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* RELATED POLICIES */}
            <div className="p-5 bg-white border border-[#e5e5e5] rounded-xl">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-3">
                Related Policies
              </h4>
              <nav className="space-y-2 text-xs font-medium">
                <Link
                  to="/pages/privacy-policy"
                  className="block text-neutral-700 hover:text-black hover:underline py-0.5">
                  → Privacy & Data Protection
                </Link>
                <Link
                  to="/our-story"
                  className="block text-neutral-700 hover:text-black hover:underline py-0.5">
                  → Our Story & Heritage
                </Link>
                <Link
                  to="/contact"
                  className="block text-neutral-700 hover:text-black hover:underline py-0.5">
                  → Contact Kitchen
                </Link>
                <Link
                  to="/faq"
                  className="block text-neutral-700 hover:text-black hover:underline py-0.5">
                  → Frequently Asked Questions
                </Link>
              </nav>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ShippingPage;
