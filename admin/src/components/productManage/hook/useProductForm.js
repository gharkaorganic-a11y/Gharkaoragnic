import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { productService } from "../../../services/firebase/product/productService";
import {
  uploadImageToCloudinary,
  uploadMultipleImages,
} from "../../../services/cloudinary/uploadImage";

import { createEmptyProduct } from "../../../modal/product.model";

/* ─────────────────────────────
   Constants
───────────────────────────── */

const PRESET_SIZES = [
  "50g","100g","250g","500g","1kg","2kg",
  "100ml","250ml","500ml","1L",
];

/* ─────────────────────────────
   Slug generator
───────────────────────────── */
const generateSlug = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

/* ─────────────────────────────
   Hook
───────────────────────────── */
export const useProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  /* ───────── State ───────── */
  const [product, setProduct] = useState(createEmptyProduct());

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingColorIdx, setUploadingColorIdx] = useState(null);

  const [newCollection, setNewCollection] = useState("");
  const [customSizeInput, setCustomSizeInput] = useState("");

  const customSizeRef = useRef(null);

  /* ─────────────────────────────
     Load product (edit mode)
  ───────────────────────────── */
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setPageLoading(true);

        const data = await productService.getProduct(id);

        setProduct({
          ...createEmptyProduct(),
          ...data,

          price: data.price?.toString() ?? "",
          originalPrice: data.originalPrice?.toString() ?? "",
          stock: data.stock?.toString() ?? "",
        });
      } catch (err) {
        setError("Could not load product.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ─────────────────────────────
     Generic field change
  ───────────────────────────── */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError(null);
  }, []);

  /* ─────────────────────────────
     Banner upload
  ───────────────────────────── */
  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingBanner(true);

      const res = await uploadImageToCloudinary(
        file,
        cloudName,
        uploadPreset
      );

      setProduct((p) => ({ ...p, banner: res.url }));
    } catch {
      setError("Failed to upload banner.");
    } finally {
      setUploadingBanner(false);
    }
  };

  /* ─────────────────────────────
     Gallery upload
───────────────────────────── */
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    try {
      setUploadingGallery(true);

      const res = await uploadMultipleImages(
        files,
        cloudName,
        uploadPreset
      );

      setProduct((p) => ({
        ...p,
        images: [...p.images, ...res.map((r) => r.url)],
      }));
    } catch {
      setError("Failed to upload images.");
    } finally {
      setUploadingGallery(false);
    }
  };

  /* ─────────────────────────────
     Sizes
───────────────────────────── */
  const togglePresetSize = (size) => {
    setProduct((p) => ({
      ...p,
      sizes: p.sizes.includes(size)
        ? p.sizes.filter((s) => s !== size)
        : [...p.sizes, size],
    }));
  };

  const addCustomSize = () => {
    const val = customSizeInput.trim();
    if (!val) return;

    setProduct((p) => ({
      ...p,
      sizes: p.sizes.includes(val) ? p.sizes : [...p.sizes, val],
    }));

    setCustomSizeInput("");
  };

  const removeSize = (sizeToRemove) => {
    setProduct((p) => ({
      ...p,
      sizes: p.sizes.filter((s) => s !== sizeToRemove),
    }));
  };

  /* ─────────────────────────────
     Submit (CREATE / UPDATE)
───────────────────────────── */
  const handleSubmit = async () => {
    if (!product.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!product.price || Number(product.price) <= 0) {
      setError("Valid price required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...product,

        slug: generateSlug(product.name),
        price: Number(product.price),
        originalPrice:
          Number(product.originalPrice) || Number(product.price),
        stock: Number(product.stock) || 0,
      };

      if (isEditing) {
        await productService.updateProduct(id, payload);
      } else {
        await productService.createProduct(payload);
      }

      setSuccess(true);
      setTimeout(() => navigate("/products"), 1200);
    } catch (err) {
      setError(err.message || "Save failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────
     Return
───────────────────────────── */
  return {
    /* state */
    product,
    setProduct,

    error,
    setError,
    success,
    setSuccess,

    loading,
    pageLoading,

    uploadingBanner,
    uploadingGallery,
    uploadingColorIdx,

    newCollection,
    setNewCollection,

    customSizeInput,
    setCustomSizeInput,
    customSizeRef,

    /* handlers */
    handleChange,
    handleSubmit,
    handleBannerUpload,
    handleGalleryUpload,

    togglePresetSize,
    addCustomSize,
    removeSize,

    /* constants */
    PRESET_SIZES,

    isEditing,
  };
};