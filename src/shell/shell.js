import { Vfs, VfsError } from "./vfs.js";
import { parse } from "./parser.js";
import { COMMANDS } from "./commands.js";

function globToRegExp(glob) {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  return new RegExp("^" + escaped.replace(/\*/g, ".*").replace(/\?/g, ".") + "$");
}

export class Shell {
  constructor({ vfs, cwd = "/", env = {}, user = "voyager", host = "nexus-9" } = {}) {
    this.vfs = vfs || new Vfs();
    this.cwd = cwd;
    this.env = { HOME: cwd, USER: user, ...env };
    this.user = user;
    this.host = host;
    this.history = [];
    this.historyCleared = false;
    this.processes = []; // {pid, name, running}
    this.jobs = []; // {id, name, state: 'running'|'stopped'|'done'}
    this.network = { interfaces: { eth0: { up: false, ip: null } }, connections: [] };
    this.isRoot = false;
    this.nextPid = 1000;
    this.exitCode = 0;
    this.backgroundPromises = [];
  }

  expandWord(token) {
    if (token.quoted === "single") return token.value;
    let text = token.value.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$([A-Za-z_][A-Za-z0-9_]*)/g,
      (_, a, b) => this.env[a || b] ?? "",
    );
    if (token.quoted === null && /[*?]/.test(text)) {
      const dir = text.includes("/") ? text.slice(0, text.lastIndexOf("/")) || "/" : ".";
      const base = text.includes("/") ? text.slice(text.lastIndexOf("/") + 1) : text;
      try {
        const entries = this.vfs.list(this.cwd, dir);
        const re = globToRegExp(base);
        const matches = entries
          .filter((e) => !e.name.startsWith(".") && re.test(e.name))
          .map((e) => (dir === "." ? e.name : `${dir}/${e.name}`));
        if (matches.length > 0) return matches.sort().join(" ");
      } catch {
        // fall through: no matches, keep literal glob text (bash behaviour)
      }
    }
    return text;
  }

  buildArgv(wordTokens) {
    const argv = [];
    for (const t of wordTokens) {
      const expanded = this.expandWord(t);
      if (t.quoted === null && expanded.includes(" ")) {
        argv.push(...expanded.split(" ").filter(Boolean));
      } else {
        argv.push(expanded);
      }
    }
    return argv;
  }

  async runCommand(argv, stdin) {
    if (argv.length === 0) return { stdout: "", stderr: "", code: 0 };
    const [name, ...rest] = argv;
    const impl = COMMANDS[name];
    if (!impl) {
      if (name.includes("/")) {
        const node = this.vfs.getNodeAt(this.cwd, name);
        if (node && node.type === "file") {
          if (!(node.mode & 0o111)) {
            return { stdout: "", stderr: `bash: ${name}: Permission denied`, code: 126 };
          }
          return this.runScriptFile(name);
        }
      }
      return { stdout: "", stderr: `${name}: command not found`, code: 127 };
    }
    try {
      const result = await impl(rest, { shell: this, vfs: this.vfs, stdin: stdin ?? "" });
      return { stdout: "", stderr: "", code: 0, ...result };
    } catch (err) {
      const message = err instanceof VfsError ? err.message : err?.message || String(err);
      return { stdout: "", stderr: message, code: 1 };
    }
  }

  async runScriptFile(path) {
    const content = this.vfs.read(this.cwd, path);
    const lines = content
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"));
    const outputs = [];
    let code = 0;
    for (const line of lines) {
      const result = await this.execute(line, { record: false });
      if (result.output) outputs.push(result.output);
      code = result.code;
    }
    return { stdout: outputs.join("\n"), code };
  }

  async runPipeline(commands) {
    let stdin = "";
    let last = { stdout: "", stderr: "", code: 0 };
    const lines = [];

    for (let i = 0; i < commands.length; i++) {
      const stage = commands[i];
      const argv = this.buildArgv(stage.argv);

      const inputRedirect = stage.redirects.find((r) => r.type === "<");
      if (inputRedirect) {
        stdin = this.vfs.read(this.cwd, inputRedirect.target);
      }

      last = await this.runCommand(argv, stdin);

      const outRedirect = stage.redirects.find((r) => r.type === ">" || r.type === ">>");
      if (outRedirect) {
        if (outRedirect.target !== "/dev/null") {
          this.vfs.write(this.cwd, outRedirect.target, last.stdout, {
            append: outRedirect.type === ">>",
          });
        }
        if (last.stderr) lines.push(last.stderr);
      } else if (i === commands.length - 1) {
        if (last.stdout) lines.push(last.stdout);
        if (last.stderr) lines.push(last.stderr);
      }

      stdin = last.stdout;
    }

    return { output: lines.join("\n"), code: last.code };
  }

  // Minimal single-line `if COND; then CMDS; [else CMDS;] fi` support.
  async runIfStatement(line) {
    const match = line.match(/^if\s+(.+?);\s*then\s+(.+?)(?:;\s*else\s+(.+?))?;\s*fi;?$/s);
    if (!match) return { output: "syntax error: malformed if statement", code: 2 };
    const [, cond, thenBody, elseBody] = match;
    const condResult = await this.execute(cond.trim(), { record: false });
    if (condResult.code === 0) {
      return thenBody ? this.execute(thenBody.trim(), { record: false }) : { output: "", code: 0 };
    }
    return elseBody ? this.execute(elseBody.trim(), { record: false }) : { output: "", code: 0 };
  }

  async execute(line, { record = true } = {}) {
    const trimmed = line.trim();
    if (!trimmed) return { output: "", code: 0 };
    if (record) this.history.push(trimmed);
    if (trimmed.startsWith("if ") || trimmed.startsWith("if(")) {
      const result = await this.runIfStatement(trimmed);
      this.exitCode = result.code;
      return result;
    }

    let statements;
    try {
      statements = parse(trimmed);
    } catch (err) {
      return { output: `bash: ${err.message}`, code: 2 };
    }

    const outputs = [];
    let code = 0;

    for (const statement of statements) {
      if (statement.background) {
        const label = statement.chain[0].pipeline
          .map((c) => c.argv.map((w) => w.value).join(" "))
          .join(" | ");
        const pid = this.nextPid++;
        this.processes.push({ pid, name: label, running: true });
        this.jobs.push({ id: this.jobs.length + 1, pid, name: label, state: "running" });
        const bgPromise = this.runPipeline(statement.chain[0].pipeline).then(() => {
          const proc = this.processes.find((p) => p.pid === pid);
          if (proc) proc.running = false;
          const job = this.jobs.find((j) => j.pid === pid);
          if (job) job.state = "done";
        });
        this.backgroundPromises.push(bgPromise);
        outputs.push(`[${this.jobs.length}] ${pid}`);
        continue;
      }

      for (const link of statement.chain) {
        const shouldRun =
          link.op === null ? true : link.op === "&&" ? code === 0 : code !== 0;
        if (!shouldRun) continue;
        const result = await this.runPipeline(link.pipeline);
        code = result.code;
        if (result.output) outputs.push(result.output);
      }
    }

    this.exitCode = code;
    return { output: outputs.join("\n"), code };
  }
}
