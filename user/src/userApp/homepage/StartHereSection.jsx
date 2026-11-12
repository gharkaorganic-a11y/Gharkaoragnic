import React, { memo, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productSections } from "../features/homepage/config/productCollection";
import { preferredSlug, routeAliases } from "../features/p/utils/SECTIONKEY";
import { DEFAULT_PRODUCTS } from "../features/search/siteUrlsIndex";
import { productService } from "../features/product/services/ProductService";

const MAX_CARDS = 8;

const COLLECTION_PRIORITY = [
  "ghee",
  "honey",
  "pickle",
  "chutney",
  "spices",
  "pahadiSalts",
  "pahadiDals",
  "new",
];

const SECTION_MAP = Object.fromEntries(productSections.map((s) => [s.key, s]));

const STARTER_TABS = [
  {
    key: "nutrient-rich",
    tabLabel: "All Essentials",
    subheading: "Nutrient Rich",
    collectionKeys: COLLECTION_PRIORITY,
    viewAllTo: "/collections",
    viewAllLabel: "View all products",
  },
  {
    key: "new",
    tabLabel: "Best Sellers",
    subheading: "Most Loved Products",
    collectionKeys: ["new"],
    viewAllTo: "/shop/best-sellers",
    viewAllLabel: "View best sellers",
  },
  {
    key: "ghee-honey",
    tabLabel: "Ghee & Honey",
    subheading: "Pure Bilona Ghee & Forest Honey",
    collectionKeys: ["ghee", "honey"],
    viewAllTo: `/${preferredSlug.ghee}`,
    viewAllLabel: "Explore ghee & honey",
  },
  {
    key: "pickle-chutney",
    tabLabel: "Pickles & Chutney",
    subheading: "Sun-Cured Pickles & Chutneys",
    collectionKeys: ["pickle", "chutney"],
    viewAllTo: `/${preferredSlug.pickle}`,
    viewAllLabel: "Explore pickles",
  },
  {
    key: "pantry",
    tabLabel: "Spices, Salts & Dals",
    subheading: "Mountain Spices, Salts & Dals",
    collectionKeys: ["spices", "pahadiSalts", "pahadiDals"],
    viewAllTo: `/${preferredSlug.spices}`,
    viewAllLabel: "Explore pantry",
  },
  {
    key: "categories",
    tabLabel: "All Categories",
    subheading: "Shop by Category",
    collectionKeys: [],
    viewAllTo: "/collections",
    viewAllLabel: "Browse all",
  },
];

const getCollectionPath = (key) => {
  if (!key || key === "all") return "/collections";
  if (key === "new") return "/shop/best-sellers";
  return `/${preferredSlug[key] ?? "collections"}`;
};

const inferCollectionKey = (item = {}) => {
  const types = Array.isArray(item.collectionTypes) ? item.collectionTypes : [];
  for (const key of COLLECTION_PRIORITY) {
    if (types.some((t) => String(t).toLowerCase() === key.toLowerCase())) {
      return key;
    }
  }

  const rawCat = String(item.category || item.categoryId || "").toLowerCase().trim();
  if (SECTION_MAP[rawCat]) return rawCat;
  if (routeAliases[rawCat]) return routeAliases[rawCat];

  const text = `${item.name || item.title || ""} ${(item.tags || []).join(" ")}`.toLowerCase();
  if (text.includes("ghee") || text.includes("bilona")) return "ghee";
  if (text.includes("honey") || text.includes("shahad")) return "honey";
  if (text.includes("chutney") || text.includes("bhang")) return "chutney";
  if (
    text.includes("achar") ||
    text.includes("pickle") ||
    text.includes("nimbu") ||
    text.includes("mango")
  ) {
    return "pickle";
  }
  if (text.includes("salt") || text.includes("namak") || text.includes("loon")) {
    return "pahadiSalts";
  }
  if (
    text.includes("dal") ||
    text.includes("rajma") ||
    text.includes("bhatt") ||
    text.includes("pulse")
  ) {
    return "pahadiDals";
  }
  if (
    text.includes("spice") ||
    text.includes("masala") ||
    text.includes("haldi") ||
    text.includes("timur") ||
    text.includes("jakhiya")
  ) {
    return "spices";
  }
  return "new";
};

