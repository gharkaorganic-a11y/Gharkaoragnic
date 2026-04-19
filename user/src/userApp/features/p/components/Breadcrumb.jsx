import React from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

const Breadcrumb = ({ items = [] }) => {
  if (!items.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `https://gharkaorganic.com${item.href}` }),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb">
        <ol className="flex items-center flex-wrap gap-2 text-xs uppercase tracking-widest font-semibold text-gray-500">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={i} className="flex items-center gap-2">
                {!isLast ? (
                  <Link
                    to={item.href}
                    className="hover:text-green-700 transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-black" aria-current="page">
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <ChevronRightIcon
                    className="w-3 h-3 text-gray-400 stroke-2"
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb;
