import React from "react";
import { useNavigate } from "react-router-dom";

const ExploreOurPicks = ({
  data = {
    img: "/banner/pahadiseid.png",
    label: "Explore Our Picks",
    link: "/collections/all",
  },
}) => {
  const navigate = useNavigate();

  return (
    <section className="w-full">
      <div
        onClick={() => navigate(data.link)}
        className="relative  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-[180px] sm:h-[240px] md:h-[320px] lg:h-[380px] cursor-pointer overflow-hidden ">
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
