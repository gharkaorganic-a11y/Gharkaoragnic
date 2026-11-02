import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CategoriesCard = ({ cat }) => {
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);
  const name = cat.name || cat.label;

  return (
    <button
      type="button"
      onClick={() => navigate(`/category/${cat.slug || cat.id}`)}
      className="group flex w-full flex-col items-center text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315c3c]">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#f1efe4] shadow-sm transition-shadow duration-300 group-hover:shadow-md">
        {!imageFailed && (cat.image || cat.img) ? (
          <img
            src={cat.image || cat.img}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 font-sans text-lg font-medium text-[#52644d]">
            {name}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
      </div>

      <h3 className="mt-3 text-center text-[13px] font-medium text-[#344238] transition-colors duration-300 group-hover:text-[#315c3c] md:text-sm">
        {name}
      </h3>
    </button>
  );
};

export default CategoriesCard;
