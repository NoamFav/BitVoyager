import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Terminal as TerminalIcon } from "lucide-react";
import { useBash } from "./useBash";
import { createLessonShell } from "./shell/lessonSession";
import { evaluateGoal } from "./shell/goals";
import TerminalView from "./components/TerminalView";
import MissionLesson from "./components/MissionLesson";
import lessons from "./data/bashLessons.json";

function prettyPath(path) {
  return path.replace(/^\/home\/voyager/, "~") || "/";
}

function promptFor(shell) {
  const user = shell.isRoot ? "root" : shell.user;
  const marker = shell.isRoot ? "#" : "$";
  const userColor = shell.isRoot ? "\x1b[31m" : "\x1b[36m";
  return `${userColor}${user}@nexus-9\x1b[0m:\x1b[34m${prettyPath(shell.cwd)}\x1b[0m${marker} `;
}

export default function BashLesson() {
  const { level } = useParams();
  const navigate = useNavigate();
  const { currentLevel, setCurrentLevel } = useBash();

  const lessonId = Number(level) || 1;
  const lesson = lessons.find((l) => l.id === lessonId) || lessons[0];
  const nextLesson = lessons.find((l) => l.id === lesson.id + 1);

  const shell = useMemo(() => createLessonShell(lesson), [lesson]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(false);
  }, [lesson]);

  const runCheck = async () => {
    const passed = await evaluateGoal(lesson.check, { shell, vfs: shell.vfs });
    if (passed) {
      setCompleted(true);
      setCurrentLevel((prev) => Math.max(prev, lesson.id + 1));
    }
  };

  useEffect(() => {
    if (completed) return;
    const interval = setInterval(runCheck, 1500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, completed]);

  const isLocked = lesson.id > currentLevel;

  return (
    <MissionLesson
      lesson={lesson}
      levelLabel={`Level ${lesson.id} of ${lessons.length}`}
      icon={<TerminalIcon className="w-5 h-5 text-white" />}
      mapRoute="/bash"
      completed={completed}
      onNext={() => navigate(nextLesson ? `/bash/${nextLesson.id}` : "/bash")}
      nextLabel={nextLesson ? "Next level" : "Mission complete"}
      finalLabel="Mission complete"
      isLocked={isLocked}
      lockedMessage={`This level is still locked. Finish level ${currentLevel} first.`}
    >
      <TerminalView key={lesson.id} shell={shell} prompt={promptFor} onLine={runCheck} height={720} />
    </MissionLesson>
  );
}
