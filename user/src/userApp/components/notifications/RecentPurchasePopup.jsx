import React, { useState, useEffect, useRef, useCallback } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const IMAGE_SALT =
  "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790512823/gharka-organic/products/fttrz26ukuxngr2knc7f.jpg";
const IMAGE_GHEE_HONEY =
  "https://res.cloudinary.com/dwgro3zo7/image/upload/v1790510595/gharka-organic/products/e6qmitnpen0qsgfimte0.jpg";

export const SAMPLE_PURCHASES = [
  {
    id: 1,
    name: "Amit Sharma",
    city: "Lucknow, Uttar Pradesh",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: IMAGE_SALT,
    timeAgo: "3 minutes ago",
  },
  {
    id: 2,
    name: "Pooja Rawat",
    city: "Dehradun, Uttarakhand",
    product: "Pure Desi Cow Ghee (Bilona Churned)",
    image: IMAGE_GHEE_HONEY,
    timeAgo: "7 minutes ago",
  },
  {
    id: 3,
    name: "Rohit Verma",
    city: "South Delhi, Delhi",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: IMAGE_SALT,
    timeAgo: "12 minutes ago",
  },
  {
    id: 4,
    name: "Neha Joshi",
    city: "Gurugram, Haryana",
    product: "Raw Himalayan Forest Honey",
    image: IMAGE_GHEE_HONEY,
    timeAgo: "16 minutes ago",
  },
  {
    id: 5,
    name: "Vikram Bisht",
    city: "Nainital, Uttarakhand",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: IMAGE_SALT,
    timeAgo: "21 minutes ago",
  },
  {
    id: 6,
    name: "Sneha Kulkarni",
    city: "Kothrud, Pune",
    product: "Pure Desi Cow Ghee (Bilona Churned)",
    image: IMAGE_GHEE_HONEY,
    timeAgo: "27 minutes ago",
  },
  {
    id: 7,
    name: "Rajesh Mehra",
    city: "Sector 18, Chandigarh",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: IMAGE_SALT,
    timeAgo: "33 minutes ago",
  },
  {
    id: 8,
    name: "Ananya Sengupta",
    city: "Indiranagar, Bengaluru",
    product: "Raw Himalayan Forest Honey",
    image: IMAGE_GHEE_HONEY,
    timeAgo: "39 minutes ago",
  },
  {
    id: 9,
    name: "Deepak Negi",
    city: "Haldwani, Uttarakhand",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: IMAGE_SALT,
    timeAgo: "44 minutes ago",
  },
  {
    id: 10,
    name: "Priya Nair",
    city: "Andheri West, Mumbai",
    product: "Pure Desi Cow Ghee (Bilona Churned)",
    image: IMAGE_GHEE_HONEY,
    timeAgo: "51 minutes ago",
  },
  {
    id: 11,
    name: "Suresh Pant",
    city: "Almora, Uttarakhand",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: IMAGE_SALT,
    timeAgo: "58 minutes ago",
  },
  {
    id: 12,
    name: "Kavita Aggarwal",
    city: "Sector 62, Noida",
    product: "Raw Himalayan Forest Honey",
    image: IMAGE_GHEE_HONEY,
    timeAgo: "1 hour ago",
  },
  {
    id: 13,
    name: "Manoj Pandey",
    city: "Rishikesh, Uttarakhand",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: IMAGE_SALT,
    timeAgo: "1 hour ago",
  },
  {
    id: 14,
    name: "Sunita Reddy",
    city: "Jubilee Hills, Hyderabad",
    product: "Pure Desi Cow Ghee (Bilona Churned)",
    image: IMAGE_GHEE_HONEY,
    timeAgo: "1 hour ago",
  },
  {
    id: 15,
    name: "Tarun Kapoor",
    city: "Malviya Nagar, Jaipur",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: IMAGE_SALT,
    timeAgo: "2 hours ago",
  },
  {
    id: 16,
    name: "Ritu Bhatt",
    city: "Haridwar, Uttarakhand",
    product: "Raw Himalayan Forest Honey",
    image: IMAGE_GHEE_HONEY,
    timeAgo: "2 hours ago",
  },
  {
    id: 17,
    name: "Alok Pandey",
    city: "Swaroop Nagar, Kanpur",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: IMAGE_SALT,
    timeAgo: "2 hours ago",
  },
  {
    id: 18,
    name: "Shweta Tiwari",
    city: "Vijay Nagar, Indore",
    product: "Pure Desi Cow Ghee (Bilona Churned)",
    image: IMAGE_GHEE_HONEY,
    timeAgo: "3 hours ago",
  },
  {
    id: 19,
    name: "Gaurav Malhotra",
    city: "Sector 15, Faridabad",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: IMAGE_SALT,
    timeAgo: "3 hours ago",
  },
  {
    id: 20,
    name: "Divya Chauhan",
    city: "Chotta Shimla, Shimla",
    product: "Raw Himalayan Forest Honey",
    image: IMAGE_GHEE_HONEY,
    timeAgo: "3 hours ago",
  },
  {
    id: 21,
    name: "Manish Tiwari",
    city: "Bhowali, Nainital",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: IMAGE_SALT,
    timeAgo: "4 hours ago",
  },
  {
    id: 22,
    name: "Swati Deshmukh",
    city: "Dharampeth, Nagpur",
    product: "Pure Desi Cow Ghee (Bilona Churned)",
    image: IMAGE_GHEE_HONEY,
    timeAgo: "4 hours ago",
  },
  {
    id: 23,
    name: "Naveen Upadhyay",
    city: "Pithoragarh, Uttarakhand",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: IMAGE_SALT,
    timeAgo: "5 hours ago",
  },
  {
    id: 24,
    name: "Meenakshi Sundaram",
    city: "Adyar, Chennai",
    product: "Raw Himalayan Forest Honey",
    image: IMAGE_GHEE_HONEY,
    timeAgo: "5 hours ago",
  },
  {
    id: 25,
    name: "Karan Tripathi",
    city: "Sigra, Varanasi",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: IMAGE_SALT,
    timeAgo: "6 hours ago",
  },
  {
    id: 26,
    name: "Rashmi Saxena",
    city: "Gomti Nagar, Lucknow",
    product: "Pure Desi Cow Ghee (Bilona Churned)",
    image: IMAGE_GHEE_HONEY,
    timeAgo: "6 hours ago",
  },
  {
    id: 27,
    name: "Harish Chandra",
    city: "Ranikhet, Uttarakhand",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: IMAGE_SALT,
    timeAgo: "7 hours ago",
  },
  {
    id: 28,
    name: "Aarti Singhal",
    city: "Ghaziabad, Uttar Pradesh",
    product: "Raw Himalayan Forest Honey",
    image: IMAGE_GHEE_HONEY,
    timeAgo: "7 hours ago",
  },
  {
    id: 29,
    name: "Bhupendra Singh",
    city: "Rudrapur, Uttarakhand",
    product: "Pahadi Salt with Dhaniya, Garlic & Green Chillies",
    image: IMAGE_SALT,
    timeAgo: "8 hours ago",
  },
  {
    id: 30,
    name: "Shalini Menon",
    city: "Vashi, Navi Mumbai",
    product: "Pure Desi Cow Ghee (Bilona Churned)",
    image: IMAGE_GHEE_HONEY,
    timeAgo: "8 hours ago",
  },
];

