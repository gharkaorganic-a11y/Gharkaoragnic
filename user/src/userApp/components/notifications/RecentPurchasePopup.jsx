import React, { useState, useEffect, useRef, useCallback } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Authentic, verified Cloudinary product photography
const PRODUCT_IMAGES = {
  GHEE: "https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1779804926/uttarakhand-desi-ghee_mhth1n_kwdmv9.webp",
  HONEY: "https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1779805346/6b28f8bd-630a-4ad8-99c2-38a0fb306d15.png",
  AAM_ACHAR: "https://res.cloudinary.com/dwgro3zo7/image/upload/q_auto/f_auto/v1779805758/a332c4ef-1765-4f47-b4d4-4012140de26e.png",
  NIMBU_ACHAR: "https://res.cloudinary.com/dwgro3zo7/image/upload/w_1200,h_1200,c_fill,q_auto,f_auto/v1779806656/c2153e88-16ac-498e-a526-1976f375a691_un6xul.png",
  BHANG_CHUTNEY: "https://res.cloudinary.com/dwgro3zo7/image/upload/w_1200,h_1200,c_fill,q_auto,f_auto/v1779806954/5fbff796-8d70-4624-931e-f7d36a5ec9a9_leazcc.png",
  SALT: "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790512823/gharka-organic/products/fttrz26ukuxngr2knc7f.jpg",
  DALS: "/banners/dals-1500x500.webp",
  SPICES: "/banners/spices-1500x500.webp",
};

export const SAMPLE_PURCHASES = [
  {
    id: 1,
    name: "Pooja Rawat",
    city: "Dehradun, Uttarakhand",
    product: "Pure Desi Cow Ghee (Bilona Churned)",
    image: PRODUCT_IMAGES.GHEE,
    path: "/product/a2-badri-cow-desi-ghee-500ml",
    minutesAgo: 3,
  },
  {
    id: 2,
    name: "Rohit Sharma",
    city: "South Delhi, Delhi",
    product: "Raw Himalayan Forest Honey",
    image: PRODUCT_IMAGES.HONEY,
    path: "/product/bhimtal-raw-forest-honey-500g",
    minutesAgo: 6,
  },
  {
    id: 3,
    name: "Neha Joshi",
    city: "Nainital, Uttarakhand",
    product: "Authentic Pahadi Mango Pickle (Aam Ka Achar)",
    image: PRODUCT_IMAGES.AAM_ACHAR,
    path: "/product/pahadi-aam-ka-achar-400g",
    minutesAgo: 11,
  },
  {
    id: 4,
    name: "Amit Verma",
    city: "Lucknow, Uttar Pradesh",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: PRODUCT_IMAGES.SALT,
    path: "/product/pahadi-pisyu-loon-herb-salt-200g",
    minutesAgo: 15,
  },
  {
    id: 5,
    name: "Sneha Kulkarni",
    city: "Kothrud, Pune",
    product: "Kumaoni Sun-Cured Lemon Pickle (Nimbu Achar)",
    image: PRODUCT_IMAGES.NIMBU_ACHAR,
    path: "/product/kumaoni-nimbu-achar-400g",
    minutesAgo: 22,
  },
  {
    id: 6,
    name: "Deepak Negi",
    city: "Haldwani, Uttarakhand",
    product: "Traditional Pahadi Bhang Ki Chutney",
    image: PRODUCT_IMAGES.BHANG_CHUTNEY,
    path: "/collections",
    minutesAgo: 28,
  },
  {
    id: 7,
    name: "Ananya Sengupta",
    city: "Indiranagar, Bengaluru",
    product: "Pure Desi Cow Ghee (Bilona Churned)",
    image: PRODUCT_IMAGES.GHEE,
    path: "/product/a2-badri-cow-desi-ghee-500ml",
    minutesAgo: 34,
  },
  {
    id: 8,
    name: "Vikram Bisht",
    city: "Almora, Uttarakhand",
    product: "Organic Uttarakhand Bhatt Ki Dal (Black Soybean)",
    image: PRODUCT_IMAGES.DALS,
    path: "/product/organic-bhatt-ki-dal-500g",
    minutesAgo: 41,
  },
  {
    id: 9,
    name: "Priya Nair",
    city: "Andheri West, Mumbai",
    product: "Raw Himalayan Forest Honey",
    image: PRODUCT_IMAGES.HONEY,
    path: "/product/bhimtal-raw-forest-honey-500g",
    minutesAgo: 49,
  },
  {
    id: 10,
    name: "Rajesh Mehra",
    city: "Sector 18, Chandigarh",
    product: "Wild Himalayan Timur Pepper (Sichuan Pepper)",
    image: PRODUCT_IMAGES.SPICES,
    path: "/product/wild-himalayan-timur-pepper-100g",
    minutesAgo: 56,
  },
  {
    id: 11,
    name: "Kavita Aggarwal",
    city: "Sector 62, Noida",
    product: "Authentic Pahadi Mango Pickle (Aam Ka Achar)",
    image: PRODUCT_IMAGES.AAM_ACHAR,
    path: "/product/pahadi-aam-ka-achar-400g",
    minutesAgo: 64,
  },
  {
    id: 12,
    name: "Manoj Pandey",
    city: "Rishikesh, Uttarakhand",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: PRODUCT_IMAGES.SALT,
    path: "/product/pahadi-pisyu-loon-herb-salt-200g",
    minutesAgo: 73,
  },
  {
    id: 13,
    name: "Sunita Reddy",
    city: "Jubilee Hills, Hyderabad",
    product: "Pure Desi Cow Ghee (Bilona Churned)",
    image: PRODUCT_IMAGES.GHEE,
    path: "/product/a2-badri-cow-desi-ghee-500ml",
    minutesAgo: 85,
  },
  {
    id: 14,
    name: "Tarun Kapoor",
    city: "Malviya Nagar, Jaipur",
    product: "Kumaoni Sun-Cured Lemon Pickle (Nimbu Achar)",
    image: PRODUCT_IMAGES.NIMBU_ACHAR,
    path: "/product/kumaoni-nimbu-achar-400g",
    minutesAgo: 94,
  },
  {
    id: 15,
    name: "Ritu Bhatt",
    city: "Haridwar, Uttarakhand",
    product: "Munsiyari White Pahadi Rajma",
    image: PRODUCT_IMAGES.DALS,
    path: "/product/munsiyari-pahadi-rajma-500g",
    minutesAgo: 108,
  },
  {
    id: 16,
    name: "Alok Pandey",
    city: "Swaroop Nagar, Kanpur",
    product: "Raw Himalayan Forest Honey",
    image: PRODUCT_IMAGES.HONEY,
    path: "/product/bhimtal-raw-forest-honey-500g",
    minutesAgo: 120,
  },
  {
    id: 17,
    name: "Shweta Tiwari",
    city: "Vijay Nagar, Indore",
    product: "Traditional Pahadi Bhang Ki Chutney",
    image: PRODUCT_IMAGES.BHANG_CHUTNEY,
    path: "/collections",
    minutesAgo: 135,
  },
  {
    id: 18,
    name: "Gaurav Malhotra",
    city: "Sector 15, Faridabad",
    product: "Pure Desi Cow Ghee (Bilona Churned)",
    image: PRODUCT_IMAGES.GHEE,
    path: "/product/a2-badri-cow-desi-ghee-500ml",
    minutesAgo: 150,
  },
  {
    id: 19,
    name: "Divya Chauhan",
    city: "Chotta Shimla, Shimla",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: PRODUCT_IMAGES.SALT,
    path: "/product/pahadi-pisyu-loon-herb-salt-200g",
    minutesAgo: 165,
  },
  {
    id: 20,
    name: "Manish Tiwari",
    city: "Bhowali, Nainital",
    product: "Jakhiya Seeds – Uttarakhand Tempering",
    image: PRODUCT_IMAGES.SPICES,
    path: "/product/jakhiya-seeds-uttarakhand-150g",
    minutesAgo: 180,
  },
];

