import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, ChevronRight, Loader2, Rocket, XCircle } from "lucide-react";
import { useLevelProgress } from "./useLevelProgress";
import MissionLesson from "./components/MissionLesson";
import PythonEditor from "./components/PythonEditor";
import { usePyodide } from "./usePyodide";
import { runQuestionTests } from "./pythonTestRunner";
import lessons from "./data/pythonLessons.json";

export default function PythonLesson() {
  const { level } = useParams();
  const navigate = useNavigate();
  const { currentLevel, setCurrentLevel } = useLevelProgress("pythonCurrentLevel");

  const lessonId = Number(level) || 1;
  const lesson = lessons.find((l) => l.id === lessonId) || lessons[0];
  const nextLesson = lessons.find((l) => l.id === lesson.id + 1);

  const { pyodide, loading, error: pyodideError } = usePyodide();
  const [code, setCode] = useState(lesson.code);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState(null);
  const [results, setResults] = useState([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCode(lesson.code);
    setResults([]);
    setRunError(null);
    setCompleted(false);
  }, [lesson]);

  const handleRun = async () => {
    if (!pyodide) return;
    setRunning(true);
    setRunError(null);
    try {
      const { results: testResults, allPassed } = await runQuestionTests(pyodide, lesson, code);
      setResults(testResults);
      if (allPassed) {
        setCompleted(true);
        setCurrentLevel((prev) => Math.max(prev, lesson.id + 1));
      }
    } catch (err) {
      setRunError(err.message);
    } finally {
      setRunning(false);
    }
  };

  const isLocked = lesson.id > currentLevel;

  return (
    <MissionLesson
      lesson={lesson}
      levelLabel={`Level ${lesson.id} of ${lessons.length}`}
      icon={<Rocket className="w-5 h-5 text-white" />}
      mapRoute="/python"
      completed={completed}
      onNext={() => navigate(nextLesson ? `/python/${nextLesson.id}` : "/python")}
      nextLabel={nextLesson ? "Next level" : "Mission complete"}
      finalLabel="Mission complete"
      isLocked={isLocked}
      lockedMessage={`This level is still locked. Finish level ${currentLevel} first.`}
    >
      <div className="space-y-4">
        <PythonEditor value={code} onChange={setCode} height={420} />

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

            {completed && (
              <div className="flex items-center justify-center gap-2 text-emerald-300 text-sm font-medium py-1">
                All tests passed <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>
        )}
      </div>
    </MissionLesson>
  );
}
