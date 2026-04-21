import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ items = [], product }) => {
  // Backward compatibility for product page
  const resolvedItems =
    items.length > 0
      ? items
      : [
          { label: "Home", to: "/" },
          { label: "Products", to: "/all-products" },
          { label: product?.name, isLast: true },
        ];

  if (resolvedItems.length <= 1) return null;

  return (
    <nav
      className="w-full border-b border-gray-100 bg-white"
      aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center py-2.5 text-xs sm:text-sm overflow-hidden">
          {resolvedItems.map((item, index) => {
            const isLast = item.isLast || index === resolvedItems.length - 1;
            const isFirst = index === 0;

            return (
              <li
                key={index}
                className={`flex items-center min-w-0 ${
                  isFirst ? "" : "ml-1 sm:ml-1.5"
                }`}>
                {/* Separator */}
                {index > 0 && (
                  <span
                    className="text-gray-300 mx-1 sm:mx-1.5 select-none"
                    aria-hidden="true">
                    /
                  </span>
                )}

                {/* Item */}
                {isLast ? (
                  <span
                    className="font-medium text-gray-900 truncate max-w- xs:max-w- sm:max-w-none"
                    aria-current="page"
                    title={item.label}>
                    {item.label}
                  </span>
                ) : item.to ? (
                  <Link
                    to={item.to}
                    onClick={item.onClick}
                    className="text-gray-500 hover:text-gray-900 transition-colors truncate max-w- xs:max-w- sm:max-w-none"
                    title={item.label}>
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className="text-gray-500 hover:text-gray-900 transition-colors truncate max-w- xs:max-w- sm:max-w-none text-left"
                    title={item.label}>
                    {item.label}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
