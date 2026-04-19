import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ─── Brand tokens (consistent with OurStoryPage) ─── */
const T = {
  cream: "#F5EFE0",
  parchment: "#EDE3CC",
  earth: "#7A5C3A",
  terracotta: "#C8563C",
  terracottaMuted: "rgba(200,86,60,0.12)",
  leaf: "#4A6741",
  leafMuted: "rgba(74,103,65,0.10)",
  ink: "#1C1209",
  muted: "#7A6A55",
  white: "#FDFAF4",
  border: "rgba(122,92,58,0.13)",
};

const sitemapData = [
  {
    title: "Shop Categories",
    icon: "🫙",
    accent: T.terracotta,
    links: [
      { name: "All Products", path: "/collections/all" },
      { name: "Homemade Pickles", path: "/collection/homemade-pickles" },
      { name: "Mustard Oil Pickles", path: "/collection/mustard-oil-pickles" },
      { name: "Spicy Pickles", path: "/collection/spicy-pickles" },
      { name: "Tangy Pickles", path: "/collection/tangy-pickles" },
      { name: "Sweet Pickles", path: "/collection/sweet-pickles" },
      { name: "Mango Pickles", path: "/collection/mango-pickles" },
      { name: "Oil-Free Pickles", path: "/collection/oil-free" },
      { name: "Hand-pounded Masala", path: "/collection/masala" },
      { name: "A2 Desi Ghee", path: "/collection/ghee" },
      { name: "Healthy Snacks", path: "/collection/snacks" },
    ],
  },
  {
    title: "About Ghar Ka Organic",
    icon: "🌿",
    accent: T.leaf,
    links: [
      { name: "Our Story", path: "/our-story" },
      { name: "Our Mission", path: "/mission" },
      { name: "Meet the Makers", path: "/meet-the-makers" },
      { name: "Blogs & Recipes", path: "/blog" },
      { name: "Press & Media", path: "/press" },
      { name: "Careers", path: "/careers" },
    ],
  },
  {
    title: "Customer Service",
    icon: "📦",
    accent: T.earth,
    links: [
      { name: "Contact Us", path: "/contact" },
      { name: "Track Your Order", path: "/track-order" },
      { name: "Shipping & Delivery", path: "/shipping" },
      { name: "Cancellation & Returns", path: "/cancellation" },
      { name: "FAQs", path: "/faqs" },
      { name: "Bulk Orders / Corporate", path: "/bulk-orders" },
    ],
  },
  {
    title: "Legal & Policies",
    icon: "📋",
    accent: T.muted,
    links: [
      { name: "Terms and Conditions", path: "/terms" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Cookie Policy", path: "/cookies" },
      { name: "Disclaimer", path: "/disclaimer" },
    ],
  },
  {
    title: "My Account",
    icon: "👤",
    accent: T.terracotta,
    links: [
      { name: "My Account", path: "/user/profile" },
      { name: "Order History", path: "/user/orders" },
      { name: "Shopping Bag", path: "/checkout/cart" },
      { name: "Login / Register", path: "/auth/login" },
    ],
  },
];

/* ─── Tiny intersection reveal hook ─── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── Section card ─── */
const SectionCard = ({ section, globalIndex }) => {
  const [ref, visible] = useReveal(0.08);
  const [hovered, setHovered] = useState(null);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${globalIndex * 60}ms, transform 0.6s ease ${globalIndex * 60}ms`,
        background: T.white,
        borderRadius: "3px",
        border: `1px solid ${T.border}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
      {/* Card header */}
      <div
        style={{
          padding: "1.6rem 1.8rem 1.3rem",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          gap: "0.85rem",
          background: T.cream,
        }}>
        <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>
          {section.icon}
        </span>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.15rem",
            fontWeight: 700,
            color: T.ink,
            margin: 0,
            lineHeight: 1.2,
          }}>
          {section.title}
        </h2>
        {/* count pill */}
        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: section.accent,
            background: `${section.accent}14`,
            padding: "0.22rem 0.6rem",
            borderRadius: "100px",
            flexShrink: 0,
          }}>
          {section.links.length}
        </span>
      </div>

      {/* Links */}
      <ul style={{ listStyle: "none", margin: 0, padding: "1rem 0", flex: 1 }}>
        {section.links.map((link, i) => (
          <li key={i}>
            <Link
              to={link.path}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.55rem 1.8rem",
                fontSize: "0.88rem",
                color: hovered === i ? section.accent : T.muted,
                textDecoration: "none",
                fontFamily: "'Lato', sans-serif",
                fontWeight: hovered === i ? 400 : 300,
                background:
                  hovered === i ? `${section.accent}08` : "transparent",
                transition: "all 0.18s ease",
                borderLeft:
                  hovered === i
                    ? `2px solid ${section.accent}`
                    : "2px solid transparent",
                letterSpacing: "0.01em",
              }}>
              {/* Arrow */}
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                style={{
                  opacity: hovered === i ? 1 : 0,
                  transform:
                    hovered === i ? "translateX(0)" : "translateX(-4px)",
                  transition: "all 0.18s ease",
                  flexShrink: 0,
                }}>
                <path
                  d="M2 5h6M5 2l3 3-3 3"
                  stroke={section.accent}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ═══════════════════════════════════
   MAIN PAGE
═══════════════════════════════════ */
const SitemapPage = () => {
  const [headerRef, headerVisible] = useReveal(0.05);
  const totalLinks = sitemapData.reduce((s, c) => s + c.links.length, 0);

  return (
    <main
      style={{
        background: T.cream,
        minHeight: "100vh",
        fontFamily: "'Lato', sans-serif",
      }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        a { text-decoration: none; }

        .sitemap-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.4rem;
        }

        /* Large card spans 2 cols */
        .sitemap-grid > :first-child {
          grid-row: span 1;
        }

        @media (max-width: 1024px) {
          .sitemap-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .sitemap-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "5rem 1.5rem 6rem",
        }}>
        {/* ── Header ── */}
        <div
          ref={headerRef}
          style={{
            textAlign: "center",
            marginBottom: "4rem",
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}>
          {/* breadcrumb */}
          <div
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: T.terracotta,
              marginBottom: "1.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
            }}>
            <span
              style={{
                width: 24,
                height: 1,
                background: T.terracotta,
                display: "inline-block",
              }}
            />
            Ghar Ka Organic
            <span
              style={{
                width: 24,
                height: 1,
                background: T.terracotta,
                display: "inline-block",
              }}
            />
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontWeight: 700,
              color: T.ink,
              lineHeight: 1.1,
              margin: "0 0 1.2rem",
            }}>
            Site Directory
          </h1>

          <p
            style={{
              fontSize: "1rem",
              color: T.muted,
              fontWeight: 300,
              maxWidth: 440,
              margin: "0 auto 2rem",
              lineHeight: 1.75,
            }}>
            Everything on our site, in one place. Browse {totalLinks} pages
            across {sitemapData.length} categories.
          </p>

          {/* stats strip */}
          <div
            style={{
              display: "inline-flex",
              gap: 0,
              border: `1px solid ${T.border}`,
              borderRadius: 3,
              overflow: "hidden",
              background: T.white,
            }}>
            {[
              { label: "Categories", value: sitemapData.length },
              { label: "Total Pages", value: totalLinks },
              { label: "Est. Read", value: "< 1 min" },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "0.8rem 1.6rem",
                  borderRight: i < 2 ? `1px solid ${T.border}` : "none",
                  textAlign: "center",
                }}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: T.ink,
                    lineHeight: 1,
                    marginBottom: 2,
                  }}>
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.12em",
                    color: T.muted,
                    textTransform: "uppercase",
                  }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="sitemap-grid">
          {sitemapData.map((section, i) => (
            <SectionCard key={i} section={section} globalIndex={i} />
          ))}
        </div>

        {/* ── Footer note ── */}
        <p
          style={{
            textAlign: "center",
            marginTop: "3.5rem",
            fontSize: "0.82rem",
            color: T.muted,
            fontWeight: 300,
            opacity: 0.7,
          }}>
          Can't find what you're looking for?{" "}
          <Link
            to="/contact"
            style={{
              color: T.terracotta,
              borderBottom: `1px solid ${T.terracotta}44`,
            }}>
            Contact us
          </Link>{" "}
          and we'll help.
        </p>
      </div>
    </main>
  );
};

export default SitemapPage;
