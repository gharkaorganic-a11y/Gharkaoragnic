import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Calendar, MessageCircle, ArrowRight, Tag } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────── */
const COLORS = {
  cream: "#FAF6EE",
  parchment: "#F0E8D5",
  ink: "#1C1409",
  inkMuted: "#5C4A2A",
  amber: "#D4820A",
  amberLight: "#FDE8B0",
  red: "#B93B2B",
  sage: "#4A6741",
  sageLight: "#DCE8D4",
  border: "#D8C9A8",
};

const CATEGORY_COLORS = {
  Impact: { bg: "#FDE8B0", text: "#854F0B", border: "#D4820A" },
  Health: { bg: "#DCE8D4", text: "#2E4A26", border: "#4A6741" },
  Culture: { bg: "#F5E0DC", text: "#7A2A1D", border: "#B93B2B" },
  Recipes: { bg: "#E8E2F5", text: "#3B2D6A", border: "#6B5BB5" },
};

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
    bannerTitle:
      "Budget 2026: Making Organic Food Affordable for Every Kitchen",
    seoTitle: "Budget 2026 & Organic Food Prices | Ghar Ka Organic",
    seoDescription:
      "Learn how Budget 2026 supports organic farming, reduces costs of A2 ghee, raw honey, and homemade pickles, and helps brands like Ghar Ka Organic serve you better.",
    readTime: "5 min read",
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
    bannerTitle: "5 Eating Mistakes That Ruin Even the Healthiest Diet",
    seoTitle: "5 Diet Mistakes | Ayurveda Tips | Ghar Ka Organic",
    seoDescription:
      "Even with A2 ghee and raw honey, these 5 eating mistakes cause gas, weight gain, and low energy.",
    readTime: "4 min read",
  },
  {
    title: "A2 Buffalo Ghee vs Cow Ghee: Which Builds Better Muscle?",
    slug: "a2-buffalo-ghee-muscle",
    image: "/images/blog-buffalo-ghee.jpg",
    category: "Health",
    excerpt:
      "Pahadi wrestlers swear by buffalo bilona ghee. We tested Ghar Ka Organic's A2 Buffalo Ghee vs regular gym supplements for 90 days. Results inside.",
    date: "2026-01-29",
    comments: 8,
    bannerTitle: "A2 Buffalo Ghee for Muscle Growth: Truth Explained",
    seoTitle: "A2 Buffalo Ghee for Muscle Gain | Ghar Ka Organic",
    seoDescription:
      "Does A2 buffalo ghee really help build muscle? We break down the science, Ayurveda, and lab tests.",
    readTime: "6 min read",
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
    bannerTitle:
      "From Lohri to Pongal: Pickle Pairings for Every Harvest Festival",
    seoTitle: "Harvest Festival Food & Pickles | Ghar Ka Organic",
    seoDescription:
      "Discover which Ghar Ka Organic pickle pairs best with Lohri, Makar Sankranti, and Pongal feasts.",
    readTime: "7 min read",
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
    bannerTitle: "How to Make Aam Ka Achar Like Ghar Ka Organic",
    seoTitle: "Traditional Aam Ka Achar Recipe | Ghar Ka Organic",
    seoDescription:
      "Learn the authentic Uttar Pradesh mango pickle recipe used by Ghar Ka Organic.",
    readTime: "8 min read",
  },
];

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const CategoryBadge = ({ category }) => {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS["Health"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "3px 10px",
        borderRadius: "2px",
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        fontFamily: "'Source Serif 4', Georgia, serif",
      }}>
      {category}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────────
   FEATURED HERO CARD
