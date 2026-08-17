// Browser stand-in for Node's built-in "os" module. fengari calls
// os.platform() at import time to pick a path-separator convention; the
// actual value only needs to not be "win32" for it to take the safe,
// dependency-free branch.
export function platform() {
  return "browser";
}

export default { platform };
