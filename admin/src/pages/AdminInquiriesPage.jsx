import React, { useState, useEffect, useMemo } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import {
  Mail,
  Phone,
  Clock,
  Trash2,
  Search,
  RefreshCw,
  Copy,
  Check,
  Inbox,
  CheckCircle2,
  AlertCircle,
  Hash,
  Eye,
  EyeOff,
  X,
  MessageSquare,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

/* ─────────────────────────────────────────────
   HELPERS & FLIPKART DESIGN THEME CONSTANTS
───────────────────────────────────────────── */
const formatDateTime = (timestamp) => {
  if (!timestamp) return "Just now";
  let date;
  if (timestamp?.toDate && typeof timestamp.toDate === "function") {
    date = timestamp.toDate();
  } else if (timestamp?.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    date = new Date(timestamp);
  }
  if (isNaN(date.getTime())) return "Recently";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "Just now";
  let date;
  if (timestamp?.toDate && typeof timestamp.toDate === "function") {
    date = timestamp.toDate();
  } else if (timestamp?.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    date = new Date(timestamp);
  }
  if (isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 7) {
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }
  if (diffDay >= 1) return `${diffDay}d ago`;
  if (diffHour >= 1) return `${diffHour}h ago`;
  if (diffMin >= 1) return `${diffMin}m ago`;
  return "Just now";
};

const cleanPhoneForWhatsApp = (phone) => {
  if (!phone) return "";
  let digits = String(phone).replace(/\D/g, "");
  if (digits.length === 10) {
    digits = `91${digits}`;
  }
  return digits;
};

// Flipkart Seller Hub Status Colors
const STATUS_CONFIG = {
  new: {
    label: "New",
    badge: "bg-[#E8F0FE] text-[#2874F0] border-[#D2E3FC]",
    dot: "bg-[#2874F0]",
  },
  in_progress: {
    label: "In Progress",
    badge: "bg-[#FFF3E0] text-[#FB641B] border-[#FFE0B2]",
    dot: "bg-[#FB641B]",
  },
  resolved: {
    label: "Resolved",
    badge: "bg-[#E8F5E9] text-[#388E3C] border-[#C8E6C9]",
    dot: "bg-[#388E3C]",
  },
  archived: {
    label: "Archived",
    badge: "bg-[#F1F3F6] text-[#878787] border-[#E0E0E0]",
    dot: "bg-[#878787]",
  },
};

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "archived", label: "Archived" },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'unread' | 'resolved' | 'archived'
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState(null);
  const [expandedMessages, setExpandedMessages] = useState({});

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Real-time Firestore Listener ──
  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "inquiries"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setInquiries(docs);
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.error("Firestore inquiries stream error:", error);
        showToast("error", "Failed to connect to inquiries stream.");
        setLoading(false);
        setRefreshing(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleManualRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  // Distinct subjects for dropdown
  const subjects = useMemo(() => {
    const set = new Set();
    inquiries.forEach((item) => {
      if (item.subject?.trim()) set.add(item.subject.trim());
    });
    return Array.from(set);
  }, [inquiries]);

  // Statistics
  const stats = useMemo(() => {
    const total = inquiries.length;
    const unread = inquiries.filter((i) => !i.read && i.status !== "archived").length;
    const resolved = inquiries.filter((i) => i.status === "resolved").length;
    const archived = inquiries.filter((i) => i.status === "archived").length;
    return { total, unread, resolved, archived };
  }, [inquiries]);

  // Filtered list
  const filtered = useMemo(() => {
    return inquiries.filter((item) => {
      // Status tab
      if (statusFilter === "unread" && (item.read || item.status === "archived")) {
        return false;
      }
      if (statusFilter === "resolved" && item.status !== "resolved") {
        return false;
      }
      if (statusFilter === "archived" && item.status !== "archived") {
        return false;
      }
      if (statusFilter === "all" && item.status === "archived") {
        return false;
      }

      // Subject filter
      if (subjectFilter !== "all" && item.subject !== subjectFilter) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(q);
        const matchesEmail = item.email?.toLowerCase().includes(q);
        const matchesPhone = item.phone?.toLowerCase().includes(q);
        const matchesSubject = item.subject?.toLowerCase().includes(q);
        const matchesMessage = item.message?.toLowerCase().includes(q);
        const matchesOrderId = item.orderId?.toLowerCase().includes(q);
        if (
          !matchesName &&
          !matchesEmail &&
          !matchesPhone &&
          !matchesSubject &&
          !matchesMessage &&
          !matchesOrderId
        ) {
          return false;
        }
      }

      return true;
    });
  }, [inquiries, statusFilter, subjectFilter, searchTerm]);

  // ── Actions ──
  const handleStatusChange = async (inquiry, newStatus) => {
    try {
      await updateDoc(doc(db, "inquiries", inquiry.id), {
        status: newStatus,
        read: true,
      });
      showToast("success", `Status updated to ${newStatus}.`);
    } catch (err) {
      console.error("Status update error:", err);
      showToast("error", "Could not update status.");
    }
  };

  const handleToggleRead = async (e, inquiry) => {
    e.stopPropagation();
    const newRead = !inquiry.read;
    try {
      await updateDoc(doc(db, "inquiries", inquiry.id), { read: newRead });
      showToast("success", newRead ? "Marked as read." : "Marked as unread.");
    } catch (err) {
      showToast("error", "Could not update read status.");
    }
  };

  const handleDelete = async (e, inquiry) => {
    e.stopPropagation();
    if (!window.confirm(`Delete inquiry from ${inquiry.name || "Customer"} permanently?`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, "inquiries", inquiry.id));
      if (selectedInquiry?.id === inquiry.id) {
        setSelectedInquiry(null);
      }
      showToast("success", "Inquiry deleted.");
    } catch (err) {
      console.error("Delete error:", err);
      showToast("error", "Failed to delete inquiry.");
    }
  };

  const handleCopy = (e, text, label) => {
    e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(label);
    showToast("success", `Copied ${label} to clipboard.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWhatsApp = (e, inquiry) => {
    e.stopPropagation();
    const cleanPhone = cleanPhoneForWhatsApp(inquiry.phone);
    if (!cleanPhone) {
      showToast("error", "No valid phone number for WhatsApp.");
      return;
    }
    const customerName = inquiry.name ? inquiry.name.split(" ")[0] : "Customer";
    const text = encodeURIComponent(
      `Hello ${customerName}, greeting from Ghar Ka Organic!\n\nRegarding your inquiry about "${inquiry.subject || "our products"}": `
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  const toggleExpand = (e, id) => {
    e.stopPropagation();
    setExpandedMessages((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#F1F3F6] font-sans text-[#212121] antialiased pb-20">
      {/* ── TOAST NOTIFICATION ── */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-md text-xs font-semibold border ${
              toast.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : "bg-emerald-50 border-emerald-200 text-[#388E3C]"
            }`}>
            {toast.type === "error" ? (
              <AlertCircle size={16} className="text-rose-600" />
            ) : (
              <CheckCircle2 size={16} className="text-[#388E3C]" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* ── FLIPKART STYLE PAGE HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2874F0] text-white flex items-center justify-center shadow-sm">
              <MessageSquare size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#212121] tracking-tight">
                  Customer Inquiries
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-sm bg-[#2874F0] text-white shadow-xs">
                  {inquiries.length} Total
                </span>
                {stats.unread > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-sm bg-[#FB641B] text-white shadow-xs animate-pulse">
                    {stats.unread} New
                  </span>
                )}
              </div>
              <p className="text-xs text-[#878787] font-medium mt-0.5">
                Direct messages from your website contact form • Real-time sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              disabled={loading || refreshing}
              title="Refresh Inquiries"
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E0E0E0] rounded-md text-xs font-bold text-[#2874F0] hover:bg-[#F4F8FF] hover:border-[#2874F0] transition shadow-xs cursor-pointer">
              <RefreshCw
                size={14}
                className={loading || refreshing ? "animate-spin text-[#2874F0]" : "text-[#2874F0]"}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* ── FLIPKART SELLER HUB FILTER & SEARCH TOOLBAR ── */}
        <div className="bg-white border border-[#E0E0E0] rounded-lg p-3 sm:p-4 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs with Flipkart Blue & Orange Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              {
                key: "all",
                label: "All Active",
                count: stats.total - stats.archived,
                badgeBg: "bg-blue-100 text-[#2874F0]",
              },
              {
                key: "unread",
                label: "Unread",
                count: stats.unread,
                badgeBg: "bg-[#FB641B] text-white",
              },
              {
                key: "resolved",
                label: "Resolved",
                count: stats.resolved,
                badgeBg: "bg-emerald-100 text-[#388E3C]",
              },
              {
                key: "archived",
                label: "Archived",
                count: stats.archived,
                badgeBg: "bg-gray-100 text-[#878787]",
              },
            ].map((tab) => {
              const isActive = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#2874F0] text-white shadow-xs"
                      : "bg-[#F1F3F6] text-[#878787] hover:text-[#212121] hover:bg-[#E0E0E0]"
                  }`}>
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : tab.badgeBg
                    }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box & Subject Filter */}
          <div className="flex items-center gap-2 flex-col sm:flex-row w-full md:w-auto">
            {subjects.length > 0 && (
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full sm:w-44 bg-white border border-[#E0E0E0] rounded-md px-2.5 py-1.5 text-xs text-[#212121] font-semibold outline-none focus:border-[#2874F0] focus:ring-1 focus:ring-[#2874F0] transition">
                <option value="all">All Subjects ({inquiries.length})</option>
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            )}

            <div className="relative w-full sm:w-64">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#878787]"
              />
              <input
                type="text"
                placeholder="Search name, phone, message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#E0E0E0] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#212121] placeholder-[#878787] font-medium focus:outline-none focus:border-[#2874F0] focus:ring-1 focus:ring-[#2874F0] transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#878787] hover:text-[#212121]">
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── INQUIRIES CARDS GRID WITH FLIPKART STYLING ── */}
        {loading ? (
          <div className="py-24 text-center bg-white rounded-lg border border-[#E0E0E0] p-8 shadow-xs">
            <RefreshCw
              size={24}
              className="animate-spin text-[#2874F0] mx-auto mb-3"
            />
            <p className="text-sm font-bold text-[#212121]">
              Connecting to inquiries...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-lg border border-[#E0E0E0] p-8 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#F1F3F6] flex items-center justify-center mx-auto text-[#878787] mb-3">
              <Inbox size={22} className="text-[#2874F0]" />
            </div>
            <p className="text-base font-bold text-[#212121]">
              No inquiries found
            </p>
            <p className="text-xs text-[#878787] mt-1 max-w-sm mx-auto">
              {searchTerm || subjectFilter !== "all" || statusFilter !== "all"
                ? "Try selecting another status tab or clearing your search filter."
                : "Customer messages submitted through the website contact form will appear here."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((inquiry) => {
              const currentStatus = inquiry.status || "new";
              const config = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.new;
              const isUnread = !inquiry.read;
              const isExpanded = expandedMessages[inquiry.id];
              const messageText = inquiry.message || "(No message body provided)";
              const isLongMessage = messageText.length > 160;

              return (
                <div
                  key={inquiry.id}
                  onClick={() => setSelectedInquiry(inquiry)}
                  className={`bg-white border rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
                    isUnread
                      ? "border-[#2874F0] ring-1 ring-[#2874F0]/30"
                      : "border-[#E0E0E0] hover:border-[#2874F0]"
                  }`}>
                  <div>
                    {/* 1. TOP ROW: SENDER NAME + TIMESTAMP + STATUS SELECTOR */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F1F3F6]">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {isUnread && (
                            <span
                              className="w-2 h-2 rounded-full bg-[#FB641B] shrink-0 animate-pulse"
                              title="Unread Message"
                            />
                          )}
                          <span className="text-sm font-bold text-[#212121] truncate">
                            {inquiry.name || "Customer"}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#878787] mt-1 flex items-center gap-1 font-medium">
                          <Clock size={11} className="shrink-0 text-[#878787]" />
                          <span>{formatDateTime(inquiry.createdAt)}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-[#2874F0] font-semibold">
                            {formatRelativeTime(inquiry.createdAt)}
                          </span>
                        </p>
                      </div>

                      {/* Flipkart Style Status Selector */}
                      <select
                        value={currentStatus}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(inquiry, e.target.value)}
                        className={`text-xs font-bold border rounded-md px-2.5 py-1.5 cursor-pointer outline-none transition shadow-2xs shrink-0 ${config.badge}`}>
                        {STATUS_OPTIONS.map((opt) => (
                          <option
                            key={opt.value}
                            value={opt.value}
                            className="bg-white text-[#212121] font-semibold">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 2. SUBJECT & ORDER ID PILLS (Flipkart Colors) */}
                    <div className="py-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-sm bg-[#F4F8FF] text-[#2874F0] border border-[#D0E2FF]">
                        {inquiry.subject || "General Inquiry"}
                      </span>

                      {inquiry.orderId && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-sm bg-[#FFF8E7] text-[#B76E00] border border-[#FFE082] flex items-center gap-1">
                          <Hash size={10} />
                          Order #{inquiry.orderId}
                        </span>
                      )}
                    </div>

                    {/* 3. CONTACT FIELDS (Email & Phone) */}
                    <div className="py-2 space-y-1.5 text-xs text-[#878787]">
                      {/* Email */}
                      <div className="flex items-center justify-between gap-2 py-1 px-2.5 rounded-md bg-[#F9FAFB] border border-[#E0E0E0]">
                        <a
                          href={`mailto:${inquiry.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 truncate text-[#212121] hover:text-[#2874F0] font-semibold"
                          title="Send Email">
                          <Mail size={13} className="text-[#2874F0] shrink-0" />
                          <span className="truncate">{inquiry.email || "No email provided"}</span>
                        </a>
                        {inquiry.email && (
                          <button
                            onClick={(e) => handleCopy(e, inquiry.email, `Email-${inquiry.id}`)}
                            title="Copy email"
                            className="text-[#878787] hover:text-[#2874F0] p-1 rounded cursor-pointer">
                            {copiedId === `Email-${inquiry.id}` ? (
                              <Check size={12} className="text-[#388E3C]" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="flex items-center justify-between gap-2 py-1 px-2.5 rounded-md bg-[#F9FAFB] border border-[#E0E0E0]">
                        <a
                          href={`tel:${inquiry.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 truncate text-[#212121] hover:text-[#2874F0] font-semibold"
                          title="Call Customer">
                          <Phone size={13} className="text-[#2874F0] shrink-0" />
                          <span className="truncate">{inquiry.phone || "No phone provided"}</span>
                        </a>
                        {inquiry.phone && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => handleWhatsApp(e, inquiry)}
                              title="Chat on WhatsApp"
                              className="text-[#25D366] hover:scale-110 transition-transform p-1 rounded cursor-pointer">
                              <FaWhatsapp size={15} />
                            </button>
                            <button
                              onClick={(e) => handleCopy(e, inquiry.phone, `Phone-${inquiry.id}`)}
                              title="Copy phone"
                              className="text-[#878787] hover:text-[#2874F0] p-1 rounded cursor-pointer">
                              {copiedId === `Phone-${inquiry.id}` ? (
                                <Check size={12} className="text-[#388E3C]" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 4. CUSTOMER MESSAGE BODY */}
                    <div className="mt-2.5">
                      <div className="bg-[#F8FAFD] border border-[#E2E8F0] rounded-lg p-3 text-xs text-[#212121] leading-relaxed font-normal">
                        <p className={`whitespace-pre-wrap ${!isExpanded && isLongMessage ? "line-clamp-4" : ""}`}>
                          {messageText}
                        </p>
                        {isLongMessage && (
                          <button
                            onClick={(e) => toggleExpand(e, inquiry.id)}
                            className="mt-1 text-[11px] font-bold text-[#2874F0] hover:underline cursor-pointer block">
                            {isExpanded ? "Show less" : "Read full message..."}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 5. BOTTOM CARD ACTIONS (Flipkart Blue & WhatsApp Green) */}
                  <div className="mt-4 pt-3 border-t border-[#F1F3F6] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {inquiry.phone && (
                        <button
                          onClick={(e) => handleWhatsApp(e, inquiry)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#25D366] hover:bg-[#20BA59] text-white rounded-md text-xs font-bold transition shadow-xs cursor-pointer">
                          <FaWhatsapp size={13} />
                          <span>WhatsApp</span>
                        </button>
                      )}

                      {inquiry.email && (
                        <a
                          href={`mailto:${inquiry.email}?subject=Regarding your inquiry: ${encodeURIComponent(
                            inquiry.subject || "Ghar Ka Organic"
                          )}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#2874F0] hover:bg-[#1C5FBA] text-white rounded-md text-xs font-bold transition shadow-xs">
                          <Mail size={12} />
                          <span>Email</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Mark Read/Unread Toggle */}
                      <button
                        onClick={(e) => handleToggleRead(e, inquiry)}
                        title={inquiry.read ? "Mark unread" : "Mark read"}
                        className="p-1.5 text-[#878787] hover:text-[#2874F0] hover:bg-[#F4F8FF] rounded-md transition cursor-pointer">
                        {inquiry.read ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={(e) => handleDelete(e, inquiry)}
                        title="Delete Inquiry"
                        className="p-1.5 text-[#878787] hover:text-[#D32F2F] hover:bg-rose-50 rounded-md transition cursor-pointer">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MODAL FOR VIEWING FULL INQUIRY DETAILS ── */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setSelectedInquiry(null)}>
          <div
            className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 border border-[#E0E0E0]"
            onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F1F3F6]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2874F0] text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {selectedInquiry.name?.charAt(0).toUpperCase() || "C"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#212121]">
                    {selectedInquiry.name || "Customer Inquiry"}
                  </h3>
                  <p className="text-xs text-[#878787] mt-0.5">
                    Received on {formatDateTime(selectedInquiry.createdAt)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 text-[#878787] hover:text-[#212121] rounded-md hover:bg-[#F1F3F6] transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Subject, Status & Order tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-1 rounded-sm bg-[#F4F8FF] text-[#2874F0] border border-[#D0E2FF]">
                {selectedInquiry.subject || "General Inquiry"}
              </span>

              {selectedInquiry.orderId && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-sm bg-[#FFF8E7] text-[#B76E00] border border-[#FFE082]">
                  Order #{selectedInquiry.orderId}
                </span>
              )}

              <select
                value={selectedInquiry.status || "new"}
                onChange={(e) => handleStatusChange(selectedInquiry, e.target.value)}
                className="text-xs font-bold border border-[#E0E0E0] rounded-md px-2.5 py-1 bg-white cursor-pointer outline-none focus:border-[#2874F0]">
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Status: {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Details Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg bg-[#F9FAFB] border border-[#E0E0E0] text-xs">
              <div>
                <span className="text-[#878787] block font-semibold">Customer Email</span>
                <span className="text-[#212121] font-bold break-all">
                  {selectedInquiry.email || "Not provided"}
                </span>
              </div>
              <div>
                <span className="text-[#878787] block font-semibold">Phone Number</span>
                <span className="text-[#212121] font-bold">
                  {selectedInquiry.phone || "Not provided"}
                </span>
              </div>
            </div>

            {/* Full Message */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#878787] uppercase tracking-wider">
                Customer Message
              </span>
              <div className="p-4 rounded-lg bg-[#F8FAFD] border border-[#E2E8F0] text-xs sm:text-sm text-[#212121] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedInquiry.message || "(No message body provided)"}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-3 border-t border-[#F1F3F6] flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                {selectedInquiry.phone && (
                  <button
                    onClick={(e) => handleWhatsApp(e, selectedInquiry)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366] hover:bg-[#20BA59] text-white rounded-md text-xs font-bold transition shadow-xs cursor-pointer">
                    <FaWhatsapp size={14} /> WhatsApp Reply
                  </button>
                )}
                {selectedInquiry.email && (
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Regarding your inquiry: ${encodeURIComponent(
                      selectedInquiry.subject || "Ghar Ka Organic"
                    )}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2874F0] hover:bg-[#1C5FBA] text-white rounded-md text-xs font-bold transition shadow-xs">
                    <Mail size={13} /> Send Email
                  </a>
                )}
              </div>

              <button
                onClick={(e) => handleDelete(e, selectedInquiry)}
                className="flex items-center gap-1 px-3 py-2 text-[#D32F2F] hover:bg-rose-50 rounded-md text-xs font-bold transition cursor-pointer">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