───────────────────────────────────────────────────────────── */
const FeaturedCard = ({ post }) => (
  <article
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      minHeight: "460px",
      background: COLORS.ink,
      borderRadius: "4px",
      overflow: "hidden",
      position: "relative",
    }}>
    {/* Image Side */}
    <div style={{ position: "relative", overflow: "hidden" }}>
      <img
        src={post.image}
        alt={post.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: "transform 0.6s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
      {/* Ink wash overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, transparent 60%, rgba(28,20,9,0.5))",
          pointerEvents: "none",
        }}
      />
      {/* Big FEATURED stamp */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          fontSize: "10px",
          fontWeight: "700",
          letterSpacing: "0.15em",
          color: COLORS.amberLight,
          background: "rgba(28,20,9,0.75)",
          padding: "4px 10px",
          borderRadius: "2px",
          fontFamily: "'Source Serif 4', Georgia, serif",
          border: `1px solid ${COLORS.amber}`,
        }}>
        FEATURED
      </div>
    </div>

    {/* Content Side */}
    <div
      style={{
        padding: "48px 40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: COLORS.ink,
      }}>
      <div style={{ marginBottom: "16px" }}>
        <CategoryBadge category={post.category} />
      </div>

      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(22px, 2.4vw, 30px)",
          fontWeight: "700",
          color: COLORS.cream,
          lineHeight: "1.25",
          marginBottom: "16px",
          letterSpacing: "-0.01em",
        }}>
        <Link
          to={`/pages/blogs/${post.slug}`}
          style={{
            color: "inherit",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = COLORS.amberLight)}
          onMouseOut={(e) => (e.currentTarget.style.color = COLORS.cream)}>
          {post.title}
        </Link>
      </h2>

      <p
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: "14px",
          color: "#B8A888",
          lineHeight: "1.75",
          marginBottom: "28px",
          flexGrow: 1,
        }}>
        {post.excerpt}
      </p>

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: "12px",
          color: "#8A7A5A",
          marginBottom: "24px",
          fontFamily: "'Source Serif 4', Georgia, serif",
        }}>
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Calendar size={13} />
          {formatDate(post.date)}
        </span>
        <span
          style={{
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            background: "#8A7A5A",
          }}
        />
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <MessageCircle size={13} />
          {post.comments} comments
        </span>
        {post.readTime && (
          <>
            <span
              style={{
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: "#8A7A5A",
              }}
            />
            <span>{post.readTime}</span>
          </>
        )}
      </div>

      <Link
        to={`/pages/blogs/${post.slug}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
          fontWeight: "700",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: COLORS.amber,
          textDecoration: "none",
          fontFamily: "'Source Serif 4', Georgia, serif",
          transition: "gap 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.gap = "14px")}
        onMouseOut={(e) => (e.currentTarget.style.gap = "8px")}>
        Read Article <ArrowRight size={15} />
      </Link>
    </div>
  </article>
);

/* ─────────────────────────────────────────────────────────────
   GRID POST CARD
───────────────────────────────────────────────────────────── */
const PostCard = ({ post, index }) => (
  <article
    style={{
      background: COLORS.cream,
      border: `1px solid ${COLORS.border}`,
      borderRadius: "4px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
      animationDelay: `${index * 80}ms`,
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = `0 8px 24px rgba(28,20,9,0.12)`;
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}>
    {/* Image */}
    <Link
      to={`/pages/blogs/${post.slug}`}
      style={{ display: "block", overflow: "hidden", aspectRatio: "16/9" }}>
      <img
        src={post.image}
        alt={post.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: "transform 0.5s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
    </Link>

    {/* Body */}
    <div
      style={{
        padding: "20px 22px 24px",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}>
        <CategoryBadge category={post.category} />
        <span
          style={{
            fontSize: "11px",
            color: COLORS.inkMuted,
            fontFamily: "'Source Serif 4', Georgia, serif",
          }}>
          {post.readTime}
        </span>
      </div>

      <h3
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "17px",
          fontWeight: "700",
          color: COLORS.ink,
          lineHeight: "1.35",
          marginBottom: "10px",
          letterSpacing: "-0.01em",
        }}>
        <Link
          to={`/pages/blogs/${post.slug}`}
          style={{
            color: "inherit",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = COLORS.amber)}
          onMouseOut={(e) => (e.currentTarget.style.color = COLORS.ink)}>
          {post.title}
        </Link>
      </h3>

      <p
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: "13px",
          color: COLORS.inkMuted,
          lineHeight: "1.7",
          marginBottom: "18px",
          flexGrow: 1,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
        {post.excerpt}
      </p>

      {/* Footer meta */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${COLORS.border}`,
          paddingTop: "14px",
          marginTop: "auto",
        }}>
        <span
          style={{
            fontSize: "11px",
            color: "#9A8060",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontFamily: "'Source Serif 4', Georgia, serif",
          }}>
          <Calendar size={12} />
          {formatDate(post.date)}
        </span>
        <span
          style={{
            fontSize: "11px",
            color: "#9A8060",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontFamily: "'Source Serif 4', Georgia, serif",
          }}>
          <MessageCircle size={12} />
          {post.comments}
        </span>
      </div>
    </div>
  </article>
);

