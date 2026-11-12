import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { buildWebsiteDeveloperStaticHtml } from "./src/userApp/pages/websiteDeveloperSeo.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Generates a dedicated static HTML shell at dist/website-developer/index.html
 * so search crawlers, AI search bots, and social link scrapers receive exact
 * canonical, OpenGraph, Schema.org JSON-LD, and semantic HTML before JS runs.
 */
function websiteDeveloperPrerenderPlugin() {
  return {
    name: "website-developer-prerender",
    apply: "build",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const baseHtmlPath = path.join(distDir, "index.html");
      if (!fs.existsSync(baseHtmlPath)) return;

      const baseHtml = fs.readFileSync(baseHtmlPath, "utf8");
      const developerHtml = buildWebsiteDeveloperStaticHtml(baseHtml);
      const outDir = path.join(distDir, "website-developer");
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), developerHtml, "utf8");
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), websiteDeveloperPrerenderPlugin()],

  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },

  build: {
    target: "esnext",
    sourcemap: true,
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
        },
      },
    },
  },
});
