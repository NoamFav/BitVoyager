// fengari (the real Lua VM behind the Lua module) was written for Node
// and touches `process` in a few places at *import* time — not just
// inside functions we could avoid calling. Rather than chase each
// individual property through fengari's source (env, versions.node,
// stdout...) or fight Vite's own partial process shimming, this gives it
// a small but complete-enough process object up front. Must be imported
// before anything that (transitively) imports fengari — see main.jsx.
if (typeof globalThis.process === "undefined" || !globalThis.process.versions) {
  globalThis.process = {
    env: {},
    versions: { node: "18" },
    platform: "browser",
    stdout: { write: () => {} },
    stderr: { write: () => {} },
    cwd: () => "/",
    exit: () => {},
    ...globalThis.process,
  };
}
