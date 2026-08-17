/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, Lightbulb, Map } from "lucide-react";
import CityBackdrop from "./CityBackdrop";

const FIRST_HINT_DELAY_MS = 60000;
const NEXT_HINT_COOLDOWN_MS = 30000;

// The shared lesson-page shell behind Bash, Python, Lua and Java: header,
// briefing/objective panels, gated hints, and the completion banner. The
// actual interactive area (terminal, code editor, ...) is passed as
// children, and "how do we know the mission is done" stays owned by the
// caller — Bash polls live shell state, the code-editor tracks stay
// check on-run, and those two things don't unify cleanly.
export default function MissionLesson({
  lesson,
  levelLabel,
  icon,
  mapRoute,
  completed,
  onNext,
  nextLabel = "Next level",
  finalLabel = "Mission complete",
  isLocked,
  lockedMessage,
  children,
}) {
  const navigate = useNavigate();
  const [hintsShown, setHintsShown] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [levelStartedAt, setLevelStartedAt] = useState(Date.now());
  const [lastHintAt, setLastHintAt] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setHintsShown(0);
    setShowHints(false);
    setLevelStartedAt(Date.now());
    setLastHintAt(null);
  }, [lesson.id]);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  const firstHintRemaining = Math.max(0, Math.ceil((FIRST_HINT_DELAY_MS - (now - levelStartedAt)) / 1000));
  const nextHintRemaining = lastHintAt
    ? Math.max(0, Math.ceil((NEXT_HINT_COOLDOWN_MS - (now - lastHintAt)) / 1000))
    : 0;

  const revealNextHint = () => {
    setHintsShown((n) => n + 1);
    setShowHints(true);
    setLastHintAt(Date.now());
  };

  return (
    <div className="relative min-h-screen text-slate-200">
      <CityBackdrop />

      <header className="relative z-10 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow shadow-cyan-500/30">
              {icon}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-cyan-400/80 font-medium">{levelLabel}</div>
              <h1 className="text-lg font-bold text-slate-100 leading-tight">{lesson.title}</h1>
            </div>
          </div>
          <button
            onClick={() => navigate(mapRoute)}
            className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-600/60 rounded-md px-3 py-1.5 transition-colors"
          >
            <Map className="w-4 h-4" /> Map
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
            {lesson.briefing.map((p, i) => (
              <p key={i} className="text-sm text-slate-300 leading-relaxed mb-3 last:mb-0">
                {p}
              </p>
            ))}
          </div>

          <div className="rounded-lg border border-cyan-800/40 bg-cyan-950/20 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-cyan-400 mb-1.5">Objective</h2>
            <p className="text-sm text-slate-200 leading-relaxed">{lesson.objective}</p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            {hintsShown === 0 ? (
              <button
                onClick={revealNextHint}
                disabled={firstHintRemaining > 0}
                className="flex items-center gap-2 text-sm font-medium text-amber-400 enabled:hover:text-amber-300 disabled:text-slate-600 disabled:cursor-not-allowed"
              >
                <Lightbulb className="w-4 h-4" />
                {firstHintRemaining > 0 ? `Hint available in ${firstHintRemaining}s` : "Need a hint?"}
              </button>
            ) : (
              <button
                onClick={() => setShowHints((v) => !v)}
                className="flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300"
              >
                <Lightbulb className="w-4 h-4" />
                {showHints ? "Hide hints" : `Show hint${hintsShown > 1 ? "s" : ""}`}
              </button>
            )}
            {showHints && hintsShown > 0 && (
              <div className="mt-3 space-y-2">
                {lesson.hints.slice(0, hintsShown).map((hint, i) => (
                  <p key={i} className="text-xs text-amber-100/90 bg-amber-500/10 border border-amber-700/30 rounded px-3 py-2">
                    {hint}
                  </p>
                ))}
                {hintsShown < lesson.hints.length && (
                  <button
                    onClick={revealNextHint}
                    disabled={nextHintRemaining > 0}
                    className="text-xs text-amber-400 enabled:hover:text-amber-300 disabled:text-slate-600 disabled:cursor-not-allowed"
                  >
                    {nextHintRemaining > 0 ? `Another hint in ${nextHintRemaining}s` : "Another hint"}
                  </button>
                )}
              </div>
            )}
          </div>

          <div
            className={`rounded-lg border p-4 flex items-center justify-between transition-colors ${
              completed ? "border-emerald-700/50 bg-emerald-950/30" : "border-slate-800 bg-slate-900/60"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-5 h-5 ${completed ? "text-emerald-400" : "text-slate-600"}`} />
              <span className={`text-sm font-medium ${completed ? "text-emerald-300" : "text-slate-500"}`}>
                {completed ? "Objective complete" : "In progress"}
              </span>
            </div>
            {completed && (
              <button
                onClick={onNext}
                className="flex items-center gap-1 text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1.5 rounded-md hover:from-cyan-400 hover:to-blue-500 transition-colors"
              >
                {nextLabel} {nextLabel === finalLabel ? null : <ChevronRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        </section>

        <section className="lg:col-span-3">
          {isLocked ? (
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400 text-sm">
              {lockedMessage}
            </div>
          ) : (
            children
          )}
        </section>
      </main>
    </div>
  );
}
