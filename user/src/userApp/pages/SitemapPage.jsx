import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

/* ─────────────── SEO BRAND CONTEXT ─────────────── */
const BRAND_NAME = "Ghar Ka Organic";
const BRAND_DESC =
  "Himalayan organic food brand from Uttarakhand offering A2 Desi Ghee, raw forest honey, and traditional pahadi pickles made by local women communities.";
const BASE_URL = "https://gharkaorganic.com";
const CANONICAL = `${BASE_URL}/sitemap`;

/* ─────────────── COLORS ─────────────── */
const T = {
  cream: "#F5EFE0",
  earth: "#7A5C3A",
  terracotta: "#C8563C",
  leaf: "#4A6741",
  ink: "#1C1209",
  muted: "#7A6A55",
  white: "#FDFAF4",
  border: "rgba(122,92,58,0.13)",
};

/* ─────────────── SITEMAP DATA (SEO ENRICHED) ─────────────── */
const sitemapData = [
  {
    title: "Shop Himalayan Organic Products",
    icon: "🫙",
    accent: T.terracotta,
    updated: "2026-04-15",
    links: [
      {
        name: "A2 Desi Ghee from Uttarakhand",
        path: "/collection/ghee",
        desc: "Bilona churned, grass-fed cows",
      },
      {
        name: "Raw Forest Honey (Himalayan)",
        path: "/collection/honey",
        desc: "Unheated, multifloral forest honey",
      },
      {
        name: "Pahadi Achar (Traditional Pickles)",
        path: "/collection/pickles",
        desc: "Sun-cured, no preservatives",
      },
      {
        name: "Homemade Spices & Masala",
        path: "/collection/masala",
        desc: "Stone-ground Himalayan spices",
      },
      {
        name: "Healthy Himalayan Snacks",
        path: "/collection/snacks",
        desc: "Millet & amaranth based",
      },
      {
        name: "Best Sellers Collection",
        path: "/shop/best-sellers",
        desc: "Most loved by customers",
      },
    ],
  },
  {
    title: "Our Himalayan Heritage",
    icon: "🌿",
    accent: T.leaf,
    updated: "2026-04-10",
    links: [
      {
        name: "Our Story – Uttarakhand Women Makers",
        path: "/our-story",
        desc: "How we started in Bhimtal",
      },
      {
        name: "Mission – Vocal for Local India",
        path: "/mission",
        desc: "Supporting rural livelihoods",
      },
      {
        name: "Meet Women Farmers of Himalayas",
        path: "/meet-the-makers",
        desc: "The faces behind your food",
      },
      {
        name: "Blog – Organic Food Benefits",
        path: "/blog",
        desc: "Recipes & health guides",
      },
      {
        name: "Certifications & Lab Reports",
        path: "/certifications",
        desc: "FSSAI, organic certified",
      },
    ],
  },
  {
    title: "Customer Support & Policies",
    icon: "📦",
    accent: T.earth,
    updated: "2026-04-18",
    links: [
      {
        name: "Contact Ghar Ka Organic",
        path: "/contact",
        desc: "WhatsApp, email, call",
      },
      {
        name: "Track Your Order",
        path: "/track-order",
        desc: "Live shipment status",
      },
      {
        name: "Shipping Information India",
        path: "/shipping",
        desc: "3-7 days PAN India",
      },
      {
        name: "Returns & Refund Policy",
        path: "/returns",
        desc: "15-day freshness guarantee",
      },
      {
        name: "FAQs – Organic Products",
        path: "/faqs",
        desc: "Storage, usage, authenticity",
      },
      { name: "Privacy Policy", path: "/privacy", desc: "Data protection" },
      { name: "Terms & Conditions", path: "/terms", desc: "Usage terms" },
    ],
  },
];

/* ─────────────── POPULAR QUICK LINKS ─────────────── */
const quickLinks = [
  { name: "A2 Badri Ghee 500ml", path: "/products/a2-badri-ghee-500ml" },
  { name: "Raw Forest Honey 1kg", path: "/products/raw-forest-honey-1kg" },
  { name: "Lal Mirch Bharua Achar", path: "/products/lal-mirch-bharua-achar" },
  { name: "Pahadi Haldi Powder", path: "/products/pahadi-haldi-powder" },
];

