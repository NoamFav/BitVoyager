/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";

// Tokyo Night — same palette as the Playground's real WebContainer terminal,
// so the lesson terminal and the playground terminal look like one product.
const THEME = {
  background: "#1a1b26",
  foreground: "#a9b1d6",
  cursor: "#f7768e",
  selectionBackground: "#283457",
  black: "#32344a",
  red: "#f7768e",
  green: "#9ece6a",
  yellow: "#e0af68",
  blue: "#7aa2f7",
  magenta: "#bb9af7",
  cyan: "#7dcfff",
  white: "#a9b1d6",
  brightBlack: "#565f89",
};

const KEY_ENTER = "\r";
const KEY_BACKSPACE = "\x7f";
const KEY_CTRL_C = "\x03";
const KEY_UP = "\x1b[A";
const KEY_DOWN = "\x1b[B";

// A genuinely small, real terminal: xterm.js rendering, wired to a Shell
// instance that actually parses and executes each line. No canned output.
export default function TerminalView({ shell, prompt, onLine, height = 380, className = "" }) {
  const containerRef = useRef(null);
  const termRef = useRef(null);
  const fitAddonRef = useRef(null);
  const lineRef = useRef("");
  const historyIndexRef = useRef(-1);
  const lockedRef = useRef(false);

  const writePrompt = () => {
    termRef.current?.write(`\r\n${prompt(shell)}`);
  };

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: "bar",
      fontSize: 14,
      lineHeight: 1.3,
      fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace",
      theme: THEME,
      convertEol: true,
      scrollback: 2000,
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    termRef.current = term;
    fitAddonRef.current = fitAddon;

    if (containerRef.current) term.open(containerRef.current);

    // xterm's renderer measures its own dimensions asynchronously after
    // open() — fitting/writing before the first paint frame throws inside
    // xterm's own Viewport code, not just FitAddon.
    requestAnimationFrame(() => {
      try {
        fitAddon.fit();
      } catch {
        // container not yet laid out — the resize observer below catches up
      }
      term.focus();
      term.writeln("\x1b[90mNEXUS-9 emergency terminal ready.\x1b[0m");
      term.write(prompt(shell));
    });

    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.fit();
      } catch {
        // container not yet measurable (e.g. mid-unmount) — ignore
      }
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    term.onData(async (data) => {
      if (lockedRef.current) return;

      if (data === KEY_ENTER) {
        const line = lineRef.current;
        lineRef.current = "";
        historyIndexRef.current = -1;
        term.write("\r\n");
        if (line.trim()) {
          const result = await shell.execute(line);
          if (result.clear) {
            term.clear();
          } else if (result.output) {
            term.write(result.output.replace(/\n/g, "\r\n"));
          }
          onLine?.(line, result);
          if (result.exit) {
            lockedRef.current = true;
            term.write("\r\n\x1b[90m[session closed]\x1b[0m");
            return;
          }
        }
        writePrompt();
        return;
      }

      if (data === KEY_BACKSPACE) {
        if (lineRef.current.length > 0) {
          lineRef.current = lineRef.current.slice(0, -1);
          term.write("\b \b");
        }
        return;
      }

      if (data === KEY_CTRL_C) {
        lineRef.current = "";
        term.write("^C");
        writePrompt();
        return;
      }

      if (data === KEY_UP) {
        const hist = shell.history;
        if (hist.length === 0) return;
        const nextIndex =
          historyIndexRef.current === -1 ? hist.length - 1 : Math.max(0, historyIndexRef.current - 1);
        historyIndexRef.current = nextIndex;
        const entry = hist[nextIndex] || "";
        term.write("\r\x1b[K" + prompt(shell) + entry);
        lineRef.current = entry;
        return;
      }

      if (data === KEY_DOWN) {
        const hist = shell.history;
        if (historyIndexRef.current === -1) return;
        const nextIndex = historyIndexRef.current + 1;
        if (nextIndex >= hist.length) {
          historyIndexRef.current = -1;
          term.write("\r\x1b[K" + prompt(shell));
          lineRef.current = "";
          return;
        }
        historyIndexRef.current = nextIndex;
        const entry = hist[nextIndex] || "";
        term.write("\r\x1b[K" + prompt(shell) + entry);
        lineRef.current = entry;
        return;
      }

      if (data.charCodeAt(0) < 32) return; // swallow other control sequences

      lineRef.current += data;
      term.write(data);
    });

    return () => {
      resizeObserver.disconnect();
      term.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`rounded-lg overflow-hidden border border-cyan-500/30 bg-[#1a1b26] shadow-lg shadow-cyan-950/40 ${className}`}
      onClick={() => termRef.current?.focus()}
    >
      <div className="flex items-center gap-1.5 px-3 py-2 bg-black/20 border-b border-cyan-500/20">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        <span className="ml-3 text-[11px] font-mono text-slate-400">bash</span>
      </div>
      <div ref={containerRef} style={{ height }} className="p-2" />
    </div>
  );
}
