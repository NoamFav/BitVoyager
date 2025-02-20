import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

if ("serviceWorker" in navigator) {
  const swPath =
    import.meta.env.MODE === "development"
      ? "/service-worker.js"
      : `${import.meta.env.BASE_URL}service-worker.js`;

  navigator.serviceWorker
    .register(swPath)
    .then(() => {
      console.log("Service Worker registered successfully:", swPath);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
