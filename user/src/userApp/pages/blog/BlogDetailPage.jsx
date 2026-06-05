import React, { useMemo, useState } from "react";
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
const ABOUT_URL = "https://gharkaorganic.com/our-story";
const AUTHOR_PAGE = "https://gharkaorganic.com/pages/authors";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const getReadTimeSchema = (readTimeStr) => {
  const minutes = parseInt(readTimeStr?.match(/\d+/)?.[0]) || 5;
  return `PT${minutes}M`;
};

// Fallback banner component
const BlogImageFallback = ({ title, className = "" }) => (
  <div
    className={`w-full bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50 flex items-center justify-center ${className}`}>
    <div className="text-center px-6 py-12">
      <img
        src={LOGO_URL}
        alt="Ghar Ka Organic"
        className="w-24 mx-auto mb-3 opacity-90"
        width="96"
        height="96"
      />
      <p className="text-sm font-bold text-amber-800 uppercase tracking-wide line-clamp-2 max-w-xs">
        {title || "Ghar Ka Organic"}
      </p>
    </div>
  </div>
);

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [imgError, setImgError] = useState(false);

  const blog = getBlogBySlug(slug);
  const recentArticles = getRecentBlogs(slug, 4);

  // Memoize schemas with proper @graph structure
  const schemas = useMemo(() => {
    if (!blog) return null;

    const canonicalUrl = `${SITE_URL}/blogs/${slug}`;
    const featuredImage = blog.image?.startsWith("http")
      ? blog.image
      : blog.image
        ? `${SITE_URL}${blog.image}`
        : LOGO_URL;
    const seoDescription = blog.seo_description || blog.excerpt;
    const keywords = blog.tags?.join(", ");
    const readTimeDuration = getReadTimeSchema(blog.read_time);

    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          "@id": `${canonicalUrl}#article`,
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
            caption: blog.image_alt || blog.title,
          },
          datePublished: blog.date,
          dateModified: blog.updated_at || blog.date,
          author: {
            "@type": "Person",
            name: blog.author || "Ghar Ka Organic Team",
            url: `${AUTHOR_PAGE}/${blog.author?.toLowerCase().replace(/\s+/g, "-")}`,
          },
          publisher: {
            "@type": "Organization",
            name: "Ghar Ka Organic",
            logo: {
              "@type": "ImageObject",
              url: LOGO_URL,
              width: 600,
              height: 240,
            },
            url: SITE_URL,
          },
          articleSection: blog.category || "Organic Lifestyle",
          keywords: keywords,
          wordCount: blog.word_count || 1200,
          timeRequired: readTimeDuration,
          inLanguage: "en-IN",
          isAccessibleForFree: true,
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: ["h1", ".blog-content p:first-of-type"],
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
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
              name: blog.category || "Article",
              item: `${SITE_URL}/blogs?category=${encodeURIComponent(blog.category || "")}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: blog.title,
              item: canonicalUrl,
            },
          ],
        },
        {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "Ghar Ka Organic",
          url: SITE_URL,
          logo: LOGO_URL,
          description:
            "Pure, natural, and organic products from Uttarakhand delivered across India.",
          sameAs: [
            "https://facebook.com/gharkaorganic",
            "https://instagram.com/gharkaorganic",
            "https://twitter.com/gharkaorganic",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Support",
            telephone: "+91-9897447525",
            email: "gharkaorganic@gmail.com",
          },
        },
      ],
    };
  }, [blog, slug]);

  // Not found handling
  if (!blog) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <img
            src={LOGO_URL}
            alt="Ghar Ka Organic"
            className="w-24 mx-auto mb-6 opacity-80"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The article you are looking for does not exist or has been moved.
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 font-semibold px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition"
            style={{ backgroundColor: ACCENT }}>
            Back to Blogs
          </Link>
        </div>
      </section>
    );
  }

  const canonicalUrl = `${SITE_URL}/blogs/${slug}`;
  const seoTitle = blog.meta_title || `${blog.title} | Ghar Ka Organic Blog`;
  const seoDescription = blog.seo_description || blog.excerpt;
  const keywords = blog.tags?.join(", ");
  const featuredImage = blog.image?.startsWith("http")
    ? blog.image
    : blog.image
      ? `${SITE_URL}${blog.image}`
      : null;
  const blogImageAlt = blog.image_alt || blog.title;

  // Get WebP image safely
  const getWebPImage = (imgUrl) => {
    if (!imgUrl) return null;
    return imgUrl.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  };

  // Share URLs
  const shareUrl = encodeURIComponent(canonicalUrl);
  const shareText = encodeURIComponent(blog.title);

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={keywords} />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1"
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="author" content={blog.author || "Ghar Ka Organic"} />

        {featuredImage && (
          <link rel="preload" as="image" href={featuredImage} />
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={featuredImage || LOGO_URL} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={blogImageAlt} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Ghar Ka Organic" />
        <meta property="og:locale" content="en_IN" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={featuredImage || LOGO_URL} />
        <meta name="twitter:site" content="@gharkaorganic" />

        <meta property="article:published_time" content={blog.date} />
        <meta
          property="article:modified_time"
          content={blog.updated_at || blog.date}
        />
        <meta property="article:section" content={blog.category} />
        {blog.tags?.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {schemas && (
          <script type="application/ld+json">{JSON.stringify(schemas)}</script>
        )}
      </Helmet>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-amber-500 text-white px-4 py-2 rounded-md z-50">
        Skip to main content
      </a>

      <div className="bg-white text-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-gray-500 mb-6 lg:mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <li>
                <Link to="/" className="hover:text-amber-600 transition">
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link to="/blogs" className="hover:text-amber-600 transition">
                  Blogs
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link
                  to={`/blogs?category=${encodeURIComponent(blog.category || "")}`}
                  className="hover:text-amber-600 transition">
                  {blog.category}
                </Link>
              </li>
              <li className="text-gray-400 hidden sm:block">/</li>
              <li
                className="text-gray-900 truncate max-w- sm:max-w-none"
                aria-current="page">
                {blog.title}
              </li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* MAIN CONTENT */}
            <main id="main-content" className="lg:col-span-8">
              {/* Category */}
              <div className="mb-4">
                <span
                  className="inline-flex px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase"
                  style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
                  {blog.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight tracking-tight mb-4 lg:mb-5 text-gray-900">
                {blog.title}
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-sm text-gray-500 border-b border-gray-200 pb-5 lg:pb-6 mb-6 lg:mb-8">
                <span className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-amber-600" />
                  <time dateTime={blog.date}>{formatDate(blog.date)}</time>
                </span>
                <span className="flex items-center gap-2">
                  <Clock3 size={16} className="text-amber-600" />
                  <span>{blog.read_time}</span>
                </span>
                <span className="text-gray-600">
                  By{" "}
                  <a
                    href={`${AUTHOR_PAGE}/${blog.author?.toLowerCase().replace(/\s+/g, "-")}`}
                    className="font-semibold hover:text-amber-600 transition">
                    {blog.author || "Ghar Ka Organic"}
                  </a>
                </span>
              </div>

              {/* Optional banner */}
              {blog.banner_title && (
                <div
                  className="rounded-t-2xl px-5 py-4 mb-0"
                  style={{ backgroundColor: YELLOW_BANNER }}>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-700">
                    {blog.banner_title}
                  </h2>
                </div>
              )}

              {/* Feature Image with Fallback */}
              <div
                className={`overflow-hidden shadow-md ${blog.banner_title ? "rounded-b-2xl" : "rounded-2xl"}`}>
                {!imgError && featuredImage ? (
                  <picture>
                    {getWebPImage(featuredImage) && (
                      <source
                        srcSet={getWebPImage(featuredImage)}
                        type="image/webp"
                      />
                    )}
                    <img
                      src={featuredImage}
                      alt={blogImageAlt}
                      className="w-full h-auto object-cover"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      width="1200"
                      height="630"
                      style={{ aspectRatio: "1200/630" }}
                      onError={() => setImgError(true)}
                    />
                  </picture>
                ) : (
                  <BlogImageFallback
                    title={blog.title}
                    className="aspect-[1200/630]"
                  />
                )}
              </div>

              {/* Content */}
              <article
                className="blog-content prose prose-sm sm:prose-base lg:prose-lg max-w-none mt-8 lg:mt-10
                  prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-gray-700 prose-p:leading-7 sm:prose-p:leading-8 prose-p:mb-4
                  prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-a:font-semibold
                  prose-img:rounded-xl prose-img:shadow-md prose-img:my-8
                  prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:italic prose-blockquote:bg-amber-50 prose-blockquote:py-2 prose-blockquote:px-4
                  prose-li:marker:text-amber-500 prose-ul:my-4 prose-ol:my-4
                  prose-strong:text-gray-900 prose-strong:font-bold"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <section className="mt-10 lg:mt-12 pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-lg mb-4 text-gray-900">
                    Related Topics
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {blog.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/blogs?tag=${encodeURIComponent(tag)}`}
                        className="px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-sm font-medium text-amber-800 border border-amber-100 transition-all hover:shadow-sm"
                        rel="tag">
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Social Share Buttons */}
              <section className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900">
                  <Share2 size={18} className="text-amber-600" /> Share this
                  article
                </h3>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50 border border-gray-200 hover:border-blue-200 transition group"
                    aria-label="Share on Facebook">
                    <Facebook
                      size={20}
                      className="text-gray-600 group-hover:text-blue-600"
                    />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="p-3 bg-gray-50 rounded-xl hover:bg-sky-50 border border-gray-200 hover:border-sky-200 transition group"
                    aria-label="Share on Twitter">
                    <Twitter
                      size={20}
                      className="text-gray-600 group-hover:text-sky-500"
                    />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50 border border-gray-200 hover:border-blue-200 transition group"
                    aria-label="Share on LinkedIn">
                    <Linkedin
                      size={20}
                      className="text-gray-600 group-hover:text-blue-700"
                    />
                  </a>
                  <a
                    href={`mailto:?subject=${shareText}&body=${shareUrl}`}
                    className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition group"
                    aria-label="Share via Email">
                    <Mail
                      size={20}
                      className="text-gray-600 group-hover:text-gray-900"
                    />
                  </a>
                </div>
              </section>
            </main>

            {/* SIDEBAR */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6 lg:space-y-8">
                {/* Recent Articles */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
                  <h3
                    className="text-xl font-bold mb-5 pb-3 border-b-2 inline-block"
                    style={{ color: ACCENT, borderColor: "#FDE68A" }}>
                    Recent Articles
                  </h3>
                  <div className="space-y-5">
                    {recentArticles.map((post) => (
                      <article
                        key={post.slug}
                        className="group border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <Link to={`/blogs/${post.slug}`} className="block">
                          <h4 className="font-bold leading-snug text-gray-900 group-hover:text-amber-600 transition mb-2 line-clamp-2 text-sm sm:text-base">
                            {post.title}
                          </h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <CalendarDays size={12} />
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
                    className="inline-flex items-center gap-2 mt-6 font-semibold text-sm group"
                    style={{ color: ACCENT }}>
                    View All Articles
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>

                {/* About the Organization */}
                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-6 sm:p-7 border border-amber-100">
                  <img
                    src={LOGO_URL}
                    alt="Ghar Ka Organic Logo"
                    className="h-14 w-auto mb-4"
                    width="120"
                    height="56"
                  />
                  <h3 className="font-bold text-xl mb-3 text-gray-900">
                    About Ghar Ka Organic
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">
                    Pure, natural, and organic products sourced directly from
                    Himalayan farms. Rooted in Uttarakhand tradition, delivered
                    across India.
                  </p>
                  <Link
                    to={ABOUT_URL}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition shadow-sm hover:shadow text-sm">
                    Read Our Story
                    <ArrowRight size={16} />
                  </Link>
                </div>

                {/* Newsletter CTA - New Addition */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-7 text-white">
                  <h3 className="font-bold text-xl mb-2">
                    Join Our Organic Journey
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Get weekly tips on organic living, recipes, and exclusive
                    offers from the Himalayas.
                  </p>
                  <Link
                    to="/newsletter"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition text-sm">
                    Subscribe Now
                    <ArrowRight size={16} />
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
