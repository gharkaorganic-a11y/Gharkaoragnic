import React from "react";
import { useDark } from "../context/DarkCtx";

const QuickReplies = ({ chips, onSelect }) => {
  const dark = useDark();
  return (
    <div className="flex flex-wrap gap-1.5 max-w-[95%]">
      {chips.map((c, i) => (
        <button
          key={i}
          onClick={() => onSelect(c)}
          className={`text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all active:scale-95
            ${
              dark
                ? "bg-[#1f2c34] border-[#008069]/60 text-[#25D366] hover:bg-[#008069] hover:text-white hover:border-[#008069]"
                : "bg-white border-[#008069]/50 text-[#008069] hover:bg-[#008069] hover:text-white"
            }`}>
          {c}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;
