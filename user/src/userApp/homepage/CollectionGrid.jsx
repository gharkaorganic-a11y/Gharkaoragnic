import { Link } from "react-router-dom";
import { slugify } from "../../utils/slugify";

const CollectionGrid = ({ items = [], title, subtitle }) => {
  console.log(items);
  return (
    <section className="w-full bg-white flex flex-col">
      {/* Top Gradient Border */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-100 via-orange-300 to-orange-100 opacity-80" />

      {/* Main Navigation Container */}
      <div className="w-full border-b-[3px] border-[#f39c12]">
        <div className="max-w-[1200px] mx-auto overflow-x-auto py-6 px-4 scrollbar-hide">
          <div className="flex justify-between items-start min-w-max gap-8 md:gap-12 lg:gap-16">
            {items.map((item, idx) => {
              // Split name to force the text to stack exactly like the image
              const [firstWord, ...restWords] = item.name.split(" ");
              const secondLine = restWords.join(" ");

              return (
                <Link
                  key={idx}
                  to={`/collection/${slugify(item.name)}`}
                  className="group flex flex-col items-center w-16 md:w-20 transition-transform hover:-translate-y-1">
                  {/* Icon */}
                  <div className="h-[45px] w-[45px] md:h-[55px] md:w-[55px] flex items-center justify-center mb-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain grayscale-[0.2] group-hover:grayscale-0 transition-all"
                    />
                  </div>

                  {/* Text */}
                  <div className="text-center text-[12px] md:text-[14px] font-semibold text-[#1a365d] leading-[1.2] tracking-wide">
                    <span className="block">{firstWord}</span>
                    {secondLine && <span className="block">{secondLine}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionGrid;