/**
 * RecentPurchasePopup
 * Clean, authentic social-proof purchase notification.
 * - Displays image and purchase details ONLY (No redirect / No navigation on click)
 * - 30 authentic samples with natural timings
 * - Calm, long delays:
 *   * Initial appearance: 20 seconds after opening website (NOT instant)
 *   * Calm interval between popups: 40 to 65 seconds (NOT continuous)
 *   * Display duration: 5.5 seconds
 *   * Dismiss pause: 3 minutes
 */
const INITIAL_DELAY_MS = 20000; // 20 seconds after opening website
const DISPLAY_DURATION_MS = 5500; // Visible for 5.5 seconds
const MIN_INTERVAL_MS = 40000; // 40 seconds minimum between popups
const RANDOM_INTERVAL_RANGE_MS = 25000; // Random additional 0-25s (total 40s - 65s)
const DISMISS_PAUSE_MS = 180000; // 3 minutes pause on explicit dismiss

const RecentPurchasePopup = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [paused, setPaused] = useState(false);

  const timerRef = useRef(null);
  const pauseRef = useRef(paused);
  pauseRef.current = paused;

  const handleNext = useCallback(() => {
    if (dismissed) return;

    // Pick next item in sequence
    setIndex((prev) => (prev + 1) % SAMPLE_PURCHASES.length);
    setVisible(true);

    // Keep visible for 5.5 seconds, then hide (unless user is hovering)
    timerRef.current = setTimeout(() => {
      if (!pauseRef.current) {
        setVisible(false);
        scheduleNext();
      }
    }, DISPLAY_DURATION_MS);
  }, [dismissed]);

  const scheduleNext = useCallback(() => {
    if (dismissed) return;
    // Calm, long interval: 40 to 65 seconds (not continuous)
    const delay =
      Math.floor(Math.random() * RANDOM_INTERVAL_RANGE_MS) + MIN_INTERVAL_MS;
    timerRef.current = setTimeout(() => {
      handleNext();
    }, delay);
  }, [dismissed, handleNext]);

  // Initial trigger: Wait 20 seconds after website loads
  useEffect(() => {
    if (dismissed) return;

    timerRef.current = setTimeout(() => {
      setVisible(true);
      timerRef.current = setTimeout(() => {
        if (!pauseRef.current) {
          setVisible(false);
          scheduleNext();
        }
      }, DISPLAY_DURATION_MS);
    }, INITIAL_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dismissed, scheduleNext]);

  // Handle mouse leave when paused
  const handleMouseLeave = () => {
    setPaused(false);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      scheduleNext();
    }, 2500);
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    setDismissed(true);
    // Pause for 3 minutes if explicitly dismissed
    setTimeout(() => {
      setDismissed(false);
      scheduleNext();
    }, DISMISS_PAUSE_MS);
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
      <div className="relative flex items-stretch bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden">
        {/* Left: Square Product Thumbnail (Display only - NO redirect) */}
        <div className="relative w-20 sm:w-22 aspect-square shrink-0 bg-[#faf9f5] overflow-hidden flex items-center justify-center p-1.5">
          <img
            src={currentItem.image}
            alt={currentItem.product}
            loading="lazy"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Right: Text Information (Display only - NO redirect) */}
        <div className="flex-1 min-w-0 p-2.5 sm:p-3 flex flex-col justify-between pr-7">
          {/* Top Line: Name and City */}
          <div className="text-[11px] sm:text-xs text-gray-600 leading-tight">
            <span className="font-semibold text-gray-900">
              {currentItem.name}
            </span>{" "}
            from{" "}
            <span className="font-medium text-gray-800">
              {currentItem.city}
            </span>
            <div className="text-[10px] sm:text-[11px] text-gray-500">
              purchased
            </div>
          </div>

          {/* Product Name (Text only - NO redirect) */}
          <p className="mt-1 text-xs sm:text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2">
            {currentItem.product}
          </p>

          {/* Time & Verified Indicator */}
          <div className="mt-1 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-gray-400 font-normal">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-[#009762]"
              aria-hidden="true"
            />
            <span className="text-[#009762] font-medium">Verified Order</span>
            <span>•</span>
            <span>{currentItem.timeAgo}</span>
          </div>
        </div>

        {/* Dismiss Button (Top Right) */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss purchase notification"
          className="absolute top-1.5 right-1.5 p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <XMarkIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(RecentPurchasePopup);
