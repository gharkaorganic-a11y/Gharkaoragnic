import React from "react";

const WhatsAppFloatingButton = ({ open, setOpen, unread = 0 }) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      aria-label={open ? "Close WhatsApp Chat" : "Open WhatsApp Chat"}
      className={`fixed bottom-6 right-6 z-[99999] w-16 h-16 rounded-full bg-[#25D366]
        flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.5)]
        hover:scale-110 active:scale-95 transition-all duration-300
        ${open ? "max-sm:opacity-0 max-sm:pointer-events-none" : "opacity-100"}`}>
      {/* UNREAD NOTIFICATION BADGE */}
      {!open && unread > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1 shadow">
          {unread > 9 ? "9+" : unread}
        </span>
      )}

      {/* ICON TOGGLE (CLOSE ICON vs WHATSAPP ICON) */}
      {open ? (
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="w-8 h-8 fill-white">
          <path d="M19.11 17.59c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.4-1.65-1.56-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.83-2.01-.22-.53-.44-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.28-.96.94-.96 2.29 0 1.35.98 2.65 1.12 2.83.14.18 1.93 2.94 4.67 4.12.65.28 1.15.45 1.54.58.65.21 1.24.18 1.7.11.52-.08 1.65-.67 1.88-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.2-.53-.34z" />
          <path d="M16.001 3C8.82 3 3 8.82 3 16c0 2.82.93 5.42 2.5 7.52L3 29l5.63-1.47A12.93 12.93 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.5c-2.22 0-4.29-.66-6.03-1.79l-.43-.27-3.34.87.89-3.25-.28-.44A10.46 10.46 0 0 1 5.5 16c0-5.8 4.7-10.5 10.5-10.5S26.5 10.2 26.5 16 21.8 26.5 16 26.5z" />
        </svg>
      )}
    </button>
  );
};

export default WhatsAppFloatingButton;
