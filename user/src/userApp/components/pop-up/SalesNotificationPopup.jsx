import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  XMarkIcon,
  CheckBadgeIcon,
  ShoppingBagIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

/* ─────────────────────────────────────────────
   PRODUCTS & DATA
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
      ? `${minutes} mins ago`
      : `${Math.floor(minutes / 60)} hr ago`;
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
        fixed z-[99999] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        /* MOBILE FIRST: Centered safely above bottom navs */
        bottom-20 left-4 right-4 
        /* DESKTOP: Anchored to bottom left with fixed width */
        md:bottom-8 md:left-8 md:right-auto md:w-[400px]
        ${
          visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none"
        }
      `}>
      <div className="relative overflow-hidden w-full rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        {/* SUBTLE TOP ACCENT LINE */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500" />

        {/* CONTENT */}
        <div className="relative p-4 sm:p-5">
          <div className="flex gap-4">
            {/* IMAGE */}
            <Link
              to={notification.link}
              className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <img
                src={notification.image}
                alt={notification.product}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-tl-xl p-1.5 shadow-sm">
                <CheckBadgeIcon className="w-5 h-5 text-emerald-500" />
              </div>
            </Link>

            {/* TEXT CONTAINER */}
            <div className="flex-1 min-w-0 py-0.5">
              {/* HEADER ROW: Customer & Close Button */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1">
                    <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[11px] font-bold tracking-wide text-amber-600 uppercase">
                      New Order
                    </span>
                  </div>
                  <p className="text-[14px] sm:text-[15px] font-semibold text-gray-900 leading-tight truncate">
                    {notification.customer}
                  </p>
                </div>

                <button
                  onClick={closePopup}
                  className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 -mt-1 -mr-1 rounded-full focus:outline-none focus:bg-gray-100"
                  aria-label="Close notification">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* PRODUCT LINK */}
              <Link
                to={notification.link}
                className="mt-1.5 block text-[15px] sm:text-[16px] font-bold text-gray-800 leading-snug hover:text-emerald-600 transition-colors line-clamp-2 focus:outline-none focus:underline">
                {notification.product}
              </Link>

              {/* FOOTER */}
              <div className="flex items-center gap-3 mt-2.5">
                <div className="flex items-center gap-1.5">
                  <ShoppingBagIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-[12px] text-gray-500 font-medium">
                    {formatTime(notification.minutesAgo)}
                  </span>
                </div>

                <div className="w-1 h-1 rounded-full bg-gray-300"></div>

                <div className="flex items-center gap-1.5 text-emerald-600">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM PROGRESS BAR */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-100">
          <div className="h-full bg-emerald-500/80 gko-animate-progress" />
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
