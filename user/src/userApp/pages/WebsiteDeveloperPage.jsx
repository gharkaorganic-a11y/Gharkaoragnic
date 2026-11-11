import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Database,
  Globe,
  Info,
  Instagram,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Rocket,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";

const BASE_URL = "https://gharkaorganic.com";
const CANONICAL = `${BASE_URL}/website-developer`;
const OG_IMAGE =
  "https://res.cloudinary.com/dwgro3zo7/image/upload/v1776691741/og-cover-gko.webp";

const DEV_NAME = "Ravi Sharma";
const DEV_BRAND = "RSDEV";
const DEV_PHONE_DISPLAY = "+91 83928 56993";
const DEV_PHONE_TEL = "+918392856993";
const DEV_EMAIL = "ravisharmabhimtal@gmail.com";
const DEV_INSTAGRAM = "https://www.instagram.com/raviiiiii._0/";
const DEV_INSTAGRAM_HANDLE = "@raviiiiii._0";
const DEV_WHATSAPP =
  "https://wa.me/918392856993?text=Hi%20Ravi%20Sharma,%20I%20visited%20gharkaorganic.com%20and%20want%20a%20custom%20website";

const TECH_STACK = [
  {
    icon: Code2,
    name: "React.js + Vite",
    role: "Frontend Architecture",
    desc: "Component-driven storefront and admin panels with code-splitting, lazy route loading, and crisp client-side navigation.",
  },
  {
    icon: Database,
    name: "Google Firebase & Firestore",
    role: "Real-Time Cloud Backend",
    desc: "Live catalog sync, order management, authentication, and instant storefront configuration updates without server lag.",
  },
  {
    icon: Layers,
    name: "MERN Stack (MongoDB, Express, Node.js)",
    role: "Scalable Full-Stack APIs",
    desc: "Custom REST APIs, database modeling, payment integrations, and tailored business workflows engineered from scratch.",
  },
  {
    icon: Smartphone,
    name: "Tailwind CSS",
    role: "Mobile-First UI Design",
    desc: "Lightweight utility-first styling crafted for fast mobile browsing, clean typography, and smooth conversion journeys.",
  },
  {
    icon: Search,
    name: "Technical Google SEO & Schema",
    role: "Search & AI Discoverability",
    desc: "Dynamic React Helmet meta tags, Open Graph cards, JSON-LD rich schemas, canonical URLs, XML sitemaps, and llms.txt.",
  },
  {
    icon: Zap,
    name: "Core Web Vitals & Speed",
    role: "Zero-Bloat Performance",
    desc: "Built without heavy WordPress themes or bloated plugins—delivering fast load times, optimized assets, and clean HTML.",
  },
];

const CUSTOM_ADVANTAGES = [
  "100% custom-coded from scratch — no slow WordPress templates or generic drag-and-drop builders",
  "Built for high Google search rankings with structured JSON-LD schema and clean URL routing",
  "Direct WhatsApp, Phone Call, and Checkout funnels designed to turn visitors into real orders & leads",
  "Mobile-first shopping & browsing experience tuned for Indian smartphone users and slower networks",
  "Dedicated Admin Dashboard to manage products, banners, categories, orders, and storefront updates",
  "Transparent, direct-from-developer pricing with ongoing support for domain, hosting, and SEO",
];

const SERVICE_OFFERINGS = [
  {
    icon: Rocket,
    title: "Custom eCommerce & D2C Stores",
    desc: "Complete online shopping platforms with product variants, cart, checkout, order tracking, and admin control.",
  },
  {
    icon: Globe,
    title: "Business, Real Estate & Brand Portals",
    desc: "High-converting websites for real estate advisors, local businesses, agencies, hospitality, and startups.",
  },
  {
    icon: ShieldCheck,
    title: "Technical SEO & Speed Architecture",
    desc: "Schema markup, automated sitemaps, clean canonical structure, and fast Core Web Vitals out of the box.",
  },
  {
    icon: Sparkles,
    title: "Direct WhatsApp & Lead Systems",
    desc: "Frictionless inquiry forms, 1-click WhatsApp triggers, and mobile action bars built to maximize customer inquiries.",
  },
];

