import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBash } from "./useBash";

function Bash() {
  const [hoveredLevel, setHoveredLevel] = useState(null);
  const { currentLevel, setCurrentLevel } = useBash();
  const navigate = useNavigate();

  // Story progression stages
  const storyStages = [
    "Crash Landing",
    "First Contact",
    "City Navigation",
    "Security Breach",
    "Data Retrieval",
    "Power Systems",
    "Communication Array",
    "Stealth Operations",
    "AI Negotiation",
    "Resource Collection",
    "Transport Systems",
    "Firewall Bypass",
    "System Override",
    "Restricted Zone",
    "Rocket Location",
    "Security Bypass",
    "Fuel Synthesis",
    "Launch Preparation",
    "Final Countdown",
    "Escape",
  ];

  const stageDescription = [
    "Your spacecraft has crash-landed on NEXUS-9, a highly advanced technological planet. To return to your rocket and escape, you must navigate through the city's systems using BASH commands. Each challenge you overcome brings you closer to freedom. Good luck, Commander.",
    "You have made first contact with the city's inhabitants. They are willing to help you, but only if you can prove your worth. Navigate through the city's urban edge to reach the city entrance.",
    "The city's systems are complex and interconnected. Use your BASH skills to navigate through the first district and reach the central plaza.",
    "Security measures have been triggered. You must bypass security protocols and gain deeper access to the city's restricted zones.",
    "Critical information about the city's infrastructure is stored in secure data vaults. Extract this data to advance.",
    "The city's power grid is unstable. Restore the energy systems using advanced shell commands.",
    "Communication systems are heavily encrypted. Decipher and establish a secure link to communicate with potential allies.",
    "Security drones are patrolling the area. Use stealth and redirection techniques to avoid detection.",
    "An AI overlord governs the city. Engage in negotiations, convincing the AI to grant you access to deeper levels.",
    "Resources are scarce, and you need vital supplies to proceed. Collect and manage resources strategically.",
    "You must gain control of transport systems to move swiftly through the city and avoid obstacles.",
    "The city's firewalls are blocking further progress. Use advanced scripting techniques to bypass digital barriers.",
    "You need full system control. Override critical processes and take command of city operations.",
    "You've entered a restricted zone filled with high-level encryption and security traps. Navigate safely and find a way out.",
    "Your rocket’s last known location is deep within the city's most fortified sector. Locate and secure it before it’s too late.",
    "Final security barriers stand between you and the launch site. Use all your skills to bypass them.",
    "Fuel synthesis is needed for liftoff. Access chemical processing units and optimize fuel production.",
    "Prepare your ship for launch by ensuring all systems are functional and secure.",
    "The final countdown begins. Time is running out—execute the last set of commands to initiate the launch sequence.",
    "Mission complete! Your rocket is airborne, and you have successfully escaped NEXUS-9. Congratulations, Commander!",
  ];
  // Generate 20 levels with game progression context
  const levels = Array.from({ length: 20 }, (_, i) => ({
    number: i + 1,
    name: storyStages[i],
    completed: i < currentLevel - 1,
    current: i === currentLevel - 1,
    locked: i > currentLevel,
    bashSkill: getBashSkillForLevel(i + 1),
  }));

  // Calculate positions for a futuristic path through a neon city
  const calculatePositions = () => {
    // Create a more interesting, winding path through the tech city
    // Working with a grid system for better organization
    const basePositions = [
      { x: 150, y: 220 }, // Starting point (crash site)
      { x: 320, y: 180 }, // Urban edge
      { x: 480, y: 260 }, // City entrance
      { x: 620, y: 180 }, // First district
      { x: 780, y: 240 }, // Central plaza
      { x: 880, y: 340 }, // Underground passage
      { x: 780, y: 420 }, // Industrial zone
      { x: 620, y: 480 }, // Power plant
      { x: 460, y: 410 }, // Data center
      { x: 340, y: 500 }, // Transport hub
      { x: 220, y: 580 }, // Restricted sector
      { x: 350, y: 660 }, // Security checkpoint
      { x: 520, y: 620 }, // Research facility
      { x: 680, y: 680 }, // Government district
      { x: 820, y: 600 }, // Orbital control
      { x: 950, y: 540 }, // Space port entrance
      { x: 1050, y: 460 }, // Fuel depot
      { x: 1150, y: 380 }, // Launch pad vicinity
      { x: 1220, y: 280 }, // Final security zone
      { x: 1350, y: 220 }, // Rocket location
    ];

    return basePositions;
  };

  const positions = calculatePositions();

  // Dimensions for the SVG that draws the paths
  const svgWidth = Math.max(...positions.map((p) => p.x)) + 200;
  const svgHeight = Math.max(...positions.map((p) => p.y)) + 120;

  // Create paths between levels with futuristic/tech style
  const getPathBetweenLevels = (pos1, pos2, isCompleted) => {
    // Calculate control points for a gentle curve
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    const midX = pos1.x + dx / 2;
    const midY = pos1.y + dy / 2;

    // Offset control point perpendicular to the line for a nice curve
    const perpX = -dy * 0.3;
    const perpY = dx * 0.3;

    return `M ${pos1.x},${pos1.y} 
            Q ${midX + perpX},${midY + perpY} ${pos2.x},${pos2.y}`;
  };

  // Animation for the background glow effects
  useEffect(() => {
    const interval = setInterval(() => {
      const glows = document.querySelectorAll(".city-glow");
      glows.forEach((glow) => {
        const newOpacity = 0.3 + Math.random() * 0.3;
        const newBlur = 20 + Math.random() * 15;
        glow.style.opacity = newOpacity;
        glow.style.filter = `blur(${newBlur}px)`;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-auto">
      {/* Futuristic tech sky with distant cities and glowing elements */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 via-indigo-900 to-gray-900 overflow-hidden">
        {/* Distant skyline silhouette */}
        <div
          className="absolute bottom-0 left-0 right-0 h-64 bg-gray-900 opacity-60"
          style={{
            maskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='1200' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,250 L50,240 L80,190 L110,230 L140,210 L180,180 L220,240 L270,220 L300,200 L320,230 L350,210 L380,190 L420,240 L460,200 L490,230 L520,210 L550,190 L590,220 L630,230 L660,210 L690,200 L720,240 L750,220 L790,180 L830,240 L870,210 L910,230 L940,200 L980,220 L1020,240 L1050,190 L1080,210 L1110,230 L1140,200 L1170,240 L1200,250 L1200,300 L0,300 Z' fill='%23111827'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Glowing city elements */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`citylight-${i}`}
            className="city-glow absolute rounded-full transition-all duration-2000"
            style={{
              width: 20 + Math.random() * 100,
              height: 20 + Math.random() * 100,
              top: Math.random() * svgHeight * 0.8,
              left: Math.random() * svgWidth,
              background: `radial-gradient(circle, ${
                [
                  "rgba(59,130,246,0.5)",
                  "rgba(139,92,246,0.5)",
                  "rgba(6,182,212,0.5)",
                  "rgba(16,185,129,0.5)",
                ][Math.floor(Math.random() * 4)]
              } 0%, transparent 70%)`,
              opacity: 0.3 + Math.random() * 0.3,
              filter: `blur(${20 + Math.random() * 15}px)`,
            }}
          />
        ))}

        {/* Grid lines to represent the tech city structure */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
                 linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
               `,
            backgroundSize: "80px 80px",
            opacity: 0.5,
          }}
        ></div>
      </div>
      {/* Futuristic header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-md border-b border-cyan-500/30">
        <div className="w-full max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-md shadow-lg shadow-cyan-500/30">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 15V5h14v10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                <span className="font-extrabold">BASH</span>
                <span className="text-xl ml-1 font-light">ESCAPE</span>
              </h1>
            </div>

            {/* Player progress indicator */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-md border border-gray-700">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-md">
                  <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm3.3 14.71L11 12.41V7h2v4.59l3.71 3.71-1.42 1.41z" />
                  </svg>
                </div>
                <span className="text-white text-xs font-medium">
                  MISSION TIME:{" "}
                  <span className="font-mono text-cyan-400">23:47:19</span>
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
                    {Math.round(((currentLevel - 1) / 20) * 100)}%
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="sticky top-24 left-1/2 transform -translate-x-1/2 max-w-2xl w-full mx-auto px-6 py-4 mb-16 bg-gray-800/80 backdrop-filter backdrop-blur-md rounded-lg border border-cyan-500/30 shadow-xl shadow-cyan-900/20 z-40">
        <h2 className="text-lg font-bold text-cyan-400 mb-2">
          MISSION BRIEFING
        </h2>
        <p className="text-gray-200 leading-relaxed">
          {stageDescription[currentLevel - 1]}
        </p>
      </div>

      {/* Levels map container - increased top padding to accommodate the briefing */}
      <div
        className="relative pt-40 pb-16 min-h-screen"
        style={{ width: svgWidth, minHeight: svgHeight }}
      >
        {/* SVG for paths connecting the levels */}
        <svg
          className="absolute top-0 left-0 pointer-events-none z-10"
          width={svgWidth}
          height={svgHeight}
        >
          {/* Decorative tech elements */}
          {[...Array(30)].map((_, i) => {
            const x = Math.random() * svgWidth;
            const y = Math.random() * svgHeight;
            const size = 2 + Math.random() * 4;
            return (
              <circle
                key={`tech-dot-${i}`}
                cx={x}
                cy={y}
                r={size}
                fill={
                  ["#0ea5e9", "#6366f1", "#10b981", "#f59e0b"][
                    Math.floor(Math.random() * 4)
                  ]
                }
                opacity={0.4 + Math.random() * 0.4}
              />
            );
          })}

          {/* Connection paths */}
          {positions.map((pos, i) => {
            if (i === positions.length - 1) return null;
            const nextPos = positions[i + 1];
            const isPathCompleted = levels[i].completed;
            const isPathActive = levels[i].completed && levels[i + 1].current;
            const d = getPathBetweenLevels(pos, nextPos, isPathCompleted);

            // Different path styles based on progress
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
                {/* Main path */}
                <path
                  d={d}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  fill="none"
                  style={{ animation: pathAnimation }}
                />

                {/* Glow effect for completed paths */}
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

          {/* Gradient definitions */}
          <defs>
            <linearGradient
              id="completedGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient
              id="currentGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient
              id="lockedGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#475569" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0.1" />
            </linearGradient>

            {/* Animations */}
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
              `}
            </style>
          </defs>
        </svg>

        {/* Render each level as a futuristic tech node */}
        {positions.map((pos, i) => {
          const level = levels[i];

          // Determine level appearance based on status
          let bgGradient, ringColor, textColor, nodeSize;
          let iconType = null;
          let animation = "";

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
            animation = "animation: pulseGlow 2s ease-in-out infinite;";
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
              {/* Tech Node with futuristic design */}
              <div
                className={`relative ${isHovered ? "-translate-y-1" : ""} transition-transform duration-200`}
              >
                {/* Node glow effect */}
                <div
                  className={`absolute rounded-full transition-all duration-300 opacity-70`}
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
                    className="absolute -top-20 whitespace-nowrap bg-gray-800/90 backdrop-filter backdrop-blur-md px-4 py-3 rounded-lg shadow-xl border border-gray-700 z-999 text-center"
                    style={{
                      width: "220px",
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
                      <span className="text-xs text-gray-300">
                        {level.locked
                          ? "Access restricted. Complete previous challenges."
                          : level.completed
                            ? "Challenge completed! Revisit this node for practice."
                            : `Bash Skill: ${level.bashSkill}`}
                      </span>
                    </div>
                    <div className="absolute w-3 h-3 bg-gray-800 border-t border-l border-gray-700 transform rotate-45 bottom-0 translate-y-1.5 left-1/2 -ml-1.5"></div>
                  </div>
                )}

                {/* Tech node shape */}
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
                  {/* Tech patterns - decorative circuitry-like lines */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 100 100"
                      fill="none"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="white"
                        strokeWidth="0.5"
                        strokeDasharray="1 4"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="30"
                        stroke="white"
                        strokeWidth="0.5"
                      />
                      <path
                        d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50"
                        stroke="white"
                        strokeWidth="0.5"
                      />
                    </svg>
                  </div>

                  {/* Orbital dots for current level */}
                  {level.current && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div
                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-300 rounded-full opacity-80"
                        style={{ animation: "orbitDot 4s linear infinite" }}
                      ></div>
                      <div
                        className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full opacity-80"
                        style={{
                          animation: "orbitDot 3s linear infinite reverse",
                        }}
                      ></div>
                    </div>
                  )}

                  {/* Level content */}
                  <div className="relative flex flex-col items-center justify-center">
                    {iconType === "checkmark" ? (
                      <svg
                        className="w-8 h-8 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : iconType === "lock" ? (
                      <svg
                        className="w-8 h-8 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C9.24 2 7 4.24 7 7v4H6c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5zm1 15.06c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM14 10h-4V7c0-1.1.9-2 2-2s2 .9 2 2v3z" />
                      </svg>
                    ) : (
                      <span className={`text-2xl font-bold ${textColor}`}>
                        {level.number}
                      </span>
                    )}
                  </div>
                </div>

                {/* Level number badge for completed levels */}
                {level.completed && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white text-emerald-600 flex items-center justify-center text-xs font-bold shadow-md z-10">
                    {level.number}
                  </div>
                )}
              </div>

              {/* Level name below the tech node */}
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

// Helper function to get a Bash skill for each level
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
