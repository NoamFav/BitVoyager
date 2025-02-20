import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// Check if running in development mode
const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  plugins: [react()],
  server: isDev
    ? {
        https: {
          key: fs.readFileSync(path.resolve(__dirname, "localhost-key.pem")),
          cert: fs.readFileSync(path.resolve(__dirname, "localhost.pem")),
        },
        headers: {
          "Cross-Origin-Opener-Policy": "same-origin",
          "Cross-Origin-Embedder-Policy": "require-corp",
        },
      }
    : undefined, // No server settings for production
  base: "/bitjourney", // Ensure correct base path for GitHub Pages
});
