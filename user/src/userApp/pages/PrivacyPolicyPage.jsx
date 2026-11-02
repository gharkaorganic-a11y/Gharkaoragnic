import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  FileCheck,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";

/* ─────────────────────────────────────────────
   CONSTANTS & SEO
───────────────────────────────────────────── */
const BASE_URL = "https://gharkaorganic.com";
const CANONICAL = `${BASE_URL}/pages/privacy-policy`;
const LAST_UPDATED = "November 2026";

const JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Privacy Policy | Ghar Ka Organic",
      description:
        "Learn how Ghar Ka Organic protects your personal information, addresses, and payment data while shopping for pure Himalayan organic foods.",
      inLanguage: "en-IN",
      isPartOf: {
        "@type": "WebSite",
        name: "Ghar Ka Organic",
        url: BASE_URL,
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
          name: "Privacy Policy",
          item: CANONICAL,
        },
      ],
    },
  ],
});

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-white min-h-screen text-[#121212] font-sans selection:bg-[#121212] selection:text-white">
      {/* ─────────────── SEO & META TAGS ─────────────── */}
      <Helmet>
        <title>Privacy Policy | Ghar Ka Organic</title>
        <meta
          name="description"
          content="Privacy Policy for Ghar Ka Organic. Learn how we safeguard your personal data, courier addresses, and payments with 256-bit SSL encryption."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={CANONICAL} />
        <script type="application/ld+json">{JSONLD}</script>
      </Helmet>

      {/* ─────────────── HERO SECTION (BLACK & WHITE DESIGN) ─────────────── */}
      <header className="border-b border-[#e5e5e5] bg-white pt-12 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 block mb-3">
            Legal & Data Protection
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#121212] tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 font-light max-w-2xl mx-auto leading-relaxed">
            At Ghar Ka Organic, we hold your trust with the same sacred reverence
            as our Himalayan heritage. Here is how your personal information is
            protected, stored, and respected.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 text-xs text-neutral-500">
            <Clock size={13} className="text-neutral-400" />
            <span>Last Updated: {LAST_UPDATED} • Applies PAN-India</span>
          </div>
        </div>
      </header>

      {/* ─────────────── 4 TRUST PILLARS (BLACK & WHITE STYLE) ─────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 bg-white border border-[#e5e5e5] rounded-xl shadow-xs hover:border-[#121212] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-[#121212] flex items-center justify-center mb-2.5">
              <EyeOff size={16} />
            </div>
            <h2 className="text-xs sm:text-sm font-medium text-[#121212]">
              Never Sold
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
              We never sell or rent your data to advertisers.
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-white border border-[#e5e5e5] rounded-xl shadow-xs hover:border-[#121212] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-[#121212] flex items-center justify-center mb-2.5">
              <Lock size={16} />
            </div>
            <h2 className="text-xs sm:text-sm font-medium text-[#121212]">
              256-Bit SSL
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
              Bank-grade encryption for all payments.
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-white border border-[#e5e5e5] rounded-xl shadow-xs hover:border-[#121212] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-[#121212] flex items-center justify-center mb-2.5">
              <ShieldCheck size={16} />
            </div>
            <h2 className="text-xs sm:text-sm font-medium text-[#121212]">
              Zero Spam
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
              Only authentic delivery & order updates.
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-white border border-[#e5e5e5] rounded-xl shadow-xs hover:border-[#121212] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-[#121212] flex items-center justify-center mb-2.5">
              <FileCheck size={16} />
            </div>
            <h2 className="text-xs sm:text-sm font-medium text-[#121212]">
              FSSAI Compliant
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
              Full regulatory & consumer privacy norms.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────── MAIN DOCUMENT CONTENT ─────────────── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="space-y-12 text-[15px] leading-relaxed text-neutral-700">
          {/* SECTION 1 */}
          <section className="pb-8 border-b border-neutral-100">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 block mb-1">
              Section 01
            </span>
            <h2 className="text-xl sm:text-2xl font-light text-[#121212] tracking-tight mb-4">
              Overview & Scope
            </h2>
            <p className="text-neutral-600 mb-3">
              This Privacy Policy applies to all customers and visitors who
              interact with <strong>Ghar Ka Organic</strong> through our official
              website (<span className="font-mono text-xs">gharkaorganic.com</span>
              ), mobile applications, direct WhatsApp support channels, and
              customer service lines.
            </p>
            <p className="text-neutral-600">
              When you purchase our authentic A2 Badri cow desi ghee, Bhimtal raw
              forest honey, sun-dried Kumaoni pickles, or mountain spices, we
              collect only the essential information needed to fulfill and deliver
              your order securely to your doorstep across India.
            </p>
          </section>

          {/* SECTION 2 */}
          <section className="pb-8 border-b border-neutral-100">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 block mb-1">
              Section 02
            </span>
            <h2 className="text-xl sm:text-2xl font-light text-[#121212] tracking-tight mb-4">
              Information We Collect
            </h2>
            <p className="text-neutral-600 mb-4">
              We collect information transparently in three straightforward
              categories:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                <h3 className="text-sm font-medium text-[#121212] mb-1 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-neutral-800" />
                  Personal Contact Details
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Your full name, mobile telephone number, email address, and
                  detailed shipping destination (including house number, locality,
                  city, state, and 6-digit postal PIN code) required by courier
                  carriers for physical delivery.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                <h3 className="text-sm font-medium text-[#121212] mb-1 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-neutral-800" />
                  Payment & Transaction Security
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  All online payments (UPI, Credit/Debit cards, Net Banking, and
                  Wallets) are processed through Reserve Bank of India (RBI)
                  authorized payment gateways. <strong>We never store, see, or
                  retain</strong> your full credit card credentials, CVV codes, or
                  UPI MPINs on our servers.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                <h3 className="text-sm font-medium text-[#121212] mb-1 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-neutral-800" />
                  Technical & Device Logs
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  IP addresses, approximate geographic location (city level),
                  browser type, and cart state to remember your items, prevent
                  fraudulent checkout attempts, and optimize site speed.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3 */}
          <section className="pb-8 border-b border-neutral-100">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 block mb-1">
              Section 03
            </span>
            <h2 className="text-xl sm:text-2xl font-light text-[#121212] tracking-tight mb-4">
              How We Use Your Information
            </h2>
            <p className="text-neutral-600 mb-4">
              Your data is utilized solely for legitimate operational needs:
            </p>
            <ul className="space-y-2.5 text-neutral-600 text-sm">
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2 flex-shrink-0" />
                <span>
                  <strong>Order Dispatch & Delivery:</strong> Generating shipping
                  labels, packing airtight glass jars, and providing real-time
                  live tracking links via SMS/WhatsApp.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2 flex-shrink-0" />
                <span>
                  <strong>Direct Customer Support:</strong> Responding to your
                  inquiries, verifying package transit in high-altitude zones, and
                  handling replacements or refunds.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2 flex-shrink-0" />
                <span>
                  <strong>Order & Storefront Security:</strong> Detecting and mitigating
                  bot attacks, fraudulent COD orders, and fake requests.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2 flex-shrink-0" />
                <span>
                  <strong>Regulatory Obligations:</strong> Complying with GST
                  invoicing, FSSAI quality documentation, and government taxation
                  mandates.
                </span>
              </li>
            </ul>
          </section>

          {/* SECTION 4 */}
          <section className="pb-8 border-b border-neutral-100">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 block mb-1">
              Section 04
            </span>
            <h2 className="text-xl sm:text-2xl font-light text-[#121212] tracking-tight mb-4">
              Data Sharing & Third-Party Safeguards
            </h2>
            <p className="text-neutral-600 mb-4">
              We maintain a strict zero-leakage policy. Your information is only
              shared with verified partners under non-disclosure obligations:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-4 rounded-xl border border-neutral-200">
                <h3 className="font-medium text-[#121212] mb-1">
                  Logistics & Air Courier Partners
                </h3>
                <p className="text-neutral-500 leading-snug">
                  Shared exclusively with trusted delivery partners (e.g. Bluedart,
                  Delhivery, DTDC, India Post) solely to print airway bills and
                  complete final-mile delivery.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200">
                <h3 className="font-medium text-[#121212] mb-1">
                  Payment Gateway Providers
                </h3>
                <p className="text-neutral-500 leading-snug">
                  Certified PCI-DSS Level 1 compliant financial switches that
                  validate transactions with two-factor authentication and bank
                  OTPs.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 5 */}
          <section className="pb-8 border-b border-neutral-100">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 block mb-1">
              Section 05
            </span>
            <h2 className="text-xl sm:text-2xl font-light text-[#121212] tracking-tight mb-4">
              Cookies & Browser Storage
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-3">
              We use minimal, privacy-first cookies and browser storage
              mechanisms. These maintain your active login session, preserve your
              shopping cart items across page visits, and cache store catalog
              data so your browser loads instantly with zero unnecessary network
              strain.
            </p>
            <p className="text-neutral-500 text-xs sm:text-sm">
              You can disable cookies in your browser settings at any time; however,
              doing so may require you to re-add products to your bag upon page
              refresh.
            </p>
          </section>

          {/* SECTION 6 */}
          <section className="pb-8 border-b border-neutral-100">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 block mb-1">
              Section 06
            </span>
            <h2 className="text-xl sm:text-2xl font-light text-[#121212] tracking-tight mb-4">
              Your Privacy Rights & Controls
            </h2>
            <p className="text-neutral-600 mb-4">
              You retain complete ownership over your personal data:
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-neutral-900 flex-shrink-0" />
                <span>
                  <strong>Right to Access:</strong> Request a copy of all data
                  stored in your Ghar Ka Organic profile.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-neutral-900 flex-shrink-0" />
                <span>
                  <strong>Right to Rectification:</strong> Update or modify any
                  incorrect address or contact number directly during checkout or by messaging us on WhatsApp.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-neutral-900 flex-shrink-0" />
                <span>
                  <strong>Right to Erasure:</strong> Request the deletion of your
                  delivery records and personal details by emailing us.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-neutral-900 flex-shrink-0" />
                <span>
                  <strong>Opt-Out:</strong> Unsubscribe from non-essential
                  notifications at any time with a single click.
                </span>
              </div>
            </div>
          </section>

          {/* SECTION 7: GRIEVANCE OFFICER & CONTACT (MATCHING CONTACT PAGE CARD) */}
          <section className="p-6 sm:p-8 bg-white border border-[#e5e5e5] rounded-2xl shadow-xs">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400 block mb-1">
              Direct Assistance
            </span>
            <h2 className="text-2xl font-light text-[#121212] tracking-tight mb-2">
              Privacy Grievance & Kitchen Contact
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6 font-light">
              For any questions, data deletion requests, or privacy concerns,
              please reach out directly to our team in Bhimtal:
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/50">
                <div className="w-8 h-8 rounded-lg bg-neutral-200 text-[#121212] flex items-center justify-center mb-2">
                  <MapPin size={16} />
                </div>
                <h3 className="text-xs font-semibold text-[#121212]">
                  Mountain Kitchen
                </h3>
                <p className="text-xs text-neutral-600 mt-1 leading-snug">
                  Ward No. 2, Nalni, Bhimtal, Nainital, Uttarakhand – 263136
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/50">
                <div className="w-8 h-8 rounded-lg bg-neutral-200 text-[#121212] flex items-center justify-center mb-2">
                  <Phone size={16} />
                </div>
                <h3 className="text-xs font-semibold text-[#121212]">
                  Direct Telephone
                </h3>
                <p className="text-xs text-neutral-600 mt-1">
                  +91 98974 47525
                </p>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  Mon–Sat, 10 AM – 7 PM
                </span>
              </div>

              <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/50">
                <div className="w-8 h-8 rounded-lg bg-neutral-200 text-[#121212] flex items-center justify-center mb-2">
                  <Mail size={16} />
                </div>
                <h3 className="text-xs font-semibold text-[#121212]">
                  Direct Email
                </h3>
                <p className="text-xs text-neutral-600 mt-1 truncate">
                  gharkaorganic@gmail.com
                </p>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  Replies within 24 hours
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-100">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#121212] hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-all shadow-xs">
                <span>Visit Contact Support</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/pages/shipping"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-neutral-300 hover:border-[#121212] text-[#121212] text-xs font-semibold tracking-wide transition-all">
                <span>View Shipping Policy</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
