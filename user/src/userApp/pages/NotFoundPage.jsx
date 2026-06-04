import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const sitemapLinks = [
  {
    name: "Home",
    url: "https://gharkaorganic.com/",
  },
  {
    name: "Raw Honey (Uttarakhand)",
    url: "https://gharkaorganic.com/raw-honey-uttarakhand",
  },
  {
    name: "Pahadi Achar (Pickle)",
    url: "https://gharkaorganic.com/buy-pahadi-achar-online",
  },
  {
    name: "All Products",
    url: "https://gharkaorganic.com/all-products",
  },
  {
    name: "Best Sellers",
    url: "https://gharkaorganic.com/shop/best-sellers",
  },
  {
    name: "Our Story",
    url: "https://gharkaorganic.com/our-story",
  },
  {
    name: "Contact",
    url: "https://gharkaorganic.com/contact",
  },
];

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 px-6 text-center">
      <Helmet>
        <title>Page Not Found</title>
        <meta name="description" content="This page does not exist." />
      </Helmet>

      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>

      <p className="text-gray-600 mb-8 max-w-md">
        The page you’re looking for doesn’t exist. You can explore our sitemap
        below or return to the homepage.
      </p>

      {/* Sitemap Links */}
      <div className="grid gap-3 mb-10">
        {sitemapLinks.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#da127d] hover:underline">
            {item.name}
          </a>
        ))}
      </div>

      {/* Go Home Button */}
      <Link
        to="/"
        className="bg-[#da127d] hover:bg-[#b80f6a] text-white px-8 py-3 text-sm font-bold uppercase tracking-widest transition">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
