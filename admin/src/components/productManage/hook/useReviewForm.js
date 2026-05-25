/**
 * useReviewForm.js
 * Customer-facing & Admin-facing hook for submitting product reviews.
 */

import { useState } from "react";
import { productService } from "../../../services/firebase/product/productService";
// IMPORT YOUR CLOUDINARY SERVICE HERE (adjust path as needed)
import { uploadImageToCloudinary } from "../../../services/cloudinary/uploadImage"; 

const INITIAL_REVIEW = { 
  // --- Customer Fields ---
  rating: 0, 
  name: "", 
  comment: "",
  image: null, 
  
  // --- Admin Only Fields ---
  title: "", 
  verified: true, 
  date: "" 
};


export const useReviewForm = (productId) => {
  const [review, setReview] = useState(INITIAL_REVIEW);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReview((r) => ({ 
      ...r, 
      [name]: type === "checkbox" ? checked : value 
    }));
    setError(null);
  };

  const handleRatingChange = (rating) => {
    setReview((r) => ({ ...r, rating }));
    setError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setReview((r) => ({ ...r, image: file }));
      setError(null);
    } else {
      setReview((r) => ({ ...r, image: null }));
    }
  };

  const removeImage = () => {
    setReview((r) => ({ ...r, image: null }));
  };

  /* ─────────────────────────────────────────────────────────
     HELPER: Handle Cloudinary Upload & Renaming
  ───────────────────────────────────────────────────────── */
 const handleImageUpload = async () => {
  if (!review.image) {
    console.log("❌ No image selected");
    return null;
  }

  console.log("📦 Original File:", review.image);

  // 1. Rename the file
  const cleanProductName = productId.substring(0, 8);

  // Better: keep original extension
  const extension = review.image.name.split(".").pop();

  const newFileName = `review_${cleanProductName}_${Date.now()}.${extension}`;

  // console.log("📝 New File Name:", newFileName);

  // Create renamed file
  const renamedFile = new File(
    [review.image],
    newFileName,
    {
      type: review.image.type,
    }
  );

  console.log("📂 Renamed File:", renamedFile);

  // 2. ENV values
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  console.log("☁️ Cloud Name:", cloudName);
  console.log("🎯 Upload Preset:", uploadPreset);

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary env variables missing");
  }

  // 3. Upload
  console.log("🚀 Uploading image to Cloudinary...");

  const uploadResult = await uploadImageToCloudinary(
    renamedFile,
    cloudName,
    uploadPreset
  );

  console.log("✅ Cloudinary Upload Result:", uploadResult);

  console.log("🔗 Uploaded Image URL:", uploadResult.url);

  return uploadResult.url;
};

  /* ─────────────────────────────────────────────────────────
     CUSTOMER SUBMIT (Frontend)
  ───────────────────────────────────────────────────────── */
 const handleSubmit = async () => {
  console.log("🟢 Customer Submit Started");

  if (!productId) {
    console.log("❌ Missing productId");
    return;
  }

  if (!review.rating || review.rating < 1) {
    setError("Please select a star rating.");
    console.log("❌ Invalid rating");
    return;
  }

  if (!review.comment.trim()) {
    setError("Please write a comment.");
    console.log("❌ Empty comment");
    return;
  }

  try {
    setLoading(true);
    setError(null);

    console.log("📝 Review Data Before Upload:", review);

    const uploadedImageUrl = await handleImageUpload();

    console.log("🖼 Uploaded Image URL:", uploadedImageUrl);

    const payload = {
      rating: review.rating,
      name: review.name,
      comment: review.comment,
      imageUrl: uploadedImageUrl,
      verified: false,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    console.log("📤 Final Firestore Payload:", payload);

    await productService.addReview(productId, payload);

    console.log("✅ Review Added Successfully");

    reset();
    setSuccess(true);
  } catch (err) {
    console.error("🔥 Submit Error:", err);

    setError(err.message || "Could not submit review. Try again.");
  } finally {
    setLoading(false);

    console.log("🏁 Submit Finished");
  }
};

  /* ─────────────────────────────────────────────────────────
     ADMIN SUBMIT (Dashboard)
  ───────────────────────────────────────────────────────── */
  const handleAdminSubmit = async () => {
    if (!productId) return;
    if (!review.rating || review.rating < 1) { setError("Please select a star rating."); return; }
    if (!review.name.trim()) { setError("Please provide a reviewer name."); return; }

    try {
      setLoading(true);
      setError(null);

      // 1. Upload image to Cloudinary (if selected)
      const uploadedImageUrl = await handleImageUpload();

      const finalDate = review.date || new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      // 2. Pass data to Firestore
      await productService.addReview(productId, {
        ...review,
        imageUrl: uploadedImageUrl, // Pass the URL, not the File
        date: finalDate
      });

      reset();
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Could not add admin review. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setReview(INITIAL_REVIEW);
    setError(null);
    setSuccess(false);
  };

  return {
    review, loading, error, success,
    handleChange, handleRatingChange, handleImageChange, removeImage,
    handleSubmit, handleAdminSubmit, reset,
  };
};