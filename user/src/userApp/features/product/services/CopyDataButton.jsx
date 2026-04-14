import React, { useState } from "react";
import { copyFirestoreData } from "./copyFirestoreData";

const CopyDataButton = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleCopy = async () => {
    setLoading(true);
    setStatus("Copying...");

    const success = await copyFirestoreData({
      mode: "collection",
      sourceCollection: "products",
      targetCollection: "products",
    });

    if (success) {
      setStatus("✅ Copy completed successfully!");
    } else {
      setStatus("❌ Copy failed!");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleCopy}
        disabled={loading}
        className="px-5 py-2 bg-green-700 text-white text-sm hover:bg-green-800 disabled:opacity-50">
        {loading ? "Copying..." : "Copy Reviews to Backup"}
      </button>

      {status && <p className="text-xs text-gray-600">{status}</p>}
    </div>
  );
};

export default CopyDataButton;
