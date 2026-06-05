import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Calendar, MessageCircle, ArrowRight, Search, X } from "lucide-react";
import {
  allBlogs,
  getAllCategories,
  getBlogsByCategory,
  searchBlogs,
} from "../data/blogData";

const ACCENT = "#F59E0B";
const SITE_URL = "https://gharkaorganic.com";
const LOGO_URL = "https://gharkaorganic.com/logo/gharka-logo.png";
const DEFAULT_BLOG_IMAGE =
  "https://res.cloudinary.com/dwgro3zo7/image/upload/v1776768403/Local_women_in_Bhimtal_Uttarakhand_preparing_traditional_Himalayan_organic_food_tbpvgk.webp";
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

// Debounce utility for search
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const BlogListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Parse URL query params on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const search = params.get("search");
    if (category && getAllCategories().includes(category)) {
      setSelectedCategory(category);
    }
    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (debouncedSearch) params.set("search", debouncedSearch);
    const newUrl = `${location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    navigate(newUrl, { replace: true });
    setCurrentPage(1); // Reset pagination on filter change
  }, [selectedCategory, debouncedSearch, navigate, location.pathname]);

  // Filter blogs based on category and search
  const filteredBlogs = useMemo(() => {
    let result = [...allBlogs];

    if (selectedCategory) {
      result = getBlogsByCategory(selectedCategory);
    }

    if (debouncedSearch.trim()) {
      result = result.filter((blog) =>
        searchBlogs(debouncedSearch).some((b) => b.slug === blog.slug),
      );
    }

    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [selectedCategory, debouncedSearch]);

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);
  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return filteredBlogs.slice(start, start + postsPerPage);
  }, [filteredBlogs, currentPage]);

  const featuredPost = allBlogs.find((b) => b.featured) || allBlogs[0];
  const categories = getAllCategories();

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setCurrentPage(1);
  };

  // SEO Schema with ItemList for better search visibility
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Organic Food Blogs & Recipes | Ghar Ka Organic",
    description:
      "100+ organic food blogs, pahadi recipes, desi ghee benefits, health tips, and sustainable farming insights.",
    url: `${SITE_URL}/blogs`,
    publisher: {
      "@type": "Organization",
      name: "Ghar Ka Organic",
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: filteredBlogs.slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/blogs/${post.slug}`,
        name: post.title,
        description: post.excerpt,
      })),
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
        name: "Blog",
        item: `${SITE_URL}/blogs`,
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ghar Ka Organic",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blogs?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const isFiltered = selectedCategory || debouncedSearch;
  const showNoResults = filteredBlogs.length === 0 && isFiltered;

  return (
    <>
      <Helmet>
        <title>
          {selectedCategory
            ? `${selectedCategory} Articles | Organic Food Blogs`
            : debouncedSearch
              ? `Search Results for "${debouncedSearch}" | Organic Food Blogs`
              : "Organic Food Blogs, Recipes & Health Tips | Ghar Ka Organic"}
        </title>
        <meta
          name="description"
          content={
            selectedCategory
              ? `Explore our ${selectedCategory} articles. ${categories.length}+ categories of organic food blogs, recipes, and health tips.`
              : debouncedSearch
                ? `Search results for "${debouncedSearch}". Find organic food blogs, recipes, and health tips at Ghar Ka Organic.`
                : "100+ organic food blogs: pahadi recipes, A2 ghee benefits, desi cow farming, sustainable agriculture, and health tips from rural entrepreneurs."
          }
        />
        <link rel="canonical" href={`${SITE_URL}/blogs`} />
        <meta
          name="robots"
          content={`index, follow, max-image-preview:large${showNoResults ? ", noindex" : ""}`}
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={
            selectedCategory
              ? `${selectedCategory} | Ghar Ka Organic Blog`
              : "Organic Food Blogs & Recipes | Ghar Ka Organic"
          }
        />
        <meta
          property="og:description"
          content={
            selectedCategory
              ? `Browse our ${selectedCategory} collection of organic food articles.`
              : "100+ articles on organic food, recipes, health, farming, and sustainability."
          }
        />
        <meta property="og:url" content={`${SITE_URL}/blogs`} />
        <meta property="og:site_name" content="Ghar Ka Organic" />
        <meta
          property="og:image"
          content={`${SITE_URL}${featuredPost.image}`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Organic Food Blogs & Recipes | Ghar Ka Organic"
        />
        <meta
          name="twitter:description"
          content="100+ articles on organic food, recipes, health, and sustainable farming."
        />
        <meta
          name="twitter:image"
          content={`${SITE_URL}${featuredPost.image}`}
        />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(blogListSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      </Helmet>

      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-amber-500 text-white px-4 py-2 rounded-md z-50">
        Skip to main content
      </a>

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex flex-wrap items-center gap-2 text-sm">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium" aria-current="page">
              Blog
            </li>
          </ol>
        </div>
      </nav>

      <main id="main-content" className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 rounded-full bg-amber-500"></div>

              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-600">
                  Organic Knowledge Hub
                </span>

                <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {selectedCategory
                    ? `${selectedCategory} Articles`
                    : debouncedSearch
                      ? "Search Results"
                      : "Ghar Ka Organic Blogs"}
                </h1>
              </div>
            </div>

            {!selectedCategory && !debouncedSearch && (
              <p className="max-w-2xl text-sm md:text-base text-gray-600 leading-relaxed">
                Discover authentic Himalayan ingredients, traditional
                Uttarakhand foods, organic farming wisdom, health benefits,
                recipes, and stories from the mountains.
              </p>
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-8 max-w-md mx-auto lg:mx-0">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search articles by title, category, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                aria-label="Search articles"
              />
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Featured Post - Only show when no filters */}
              {!isFiltered && featuredPost && (
                <section className="mb-10">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-6 rounded-full bg-amber-500"></div>

                    <div>
                      <span className="block text-[10px] uppercase tracking-[0.18em] font-semibold text-amber-600">
                        Editor's Picks
                      </span>

                      <h2 className="text-lg md:text-xl font-bold text-gray-900">
                        Featured Articles
                      </h2>
                    </div>
                  </div>

                  {/* Featured Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {allBlogs
                      .filter((blog) => blog.featured)
                      .slice(0, 2)
                      .map((post) => (
                        <article
                          key={post.slug}
                          className="
                group
                bg-white
                rounded-2xl
                overflow-hidden
                border border-amber-100
                hover:border-amber-300
                hover:shadow-xl
                hover:-translate-y-1
                transition-all duration-300
              ">
                          {/* Image */}
                          <Link
                            to={`/blogs/${post.slug}`}
                            className="relative block overflow-hidden">
                            <img
                              src={post.image || DEFAULT_BLOG_IMAGE}
                              alt={post.title}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = DEFAULT_BLOG_IMAGE;
                              }}
                              className="
    w-full
    h-48
    sm:h-56
    md:h-auto
    md:aspect-[16/10]
    object-cover
    group-hover:scale-105
    transition-transform duration-700
  "
                            />

                            <span
                              className="
                  absolute top-3 left-3
                  bg-white/90 backdrop-blur-sm
                  px-2.5 py-1
                  rounded-full
                  text-[10px]
                  font-bold
                  text-amber-700
                  shadow-sm
                ">
                              Featured
                            </span>
                          </Link>

                          {/* Content */}
                          <div className="p-4 md:p-5 flex flex-col h-full">
                            {" "}
                            <span
                              className="
                    inline-flex
                    px-2.5 py-1
                    rounded-full
                    text-[11px]
                    font-semibold
                    bg-gradient-to-r
                    from-amber-100
                    to-orange-100
                    text-amber-800
                    mb-2
                  ">
                              {post.category}
                            </span>
                            <h3
                              className="
    text-sm
    sm:text-base
    md:text-lg
    font-bold
    text-gray-900
    leading-6
    line-clamp-2
    break-words
    mb-2
  ">
                              <Link
                                to={`/blogs/${post.slug}`}
                                className="hover:text-amber-600 transition-colors">
                                {post.title}
                              </Link>
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-3">
                              <time className="text-gray-400">
                                {formatDate(post.date)}
                              </time>

                              <Link
                                to={`/blogs/${post.slug}`}
                                className="
                      font-semibold
                      text-amber-600
                      hover:text-amber-700
                      transition-colors
                    ">
                                Read →
                              </Link>
                            </div>
                          </div>
                        </article>
                      ))}
                  </div>
                </section>
              )}

              {/* Blog Grid Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                  {filteredBlogs.length === 0 && isFiltered
                    ? "No articles found"
                    : `Latest Articles (${filteredBlogs.length})`}
                </h2>
              </div>

              {/* Blog Grid */}
              {filteredBlogs.length > 0 ? (
                <>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {paginatedBlogs.map((post) => (
                      <article
                        key={post.slug}
                        className="
    group
    flex flex-col
    h-full
    bg-white
    rounded-2xl
    overflow-hidden
    border border-amber-100
    hover:border-amber-300
    hover:shadow-xl
    hover:-translate-y-1
    transition-all duration-300
  ">
                        <Link to={`/blogs/${post.slug}`}>
                          <picture>
                            <source
                              srcSet={post.image.replace(
                                /\.(jpg|png)$/,
                                ".webp",
                              )}
                              type="image/webp"
                            />
                            <img
                              src={post.image || DEFAULT_BLOG_IMAGE}
                              alt={post.title}
                              loading="lazy"
                              width="400"
                              height="240"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = DEFAULT_BLOG_IMAGE;
                              }}
                              className="
    w-full
    h-48
    object-cover
    group-hover:scale-105
    transition-transform
    duration-300
  "
                              style={{ aspectRatio: "400/240" }}
                            />
                          </picture>
                        </Link>
                        <div className="p-5">
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 mb-3">
                            {post.category}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            <Link
                              to={`/blogs/${post.slug}`}
                              className="hover:text-amber-600 transition">
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              <time dateTime={post.date}>
                                {formatDate(post.date)}
                              </time>
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav
                      className="flex justify-center gap-2 mt-10"
                      aria-label="Blog pagination">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                        aria-label="Previous page">
                        Previous
                      </button>
                      <div className="flex gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-10 h-10 rounded-lg font-medium transition ${
                                  currentPage === pageNum
                                    ? "bg-amber-500 text-white"
                                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                                aria-label={`Page ${pageNum}`}
                                aria-current={
                                  currentPage === pageNum ? "page" : undefined
                                }>
                                {pageNum}
                              </button>
                            );
                          },
                        )}
                      </div>
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                        aria-label="Next page">
                        Next
                      </button>
                    </nav>
                  )}
                </>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                  <p className="text-gray-500 mb-4">
                    No articles found matching your criteria.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-amber-600 font-semibold hover:underline">
                    Clear filters and browse all articles
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* Recent Posts */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-5">
                    Recent Posts
                  </h3>

                  <div className="space-y-3">
                    {filteredBlogs.slice(0, 5).map((post) => (
                      <Link
                        key={post.slug}
                        to={`/blogs/${post.slug}`}
                        className="block p-3 rounded-xl hover:bg-amber-50 transition">
                        <h4 className="font-semibold text-sm text-gray-800 line-clamp-2">
                          {post.title}
                        </h4>

                        <time className="text-xs text-gray-400 mt-2 block">
                          {formatDate(post.date)}
                        </time>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Popular Articles */}
                <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl border border-amber-100 p-6">
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-5">
                    Popular Articles
                  </h3>

                  <ul className="space-y-4">
                    {allBlogs.slice(0, 4).map((blog, i) => (
                      <li key={blog.slug} className="flex gap-3">
                        <span className="text-amber-500 font-bold">
                          0{i + 1}
                        </span>

                        <Link
                          to={`/blogs/${blog.slug}`}
                          className="text-sm font-medium text-gray-700 hover:text-amber-600">
                          {blog.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* About */}
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-7 border border-amber-100">
                  <img
                    src={LOGO_URL}
                    alt="Ghar Ka Organic"
                    className="w-32 mb-5"
                  />

                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">
                    About Ghar Ka Organic
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed mb-5">
                    Pure, natural, and organic products sourced directly from
                    Himalayan farms.
                  </p>

                  <Link
                    to="/our-story"
                    className="inline-flex items-center px-5 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition">
                    Read Our Story
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default BlogListPage;
