import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  Copy,
  IndianRupee,
  MessageCircle,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import {
  MAX_DISCOUNT_AMOUNT,
  MIN_DISCOUNT_AMOUNT,
  PRESET_DISCOUNT_AMOUNTS,
  adminDiscountService,
  buildNewDiscountSlot,
  generateSecretDiscountCode,
  normalizeDiscountAmount,
  sanitizePromoCode,
} from "../services/firebase/adminDiscountService";

const AdminDiscountCodesPage = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");
  const [newlyCreatedId, setNewlyCreatedId] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Create form state
  const [customLabel, setCustomLabel] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [customAmount, setCustomAmount] = useState("20");
  const [customActive, setCustomActive] = useState(true);

  // Edit mode state
  const [editingSlotId, setEditingSlotId] = useState("");
  const [editDraft, setEditDraft] = useState({
    label: "",
    code: "",
    amount: "",
    isActive: true,
  });

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let active = true;
    const loadCodes = async () => {
      try {
        const list = await adminDiscountService.getAllDiscountCodes();
        if (active) {
          setSlots(list);
          setError("");
        }
      } catch (err) {
        console.error("[AdminDiscountCodesPage] load error:", err);
        if (active) {
          setError(
            err?.message ||
              "Could not load promo discount codes from Firebase.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadCodes();
    return () => {
      active = false;
    };
  }, []);

  const persistSlots = async (nextSlots, message) => {
    setSaving(true);
    setError("");
    setSuccessMsg("");
    try {
      const saved = await adminDiscountService.saveAllDiscountCodes(nextSlots);
      setSlots(saved);
      setSuccessMsg(message);
      return true;
    } catch (err) {
      console.error("[AdminDiscountCodesPage] save error:", err);
      setError(err?.message || "Failed to save promo codes.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleQuickCreateCode = async (amount) => {
    setError("");
    setSuccessMsg("");
    try {
      const newSlot = buildNewDiscountSlot({
        amount,
        existingSlots: slots,
      });
      const nextSlots = [newSlot, ...slots];
      const ok = await persistSlots(
        nextSlots,
        `Created & activated "${newSlot.label}" (${newSlot.code}) for ₹${newSlot.amount} off.`,
      );
      if (ok) {
        setNewlyCreatedId(newSlot.slotId);
      }
    } catch (err) {
      setError(err?.message || "Could not create promo code.");
    }
  };

  const handleCustomCreateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    try {
      const newSlot = buildNewDiscountSlot({
        label: customLabel,
        amount: customAmount,
        customCode,
        isActive: customActive,
        existingSlots: slots,
      });
      const nextSlots = [newSlot, ...slots];
      const ok = await persistSlots(
        nextSlots,
        `Created promo code "${newSlot.label}" (${newSlot.code}) for ₹${newSlot.amount} off.`,
      );
      if (ok) {
        setNewlyCreatedId(newSlot.slotId);
        setCustomLabel("");
        setCustomCode("");
        setCustomActive(true);
      }
    } catch (err) {
      setError(err?.message || "Could not create promo code.");
    }
  };

  const startEditingSlot = (slot) => {
    setError("");
    setSuccessMsg("");
    setConfirmDeleteId("");
    setEditingSlotId(slot.slotId);
    setEditDraft({
      label: slot.label || "",
      code: slot.code || "",
      amount: String(slot.amount ?? ""),
      isActive: Boolean(slot.isActive),
    });
  };

  const cancelEditingSlot = () => {
    setEditingSlotId("");
    setEditDraft({ label: "", code: "", amount: "", isActive: true });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingSlotId) return;
    setError("");
    setSuccessMsg("");

    try {
      const cleanCode = sanitizePromoCode(editDraft.code);
      if (cleanCode.length < 3) {
        throw new Error("Promo code must be at least 3 characters long.");
      }

      const duplicate = slots.some(
        (s) =>
          s.slotId !== editingSlotId &&
          sanitizePromoCode(s.code) === cleanCode,
      );
      if (duplicate) {
        throw new Error(
          `Promo code "${cleanCode}" already exists. Choose a different code.`,
        );
      }

      const normalizedAmount = normalizeDiscountAmount(editDraft.amount);
      const cleanLabel =
        String(editDraft.label || "").trim().slice(0, 60) ||
        `Promo ₹${normalizedAmount} Off`;

      const nextSlots = slots.map((item) =>
        item.slotId === editingSlotId
          ? {
              ...item,
              label: cleanLabel,
              code: cleanCode,
              amount: normalizedAmount,
              isActive: Boolean(editDraft.isActive),
              note: `₹${normalizedAmount} off`,
            }
          : item,
      );

      const savedId = editingSlotId;
      const ok = await persistSlots(
        nextSlots,
        `Updated "${cleanLabel}" (${cleanCode}) — ₹${normalizedAmount} off.`,
      );
      if (ok) {
        setNewlyCreatedId(savedId);
        cancelEditingSlot();
      }
    } catch (err) {
      setError(err?.message || "Could not update promo code.");
    }
  };

  const handleToggleActive = async (slot) => {
    const nextActive = !slot.isActive;
    const nextSlots = slots.map((item) =>
      item.slotId === slot.slotId ? { ...item, isActive: nextActive } : item,
    );
    await persistSlots(
      nextSlots,
      `Promo "${slot.label}" (${slot.code}) is now ${nextActive ? "active" : "paused"}.`,
    );
  };

  const handleBulkToggleActive = async (nextActive) => {
    if (!slots.length) return;
    const nextSlots = slots.map((item) => ({ ...item, isActive: nextActive }));
    await persistSlots(
      nextSlots,
      nextActive
        ? `Activated all ${nextSlots.length} promo codes.`
        : `Paused all ${nextSlots.length} promo codes.`,
    );
  };

  const handleRegenerateSingleSlot = async (slotId) => {
    const existingCodes = slots
      .filter((s) => s.slotId !== slotId)
      .map((s) => s.code);
    const freshCode = generateSecretDiscountCode(existingCodes);
    const nextSlots = slots.map((item) =>
      item.slotId === slotId ? { ...item, code: freshCode } : item,
    );
    const ok = await persistSlots(
      nextSlots,
      `Generated new code ${freshCode} and synced to checkout.`,
    );
    if (ok) {
      setNewlyCreatedId(slotId);
      if (editingSlotId === slotId) {
        setEditDraft((prev) => ({ ...prev, code: freshCode }));
      }
    }
  };

  const handleDeleteSlot = async (slotId) => {
    const target = slots.find((s) => s.slotId === slotId);
    if (!target) return;
    const nextSlots = slots.filter((s) => s.slotId !== slotId);
    const ok = await persistSlots(
      nextSlots,
      `Deleted promo code "${target.label}" (${target.code}).`,
    );
    if (ok) {
      setConfirmDeleteId("");
      if (editingSlotId === slotId) {
        cancelEditingSlot();
      }
    }
  };

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(""), 1800);
    } catch {
      setError("Clipboard copy failed. Please copy the code manually.");
    }
  };

  const activeCount = useMemo(
    () => slots.filter((s) => s.isActive).length,
    [slots],
  );

  const filteredSlots = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return slots.filter((slot) => {
      if (statusFilter === "active" && !slot.isActive) return false;
      if (statusFilter === "paused" && slot.isActive) return false;
      if (!q) return true;
      return (
        String(slot.label || "").toLowerCase().includes(q) ||
        String(slot.code || "").toLowerCase().includes(q) ||
        String(slot.amount ?? "").includes(q)
      );
    });
  }, [slots, searchQuery, statusFilter]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 font-sans space-y-5 text-[#303030]">
      {/* CREATE / MAKE NEW PROMO CODE */}
      <section
        aria-labelledby="create-promo-heading"
        className="bg-white border border-[#e3e3e3] border-t-[3px] border-t-[#2874F0] rounded-xl p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2
              id="create-promo-heading"
              className="text-base font-bold text-[#212121] flex items-center gap-2">
              <Sparkles size={16} className="text-[#2874F0]" />
              <span>Create Promo Code</span>
              <span className="px-2 py-0.5 rounded bg-[#FFE500] text-[#212121] text-[10px] font-bold uppercase tracking-wider">
                Discounts
              </span>
            </h2>
            <p className="text-xs text-[#616161] mt-0.5">
              Set any discount price (₹), custom promo name, and promo code, or
              use a 1-click quick preset below.
            </p>
          </div>
        </div>

        {/* 1-CLICK QUICK PRESETS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {PRESET_DISCOUNT_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              disabled={loading || saving}
              onClick={() => handleQuickCreateCode(amt)}
              className="flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg border border-[#f5d000] bg-[#FFF8D6] hover:bg-[#FFE500] text-[#594400] hover:text-[#212121] font-bold text-xs transition-colors disabled:opacity-50 shadow-2xs cursor-pointer">
              <Plus size={13} />
              <span>₹{amt} Code</span>
            </button>
          ))}
        </div>

        {/* CUSTOM PROMO BUILDER FORM */}
        <form
          onSubmit={handleCustomCreateSubmit}
          className="pt-4 border-t border-gray-100 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Promo Name */}
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Promo Name
              </label>
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="e.g. Call Offer / Diwali Gift"
                maxLength={60}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-gray-50 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2874F0] focus:bg-white"
              />
            </div>

            {/* Promo Code + Random */}
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Promo Code
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) =>
                    setCustomCode(sanitizePromoCode(e.target.value))
                  }
                  placeholder="e.g. FLAT50 (blank = auto)"
                  maxLength={24}
                  className="flex-1 min-w-0 h-10 px-3 rounded-lg border border-gray-300 bg-gray-50 font-mono text-xs sm:text-sm font-semibold uppercase text-gray-900 placeholder:font-sans placeholder:normal-case placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:border-[#2874F0] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    setCustomCode(
                      generateSecretDiscountCode(slots.map((s) => s.code)),
                    )
                  }
                  className="h-10 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 inline-flex items-center gap-1.5 shrink-0">
                  <RefreshCw size={13} />
                  Random
                </button>
              </div>
            </div>

            {/* Discount Price ₹ */}
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Discount Price (₹)
              </label>
              <div className="relative">
                <IndianRupee
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
                <input
                  type="number"
                  min={MIN_DISCOUNT_AMOUNT}
                  max={MAX_DISCOUNT_AMOUNT}
                  step="1"
                  required
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter price"
                  className="w-full h-10 pl-8 pr-3 rounded-lg border border-gray-300 bg-gray-50 text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:border-[#2874F0] focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={customActive}
                onChange={(e) => setCustomActive(e.target.checked)}
                className="accent-[#2874F0] w-4 h-4"
              />
              Activate immediately at checkout
            </label>

            <button
              type="submit"
              disabled={loading || saving}
              className="h-10 px-5 rounded-lg bg-[#2874F0] hover:bg-[#1e5fd0] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition shadow-xs">
              <Plus size={15} />
              {saving ? "Saving..." : "Create Promo Code"}
            </button>
          </div>
        </form>
      </section>

      {/* FEEDBACK BANNERS */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs sm:text-sm text-red-700 font-medium flex items-center justify-between gap-2">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
            className="text-red-500 hover:text-red-800 p-1">
            <X size={14} />
          </button>
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs sm:text-sm text-emerald-700 font-medium flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Check size={16} />
            <span>{successMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg("")}
            aria-label="Dismiss message"
            className="text-emerald-600 hover:text-emerald-900 p-1">
            <X size={14} />
          </button>
        </div>
      )}

      {/* FILTER / SEARCH / BULK ACTIONS BAR */}
      {!loading && slots.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-gray-900">
              Promo Codes ({slots.length})
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {activeCount} Active
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {slots.length - activeCount} Paused
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, code, ₹..."
                className="h-8 pl-8 pr-3 w-full sm:w-48 rounded-lg border border-gray-300 bg-gray-50 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2874F0] focus:bg-white"
              />
            </div>

            {/* Filter Pills */}
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
              {["all", "active", "paused"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition ${
                    statusFilter === tab
                      ? "bg-white text-[#2874F0] shadow-2xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Bulk Enable / Pause */}
            <button
              type="button"
              disabled={saving || activeCount === slots.length}
              onClick={() => handleBulkToggleActive(true)}
              className="h-8 px-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[11px] font-semibold text-gray-700 disabled:opacity-40">
              Enable All
            </button>
            <button
              type="button"
              disabled={saving || activeCount === 0}
              onClick={() => handleBulkToggleActive(false)}
              className="h-8 px-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[11px] font-semibold text-gray-700 disabled:opacity-40">
              Pause All
            </button>
          </div>
        </div>
      )}

      {/* PROMO CODES LIST */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-sm text-gray-500">
          Loading promo codes...
        </div>
      ) : slots.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-sm text-gray-500">
          No promo codes created yet. Use the{" "}
          <strong className="text-gray-800">Create Promo Code</strong> form or
          quick buttons above to add one.
        </div>
      ) : filteredSlots.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-sm text-gray-500">
          No promo codes match your search or filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSlots.map((slot, idx) => {
            const isEditing = editingSlotId === slot.slotId;
            const isHighlighted = newlyCreatedId === slot.slotId;
            const isConfirmingDelete = confirmDeleteId === slot.slotId;
            const codeKey = `code-${slot.slotId}`;
            const msgKey = `msg-${slot.slotId}`;
            const whatsappMsg = `Hi! You can apply promo code ${slot.code} (${slot.label}) at checkout on gharkaorganic.com to get ₹${slot.amount} off your order.`;

            if (isEditing) {
              return (
                <form
                  key={slot.slotId}
                  onSubmit={handleSaveEdit}
                  className="bg-blue-50/40 border-2 border-[#2874F0] rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2874F0] flex items-center gap-1.5">
                      <Pencil size={13} />
                      Editing Promo Code #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={cancelEditingSlot}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-800 inline-flex items-center gap-1">
                      <X size={14} /> Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Edit Name */}
                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                        Promo Name
                      </label>
                      <input
                        type="text"
                        value={editDraft.label}
                        onChange={(e) =>
                          setEditDraft((prev) => ({
                            ...prev,
                            label: e.target.value,
                          }))
                        }
                        placeholder="Promo name"
                        maxLength={60}
                        className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2874F0]"
                      />
                    </div>

                    {/* Edit Code + Random */}
                    <div className="sm:col-span-5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                        Promo Code
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          required
                          value={editDraft.code}
                          onChange={(e) =>
                            setEditDraft((prev) => ({
                              ...prev,
                              code: sanitizePromoCode(e.target.value),
                            }))
                          }
                          maxLength={24}
                          className="flex-1 min-w-0 h-10 px-3 rounded-lg border border-gray-300 bg-white font-mono text-xs sm:text-sm font-bold tracking-wider uppercase text-gray-900 focus:outline-none focus:border-[#2874F0]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setEditDraft((prev) => ({
                              ...prev,
                              code: generateSecretDiscountCode(
                                slots
                                  .filter((s) => s.slotId !== slot.slotId)
                                  .map((s) => s.code),
                              ),
                            }))
                          }
                          className="h-10 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 inline-flex items-center gap-1 shrink-0">
                          <RefreshCw size={13} />
                          Random
                        </button>
                      </div>
                    </div>

                    {/* Edit Price ₹ */}
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                        Discount Price (₹)
                      </label>
                      <div className="relative">
                        <IndianRupee
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                        <input
                          type="number"
                          required
                          min={MIN_DISCOUNT_AMOUNT}
                          max={MAX_DISCOUNT_AMOUNT}
                          step="1"
                          value={editDraft.amount}
                          onChange={(e) =>
                            setEditDraft((prev) => ({
                              ...prev,
                              amount: e.target.value,
                            }))
                          }
                          className="w-full h-10 pl-8 pr-3 rounded-lg border border-gray-300 bg-white text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:border-[#2874F0]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick price chips + Active toggle + Save/Cancel */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-gray-500 mr-1">
                        Quick set price:
                      </span>
                      {PRESET_DISCOUNT_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() =>
                            setEditDraft((prev) => ({
                              ...prev,
                              amount: String(amt),
                            }))
                          }
                          className={`px-2 py-1 rounded text-[11px] font-bold border transition ${
                            Number(editDraft.amount) === amt
                              ? "bg-[#2874F0] text-white border-[#2874F0]"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}>
                          ₹{amt}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 ml-auto">
                      <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={Boolean(editDraft.isActive)}
                          onChange={(e) =>
                            setEditDraft((prev) => ({
                              ...prev,
                              isActive: e.target.checked,
                            }))
                          }
                          className="accent-[#2874F0] w-4 h-4"
                        />
                        Active
                      </label>

                      <button
                        type="button"
                        onClick={cancelEditingSlot}
                        className="h-9 px-3.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700">
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={saving}
                        className="h-9 px-4 rounded-lg bg-[#2874F0] hover:bg-[#1e5fd0] disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1.5">
                        <Save size={13} />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </form>
              );
            }

            return (
              <div
                key={slot.slotId}
                className={`bg-white border rounded-xl p-4 sm:p-5 shadow-2xs transition-colors ${
                  isHighlighted
                    ? "border-emerald-400 ring-1 ring-emerald-200"
                    : "border-gray-200"
                }`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* LEFT INFO: Name, Price, Status */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-[#2874F0] flex items-center justify-center shrink-0 font-bold text-sm">
                      #{idx + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-gray-900 truncate">
                          {slot.label || `Promo ${idx + 1}`}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF8D6] border border-[#FFE500] px-2.5 py-0.5 text-[11px] font-bold text-[#6b4800]">
                          <Tag size={11} />₹{slot.amount} OFF
                        </span>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => handleToggleActive(slot)}
                          title="Click to toggle active or paused"
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition ${
                            slot.isActive
                              ? "bg-[#eaf2ff] text-[#2874F0] hover:bg-blue-100"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}>
                          {slot.isActive ? "Active" : "Paused"}
                        </button>
                        {isHighlighted && (
                          <span className="rounded-full bg-[#FFE500] text-[#212121] px-2 py-0.5 text-[10px] font-bold uppercase">
                            Ready to Share
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Gives ₹{slot.amount} off at checkout. Share code on call
                        or WhatsApp.
                      </p>
                    </div>
                  </div>

                  {/* RIGHT ACTIONS */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Code Display Pill */}
                    <div className="h-9 px-3 rounded-lg border border-gray-300 bg-gray-50 font-mono text-sm font-bold tracking-wider text-gray-900 uppercase inline-flex items-center select-all">
                      {slot.code}
                    </div>

                    {/* Edit Name / Code / Price */}
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => startEditingSlot(slot)}
                      title="Edit promo name, code, or price"
                      className="h-9 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-800 inline-flex items-center gap-1.5 disabled:opacity-50">
                      <Pencil size={13} />
                      <span>Edit</span>
                    </button>

                    {/* Quick Randomize Code */}
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleRegenerateSingleSlot(slot.slotId)}
                      title="Generate a fresh new random code"
                      className="h-9 px-2.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#2874F0] text-xs font-semibold inline-flex items-center gap-1 disabled:opacity-50">
                      <RefreshCw size={12} />
                      <span>New Code</span>
                    </button>

                    {/* Copy Code */}
                    <button
                      type="button"
                      onClick={() => handleCopy(slot.code, codeKey)}
                      className="h-9 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-800 inline-flex items-center gap-1.5">
                      {copiedKey === codeKey ? (
                        <>
                          <Check size={13} className="text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* Copy WhatsApp Message */}
                    <button
                      type="button"
                      onClick={() => handleCopy(whatsappMsg, msgKey)}
                      className="h-9 px-3 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 inline-flex items-center gap-1.5">
                      {copiedKey === msgKey ? (
                        <>
                          <Check size={13} />
                          <span>WA Copied</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle size={13} />
                          <span>WhatsApp</span>
                        </>
                      )}
                    </button>

                    {/* Delete with Inline Confirmation */}
                    {isConfirmingDelete ? (
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => handleDeleteSlot(slot.slotId)}
                          className="h-9 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold disabled:opacity-50">
                          Confirm Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId("")}
                          className="h-9 px-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => setConfirmDeleteId(slot.slotId)}
                        title="Delete promo code"
                        aria-label={`Delete promo code ${slot.code}`}
                        className="h-9 px-2.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-600 inline-flex items-center justify-center disabled:opacity-50">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminDiscountCodesPage;
