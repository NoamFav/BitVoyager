// Stand-in for the "readline-sync" npm package, which fengari's debug
// library imports at module scope to back Lua's debug.debug() REPL. We
// never register the debug library (see luaTestRunner.js's
// openSafeLibs), so none of this is ever actually called — the stub
// just needs to exist and not throw at import time.
function setDefaultOptions() {}
function prompt() {
  return "";
}

export default { setDefaultOptions, prompt };
export { setDefaultOptions, prompt };
