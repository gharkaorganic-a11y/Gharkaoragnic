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
    url: `${SITE_URL}/pages/blogs`,
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
        url: `${SITE_URL}/pages/blogs/${post.slug}`,
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
        item: `${SITE_URL}/pages/blogs`,
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
        urlTemplate: `${SITE_URL}/pages/blogs?search={search_term_string}`,
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
        <link rel="canonical" href={`${SITE_URL}/pages/blogs`} />
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
        <meta property="og:url" content={`${SITE_URL}/pages/blogs`} />
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
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {selectedCategory
                ? `${selectedCategory} Articles`
                : debouncedSearch
                  ? `Search: "${debouncedSearch}"`
                  : "Organic Food Blogs & Recipes"}
            </h1>
            {!selectedCategory && !debouncedSearch && (
              <p className="text-gray-600 max-w-2xl lg:mx-0 mx-auto">
                100+ authentic articles on pahadi recipes, A2 ghee benefits,
                sustainable farming, and healthy living from the hills of
                Uttarakhand.
              </p>
            )}
            {isFiltered && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 mt-3 text-sm text-amber-600 hover:text-amber-700"
                aria-label="Clear all filters">
                <X size={14} /> Clear filters
              </button>
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
                <article className="mb-12 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="relative">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-500 text-white">
                        Featured
                      </span>
                    </div>
                    <Link to={`/pages/blogs/${featuredPost.slug}`}>
                      <picture>
                        <source
                          srcSet={featuredPost.image.replace(
                            /\.(jpg|png)$/,
                            ".webp",
                          )}
                          type="image/webp"
                        />
                        <img
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          loading="eager"
                          fetchpriority="high"
                          width="800"
                          height="400"
                          className="w-full h-64 sm:h-80 object-cover"
                          style={{ aspectRatio: "800/400" }}
                        />
                      </picture>
                    </Link>
                  </div>

                  <div className="p-6 sm:p-8">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 mb-4">
                      {featuredPost.category}
                    </span>

                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                      <Link
                        to={`/pages/blogs/${featuredPost.slug}`}
                        className="hover:text-amber-600 transition">
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="text-gray-600 leading-relaxed mb-4">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-5">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <time dateTime={featuredPost.date}>
                          {formatDate(featuredPost.date)}
                        </time>
                      </span>
                    </div>

                    <Link
                      to={`/pages/blogs/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg transition">
                      Read Full Article <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
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
                        className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                        <Link to={`/pages/blogs/${post.slug}`}>
                          <picture>
                            <source
                              srcSet={post.image.replace(
                                /\.(jpg|png)$/,
                                ".webp",
                              )}
                              type="image/webp"
                            />
                            <img
                              src={post.image}
                              alt={post.title}
                              loading="lazy"
                              width="400"
                              height="240"
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                              to={`/pages/blogs/${post.slug}`}
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
              <div className="sticky top-24 space-y-6">
                {/* Categories Widget */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-amber-200 inline-block">
                    Categories
                  </h3>
                  <nav aria-label="Blog categories" className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center transition ${
                        selectedCategory === null
                          ? "bg-amber-50 text-amber-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      aria-label="Show all articles">
                      <span>All Articles</span>
                      <span className="text-xs text-gray-400">
                        {allBlogs.length}
                      </span>
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center transition ${
                          selectedCategory === cat
                            ? "bg-amber-50 text-amber-600 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        aria-label={`Filter by ${cat}`}>
                        <span>{cat}</span>
                        <span className="text-xs text-gray-400">
                          {getBlogsByCategory(cat).length}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Recent Posts Widget */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-amber-200 inline-block">
                    Recent Posts
                  </h3>
                  <div className="space-y-4">
                    {filteredBlogs.slice(0, 5).map((post) => (
                      <Link
                        key={post.slug}
                        to={`/pages/blogs/${post.slug}`}
                        className="group block">
                        <h4 className="font-semibold text-gray-800 group-hover:text-amber-600 transition line-clamp-2 text-sm">
                          {post.title}
                        </h4>
                        <time
                          dateTime={post.date}
                          className="text-xs text-gray-400 mt-1 block">
                          {formatDate(post.date)}
                        </time>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* About Widget */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-100">
                  <img
                    src={LOGO_URL}
                    alt="Ghar Ka Organic Logo"
                    width="120"
                    height="48"
                    className="mb-3"
                  />
                  <h3 className="font-bold text-gray-900 mb-2">
                    About Ghar Ka Organic
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    Pure, natural, and organic products sourced directly from
                    Himalayan farms. Rooted in tradition, made for modern
                    living.
                  </p>
                  <Link
                    to="/pages/our-story"
                    className="text-amber-600 text-sm font-semibold hover:underline inline-flex items-center gap-1">
                    Read our story →
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
