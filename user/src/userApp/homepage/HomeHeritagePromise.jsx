import React, { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, ShieldCheck, Heart } from "lucide-react";

const HomeHeritagePromise = () => {
  const cards = [
    {
      icon: Leaf,
      badge: "Pure Sourcing",
      title: "Direct from Mountain Terraces",
      description:
        "Harvested by smallholder farmers in the pesticide-free valleys of Bhimtal, Nainital, and Almora. We use native Himalayan ingredients nourished only by glacier waters and mountain soil.",
    },
    {
      icon: ShieldCheck,
      badge: "Traditional Wisdom",
      title: "Zero Preservatives, Slow-Fermented",
      description:
        "Every batch of pickle is naturally sun-cured in traditional ceramic barnis over several weeks. No artificial chemicals, synthetic vinegar, or preservatives — only pure cold-pressed mustard oil and rock salt.",
    },
    {
      icon: Heart,
      badge: "Community First",
      title: "Handmade by Pahadi Women",
      description:
        "Our kitchen in Nalni, Bhimtal is powered by local women self-help collectives. Every purchase directly supports rural Himalayan families, preserving age-old Kumaoni culinary wisdom.",
    },
  ];

  return (
    <section className="w-full bg-white py-14 sm:py-20 border-t border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#315c3c] block mb-2">
            The Ghar Ka Organic Promise
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-gray-900 tracking-tight">
            Pure Pahadi Goodness in Every Jar
          </h2>
          <p className="mt-3 text-xs sm:text-sm md:text-base text-gray-500 font-light leading-relaxed">
            We don't use factories, artificial chemicals, or commercial
            shortcuts. Every product is made the authentic way — just like home
            in the Uttarakhand hills.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="group p-6 sm:p-8 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D6] hover:border-[#315c3c] hover:bg-white shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE3D6] group-hover:bg-[#315c3c] text-[#315c3c] group-hover:text-white flex items-center justify-center transition-colors duration-300 mb-6 shadow-2xs">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8F6646] block mb-1">
                    {card.badge}
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-200/60">
                  <span className="text-xs font-semibold text-[#315c3c] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Learn about our roots →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Story Link Callout */}
        <div className="mt-12 sm:mt-14 text-center">
          <Link
            to="/our-story"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#315c3c] hover:text-[#244b2e] underline underline-offset-4 transition">
            <span>Read our complete story from Bhimtal, Nainital</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default memo(HomeHeritagePromise);
