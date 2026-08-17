import { useLevelProgress } from "./useLevelProgress";
import MissionMap from "./components/MissionMap";
import python from "./assets/python.png";
import lessons from "./data/pythonLessons.json";

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function PythonMap() {
  const { currentLevel } = useLevelProgress("pythonCurrentLevel");

  return (
    <MissionMap
      lessons={lessons}
      currentLevel={currentLevel}
      routeBase="/python"
      icon={python}
      titlePrimary="PYTHON"
      titleSecondary="ARCHIVE"
      skillForLevel={(_id, lesson) => `${capitalize(lesson.difficulty)} · ${lesson.tags[0]}`}
    />
  );
}

export default PythonMap;
