import React from "react";
import { Helmet } from "react-helmet-async";

const BASE_URL = "https://gharkaorganic.com";
const CANONICAL = `${BASE_URL}/our-story`;

const JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": CANONICAL,
      url: CANONICAL,
      name: "Our Story | Ghar Ka Organic",
      description:
        "Story of Ghar Ka Organic from Bhimtal, Uttarakhand – handmade Himalayan pickles, A2 ghee and raw honey.",
      inLanguage: "en-IN",
      isPartOf: {
        "@id": `${BASE_URL}/#website`,
      },
      mainEntity: {
        "@id": `${BASE_URL}/#organization`,
      },
    },

    {
      "@type": "WebPage",
      "@id": CANONICAL + "#webpage",
      url: CANONICAL,
      name: "Our Story",
      isPartOf: {
        "@id": `${BASE_URL}/#website`,
      },
    },

    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Ghar Ka Organic",
      url: BASE_URL,
      logo: `${BASE_URL}/gharka-logo.png`,
      sameAs: ["https://www.instagram.com/gharkaorganic/"],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bhimtal",
        addressRegion: "Uttarakhand",
        addressCountry: "IN",
      },
      knowsAbout: [
        "Uttarakhand Organic Food",
        "Pahadi Pickles",
        "A2 Bilona Ghee",
        "Raw Forest Honey",
        "Himalayan Traditional Food",
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
          name: "Our Story",
          item: CANONICAL,
        },
      ],
    },
  ],
});

const OurStoryPage = () => {
  return (
    <>
      <Helmet>
        {/* BASIC SEO */}
        <title>
          Our Story | Ghar Ka Organic – Bhimtal Uttarakhand Organic Food Brand
        </title>

        <meta
          name="description"
          content="Learn how Ghar Ka Organic started in Bhimtal, Uttarakhand. Handmade Himalayan pickles, A2 ghee, and raw forest honey made using traditional methods."
        />

        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="Ghar Ka Organic" />

        <link rel="canonical" href={CANONICAL} />

        {/* OPEN GRAPH */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Our Story | Ghar Ka Organic" />
        <meta
          property="og:description"
          content="From Bhimtal, Uttarakhand — discover the story behind Ghar Ka Organic Himalayan food."
        />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:site_name" content="Ghar Ka Organic" />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSONLD}</script>
      </Helmet>

      <div className="bg-white text-[#4a4a4a] font-sans pb-20">
        {/* HERO */}
        <div className="w-full h-[50vh] md:h-[65vh] relative">
          <img
            src="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776768403/Local_women_in_Bhimtal_Uttarakhand_preparing_traditional_Himalayan_organic_food_tbpvgk.webp"
            alt="Uttarakhand Himalayan organic farming landscape in Bhimtal"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* TITLE */}
        <section className="text-center pt-20 pb-10 px-6">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-[#333333] mb-4">
            OUR STORY
          </h1>
          <div className="w-12 h-[1px] bg-gray-300 mx-auto"></div>
        </section>

        {/* CONTENT */}
        <section className="max-w-[52rem] mx-auto px-6 py-10 text-center font-light text-[15px] leading-[2.2] text-[#555555] space-y-16">
          <p>
            Ghar Ka Organic is a Bhimtal, Uttarakhand based Himalayan organic
            food brand focused on traditional Indian food heritage.
          </p>

          <p>
            We specialize in handmade pahadi pickles, A2 bilona ghee, and raw
            forest honey sourced directly from Uttarakhand villages.
          </p>

          <p>
            Every product is prepared using traditional methods without
            preservatives or chemicals, preserving authentic Himalayan taste.
          </p>

          <p>
            Our mission is to bring pure Uttarakhand organic food to homes
            across India with trust and transparency.
          </p>
        </section>

        {/* INTERNAL SEO LINKS (IMPORTANT) */}
        <section className="text-center py-10">
          <a href="/all-products" className="text-sm underline text-gray-700">
            Explore Organic Products from Uttarakhand →
          </a>
        </section>
      </div>
    </>
  );
};

export default OurStoryPage;