/* ─────────────────────────────────────────────────────────────
   SIDEBAR: RECENT POSTS
───────────────────────────────────────────────────────────── */
const SidebarPost = ({ post }) => (
  <article
    style={{
      display: "flex",
      gap: "14px",
      paddingBottom: "18px",
      marginBottom: "18px",
      borderBottom: `1px solid ${COLORS.border}`,
    }}>
    <Link
      to={`/pages/blogs/${post.slug}`}
      style={{
        flexShrink: 0,
        width: "72px",
        height: "60px",
        borderRadius: "3px",
        overflow: "hidden",
        display: "block",
      }}>
      <img
        src={post.image}
        alt={post.title}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </Link>
    <div>
      <CategoryBadge category={post.category} />
      <h4
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "13px",
          fontWeight: "700",
          color: COLORS.ink,
          lineHeight: "1.35",
          marginTop: "6px",
          marginBottom: "4px",
        }}>
        <Link
          to={`/pages/blogs/${post.slug}`}
          style={{ color: "inherit", textDecoration: "none" }}
          onMouseOver={(e) => (e.currentTarget.style.color = COLORS.amber)}
          onMouseOut={(e) => (e.currentTarget.style.color = COLORS.ink)}>
          {post.title}
        </Link>
      </h4>
      <span
        style={{
          fontSize: "11px",
          color: "#9A8060",
          fontFamily: "'Source Serif 4', Georgia, serif",
        }}>
        {formatDate(post.date)}
      </span>
    </div>
  </article>
);

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const BlogListPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...new Set(allBlogs.map((b) => b.category))];
  const featuredPost = allBlogs.find((b) => b.featured) || allBlogs[0];

  const filteredPosts = allBlogs
    .filter((b) => b.slug !== featuredPost.slug)
    .filter((b) => activeCategory === "All" || b.category === activeCategory);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Ghar Ka Organic Blog",
    description: "Organic food blogs, pahadi recipes, and health tips.",
    url: "https://gharkaorganic.com/pages/blogs",
    publisher: { "@type": "Organization", name: "Ghar Ka Organic" },
    blogPost: allBlogs.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      datePublished: post.date,
      url: `https://gharkaorganic.com/pages/blogs/${post.slug}`,
    })),
  };

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&display=swap');
        .blog-page * { box-sizing: border-box; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .cat-pill {
          display: inline-block;
          padding: 5px 16px;
          border-radius: 2px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.18s;
          font-family: 'Source Serif 4', Georgia, serif;
          background: transparent;
        }
        .cat-pill:hover { background: ${COLORS.amberLight}; color: ${COLORS.amber}; border-color: ${COLORS.amber}; }
        .cat-pill.active { background: ${COLORS.amber}; color: #fff; border-color: ${COLORS.amber}; }
        .cat-pill.inactive { color: ${COLORS.inkMuted}; border-color: ${COLORS.border}; background: ${COLORS.cream}; }
      `}</style>

      <Helmet>
        <title>Organic Food Blogs & Recipes | Ghar Ka Organic</title>
        <meta
          name="description"
          content="Read organic food blogs, pahadi recipes, desi ghee benefits, and stories of rural entrepreneurs. Learn healthy living with Ghar Ka Organic."
        />
        <link rel="canonical" href="https://gharkaorganic.com/pages/blogs" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div
        className="blog-page"
        style={{ background: COLORS.parchment, minHeight: "100vh" }}>
        {/* ── PAGE HEADER ── */}
        <header
          style={{
            background: COLORS.ink,
            padding: "48px 0 40px",
            position: "relative",
            overflow: "hidden",
          }}>
          {/* decorative grain lines */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(212,130,10,0.06) 28px, rgba(212,130,10,0.06) 29px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              maxWidth: "1180px",
              margin: "0 auto",
              padding: "0 24px",
              position: "relative",
            }}>
            <p
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: COLORS.amber,
                marginBottom: "10px",
              }}>
              From Our Kitchen to Yours
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(36px, 5vw, 62px)",
                fontWeight: "900",
                color: COLORS.cream,
                lineHeight: "1.05",
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}>
              The Organic
              <br />
              <em style={{ color: COLORS.amber, fontStyle: "italic" }}>
                Journal
              </em>
            </h1>
            <p
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: "15px",
                color: "#A0906E",
                maxWidth: "480px",
                lineHeight: "1.65",
              }}>
              Recipes, health wisdom, and stories from India's organic farms —
              served fresh every week.
            </p>
          </div>
        </header>

        {/* ── CATEGORY FILTER BAR ── */}
        <div
          style={{
            background: COLORS.cream,
            borderBottom: `1px solid ${COLORS.border}`,
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}>
          <div
            style={{
              maxWidth: "1180px",
              margin: "0 auto",
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              overflowX: "auto",
              scrollbarWidth: "none",
              height: "52px",
            }}>
            <Tag size={14} style={{ color: COLORS.inkMuted, flexShrink: 0 }} />
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-pill ${activeCategory === cat ? "active" : "inactive"}`}
                onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            padding: "40px 24px 80px",
          }}>
          {/* Featured Post */}
          <div className="fade-up" style={{ marginBottom: "40px" }}>
            <FeaturedCard post={featuredPost} />
          </div>

          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "22px",
                fontWeight: "700",
                color: COLORS.ink,
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}>
              {activeCategory === "All"
                ? "All Articles"
                : `${activeCategory} Articles`}
            </h2>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: COLORS.border,
              }}
            />
            <span
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: "12px",
                color: "#9A8060",
              }}>
              {filteredPosts.length} stories
            </span>
          </div>

          {/* Two-column: grid + sidebar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 300px",
              gap: "40px",
              alignItems: "start",
            }}>
            {/* Post Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "22px",
              }}>
              {filteredPosts.length === 0 ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "60px 0",
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    color: COLORS.inkMuted,
                    fontSize: "15px",
                  }}>
                  No articles in this category yet. Check back soon!
                </div>
              ) : (
                filteredPosts.map((post, i) => (
                  <div
                    key={post.slug}
                    className="fade-up"
                    style={{ animationDelay: `${i * 80}ms` }}>
                    <PostCard post={post} index={i} />
                  </div>
                ))
              )}
            </div>

            {/* Sidebar */}
            <aside
              style={{
                position: "sticky",
                top: "72px",
              }}>
              {/* Recent articles */}
              <div
                style={{
                  background: COLORS.cream,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "4px",
                  padding: "24px",
                  marginBottom: "20px",
                }}>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "16px",
                    fontWeight: "700",
                    color: COLORS.ink,
                    paddingBottom: "12px",
                    borderBottom: `2px solid ${COLORS.amber}`,
                    marginBottom: "20px",
                    display: "inline-block",
                  }}>
                  Recent Articles
                </h3>
                {allBlogs.slice(0, 4).map((post) => (
                  <SidebarPost key={post.slug} post={post} />
                ))}
              </div>

              {/* Newsletter CTA */}
              <div
                style={{
                  background: COLORS.ink,
                  borderRadius: "4px",
                  padding: "24px",
                  textAlign: "center",
                }}>
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "18px",
                    fontWeight: "700",
                    color: COLORS.amberLight,
                    marginBottom: "8px",
                  }}>
                  Weekly recipes &amp; tips
                </p>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    fontSize: "12px",
                    color: "#8A7A5A",
                    marginBottom: "16px",
                    lineHeight: "1.6",
                  }}>
                  Join 4,200+ families eating cleaner.
                </p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  style={{
                    width: "100%",
                    padding: "9px 14px",
                    borderRadius: "2px",
                    border: `1px solid #3A3020`,
                    background: "#2A2010",
                    color: COLORS.cream,
                    fontSize: "13px",
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    marginBottom: "10px",
                    outline: "none",
                  }}
                />
                <button
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: COLORS.amber,
                    color: "#fff",
                    border: "none",
                    borderRadius: "2px",
                    fontSize: "12px",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#B36E08")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = COLORS.amber)
                  }>
                  Subscribe Free
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogListPage;