const resolveVerifiedFallbackImage = (key, title = "", productImages = {}) => {
  const lower = title.toLowerCase();

  if ((lower.includes("ghee") || key === "ghee") && productImages.GHEE?.["1x1"]) {
    return productImages.GHEE["1x1"];
  }
  if ((lower.includes("honey") || key === "honey") && productImages.HONEY?.["1x1"]) {
    return productImages.HONEY["1x1"];
  }
  if ((lower.includes("nimbu") || lower.includes("lemon")) && productImages.NIMBU_ACHAR?.["1x1"]) {
    return productImages.NIMBU_ACHAR["1x1"];
  }
  if (
    (lower.includes("aam") || lower.includes("mango") || key === "pickle") &&
    productImages.AAM_ACHAR?.["1x1"]
  ) {
    return productImages.AAM_ACHAR["1x1"];
  }
  if (
    (lower.includes("chutney") || lower.includes("bhang") || key === "chutney") &&
    productImages.BHANG_CHUTNEY?.["1x1"]
  ) {
    return productImages.BHANG_CHUTNEY["1x1"];
  }

  return SECTION_MAP[key]?.chipImage || "/icons/categories/all.png";
};

const buildVerifiedFallbackCatalog = (productImages) => {
  const chutneyFallback = {
    id: "fallback-bhang-chutney",
    title: "Bhang Chutney – Traditional Kumaoni Recipe",
    collectionKey: "chutney",
    image: resolveVerifiedFallbackImage("chutney", "bhang chutney", productImages),
    to: "/pahadi-chutney",
    topicKey: "chutney",
  };

  const fromDefaults = DEFAULT_PRODUCTS.map((item) => {
    const key = inferCollectionKey(item);
    const lower = (item.name || "").toLowerCase();
    let topicKey = key;
    let to = getCollectionPath(key);

    if (lower.includes("nimbu") || lower.includes("lemon")) {
      topicKey = "nimbu";
      to = "/nimbu-achar-online";
    } else if (lower.includes("aam") || lower.includes("mango")) {
      topicKey = "aam";
      to = "/pahadi-achar-online";
    } else if (lower.includes("rajma")) {
      topicKey = "rajma";
      to = "/pahadi-rajma-online";
    }

    return {
      id: `fallback-${item.id}`,
      title: item.name,
      collectionKey: key,
      image: resolveVerifiedFallbackImage(key, item.name, productImages),
      to,
      topicKey,
    };
  });

  // Order essentials so default view spans every Ghar Ka Organic product category.
  return [
    fromDefaults.find((p) => p.collectionKey === "ghee"),
    fromDefaults.find((p) => p.collectionKey === "honey"),
    fromDefaults.find((p) => p.topicKey === "aam"),
    fromDefaults.find((p) => p.topicKey === "nimbu"),
    chutneyFallback,
    ...fromDefaults.filter(
      (p) =>
        !["ghee", "honey"].includes(p.collectionKey) &&
        !["aam", "nimbu"].includes(p.topicKey),
    ),
  ].filter(Boolean);
};

const toStarterCard = (product, productImages) => {
  const collectionKey = inferCollectionKey(product);
  const title = product.name || product.title || "Ghar Ka Organic";
  const image =
    product.banner ||
    (Array.isArray(product.images) && product.images[0]) ||
    resolveVerifiedFallbackImage(collectionKey, title, productImages);

  const to = product.slug
    ? `/product/${product.slug}`
    : getCollectionPath(collectionKey);

  return {
    id: `live-${product.id || product.slug || title}`,
    title,
    image,
    to,
    collectionKey,
    isLive: true,
  };
};

const getTopicSignature = (card) => {
  const lower = (card.title || "").toLowerCase();
  if (lower.includes("nimbu") || lower.includes("lemon")) return "nimbu";
  if (lower.includes("aam") || lower.includes("mango")) return "aam";
  if (lower.includes("rajma")) return "rajma";
  return card.collectionKey || lower;
};

const StarterCardImage = memo(({ src, alt }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#faf9f5] p-3 text-center">
        <span className="text-xs font-semibold leading-tight text-[#315c3c]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
    />
  );
});

StarterCardImage.displayName = "StarterCardImage";

const StarterCardSkeleton = memo(() => (
  <div
    aria-hidden="true"
    className="flex w-[138px] shrink-0 snap-start flex-col items-center sm:w-[152px] lg:w-auto animate-pulse">
    <div className="w-full aspect-square bg-[#eef0f3] p-2.5 sm:p-3">
      <div className="h-full w-full bg-white/80" />
    </div>
    <div className="mt-2.5 h-3.5 w-4/5 rounded bg-[#eceef1]" />
    <div className="mt-1.5 h-3.5 w-3/5 rounded bg-[#eceef1]" />
  </div>
));

