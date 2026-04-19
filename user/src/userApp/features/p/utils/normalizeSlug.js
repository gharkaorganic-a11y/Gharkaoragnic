// utils/normalizeSlug.js
export const normalizeSlug = (slug, pathname) => {
  // ✅ handle root-like pages
  if (!slug) {
    if (pathname === "/collections") return "all";
    if (pathname === "/shop") return "all";
    if (pathname === "/") return "all";
  }

  return slug;
};