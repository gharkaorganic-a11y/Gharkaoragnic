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
            Our Story – Pure Pahadi Taste from the Heart of Uttarakhand
          </h2>

          <div className="w-12 h-[1px] bg-gray-300 mb-10" />

          <div
            className="font-light text-[14px] md:text-[15px] leading-[2.2] text-[#555555] space-y-8"
            itemProp="text">
            <p>
              <strong className="font-medium text-[#333]">
                GHAR KA ORGANIC
              </strong>{" "}
              started with a simple mission — to bring back the authentic taste
              of the mountains through pure homemade goodness and zero
              preservatives.
            </p>

            <p>
              In today’s world filled with artificial flavors and chemicals, we
              wanted people to experience what real “ghar ka khaana” truly feels
              like — simple, honest, and comforting.
            </p>

            <p>
              Deeply connected to our pahadi roots, we aim to share the beauty
              of Himalayan culture across India through traditional flavors,
              local ingredients, and timeless food wisdom.
            </p>

            <p>
              Every product we create carries the soul of the mountains —
              natural ingredients, authentic pahadi taste, homemade warmth, and
              the feeling of home in every bite.
            </p>

            <p>
              GHAR KA ORGANIC is not just a brand. It is an emotion built to
              preserve culture, support local communities, and share the real
              taste of the pahad with the world.
            </p>

            <p>Pure taste. Pahadi roots. Zero preservatives.</p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default OurStoryComponent;
