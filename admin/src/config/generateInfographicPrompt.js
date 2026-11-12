export const CHATGPT_URL = "https://chatgpt.com/";
export const GEMINI_URL = "https://gemini.google.com/app";

export const INFOGRAPHIC_MASTER_PROMPT = `# GHAR KA ORGANIC – PRODUCT INFOGRAPHIC MASTER PROMPT

Create a premium, professional, high-resolution product infographic for **GHAR KA ORGANIC**, using the supplied product photograph, product packaging, brand logo and product information.

The design must follow the same visual identity and layout as the Green Chilli Ka Achar reference infographic.

## 1. BRAND IDENTITY

Brand: GHAR KA ORGANIC

Tagline: Ghar Ka, Ghar Se, Ghar Tk

Brand personality:
- Authentic Indian homemade food
- Traditional taste
- Natural and organic-inspired presentation
- Premium Himalayan food brand
- Clean, trustworthy and professional

Use the supplied original Ghar Ka Organic logo. Do not redesign, distort or misspell the brand name.

## 2. BACKGROUND AND COLOURS

Use a SOLID WARM CREAM BACKGROUND throughout the entire infographic.

Background colour: #FAF9F5

Supporting colours:
- Forest Green: #14532D
- Dark Green: #166534
- Earthy Brown: #653719
- Golden Accent: #D6A43B
- Light Cream: #FFF9E9
- Text: #29251F

IMPORTANT:
- The entire canvas must have the same warm cream background.
- No transparent background.
- No black background.
- No dark green gradient background.
- No white background.
- No unnecessary colour combinations.
- Keep the design consistent with Ghar Ka Organic's website.

## 3. INFOGRAPHIC LAYOUT

Create a vertical premium product infographic with the following sections.

### SECTION 1 – PRODUCT HERO

At the top, display:

- Ghar Ka Organic logo.
- Large, attractive product name.
- Actual product jar, bottle or packaging.
- Realistic product ingredients around the packaging.
- Fresh leaves and natural decorative elements.
- A small product weight/pack-size badge using the actual supplied weight.

Add a short tagline:

"Authentic Taste | Homemade | Desi Goodness"

The product should be the main visual attraction.

### SECTION 2 – WHY CHOOSE GHAR KA?

Create four evenly spaced icon-based benefits.

Choose benefits only from the information actually supplied for the product.

Examples:
- Traditional Recipe
- Made in Uttarakhand
- Carefully Selected Ingredients
- No Added Preservatives (only if verified)

Use simple green icons and short readable labels.

### SECTION 3 – PREMIUM INGREDIENTS

Display the actual ingredients used in the product.

Use realistic ingredient photographs or illustrations.

Show:
- Ingredient images.
- Ingredient names.
- Green check icons.
- Clean spacing.

Do not add ingredients that are not mentioned in the supplied product information.

### SECTION 4 – NUTRITION INFORMATION

Create a clean, professional nutrition table.

Include only verified nutritional values provided by the admin.

Possible fields:
- Energy
- Protein
- Carbohydrates
- Total Fat
- Dietary Fibre
- Sugar
- Sodium

IMPORTANT:
Never invent nutritional values, percentages, serving sizes or health claims.

If nutrition information is unavailable, omit this section or replace it with a product-specific information panel.

### SECTION 5 – PRODUCT BENEFITS

Show 3–4 short, verified product benefits with attractive green icons.

Avoid medical claims, disease-treatment claims or unverified health benefits.

### SECTION 6 – HOW TO ENJOY

Show four realistic serving suggestions relevant to the product.

For example:
- With Roti / Paratha
- With Rice
- With Snacks
- As a Side Dish

Use attractive food photography with small labels.

### SECTION 7 – BOTTOM BRAND MESSAGE

At the bottom, add a short brand-related message.

Example:

"Authentic Taste, Straight from Our Home to Yours!"

Use subtle green leaves and elegant decorative details.

## 4. DESIGN AND SPACING RULES

- Maintain consistent spacing between every section.
- Use equal gaps between panels.
- Use rounded rectangular panels with subtle golden borders.
- Use dark green section-heading bars.
- Use consistent icon sizes.
- Keep typography professional and readable.
- Avoid overcrowding.
- Maintain balanced alignment.
- Do not let text or images overlap.
- Keep sufficient internal padding.
- Use clean visual hierarchy.

## 5. IMAGE QUALITY AND RESPONSIVENESS

Create the artwork at a high resolution, preferably 2048 × 3072 pixels or higher.

Aspect ratio: 2:3 portrait.

The infographic must:
- Remain sharp when zoomed in.
- Have crisp text and detailed product photography.
- Maintain readable typography.
- Work on mobile screens.
- Work on desktop screens.
- Maintain consistent spacing and proportions.
- Have no pixelation, blur or distorted objects.

The image will be displayed on a responsive ecommerce product page, so all sections must remain clear when scaled down.

## 6. STRICT ACCURACY RULES

- Use the exact product name.
- Use the actual supplied product photograph.
- Preserve original packaging and label design.
- Use the actual product weight.
- Use only supplied ingredient information.
- Use only verified nutrition data.
- Do not invent prices, certifications or product claims.
- Do not generate random text or incorrect spelling.
- Do not change the Ghar Ka Organic brand identity.

## 7. FINAL OUTPUT

Deliver:
- One complete vertical product infographic.
- High-resolution PNG.
- Solid warm cream background (#FAF9F5).
- No transparency.
- No black background.
- No external mockup or website screenshot.
- Ready for direct upload to the Ghar Ka Organic product details page.

The final result must look like a premium Indian organic food brand's official product infographic, matching the Green Chilli Ka Achar reference design.

PRIORITY: Consistent brand identity, accurate product information, premium presentation, readable text, and a clean cream background.`;

