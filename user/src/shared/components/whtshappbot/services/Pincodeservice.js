// ─────────────────────────────────────────────
// PINCODE SERVICE — 3-API fallback chain
//
// Priority:
//  1. postpincode.in   — free, valid SSL, different response shape
//  2. pincode.vercel.app — community mirror, postalpincode.in shape
//  3. postal.mojoasset.com — secondary mirror, postalpincode.in shape
//
// All results cached in IndexedDB via chatStorage.
// ─────────────────────────────────────────────

import { savePincodeAddress, getPincodeAddress } from "./chatStorage";

const TIMEOUT_MS = 8000;
const signal = () => AbortSignal.timeout(TIMEOUT_MS);

// ─────────────────────────────────────────────
// PARSER A — postpincode.in shape
// Response: { status: "success", data: { pincode, statename, districtname, ... , postoffices: [...] } }
// ─────────────────────────────────────────────
const parsePostPincode = (json) => {
  // can return array or object
  const data = Array.isArray(json) ? json[0] : json;
  if (!data || data.status !== "success" || !data.data) return null;

  const d        = data.data;
  const offices  = Array.isArray(d.postoffices) ? d.postoffices : [];
  const primary  = offices.find((o) => o.deliverystatus === "Delivery") ?? offices[0] ?? {};

  return {
    valid:     true,
    district:  d.districtname  || primary.districtname  || "",
    division:  d.divisionname  || primary.divisionname  || "",
    region:    d.regionname    || primary.regionname    || "",
    state:     d.statename     || primary.statename     || "",
    circle:    d.circlename    || primary.circlename    || "",
    country:   "India",
    totalCount: offices.length || 1,
    postOffices: offices.map((o) => ({
      name:           o.officename     || o.name           || "",
      branchType:     o.officetype     || o.branchtype     || "",
      deliveryStatus: o.deliverystatus || o.deliverystatus || "",
    })),
    primaryPostOffice: {
      name:           primary.officename     || primary.name     || "",
      branchType:     primary.officetype     || primary.branchType || "",
      deliveryStatus: primary.deliverystatus || "",
    },
  };
};

// ─────────────────────────────────────────────
// PARSER B — postalpincode.in shape (used by vercel + mojoasset mirrors)
// Response: [{ Status: "Success", PostOffice: [...] }]
// ─────────────────────────────────────────────
const parsePostalPincode = (json) => {
  const data    = Array.isArray(json) ? json[0] : json;
  if (!data || data.Status === "Error" || !data.PostOffice?.length) return null;

  const offices = data.PostOffice;
  const primary = offices.find((o) => o.DeliveryStatus === "Delivery") ?? offices[0];

  return {
    valid:     true,
    district:  primary.District  || "",
    division:  primary.Division  || "",
    region:    primary.Region    || "",
    state:     primary.State     || "",
    circle:    primary.Circle    || "",
    country:   primary.Country   || "India",
    totalCount: offices.length,
    postOffices: offices.map((o) => ({
      name:           o.Name,
      branchType:     o.BranchType,
      deliveryStatus: o.DeliveryStatus,
    })),
    primaryPostOffice: {
      name:           primary.Name,
      branchType:     primary.BranchType,
      deliveryStatus: primary.DeliveryStatus,
    },
  };
};

// ─────────────────────────────────────────────
// API CHAIN
// Each entry: { url, parser }
// ─────────────────────────────────────────────
const APIS = [
  {
    name:   "postpincode.in",
    url:    (pin) => `https://www.postpincode.in/api/v1/pincode/${pin}`,
    parser: parsePostPincode,
  },
  {
    name:   "pincode.vercel.app",
    url:    (pin) => `https://pincode.vercel.app/${pin}`,
    parser: parsePostalPincode,
  },
  {
    name:   "postal.mojoasset.com",
    url:    (pin) => `https://postal.mojoasset.com/pin/${pin}`,
    parser: parsePostalPincode,
  },
];

/**
 * Try each API in priority order.
 * Returns a normalised result object or throws if all fail.
 */
const fetchFromChain = async (pincode) => {
  const errors = [];

  for (const api of APIS) {
    try {
      const res = await fetch(api.url(pincode), {
        method:  "GET",
        headers: { Accept: "application/json" },
        signal:  signal(),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json   = await res.json();
      const parsed = api.parser(json);

      if (parsed === null) {
        // API responded but pincode not found — definitive answer
        return { found: false };
      }

      return { found: true, result: parsed };
    } catch (err) {
      errors.push(`[${api.name}] ${err.message}`);
      // Try next API
    }
  }

  throw new Error(`All pincode APIs failed:\n${errors.join("\n")}`);
};

// ─────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────

/**
 * Fetch pincode details with cache + 3-API fallback.
 *
 * @param {string} pincode
 * @returns {Promise<PincodeResult>}
 */
export const fetchPincodeDetails = async (pincode) => {
  const clean = String(pincode).replace(/\D/g, "").slice(0, 6);

  if (clean.length !== 6) {
    return { valid: false, pincode: clean, error: "Please enter a valid 6-digit pincode." };
  }

  // ── 1. IndexedDB cache ───────────────────
  try {
    const cached = await getPincodeAddress(clean);
    if (cached?.valid) return { ...cached, fromCache: true };
  } catch (_) {}

  // ── 2. API chain ─────────────────────────
  try {
    const { found, result } = await fetchFromChain(clean);

    if (!found) {
      return {
        valid:   false,
        pincode: clean,
        error:   "No post office found for this pincode. Please double-check the number.",
      };
    }

    const final = { ...result, pincode: clean };

    // ── 3. Cache ─────────────────────────
    try { await savePincodeAddress(final); } catch (_) {}

    return final;
  } catch (err) {
    console.error("[PincodeService]", err.message);
    return {
      valid:   false,
      pincode: clean,
      error:   "Couldn't reach the pincode service right now. Please try again shortly.",
    };
  }
};

/**
 * Format pincode details into a single readable address string.
 * @param {Object} details
 * @returns {string}
 */
export const formatPincodeAddress = (details) => {
  if (!details?.valid) return "";
  return [
    details.primaryPostOffice?.name,
    details.district,
    details.division,
    details.state,
    details.pincode,
  ]
    .filter(Boolean)
    .join(", ");
};

/**
 * Build a checkout-ready address object from pincode details.
 * @param {Object} details
 * @returns {Object}
 */
export const buildAddressFromPincode = (details) => ({
  pincode:     details.pincode,
  city:        details.district,
  state:       details.state,
  region:      details.region,
  district:    details.district,
  division:    details.division,
  postOffice:  details.primaryPostOffice?.name || "",
  country:     details.country || "India",
  fullAddress: formatPincodeAddress(details),
});

/**
 * Search post offices by branch name.
 * Falls back across the chain automatically.
 * @param {string} branchName
 * @returns {Promise<Array>}
 */
export const searchPostOfficeByName = async (branchName) => {
  const name = encodeURIComponent(branchName.trim());
  const urls = [
    `https://pincode.vercel.app/postoffice/${name}`,
    `https://postal.mojoasset.com/postoffice/${name}`,
  ];

  for (const url of urls) {
    try {
      const res  = await fetch(url, { signal: signal() });
      if (!res.ok) continue;
      const json = await res.json();
      const data = Array.isArray(json) ? json[0] : json;
      if (data?.PostOffice?.length) return data.PostOffice;
    } catch (_) {}
  }

  return [];
};