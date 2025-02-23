import React, { useEffect, useState } from "react";
import {
  getUserProfile,
  ModeSelection,
  saveUserProfile,
  selectQuestions,
  updateSkillLevels,
} from "./LearningModePython";
import PythonQuestion from "./PythonQuestion";
import PythonQuestionRenderer from "./PythonQuestionRenderer";
import { RefreshCw, Rocket, Star, Trophy, XCircle } from "lucide-react";

const DIFFICULTY_ORDER = ["easy", "medium", "hard"];

const initializeQuestions = (mode, userProfile = null) => {
  try {
    // Get all questions
    const allQuestions = {};
    for (let i = 1; i <= 29; i++) {
      try {
        allQuestions[i] = PythonQuestion(i);
      } catch (e) {
        console.warn(`Could not load question ${i}:`, e);
      }
    }

    // Select questions based on mode
    const selectedQuestions = selectQuestions(mode, userProfile, allQuestions);

    if (!selectedQuestions) {
      throw new Error("Could not find enough suitable questions");
    }

    return {
      questions: selectedQuestions,
      allQuestions,
      error: null,
    };
  } catch (error) {
    return { questions: [], allQuestions: {}, error: error.message };
  }
};

const Python = () => {
  const [mode, setMode] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [missionComplete, setMissionComplete] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState({});
  const [error, setError] = useState(null);
  const [completedDifficulties, setCompletedDifficulties] = useState([]);
  const [currentAttempts, setCurrentAttempts] = useState(0);

  // Initialize based on selected mode
  useEffect(() => {
    if (!mode) return;

    let profile = null;
    if (mode === "learning") {
      profile = getUserProfile();
      setUserProfile(profile);
    }

    const { questions, allQuestions, error } = initializeQuestions(
      mode,
      profile,
    );
    setSelectedQuestions(questions);
    setAllQuestions(allQuestions);
    setError(error);
  }, [mode]);

  const handleMissionComplete = (completed = false, skipped = false) => {
    if (mode === "standard") {
      handleStandardModeComplete(completed);
    } else {
      handleLearningModeComplete(completed, skipped);
    }
  };

  const handleStandardModeComplete = (completed) => {
    if (currentMissionIndex < selectedQuestions.length - 1) {
      if (completed) {
        setCompletedDifficulties(
          (prev) => [...prev, DIFFICULTY_ORDER[currentMissionIndex]],
        );
      }
      setCurrentMissionIndex((prev) => prev + 1);
      setCurrentAttempts(0); // Reset attempts for new question
    } else {
      if (completed) {
        setCompletedDifficulties(
          (prev) => [...prev, DIFFICULTY_ORDER[currentMissionIndex]],
        );
      }
      setMissionComplete(true);
    }
  };

  const handleLearningModeComplete = (completed, skipped = false) => {
    if (!userProfile || !selectedQuestions[currentMissionIndex]) return;

    const currentQuestion = selectedQuestions[currentMissionIndex];
    const attempts = skipped ? 0 : currentAttempts + 1;

    // Update profile with current question result
    const updatedProfile = updateSkillLevels(
      userProfile,
      currentQuestion,
      completed,
      attempts,
      skipped,
    );

    if (completed) {
      updatedProfile.completedQuestions.push(currentQuestion.id);
    }

    // Save updated profile
    saveUserProfile(updatedProfile);
    setUserProfile(updatedProfile);

    if (currentMissionIndex < selectedQuestions.length - 1) {
      // Move to next question
      setCurrentMissionIndex((prev) => prev + 1);
      setCurrentAttempts(0); // Reset attempts for new question
    } else {
      // Update streak
      const today = new Date().toDateString();
      if (updatedProfile.lastSessionDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (updatedProfile.lastSessionDate === yesterday.toDateString()) {
          updatedProfile.consecutiveDays += 1;
        } else {
          updatedProfile.consecutiveDays = 1;
        }
        updatedProfile.lastSessionDate = today;
        saveUserProfile(updatedProfile);
      }

      setMissionComplete(true);
    }
  };

  const handleTestAttempt = (success) => {
    setCurrentAttempts((prev) => prev + 1);
    if (success) {
      handleMissionComplete(true, false);
    }
  };

  const handleSkip = () => {
    handleMissionComplete(false, true);
  };

  if (!mode) {
    return <ModeSelection onModeSelect={setMode} />;
  }

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

          {mode === "standard" && (
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
          )}

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto group"
          >
            <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span>Start New Journey</span>
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = selectedQuestions[currentMissionIndex];

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
      key={currentMissionIndex}
      question={currentQuestion}
      onMissionComplete={handleMissionComplete}
      onTestAttempt={handleTestAttempt}
      progressInfo={{
        current: currentMissionIndex + 1,
        total: selectedQuestions.length,
        difficulty: mode === "standard"
          ? DIFFICULTY_ORDER[currentMissionIndex]
          : currentQuestion.difficulty,
        completedDifficulties,
        mode,
        userProfile: mode === "learning" ? userProfile : null,
        attempts: currentAttempts,
        isRetry: mode === "learning" &&
          userProfile?.skippedQuestions?.includes(currentQuestion.id),
        previouslyFailed: mode === "learning" &&
          (userProfile?.failedAttempts?.[currentQuestion.id] || 0) > 0,
      }}
    />
  );
};

export default Python;
