import React, { useEffect, useRef } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

/* ─── Design tokens ─── */
const C = {
  cream: "#F5EFE0",
  parchment: "#EDE3CC",
  earth: "#7A5C3A",
  terracotta: "#C8563C",
  terracottaLight: "#E8724F",
  leaf: "#4A6741",
  leafLight: "#6B8F64",
  ink: "#1C1209",
  muted: "#7A6A55",
  white: "#FDFAF4",
};

/* ─── Tiny hook: intersection reveal ─── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Reusable reveal wrapper ─── */
const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal-box ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

/* ─── Decorative SVG leaf ─── */
const Leaf = ({ style = {} }) => (
  <svg
    viewBox="0 0 60 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: 60, opacity: 0.18, ...style }}>
    <path
      d="M30 75 C30 75 5 50 5 30 C5 10 55 10 55 30 C55 50 30 75 30 75Z"
      fill={C.leaf}
    />
    <line x1="30" y1="75" x2="30" y2="15" stroke={C.leaf} strokeWidth="1.5" />
    <line x1="30" y1="50" x2="15" y2="38" stroke={C.leaf} strokeWidth="1" />
    <line x1="30" y1="40" x2="45" y2="30" stroke={C.leaf} strokeWidth="1" />
  </svg>
);

/* ─── Decorative dot grid ─── */
const DotGrid = ({ style = {} }) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: 80, opacity: 0.12, ...style }}>
    {[...Array(5)].map((_, r) =>
      [...Array(5)].map((_, c) => (
        <circle
          key={`${r}-${c}`}
          cx={8 + c * 16}
          cy={8 + r * 16}
          r="2.5"
          fill={C.earth}
        />
      )),
    )}
  </svg>
);

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
const OurStoryPage = () => {
  const products = [
    {
      icon: "🫙",
      name: "Homemade Pickles",
      desc: "Sun-dried & hand-ground masalas",
    },
    {
      icon: "🧈",
      name: "A2 Bilona Ghee",
      desc: "Slow-churned from Desi cow milk",
    },
    {
      icon: "🍯",
      name: "Raw Organic Honey",
      desc: "Cold-extracted, unprocessed",
    },
    {
      icon: "🌿",
      name: "Cold Pressed Oils",
      desc: "Wood-pressed, nutrient-rich",
    },
  ];

  const process = [
    {
      step: "01",
      title: "Small Batch",
      body: "Never mass-produced. Every batch is crafted in small quantities so quality is never compromised.",
    },
    {
      step: "02",
      title: "Handmade Recipes",
      body: "Recipes passed down over generations. Made by hands that know the difference.",
    },
    {
      step: "03",
      title: "Natural Fermentation",
      body: "No shortcuts. We let nature do its work — slow, traditional, and pure.",
    },
  ];

  return (
    <HelmetProvider>
      <>
        <Helmet>
          <title>Our Story | GharKaOrganic — Homemade Organic Products</title>
          <meta
            name="description"
            content="Discover the story behind GharKaOrganic. We bring you homemade pickles, A2 bilona ghee, raw honey, and organic products from Uttarakhand."
          />
          <meta
            name="keywords"
            content="GharKaOrganic, homemade pickle India, organic products Uttarakhand, A2 bilona ghee, raw honey India"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap"
            rel="stylesheet"
          />
        </Helmet>

        {/* ── Global styles ── */}
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          body { background: ${C.cream}; }

          .gko-page {
            font-family: 'Lato', sans-serif;
            color: ${C.ink};
            background: ${C.cream};
            overflow-x: hidden;
          }

          /* Reveal animation */
          .reveal-box {
            opacity: 0;
            transform: translateY(32px);
            transition: opacity 0.75s ease, transform 0.75s ease;
          }
          .reveal-box.revealed {
            opacity: 1;
            transform: translateY(0);
          }

          /* ── HERO ── */
          .hero {
            min-height: 92vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 6rem 2rem 4rem;
            position: relative;
            overflow: hidden;
          }
          .hero::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
              radial-gradient(ellipse 70% 60% at 20% 80%, rgba(122,92,58,0.10) 0%, transparent 70%),
              radial-gradient(ellipse 50% 50% at 80% 20%, rgba(74,103,65,0.08) 0%, transparent 60%);
          }
          .hero-tag {
            font-family: 'Lato', sans-serif;
            font-size: 0.75rem;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: ${C.terracotta};
            background: rgba(200,86,60,0.08);
            border: 1px solid rgba(200,86,60,0.25);
            padding: 0.35rem 1.1rem;
            border-radius: 100px;
            margin-bottom: 1.6rem;
            display: inline-block;
          }
          .hero h1 {
            font-family: 'Playfair Display', serif;
            font-size: clamp(2.4rem, 6vw, 5rem);
            font-weight: 700;
            line-height: 1.12;
            color: ${C.ink};
            max-width: 800px;
            margin-bottom: 1.4rem;
          }
          .hero h1 em {
            color: ${C.terracotta};
            font-style: italic;
          }
          .hero-sub {
            font-size: 1.1rem;
            color: ${C.muted};
            max-width: 520px;
            line-height: 1.7;
            font-weight: 300;
            margin-bottom: 2.4rem;
          }
          .hero-divider {
            display: flex;
            align-items: center;
            gap: 1rem;
            color: ${C.muted};
            font-size: 0.8rem;
            letter-spacing: 0.15em;
          }
          .hero-divider span { width: 60px; height: 1px; background: ${C.muted}; opacity: 0.4; }

          /* ── STORY ── */
          .story {
            max-width: 1100px;
            margin: 0 auto;
            padding: 5rem 2rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 5rem;
            align-items: center;
          }
          @media (max-width: 768px) {
            .story { grid-template-columns: 1fr; gap: 2.5rem; }
          }
          .story-img-wrap {
            position: relative;
          }
          .story-img-wrap img {
            width: 100%;
            border-radius: 4px;
            display: block;
            object-fit: cover;
            aspect-ratio: 4/5;
          }
          .story-img-badge {
            position: absolute;
            bottom: -1.4rem;
            right: -1.4rem;
            background: ${C.terracotta};
            color: ${C.white};
            font-family: 'Playfair Display', serif;
            font-style: italic;
            padding: 1.2rem 1.5rem;
            border-radius: 4px;
            font-size: 1rem;
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
            line-height: 1.4;
          }
          .section-label {
            font-size: 0.72rem;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: ${C.terracotta};
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.7rem;
          }
          .section-label::before {
            content: '';
            width: 28px;
            height: 1px;
            background: ${C.terracotta};
          }
          .story-text h2 {
            font-family: 'Playfair Display', serif;
            font-size: clamp(1.8rem, 3vw, 2.8rem);
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 1.4rem;
          }
          .story-text p {
            font-size: 1rem;
            color: ${C.muted};
            line-height: 1.85;
            margin-bottom: 1rem;
            font-weight: 300;
          }

          /* ── WHY ── */
          .why {
            background: ${C.parchment};
            padding: 5rem 2rem;
            position: relative;
            overflow: hidden;
          }
          .why-inner {
            max-width: 1100px;
            margin: 0 auto;
          }
          .why-heading {
            font-family: 'Playfair Display', serif;
            font-size: clamp(1.8rem, 3vw, 2.6rem);
            margin-bottom: 0.8rem;
          }
          .why-sub {
            color: ${C.muted};
            font-size: 1rem;
            font-weight: 300;
            line-height: 1.7;
            max-width: 560px;
            margin-bottom: 3rem;
          }
          .why-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
          }
          .why-card {
            background: ${C.white};
            border-radius: 4px;
            padding: 2rem;
            border-left: 3px solid ${C.terracotta};
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }
          .why-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
          .why-card h3 {
            font-family: 'Playfair Display', serif;
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
          }
          .why-card p { color: ${C.muted}; font-size: 0.92rem; line-height: 1.6; font-weight: 300; }

          /* ── PRODUCTS ── */
          .products {
            max-width: 1100px;
            margin: 0 auto;
            padding: 5rem 2rem;
          }
          .products-header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            margin-bottom: 3rem;
            flex-wrap: wrap;
            gap: 1rem;
          }
          .products-header h2 {
            font-family: 'Playfair Display', serif;
            font-size: clamp(1.8rem, 3vw, 2.6rem);
          }
          .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
            gap: 1.4rem;
          }
          .product-card {
            background: ${C.white};
            border-radius: 4px;
            padding: 2.2rem 1.5rem;
            text-align: center;
            border: 1px solid ${C.parchment};
            transition: transform 0.25s, box-shadow 0.25s;
            cursor: default;
          }
          .product-card:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(0,0,0,0.09); }
          .product-icon { font-size: 2.5rem; margin-bottom: 1rem; display: block; }
          .product-card h3 {
            font-family: 'Playfair Display', serif;
            font-size: 1.05rem;
            margin-bottom: 0.4rem;
          }
          .product-card p { color: ${C.muted}; font-size: 0.85rem; font-weight: 300; }

          /* ── PROCESS ── */
          .process {
            background: ${C.ink};
            color: ${C.cream};
            padding: 5rem 2rem;
            position: relative;
            overflow: hidden;
          }
          .process::before {
            content: '';
            position: absolute;
            top: -60px; right: -60px;
            width: 280px; height: 280px;
            border-radius: 50%;
            border: 1px solid rgba(245,239,224,0.06);
          }
          .process-inner { max-width: 1100px; margin: 0 auto; }
          .process-inner h2 {
            font-family: 'Playfair Display', serif;
            font-size: clamp(1.8rem, 3vw, 2.6rem);
            margin-bottom: 0.8rem;
          }
          .process-inner > p {
            color: rgba(245,239,224,0.55);
            font-size: 1rem;
            font-weight: 300;
            max-width: 520px;
            margin-bottom: 3.5rem;
            line-height: 1.7;
          }
          .process-steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 2rem;
          }
          .process-step {
            border-top: 1px solid rgba(245,239,224,0.12);
            padding-top: 1.8rem;
          }
          .step-num {
            font-family: 'Playfair Display', serif;
            font-size: 3rem;
            color: ${C.terracotta};
            opacity: 0.5;
            line-height: 1;
            margin-bottom: 1rem;
          }
          .process-step h3 {
            font-family: 'Playfair Display', serif;
            font-size: 1.25rem;
            margin-bottom: 0.6rem;
          }
          .process-step p { color: rgba(245,239,224,0.5); font-size: 0.9rem; line-height: 1.7; font-weight: 300; }

          /* ── PROMISE ── */
          .promise {
            max-width: 1100px;
            margin: 0 auto;
            padding: 5rem 2rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
          }
          @media (max-width: 768px) { .promise { grid-template-columns: 1fr; gap: 2rem; } }
          .promise h2 {
            font-family: 'Playfair Display', serif;
            font-size: clamp(1.8rem, 3vw, 2.6rem);
            margin-bottom: 0.8rem;
            grid-column: 1 / -1;
          }
          .promise-list { list-style: none; }
          .promise-list li {
            display: flex;
            align-items: center;
            gap: 0.9rem;
            padding: 0.9rem 0;
            border-bottom: 1px solid ${C.parchment};
            font-size: 0.98rem;
            color: ${C.muted};
            font-weight: 300;
          }
          .promise-list li .icon-no {
            width: 28px; height: 28px;
            border-radius: 50%;
            background: rgba(200,86,60,0.1);
            color: ${C.terracotta};
            display: flex; align-items: center; justify-content: center;
            font-size: 0.8rem; flex-shrink: 0;
          }
          .promise-list li .icon-yes {
            width: 28px; height: 28px;
            border-radius: 50%;
            background: rgba(74,103,65,0.1);
            color: ${C.leaf};
            display: flex; align-items: center; justify-content: center;
            font-size: 0.8rem; flex-shrink: 0;
          }

          /* ── CTA ── */
          .cta {
            background: ${C.terracotta};
            padding: 5rem 2rem;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .cta::before {
            content: '';
            position: absolute;
            bottom: -80px; left: -80px;
            width: 300px; height: 300px;
            border-radius: 50%;
            background: rgba(255,255,255,0.05);
          }
          .cta::after {
            content: '';
            position: absolute;
            top: -60px; right: -60px;
            width: 220px; height: 220px;
            border-radius: 50%;
            background: rgba(0,0,0,0.06);
          }
          .cta h2 {
            font-family: 'Playfair Display', serif;
            font-size: clamp(2rem, 4vw, 3.2rem);
            color: ${C.white};
            margin-bottom: 0.8rem;
            position: relative; z-index: 1;
          }
          .cta p {
            color: rgba(253,250,244,0.75);
            font-size: 1rem;
            font-weight: 300;
            margin-bottom: 2.2rem;
            position: relative; z-index: 1;
          }
          .cta a {
            display: inline-block;
            background: ${C.white};
            color: ${C.terracotta};
            padding: 0.9rem 2.4rem;
            border-radius: 2px;
            font-weight: 700;
            font-size: 0.9rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
            position: relative; z-index: 1;
          }
          .cta a:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.2); }

          /* ── floating decorations ── */
          .deco {
            position: absolute;
            pointer-events: none;
          }
        `}</style>

        <div className="gko-page">
          {/* ─── HERO ─── */}
          <section className="hero">
            <DotGrid style={{ position: "absolute", top: 60, left: 40 }} />
            <Leaf
              style={{
                position: "absolute",
                top: 80,
                right: 80,
                width: 90,
                transform: "rotate(25deg)",
              }}
            />
            <Leaf
              style={{
                position: "absolute",
                bottom: 100,
                left: 60,
                width: 70,
                transform: "rotate(-15deg) scaleX(-1)",
              }}
            />

            <div className="hero-tag">Est. in Uttarakhand</div>
            <h1>
              Food made the way <em>Dadi</em> made it.
            </h1>
            <p className="hero-sub">
              GharKaOrganic brings you honest, homemade food — pickles, ghee,
              honey &amp; oils — crafted without compromise from the hills of
              Uttarakhand.
            </p>
            <div className="hero-divider">
              <span />
              No chemicals · No shortcuts · No compromise
              <span />
            </div>
          </section>

          {/* ─── STORY ─── */}
          <section style={{ background: C.cream }}>
            <div className="story">
              <Reveal>
                <div className="story-img-wrap">
                  <img
                    src="/images/organic-farm.jpg"
                    alt="Organic farming in Uttarakhand"
                    onError={(e) => {
                      e.target.style.background = `linear-gradient(135deg, ${C.parchment} 0%, ${C.earth}22 100%)`;
                      e.target.style.minHeight = "400px";
                      e.target.src = "";
                    }}
                  />
                  <div className="story-img-badge">
                    Rooted in
                    <br />
                    Tradition
                  </div>
                </div>
              </Reveal>

              <Reveal delay={150}>
                <div className="story-text">
                  <div className="section-label">Our Origin</div>
                  <h2>Born in the hills, made with heart.</h2>
                  <p>
                    GharKaOrganic was born in the hills of Uttarakhand, where
                    food is still made with patience, care, and purity. We
                    follow traditional recipes passed down through generations —
                    recipes that were never written down, only lived.
                  </p>
                  <p>
                    Every product reflects the authenticity of homemade
                    preparation. No shortcuts. No chemicals. Just real food that
                    tastes exactly the way it should.
                  </p>
                  <p>
                    We started because we missed the taste of home — and we knew
                    others did too.
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ─── WHY ─── */}
          <section className="why">
            <DotGrid style={{ position: "absolute", bottom: 40, right: 60 }} />
            <div className="why-inner">
              <Reveal>
                <div className="section-label">Why We Started</div>
                <h2 className="why-heading">
                  The world forgot what real food tastes like.
                </h2>
                <p className="why-sub">
                  Most food today is processed, packaged, and stripped of its
                  soul. We set out to change that — one jar at a time.
                </p>
              </Reveal>
              <div className="why-cards">
                {[
                  {
                    title: "Real Taste",
                    body: "Experience food that tastes exactly like something made at home — because it was.",
                  },
                  {
                    title: "Pure Ingredients",
                    body: "No preservatives, no chemicals, no additives. What you see on the label is all that's in it.",
                  },
                  {
                    title: "Honest Sourcing",
                    body: "We work directly with small farmers in Uttarakhand who share our commitment to quality.",
                  },
                  {
                    title: "Fair to Makers",
                    body: "Every artisan and farmer we work with is paid fairly. Good food comes from happy hands.",
                  },
                ].map((c, i) => (
                  <Reveal key={i} delay={i * 80}>
                    <div className="why-card">
                      <h3>{c.title}</h3>
                      <p>{c.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ─── PRODUCTS ─── */}
          <section style={{ background: C.cream }}>
            <div className="products">
              <Reveal>
                <div className="products-header">
                  <div>
                    <div className="section-label">What We Offer</div>
                    <h2>Crafted with care, delivered to your door.</h2>
                  </div>
                </div>
              </Reveal>
              <div className="product-grid">
                {products.map((p, i) => (
                  <Reveal key={i} delay={i * 90}>
                    <div className="product-card">
                      <span className="product-icon">{p.icon}</span>
                      <h3>{p.name}</h3>
                      <p>{p.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ─── PROCESS ─── */}
          <section className="process">
            <div className="process-inner">
              <Reveal>
                <div
                  className="section-label"
                  style={{ color: C.terracottaLight }}>
                  Our Process
                </div>
                <h2>Slow is the only way we know.</h2>
                <p>
                  We believe in traditional preparation methods that maintain
                  every bit of taste and nutrition. No machines that cut
                  corners.
                </p>
              </Reveal>
              <div className="process-steps">
                {process.map((s, i) => (
                  <Reveal key={i} delay={i * 100}>
                    <div className="process-step">
                      <div className="step-num">{s.step}</div>
                      <h3>{s.title}</h3>
                      <p>{s.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ─── PROMISE ─── */}
          <section style={{ background: C.cream }}>
            <div className="promise">
              <Reveal>
                <h2>Our Promise to You</h2>
              </Reveal>

              <Reveal delay={80}>
                <ul className="promise-list">
                  {[
                    "No preservatives",
                    "No artificial colours",
                    "No chemicals",
                  ].map((t, i) => (
                    <li key={i}>
                      <span className="icon-no">✕</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={160}>
                <ul className="promise-list">
                  {[
                    "100% natural ingredients",
                    "Traditional methods always",
                    "Honest, transparent quality",
                  ].map((t, i) => (
                    <li key={i}>
                      <span className="icon-yes">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>

          {/* ─── CTA ─── */}
          <section className="cta">
            <Reveal>
              <h2>Taste the difference of real food.</h2>
              <p>
                Join thousands of families who trust GharKaOrganic every day.
              </p>
              <a href="/collections/all">Shop All Products</a>
            </Reveal>
          </section>
        </div>
      </>
    </HelmetProvider>
  );
};

export default OurStoryPage;
