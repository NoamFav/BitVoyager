/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Check, Clock, SkipForward } from "lucide-react";

// Helper to track command usage and suggest tasks
const analyzeCommandUsage = (history, allCommands) => {
  const usage = {};
  allCommands.forEach((cmd) => {
    usage[cmd] = 0;
  });

  history.forEach((cmd) => {
    if (Object.prototype.hasOwnProperty.call(usage, cmd)) {
      usage[cmd]++;
    }
  });

  return usage;
};

// Get all unique commands from tasks
const getAllCommands = (tasks) => {
  const commands = new Set();
  Object.values(tasks).forEach((task) => {
    task.expectedCommands.forEach((cmd) => {
      commands.add(cmd);
    });
  });
  return Array.from(commands);
};

// Generate practice task based on command usage
const generatePracticeTasks = (commandUsage, currentLevel, tasks) => {
  const availableTasks = Object.entries(tasks)
    .filter(([, task]) => task.level <= currentLevel)
    .map(([cmd, task]) => ({
      title: `Master ${cmd}`,
      description: task.description,
      expectedCommands: task.expectedCommands,
      level: task.level,
    }));

  const sortedTasks = availableTasks.sort((a, b) => {
    const usageA = Math.min(
      ...a.expectedCommands.map((cmd) => commandUsage[cmd] || 0),
    );
    const usageB = Math.min(
      ...b.expectedCommands.map((cmd) => commandUsage[cmd] || 0),
    );
    return usageA - usageB;
  });

  return sortedTasks;
};

