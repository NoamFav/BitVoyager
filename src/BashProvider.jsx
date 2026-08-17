import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { BashContext } from "./BashContext";

// eslint-disable-next-line react/prop-types -- children: node, no prop-types dependency in this project
export function BashProvider({ children }) {
  // Load initial level from cookies or default to 1
  const [currentLevel, setCurrentLevel] = useState(() => {
    const storedLevel = Cookies.get("currentLevel");
    return storedLevel ? parseInt(storedLevel, 10) : 1;
  });

  // Expose state globally
  window.currentLevel = currentLevel;
  window.setCurrentLevel = setCurrentLevel;

  // Save currentLevel to cookies whenever it changes
  useEffect(() => {
    Cookies.set("currentLevel", currentLevel, { expires: 30 });
  }, [currentLevel]);

  return (
    <BashContext.Provider value={{ currentLevel, setCurrentLevel }}>
      {children}
    </BashContext.Provider>
  );
}
