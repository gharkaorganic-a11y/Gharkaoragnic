// ─────────────────────────────────────────────
// BOT UI SUB-COMPONENTS
// Icon, OptionList, ChipBar, QRStrip,
// PromoBanner, OrderTracker, PagesPopup, etc.
// ─────────────────────────────────────────────

import React, { useEffect } from "react";

// ── DOUBLE TICK ──────────────────────────────
export const DoubleTick = () => (
  <svg
    width={16}
    height={11}
    viewBox="0 0 16 11"
    fill="currentColor"
    aria-hidden="true">
    <path d="M11.071.653a.75.75 0 0 1 .031 1.06l-6.41 7a.75.75 0 0 1-1.102.02L.84 5.88a.75.75 0 1 1 1.072-1.049L4.02 7.19 9.98.684a.75.75 0 0 1 1.09-.031Z" />
    <path d="M14.571.653a.75.75 0 0 1 .03 1.06l-6.41 7a.75.75 0 0 1-1.102.02l-.55-.592a.75.75 0 1 1 1.09-1.03l.01.012L13.48.684a.75.75 0 0 1 1.09-.031Z" />
  </svg>
);

// ── ICON ─────────────────────────────────────
export const Icon = ({ name, size = 20, style = {} }) => {
  const icons = {
    bag: "M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V3a1 1 0 0 0-1-1H6zm0 2h8v1H6V4zm-2 3h12v8H4V7zm4 2a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2H8z",
    cart: "M3 1a1 1 0 0 0 0 2h1.22l.305 1.222a.997.997 0 0 0 .01.042l1.358 5.43-.893.892C4.185 11.145 5.044 13 6.5 13h9a1 1 0 1 0 0-2h-9l1-1H15a1 1 0 0 0 .95-.68l1.5-5A1 1 0 0 0 16.5 3H6.28l-.31-1.243A1 1 0 0 0 5 1H3zM16 16.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-9.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z",
    package:
      "M16.5 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-8.5A2.25 2.25 0 0 1 3.5 17.25V6.75m14 0-1.75-3.5H4.25L2.5 6.75m14 0H2.5M12 10.5h-4",
    tag: "M7 7h.01M7 3H5a2 2 0 0 0-2 2v2c0 .53.21 1.04.59 1.41l7 7a2 2 0 0 0 2.83 0l4-4a2 2 0 0 0 0-2.83l-7-7A2 2 0 0 0 9 3H7z",
    file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z",
    headset:
      "M3 18v-6a9 9 0 0 1 18 0v6M3 18a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5zm18 0a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5z",
    home: "M3 12L12 3l9 9M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9",
    chevronRight: "M9 18l6-6-6-6",
    chevronDown: "M6 9l6 6 6-6",
    back: "M15 18l-6-6 6-6",
    x: "M18 6 6 18M6 6l12 12",
    send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
    search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
    plus: "M12 5v14M5 12h14",
    moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
    sun: "M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z",
    wa: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347",
    info: "M12 16v-4m0-4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z",
    help: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z",
    phone:
      "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z",
    article: "M4 4h16v2H4zm0 4h10v2H4zm0 4h16v2H4zm0 4h10v2H4z",
    return: "M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z",
    truck:
      "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
    refresh:
      "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  };

  const d = icons[name];
  if (!d) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}>
      <path d={d} />
    </svg>
  );
};

// ── ICON TILE ────────────────────────────────
export const IconTile = ({ name, dark }) => (
  <div
    style={{
      width: 34,
      height: 34,
      borderRadius: 10,
      background: dark ? "rgba(0,168,132,0.15)" : "#e7f8f4",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
    <Icon
      name={name}
      size={18}
      style={{ color: dark ? "#25D366" : "#008069" }}
    />
  </div>
);

// ── ANIMATED DOUBLE TICK ─────────────────────
export const AnimatedDoubleTick = ({ read }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      transition: "color 0.4s",
      color: read ? "#53bdeb" : "#8696a0",
    }}>
    <DoubleTick />
  </span>
);

