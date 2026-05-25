/**
 * useProductForm.js
 * Production-ready admin hook for creating and editing organic e-commerce products.
 *
 * Responsibilities:
 *  - Load existing product when editing (id in URL)
 *  - Handle all field changes
 *  - Upload banner + gallery to Cloudinary
 *  - Manage size presets, custom sizes, size removal
 *  - Validate with the shared validateProduct util
 *  - Submit (create or update) via productService
 *
 * NOT responsible for:
 *  - Customer review submission (use useReviewForm instead)
 *  - Routing outside of post-save redirect
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { productService } from "../../../services/firebase/product/productService";
import {
  uploadImageToCloudinary,
  uploadMultipleImages,
} from "../../../services/cloudinary/uploadImage";
import {
  createEmptyProduct,
  validateProduct,
} from "../../../modal/product.model";

/* ─────────────────────────────
   CONSTANTS
───────────────────────────── */
export const PRESET_SIZES = [
  "50g", "100g", "250g", "500g", "1kg", "2kg",
  "100ml", "250ml", "500ml", "1L",
];

/* ─────────────────────────────
   SLUG
───────────────────────────── */
const generateSlug = (name = "") =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/* ─────────────────────────────
   HOOK
───────────────────────────── */
export const useProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  /* ───────── CORE STATE ───────── */
  const [product, setProduct] = useState(createEmptyProduct());
  const [errors, setErrors] = useState([]);          // string[]
  const [fieldError, setFieldError] = useState(null); // single inline error string
  const [success, setSuccess] = useState(false);

  /* ───────── LOADING FLAGS ───────── */
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  /* ───────── SIZE INPUT ───────── */
  const [customSizeInput, setCustomSizeInput] = useState("");
  const customSizeRef = useRef(null);

  /* ─────────────────────────────
     LOAD EXISTING PRODUCT
  ───────────────────────────── */
  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    (async () => {
      try {
        setPageLoading(true);
        setErrors([]);

        const data = await productService.getProduct(id);

        if (cancelled) return;

        setProduct({
          ...createEmptyProduct(),
          ...data,
          // Keep as strings so controlled inputs don't flicker between "" and 0
          price: data.price != null ? String(data.price) : "",
          originalPrice:
            data.originalPrice != null ? String(data.originalPrice) : "",
          stock: data.stock != null ? String(data.stock) : "",
        });
      } catch (err) {
        if (!cancelled) setErrors([err.message || "Could not load product"]);
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  /* ─────────────────────────────
     FIELD CHANGE
  ───────────────────────────── */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setProduct((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFieldError(null);
    setErrors([]);
  }, []);

  /**
   * Directly patch one or more fields without a synthetic event.
   * Useful for custom UI controls (toggle switches, colour pickers, etc.)
   */
  const patchProduct = useCallback((patch) => {
    setProduct((p) => ({ ...p, ...patch }));
    setFieldError(null);
  }, []);

  /* ─────────────────────────────
     BANNER UPLOAD
  ───────────────────────────── */
  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingBanner(true);
      setFieldError(null);

      const res = await uploadImageToCloudinary(file, cloudName, uploadPreset);
      setProduct((p) => ({ ...p, banner: res.url }));
    } catch {
      setFieldError("Banner upload failed. Please try again.");
    } finally {
      setUploadingBanner(false);
      // Reset input so same file can be re-uploaded after an error
      e.target.value = "";
    }
  };

  /* ─────────────────────────────
     GALLERY UPLOAD
  ───────────────────────────── */
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setUploadingGallery(true);
      setFieldError(null);

      const results = await uploadMultipleImages(files, cloudName, uploadPreset);
      setProduct((p) => ({
        ...p,
        images: [...p.images, ...results.map((r) => r.url)],
      }));
    } catch {
      setFieldError("Gallery upload failed. Please try again.");
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  /** Remove a single gallery image by index */
  const removeGalleryImage = useCallback((index) => {
    setProduct((p) => ({
      ...p,
      images: p.images.filter((_, i) => i !== index),
    }));
  }, []);

  /* ─────────────────────────────
     SIZE MANAGEMENT
  ───────────────────────────── */
  const togglePresetSize = useCallback((size) => {
    setProduct((p) => ({
      ...p,
      sizes: p.sizes.includes(size)
        ? p.sizes.filter((s) => s !== size)
        : [...p.sizes, size],
    }));
  }, []);

  const addCustomSize = useCallback(() => {
    const val = customSizeInput.trim();
    if (!val) return;

    setProduct((p) => ({
      ...p,
      sizes: [...new Set([...p.sizes, val])],
    }));
    setCustomSizeInput("");
    customSizeRef.current?.focus();
  }, [customSizeInput]);

  const removeSize = useCallback((size) => {
    setProduct((p) => ({
      ...p,
      sizes: p.sizes.filter((s) => s !== size),
    }));
  }, []);

  /* ─────────────────────────────
     TAG MANAGEMENT
  ───────────────────────────── */
  const addTag = useCallback((tag) => {
    const val = tag.trim().toLowerCase();
    if (!val) return;
    setProduct((p) => ({
      ...p,
      tags: [...new Set([...p.tags, val])],
    }));
  }, []);

  const removeTag = useCallback((tag) => {
    setProduct((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));
  }, []);

  /* ─────────────────────────────
     COLLECTION TYPE TOGGLE
  ───────────────────────────── */
  const toggleCollectionType = useCallback((type) => {
    setProduct((p) => ({
      ...p,
      collectionTypes: p.collectionTypes.includes(type)
        ? p.collectionTypes.filter((c) => c !== type)
        : [...p.collectionTypes, type],
    }));
  }, []);

  /* ─────────────────────────────
     FAQ MANAGEMENT
  ───────────────────────────── */
  const addFaqItem = useCallback(() => {
    setProduct((p) => ({
      ...p,
      faq: [...p.faq, { question: "", answer: "" }],
    }));
  }, []);

  const updateFaqItem = useCallback((index, field, value) => {
    setProduct((p) => ({
      ...p,
      faq: p.faq.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  const removeFaqItem = useCallback((index) => {
    setProduct((p) => ({
      ...p,
      faq: p.faq.filter((_, i) => i !== index),
    }));
  }, []);

  /* ─────────────────────────────
     SUBMIT PRODUCT
  ───────────────────────────── */
  const handleSubmit = async () => {
    // Client-side validation
    const { valid, errors: validationErrors } = validateProduct(product);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors([]);
      setSuccess(false);

      const originalPrice =
        product.originalPrice !== "" && product.originalPrice !== undefined
          ? Number(product.originalPrice)
          : Number(product.price);

      const payload = {
        ...product,
        slug: generateSlug(product.name),
        price: Number(product.price),
        originalPrice,
        stock: Number(product.stock) || 0,
      };

      if (isEditing) {
        await productService.updateProduct(id, payload);
      } else {
        await productService.createProduct(payload);
      }

      setSuccess(true);
      setTimeout(() => navigate("/products"), 1500);
    } catch (err) {
      setErrors([err.message || "Something went wrong. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────
     RETURN
  ───────────────────────────── */
  return {
    // State
    product,
    setProduct,
    patchProduct,

    errors,         // string[] — full validation error list
    fieldError,     // string | null — single upload/inline error
    setErrors,
    setFieldError,
    success,
    setSuccess,

    // Loading flags
    loading,
    pageLoading,
    uploadingBanner,
    uploadingGallery,

    // Size management
    customSizeInput,
    setCustomSizeInput,
    customSizeRef,
    togglePresetSize,
    addCustomSize,
    removeSize,
    PRESET_SIZES,

    // Tag management
    addTag,
    removeTag,

    // Collection types
    toggleCollectionType,

    // Gallery
    removeGalleryImage,

    // FAQ
    addFaqItem,
    updateFaqItem,
    removeFaqItem,

    // Handlers
    handleChange,
    handleSubmit,
    handleBannerUpload,
    handleGalleryUpload,

    // Meta
    isEditing,
  };
};