StarterCardSkeleton.displayName = "StarterCardSkeleton";

const StarterCard = memo(({ item }) => (
  <Link
    to={item.to}
    className="group flex w-[138px] shrink-0 snap-start flex-col items-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315c3c] sm:w-[152px] lg:w-auto">
    <div className="w-full aspect-square bg-[#eef0f3] p-2.5 sm:p-3 transition-colors duration-200 group-hover:bg-[#e5e8ec]">
      <div className="flex h-full w-full items-center justify-center overflow-hidden bg-white">
        <StarterCardImage src={item.image} alt={item.title} />
      </div>
    </div>

    <span
      className="mt-2.5 sm:mt-3 px-0.5 text-center text-[12.5px] sm:text-[13px] font-medium leading-[1.35] line-clamp-2 transition-colors group-hover:text-[#315c3c]"
      style={{ color: "var(--storefront-text-color, #263329)" }}>
      {item.title}
    </span>
  </Link>
));

StarterCard.displayName = "StarterCard";

/**
 * StartHereSection
 * Guided starter discovery shelf for first-time visitors on the homepage.
 * Unifies live Firestore products, categories, collections, and verified catalog assets
 * into a clean 8-card horizontal starter strip.
 */
const StartHereSection = ({
  homeProducts = {},
  allHomepageProducts = [],
  categories = [],
  collections = [],
  productImages = {},
  loading = false,
}) => {
  const [activeTabKey, setActiveTabKey] = useState("nutrient-rich");

  // Fetch general storeProducts so items without homepage collectionTypes tags also surface.
  const { data: catalogPage, isLoading: catalogLoading } = useQuery({
    queryKey: ["homepage", "start-here-catalog"],
    queryFn: () => productService.getProducts({ pageSize: 24 }),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });

  const activeTab = useMemo(
    () => STARTER_TABS.find((t) => t.key === activeTabKey) || STARTER_TABS[0],
    [activeTabKey],
  );

  const mergedLiveProducts = useMemo(() => {
    const byId = new Map();
    const addProduct = (p) => {
      if (!p || p.isDeleted === true || p.isActive === false) return;
      const id = String(p.id || p.slug || p.name || "");
      if (!id || byId.has(id)) return;
      byId.set(id, p);
    };

    allHomepageProducts.forEach(addProduct);
    (catalogPage?.products ?? []).forEach(addProduct);
    return [...byId.values()];
  }, [allHomepageProducts, catalogPage]);

  const fallbackCatalog = useMemo(
    () => buildVerifiedFallbackCatalog(productImages),
    [productImages],
  );

  const categoryCards = useMemo(() => {
    const cards = [];
    const seen = new Set();

    productSections
      .filter((sec) => sec.key !== "all")
      .forEach((sec) => {
        seen.add(sec.title.toLowerCase());
        cards.push({
          id: `sec-${sec.key}`,
          title: sec.title,
          image: sec.chipImage,
          to: getCollectionPath(sec.key),
        });
      });

    [...categories, ...collections].forEach((entry) => {
      if (cards.length >= MAX_CARDS) return;
      if (entry?.isActive === false) return;
      const title = entry?.name || entry?.title || "";
      const img = entry?.image || entry?.img || entry?.imageUrl;
      if (!title || !img || seen.has(title.toLowerCase())) return;
      seen.add(title.toLowerCase());
      const slugKey = routeAliases[String(entry.slug || title).toLowerCase()];
      cards.push({
        id: `meta-${entry.id || title}`,
        title,
        image: img,
        to: slugKey ? getCollectionPath(slugKey) : "/collections",
      });
    });

    return cards.slice(0, MAX_CARDS);
  }, [categories, collections]);

  const visibleItems = useMemo(() => {
    if (activeTab.key === "categories") {
      return categoryCards;
    }

    const picked = [];
    const seenLiveIds = new Set();

    const tryPickProduct = (product) => {
      if (!product || picked.length >= MAX_CARDS) return false;
      const id = String(product.id || product.slug || product.name || "");
      if (!id || seenLiveIds.has(id)) return false;
      seenLiveIds.add(id);
      picked.push(toStarterCard(product, productImages));
      return true;
    };

    if (activeTab.key === "nutrient-rich") {
      // Round-robin across all website collections so every product line is represented.
      for (let pass = 0; pass < 3 && picked.length < MAX_CARDS; pass++) {
        for (const key of COLLECTION_PRIORITY) {
          if (picked.length >= MAX_CARDS) break;
          const bucket =
            Array.isArray(homeProducts[key]) && homeProducts[key].length
              ? homeProducts[key]
              : mergedLiveProducts.filter((p) => inferCollectionKey(p) === key);
          if (bucket[pass]) tryPickProduct(bucket[pass]);
        }
      }
      for (const product of mergedLiveProducts) {
        if (picked.length >= MAX_CARDS) break;
        tryPickProduct(product);
      }
    } else {
      const targetKeys = new Set(activeTab.collectionKeys);
      for (const key of activeTab.collectionKeys) {
        (homeProducts[key] ?? []).forEach(tryPickProduct);
      }
      mergedLiveProducts.forEach((product) => {
        if (picked.length >= MAX_CARDS) return;
        const types = Array.isArray(product.collectionTypes)
          ? product.collectionTypes.map((t) => String(t).toLowerCase())
          : [];
        const matchesType = activeTab.collectionKeys.some((k) =>
          types.includes(k.toLowerCase()),
        );
        if (matchesType || targetKeys.has(inferCollectionKey(product))) {
          tryPickProduct(product);
        }
      });
    }

    // Fill missing topic slots from verified catalog fallbacks without duplicating live subjects.
    if (picked.length < MAX_CARDS) {
      const coveredTopics = new Set(picked.map(getTopicSignature));
      const allowedFallbacks =
        activeTab.key === "nutrient-rich" || activeTab.key === "new"
          ? fallbackCatalog
          : fallbackCatalog.filter((f) =>
              activeTab.collectionKeys.includes(f.collectionKey),
            );

      for (const fallback of allowedFallbacks) {
        if (picked.length >= MAX_CARDS) break;
        if (!coveredTopics.has(getTopicSignature(fallback))) {
          coveredTopics.add(getTopicSignature(fallback));
          picked.push(fallback);
        }
      }

      // Only top up remaining slots when no live items matched this view.
      if (picked.length === 0) {
        allowedFallbacks.slice(0, MAX_CARDS).forEach((fallback) => picked.push(fallback));
      }
    }

    return picked.slice(0, MAX_CARDS);
  }, [
    activeTab,
    categoryCards,
    fallbackCatalog,
    homeProducts,
    mergedLiveProducts,
    productImages,
  ]);

  const showSkeleton =
    activeTab.key !== "categories" &&
    mergedLiveProducts.length === 0 &&
    (loading || catalogLoading);

  return (
    <section
      aria-labelledby="start-here-heading"
      className="w-full border-b border-[#ece9df]/70 bg-white py-9 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Centered Heading */}
        <h2
          id="start-here-heading"
          className="text-center text-2xl font-medium tracking-tight sm:text-[28px]"
          style={{ color: "var(--storefront-heading-color, #263329)" }}>
          New to Ghar Ka Organic? Start Here
        </h2>

        {/* Minimal Starter Tabs Covering All Website Collections */}
        <div
          role="tablist"
          aria-label="Explore Ghar Ka Organic essentials"
          className="mt-4 flex items-center justify-start gap-2 overflow-x-auto pb-1 scrollbar-hide sm:justify-center">
          {STARTER_TABS.map((tab) => {
            const isActive = tab.key === activeTab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTabKey(tab.key)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#315c3c] text-white"
                    : "bg-[#f4f2e9] text-[#263329] hover:bg-[#eae6d8]"
                }`}>
                {tab.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Left Subheading & Action Link */}
        <div className="mb-3.5 mt-6 flex items-baseline justify-between gap-4 sm:mb-4 sm:mt-7">
          <h3
            className="text-base font-medium tracking-tight sm:text-lg"
            style={{ color: "var(--storefront-heading-color, #263329)" }}>
            {activeTab.subheading}
          </h3>
          <Link
            to={activeTab.viewAllTo}
            className="shrink-0 text-xs font-medium text-[#315c3c] underline-offset-4 hover:underline sm:text-sm">
            {activeTab.viewAllLabel} →
          </Link>
        </div>

        {/* 8-Card Square Framed Horizontal Shelf */}
        <div className="flex gap-3.5 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-8 lg:gap-3.5 lg:overflow-visible lg:pb-0">
          {showSkeleton
            ? Array.from({ length: MAX_CARDS }).map((_, i) => (
                <StarterCardSkeleton key={i} />
              ))
            : visibleItems.map((item) => (
                <StarterCard key={item.id} item={item} />
              ))}
        </div>
      </div>
    </section>
  );
};

export default memo(StartHereSection);
