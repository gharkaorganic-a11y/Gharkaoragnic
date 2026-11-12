import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../config/firebase";

const CODE_SALT = "GHARKA_PRIVATE_DISC_V1:";
export const MIN_DISCOUNT_AMOUNT = 1;
export const MAX_DISCOUNT_AMOUNT = 50000;
export const PRESET_DISCOUNT_AMOUNTS = [10, 20, 30, 40, 50, 100];

export function sanitizePromoCode(rawCode = "") {
  return String(rawCode || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 24);
}

export function isValidDiscountAmount(value) {
  const num = Number(value);
  return (
    Number.isFinite(num) &&
    num >= MIN_DISCOUNT_AMOUNT &&
    num <= MAX_DISCOUNT_AMOUNT
  );
}

export function normalizeDiscountAmount(value) {
  if (!isValidDiscountAmount(value)) {
    throw new Error(
      `Discount price must be between ₹${MIN_DISCOUNT_AMOUNT} and ₹${MAX_DISCOUNT_AMOUNT}.`,
    );
  }
  return Math.round(Number(value) * 100) / 100;
}

export const DEFAULT_DISCOUNT_SLOTS = [
  {
    slotId: "slot-1",
    label: "Code 1",
    code: "GKA7N4P9",
    amount: 10,
    isActive: true,
    note: "₹10 off",
  },
  {
    slotId: "slot-2",
    label: "Code 2",
    code: "GKB8M3W6",
    amount: 20,
    isActive: true,
    note: "₹20 off (A)",
  },
  {
    slotId: "slot-3",
    label: "Code 3",
    code: "GKC5R9T2",
    amount: 20,
    isActive: true,
    note: "₹20 off (B)",
  },
  {
    slotId: "slot-4",
    label: "Code 4",
    code: "GKD4V7H8",
    amount: 30,
    isActive: true,
    note: "₹30 off",
  },
  {
    slotId: "slot-5",
    label: "Code 5",
    code: "GKE6Y2K5",
    amount: 40,
    isActive: true,
    note: "₹40 off",
  },
];

const SHA256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
  0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
  0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

const rotr = (n, x) => (x >>> n) | (x << (32 - n));

function sha256Hex(message) {
  const bytes = new TextEncoder().encode(message);
  const bitLen = bytes.length * 8;
  const paddedLen = Math.ceil((bytes.length + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLen);
  padded.set(bytes);
  padded[bytes.length] = 0x80;

  const view = new DataView(padded.buffer);
  view.setUint32(paddedLen - 8, Math.floor(bitLen / 0x100000000), false);
  view.setUint32(paddedLen - 4, bitLen >>> 0, false);

  const H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
    0x1f83d9ab, 0x5be0cd19,
  ];
  const W = new Uint32Array(64);

  for (let offset = 0; offset < paddedLen; offset += 64) {
    for (let i = 0; i < 16; i += 1) {
      W[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i += 1) {
      const s0 = rotr(7, W[i - 15]) ^ rotr(18, W[i - 15]) ^ (W[i - 15] >>> 3);
      const s1 = rotr(17, W[i - 2]) ^ rotr(19, W[i - 2]) ^ (W[i - 2] >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
    }

    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i += 1) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + SHA256_K[i] + W[i]) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
    H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0;
    H[7] = (H[7] + h) >>> 0;
  }

  return H.map((val) => val.toString(16).padStart(8, "0")).join("");
}

export function hashDiscountCode(rawCode = "") {
  const cleanCode = String(rawCode).trim().toUpperCase();
  if (!cleanCode) return "";
  return sha256Hex(`${CODE_SALT}${cleanCode}`);
}

