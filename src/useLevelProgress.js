import { useEffect, useState } from "react";
import Cookies from "js-cookie";

// Shared level-progress hook for the story-driven language tracks
// (Python, Lua, Java — Bash keeps its existing Context-based version to
// avoid touching a module that's already solid). Each track just needs
// its own cookie key; there's no cross-page live state to synchronize
// since the map and lesson pages remount on navigation anyway.
export function useLevelProgress(cookieKey) {
  const [currentLevel, setCurrentLevel] = useState(() => {
    const stored = Cookies.get(cookieKey);
    return stored ? parseInt(stored, 10) : 1;
  });

  useEffect(() => {
    Cookies.set(cookieKey, currentLevel, { expires: 30 });
  }, [cookieKey, currentLevel]);

  return { currentLevel, setCurrentLevel };
}
