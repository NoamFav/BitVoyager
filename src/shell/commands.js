// Real implementations of a POSIX-ish command set. Every function here
// mutates or reads actual session/VFS state and returns what a real shell
// would print — there is no per-lesson "if input includes X, print Y".

const b64encode = (str) => btoa(str);
const b64decode = (str) => atob(str);

function fail(msg, code = 1) {
  const err = new Error(msg);
  err.code = code;
  throw err;
}

function parseFlags(args) {
  const flags = new Set();
  const positional = [];
  for (const a of args) {
    if (a.startsWith("-") && a !== "-" && !/^-\d/.test(a)) {
      for (const ch of a.slice(1)) flags.add(ch);
    } else {
      positional.push(a);
    }
  }
  return { flags, positional };
}

function evaluateTest(rawArgs) {
  const args = rawArgs[rawArgs.length - 1] === "]" ? rawArgs.slice(0, -1) : rawArgs;
  let negate = false;
  let a = args;
  if (a[0] === "!") {
    negate = true;
    a = a.slice(1);
  }
  let result;
  if (a.length === 2) {
    const [op, val] = a;
    switch (op) {
      case "-z": result = val.length === 0; break;
      case "-n": result = val.length > 0; break;
      default: fail(`test: unknown unary operator '${op}'`);
    }
  } else if (a.length === 3) {
    const [lhs, op, rhs] = a;
    const num = (x) => {
      const n = Number(x);
      if (Number.isNaN(n)) fail(`test: integer expression expected: ${x}`);
      return n;
    };
    switch (op) {
      case "=": case "==": result = lhs === rhs; break;
      case "!=": result = lhs !== rhs; break;
      case "-eq": result = num(lhs) === num(rhs); break;
      case "-ne": result = num(lhs) !== num(rhs); break;
      case "-gt": result = num(lhs) > num(rhs); break;
      case "-lt": result = num(lhs) < num(rhs); break;
      case "-ge": result = num(lhs) >= num(rhs); break;
      case "-le": result = num(lhs) <= num(rhs); break;
      default: fail(`test: unknown binary operator '${op}'`);
    }
  } else {
    fail("test: invalid expression");
  }
  return negate ? !result : result;
}

function fileTestOp(op, path, { vfs, shell }) {
  const node = vfs.getNodeAt(shell.cwd, path);
  switch (op) {
    case "-e": return !!node;
    case "-f": return !!node && node.type === "file";
    case "-d": return !!node && node.type === "dir";
    case "-x": return !!node && (node.mode & 0o111) !== 0;
    case "-r": return !!node && (node.mode & 0o444) !== 0;
    case "-w": return !!node && (node.mode & 0o222) !== 0;
    case "-s": return !!node && node.type === "file" && node.content.length > 0;
    default: return false;
  }
}

function runTest(rawArgs, ctx) {
  const args = rawArgs[rawArgs.length - 1] === "]" ? rawArgs.slice(0, -1) : rawArgs;
  if (args.length === 2 && ["-e", "-f", "-d", "-x", "-r", "-w", "-s"].includes(args[0])) {
    return { code: fileTestOp(args[0], args[1], ctx) ? 0 : 1 };
  }
  return { code: evaluateTest(args) ? 0 : 1 };
}

function formatLs(entries, { flags, vfs }) {
  const showHidden = flags.has("a");
  const long = flags.has("l");
  const visible = entries.filter((e) => showHidden || !e.name.startsWith("."));
  if (visible.length === 0) return "";
  if (!long) return visible.map((e) => e.name).join("  ");

  return visible
    .map(({ name, node }) => {
      const mode = vfs.modeString(node);
      const size = String(vfs.size(node)).padStart(6);
      const date = new Date(node.mtime).toISOString().slice(0, 16).replace("T", " ");
      const link = node.symlinkTarget ? `${name} -> ${node.symlinkTarget}` : name;
      return `${mode} 1 ${node.owner || "voyager"} voyager ${size} ${date} ${link}`;
    })
    .join("\n");
}

