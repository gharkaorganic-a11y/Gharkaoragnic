import React from "react";
import { CONFIG } from "../../config/AppConfig";

const InstagramFeed = () => {
  const posts = CONFIG.instagramFeed || [];

  if (!posts.length) return null;

  return (
    <section
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="w-full py-16 sm:py-20 lg:py-24 bg-[#FAF9F6]">
      {/* Ensure fonts are loaded (can be removed if already in index.html) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ───────── Header (Matching Brand Design) ───────── */}
        <div className="text-center mb-12 flex flex-col items-center">
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Shop Our Instagram
          </h2>

          <div className="flex items-center justify-center gap-3.5 mt-4 mb-4">
            <div className="h-[1px] w-12 bg-gray-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8102e] opacity-60" />
            <div className="h-[1px] w-12 bg-gray-200" />
          </div>

          <p className="text-[13px] sm:text-[15px] text-[#6b6b6b] font-light tracking-[0.01em] max-w-xl mx-auto">
            Discover real moments from our community. Tag{" "}
            <a
              href="https://instagram.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#c8102e] hover:text-[#a80d27] transition-colors">
              @yourhandle
            </a>{" "}
            to get featured.
          </p>
        </div>

        {/* ───────── Bento Grid ───────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 auto-rows-fr">
          {posts.slice(0, 8).map((post, idx) => (
            <a
              key={post.id || idx}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${post.type === "reel" ? "Reel" : "post"} on Instagram`}
              className={`
                group relative block overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-md
                outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] focus-visible:ring-offset-2
                ${idx === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}
                ${idx !== 0 ? "aspect-square" : ""}
              `}>
              {/* Image */}
              <img
                src={post.image}
                alt={post.altText || "Instagram post"}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                {/* Instagram Icon */}
                <svg
                  className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>

              {/* Glassmorphism Reel Badge */}
              {post.type === "reel" && (
                <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-md text-white p-1.5 rounded-full shadow-sm">
                  <svg
                    className="w-3.5 h-3.5 pl-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M5.888 2.25a3.46 3.46 0 0 0-3.46 3.46v12.58a3.46 3.46 0 0 0 3.46 3.46h12.224a3.46 3.46 0 0 0 3.46-3.46V5.71a3.46 3.46 0 0 0-3.46-3.46H5.888Zm4.62 13.911a.48.48 0 0 1-.741-.397V8.236a.48.48 0 0 1 .741-.397l6.635 4.025a.48.48 0 0 1 0 .795l-6.635 4.025Z" />
                  </svg>
                </div>
              )}
            </a>
          ))}
        </div>

        {/* ───────── CTA Button ───────── */}
        <div className="text-center mt-12 sm:mt-16">
          <a
            href="https://instagram.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-[1.5px] border-[#c8102e] text-[#c8102e] hover:bg-[#c8102e] hover:text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full transition-all duration-300 shadow-sm">
            Follow Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
