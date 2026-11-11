import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  STORY_FAQS,
  STORY_INTRO_PARAGRAPHS,
  STORY_LOCATION,
  STORY_SECTIONS,
} from "../homepage/ourStoryContent";

const BASE_URL = "https://gharkaorganic.com";
const CANONICAL = `${BASE_URL}/our-story`;
const OG_IMAGE =
  "https://res.cloudinary.com/dwgro3zo7/image/upload/v1776768403/Local_women_in_Bhimtal_Uttarakhand_preparing_traditional_Himalayan_organic_food_tbpvgk.webp";

const JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${CANONICAL}#aboutpage`,
      url: CANONICAL,
      name: "Our Story | Ghar Ka Organic",
      description:
        "Story of Ghar Ka Organic from Mangoli, Nainital, Uttarakhand – homemade pickles, pure ghee, natural honey, traditional pahadi dals, spices and pahadi salts.",
      inLanguage: "en-IN",
      isPartOf: {
        "@id": `${BASE_URL}/#website`,
      },
      mainEntity: {
        "@id": `${BASE_URL}/#organization`,
      },
      image: {
        "@type": "ImageObject",
        url: OG_IMAGE,
        width: 1200,
        height: 630,
      },
    },

    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Our Story",
      description:
        "Learn how GHAR KA started in Mangoli, Nainital, Uttarakhand — bringing the goodness, authenticity and familiar taste of homemade food to households everywhere.",
      isPartOf: {
        "@id": `${BASE_URL}/#website`,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: OG_IMAGE,
      },
    },

    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Ghar Ka Organic",
      url: BASE_URL,
      logo: `${BASE_URL}/logo/gharka-logo.png`,
      description:
        "Ghar Ka Organic is a Mangoli, Nainital, Uttarakhand-based brand bringing homemade pickles, pure ghee, natural honey, traditional pahadi dals, spices and pahadi salts to households everywhere without unnecessary chemicals or artificial preservatives.",
      foundingDate: "2020",
      foundingLocation: {
        "@type": "Place",
        name: "Mangoli, Nainital, Uttarakhand",
      },
      sameAs: [
        "https://www.instagram.com/gharkaorganic/",
        "https://www.facebook.com/gharkaorganic/",
        "https://www.twitter.com/gharkaorganic/",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Ward No. 2, Nalni",
        addressLocality: "Nainital",
        addressRegion: "Uttarakhand",
        postalCode: "263136",
        addressCountry: "IN",
      },
      telephone: "+91-9897447525",
      email: "gharkaorganic@gmail.com",
      knowsAbout: [
        "Uttarakhand Organic Food",
        "Homemade Pickles",
        "Pure Ghee",
        "Natural Honey",
        "Traditional Pahadi Dals",
        "Pahadi Salts",
        "Himalayan Traditional Food",
      ],
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        telephone: "+91-9897447525",
        email: "gharkaorganic@gmail.com",
        availableLanguage: ["English", "Hindi"],
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
          name: "Our Story",
          item: CANONICAL,
        },
      ],
    },

    {
      "@type": "FAQPage",
      "@id": `${CANONICAL}#faq`,
      mainEntity: STORY_FAQS.map((item) => ({
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

const OurStoryPage = () => {
  const heroImage =
    "https://res.cloudinary.com/dwgro3zo7/image/upload/v1776768403/Local_women_in_Bhimtal_Uttarakhand_preparing_traditional_Himalayan_organic_food_tbpvgk.webp";

  return (
    <>
      <Helmet>
        {/* BASIC SEO */}
        <title>
          Our Story | Ghar Ka Organic – Mangoli, Nainital, Uttarakhand
        </title>

        <meta
          name="description"
          content="Learn how GHAR KA began in Mangoli, Nainital, Uttarakhand. Homemade pickles, pure ghee, natural honey, traditional pahadi dals, spices and pahadi salts made without unnecessary chemicals or artificial preservatives."
        />

        <meta
          name="keywords"
          content="Ghar Ka Organic, GHAR KA, Mangoli Nainital, Uttarakhand organic food, homemade pickles, pure ghee, natural honey, pahadi dals, pahadi salts, traditional Indian food"
        />

        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="language" content="English" />
        <meta name="author" content="Ghar Ka Organic" />
        <meta name="publisher" content="Ghar Ka Organic" />

        <link rel="canonical" href={CANONICAL} />

        {/* OPEN GRAPH */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Our Story | Ghar Ka Organic" />
        <meta
          property="og:description"
          content="From Mangoli, Nainital, Uttarakhand — discover the story behind GHAR KA and the familiar taste of homemade food."
        />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Local women preparing traditional Himalayan homemade food in Mangoli, Nainital, Uttarakhand"
        />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:site_name" content="Ghar Ka Organic" />
        <meta property="og:locale" content="en_IN" />

        {/* TWITTER CARD */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Story | Ghar Ka Organic" />
        <meta
          name="twitter:description"
          content="From Mangoli, Nainital, Uttarakhand — homemade pickles, pure ghee, natural honey, traditional pahadi dals, spices and pahadi salts."
        />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:site" content="@gharkaorganic" />

        {/* ARTICLE META */}
        <meta
          property="article:published_time"
          content="2020-01-01T00:00:00Z"
        />
        <meta property="article:section" content="Company" />
        <meta property="article:tag" content="Organic" />
        <meta property="article:tag" content="Uttarakhand" />
        <meta property="article:tag" content="Food" />

        {/* JSON-LD with FAQ schema */}
        <script type="application/ld+json">{JSONLD}</script>

        {/* Preload image */}
        <link rel="preload" as="image" href={heroImage} />
      </Helmet>

      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#315c3c] text-white px-4 py-2 rounded-sm z-50 shadow-md">
        Skip to main content
      </a>

      <div className="bg-white text-[#222222] font-sans selection:bg-[#ebe7df] selection:text-[#121212] min-h-screen">
        {/* SUBTLE BREADCRUMB */}
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
              Our Story
            </li>
          </ol>
        </nav>

        {/* MAIN OUR STORY SECTION - 2-COLUMN UNIFIED SIGNATURE DESIGN */}
        <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 lg:gap-20 items-center">
            {/* ILLUSTRATION (LEFT COLUMN) */}
            <figure className="w-full m-0 order-1 md:order-1">
              <picture>
                <source
                  srcSet={heroImage.replace(/\.(jpg|png)$/i, ".webp")}
                  type="image/webp"
                />
                <img
                  src={heroImage}
                  alt="Traditional Himalayan homemade food preparation in Mangoli, Nainital, Uttarakhand by local women for Ghar Ka Organic"
                  loading="eager"
                  fetchPriority="high"
                  width="800"
                  height="1000"
                  decoding="async"
                  className="w-full h-auto object-cover aspect-[4/5] bg-white rounded-xl shadow-md border border-[#eee]"
                />
              </picture>
            </figure>

            {/* STORY NARRATIVE INTRO (RIGHT COLUMN) */}
            <article
              className="text-left flex flex-col justify-center order-2 md:order-2"
              itemScope
              itemType="https://schema.org/Organization">
              <meta itemProp="name" content="Ghar Ka Organic" />
              <meta itemProp="location" content={STORY_LOCATION} />

              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-light tracking-widest text-[#2a2a2a] mb-6 uppercase leading-snug font-sans"
                itemProp="slogan">
                Our Story – Pure Pahadi Taste from the Heart of Uttarakhand
              </h1>

              <div className="w-12 h-[1.5px] bg-gray-300 mb-8" aria-hidden="true" />

              <div
                className="font-light text-[15px] md:text-[15.5px] leading-[2.2] text-[#4f4f4f] space-y-5 md:space-y-6 antialiased"
                itemProp="description">
                {STORY_INTRO_PARAGRAPHS.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </article>
          </div>

          {/* FULL STORY CHAPTERS */}
          <div className="max-w-3xl mx-auto mt-14 md:mt-20 pt-12 md:pt-16 border-t border-[#e8e8e8] space-y-12 md:space-y-14">
            {STORY_SECTIONS.map((section) => (
              <section key={section.heading} className="space-y-5 md:space-y-6">
                <h2 className="text-xl sm:text-2xl font-light tracking-wide text-[#2a2a2a] leading-snug">
                  {section.heading}
                </h2>
                <div className="font-light text-[15px] md:text-[15.5px] leading-[2.2] text-[#4f4f4f] space-y-5 md:space-y-6 antialiased">
                  {section.paragraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>

        {/* INTERNAL NAVIGATION - MINIMALIST LUXURY CATALOG LINKS */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-16 border-t border-[#e8e8e8]">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-[0.18em] text-[#121212] uppercase">
              Explore Our Products
            </h2>
            <div
              className="w-8 h-[1px] bg-[#121212]/20 mx-auto mt-3"
              aria-hidden="true"
            />
          </div>

          <nav
            aria-label="Product categories"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            <Link
              to="/all-products"
              className="group p-6 md:p-7 border border-[#e5e5e5] hover:border-[#121212] bg-white transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-[16px] text-[#121212] group-hover:text-black tracking-wide">
                    All Products
                  </h3>
                  <span
                    className="text-[#999999] group-hover:text-[#121212] group-hover:translate-x-1 transition-all duration-200"
                    aria-hidden="true">
                    →
                  </span>
                </div>
                <p className="text-sm text-[#666666] mt-2 font-light leading-relaxed">
                  Explore our complete range of organic Himalayan products
                </p>
              </div>
            </Link>

            <Link
              to="/shop/best-sellers"
              className="group p-6 md:p-7 border border-[#e5e5e5] hover:border-[#121212] bg-white transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-[16px] text-[#121212] group-hover:text-black tracking-wide">
                    Best Sellers
                  </h3>
                  <span
                    className="text-[#999999] group-hover:text-[#121212] group-hover:translate-x-1 transition-all duration-200"
                    aria-hidden="true">
                    →
                  </span>
                </div>
                <p className="text-sm text-[#666666] mt-2 font-light leading-relaxed">
                  Discover our most loved products
                </p>
              </div>
            </Link>

            <Link
              to="/contact"
              className="group p-6 md:p-7 border border-[#e5e5e5] hover:border-[#121212] bg-white transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-[16px] text-[#121212] group-hover:text-black tracking-wide">
                    Get in Touch
                  </h3>
                  <span
                    className="text-[#999999] group-hover:text-[#121212] group-hover:translate-x-1 transition-all duration-200"
                    aria-hidden="true">
                    →
                  </span>
                </div>
                <p className="text-sm text-[#666666] mt-2 font-light leading-relaxed">
                  Contact us for bulk orders or inquiries
                </p>
              </div>
            </Link>

            <Link
              to="/blogs"
              className="group p-6 md:p-7 border border-[#e5e5e5] hover:border-[#121212] bg-white transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-[16px] text-[#121212] group-hover:text-black tracking-wide">
                    Blog & Stories
                  </h3>
                  <span
                    className="text-[#999999] group-hover:text-[#121212] group-hover:translate-x-1 transition-all duration-200"
                    aria-hidden="true">
                    →
                  </span>
                </div>
                <p className="text-sm text-[#666666] mt-2 font-light leading-relaxed">
                  Learn about organic living and food culture
                </p>
              </div>
            </Link>

            <Link
              to="/reviews"
              className="group p-6 md:p-7 border border-[#e5e5e5] hover:border-[#121212] bg-white transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-[16px] text-[#121212] group-hover:text-black tracking-wide">
                    Reviews
                  </h3>
                  <span
                    className="text-[#999999] group-hover:text-[#121212] group-hover:translate-x-1 transition-all duration-200"
                    aria-hidden="true">
                    →
                  </span>
                </div>
                <p className="text-sm text-[#666666] mt-2 font-light leading-relaxed">
                  See what our customers say
                </p>
              </div>
            </Link>

            <Link
              to="/contact"
              className="group p-6 md:p-7 border border-[#e5e5e5] hover:border-[#121212] bg-white transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-[16px] text-[#121212] group-hover:text-black tracking-wide">
                    Support
                  </h3>
                  <span
                    className="text-[#999999] group-hover:text-[#121212] group-hover:translate-x-1 transition-all duration-200"
                    aria-hidden="true">
                    →
                  </span>
                </div>
                <p className="text-sm text-[#666666] mt-2 font-light leading-relaxed">
                  Need help? Reach out to our team
                </p>
              </div>
            </Link>
          </nav>
        </section>

        {/* FAQ SECTION - MINIMALIST CLEAN ACCORDION */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 border-t border-[#e8e8e8]">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-[0.18em] text-[#121212] uppercase">
              Frequently Asked Questions
            </h2>
            <div
              className="w-8 h-[1px] bg-[#121212]/20 mx-auto mt-3"
              aria-hidden="true"
            />
          </div>

          <div className="divide-y divide-[#ebebeb] border-y border-[#ebebeb]">
            {STORY_FAQS.map((item, idx) => (
              <details
                key={idx}
                className="group py-5 transition-all">
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
      </div>
    </>
  );
};

export default OurStoryPage;