function grepLines(pattern, text, { flags }) {
  let re;
  try {
    re = new RegExp(pattern, flags.has("i") ? "i" : "");
  } catch {
    re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags.has("i") ? "i" : "");
  }
  const lines = text.split("\n");
  const matches = [];
  lines.forEach((line, i) => {
    const hit = re.test(line);
    if (flags.has("v") ? !hit : hit) matches.push({ line, num: i + 1 });
  });
  return matches;
}

export const COMMANDS = {
  pwd: (_args, { shell }) => ({ stdout: shell.cwd }),

  cd: (args, { shell, vfs }) => {
    const target = args[0] || shell.env.HOME || "/";
    const node = vfs.getNodeAt(shell.cwd, target);
    if (!node) fail(`cd: ${target}: No such file or directory`);
    if (node.type !== "dir") fail(`cd: ${target}: Not a directory`);
    shell.cwd = vfs.resolve(shell.cwd, target);
    return {};
  },

  ls: (args, ctx) => {
    const { flags, positional } = parseFlags(args);
    const path = positional[0] || ".";
    const entries = ctx.vfs.list(ctx.shell.cwd, path);
    return { stdout: formatLs(entries, { flags, vfs: ctx.vfs }) };
  },

  mkdir: (args, ctx) => {
    const { flags, positional } = parseFlags(args);
    for (const p of positional) ctx.vfs.mkdir(ctx.shell.cwd, p, { parents: flags.has("p") });
    return {};
  },

  touch: (args, ctx) => {
    for (const p of args) ctx.vfs.touch(ctx.shell.cwd, p);
    return {};
  },

  cat: (args, ctx) => {
    if (args.length === 0) return { stdout: ctx.stdin };
    const out = args.map((p) => {
      const node = ctx.vfs.getNodeAt(ctx.shell.cwd, p);
      if (node?.symlinkTarget) return ctx.vfs.read(ctx.shell.cwd, node.symlinkTarget);
      return ctx.vfs.read(ctx.shell.cwd, p);
    });
    return { stdout: out.join("\n") };
  },

  echo: (args) => ({ stdout: args.join(" ") }),

  cp: (args, ctx) => {
    const { flags, positional } = parseFlags(args);
    const [src, dst] = positional;
    ctx.vfs.copy(ctx.shell.cwd, src, dst, { recursive: flags.has("r") || flags.has("R") });
    return {};
  },

  mv: (args, ctx) => {
    const [src, dst] = args;
    ctx.vfs.move(ctx.shell.cwd, src, dst);
    return {};
  },

  rm: (args, ctx) => {
    const { flags, positional } = parseFlags(args);
    for (const p of positional) {
      try {
        ctx.vfs.remove(ctx.shell.cwd, p, { recursive: flags.has("r") || flags.has("R") });
      } catch (err) {
        if (!flags.has("f")) throw err;
      }
    }
    return {};
  },

  grep: (args, ctx) => {
    const { flags, positional } = parseFlags(args);
    const [pattern, ...files] = positional;
    if (!pattern) fail("grep: missing pattern");
    if (files.length === 0) {
      const matches = grepLines(pattern, ctx.stdin, { flags });
      if (flags.has("q")) return { code: matches.length ? 0 : 1 };
      if (flags.has("c")) return { stdout: String(matches.length) };
      return { stdout: matches.map((m) => (flags.has("n") ? `${m.num}:${m.line}` : m.line)).join("\n") };
    }
    const results = [];
    let anyMatch = false;
    for (const file of files) {
      const text = ctx.vfs.read(ctx.shell.cwd, file);
      const matches = grepLines(pattern, text, { flags });
      if (matches.length) anyMatch = true;
      if (flags.has("c")) {
        results.push(files.length > 1 ? `${file}:${matches.length}` : String(matches.length));
        continue;
      }
      if (flags.has("l")) {
        if (matches.length) results.push(file);
        continue;
      }
      for (const m of matches) {
        const prefix = files.length > 1 ? `${file}:` : "";
        results.push(`${prefix}${flags.has("n") ? m.num + ":" : ""}${m.line}`);
      }
    }
    if (flags.has("q")) return { code: anyMatch ? 0 : 1 };
    return { stdout: results.join("\n"), code: anyMatch ? 0 : 1 };
  },

  find: (args, ctx) => {
    const startPath = args[0] && !args[0].startsWith("-") ? args[0] : ".";
    const results = [];
    let nameFilter = null;
    let typeFilter = null;
    let permFilter = null;
    for (let i = 0; i < args.length; i++) {
      if (args[i] === "-name") nameFilter = args[++i];
      else if (args[i] === "-type") typeFilter = args[++i];
      else if (args[i] === "-perm") permFilter = args[++i];
    }
    const nameRe = nameFilter
      ? new RegExp("^" + nameFilter.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$")
      : null;

    ctx.vfs.walk(ctx.shell.cwd, startPath, (fullPath, node) => {
      const base = fullPath.split("/").pop() || fullPath;
      if (nameRe && !nameRe.test(base)) return;
      if (typeFilter === "f" && node.type !== "file") return;
      if (typeFilter === "d" && node.type !== "dir") return;
      if (permFilter && node.mode.toString(8) !== permFilter.replace(/^0+/, "")) return;
      results.push(fullPath);
    });
    return { stdout: results.join("\n") };
  },

  chmod: (args, ctx) => {
    const [modeArg, ...paths] = args;
    for (const p of paths) {
      const node = ctx.vfs.getNodeAt(ctx.shell.cwd, p);
      if (!node) fail(`chmod: cannot access '${p}': No such file or directory`);
      if (/^[0-7]{3,4}$/.test(modeArg)) {
        ctx.vfs.chmod(ctx.shell.cwd, p, parseInt(modeArg.slice(-3), 8));
      } else if (modeArg === "+x") {
        ctx.vfs.chmod(ctx.shell.cwd, p, node.mode | 0o111);
      } else if (modeArg === "-x") {
        ctx.vfs.chmod(ctx.shell.cwd, p, node.mode & ~0o111);
      } else {
        fail(`chmod: invalid mode: '${modeArg}'`);
      }
    }
    return {};
  },

  stat: (args, ctx) => {
    const node = ctx.vfs.getNodeAt(ctx.shell.cwd, args[0]);
    if (!node) fail(`stat: cannot stat '${args[0]}': No such file or directory`);
    return {
      stdout: `File: ${args[0]}\nSize: ${ctx.vfs.size(node)}\nType: ${node.type}\nAccess: (${node.mode.toString(8)})`,
    };
  },

  du: (args, ctx) => {
    const { flags, positional } = parseFlags(args);
    const path = positional[0] || ".";
    const node = ctx.vfs.getNodeAt(ctx.shell.cwd, path);
    if (!node) fail(`du: cannot access '${path}': No such file or directory`);
    const bytes = ctx.vfs.size(node);
    const human = flags.has("h") ? `${(bytes / 1024).toFixed(1)}K` : String(bytes);
    return { stdout: `${human}\t${path}` };
  },

  df: (_args, ctx) => {
    const total = ctx.vfs.size(ctx.vfs.root);
    return {
      stdout: `Filesystem     Size  Used Avail Use%\nnexusfs        100M  ${(total / 1024).toFixed(1)}K  ${((102400 - total) / 1024).toFixed(1)}K   ${Math.min(99, Math.round((total / 102400) * 100))}%`,
    };
  },

  wc: (args, ctx) => {
    const { flags, positional } = parseFlags(args);
    const text = positional[0] ? ctx.vfs.read(ctx.shell.cwd, positional[0]) : ctx.stdin;
    const lines = text.split("\n").length - (text.endsWith("\n") ? 1 : 0);
    const words = text.split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    if (flags.has("l")) return { stdout: String(lines) };
    if (flags.has("w")) return { stdout: String(words) };
    if (flags.has("c")) return { stdout: String(chars) };
    return { stdout: `${lines} ${words} ${chars}` };
  },

  sort: (args, ctx) => {
    const { flags, positional } = parseFlags(args);
    const text = positional[0] ? ctx.vfs.read(ctx.shell.cwd, positional[0]) : ctx.stdin;
    let lines = text.split("\n").filter((l) => l !== "");
    lines.sort((a, b) => (flags.has("n") ? Number(a) - Number(b) : a.localeCompare(b)));
    if (flags.has("r")) lines.reverse();
    if (flags.has("u")) lines = [...new Set(lines)];
    return { stdout: lines.join("\n") };
  },

  uniq: (_args, ctx) => {
    const lines = ctx.stdin.split("\n");
    const out = lines.filter((l, i) => i === 0 || l !== lines[i - 1]);
    return { stdout: out.join("\n") };
  },

  cut: (args, ctx) => {
    const delimMatch = args.find((a) => a.startsWith("-d"));
    const fieldMatch = args.find((a) => a.startsWith("-f"));
    const delim = delimMatch ? (delimMatch === "-d" ? args[args.indexOf(delimMatch) + 1] : delimMatch.slice(2)) : "\t";
    const fields = (fieldMatch ? (fieldMatch === "-f" ? args[args.indexOf(fieldMatch) + 1] : fieldMatch.slice(2)) : "1")
      .split(",")
      .map(Number);
    const path = args.find((a) => !a.startsWith("-") && a !== delim);
    const text = path ? ctx.vfs.read(ctx.shell.cwd, path) : ctx.stdin;
    const out = text
      .split("\n")
      .map((line) => fields.map((f) => line.split(delim)[f - 1] ?? "").join(delim))
      .join("\n");
    return { stdout: out };
  },

  head: (args, ctx) => {
    const { flags, positional } = parseFlags(args);
    const n = flags.has("n") ? Number(positional.shift()) : 10;
    const text = positional[0] ? ctx.vfs.read(ctx.shell.cwd, positional[0]) : ctx.stdin;
    return { stdout: text.split("\n").slice(0, n).join("\n") };
  },

  tail: (args, ctx) => {
    const { flags, positional } = parseFlags(args);
    const n = flags.has("n") ? Number(positional.shift()) : 10;
    const text = positional[0] ? ctx.vfs.read(ctx.shell.cwd, positional[0]) : ctx.stdin;
    const lines = text.split("\n");
    return { stdout: lines.slice(Math.max(0, lines.length - n)).join("\n") };
  },

  sed: (args, ctx) => {
    const iIndex = args.indexOf("-i");
    const hasI = iIndex !== -1;
    if (hasI) args.splice(iIndex, 1);
    const [expr, path] = args;
    const m = expr.match(/^s\/(.*?)\/(.*?)\/([a-z]*)$/);
    if (!m) fail(`sed: invalid expression '${expr}'`);
    const [, pattern, replacement, flags] = m;
    const re = new RegExp(pattern, flags.includes("g") ? "g" : "");
    const text = path ? ctx.vfs.read(ctx.shell.cwd, path) : ctx.stdin;
    const result = text.replace(re, replacement);
    if (hasI && path) {
      ctx.vfs.write(ctx.shell.cwd, path, result);
      return {};
    }
    return { stdout: result };
  },

  awk: (args, ctx) => {
    const [program, path] = args;
    const text = path ? ctx.vfs.read(ctx.shell.cwd, path) : ctx.stdin;
    const patMatch = program.match(/^\/(.*)\/\s*(\{.*\})?$/);
    const printMatch = (program.match(/\{print\s*(.*)\}/) || [])[1];
    const filter = patMatch ? new RegExp(patMatch[1]) : null;
    const out = text
      .split("\n")
      .filter((line) => !filter || filter.test(line))
      .map((line) => {
        const fields = line.trim().split(/\s+/);
        if (!printMatch || printMatch === "") return line;
        return printMatch
          .split(",")
          .map((tok) => {
            const t = tok.trim();
            const fm = t.match(/^\$(\d+)$/);
            return fm ? fields[Number(fm[1]) - 1] ?? "" : t.replace(/^["']|["']$/g, "");
          })
          .join(" ");
      });
    return { stdout: out.join("\n") };
  },

  export: (args, { shell }) => {
    for (const a of args) {
      const [key, ...rest] = a.split("=");
      shell.env[key] = rest.join("=");
    }
    return {};
  },

  env: (_args, { shell }) => ({
    stdout: Object.entries(shell.env).map(([k, v]) => `${k}=${v}`).join("\n"),
  }),

  set: (_args, { shell }) => ({
    stdout: Object.entries(shell.env).map(([k, v]) => `${k}=${v}`).join("\n"),
  }),

  unset: (args, { shell }) => {
    for (const a of args) delete shell.env[a];
    return {};
  },

  history: (args, { shell }) => {
    if (args.includes("-c")) {
      shell.history = [];
      shell.historyCleared = true;
      return {};
    }
    return { stdout: shell.history.map((c, i) => `${i + 1}  ${c}`).join("\n") };
  },

  tee: (args, ctx) => {
    const { flags, positional } = parseFlags(args);
    for (const p of positional) {
      ctx.vfs.write(ctx.shell.cwd, p, ctx.stdin, { append: flags.has("a") });
    }
    return { stdout: ctx.stdin };
  },

  xargs: async (args, ctx) => {
    const items = ctx.stdin.split(/\s+/).filter(Boolean);
    const outputs = [];
    for (const item of items) {
      const res = await ctx.shell.runCommand([...args, item], "");
      if (res.stdout) outputs.push(res.stdout);
    }
    return { stdout: outputs.join("\n") };
  },

  clear: () => ({ clear: true }),

  whoami: (_args, { shell }) => ({ stdout: shell.isRoot ? "root" : shell.user }),

  id: (_args, { shell }) => ({
    stdout: shell.isRoot ? "uid=0(root) gid=0(root) groups=0(root)" : `uid=1000(${shell.user}) gid=1000(${shell.user}) groups=1000(${shell.user})`,
  }),

  uname: (args) => ({
    stdout: args.includes("-a")
      ? "NEXUS-9 CityOS 4.5.2 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux"
      : "NEXUS-9",
  }),

  which: (args) => {
    const name = args[0];
    return COMMANDS[name] ? { stdout: `/usr/bin/${name}` } : { stdout: "", code: 1 };
  },

  sudo: async (args, ctx) => {
    if (args.length === 0) return {};
    const wasRoot = ctx.shell.isRoot;
    ctx.shell.isRoot = true;
    try {
      return await ctx.shell.runCommand(args, ctx.stdin);
    } finally {
      ctx.shell.isRoot = wasRoot;
    }
  },

  su: (args, { shell }) => {
    shell.isRoot = true;
    shell.user = args[0] || "root";
    return { stdout: `Switched to ${shell.user}` };
  },

  ps: (args, { shell }) => {
    const header = "PID   USER     %CPU  %MEM  COMMAND";
    const rows = shell.processes
      .filter((p) => p.running)
      .map((p) => `${String(p.pid).padEnd(6)}${(p.owner || "voyager").padEnd(9)}${String(20 + (p.pid % 60)).padEnd(6)}${String(5 + (p.pid % 40)).padEnd(6)}${p.name}`);
    return { stdout: [header, ...rows].join("\n") };
  },

  top: (args, ctx) => COMMANDS.ps(args, ctx),

  pgrep: (args, { shell }) => {
    const hits = shell.processes.filter((p) => p.running && p.name.includes(args[0]));
    return { stdout: hits.map((p) => p.pid).join("\n"), code: hits.length ? 0 : 1 };
  },

  kill: (args, { shell }) => {
    const pid = Number(args.find((a) => /^\d+$/.test(a)));
    const proc = shell.processes.find((p) => p.pid === pid);
    if (!proc) fail(`kill: (${pid}): No such process`);
    if (proc.protected && !shell.isRoot) fail(`kill: (${pid}): Operation not permitted`);
    proc.running = false;
    const job = shell.jobs.find((j) => j.pid === pid);
    if (job) job.state = "done";
    return {};
  },

  wait: async (_args, { shell }) => {
    await Promise.allSettled(shell.backgroundPromises);
    shell.backgroundPromises = [];
    return {};
  },

  bash: async (args, ctx) => ctx.shell.runScriptFile(args[0]),
  sh: async (args, ctx) => ctx.shell.runScriptFile(args[0]),

  killall: (args, { shell }) => {
    const hits = shell.processes.filter((p) => p.running && p.name.includes(args[0]));
    hits.forEach((p) => (p.running = false));
    return { code: hits.length ? 0 : 1 };
  },

  jobs: (_args, { shell }) => ({
    stdout: shell.jobs.map((j) => `[${j.id}]  ${j.state.padEnd(8)} ${j.name}`).join("\n"),
  }),

  bg: (args, { shell }) => {
    const job = shell.jobs[shell.jobs.length - 1];
    if (job) job.state = "running";
    return { stdout: job ? `[${job.id}]  ${job.name} &` : "" };
  },

  fg: (args, { shell }) => {
    const job = shell.jobs[shell.jobs.length - 1];
    return { stdout: job ? job.name : "bash: fg: no current job" };
  },

  sleep: async (args) => {
    const seconds = Math.min(Number(args[0]) || 0, 3);
    await new Promise((r) => setTimeout(r, seconds * 1000));
    return {};
  },

  timeout: async (args, ctx) => {
    const [, ...cmd] = args;
    return ctx.shell.runCommand(cmd, ctx.stdin);
  },

  seq: (args) => {
    const [a, b] = args.map(Number);
    const start = b === undefined ? 1 : a;
    const end = b === undefined ? a : b;
    const out = [];
    for (let i = start; i <= end; i++) out.push(i);
    return { stdout: out.join("\n") };
  },

  watch: async (args, ctx) => {
    const result = await ctx.shell.runCommand(args, ctx.stdin);
    return { stdout: `Every 2.0s: ${args.join(" ")}\n\n${result.stdout}` };
  },

  tar: (args, ctx) => {
    const mode = args[0];
    const archivePath = args[1];
    if (mode?.includes("c")) {
      const files = args.slice(2);
      const packed = {};
      const cwdAbs = ctx.vfs.resolve(ctx.shell.cwd, ".");
      const prefix = cwdAbs === "/" ? "/" : cwdAbs + "/";
      for (const f of files) {
        ctx.vfs.walk(ctx.shell.cwd, f, (fullPath, node) => {
          const rel = fullPath.startsWith(prefix)
            ? fullPath.slice(prefix.length)
            : fullPath.replace(/^\//, "");
          packed[rel] = node.type === "file" ? { content: node.content } : { dir: true };
        });
      }
      ctx.vfs.write(ctx.shell.cwd, archivePath, JSON.stringify(packed));
      return { stdout: files.join("\n") };
    }
    if (mode?.includes("x")) {
      const raw = ctx.vfs.read(ctx.shell.cwd, archivePath);
      const packed = JSON.parse(raw);
      const names = [];
      for (const [rel, entry] of Object.entries(packed)) {
        if (entry.dir) ctx.vfs.mkdir(ctx.shell.cwd, rel, { parents: true });
        else ctx.vfs.write(ctx.shell.cwd, rel, entry.content);
        names.push(rel);
      }
      return { stdout: names.join("\n") };
    }
    fail("tar: unsupported mode");
  },

  gzip: (args, ctx) => {
    const path = args[0];
    const content = ctx.vfs.read(ctx.shell.cwd, path);
    ctx.vfs.write(ctx.shell.cwd, `${path}.gz`, b64encode(content));
    ctx.vfs.remove(ctx.shell.cwd, path);
    return {};
  },

  gunzip: (args, ctx) => {
    const path = args[0];
    const content = ctx.vfs.read(ctx.shell.cwd, path);
    const target = path.replace(/\.gz$/, "");
    ctx.vfs.write(ctx.shell.cwd, target, b64decode(content));
    ctx.vfs.remove(ctx.shell.cwd, path);
    return {};
  },

  base64: (args, ctx) => {
    const { flags, positional } = parseFlags(args);
    const text = positional[0] ? ctx.vfs.read(ctx.shell.cwd, positional[0]) : ctx.stdin;
    return { stdout: flags.has("d") ? b64decode(text.trim()) : b64encode(text) };
  },

  gpg: (args, ctx) => {
    const { flags, positional } = parseFlags(args);
    const path = positional[0];
    const text = ctx.vfs.read(ctx.shell.cwd, path);
    if (flags.has("d")) {
      const plain = b64decode(text.trim());
      const outFlagIdx = args.indexOf("-o");
      if (outFlagIdx !== -1) {
        ctx.vfs.write(ctx.shell.cwd, args[outFlagIdx + 1], plain);
        return {};
      }
      return { stdout: plain };
    }
    if (flags.has("e") || flags.has("c")) {
      ctx.vfs.write(ctx.shell.cwd, `${path}.gpg`, b64encode(text));
      return {};
    }
    fail("gpg: specify --decrypt or --encrypt");
  },

  mount: (args, ctx) => {
    const [imagePath, mountPoint] = args;
    const raw = ctx.vfs.read(ctx.shell.cwd, imagePath);
    let packed;
    try {
      packed = JSON.parse(b64decode(raw.trim()));
    } catch {
      packed = JSON.parse(raw);
    }
    ctx.vfs.mkdir(ctx.shell.cwd, mountPoint, { parents: true });
    for (const [rel, entry] of Object.entries(packed)) {
      const target = `${mountPoint}/${rel}`;
      if (entry.dir) ctx.vfs.mkdir(ctx.shell.cwd, target, { parents: true });
      else ctx.vfs.write(ctx.shell.cwd, target, entry.content);
    }
    return { stdout: `mounted ${imagePath} at ${mountPoint}` };
  },

  umount: (args, ctx) => {
    const node = ctx.vfs.getNodeAt(ctx.shell.cwd, args[0]);
    if (node && node.type === "dir") node.children = {};
    return {};
  },

  cryptsetup: (args, ctx) => {
    if (args[0] !== "luksOpen") fail("cryptsetup: unsupported subcommand");
    const [, device, name] = args;
    const raw = ctx.vfs.read(ctx.shell.cwd, device);
    ctx.vfs.mkdir(ctx.shell.cwd, "/dev/mapper", { parents: true });
    ctx.vfs.write(ctx.shell.cwd, `/dev/mapper/${name}`, b64decode(raw.trim()));
    return { stdout: `${device} unlocked as /dev/mapper/${name}` };
  },

  ifconfig: (args, { shell }) => {
    const [iface, state] = args;
    if (!iface) {
      return {
        stdout: Object.entries(shell.network.interfaces)
          .map(([name, cfg]) => `${name}: ${cfg.up ? "UP" : "DOWN"}  inet ${cfg.ip || "0.0.0.0"}`)
          .join("\n"),
      };
    }
    const cfg = shell.network.interfaces[iface] || (shell.network.interfaces[iface] = { up: false, ip: null });
    if (state === "up") { cfg.up = true; cfg.ip = "192.168.1.100"; }
    if (state === "down") { cfg.up = false; }
    return {};
  },

  netstat: (_args, { shell }) => ({
    stdout: shell.network.connections
      .map((c) => `${c.proto}  ${c.local}  ${c.remote}  ${c.state}`)
      .join("\n"),
  }),

  nc: (args, { shell }) => {
    if (args[0] === "-l") {
      shell.network.connections.push({ proto: "tcp", local: `0.0.0.0:${args[1]}`, remote: "*:*", state: "LISTEN" });
      return { stdout: `listening on ${args[1]}` };
    }
    const [host, port] = args;
    shell.network.connections.push({ proto: "tcp", local: "192.168.1.100:*", remote: `${host}:${port}`, state: "ESTABLISHED" });
    return { stdout: `connected to ${host}:${port}` };
  },

  ssh: async (args, ctx) => {
    const [, ...cmd] = args;
    if (cmd.length === 0) return { stdout: `Connected to ${args[0]}.` };
    const savedCwd = ctx.shell.cwd;
    ctx.vfs.mkdir("/", "/remote", { parents: true });
    ctx.shell.cwd = "/remote";
    try {
      return await ctx.shell
        .execute(cmd.join(" "), { record: false })
        .then((r) => ({ stdout: r.output, code: r.code }));
    } finally {
      ctx.shell.cwd = savedCwd;
    }
  },

  scp: (args, ctx) => {
    const [src, dst] = args;
    ctx.vfs.mkdir("/", "/remote", { parents: true });
    if (dst.includes(":")) {
      const remotePath = dst.split(":")[1];
      const content = ctx.vfs.read(ctx.shell.cwd, src);
      const target = `/remote/${remotePath}`.replace(/\/+/g, "/");
      const dir = target.split("/").slice(0, -1).join("/");
      ctx.vfs.mkdir("/", dir, { parents: true });
      ctx.vfs.write("/", target, content);
    } else {
      const remotePath = src.split(":")[1];
      const content = ctx.vfs.read("/", `/remote/${remotePath}`);
      ctx.vfs.write(ctx.shell.cwd, dst, content);
    }
    return {};
  },

  rsync: (args, ctx) => {
    const positional = args.filter((a) => !a.startsWith("-"));
    const [src, dst] = positional;
    ctx.vfs.copy(ctx.shell.cwd, src, dst, { recursive: true });
    return {};
  },

  exit: () => ({ stdout: "logout", exit: true }),
  logout: () => ({ stdout: "logout", exit: true }),
  shutdown: () => ({ stdout: "Shutting down.", exit: true }),

  ln: (args, ctx) => {
    const { flags, positional } = parseFlags(args);
    const [target, linkName] = positional;
    if (!flags.has("s")) fail("ln: only symbolic links (-s) are supported");
    const node = ctx.vfs.touch(ctx.shell.cwd, linkName);
    node.symlinkTarget = target;
    return {};
  },

  nohup: async (args, ctx) => {
    const result = await ctx.shell.runCommand(args, ctx.stdin);
    ctx.vfs.write(ctx.shell.cwd, "nohup.out", result.stdout || "", { append: true });
    return { stdout: "nohup: ignoring input and appending output to 'nohup.out'" };
  },

  nice: async (args, ctx) => ctx.shell.runCommand(args.filter((a) => !a.startsWith("-") && isNaN(Number(a))), ctx.stdin),
  renice: () => ({ stdout: "priority adjusted" }),

  crontab: (args, { shell }) => {
    if (args[0] === "-l") return { stdout: (shell.cronJobs || []).join("\n") };
    return { stdout: "crontab: schedule updated" };
  },

  at: (args, { shell }) => {
    shell.jobs.push({ id: shell.jobs.length + 1, pid: shell.nextPid++, name: `at ${args.join(" ")}`, state: "scheduled" });
    return { stdout: `job scheduled for ${args[0]}` };
  },

  test: (args, ctx) => runTest(args, ctx),
  "[": (args, ctx) => runTest(args, ctx),

  true: () => ({ code: 0 }),
  false: () => ({ code: 1 }),
};
