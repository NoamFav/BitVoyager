import { useEffect, useState } from "react";
import { RefreshCw, Rocket, Star, Trophy, XCircle } from "lucide-react";
import PythonModeSelect from "./PythonModeSelect";
import PythonMission from "./PythonMission";
import CityBackdrop from "./components/CityBackdrop";
import questions from "./data/pythonQuestions.json";
import { getUserProfile, saveUserProfile, selectQuestions, updateSkillLevels } from "./pythonProfile";

const DIFFICULTY_ORDER = ["easy", "medium", "hard"];

function Python() {
  const [mode, setMode] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [missionIndex, setMissionIndex] = useState(0);
  const [missionComplete, setMissionComplete] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [completedDifficulties, setCompletedDifficulties] = useState([]);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!mode) return;

    const profile = mode === "learning" ? getUserProfile() : null;
    setUserProfile(profile);

    const picked = selectQuestions(mode, profile, questions);
    if (!picked) {
      setError("Could not find enough suitable missions. Try the other mode.");
      return;
    }
    setSelectedQuestions(picked);
  }, [mode]);

  const currentQuestion = selectedQuestions[missionIndex];

  const advance = () => {
    if (missionIndex < selectedQuestions.length - 1) {
      setMissionIndex((i) => i + 1);
      setAttempts(0);
    } else {
      setMissionComplete(true);
    }
  };

  const handleComplete = () => {
    if (mode === "standard") {
      setCompletedDifficulties((prev) => [...prev, DIFFICULTY_ORDER[missionIndex]]);
      advance();
      return;
    }

    const updated = updateSkillLevels(userProfile, currentQuestion, true, Math.max(1, attempts), false);
    updated.completedQuestions = [...updated.completedQuestions, currentQuestion.id];
    saveUserProfile(updated);
    setUserProfile(updated);
    advance();
  };

  const handleSkip = () => {
    if (mode === "learning" && userProfile) {
      const updated = updateSkillLevels(userProfile, currentQuestion, false, 0, true);
      saveUserProfile(updated);
      setUserProfile(updated);
    }
    advance();
  };

  if (!mode) return <PythonModeSelect onModeSelect={setMode} />;

  if (error) {
    return (
      <div className="relative min-h-screen flex items-center justify-center text-slate-200">
        <CityBackdrop />
        <div className="relative z-10 text-center space-y-4 max-w-md mx-auto p-6">
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl text-white font-bold">Mission Initialization Failed</h2>
          <p className="text-red-300 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (missionComplete) {
    return (
      <div className="relative min-h-screen flex items-center justify-center text-slate-200">
        <CityBackdrop />
        <div className="relative z-10 text-center space-y-8">
          <Trophy className="w-24 h-24 text-amber-400 mx-auto" />
          <h1 className="text-4xl font-bold text-white">Mission Complete!</h1>

          {mode === "standard" && (
            <div className="flex justify-center gap-4">
              {DIFFICULTY_ORDER.map((difficulty) => (
                <div
                  key={difficulty}
                  className="p-4 rounded-lg border border-slate-700 flex flex-col items-center gap-2 text-slate-300"
                >
                  <Star
                    className={`w-6 h-6 ${completedDifficulties.includes(difficulty) ? "text-amber-400" : "text-slate-600"}`}
                    fill={completedDifficulties.includes(difficulty) ? "currentColor" : "none"}
                  />
                  <p className="capitalize text-sm">{difficulty}</p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md inline-flex items-center gap-2 group"
          >
            <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="relative min-h-screen flex items-center justify-center text-slate-200">
        <CityBackdrop />
        <div className="relative z-10 text-center space-y-4">
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <p className="text-red-300">No mission available. Please refresh.</p>
        </div>
      </div>
    );
  }

  return (
    <PythonMission
      key={currentQuestion.id}
      question={currentQuestion}
      onComplete={handleComplete}
      onSkip={handleSkip}
      onAttempt={() => setAttempts((a) => a + 1)}
      progressInfo={{
        current: missionIndex + 1,
        total: selectedQuestions.length,
        attempts,
        userProfile,
        isRetry: mode === "learning" && userProfile?.skippedQuestions?.includes(currentQuestion.id),
        previouslyFailed: mode === "learning" && (userProfile?.failedAttempts?.[currentQuestion.id] || 0) > 0,
      }}
    />
  );
}

export default Python;
