/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

// A real code editor (CodeMirror) instead of a hand-rolled textarea +
// syntax-highlight overlay. Chrome matches TerminalView for visual
// consistency between the Bash and Python modules.
export default function PythonEditor({ value, onChange, height = 320 }) {
  return (
    <div className="rounded-lg overflow-hidden border border-slate-700/60 bg-[#0b0f16]">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/80 border-b border-slate-700/60">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        <span className="ml-3 text-[11px] font-mono text-slate-400">solution.py</span>
      </div>
      <CodeMirror
        value={value}
        height={`${height}px`}
        theme="dark"
        extensions={[python()]}
        onChange={onChange}
        basicSetup={{ tabSize: 4, indentOnInput: true }}
        style={{ fontSize: 13 }}
      />
    </div>
  );
}
