// BashPlayground.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal } from "@xterm/xterm";
import { WebContainer } from "@webcontainer/api";
import "@xterm/xterm/css/xterm.css";
import useBashHistory from "./useBashHistory";
import { useBash } from "./useBash";
import TaskGenerator from "./TaskGenerator";

// Define the tasks object
const tasks = {
  1: {
    expectedCommands: ["pwd", "ls"],
    title: "Basic Location Check",
    description: "Check your current location and view directory contents",
    level: 1,
  },
  2: {
    expectedCommands: ["mkdir test_dir", "cd test_dir"],
    title: "Directory Creation",
    description: "Create a new directory and navigate into it",
    level: 3, // Introduced in "City Navigation"
  },
  3: {
    expectedCommands: ["touch file.txt", "ls"],
    title: "File Creation",
    description: "Create a new file and verify its existence",
    level: 3, // Introduced in "City Navigation"
  },
  4: {
    expectedCommands: ["mkdir docs", "cd docs", "touch notes.txt"],
    title: "Workspace Setup",
    description: "Create a documents directory and a notes file within it",
    level: 3, // Introduced in "City Navigation"
  },
  5: {
    expectedCommands: ["touch test.txt", "ls -l"],
    title: "File Listing",
    description: "Create a file and view detailed listing",
    level: 3, // Introduced in "City Navigation"
  },
  6: {
    expectedCommands: ["cp file.txt backup.txt", "ls"],
    title: "File Backup",
    description: "Create a backup copy of a file",
    level: 3, // Introduced in "City Navigation"
  },
  7: {
    expectedCommands: ["mkdir project", "cd project", "touch README.md"],
    title: "Project Setup",
    description: "Create a project directory with a readme file",
    level: 3, // Introduced in "City Navigation"
  },
  8: {
    expectedCommands: ["echo 'test' > file.txt", "cat file.txt"],
    title: "File Content",
    description: "Create a file with content and view it",
    level: 4, // Introduced in "Security Breach" (using cat)
  },
  9: {
    expectedCommands: ["find . -name '*.txt'"],
    title: "File Search",
    description: "Find all text files in current directory",
    level: 4, // Introduced in "Security Breach"
  },
  10: {
    expectedCommands: ["mkdir -p project/src", "cd project/src"],
    title: "Nested Directories",
    description: "Create and navigate nested directory structure",
    level: 5, // Introduced in "Data Retrieval"
  },
  11: {
    expectedCommands: ["touch file{1..3}.txt", "ls"],
    title: "Multiple Files",
    description: "Create multiple files at once",
    level: 5, // Introduced in "Data Retrieval"
  },
  12: {
    expectedCommands: ["ps", "ps aux"],
    title: "Process List",
    description: "View running processes",
    level: 6, // Introduced in "Power Systems"
  },
  13: {
    expectedCommands: ["mkdir logs", "touch logs/app.log"],
    title: "Log Setup",
    description: "Create a log directory and file",
    level: 6, // Introduced in "Power Systems"
  },
  14: {
    expectedCommands: ["df", "du -h"],
    title: "Storage Check",
    description: "Check storage usage",
    level: 10, // Introduced in "Resource Collection"
  },
  15: {
    expectedCommands: ["mkdir backup", "cp -r project/* backup/"],
    title: "Directory Backup",
    description: "Back up an entire directory",
    level: 10, // Introduced in "Resource Collection"
  },
  16: {
    expectedCommands: ["echo 'test' > test.txt", "grep 'test' test.txt"],
    title: "Text Search",
    description: "Search for text in a file",
    level: 4, // Introduced in "Security Breach"
  },
  17: {
    expectedCommands: ["echo '1 2 3' > nums.txt", "wc -w nums.txt"],
    title: "Word Count",
    description: "Count words in a file",
    level: 5, // Introduced in "Data Retrieval"
  },
  18: {
    expectedCommands: ["mkdir web", "cd web", "touch index.html"],
    title: "Web Setup",
    description: "Create a basic web project structure",
    level: 5, // Introduced in "Data Retrieval"
  },
  19: {
    expectedCommands: ["echo 'hello' > file.txt", "cat file.txt"],
    title: "File Reading",
    description: "Create and read a text file",
    level: 4, // Introduced in "Security Breach"
  },
  20: {
    expectedCommands: ["mkdir secure", "chmod 700 secure"],
    title: "Secure Directory",
    description: "Create a directory with restricted permissions",
    level: 4, // Introduced in "Security Breach"
  },
  21: {
    expectedCommands: ["mkdir scripts", "touch scripts/test.sh"],
    title: "Script Setup",
    description: "Create a scripts directory and file",
    level: 12, // Introduced in "Firewall Bypass"
  },
  22: {
    expectedCommands: [
      "echo 'backup' > backup.txt",
      "cp backup.txt backup2.txt",
    ],
    title: "File Copy",
    description: "Create and copy a backup file",
    level: 5, // Introduced in "Data Retrieval"
  },
  23: {
    expectedCommands: ["for i in {1..3}; do touch file$i.txt; done", "ls"],
    title: "Loop Creation",
    description: "Create multiple files using a loop",
    level: 12, // Introduced in "Firewall Bypass"
  },
  24: {
    expectedCommands: ["find . -type f", "ls -R"],
    title: "File Search",
    description: "List all files recursively",
    level: 15, // Introduced in "Rocket Location"
  },
  25: {
    expectedCommands: ["ps | grep node", "ps"],
    title: "Process Search",
    description: "Search for specific processes",
    level: 6, // Introduced in "Power Systems"
  },
  26: {
    expectedCommands: ["mkdir logs", "touch logs/app.log logs/error.log"],
    title: "Multiple Logs",
    description: "Create multiple log files",
    level: 6, // Introduced in "Power Systems"
  },
  27: {
    expectedCommands: ["for f in *.txt; do cp $f $f.bak; done"],
    title: "Batch Backup",
    description: "Create backups of all text files",
    level: 10, // Introduced in "Resource Collection"
  },
  28: {
    expectedCommands: ["mkdir -p web/{css,js}", "touch web/index.html"],
    title: "Web Structure",
    description: "Create a web project structure",
    level: 5, // Introduced in "Data Retrieval"
  },
  29: {
    expectedCommands: ["echo '1,2,3' > data.txt", "cut -d',' -f1 data.txt"],
    title: "Data Processing",
    description: "Process comma-separated data",
    level: 5, // Introduced in "Data Retrieval"
  },
  30: {
    expectedCommands: ["mkdir private", "chmod 700 private"],
    title: "Private Directory",
    description: "Create a private directory",
    level: 4, // Introduced in "Security Breach"
  },
  31: {
    expectedCommands: ["find . -type f -empty", "find . -type d -empty"],
    title: "Empty Find",
    description: "Find empty files and directories",
    level: 15, // Introduced in "Rocket Location"
  },
  32: {
    expectedCommands: ["echo 'test' > file.txt", "cat file.txt"],
    title: "File Content",
    description: "Create and view file content",
    level: 4, // Introduced in "Security Breach"
  },
  33: {
    expectedCommands: ["ln -s file.txt link.txt", "ls -l"],
    title: "Symbolic Link",
    description: "Create a symbolic link",
    level: 10, // Introduced in "Resource Collection"
  },
  34: {
    expectedCommands: ["echo 'export PATH=$PATH:./bin' >> .profile"],
    title: "Path Setup",
    description: "Add directory to PATH",
    level: 16, // Introduced in "Security Bypass"
  },
  35: {
    expectedCommands: ["mkdir test && cd test && touch file.txt"],
    title: "Command Chain",
    description: "Chain multiple commands",
    level: 6, // Introduced in "Power Systems"
  },
  36: {
    expectedCommands: ["find . -type f -exec chmod 644 {} \\;"],
    title: "File Permissions",
    description: "Set file permissions recursively",
    level: 4, // Introduced in "Security Breach"
  },
  37: {
    expectedCommands: ["dd if=/dev/zero of=test bs=1M count=1"],
    title: "File Generation",
    description: "Generate a test file",
    level: 10, // Introduced in "Resource Collection"
  },
  38: {
    expectedCommands: ["cp -r source/. dest/"],
    title: "Directory Copy",
    description: "Copy directory contents",
    level: 10, // Introduced in "Resource Collection"
  },
  39: {
    expectedCommands: ["find . -mtime +7 -type f"],
    title: "Old Files",
    description: "Find files older than 7 days",
    level: 15, // Introduced in "Rocket Location"
  },
  40: {
    expectedCommands: ["ps | sort -k2"],
    title: "Process Sort",
    description: "Sort process list",
    level: 6, // Introduced in "Power Systems"
  },
  41: {
    expectedCommands: ["mkdir -p {dev,test}/app"],
    title: "Dev Setup",
    description: "Create development directories",
    level: 10, // Introduced in "Resource Collection"
  },
  42: {
    expectedCommands: ["echo 'error' > error.log", "grep 'error' *.log"],
    title: "Error Search",
    description: "Search for errors in logs",
    level: 4, // Introduced in "Security Breach"
  },
  43: {
    expectedCommands: ["who", "w"],
    title: "User Check",
    description: "Check current users",
    level: 7, // Introduced in "Communication Array"
  },
  44: {
    expectedCommands: ["du -sh *"],
    title: "Size Check",
    description: "Check directory sizes",
    level: 10, // Introduced in "Resource Collection"
  },
  45: {
    expectedCommands: ["echo $USER", "echo $HOME"],
    title: "Environment",
    description: "Check environment variables",
    level: 16, // Introduced in "Security Bypass"
  },
  46: {
    expectedCommands: ["cp -r src/ backup/"],
    title: "Directory Backup",
    description: "Back up a directory",
    level: 10, // Introduced in "Resource Collection"
  },
  47: {
    expectedCommands: ["mkdir test", "rmdir test"],
    title: "Directory Remove",
    description: "Create and remove directory",
    level: 3, // Introduced in "City Navigation"
  },
  48: {
    expectedCommands: ["find . -type f -print0"],
    title: "Null Handling",
    description: "List files with null separator",
    level: 15, // Introduced in "Rocket Location"
  },
  49: {
    expectedCommands: ["echo 'log entry' >> app.log"],
    title: "Log Entry",
    description: "Append to a log file",
    level: 6, // Introduced in "Power Systems"
  },
  50: {
    expectedCommands: ["mkdir .hidden", "ls -la"],
    title: "Hidden Files",
    description: "Work with hidden files",
    level: 2, // Introduced in "First Contact"
  },
};
// Command reference data
const cheatsheets = {
  basic: [
    { command: "ls", description: "List directory contents" },
    {
      command: "ls -la",
      description: "List detailed contents including hidden files",
    },
    { command: "cd <dir>", description: "Change directory" },
    { command: "cd ..", description: "Move up one directory" },
    { command: "pwd", description: "Print working directory" },
    { command: "mkdir <dir>", description: "Create directory" },
    { command: "mkdir -p <path>", description: "Create nested directories" },
    { command: "touch <file>", description: "Create empty file" },
    { command: "cp <src> <dest>", description: "Copy files/directories" },
    {
      command: "cp -r <src> <dest>",
      description: "Copy directories recursively",
    },
    {
      command: "mv <src> <dest>",
      description: "Move/rename files or directories",
    },
    { command: "rm <file>", description: "Remove files" },
    { command: "rm -r <dir>", description: "Remove directories and contents" },
    { command: "cat <file>", description: "Display file contents" },
    { command: "less <file>", description: "View file contents page by page" },
  ],
  advanced: [
    { command: "grep <pattern> <file>", description: "Search text patterns" },
    {
      command: "grep -r <pattern> <dir>",
      description: "Search recursively in directories",
    },
    {
      command: "find <path> -name <pattern>",
      description: "Search files/dirs",
    },
    {
      command: "find <path> -type f -mtime -7",
      description: "Find files modified in last 7 days",
    },
    {
      command: "chmod <permissions> <file>",
      description: "Change permissions",
    },
    {
      command: "chown <user>:<group> <file>",
      description: "Change file owner and group",
    },
    { command: "ps aux", description: "List running processes" },
    { command: "top", description: "Display system processes in real-time" },
    { command: "kill <pid>", description: "Terminate process" },
    { command: "killall <name>", description: "Kill processes by name" },
    {
      command: "tar -czf <archive> <files>",
      description: "Create gzipped archive",
    },
    { command: "tar -xzf <archive>", description: "Extract gzipped archive" },
    { command: "wget <url>", description: "Download files from the internet" },
    { command: "curl <url>", description: "Transfer data from/to servers" },
    { command: "ssh <user>@<host>", description: "Connect to remote server" },
  ],
  pipes: [
    { command: "| (pipe)", description: "Send output to next command" },
    { command: "> (redirect)", description: "Redirect output to file" },
    { command: ">> (append)", description: "Append output to file" },
    { command: "< (input)", description: "Take input from file" },
    { command: "2> (stderr)", description: "Redirect error output" },
    { command: "&& (and)", description: "Run next if previous succeeds" },
    { command: "|| (or)", description: "Run next if previous fails" },
    { command: "& (background)", description: "Run command in background" },
    {
      command: "tee",
      description: "Read from stdin and write to stdout and files",
    },
    {
      command: "xargs",
      description: "Build command lines from standard input",
    },
  ],
  system: [
    { command: "df -h", description: "Show disk space usage" },
    { command: "du -sh <dir>", description: "Show directory space usage" },
    { command: "free -h", description: "Display memory usage" },
    { command: "uptime", description: "Show system uptime" },
    { command: "uname -a", description: "Show system information" },
    { command: "htop", description: "Interactive process viewer" },
    { command: "netstat -tulpn", description: "List network connections" },
    { command: "ifconfig", description: "Network interface configuration" },
    { command: "ping <host>", description: "Test network connectivity" },
    { command: "traceroute <host>", description: "Trace packet route" },
  ],
  text: [
    {
      command: "sed 's/old/new/g' <file>",
      description: "Stream editor for text manipulation",
    },
    {
      command: "awk '{print $1}' <file>",
      description: "Pattern scanning and text processing",
    },
    { command: "sort <file>", description: "Sort lines in text files" },
    { command: "uniq", description: "Report or filter out repeated lines" },
    { command: "wc -l <file>", description: "Count lines in file" },
    {
      command: "cut -d: -f1 <file>",
      description: "Cut out selected portions of lines",
    },
    {
      command: "diff <file1> <file2>",
      description: "Compare files line by line",
    },
    {
      command: "head -n <num> <file>",
      description: "Output first part of files",
    },
    {
      command: "tail -n <num> <file>",
      description: "Output last part of files",
    },
    {
      command: "tail -f <file>",
      description: "Follow file content as it grows",
    },
  ],
};
// Main BashPlayground Component
export default function BashPlayground() {
  const webContainerRef = useRef(null);
  const terminalRef = useRef(null);
  const terminalContainerRef = useRef(null);
  const inputWriterRef = useRef(null);
  const [activeTab, setActiveTab] = useState("basic");
  const navigate = useNavigate();
  const { history: commandHistory, addHistory } = useBashHistory();
  const { currentLevel, incrementLevel } = useBash();
  const [latestTerminalCommand, setLatestTerminalCommand] = useState("");
  const [commandBuffer, setCommandBuffer] = useState("");
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
  }, [addHistory, commandBuffer, setLatestTerminalCommand]);

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

        {/* Grid lines */}
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
