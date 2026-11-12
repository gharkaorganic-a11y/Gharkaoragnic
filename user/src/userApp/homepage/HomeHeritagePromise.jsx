import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Leaf, ShieldCheck, Heart, Sparkles, Award } from "lucide-react";

const HomeHeritagePromise = () => {
  const pillars = [
    {
      icon: Leaf,
      title: "Carefully Selected Ingredients",
      description:
        "We keep things as natural and simple as possible, choosing ingredients carefully so families know what goes into their food.",
      badge: "Pure & Simple",
      cardBg: "bg-[#f6f9f4]",
      borderColor: "border-[#e0edd9]",
      iconBg: "bg-[#e2f0dc]",
      iconColor: "text-[#315c3c]",
    },
    {
      icon: Heart,
      title: "Inspired by Mothers' Kitchens",
      description:
        "Born in Mangoli, Nainital, Uttarakhand — surrounded by the natural beauty, traditions, and pahadi food culture of the hills.",
      badge: "Pahadi Roots",
      cardBg: "bg-[#fdfbf6]",
      borderColor: "border-[#f3ebd7]",
      iconBg: "bg-[#faedd4]",
      iconColor: "text-[#9a6a2f]",
    },
    {
      icon: Sparkles,
      title: "Traditional Home Recipes",
      description:
        "From homemade pickles and pure ghee to natural honey, traditional pahadi dals, spices, and pahadi salts prepared with care.",
      badge: "Ghar Ka Taste",
      cardBg: "bg-[#faf9f5]",
      borderColor: "border-[#ede7dc]",
      iconBg: "bg-[#ede4d2]",
      iconColor: "text-[#7a5332]",
    },
    {
      icon: ShieldCheck,
      title: "Zero Artificial Preservatives",
      description:
        "Food does not need unnecessary chemicals or artificial preservatives to taste good — we preserve honest homemade taste and quality.",
      badge: "Honest Food",
      cardBg: "bg-[#f5f8f8]",
      borderColor: "border-[#dbeef0]",
      iconBg: "bg-[#d8eff0]",
      iconColor: "text-[#1d6b70]",
    },
  ];

  return (
    <section
      aria-label="Ghar Ka Organic story and promise"
      className="w-full bg-[#fdfcf9] py-14 sm:py-20 border-y border-[#eee9df] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── TOP SPLIT: Story & Illustrated Harvest Banner ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 sm:mb-16">
          {/* Left: Text Story */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#edf5ee] text-[#315c3c]">
              <Leaf size={13} className="text-[#315c3c]" /> A Small Beginning in the Hills
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-900 tracking-tight leading-snug">
              Rooted in Mangoli, Nainital, Uttarakhand
            </h2>

            <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
              GHAR KA began in the small town of Mangoli, Nainital, Uttarakhand — inspired by the simplicity of pahadi food and our mothers’ kitchens. We are not a large food corporation; we believe the best food comes from traditions carried in our homes for generations, without unnecessary chemicals or artificial preservatives.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-gray-700">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#315c3c]" /> No Artificial Preservatives
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#9a6a2f]" /> Born in Mangoli, Nainital
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1d6b70]" /> Taste of Ghar Ka Khana
              </span>
            </div>

            <div className="pt-3">
              <Link
                to="/our-story"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#315c3c] hover:text-[#23462c] transition group">
                Read our complete story
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Right: Colored SVG / Illustration Artwork Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#e5dfd2] bg-white shadow-xs group">
              <img
                src="/illustrations/pahadi-farm-harvest.png"
                alt="Traditional homemade pahadi food and ingredients from Mangoli, Nainital, Uttarakhand"
                className="w-full h-auto object-cover max-h-[380px] transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl px-4 py-2.5 border border-gray-100 shadow-sm flex items-center justify-between text-xs text-gray-700 font-medium">
                <span className="truncate pr-2">From our home in Mangoli, Nainital, Uttarakhand</span>
                <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#315c3c] bg-[#edf5ee] px-2 py-0.5 rounded">
                  Pure Pahadi
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM: 4-Card Colored Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between text-left ${pillar.cardBg} ${pillar.borderColor}`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-2xs ${pillar.iconBg} ${pillar.iconColor}`}>
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-gray-900 mb-2 tracking-tight">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(HomeHeritagePromise);