export function generateSecretDiscountCode(existingCodes = []) {
  const existingSet = new Set(
    existingCodes.map((c) => String(c || "").trim().toUpperCase()),
  );
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    const candidate = Array.from(
      bytes,
      (b) => alphabet[b % alphabet.length],
    ).join("");
    if (!existingSet.has(candidate)) {
      return candidate;
    }
  }
  return `GK${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export function buildNewDiscountSlot({
  label = "",
  amount,
  customCode = "",
  isActive = true,
  existingSlots = [],
}) {
  const numericAmount = normalizeDiscountAmount(amount);
  const existingCodes = existingSlots.map((s) => sanitizePromoCode(s.code));
  const cleanCustom = sanitizePromoCode(customCode);
  const finalCode = cleanCustom || generateSecretDiscountCode(existingCodes);

  if (finalCode.length < 3) {
    throw new Error("Promo code must be at least 3 characters long.");
  }

  if (existingCodes.includes(finalCode)) {
    throw new Error("That promo code already exists. Please use a unique code.");
  }

  const cleanLabel = String(label || "").trim().slice(0, 60);
  const minSortOrder = existingSlots.reduce(
    (minVal, s, idx) => Math.min(minVal, Number(s.sortOrder ?? idx)),
    0,
  );

  return {
    slotId: `code-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 6)}`,
    label: cleanLabel || `Promo ₹${numericAmount} Off`,
    code: finalCode,
    amount: numericAmount,
    isActive: Boolean(isActive),
    note: `₹${numericAmount} off`,
    sortOrder: minSortOrder - 1,
    createdAtMs: Date.now(),
  };
}

export async function syncDiscountSlotsToFirestore(slots) {
  const seenCodes = new Set();
  const normalizedSlots = slots.map((slot, index) => {
    const cleanCode = sanitizePromoCode(slot.code);
    if (cleanCode.length < 3) {
      throw new Error("Each promo code must be at least 3 characters long.");
    }
    if (seenCodes.has(cleanCode)) {
      throw new Error(`Duplicate promo code "${cleanCode}". Codes must be unique.`);
    }
    seenCodes.add(cleanCode);

    const amount = normalizeDiscountAmount(slot.amount);
    const cleanLabel = String(slot.label || "").trim().slice(0, 60);

    return {
      ...slot,
      label: cleanLabel || `Promo ${index + 1}`,
      code: cleanCode,
      codeHash: hashDiscountCode(cleanCode),
      amount,
      isActive: Boolean(slot.isActive),
      note: `₹${amount} off`,
      sortOrder: Number.isFinite(Number(slot.sortOrder))
        ? Number(slot.sortOrder)
        : index,
      createdAtMs: Number(slot.createdAtMs) || Date.now(),
    };
  });

  const now = serverTimestamp();
  const batch = writeBatch(db);

  const [existingAdminSnap, existingHashSnap] = await Promise.all([
    getDocs(collection(db, "adminDiscountCodes")),
    getDocs(collection(db, "discountCodeHashes")),
  ]);

  const nextSlotIds = new Set();
  const nextHashIds = new Set();

  normalizedSlots.forEach((slot) => {
    nextSlotIds.add(slot.slotId);
    nextHashIds.add(slot.codeHash);

    batch.set(doc(db, "adminDiscountCodes", slot.slotId), {
      slotId: slot.slotId,
      label: slot.label,
      code: slot.code,
      codeHash: slot.codeHash,
      amount: slot.amount,
      isActive: slot.isActive,
      note: slot.note,
      sortOrder: slot.sortOrder,
      createdAtMs: slot.createdAtMs,
      updatedAt: now,
    });

    batch.set(doc(db, "discountCodeHashes", slot.codeHash), {
      slotId: slot.slotId,
      amount: slot.amount,
      isActive: slot.isActive,
      updatedAt: now,
    });
  });

  existingAdminSnap.forEach((oldDoc) => {
    if (!nextSlotIds.has(oldDoc.id)) {
      batch.delete(oldDoc.ref);
    }
  });

  existingHashSnap.forEach((oldDoc) => {
    if (!nextHashIds.has(oldDoc.id)) {
      batch.delete(oldDoc.ref);
    }
  });

  batch.set(doc(db, "discountCodeConfig", "state"), {
    initialized: true,
    updatedAt: now,
  });

  await batch.commit();
  return normalizedSlots;
}

export const adminDiscountService = {
  async getAllDiscountCodes() {
    const snap = await getDocs(collection(db, "adminDiscountCodes"));
    if (snap.empty) {
      const seeded = DEFAULT_DISCOUNT_SLOTS.map((slot, index) => ({
        ...slot,
        sortOrder: index,
        codeHash: hashDiscountCode(slot.code),
      }));
      return syncDiscountSlotsToFirestore(seeded);
    }

    const slots = snap.docs.map((d, index) => {
      const data = d.data();
      const numericAmount = isValidDiscountAmount(data.amount)
        ? Math.round(Number(data.amount) * 100) / 100
        : 10;
      const cleanCode = sanitizePromoCode(data.code || "");
      return {
        slotId: d.id,
        label: String(data.label || "").trim() || `Promo ${index + 1}`,
        code: cleanCode,
        codeHash: data.codeHash || hashDiscountCode(cleanCode),
        amount: numericAmount,
        isActive: data.isActive !== false,
        note: `₹${numericAmount} off`,
        sortOrder: Number.isFinite(Number(data.sortOrder))
          ? Number(data.sortOrder)
          : index,
        createdAtMs: Number(data.createdAtMs) || 0,
      };
    });

    return slots.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async saveAllDiscountCodes(slots) {
    return syncDiscountSlotsToFirestore(slots);
  },
};
