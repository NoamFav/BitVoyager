/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

// Extracted from Home.jsx so the Courses page can show the exact same
// cards instead of re-implementing them.
export default function LanguageCard({ lang, isHovered, onHoverStart, onHoverEnd }) {
  const available = lang.available;

  return (
    <div
      className={`group relative flex flex-col w-72 flex-shrink-0 rounded-xl border p-6 transition-all duration-300 ${
        available
          ? "bg-gradient-to-b from-slate-900 to-cyan-950/10 border-cyan-800/40"
          : "bg-slate-900/40 border-slate-800"
      } ${isHovered && available ? "-translate-y-1 border-cyan-500/60 shadow-xl shadow-cyan-950/40" : ""}`}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center border ${
            available ? "bg-cyan-500/10 border-cyan-500/30" : "bg-slate-800/60 border-slate-700"
          }`}
        >
          <img src={lang.image} alt={`${lang.name} logo`} className={`w-7 h-7 ${available ? "" : "opacity-50 grayscale"}`} />
        </div>

        <span
          className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${
            available ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-800 text-slate-500"
          }`}
        >
          {available ? "Available" : "Coming soon"}
        </span>
      </div>

      <h3 className={`text-lg font-bold mb-1.5 ${available ? "text-slate-100" : "text-slate-400"}`}>{lang.name}</h3>
      <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-6">{lang.description}</p>

      <div className="mt-auto">
        {available ? (
          <Link
            to={lang.href}
            className="relative w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-md font-medium hover:from-blue-500 hover:to-cyan-500 transition-colors overflow-hidden group/cta"
          >
            <span className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <span className="relative">Start Learning</span>
            <svg className="relative w-4 h-4 cta-arrow-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md border border-slate-800 text-slate-600 text-sm font-medium">
            <Lock className="w-3.5 h-3.5" />
            Not available yet
          </div>
        )}
      </div>
    </div>
  );
}
