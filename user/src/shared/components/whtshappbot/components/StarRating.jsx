import { StarIcon } from "@heroicons/react/24/solid";
import React from "react";

const StarRating = ({ rating = 4.2, count = 128 }) => (
  <div className="flex items-center gap-1 mt-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <StarIcon
        key={s}
        className={`w-3 h-3 ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`}
      />
    ))}
    <span className="text-[10.5px] text-gray-400 ml-0.5">
      {rating} ({count})
    </span>
  </div>
);

export default StarRating;
