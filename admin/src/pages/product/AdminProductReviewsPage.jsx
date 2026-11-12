import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  MessageSquare,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  User,
} from "lucide-react";
import {
  getReviewSource,
  productService,
} from "../../services/firebase/product/productService";
import ProductReviewModal from "../../components/modals/ProductReviewModal";
import ReviewAuthorBadges from "../../components/productManage/ReviewAuthorBadges";

const formatReviewDate = (review) => {
  if (review?.date) return review.date;
  if (review?.createdAt?.toDate) {
    return review.createdAt.toDate().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return "Recently added";
};

export default function AdminProductReviewsPage() {
  const { productId: routeProductId } = useParams();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [selectedProductId, setSelectedProductId] = useState(
    routeProductId || "all",
  );
  const [sourceFilter, setSourceFilter] = useState("all"); // all | user | admin | hidden | edited
  const [ratingFilter, setRatingFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal & Confirm Delete state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    setSelectedProductId(routeProductId || "all");
  }, [routeProductId]);

  const loadData = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) setRefreshing(true);
      else setLoading(true);
      try {
        // Always load all active products + their reviews so dropdown & filters remain complete
        const data = await productService.getAllReviews();
        setProducts(data.products || []);
        setReviews(data.reviews || []);
      } catch (err) {
        showToast("error", err.message || "Failed to load product reviews.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Scoped reviews for selected product (used for stats tabs)
  const productScopedReviews = useMemo(() => {
    if (selectedProductId === "all") return reviews;
    return reviews.filter((r) => r.productId === selectedProductId);
  }, [reviews, selectedProductId]);

  // Stats
  const stats = useMemo(() => {
    let userMade = 0;
    let adminMade = 0;
    let hidden = 0;
    let edited = 0;
    let ratingSum = 0;

    productScopedReviews.forEach((r) => {
      const src = r.authorSource || getReviewSource(r);
      if (src === "user") userMade += 1;
      else adminMade += 1;
      if (r.isApproved === false) hidden += 1;
      if (src === "user" && r.editedByAdmin) edited += 1;
      ratingSum += Number(r.rating) || 0;
    });

    const total = productScopedReviews.length;
    const avg = total > 0 ? (ratingSum / total).toFixed(1) : "0.0";
    return { total, userMade, adminMade, hidden, edited, avg };
  }, [productScopedReviews]);

  // Review counts per product for the product dropdown
  const countByProduct = useMemo(() => {
    const map = {};
    reviews.forEach((r) => {
      map[r.productId] = (map[r.productId] || 0) + 1;
    });
    return map;
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return productScopedReviews.filter((r) => {
      const src = r.authorSource || getReviewSource(r);

      if (sourceFilter === "user" && src !== "user") return false;
      if (sourceFilter === "admin" && src !== "admin") return false;
      if (sourceFilter === "hidden" && r.isApproved !== false) return false;
      if (sourceFilter === "edited" && !(src === "user" && r.editedByAdmin)) {
        return false;
      }

      if (
        ratingFilter !== "all" &&
        Number(r.rating) !== Number(ratingFilter)
      ) {
        return false;
      }

      if (!q) return true;
      const hay = [
        r.name,
        r.title,
        r.comment,
        r.reply,
        r.productName,
        r.userId,
        src === "user" ? "user customer" : "admin",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [productScopedReviews, sourceFilter, ratingFilter, searchTerm]);

  const activeProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || null,
    [products, selectedProductId],
  );

  const handleOpenAdd = () => {
    setEditingReview(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (rev) => {
    setEditingReview(rev);
    setModalOpen(true);
  };

  const handleSaved = (savedReview, mode) => {
    showToast(
      "success",
      mode === "edit"
        ? "Review updated and synced to storefront."
        : "New Admin review published.",
    );
    loadData({ silent: true });
    if (savedReview?.productId && selectedProductId === "all") {
      // stays visible in list after reload
    }
  };

  const handleToggleVisibility = async (rev) => {
    const nextApproved = rev.isApproved === false;
    setTogglingId(rev.id);
    try {
      await productService.approveReview(rev.productId, rev.id, nextApproved);
      setReviews((prev) =>
        prev.map((item) =>
          item.id === rev.id && item.productId === rev.productId
            ? { ...item, isApproved: nextApproved, editedByAdmin: true }
            : item,
        ),
      );
      showToast(
        "success",
        nextApproved ? "Review visible on storefront." : "Review hidden from storefront.",
      );
    } catch (err) {
      showToast("error", err.message || "Could not update visibility.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productService.deleteReview(deleteTarget.productId, deleteTarget.id);
      setReviews((prev) =>
        prev.filter(
          (r) =>
            !(r.id === deleteTarget.id && r.productId === deleteTarget.productId),
        ),
      );
      showToast("success", "Review deleted permanently.");
      setDeleteTarget(null);
    } catch (err) {
      showToast("error", err.message || "Failed to delete review.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-[#303030] font-sans pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-5">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed bottom-5 right-5 z-[140] flex items-center gap-2 px-4 py-2.5 rounded-xl border shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-700"
                : "bg-white border-[#2874F0]/30 text-[#212121]"
            }`}>
            {toast.type === "error" ? (
              <AlertCircle size={15} className="text-rose-600" />
            ) : (
              <CheckCircle2 size={15} className="text-emerald-600" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Shopify Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {routeProductId && (
                <button
                  type="button"
                  onClick={() => navigate("/reviews")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#e3e3e3] text-xs font-semibold text-[#303030] hover:border-[#2874F0] hover:text-[#2874F0] transition cursor-pointer">
                  <ArrowLeft size={13} />
                  All Reviews
                </button>
              )}
              <h1 className="text-lg font-bold text-[#212121] tracking-tight">
                {activeProduct
                  ? `Reviews: ${activeProduct.name}`
                  : "Product Reviews"}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFE500] text-[#212121] uppercase tracking-wide">
                User &amp; Admin
              </span>
            </div>
            <p className="text-xs text-[#616161] mt-1">
              Distinguish customer-made vs admin-created reviews, edit ratings or comments, add new reviews, and reply publicly.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => loadData({ silent: true })}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-[#e3e3e3] hover:border-[#2874F0] text-[#303030] rounded-lg transition shadow-[0_1px_0_rgba(0,0,0,0.03)] disabled:opacity-60 cursor-pointer">
              <RefreshCw
                size={13}
                className={refreshing ? "animate-spin text-[#2874F0]" : ""}
              />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              disabled={products.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2874F0] hover:bg-[#1c5fba] rounded-lg transition shadow-xs disabled:opacity-50 cursor-pointer">
              <Plus size={14} />
              Add Review
            </button>
          </div>
        </div>

        {/* 4 Metric Cards (Shopify + Flipkart Blue & Yellow) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white border border-[#e3e3e3] border-t-[3px] border-t-[#2874F0] rounded-xl p-4 flex items-center gap-3.5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            <div className="w-10 h-10 rounded-lg bg-[#eaf2ff] text-[#2874F0] flex items-center justify-center shrink-0">
              <MessageSquare size={18} />
            </div>
            <div>
              <p className="text-[11px] text-[#616161] font-semibold uppercase tracking-wider">
                Total Reviews
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <p className="text-xl font-bold text-[#212121]">{stats.total}</p>
                <span className="text-[11px] font-bold text-[#b45309] bg-[#FFF8D6] px-1.5 py-0.5 rounded">
                  {stats.avg} ★
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e3e3e3] border-t-[3px] border-t-[#1c5fba] rounded-xl p-4 flex items-center gap-3.5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            <div className="w-10 h-10 rounded-lg bg-[#eaf2ff] text-[#1c5fba] flex items-center justify-center shrink-0">
              <User size={18} />
            </div>
            <div>
              <p className="text-[11px] text-[#616161] font-semibold uppercase tracking-wider">
                User Made
              </p>
              <p className="text-xl font-bold text-[#212121] mt-0.5">
                {stats.userMade}
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#e3e3e3] border-t-[3px] border-t-[#FFE500] rounded-xl p-4 flex items-center gap-3.5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            <div className="w-10 h-10 rounded-lg bg-[#FFF8D6] text-[#594400] flex items-center justify-center shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-[11px] text-[#616161] font-semibold uppercase tracking-wider">
                Admin Made
              </p>
              <p className="text-xl font-bold text-[#212121] mt-0.5">
                {stats.adminMade}
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#e3e3e3] border-t-[3px] border-t-amber-500 rounded-xl p-4 flex items-center gap-3.5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <EyeOff size={18} />
            </div>
            <div>
              <p className="text-[11px] text-[#616161] font-semibold uppercase tracking-wider">
                Hidden / Edited
              </p>
              <p className="text-xl font-bold text-[#212121] mt-0.5">
                {stats.hidden}{" "}
                <span className="text-xs font-medium text-[#616161]">
                  / {stats.edited} edited
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-[#e3e3e3] rounded-xl p-3.5 space-y-3 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
          {/* Tabs: Author Origin */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: `All (${stats.total})` },
              { id: "user", label: `User Made (${stats.userMade})` },
              { id: "admin", label: `Admin Made (${stats.adminMade})` },
              { id: "edited", label: `User Edited (${stats.edited})` },
              { id: "hidden", label: `Hidden (${stats.hidden})` },
            ].map((tab) => {
              const active = sourceFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSourceFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    active
                      ? "bg-[#2874F0] text-white shadow-xs"
                      : "bg-[#f1f2f4] text-[#303030] hover:bg-[#e5e7eb]"
                  }`}>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search, Product Dropdown & Rating Filter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
            <div className="md:col-span-5 relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#616161]"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reviewer name, comment, product, or customer UID..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-[#fafafa] border border-[#e3e3e3] rounded-lg focus:outline-none focus:bg-white focus:border-[#2874F0]"
              />
            </div>

            <div className="md:col-span-4">
              <select
                value={selectedProductId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedProductId(val);
                  if (routeProductId) {
                    navigate(
                      val === "all" ? "/reviews" : `/products/reviews/${val}`,
                    );
                  }
                }}
                className="w-full px-3 py-2 text-xs font-medium bg-[#fafafa] border border-[#e3e3e3] rounded-lg focus:outline-none focus:bg-white focus:border-[#2874F0]">
                <option value="all">
                  All Products ({reviews.length} reviews)
                </option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({countByProduct[p.id] || 0})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-[#fafafa] border border-[#e3e3e3] rounded-lg focus:outline-none focus:bg-white focus:border-[#2874F0]">
                <option value="all">All Star Ratings</option>
                <option value="5">5 Stars Only</option>
                <option value="4">4 Stars Only</option>
                <option value="3">3 Stars Only</option>
                <option value="2">2 Stars Only</option>
                <option value="1">1 Star Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="bg-white border border-[#e3e3e3] rounded-xl p-12 flex flex-col items-center justify-center gap-3">
            <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#FFE500] border-t-[#2874F0]" />
            <p className="text-xs font-medium text-[#616161]">
              Loading product reviews...
            </p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white border border-[#e3e3e3] rounded-xl p-10 text-center space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#eaf2ff] text-[#2874F0] flex items-center justify-center mx-auto">
              <Star size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#212121]">
                No reviews match your filters
              </p>
              <p className="text-xs text-[#616161] mt-1">
                Try clearing filters or add a new review for any product.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              {(sourceFilter !== "all" ||
                ratingFilter !== "all" ||
                searchTerm) && (
                <button
                  type="button"
                  onClick={() => {
                    setSourceFilter("all");
                    setRatingFilter("all");
                    setSearchTerm("");
                  }}
                  className="px-3.5 py-2 text-xs font-semibold bg-[#f1f2f4] hover:bg-[#e5e7eb] text-[#303030] rounded-lg cursor-pointer">
                  Clear Filters
                </button>
              )}
              <button
                type="button"
                onClick={handleOpenAdd}
                disabled={products.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2874F0] hover:bg-[#1c5fba] rounded-lg cursor-pointer">
                <Plus size={14} />
                Add Review
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReviews.map((rev) => {
              const src = rev.authorSource || getReviewSource(rev);
              const isApproved = rev.isApproved !== false;
              const isToggling = togglingId === rev.id;

              return (
                <div
                  key={`${rev.productId}_${rev.id}`}
                  className={`bg-white border rounded-xl p-4 shadow-[0_1px_0_rgba(0,0,0,0.03)] transition ${
                    isApproved
                      ? "border-[#e3e3e3] hover:border-[#cfd6e0]"
                      : "border-rose-200 bg-rose-50/20"
                  }`}>
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Author + Origin + Review Content */}
                    <div className="flex-1 min-w-0 space-y-2.5">
                      {/* Header Meta */}
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                        <span className="text-[13px] font-bold text-[#212121]">
                          {rev.name}
                        </span>

                        <ReviewAuthorBadges review={rev} />

                        <span className="text-[11px] text-[#616161]">
                          • {formatReviewDate(rev)}
                        </span>

                        {src === "user" && rev.userId && (
                          <span className="text-[10px] font-mono text-[#616161] bg-[#f1f2f4] px-1.5 py-0.5 rounded">
                            UID: {String(rev.userId).slice(0, 12)}
                            {String(rev.userId).length > 12 ? "…" : ""}
                          </span>
                        )}
                      </div>

                      {/* Star Rating + Title */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-0.5 bg-[#FFF8D6] border border-[#f5d000]/70 px-2 py-0.5 rounded-md">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              className={
                                s <= rev.rating
                                  ? "fill-[#FFE500] text-[#d97706]"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                          <span className="ml-1 text-[11px] font-bold text-[#594400]">
                            {rev.rating}.0
                          </span>
                        </div>
                        {rev.title && (
                          <h3 className="text-xs font-bold text-[#212121]">
                            {rev.title}
                          </h3>
                        )}
                      </div>

                      {/* Comment */}
                      <p className="text-xs text-[#303030] leading-relaxed whitespace-pre-line">
                        {rev.comment || (
                          <span className="italic text-[#8a8a8a]">
                            No comment text provided.
                          </span>
                        )}
                      </p>

                      {/* Image & Store Reply */}
                      {rev.imageUrl && (
                        <div>
                          <a
                            href={rev.imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block">
                            <img
                              src={rev.imageUrl}
                              alt="Review photo"
                              className="w-16 h-16 rounded-lg object-cover border border-[#e3e3e3] hover:opacity-90"
                            />
                          </a>
                        </div>
                      )}

                      {rev.reply && (
                        <div className="rounded-lg border-l-2 border-l-[#2874F0] bg-[#eaf2ff]/50 px-3 py-2 text-xs space-y-0.5">
                          <p className="text-[11px] font-bold text-[#2874F0]">
                            Ghar Ka Organic Reply:
                          </p>
                          <p className="text-[#303030] whitespace-pre-line">
                            {rev.reply}
                          </p>
                        </div>
                      )}

                      {/* Product Reference Strip */}
                      <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#616161]">
                        <div className="inline-flex items-center gap-1.5 bg-[#f7f7f7] border border-[#e3e3e3] rounded-md px-2 py-1">
                          {rev.productBanner ? (
                            <img
                              src={rev.productBanner}
                              alt={rev.productName}
                              className="w-4 h-4 rounded object-cover"
                            />
                          ) : (
                            <Package size={12} className="text-[#616161]" />
                          )}
                          <Link
                            to={`/products/edit/${rev.productId}`}
                            className="font-semibold text-[#212121] hover:text-[#2874F0] truncate max-w-[260px]">
                            {rev.productName || rev.productId}
                          </Link>
                        </div>

                        {rev.productSlug && (
                          <a
                            href={`https://gharkaorganic.com/product/${rev.productSlug}#reviews`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[#2874F0] hover:underline font-medium">
                            View Live
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#ebebeb]">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(rev)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#2874F0] hover:bg-[#1c5fba] text-white transition cursor-pointer">
                        <Edit2 size={13} />
                        Edit Review
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={isToggling}
                          onClick={() => handleToggleVisibility(rev)}
                          title={
                            isApproved
                              ? "Hide from storefront"
                              : "Approve & show on storefront"
                          }
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                            isApproved
                              ? "bg-white border-[#e3e3e3] text-[#303030] hover:bg-[#f1f2f4]"
                              : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                          }`}>
                          {isToggling ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : isApproved ? (
                            <EyeOff size={12} />
                          ) : (
                            <Eye size={12} />
                          )}
                          {isApproved ? "Hide" : "Approve"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(rev)}
                          title="Delete Review"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition cursor-pointer">
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Review Modal */}
      <ProductReviewModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingReview(null);
        }}
        initialReview={editingReview}
        products={products}
        fixedProductId={selectedProductId !== "all" ? selectedProductId : null}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[135] bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4"
          onClick={() => !deleting && setDeleteTarget(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white border border-[#e3e3e3] rounded-xl p-5 shadow-xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#212121]">
                Delete Product Review?
              </h3>
              <p className="text-xs text-[#616161]">
                Permanently remove the review by{" "}
                <span className="font-semibold text-[#212121]">
                  {deleteTarget.name}
                </span>
                ? The product rating summary will recalculate automatically.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 text-xs font-semibold text-[#616161] bg-[#f1f2f4] hover:bg-[#e5e7eb] rounded-lg cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer disabled:opacity-60">
                {deleting && <Loader2 size={13} className="animate-spin" />}
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
