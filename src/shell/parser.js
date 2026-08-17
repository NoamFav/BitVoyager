// Real tokenizer + parser for a POSIX-ish subset: quotes, pipes, redirects,
// &&/||/;, and backgrounding with &. Produces an AST that shell.js executes
// directly — no per-lesson string matching.

const OPERATORS = ["&&", "||", ">>", "|", ">", "<", ";", "&"];

function tokenize(line) {
  const tokens = [];
  let i = 0;
  const n = line.length;

  const isOpStart = (ch) => "|&;><".includes(ch);

  while (i < n) {
    const ch = line[i];

    if (ch === " " || ch === "\t") {
      i++;
      continue;
    }

    if (isOpStart(ch)) {
      const two = line.slice(i, i + 2);
      if (OPERATORS.includes(two)) {
        tokens.push({ type: "op", value: two });
        i += 2;
      } else {
        tokens.push({ type: "op", value: ch });
        i += 1;
      }
      continue;
    }

    // Word: accumulate raw text and quote parts until whitespace/operator.
    let raw = "";
    let quoted = null; // null | 'single' | 'double' | 'mixed'
    while (i < n) {
      const c = line[i];
      if (c === " " || c === "\t" || isOpStart(c)) break;

      if (c === "\\") {
        raw += line[i + 1] ?? "";
        i += 2;
        quoted = quoted ? "mixed" : quoted;
        continue;
      }
      if (c === "'" || c === '"') {
        const close = line.indexOf(c, i + 1);
        const end = close === -1 ? n : close;
        raw += line.slice(i + 1, end);
        quoted = quoted === null ? (c === "'" ? "single" : "double") : "mixed";
        i = end + 1;
        continue;
      }
      raw += c;
      i++;
    }
    tokens.push({ type: "word", value: raw, quoted });
  }

  return tokens;
}

function parseCommand(tokens, start) {
  const argv = [];
  const redirects = [];
  let i = start;

  while (i < tokens.length) {
    const t = tokens[i];
    if (t.type === "op" && [">", ">>", "<"].includes(t.value)) {
      const target = tokens[i + 1];
      if (!target || target.type !== "word") {
        throw new Error(`syntax error near unexpected token '${t.value}'`);
      }
      redirects.push({ type: t.value, target: target.value });
      i += 2;
      continue;
    }
    if (t.type === "op") break;
    argv.push(t);
    i++;
  }

  if (argv.length === 0) throw new Error("syntax error: expected a command");
  return { node: { argv, redirects }, next: i };
}

function parsePipeline(tokens, start) {
  const commands = [];
  let i = start;
  for (;;) {
    const { node, next } = parseCommand(tokens, i);
    commands.push(node);
    i = next;
    if (tokens[i] && tokens[i].type === "op" && tokens[i].value === "|") {
      i++;
      continue;
    }
    break;
  }
  return { node: commands, next: i };
}

// Returns a list of statements: { background, chain: [{op, pipeline}] }
export function parse(line) {
  const tokens = tokenize(line);
  if (tokens.length === 0) return [];

  const statements = [];
  let i = 0;

  while (i < tokens.length) {
    const chain = [];
    let { node: pipeline, next } = parsePipeline(tokens, i);
    chain.push({ op: null, pipeline });
    i = next;

    while (
      tokens[i] &&
      tokens[i].type === "op" &&
      (tokens[i].value === "&&" || tokens[i].value === "||")
    ) {
      const op = tokens[i].value;
      i++;
      const res = parsePipeline(tokens, i);
      chain.push({ op, pipeline: res.node });
      i = res.next;
    }

    let background = false;
    if (tokens[i] && tokens[i].type === "op" && tokens[i].value === "&") {
      background = true;
      i++;
    } else if (tokens[i] && tokens[i].type === "op" && tokens[i].value === ";") {
      i++;
    }

    statements.push({ background, chain });
  }

  return statements;
}
