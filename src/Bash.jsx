import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBash } from "./useBash";
import CityBackdrop from "./components/CityBackdrop";
import bash from "./assets/bash.png";
import lessons from "./data/bashLessons.json";

const DOT_COLORS = ["#0ea5e9", "#6366f1", "#10b981", "#f59e0b"];

function Bash() {
  const [hoveredLevel, setHoveredLevel] = useState(null);
  const { currentLevel } = useBash();
  const navigate = useNavigate();

  // Computed once so hovering a level doesn't reshuffle every dot on the map.
  const techDots = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
        size: 2 + Math.random() * 4,
        color: DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)],
        min: 0.15 + Math.random() * 0.15,
        max: 0.5 + Math.random() * 0.4,
        duration: 2.5 + Math.random() * 3,
        delay: -Math.random() * 4,
      })),
    [],
  );

  // Generate levels with game progression context, sourced from the lesson data
  const levels = lessons.map((lesson, i) => ({
    number: lesson.id,
    name: lesson.title,
    objective: lesson.objective,
    completed: i < currentLevel - 1,
    current: i === currentLevel - 1,
    locked: i > currentLevel - 1,
    bashSkill: getBashSkillForLevel(lesson.id),
  }));

  // Calculate positions for a futuristic path through a neon city
  const calculatePositions = () => {
    const basePositions = [
      { x: 150, y: 220 },
      { x: 320, y: 180 },
      { x: 480, y: 260 },
      { x: 620, y: 180 },
      { x: 780, y: 240 },
      { x: 880, y: 340 },
      { x: 780, y: 420 },
      { x: 620, y: 480 },
      { x: 460, y: 410 },
      { x: 340, y: 500 },
      { x: 220, y: 580 },
      { x: 350, y: 660 },
      { x: 520, y: 620 },
      { x: 680, y: 680 },
      { x: 820, y: 600 },
      { x: 950, y: 540 },
      { x: 1050, y: 460 },
      { x: 1150, y: 380 },
      { x: 1220, y: 280 },
      { x: 1350, y: 220 },
    ];
    return basePositions;
  };

  const positions = calculatePositions();

  const svgWidth = Math.max(...positions.map((p) => p.x)) + 200;
  const svgHeight = Math.max(...positions.map((p) => p.y)) + 120;

  const getPathBetweenLevels = (pos1, pos2) => {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    const midX = pos1.x + dx / 2;
    const midY = pos1.y + dy / 2;
    const perpX = -dy * 0.3;
    const perpY = dx * 0.3;
    return `M ${pos1.x},${pos1.y}
            Q ${midX + perpX},${midY + perpY} ${pos2.x},${pos2.y}`;
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-auto no-scrollbar">
      <CityBackdrop />

      {/* Futuristic header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-md border-b border-cyan-500/30">
        <div className="w-full max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-md shadow-lg shadow-cyan-500/30">
                <img src={bash} alt="bash" className="w-8 h-8" />
              </div>

              <h1
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 cursor-pointer"
                onClick={() => {
                  navigate(`/`);
                }}
              >
                <span className="font-extrabold">BASH</span>
                <span className="text-xl ml-1 font-light">ESCAPE</span>
              </h1>
            </div>

            {/* Player progress indicator */}
            <div className="flex items-center gap-6">
              <div
                onClick={() => navigate("/bash/playground")}
                className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-md border border-gray-700 cursor-pointer hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-md">
                  <svg
                    className="w-4 h-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2zm4 8l2-2-2-2m8 4h.01"
                    />
                  </svg>
                </div>
                <span className="text-white text-xs font-medium">
                  PlayGround
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-md border border-gray-700">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-1 rounded-md">
                  <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <span className="text-white text-xs font-medium">
                  MISSION PROGRESS:{" "}
                  <span className="font-mono text-cyan-400">
                    {Math.round(((currentLevel - 1) / levels.length) * 100)}%
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="sticky top-24 left-1/2 transform -translate-x-1/2 max-w-2xl w-full mx-auto px-6 py-4 mb-4 bg-gray-800/80 backdrop-filter backdrop-blur-md rounded-lg border border-cyan-500/30 shadow-xl shadow-cyan-900/20 z-40">
        <h2 className="text-lg font-bold text-cyan-400 mb-2">
          MISSION BRIEFING
        </h2>
        <p className="text-gray-200 leading-relaxed">
          {lessons[currentLevel - 1]?.briefing?.[0]}
        </p>
      </div>

      {/* Levels map container */}
      <div
        className="relative pt-40 pb-16 min-h-screen mx-auto "
        style={{ width: svgWidth, minHeight: svgHeight }}
      >
        {/* SVG for paths connecting the levels */}
        <svg
          className="absolute top-0 left-0 pointer-events-none z-10 w-screen"
          width={svgWidth}
          height={svgHeight}
        >
          {/* Decorative tech elements */}
          {techDots.map((dot) => (
            <circle
              key={`tech-dot-${dot.id}`}
              cx={dot.x}
              cy={dot.y}
              r={dot.size}
              fill={dot.color}
              style={{
                "--dot-min": dot.min,
                "--dot-max": dot.max,
                animation: `dotTwinkle ${dot.duration}s ease-in-out ${dot.delay}s infinite`,
              }}
            />
          ))}

          {/* Connection paths */}
          {positions.map((pos, i) => {
            if (i === positions.length - 1) return null;
            const nextPos = positions[i + 1];
            const isPathCompleted = levels[i].completed;
            const isPathActive = levels[i].completed && levels[i + 1].current;
            const d = getPathBetweenLevels(pos, nextPos);

            let strokeColor = "url(#lockedGradient)";
            let strokeWidth = 4;
            let strokeDasharray = "";
            let pathAnimation = "";

            if (isPathCompleted || isPathActive) {
              strokeColor = "url(#completedGradient)";
              if (isPathActive) {
                strokeDasharray = "0.5 12";
                pathAnimation = "activePath 4s linear infinite";
              }
            } else if (levels[i].current) {
              strokeColor = "url(#currentGradient)";
              strokeDasharray = "0.5 12";
              pathAnimation = "currentPath 4s linear infinite";
            }

            return (
              <g key={`path-${i}`}>
                <path
                  d={d}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  fill="none"
                  style={{ animation: pathAnimation }}
                />

                {(isPathCompleted || isPathActive) && (
                  <path
                    d={d}
                    stroke={isPathActive ? "#0ea5e9" : "#10b981"}
                    strokeWidth={strokeWidth + 4}
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.3"
                    filter="blur(4px)"
                  />
                )}
              </g>
            );
          })}

          <defs>
            <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="currentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="lockedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0.1" />
            </linearGradient>

            <style>
              {`
                @keyframes activePath {
                  0% { stroke-dashoffset: 24; }
                  100% { stroke-dashoffset: 0; }
                }
                @keyframes currentPath {
                  0% { stroke-dashoffset: 0; }
                  100% { stroke-dashoffset: 24; }
                }
                @keyframes pulseGlow {
                  0% { filter: drop-shadow(0 0 3px rgba(6, 182, 212, 0.7)); }
                  50% { filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.9)); }
                  100% { filter: drop-shadow(0 0 3px rgba(6, 182, 212, 0.7)); }
                }
                @keyframes orbitDot {
                  0% { transform: translateX(-50%) translateY(-50%) rotate(0deg) translateX(24px) rotate(0deg); }
                  100% { transform: translateX(-50%) translateY(-50%) rotate(360deg) translateX(24px) rotate(-360deg); }
                }
                @keyframes dotTwinkle {
                  0%, 100% { opacity: var(--dot-min); }
                  50% { opacity: var(--dot-max); }
                }
              `}
            </style>
          </defs>
        </svg>

        {/* Render each level as a futuristic tech node */}
        {positions.map((pos, i) => {
          const level = levels[i];
          if (!level) return null;

          let bgGradient, ringColor, textColor, nodeSize;
          let iconType = null;

          if (level.completed) {
            bgGradient = "bg-gradient-to-br from-emerald-500 to-teal-600";
            ringColor = "border-emerald-400";
            textColor = "text-white";
            nodeSize = "w-16 h-16";
            iconType = "checkmark";
          } else if (level.current) {
            bgGradient = "bg-gradient-to-br from-blue-500 to-cyan-600";
            ringColor = "border-blue-400";
            textColor = "text-white";
            nodeSize = "w-20 h-20";
          } else {
            bgGradient = "bg-gradient-to-br from-gray-700 to-gray-800";
            ringColor = "border-gray-600";
            textColor = "text-gray-400";
            nodeSize = "w-16 h-16";
            iconType = "lock";
          }

          const isHovered = hoveredLevel === i;

          return (
            <div
              key={i}
              className="absolute z-20 transform transition-all duration-300 cursor-pointer"
              style={{
                top: pos.y,
                left: pos.x,
                transform: `translate(-50%, -50%) ${isHovered ? "scale(1.1)" : "scale(1)"}`,
              }}
              onMouseEnter={() => setHoveredLevel(i)}
              onMouseLeave={() => setHoveredLevel(null)}
              onClick={() => {
                if (level.current) {
                  navigate(`/bash/${level.number}`);
                }
              }}
            >
              <div
                className={`relative ${isHovered ? "-translate-y-1" : ""} transition-transform duration-200`}
              >
                <div
                  className="absolute rounded-full transition-all duration-300 opacity-70"
                  style={{
                    width: level.current ? "100px" : "80px",
                    height: level.current ? "100px" : "80px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: level.current
                      ? "radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)"
                      : level.completed
                        ? "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)"
                        : "radial-gradient(circle, rgba(71,85,105,0.1) 0%, transparent 70%)",
                    filter: level.current ? "blur(10px)" : "blur(5px)",
                    opacity: isHovered ? 0.9 : 0.6,
                  }}
                ></div>

                {isHovered && (
                  <div
                    className="absolute -top-24 bg-gray-800/90 backdrop-filter backdrop-blur-md px-4 py-3 rounded-lg shadow-xl border border-gray-700 z-50 text-center"
                    style={{
                      width: "240px",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`font-bold text-sm mb-1 ${level.locked ? "text-gray-400" : level.current ? "text-cyan-400" : "text-emerald-400"}`}
                      >
                        {level.name}
                      </span>
                      <span className="text-xs text-gray-300 leading-relaxed">
                        {level.locked
                          ? "Access restricted. Complete previous challenges."
                          : level.completed
                            ? "Challenge completed! Revisit this node for practice."
                            : level.objective}
                      </span>
                      <span className="text-[10px] text-cyan-500/80 mt-1.5 uppercase tracking-wide">
                        {level.bashSkill}
                      </span>
                    </div>
                    <div className="absolute w-3 h-3 bg-gray-800 border-t border-l border-gray-700 transform rotate-45 bottom-0 translate-y-1.5 left-1/2 -ml-1.5"></div>
                  </div>
                )}

                <div
                  className={`relative ${nodeSize} rounded-full flex items-center justify-center ${bgGradient} border-2 ${ringColor} shadow-lg transition-all duration-300 overflow-hidden`}
                  style={{
                    boxShadow: isHovered
                      ? `0 0 20px ${level.current ? "rgba(6,182,212,0.5)" : level.completed ? "rgba(16,185,129,0.5)" : "rgba(71,85,105,0.3)"}`
                      : `0 0 10px ${level.current ? "rgba(6,182,212,0.3)" : level.completed ? "rgba(16,185,129,0.3)" : "rgba(71,85,105,0.1)"}`,
                    ...(level.current && {
                      animation: "pulseGlow 2s ease-in-out infinite",
                    }),
                  }}
                >
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" strokeDasharray="1 4" />
                      <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" />
                      <path
                        d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50"
                        stroke="white"
                        strokeWidth="0.5"
                      />
                    </svg>
                  </div>

                  {level.current && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div
                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-300 rounded-full opacity-80"
                        style={{ animation: "orbitDot 4s linear infinite" }}
                      ></div>
                      <div
                        className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full opacity-80"
                        style={{ animation: "orbitDot 3s linear infinite reverse" }}
                      ></div>
                    </div>
                  )}

                  <div className="relative flex flex-col items-center justify-center">
                    {iconType === "checkmark" ? (
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : iconType === "lock" ? (
                      <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C9.24 2 7 4.24 7 7v4H6c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5zm1 15.06c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM14 10h-4V7c0-1.1.9-2 2-2s2 .9 2 2v3z" />
                      </svg>
                    ) : (
                      <span className={`text-2xl font-bold ${textColor}`}>
                        {level.number}
                      </span>
                    )}
                  </div>
                </div>

                {level.completed && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white text-emerald-600 flex items-center justify-center text-xs font-bold shadow-md z-10">
                    {level.number}
                  </div>
                )}
              </div>

              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center">
                <span
                  className={`text-xs font-medium ${level.locked ? "text-gray-500" : level.current ? "text-cyan-400" : "text-emerald-400"}`}
                >
                  {level.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper function to get a Bash skill label for each level
function getBashSkillForLevel(level) {
  const skills = [
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
  return skills[level - 1] || `Level ${level}`;
}

export default Bash;
