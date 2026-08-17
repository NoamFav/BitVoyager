// BashPlayground.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal } from "@xterm/xterm";
import { WebContainer } from "@webcontainer/api";
import "@xterm/xterm/css/xterm.css";
import useBashHistory from "./useBashHistory";
import { useBash } from "./useBash";
import TaskGenerator from "./TaskGenerator";
import CityBackdrop from "./components/CityBackdrop";
import tasks from "./data/bashPracticeTasks.json";
import cheatsheets from "./data/bashCheatsheet.json";
// Main BashPlayground Component
export default function BashPlayground() {
  const webContainerRef = useRef(null);
  const terminalRef = useRef(null);
  const terminalContainerRef = useRef(null);
  const inputWriterRef = useRef(null);
  const [activeTab, setActiveTab] = useState("basic");
  const navigate = useNavigate();
  const { history: commandHistory, addHistory } = useBashHistory();
  const { currentLevel } = useBash();
  const [latestTerminalCommand, setLatestTerminalCommand] = useState("");
  const [isLearning, setIsLearning] = useState(() => {
    const storedValue = localStorage.getItem("isLearning");
    return storedValue !== null ? JSON.parse(storedValue) : true;
  });

  useEffect(() => {
    localStorage.setItem("isLearning", isLearning);
  }, [isLearning]);

  useEffect(() => {
    async function startWebContainer() {
      if (webContainerRef.current) return;
      if (!terminalRef.current) {
        terminalRef.current = new Terminal({
          cursorBlink: true,
          fontSize: 14,
          rendererType: "dom",
          theme: {
            background: "#1a1b26",
            foreground: "#a9b1d6",
            cursor: "#f7768e",
            selection: "#283457",
            black: "#32344a",
            blue: "#7aa2f7",
            cyan: "#7dcfff",
            green: "#9ece6a",
            magenta: "#bb9af7",
            red: "#f7768e",
            white: "#a9b1d6",
            yellow: "#e0af68",
          },
        });
        if (terminalContainerRef.current) {
          terminalRef.current.open(terminalContainerRef.current);
        }
      }

      webContainerRef.current = await WebContainer.boot();
      const shell = await webContainerRef.current.spawn("bash", {
        terminal: { cols: 80, rows: 25 },
      });

      let currentCommand = "";
      let outputBuffer = "";
      let isProcessingCommand = false;

      function stripAnsiCodes(str) {
        // eslint-disable-next-line no-control-regex
        return str.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])|␊/g, "");
      }

      function cleanedOutput(rawOutput, lastCommand) {
        // Strip ANSI codes and normalize line endings
        let cleaned = stripAnsiCodes(rawOutput)
          .replace(/\r\n/g, "\n")
          .replace(/\r/g, "\n");

        // Split into lines and filter empty ones
        let lines = cleaned
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line !== "");

        // Remove common noise patterns
        lines = lines.filter((line) => {
          return !(
            line.startsWith("~/") || // Remove path prefixes
            line === "❯" || // Remove prompt
            line === lastCommand || // Remove echo of the command
            line.match(/^\.{0,2}\/?$/) || // Remove single slashes and ./
            line === "~" // Remove tilde
          );
        });

        // For 'ls' command, clean up trailing slashes
        if (lastCommand === "ls") {
          lines = lines.map((line) => {
            // Join multiple slashes and clean trailing slash
            return line.replace(/\/{2,}/g, "/").replace(/\/$/, "");
          });
          // Filter out any empty lines that might have been created
          lines = lines.filter((line) => line !== "");
          // If we have exactly one line, split it on spaces and clean each entry
          if (lines.length === 1) {
            lines = lines[0]
              .split(/\s+/)
              .filter((item) => item !== "")
              .map((item) => item.replace(/\/{2,}/g, "/"));
          }
        }

        // Join remaining lines
        const output = lines.join(" ").trim();

        // Don't return anything for cd/directory navigation commands
        if (lastCommand.match(/^(cd|\.\.|\.)$/)) {
          return "";
        }

        return output;
      }

      shell.output.pipeTo(
        new WritableStream({
          write(chunk) {
            terminalRef.current.write(chunk);

            if (isProcessingCommand) {
              outputBuffer += chunk;
            }
          },
        }),
      );

      inputWriterRef.current = shell.input.getWriter();

      terminalRef.current.onData((input) => {
        if (!inputWriterRef.current) return;

        inputWriterRef.current.write(input);

        if (input === "\r") {
          // Enter key pressed
          isProcessingCommand = true;
          const trimmedCommand = currentCommand.trim();

          // Reset command tracking
          currentCommand = "";

          // Process output after a small delay
          setTimeout(() => {
            const cleanOutput = cleanedOutput(outputBuffer, trimmedCommand);

            console.log("Last Command:", trimmedCommand);
            console.log("Output:", cleanOutput);

            if (trimmedCommand && !trimmedCommand.match(/^(\.\.|\.)$/)) {
              addHistory(trimmedCommand);
              setLatestTerminalCommand(trimmedCommand);
            }

            // Reset for next command
            outputBuffer = "";
            isProcessingCommand = false;
          }, 100);
        } else if (input === "\u007f") {
          // Backspace
          currentCommand = currentCommand.slice(0, -1);
        } else {
          currentCommand += input;
        }
      });
    }

    startWebContainer();
  }, [addHistory]);

  return (
    <div className="relative min-h-screen text-white p-6">
      <CityBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            BASH PLAYGROUND
          </div>
          <button
            onClick={() => navigate("/bash")}
            className="ml-auto px-3 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded border border-cyan-500/30 font-medium hover:from-blue-500 hover:to-cyan-500 transition-colors"
          >
            Return to map
          </button>
        </div>

        <div className="space-y-6">
          {/* Terminal and Task Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Terminal Section */}
            <div className="lg:col-span-3">
              <div className="rounded-lg border border-cyan-500/30 bg-gray-800/50 backdrop-blur-md">
                <div className="p-4 border-b border-cyan-500/30">
                  <h2 className="text-xl font-semibold text-cyan-400">
                    Terminal Emulator
                  </h2>
                </div>
                <div className="p-4">
                  <div
                    ref={terminalContainerRef}
                    className="w-full h-[526px] rounded-lg overflow-hidden border border-cyan-500/30 bg-[#1a1b26]"
                  />
                </div>
              </div>
            </div>

            {/* Task Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-lg border border-cyan-500/30 bg-gray-800/50 backdrop-blur-md">
                <div className="p-4 border-b border-cyan-500/30 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-cyan-400">
                    Learning Mode
                  </h2>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="cursor-pointer appearance-none w-5 h-5 border border-cyan-500/30 bg-gray-900 rounded-md transition-colors checked:bg-cyan-500 checked:border-cyan-500 focus:ring focus:ring-cyan-500/50"
                      checked={isLearning}
                      onChange={() => setIsLearning(!isLearning)}
                    />
                    <span className="text-gray-300 text-sm">Enable</span>
                  </label>
                </div>
              </div>
              <div className="rounded-lg border border-cyan-500/30 bg-gray-800/50 backdrop-blur-md">
                <div className="p-4 border-b border-cyan-500/30">
                  <h2 className="text-xl font-semibold text-cyan-400">
                    Current Task
                  </h2>
                </div>
                <div className="p-4">
                  <TaskGenerator
                    tasks={tasks}
                    currentLevel={currentLevel}
                    commandHistory={commandHistory}
                    onTaskComplete={() => {}}
                    terminalInput={latestTerminalCommand}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Command Reference Section - Now Below Terminal */}
          <div className="rounded-lg border border-cyan-500/30 bg-gray-800/50 backdrop-blur-md">
            <div className="p-4 border-b border-cyan-500/30">
              <h2 className="text-xl font-semibold text-cyan-400">
                Command Reference
              </h2>
            </div>
            <div className="p-4">
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-4 bg-gray-700/50 p-1 rounded-lg">
                {Object.keys(cheatsheets).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                      ${
                        activeTab === tab
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Commands List - Now in a grid for better horizontal space usage */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cheatsheets[activeTab].map((cmd, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-gray-900/50 border border-gray-700/50 hover:border-cyan-500/30 transition-colors"
                  >
                    <code className="text-cyan-400 text-sm font-mono">
                      {cmd.command}
                    </code>
                    <p className="text-gray-400 text-xs mt-1">
                      {cmd.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
