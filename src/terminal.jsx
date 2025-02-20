import { useEffect, useRef } from "react";
import { WebContainer } from "@webcontainer/api";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

export default function TerminalComponent() {
  const webContainerRef = useRef(null);
  const terminalRef = useRef(null);
  const terminalContainerRef = useRef(null);
  const inputWriterRef = useRef(null); // ✅ Store input writer reference

  useEffect(() => {
    async function startWebContainer() {
      if (webContainerRef.current) return; // ✅ Prevent multiple instances

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
        })
      );

      // ✅ Get writer once and store in ref
      inputWriterRef.current = shell.input.getWriter();

      // ✅ Pipe xterm input → shell (using persistent writer)
      terminalRef.current.onData((input) => {
        if (inputWriterRef.current) {
          inputWriterRef.current.write(input);
        }
      });
    }

    startWebContainer();
  }, []);

  async function createFile() {
    if (!webContainerRef.current) return;
    await webContainerRef.current.fs.writeFile(
      "script.sh",
      `#!/bin/bash\necho "Hello from Web Bash!"\nls\n`
    );
    terminalRef.current.writeln(
      "\n✅ Created script.sh. Type 'cat script.sh' to view it."
    );
  }

  async function runScript() {
    if (!webContainerRef.current) return;
    await webContainerRef.current.spawn("chmod", ["+x", "/home/user/script.sh"]);
    const scriptProcess = await webContainerRef.current.spawn("bash", [
      "script.sh",
    ]);
    scriptProcess.output.pipeTo(
      new WritableStream({
        write(chunk) {
          terminalRef.current.write(chunk);
        },
      })
    );
  }

  return (
    <div>
      <h2>Bash Terminal</h2>
      <div
        ref={terminalContainerRef}
        style={{
          width: "80%",
          height: "400px",
          border: "1px solid black",
          background: "#000",
        }}
      />
      <button onClick={createFile}>Create Script</button>
      <button onClick={runScript}>Run Script</button>
    </div>
  );
}
