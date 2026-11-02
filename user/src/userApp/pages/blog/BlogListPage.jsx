import React, { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import {
  allBlogs,
  getAllCategories,
  getBlogsByCategory,
  searchBlogs,
} from "../data/blogData";

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
  const postsPerPage = 10; // Balanced 2-column layout like Namakwali

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
  }, [filteredBlogs, currentPage, postsPerPage]);

  const featuredPost = allBlogs.find((b) => b.featured) || allBlogs[0];
  const categories = getAllCategories();

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setCurrentPage(1);
  };

  // SEO Schema with ItemList for search visibility
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
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#315c3c] text-white px-4 py-2 rounded-sm z-50 shadow-md">
        Skip to main content
      </a>

      <div className="bg-white min-h-screen text-[#121212] font-sans selection:bg-[#ebe7df] selection:text-[#121212]">
        {/* SUBTLE BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 text-xs tracking-wider uppercase text-neutral-400">
          <ol className="flex items-center gap-2">
            <li>
              <Link
                to="/"
                className="hover:text-neutral-900 transition-colors font-medium">
                Home
              </Link>
            </li>
            <li className="text-neutral-300">/</li>
            <li className="text-neutral-700 font-medium" aria-current="page">
              Blogs
            </li>
          </ol>
        </nav>

        {/* MAIN BLOG SECTION (NAMAKWALI BLOGS STYLE) */}
        <main
          id="main-content"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 md:pb-28">
          {/* BLOG HEADER */}
          <header className="mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-[42px] font-normal tracking-tight text-[#121212] leading-tight">
                  {selectedCategory
                    ? `${selectedCategory} Articles`
                    : debouncedSearch
                      ? `Search: "${debouncedSearch}"`
                      : "Ghar Ka Organic Blogs"}
                </h1>
                {!selectedCategory && !debouncedSearch && (
                  <p className="text-neutral-600 text-sm md:text-base font-light max-w-2xl mt-3 leading-relaxed">
                    Discover authentic Himalayan ingredients, traditional
                    Uttarakhand recipes, A2 ghee benefits, organic farming
                    wisdom, and wholesome living from the mountains.
                  </p>
                )}
              </div>

              {/* SEARCH INPUT */}
              <div className="relative w-full md:w-72 shrink-0">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-sm bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 rounded-full focus:outline-none focus:border-neutral-900 transition-colors"
                  aria-label="Search articles"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    aria-label="Clear search">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* CATEGORY FILTER PILLS */}
            <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none no-scrollbar text-xs md:text-sm">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-1.5 rounded-full transition-all shrink-0 font-medium ${
                  !selectedCategory
                    ? "bg-[#121212] text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
                }`}>
                All Articles
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setSelectedCategory(cat === selectedCategory ? null : cat)
                  }
                  className={`px-4 py-1.5 rounded-full transition-all shrink-0 font-medium ${
                    selectedCategory === cat
                      ? "bg-[#121212] text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
                  }`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* ACTIVE FILTER NOTICE */}
            {isFiltered && (
              <div className="flex items-center justify-between pt-2 text-xs text-neutral-500">
                <span>
                  Showing {filteredBlogs.length}{" "}
                  {filteredBlogs.length === 1 ? "article" : "articles"}
                </span>
                <button
                  onClick={clearFilters}
                  className="text-neutral-900 font-medium hover:underline">
                  Clear all filters
                </button>
              </div>
            )}
          </header>

          {/* 2-COLUMN ARTICLE GRID (MATCHING NAMAKWALI BLOG-ARTICLES) */}
          {filteredBlogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-12 lg:gap-y-16">
                {paginatedBlogs.map((post) => (
                  <article
                    key={post.slug}
                    className="group flex flex-col cursor-pointer">
                    {/* ARTICLE IMAGE CONTAINER (16:9 RATIO LIKE NAMAKWALI) */}
                    <Link
                      to={`/blogs/${post.slug}`}
                      className="relative block w-full aspect-[16/9] overflow-hidden bg-neutral-100 rounded-sm">
                      <picture>
                        <source
                          srcSet={post.image.replace(/\.(jpg|png)$/, ".webp")}
                          type="image/webp"
                        />
                        <img
                          src={post.image || DEFAULT_BLOG_IMAGE}
                          alt={post.title}
                          loading="lazy"
                          width="720"
                          height="405"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = DEFAULT_BLOG_IMAGE;
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </picture>
                      {post.category && (
                        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#121212] text-[10px] sm:text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-xs">
                          {post.category}
                        </span>
                      )}
                    </Link>

                    {/* ARTICLE CONTENT MATCHING NAMAKWALI */}
                    <div className="pt-5 sm:pt-6 flex flex-col flex-1">
                      <h2 className="text-xl sm:text-2xl font-normal text-[#121212] leading-snug tracking-tight mb-2 group-hover:underline underline-offset-4 decoration-1 transition-all">
                        <Link to={`/blogs/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>

                      <div className="text-xs sm:text-[13px] tracking-wider uppercase text-neutral-500 font-light mb-3">
                        <time dateTime={post.date}>
                          {formatDate(post.date)}
                        </time>
                      </div>

                      <p className="text-neutral-600 font-light text-[14.5px] sm:text-[15.5px] leading-relaxed line-clamp-3 mb-4">
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

              {/* NAMAKWALI-STYLE MINIMALIST PAGINATION */}
              {totalPages > 1 && (
                <nav
                  className="flex justify-center items-center gap-1 sm:gap-2 mt-16 pt-10 border-t border-neutral-100"
                  aria-label="Pagination">
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={currentPage === 1}
                    className="p-2 sm:px-3 text-neutral-500 hover:text-neutral-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page">
                    <svg
                      className="w-3.5 h-3.5 rotate-180"
                      viewBox="0 0 10 6"
                      fill="currentColor"
                      aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
                      />
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((pageNum) => {
                      return (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        Math.abs(pageNum - currentPage) <= 1
                      );
                    })
                    .reduce((acc, pageNum, idx, arr) => {
                      if (idx > 0 && pageNum - arr[idx - 1] > 1) {
                        acc.push({
                          type: "ellipsis",
                          key: `ellipsis-${pageNum}`,
                        });
                      }
                      acc.push({ type: "page", pageNum, key: pageNum });
                      return acc;
                    }, [])
                    .map((item) =>
                      item.type === "ellipsis" ? (
                        <span key={item.key} className="px-2 text-neutral-400">
                          …
                        </span>
                      ) : (
                        <button
                          key={item.key}
                          onClick={() => {
                            setCurrentPage(item.pageNum);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`min-w-9 h-9 px-2 text-sm transition-all ${
                            currentPage === item.pageNum
                              ? "font-semibold text-[#121212] border-b-2 border-[#121212]"
                              : "text-neutral-500 hover:text-neutral-900"
                          }`}
                          aria-current={
                            currentPage === item.pageNum ? "page" : undefined
                          }>
                          {item.pageNum}
                        </button>
                      ),
                    )}

                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={currentPage === totalPages}
                    className="p-2 sm:px-3 text-neutral-500 hover:text-neutral-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page">
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 10 6"
                      fill="currentColor"
                      aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
                      />
                    </svg>
                  </button>
                </nav>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-neutral-50/50 rounded-sm">
              <p className="text-neutral-600 text-base mb-4 font-light">
                No articles found matching your criteria.
              </p>
              <button
                onClick={clearFilters}
                className="text-[#121212] font-medium underline underline-offset-4 hover:text-neutral-600 transition">
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default BlogListPage;