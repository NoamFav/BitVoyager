import { useLevelProgress } from "./useLevelProgress";
import MissionMap from "./components/MissionMap";
import lua from "./assets/lua.svg";
import lessons from "./data/luaLessons.json";

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function LuaMap() {
  const { currentLevel } = useLevelProgress("luaCurrentLevel");

  return (
    <MissionMap
      lessons={lessons}
      currentLevel={currentLevel}
      routeBase="/lua"
      icon={lua}
      titlePrimary="LUA"
      titleSecondary="SWARM"
      skillForLevel={(_id, lesson) => `${capitalize(lesson.difficulty)} · ${lesson.tags[0]}`}
    />
  );
}

export default LuaMap;
