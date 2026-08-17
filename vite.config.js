import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

const isDev = process.env.NODE_ENV !== "production"; // Works properly

export default defineConfig({
  plugins: [react()],
  // fengari (the real Lua VM used for the Lua module) reads
  // process.env.FENGARICONF at import time — a Node assumption that has
  // no equivalent in the browser. This statically replaces the
  // expression so it evaluates to nothing rather than throwing.
  define: {
    "process.env": {},
    // Standard fix for CJS deps (several inside fengari's dependency
    // tree) that reference Node's bare `global` — no equivalent exists
    // in the browser, but globalThis does.
    global: "globalThis",
  },
  resolve: {
    alias: {
      // fengari's platform-detection branch calls Node's real os.platform()
      // when it (incorrectly, in this bundle) thinks it's not in a browser.
      // A tiny shim is simpler and more robust than fighting Vite's own
      // process-shimming to make that detection come out the other way.
      os: path.resolve(__dirname, "src/shims/os.js"),
      tmp: path.resolve(__dirname, "src/shims/tmp.js"),
      "readline-sync": path.resolve(__dirname, "src/shims/readline-sync.js"),
    },
  },
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
