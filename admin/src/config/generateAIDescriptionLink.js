export const generateAIDescriptionLink = (product) => {
  const prompt = `
Write a premium product description for my organic brand GHAR KA.

Product Name: ${product.name}
Category: ${product.categoryId || ""}
Pack Sizes: ${product.packSizes?.join(", ") || ""}
Ingredients: ${product.ingredients || ""}
Shelf Life: ${product.shelfLife || ""}

Tone: Premium, emotional, homemade, pahadi, organic.
Keep it short and attractive for e-commerce.
`;

  return `https://chat.openai.com/?q=${encodeURIComponent(prompt)}`;
};