import React from "react";
import CustomerReviewsScore from "../componenst/CustomerReviewsScore";
import ReviewsGrid from "../componenst/ReviewsGrid";

/* -----------------------------
   REVIEWS DATA (10 items)
------------------------------ */
const REVIEWS_DATA = [
  {
    id: 1,
    productName: "Lal Mirch Bharua Achar",
    rating: 5,
    date: "10/04/2026",
    author: "Navin Jha",
    title: "Perfect taste",
    body: "Exactly ghar jaisa taste. Masala balance is perfect.",
    isVerified: true,
  },
  {
    id: 2,
    productName: "Mango Pickle",
    rating: 4,
    date: "09/04/2026",
    author: "Ritika",
    title: "Very good",
    body: "Taste acha hai but thoda aur spicy ho sakta hai.",
    isVerified: true,
  },
  {
    id: 3,
    productName: "Desi Ghee",
    rating: 5,
    date: "08/04/2026",
    author: "Amit Sharma",
    title: "Pure quality",
    body: "100% pure desi ghee, amazing aroma.",
    isVerified: true,
  },
  {
    id: 4,
    productName: "Jackfruit Pickle",
    rating: 4,
    date: "07/04/2026",
    author: "Priya",
    title: "Nice taste",
    body: "First time tried, really liked it.",
    isVerified: true,
  },
  {
    id: 5,
    productName: "Masala Mix",
    rating: 5,
    date: "06/04/2026",
    author: "Rahul",
    title: "Best masala",
    body: "Homemade feel, no artificial smell.",
    isVerified: true,
  },
  {
    id: 6,
    productName: "Papad",
    rating: 5,
    date: "05/04/2026",
    author: "Neha",
    title: "Crispy",
    body: "Bahut crispy aur fresh hai.",
    isVerified: true,
  },
  {
    id: 7,
    productName: "Lemon Pickle",
    rating: 4,
    date: "04/04/2026",
    author: "Ankit",
    title: "Good",
    body: "Taste acha hai but thoda salty.",
    isVerified: false,
  },
  {
    id: 8,
    productName: "Snack Combo",
    rating: 5,
    date: "03/04/2026",
    author: "Sonia",
    title: "Loved it",
    body: "Family ko bahut pasand aaya.",
    isVerified: true,
  },
  {
    id: 9,
    productName: "Pickle Combo",
    rating: 5,
    date: "02/04/2026",
    author: "Deepak",
    title: "Worth it",
    body: "Combo value for money hai.",
    isVerified: true,
  },
  {
    id: 10,
    productName: "Ghee",
    rating: 5,
    date: "01/04/2026",
    author: "Pooja",
    title: "Amazing",
    body: "Bilkul ghar jaisa taste.",
    isVerified: true,
  },
];

const CustomerReviewsPage = () => {
  return (
    <div className="bg-[#f8faf8] min-h-screen">
      {/* SCORE SECTION */}
      <CustomerReviewsScore reviews={REVIEWS_DATA} />

      {/* REVIEWS GRID */}
      <ReviewsGrid reviews={REVIEWS_DATA} />
    </div>
  );
};

export default CustomerReviewsPage;
