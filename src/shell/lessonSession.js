import { buildVfs } from "./vfs.js";
import { Shell } from "./shell.js";

// Turns a lesson JSON entry into a live Shell instance: mounts its files,
// seeds any background processes/network state, and sets the starting cwd.
export function createLessonShell(lesson) {
  const vfs = buildVfs(lesson.files || {}, { mode: lesson.fileModes });
  const shell = new Shell({ vfs, cwd: lesson.cwd, env: lesson.env || {} });

  for (const proc of lesson.processes || []) {
    shell.processes.push({ pid: proc.pid, name: proc.name, running: true, protected: !!proc.protected });
  }

  return shell;
}
