import { useEffect } from "react";
import { Link } from "react-router-dom";

/* ─── SEO Head Helper ─────────────────────────────────────────────────────── */
const SEO = ({ title, description, canonical, schema }) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name, content, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("robots", "index, follow");

    /* Open Graph */
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:url", canonical, "property");
    setMeta(
      "og:image",
      "https://gharkaorganic.com/og-organic-farming.jpg",
      "property",
    );

    /* Twitter Card */
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);

    /* Canonical */
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);

    /* JSON-LD Schema */
    let scriptEl = document.getElementById("page-schema");
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.id = "page-schema";
      scriptEl.type = "application/ld+json";
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schema);

    return () => {
      scriptEl?.remove();
    };
  }, [title, description, canonical, schema]);

  return null;
};

/* ─── Static Data ─────────────────────────────────────────────────────────── */
const PRACTICES = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M20 10 C20 10 12 16 12 22 C12 27 15.5 30 20 30 C24.5 30 28 27 28 22 C28 16 20 10 20 10Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M20 18 L20 30"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "No chemical pesticides",
    desc: "Every crop at our Kumaon farms is grown using traditional neem-based and herbal pest control methods, keeping your food and the soil free from synthetic chemicals.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M10 26 Q15 18 20 22 Q25 26 30 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="10" cy="26" r="2" fill="currentColor" />
        <circle cx="30" cy="14" r="2" fill="currentColor" />
      </svg>
    ),
    title: "Traditional bilona method",
    desc: "Our A2 ghee is made by the ancient hand-churning bilona process — curd is hand-stirred, butter separated, and then slow-cooked over wood fire, just like your dadi used to.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M14 28 L14 16 M20 28 L20 12 M26 28 L26 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M11 28 L29 28"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Mountain spring water",
    desc: "Located at 1,800+ metres in the Kumaon Himalayas, our farms are naturally irrigated by glacial streams — no borewells, no groundwater depletion.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M20 12 L23 17 L29 17 L24.5 21 L26.5 27 L20 23.5 L13.5 27 L15.5 21 L11 17 L17 17 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Zero preservatives",
    desc: "Our pickles, honey, and ghee contain absolutely no artificial preservatives, colours, or additives. Shelf life comes from traditional recipes, not chemistry.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M20 14 C16 14 13 17 13 20 C13 23 16 26 20 26 C24 26 27 23 27 20 C27 17 24 14 20 14Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M20 10 L20 13 M20 27 L20 30 M10 20 L13 20 M27 20 L30 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Sun-dried naturally",
    desc: "Mangoes, lemons, and vegetables for our achars are sun-dried in the clean Himalayan air — no industrial dehydrators, no UV lamps. Just sunlight and patience.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M13 20 C13 15.5 16.1 12 20 12 C23.9 12 27 15.5 27 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M13 20 L13 24 C13 26.2 16.1 28 20 28 C23.9 28 27 26.2 27 24 L27 20"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M17 20 L17 24 M20 20 L20 25 M23 20 L23 24"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Cold-pressed oils",
    desc: "Mustard and coconut oils are extracted in a single slow press at room temperature — no heat, no hexane solvent, retaining all natural nutrients and flavour.",
  },
];

const TIMELINE = [
  {
    year: "1962",
    label: "Family roots",
    text: "Ramswaroop Pant begins farming organic produce in Almora, Uttarakhand using seeds passed down three generations.",
  },
  {
    year: "1991",
    label: "First achar recipe",
    text: "The famous aam ka achar recipe is formalised by the family — a blend of raw mustard oil, himalayan rock salt, and 11 spices. Still unchanged today.",
  },
  {
    year: "2018",
    label: "GharKaOrganic born",
    text: "Grandchildren Arjun and Priya bring the family products online, letting urban India taste authentic pahadi food.",
  },
  {
    year: "2022",
    label: "Direct from farm",
    text: "We eliminate all middlemen. Every product ships directly from our farmhouse in Kumaon within 48 hours of being prepared.",
  },
  {
    year: "2024",
    label: "1 lakh+ families",
    text: "Over one lakh Indian families now enjoy our organic products monthly. Still made in small batches. Still tasted by hand before dispatch.",
  },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Organic Farming in Uttarakhand — How GharKaOrganic Grows Its Products",
  description:
    "Learn about GharKaOrganic's traditional organic farming practices in the Kumaon hills of Uttarakhand — no chemicals, no preservatives, pure pahadi food.",
  image: "https://gharkaorganic.com/og-organic-farming.jpg",
  author: {
    "@type": "Organization",
    name: "GharKaOrganic",
    url: "https://gharkaorganic.com",
  },
  publisher: {
    "@type": "Organization",
    name: "GharKaOrganic",
    logo: {
      "@type": "ImageObject",
      url: "https://gharkaorganic.com/logo.png",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://gharkaorganic.com/pages/organic-farming-uttarakhand",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://gharkaorganic.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Organic Farming in Uttarakhand",
        item: "https://gharkaorganic.com/pages/organic-farming-uttarakhand",
      },
    ],
  },
};

