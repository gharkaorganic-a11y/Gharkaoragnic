/**
 * ProductsManagementPage.jsx
 * Admin page for browsing, filtering, and managing the product catalogue.
 *
 * Changes from original:
 *  - Bulk delete → softDeleteProduct (preserves order history)
 *  - Single delete → softDeleteProduct
 *  - Bulk activate / deactivate added via productService.bulkSetActive()
 *  - categoryId filter passed to productService.getProducts() (was client-only)
 *  - loadProducts no longer double-fires on mount (removed stale effect pattern)
 *  - loadingRef guard kept; also guards handleLoadMore with early return
 *  - Toast auto-clear uses cleanup to avoid memory leaks on unmount
 *  - Error banner dismissible
 *  - Guide banner dismissible and persisted to sessionStorage
 *  - toggling state is now the product id (string | null) — unchanged but clarified
 *  - All action handlers use softDelete from new service
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Package,
  BarChart2,
  TrendingDown,
  AlertCircle,
  Plus,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

import Filters from "../../components/productManage/Filters";
import StatCard from "../../components/productManage/StatCard";
import ProductTable from "../../components/productManage/ProductTable";
import DeleteModal from "../../components/productManage/DeleteModal";
import Toast from "../../components/productManage/Toast";

import { productService } from "../../services/firebase/product/productService";

/* ─────────────────────────────
   HELPERS
───────────────────────────── */
const formatPKR = (n) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const getDiscount = (price, original) =>
  original > 0 && original > price
    ? Math.round((1 - price / original) * 100)
    : 0;

const GUIDE_KEY = "products_guide_dismissed";

