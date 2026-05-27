// ─────────────────────────────────────────────
// INDEXEDDB STORAGE
// Stores: chat messages + validated pincode addresses
// ─────────────────────────────────────────────

const DB_NAME = "GharKaBotDB";
const DB_VERSION = 2; // bumped to add pincodeAddresses store
let db = null;

export const initDB = () =>
  new Promise((resolve, reject) => {
    if (db) return resolve(db);
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const database = e.target.result;

      // Chat messages store
      if (!database.objectStoreNames.contains("messages")) {
        const store = database.createObjectStore("messages", { keyPath: "id" });
        store.createIndex("date", "date", { unique: false });
      }

      // Pincode address store
      if (!database.objectStoreNames.contains("pincodeAddresses")) {
        database.createObjectStore("pincodeAddresses", { keyPath: "pincode" });
      }
    };

    req.onsuccess = (e) => {
      db = e.target.result;
      resolve(db);
    };
    req.onerror = () => reject(req.error);
  });

// ─── MESSAGES ───────────────────────────────

export const saveMessage = async (msg) => {
  await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("messages", "readwrite");
    tx.objectStore("messages").put(msg);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const getMessages = async () => {
  await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("messages", "readonly");
    const req = tx.objectStore("messages").getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
};

export const clearAllMessages = async () => {
  await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("messages", "readwrite");
    tx.objectStore("messages").clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

/** Remove messages older than 7 days */
export const cleanOldMessages = async () => {
  await initDB();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);

  return new Promise((resolve, reject) => {
    const tx = db.transaction("messages", "readwrite");
    const store = tx.objectStore("messages");
    const req = store.openCursor();

    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (!cursor) return;
      try {
        const msgDate = new Date(cursor.value.date);
        if (msgDate < cutoff) cursor.delete();
      } catch (_) {}
      cursor.continue();
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

// ─── PINCODE ADDRESSES ───────────────────────

/**
 * Save a validated pincode address to IndexedDB
 * @param {Object} addressData - { pincode, district, state, postOffices, ... }
 */
export const savePincodeAddress = async (addressData) => {
  await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("pincodeAddresses", "readwrite");
    tx.objectStore("pincodeAddresses").put({
      ...addressData,
      savedAt: new Date().toISOString(),
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

/**
 * Get a saved pincode address from IndexedDB
 * @param {string} pincode
 * @returns {Object|null}
 */
export const getPincodeAddress = async (pincode) => {
  await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("pincodeAddresses", "readonly");
    const req = tx.objectStore("pincodeAddresses").get(pincode);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
};

/**
 * Get all saved pincode addresses
 * @returns {Array}
 */
export const getAllPincodeAddresses = async () => {
  await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("pincodeAddresses", "readonly");
    const req = tx.objectStore("pincodeAddresses").getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
};

/**
 * Delete a saved pincode address
 * @param {string} pincode
 */
export const deletePincodeAddress = async (pincode) => {
  await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("pincodeAddresses", "readwrite");
    tx.objectStore("pincodeAddresses").delete(pincode);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};