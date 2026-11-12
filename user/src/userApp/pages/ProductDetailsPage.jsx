import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Leaf,
  ChevronDown,
  Check,
  Zap,
  MapPin,
  Share2,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

/* HOOKS */
import {
  useProductBySlug,
  useRelatedProducts,
} from "../features/product/hook/useProducts";
import { useCart } from "../features/cart/context/CartContext";

/* COMPONENTS */
import ProductImageGallery from "../components/product/ProductImageGallery";
import StickyAddToCartBar from "../components/product/StickyAddToCartBar";
import NewBreadcrumb from "../features/p/components/NewBreadcrumb";
import RelatedProducts from "../components/product/RelatedProducts";
import CustomerReviewsSectionNew from "../reviews/componenst/CustomerReviewsSectionnew";

const WEBSITE_URL = "https://gharkaorganic.com";

/* ----------------------------------
   FALLBACK COMPONENTS
---------------------------------- */

const LoadingSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#edf5ee] border-t-[#315c3c]" />
  </div>
);

const ErrorState = ({ navigate }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
    <div className="text-7xl font-black text-gray-100">404</div>

    <h2 className="mt-4 text-3xl font-semibold text-gray-900">
      Product Not Found
    </h2>

    <p className="mt-3 max-w-md text-sm leading-7 text-gray-500">
      The product you're looking for does not exist or may have been removed.
    </p>

    <button
      onClick={() => navigate("/")}
      className="mt-7 rounded-lg bg-[#315c3c] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#244b2e] cursor-pointer">
      Back To Home
    </button>
  </div>
);

/* ----------------------------------
   STAR RATING
---------------------------------- */

const ProductRating = ({ rating, total, onClick }) => {
  const average = Number(rating) || 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-wrap items-center gap-2 text-xs sm:text-sm group cursor-pointer">
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={15}
            className={
              star <= Math.round(average)
                ? "fill-[#F59E0B] text-[#F59E0B]"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </span>

      <span className="font-bold text-gray-900">{average.toFixed(1)}</span>

      <span className="text-gray-300">|</span>

      <span className="text-gray-600 font-normal group-hover:text-[#315c3c] group-hover:underline transition-colors">
        {total > 0
          ? `${total.toLocaleString("en-IN")} Customer Reviews`
          : "Verified Customer Reviews"}
      </span>
    </button>
  );
};