const formatTimeAgo = (minutes) => {
  if (minutes < 5) return "Just now";
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
};

/**
 * Natural, calm timing parameters:
 * - Does not blast the user immediately (waits 16s - 24s after arrival)
 * - Stays visible for 5.5s
 * - Calm, irregular intervals (45s - 75s) between notifications
 * - Randomizes initial item across sessions to avoid repeating the same product
 */
const INITIAL_DELAY_MIN = 12000;
const INITIAL_DELAY_RANGE = 6000;
const DISPLAY_DURATION_MS = 5500;
const MIN_INTERVAL_MS = 35000;
const RANDOM_INTERVAL_RANGE_MS = 20000;
const DISMISS_PAUSE_MS = 180000; // 3 minutes pause if explicitly closed
const MAX_SHOWS_PER_SESSION = 2; // Show only 1 to 2 times when visiting website

const getSessionShowCount = () => {
  try {
    return parseInt(
      sessionStorage.getItem("gharka_purchase_popup_count") || "0",
      10,
    );
  } catch {
    return 0;
  }
};

const incrementSessionShowCount = () => {
  try {
    const next = getSessionShowCount() + 1;
    sessionStorage.setItem("gharka_purchase_popup_count", String(next));
    return next;
  } catch {
    return 1;
  }
};

