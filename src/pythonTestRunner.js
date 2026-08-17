// Converts a JS value into valid Python literal source. The previous
// implementation built test calls with raw JSON.stringify() interpolation,
// which silently breaks on null/true/false (not valid Python identifiers) —
// this is what test data for questions like #20 and #29 actually needs.
function toPythonLiteral(value) {
  if (value === null) return "None";
  if (typeof value === "boolean") return value ? "True" : "False";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(toPythonLiteral).join(", ")}]`;
  if (typeof value === "object") {
    const entries = Object.entries(value).map(([k, v]) => `${JSON.stringify(k)}: ${toPythonLiteral(v)}`);
    return `{${entries.join(", ")}}`;
  }
  return "None";
}

// Runs a question's test cases against real Pyodide (actual CPython in
// WASM) — the pass/fail signal comes from real execution, not a guess.
export async function runQuestionTests(pyodide, question, code) {
  const sanitized = code.replace(/\u00A0/g, " ");
  await pyodide.runPythonAsync(sanitized);

  const results = [];
  let allPassed = true;

  for (const testCase of question.testCases) {
    const argsSrc = testCase.input.map(toPythonLiteral).join(", ");
    const expectedStrSrc = `str(${toPythonLiteral(testCase.output)})`;
    try {
      const actual = await pyodide.runPythonAsync(`str(${question.functionName}(${argsSrc}))`);
      const expectedStr = await pyodide.runPythonAsync(expectedStrSrc);
      const passed = actual === expectedStr;
      if (!passed) allPassed = false;
      results.push({ input: testCase.input, expectedOutput: expectedStr, actualOutput: actual, passed });
    } catch (err) {
      allPassed = false;
      results.push({
        input: testCase.input,
        expectedOutput: String(testCase.output),
        actualOutput: `Error: ${err.message.split("\n").pop()}`,
        passed: false,
      });
    }
  }

  return { results, allPassed };
}
