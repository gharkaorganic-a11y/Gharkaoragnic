import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  ArrowRight,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";

import { getBlogBySlug, getRecentBlogs } from "../data/blogData";

const ACCENT = "#F59E0B";
const YELLOW_BANNER = "#FDE047";
const SITE_URL = "https://gharkaorganic.com";
const LOGO_URL = "https://gharkaorganic.com/logo/gharka-logo.png";
const ABOUT_URL = "https://gharkaorganic.com/pages/our-story";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

// Helper for reading time schema
const getReadTimeSchema = (readTimeStr) => {
  const minutes = parseInt(readTimeStr?.match(/\d+/)?.[0]) || 5;
  return `PT${minutes}M`;
};

const BlogDetailPage = () => {
  const { slug } = useParams();

  const blog = getBlogBySlug(slug);
  const recentArticles = getRecentBlogs(slug, 4);

  // Memoize schemas for performance
  const schemas = useMemo(() => {
    if (!blog) return [];

    const canonicalUrl = `${SITE_URL}/blogs/${slug}`;
    const featuredImage = blog.image.startsWith("http")
      ? blog.image
      : `${SITE_URL}${blog.image}`;
    const seoDescription = blog.seo_description || blog.excerpt;
    const keywords = blog.tags?.join(", ");
    const readTimeDuration = getReadTimeSchema(blog.read_time);

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
      headline: blog.title,
      description: seoDescription,
      image: {
        "@type": "ImageObject",
        url: featuredImage,
        width: 1200,
        height: 630,
      },
      datePublished: blog.date,
      dateModified: blog.updated_at || blog.date,
      author: {
        "@type": "Person",
        name: blog.author,
        url: ABOUT_URL,
      },
      publisher: {
        "@type": "Organization",
        name: "Ghar Ka Organic",
        logo: {
          "@type": "ImageObject",
          url: LOGO_URL,
        },
        url: SITE_URL,
      },
      articleSection: blog.category,
      keywords: keywords,
      wordCount: blog.word_count || 1200,
      timeRequired: readTimeDuration,
      inLanguage: "en",
      isAccessibleForFree: true,
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".blog-content p:first-of-type"],
      },
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blogs",
          item: `${SITE_URL}/blogs`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: blog.title,
          item: canonicalUrl,
        },
      ],
    };

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Ghar Ka Organic",
      url: SITE_URL,
      logo: LOGO_URL,
      sameAs: [
        // Add your social profiles here
        "https://facebook.com/gharkaorganic",
        "https://instagram.com/gharkaorganic",
      ],
    };

    return [articleSchema, breadcrumbSchema, organizationSchema];
  }, [blog, slug]);

  // Not found handling
  if (!blog) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-5">
            The article you are looking for does not exist or has been moved.
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 font-semibold"
            style={{ color: ACCENT }}>
            Back to Blogs
          </Link>
        </div>
      </section>
    );
  }

  const canonicalUrl = `${SITE_URL}/blogs/${slug}`;
  const seoTitle = blog.meta_title || `${blog.title} | Ghar Ka Organic`;
  const seoDescription = blog.seo_description || blog.excerpt;
  const keywords = blog.tags?.join(", ");
  const featuredImage = blog.image.startsWith("http")
    ? blog.image
    : `${SITE_URL}${blog.image}`;
  const blogImageAlt = blog.image_alt || blog.title;

  // Share URLs
  const shareUrl = encodeURIComponent(canonicalUrl);
  const shareText = encodeURIComponent(blog.title);

  return (
    <>
      <Helmet>
        {/* Basic SEO */}
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Performance hints */}
        <link rel="preload" as="image" href={featuredImage} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={featuredImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={blogImageAlt} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Ghar Ka Organic" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={featuredImage} />
        <meta name="twitter:image:alt" content={blogImageAlt} />

        {/* Article meta */}
        <meta property="article:published_time" content={blog.date} />
        <meta
          property="article:modified_time"
          content={blog.updated_at || blog.date}
        />
        <meta property="article:section" content={blog.category} />
        <meta property="article:author" content={ABOUT_URL} />
        {blog.tags?.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(schemas)}</script>
      </Helmet>

      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-amber-500 text-white px-4 py-2 rounded-md z-50">
        Skip to main content
      </a>

      <div className="bg-white text-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/" className="hover:text-black transition">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/blogs" className="hover:text-black transition">
                  Blogs
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 truncate" aria-current="page">
                {blog.title}
              </li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* MAIN CONTENT */}
            <main id="main-content" className="lg:col-span-8">
              {/* Category */}
              <div className="mb-4">
                <span
                  className="inline-flex px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase"
                  style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
                  {blog.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-5">
                {blog.title}
              </h1>

              {/* Meta info with author link */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 border-b border-gray-200 pb-6 mb-8">
                <span className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  <time dateTime={blog.date}>{formatDate(blog.date)}</time>
                </span>
                <span className="flex items-center gap-2">
                  <Clock3 size={16} />
                  <span>{blog.read_time}</span>
                </span>
              </div>

              {/* Optional banner */}
              {blog.banner_title && (
                <div
                  className="rounded-t-2xl px-5 py-4"
                  style={{ backgroundColor: YELLOW_BANNER }}>
                  <h2 className="text-xl sm:text-2xl font-bold text-red-700">
                    {blog.banner_title}
                  </h2>
                </div>
              )}

              {/* Feature Image with WebP support to prevent CLS */}
              <div className="overflow-hidden rounded-2xl shadow-sm">
                <picture>
                  <source
                    srcSet={featuredImage.replace(/\.(jpg|png)$/, ".webp")}
                    type="image/webp"
                  />
                  <img
                    src={featuredImage}
                    alt={blogImageAlt}
                    className="w-full h-auto object-cover"
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                    width="1200"
                    height="630"
                    style={{ aspectRatio: "1200/630" }}
                  />
                </picture>
              </div>

              {/* Content */}
              <article
                className="blog-content prose prose-lg max-w-none mt-10
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-p:text-gray-700 prose-p:leading-8
                  prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl prose-img:shadow-md
                  prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:italic
                  prose-li:marker:text-amber-500"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <section className="mt-12 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-lg mb-4">Related Topics</h3>
                  <div className="flex flex-wrap gap-3">
                    {blog.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/blogs?tag=${encodeURIComponent(tag)}`}
                        className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm transition"
                        rel="tag">
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Social Share Buttons */}
              <section className="mt-8 pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Share2 size={18} /> Share this article
                </h3>
                <div className="flex gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition"
                    aria-label="Share on Facebook">
                    <Facebook size={20} />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 rounded-full hover:bg-sky-100 transition"
                    aria-label="Share on Twitter">
                    <Twitter size={20} />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition"
                    aria-label="Share on LinkedIn">
                    <Linkedin size={20} />
                  </a>
                  <a
                    href={`mailto:?subject=${shareText}&body=${shareUrl}`}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                    aria-label="Share via Email">
                    <Mail size={20} />
                  </a>
                </div>
              </section>
            </main>

            {/* SIDEBAR */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* Recent Articles */}
                <div>
                  <h3
                    className="text-2xl font-bold mb-6 pb-2 border-b-2 border-amber-200 inline-block"
                    style={{ color: ACCENT }}>
                    Recent Articles
                  </h3>
                  <div className="space-y-6">
                    {recentArticles.map((post) => (
                      <article
                        key={post.slug}
                        className="group border-b border-gray-100 pb-5 last:border-0">
                        <Link to={`/blogs/${post.slug}`} className="block">
                          <h4 className="font-bold leading-snug text-gray-900 group-hover:text-amber-600 transition mb-2 line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            <time dateTime={post.date}>
                              {formatDate(post.date)}
                            </time>
                          </p>
                        </Link>
                      </article>
                    ))}
                  </div>
                  <Link
                    to="/blogs"
                    className="inline-flex items-center gap-2 mt-8 font-semibold group"
                    style={{ color: ACCENT }}>
                    View All Articles
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition"
                    />
                  </Link>
                </div>

                {/* About the Author / Organization card */}
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                  <img
                    src={LOGO_URL}
                    alt="Ghar Ka Organic Logo"
                    className="h-12 w-auto mb-4"
                    width="120"
                    height="48"
                  />
                  <h3 className="font-bold text-xl mb-2">Ghar Ka Organic</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Pure, natural, and organic products delivered to your
                    doorstep. Rooted in tradition, made for modern living.
                  </p>
                  <Link
                    to={ABOUT_URL}
                    className="text-amber-600 font-semibold text-sm hover:underline inline-flex items-center gap-1">
                    Read our story →
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetailPage;
