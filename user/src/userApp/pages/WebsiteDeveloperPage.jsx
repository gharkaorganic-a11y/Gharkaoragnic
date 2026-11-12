import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Code2,
  ExternalLink,
  Globe,
  Instagram,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import {
  AREAS_SERVED,
  CANONICAL,
  CONTACT_CARDS,
  DEV_BRAND,
  DEV_EMAIL,
  DEV_INSTAGRAM,
  DEV_INSTAGRAM_HANDLE,
  DEV_LOCATION,
  DEV_NAME,
  DEV_PHONE_DISPLAY,
  DEV_PHONE_TEL,
  DEV_TITLE_ROLE,
  DEV_WHATSAPP,
  DEVELOPER_FAQS,
  OG_IMAGE,
  SEO_META,
  TECH_STACK,
  WEBSITE_DEVELOPER_JSONLD,
  WEBSITE_HIGHLIGHTS,
} from "./websiteDeveloperSeo";

const CONTACT_ICON_MAP = {
  phone: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  instagram: Instagram,
};

const SERVICE_ICON_MAP = {
  ecommerce: ShoppingBag,
  business: Globe,
  seo: Search,
  webapp: Layers,
};

const WebsiteDeveloperPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? -1 : index));
  };

  return (
    <>
      <Helmet>
        <title>{SEO_META.title}</title>
        <meta name="description" content={SEO_META.description} />
        <meta name="keywords" content={SEO_META.keywords} />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="author" content={`${DEV_NAME} (${DEV_BRAND})`} />
        <meta name="publisher" content={DEV_BRAND} />
        <meta name="geo.region" content="IN-UT" />
        <meta name="geo.placename" content={DEV_LOCATION} />
        <meta name="geo.position" content="29.3459;79.5618" />
        <meta name="ICBM" content="29.3459, 79.5618" />

        <link rel="canonical" href={CANONICAL} />
        <link rel="alternate" hrefLang="en-IN" href={CANONICAL} />
        <link rel="alternate" hrefLang="x-default" href={CANONICAL} />

        {/* Open Graph */}
        <meta property="og:type" content="profile" />
        <meta property="profile:first_name" content="Ravi" />
        <meta property="profile:last_name" content="Sharma" />
        <meta property="og:title" content={SEO_META.ogTitle} />
        <meta property="og:description" content={SEO_META.ogDescription} />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={SEO_META.imageAlt} />
        <meta property="og:site_name" content="Ghar Ka Organic" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO_META.twitterTitle} />
        <meta
          name="twitter:description"
          content={SEO_META.twitterDescription}
        />
        <meta name="twitter:image" content={OG_IMAGE} />

        <script type="application/ld+json">{WEBSITE_DEVELOPER_JSONLD}</script>
      </Helmet>

      <div className="bg-[#fcfbf7] text-[#222222] font-sans min-h-screen pb-16">
        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="max-w-4xl mx-auto px-4 sm:px-6 py-4 text-xs tracking-wider text-neutral-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link
                to="/"
                className="hover:text-neutral-900 transition-colors uppercase font-medium">
                Home
              </Link>
            </li>
            <li className="text-neutral-300" aria-hidden="true">
              /
            </li>
            <li className="text-neutral-900 font-medium uppercase" aria-current="page">
              Website Developer – {DEV_NAME}
            </li>
          </ol>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          {/* ══════════════════════════════════════════════
              1. HERO PROFILE CARD (COMPACT & MODERN)
             ══════════════════════════════════════════════ */}
          <header className="bg-white rounded-3xl border border-[#eae6dc] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#edf5ee] text-[#244d37] border border-[#d3e5d6]">
                  <Sparkles size={12} /> {DEV_BRAND} • Developer Profile
                </span>
                <h1 className="text-2xl sm:text-3xl font-semibold text-[#121212] tracking-tight mt-2.5">
                  {DEV_NAME}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-[#244d37] mt-0.5">
                  {DEV_TITLE_ROLE} • {DEV_LOCATION}
                </p>
              </div>

              {/* Verified Badge */}
              <div className="inline-flex items-center gap-1.5 text-xs text-[#008a54] font-semibold bg-[#eaf7f0] border border-[#c6edd7] px-3 py-1.5 rounded-xl self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-[#008a54]" />
                Built gharkaorganic.com
              </div>
            </div>

            <p
              id="developer-intro"
              className="text-xs sm:text-[14px] text-[#4a4a4a] leading-relaxed mb-6 font-normal">
              Creator and engineer of <strong className="text-gray-900">gharkaorganic.com</strong>.
              Designing fast, mobile-first eCommerce stores and custom business websites engineered
              for Google search rankings and direct client inquiries.
            </p>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={DEV_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#244d37] hover:bg-[#1a3828] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-xs">
                <MessageCircle size={15} />
                WhatsApp ({DEV_PHONE_DISPLAY})
              </a>

              <a
                href={`tel:${DEV_PHONE_TEL}`}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-50 text-gray-800 border border-gray-300 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl transition">
                <Phone size={14} />
                Call Now
              </a>

              <a
                href={`mailto:${DEV_EMAIL}?subject=Website%20Inquiry`}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-50 text-gray-800 border border-gray-300 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl transition">
                <Mail size={14} />
                Email
              </a>

              <a
                href={DEV_INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-50 text-gray-700 border border-gray-300 text-xs sm:text-sm font-medium px-3.5 py-2.5 rounded-xl transition">
                <Instagram size={14} />
                {DEV_INSTAGRAM_HANDLE}
              </a>
            </div>
          </header>

          {/* ══════════════════════════════════════════════
              2. SERVICES (CONCISE BENTO GRID)
             ══════════════════════════════════════════════ */}
          <section
            id="services"
            aria-labelledby="websites-heading"
            className="bg-white rounded-3xl border border-[#eae6dc] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="mb-5">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-bold text-[#7B4627] block mb-1">
                Capabilities
              </span>
              <h2
                id="websites-heading"
                className="text-lg sm:text-xl font-semibold text-[#121212] tracking-tight">
                Websites &amp; Online Stores Built to Rank
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {WEBSITE_HIGHLIGHTS.map((item) => {
                const Icon = SERVICE_ICON_MAP[item.key] || Globe;
                return (
                  <div
                    key={item.title}
                    className="p-4 rounded-2xl bg-[#faf9f5] border border-[#f0ece2] flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#eae3d4] text-[#244d37] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-[13px] font-bold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ══════════════════════════════════════════════
              3. LIVE PORTFOLIO WORK (GHAR KA ORGANIC)
             ══════════════════════════════════════════════ */}
          <section
            id="featured-project"
            aria-labelledby="featured-project-heading"
            className="bg-white rounded-3xl border border-[#eae6dc] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-bold text-[#244d37] mb-1">
                  <Code2 size={13} /> Live Production Example
                </span>
                <h2
                  id="featured-project-heading"
                  className="text-lg sm:text-xl font-semibold text-[#121212] tracking-tight">
                  Featured Project: Ghar Ka Organic
                </h2>
              </div>
              <Link
                to="/all-products"
                className="inline-flex items-center gap-1.5 bg-[#edf5ee] hover:bg-[#244d37] text-[#244d37] hover:text-white border border-[#cde2d2] text-xs font-semibold px-3.5 py-2 rounded-xl transition-all self-start sm:self-auto">
                Explore Storefront
                <ExternalLink size={13} />
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-4">
              This entire website (<strong className="text-gray-900 font-medium">gharkaorganic.com</strong>)
              is built from scratch with custom React 18 SPA architecture, Firebase real-time data,
              shopping cart &amp; checkout, and comprehensive Schema.org JSON-LD SEO.
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] font-medium text-[#244d37] bg-[#edf5ee] border border-[#d6e7d8] px-2.5 py-0.5 rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════
              4. AREAS SERVED (SHORT, CLEAN PILLS)
             ══════════════════════════════════════════════ */}
          <section
            id="areas-served"
            aria-labelledby="areas-served-heading"
            className="bg-white rounded-3xl border border-[#eae6dc] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="mb-4">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-bold text-[#7B4627] block mb-1">
                Location &amp; Reach
              </span>
              <h2
                id="areas-served-heading"
                className="text-lg sm:text-xl font-semibold text-[#121212] tracking-tight">
                Areas Served
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-light mt-0.5">
                Based in <strong className="text-gray-900 font-medium">Nainital &amp; Bhimtal, Uttarakhand</strong>.
                Serving businesses locally across Kumaon &amp; Garhwal, and remotely across India.
              </p>
            </div>

            <ul className="flex flex-wrap gap-2">
              {AREAS_SERVED.map((area) => (
                <li
                  key={area}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-800 bg-[#faf9f5] border border-[#e5e1d5] px-3 py-1.5 rounded-xl">
                  <MapPin size={12} className="text-[#244d37]" />
                  {area}
                </li>
              ))}
            </ul>
          </section>

          {/* ══════════════════════════════════════════════
              5. DIRECT CONTACT CARDS
             ══════════════════════════════════════════════ */}
          <section
            id="contact-details"
            aria-labelledby="developer-contact-heading"
            className="bg-white rounded-3xl border border-[#eae6dc] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="mb-4">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-bold text-[#7B4627] block mb-1">
                Get In Touch
              </span>
              <h2
                id="developer-contact-heading"
                className="text-lg sm:text-xl font-semibold text-[#121212] tracking-tight">
                Direct Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CONTACT_CARDS.map((card) => {
                const Icon = CONTACT_ICON_MAP[card.key] || Phone;
                return (
                  <a
                    key={card.label}
                    href={card.href}
                    target={card.external ? "_blank" : undefined}
                    rel={card.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3.5 rounded-2xl border border-[#e8e4da] bg-[#faf9f5] hover:border-[#244d37] p-3.5 transition-colors group">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#e2dcd0] text-[#244d37] flex items-center justify-center shrink-0">
                      <Icon size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        {card.label}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#244d37] transition-colors truncate">
                        {card.value}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Role Clarification Note */}
            <div className="mt-5 p-3.5 rounded-2xl bg-[#f4f7f4] border border-[#d6e5d8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-700">
              <p>
                <strong>Role Note:</strong> {DEV_NAME} handles website engineering &amp; SEO for gharkaorganic.com.
                For organic food orders &amp; product inquiries, please contact the store directly.
              </p>
              <Link
                to="/contact"
                className="font-bold text-[#244d37] hover:underline whitespace-nowrap">
                Store Contact →
              </Link>
            </div>
          </section>

          {/* ══════════════════════════════════════════════
              6. FREQUENTLY ASKED QUESTIONS (ACCORDION)
             ══════════════════════════════════════════════ */}
          <section
            id="faq"
            aria-labelledby="developer-faq-heading"
            className="bg-white rounded-3xl border border-[#eae6dc] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="mb-4">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-bold text-[#7B4627] block mb-1">
                FAQs
              </span>
              <h2
                id="developer-faq-heading"
                className="text-lg sm:text-xl font-semibold text-[#121212] tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="divide-y divide-[#ece7dc]">
              {DEVELOPER_FAQS.slice(0, 5).map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={item.q} className="py-3.5 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between gap-3 text-left py-1 group focus:outline-none"
                      aria-expanded={isOpen}>
                      <span
                        className={`text-xs sm:text-sm font-medium leading-snug transition-colors ${
                          isOpen ? "text-[#244d37] font-semibold" : "text-gray-900 group-hover:text-[#244d37]"
                        }`}>
                        {item.q}
                      </span>
                      <ChevronDown
                        size={15}
                        className={`shrink-0 text-gray-500 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-[#244d37]" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="text-xs sm:text-[13px] text-gray-600 font-light leading-relaxed pt-2 pb-1 pr-3">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ══════════════════════════════════════════════
              7. FOOTER STORE LINKS
             ══════════════════════════════════════════════ */}
          <footer className="pt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-[#244d37]">
            <Link to="/" className="hover:underline">
              ← Ghar Ka Organic Home
            </Link>
            <Link to="/all-products" className="hover:underline">
              All Products
            </Link>
            <Link to="/shop/best-sellers" className="hover:underline">
              Best Sellers
            </Link>
            <Link to="/our-story" className="hover:underline">
              Our Story
            </Link>
            <Link to="/contact" className="hover:underline">
              Store Support
            </Link>
          </footer>
        </main>
      </div>
    </>
  );
};

export default WebsiteDeveloperPage;