const DEVELOPER_FAQS = [
  {
    q: "Who designed, built, and maintains gharkaorganic.com?",
    a: "Ghar Ka Organic (gharkaorganic.com) is custom-designed, coded, and maintained by Ravi Sharma (RSDEV), an independent Full-Stack MERN Stack and Google Firebase Developer based in Nainital, Uttarakhand, India.",
  },
  {
    q: "Is Ravi Sharma an owner or food seller at Ghar Ka Organic?",
    a: "No. Ravi Sharma is strictly the independent software engineer and website developer who built and manages the web application. For product orders, shipping, pickles, ghee, honey, or store inquiries, please contact Ghar Ka Organic directly via the Contact page.",
  },
  {
    q: "What technology stack powers the Ghar Ka Organic website?",
    a: "The platform is custom-engineered using React.js, Vite, Tailwind CSS, React Router, Firebase Firestore, and technical SEO tooling (React Helmet, JSON-LD structured data, and XML sitemaps) rather than generic WordPress templates.",
  },
  {
    q: "Can I hire Ravi Sharma to build a similar custom website or eCommerce store?",
    a: "Yes. If you run a D2C brand, local shop, real estate consultancy, or startup and want a fast, SEO-ready custom website or online store, you can contact Ravi Sharma directly on WhatsApp or Call at +91 83928 56993 or email ravisharmabhimtal@gmail.com.",
  },
  {
    q: "What types of websites does Ravi Sharma (RSDEV) build?",
    a: "Ravi Sharma builds custom eCommerce stores, MERN stack web applications, Firebase-powered business portals, real estate websites, admin dashboards, and SEO-focused landing pages tailored to generate real leads and sales.",
  },
];

const JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Website Developer – Ravi Sharma (RSDEV) | Ghar Ka Organic",
      description:
        "Learn about Ravi Sharma (RSDEV), the independent Full-Stack MERN & Google Firebase Developer from Nainital, Uttarakhand who designed, coded, and maintains gharkaorganic.com.",
      inLanguage: "en-IN",
      isPartOf: {
        "@id": `${BASE_URL}/#website`,
      },
      about: {
        "@id": `${CANONICAL}#developer`,
      },
      mainEntity: {
        "@id": `${CANONICAL}#developer`,
      },
    },
    {
      "@type": "Person",
      "@id": `${CANONICAL}#developer`,
      name: DEV_NAME,
      alternateName: DEV_BRAND,
      jobTitle: "Full-Stack MERN & Google Firebase Website Developer",
      description:
        "Independent Full-Stack Web Developer (React.js, Node.js, MongoDB, Firebase Firestore, Tailwind CSS & Technical SEO) based in Nainital, Uttarakhand, India.",
      telephone: "+91-8392856993",
      email: DEV_EMAIL,
      url: CANONICAL,
      sameAs: [DEV_INSTAGRAM],
      homeLocation: {
        "@type": "Place",
        name: "Nainital, Uttarakhand, India",
      },
      knowsAbout: [
        "React.js",
        "Node.js",
        "MongoDB",
        "Firebase Firestore",
        "Tailwind CSS",
        "MERN Stack Development",
        "eCommerce Web Development",
        "Technical SEO",
        "JSON-LD Structured Data",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${CANONICAL}#service`,
      name: "Ravi Sharma (RSDEV) – Custom Website & eCommerce Development",
      description:
        "Custom-coded React, MERN stack, and Firebase websites built from scratch for eCommerce stores, local businesses, startups, and real estate brands across India.",
      url: CANONICAL,
      telephone: "+91-8392856993",
      email: DEV_EMAIL,
      provider: {
        "@id": `${CANONICAL}#developer`,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nainital",
        addressRegion: "Uttarakhand",
        addressCountry: "IN",
      },
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      serviceType: [
        "Custom Website Development",
        "eCommerce Store Development",
        "MERN Stack Development",
        "Firebase Web Applications",
        "Technical SEO Optimization",
      ],
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
          name: "Website Developer",
          item: CANONICAL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${CANONICAL}#faq`,
      mainEntity: DEVELOPER_FAQS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ],
});

