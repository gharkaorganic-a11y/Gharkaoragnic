import React from "react";
import { Star, Check } from "lucide-react";

const TestimonialCard = ({
  name,
  img,
  message,
  rating = 5,
  date,
  location,
  verified = true,
}) => {
  const displayName = name || "Customer";
  const hasRating =
    rating !== undefined &&
    rating !== null &&
    Number.isFinite(Number(rating));
  const normalizedRating = hasRating
    ? Math.max(1, Math.min(5, Math.round(Number(rating))))
    : 5;

  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white border border-[#e5e5e5] hover:border-[#121212] rounded-2xl p-6 sm:p-7 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between h-full group text-left">
      <div>
        {/* Top Meta: Stars + Verified Badge + Date */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div
            className="flex items-center gap-0.5 text-amber-500"
            aria-label={`${normalizedRating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={14}
                className={
                  index < normalizedRating
                    ? "text-amber-500 fill-amber-500"
                    : "text-neutral-200 fill-neutral-200"
                }
                aria-hidden="true"
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-full">
                <Check size={11} className="text-[#121212] stroke-[2.5]" />
                <span>Verified</span>
              </span>
            )}
            {date && (
              <span className="text-[11px] text-neutral-400 font-light">
                {typeof date === "string" ? date : date?.toLocaleDateString?.("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Message */}
        <p className="text-[14px] sm:text-[15px] text-neutral-700 font-light leading-relaxed min-h-[64px]">
          "{message || "Authentic quality and wonderful traditional Himalayan taste."}"
        </p>
      </div>

      {/* Author Footer */}
      <div className="flex items-center gap-3 pt-5 mt-4 border-t border-[#f0f0f0]">
        {img ? (
          <img
            src={img}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
          />
        ) : (
          <div
            aria-hidden="true"
            className="w-10 h-10 rounded-full bg-neutral-100 text-[#121212] font-semibold text-xs flex items-center justify-center shrink-0 border border-neutral-200">
            {initials || "C"}
          </div>
        )}

        <div className="min-w-0">
          <h4 className="text-[14px] sm:text-[15px] font-medium text-[#121212] truncate">
            {displayName}
          </h4>
          <p className="text-xs text-neutral-500 font-light truncate">
            {location || "Verified Himalayan Buyer"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
