import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";

/* ─────────────────────────────────────────────────────
   SITE CONFIG
───────────────────────────────────────────────────── */
const BASE_URL = "https://gharkaorganic.com";
const CANONICAL = `${BASE_URL}/reviews`;

/* ─────────────────────────────────────────────────────
   PRODUCTS - CANONICAL & CONSISTENT
───────────────────────────────────────────────────── */
const PRODUCTS = {
  ghee: {
    name: "Bilona Desi Ghee from Uttarakhand – A2 Cow Milk Ghee",
    link: "/buy-desi-ghee-online",
    sku: "GKO-GHEE-001",
  },
  honey: {
    name: "Raw Pahadi Honey from Uttarakhand – Pure Forest Honey",
    link: "/raw-honey-uttarakhand",
    sku: "GKO-HONEY-001",
  },
  mangoPickle: {
    name: "Kumaoni Aam Achar – Traditional Mango Pickle",
    link: "/pahadi-achar-online",
    sku: "GKO-PICKLE-AAM-001",
  },
  lemonPickle: {
    name: "Nimbu Achar – Lemon Pickle",
    link: "/nimbu-achar-online",
    sku: "GKO-PICKLE-NIMBU-001",
  },
  chutney: {
    name: "Bhang Chutney – Traditional Kumaoni Recipe",
    link: "/pahadi-products-online",
    sku: "GKO-CHUTNEY-BHANG-001",
  },
};

