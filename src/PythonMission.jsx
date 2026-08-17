/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, Loader2, Rocket, SkipForward, XCircle } from "lucide-react";
import CityBackdrop from "./components/CityBackdrop";
import PythonEditor from "./components/PythonEditor";
import { usePyodide } from "./usePyodide";
import { runQuestionTests } from "./pythonTestRunner";

const DIFFICULTY_STYLE = {
  easy: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
  medium: "bg-amber-900/40 text-amber-300 border-amber-700/40",
  hard: "bg-red-900/40 text-red-300 border-red-700/40",
};

export default function PythonMission({ question, progressInfo, onComplete, onSkip, onAttempt }) {
  const navigate = useNavigate();
  const { pyodide, loading, error: pyodideError } = usePyodide();

  const [code, setCode] = useState(question.code);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState(null);
  const [results, setResults] = useState([]);
  const [allPassed, setAllPassed] = useState(null);

  useEffect(() => {
    setCode(question.code);
    setResults([]);
    setAllPassed(null);
    setRunError(null);
  }, [question]);

  const handleRun = async () => {
    if (!pyodide) return;
    setRunning(true);
    setRunError(null);
    try {
      const { results: testResults, allPassed: passed } = await runQuestionTests(pyodide, question, code);
      setResults(testResults);
      setAllPassed(passed);
    } catch (err) {
      setRunError(err.message);
      setAllPassed(false);
    } finally {
      setRunning(false);
      onAttempt?.();
    }
  };

  return (
    <div className="relative min-h-screen text-slate-200">
      <CityBackdrop />

      <header className="relative z-10 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow shadow-cyan-500/30">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-cyan-400/80 font-medium">
                Mission {progressInfo.current} of {progressInfo.total}
              </div>
              <h1 className="text-lg font-bold text-slate-100 leading-tight">{question.functionName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${DIFFICULTY_STYLE[question.difficulty]}`}>
              {question.difficulty}
            </span>
            <button
              onClick={() => navigate("/")}
              className="text-sm text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-600/60 rounded-md px-3 py-1.5 transition-colors"
            >
              Home
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-300 leading-relaxed">{question.question}</p>
          </div>

          <div className="rounded-lg border border-cyan-800/40 bg-cyan-950/20 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-cyan-400 mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <span key={tag} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {(progressInfo.attempts > 0 || progressInfo.isRetry || progressInfo.previouslyFailed) && (
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-2 text-xs">
              {progressInfo.attempts > 0 && (
                <div className="text-slate-400">Attempts this mission: {progressInfo.attempts}</div>
              )}
              {progressInfo.isRetry && <div className="text-purple-300">You skipped this one before — another shot at it.</div>}
              {progressInfo.previouslyFailed && (
                <div className="text-red-300">
                  Previous failed attempts: {progressInfo.userProfile?.failedAttempts?.[question.id] || 0}
                </div>
              )}
            </div>
          )}

          <button
            onClick={onSkip}
            className="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-600 rounded-md px-3 py-2 transition-colors"
          >
            <SkipForward className="w-4 h-4" /> Skip this mission
          </button>
        </section>

        <section className="lg:col-span-3 space-y-4">
          <PythonEditor value={code} onChange={setCode} height={340} />

          <button
            onClick={handleRun}
            disabled={loading || running}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-md transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Loading Python runtime…
              </>
            ) : running ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Running tests…
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" /> Run tests
              </>
            )}
          </button>

          {(pyodideError || runError) && (
            <div className="rounded-lg border border-red-800/50 bg-red-950/30 p-4 text-sm text-red-300 flex items-start gap-2">
              <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{pyodideError || runError}</span>
            </div>
          )}

          {results.length > 0 && (
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-3">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`rounded-md border px-3 py-2 text-xs ${
                    r.passed ? "border-emerald-800/40 bg-emerald-950/20" : "border-red-800/40 bg-red-950/20"
                  }`}
                >
                  <div className={`flex items-center gap-2 font-medium mb-1 ${r.passed ? "text-emerald-300" : "text-red-300"}`}>
                    {r.passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    Test {i + 1}
                  </div>
                  {!r.passed && (
                    <div className="text-slate-400 space-y-0.5 font-mono">
                      <div>input: {JSON.stringify(r.input)}</div>
                      <div>expected: {r.expectedOutput}</div>
                      <div>got: {r.actualOutput}</div>
                    </div>
                  )}
                </div>
              ))}

              {allPassed && (
                <button
                  onClick={onComplete}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium py-2.5 rounded-md transition-colors"
                >
                  All tests passed — next mission <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
