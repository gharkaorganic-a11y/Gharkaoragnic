import React from "react";
import StickyAddToCartBar from "../../../../components/product/StickyAddToCartBar";

const ProductBottomBar = ({
  product,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  handleAddToCart,
  onAddToCart,
  isAdding = false,
  threshold = 280,
}) => {
  return (
    <StickyAddToCartBar
      product={product}
      selectedSize={selectedSize}
      setSelectedSize={setSelectedSize}
      quantity={quantity}
      setQuantity={setQuantity}
      onAddToCart={handleAddToCart || onAddToCart}
      isAdding={isAdding}
      threshold={threshold}
    />
  );
};

export default ProductBottomBar;
