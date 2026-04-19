import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Calendar, MessageCircle, ArrowRight, User, Clock } from "lucide-react";
import { blogData, getRecentBlogs } from "../data/blogData";

const ACCENT = "#F59E0B";
const YELLOW_BANNER = "#FDE047";
const TERRACOTTA = "#A16207";

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const BlogDetailPage = () => {
  const { slug } = useParams();
  const blog = blogData[slug];
  const recentArticles = getRecentBlogs(slug, 4);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Article not found</h1>
          <Link
            to="/blogs"
            className="text-sm font-semibold"
            style={{ color: ACCENT }}>
            Back to all articles
          </Link>
        </div>
      </div>
    );
  }

  const seoTitle = `${blog.title} | Ghar Ka Organic`;
  const seoDescription = blog.seo_description || blog.excerpt;
  const canonicalUrl = `https://gharkaorganic.com/blogs/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    image: `https://gharkaorganic.com${blog.image}`,
    datePublished: blog.date,
    dateModified: blog.updated_at || blog.date,
    author: {
      "@type": "Person",
      name: blog.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Ghar Ka Organic",
      logo: {
        "@type": "ImageObject",
        url: "https://gharkaorganic.com/gharka.png",
      },
    },
    description: seoDescription,
    mainEntityOfPage: canonicalUrl,
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={seoDescription} />
        <meta
          property="og:image"
          content={`https://gharkaorganic.com${blog.image}`}
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={blog.date} />
        <meta property="article:author" content={blog.author} />
        <meta property="article:section" content={blog.category} />
        {blog.tags?.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={seoDescription} />
        <meta
          name="twitter:image"
          content={`https://gharkaorganic.com${blog.image}`}
        />
      </Helmet>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <nav className="text-sm mb-8 text-gray-500">
          <Link to="/" className="hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/blogs" className="hover:text-gray-900">
            Blogs
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{blog.category}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          <aside className="hidden lg:block lg:col-span-2 pt-2">
            <div className="sticky top-24 space-y-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(blog.date)}</span>
              </div>
              {blog.comments_count > 0 && (
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} />
                  <span>{blog.comments_count} comments</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{blog.read_time}</span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <User size={16} />
                <span>{blog.author}</span>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4 lg:hidden">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> {formatDate(blog.date)}
              </span>
              {blog.comments_count > 0 && (
                <span className="flex items-center gap-1.5">
                  <MessageCircle size={14} /> {blog.comments_count}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {blog.read_time}
              </span>
            </div>

            {blog.banner_title && (
              <div
                className="px-4 sm:px-6 py-3 sm:py-4 mb-0"
                style={{ backgroundColor: YELLOW_BANNER }}>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-700 leading-snug">
                  {blog.banner_title}
                </h1>
              </div>
            )}

            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-auto object-cover"
              loading="eager"
            />

            <article className="mt-6 sm:mt-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {blog.title}
              </h2>

              <div
                className="prose prose-sm sm:prose-base max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600"
                style={{
                  "--tw-prose-links": ACCENT,
                  "--tw-prose-quote-borders": ACCENT,
                }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {blog.tags?.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/blogs?tag=${tag}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200">
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <img
                    src={blog.author_avatar || "/images/default-avatar.png"}
                    alt={blog.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{blog.author}</p>
                    <p className="text-sm text-gray-500">
                      {blog.author_bio ||
                        "Ayurvedic Health Coach at Ghar Ka Organic"}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </main>

          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <h3
                className="text-xl sm:text-2xl font-light mb-4 pb-3 border-b border-gray-200"
                style={{ color: ACCENT }}>
                Recent articles
              </h3>

              <div className="space-y-6">
                {recentArticles.map((post) => (
                  <article key={post.slug} className="group">
                    <h4 className="font-bold text-gray-900 leading-snug mb-1.5 group-hover:underline decoration-2 underline-offset-2">
                      <Link to={`/blogs/${post.slug}`}>{post.title}</Link>
                    </h4>
                    <p className="text-sm text-gray-500">
                      {formatDate(post.date)}
                    </p>
                  </article>
                ))}
              </div>

              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold"
                style={{ color: ACCENT }}>
                View all articles <ArrowRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
