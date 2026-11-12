import React from "react";
import {
  CheckCircle2,
  EyeOff,
  Pencil,
  ShieldCheck,
  User,
} from "lucide-react";
import { getReviewSource } from "../../services/firebase/product/productService";

export const ReviewAuthorBadges = ({ review, compact = false }) => {
  const source = review?.authorSource || getReviewSource(review);
  const isUser = source === "user";
  const isApproved = review?.isApproved !== false;
  const pad = compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[10px]";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {isUser ? (
        <span
          title={
            review?.userId
              ? `Submitted by Storefront Customer (UID: ${review.userId})`
              : "Submitted by Storefront Customer"
          }
          className={`inline-flex items-center gap-1 rounded-full font-bold border bg-[#eaf2ff] text-[#1c5fba] border-[#bfd7ff] ${pad}`}>
          <User size={10} />
          User Made
        </span>
      ) : (
        <span
          title="Created manually from Admin Panel"
          className={`inline-flex items-center gap-1 rounded-full font-bold border bg-[#FFF8D6] text-[#594400] border-[#FFE500] ${pad}`}>
          <ShieldCheck size={10} />
          Admin Made
        </span>
      )}

      {isUser && review?.editedByAdmin && (
        <span
          title="Customer review edited by Admin"
          className={`inline-flex items-center gap-1 rounded-full font-semibold border bg-[#f5f3ff] text-[#5b21b6] border-[#ddd6fe] ${pad}`}>
          <Pencil size={9} />
          Edited by Admin
        </span>
      )}

      {review?.verified && (
        <span
          className={`inline-flex items-center gap-1 rounded-full font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200 ${pad}`}>
          <CheckCircle2 size={10} />
          Verified
        </span>
      )}

      {!isApproved && (
        <span
          className={`inline-flex items-center gap-1 rounded-full font-semibold border bg-rose-50 text-rose-700 border-rose-200 ${pad}`}>
          <EyeOff size={10} />
          Hidden
        </span>
      )}
    </div>
  );
};

export default ReviewAuthorBadges;
