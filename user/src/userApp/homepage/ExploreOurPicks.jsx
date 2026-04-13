import React from "react";
import { useNavigate } from "react-router-dom";

const ExploreOurPicks = ({
  data = {
    img: "https://www.farmdidi.com/cdn/shop/files/Shop_all_deskstop.webp",
    label: "Explore Our Picks",
    link: "/collections/all",
  },
}) => {
  const navigate = useNavigate();

  return (
    <section className="w-full">
      <div
        onClick={() => navigate(data.link)}
        className="relative w-full h-[full] sm:h-[full] md:h-[full] cursor-pointer overflow-hidden">
        <img
          src={data.img}
          alt={data.label}
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default React.memo(ExploreOurPicks);
