// Adaptive question selection and skill tracking for Python "Learning Mode".
// Pure logic, no JSX — kept separate from PythonModeSelect.jsx on purpose.

const STORAGE_KEY = "pythonLearningProfile";

const defaultUserProfile = {
  completedQuestions: [],
  skippedQuestions: [],
  failedAttempts: {},
  skillLevels: {
    loops: 0,
    "list manipulation": 0,
    strings: 0,
    "hash tables": 0,
    arrays: 0,
    recursion: 0,
    "dynamic programming": 0,
    "binary search": 0,
    matrix: 0,
    sorting: 0,
  },
  questionHistory: {},
  lastSessionDate: null,
  consecutiveDays: 0,
};

function getUserProfile() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { ...defaultUserProfile };
  } catch {
    return { ...defaultUserProfile };
  }
}

function saveUserProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function getDifficultyScore(difficulty) {
  switch (difficulty) {
    case "easy":
      return 3;
    case "medium":
      return 6;
    case "hard":
      return 9;
    default:
      return 5;
  }
}

function calculateSkillAdjustment(question, success, attempts = 1, skipped = false) {
  const DIFFICULTY_MULTIPLIER = { easy: 0.8, medium: 1.0, hard: 1.2 };
  const ATTEMPT_PENALTY = 0.15;
  const SKIP_PENALTY = 0.7;

  let adjustment = success ? 1.0 : -0.5;
  adjustment *= DIFFICULTY_MULTIPLIER[question.difficulty] ?? 1;

  if (success && attempts > 1) {
    adjustment *= Math.max(0.2, 1 - (attempts - 1) * ATTEMPT_PENALTY);
  }
  if (skipped) adjustment *= SKIP_PENALTY;

  return adjustment;
}

function updateSkillLevels(profile, question, success, attempts = 1, skipped = false) {
  const updated = { ...profile, skillLevels: { ...profile.skillLevels }, failedAttempts: { ...profile.failedAttempts }, questionHistory: { ...profile.questionHistory } };
  const adjustment = calculateSkillAdjustment(question, success, attempts, skipped);

  question.tags.forEach((tag) => {
    if (updated.skillLevels[tag] !== undefined) {
      updated.skillLevels[tag] = Math.max(0, Math.min(10, updated.skillLevels[tag] + adjustment));
    }
  });

  updated.questionHistory[question.id] = {
    ...(updated.questionHistory[question.id] || {}),
    lastAttempt: new Date().toISOString(),
    attempts: (updated.questionHistory[question.id]?.attempts || 0) + 1,
    success,
    skipped,
    tags: question.tags,
  };

  updated.skippedQuestions = updated.skippedQuestions.filter((id) => id !== question.id);
  if (skipped) {
    updated.skippedQuestions = [...updated.skippedQuestions, question.id];
  }

  if (!success && !skipped) {
    updated.failedAttempts[question.id] = (updated.failedAttempts[question.id] || 0) + 1;
  } else if (success) {
    delete updated.failedAttempts[question.id];
  }

  return updated;
}

function selectStandardQuestions(allQuestions) {
  const order = ["easy", "medium", "hard"];
  const selected = order.map((difficulty) => {
    const pool = allQuestions.filter((q) => q.difficulty === difficulty);
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  });
  return selected.every(Boolean) ? selected : null;
}

function selectLearningQuestions(profile, allQuestions) {
  const available = allQuestions.filter((q) => !profile.completedQuestions.includes(q.id));
  if (available.length < 3) return null;

  const avgSkillLevel =
    Object.values(profile.skillLevels).reduce((a, b) => a + b, 0) /
    Object.values(profile.skillLevels).length;

  const recentTags = new Set(
    Object.values(profile.questionHistory)
      .sort((a, b) => new Date(b.lastAttempt) - new Date(a.lastAttempt))
      .slice(0, 5)
      .flatMap((entry) => entry.tags || []),
  );

  const scored = available.map((question) => {
    let score = 0;

    const avgSkillForTags =
      question.tags.reduce((sum, tag) => sum + (profile.skillLevels[tag] || 0), 0) / question.tags.length;
    score += 50 * (1 - Math.abs(avgSkillForTags - getDifficultyScore(question.difficulty)) / 10);

    const newTagBonus = question.tags.filter((tag) => !recentTags.has(tag)).length * 5;
    score += Math.min(20, newTagBonus);

    if (
      (question.difficulty === "hard" && avgSkillLevel < 7) ||
      (question.difficulty === "medium" && avgSkillLevel < 3)
    ) {
      score -= 50;
    }

    const isRetry =
      profile.skippedQuestions.includes(question.id) || (profile.failedAttempts[question.id] || 0) > 0;

    if (isRetry) {
      const history = profile.questionHistory[question.id];
      const daysSince = history ? (Date.now() - new Date(history.lastAttempt)) / 86400000 : Infinity;
      if (profile.skippedQuestions.includes(question.id)) {
        score += Math.min(20, daysSince * 2);
      }
      if (profile.failedAttempts[question.id] > 0) {
        score -= Math.max(0, 30 - daysSince * 3);
      }
    }

    return { question, score, isRetry };
  });

  const newOnes = scored.filter((s) => !s.isRetry).sort((a, b) => b.score - a.score);
  const retries = scored.filter((s) => s.isRetry).sort((a, b) => b.score - a.score);

  const selected = [];
  if (newOnes[0]) selected.push(newOnes[0].question);
  if (newOnes[1]) selected.push(newOnes[1].question);
  if (retries[0] && retries[0].score > 20) selected.push(retries[0].question);
  else if (newOnes[2]) selected.push(newOnes[2].question);

  return selected.length >= 2 ? selected : null;
}

function selectQuestions(mode, profile, allQuestions) {
  if (mode === "standard") return selectStandardQuestions(allQuestions);
  if (mode === "learning") return profile ? selectLearningQuestions(profile, allQuestions) : null;
  return null;
}

export {
  defaultUserProfile,
  getUserProfile,
  saveUserProfile,
  calculateSkillAdjustment,
  updateSkillLevels,
  selectQuestions,
};
