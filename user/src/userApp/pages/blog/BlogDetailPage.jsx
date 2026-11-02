import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";
import { getBlogBySlug, getRecentBlogs } from "../data/blogData";

const SITE_URL = "https://gharkaorganic.com";
const LOGO_URL = "https://gharkaorganic.com/logo/gharka-logo.png";
const AUTHOR_PAGE = "https://gharkaorganic.com/pages/authors";
const DEFAULT_BLOG_IMAGE =
  "https://res.cloudinary.com/dwgro3zo7/image/upload/v1776768403/Local_women_in_Bhimtal_Uttarakhand_preparing_traditional_Himalayan_organic_food_tbpvgk.webp";

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
          <h1 className="text-3xl font-light text-[#121212] mb-3">
            Article Not Found
          </h1>
          <p className="text-neutral-600 mb-6 font-light">
            The article you are looking for does not exist or has been moved.
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 font-medium px-6 py-2.5 bg-[#121212] text-white rounded-full hover:bg-neutral-800 transition">
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

      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#315c3c] text-white px-4 py-2 rounded-sm z-50 shadow-md">
        Skip to main content
      </a>

      <div className="bg-white text-[#121212] font-sans selection:bg-[#ebe7df] selection:text-[#121212] min-h-screen">
        {/* SUBTLE BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 text-xs tracking-wider uppercase text-neutral-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                to="/"
                className="hover:text-neutral-900 transition-colors font-medium">
                Home
              </Link>
            </li>
            <li className="text-neutral-300">/</li>
            <li>
              <Link
                to="/blogs"
                className="hover:text-neutral-900 transition-colors font-medium">
                Blogs
              </Link>
            </li>
            {blog.category && (
              <>
                <li className="text-neutral-300">/</li>
                <li>
                  <Link
                    to={`/blogs?category=${encodeURIComponent(blog.category)}`}
                    className="hover:text-neutral-900 transition-colors font-medium">
                    {blog.category}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* ARTICLE HERO IMAGE CONTAINER (16:9 PROPORTION MATCHING NAMAKWALI) */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6">
          <div className="w-full aspect-[16/9] sm:aspect-[21/10] overflow-hidden bg-neutral-100 rounded-sm">
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
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width="1200"
                  height="630"
                  onError={() => setImgError(true)}
                />
              </picture>
            ) : (
              <img
                src={DEFAULT_BLOG_IMAGE}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* ARTICLE HEADER & EDITORIAL COLUMN */}
        <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
          <header className="pt-4 pb-8 border-b border-neutral-200">
            {/* Category */}
            {blog.category && (
              <div className="mb-3">
                <Link
                  to={`/blogs?category=${encodeURIComponent(blog.category)}`}
                  className="text-xs uppercase tracking-[0.2em] font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                  {blog.category}
                </Link>
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.25] tracking-tight text-[#121212] mb-4">
              {blog.title}
            </h1>

            {/* Meta info: Date, Read Time, Author */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-[13px] tracking-wider uppercase text-neutral-500 font-light pt-1">
              <time dateTime={blog.date}>{formatDate(blog.date)}</time>
              {blog.read_time && (
                <>
                  <span className="text-neutral-300">•</span>
                  <span>{blog.read_time}</span>
                </>
              )}
              {blog.author && (
                <>
                  <span className="text-neutral-300">•</span>
                  <span>By {blog.author}</span>
                </>
              )}
            </div>

            {/* Social Share Icons */}
            <div className="flex items-center gap-2 pt-6">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 mr-2">
                Share:
              </span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-8 h-8 rounded-full border border-neutral-200 hover:border-neutral-900 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="Share on Facebook">
                <Facebook size={14} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-8 h-8 rounded-full border border-neutral-200 hover:border-neutral-900 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="Share on Twitter">
                <Twitter size={14} />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-8 h-8 rounded-full border border-neutral-200 hover:border-neutral-900 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="Share on LinkedIn">
                <Linkedin size={14} />
              </a>
              <a
                href={`mailto:?subject=${shareText}&body=${shareUrl}`}
                className="w-8 h-8 rounded-full border border-neutral-200 hover:border-neutral-900 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="Share via Email">
                <Mail size={14} />
              </a>
            </div>
          </header>

          {/* Optional banner title */}
          {blog.banner_title && (
            <div className="my-8 py-3 px-5 bg-neutral-100 border-l-2 border-[#121212] text-sm md:text-base font-medium text-[#121212]">
              {blog.banner_title}
            </div>
          )}

          {/* ARTICLE BODY - NAMAKWALI TYPOGRAPHY & SPACING */}
          <article
            className="blog-content pt-8 text-[#2c2c2c] text-[16px] sm:text-[17.5px] leading-[2.05] md:leading-[2.2] font-light
              [&>h2]:text-2xl [&>h2]:sm:text-[28px] [&>h2]:font-normal [&>h2]:text-[#121212] [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:tracking-tight
              [&>h3]:text-xl [&>h3]:sm:text-[22px] [&>h3]:font-normal [&>h3]:text-[#121212] [&>h3]:mt-10 [&>h3]:mb-3
              [&>h4]:text-lg [&>h4]:font-medium [&>h4]:text-[#121212] [&>h4]:mt-6 [&>h4]:mb-2
              [&>p]:mb-6 [&>p]:leading-relaxed
              [&>ul]:my-6 [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:list-disc [&>ul]:text-[#333333]
              [&>ol]:my-6 [&>ol]:pl-6 [&>ol]:space-y-2 [&>ol]:list-decimal [&>ol]:text-[#333333]
              [&>blockquote]:border-l-2 [&>blockquote]:border-[#121212] [&>blockquote]:pl-5 [&>blockquote]:italic [&>blockquote]:text-neutral-700 [&>blockquote]:my-8
              [&>img]:rounded-sm [&>img]:my-8 [&>img]:w-full [&>img]:h-auto
              [&>a]:text-[#121212] [&>a]:underline [&>a]:underline-offset-4 [&>a]:hover:text-neutral-600
              [&>strong]:font-semibold [&>strong]:text-[#121212]"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* TAGS */}
          {blog.tags?.length > 0 && (
            <div className="mt-12 pt-6 border-t border-neutral-200">
              <span className="block text-xs uppercase tracking-wider text-neutral-400 mb-3">
                Topics:
              </span>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blogs?search=${encodeURIComponent(tag)}`}
                    className="px-3.5 py-1 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                    rel="tag">
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* BACK TO BLOGS BUTTON (NAMAKWALI ARTICLE-TEMPLATE__BACK) */}
          <div className="pt-16 pb-6 text-center border-t border-neutral-200 mt-16">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-[0.18em] text-[#121212] hover:text-neutral-600 transition-colors">
              <span aria-hidden="true">←</span> Back to blog
            </Link>
          </div>
        </main>

        {/* RELATED ARTICLES - 2-COLUMN MINIMALIST GRID */}
        {recentArticles.length > 0 && (
          <section className="border-t border-neutral-200 pt-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-normal tracking-[0.18em] text-[#121212] uppercase">
                More From Our Journal
              </h2>
              <div
                className="w-8 h-[1px] bg-[#121212]/20 mx-auto mt-3"
                aria-hidden="true"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-12">
              {recentArticles.slice(0, 2).map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col cursor-pointer">
                  <Link
                    to={`/blogs/${post.slug}`}
                    className="relative block w-full aspect-[16/9] overflow-hidden bg-neutral-100 rounded-sm">
                    <img
                      src={post.image || DEFAULT_BLOG_IMAGE}
                      alt={post.title}
                      loading="lazy"
                      width="720"
                      height="405"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {post.category && (
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#121212] text-[10px] sm:text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-xs">
                        {post.category}
                      </span>
                    )}
                  </Link>

                  <div className="pt-5 sm:pt-6 flex flex-col flex-1">
                    <h3 className="text-xl sm:text-2xl font-normal text-[#121212] leading-snug tracking-tight mb-2 group-hover:underline underline-offset-4 decoration-1 transition-all">
                      <Link to={`/blogs/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <div className="text-xs sm:text-[13px] tracking-wider uppercase text-neutral-500 font-light mb-3">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </div>

                    <p className="text-neutral-600 font-light text-[14px] sm:text-[15.5px] leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto pt-1">
                      <Link
                        to={`/blogs/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#121212] group-hover:gap-2.5 transition-all">
                        Read article <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default BlogDetailPage;