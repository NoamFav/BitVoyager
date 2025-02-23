import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { BashContext } from "./BashContext";

export function BashProvider({ children }) {
  // Load initial level from sessionStorage or default to 1
  const [currentLevel, setCurrentLevel] = useState(() => {
    return sessionStorage.getItem("currentLevel")
      ? parseInt(sessionStorage.getItem("currentLevel"), 10)
      : 1;
  });

  window.currentLevel = currentLevel;
  window.setCurrentLevel = setCurrentLevel;

  // Save currentLevel to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("currentLevel", currentLevel);
  }, [currentLevel]);

  return (
    <BashContext.Provider value={{ currentLevel, setCurrentLevel }}>
      {children}
    </BashContext.Provider>
  );
}

BashProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
