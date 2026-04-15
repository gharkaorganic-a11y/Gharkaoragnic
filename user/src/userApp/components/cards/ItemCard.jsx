import React from "react";
import { Heart } from "lucide-react";
import ImageSlider from "../slider/ImageSlider";
import { COLORS } from "../../../../style/theme";

const ItemCard = ({ product }) => {
  return (
    <div className="group flex flex-col mb-10 cursor-pointer">
      <div className="relative">
        {/* Image slider */}
        <ImageSlider images={product.images} />
      </div>

      {/* Name */}
      <h3
        className="mt-3 text-base font-medium text-center"
        style={{ color: COLORS.textAlt }}>
        {product.name}
      </h3>

      {/* Price */}
      <p
        className="text-sm font-semibold text-center"
        style={{ color: COLORS.text }}>
        ₹ {product.price}
      </p>
    </div>
  );
};

export default ItemCard;
