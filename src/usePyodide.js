import { useEffect, useState } from "react";

const PYODIDE_VERSION = "0.24.0";
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`;

let loadPromise = null;

function loadPyodideOnce() {
  if (globalThis.pyodide) return Promise.resolve(globalThis.pyodide);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PYODIDE_URL;
    script.onload = async () => {
      try {
        const instance = await globalThis.loadPyodide({
          indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`,
        });
        globalThis.pyodide = instance;
        resolve(instance);
      } catch (err) {
        reject(err);
      }
    };
    script.onerror = () => reject(new Error("Failed to load the Python runtime."));
    document.head.appendChild(script);
  });

  return loadPromise;
}

// Loads the real Python (Pyodide/WASM) runtime once and shares it across
// every question — actual CPython running in the browser, not a simulation.
export function usePyodide() {
  const [pyodide, setPyodide] = useState(globalThis.pyodide || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pyodide) return;
    let cancelled = false;
    loadPyodideOnce()
      .then((instance) => {
        if (!cancelled) setPyodide(instance);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [pyodide]);

  return { pyodide, loading: !pyodide && !error, error };
}