const TaskGenerator = ({
  tasks,
  currentLevel,
  commandHistory,
  onTaskComplete,
  terminalInput,
}) => {
  const [taskQueue, setTaskQueue] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [completedCommands, setCompletedCommands] = useState(new Set());
  const [taskHistory, setTaskHistory] = useState([]);
  const [isGeneratingPractice, setIsGeneratingPractice] = useState(false);
  const [lastActivityTimestamp, setLastActivityTimestamp] = useState(
    Date.now(),
  );

  // Initialize or update task queue
  useEffect(() => {
    if (tasks) {
      const allCommands = getAllCommands(tasks);
      const usage = analyzeCommandUsage(commandHistory, allCommands);
      const newTasks = generatePracticeTasks(usage, currentLevel, tasks);

      if (taskQueue.length === 0 || taskQueue[0].level >= currentLevel) {
        setTaskQueue(newTasks);
        setCurrentTask(newTasks.length > 0 ? newTasks[0] : null);
        setCompletedCommands(new Set());
      }
    }
  }, [currentLevel, commandHistory, tasks]);

  // Reset task timeout on activity
  useEffect(() => {
    if (terminalInput) {
      setLastActivityTimestamp(Date.now());
    }
  }, [terminalInput]);

  // Check for task timeout
  useEffect(() => {
    const timeoutCheck = setInterval(() => {
      if (currentTask && Date.now() - lastActivityTimestamp > 300000) {
        // 5 minutes timeout
        const allCommands = getAllCommands(tasks);
        const usage = analyzeCommandUsage(commandHistory, allCommands);
        const newTasks = generatePracticeTasks(usage, currentLevel, tasks);
        setTaskQueue(newTasks);
        setCurrentTask(newTasks.length > 0 ? newTasks[0] : null);
        setCompletedCommands(new Set());
      }
    }, 60000); // Check every minute

    return () => clearInterval(timeoutCheck);
  }, [currentTask, lastActivityTimestamp, commandHistory, currentLevel, tasks]);

  // Check command completion
  useEffect(() => {
    if (currentTask && terminalInput) {
      const input = terminalInput.trim();

      // Check if the full command (including arguments) matches any expected command
      const matchedCommand = currentTask.expectedCommands.find(
        (cmd) => input === cmd || input.startsWith(cmd + " "),
      );

      if (matchedCommand && !completedCommands.has(matchedCommand)) {
        const newCompletedCommands = new Set(completedCommands);
        newCompletedCommands.add(matchedCommand);
        setCompletedCommands(newCompletedCommands);

        // Check if task is complete
        if (newCompletedCommands.size === currentTask.expectedCommands.length) {
          setTaskHistory([...taskHistory, { ...currentTask, completed: true }]);
          onTaskComplete?.(currentTask);

          // Remove completed task and move to next one
          const updatedQueue = taskQueue.slice(1);
          setTaskQueue(updatedQueue);

          if (updatedQueue.length === 0) {
            setIsGeneratingPractice(true);
            const timeoutId = setTimeout(() => {
              const allCommands = getAllCommands(tasks);
              const usage = analyzeCommandUsage(commandHistory, allCommands);
              const newTasks = generatePracticeTasks(
                usage,
                currentLevel,
                tasks,
              );
              setTaskQueue(newTasks);
              setCurrentTask(newTasks.length > 0 ? newTasks[0] : null);
              setCompletedCommands(new Set());
              setIsGeneratingPractice(false);
            }, 1500);
            return () => clearTimeout(timeoutId);
          } else {
            setCurrentTask(updatedQueue[0]);
            setCompletedCommands(new Set());
          }
        }
      }
    }
  }, [
    commandHistory,
    completedCommands,
    currentLevel,
    currentTask,
    onTaskComplete,
    taskQueue,
    taskHistory,
    tasks,
    terminalInput,
  ]);
  const handleSkipTask = () => {
    if (!currentTask) return;

    // Mark task as skipped (but still completed)
    setTaskHistory([
      ...taskHistory,
      { ...currentTask, completed: true, skipped: true },
    ]);

    // Move to the next task in the queue
    const updatedQueue = taskQueue.slice(1);
    setTaskQueue(updatedQueue);
    setCurrentTask(updatedQueue.length > 0 ? updatedQueue[0] : null);
    setCompletedCommands(new Set());

    // If no more tasks, regenerate practice tasks
    if (updatedQueue.length === 0) {
      setIsGeneratingPractice(true);
      setTimeout(() => {
        const allCommands = getAllCommands(tasks);
        const usage = analyzeCommandUsage(commandHistory, allCommands);
        const newTasks = generatePracticeTasks(usage, currentLevel, tasks);

        setTaskQueue(newTasks);
        setCurrentTask(newTasks.length > 0 ? newTasks[0] : null);
        setCompletedCommands(new Set());
        setIsGeneratingPractice(false);
      }, 1500);
    }
  };
  if (!currentTask) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-cyan-400">Current Task</h3>

      {isGeneratingPractice && (
        <div className="flex items-center space-x-2 text-cyan-400">
          <Clock className="h-5 w-5 animate-spin" />
          <span>Generating tasks...</span>
        </div>
      )}

      <div className="border border-gray-700 p-4 rounded-md space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-semibold text-cyan-300">
            {currentTask.title}
          </h4>
          <div className="text-sm text-cyan-300">
            {completedCommands.size}/{currentTask.expectedCommands.length}
          </div>
        </div>

        <p className="text-gray-300">{currentTask.description}</p>

        <div className="space-y-2">
          <p className="text-sm text-gray-400">Required commands:</p>
          <div className="flex flex-wrap gap-2">
            {currentTask.expectedCommands.map((cmd) => (
              <span
                key={cmd}
                className={`px-2 py-1 rounded-md text-sm font-mono flex items-center gap-2
                  ${
                    completedCommands.has(cmd)
                      ? "bg-green-500/20 text-green-300"
                      : "bg-cyan-500/20 text-cyan-300"
                  }`}
              >
                {cmd}
                {completedCommands.has(cmd) && <Check className="h-4 w-4" />}
              </span>
            ))}
          </div>
        </div>

        {/* Skip Task Button */}
        <button
          onClick={handleSkipTask}
          className="mt-4 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          <SkipForward className="h-4 w-4" />
          Skip Task
        </button>
      </div>

      {taskHistory.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <h4 className="text-sm font-medium text-gray-400 mb-2">
            Recent Completions:
          </h4>
          <div className="space-y-2">
            {taskHistory.slice(-3).map((task, idx) => (
              <div
                key={idx}
                className="text-sm text-gray-500 flex items-center gap-2"
              >
                <Check className="h-4 w-4 text-green-500" />
                {task.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskGenerator;
