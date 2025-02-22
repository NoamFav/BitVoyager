import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PythonQuestion from "./PythonQuestion";

import { RefreshCw, Rocket, Star, Trophy, XCircle } from "lucide-react";
import PythonQuestionRenderer from "./PythonQuestionRenderer.jsx";

const DIFFICULTY_ORDER = ["easy", "medium", "hard"];

const initializeQuestions = () => {
  console.log("Initializing questions...");
  // Group by difficulty and select one from each level
  try {
    const selected = DIFFICULTY_ORDER.map((difficulty) => {
      const difficultyQuestions = PythonQuestion(difficulty);
      console.log(`${difficulty} questions:`, difficultyQuestions);

      if (difficultyQuestions.length === 0) {
        throw new Error(`No questions found for difficulty: ${difficulty}`);
      }

      const randomIndex = Math.floor(
        Math.random() * difficultyQuestions.length,
      );
      const index = difficultyQuestions[randomIndex];
      console.log("Selected question " + index);
      return PythonQuestion(index);
    });
    return { questions: selected, error: null };
  } catch (error) {
    return { questions: [], error: error.message };
  }
};

const Python = () => {
  // Initialize questions immediately
  const { questions: initialQuestions, error: initError } =
    initializeQuestions();

  console.log(initialQuestions);
  console.log(initError);

  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [missionComplete, setMissionComplete] = useState(false);
  const [selectedQuestions] = useState(initialQuestions);
  const [error] = useState(initError);
  const [completedDifficulties, setCompletedDifficulties] = useState([]);

  console.log(selectedQuestions);
  console.log(currentMissionIndex);

  const handleMissionComplete = useCallback((completed = false) => {
    if (currentMissionIndex < selectedQuestions.length - 1) {
      // Only mark as completed if the user actually completed it
      if (completed) {
        setCompletedDifficulties(
          (prev) => [...prev, DIFFICULTY_ORDER[currentMissionIndex]],
        );
      }
      setCurrentMissionIndex((prev) => prev + 1);
    } else {
      if (completed) {
        setCompletedDifficulties(
          (prev) => [...prev, DIFFICULTY_ORDER[currentMissionIndex]],
        );
      }
      setMissionComplete(true);
    }
  }, [
    currentMissionIndex,
    selectedQuestions.length,
    completedDifficulties.length,
  ]);

  const currentQuestion = useMemo(
    () => selectedQuestions[currentMissionIndex],
    [selectedQuestions, currentMissionIndex],
  );

  console.log(currentQuestion);

  if (error) {
    return (
      <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl text-white font-bold">
            Mission Initialization Failed
          </h2>
          <p className="text-red-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Retry Mission</span>
          </button>
        </div>
      </div>
    );
  }

  if (missionComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-95">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <Trophy className="w-32 h-32 text-yellow-400 animate-bounce" />
              <div className="absolute inset-0 animate-ping">
                <Trophy className="w-32 h-32 text-yellow-400 opacity-50" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white">Mission Complete!</h1>
          <p className="text-xl text-blue-300">
            You've completed your mission! Take some time to rest.
          </p>

          <div className="flex justify-center space-x-4">
            {DIFFICULTY_ORDER.map((difficulty) => (
              <div
                key={difficulty}
                className={`p-4 rounded-lg border flex flex-col items-center space-y-2 ${
                  difficulty === "easy"
                    ? "border-green-500 text-green-400"
                    : difficulty === "medium"
                    ? "border-yellow-500 text-yellow-400"
                    : "border-red-500 text-red-400"
                }`}
              >
                {completedDifficulties.includes(difficulty)
                  ? <Star className="w-6 h-6" fill="currentColor" />
                  : <Star className="w-6 h-6" />}
                <p className="capitalize">{difficulty}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto group"
          >
            <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span>Start New Journey</span>
          </button>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            >
              <Star
                className="text-yellow-200 opacity-70"
                size={Math.random() * 16 + 8}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Only render Python component if we have a current question
  if (!currentQuestion) {
    return (
      <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <p className="text-red-300 text-xl">
            No question available. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PythonQuestionRenderer
      key={currentMissionIndex} // Add a key to force remount
      question={currentQuestion}
      onMissionComplete={handleMissionComplete}
      progressInfo={{
        current: currentMissionIndex + 1,
        total: selectedQuestions.length,
        difficulty: DIFFICULTY_ORDER[currentMissionIndex],
        completedDifficulties,
      }}
    />
  );
};

export default Python;
