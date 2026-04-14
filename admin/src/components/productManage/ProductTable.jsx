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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* ---------------- BULK ACTION BAR ---------------- */}
      {selectedProducts?.length > 0 && (
        <div className="flex items-center justify-between px-6 py-3.5 bg-indigo-50/80 border-b border-indigo-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full">
              {selectedProducts.length}
            </span>
            <span className="text-sm font-medium text-indigo-900">
              Products selected
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSelectAll}
              className="px-4 py-1.5 text-sm font-medium text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm">
              {allSelected ? "Clear Selection" : "Select All"}
            </button>

            <button
              onClick={handleBulkDelete}
              className="px-4 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-red-500">
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* ---------------- TABLE CONTAINER ---------------- */}
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* ---------------- HEADER ---------------- */}
          <div className="grid grid-cols-[48px_64px_1fr_140px_120px_100px_160px] items-center gap-4 px-6 py-3.5 bg-gray-50/50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="flex items-center h-full">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
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
          <div className="divide-y divide-gray-100">
            {products.map((product) => {
              const disc = getDiscount(product.price, product.originalPrice);
              const isSelected = selectedProducts?.includes(product.id);

              return (
                <div
                  key={product.id}
                  className={`grid grid-cols-[48px_64px_1fr_140px_120px_100px_160px] items-center gap-4 px-6 py-4 transition-colors group ${
                    isSelected ? "bg-indigo-50/30" : "hover:bg-gray-50/80"
                  }`}>
                  {/* Checkbox */}
                  <div className="flex items-center h-full">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectProduct(product.id)}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-all"
                    />
                  </div>

                  {/* Image */}
                  <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                    {product.banner ? (
                      <img
                        src={product.banner}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={20} className="text-gray-300" />
                    )}
                  </div>

                  {/* Name & ID */}
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-semibold text-gray-900 truncate mb-0.5 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </p>
                    <p className="text-[11px] font-medium text-gray-400 truncate">
                      ID: {product.id}
                    </p>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPKR(product.price)}
                    </p>
                    {disc > 0 && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-[11px] text-gray-400 line-through">
                          {formatPKR(product.originalPrice)}
                        </p>
                        <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
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
                  <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleVisibility(product)}
                      title={product.isActive ? "Hide Product" : "Show Product"}
                      className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all">
                      {product.isActive ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </button>

                    <a
                      href={`/product/${product.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      title="View on Store"
                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all">
                      <ExternalLink size={18} />
                    </a>

                    <div className="w-[1px] h-4 bg-gray-200 mx-1" />

                    <button
                      onClick={() => navigate(`/products/edit/${product.id}`)}
                      title="Edit Product"
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all">
                      <Edit2 size={18} />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(product)}
                      title="Delete Product"
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all">
                      <Trash2 size={18} />
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
