import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Added Link for SPA routing
import {
  XMarkIcon,
  CheckBadgeIcon,
  ShoppingBagIcon,
  FireIcon,
} from "@heroicons/react/24/solid";

/* ─────────────────────────────────────────────
   PRODUCTS & DATA (Keep outside component to avoid recreation)
───────────────────────────────────────────── */

const PRODUCTS = [
  {
    name: "A2 Bilona Desi Ghee, 500ml",
    image:
      "https://res.cloudinary.com/dwgro3zo7/image/upload/w_300,h_300,c_fill,q_auto,f_auto/v1779804926/uttarakhand-desi-ghee_mhth1n_kwdmv9.webp",
    link: "/buy-desi-ghee-online",
  },
  {
    name: "Raw Forest Honey, 500g",
    image:
      "https://res.cloudinary.com/dwgro3zo7/image/upload/w_300,h_300,c_fill,q_auto,f_auto/v1779805346/6b28f8bd-630a-4ad8-99c2-38a0fb306d15.png",
    link: "/raw-honey-uttarakhand",
  },
  {
    name: "Pahadi Aam Achar, 400g",
    image:
      "https://res.cloudinary.com/dwgro3zo7/image/upload/w_300,h_300,c_fill,q_auto,f_auto/v1779805758/a332c4ef-1765-4f47-b4d4-4012140de26e.png",
    link: "/pahadi-achar-online",
  },
  {
    name: "Pahadi Nimbu Achar, 400g",
    image:
      "https://res.cloudinary.com/dwgro3zo7/image/upload/w_300,h_300,c_fill,q_auto,f_auto/v1779806656/c2153e88-16ac-498e-a526-1976f375a691_un6xul.png",
    link: "/nimbu-achar-online",
  },
  {
    name: "Bhang Ki Chutney, 200g",
    image:
      "https://res.cloudinary.com/dwgro3zo7/image/upload/w_300,h_300,c_fill,q_auto,f_auto/v1779806954/5fbff796-8d70-4624-931e-f7d36a5ec9a9_leazcc.png",
    link: "/pahadi-products-online",
  },
];

const NAMES = [
  "Ajay",
  "Rohit",
  "Priya",
  "Neha",
  "Anita",
  "Karan",
  "Deepika",
  "Arjun",
  "Meera",
  "Aditi",
  "Vikram",
  "Manoj",
  "Aman",
  "Kavita",
];
const STATES = [
  "Uttar Pradesh",
  "Delhi",
  "Maharashtra",
  "Rajasthan",
  "Punjab",
  "Karnataka",
  "Gujarat",
  "Haryana",
  "Uttarakhand",
  "West Bengal",
];
const STORAGE_KEY = "gko_popup_hidden";

/* ───────────────────────────────────────────── */

const SalesNotificationPopup = () => {
  const [visible, setVisible] = useState(false);
  const [notification, setNotification] = useState(null);

  const showTimerRef = useRef(null);
  const hideTimerRef = useRef(null);

  const createRandomNotification = () => {
    const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
    const randomState = STATES[Math.floor(Math.random() * STATES.length)];
    const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    const randomMinutes = Math.floor(Math.random() * 45) + 2;

    return {
      customer: `${randomName} from ${randomState}`,
      product: randomProduct.name,
      image: randomProduct.image,
      link: randomProduct.link,
      minutesAgo: randomMinutes,
    };
  };

  const formatTime = (minutes) => {
    return minutes < 60
      ? `${minutes} minutes ago`
      : `${Math.floor(minutes / 60)} hour ago`;
  };

  const checkHidden = () => {
    const hidden = localStorage.getItem(STORAGE_KEY);
    if (!hidden) return false;
    const time = parseInt(hidden, 10);
    return Date.now() - time < 45 * 60 * 1000;
  };

  const showPopup = () => {
    if (checkHidden()) return;

    setNotification(createRandomNotification());
    setVisible(true);

    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      const nextDelay = Math.floor(Math.random() * 12000) + 10000;
      showTimerRef.current = setTimeout(showPopup, nextDelay);
    }, 6500);
  };

  const closePopup = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    clearTimeout(showTimerRef.current);
    clearTimeout(hideTimerRef.current);
  };

  useEffect(() => {
    const firstDelay = Math.floor(Math.random() * 5000) + 4000;
    showTimerRef.current = setTimeout(showPopup, firstDelay);

    return () => {
      clearTimeout(showTimerRef.current);
      clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (!notification) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        fixed z-[99999] transition-all duration-500 ease-out
        /* ADJUSTED: Raised bottom values to clear Mobile Nav and WhatsApp Footer */
        bottom-24 md:bottom-8 left-4 md:left-6
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }
      `}>
      <div className="relative overflow-hidden w-[94vw] sm:w-[410px] rounded-2xl bg-white border border-[#f1f1f1] shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
        {/* GLOW */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 via-transparent to-orange-50/30 pointer-events-none" />

        {/* TOP STRIP */}
        <div className="h-[4px] bg-gradient-to-r from-[#f59e0b] via-[#facc15] to-[#fb923c]" />

        {/* CONTENT */}
        <div className="relative p-4">
          <div className="flex gap-4">
            {/* IMAGE (Changed to Link) */}
            <Link
              to={notification.link}
              className="relative shrink-0 w-[82px] h-[82px] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border border-[#f3e6c8] shadow-sm group focus:outline-none focus:ring-2 focus:ring-amber-500">
              <img
                src={notification.image}
                alt={notification.product}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute bottom-1 right-1 bg-white rounded-full p-[2px] shadow-md">
                <CheckBadgeIcon className="w-4 h-4 text-green-600" />
              </div>
            </Link>

            {/* TEXT */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-[3px] rounded-full text-[11px] font-semibold">
                      <FireIcon className="w-3 h-3" />
                      LIVE ORDER
                    </div>
                  </div>
                  <p className="text-[15px] font-semibold text-gray-900 leading-tight">
                    {notification.customer}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <ShoppingBagIcon className="w-4 h-4 text-amber-600" />
                    <p className="text-[13px] text-gray-500">
                      purchased recently
                    </p>
                  </div>
                </div>

                {/* CLOSE */}
                <button
                  onClick={closePopup}
                  className="text-gray-400 hover:text-black transition p-1 rounded-full focus:outline-none focus:bg-gray-100"
                  aria-label="Close notification">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* PRODUCT (Changed to Link) */}
              <Link
                to={notification.link}
                className="mt-2 block text-[16px] font-bold text-[#1f2937] leading-snug hover:text-[#b45309] transition-colors line-clamp-2 focus:outline-none focus:underline">
                {notification.product}
              </Link>

              {/* FOOTER */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {formatTime(notification.minutesAgo)}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                  Verified Buyer
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM PROGRESS */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-100">
          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 gko-animate-progress" />
        </div>
      </div>

      {/* SCOPED ANIMATION */}
      <style>{`
        @keyframes gko-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .gko-animate-progress {
          animation: gko-progress 6.5s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default SalesNotificationPopup;
