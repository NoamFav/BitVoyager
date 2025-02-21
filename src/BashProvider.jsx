import { useState } from "react";
import PropTypes from "prop-types";
import { BashContext } from "./BashContext";

export function BashProvider({ children }) {
  const [currentLevel, setCurrentLevel] = useState(1);

  return (
    <BashContext.Provider value={{ currentLevel, setCurrentLevel }}>
      {children}
    </BashContext.Provider>
  );
}

BashProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