/**
 * Combines the master infographic prompt with the current product form data
 * so the admin can paste everything directly into ChatGPT or Gemini.
 */
export function buildProductInfographicPrompt(product = {}) {
  const sizesText = Array.isArray(product.sizes)
    ? product.sizes.filter(Boolean).join(", ")
    : product.sizes || "";
  const certificationsText = Array.isArray(product.certifications)
    ? product.certifications.filter(Boolean).join(", ")
    : product.certifications || "";

  const suppliedLines = [
    "--- SUPPLIED PRODUCT INFORMATION ---",
    `Brand Name: ${product.brand?.trim() || "Ghar Ka Organic"}`,
    `Product Name: ${product.name?.trim() || "[Enter exact product name]"}`,
    `Weight / Pack Size: ${sizesText || "[Enter exact weight / pack size, e.g. 250g / 500ml]"}`,
    `Category: ${product.categoryId?.trim() || "[Enter category]"}`,
    `Short Summary: ${product.shortDescription?.trim() || "[Add 1-line summary if available]"}`,
    `Product Description: ${product.description?.trim() || "[Add verified product description]"}`,
    `Ingredients: ${product.ingredients?.trim() || "[List verified ingredients ONLY]"}`,
    `Product Benefits: ${product.benefits?.trim() || "[List verified non-medical benefits ONLY]"}`,
    `How to Enjoy / Usage Instructions: ${product.usageInstructions?.trim() || "[List serving suggestions, e.g. With Roti / Paratha, With Rice]"}`,
    `Shelf Life: ${product.shelfLife?.trim() || "[Enter shelf life if verified]"}`,
    `Verified Certifications / Badges: ${certificationsText || "[Add only verified badges, or leave out]"}`,
    "Nutrition Information: [Paste verified nutrition table values here if available, otherwise omit Section 4]",
    "Attachments to upload with this prompt: 1) Product jar/bottle photograph, 2) Ghar Ka Organic logo (/logo/gharka-logo-full.png or /logo/gharka-logo-symbol.png)",
  ];

  return `${INFOGRAPHIC_MASTER_PROMPT}\n\n${suppliedLines.join("\n")}`;
}

