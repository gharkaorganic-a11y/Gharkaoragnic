import React from "react";
import { useNavigate } from "react-router-dom";

const NewBreadcrumb = ({ product }) => {
  const navigate = useNavigate();

  const crumbs = [
    { label: "Home", onClick: () => navigate("/") },
    { label: "Product", onClick: () => navigate("/products") },
    { label: product?.name, isLast: true },
  ];

  return (
    <div className="w-full bg-gray-100 border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-2.5">
        <div className="flex items-center text-[13px] text-gray-500">
          {crumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <span
                onClick={crumb.onClick}
                className={`
                  ${
                    crumb.isLast
                      ? "text-gray-900 font-medium"
                      : "hover:text-gray-800 cursor-pointer"
                  }
                  transition-colors
                `}>
                {crumb.label}
              </span>

              {index !== crumbs.length - 1 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewBreadcrumb;
