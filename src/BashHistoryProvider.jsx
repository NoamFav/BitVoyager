import { useEffect, createContext, useState } from "react";
import PropTypes from "prop-types";

// Create the BashHistoryContext
const BashHistoryContext = createContext();

const BashHistoryProvider = ({ children }) => {
  const [history, setHistory] = useState(() => {
    return JSON.parse(sessionStorage.getItem("history")) || [];
  });

  window.commandHistory = history;
  useEffect(() => {
    sessionStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  const addHistory = (command) => {
    setHistory((prevHistory) => [...prevHistory, command]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <BashHistoryContext.Provider value={{ history, addHistory, clearHistory }}>
      {children}
    </BashHistoryContext.Provider>
  );
};

BashHistoryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { BashHistoryProvider, BashHistoryContext };
