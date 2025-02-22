import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal } from "@xterm/xterm";
import { WebContainer } from "@webcontainer/api";
import "@xterm/xterm/css/xterm.css";

export default function BashPlayground() {
  const webContainerRef = useRef(null);
  const terminalRef = useRef(null);
  const terminalContainerRef = useRef(null);
  const inputWriterRef = useRef(null);
  const [activeTab, setActiveTab] = useState("basic");
  const navigate = useNavigate();

  const cheatsheets = {
    basic: [
      { command: "ls", description: "List directory contents" },
      { command: "cd <dir>", description: "Change directory" },
      { command: "pwd", description: "Print working directory" },
      { command: "mkdir <dir>", description: "Create directory" },
      { command: "touch <file>", description: "Create empty file" },
      { command: "cp <src> <dest>", description: "Copy files/directories" },
    ],
    advanced: [
      { command: "grep <pattern> <file>", description: "Search text patterns" },
      {
        command: "find <path> -name <pattern>",
        description: "Search files/dirs",
      },
      {
        command: "chmod <permissions> <file>",
        description: "Change permissions",
      },
      { command: "ps aux", description: "List running processes" },
      { command: "kill <pid>", description: "Terminate process" },
      { command: "tar -czf <archive> <files>", description: "Create archive" },
    ],
    pipes: [
      { command: "| (pipe)", description: "Send output to next command" },
      { command: "> (redirect)", description: "Redirect output to file" },
      { command: ">> (append)", description: "Append output to file" },
      { command: "< (input)", description: "Take input from file" },
      { command: "2> (stderr)", description: "Redirect error output" },
      { command: "&& (and)", description: "Run next if previous succeeds" },
    ],
  };

  useEffect(() => {
    async function startWebContainer() {
      if (webContainerRef.current) return;

      if (!terminalRef.current) {
        terminalRef.current = new Terminal({
          cursorBlink: true,
          fontSize: 14,
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

      shell.output.pipeTo(
        new WritableStream({
          write(chunk) {
            terminalRef.current.write(chunk);
          },
        }),
      );

      inputWriterRef.current = shell.input.getWriter();
      terminalRef.current.onData((input) => {
        if (inputWriterRef.current) {
          inputWriterRef.current.write(input);
        }
      });
    }

    startWebContainer();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Cyber city background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-indigo-900/20 to-gray-900" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            BASH PLAYGROUND
          </div>
          <button
            onClick={() => navigate("/bash")}
            className="bg-cyan-500 text-gray-900 py-1 px-3 rounded hover:bg-cyan-400 ml-auto min-h-[32px]"
          >
            Return
          </button>
        </div>

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
                  className="w-full h-[500px] rounded-lg overflow-hidden border border-cyan-500/30 bg-[#1a1b26]"
                />
              </div>
            </div>
          </div>

          {/* Cheatsheet Section */}
          <div className="lg:col-span-1">
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

                {/* Commands List */}
                <div className="space-y-2">
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
    </div>
  );
}
