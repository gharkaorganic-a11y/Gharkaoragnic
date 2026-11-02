import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  BarChart,
} from "lucide-react";

import { COLORS } from "../../../style/theme";

const menu = [
  { title: "Dashboard", icon: <LayoutDashboard size={20} />, link: "/admin" },
  {
    title: "Products",
    icon: <ShoppingBag size={20} />,
    link: "/admin/products",
  },
  { title: "Orders", icon: <BarChart size={20} />, link: "/admin/orders" },
];

const Sidebar = () => {
  return (
    <aside
      className="h-screen w-64  z-50 fixed top-0 left-0 flex flex-col shadow-lg"
      style={{ backgroundColor: COLORS.primary }}>
      {/* Logo Area */}
      <div className="px-6 py-6">
        <img
          src="https://gharkaorganic.com/logo/gharka-logo.png"
          alt="Ghar Ka Organic"
          className="h-12 w-auto max-w-full rounded bg-white object-contain p-1"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        {menu.map((item, i) => (
          <NavLink
            key={i}
            to={item.link}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-sm font-medium transition ${
                isActive
                  ? "bg-white text-black shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }>
            {item.icon}
            {item.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
