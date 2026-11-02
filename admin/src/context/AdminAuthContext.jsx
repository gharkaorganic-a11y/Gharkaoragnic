import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { auth, db } from "../config/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AdminAuthContext = createContext();

// ── Constants ──
const STORAGE_KEY = "gharkaorganic_admin_token";
const REVALIDATE_MS = 60 * 60 * 1000; // 1 hour

// ── Cache helpers ──
const readCache = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  const safe = { ...data };
  ["createdAt", "updatedAt"].forEach((k) => {
    if (safe[k]?.seconds)
      safe[k] = new Date(safe[k].seconds * 1000).toISOString();
  });
  safe.syncedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  return safe;
};

const isCacheStale = (cached) => {
  if (!cached?.syncedAt) return true;
  return Date.now() - new Date(cached.syncedAt).getTime() > REVALIDATE_MS;
};

// ── Provider ──
export const AdminAuthProvider = ({ children }) => {
  const cached = readCache();
  const [admin, setAdmin] = useState(cached ?? null);
  const [loading, setLoading] = useState(!cached);
  const [isAuthorized, setIsAuthorized] = useState(!!cached);

  const lastVerifiedUid = useRef(cached?.uid ?? null);

  // ── Observe auth state ──
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        clearSession();
        setLoading(false);
        return;
      }

      const currentCache = readCache();

      if (
        currentCache &&
        currentCache.uid === firebaseUser.uid &&
        !isCacheStale(currentCache) &&
        lastVerifiedUid.current === firebaseUser.uid
      ) {
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));

        if (!snap.exists() || !snap.data().isAdmin || snap.data().isBlocked) {
          await signOut(auth);
          clearSession();
          setLoading(false);
          return;
        }

        const freshData = writeCache({ uid: firebaseUser.uid, ...snap.data() });
        lastVerifiedUid.current = firebaseUser.uid;
        setAdmin(freshData);
        setIsAuthorized(true);
      } catch (err) {
        console.error("Admin verification failed:", err);
        if (!currentCache) clearSession();
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY);
    lastVerifiedUid.current = null;
    setAdmin(null);
    setIsAuthorized(false);
  };

  // ── Admin login ──
  const login = async (email, password) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "users", cred.user.uid));

      if (!snap.exists()) {
        await signOut(auth);
        clearSession();
        throw new Error(
          `No admin profile found. Create Firestore document users/${cred.user.uid}.`,
        );
      }

      const userData = snap.data();
      if (userData.isAdmin !== true) {
        await signOut(auth);
        clearSession();
        throw new Error(
          "This account is not an admin. Set isAdmin to boolean true in its Firestore users document.",
        );
      }

      if (userData.isBlocked === true) {
        await signOut(auth);
        clearSession();
        throw new Error("This admin account is blocked. Set isBlocked to false.");
      }

      const data = writeCache({ uid: cred.user.uid, ...userData });
      setAdmin(data);
      setIsAuthorized(true);
      lastVerifiedUid.current = cred.user.uid;
    } finally {
      setLoading(false);
    }
  };

  // ── Admin logout ──
  const logout = async () => {
    await signOut(auth);
    clearSession();
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthorized,
        loading,
        login,
        logout,
      }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context)
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return context;
};
