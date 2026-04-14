import {
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../../config/firebaseDB";
import { productSections } from "../../homepage/config/productCollection";

export const copyFirestoreData = async ({
  sourceCollection,
  targetCollection,
}) => {
  try {
    const snapshot = await getDocs(
      collection(db, sourceCollection)
    );

    if (snapshot.empty) {
      console.log("No data found");
      return false;
    }

    snapshot.forEach(async (item) => {
      const data = item.data();

      // ----------------------------
      // SIMPLE 1-TO-1 CATEGORY PICK
      // ----------------------------
      let assignedKey = "uncategorized";

      for (let section of productSections) {
        const key = section.key.toLowerCase();

        if (
          (data.name || "").toLowerCase().includes(key) ||
          (data.title || "").toLowerCase().includes(key)
        ) {
          assignedKey = section.key;
          break; // ⚡ only first match (important)
        }
      }

      // ----------------------------
      // CREATE NEW DOC WITH NEW ID
      // ----------------------------
      const newDocRef = doc(collection(db, targetCollection));

      await setDoc(newDocRef, {
        ...data,
        collectionTypes: [assignedKey], // ✅ ONLY ONE VALUE
      });
    });

    console.log("✅ Temporary copy done (1 collection per product)");
    return true;
  } catch (error) {
    console.error("❌ Copy failed:", error.message);
    return false;
  }
};