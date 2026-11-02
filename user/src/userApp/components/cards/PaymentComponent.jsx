import React, { useState, useEffect, useRef } from "react";
import { Banknote } from "lucide-react";

/*
  Fixes vs original:
  ──────────────────────────────────────────────────────────
  1. Exported as both PaymentSelector AND PaymentComponent
     so AddressPage import works without renaming
  2. onSelectPayment callback stabilized via useRef —
     no re-fire on every parent render
  3. Modal removed entirely → inline selector, always visible.
     The original opacity/visibility toggle kept the modal in
     the DOM at all times (intercepting focus, wasting memory)
  4. Single-method case now shows the option (read-only)
     instead of rendering null with a silent callback
  5. Selected state is always visible — no "where did my
     selection go after closing the modal" UX confusion
  ──────────────────────────────────────────────────────────
*/

const METHODS = {
  cod: {
    label: "Cash on Delivery",
    description: "Pay by cash or UPI at doorstep",
    icon: <Banknote size={18} />,
    iconBg: "#fce7f3",
    iconColor: "#f43397",
    badge: null,
  },
};

/* ────────────────────────────────────────
   PaymentSelector  (also exported as PaymentComponent)
──────────────────────────────────────── */

const PaymentSelector = ({
  availableMethods = ["cod"],
  onSelectPayment,
  defaultMethod = "cod",
}) => {
  const [selected, setSelected] = useState(
    // If defaultMethod isn't in available list, fall back to first available
    availableMethods.includes(defaultMethod)
      ? defaultMethod
      : availableMethods[0],
  );

  // ✅ Stable ref — callback changes in parent don't cause re-fires
  const callbackRef = useRef(onSelectPayment);
  useEffect(() => {
    callbackRef.current = onSelectPayment;
  }, [onSelectPayment]);

  // Fire once on mount so parent always knows the initial selection
  useEffect(() => {
    callbackRef.current?.(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — fire once only

  const handleSelect = (method) => {
    if (method === selected) return; // no-op if already selected
    setSelected(method);
    callbackRef.current?.(method);
  };

  const visibleMethods = availableMethods.filter((m) => METHODS[m]);
  const isSingle = visibleMethods.length === 1;

  return (
    <div className="bg-white border border-gray-100  overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className=" text-[12px] sm:text-[12px] font-bold text-gray-700 uppercase tracking-wide">
          Payment method
        </p>
      </div>

      {/* Options — always visible inline, no modal */}
      {visibleMethods.map((method, idx) => {
        const cfg = METHODS[method];
        const isSelected = selected === method;
        const isLast = idx === visibleMethods.length - 1;

        return (
          <label
            key={method}
            className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors ${
              isSelected ? "" : "hover:bg-gray-50" // Removed bg-[#fff7fb]
            } ${!isLast ? "border-b border-gray-100" : ""}`}
            style={{ cursor: isSingle ? "default" : "pointer" }}>
            {/* Hidden radio */}
            <input
              type="radio"
              name="payment-method"
              value={method}
              checked={isSelected}
              onChange={() => !isSingle && handleSelect(method)}
              className="sr-only"
            />

            {/* Custom radio dot */}
            {!isSingle && (
              <div
                className="shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center transition-all"
                style={{
                  border: isSelected
                    ? "2px solid #f43397"
                    : "1.5px solid #d1d5db",
                }}>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-[#f43397]" />
                )}
              </div>
            )}

            {/* Icon */}
            <div
              className="shrink-0 w-9 h-9 rounded-[10px] flex items-center justify-center"
              style={{
                backgroundColor: cfg.iconBg,
                color: cfg.iconColor,
              }}>
              {cfg.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium text-gray-900">
                  {cfg.label}
                </span>
                {cfg.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-green-100 text-green-700 uppercase tracking-wide">
                    {cfg.badge}
                  </span>
                )}
              </div>
              <p className="text-[12px] text-gray-500 mt-0.5">
                {cfg.description}
              </p>
            </div>

            {/* Selected badge */}
            {isSelected && (
              <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-[#f43397] text-[#c0005e]">
                Selected
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
};

// ✅ Dual export — works as both PaymentSelector and PaymentComponent
export { PaymentSelector };
export default PaymentSelector;
export const PaymentComponent = PaymentSelector;