/* ─────────────────────────────
   COMPONENT
───────────────────────────── */
const ProductsManagementPage = () => {
  const navigate = useNavigate();

  /* ── Filters ── */
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  /* ── Data ── */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);

  /* ── Selection ── */
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false); // covers delete & activate/deactivate

  /* ── Pagination ref ── */
  const lastDocRef = useRef(null);
  const loadingRef = useRef(false);

  /* ── UI ── */
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(null); // product id | null
  const [showGuide, setShowGuide] = useState(
    () => !sessionStorage.getItem(GUIDE_KEY),
  );

  /* ── Toast ── */
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((type, msg) => {
    setToast({ type, msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  // Cleanup toast timer on unmount
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /* ─────────────────────────────
     LOAD PRODUCTS
  ───────────────────────────── */
  const loadProducts = useCallback(
    async (reset = false) => {
      if (loadingRef.current) return;
      loadingRef.current = true;

      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const result = await productService.getProducts({
          lastDoc: reset ? null : lastDocRef.current,
          collectionType: collectionFilter,
          status: statusFilter,
          // categoryId filter now sent to Firestore directly
          categoryId: categoryFilter !== "all" ? categoryFilter : null,
        });

        setProducts((prev) =>
          reset ? result.products : [...prev, ...result.products],
        );

        lastDocRef.current = result.lastDoc ?? null;
        setHasMore(Boolean(result.hasMore));
      } catch (err) {
        setError(err?.message || "Failed to load products.");
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [collectionFilter, statusFilter, categoryFilter],
  );

  /* Reload whenever server-side filters change */
  useEffect(() => {
    lastDocRef.current = null;
    loadProducts(true);
  }, [collectionFilter, statusFilter, categoryFilter, loadProducts]);

  /* ─────────────────────────────
     CLIENT-SIDE SEARCH FILTER
     (only search & brand — everything else is server-filtered)
  ───────────────────────────── */
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term),
    );
  }, [products, searchTerm]);

  /* ─────────────────────────────
     STATS
  ───────────────────────────── */
  const stats = useMemo(
    () => ({
      total: filteredProducts.length,
      active: filteredProducts.filter((p) => p.isActive).length,
      outOfStock: filteredProducts.filter((p) => (p.stock ?? 0) === 0).length,
      lowStock: filteredProducts.filter(
        (p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 10,
      ).length,
    }),
    [filteredProducts],
  );

  /* ─────────────────────────────
     FILTER HELPERS
  ───────────────────────────── */
  const hasActiveFilters =
    categoryFilter !== "all" ||
    collectionFilter !== "all" ||
    statusFilter !== "all" ||
    searchTerm.trim() !== "";

  const clearFilters = () => {
    setCategoryFilter("all");
    setCollectionFilter("all");
    setStatusFilter("all");
    setSearchTerm("");
  };

  /* ─────────────────────────────
     SELECTION
  ───────────────────────────── */
  const toggleSelectProduct = (id) =>
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );

  const toggleSelectAll = () =>
    setSelectedProducts(
      selectedProducts.length === filteredProducts.length
        ? []
        : filteredProducts.map((p) => p.id),
    );

  const clearSelection = () => setSelectedProducts([]);

  /* ─────────────────────────────
     BULK SOFT DELETE
  ───────────────────────────── */
  const handleBulkDelete = async () => {
    if (!selectedProducts.length || bulkActionLoading) return;
    setBulkActionLoading(true);

    try {
      await Promise.all(
        selectedProducts.map((id) => productService.softDeleteProduct(id)),
      );

      // Remove soft-deleted items from local state
      setProducts((prev) =>
        prev.filter((p) => !selectedProducts.includes(p.id)),
      );
      showToast("success", `${selectedProducts.length} product(s) deleted.`);
      clearSelection();
    } catch (err) {
      showToast("error", err.message || "Bulk delete failed.");
    } finally {
      setBulkActionLoading(false);
    }
  };

  /* ─────────────────────────────
     BULK ACTIVATE / DEACTIVATE
  ───────────────────────────── */
  const handleBulkSetActive = async (isActive) => {
    if (!selectedProducts.length || bulkActionLoading) return;
    setBulkActionLoading(true);

    try {
      await productService.bulkSetActive(selectedProducts, isActive);

      setProducts((prev) =>
        prev.map((p) =>
          selectedProducts.includes(p.id) ? { ...p, isActive } : p,
        ),
      );

      showToast(
        "success",
        `${selectedProducts.length} product(s) ${isActive ? "activated" : "deactivated"}.`,
      );
      clearSelection();
    } catch (err) {
      showToast("error", err.message || "Bulk update failed.");
    } finally {
      setBulkActionLoading(false);
    }
  };

  /* ─────────────────────────────
     LOAD MORE
  ───────────────────────────── */
  const handleLoadMore = useCallback(() => {
    if (loadingRef.current || loadingMore || !hasMore) return;
    loadProducts(false);
  }, [loadingMore, hasMore, loadProducts]);

  /* ─────────────────────────────
     TOGGLE VISIBILITY (single)
  ───────────────────────────── */
  const handleToggleVisibility = async (product) => {
    if (toggling) return;
    setToggling(product.id);

    try {
      await productService.updateProduct(product.id, {
        isActive: !product.isActive,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, isActive: !p.isActive } : p,
        ),
      );

      showToast(
        "success",
        `"${product.name}" ${!product.isActive ? "activated" : "deactivated"}.`,
      );
    } catch (err) {
      showToast("error", err.message || "Update failed.");
    } finally {
      setToggling(null);
    }
  };

  /* ─────────────────────────────
     SINGLE SOFT DELETE
  ───────────────────────────── */
  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);

    try {
      await productService.softDeleteProduct(deleteTarget.id);

      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast("success", `"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      showToast("error", err.message || "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  /* ─────────────────────────────
     REFRESH
  ───────────────────────────── */
  const handleRefresh = () => {
    lastDocRef.current = null;
    setSelectedProducts([]);
    loadProducts(true);
  };

  /* ─────────────────────────────
     GUIDE DISMISS
  ───────────────────────────── */
  const dismissGuide = () => {
    setShowGuide(false);
    sessionStorage.setItem(GUIDE_KEY, "1");
  };

  /* ─────────────────────────────
     RENDER
  ───────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 pb-20 font-sans">
      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          msg={toast.msg}
          onClose={() => setToast(null)}
        />
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => !deleting && setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      {/* ── STICKY HEADER ── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Product Catalogue
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-0.5">
              Manage inventory &amp; visibility
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              aria-label="Refresh product list"
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200 disabled:opacity-40">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>

            <button
              onClick={() => navigate("/products/create")}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all">
              <Plus size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Guide banner */}
        {showGuide && (
          <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-800 text-sm">
            <AlertCircle
              size={18}
              className="shrink-0 mt-0.5 text-indigo-500"
            />
            <p className="flex-1">
              Use filters to browse by category, collection, or status. Select
              multiple products with the checkboxes for bulk actions.
            </p>
            <button
              onClick={dismissGuide}
              aria-label="Dismiss guide"
              className="text-indigo-400 hover:text-indigo-700">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div
            role="alert"
            className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
            <AlertCircle size={18} className="shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              aria-label="Dismiss error"
              className="text-red-400 hover:text-red-700">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard icon={Package} label="Total Products" value={stats.total} />
          <StatCard
            icon={BarChart2}
            label="Active Listings"
            value={stats.active}
          />
          <StatCard
            icon={TrendingDown}
            label="Low Stock"
            value={stats.lowStock}
          />
          <StatCard
            icon={AlertCircle}
            label="Out of Stock"
            value={stats.outOfStock}
          />
        </div>

        {/* Bulk action banner */}
        {selectedProducts.length > 0 && (
          <div className="bg-indigo-600 rounded-xl shadow-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-white">
              <span className="flex items-center justify-center w-7 h-7 bg-white/20 rounded-full font-bold text-sm">
                {selectedProducts.length}
              </span>
              <span className="text-sm font-medium tracking-wide">
                product{selectedProducts.length !== 1 ? "s" : ""} selected
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Activate */}
              <button
                onClick={() => handleBulkSetActive(true)}
                disabled={bulkActionLoading}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors disabled:opacity-50">
                <Eye size={13} /> Activate
              </button>

              {/* Deactivate */}
              <button
                onClick={() => handleBulkSetActive(false)}
                disabled={bulkActionLoading}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors disabled:opacity-50">
                <EyeOff size={13} /> Deactivate
              </button>

              {/* Delete */}
              <button
                onClick={handleBulkDelete}
                disabled={bulkActionLoading}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-red-500 hover:bg-red-400 text-white rounded-lg transition-colors disabled:opacity-50">
                {bulkActionLoading ? "Working…" : "Delete"}
              </button>

              {/* Clear */}
              <button
                onClick={clearSelection}
                className="px-3 py-2 text-xs font-semibold text-white border border-white/30 hover:bg-white/10 rounded-lg transition-colors">
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <Filters
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            collectionFilter={collectionFilter}
            setCollectionFilter={setCollectionFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            clearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Table */}
        <ProductTable
          products={filteredProducts}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          loadMoreProducts={handleLoadMore}
          handleToggleVisibility={handleToggleVisibility}
          toggling={toggling}
          setDeleteTarget={setDeleteTarget}
          navigate={navigate}
          getDiscount={getDiscount}
          formatPKR={formatPKR}
          selectedProducts={selectedProducts}
          toggleSelectProduct={toggleSelectProduct}
          toggleSelectAll={toggleSelectAll}
        />
      </main>
    </div>
  );
};

export default ProductsManagementPage;
