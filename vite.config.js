import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

const isDev = process.env.NODE_ENV !== "production"; // Works properly

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
    : undefined,

  base: "/bitvoyager",
});
