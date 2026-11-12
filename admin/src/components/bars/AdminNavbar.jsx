import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  ExternalLink,
  LogOut,
  Menu,
  MessageSquare,
  MessageSquarePlus,
  Package,
  PlusCircle,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Tag,
  X,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import BrandLogo from "../common/BrandLogo";

const NAV_GROUPS = [
  {
    section: "Store Management",
    items: [
      { title: "Orders", path: "/orders", icon: ShoppingBag },
      { title: "Products", path: "/products", alsoMatch: ["/"], icon: Package },
      { title: "Discounts", path: "/discount-codes", icon: Tag },
    ],
  },
  {
    section: "Customers & Content",
    items: [
      { title: "Product Reviews", path: "/reviews", icon: MessageSquarePlus },
      { title: "Inquiries", path: "/inquiries", icon: MessageSquare },
      { title: "Testimonials", path: "/testimonials", icon: Star },
    ],
  },
  {
    section: "Quick Actions",
    items: [
      { title: "Add Product", path: "/products/create", icon: PlusCircle },
    ],
  },
];

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { logout, admin } = useAdminAuth();

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (item) => {
    const current = location.pathname;
    if (item.path === "/products") {
      return (
        current === "/" ||
        current === "/products" ||
        current.startsWith("/products/edit")
      );
    }
    if (item.path === "/reviews") {
      return (
        current === "/reviews" ||
        current.startsWith("/reviews/") ||
        current.startsWith("/products/reviews")
      );
    }
    if (item.alsoMatch?.includes(current)) return true;
    return (
      current === item.path ||
      (item.path !== "/" && current.startsWith(`${item.path}/`))
    );
  };

  const renderSidebarContent = (onNavigate) => (
    <div className="flex flex-col h-full justify-between bg-white">
      <div className="p-3 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.section}>
            <p className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#616161]">
              {group.section}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onNavigate}
                    className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all ${
                      active
                        ? "bg-[#eaf2ff] text-[#2874F0] font-semibold"
                        : "text-[#303030] font-medium hover:bg-[#f1f2f4]"
                    }`}>
                    {active && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#FFE500] ring-1 ring-[#2874F0]/20" />
                    )}
                    <Icon
                      size={16}
                      className={active ? "text-[#2874F0]" : "text-[#616161]"}
                    />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Sales Channel Link */}
        <div>
          <p className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#616161]">
            Sales Channel
          </p>
          <a
            href="https://gharkaorganic.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium text-[#303030] hover:bg-[#f1f2f4] transition">
            <span className="flex items-center gap-2.5">
              <Store size={16} className="text-[#2874F0]" />
              <span>Online Store</span>
            </span>
            <ExternalLink size={12} className="text-[#616161]" />
          </a>
        </div>
      </div>

      {/* Sidebar Store Card */}
      <div className="p-3 border-t border-[#ebebeb]">
        <div className="rounded-xl border border-[#f5d000]/80 bg-[#fff8d6] p-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2874F0] animate-pulse" />
            <span className="text-[11px] font-bold text-[#212121]">
              Ghar Ka Organic
            </span>
          </div>
          <p className="text-[10px] text-[#6b4800] mt-1 font-medium">
            Mangoli, Nainital • Live Storefront
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* TOP BAR: SHOPIFY ADMIN STRUCTURE + FLIPKART BLUE & YELLOW COLORS */}
      <header className="fixed top-0 left-0 right-0 z-[100] h-14 bg-[#2874F0] text-white border-b border-[#1c5fba] shadow-sm font-sans">
        <div className="h-full px-3 sm:px-5 flex items-center justify-between gap-4">
          {/* Left: Mobile Drawer Button + Brand + Store Yellow Pill */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white transition">
              <Menu size={19} />
            </button>

            <Link to="/orders" className="flex items-center gap-2.5 shrink-0">
              <div className="inline-flex items-center rounded-lg bg-white px-2.5 py-1 border border-[#D99A36]/40 shadow-2xs">
                <BrandLogo variant="horizontal" size="sm" showTagline={false} />
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FFE500] text-[#212121] text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
                Admin
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2 pl-3 ml-1 border-l border-white/20 text-[11px] text-blue-100 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFE500]" />
              <span>Store Active • Uttarakhand, India</span>
            </div>
          </div>

          {/* Right: Yellow Storefront CTA + Notification Bell + Admin Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 relative">
            <a
              href="https://gharkaorganic.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#FFE500] hover:bg-[#ffeb3b] text-[#212121] text-xs font-bold shadow-2xs transition cursor-pointer">
              <span>Visit Store</span>
              <ExternalLink size={12} />
            </a>

            <button
              type="button"
              onClick={() => navigate("/inquiries")}
              title="View customer inquiries"
              className="relative p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition cursor-pointer">
              <Bell size={17} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-[#2874F0] bg-[#FFE500]" />
            </button>

            <div className="h-5 w-[1px] bg-white/20 hidden sm:block" />

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 px-1.5 py-1 rounded-lg hover:bg-white/10 transition cursor-pointer">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFE500] text-[#212121] shadow-2xs">
                  <ShieldCheck size={14} />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-[11px] font-bold leading-tight text-white max-w-[130px] truncate">
                    {admin?.email ?? "Admin"}
                  </p>
                  <p className="text-[10px] text-blue-100 leading-none mt-0.5">
                    Store Owner
                  </p>
                </div>
                <ChevronDown size={13} className="text-blue-100" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-11 z-[110] w-56 rounded-xl border border-[#e3e3e3] bg-white py-2 text-[#303030] shadow-xl">
                  <div className="px-4 py-2.5 border-b border-[#ebebeb]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#616161]">
                      Signed in as
                    </p>
                    <p className="text-xs font-bold text-[#212121] truncate mt-0.5">
                      {admin?.email ?? "admin"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer">
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* DESKTOP PERSISTENT SHOPIFY SIDEBAR */}
      <aside className="hidden lg:block fixed top-14 left-0 bottom-0 w-60 z-40 border-r border-[#e3e3e3] bg-white">
        {renderSidebarContent()}
      </aside>

      {/* MOBILE DRAWER */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="lg:hidden fixed inset-0 z-[120] bg-black/50 backdrop-blur-[1px]">
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-64 flex-col bg-white shadow-2xl">
            <div className="flex h-14 shrink-0 items-center justify-between bg-[#2874F0] px-4 text-white border-b border-[#1c5fba]">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center rounded-md bg-white px-2 py-0.5 border border-[#D99A36]/40 shadow-2xs">
                  <BrandLogo variant="horizontal" size="sm" showTagline={false} />
                </div>
                <span className="px-1.5 py-0.5 rounded bg-[#FFE500] text-[#212121] text-[10px] font-extrabold uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-1.5 rounded-lg text-white hover:bg-white/15 transition">
                <X size={17} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {renderSidebarContent(() => setIsMenuOpen(false))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
