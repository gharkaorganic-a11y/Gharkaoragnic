import React, { useEffect, useRef, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useCollection } from "./Usecollection";
import Breadcrumb from "./components/Breadcrumb";
import ProductGrid from "./components/ProductGrid";
import ResponsiveBanner from "./components/ResponsiveBanner";
import { productSections } from "../homepage/config/productCollection";
import SortDropdown from "../account/components/dropdown/SortDropdown";

const sectionMap = Object.fromEntries(productSections.map((s) => [s.key, s]));

/* SEO helper */
const formatTitle = (key = "") =>
  key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const CollectionPage = () => {
  const { collectionType = "all" } = useParams();
  const [sort, setSort] = useState("newest");
  const {
    displayProducts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useCollection({
    collectionType: collectionType === "all" ? "all" : collectionType,
    sort,
  });

  /* ───────── SEO + CONTENT MATCHING ───────── */
  const section = sectionMap[collectionType];

  const title = section?.title || formatTitle(collectionType);
  const subtitle = section?.subtitle || "";

  const description = useMemo(() => {
    if (subtitle) return subtitle;
    return `Explore premium ${title.toLowerCase()} crafted with natural ingredients and traditional methods. Delivered fresh from FarmDidi kitchens to yours.`;
  }, [subtitle, title]);

  /* ───────── INFINITE SCROLL ───────── */
  const sentinelRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "600px" },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <main className="min-h-screen bg-white text-gray-900 antialiased">
      {/* Space from top */}
      <div className="pt-8 md:pt-12" />

      {/* ───────── BREADCRUMB ───────── */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: title }]}
          />
        </div>
      </div>

      {/* ───────── BANNER - No text overlay ───────── */}
      <section className="mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden border border-gray-100">
            <ResponsiveBanner
              desktopImage="https://www.farmdidi.com/cdn/shop/files/mango_pickle_banner-07_4.jpg"
              mobileImage="https://www.jhajistore.com/cdn/shop/files/Jan_26_Sample_Pack_Collection_Mobile_Banner.webp"
              alt={`${title} Collection`}
            />
          </div>
        </div>
      </section>

      {/* ───────── SEO HEADER BLOCK - Separate from banner ───────── */}
      <header className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 mt-12 mb-8">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-gray-900">
          {title}
        </h1>
        <p className="mt-4 text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      </header>

      {/* ───────── TOOLBAR: Count + Sort ───────── */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {!isLoading ? (
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">
                {displayProducts?.length}
              </span>{" "}
              products
            </p>
          ) : (
            <div className="h-5 w-24 bg-gray-100 rounded animate-pulse" />
          )}
          <SortDropdown sort={sort} setSort={setSort} />
        </div>
      </div>

      {/* ───────── PRODUCTS SECTION ───────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <ProductGrid
          isLoading={isLoading}
          isError={isError}
          displayProducts={displayProducts}
          gridClass="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12"
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          sentinelRef={sentinelRef}
        />
      </section>
    </main>
  );
};

export default CollectionPage;