const WebsiteDeveloperPage = () => {
  return (
    <>
      <Helmet>
        <title>
          Website Developer – Ravi Sharma (RSDEV) | Full-Stack MERN &amp;
          Firebase Developer
        </title>

        <meta
          name="description"
          content="gharkaorganic.com is custom-designed and developed by Ravi Sharma (RSDEV), a Full-Stack MERN & Google Firebase Developer in Nainital, Uttarakhand. Want a fast, SEO-ready custom website or eCommerce store? Contact +91 83928 56993."
        />

        <meta
          name="keywords"
          content="Ravi Sharma website developer, RSDEV, Ghar Ka Organic website developer, Nainital web developer, Uttarakhand MERN stack developer, React Firebase eCommerce developer, custom website developer India"
        />

        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="author" content={DEV_NAME} />
        <meta name="geo.region" content="IN-UT" />
        <meta name="geo.placename" content="Nainital, Uttarakhand, India" />
        <link rel="canonical" href={CANONICAL} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Website Developer – Ravi Sharma (RSDEV) | Ghar Ka Organic"
        />
        <meta
          property="og:description"
          content="Custom React, MERN Stack & Google Firebase engineering behind gharkaorganic.com by Ravi Sharma (RSDEV), Nainital, Uttarakhand."
        />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:site_name" content="Ghar Ka Organic" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Website Developer – Ravi Sharma (RSDEV) | Ghar Ka Organic"
        />
        <meta
          name="twitter:description"
          content="Custom React, MERN Stack & Google Firebase developer in Nainital, Uttarakhand. Contact +91 83928 56993 for custom websites & eCommerce stores."
        />
        <meta name="twitter:image" content={OG_IMAGE} />

        <script type="application/ld+json">{JSONLD}</script>
      </Helmet>

      <div className="bg-white text-[#222222] font-sans min-h-screen">
        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs tracking-wider text-neutral-400">
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
              Website Developer
            </li>
          </ol>
        </nav>

        {/* HERO */}
        <header className="border-b border-[#e8e8e8] bg-[#FAF8F5]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#EAE3D6] bg-white px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#315c3c] mb-5">
                <Code2 size={14} aria-hidden="true" />
                {DEV_BRAND} • Full-Stack MERN &amp; Firebase Developer
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#1a1a1a] leading-tight mb-5">
                Website Designed &amp; Developed by{" "}
                <span className="font-medium text-[#315c3c]">{DEV_NAME}</span>
              </h1>

              <p className="text-[15.5px] sm:text-[17px] text-[#4f4f4f] font-light leading-relaxed mb-8">
                The official web platform for{" "}
                <strong className="font-medium text-[#1a1a1a]">
                  Ghar Ka Organic
                </strong>{" "}
                (<code>gharkaorganic.com</code>) is custom-engineered from
                scratch by{" "}
                <strong className="font-medium text-[#1a1a1a]">
                  {DEV_NAME} ({DEV_BRAND})
                </strong>{" "}
                — an independent full-stack software developer based in{" "}
                <strong className="font-medium text-[#1a1a1a]">
                  Nainital, Uttarakhand, India
                </strong>
                . Built without slow WordPress builders or generic templates for
                speed, mobile-first UX, and Google SEO performance.
              </p>

              <div className="flex flex-wrap items-center gap-3.5">
                <a
                  href={DEV_WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-[#315c3c] hover:bg-[#244b2e] text-white text-sm font-medium px-5 py-3 rounded-lg shadow-sm transition">
                  <MessageCircle size={17} aria-hidden="true" />
                  WhatsApp {DEV_PHONE_DISPLAY}
                </a>

                <a
                  href={`tel:${DEV_PHONE_TEL}`}
                  className="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 text-[#1a1a1a] border border-[#dcd6ca] text-sm font-medium px-5 py-3 rounded-lg transition">
                  <Phone size={16} aria-hidden="true" />
                  Call {DEV_PHONE_DISPLAY}
                </a>

                <a
                  href={DEV_INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 text-[#1a1a1a] border border-[#dcd6ca] text-sm font-medium px-5 py-3 rounded-lg transition">
                  <Instagram size={16} aria-hidden="true" />
                  {DEV_INSTAGRAM_HANDLE}
                </a>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16 md:space-y-20">
          {/* ROLE CLARIFICATION (ENTITY DISAMBIGUATION FOR USERS & SEARCH ENGINES) */}
          <section aria-labelledby="role-clarification-heading">
            <div className="rounded-2xl border border-[#EAE3D6] bg-[#FAF8F5] p-6 sm:p-8 md:p-10">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#EAE3D6] flex items-center justify-center text-[#315c3c] shrink-0">
                  <Info size={20} aria-hidden="true" />
                </div>
                <div>
                  <h2
                    id="role-clarification-heading"
                    className="text-xl sm:text-2xl font-medium text-[#1a1a1a]">
                    Role &amp; Business Clarification
                  </h2>
                  <p className="text-sm text-[#555555] font-light mt-1">
                    Clear separation between the organic food brand and the
                    independent technology developer.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl bg-white border border-[#eae5dc] p-6">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8F6646]">
                    The Brand (Store &amp; Products)
                  </span>
                  <h3 className="text-lg font-medium text-[#1a1a1a] mt-1 mb-2">
                    Ghar Ka Organic
                  </h3>
                  <p className="text-sm text-[#4f4f4f] font-light leading-relaxed mb-4">
                    Ghar Ka Organic is an Uttarakhand-based food brand from
                    Mangoli, Nainital offering homemade pickles, pure ghee,
                    natural honey, traditional pahadi dals, spices, and pahadi
                    salts. All food orders, shipping, and product queries are
                    handled directly by the Ghar Ka Organic team.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#315c3c] hover:text-[#244b2e] underline underline-offset-4">
                    Contact Ghar Ka Organic Store
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>

                <div className="rounded-xl bg-white border border-[#eae5dc] p-6">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#315c3c]">
                    Independent Software Engineer
                  </span>
                  <h3 className="text-lg font-medium text-[#1a1a1a] mt-1 mb-2">
                    {DEV_NAME} ({DEV_BRAND})
                  </h3>
                  <p className="text-sm text-[#4f4f4f] font-light leading-relaxed mb-4">
                    {DEV_NAME} is the independent Full-Stack MERN &amp; Google
                    Firebase Website Developer who designed, coded, and
                    maintains <code>gharkaorganic.com</code>. He is{" "}
                    <strong className="font-medium text-[#1a1a1a]">not</strong>{" "}
                    an owner, partner, or seller of food products for Ghar Ka
                    Organic.
                  </p>
                  <a
                    href={DEV_WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#315c3c] hover:text-[#244b2e] underline underline-offset-4">
                    Contact {DEV_NAME} for Website Projects
                    <ArrowRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ARCHITECTURE & TECH STACK */}
          <section aria-labelledby="tech-stack-heading">
            <div className="max-w-2xl mb-10">
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#315c3c] block mb-2">
                Website Engineering
              </span>
              <h2
                id="tech-stack-heading"
                className="text-2xl sm:text-3xl font-light text-[#1a1a1a] tracking-tight mb-3">
                Technologies Powering Ghar Ka Organic
              </h2>
              <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed">
                Instead of slow, template-heavy WordPress setups, this platform
                is engineered with modern JavaScript, real-time cloud
                databases, and structured SEO architecture.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TECH_STACK.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="p-6 rounded-xl border border-[#e5e5e5] bg-white hover:border-[#315c3c] transition-colors flex flex-col">
                    <div className="w-11 h-11 rounded-lg bg-[#FAF8F5] border border-[#EAE3D6] text-[#315c3c] flex items-center justify-center mb-4">
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8F6646] mb-1">
                      {item.role}
                    </span>
                    <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-[#555555] font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* WHY CUSTOM CODE + SERVICES */}
          <section
            aria-labelledby="services-heading"
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start border-t border-[#e8e8e8] pt-14">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#315c3c] block">
                Want a Website Like This?
              </span>
              <h2
                id="services-heading"
                className="text-2xl sm:text-3xl font-light text-[#1a1a1a] leading-snug">
                Custom Websites Built for Speed, SEO &amp; Real Leads
              </h2>
              <p className="text-sm sm:text-base text-[#4f4f4f] font-light leading-relaxed">
                Whether you run a D2C food brand, real estate advisory, local
                business, or growing startup, {DEV_NAME} ({DEV_BRAND}) builds
                clean, fast, conversion-focused web applications with zero
                agency bloat.
              </p>

              <ul className="space-y-3 pt-1">
                {CUSTOM_ADVANTAGES.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm text-[#3f3f3f] font-light leading-relaxed">
                    <CheckCircle2
                      size={18}
                      className="text-[#315c3c] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {SERVICE_OFFERINGS.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.title}
                    className="p-6 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]">
                    <div className="w-10 h-10 rounded-lg bg-white border border-[#EAE3D6] text-[#315c3c] flex items-center justify-center mb-4">
                      <Icon size={19} aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-medium text-[#1a1a1a] mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555555] font-light leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* DEVELOPER CONTACT CARD */}
          <section
            aria-labelledby="developer-contact-heading"
            className="rounded-2xl bg-[#1f3a27] text-white p-7 sm:p-10 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#FFE3B3] block">
                  Direct Developer Contact
                </span>
                <h2
                  id="developer-contact-heading"
                  className="text-2xl sm:text-3xl font-light leading-snug">
                  Start Your Custom Website with {DEV_NAME} ({DEV_BRAND})
                </h2>
                <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-2xl">
                  Speak directly with the developer who built this platform. Get
                  transparent pricing, fast delivery, custom SEO setup, and
                  ongoing technical support.
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs sm:text-sm text-white/85">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} className="text-[#FFE3B3]" aria-hidden="true" />
                    Nainital, Uttarakhand, India
                  </span>
                  <a
                    href={`mailto:${DEV_EMAIL}?subject=Website%20Development%20Inquiry`}
                    className="inline-flex items-center gap-1.5 hover:text-[#FFE3B3] transition-colors">
                    <Mail size={15} className="text-[#FFE3B3]" aria-hidden="true" />
                    {DEV_EMAIL}
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
                <a
                  href={DEV_WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#FFE3B3] hover:bg-white text-[#1a1a1a] font-semibold text-sm px-6 py-3.5 rounded-lg transition">
                  <MessageCircle size={18} aria-hidden="true" />
                  Chat on WhatsApp ({DEV_PHONE_DISPLAY})
                </a>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${DEV_PHONE_TEL}`}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-medium px-4 py-3 rounded-lg transition">
                    <Phone size={15} aria-hidden="true" />
                    Call Now
                  </a>
                  <a
                    href={DEV_INSTAGRAM}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-medium px-4 py-3 rounded-lg transition">
                    <Instagram size={15} aria-hidden="true" />
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ SECTION */}
          <section
            aria-labelledby="developer-faq-heading"
            className="max-w-3xl mx-auto pt-4 pb-6">
            <div className="text-center mb-10">
              <h2
                id="developer-faq-heading"
                className="text-xl sm:text-2xl md:text-3xl font-light tracking-[0.16em] text-[#121212] uppercase">
                Frequently Asked Questions
              </h2>
              <div
                className="w-8 h-[1px] bg-[#121212]/20 mx-auto mt-3"
                aria-hidden="true"
              />
            </div>

            <div className="divide-y divide-[#ebebeb] border-y border-[#ebebeb]">
              {DEVELOPER_FAQS.map((item, idx) => (
                <details key={idx} className="group py-5 transition-all">
                  <summary className="font-medium text-[16px] md:text-[17px] text-[#121212] flex items-center justify-between cursor-pointer list-none hover:text-[#315c3c] transition-colors py-1">
                    <span>{item.q}</span>
                    <span
                      className="ml-4 shrink-0 text-[#888888] transition-transform duration-200 group-open:rotate-180"
                      aria-hidden="true">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="text-[#555555] font-light text-[15px] leading-relaxed pt-3 pb-1">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* INTERNAL NAVIGATION BACK TO STORE */}
          <section className="border-t border-[#e8e8e8] pt-10 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-[#315c3c]">
            <Link to="/" className="hover:underline underline-offset-4">
              ← Back to Ghar Ka Organic Home
            </Link>
            <Link to="/all-products" className="hover:underline underline-offset-4">
              Explore All Products
            </Link>
            <Link to="/our-story" className="hover:underline underline-offset-4">
              Read Our Story
            </Link>
            <Link to="/contact" className="hover:underline underline-offset-4">
              Store Contact &amp; Support
            </Link>
          </section>
        </main>
      </div>
    </>
  );
};

export default WebsiteDeveloperPage;