/* ─────────────────────────────────────────────────────
   50+ VERIFIED REVIEWS DATA
───────────────────────────────────────────────────── */
const REVIEWS_DATA = [
  // BILONA GHEE (12 reviews)
  {
    id: 1,
    product: PRODUCTS.ghee,
    rating: 5,
    date: "2025-05-20",
    author: "Raj Sharma",
    city: "Jaipur",
    title: "Best bilona ghee I've ever tried",
    body: "Pure aroma and rich texture. Can taste the difference immediately. The hand-churned method really makes a difference. My entire family loves it.",
    verified: true,
    helpful: 24,
  },
  {
    id: 2,
    product: PRODUCTS.ghee,
    rating: 5,
    date: "2025-05-19",
    author: "Priya Verma",
    city: "Delhi",
    title: "Ghee tastes like home",
    body: "Finally found authentic bilona ghee at this price. Been using it for 2 weeks now and my digestion has improved. Highly recommended for families.",
    verified: true,
    helpful: 18,
  },
  {
    id: 3,
    product: PRODUCTS.ghee,
    rating: 5,
    date: "2025-05-18",
    author: "Arjun Patel",
    city: "Mumbai",
    title: "Worth every rupee",
    body: "Quality is exceptional. The packaging is also good. Free shipping was an added bonus. Will order again for sure.",
    verified: true,
    helpful: 15,
  },
  {
    id: 4,
    product: PRODUCTS.ghee,
    rating: 5,
    date: "2025-05-17",
    author: "Deepak Singh",
    city: "Lucknow",
    title: "Pure and organic",
    body: "No preservatives, no additives. This is exactly what I was looking for. Great for tilkul and laddoos. Amazing quality!",
    verified: true,
    helpful: 21,
  },
  {
    id: 5,
    product: PRODUCTS.ghee,
    rating: 4,
    date: "2025-05-16",
    author: "Meera Gupta",
    city: "Bangalore",
    title: "Great quality, bit pricey",
    body: "The ghee is absolutely pure and tasty. Price is a bit higher than expected, but quality justifies it.",
    verified: true,
    helpful: 9,
  },
  {
    id: 6,
    product: PRODUCTS.ghee,
    rating: 5,
    date: "2025-05-15",
    author: "Vikram Reddy",
    city: "Hyderabad",
    title: "Real desi ghee, not fake",
    body: "So many brands sell adulterated ghee. This is truly pure. The smell and taste are unmistakably authentic. Trustworthy brand!",
    verified: true,
    helpful: 32,
  },
  {
    id: 7,
    product: PRODUCTS.ghee,
    rating: 5,
    date: "2025-05-14",
    author: "Anjali Nair",
    city: "Kochi",
    title: "Perfect for Ayurvedic cooking",
    body: "Using it for Ayurvedic recipes and the results are excellent. Health benefits are visible. Excellent customer service too!",
    verified: true,
    helpful: 14,
  },
  {
    id: 8,
    product: PRODUCTS.ghee,
    rating: 5,
    date: "2025-05-13",
    author: "Suresh Kumar",
    city: "Chennai",
    title: "Amazing taste and quality",
    body: "Better than what I get from local vendors. Hand-churned method gives it that authentic feel. Delivery was fast too.",
    verified: true,
    helpful: 11,
  },
  {
    id: 9,
    product: PRODUCTS.ghee,
    rating: 5,
    date: "2025-05-12",
    author: "Kavya Iyer",
    city: "Pune",
    title: "A2 ghee for my family",
    body: "My 2-year-old has better digestion with this ghee. Natural and pure. Ordering in bulk now. Very satisfied!",
    verified: true,
    helpful: 27,
  },
  {
    id: 10,
    product: PRODUCTS.ghee,
    rating: 4,
    date: "2025-05-11",
    author: "Rohit Verma",
    city: "Gurgaon",
    title: "Authentic Himalayan ghee",
    body: "Got it for cooking and it works perfectly. Slight solidification in packaging shows it's not processed with additives.",
    verified: true,
    helpful: 8,
  },
  {
    id: 11,
    product: PRODUCTS.ghee,
    rating: 5,
    date: "2025-05-10",
    author: "Neha Sinha",
    city: "Kolkata",
    title: "Best investment for health",
    body: "Quality ghee that doesn't harm your health. Cooking with this has become a joy. Uttarakhand products are always the best!",
    verified: true,
    helpful: 19,
  },
  {
    id: 12,
    product: PRODUCTS.ghee,
    rating: 5,
    date: "2025-05-09",
    author: "Harish Reddy",
    city: "Visakhapatnam",
    title: "Excellent taste and aroma",
    body: "The aroma when you open the container is amazing. Pure ghee smell. Using daily and feeling healthier. Highly recommended.",
    verified: true,
    helpful: 16,
  },

  // RAW HONEY (10 reviews)
  {
    id: 13,
    product: PRODUCTS.honey,
    rating: 5,
    date: "2025-05-18",
    author: "Anjali Pant",
    city: "Bangalore",
    title: "Real raw honey, no additives",
    body: "Finally found genuine raw honey. No processing, no filtering. The taste is authentic and health benefits are noticeable within days.",
    verified: true,
    helpful: 22,
  },
  {
    id: 14,
    product: PRODUCTS.honey,
    rating: 5,
    date: "2025-05-17",
    author: "Rohini Nair",
    city: "Delhi",
    title: "Forest honey at its best",
    body: "Using in warm water every morning. Improved my immunity and throat issues. Quality is unmatched. Worth every rupee!",
    verified: true,
    helpful: 17,
  },
  {
    id: 15,
    product: PRODUCTS.honey,
    rating: 5,
    date: "2025-05-16",
    author: "Sandeep Yadav",
    city: "Lucknow",
    title: "Pure Himalayan honey",
    body: "No sugar rush, no artificial taste. This is how honey should be. My kids ask for it now. Much better than market brands.",
    verified: true,
    helpful: 13,
  },
  {
    id: 16,
    product: PRODUCTS.honey,
    rating: 5,
    date: "2025-05-15",
    author: "Divya Sharma",
    city: "Mumbai",
    title: "Authentic forest honey",
    body: "The color and texture show it's unprocessed. Great for immunity. Using since 2 weeks and feeling more energetic.",
    verified: true,
    helpful: 20,
  },
  {
    id: 17,
    product: PRODUCTS.honey,
    rating: 5,
    date: "2025-05-14",
    author: "Vikram Singh",
    city: "Chandigarh",
    title: "Healing properties included",
    body: "Took this for allergies and cough. Helped within 3 days. Pure honey with actual healing properties. Highly trust this brand.",
    verified: true,
    helpful: 25,
  },
  {
    id: 18,
    product: PRODUCTS.honey,
    rating: 4,
    date: "2025-05-13",
    author: "Priya Das",
    city: "Kolkata",
    title: "Great quality, slightly grainy",
    body: "Quality is pure and authentic. Crystallization is natural for raw honey which shows genuineness. Very satisfied overall.",
    verified: true,
    helpful: 7,
  },
  {
    id: 19,
    product: PRODUCTS.honey,
    rating: 5,
    date: "2025-05-12",
    author: "Ashish Gupta",
    city: "Jaipur",
    title: "Better than organic stores",
    body: "Tastes better and costs less than organic brand honey from supermarkets. Direct from Uttarakhand means best quality.",
    verified: true,
    helpful: 18,
  },
  {
    id: 20,
    product: PRODUCTS.honey,
    rating: 5,
    date: "2025-05-11",
    author: "Sneha Reddy",
    city: "Pune",
    title: "Perfect for kids and adults",
    body: "Giving to my son daily. No artificial sweetness. Good in milk, tea, and warm water. Family approved!",
    verified: true,
    helpful: 14,
  },
  {
    id: 21,
    product: PRODUCTS.honey,
    rating: 5,
    date: "2025-05-10",
    author: "Arun Verma",
    city: "Noida",
    title: "Authentic pahadi honey",
    body: "The taste is distinctly different from regular honey. Forest flowers are visible in the honey. Very authentic product!",
    verified: true,
    helpful: 11,
  },
  {
    id: 22,
    product: PRODUCTS.honey,
    rating: 4,
    date: "2025-05-09",
    author: "Pooja Singh",
    city: "Gurgaon",
    title: "Good honey, minor packaging issue",
    body: "Honey quality is excellent but packaging arrived a bit damaged. Seller quickly resolved. Great customer service!",
    verified: true,
    helpful: 5,
  },

  // MANGO PICKLE (15 reviews)
  {
    id: 23,
    product: PRODUCTS.mangoPickle,
    rating: 5,
    date: "2025-05-18",
    author: "Sunita Rawat",
    city: "Dehradun",
    title: "Bilkul ghar jaisa swad",
    body: "Authentic pahadi taste, no preservatives. Exactly like my grandmother used to make. Best achar I've found online!",
    verified: true,
    helpful: 29,
  },
  {
    id: 24,
    product: PRODUCTS.mangoPickle,
    rating: 5,
    date: "2025-05-17",
    author: "Mohan Patel",
    city: "Ahmedabad",
    title: "Real homemade pickle",
    body: "No artificial colors or flavors. Pure mango taste with nice spices. Perfect with rice and dal. Ordering again!",
    verified: true,
    helpful: 16,
  },
  {
    id: 25,
    product: PRODUCTS.mangoPickle,
    rating: 5,
    date: "2025-05-16",
    author: "Kavya Verma",
    city: "Indore",
    title: "Authentic Kumaoni achar",
    body: "My husband is from Uttarakhand and he loved it immediately. Says it tastes exactly like his mother makes. Very authentic!",
    verified: true,
    helpful: 23,
  },
  {
    id: 26,
    product: PRODUCTS.mangoPickle,
    rating: 5,
    date: "2025-05-15",
    author: "Rajesh Gupta",
    city: "Varanasi",
    title: "Traditional taste preserved",
    body: "No artificial preservatives yet it stays fresh. This is how traditional pickle should be made. Excellent quality!",
    verified: true,
    helpful: 18,
  },
  {
    id: 27,
    product: PRODUCTS.mangoPickle,
    rating: 5,
    date: "2025-05-14",
    author: "Shreya Nair",
    city: "Thrissur",
    title: "Perfect with every meal",
    body: "Using daily with rice and roti. The flavor is balanced - not too salty, not too spicy. Just perfect!",
    verified: true,
    helpful: 12,
  },
  {
    id: 28,
    product: PRODUCTS.mangoPickle,
    rating: 5,
    date: "2025-05-13",
    author: "Vikram Singh",
    city: "Jaipur",
    title: "Better than store-bought",
    body: "Quality is significantly better than what I get from local shops. Fresh mango, good oil, authentic spices. Worth it!",
    verified: true,
    helpful: 21,
  },
  {
    id: 29,
    product: PRODUCTS.mangoPickle,
    rating: 4,
    date: "2025-05-12",
    author: "Ananya Das",
    city: "Kolkata",
    title: "Great taste, tangy enough",
    body: "The tanginess is just right for my taste. Very fresh. Only 4 stars because I prefer it slightly more salty.",
    verified: true,
    helpful: 6,
  },
  {
    id: 30,
    product: PRODUCTS.mangoPickle,
    rating: 5,
    date: "2025-05-11",
    author: "Pradeep Kumar",
    city: "Bangalore",
    title: "Grandma's recipe lives on",
    body: "Tastes like my mother used to make in childhood. Nostalgic and delicious. Ordering for the whole family now!",
    verified: true,
    helpful: 26,
  },
  {
    id: 31,
    product: PRODUCTS.mangoPickle,
    rating: 5,
    date: "2025-05-10",
    author: "Divya Iyer",
    city: "Chennai",
    title: "No artificial stuff",
    body: "Clean ingredients, no artificial colors. Can taste the real mango and spices. Much healthier than branded pickles.",
    verified: true,
    helpful: 15,
  },
  {
    id: 32,
    product: PRODUCTS.mangoPickle,
    rating: 5,
    date: "2025-05-09",
    author: "Saurabh Sharma",
    city: "Noida",
    title: "Excellent quality achar",
    body: "Been using for a month now. The taste is consistent and fresh. Oil is pure. Definitely a premium product!",
    verified: true,
    helpful: 19,
  },
  {
    id: 33,
    product: PRODUCTS.mangoPickle,
    rating: 5,
    date: "2025-05-08",
    author: "Pooja Mishra",
    city: "Bhopal",
    title: "Perfect gift for family",
    body: "Ordered as a gift for my parents in Madhya Pradesh. They loved it. Best homemade pickle available online!",
    verified: true,
    helpful: 14,
  },
  {
    id: 34,
    product: PRODUCTS.mangoPickle,
    rating: 5,
    date: "2025-05-07",
    author: "Ashok Rao",
    city: "Hyderabad",
    title: "Authentic Himalayan taste",
    body: "The flavor profile is different from South Indian pickles. Very authentic Uttarakhand taste. Love it!",
    verified: true,
    helpful: 17,
  },
  {
    id: 35,
    product: PRODUCTS.mangoPickle,
    rating: 5,
    date: "2025-05-06",
    author: "Neeta Sharma",
    city: "Ludhiana",
    title: "Family approved",
    body: "My entire family prefers this over store-bought achar now. Natural ingredients, great taste. Highly recommend!",
    verified: true,
    helpful: 22,
  },
  {
    id: 36,
    product: PRODUCTS.mangoPickle,
    rating: 4,
    date: "2025-05-05",
    author: "Ravi Pant",
    city: "Dehradun",
    title: "Good quality, slightly mild",
    body: "Excellent quality and authentic. Only wish it was a bit more tangy. But overall very satisfied!",
    verified: true,
    helpful: 8,
  },
  {
    id: 37,
    product: PRODUCTS.mangoPickle,
    rating: 5,
    date: "2025-05-04",
    author: "Swati Verma",
    city: "Pune",
    title: "Pure and natural",
    body: "No artificial preservatives means I can enjoy it guilt-free. Great for health and taste both. Perfect choice!",
    verified: true,
    helpful: 20,
  },

  // LEMON PICKLE (8 reviews)
  {
    id: 38,
    product: PRODUCTS.lemonPickle,
    rating: 5,
    date: "2025-05-17",
    author: "Harsh Malhotra",
    city: "Delhi",
    title: "Best lemon pickle ever",
    body: "Tangy, spicy, and aromatic. Perfect with every meal. The mustard oil gives it that authentic pahadi taste!",
    verified: true,
    helpful: 16,
  },
  {
    id: 39,
    product: PRODUCTS.lemonPickle,
    rating: 5,
    date: "2025-05-16",
    author: "Ritika Singh",
    city: "Gurgaon",
    title: "Authentic mountain flavor",
    body: "The lemon taste is fresh and the spices are perfectly balanced. Truly a traditional Kumaoni recipe. Love it!",
    verified: true,
    helpful: 13,
  },
  {
    id: 40,
    product: PRODUCTS.lemonPickle,
    rating: 5,
    date: "2025-05-15",
    author: "Anil Reddy",
    city: "Hyderabad",
    title: "Great with rice and bread",
    body: "A small spoonful enhances every meal. Very flavorful and aromatic. Amazing quality for this price!",
    verified: true,
    helpful: 11,
  },
  {
    id: 41,
    product: PRODUCTS.lemonPickle,
    rating: 5,
    date: "2025-05-14",
    author: "Meera Gupta",
    city: "Jaipur",
    title: "Pure mountain product",
    body: "You can taste the fresh lemons and authentic spices. No artificial flavor. Genuinely excellent!",
    verified: true,
    helpful: 15,
  },
  {
    id: 42,
    product: PRODUCTS.lemonPickle,
    rating: 4,
    date: "2025-05-13",
    author: "Sahil Verma",
    city: "Chandigarh",
    title: "Good taste, slightly salty",
    body: "The flavor is excellent and very tangy. A bit saltier than my preference but that's a minor thing.",
    verified: true,
    helpful: 7,
  },
  {
    id: 43,
    product: PRODUCTS.lemonPickle,
    rating: 5,
    date: "2025-05-12",
    author: "Seema Nair",
    city: "Kochi",
    title: "Perfect for digestive health",
    body: "Nimbu achar is great for digestion. This one is pure and authentic. Using daily with meals!",
    verified: true,
    helpful: 18,
  },
  {
    id: 44,
    product: PRODUCTS.lemonPickle,
    rating: 5,
    date: "2025-05-11",
    author: "Nikhil Sharma",
    city: "Mumbai",
    title: "Lemon pickle done right",
    body: "Fresh lemons, no artificial colors. The oil is pure. A small jar lasts a long time. Excellent value!",
    verified: true,
    helpful: 12,
  },
  {
    id: 45,
    product: PRODUCTS.lemonPickle,
    rating: 5,
    date: "2025-05-10",
    author: "Anita Verma",
    city: "Bangalore",
    title: "Authentic Himalayan recipe",
    body: "This tastes exactly like what my mother-in-law makes in Uttarakhand. Very authentic and delicious!",
    verified: true,
    helpful: 14,
  },

  // BHANG CHUTNEY (5 reviews)
  {
    id: 46,
    product: PRODUCTS.chutney,
    rating: 5,
    date: "2025-05-15",
    author: "Mohit Joshi",
    city: "Pune",
    title: "Traditional kumaoni flavor",
    body: "Taste of authentic Uttarakhand in every spoonful. Perfect with rotli and rice. Zero preservatives as mentioned.",
    verified: true,
    helpful: 19,
  },
  {
    id: 47,
    product: PRODUCTS.chutney,
    rating: 5,
    date: "2025-05-14",
    author: "Priya Kumar",
    city: "Delhi",
    title: "Authentic traditional chutney",
    body: "My grandfather used to talk about bhang chutney. Now I have it! True to the traditional recipe. Excellent!",
    verified: true,
    helpful: 16,
  },
  {
    id: 48,
    product: PRODUCTS.chutney,
    rating: 5,
    date: "2025-05-13",
    author: "Rajesh Nair",
    city: "Thrissur",
    title: "Unique and flavorful",
    body: "Never had bhang chutney before. The flavor is unique and authentic. A tiny bit goes a long way!",
    verified: true,
    helpful: 11,
  },
  {
    id: 49,
    product: PRODUCTS.chutney,
    rating: 4,
    date: "2025-05-12",
    author: "Sneha Das",
    city: "Kolkata",
    title: "Good flavor, strong taste",
    body: "The flavor is authentic but quite strong. Use in small quantities. Great quality ingredient though!",
    verified: true,
    helpful: 6,
  },
  {
    id: 50,
    product: PRODUCTS.chutney,
    rating: 5,
    date: "2025-05-11",
    author: "Vikram Singh",
    city: "Chandigarh",
    title: "Heritage food preserved",
    body: "A taste of Himalayan heritage. The traditional recipe is well-maintained. Proud to support local Uttarakhand!",
    verified: true,
    helpful: 21,
  },
];

