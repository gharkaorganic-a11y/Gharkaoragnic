import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../auth/context/UserContext";

import {
  HomeIcon as HomeOutline,
  Squares2X2Icon as ExploreOutline,
  HeartIcon as HeartOutline,
  UserIcon as UserOutline,
} from "@heroicons/react/24/outline";

import {
  HomeIcon as HomeSolid,
  Squares2X2Icon as ExploreSolid,
  HeartIcon as HeartSolid,
  UserIcon as UserSolid,
} from "@heroicons/react/24/solid";

const THEME_COLOR = "#c8102e";

const BottomNavbar = ({}) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleProtected = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate("/auth/login", {
        state: { from: location.pathname },
        replace: true,
      });
    }
  };

  const navItems = [
    { name: "Home", path: "/", IconOutline: HomeOutline, IconSolid: HomeSolid },
    {
      name: "Explore",
      path: "/categories",
      IconOutline: ExploreOutline,
      IconSolid: ExploreSolid,
    },

    {
      name: "Profile",
      path: "/user/profile",
      IconOutline: UserOutline,
      IconSolid: UserSolid,
      protected: true,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-6px_30px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]">
      <ul className="flex justify-around items-center h-[68px] px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = isActive ? item.IconSolid : item.IconOutline;

          return (
            <li key={item.name} className="flex-1 h-full">
              <button
                onClick={() =>
                  item.protected
                    ? handleProtected(item.path)
                    : navigate(item.path)
                }
                className="w-full h-full flex flex-col items-center justify-center gap-1 relative group">
                {/* 🔴 Active Dot Indicator */}
                {isActive && (
                  <span
                    className="absolute top-1 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: THEME_COLOR }}
                  />
                )}

                {/* ICON */}
                <div
                  className={`relative flex items-center justify-center transition-all duration-300
                    ${
                      isActive
                        ? "scale-110 -translate-y-1"
                        : "scale-100 text-gray-500 group-active:scale-95"
                    }
                  `}
                  style={{ color: isActive ? THEME_COLOR : undefined }}>
                  <Icon className="w-6 h-6" />

                  {/* 🔔 Badge */}
                  {item.badge > 0 && (
                    <span
                      className="absolute -top-2 -right-2 text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] px-1 flex items-center justify-center border-2 border-white shadow-sm"
                      style={{ backgroundColor: THEME_COLOR }}>
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>

                {/* LABEL */}
                <span
                  className={`text-[10px] font-semibold tracking-wide transition-all duration-300
                    ${isActive ? "opacity-100" : "opacity-80 text-gray-500"}
                  `}
                  style={{ color: isActive ? THEME_COLOR : undefined }}>
                  {item.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default React.memo(BottomNavbar);
