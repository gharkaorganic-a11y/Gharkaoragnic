import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { STORY_LOCATION } from "./ourStoryContent";

const OurStoryComponent = () => {
  return (
    <section className="our-story bg-white px-5 py-12 font-sans sm:px-8 sm:py-16 lg:py-20 border-t border-gray-100">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
          {/* Left: Traditional Preparation Photo */}
          <figure className="w-full m-0 order-1 md:order-1">
            <picture>
              <source
                srcSet="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776768403/Local_women_in_Bhimtal_Uttarakhand_preparing_traditional_Himalayan_organic_food_tbpvgk.webp"
                type="image/webp"
              />
              <img
                src="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776768403/Local_women_in_Bhimtal_Uttarakhand_preparing_traditional_Himalayan_organic_food_tbpvgk.webp"
                alt="Traditional Himalayan homemade food preparation in Mangoli, Nainital, Uttarakhand for Ghar Ka Organic"
                loading="lazy"
                width="800"
                height="1000"
                decoding="async"
                className="w-full h-auto object-cover aspect-[4/5] bg-white rounded-2xl shadow-sm border border-gray-100"
              />
            </picture>
          </figure>

          {/* Right: Concise Story Teaser */}
          <article
            className="text-left flex flex-col justify-center order-2 md:order-2"
            itemScope
            itemType="https://schema.org/Organization">
            <meta itemProp="name" content="Ghar Ka Organic" />
            <meta itemProp="location" content={STORY_LOCATION} />

            <span className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#315c3c] block mb-2.5">
              Mangoli, Nainital • Uttarakhand
            </span>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-gray-900 mb-5 leading-snug"
              itemProp="slogan">
              Where the Story of GHAR KA Begins
            </h2>

            <div className="w-12 h-[2px] bg-[#315c3c] mb-6" aria-hidden="true" />

            <div
              className="text-sm sm:text-[15px] leading-relaxed text-gray-600 space-y-4 font-normal"
              itemProp="description">
              <p>
                Every home has a taste of its own — a taste that reminds us of
                childhood, our mothers' kitchens, freshly made pickles, and the
                simple joy of food made with love. That is where the story of
                GHAR KA began in Mangoli, Nainital, Uttarakhand.
              </p>
              <p>
                In today's fast-moving world of heavily processed food, we choose
                to preserve simplicity. Using traditional Kumaoni recipes,
                carefully selected native ingredients, and zero artificial
                preservatives, every jar brings the familiar warmth of home back
                to your dining table.
              </p>
            </div>

            {/* Premium Editorial Pill Button */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center">
              <Link
                to="/our-story"
                className="group inline-flex items-center gap-3.5 rounded-full border border-gray-900/80 bg-white px-7 py-3 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.18em] text-gray-900 shadow-2xs transition-all duration-300 hover:bg-[#315c3c] hover:border-[#315c3c] hover:text-white hover:shadow-md active:scale-95">
                <span>Read Our Full Story</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-900 transition-all duration-300 group-hover:bg-white group-hover:text-[#315c3c] group-hover:translate-x-1">
                  <ArrowRight size={13} strokeWidth={2.2} />
                </span>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default OurStoryComponent;
