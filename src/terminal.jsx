import { useEffect, useRef } from "react";
import { WebContainer } from "@webcontainer/api";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

import { VimWasm } from "vim-wasm";
export default function TerminalComponent() {
  const webContainerRef = useRef(null);
  const terminalRef = useRef(null);
  const terminalContainerRef = useRef(null);
  const inputWriterRef = useRef(null);

  const vimRef = useRef(null); // Will store the Vim instance
  const vimContainerRef = useRef(null); // The DOM container for Vim’s UI

  useEffect(() => {
    async function startWebContainer() {
      if (webContainerRef.current) return; // Prevent multiple instances

      // Initialize Xterm if needed
      if (!terminalRef.current) {
        terminalRef.current = new Terminal({
          cursorBlink: true,
          fontSize: 14,
          theme: {
            background: "#1e1e1e",
            foreground: "#ffffff",
          },
        });
        if (terminalContainerRef.current) {
          terminalRef.current.open(terminalContainerRef.current);
        }
      }

      // Boot WebContainer
      webContainerRef.current = await WebContainer.boot();

      // Spawn a bash shell
      const shell = await webContainerRef.current.spawn("bash", {
        terminal: { cols: 80, rows: 25 },
      });

      // Pipe shell output → xterm
      shell.output.pipeTo(
        new WritableStream({
          write(chunk) {
            terminalRef.current.write(chunk);
          },
        }),
      );

      // Store shell input writer
      inputWriterRef.current = shell.input.getWriter();

      // Pipe xterm input → shell
      terminalRef.current.onData((input) => {
        if (inputWriterRef.current) {
          inputWriterRef.current.write(input);
        }
      });
    }

    startWebContainer();
  }, []);

  /** Create a sample file in WebContainer */
  async function createFile() {
    if (!webContainerRef.current) return;
    await webContainerRef.current.fs.writeFile(
      "script.sh",
      `#!/bin/bash\necho "Hello from Web Bash!"\nls\n`,
    );
    terminalRef.current.writeln(
      "\n✅ Created script.sh. Type 'cat script.sh' to view it.",
    );
  }

  /** Run the script in WebContainer */
  async function runScript() {
    if (!webContainerRef.current) return;
    await webContainerRef.current.spawn("chmod", [
      "+x",
      "/home/user/script.sh",
    ]);
    const scriptProcess = await webContainerRef.current.spawn("bash", [
      "script.sh",
    ]);
    scriptProcess.output.pipeTo(
      new WritableStream({
        write(chunk) {
          terminalRef.current.write(chunk);
        },
      }),
    );
  }
  /**
   * Load and start vim-wasm in a separate <div>.
   */
  async function startVimWasm() {
    // Avoid re-initializing if it's already running
    if (vimRef.current) {
      return;
    }

    // 1) Create the Vim instance
    const vim = new VimWasm({
      workerScriptPath: "/vim.js", // must match where vim.js is served
      wasmPath: "/vim.wasm", // must match where vim.wasm is served
    });
    vimRef.current = vim;

    vim.onVimInit = () => {
      vim.open(vimContainerRef.current);
    };

    vim.start();
  }

  return (
    <section>
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-6">
        {/* Heading + Buttons in one row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Bash Terminal
          </h2>

          {/* Buttons */}
          <div className="mt-2 md:mt-0 flex space-x-4">
            <button
              onClick={createFile}
              className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors duration-300"
            >
              Create Script
            </button>
            <button
              onClick={runScript}
              className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors duration-300"
            >
              Run Script
            </button>

            {/* New button to launch WASM-based Vim */}
            <button
              onClick={startVimWasm}
              className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors duration-300"
            >
              Start Vim-WASM
            </button>
          </div>
        </div>

        {/* Row with the Terminal and Vim side-by-side (optional layout) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Terminal */}
          <div
            ref={terminalContainerRef}
            className="w-full h-96 border border-gray-700 bg-black rounded-md shadow-inner"
          />

          {/* Vim WASM container */}
          <div
            ref={vimContainerRef}
            className="w-full h-96 border border-gray-700 bg-black rounded-md relative"
          >
            {/* vim-wasm will render inside this <div> */}
            <p className="text-white p-2">
              Vim WASM will appear here when you click &quot;Start
              Vim-WASM&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
