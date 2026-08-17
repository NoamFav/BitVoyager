// Stand-in for the "tmp" npm package (temp-file creation), which
// fengari's os library imports at module scope purely to back Lua's
// os.tmpname(). We never register the os library (see luaTestRunner.js),
// so tmpNameSync is never actually called — this just needs to exist so
// the import doesn't throw.
export function tmpNameSync() {
  return "/tmp/unused";
}

export default { tmpNameSync };
