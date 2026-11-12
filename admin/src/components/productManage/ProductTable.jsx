import React from "react";
import {
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Image as ImageIcon,
  PackageOpen,
  Loader2,
  Star,
} from "lucide-react";

import StockBadge from "./StockBadge";
import StatusPill from "./StatusPill";

const ProductTable = ({
  products,
  loading,
  hasMore,
  loadingMore,
  handleToggleVisibility,
  setDeleteTarget,
  navigate,
  getDiscount,
  formatPKR,
  loadMoreProducts,

  // 🔥 BULK ACTION PROPS
  selectedProducts,
  toggleSelectProduct,
  toggleSelectAll,
  handleBulkDelete,
}) => {
  // ---------------- LOADING STATE ----------------
  if (loading && products.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-6 p-5 border-b border-gray-100 animate-pulse">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2.5">
              <div className="h-4 bg-gray-200 w-1/3 rounded" />
              <div className="h-3 bg-gray-100 w-1/4 rounded" />
            </div>
            <div className="hidden md:block w-24 h-4 bg-gray-200 rounded" />
            <div className="hidden lg:block w-20 h-6 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  // ---------------- EMPTY STATE ----------------
  if (!loading && products.length === 0) {
    return (
      <div className="bg-white border border-gray-200 border-dashed rounded-xl p-16 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mb-4">
          <PackageOpen size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          No Products Found
        </h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Get started by creating a new product or try adjusting your filters to
          find what you're looking for.
        </p>
      </div>
    );
  }

  const allSelected =
    selectedProducts?.length > 0 && selectedProducts.length === products.length;

  return (
    <div className="bg-white border border-[#e3e3e3] rounded-xl shadow-[0_1px_0_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
      {/* ---------------- BULK ACTION BAR ---------------- */}
      {selectedProducts?.length > 0 && (
        <div className="flex items-center justify-between px-5 py-3 bg-[#eaf2ff] border-b border-[#c5dcff]">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-6 h-6 bg-[#FFE500] text-[#212121] text-xs font-bold rounded-full">
              {selectedProducts.length}
            </span>
            <span className="text-xs font-semibold text-[#1c5fba]">
              Products selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSelectAll}
              className="px-3 py-1.5 text-xs font-semibold text-[#2874F0] bg-white border border-[#c5dcff] rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
              {allSelected ? "Clear Selection" : "Select All"}
            </button>

            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors cursor-pointer">
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* ---------------- TABLE CONTAINER ---------------- */}
      <div className="overflow-x-auto">
        <div className="min-w-[960px]">
          {/* ---------------- HEADER ---------------- */}
          <div className="grid grid-cols-[44px_56px_1fr_130px_120px_96px_185px] items-center gap-3 px-5 py-3 bg-[#fafafa] border-b border-[#ebebeb] text-[11px] font-bold text-[#616161] uppercase tracking-wider">
            <div className="flex items-center h-full">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-gray-300 accent-[#2874F0] cursor-pointer"
              />
            </div>
            <div>Image</div>
            <div>Product Details</div>
            <div>Price</div>
            <div>Stock</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>

          {/* ---------------- ROWS ---------------- */}
          <div className="divide-y divide-[#ebebeb]">
            {products.map((product) => {
              const disc = getDiscount(product.price, product.originalPrice);
              const isSelected = selectedProducts?.includes(product.id);

              return (
                <div
                  key={product.id}
                  className={`grid grid-cols-[44px_56px_1fr_130px_120px_96px_185px] items-center gap-3 px-5 py-3.5 transition-colors group ${
                    isSelected ? "bg-[#eaf2ff]/40" : "hover:bg-[#fafafa]"
                  }`}>
                  {/* Checkbox */}
                  <div className="flex items-center h-full">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectProduct(product.id)}
                      className="w-4 h-4 rounded border-gray-300 accent-[#2874F0] cursor-pointer transition-all"
                    />
                  </div>

                  {/* Image */}
                  <div className="w-11 h-11 bg-[#f7f7f7] border border-[#e3e3e3] rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                    {product.banner ? (
                      <img
                        src={product.banner}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={18} className="text-gray-300" />
                    )}
                  </div>

                  {/* Name & ID */}
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-[13px] font-semibold text-[#303030] truncate group-hover:text-[#2874F0] transition-colors">
                        {product.name}
                      </p>
                      {product.detailsImage && (
                        <span
                          className="shrink-0 text-[10px] font-semibold bg-[#FFF8D6] text-[#6b4800] px-1.5 py-0.5 rounded border border-[#FFE500]"
                          title="Has Full-Width Story Banner">
                          Story
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-[#8a8a8a] truncate mt-0.5">
                      ID: {product.id}
                    </p>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-xs font-bold text-[#303030]">
                      {formatPKR(product.price)}
                    </p>
                    {disc > 0 && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-[10px] text-gray-400 line-through">
                          {formatPKR(product.originalPrice)}
                        </p>
                        <p className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {disc}% OFF
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Stock */}
                  <div>
                    <StockBadge stock={product.stock} />
                  </div>

                  {/* Status */}
                  <div>
                    <StatusPill isActive={product.isActive} />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-75 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleVisibility(product)}
                      title={product.isActive ? "Hide Product" : "Show Product"}
                      className="p-1.5 text-[#616161] hover:text-[#303030] hover:bg-[#f1f2f4] rounded-md transition-all cursor-pointer">
                      {product.isActive ? (
                        <Eye size={16} />
                      ) : (
                        <EyeOff size={16} />
                      )}
                    </button>

                    <a
                      href={`https://gharkaorganic.com/product/${product.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      title="View on Store"
                      className="p-1.5 text-[#616161] hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-all">
                      <ExternalLink size={16} />
                    </a>

                    <div className="w-[1px] h-4 bg-gray-200 mx-0.5" />

                    <button
                      onClick={() => navigate(`/products/reviews/${product.id}`)}
                      title={`Manage Product Reviews (${product.totalReviews || 0})`}
                      className="p-1.5 text-[#616161] hover:text-[#b45309] hover:bg-[#FFF8D6] rounded-md transition-all cursor-pointer">
                      <Star size={16} />
                    </button>

                    <button
                      onClick={() => navigate(`/products/edit/${product.id}`)}
                      title="Edit Product"
                      className="p-1.5 text-[#616161] hover:text-[#2874F0] hover:bg-[#eaf2ff] rounded-md transition-all cursor-pointer">
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(product)}
                      title="Delete Product"
                      className="p-1.5 text-[#616161] hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------------- LOAD MORE ---------------- */}
      {hasMore && (
        <div className="p-4 flex justify-center border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={loadMoreProducts}
            disabled={loadingMore}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
            {loadingMore && (
              <Loader2 className="animate-spin text-gray-400" size={16} />
            )}
            {loadingMore ? "Loading..." : "Load More Products"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
