import React from "react";

const OurStoryComponent = () => {
  return (
    <section className="bg-white py-16 px-6 font-sans selection:bg-[#f0f0f0] selection:text-black">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <figure className="w-full m-0">
          <img
            src="https://res.cloudinary.com/dwgro3zo7/image/upload/v1776768403/Local_women_in_Bhimtal_Uttarakhand_preparing_traditional_Himalayan_organic_food_tbpvgk.webp"
            alt="Traditional Himalayan organic food preparation in Bhimtal Uttarakhand by local women for Ghar Ka Organic"
            loading="lazy"
            width="800"
            height="1000"
            decoding="async"
            className="w-full h-auto object-cover aspect-[4/5] bg-gray-50"
          />
        </figure>

        <article
          className="text-left flex flex-col justify-center"
          itemScope
          itemType="https://schema.org/AboutPage">
          <h2
            className="text-2xl md:text-3xl font-light tracking-widest text-[#333333] mb-6 uppercase"
            itemProp="headline">
            Our Story – Himalayan Organic Food from Uttarakhand
          </h2>

          <div className="w-12 h-[1px] bg-gray-300 mb-10" />

          <div
            className="font-light text-[14px] md:text-[15px] leading-[2.2] text-[#555555] space-y-8"
            itemProp="text">
            <p>
              <strong className="font-medium text-[#333]">
                Ghar Ka Organic
              </strong>{" "}
              is a Himalayan organic food brand based in Bhimtal, Uttarakhand,
              India, focused on traditional pahadi food culture.
            </p>

            <p>
              We specialize in <strong>pahadi pickles (achar)</strong>,
              <strong> raw forest honey</strong>, and
              <strong> A2 bilona desi ghee</strong>, made using traditional
              Himalayan methods without chemicals or preservatives.
            </p>

            <p>
              Our products come directly from Uttarakhand villages, supporting
              local farmers and preserving authentic Kumaoni food traditions.
            </p>

            <p>
              We deliver pure Himalayan organic food across India with a focus
              on trust, purity, and sustainability.
            </p>
          </div>

          <div className="mt-12">
            <a
              href="/all-products"
              title="Shop Himalayan Organic Food Products"
              className="inline-block border border-gray-300 text-[#333333] px-8 py-3 text-xs tracking-widest uppercase font-light hover:bg-gray-50 transition-colors duration-300">
              Explore Himalayan Products
            </a>
          </div>
        </article>
      </div>
    </section>
  );
};

export default OurStoryComponent;
