import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Calendar, MessageCircle, ArrowRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────── */
const ACCENT = "#F59E0B";
const YELLOW_BANNER = "#FDE047";

/* ─────────────────────────────────────────────────────────────
   BLOG DATA (SEO OPTIMIZED)
───────────────────────────────────────────────────────────── */
export const allBlogs = [
  {
    title: "Why Budget 2026 Means Better Organic Food Access for Indian Homes",
    slug: "budget-2026-organic-food-access",
    image: "/images/blog-budget-organic.jpg",
    category: "Impact",
    excerpt:
      "Budget 2026 announced major support for organic farming and FPOs. Here’s what it means for your monthly grocery bill and the quality of ghee, honey, and pickles you get from brands like Ghar Ka Organic.",
    date: "2026-02-23",
    comments: 4,
    featured: true,
    bannerTitle:
      "Budget 2026: Making Organic Food Affordable for Every Kitchen",
    seoTitle: "Budget 2026 & Organic Food Prices | Ghar Ka Organic",
    seoDescription:
      "Learn how Budget 2026 supports organic farming, reduces costs of A2 ghee, raw honey, and homemade pickles, and helps brands like Ghar Ka Organic serve you better.",
    content: `
      <p>Union Budget 2026 finally put organic food in the spotlight. With Rs 2,200 crore allocated to natural farming and 10,000 new FPOs planned, the cost of producing real, chemical-free food is about to drop.</p>
      
      <h2>What changes for you?</h2>
      <p>1. More certified organic farms = better raw material for A2 bilona ghee and forest honey.</p>
      <p>2. Direct market links mean brands like Ghar Ka Organic can skip 3 middlemen and pass savings to you.</p>
      <p>3. Cold storage subsidies help us ship pickles without preservatives year-round.</p>
      
      <p>Bottom line: The “organic is expensive” tag will fade. We’re already revising prices for Q2 2026.</p>
    `,
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
      "Even with A2 ghee and raw honey, these 5 eating mistakes cause gas, weight gain, and low energy. Fix them in 2 minutes with Ghar Ka Organic.",
    content: `
      <p>You switched to A2 ghee. You eat millets. You even make your own achaar. But something’s still not clicking...</p>
      
      <h2>1. Eating Cold Ghee on Hot Rice</h2>
      <p>Warm 1 tsp of Ghar Ka Organic A2 Bilona Ghee before pouring. Cold ghee doesn’t absorb.</p>
      
      <h2>2. Mixing Honey in Boiling Chai</h2>
      <p>Never heat our raw forest honey above 40°C. It becomes toxic. Lukewarm haldi-doodh only.</p>
      
      <h2>3. Eating Fruits Right After Meals</h2>
      <p>Fruit ferments on top of roti-sabzi. Eat alone, or 2 hours before meals.</p>
      
      <h2>4. Drinking Water With Meals</h2>
      <p>Sips are fine. A full glass kills digestive fire. Drink 30 mins before or 1 hour after.</p>
      
      <h2>5. Skipping the Post-Meal Walk</h2>
      <p>100 steps after eating prevents 80% of sugar spikes. Try it after lunch today.</p>
    `,
  },
  {
    title: "A2 Buffalo Ghee vs Cow Ghee: Which Builds Better Muscle?",
    slug: "a2-buffalo-ghee-muscle",
    image: "/images/blog-buffalo-ghee.jpg",
    category: "Health",
    excerpt:
      "Pahadi wrestlers swear by buffalo bilona ghee. We tested Ghar Ka Organic’s A2 Buffalo Ghee vs regular gym supplements for 90 days. Results inside.",
    date: "2026-01-29",
    comments: 8,
    bannerTitle: "A2 Buffalo Ghee for Muscle Growth: Truth Explained",
    seoTitle: "A2 Buffalo Ghee for Muscle Gain | Ghar Ka Organic",
    seoDescription:
      "Does A2 buffalo ghee really help build muscle? We break down the science, Ayurveda, and lab tests on Ghar Ka Organic Buffalo Bilona Ghee.",
  },
  {
    title: "Lohri to Pongal: Pickle Pairings for Every Harvest Festival",
    slug: "lohri-to-pongal-2026",
    image: "/images/blog-lohri-pongal.jpg",
    category: "Culture",
    excerpt:
      "From Sarson ka Saag with Ghar Ka Organic Garlic Pickle in Punjab to Pongal with Mango Pickle in Tamil Nadu — mapping India’s harvest feasts.",
    date: "2026-01-09",
    comments: 15,
    bannerTitle:
      "From Lohri to Pongal: Pickle Pairings for Every Harvest Festival",
    seoTitle: "Harvest Festival Food & Pickles | Ghar Ka Organic",
    seoDescription:
      "Discover which Ghar Ka Organic pickle pairs best with Lohri, Makar Sankranti, and Pongal feasts. Regional recipes + stories inside.",
  },
  {
    title: "How to Make Aam Ka Achar Like Ghar Ka Organic",
    slug: "aam-ka-achar-recipe",
    image: "/images/blog-aam-achaar.jpg",
    category: "Recipes",
    excerpt:
      "We’re sharing our exact Uttar Pradesh recipe. No vinegar, no preservatives. Just sun, salt, and the same mustard oil we use in our jars.",
    date: "2026-01-05",
    comments: 23,
    bannerTitle: "How to Make Aam Ka Achar Like Ghar Ka Organic",
    seoTitle: "Traditional Aam Ka Achar Recipe | Ghar Ka Organic",
    seoDescription:
      "Learn the authentic Uttar Pradesh mango pickle recipe used by Ghar Ka Organic. Step-by-step with sun-drying tips and spice ratios.",
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

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
const BlogListPage = () => {
  const featuredPost = allBlogs.find((b) => b.featured) || allBlogs[0];
  const recentPosts = allBlogs.filter((b) => b.slug !== featuredPost.slug);

  /* ── SEO Schema ───────────────── */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Ghar Ka Organic Blog",
    description:
      "Organic food blogs, pahadi recipes, and health tips from Ghar Ka Organic.",
    url: "https://gharkaorganic.com/pages/blogs",
    publisher: {
      "@type": "Organization",
      name: "Ghar Ka Organic",
    },
    blogPost: allBlogs.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      datePublished: post.date,
      url: `https://gharkaorganic.com/pages/blogs/${post.slug}`,
    })),
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* SEO */}
      <Helmet>
        <title>Organic Food Blogs & Recipes | Ghar Ka Organic</title>
        <meta
          name="description"
          content="Read organic food blogs, pahadi recipes, desi ghee benefits, and stories of rural entrepreneurs. Learn healthy living with Ghar Ka Organic."
        />
        <link rel="canonical" href="https://gharkaorganic.com/pages/blogs" />
      </Helmet>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-10 lg:py-16">
        {/* TITLE */}
        <h1 className="text-3xl lg:text-5xl font-black uppercase mb-12">
          Organic Food Blogs & Recipes
        </h1>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* LEFT META */}
          <aside className="hidden lg:block lg:col-span-2 text-sm text-gray-500">
            <p>{formatDate(featuredPost.date)}</p>
            <p>{featuredPost.comments || 0} comments</p>
          </aside>

          {/* MAIN */}
          <main className="lg:col-span-7">
            {/* Mobile meta */}
            <div className="flex gap-4 text-sm text-gray-500 mb-4 lg:hidden">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {formatDate(featuredPost.date)}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={14} /> {featuredPost.comments || 0}
              </span>
            </div>

            {/* Banner */}
            <div
              className="px-5 py-4"
              style={{ backgroundColor: YELLOW_BANNER }}>
              <h2 className="text-lg lg:text-2xl font-bold text-red-700">
                {featuredPost.bannerTitle}
              </h2>
            </div>

            {/* Image */}
            <Link to={`/pages/blogs/${featuredPost.slug}`}>
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full"
              />
            </Link>

            {/* Content */}
            <article className="mt-6">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                <Link to={`/pages/blogs/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h3>

              <p className="text-gray-700 leading-relaxed">
                {featuredPost.excerpt}
              </p>

              <Link
                to={`/pages/blogs/${featuredPost.slug}`}
                className="inline-flex items-center gap-2 mt-5 text-sm font-semibold"
                style={{ color: ACCENT }}>
                Continue Reading <ArrowRight size={16} />
              </Link>
            </article>
          </main>

          {/* SIDEBAR */}
          <aside className="lg:col-span-3">
            <h3
              className="text-xl font-semibold mb-4 border-b pb-2"
              style={{ color: ACCENT }}>
              Recent Articles
            </h3>

            <div className="space-y-5">
              {recentPosts.map((post) => (
                <article key={post.slug}>
                  <Link to={`/pages/blogs/${post.slug}`}>
                    <h4 className="font-semibold hover:underline">
                      {post.title}
                    </h4>
                  </Link>
                  <p className="text-sm text-gray-500">
                    {formatDate(post.date)}
                  </p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;