/* ─────────────── MAIN PAGE ─────────────── */
const SitemapPage = () => {
  const totalLinks = useMemo(
    () => sitemapData.reduce((acc, section) => acc + section.links.length, 0),
    [],
  );

  /* ─────────────── JSON-LD SEO ─────────────── */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": CANONICAL,
        name: `${BRAND_NAME} Sitemap - All Pages`,
        description: `Complete sitemap of ${BRAND_NAME}. Find A2 Desi Ghee, Raw Forest Honey, Pahadi Pickles and all Himalayan organic products from Uttarakhand.`,
        url: CANONICAL,
        inLanguage: "en-IN",
        isPartOf: {
          "@type": "WebSite",
          name: BRAND_NAME,
          url: BASE_URL,
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            {
              "@type": "ListItem",
              position: 2,
              name: "Sitemap",
              item: CANONICAL,
            },
          ],
        },
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: BRAND_NAME,
        url: BASE_URL,
        description: BRAND_DESC,
        logo: `${BASE_URL}/logo.png`,
        areaServed: { "@type": "Country", name: "India" },
        knowsAbout: [
          "Organic Food",
          "A2 Desi Ghee",
          "Raw Honey",
          "Himalayan Pickles",
          "Uttarakhand",
        ],
      },
      {
        "@type": "SiteNavigationElement",
        name: "Main Site Navigation",
        url: BASE_URL,
        hasPart: sitemapData.flatMap((section) =>
          section.links.map((link) => ({
            "@type": "WebPage",
            name: link.name,
            url: `${BASE_URL}${link.path}`,
          })),
        ),
      },
    ],
  };

  return (
    <main className="bg-[#F5EFE0] min-h-screen">
      <Helmet>
        <title>Sitemap | All Pages - {BRAND_NAME} Himalayan Organic Food</title>
        <meta
          name="description"
          content={`Complete sitemap of ${BRAND_NAME}. Browse all collections: A2 Desi Ghee, Raw Forest Honey, Pahadi Pickles from Uttarakhand. ${totalLinks}+ pages.`}
        />
        <link rel="canonical" href={CANONICAL} />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large"
        />

        {/* Geo */}
        <meta name="geo.region" content="IN-UT" />
        <meta name="geo.placename" content="Uttarakhand, India" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={BRAND_NAME} />
        <meta property="og:title" content={`Sitemap | ${BRAND_NAME}`} />
        <meta property="og:description" content={BRAND_DESC} />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:locale" content="en_IN" />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* ───── HERO ───── */}
        <header className="text-center mb-12 sm:mb-16">
          <p
            className="text-xs tracking-[0.25em] uppercase mb-4"
            style={{ color: T.terracotta }}>
            {BRAND_NAME}
          </p>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: T.ink, fontFamily: "'Playfair Display', serif" }}>
            Complete Site Navigation
          </h1>

          <p
            className="max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
            style={{ color: T.muted }}>
            Explore all {totalLinks}+ pages of {BRAND_NAME} — including A2 Desi
            Ghee, Raw Forest Honey, and traditional Uttarakhand pahadi pickles
            made by women communities. Find exactly what you need.
          </p>

          {/* Search hint */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="relative">
              <MagnifyingGlassIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: T.muted }}
              />
              <input
                type="search"
                placeholder="Search pages or products..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-offset-0 outline-none transition"
                style={{
                  backgroundColor: T.white,
                  borderColor: T.border,
                  focusRingColor: T.terracotta,
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    window.location.href = `/search?q=${encodeURIComponent(e.currentTarget.value)}`;
                  }
                }}
              />
            </div>
          </div>
        </header>

        {/* ───── QUICK LINKS ───── */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4" style={{ color: T.ink }}>
            Popular Products
          </h2>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-colors hover:shadow-sm"
                style={{
                  backgroundColor: T.white,
                  borderColor: T.border,
                  color: T.earth,
                }}>
                {link.name}
                <ArrowTopRightOnSquareIcon className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </section>

        {/* ───── MAIN GRID ───── */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {sitemapData.map((section, i) => (
            <article
              key={i}
              className="rounded-lg p-6 transition-shadow hover:shadow-md"
              style={{
                backgroundColor: T.white,
                border: `1px solid ${T.border}`,
              }}>
              <div className="flex items-start justify-between mb-4">
                <h2
                  className="text-lg font-semibold flex items-center gap-2"
                  style={{ color: T.ink }}>
                  <span className="text-xl">{section.icon}</span>
                  {section.title}
                </h2>
                <span
                  className="text- px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: T.cream, color: T.muted }}>
                  {section.links.length}
                </span>
              </div>

              <ul className="space-y-3">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.path}
                      className="group block text-sm transition-colors"
                      style={{ color: T.muted }}>
                      <div
                        className="font-medium group-hover:underline"
                        style={{ color: T.earth }}>
                        {link.name}
                      </div>
                      {link.desc && (
                        <div className="text-xs mt-0.5 opacity-80">
                          {link.desc}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              <div
                className="mt-4 pt-4 border-t text-"
                style={{ borderColor: T.border, color: T.muted }}>
                Updated:{" "}
                {new Date(section.updated).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </article>
          ))}
        </section>

        {/* ───── SEO FOOTER ───── */}
        <footer
          className="text-center mt-16 pt-8 border-t text-xs"
          style={{ borderColor: T.border, color: T.muted }}>
          <p className="mb-2">
            <strong style={{ color: T.ink }}>{BRAND_NAME}</strong> – Authentic
            Himalayan Organic Food from Uttarakhand, India.
          </p>
          <p>
            A2 Desi Ghee • Raw Forest Honey • Pahadi Pickles • Himalayan Spices
            • Organic Pulses
          </p>
          <p className="mt-3">
            Serving India since 2026 | FSSAI Licensed | Vocal for Local
          </p>
        </footer>
      </div>
    </main>
  );
};

export default SitemapPage;
