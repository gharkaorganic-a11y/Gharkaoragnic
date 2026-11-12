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

      {/* Short Description */}
      <div>
        <FieldLabel subtitle="1-2 sentences summarizing the product for quick view & below title.">
          Short Description
        </FieldLabel>
        <Input
          name="shortDescription"
          value={product.shortDescription || ""}
          onChange={handleChange}
          placeholder="e.g. Traditional sun-cured Kumaoni mango pickle crafted with cold-pressed mustard oil."
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

      {/* Ingredients */}
      <div>
        <FieldLabel subtitle="List all authentic ingredients used.">
          Ingredients
        </FieldLabel>
        <Textarea
          name="ingredients"
          rows={3}
          value={product.ingredients || ""}
          onChange={handleChange}
          placeholder="e.g. Fresh green chillies, wood-pressed mustard oil, fenugreek, fennel, rock salt..."
        />
      </div>

      {/* Shelf Life */}
      <div>
        <FieldLabel subtitle="Product shelf life (e.g. 12 Months).">
          Shelf Life
        </FieldLabel>
        <Input
          name="shelfLife"
          value={product.shelfLife || ""}
          onChange={handleChange}
          placeholder="e.g. 12 Months"
        />
      </div>

      {/* Certifications */}
      <div>
        <FieldLabel subtitle="Comma-separated badges (e.g. 100% Himalayan Organic, Chemical-Free, Lab Tested).">
          Organic Certifications &amp; Badges
        </FieldLabel>
        <Input
          name="certifications"
          value={
            Array.isArray(product.certifications)
              ? product.certifications.join(", ")
              : product.certifications || ""
          }
          onChange={(e) => {
            const raw = e.target.value;
            handleChange({
              target: {
                name: "certifications",
                value: raw.split(",").map((s) => s.trim()).filter(Boolean),
              },
            });
          }}
          placeholder="e.g. 100% Himalayan Organic, Chemical-Free, Lab Tested"
        />
      </div>

      {/* Brand */}
      <div>
        <FieldLabel subtitle="Brand name (defaults to Ghar Ka Organic).">
          Brand Name
        </FieldLabel>
        <Input
          name="brand"
          value={product.brand || ""}
          onChange={handleChange}
          placeholder="e.g. Ghar Ka Organic"
        />
      </div>
    </Card>
  );
};

export default ProductInfoCard;
