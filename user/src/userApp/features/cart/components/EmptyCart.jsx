import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { productService } from "../../product/services/ProductService";
import BrandLogo from "../../../../components/common/BrandLogo";

const CURATED_BESTSELLERS = [
  {
    id: "prod-pahadi-salt-dhaniya-garlic",
    name: "Pahadi Salt with dhaniya, Garlic and green chillies.",
    slug: "pahadi-pisyu-loon-herb-salt-200g",
    weight: "100g",
    price: 99,
    originalPrice: 199,
    discount: 50,
    rating: 4.8,
    reviews: 4,
    image:
      "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790512823/gharka-organic/products/fttrz26ukuxngr2knc7f.jpg",
  },
  {
    id: "prod-mirch-ka-achar",
    name: "GHAR KA Mirch Ka Achar(Green chilly pickle)",
    slug: "pahadi-aam-ka-achar-400g",
    weight: "400g",
    price: 219,
    originalPrice: 299,
    discount: 27,
    rating: 4.8,
    reviews: 42,
    image: "/banner/pahadipickle.png",
  },
  {
    id: "prod-ghar-ka-honey",
    name: "GHAR KA HONEY",
    slug: "bhimtal-raw-forest-honey-500g",
    weight: "200ml",
    price: 299,
    originalPrice: 329,
    discount: 9,
    rating: 4.8,
    reviews: 42,
    image:
      "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790510595/gharka-organic/products/e6qmitnpen0qsgfimte0.jpg",
  },
  {
    id: "prod-a2-badri-ghee-500ml",
    name: "A2 Badri Cow Desi Ghee (Bilona Churned)",
    slug: "a2-badri-cow-desi-ghee-500ml",
    weight: "500ml",
    price: 1350,
    originalPrice: 1550,
    discount: 13,
    rating: 4.9,
    reviews: 86,
    image: "/products/desi-ghee.jpeg",
  },
  {
    id: "prod-pahadi-aam-ka-achar-400g",
    name: "Authentic Pahadi Mango Pickle (Aam Ka Achar)",
    slug: "pahadi-aam-ka-achar-400g",
    weight: "400g",
    price: 349,
    originalPrice: 399,
    discount: 13,
    rating: 4.8,
    reviews: 38,
    image: "/products/mango-pickle.jpeg",
  },
  {
    id: "prod-kumaoni-nimbu-achar-400g",
    name: "Kumaoni Sun-Cured Lemon Pickle (Nimbu Achar)",
    slug: "kumaoni-nimbu-achar-400g",
    weight: "400g",
    price: 329,
    originalPrice: 380,
    discount: 13,
    rating: 4.8,
    reviews: 29,
    image: "/banner/pahadipickle.png",
  },
];

