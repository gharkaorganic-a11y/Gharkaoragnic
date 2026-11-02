import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { ColorInput } from "../components/input/homepage_input/ColorInput";

const DEFAULT_DESIGN = {
  bodyFont: "Arial, Helvetica, sans-serif",
  headingFont: "Arial, Helvetica, sans-serif",
  baseFontSize: 16,
  headingColor: "#263329",
  textColor: "#263329",
  mutedTextColor: "#687267",
  priceColor: "#263329",
  reviewColor: "#687267",
  starColor: "#f5a623",
  buttonColor: "#009f68",
  buttonTextColor: "#ffffff",
  categoryColor: "#009f68",
  announcementColor: "#dda323",
};

const SETTINGS_REF = doc(db, "storeSettings", "storefrontDesign");

const StorefrontDesignPage = () => {
  const [design, setDesign] = useState(DEFAULT_DESIGN);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    getDoc(SETTINGS_REF)
      .then((snapshot) => {
        if (active && snapshot.exists()) {
          setDesign({ ...DEFAULT_DESIGN, ...snapshot.data() });
        }
      })
      .catch((loadError) => {
        console.error("Failed to load storefront design settings:", loadError);
        if (active) setError("Could not load design settings. Please retry.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const update = (key, value) => {
    setDesign((current) => ({ ...current, [key]: value }));
    setNotice("");
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const colorFields = Object.keys(DEFAULT_DESIGN).filter(
        (key) =>
          key !== "bodyFont" &&
          key !== "headingFont" &&
          key !== "baseFontSize",
      );
      if (
        colorFields.some((key) => !/^#[\da-f]{6}$/i.test(design[key])) ||
        !Number.isFinite(Number(design.baseFontSize)) ||
        design.baseFontSize < 14 ||
        design.baseFontSize > 20
      ) {
        setError("Enter valid 6-digit hex colors and a text size from 14–20px.");
        setSaving(false);
        return;
      }

      await setDoc(
        SETTINGS_REF,
        { ...design, updatedAt: serverTimestamp() },
        { merge: true },
      );
      setNotice("Storefront design saved.");
    } catch (saveError) {
      console.error("Failed to save storefront design settings:", saveError);
      setError("Could not save design settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setDesign(DEFAULT_DESIGN);
    setNotice("");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-gray-600">
        Loading storefront design settings…
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2874F0]">
          Store appearance
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
          Storefront design
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Set global fonts and colors for the storefront, including product
          names, descriptions, prices, review stars, category shortcuts, and
          cart buttons.
        </p>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {notice}
        </p>
      )}

      <form onSubmit={save} className="space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">Typography</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-gray-700">
              Body font
              <select
                value={design.bodyFont}
                onChange={(event) => update("bodyFont", event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5">
                <option value="Arial, Helvetica, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Verdana, sans-serif">Verdana</option>
                <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
                <option value="system-ui, sans-serif">System UI</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Heading font
              <select
                value={design.headingFont}
                onChange={(event) => update("headingFont", event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5">
                <option value="Arial, Helvetica, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Verdana, sans-serif">Verdana</option>
                <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
                <option value="system-ui, sans-serif">System UI</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Base text size ({design.baseFontSize}px)
              <input
                type="range"
                min="14"
                max="20"
                value={design.baseFontSize}
                onChange={(event) =>
                  update("baseFontSize", Number(event.target.value))
                }
                className="mt-3 block w-full accent-[#2874F0]"
              />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">Text and prices</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ColorInput
              label="Heading color"
              value={design.headingColor}
              onChange={(value) => update("headingColor", value)}
            />
            <ColorInput
              label="Body text color"
              value={design.textColor}
              onChange={(value) => update("textColor", value)}
            />
            <ColorInput
              label="Description and muted text"
              value={design.mutedTextColor}
              onChange={(value) => update("mutedTextColor", value)}
            />
            <ColorInput
              label="Product price color"
              value={design.priceColor}
              onChange={(value) => update("priceColor", value)}
            />
            <ColorInput
              label="Review text color"
              value={design.reviewColor}
              onChange={(value) => update("reviewColor", value)}
            />
            <ColorInput
              label="Review star color"
              value={design.starColor}
              onChange={(value) => update("starColor", value)}
            />
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Buttons and storefront accents
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ColorInput
              label="Add-to-cart button"
              value={design.buttonColor}
              onChange={(value) => update("buttonColor", value)}
            />
            <ColorInput
              label="Button text"
              value={design.buttonTextColor}
              onChange={(value) => update("buttonTextColor", value)}
            />
            <ColorInput
              label="Category circle"
              value={design.categoryColor}
              onChange={(value) => update("categoryColor", value)}
            />
            <ColorInput
              label="Announcement bar"
              value={design.announcementColor}
              onChange={(value) => update("announcementColor", value)}
            />
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">Live preview</h2>
          <div
            className="mt-4 rounded-lg border border-gray-100 p-4"
            style={{
              fontFamily: design.bodyFont,
              fontSize: `${design.baseFontSize}px`,
              color: design.textColor,
            }}>
            <h3
              className="text-xl font-semibold"
              style={{ color: design.headingColor, fontFamily: design.headingFont }}>
              Himalayan Village A2 Ghee, 1L
            </h3>
            <p className="mt-1 text-sm" style={{ color: design.mutedTextColor }}>
              Traditional, pure and made with care in Uttarakhand.
            </p>
            <div className="mt-2 flex items-center gap-1">
              <span style={{ color: design.starColor }}>★</span>
              <strong>4.8</strong>
              <span style={{ color: design.reviewColor }}>(613 reviews)</span>
            </div>
            <p className="mt-2 text-lg font-semibold" style={{ color: design.priceColor }}>
              ₹3,350.00
            </p>
            <button
              type="button"
              className="mt-3 rounded-lg px-5 py-2.5"
              style={{
                backgroundColor: design.buttonColor,
                color: design.buttonTextColor,
              }}>
              Add to cart
            </button>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: design.categoryColor }}>
                Shop
              </span>
              <span
                className="rounded px-3 py-2 text-xs font-semibold text-white"
                style={{ backgroundColor: design.announcementColor }}>
                Delivery charges confirmed on WhatsApp
              </span>
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Reset form
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#2874F0] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? "Saving…" : "Save storefront design"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default StorefrontDesignPage;
