/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { lua } from "@codemirror/legacy-modes/mode/lua";

const luaLanguage = StreamLanguage.define(lua);

export default function LuaEditor({ value, onChange, height = 320 }) {
  return (
    <div className="rounded-lg overflow-hidden border border-slate-700/60 bg-[#0b0f16]">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/80 border-b border-slate-700/60">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        <span className="ml-3 text-[11px] font-mono text-slate-400">solution.lua</span>
      </div>
      <CodeMirror
        value={value}
        height={`${height}px`}
        theme="dark"
        extensions={[luaLanguage]}
        onChange={onChange}
        basicSetup={{ tabSize: 2, indentOnInput: true }}
        style={{ fontSize: 13 }}
      />
    </div>
  );
}