/* ─── Sub-components ──────────────────────────────────────────────────────── */

const Breadcrumb = () => (
  <nav aria-label="Breadcrumb" className="mb-8">
    <ol className="flex items-center gap-2 text-sm text-stone-500 font-['Lato',sans-serif]">
      <li>
        <Link to="/" className="hover:text-amber-700 transition-colors">
          Home
        </Link>
      </li>
      <li className="text-stone-300">›</li>
      <li className="text-stone-700" aria-current="page">
        Organic Farming in Uttarakhand
      </li>
    </ol>
  </nav>
);

const SectionLabel = ({ children }) => (
  <span className="inline-block text-xs tracking-[0.2em] uppercase text-amber-700 font-semibold font-['Lato',sans-serif] mb-3">
    {children}
  </span>
);

/* ─── Page Component ──────────────────────────────────────────────────────── */
const OrganicFarmingPage = () => {
  return (
    <>
      <SEO
        title="Organic Farming in Uttarakhand | Kumaon Hills | GharKaOrganic"
        description="Discover how GharKaOrganic grows organic food in the Kumaon hills of Uttarakhand — traditional bilona ghee, chemical-free pickles, raw pahadi honey. No preservatives. Farm to home."
        canonical="https://gharkaorganic.com/pages/organic-farming-uttarakhand"
        schema={SCHEMA}
      />

      <main className="bg-[#faf8f4] text-stone-800 font-['Lato',sans-serif]">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#1c1a16] text-white">
          {/* Decorative grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Warm amber glow top-right */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-600 opacity-10 blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel>Uttarakhand · Kumaon Hills · 1800m+</SectionLabel>
              <h1 className="font-['Playfair_Display',serif] text-4xl md:text-6xl font-bold leading-[1.1] mb-6 text-white">
                Grown where the
                <br />
                <span className="text-amber-400">Himalayas breathe.</span>
              </h1>
              <p className="text-stone-300 text-lg leading-relaxed mb-8 max-w-md">
                Every jar of achar, every drop of ghee, every spoon of honey
                from GharKaOrganic comes from our family farm in the Kumaon
                hills — no chemicals, no factories, no shortcuts.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/collections/homemade-achar-online"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold px-6 py-3 rounded-full transition-colors text-sm">
                  Shop organic products
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <Link
                  to="/pages/our-story"
                  className="inline-flex items-center gap-2 border border-stone-500 hover:border-stone-300 text-stone-300 hover:text-white px-6 py-3 rounded-full transition-colors text-sm">
                  Our story
                </Link>
              </div>
            </div>

            {/* Stats block */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "60+", label: "Years of farming heritage" },
                { num: "1800m", label: "Altitude — cleaner than the plains" },
                { num: "0%", label: "Chemical pesticides used" },
                { num: "48hr", label: "From kitchen to your door" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="border border-stone-700 rounded-2xl p-5 bg-stone-900/50">
                  <div className="font-['Playfair_Display',serif] text-3xl font-bold text-amber-400 mb-1">
                    {s.num}
                  </div>
                  <div className="text-stone-400 text-sm leading-snug">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Breadcrumb + Intro ────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 pt-14 pb-6">
          <Breadcrumb />
          <div className="max-w-2xl">
            <SectionLabel>Why it matters</SectionLabel>
            <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-bold text-stone-900 leading-tight mb-5">
              Organic farming in Uttarakhand isn't a trend.
              <br />
              It's how we've always farmed.
            </h2>
            <p className="text-stone-600 text-base leading-relaxed">
              Most "organic" brands source from multiple vendors, relabel, and
              ship. At GharKaOrganic, every product — from our aam ka achar to
              our raw pahadi honey — is grown, prepared, and packed at our own
              farm in Almora district. When you buy from us, you're directly
              supporting a farming family, not a supply chain.
            </p>
          </div>
        </section>

        {/* ── Practices Grid ───────────────────────────────────────────── */}
        <section
          className="max-w-6xl mx-auto px-6 py-16"
          aria-labelledby="practices-heading">
          <SectionLabel>Our farming practices</SectionLabel>
          <h2
            id="practices-heading"
            className="font-['Playfair_Display',serif] text-3xl font-bold text-stone-900 mb-10">
            Six things we never compromise on
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRACTICES.map((p) => (
              <article
                key={p.title}
                className="bg-white border border-stone-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="text-amber-600 mb-4">{p.icon}</div>
                <h3 className="font-['Playfair_Display',serif] text-lg font-bold text-stone-900 mb-2 capitalize">
                  {p.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {p.desc}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Location Feature ─────────────────────────────────────────── */}
        <section className="bg-amber-50 border-y border-amber-100 py-16">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel>Where we are</SectionLabel>
              <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-bold text-stone-900 mb-5 leading-tight">
                Almora district,
                <br />
                Kumaon, Uttarakhand
              </h2>
              <p className="text-stone-600 leading-relaxed mb-6">
                Situated at over 1,800 metres above sea level in the Kumaon
                hills, our farm benefits from crisp mountain air, mineral-rich
                glacial water, and naturally cold winters that eliminate most
                pests without any spraying. The same geography that produces the
                world's finest Himalayan honey is where we grow your food.
              </p>
              <ul className="space-y-3">
                {[
                  "Almora district, Uttarakhand — 1,800m altitude",
                  "Natural glacier stream irrigation — no borewells",
                  "Average temperature 10°C lower than plains",
                  "Rich in Himalayan minerals and soil biodiversity",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-stone-700">
                    <span className="mt-1 w-4 h-4 rounded-full bg-amber-500 flex-shrink-0 flex items-center justify-center">
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        viewBox="0 0 10 10">
                        <path
                          d="M2 5l2 2 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Decorative map-like block */}
            <div className="relative">
              <div className="bg-amber-100 rounded-3xl p-8 aspect-square max-w-sm mx-auto flex flex-col items-center justify-center text-center">
                <svg
                  viewBox="0 0 80 80"
                  fill="none"
                  className="w-16 h-16 text-amber-600 mb-4">
                  <path
                    d="M40 8 C24 8 12 20 12 35 C12 54 40 72 40 72 C40 72 68 54 68 35 C68 20 56 8 40 8Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="34"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="40" cy="34" r="3" fill="currentColor" />
                </svg>
                <p className="font-['Playfair_Display',serif] text-2xl font-bold text-stone-800 mb-1">
                  Almora
                </p>
                <p className="text-stone-500 text-sm">Kumaon, Uttarakhand</p>
                <p className="text-amber-700 text-xs mt-3 font-semibold tracking-wide uppercase">
                  1,800m above sea level
                </p>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-white border border-amber-200 rounded-xl px-4 py-2 shadow-sm">
                <p className="text-xs text-stone-500">Established</p>
                <p className="font-['Playfair_Display',serif] text-xl font-bold text-stone-800">
                  1962
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Timeline ─────────────────────────────────────────────────── */}
        <section
          className="max-w-4xl mx-auto px-6 py-20"
          aria-labelledby="timeline-heading">
          <div className="text-center mb-14">
            <SectionLabel>Our journey</SectionLabel>
            <h2
              id="timeline-heading"
              className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-bold text-stone-900">
              Six decades of growing clean food
            </h2>
          </div>

          <ol className="relative border-l border-amber-200 space-y-10 ml-4">
            {TIMELINE.map((t, i) => (
              <li key={t.year} className="ml-8">
                <span className="absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white text-xs font-bold ring-4 ring-amber-50">
                  {i + 1}
                </span>
                <div className="bg-white border border-stone-100 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-['Playfair_Display',serif] text-xl font-bold text-amber-600">
                      {t.year}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      {t.label}
                    </span>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {t.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Products CTA ─────────────────────────────────────────────── */}
        <section className="bg-[#1c1a16] text-white py-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-amber-600 opacity-10 blur-3xl pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <SectionLabel>Shop our farm</SectionLabel>
            <h2 className="font-['Playfair_Display',serif] text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
              Taste the difference
              <br />
              <span className="text-amber-400">Uttarakhand makes.</span>
            </h2>
            <p className="text-stone-400 text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Handmade achars, bilona ghee, raw forest honey, and cold-pressed
              oils — all from our Kumaon farm to your kitchen. No preservatives,
              no compromise.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/collections/homemade-achar-online"
                className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold px-8 py-3.5 rounded-full transition-colors text-sm">
                Shop homemade achar
              </Link>
              <Link
                to="/collections/a2-desi-cow-ghee-kumaon"
                className="border border-stone-600 hover:border-stone-400 text-stone-300 hover:text-white px-8 py-3.5 rounded-full transition-colors text-sm">
                Shop A2 desi ghee
              </Link>
              <Link
                to="/collections/raw-organic-honey-uttarakhand"
                className="border border-stone-600 hover:border-stone-400 text-stone-300 hover:text-white px-8 py-3.5 rounded-full transition-colors text-sm">
                Shop pahadi honey
              </Link>
            </div>
          </div>
        </section>

        {/* ── Internal link cluster (SEO) ──────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-14">
          <SectionLabel>Explore more</SectionLabel>
          <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-stone-900 mb-8">
            Related pages
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                to: "/pages/our-story",
                label: "Our story",
                desc: "Meet the farming family behind GharKaOrganic",
              },
              {
                to: "/blogs/health/benefits-of-a2-bilona-ghee",
                label: "Benefits of A2 ghee",
                desc: "Why bilona method matters for your health",
              },
              {
                to: "/blogs/recipes/aam-ka-achar-recipe-ghar-par",
                label: "Aam ka achar recipe",
                desc: "Make traditional mango pickle at home",
              },
              {
                to: "/pages/faq",
                label: "FAQs",
                desc: "Common questions about our products & delivery",
              },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="group block bg-white border border-stone-100 hover:border-amber-200 rounded-2xl p-5 transition-colors">
                <p className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors text-sm mb-1">
                  {l.label}
                </p>
                <p className="text-stone-400 text-xs leading-snug">{l.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default OrganicFarmingPage;
