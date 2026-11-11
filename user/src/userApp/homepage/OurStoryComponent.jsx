import React from "react";
import { Link } from "react-router-dom";
import { STORY_INTRO_PARAGRAPHS, STORY_LOCATION } from "./ourStoryContent";

const OurStoryComponent = () => {
  return (
    <section className="our-story bg-white px-5 py-12 font-sans sm:px-8 sm:py-16 lg:py-20 border-t border-gray-100">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
        <figure className="w-full m-0 order-1 md:order-1">
          <picture>
            <source
              srcSet="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776768403/Local_women_in_Bhimtal_Uttarakhand_preparing_traditional_Himalayan_organic_food_tbpvgk.webp"
              type="image/webp"
            />
            <img
              src="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776768403/Local_women_in_Bhimtal_Uttarakhand_preparing_traditional_Himalayan_organic_food_tbpvgk.webp"
              alt="Traditional Himalayan homemade food preparation in Mangoli, Nainital, Uttarakhand by local women for Ghar Ka Organic"
              loading="lazy"
              width="800"
              height="1000"
              decoding="async"
              className="w-full h-auto object-cover aspect-[4/5] bg-white rounded-xl shadow-md border border-[#eee]"
            />
          </picture>
        </figure>

        <article
          className="text-left flex flex-col justify-center order-2 md:order-2"
          itemScope
          itemType="https://schema.org/Organization">
          <meta itemProp="name" content="Ghar Ka Organic" />
          <meta itemProp="location" content={STORY_LOCATION} />

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-light tracking-widest text-[#2a2a2a] mb-6 uppercase leading-snug font-sans"
            itemProp="slogan">
            Our Story – Pure Pahadi Taste from the Heart of Uttarakhand
          </h2>

          <div className="w-12 h-[1.5px] bg-gray-300 mb-8" aria-hidden="true" />

          <div
            className="font-light text-[15px] md:text-[15.5px] leading-[2.2] text-[#4f4f4f] space-y-6 antialiased"
            itemProp="description">
            {STORY_INTRO_PARAGRAPHS.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}

            <div className="pt-2">
              <Link
                to="/our-story"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#315c3c] hover:text-[#244b2e] underline underline-offset-4 transition">
                Read our full story →
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default OurStoryComponent;
