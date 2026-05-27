import React from "react";
import { Icon } from "./BotUIComponents"; // Adjust path as needed
import { STORE_INFO } from "../constants/botData";

const ChatHeader = ({
  dark,
  setDark,
  setOpen,
  typing,
  restart,
  user,
  handleLogout,
}) => {
  return (
    <div className="px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between sm:rounded-t-2xl shadow-sm z-10 bg-[#008069] border-b border-black/5">
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setOpen(false)}
          className="sm:hidden text-white/90 p-1.5 -ml-1.5 rounded-full hover:bg-white/10"
          aria-label="Close">
          <Icon name="back" size={22} />
        </button>
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#005c4b] border border-white/20 flex items-center justify-center overflow-hidden">
            <span className="absolute text-white font-bold text-sm">GK</span>
            <img
              src={STORE_INFO.logo}
              alt={STORE_INFO.name}
              className="relative z-10 w-full h-full object-cover bg-white"
              onError={(e) => {
                e.currentTarget.style.opacity = "0";
              }}
            />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-[#008069] rounded-full z-20" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-white text-[15px] tracking-tight leading-none">
              {STORE_INFO.name}
            </h3>
          </div>
          <p className="text-[11.5px] text-white/80 leading-tight mt-1 flex items-center gap-1">
            {typing ? (
              <>
                <span className="text-[#25D366] font-medium animate-pulse">
                  typing
                </span>
                <span className="flex gap-0.5 mt-1">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="w-1 h-1 bg-[#25D366] rounded-full animate-bounce"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </span>
              </>
            ) : (
              "online · replies instantly"
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setDark((v) => !v)}
          className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10">
          <Icon name={dark ? "sun" : "moon"} size={18} />
        </button>
        <button
          onClick={restart}
          className="text-[11px] text-white/80 hover:text-white font-medium px-2 py-1 rounded-md hover:bg-white/10">
          Restart
        </button>
        {user?.name && (
          <button
            onClick={handleLogout}
            className="text-[11px] text-white/80 hover:text-white font-medium px-2 py-1 rounded-md hover:bg-white/10">
            Logout
          </button>
        )}
        <button
          onClick={() => setOpen(false)}
          className="hidden sm:flex text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 ml-0.5">
          <Icon name="x" size={20} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(ChatHeader);
