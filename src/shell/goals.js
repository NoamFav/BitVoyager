// Evaluates a lesson's pass condition against the *actual* shell/VFS state
// after each command — real inspection, not pattern-matching on raw input.

async function evalLeaf(check, ctx) {
  const { vfs, shell } = ctx;
  switch (check.type) {
    case "fileExists":
      return !!vfs.getNodeAt(shell.cwd, check.path) &&
        vfs.getNodeAt(shell.cwd, check.path).type === "file";
    case "fileMissing":
      return !vfs.getNodeAt(shell.cwd, check.path);
    case "dirExists": {
      const node = vfs.getNodeAt(shell.cwd, check.path);
      return !!node && node.type === "dir";
    }
    case "fileContains": {
      const node = vfs.getNodeAt(shell.cwd, check.path);
      if (!node || node.type !== "file") return false;
      if (check.matches) return new RegExp(check.matches, check.flags || "").test(node.content);
      return node.content.includes(check.contains);
    }
    case "fileEquals": {
      const a = vfs.getNodeAt(shell.cwd, check.path);
      const b = vfs.getNodeAt(shell.cwd, check.other);
      if (!a || !b || a.type !== "file" || b.type !== "file") return false;
      return a.content.trim() === b.content.trim();
    }
    case "mode": {
      const node = vfs.getNodeAt(shell.cwd, check.path);
      if (!node) return false;
      return node.mode.toString(8) === String(check.equals);
    }
    case "processRunning":
      return shell.processes.some((p) => p.running && p.name.includes(check.name));
    case "processGone":
      return !shell.processes.some((p) => p.running && p.name.includes(check.name));
    case "jobDone":
      return shell.jobs.some((j) => j.name.includes(check.name) && j.state === "done");
    case "envVar":
      return check.equals
        ? shell.env[check.name] === check.equals
        : shell.env[check.name] !== undefined;
    case "envUnset":
      return shell.env[check.name] === undefined;
    case "isRoot":
      return shell.isRoot === true;
    case "historyEmpty":
      return shell.history.length === 0;
    case "historyCleared":
      return shell.historyCleared === true;
    case "interfaceUp":
      return !!shell.network.interfaces[check.iface]?.up;
    case "connectionExists":
      return shell.network.connections.some(
        (c) =>
          (!check.state || c.state === check.state) &&
          (!check.remoteIncludes || c.remote.includes(check.remoteIncludes)),
      );
    case "cwdEquals":
      return vfs.resolve(shell.cwd, ".") === vfs.resolve("/", check.path);
    case "pipelineOutput": {
      const result = await shell.execute(check.pipeline);
      const node = vfs.getNodeAt(shell.cwd, check.path);
      if (!node) return false;
      const normalize = (s) => {
        const trimmed = s.trim();
        return check.sorted ? trimmed.split("\n").sort().join("\n") : trimmed;
      };
      return normalize(result.output) === normalize(node.content);
    }
    default:
      return false;
  }
}

export async function evaluateGoal(check, ctx) {
  if (!check) return false;
  if (check.all) {
    for (const c of check.all) if (!(await evaluateGoal(c, ctx))) return false;
    return true;
  }
  if (check.any) {
    for (const c of check.any) if (await evaluateGoal(c, ctx)) return true;
    return false;
  }
  if (check.not) return !(await evaluateGoal(check.not, ctx));
  return evalLeaf(check, ctx);
}
