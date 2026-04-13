// ===============================
// Cloudinary Image Upload Service — PRODUCTION FIXED
// ===============================

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB hard limit
const MAX_GALLERY_FILES = 10;           // max parallel uploads
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",   // some browsers send this instead of image/jpeg
  "image/png",
  "image/webp",
];

/* ─────────────────────────────────────────────
   IMAGE COMPRESSION
   - Only triggers if file > 1MB
   - Fixes filename + type mismatch bug
   - Max width: 1600px, quality: 0.75
───────────────────────────────────────────── */
const compressImage = (file, maxWidth = 1600, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");

        let width = img.width;
        let height = img.height;

        // Scale down if wider than maxWidth
        if (width > maxWidth) {
          height = Math.round(height * (maxWidth / width));
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error("Image compression failed."));
            }

            // FIX: Rename extension to .jpg to match actual JPEG type
            // Prevents PNG-named JPEG mismatch that Cloudinary rejects
            const baseName = file.name.replace(/\.[^.]+$/, "");
            const compressedFile = new File([blob], `${baseName}.jpg`, {
              type: "image/jpeg",
            });

            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => reject(new Error("Invalid or corrupted image file."));
    };

    reader.onerror = () => reject(new Error("Failed to read file."));
  });
};

/* ─────────────────────────────────────────────
   SINGLE IMAGE UPLOAD
───────────────────────────────────────────── */
export const uploadImageToCloudinary = async (file, cloudName, uploadPreset) => {

  // Top of uploadImageToCloudinary function, add this:
// console.log("cloudName:", cloudName);
// console.log("uploadPreset:", uploadPreset);
// console.log("file:", file?.name, file?.type, file?.size);
  // --- Config check ---
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary config missing. Check your .env file.");
  }

  // --- File check ---
  if (!file) {
    throw new Error("No file provided.");
  }

  // --- Type check (FIX: includes image/jpg for browser compatibility) ---
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      `Invalid file type: "${file.type}". Only JPG, PNG, and WEBP are allowed.`
    );
  }

  // --- Size check (FIX: prevents silent timeout on large files) ---
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max allowed size is 10MB.`
    );
  }

  try {
    // --- Compress if > 1MB ---
    const shouldCompress = file.size > 1 * 1024 * 1024;
    const uploadFile = shouldCompress
      ? await compressImage(file)
      : file;

    // --- Build FormData ---
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "gharka-organic/products"); // organized folder

    // --- Upload ---
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    // --- Response check ---
    if (!response.ok) {
      throw new Error(
        data?.error?.message || `Upload failed with status ${response.status}`
      );
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    // Re-throw with context so UI can show meaningful message
    console.error(`[uploadImageToCloudinary] Failed for "${file.name}":`, error);
    throw error;
  }
};

/* ─────────────────────────────────────────────
   MULTIPLE IMAGES UPLOAD (PARALLEL)
   - Hard limit: 10 files at once
   - Partial failure reporting (doesn't silently drop)
───────────────────────────────────────────── */
export const uploadMultipleImages = async (files, cloudName, uploadPreset) => {
  if (!files || files.length === 0) {
    throw new Error("No files selected.");
  }

  // --- FIX: Cap parallel uploads to prevent Cloudinary rate limit ---
  if (files.length > MAX_GALLERY_FILES) {
    throw new Error(
      `Too many files. Please upload a maximum of ${MAX_GALLERY_FILES} images at once.`
    );
  }

  // --- Run all uploads in parallel ---
  // FIX: Use allSettled instead of all so one failure doesn't kill the rest
  const results = await Promise.allSettled(
    [...files].map((file) =>
      uploadImageToCloudinary(file, cloudName, uploadPreset)
    )
  );

  // --- Separate successes and failures ---
  const succeeded = [];
  const failed = [];

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      succeeded.push(result.value);
    } else {
      failed.push({
        fileName: files[i]?.name ?? `File ${i + 1}`,
        reason: result.reason?.message ?? "Unknown error",
      });
    }
  });

  // --- Report partial failures ---
  if (failed.length > 0) {
    const failedNames = failed.map((f) => `"${f.fileName}": ${f.reason}`).join("\n");
    console.warn(`[uploadMultipleImages] ${failed.length} file(s) failed:\n${failedNames}`);

    // If ALL failed, throw hard error
    if (succeeded.length === 0) {
      throw new Error(
        `All uploads failed. Check your connection or file types.\n${failedNames}`
      );
    }

    // If SOME failed, warn but return what succeeded
    // The hook can optionally show a partial warning to user
  }

  return succeeded;
};