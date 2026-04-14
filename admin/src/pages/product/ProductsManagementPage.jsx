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
  Info,
  X,
} from "lucide-react";

import Filters from "../../components/productManage/Filters";
import StatCard from "../../components/productManage/StatCard";
import ProductTable from "../../components/productManage/ProductTable";
import DeleteModal from "../../components/productManage/DeleteModal";
import Toast from "../../components/productManage/Toast";

import { productService } from "../../services/firebase/product/productService";

/* ────────────────────────────────────────────────────────────────
  Helpers
──────────────────────────────────────────────────────────────── */
const formatPKR = (n) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const getDiscount = (price, original) =>
  original && original > price ? Math.round((1 - price / original) * 100) : 0;

/* ────────────────────────────────────────────────────────────────
  Main Component
──────────────────────────────────────────────────────────────── */
const ProductsManagementPage = () => {
  const navigate = useNavigate();

  /* ───────── Filters ───────── */
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  /* ───────── Data ───────── */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  /* ───────── Pagination ───────── */
  const lastDocRef = useRef(null);
  const loadingRef = useRef(false);

  /* ───────── UI State ───────── */
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(null);
  const [showGuide, setShowGuide] = useState(true);

  /* ───────── Toast ───────── */
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((type, msg) => {
    setToast({ type, msg });

    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast(null);
    }, 3200);
  }, []);

  /* ────────────────────────────────────────────────────────────────
    LOAD PRODUCTS (PAGINATION CORE - STABLE VERSION)
  ──────────────────────────────────────────────────────────────── */
  const loadProducts = useCallback(
    async (reset = false) => {
      if (loadingRef.current) return;

      loadingRef.current = true;

      reset ? setLoading(true) : setLoadingMore(true);
      setError(null);

      try {
        const result = await productService.getProducts({
          lastDoc: reset ? null : lastDocRef.current,
          collectionType: collectionFilter,
          status: statusFilter,
        });

        setProducts((prev) =>
          reset ? result.products : [...prev, ...result.products],
        );

        lastDocRef.current = result.lastDoc || null;
        setHasMore(Boolean(result.hasMore));
      } catch (err) {
        setError(err?.message || "Failed to load products.");
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [collectionFilter, statusFilter],
  );

  /* ───────── INITIAL + FILTER RELOAD (SAFE) ───────── */
  useEffect(() => {
    lastDocRef.current = null;
    loadProducts(true);
  }, [collectionFilter, statusFilter, loadProducts]);

  /* ────────────────────────────────────────────────────────────────
    CLIENT FILTERING (UI ONLY)
  ──────────────────────────────────────────────────────────────── */
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return products.filter((p) => {
      const matchesSearch =
        !term ||
        p.name?.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term);

      const matchesCategory =
        categoryFilter === "all" || p.categoryId === categoryFilter;

      const matchesCollection =
        collectionFilter === "all" ||
        p.collectionTypes?.includes(collectionFilter);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? p.isActive
            : !p.isActive;

      return (
        matchesSearch && matchesCategory && matchesCollection && matchesStatus
      );
    });
  }, [products, searchTerm, categoryFilter, collectionFilter, statusFilter]);

  /* ────────────────────────────────────────────────────────────────
    STATS (BASED ON FILTERED VIEW - CORRECT UX)
  ──────────────────────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const safeStock = (p) => p.stock ?? 0;

    return {
      total: filteredProducts.length,
      active: filteredProducts.filter((p) => p.isActive).length,
      outOfStock: filteredProducts.filter((p) => safeStock(p) === 0).length,
      lowStock: filteredProducts.filter(
        (p) => safeStock(p) > 0 && safeStock(p) <= 10,
      ).length,
    };
  }, [filteredProducts]);

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

  const toggleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedProducts.length) return;

    setBulkDeleting(true);

    try {
      await Promise.all(
        selectedProducts.map((id) => productService.deleteProduct(id)),
      );

      setProducts((prev) =>
        prev.filter((p) => !selectedProducts.includes(p.id)),
      );

      setSelectedProducts([]);

      showToast("success", "Selected products deleted successfully");
    } catch (err) {
      showToast("error", err.message || "Bulk delete failed");
    } finally {
      setBulkDeleting(false);
    }
  };
  /* ────────────────────────────────────────────────────────────────
    ACTIONS
  ──────────────────────────────────────────────────────────────── */
  const handleLoadMore = useCallback(() => {
    if (loadingRef.current || loadingMore || !hasMore) return;
    loadProducts(false);
  }, [loadingMore, hasMore, loadProducts]);

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

      showToast("success", `"${product.name}" updated successfully.`);
    } catch (err) {
      showToast("error", err.message || "Update failed.");
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await productService.deleteProduct(deleteTarget.id);

      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));

      showToast("success", "Product deleted successfully.");
      setDeleteTarget(null);
    } catch (err) {
      showToast("error", err.message || "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const handleRefresh = () => {
    lastDocRef.current = null;
    loadProducts(true);
  };

  /* ────────────────────────────────────────────────────────────────
    UI
  ──────────────────────────────────────────────────────────────── */
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

      {/* Glassmorphism Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Product Catalog
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-0.5">
              Manage inventory & visibility
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
              title="Refresh Data">
              <RefreshCw size={18} />
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

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats Grid */}
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

        {/* Floating Bulk Action Banner */}
        {selectedProducts.length > 0 && (
          <div className="bg-indigo-600 rounded-xl shadow-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 text-white">
              <span className="flex items-center justify-center w-7 h-7 bg-white/20 rounded-full font-bold text-sm">
                {selectedProducts.length}
              </span>
              <span className="text-sm font-medium tracking-wide">
                Products selected
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setSelectedProducts([])}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white border border-white/30 hover:bg-white/10 rounded-lg transition-colors">
                Clear Selection
              </button>

              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-400 text-white rounded-lg transition-colors disabled:opacity-50 shadow-sm">
                {bulkDeleting ? "Deleting..." : "Delete Selected"}
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

        {/* Table Container */}
        <div>
          <ProductTable
            products={filteredProducts}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            loadMoreProducts={handleLoadMore}
            handleToggleVisibility={handleToggleVisibility}
            setDeleteTarget={setDeleteTarget}
            navigate={navigate}
            getDiscount={getDiscount}
            formatPKR={formatPKR}
            selectedProducts={selectedProducts}
            toggleSelectProduct={toggleSelectProduct}
            toggleSelectAll={toggleSelectAll}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center justify-center">
            {error}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductsManagementPage;