/* ----------------------------------
   MAIN PRODUCT DETAILS PAGE
---------------------------------- */

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  /* PAGE STATE */
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState(false);

  /* DATA FETCHING */
  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
  } = useProductBySlug(slug);

  const { data: relatedProducts = [], isLoading: relatedLoading } =
    useRelatedProducts(product, 4);

  /* EFFECTS */
  useEffect(() => {
    if (product?.sizes?.length) {
      setSelectedSize(product.sizes[0]);
    } else {
      setSelectedSize("Standard");
    }

    setQuantity(1);
    setActiveImageIndex(0);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [product]);

  /* ADD TO CART */
  const handleAddToCart = async () => {
    if (isAdding || product.stock === 0) return;

    setIsAdding(true);
    try {
      await addToCart({
        id: product.id,
        selectedSize: selectedSize || "Standard",
        selectedQuantity: quantity,
        name: product.name ?? "",
        price: product.price ?? null,
        image: product.banner ?? product.images?.[0] ?? "",
      });
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setIsAdding(false);
    }
  };

  /* BUY IT NOW (Instant Checkout) */
  const handleBuyNow = async () => {
    if (isBuyingNow || product.stock === 0) return;

    setIsBuyingNow(true);
    try {
      await addToCart({
        id: product.id,
        selectedSize: selectedSize || "Standard",
        selectedQuantity: quantity,
        name: product.name ?? "",
        price: product.price ?? null,
        image: product.banner ?? product.images?.[0] ?? "",
      });
      navigate("/checkout/address");
    } catch (err) {
      console.error("Failed to buy now:", err);
    } finally {
      setIsBuyingNow(false);
    }
  };

  /* SHARE LINK */
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} from Ghar Ka Organic`,
          url,
        });
      } catch {
        /* User cancelled or unsupported */
      }
    } else {
      navigator.clipboard?.writeText(url);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  /* REVIEWS JUMP */
  const scrollToReviews = useCallback(() => {
    const el = document.getElementById("reviews");
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: "smooth",
      });
    }
  }, []);

  /* PRODUCT IMAGES */
  const allImages = useMemo(() => {
    return [product?.banner, ...(product?.images || [])].filter(Boolean);
  }, [product]);

  /* LOADING / ERROR */
  if (productLoading) return <LoadingSkeleton />;
  if (productError || !product) {
    return <ErrorState navigate={navigate} />;
  }

  /* PRODUCT DATA CALCULATIONS */
  const price = Number(product.price || 0);
  const originalPrice = Number(product.originalPrice || 0);
  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const reviewStats = {
    average: Number(product.rating || 5.0).toFixed(1),
    total: Number(product.totalReviews || 0),
  };

  const seoDescription =
    product.metaDescription ||
    product.shortDescription ||
    `Buy authentic ${product.name} handcrafted in Uttarakhand from Ghar Ka Organic.`;

  const canonicalUrl =
    product.canonicalUrl || `${WEBSITE_URL}/product/${product.slug}`;

  const displaySizes =
    product.sizes?.length > 0 ? product.sizes : ["Standard"];

  return (
    <>
      <Helmet>
        <title>
          {product.metaTitle || `${product.name} | Ghar Ka Organic`}
        </title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        {product.ogImage && (
          <meta property="og:image" content={product.ogImage} />
        )}
      </Helmet>



      <div className="min-h-screen bg-white pb-24 font-sans text-gray-900">
        <NewBreadcrumb product={product} />

        <main className="mx-auto max-w-[1450px] px-4 pb-12 sm:px-7 lg:px-10">
          {/* =================================
              HERO MAIN SECTION (GALLERY & BUY BOX)
          ================================= */}
          <section className="mt-4 sm:mt-6 grid items-start gap-9 lg:grid-cols-12 lg:gap-14">
            {/* ── LEFT: PRODUCT GALLERY ── */}
            <div className="lg:col-span-7 lg:sticky lg:top-24">
              <div className="relative overflow-hidden rounded-2xl bg-[#faf9f5] border border-gray-100 shadow-2xs">
                <ProductImageGallery
                  images={allImages}
                  activeIndex={activeImageIndex}
                  onImageChange={setActiveImageIndex}
                  productName={product.name}
                />

                {/* DISCOUNT TAG */}
                {discount > 0 && (
                  <span className="absolute left-3.5 top-3.5 z-10 rounded-full bg-[#7B4627] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                    {discount}% OFF
                  </span>
                )}

                {/* PURITY BADGE */}
                <span className="absolute bottom-3.5 right-3.5 z-10 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-medium tracking-wide text-gray-800 shadow-sm backdrop-blur-sm border border-gray-100">
                  <Leaf size={13} className="text-[#315c3c]" />
                  100% Himalayan Organic
                </span>
              </div>
            </div>

            {/* ── RIGHT: BUY BOX (DIRECT ADMIN DATA) ── */}
            <div className="lg:col-span-5">
              <div>
                {/* BRAND & CATEGORY */}
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#315c3c]">
                    {product.brand || "GHAR KA ORGANIC"} •{" "}
                    {product.category || "HIMALAYAN PANTRY"}
                  </p>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 cursor-pointer">
                    <Share2 size={14} />
                    <span>{copyFeedback ? "Copied!" : "Share"}</span>
                  </button>
                </div>

                {/* PRODUCT TITLE - MATCHING HOMEPAGE TYPOGRAPHY */}
                <h1 className="text-2xl sm:text-3xl font-normal sm:font-medium text-gray-900 tracking-tight leading-snug">
                  {product.name}
                </h1>

                {/* RATING */}
                <div className="mt-3 pb-4 border-b border-gray-100 flex items-center justify-between">
                  <ProductRating
                    rating={reviewStats.average}
                    total={reviewStats.total}
                    onClick={scrollToReviews}
                  />

                  <span className="text-[11px] font-medium text-emerald-800 bg-[#edf5ee] px-2.5 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Authentic
                  </span>
                </div>

                {/* PRICE & DISCOUNT - MATCHING HOMEPAGE TYPOGRAPHY */}
                <div className="mt-4 p-4 rounded-xl bg-[#faf9f5] border border-stone-200/80">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                      ₹{price.toLocaleString("en-IN")}
                    </span>

                    {originalPrice > price && (
                      <>
                        <span className="text-sm sm:text-base text-gray-400 line-through font-normal">
                          ₹{originalPrice.toLocaleString("en-IN")}
                        </span>

                        <span className="inline-flex items-center text-xs font-bold px-2 py-0.5 rounded bg-[#edf5ee] text-[#315c3c]">
                          Save {discount}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-gray-500 font-normal flex flex-wrap items-center gap-1.5">
                    <Check size={14} className="text-[#315c3c]" />
                    <span>Inclusive of all taxes</span>
                    <span className="text-gray-300">•</span>
                    <span className="font-normal text-[#315c3c]">
                      Shipping charges confirmed when order is confirmed
                    </span>
                  </p>
                </div>

                {/* SHORT DESCRIPTION (FROM ADMIN) */}
                {product.shortDescription && (
                  <p className="mt-4 text-xs sm:text-sm leading-relaxed text-gray-600 font-normal">
                    {product.shortDescription}
                  </p>
                )}

                {/* CERTIFICATIONS BADGES (FROM ADMIN) */}
                {product.certifications?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#edf5ee] px-2.5 py-1 text-[11px] font-semibold text-[#315c3c] border border-emerald-200/60 shadow-2xs">
                        <ShieldCheck size={12} /> {cert}
                      </span>
                    ))}
                  </div>
                )}

                {/* WEIGHT / SIZE SELECTION (FROM ADMIN) */}
                {product.sizes?.length > 0 && (
                  <fieldset className="mt-6">
                    <div className="mb-2.5 flex items-center justify-between">
                      <legend className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                        Select Size / Weight
                      </legend>
                      <span className="text-xs font-medium text-[#315c3c]">
                        {selectedSize || displaySizes[0]}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {displaySizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          aria-pressed={selectedSize === size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[80px] rounded-lg border px-4 py-2.5 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                            selectedSize === size
                              ? "border-[#315c3c] bg-[#edf5ee] text-[#315c3c] font-semibold shadow-xs"
                              : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900"
                          }`}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

                {/* QUANTITY & ACTION BUTTONS */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                      Quantity
                    </p>
                    <span className="text-xs font-normal text-emerald-800 flex items-center gap-1">
                      <Zap size={12} />
                      {product.stock > 0 && product.stock <= 5
                        ? `Only ${product.stock} units remaining!`
                        : "In stock, ready to dispatch"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {/* QUANTITY STEPPER */}
                    <div className="sm:col-span-4 flex h-11 sm:h-12 items-center justify-between overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xs">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="flex h-full w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 cursor-pointer">
                        <Minus size={14} />
                      </button>

                      <span className="w-8 text-center text-sm font-bold text-gray-900">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                          setQuantity((q) =>
                            Math.min(Number(product.stock || 20), q + 1)
                          )
                        }
                        disabled={quantity >= Number(product.stock || 20)}
                        className="flex h-full w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 cursor-pointer">
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* PRIMARY: ADD TO CART */}
                    <div className="sm:col-span-8">
                      <button
                        id="main-add-to-cart"
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isAdding || product.stock === 0}
                        className="flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#315c3c] text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:bg-[#25482f] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer">
                        <ShoppingBag size={17} />
                        {isAdding
                          ? "Adding..."
                          : product.stock === 0
                          ? "Out Of Stock"
                          : "Add To Cart"}
                      </button>
                    </div>
                  </div>

                  {/* SECONDARY: BUY IT NOW (INSTANT CHECKOUT) */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={isBuyingNow || product.stock === 0}
                    className="mt-2.5 flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#7B4627] text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:bg-[#62371d] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer">
                    <Zap size={16} />
                    {isBuyingNow ? "Preparing Order..." : "Buy It Now"}
                  </button>
                </div>

                {/* TRUST & LOGISTICS CARD */}
                <div className="mt-6 rounded-xl border border-stone-200 bg-[#faf9f5] p-4 sm:p-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Truck size={18} className="shrink-0 text-[#315c3c] mt-0.5" />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">
                          Fast Dispatch
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 font-normal">
                          Direct from Uttarakhand
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <ShieldCheck
                        size={18}
                        className="shrink-0 text-[#315c3c] mt-0.5"
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">
                          Cash on Delivery
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 font-normal">
                          Available at checkout
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* QUICK PRODUCT HIGHLIGHTS */}
                  <div className="mt-4 pt-4 border-t border-stone-200/80 grid grid-cols-2 gap-y-2 text-xs">
                    <div>
                      <span className="text-gray-500 font-normal">Origin: </span>
                      <span className="font-medium text-gray-900">
                        Nainital, Uttarakhand
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-500 font-normal">Shelf Life: </span>
                      <span className="font-medium text-gray-900">
                        {product.shelfLife || "12 Months"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* TAGS (FROM ADMIN) */}
                {product.tags?.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Tags:
                    </span>
                    {product.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* =================================
              PRODUCT STORY & INFOGRAPHIC IMAGE
              Full width of outer <main> container (margins & max-width match sibling sections)
          ================================= */}
          {product.detailsImage && (
            <section className="mt-12 sm:mt-16 border-t border-gray-200/80 pt-10 sm:pt-12">
              <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-[#faf9f5]/50 shadow-2xs">
                <img
                  src={product.detailsImage}
                  alt={`${product.name || "Product"} details and infographic`}
                  className="block w-full h-auto"
                  loading="lazy"
                />
              </div>
            </section>
          )}

          {/* =================================
              PRODUCT DESCRIPTION & INGREDIENTS (DIRECT ADMIN DATA)
          ================================= */}
          {(product.description || product.ingredients) && (
            <section className="mt-12 sm:mt-16 border-t border-gray-200/80 pt-10 sm:pt-12">
              <div className="grid gap-8 md:grid-cols-12 items-start">
                {/* DETAILED DESCRIPTION (FROM ADMIN) */}
                {product.description && (
                  <div className={`${product.ingredients ? "md:col-span-7" : "md:col-span-12"}`}>
                    <div className="mb-3.5 flex items-center gap-2">
                      <Sparkles size={17} className="text-[#315c3c]" />
                      <h2 className="text-xl sm:text-2xl font-normal sm:font-medium text-gray-900 tracking-tight">
                        About {product.name}
                      </h2>
                    </div>

                    <div className="prose max-w-none whitespace-pre-wrap text-xs sm:text-sm md:text-[14px] leading-relaxed text-gray-600 font-normal">
                      {product.description}
                    </div>
                  </div>
                )}

                {/* INGREDIENTS & SPECIFICATIONS (FROM ADMIN) */}
                {product.ingredients && (
                  <div className={`${product.description ? "md:col-span-5" : "md:col-span-12"}`}>
                    <div className="rounded-xl border border-stone-200 bg-[#faf9f5] p-5 sm:p-6">
                      <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#315c3c]">
                        PRODUCT INFORMATION
                      </p>
                      <h3 className="mt-1 text-lg sm:text-xl font-normal sm:font-medium text-gray-900 tracking-tight">
                        Ingredients &amp; Origin
                      </h3>

                      <div className="mt-3.5 text-xs sm:text-sm leading-relaxed text-gray-600">
                        <p className="font-medium text-gray-900 mb-1">Ingredients:</p>
                        <p className="whitespace-pre-wrap">{product.ingredients}</p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-stone-200/90 space-y-2.5 text-xs sm:text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500 font-normal">Origin:</span>
                          <span className="font-medium text-gray-900 text-right">
                            Mangoli, Nainital, Uttarakhand
                          </span>
                        </div>

                        {product.shelfLife && (
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500 font-normal">Shelf Life:</span>
                            <span className="font-medium text-gray-900 text-right">
                              {product.shelfLife}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500 font-normal">Brand:</span>
                          <span className="font-medium text-gray-900 text-right">
                            {product.brand || "Ghar Ka Organic"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* =================================
              CUSTOMER REVIEWS (DIRECT FIRESTORE & ADMIN DATA)
          ================================= */}
          <section id="reviews" className="mt-14 sm:mt-18 border-t border-[#eaece5] pt-10 sm:pt-12">
            <CustomerReviewsSectionNew
              productId={product?.id}
              product={product}
            />
          </section>

          {/* =================================
              FREQUENTLY ASKED QUESTIONS (FROM ADMIN OR STORE FAQ)
          ================================= */}
          <section className="mt-14 sm:mt-18 border-t border-gray-200/80 pt-10 sm:pt-12">
            <div className="mb-8 text-center">
              <p className="mb-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#315c3c]">
                FREQUENTLY ASKED QUESTIONS
              </p>
              <h2 className="text-2xl sm:text-3xl font-normal sm:font-medium text-gray-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <div className="mx-auto mt-3 h-[2px] w-12 bg-[#315c3c]" />
            </div>

            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
              {(product.faq?.length > 0
                ? product.faq
                : [
                  {
                    question: `How is Ghar Ka Organic ${product.name} prepared?`,
                    answer:
                      "Prepared in small artisanal batches in Nainital, Uttarakhand using authentic Himalayan recipes, unadulterated ingredients, and zero synthetic chemical preservatives.",
                  },
                  {
                    question: "How long does shipping take and is Cash on Delivery available?",
                    answer:
                      "All orders are dispatched within 24-48 hours directly from Uttarakhand. Delivery takes 3-5 business days across India. Cash on Delivery (COD) is available at checkout.",
                  },
                  {
                    question: "What is the shelf life and how should I store this product?",
                    answer: `The shelf life is ${product.shelfLife || "12 months"}. Store in a clean, dry place away from direct moisture and always use a clean, dry spoon.`,
                  },
                  {
                    question: "What if the product arrives damaged during transit?",
                    answer:
                      "We use shock-absorbent eco-friendly packaging. In the rare event of transit damage, message us on WhatsApp with a photo and we will send a free immediate replacement.",
                  },
                ]
              ).map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="py-4">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between text-left text-sm sm:text-[15px] font-medium text-gray-900 focus:outline-none cursor-pointer">
                      <span>{item.question}</span>
                      <ChevronDown
                        size={17}
                        className={`text-gray-500 transition-transform duration-200 shrink-0 ml-4 ${isOpen ? "rotate-180 text-[#315c3c]" : ""
                          }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-gray-600 font-normal">
                        {item.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* =================================
              RELATED PRODUCTS
          ================================= */}
          <section className="mt-14 sm:mt-18 border-t border-[#eaece5] pt-10 sm:pt-12">
            <div className="mb-6 sm:mb-8 text-center">
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#315c3c]">
                EXPLORE MORE FROM HIMALAYAS
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-normal sm:font-medium text-gray-900 tracking-tight">
                You May Also Love
              </h2>
            </div>
            <RelatedProducts
              products={relatedProducts}
              loading={relatedLoading}
              maxItems={4}
            />
          </section>
        </main>

        {/* =================================
            STICKY ADD TO CART BAR
        ================================= */}
        <StickyAddToCartBar
          product={product}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          quantity={quantity}
          setQuantity={setQuantity}
          onAddToCart={handleAddToCart}
          isAdding={isAdding}
        />
      </div>
    </>
  );
};

export default ProductDetailsPage;
