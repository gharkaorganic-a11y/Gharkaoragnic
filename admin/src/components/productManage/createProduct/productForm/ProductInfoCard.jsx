import React from "react";
import FieldLabel from "../ui/FieldLabel";
import Card from "../ui/Card";
import Textarea from "../ui/Textarea";
import Input from "../ui/Input";
import { Package } from "lucide-react";
import { generateAIDescriptionLink } from "../../../../config/generateAIDescriptionLink";

const ProductInfoCard = ({ product, handleChange }) => {
  return (
    <Card icon={Package} title="Product Information">
      {/* Product Name */}
      <div>
        <FieldLabel required subtitle="Use a clear, descriptive name.">
          Product Name
        </FieldLabel>
        <Input
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="e.g. Homemade Mango Pickle"
        />
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center justify-between">
          <FieldLabel subtitle="Provide details about your product.">
            Description
          </FieldLabel>

          <button
            type="button"
            onClick={() => {
              const url = generateAIDescriptionLink(product);
              window.open(url, "_blank");
            }}
            className="px-3 py-1.5 bg-black text-white text-xs rounded-sm hover:bg-gray-800 transition">
            AI ✨
          </button>
        </div>

        <Textarea
          name="description"
          rows={4}
          value={product.description}
          onChange={handleChange}
          placeholder="Enter detailed product description..."
        />
      </div>

      {/* NEW: Ingredients */}
      <div>
        <FieldLabel subtitle="List all ingredients used.">
          Ingredients
        </FieldLabel>
        <Textarea
          name="ingredients"
          rows={3}
          value={product.ingredients}
          onChange={handleChange}
          placeholder="e.g. Raw mango, mustard oil, spices..."
        />
      </div>

      {/* NEW: Shelf Life */}
      <div>
        <FieldLabel subtitle="How long the product lasts.">
          Shelf Life
        </FieldLabel>
        <Input
          name="shelfLife"
          value={product.shelfLife}
          onChange={handleChange}
          placeholder="e.g. 6 months"
        />
      </div>
    </Card>
  );
};

export default ProductInfoCard;
