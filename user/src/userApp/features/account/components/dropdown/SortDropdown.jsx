import { useState, useRef, useEffect, useId, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS  (co-located so callers can import them if needed)
───────────────────────────────────────────────────────────────────────────── */

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "A → Z", value: "a_z" },
  { label: "Z → A", value: "z_a" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   HOOK — close-on-outside-interaction
   Handles both mouse and touch, and Escape.
   Returns a ref to attach to the container.
───────────────────────────────────────────────────────────────────────────── */

const useDismiss = (isOpen, onClose) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    // pointer covers mouse + touch in one listener
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  return ref;
};

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT
   Props:
     options   – array of { label, value }; defaults to SORT_OPTIONS
     sort      – currently selected value
     setSort   – (value: string) => void
───────────────────────────────────────────────────────────────────────────── */

const SortDropdown = ({ sort, setSort, options = SORT_OPTIONS }) => {
  const [open, setOpen] = useState(false);
  const listboxId = useId(); // stable, unique id for aria-controls
  const triggerRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);
  const containerRef = useDismiss(open, close);

  const currentLabel = options.find((o) => o.value === sort)?.label ?? "Sort";

  const handleSelect = useCallback(
    (value) => {
      setSort(value);
      setOpen(false);
      // Return focus to trigger so keyboard users aren't lost
      triggerRef.current?.focus();
    },
    [setSort],
  );

  /* Keyboard navigation inside listbox (↑ ↓ Home End) */
  const handleListKeyDown = useCallback(
    (e) => {
      const items = options.map((o) => o.value);
      const currentIdx = items.indexOf(sort);

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const next = (currentIdx + 1) % items.length;
          setSort(items[next]);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prev = (currentIdx - 1 + items.length) % items.length;
          setSort(items[prev]);
          break;
        }
        case "Home":
          e.preventDefault();
          setSort(items[0]);
          break;
        case "End":
          e.preventDefault();
          setSort(items[items.length - 1]);
          break;
        case "Tab":
          close();
          break;
        default:
          break;
      }
    },
    [options, sort, setSort, close],
  );

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
        <span className="font-medium text-gray-900">Sort:</span>
        <span className="text-gray-600">{currentLabel}</span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Listbox */}
      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Sort order"
          aria-activedescendant={`${listboxId}-${sort}`}
          onKeyDown={handleListKeyDown}
          tabIndex={-1}
          className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg shadow-gray-200/70 ring-1 ring-black/5 focus:outline-none animate-in fade-in-0 zoom-in-95 duration-100">
          {options.map((opt) => {
            const isActive = sort === opt.value;
            return (
              <li
                key={opt.value}
                id={`${listboxId}-${opt.value}`}
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(opt.value)}
                // Allow keyboard activation via Enter / Space
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(opt.value);
                  }
                }}
                tabIndex={0}
                className={`flex cursor-pointer items-center justify-between px-3.5 py-2.5 text-sm transition select-none focus:outline-none focus:bg-gray-50 ${
                  isActive
                    ? "bg-gray-50 font-medium text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}>
                {opt.label}
                {isActive && (
                  <Check
                    size={16}
                    aria-hidden="true"
                    className="text-gray-900"
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SortDropdown;
