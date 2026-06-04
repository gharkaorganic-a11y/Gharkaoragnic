import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

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
        "Story of Ghar Ka Organic from Bhimtal, Uttarakhand – handmade Himalayan pickles, A2 ghee and raw honey.",
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
        "Learn how Ghar Ka Organic started — bringing authentic Himalayan organic food from Uttarakhand to India.",
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
      logo: `${BASE_URL}/gharka-logo.png`,
      description:
        "Ghar Ka Organic is an Uttarakhand-based brand bringing authentic Himalayan organic food – handmade pickles, A2 bilona ghee, and raw forest honey – to homes across India.",
      foundingDate: "2020",
      foundingLocation: {
        "@type": "Place",
        name: "Bhimtal, Uttarakhand",
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
        "Pahadi Pickles",
        "A2 Bilona Ghee",
        "Raw Forest Honey",
        "Himalayan Traditional Food",
        "Kumaoni Cuisine",
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
      mainEntity: [
        {
          "@type": "Question",
          name: "Who is Ghar Ka Organic?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ghar Ka Organic is an Uttarakhand-based brand dedicated to bringing authentic Himalayan organic food to homes across India. We make handmade pickles, A2 bilona ghee, and raw forest honey using traditional methods and natural ingredients.",
          },
        },
        {
          "@type": "Question",
          name: "Where does Ghar Ka Organic come from?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We are based in Bhimtal, Uttarakhand, in the beautiful Himalayas. Our mission is to preserve the authentic taste and tradition of Pahadi food while supporting local communities.",
          },
        },
        {
          "@type": "Question",
          name: "Why is it called Ghar Ka Organic?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "'Ghar Ka' means 'from home' in Hindi. Our name reflects our commitment to homemade authenticity — food made with the same care and quality as if prepared in your own kitchen.",
          },
        },
        {
          "@type": "Question",
          name: "Are Ghar Ka Organic products truly organic?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, all our products are made with organic and natural ingredients. We use no artificial preservatives, chemicals, or additives — only pure, traditional Himalayan ingredients.",
          },
        },
      ],
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
          Our Story | Ghar Ka Organic – Bhimtal Uttarakhand Organic Food Brand
        </title>

        <meta
          name="description"
          content="Learn how Ghar Ka Organic started in Bhimtal, Uttarakhand. Handmade Himalayan pickles, A2 ghee, and raw forest honey made using traditional methods with zero preservatives."
        />

        <meta
          name="keywords"
          content="Ghar Ka Organic, Uttarakhand organic food, Bhimtal pickles, A2 ghee, raw honey, pahadi products, Himalayan food, organic brand"
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
          content="From Bhimtal, Uttarakhand — discover the story behind Ghar Ka Organic's authentic Himalayan organic food."
        />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Local women preparing traditional Himalayan organic food in Bhimtal, Uttarakhand"
        />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:site_name" content="Ghar Ka Organic" />
        <meta property="og:locale" content="en_IN" />

        {/* TWITTER CARD */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Story | Ghar Ka Organic" />
        <meta
          name="twitter:description"
          content="Authentic Himalayan organic food from Bhimtal, Uttarakhand. Handmade pickles, A2 ghee, and raw honey."
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
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-amber-500 text-white px-4 py-2 rounded-md z-50">
        Skip to main content
      </a>

      <div className="bg-white text-[#4a4a4a] font-sans pb-20">
        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-6 pt-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <a href="/" className="hover:text-black transition">
                Home
              </a>
            </li>
            <li>/</li>
            <li className="text-gray-900" aria-current="page">
              Our Story
            </li>
          </ol>
        </nav>

        {/* HERO */}
        <section className="w-full h-[50vh] md:h-[65vh] relative overflow-hidden">
          <picture>
            <source
              srcSet={heroImage.replace(/\.(jpg|png)$/i, ".webp")}
              type="image/webp"
            />
            <img
              src={heroImage}
              alt="Local women preparing traditional Himalayan organic food in Bhimtal, Uttarakhand"
              className="w-full h-full object-cover object-center"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              width="1200"
              height="630"
            />
          </picture>
          <div
            className="absolute inset-0 bg-black/10"
            aria-hidden="true"></div>
        </section>

        {/* TITLE */}
        <section className="text-center pt-20 pb-10 px-6">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-[#333333] mb-4">
            OUR STORY
          </h1>
          <div
            className="w-12 h-[1px] bg-gray-300 mx-auto"
            aria-hidden="true"></div>
        </section>

        {/* MAIN CONTENT */}
        <section
          id="main-content"
          className="max-w-[52rem] mx-auto px-6 py-10 text-center font-light text-[15px] leading-[2.2] text-[#555555] space-y-10">
          <p>
            At <b>Ghar Ka Organic</b>, our journey started with a simple mission
            — to bring back the authentic taste of the mountains with zero
            preservatives and real homemade goodness.
          </p>

          <p>
            In today's world, where most food is filled with chemicals and
            artificial flavors, we wanted people to experience what "ghar ka
            khaana" truly means — pure, simple, and honest food made with care.
          </p>

          <p>
            Deeply connected to our Pahadi roots, we also wanted to share the
            beauty of Uttarakhand with India. From traditional flavors and local
            ingredients to warmth, simplicity, and hospitality —{" "}
            <b>Ghar Ka Organic represents the soul of the Himalayas</b>.
          </p>

          <p>
            Every product we create carries a touch of the mountains: natural
            ingredients, traditional pahadi flavors, homemade authenticity, and
            the comforting feeling that reminds you of home.
          </p>

          <p>
            <b>Ghar Ka Organic is not just a brand — it is an emotion.</b>
            <br />
            It is built to preserve culture, support local roots, and bring the
            real taste of the pahad to homes across India.
          </p>

          <p>
            We believe food should not just fill your stomach — it should remind
            you of home, tradition, and purity.
          </p>

          <p>
            Our mission is to bring pure Uttarakhand organic food to homes
            across India with trust and transparency.
          </p>
        </section>

        {/* INTERNAL NAVIGATION LINKS */}
        <section className="max-w-6xl mx-auto px-6 py-16 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Explore Our Products
          </h2>

          <nav className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a
              href="/all-products"
              className="group p-6 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition">
              <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
                All Products
              </h3>
              <p className="text-sm text-gray-600">
                Explore our complete range of organic Himalayan products
              </p>
            </a>

            <a
              href="/shop/best-sellers"
              className="group p-6 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition">
              <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
                Best Sellers
              </h3>
              <p className="text-sm text-gray-600">
                Discover our most loved products
              </p>
            </a>

            <a
              href="/contact"
              className="group p-6 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition">
              <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
                Get in Touch
              </h3>
              <p className="text-sm text-gray-600">
                Contact us for bulk orders or inquiries
              </p>
            </a>

            <a
              href="/blogs"
              className="group p-6 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition">
              <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
                Blog & Stories
              </h3>
              <p className="text-sm text-gray-600">
                Learn about organic living and food culture
              </p>
            </a>

            <a
              href="/reviews"
              className="group p-6 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition">
              <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
                Reviews
              </h3>
              <p className="text-sm text-gray-600">
                See what our customers say
              </p>
            </a>

            <a
              href="/contact"
              className="group p-6 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition">
              <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 mb-2">
                Support
              </h3>
              <p className="text-sm text-gray-600">
                Need help? Reach out to our team
              </p>
            </a>
          </nav>
        </section>

        {/* FAQ SECTION */}
        <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-10 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "Who is Ghar Ka Organic?",
                a: "Ghar Ka Organic is an Uttarakhand-based brand dedicated to bringing authentic Himalayan organic food to homes across India. We make handmade pickles, A2 bilona ghee, and raw forest honey using traditional methods.",
              },
              {
                q: "Where does Ghar Ka Organic come from?",
                a: "We are based in Bhimtal, Uttarakhand, in the beautiful Himalayas. Our mission is to preserve the authentic taste and tradition of Pahadi food while supporting local communities.",
              },
              {
                q: "Why is it called Ghar Ka Organic?",
                a: "'Ghar Ka' means 'from home' in Hindi. Our name reflects our commitment to homemade authenticity — food made with the same care and quality as if prepared in your own kitchen.",
              },
              {
                q: "Are Ghar Ka Organic products truly organic?",
                a: "Yes, all our products are made with organic and natural ingredients. We use no artificial preservatives, chemicals, or additives — only pure, traditional Himalayan ingredients.",
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="group border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-amber-500 transition">
                <summary className="font-semibold text-gray-900 flex items-center justify-between">
                  {item.q}
                  <span className="group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed">
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
