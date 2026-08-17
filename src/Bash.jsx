import { useNavigate } from "react-router-dom";
import { useBash } from "./useBash";
import MissionMap from "./components/MissionMap";
import bash from "./assets/bash.png";
import lessons from "./data/bashLessons.json";

const BASH_SKILLS = [
  "Basic Commands",
  "File Navigation",
  "File Permissions",
  "I/O Redirection",
  "Pipelines",
  "Text Processing",
  "Environment Variables",
  "Shell Scripts",
  "Process Management",
  "Pattern Matching",
  "Conditional Statements",
  "Loops",
  "Functions",
  "Signal Handling",
  "Job Control",
  "Network Tools",
  "System Monitoring",
  "User Management",
  "Scheduling Tasks",
  "Advanced Scripting",
];

function Bash() {
  const { currentLevel } = useBash();
  const navigate = useNavigate();

  return (
    <MissionMap
      lessons={lessons}
      currentLevel={currentLevel}
      routeBase="/bash"
      icon={bash}
      titlePrimary="BASH"
      titleSecondary="ESCAPE"
      skillForLevel={(id) => BASH_SKILLS[id - 1] || `Level ${id}`}
      extraHeaderAction={
        <div
          onClick={() => navigate("/bash/playground")}
          className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-md border border-gray-700 cursor-pointer hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-md">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2zm4 8l2-2-2-2m8 4h.01"
              />
            </svg>
          </div>
          <span className="text-white text-xs font-medium">PlayGround</span>
        </div>
      }
    />
  );
}

export default Bash;
