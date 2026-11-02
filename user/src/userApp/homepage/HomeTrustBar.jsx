import React, { memo } from "react";
import { Mountain, Sun, Sparkles, HeartHandshake } from "lucide-react";

const HomeTrustBar = () => {
  const pillars = [
    {
      icon: Mountain,
      title: "Born in Bhimtal, Nainital",
      desc: "Grown & crafted at 4,500+ ft in the pristine valleys of Kumaon",
    },
    {
      icon: Sun,
      title: "Sun-Fermented in Barnis",
      desc: "Traditional ceramic jar curing with zero artificial vinegar or acids",
    },
    {
      icon: Sparkles,
      title: "100% Pure & Unprocessed",
      desc: "Hand-churned A2 bilona ghee & raw wildflower forest honey",
    },
    {
      icon: HeartHandshake,
      title: "Empowering Pahadi Women",
      desc: "Direct livelihood for women-led hill farming self-help groups",
    },
  ];

  return (
    <section
      aria-label="Why Choose Ghar Ka Organic"
      className="w-full bg-white border-y border-gray-100 py-6 sm:py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 sm:gap-4 text-left">
                <div className="w-10 h-10 rounded-full bg-[#315c3c]/10 text-[#315c3c] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-light leading-relaxed">
                    {item.desc}
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

export default memo(HomeTrustBar);
