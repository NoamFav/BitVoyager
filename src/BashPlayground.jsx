import { useEffect, useRef, useState } from "react";
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
              // Use full viewport height/width for positioning
              top: Math.random() * window.innerHeight,
              left: Math.random() * window.innerWidth,
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

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            BASH PLAYGROUND
          </div>
          <button
            onClick={() => navigate("/bash")}
            className="ml-auto px-3 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded border border-cyan-500/30 font-medium hover:from-blue-500 hover:to-cyan-500 transition-colors"
          >
            Return to map
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
