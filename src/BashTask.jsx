import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBash } from "./useBash";

function BashTask() {
  const { level } = useParams();
  const navigate = useNavigate();
  const { currentLevel, setCurrentLevel } = useBash();
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [hints, setHints] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Tasks configuration for each level
  const tasks = {
    1: {
      title: "Crash Landing",
      description:
        "Your spacecraft has crash-landed on NEXUS-9. Initialize basic systems to begin your escape.",
      objective:
        "Print information about your current environment to understand where you are.",
      expectedCommands: ["uname -a", "pwd", "ls", "echo $SHELL"],
      hints: [
        "Try looking at your system information",
        "Try 'uname -a' to see details about the system",
        "Use 'pwd' to see your current location",
      ],
      initialTerminalOutput: [
        "--- NEXUS-9 EMERGENCY SYSTEM ---",
        "* Communication systems: OFFLINE",
        "* Navigation systems: OFFLINE",
        "* Life support: FUNCTIONAL",
        "* Emergency terminal: ACTIVATED",
        "",
        "Initializing emergency shell...",
      ],
    },
    2: {
      title: "First Contact",
      description:
        "You have made first contact with the city's inhabitants. They've granted you limited access to their network.",
      objective:
        "Navigate through the city's edge by listing hidden files and changing directories.",
      expectedCommands: ["ls -la", "cd", 'find . -type f -name "*.key"'],
      hints: [
        "You need to find hidden files in the system",
        "Try 'ls -la' to list all files including hidden ones",
        "Look for key files using the 'find' command",
      ],
      initialTerminalOutput: [
        ">>> NEXUS-9 NETWORK CONNECTION ESTABLISHED <<<",
        "",
        'Citizen #7219: "Welcome, offworlder. We don\'t see many visitors here."',
        'Citizen #7219: "I\'ve granted you limited access to our city systems."',
        'Citizen #7219: "Find the hidden access key and proceed to the entrance."',
        "",
        "Connection established to: /nexus/city/edge/",
      ],
    },
    3: {
      title: "City Navigation",
      description:
        "The city's systems are complex and interconnected. Navigate through the first district to reach the central plaza.",
      objective:
        "Create a directory structure to map your path through the city and leave breadcrumbs for your return journey.",
      expectedCommands: ["mkdir", "touch", "cp", "mv"],
      hints: [
        "Create a path using directories",
        "Try 'mkdir -p path/to/central/plaza'",
        "Leave files as breadcrumbs with 'touch'",
      ],
      initialTerminalOutput: [
        "--- NEXUS-9 DISTRICT NAVIGATION SYSTEM ---",
        "",
        "WARNING: The city layout constantly shifts. ",
        "You must create a stable path and mark it with identifiers.",
        "",
        'City\'s AI: "Visitors must demonstrate organizational skills"',
        'City\'s AI: "Create your path or become lost forever"',
      ],
    },
  };

  // Get current task data
  const currentTask = tasks[currentLevel] || tasks[1];

  // Initialize terminal on component mount
  useEffect(() => {
    setTerminalOutput(currentTask.initialTerminalOutput || []);
    setHints(currentTask.hints || []);

    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentLevel]);

  // Scroll terminal to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Handle command input
  const handleCommandChange = (e) => {
    setCurrentCommand(e.target.value);
  };

  // Submit a command
  const handleCommandSubmit = (e) => {
    e.preventDefault();

    if (!currentCommand.trim()) return;

    // Add command to history
    const newHistory = [...commandHistory, currentCommand];
    setCommandHistory(newHistory);

    // Add command to terminal output
    const newOutput = [...terminalOutput, `nexus@user:~$ ${currentCommand}`];

    // Process command
    const processedOutput = processCommand(currentCommand, newOutput);
    setTerminalOutput(processedOutput);

    // Check if the task is completed
    checkTaskCompletion(currentCommand);

    // Clear current command
    setCurrentCommand("");
  };

  // Process a command and generate appropriate output
  const processCommand = (command, currentOutput) => {
    const cmd = command.trim().toLowerCase();
    let output = [...currentOutput];

    // Level 1 command responses
    if (currentLevel === 1) {
      if (cmd === "uname -a") {
        output.push(
          "NEXUS-9 CityOS 4.5.2 #1 SMP PREEMPT_DYNAMIC Thu Oct 12 23:14:54 UTC 2024 x86_64 GNU/Linux",
        );
      } else if (cmd === "pwd") {
        output.push("/home/visitor/landing_zone");
      } else if (cmd === "ls") {
        output.push(
          "emergency_beacon.sh  system_logs  debris  personal_effects",
        );
      } else if (cmd === "echo $shell") {
        output.push("/bin/nexus_shell");
      } else if (cmd.startsWith("cd ")) {
        output.push("Changed directory.");
      } else if (cmd === "help") {
        output.push(
          "Available commands: ls, cd, pwd, cat, mkdir, touch, cp, mv, find, grep, echo",
        );
        output.push("Use 'man <command>' for more information.");
      } else if (cmd.startsWith("man ")) {
        output.push(`Displaying manual for ${cmd.split(" ")[1]}...`);
        output.push("(Manual content would display here)");
      } else {
        output.push(`Command not recognized: '${command}'`);
      }
    }

    // Level 2 command responses
    else if (currentLevel === 2) {
      if (cmd === "ls -la") {
        output.push("total 24");
        output.push("drwxr-xr-x  5 visitor city_access 4096 Feb 20 14:32 .");
        output.push("drwxr-xr-x  3 system  system      4096 Feb 20 14:30 ..");
        output.push(
          "-rw-------  1 visitor city_access  267 Feb 20 14:31 .access_history",
        );
        output.push(
          "drwxr-xr-x  2 visitor city_access 4096 Feb 20 14:32 public_terminal",
        );
        output.push(
          "drwxr-x---  2 system  city_access 4096 Feb 20 14:32 .hidden_path",
        );
        output.push(
          "-rw-r-----  1 system  city_access   42 Feb 20 14:32 .access.key",
        );
      } else if (cmd === "cd .hidden_path") {
        output.push(
          "Accessed hidden path. The city entrance is visible ahead.",
        );
      } else if (cmd.includes("find") && cmd.includes(".key")) {
        output.push("./.access.key");
        output.push("./public_terminal/visitor.key");
        output.push("./.hidden_path/entrance.key");
      } else if (cmd.startsWith("cd ")) {
        output.push("Directory changed successfully.");
      } else if (cmd === "help") {
        output.push(
          "Available commands: ls, cd, pwd, cat, mkdir, touch, cp, mv, find, grep, echo",
        );
      } else {
        output.push(`Command executed: '${command}'`);
      }
    }

    // Level 3 command responses
    else if (currentLevel === 3) {
      if (cmd.startsWith("mkdir")) {
        output.push("Directory created successfully.");
      } else if (cmd.startsWith("touch")) {
        output.push("File created successfully.");
      } else if (cmd.startsWith("cp")) {
        output.push("File copied successfully.");
      } else if (cmd.startsWith("mv")) {
        output.push("File moved successfully.");
      } else if (cmd === "ls") {
        output.push(
          "district_map.txt  citizen_registry  public_transport  security_feed",
        );
      } else if (cmd === "help") {
        output.push(
          "Available commands: ls, cd, pwd, cat, mkdir, touch, cp, mv, find, grep, echo",
        );
      } else {
        output.push(`Command executed: '${command}'`);
      }
    }

    return output;
  };

  // Check if the task is completed based on the commands executed
  const checkTaskCompletion = (command) => {
    const cmd = command.trim().toLowerCase();
    const { expectedCommands } = currentTask;

    // Simple check if any of the expected commands have been used
    if (
      expectedCommands.some(
        (expected) =>
          cmd.includes(expected) ||
          (expected.includes(" ") && cmd.startsWith(expected.split(" ")[0])),
      )
    ) {
      // Count unique command types used
      const commandTypes = commandHistory.reduce((types, cmd) => {
        expectedCommands.forEach((expected) => {
          if (
            cmd.includes(expected) ||
            (expected.includes(" ") && cmd.startsWith(expected.split(" ")[0]))
          ) {
            types.add(expected.split(" ")[0]);
          }
        });
        return types;
      }, new Set());

      // If user has used enough different command types, mark as completed
      if (commandTypes.size >= Math.min(2, expectedCommands.length)) {
        setTaskCompleted(true);
        setTerminalOutput((prev) => [
          ...prev,
          "",
          "*** TASK COMPLETED SUCCESSFULLY ***",
          `You've mastered the "${currentTask.title}" challenge!`,
          "Ready to proceed to the next level.",
        ]);
      }
    }
  };

  // Handle keyboard navigation in command history
  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const index = Math.max(0, commandHistory.length - 1);
        setCurrentCommand(commandHistory[index]);
      }
    }
  };

  // Show next hint
  const showNextHint = () => {
    if (hintIndex < hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
    setShowHint(true);
  };

  // Proceed to next level
  const handleNextLevel = () => {
    const nextLevel = currentLevel + 1;

    // If we have a task for the next level, navigate there
    if (tasks[nextLevel]) {
      navigate(`/bash/${nextLevel}`);
      setCurrentLevel(nextLevel);
      setTaskCompleted(false);
      setCommandHistory([]);
      setCurrentCommand("");
    } else {
      // Otherwise go back to the map
      navigate("/bash");
    }
  };

  // Return to map
  const handleReturnToMap = () => {
    navigate("/bash");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      {/* Header with mission info */}
      <header className="bg-gray-800/80 backdrop-filter backdrop-blur-md border-b border-cyan-500/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-md shadow-lg shadow-cyan-500/30">
                <svg
                  className="w-6 h-6 text-white"
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
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                  <span className="font-extrabold">BASH</span>
                  <span className="text-lg ml-1 font-light">ESCAPE</span>
                </h1>
                <p className="text-xs text-gray-400">
                  LEVEL {currentLevel}: {currentTask.title}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleReturnToMap}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 px-4 rounded-md border border-gray-600 transition-colors"
              >
                Return to Map
              </button>
              {taskCompleted && (
                <button
                  onClick={handleNextLevel}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm py-2 px-4 rounded-md transition-colors shadow-lg shadow-cyan-500/30"
                >
                  Next Level
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Task briefing panel */}
        <div className="lg:w-1/3 space-y-4">
          <div className="bg-gray-800/60 backdrop-filter backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 shadow-lg">
            <h2 className="text-cyan-400 text-lg font-bold mb-2 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              Mission Briefing
            </h2>
            <p className="text-sm mb-4 leading-relaxed">
              {currentTask.description}
            </p>

            <div className="mt-4 bg-gray-900/50 p-3 rounded border border-gray-700">
              <h3 className="text-sm font-semibold text-purple-400 mb-1">
                OBJECTIVE:
              </h3>
              <p className="text-xs text-gray-300">{currentTask.objective}</p>
            </div>
          </div>

          {/* Hints panel */}
          <div className="bg-gray-800/60 backdrop-filter backdrop-blur-sm border border-amber-500/30 rounded-lg p-4 shadow-lg">
            <h2 className="text-amber-400 text-lg font-bold mb-2 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V6h2v2z" />
              </svg>
              Command Assistance
            </h2>

            {showHint ? (
              <div className="space-y-2">
                {hints.slice(0, hintIndex + 1).map((hint, i) => (
                  <div
                    key={i}
                    className="bg-amber-900/20 p-2 rounded text-xs text-amber-200 border border-amber-700/30"
                  >
                    {hint}
                  </div>
                ))}
                {hintIndex < hints.length - 1 && (
                  <button
                    onClick={showNextHint}
                    className="text-xs text-amber-400 hover:text-amber-300 mt-2"
                  >
                    Need more help?
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowHint(true)}
                className="bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 text-amber-400 text-xs py-2 px-4 rounded w-full transition-colors"
              >
                Show Hint
              </button>
            )}
          </div>
        </div>

        {/* Terminal panel */}
        <div className="lg:w-2/3 flex flex-col">
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl flex-1 flex flex-col overflow-hidden">
            {/* Terminal header */}
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-400 flex-1 text-center font-mono">
                NEXUS-9 Terminal - {currentTask.title}
              </div>
            </div>

            {/* Terminal output area */}
            <div
              ref={terminalRef}
              className="flex-1 bg-gray-950 p-4 font-mono text-sm overflow-y-auto"
              style={{ minHeight: "400px" }}
            >
              {terminalOutput.map((line, i) => {
                // Check if this is a command line
                const isCommand = line.startsWith("nexus@user:~$");

                // Check if this is a success message
                const isSuccess = line.includes("TASK COMPLETED SUCCESSFULLY");

                return (
                  <div
                    key={i}
                    className={`
                    ${isCommand ? "text-green-400" : isSuccess ? "text-cyan-400 font-bold" : "text-gray-300"}
                    ${line === "" ? "py-1" : "py-0.5"}
                  `}
                  >
                    {line}
                  </div>
                );
              })}
            </div>

            {/* Command input area */}
            <form
              onSubmit={handleCommandSubmit}
              className="border-t border-gray-700 p-2 bg-gray-800/60"
            >
              <div className="flex items-center">
                <span className="text-green-400 font-mono text-sm mr-2">
                  nexus@user:~$
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentCommand}
                  onChange={handleCommandChange}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm"
                  placeholder="Enter command..."
                  spellCheck="false"
                  autoComplete="off"
                />
              </div>
            </form>
          </div>

          {/* Command helper panel */}
          <div className="mt-4 bg-gray-800/60 backdrop-filter backdrop-blur-sm border border-gray-700 rounded-lg p-3">
            <div className="flex flex-wrap gap-2">
              <div className="text-xs font-semibold text-gray-400">
                COMMON COMMANDS:
              </div>
              {["ls", "cd", "pwd", "mkdir", "touch", "cat", "find", "grep"].map(
                (cmd) => (
                  <span
                    key={cmd}
                    className="text-xs bg-gray-700 px-2 py-1 rounded cursor-pointer hover:bg-gray-600 transition-colors"
                    onClick={() =>
                      setCurrentCommand(
                        (prev) => `${prev}${prev ? " " : ""}${cmd}`,
                      )
                    }
                  >
                    {cmd}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BashTask;
