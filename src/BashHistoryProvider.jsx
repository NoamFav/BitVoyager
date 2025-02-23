import { useEffect, createContext, useState } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

// Create the BashHistoryContext
const BashHistoryContext = createContext();

const BashHistoryProvider = ({ children }) => {
  const [history, setHistory] = useState(() => {
    // Load history from cookies or default to an empty array
    const storedHistory = Cookies.get("history");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  window.commandHistory = history;

  useEffect(() => {
    // Save history to cookies
    Cookies.set("history", JSON.stringify(history), { expires: 30 });
  }, [history]);

  const addHistory = (command) => {
    setHistory((prevHistory) => [...prevHistory, command]);
  };

  const clearHistory = () => {
    setHistory([]);
    Cookies.remove("history"); // Clear the cookie when history is reset
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
