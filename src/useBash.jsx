import { useContext } from "react";
import { BashContext } from "./BashContext";

export function useBash() {
  return useContext(BashContext);
}
