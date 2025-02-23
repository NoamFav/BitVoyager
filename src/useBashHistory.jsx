import { useContext } from "react";
import { BashHistoryContext } from "./BashHistoryProvider";

const useBashHistory = () => {
  const context = useContext(BashHistoryContext);
  if (!context) {
    throw new Error("useBashHistory must be used within a BashHistoryProvider");
  }
  return context;
};

export default useBashHistory;