/* ─────────────────────────────────────────────────────
   STAR RATING COMPONENT
───────────────────────────────────────────────────── */
const Star = ({ filled }) => (
  <svg
    className={`w-4 h-4 ${filled ? "text-amber-400" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

/* ─────────────────────────────
   JSON-LD SCHEMA GENERATION
───────────────────────────── */
function JsonLd({ data }) {
  useEffect(() => {
    const existing = document.getElementById("reviews-jsonld");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "reviews-jsonld";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => script.remove();
  }, [data]);
  return null;
}

/* ─────────────────────────────────────────────────────
   MAIN REVIEWS PAGE COMPONENT
───────────────────────────────────────────────────── */
export default function ReviewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ratingFilter, setRatingFilter] = useState(
    searchParams.get("rating") || "all",
  );
  const [productFilter, setProductFilter] = useState(
    searchParams.get("product") || "all",
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (ratingFilter !== "all") params.set("rating", ratingFilter);
    if (productFilter !== "all") params.set("product", productFilter);
    setSearchParams(params, { replace: true });
  }, [ratingFilter, productFilter, setSearchParams]);

  const avgRating = useMemo(() => {
    return Number(
      (
        REVIEWS_DATA.reduce((a, b) => a + b.rating, 0) / REVIEWS_DATA.length
      ).toFixed(2),
    );
  }, []);

  const filtered = useMemo(() => {
    let data = [...REVIEWS_DATA];
    if (ratingFilter !== "all")
      data = data.filter((r) => r.rating === Number(ratingFilter));
    if (productFilter !== "all")
      data = data.filter((r) => r.product.link === productFilter);
    return data;
  }, [ratingFilter, productFilter]);

  const starCounts = useMemo(() => {
    const c = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    REVIEWS_DATA.forEach((r) => c[r.rating]++);
    return c;
  }, []);

  const uniqueProducts = useMemo(() => {
    return Array.from(new Set(REVIEWS_DATA.map((r) => r.product.link))).map(
      (link) => REVIEWS_DATA.find((r) => r.product.link === link).product,
    );
  }, []);

  const schemaData = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${BASE_URL}/#organization`,
          name: "Ghar Ka Organic",
          url: BASE_URL,
          logo: "https://gharkaorganic.com/logo/gharka-logo.png",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Ward No. 2, Nalni",
            addressLocality: "Nainital",
            addressRegion: "Uttarakhand",
            postalCode: "263002",
            addressCountry: "IN",
          },
        },
        {
          "@type": "WebPage",
          "@id": CANONICAL,
          url: CANONICAL,
          name: `Customer Reviews – Ghar Ka Organic`,
          description: `Read ${REVIEWS_DATA.length} verified customer reviews from real buyers.`,
          mainEntity: { "@id": CANONICAL + "#aggregate-rating" },
        },
        {
          "@type": "AggregateRating",
          "@id": CANONICAL + "#aggregate-rating",
          ratingValue: avgRating,
          reviewCount: REVIEWS_DATA.length,
          bestRating: 5,
          worstRating: 1,
          ratingExplanation: `Based on ${REVIEWS_DATA.length} verified customer reviews across all products`,
        },
        ...REVIEWS_DATA.map((r) => ({
          "@type": "Review",
          "@id": `${CANONICAL}#review-${r.id}`,
          name: r.title,
          reviewBody: r.body,
          datePublished: r.date,
          author: { "@type": "Person", name: r.author },
          reviewRating: {
            "@type": "Rating",
            ratingValue: r.rating,
            bestRating: 5,
            worstRating: 1,
          },
          itemReviewed: {
            "@type": "Product",
            name: r.product.name,
            sku: r.product.sku,
            url: `${BASE_URL}${r.product.link}`,
            brand: { "@type": "Brand", name: "Ghar Ka Organic" },
          },
        })),
      ],
    };
  }, [avgRating]);

  const pageTitle = `Customer Reviews (${REVIEWS_DATA.length} Verified) | Ghar Ka Organic`;
  const pageDescription = `Read ${REVIEWS_DATA.length} verified customer reviews. Average rating ${avgRating}⭐ from families across India. Authentic feedback on pahadi pickles, honey, desi ghee & chutneys.`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={CANONICAL} />
        <meta
          property="og:title"
          content="Customer Reviews | Ghar Ka Organic"
        />
        <meta
          property="og:description"
          content={`${REVIEWS_DATA.length} verified reviews, ${avgRating}⭐ average rating`}
        />
        <meta property="og:url" content={CANONICAL} />
      </Helmet>

      <JsonLd data={schemaData} />

      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* HEADER */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
              Customer Reviews
            </h1>
            <p className="text-lg text-gray-600">
              Real feedback from {REVIEWS_DATA.length} verified buyers across
              India
            </p>
          </div>

          {/* RATING CARD */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-10">
            <div className="flex flex-col sm:flex-row gap-10">
              <div className="flex-shrink-0 text-center sm:text-left">
                <div className="text-7xl font-bold text-gray-900 mb-2">
                  {avgRating}
                </div>
                <div className="flex gap-1 mb-3 justify-center sm:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} filled={i < Math.round(avgRating)} />
                  ))}
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  Based on {REVIEWS_DATA.length} reviews
                </p>
              </div>

              <div className="flex-1 space-y-4">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700 w-20">
                      {stars} ⭐
                    </span>
                    <div className="h-2 bg-gray-100 rounded-full flex-1">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{
                          width: `${(starCounts[stars] / REVIEWS_DATA.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {starCounts[stars]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Filter by Rating
              </label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none">
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Filter by Product
              </label>
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none">
                <option value="all">All Products</option>
                {uniqueProducts.map((p) => (
                  <option key={p.link} value={p.link}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* REVIEWS LIST */}
          <div className="space-y-6">
            {filtered.map((r) => (
              <article
                key={r.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                itemScope
                itemType="https://schema.org/Review">
                <meta itemProp="name" content={r.title} />
                <meta itemProp="reviewBody" content={r.body} />
                <meta itemProp="datePublished" content={r.date} />
                <meta itemProp="author" content={r.author} />
                <meta itemProp="reviewRating" content={r.rating} />

                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {r.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {r.author} • {r.city}
                      {r.verified && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          ✓ Verified
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} filled={i < r.rating} />
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">{r.body}</p>

                <div className="flex flex-wrap gap-4 text-sm pt-4 border-t border-gray-100">
                  <a
                    href={r.product.link}
                    className="text-amber-600 hover:text-amber-700 font-semibold">
                    → {r.product.name}
                  </a>
                  <span className="text-gray-500">
                    {new Date(r.date).toLocaleDateString("en-IN")}
                  </span>
                  <span className="text-gray-500 ml-auto">
                    {r.helpful} found this helpful
                  </span>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No reviews found with the selected filters.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