const getInitialRandomIndex = () => {
  try {
    const last = parseInt(sessionStorage.getItem("gharka_last_purchase_idx") || "-1", 10);
    let chosen = Math.floor(Math.random() * SAMPLE_PURCHASES.length);
    if (chosen === last) {
      chosen = (chosen + 1) % SAMPLE_PURCHASES.length;
    }
    sessionStorage.setItem("gharka_last_purchase_idx", String(chosen));
    return chosen;
  } catch {
    return Math.floor(Math.random() * SAMPLE_PURCHASES.length);
  }
};

const RecentPurchasePopup = () => {
  const [index, setIndex] = useState(getInitialRandomIndex);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [paused, setPaused] = useState(false);

  const timerRef = useRef(null);
  const pauseRef = useRef(paused);
  pauseRef.current = paused;
  const showCountRef = useRef(getSessionShowCount());

  const scheduleNext = useCallback(() => {
    if (dismissed || showCountRef.current >= MAX_SHOWS_PER_SESSION) return;
    const delay =
      Math.floor(Math.random() * RANDOM_INTERVAL_RANGE_MS) + MIN_INTERVAL_MS;
    timerRef.current = setTimeout(() => {
      handleNext();
    }, delay);
  }, [dismissed]);

  const handleNext = useCallback(() => {
    if (dismissed || showCountRef.current >= MAX_SHOWS_PER_SESSION) return;

    showCountRef.current = incrementSessionShowCount();

    setIndex((prev) => {
      // Pick a different item and avoid immediate consecutive repeats
      let next = (prev + 1 + Math.floor(Math.random() * 3)) % SAMPLE_PURCHASES.length;
      try {
        sessionStorage.setItem("gharka_last_purchase_idx", String(next));
      } catch {}
      return next;
    });

    setVisible(true);

    timerRef.current = setTimeout(() => {
      if (!pauseRef.current) {
        setVisible(false);
        if (showCountRef.current < MAX_SHOWS_PER_SESSION) {
          scheduleNext();
        }
      }
    }, DISPLAY_DURATION_MS);
  }, [dismissed, scheduleNext]);

  // Initial trigger after natural user engagement
  useEffect(() => {
    if (dismissed || getSessionShowCount() >= MAX_SHOWS_PER_SESSION) return;

    const initialDelay =
      INITIAL_DELAY_MIN + Math.floor(Math.random() * INITIAL_DELAY_RANGE);

    timerRef.current = setTimeout(() => {
      handleNext();
    }, initialDelay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dismissed, handleNext]);

  const handleMouseLeave = () => {
    setPaused(false);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      if (showCountRef.current < MAX_SHOWS_PER_SESSION) {
        scheduleNext();
      }
    }, 2000);
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    setDismissed(true);
    // User explicitly dismissed - don't show any more in this session
    sessionStorage.setItem(
      "gharka_purchase_popup_count",
      String(MAX_SHOWS_PER_SESSION),
    );
  };

  const currentItem = SAMPLE_PURCHASES[index];
  if (!currentItem) return null;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={handleMouseLeave}
      className={`fixed bottom-20 md:bottom-14 left-3 sm:left-5 z-40 transition-all duration-500 ease-out select-none max-w-[340px] sm:max-w-[360px] ${
        visible && !dismissed
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-5 pointer-events-none"
      }`}>
      <div className="relative flex items-stretch bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden hover:shadow-[0_12px_36px_rgba(0,0,0,0.16)] transition-shadow">
        {/* Left: Square Product Thumbnail (Informational display only - no redirect) */}
        <div className="relative w-20 sm:w-22 aspect-square shrink-0 bg-[#faf9f5] overflow-hidden flex items-center justify-center p-1.5">
          <img
            src={currentItem.image}
            alt={currentItem.product}
            loading="lazy"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Right: Text Information (No redirect on click) */}
        <div className="flex-1 min-w-0 p-2.5 sm:p-3 flex flex-col justify-between pr-7">
          {/* Top Line: Customer Name and Location */}
          <div className="text-[11px] sm:text-xs text-gray-600 leading-tight">
            <span className="font-semibold text-gray-900">
              {currentItem.name}
            </span>{" "}
            from{" "}
            <span className="font-medium text-gray-800">
              {currentItem.city}
            </span>
            <div className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5">
              purchased
            </div>
          </div>

          {/* Product Name (Plain text - does not redirect away) */}
          <div className="mt-1 text-xs sm:text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2">
            {currentItem.product}
          </div>

          {/* Time & Verified Indicator */}
          <div className="mt-1 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-gray-400 font-normal">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-[#009762]"
              aria-hidden="true"
            />
            <span className="text-[#009762] font-medium">Verified Order</span>
            <span>•</span>
            <span>{formatTimeAgo(currentItem.minutesAgo)}</span>
          </div>
        </div>

        {/* Dismiss Close Button (Top Right) */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss purchase notification"
          className="absolute top-1.5 right-1.5 p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
          <XMarkIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(RecentPurchasePopup);
