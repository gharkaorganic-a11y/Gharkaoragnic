import React from "react";
import { Link } from "react-router-dom";
import { getRecentBlogs } from "../pages/data/blogData";

const DEFAULT_BLOG_IMAGE =
  "https://res.cloudinary.com/dwgro3zo7/image/upload/v1776768403/Local_women_in_Bhimtal_Uttarakhand_preparing_traditional_Himalayan_organic_food_tbpvgk.webp";

const LATEST_BLOGS = getRecentBlogs(null, 4);

/**
 * Homepage 4-column Latest Blog strip matching Ghar Ka Organic's warm earth palette.
 */
const LatestBlogSection = () => {
  if (!LATEST_BLOGS.length) return null;

  return (
    <section
      aria-labelledby="latest-blog-heading"
      className="w-full bg-white py-14 sm:py-16 md:py-20 border-t border-[#eeeeea] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2
            id="latest-blog-heading"
            className="text-xl sm:text-2xl md:text-[26px] font-semibold tracking-[0.08em] uppercase text-[#263329]">
            LATEST BLOG
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {LATEST_BLOGS.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col items-center text-center">
              <Link
                to={`/blogs/${post.slug}`}
                className="block w-full aspect-[16/9] overflow-hidden rounded-xl bg-[#FAF8F5] shadow-xs">
                <img
                  src={post.image || DEFAULT_BLOG_IMAGE}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  width="640"
                  height="360"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_BLOG_IMAGE;
                  }}
                  className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </Link>

              <h3 className="mt-4 px-1 text-[15px] sm:text-[15.5px] font-medium leading-snug text-[#263329] line-clamp-2 group-hover:text-[#8F6646] transition-colors">
                <Link to={`/blogs/${post.slug}`}>{post.title}</Link>
              </h3>

              <Link
                to={`/blogs/${post.slug}`}
                className="mt-2.5 inline-block text-sm font-medium text-[#8F6646] hover:text-[#6f4c31] hover:underline underline-offset-4 transition-colors">
                Read More
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(LatestBlogSection);

