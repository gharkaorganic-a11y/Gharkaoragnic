import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Calendar, MessageCircle, ArrowRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   BLOG DATA
───────────────────────────────────────────────────────────── */
export const allBlogs = [
  {
    title: "Why Budget 2026 Means Better Organic Food Access for Indian Homes",
    slug: "budget-2026-organic-food-access",
    image: "/images/blog-budget-organic.jpg",
    category: "Impact",
    excerpt:
      "Budget 2026 announced major support for organic farming and FPOs. Here's what it means for your monthly grocery bill and the quality of ghee, honey, and pickles you get from brands like Ghar Ka Organic.",
    date: "2026-02-23",
    comments: 4,
    featured: true,
    seoTitle: "Budget 2026 & Organic Food Prices | Ghar Ka Organic",
    seoDescription:
      "Learn how Budget 2026 supports organic farming, reduces costs of A2 ghee, raw honey, and homemade pickles.",
    content: `<p>Union Budget 2026 finally put organic food in the spotlight...</p>`,
  },
  {
    title: "5 Eating Mistakes That Ruin Even the Healthiest Diet",
    slug: "eating-mistakes-healthy-diet",
    image: "/images/blog-eating-mistakes.jpg",
    category: "Health",
    excerpt:
      "You switched to A2 ghee and raw honey from Ghar Ka Organic, but still feel bloated? These 5 Ayurvedic mistakes cancel out even the cleanest foods.",
    date: "2026-01-31",
    comments: 12,
    seoTitle: "5 Diet Mistakes | Ayurveda Tips | Ghar Ka Organic",
    seoDescription:
      "Even with A2 ghee and raw honey, these 5 eating mistakes cause gas, weight gain, and low energy.",
    content: `<p>You switched to A2 ghee. You eat millets...</p>`,
  },
  {
    title: "A2 Buffalo Ghee vs Cow Ghee: Which Builds Better Muscle?",
    slug: "a2-buffalo-ghee-muscle",
    image: "/images/blog-buffalo-ghee.jpg",
    category: "Health",
    excerpt:
      "Pahadi wrestlers swear by buffalo bilona ghee. We tested A2 Buffalo Ghee vs regular gym supplements for 90 days. Results inside.",
    date: "2026-01-29",
    comments: 8,
    seoTitle: "A2 Buffalo Ghee for Muscle Gain | Ghar Ka Organic",
    seoDescription:
      "Does A2 buffalo ghee really help build muscle? We break down the science, Ayurveda, and lab tests.",
    content: `<p>Pahadi wrestlers have known this for centuries...</p>`,
  },
  {
    title: "Lohri to Pongal: Pickle Pairings for Every Harvest Festival",
    slug: "lohri-to-pongal-2026",
    image: "/images/blog-lohri-pongal.jpg",
    category: "Culture",
    excerpt:
      "From Sarson ka Saag with Garlic Pickle in Punjab to Pongal with Mango Pickle in Tamil Nadu — mapping India's harvest feasts.",
    date: "2026-01-09",
    comments: 15,
    seoTitle: "Harvest Festival Food & Pickles | Ghar Ka Organic",
    seoDescription:
      "Discover which Ghar Ka Organic pickle pairs best with Lohri, Makar Sankranti, and Pongal feasts.",
    content: `<p>Every harvest festival in India tells a food story...</p>`,
  },
  {
    title: "How to Make Aam Ka Achar Like Ghar Ka Organic",
    slug: "aam-ka-achar-recipe",
    image: "/images/blog-aam-achaar.jpg",
    category: "Recipes",
    excerpt:
      "We're sharing our exact Uttar Pradesh recipe. No vinegar, no preservatives. Just sun, salt, and the same mustard oil we use in our jars.",
    date: "2026-01-05",
    comments: 23,
    seoTitle: "Traditional Aam Ka Achar Recipe | Ghar Ka Organic",
    seoDescription:
      "Learn the authentic Uttar Pradesh mango pickle recipe used by Ghar Ka Organic.",
    content: `<p>This recipe has been in our family for three generations...</p>`,
  },
];

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const ACCENT = "#F59E0B";

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const BlogListPage = () => {
  const featuredPost = allBlogs.find((b) => b.featured) || allBlogs[0];
  const recentPosts = allBlogs.filter((b) => b.slug !== featuredPost.slug);

  /* ── Schema: Blog list ── */
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Ghar Ka Organic Blog",
    description:
      "Organic food blogs, pahadi recipes, desi ghee benefits, and health tips.",
    url: "https://gharkaorganic.com/pages/blogs",
    publisher: {
      "@type": "Organization",
      name: "Ghar Ka Organic",
      url: "https://gharkaorganic.com",
    },
    blogPost: allBlogs.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.seoDescription,
      datePublished: p.date,
      url: `https://gharkaorganic.com/pages/blogs/${p.slug}`,
      image: `https://gharkaorganic.com${p.image}`,
      author: { "@type": "Organization", name: "Ghar Ka Organic" },
    })),
  };

  /* ── Schema: Breadcrumb ── */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://gharkaorganic.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://gharkaorganic.com/pages/blogs",
      },
    ],
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* ══════════════════════════════════════════
          SEO HEAD
          Fix 1: title, description, canonical
          Fix 2: robots = index, follow
          Fix 3: og + twitter (Google Discovery)
          Fix 4: JSON-LD inside Helmet (not dangerouslySetInnerHTML)
          Fix 5: Breadcrumb schema
      ══════════════════════════════════════════ */}
      <Helmet>
        <title>Organic Food Blogs & Recipes | Ghar Ka Organic</title>
        <meta
          name="description"
          content="Read organic food blogs, pahadi recipes, desi ghee benefits, and stories of rural entrepreneurs. Learn healthy living with Ghar Ka Organic."
        />
        {/* Canonical — single source of truth for Google */}
        <link rel="canonical" href="https://gharkaorganic.com/pages/blogs" />
        {/* Explicitly allow crawling & indexing */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Organic Food Blogs & Recipes | Ghar Ka Organic"
        />
        <meta
          property="og:description"
          content="Pahadi recipes, ghee benefits, and organic living tips."
        />
        <meta
          property="og:url"
          content="https://gharkaorganic.com/pages/blogs"
        />
        <meta property="og:site_name" content="Ghar Ka Organic" />
        <meta
          property="og:image"
          content={`https://gharkaorganic.com${featuredPost.image}`}
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Organic Food Blogs & Recipes | Ghar Ka Organic"
        />
        <meta
          name="twitter:image"
          content={`https://gharkaorganic.com${featuredPost.image}`}
        />
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(blogSchema)}</script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      {/* ══════════════════════════════════════════
          BREADCRUMB NAV
          Fix 6: visible <a> tags = referring links
          Google follows these to discover the page
      ══════════════════════════════════════════ */}
      <nav
        aria-label="Breadcrumb"
        style={{
          padding: "10px 24px",
          borderBottom: "1px solid #f0f0f0",
          fontSize: "13px",
          color: "#888",
          maxWidth: "1200px",
          margin: "0 auto",
        }}>
        <ol
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            gap: "6px",
            alignItems: "center",
          }}>
          <li>
            <a href="/" style={{ color: "#888", textDecoration: "none" }}>
              Home
            </a>
          </li>
          <li aria-hidden style={{ color: "#ccc" }}>
            ›
          </li>
          <li style={{ color: "#333", fontWeight: 500 }}>Blog</li>
        </ol>
      </nav>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "32px 24px 80px",
        }}>
        {/* PAGE HEADING */}
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#1a1a1a",
              margin: "0 0 6px",
            }}>
            Organic Food Blogs & Recipes
          </h1>
          <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
            Pahadi recipes, ghee tips, and healthy living — straight from our
            farm.
          </p>
        </div>

        {/* TWO-COLUMN LAYOUT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: "36px",
            alignItems: "start",
          }}>
          {/* ── MAIN ── */}
          <main>
            {/* FEATURED POST */}
            <article
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
                overflow: "hidden",
                marginBottom: "36px",
              }}>
              <div
                style={{
                  background: ACCENT,
                  padding: "5px 14px",
                  display: "inline-block",
                }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#fff",
                    textTransform: "uppercase",
                  }}>
                  Featured
                </span>
              </div>

              <Link to={`/pages/blogs/${featuredPost.slug}`}>
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  width="760"
                  height="360"
                  loading="eager"
                  fetchpriority="high"
                  style={{
                    width: "100%",
                    height: "260px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Link>

              <div style={{ padding: "22px" }}>
                <span
                  style={{
                    display: "inline-block",
                    background: "#FEF3C7",
                    color: "#92400E",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "2px 10px",
                    borderRadius: "4px",
                    marginBottom: "10px",
                  }}>
                  {featuredPost.category}
                </span>

                <h2
                  style={{
                    fontSize: "21px",
                    fontWeight: 700,
                    color: "#1a1a1a",
                    margin: "0 0 10px",
                    lineHeight: 1.3,
                  }}>
                  <Link
                    to={`/pages/blogs/${featuredPost.slug}`}
                    style={{ color: "inherit", textDecoration: "none" }}>
                    {featuredPost.title}
                  </Link>
                </h2>

                <p
                  style={{
                    color: "#555",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    margin: "0 0 16px",
                  }}>
                  {featuredPost.excerpt}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    fontSize: "12px",
                    color: "#999",
                    marginBottom: "16px",
                  }}>
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={12} /> {formatDate(featuredPost.date)}
                  </span>
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <MessageCircle size={12} /> {featuredPost.comments} comments
                  </span>
                </div>

                <Link
                  to={`/pages/blogs/${featuredPost.slug}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: ACCENT,
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 600,
                    padding: "8px 18px",
                    borderRadius: "6px",
                    textDecoration: "none",
                  }}>
                  Read Article <ArrowRight size={13} />
                </Link>
              </div>
            </article>

            {/* MORE POSTS */}
            <h2
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "#1a1a1a",
                margin: "0 0 18px",
                paddingBottom: "8px",
                borderBottom: `2px solid ${ACCENT}`,
                display: "inline-block",
              }}>
              More Articles
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "18px",
              }}>
              {recentPosts.map((post) => (
                <article
                  key={post.slug}
                  style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}>
                  <Link to={`/pages/blogs/${post.slug}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      width="380"
                      height="200"
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </Link>
                  <div style={{ padding: "14px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        background: "#FEF3C7",
                        color: "#92400E",
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        marginBottom: "8px",
                      }}>
                      {post.category}
                    </span>
                    <h3
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#1a1a1a",
                        margin: "0 0 7px",
                        lineHeight: 1.35,
                      }}>
                      <Link
                        to={`/pages/blogs/${post.slug}`}
                        style={{ color: "inherit", textDecoration: "none" }}>
                        {post.title}
                      </Link>
                    </h3>
                    <p
                      style={{
                        color: "#666",
                        fontSize: "13px",
                        lineHeight: 1.6,
                        margin: "0 0 10px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                      {post.excerpt}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "11px",
                        color: "#aaa",
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: "9px",
                      }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                        }}>
                        <Calendar size={11} /> {formatDate(post.date)}
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                        }}>
                        <MessageCircle size={11} /> {post.comments}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </main>

          {/* ── SIDEBAR ── */}
          <aside style={{ position: "sticky", top: "20px" }}>
            {/* Recent Articles — plain <a> tags for Googlebot */}
            <div
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
                padding: "18px",
                marginBottom: "18px",
              }}>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#1a1a1a",
                  margin: "0 0 14px",
                  paddingBottom: "8px",
                  borderBottom: `2px solid ${ACCENT}`,
                }}>
                Recent Articles
              </h3>
              {/* ↓ Plain <a> not <Link> — Googlebot crawls these as referring links */}
              <nav aria-label="Recent articles">
                {recentPosts.map((post, i) => (
                  <div
                    key={post.slug}
                    style={{
                      paddingBottom: i < recentPosts.length - 1 ? "12px" : 0,
                      marginBottom: i < recentPosts.length - 1 ? "12px" : 0,
                      borderBottom:
                        i < recentPosts.length - 1
                          ? "1px solid #f0f0f0"
                          : "none",
                    }}>
                    <a
                      href={`/pages/blogs/${post.slug}`}
                      style={{
                        color: "#1a1a1a",
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: 500,
                        lineHeight: 1.35,
                        display: "block",
                        marginBottom: "3px",
                      }}>
                      {post.title}
                    </a>
                    <span style={{ fontSize: "11px", color: "#aaa" }}>
                      {formatDate(post.date)}
                    </span>
                  </div>
                ))}
              </nav>
            </div>

            {/* Categories */}
            <div
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
                padding: "18px",
                marginBottom: "18px",
              }}>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#1a1a1a",
                  margin: "0 0 12px",
                  paddingBottom: "8px",
                  borderBottom: `2px solid ${ACCENT}`,
                }}>
                Categories
              </h3>
              <nav aria-label="Blog categories">
                {["Health", "Recipes", "Culture", "Impact"].map((cat) => (
                  <a
                    key={cat}
                    href={`/pages/blogs?category=${cat.toLowerCase()}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "7px 0",
                      borderBottom: "1px solid #f5f5f5",
                      color: "#444",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}>
                    <span>{cat}</span>
                    <span style={{ color: "#aaa", fontSize: "12px" }}>
                      {allBlogs.filter((b) => b.category === cat).length}
                    </span>
                  </a>
                ))}
              </nav>
            </div>

            {/* Sitemap reminder box (remove after submitting) */}
            <div
              style={{
                background: "#FFFBEB",
                border: "1px solid #FDE68A",
                borderRadius: "8px",
                padding: "16px",
                fontSize: "12px",
                color: "#92400E",
                lineHeight: 1.6,
              }}>
              <strong style={{ display: "block", marginBottom: "6px" }}>
                🗺 Submit your sitemap
              </strong>
              Go to Google Search Console → Sitemaps → add{" "}
              <code
                style={{
                  background: "#FEF3C7",
                  padding: "1px 4px",
                  borderRadius: 3,
                }}>
                /sitemap.xml
              </code>
              . Generate it using the script at the bottom of this file.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;

/* ═══════════════════════════════════════════════════════════════
   SITEMAP GENERATOR SCRIPT
   Save as: scripts/generate-sitemap.js
   Run:     node scripts/generate-sitemap.js
   Then:    Submit /sitemap.xml in Google Search Console
═══════════════════════════════════════════════════════════════

const fs = require("fs");
const path = require("path");

const BASE = "https://gharkaorganic.com";
const today = new Date().toISOString().split("T")[0];

// Copy allBlogs here or import from your data file
const slugs = [
  "budget-2026-organic-food-access",
  "eating-mistakes-healthy-diet",
  "a2-buffalo-ghee-muscle",
  "lohri-to-pongal-2026",
  "aam-ka-achar-recipe",
];

const urls = [
  { loc: `${BASE}/`,                    priority: "1.0", changefreq: "daily",   lastmod: today },
  { loc: `${BASE}/pages/blogs`,         priority: "0.9", changefreq: "weekly",  lastmod: today },
  ...slugs.map((slug) => ({
    loc:        `${BASE}/pages/blogs/${slug}`,
    priority:   "0.8",
    changefreq: "monthly",
    lastmod:    today,
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, priority, changefreq, lastmod }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

fs.writeFileSync(path.join(__dirname, "../public/sitemap.xml"), xml);
console.log("sitemap.xml written to /public — submit at search.google.com/search-console");

*/
