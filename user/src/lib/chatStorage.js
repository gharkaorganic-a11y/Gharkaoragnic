const DB_NAME = "chat-db";
const STORE_NAME = "messages";
const DB_VERSION = 1;

let db;

/* Open DB */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      db = e.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });

        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };

    request.onsuccess = (e) => {
      db = e.target.result;
      resolve(db);
    };

    request.onerror = () => reject("DB error");
  });
};

/* Save message */
export const saveMessage = (message) => {
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  store.put({
    ...message,
    timestamp: Date.now(),
  });
};

/* Get all messages */
export const getMessages = () => {
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    const req = store.getAll();

    req.onsuccess = () => resolve(req.result || []);
  });
};

/* Delete old messages (15 days) */
export const cleanOldMessages = () => {
  const limit = Date.now() - 15 * 24 * 60 * 60 * 1000;

  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  const req = store.getAll();

  req.onsuccess = () => {
    req.result.forEach((msg) => {
      if (msg.timestamp < limit) {
        store.delete(msg.id);
      }
    });
  };
};

/* Clear all messages (For Logout/Reset) */
export const clearAllMessages = () => {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.warn("DB not initialized, skipping clear.");
      return resolve(); 
    }
    
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.clear();

    req.onsuccess = () => resolve();
    req.onerror = (e) => reject("Failed to clear DB: ", e);
  });
};