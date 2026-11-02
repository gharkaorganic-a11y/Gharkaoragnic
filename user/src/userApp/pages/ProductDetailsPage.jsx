import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Leaf,
  PackageCheck,
} from "lucide-react";

/* HOOKS */
import {
  useProductBySlug,
  useRelatedProducts,
} from "../features/product/hook/useProducts";

import { useCart } from "../features/cart/context/CartContext";

/* COMPONENTS */
import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductBottomBar from "../features/account/components/bars/ProductBottomBar";
import NewBreadcrumb from "../features/p/components/NewBreadcrumb";
import RelatedProducts from "../components/product/RelatedProducts";
import FaqSection from "../homepage/FAQSection";
import OurStoryComponent from "../homepage/OurStoryComponent";
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
      className="mt-7 rounded-lg bg-[#315c3c] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#244b2e]">
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
      className="flex flex-wrap items-center gap-2 text-xs sm:text-sm group">
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

      <span className="text-gray-500 font-normal group-hover:text-[#315c3c] group-hover:underline transition-colors">
        {total > 0 ? `${total.toLocaleString("en-IN")} Customer Reviews` : "No reviews yet"}
      </span>
    </button>
  );
};

/* ----------------------------------
   MAIN PAGE
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
        selectedSize,
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

  /* REVIEWS */

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

  /* PRODUCT DATA */

  const price = Number(product.price || 0);
  const originalPrice = Number(product.originalPrice || 0);

  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const reviewStats = {
    average: Number(product.rating || 0).toFixed(1),
    total: Number(product.totalReviews || 0),
  };

  /* ORIGINAL SEO - UNCHANGED */

  const seoDescription =
    product.metaDescription ||
    product.shortDescription ||
    `Buy ${product.name} online from Ghar Ka Organic`;

  const canonicalUrl =
    product.canonicalUrl || `${WEBSITE_URL}/product/${product.slug}`;

  /* ----------------------------------
     RENDER
  ---------------------------------- */

  return (
    <>
      {/* ORIGINAL HELMET SEO - UNCHANGED */}

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
              PRODUCT MAIN SECTION
          ================================= */}

          <section className="mt-5 grid items-start gap-9 lg:grid-cols-12 lg:gap-14">
            {/* LEFT: PRODUCT GALLERY */}

            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-xl bg-[#faf9f5] border border-gray-100">
                <ProductImageGallery
                  images={allImages}
                  activeIndex={activeImageIndex}
                  onImageChange={setActiveImageIndex}
                  productName={product.name}
                />

                {discount > 0 && (
                  <span className="absolute left-3 top-3 z-10 rounded-md bg-[#7B4627] px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
                    {discount}% OFF
                  </span>
                )}

                <span className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-medium tracking-wide text-gray-700 shadow-xs backdrop-blur-sm border border-gray-100">
                  <Leaf size={13} className="text-[#315c3c]" />
                  100% Himalayan
                </span>
              </div>

              {/* GALLERY FOOTER */}

              <div className="mt-4 hidden items-center justify-between border-b border-gray-200/80 pb-4 sm:flex">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#315c3c]">
                  Authentic Uttarakhand Products
                </span>

                <span className="text-xs text-gray-500 font-normal">
                  Naturally made • Hand-packed in Bhimtal
                </span>
              </div>
            </div>

            {/* RIGHT: PRODUCT INFORMATION */}

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                {/* EYEBROW */}

                <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#315c3c]">
                  GHAR KA ORGANIC • {product.category || "HIMALAYAN PANTRY"}
                </p>

                {/* PRODUCT TITLE */}

                <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-normal sm:font-medium text-gray-900 tracking-tight leading-snug">
                  {product.name}
                </h1>

                {/* RATING */}

                <div className="mt-4 border-b border-gray-200/80 pb-4">
                  <ProductRating
                    rating={reviewStats.average}
                    total={reviewStats.total}
                    onClick={scrollToReviews}
                  />
                </div>

                {/* PRICE */}

                <div className="mt-5">
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
                          Save {discount}%
                        </span>
                      </>
                    )}
                  </div>

                  <p className="mt-1.5 text-xs text-gray-500 font-normal">
                    Inclusive of all taxes • Free shipping across India
                  </p>
                </div>

                {/* SHORT DESCRIPTION */}

                {product.shortDescription && (
                  <p className="mt-5 max-w-xl text-sm sm:text-[15px] leading-relaxed text-gray-600 font-normal">
                    {product.shortDescription}
                  </p>
                )}

                {/* TRUST INFORMATION */}

                <div className="mt-6 grid grid-cols-2 gap-4 border-y border-gray-200/80 py-4 sm:py-5">
                  <div className="flex items-center gap-3">
                    <Truck size={20} className="shrink-0 text-[#315c3c]" />

                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">
                        Fast Delivery
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500 font-normal">
                        Across India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldCheck
                      size={20}
                      className="shrink-0 text-[#315c3c]"
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

                {/* SHELF LIFE */}

                <div className="mt-4 flex justify-between gap-4 text-xs sm:text-sm">
                  <span className="text-gray-500 font-normal">Shelf Life</span>

                  <span className="text-right font-medium text-gray-900">
                    {product.shelfLife ||
                      "Check the best-before date on the product package."}
                  </span>
                </div>

                {/* SIZE SELECTOR */}

                {product.sizes?.length > 0 && (
                  <fieldset className="mt-7">
                    <div className="mb-3 flex items-center justify-between">
                      <legend className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                        Select Weight / Size
                      </legend>

                      <span className="text-xs font-medium text-[#315c3c]">
                        {selectedSize}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          aria-pressed={selectedSize === size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[80px] rounded-lg border px-4 py-2.5 text-xs sm:text-sm font-medium transition-all ${
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

                {/* QUANTITY */}

                <div className="mt-7">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-900">
                    Quantity
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-32 items-center justify-between overflow-hidden rounded-lg border border-gray-200 bg-white">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="flex h-full flex-1 items-center justify-center text-gray-500 transition hover:bg-gray-100 hover:text-gray-900">
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
                            Math.min(Number(product.stock || 10), q + 1),
                          )
                        }
                        disabled={quantity >= Number(product.stock || 10)}
                        className="flex h-full flex-1 items-center justify-center text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30">
                        <Plus size={14} />
                      </button>
                    </div>

                    <span className="text-xs text-gray-500">
                      {product.stock > 0 && product.stock <= 5
                        ? `Hurry, only ${product.stock} units left!`
                        : "In stock, ready to dispatch"}
                    </span>
                  </div>
                </div>

                {/* ADD TO CART */}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock === 0}
                  className="mt-6 flex h-[52px] w-full items-center justify-center gap-2.5 rounded-lg bg-[#315c3c] text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:bg-[#25482f] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">
                  <ShoppingBag size={18} />

                  {isAdding
                    ? "Adding To Cart..."
                    : product.stock === 0
                      ? "Out Of Stock"
                      : "Add To Cart"}
                </button>

                {/* LOW STOCK */}

                {product.stock > 0 && product.stock <= 5 && (
                  <p className="mt-2.5 text-center text-xs font-medium text-[#7B4627]">
                    Only {product.stock} items left in stock
                  </p>
                )}

                {/* PRODUCT BENEFITS */}

                <div className="mt-7 grid grid-cols-3 border-y border-gray-200/80 py-4">
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <Leaf size={18} className="text-[#315c3c]" />

                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-700">
                      100% Natural
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 border-x border-gray-200/80 text-center">
                    <PackageCheck size={18} className="text-[#315c3c]" />

                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-700">
                      Carefully Packed
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <ShieldCheck size={18} className="text-[#315c3c]" />

                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-700">
                      Zero Preservatives
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =================================
              PRODUCT DETAILS
          ================================= */}

          <section className="mt-16 sm:mt-24 border-t border-gray-200/80 pt-10 sm:pt-14">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#315c3c]">
                KNOW YOUR PRODUCT
              </p>

              <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 tracking-tight">
                Product Details
              </h2>

              <div className="mx-auto mt-4 h-[2px] w-12 bg-[#315c3c]" />
            </div>

            <div className="grid gap-10 md:grid-cols-2 md:gap-16 items-start">
              {/* DESCRIPTION */}

              <div>
                <div className="mb-5 flex items-center gap-2.5">
                  <Heart size={20} className="text-[#315c3c]" />

                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Why You'll Love This
                  </h3>
                </div>

                {product.description ? (
                  <div className="prose max-w-none whitespace-pre-wrap text-sm sm:text-[15px] leading-relaxed text-gray-600 font-normal">
                    {product.description}
                  </div>
                ) : (
                  <p className="text-sm sm:text-[15px] leading-relaxed text-gray-600 font-normal">
                    Experience the authentic taste of pure, unadulterated
                    ingredients. Handcrafted using traditional Kumaoni recipes passed
                    down through generations in Uttarakhand.
                  </p>
                )}

                {product.usageInstructions && (
                  <div className="mt-7 border-t border-gray-200/80 pt-5">
                    <h4 className="mb-2.5 text-sm sm:text-base font-semibold text-gray-900">
                      How To Enjoy
                    </h4>

                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600 font-normal">
                      {product.usageInstructions}
                    </p>
                  </div>
                )}
              </div>

              {/* INGREDIENTS */}

              <div className="h-fit rounded-xl border border-gray-200 bg-[#fafaf8] p-6 sm:p-8">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#315c3c]">
                  PRODUCT INFORMATION
                </p>

                <h3 className="mb-4 text-lg sm:text-xl font-semibold text-gray-900">
                  Ingredients &amp; Care
                </h3>

                <p className="text-sm sm:text-[15px] leading-relaxed text-gray-600 font-normal">
                  {product.ingredients ||
                    "Refer to the product package for the complete authentic ingredient list."}
                </p>

                <div className="mt-6 space-y-4 border-t border-gray-200 pt-5">
                  <div className="flex justify-between gap-5 text-sm">
                    <span className="text-gray-500 font-normal">Storage</span>

                    <span className="max-w-[65%] text-right font-medium text-gray-900">
                      {product.storageInstructions ||
                        "Store in a cool, dry place. Always use a dry spoon."}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-normal">Origin</span>

                    <span className="font-medium text-gray-900">
                      Bhimtal, Nainital, Uttarakhand
                    </span>
                  </div>

                  {product.shelfLife && (
                    <div className="flex justify-between gap-5 text-sm">
                      <span className="text-gray-500 font-normal">Shelf Life</span>

                      <span className="text-right font-medium text-gray-900">
                        {product.shelfLife}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* =================================
              CUSTOMER REVIEWS
          ================================= */}

          <section className="mt-20 border-t border-[#eaece5] pt-12">
            <CustomerReviewsSectionNew
              productId={product?.id}
              product={product}
            />
          </section>

          {/* =================================
              RELATED PRODUCTS
          ================================= */}

          <section className="mt-16 border-t border-[#eaece5] pt-10">
            <RelatedProducts
              products={relatedProducts}
              loading={relatedLoading}
              maxItems={4}
            />
          </section>

          {/* FAQ */}

          <section className="mt-12">
            <FaqSection />
          </section>

          {/* OUR STORY */}

          <section className="mt-12">
            <OurStoryComponent />
          </section>
        </main>

        {/* MOBILE BOTTOM BAR */}

        <ProductBottomBar
          product={product}
          handleAddToCart={handleAddToCart}
          onAddToCart={handleAddToCart}
          isAdding={isAdding}
        />
      </div>
    </>
  );
};

export default ProductDetailsPage;