// ── OPTION LIST (menu style) ─────────────────
export const OptionList = ({ options, onTap, dark }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 6,
      maxWidth: 280,
      marginTop: 4,
    }}>
    {options.map((opt, i) => (
      <button
        key={i}
        onClick={() => onTap(opt)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          background: dark ? "#1f2c34" : "#fff",
          border: `0.5px solid ${dark ? "#2a3942" : "#e5e7eb"}`,
          borderRadius: 12,
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.15s",
          width: "100%",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = dark ? "#2a3942" : "#f0fbf8")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = dark ? "#1f2c34" : "#fff")
        }>
        {opt.icon && <IconTile name={opt.icon} dark={dark} />}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 500,
              color: dark ? "#e9edef" : "#111B21",
              lineHeight: 1.2,
            }}>
            {opt.label}
          </div>
          {opt.desc && (
            <div
              style={{
                fontSize: 11.5,
                color: dark ? "#8696a0" : "#667781",
                marginTop: 1,
              }}>
              {opt.desc}
            </div>
          )}
        </div>
        <Icon
          name="chevronRight"
          size={16}
          style={{ color: dark ? "#8696a0" : "#d1d5db" }}
        />
      </button>
    ))}
  </div>
);

// ── CHIP BAR ─────────────────────────────────
export const ChipBar = ({ chips = [], onSelect, dark, loading = false }) => {
  if (loading) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{
              width: i % 2 === 0 ? 120 : 90,
              height: i % 2 === 0 ? 40 : 30,
              borderRadius: 30,
              background: dark ? "#2a3942" : "#e5e7eb",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        ))}
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      </div>
    );
  }
  if (!chips.length) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 6,
        maxWidth: "94%",
        alignItems: "center",
      }}>
      {chips.slice(0, 8).map((c, i) => {
        const isBig = c.isBig;
        return (
          <button
            key={c.id || i}
            onClick={() => onSelect(c)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: isBig ? 8 : 6,
              padding: isBig ? "9px 18px" : "7px 14px",
              borderRadius: 30,
              border: `1.5px solid ${dark ? "#25D366" : "#00A884"}`,
              background: dark ? "rgba(0,168,132,0.08)" : "#fff",
              color: dark ? "#25D366" : "#008069",
              fontSize: isBig ? 14 : 12.5,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
              whiteSpace: "nowrap",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#008069";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "#008069";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 4px 10px rgba(0,128,105,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = dark
                ? "rgba(0,168,132,0.08)"
                : "#fff";
              e.currentTarget.style.color = dark ? "#25D366" : "#008069";
              e.currentTarget.style.borderColor = dark ? "#25D366" : "#00A884";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}>
            {c.image ? (
              <img
                src={c.image}
                alt=""
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                style={{
                  width: isBig ? 26 : 18,
                  height: isBig ? 26 : 18,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
              <Icon name={c.icon || "tag"} size={isBig ? 18 : 14} />
            )}
            <span style={{ lineHeight: 1 }}>{c.label}</span>
            {c.badge && (
              <span
                style={{
                  marginLeft: 4,
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                }}>
                {c.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ── QR STRIP (small scrollable chips) ────────
export const QRStrip = ({ chips, onSelect, dark }) => (
  <div
    style={{
      display: "flex",
      gap: 6,
      overflowX: "auto",
      paddingBottom: 2,
      scrollbarWidth: "none",
      marginTop: 4,
      maxWidth: "100%",
    }}>
    {chips.map((c, i) => {
      const customBg = c.style?.background;
      const customColor = c.style?.color;
      const customBorder = c.style?.borderColor;
      const defaultBg = dark ? "rgba(0,168,132,0.1)" : "#fff";
      const defaultColor = dark ? "#25D366" : "#008069";
      return (
        <button
          key={i}
          onClick={() => onSelect(c)}
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "6px 12px",
            borderRadius: 20,
            border: `1.5px solid ${customBorder || "#00A884"}`,
            background: customBg || defaultBg,
            color: customColor || defaultColor,
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = customBg ? "#990A2B" : "#008069";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = customBg
              ? "#990A2B"
              : "#008069";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = customBg || defaultBg;
            e.currentTarget.style.color = customColor || defaultColor;
            e.currentTarget.style.borderColor = customBorder || "#00A884";
          }}>
          {c.image ? (
            <img
              src={c.image}
              alt={c.label}
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : c.icon ? (
            <Icon name={c.icon} size={13} />
          ) : null}
          {c.label}
        </button>
      );
    })}
  </div>
);

// ── PROMO BANNER ─────────────────────────────
export const PromoBanner = ({ dark, onDismiss }) => {
  const festival = (() => {
    const now = new Date(),
      m = now.getMonth() + 1,
      d = now.getDate();
    const FESTIVALS = [
      { name: "Diwali", start: [10, 20], end: [10, 27], emoji: "🪔" },
      { name: "Christmas", start: [12, 23], end: [12, 27], emoji: "🎄" },
    ];
    return (
      FESTIVALS.find(({ start, end }) => {
        const after = m > start[0] || (m === start[0] && d >= start[1]);
        const before = m < end[0] || (m === end[0] && d <= end[1]);
        return after && before;
      }) || null
    );
  })();

  const text = festival
    ? `${festival.emoji} ${festival.name} special — Use ORGANIC10 for 10% off!`
    : "🎉 Use ORGANIC10 — 10% off on your first order!";

  return (
    <div
      style={{
        background: dark ? "#005c4b" : "#e7f8f4",
        borderBottom: `0.5px solid ${dark ? "#007055" : "#b2dfd4"}`,
        padding: "6px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        flexShrink: 0,
      }}>
      <span
        style={{
          fontSize: 11.5,
          color: dark ? "#9de8c8" : "#006b55",
          fontWeight: 500,
          lineHeight: 1.4,
        }}>
        {text}
      </span>
      <button
        onClick={onDismiss}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: dark ? "#9de8c8" : "#006b55",
          padding: 2,
          flexShrink: 0,
          lineHeight: 1,
        }}
        aria-label="Dismiss">
        ×
      </button>
    </div>
  );
};

// ── ORDER TRACKER CARD ───────────────────────
export const OrderTracker = ({ dark, currentStep = 1 }) => {
  const steps = ["Order Placed", "Packed", "Shipped", "Delivered"];
  return (
    <div
      style={{
        background: dark ? "#1f2c34" : "#fff",
        border: `0.5px solid ${dark ? "#2a3942" : "#e5e7eb"}`,
        borderRadius: 14,
        padding: "14px 16px",
        maxWidth: 280,
      }}>
      <p
        style={{
          fontSize: 12,
          color: dark ? "#8696a0" : "#667781",
          marginBottom: 10,
        }}>
        Order status
      </p>
      <div style={{ display: "flex", alignItems: "center" }}>
        {steps.map((step, i) => (
          <React.Fragment key={step}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background:
                    i <= currentStep ? "#008069" : dark ? "#2a3942" : "#e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: i <= currentStep ? "#fff" : dark ? "#8696a0" : "#aaa",
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                {i < currentStep ? "✓" : i + 1}
              </div>
              <span
                style={{
                  fontSize: 9.5,
                  marginTop: 4,
                  textAlign: "center",
                  maxWidth: 48,
                  lineHeight: 1.2,
                  color:
                    i <= currentStep
                      ? dark
                        ? "#e9edef"
                        : "#111B21"
                      : dark
                        ? "#8696a0"
                        : "#aaa",
                }}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  margin: "0 2px",
                  marginBottom: 14,
                  background:
                    i < currentStep ? "#008069" : dark ? "#2a3942" : "#e5e7eb",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// ── PAGES POPUP ──────────────────────────────
const INFO_PAGES_LOCAL = [
  { id: "about", label: "About us", url: "/pages/about", icon: "info" },
  { id: "faq", label: "FAQ", url: "/pages/faq", icon: "help" },
  { id: "contact", label: "Contact", url: "/pages/contact", icon: "phone" },
  { id: "blog", label: "Blog", url: "/blog", icon: "article" },
  { id: "returns", label: "Returns", url: "/pages/returns", icon: "return" },
  { id: "shipping", label: "Shipping", url: "/pages/shipping", icon: "truck" },
];

export const PagesPopup = ({ onSelect, dark, onClose }) => {
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest("#pagesPopup") && !e.target.closest("#plusBtn"))
        onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      id="pagesPopup"
      style={{
        position: "absolute",
        bottom: 64,
        left: 12,
        background: dark ? "#1f2c34" : "#fff",
        borderRadius: 16,
        border: `0.5px solid ${dark ? "#2a3942" : "#e5e7eb"}`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        padding: 8,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 4,
        zIndex: 30,
        width: 244,
      }}>
      {INFO_PAGES_LOCAL.map((page) => (
        <button
          key={page.id}
          onClick={() => onSelect(page)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 10px",
            borderRadius: 10,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            transition: "background 0.12s",
            textAlign: "left",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = dark ? "#2a3942" : "#e7f8f4")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }>
          <Icon
            name={page.icon}
            size={16}
            style={{ color: dark ? "#25D366" : "#008069" }}
          />
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 500,
              color: dark ? "#e9edef" : "#111B21",
            }}>
            {page.label}
          </span>
        </button>
      ))}
    </div>
  );
};
