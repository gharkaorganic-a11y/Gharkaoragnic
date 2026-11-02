import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaBell,
  FaChevronDown,
  FaUserShield,
  FaCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useAdminAuth } from "../../context/AdminAuthContext"; // <-- Use your context

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { logout, admin } = useAdminAuth();

  const navLinks = useMemo(
    () => [
      { title: "Dashboard", path: "/" },
      { title: "Inventory", path: "/products" },
      { title: "Orders", path: "/orders" },
      { title: "Inquiries", path: "/inquiries" },
      { title: "Testimonials", path: "/testimonials" },
    ],
    [],
  );

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 flex flex-col font-sans">
      {/* PRIMARY HUD */}
      <div className="z-[105] bg-[#2874F0] text-white shadow-md">
        <div className="max-w-[1800px] mx-auto px-4 h-14 flex items-center justify-between gap-6">
          {/* Brand Section */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded transition-colors">
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="https://gharkaorganic.com/logo/gharka-logo.png"
                alt="Ghar Ka Organic"
                className="h-10 w-auto max-w-[150px] rounded bg-white object-contain p-1 sm:max-w-[180px]"
              />
              <div className="hidden sm:flex flex-col">
                <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-blue-100">
                  Store admin
                </span>
              </div>
            </Link>
          </div>

          {/* Center System Status */}
          <div className="hidden md:flex items-center gap-8 px-8 h-full border-x border-white/20">
            <div className="flex items-center gap-2">
              <FaCircle className="text-[#FFE500] text-[8px] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100">
                System: Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100">
                Uttarakhand, India
              </span>
            </div>
            <button
              onClick={() =>
                window.open(
                  "https://gharkaorganic.com/",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:text-blue-100 active:scale-95">
              Visit Store <FaExternalLinkAlt size={10} />
            </button>
          </div>

          {/* Profile HUD */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0 relative">
            <button className="relative p-2 text-[#e2eee3] transition-colors hover:text-white active:scale-90">
              <FaBell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-[#2874F0] bg-[#FFE500]" />
            </button>

            <div className="h-6 w-[1px] bg-white/20 hidden sm:block mx-1"></div>

            <div>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 rounded transition-colors hover:bg-white/10">
                <div className="hidden sm:block text-right">
                  <p className="text-[10px] font-bold uppercase leading-none text-blue-100">
                    {admin?.email ?? "Admin"}
                  </p>
                  <p className="text-xs font-bold text-white flex items-center gap-1 mt-1">
                    Manage Account{" "}
                    <FaChevronDown
                      size={10}
                      className="text-blue-100 opacity-80"
                    />
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#2874F0] shadow-sm">
                  <FaUserShield size={14} />
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-12 z-[110] mt-2 w-56 animate-in rounded-xl border border-gray-200 bg-white py-2 text-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-gray-100 mb-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Authorized Session
                    </p>
                    <p className="text-sm font-bold text-gray-900 truncate mt-0.5">
                      {admin?.email ?? "admin"}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1 transition-colors">
                    <FaSignOutAlt className="mr-3 text-lg" /> Terminate Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Nav */}
      <div className="bg-white border-b border-gray-200 hidden lg:block shadow-sm">
        <div className="max-w-[1800px] mx-auto px-4 flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-1 py-3 text-[12px] font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
                isActive(link.path)
                  ? "text-[#2874F0]"
                  : "text-gray-500 hover:text-gray-900"
              }`}>
              {link.title}
              {isActive(link.path) && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-sm bg-[#2874F0]" />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm">
          <div className="flex h-full w-72 animate-in flex-col bg-[#F1F3F6] shadow-2xl slide-in-from-left duration-300">
            <div className="z-10 flex h-14 shrink-0 items-center justify-between bg-[#2874F0] px-6 text-white shadow-md">
              <span className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                Main Menu
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded transition-colors">
                <FaTimes size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-white">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b border-gray-50 ${
                    isActive(link.path)
                      ? "border-l-4 border-l-[#2874F0] bg-blue-50 text-[#2874F0]"
                      : "text-gray-600 hover:bg-gray-50 border-l-4 border-l-transparent"
                  }`}>
                  {link.title}
                </Link>
              ))}

              <div className="p-6 mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex justify-center items-center gap-2 px-4 py-3 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-red-50 transition-colors">
                  <FaSignOutAlt /> Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
