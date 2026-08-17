import { lua, lauxlib, lualib, to_luastring } from "fengari";

// Only the libraries actual lesson code needs — skipping io/os/package/debug
// both sidesteps their Node-only internals (process.stdout, process.cwd(),
// child_process...) and keeps student code sandboxed from the filesystem
// and OS by construction.
function openSafeLibs(L) {
  const libs = {
    _G: lualib.luaopen_base,
    table: lualib.luaopen_table,
    string: lualib.luaopen_string,
    math: lualib.luaopen_math,
    utf8: lualib.luaopen_utf8,
  };
  for (const [name, open] of Object.entries(libs)) {
    lauxlib.luaL_requiref(L, to_luastring(name), open, 1);
    lua.lua_pop(L, 1);
  }
  // print() is part of the base lib and writes via process.stdout, which
  // doesn't exist in the browser — replace it with a harmless no-op.
  lua.lua_pushjsfunction(L, () => 0);
  lua.lua_setglobal(L, to_luastring("print"));
}

// Minimal, controlled JS<->Lua marshalling — deliberately not using
// fengari-interop's `js` library bridge, which is built for exposing JS
// objects/functions *to* Lua code and needs extra runtime setup we don't
// need here. We only ever move plain numbers/strings/booleans/arrays
// across the boundary for test cases, so a small hand-rolled converter
// (mirroring the toPythonLiteral bridge for Pyodide) is more predictable.
function pushValue(L, value) {
  if (value === null || value === undefined) {
    lua.lua_pushnil(L);
  } else if (typeof value === "boolean") {
    lua.lua_pushboolean(L, value);
  } else if (typeof value === "number") {
    lua.lua_pushnumber(L, value);
  } else if (typeof value === "string") {
    lua.lua_pushstring(L, to_luastring(value));
  } else if (Array.isArray(value)) {
    lua.lua_createtable(L, value.length, 0);
    value.forEach((item, i) => {
      pushValue(L, item);
      lua.lua_rawseti(L, -2, i + 1); // Lua arrays are 1-indexed
    });
  } else if (typeof value === "object") {
    lua.lua_newtable(L);
    for (const [k, v] of Object.entries(value)) {
      pushValue(L, v);
      lua.lua_setfield(L, -2, to_luastring(k));
    }
  } else {
    lua.lua_pushnil(L);
  }
}

function readValue(L, idx) {
  switch (lua.lua_type(L, idx)) {
    case lua.LUA_TNIL:
      return null;
    case lua.LUA_TBOOLEAN:
      return lua.lua_toboolean(L, idx);
    case lua.LUA_TNUMBER:
      return lua.lua_tonumber(L, idx);
    case lua.LUA_TSTRING:
      return lua.lua_tojsstring(L, idx);
    case lua.LUA_TTABLE: {
      const len = lua.lua_rawlen(L, idx);
      const arr = [];
      for (let i = 1; i <= len; i++) {
        lua.lua_rawgeti(L, idx, i);
        arr.push(readValue(L, -1));
        lua.lua_pop(L, 1);
      }
      return arr;
    }
    default:
      return null;
  }
}

function stringify(value) {
  if (value === null || value === undefined) return "nil";
  if (Array.isArray(value)) return `{${value.map(stringify).join(", ")}}`;
  return String(value);
}

function valuesEqual(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => valuesEqual(v, b[i]));
  }
  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) < 1e-9;
  }
  return a === b;
}

// Runs a lesson's test cases against real fengari (an actual Lua 5.3 VM
// written in JS) — the same "genuinely execute it" bar as the Bash shell
// and the Pyodide-backed Python runner.
export async function runLuaTests(lesson, code) {
  const L = lauxlib.luaL_newstate();
  openSafeLibs(L);

  const loadStatus = lauxlib.luaL_dostring(L, to_luastring(code));
  if (loadStatus !== lua.LUA_OK) {
    const message = lua.lua_tojsstring(L, -1);
    throw new Error(message);
  }

  const results = [];
  let allPassed = true;

  for (const testCase of lesson.testCases) {
    try {
      lua.lua_getglobal(L, to_luastring(lesson.functionName));
      if (lua.lua_type(L, -1) !== lua.LUA_TFUNCTION) {
        throw new Error(`function '${lesson.functionName}' is not defined`);
      }
      for (const arg of testCase.input) pushValue(L, arg);
      const status = lua.lua_pcall(L, testCase.input.length, 1, 0);
      if (status !== lua.LUA_OK) {
        const message = lua.lua_tojsstring(L, -1);
        lua.lua_pop(L, 1);
        throw new Error(message);
      }
      const actual = readValue(L, -1);
      lua.lua_pop(L, 1);

      const passed = valuesEqual(actual, testCase.output);
      if (!passed) allPassed = false;
      results.push({
        input: testCase.input,
        expectedOutput: stringify(testCase.output),
        actualOutput: stringify(actual),
        passed,
      });
    } catch (err) {
      allPassed = false;
      results.push({
        input: testCase.input,
        expectedOutput: stringify(testCase.output),
        actualOutput: `Error: ${err.message}`,
        passed: false,
      });
    }
  }

  return { results, allPassed };
}