const EmptyCart = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState(null);
  const [bestsellers, setBestsellers] = useState(CURATED_BESTSELLERS);

  useEffect(() => {
    let isMounted = true;
    const loadLive = async () => {
      try {
        const res = await productService.getProducts({ pageSize: 6 });
        if (isMounted && res?.products?.length > 0) {
          const liveItems = res.products.slice(0, 6).map((p) => {
            const price = Number(p.price) || 0;
            const originalPrice = Number(p.originalPrice ?? p.mrp) || 0;
            const discount =
              originalPrice > price
                ? Math.round(((originalPrice - price) / originalPrice) * 100)
                : 0;
            const weight =
              p.weight ||
              p.netWeight ||
              (Array.isArray(p.sizes) ? p.sizes[0] : "") ||
              "";

            return {
              id: p.id,
              name: p.name,
              slug: p.slug || p.id,
              price,
              originalPrice,
              discount,
              weight,
              rating: Number(p.rating || 4.8),
              reviews: Number(p.reviews ?? p.totalReviews ?? 42),
              image:
                p.banner ||
                p.images?.[0] ||
                "/products/desi-ghee.jpeg",
            };
          });
          if (liveItems.length >= 3) {
            setBestsellers(liveItems);
          }
        }
      } catch (err) {
        // Fallback to CURATED_BESTSELLERS
      }
    };
    loadLive();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddBestseller = async (item, e) => {
    if (e) e.stopPropagation();
    if (addingId === item.id) return;
    setAddingId(item.id);
    try {
      await addToCart({
        id: item.id,
        name: item.name,
        price: Number(item.price) || 0,
        image: item.image,
        selectedSize: item.weight || "Standard",
        selectedQuantity: 1,
      });
    } catch (err) {
      console.error("Failed to add bestseller:", err);
    } finally {
      setTimeout(() => setAddingId(null), 600);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-between py-8 px-4 max-w-7xl mx-auto">
      {/* Top: Start with Bestsellers */}
      <div className="w-full bg-white rounded-3xl border border-[#ecece8] p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-sm sm:text-base font-bold tracking-[0.16em] text-[#7B4627] uppercase flex items-center gap-1.5">
              <span>⚡</span> Start with Bestsellers
            </h2>
            <p className="text-xs sm:text-sm text-[#737373] mt-0.5">
              Handcrafted Himalayan pure organic essentials
            </p>
          </div>
          <span className="text-xs text-gray-400 hidden sm:inline-block">
            Showing top {bestsellers.length} favorites
          </span>
        </div>

        {/* Responsive Grid for Desktop, Smooth Carousel for Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar">
          {bestsellers.slice(0, 6).map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.slug || item.id}`)}
              className="bg-white border border-[#eae8e1] hover:border-[#315c3c]/50 rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all cursor-pointer select-none group">
              <div>
                {/* Image Container with Badges */}
                <div className="relative aspect-square w-full rounded-xl bg-[#faf9f5] overflow-hidden mb-2.5 border border-[#f0eee6] flex items-center justify-center p-2">
                  {/* Brown % OFF Badge (Top-Left) */}
                  {item.discount > 0 && (
                    <div className="absolute top-1.5 left-1.5 z-10 bg-[#7B4627] text-white rounded px-1.5 py-0.5 text-center leading-none shadow-xs pointer-events-none">
                      <span className="block text-[9px] sm:text-[10px] font-bold tracking-tight">
                        {item.discount}%
                      </span>
                      <span className="block text-[7px] sm:text-[8px] font-bold tracking-wider uppercase opacity-90 mt-0.5">
                        OFF
                      </span>
                    </div>
                  )}

                  {/* Golden-Yellow Circle Weight Badge (Top-Right) */}
                  {item.weight && (
                    <div className="absolute top-1.5 right-1.5 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FAB81E] text-gray-950 font-bold text-[8px] sm:text-[9px] flex items-center justify-center shadow-xs pointer-events-none">
                      {item.weight}
                    </div>
                  )}

                  {/* Selling Fast Pill (Bottom-Left) */}
                  <div className="absolute bottom-1.5 left-1.5 z-10 inline-flex items-center gap-1 bg-[#D89C3A] text-white text-[8px] sm:text-[9px] font-medium px-2 py-0.5 rounded-full shadow-xs pointer-events-none">
                    <span className="text-[9px] leading-none">⚡</span>
                    <span>Selling Fast</span>
                  </div>

                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain max-h-[140px] group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <h3 className="text-xs sm:text-[13px] font-normal text-gray-800 line-clamp-2 leading-snug min-h-[34px] group-hover:text-[#315c3c] transition-colors">
                  {item.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 pt-1 pb-0.5">
                  <span className="text-[#F59E0B] text-xs">★</span>
                  <span className="font-bold text-gray-900 text-xs">
                    {item.rating || "4.8"}
                  </span>
                  <span className="text-gray-500 font-normal text-xs">
                    ({item.reviews || 42} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 pt-0.5 pb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">
                    Rs. {Number(item.price).toFixed(2)}
                  </span>
                  {item.originalPrice > item.price && (
                    <span className="text-[11px] text-gray-400 line-through font-normal">
                      Rs. {Number(item.originalPrice).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart button */}
              <button
                type="button"
                onClick={(e) => handleAddBestseller(item, e)}
                disabled={addingId === item.id}
                className={`w-full py-2.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] ${
                  addingId === item.id
                    ? "bg-[#47724d] text-white"
                    : "bg-[#2D5A38] text-white hover:bg-[#23472c]"
                }`}>
                {addingId === item.id ? (
                  <>
                    <Check size={14} strokeWidth={2.5} />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} strokeWidth={2} />
                    <span>Add to cart</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Center: Empty Cart Basket with 0 badge */}
      <div className="py-8 flex flex-col items-center justify-center text-center my-auto">
        <BrandLogo symbolOnly size="sm" className="mb-3" />
        <div className="relative inline-flex items-center justify-center mb-4">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-20 h-20 text-[#1c1c1c]"
            aria-hidden="true">
            <path
              d="M21 21L27 10M43 21L37 10"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="9"
              y="21"
              width="46"
              height="5.5"
              rx="2.75"
              fill="currentColor"
            />
            <path
              d="M13.5 26.5L18.5 50.5C18.8 52.8 20.6 54.5 22.8 54.5H41.2C43.4 54.5 45.2 52.8 45.5 50.5L50.5 26.5"
              fill="currentColor"
            />
            <line
              x1="24.5"
              y1="31"
              x2="25.5"
              y2="47"
              stroke="white"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <line
              x1="32"
              y1="31"
              x2="32"
              y2="47"
              stroke="white"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <line
              x1="39.5"
              y1="31"
              x2="38.5"
              y2="47"
              stroke="white"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute -bottom-1 -right-1 bg-white text-[#121212] text-xs font-bold w-7 h-7 rounded-full border-2 border-[#121212] flex items-center justify-center shadow-xs">
            0
          </span>
        </div>

        <h1 className="text-lg sm:text-xl font-bold tracking-[0.14em] text-[#121212] uppercase">
          Your cart is empty
        </h1>
        <p className="mt-1 text-sm text-[#737373] max-w-sm">
          Add items from our bestsellers above or continue browsing our store
        </p>

        {/* Continue Shopping button */}
        <div className="mt-6 w-full max-w-xs">
          <button
            type="button"
            onClick={() => navigate("/all-products")}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#121212] hover:text-black bg-[#ededeb] hover:bg-[#e2e2df] active:scale-[0.99] rounded-xl transition-all shadow-xs">
            <ShoppingBag size={18} strokeWidth={2.2} />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
