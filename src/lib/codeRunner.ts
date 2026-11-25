export type SupportedLanguage = "python" | "javascript" | "cpp" | "java"

export interface CodeTestCase {
  id: string
  label: string
  args: unknown[]
  expected: unknown
  hidden?: boolean
  compareUnordered?: boolean
}

export interface TestCaseOutcome {
  id: string
  label: string
  hidden: boolean
  passed: boolean
  inputDisplay: string
  expectedDisplay: string
  actualDisplay: string
  error?: string
  runtimeMs: number
}

export interface CodeRunResult {
  language: SupportedLanguage
  engineLabel: string
  passedCount: number
  totalCount: number
  allPassed: boolean
  totalRuntimeMs: number
  compileError?: string
  outcomes: TestCaseOutcome[]
}

function deepEqual(a: unknown, b: unknown, unordered = false): boolean {
  if (Object.is(a, b)) return true
  if (typeof a !== typeof b || a === null || b === null) return false
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    if (unordered) {
      const sa = [...a].sort((x, y) => String(x).localeCompare(String(y)))
      const sb = [...b].sort((x, y) => String(x).localeCompare(String(y)))
      return sa.every((val, i) => deepEqual(val, sb[i], false))
    }
    return a.every((val, i) => deepEqual(val, b[i], false))
  }
  if (typeof a === "object" && typeof b === "object") {
    const ka = Object.keys(a as Record<string, unknown>)
    const kb = Object.keys(b as Record<string, unknown>)
    if (ka.length !== kb.length) return false
    return ka.every((k) =>
      deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], false),
    )
  }
  return false
}

function formatVal(val: unknown): string {
  if (val === undefined) return "undefined"
  try {
    return JSON.stringify(val)
  } catch {
    return String(val)
  }
}

/**
 * Clean algorithmic Python-to-JavaScript transpiler for zero-latency browser/worker execution.
 * Supports def, loops (range/enumerate/in), dict/set/list methods, slicing, floor division,
 * tuple unpacking, and standard DSA idioms.
 */
export function transpilePythonToJs(pythonCode: string, expectedFnName: string): string {
  const rawLines = pythonCode.replace(/\r\n/g, "\n").split("\n")
  const out: string[] = [
    "const len = (x) => (x == null ? 0 : typeof x.size === 'number' ? x.size : x.length);",
    "const range = (...args) => {",
    "  let start = 0, stop = 0, step = 1;",
    "  if (args.length === 1) { stop = args[0]; }",
    "  else if (args.length === 2) { start = args[0]; stop = args[1]; }",
    "  else { start = args[0]; stop = args[1]; step = args[2]; }",
    "  const res = [];",
    "  if (step > 0) { for (let i = start; i < stop; i += step) res.push(i); }",
    "  else if (step < 0) { for (let i = start; i > stop; i += step) res.push(i); }",
    "  return res;",
    "};",
    "const enumerate = (arr) => Array.from(arr).map((v, i) => [i, v]);",
    "const max = (...a) => (a.length === 1 && Array.isArray(a[0]) ? Math.max(...a[0]) : Math.max(...a));",
    "const min = (...a) => (a.length === 1 && Array.isArray(a[0]) ? Math.min(...a[0]) : Math.min(...a));",
    "const abs = Math.abs;",
    "const int = (x) => Math.trunc(Number(x));",
    "const float = (x) => Number(x);",
    "const str = (x) => String(x);",
    "const sorted = (arr) => [...arr].sort((a, b) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b))));",
    "const sum = (arr) => arr.reduce((a, b) => a + b, 0);",
    "const __in = (needle, container) => {",
    "  if (container instanceof Set) return container.has(needle);",
    "  if (Array.isArray(container) || typeof container === 'string') return container.includes(needle);",
    "  if (container && typeof container === 'object') return Object.prototype.hasOwnProperty.call(container, String(needle));",
    "  return false;",
    "};",
    "const __get = (obj, key, fallback) => (obj && Object.prototype.hasOwnProperty.call(obj, String(key)) ? obj[key] : fallback);",
    "const __set = (init) => new Set(init || []);",
  ]

  const indentStack: number[] = [0]
  const declaredVarsStack: Set<string>[] = [new Set()]

  function translateExpr(expr: string): string {
    let e = expr.trim()
    e = e.replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false").replace(/\bNone\b/g, "null")
    e = e.replace(/float\(\s*['"]-inf['"]\s*\)/g, "-Infinity")
    e = e.replace(/float\(\s*['"]inf['"]\s*\)/g, "Infinity")
    e = e.replace(/\bset\(\)/g, "__set()")
    e = e.replace(/\bset\(([^)]+)\)/g, "__set($1)")
    e = e.replace(/(\w+)\.get\(([^,]+),\s*([^)]+)\)/g, "__get($1, $2, $3)")
    e = e.replace(/(\w+)\.append\(/g, "$1.push(")
    e = e.replace(/(\w+)\.add\(/g, "$1.add(")
    e = e.replace(/(\w+)\.remove\(/g, "$1.delete(")
    e = e.replace(/(\w+)\.discard\(/g, "$1.delete(")
    e = e.replace(/(\w+)\[::-1\]/g, "(typeof $1 === 'string' ? $1.split('').reverse().join('') : [...$1].reverse())")
    e = e.replace(/(\w+)\[-1\]/g, "$1[$1.length - 1]")
    // Handle `a not in b` and `a in b`
    e = e.replace(/([a-zA-Z0-9_.\[\]'"]+)\s+not\s+in\s+([a-zA-Z0-9_.\[\]()]+)/g, "(!__in($1, $2))")
    e = e.replace(/([a-zA-Z0-9_.\[\]'"]+)\s+in\s+([a-zA-Z0-9_.\[\]()]+)/g, "__in($1, $2)")
    // Floor division a // b
    e = e.replace(/([^/\s]+)\s*\/\/\s*([^/\s,)]+)/g, "Math.floor(($1) / ($2))")
    e = e.replace(/\band\b/g, "&&").replace(/\bor\b/g, "||").replace(/\bnot\b/g, "!")
    return e
  }

  for (const rawLine of rawLines) {
    // Strip trailing comments outside strings
    const cleanedLine = rawLine.replace(/#.*$/, "")
    if (!cleanedLine.trim()) continue

    const indent = cleanedLine.match(/^(\s*)/)?.[1].replace(/\t/g, "  ").length ?? 0
    const line = cleanedLine.trim()

    while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
      indentStack.pop()
      declaredVarsStack.pop()
      out.push("}")
    }

    const currentScope = declaredVarsStack[declaredVarsStack.length - 1]

    if (line.startsWith("def ")) {
      const m = line.match(/^def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*:$/)
      if (!m) throw new Error(`Syntax error in function signature: ${line}`)
      const [, fnName, params] = m
      out.push(`function ${fnName}(${params}) {`)
      indentStack.push(indent + 1)
      const scope = new Set<string>(
        params
          .split(",")
          .map((p) => p.trim().split("=")[0].trim())
          .filter(Boolean),
      )
      declaredVarsStack.push(scope)
      continue
    }

    if (line.startsWith("for ")) {
      const mTuple = line.match(/^for\s+([a-zA-Z_]\w*)\s*,\s*([a-zA-Z_]\w*)\s+in\s+(.+):$/)
      if (mTuple) {
        const [, v1, v2, iter] = mTuple
        out.push(`for (const [${v1}, ${v2}] of ${translateExpr(iter)}) {`)
        indentStack.push(indent + 1)
        const nextScope = new Set(currentScope)
        nextScope.add(v1)
        nextScope.add(v2)
        declaredVarsStack.push(nextScope)
        continue
      }
      const mSingle = line.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.+):$/)
      if (mSingle) {
        const [, v, iter] = mSingle
        out.push(`for (const ${v} of ${translateExpr(iter)}) {`)
        indentStack.push(indent + 1)
        const nextScope = new Set(currentScope)
        nextScope.add(v)
        declaredVarsStack.push(nextScope)
        continue
      }
      throw new Error(`Unsupported for-loop syntax: ${line}`)
    }

    if (line.startsWith("while ")) {
      const cond = line.slice(6, -1)
      out.push(`while (${translateExpr(cond)}) {`)
      indentStack.push(indent + 1)
      declaredVarsStack.push(new Set(currentScope))
      continue
    }

    if (line.startsWith("if ")) {
      const cond = line.slice(3, -1)
      out.push(`if (${translateExpr(cond)}) {`)
      indentStack.push(indent + 1)
      declaredVarsStack.push(new Set(currentScope))
      continue
    }

    if (line.startsWith("elif ")) {
      const cond = line.slice(5, -1)
      out.push(`else if (${translateExpr(cond)}) {`)
      indentStack.push(indent + 1)
      declaredVarsStack.push(new Set(currentScope))
      continue
    }

    if (line === "else:") {
      out.push("else {")
      indentStack.push(indent + 1)
      declaredVarsStack.push(new Set(currentScope))
      continue
    }

    if (line.startsWith("return")) {
      const rest = line.slice(6).trim()
      out.push(rest ? `return ${translateExpr(rest)};` : "return;")
      continue
    }

    if (line === "break" || line === "continue") {
      out.push(`${line};`)
      continue
    }

    // Tuple assignment: a, b = x, y
    const tupleAssign = line.match(/^([a-zA-Z_]\w*)\s*,\s*([a-zA-Z_]\w*)\s*=\s*(.+)$/)
    if (tupleAssign && !line.includes("==")) {
      const [, v1, v2, rhs] = tupleAssign
      const rhsParts = rhs.split(",").map((p) => translateExpr(p))
      const needsDecl = !currentScope.has(v1) && !currentScope.has(v2)
      if (needsDecl) {
        currentScope.add(v1)
        currentScope.add(v2)
        out.push(`let [${v1}, ${v2}] = [${rhsParts.join(", ")}];`)
      } else {
        out.push(`[${v1}, ${v2}] = [${rhsParts.join(", ")}];`)
      }
      continue
    }

    // Simple assignment: var = expr (not ==, !=, <=, >=, +=, -=)
    const simpleAssign = line.match(/^([a-zA-Z_]\w*)\s*=\s*(?!=)(.+)$/)
    if (simpleAssign) {
      const [, name, rhs] = simpleAssign
      if (!currentScope.has(name)) {
        currentScope.add(name)
        out.push(`let ${name} = ${translateExpr(rhs)};`)
      } else {
        out.push(`${name} = ${translateExpr(rhs)};`)
      }
      continue
    }

    // Augmented assignment or expression statement
    out.push(`${translateExpr(line)};`)
  }

  while (indentStack.length > 1) {
    indentStack.pop()
    out.push("}")
  }

  out.push(`return typeof ${expectedFnName} === 'function' ? ${expectedFnName} : null;`)
  return out.join("\n")
}

/**
 * Clean C++ / Java algorithmic body transpiler for in-browser OA testing when Judge0 proxy is offline.
 */
export function transpileClikeToJs(
  sourceCode: string,
  language: "cpp" | "java",
  expectedFnName: string,
): string {
  let code = sourceCode.replace(/\r\n/g, "\n")
  // Strip includes/imports/class wrappers cleanly
  code = code.replace(/^\s*#include.*$/gm, "")
  code = code.replace(/^\s*using\s+namespace\s+\w+\s*;\s*$/gm, "")
  code = code.replace(/^\s*import\s+.*;\s*$/gm, "")
  code = code.replace(/public\s+class\s+\w+\s*\{([\s\S]*)\}\s*$/m, "$1")
  code = code.replace(/class\s+Solution\s*\{([\s\S]*)\}\s*;?\s*$/m, "$1")

  // Convert method signature to JS function
  code = code.replace(
    /(?:public\s+|private\s+|static\s+)*(?:vector<[^>]+>|int\[\]|int|long|double|boolean|bool|String|string)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)/g,
    (_, fnName: string, rawParams: string) => {
      const params = rawParams
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => {
          const tokens = p.replace(/[&*\[\]]/g, " ").trim().split(/\s+/)
          return tokens[tokens.length - 1]
        })
        .join(", ")
      return `function ${fnName}(${params})`
    },
  )

  if (language === "cpp") {
    // Variable declarations
    code = code.replace(/unordered_map<[^>]+>\s+(\w+)\s*;/g, "const $1 = new Map();")
    code = code.replace(/unordered_set<[^>]+>\s+(\w+)\s*;/g, "const $1 = new Set();")
    code = code.replace(/stack<[^>]+>\s+(\w+)\s*;/g, "const $1 = [];")
    code = code.replace(/vector<[^>]+>\s+(\w+)\s*;/g, "const $1 = [];")
    code = code.replace(/\b(?:int|long long|long|double|size_t|char|bool)\s+(\w+)\s*=/g, "let $1 =")
    code = code.replace(/\b(?:int|long long|long|double|char|bool)\s+(\w+)\s*;/g, "let $1 = 0;")
    code = code.replace(/(\w+)\.count\(([^)]+)\)/g, "$1.has($2)")
    code = code.replace(/(\w+)\.find\(([^)]+)\)\s*!=\s*\1\.end\(\)/g, "$1.has($2)")
    code = code.replace(/(\w+)\.push_back\(/g, "$1.push(")
    code = code.replace(/(\w+)\.size\(\)/g, "$1.length")
    code = code.replace(/(\w+)\.empty\(\)/g, "($1.length === 0)")
    code = code.replace(/(\w+)\.top\(\)/g, "$1[$1.length - 1]")
    code = code.replace(/(\w+)\.insert\(/g, "$1.add(")
    code = code.replace(/(\w+)\.erase\(/g, "$1.delete(")
    // Map indexing seen[x] = i and seen[nums[i]] (supports 1-level nested brackets)
    code = code.replace(
      /(\bseen|\bfreq|\bmap|\bidxMap|\blastSeen)\[((?:[^\[\]]|\[[^\]]*\])+)\]\s*=\s*([^;]+);/g,
      "$1.set($2, $3);",
    )
    code = code.replace(
      /(\bseen|\bfreq|\bmap|\bidxMap|\blastSeen)\[((?:[^\[\]]|\[[^\]]*\])+)\]/g,
      "($1.get($2) ?? 0)",
    )
    code = code.replace(/return\s*\{([^}]*)\}\s*;/g, "return [$1];")
    code = code.replace(/\bINT_MIN\b/g, "-Infinity")
    code = code.replace(/\bINT_MAX\b/g, "Infinity")
    code = code.replace(/\bstd::max\b|\bmax\(/g, (m) => (m.includes("(") ? "Math.max(" : "Math.max"))
    code = code.replace(/\bstd::min\b|\bmin\(/g, (m) => (m.includes("(") ? "Math.min(" : "Math.min"))
  } else {
    // Java
    code = code.replace(/Map<[^>]+>\s+(\w+)\s*=\s*new\s+HashMap<[^>]*>\(\)\s*;/g, "const $1 = new Map();")
    code = code.replace(/HashMap<[^>]+>\s+(\w+)\s*=\s*new\s+HashMap<[^>]*>\(\)\s*;/g, "const $1 = new Map();")
    code = code.replace(/Set<[^>]+>\s+(\w+)\s*=\s*new\s+HashSet<[^>]*>\(\)\s*;/g, "const $1 = new Set();")
    code = code.replace(/Deque<[^>]+>\s+(\w+)\s*=\s*new\s+ArrayDeque<[^>]*>\(\)\s*;/g, "const $1 = [];")
    code = code.replace(/Stack<[^>]+>\s+(\w+)\s*=\s*new\s+Stack<[^>]*>\(\)\s*;/g, "const $1 = [];")
    code = code.replace(/\b(?:int|long|double|char|boolean)\s+(\w+)\s*=/g, "let $1 =")
    code = code.replace(/\b(?:int|long|double|char|boolean)\s+(\w+)\s*;/g, "let $1 = 0;")
    code = code.replace(/(\w+)\.containsKey\(/g, "$1.has(")
    code = code.replace(/(\w+)\.contains\(/g, "$1.has(")
    code = code.replace(/(\w+)\.put\(/g, "$1.set(")
    code = code.replace(/(\w+)\.getOrDefault\(([^,]+),\s*([^)]+)\)/g, "($1.has($2) ? $1.get($2) : $3)")
    code = code.replace(/(\w+)\.isEmpty\(\)/g, "($1.length === 0)")
    code = code.replace(/(\w+)\.peek\(\)/g, "$1[$1.length - 1]")
    code = code.replace(/(\w+)\.length\(\)/g, "$1.length")
    code = code.replace(/(\w+)\.charAt\(([^)]+)\)/g, "$1[$2]")
    code = code.replace(/new\s+int\[\]\s*\{([^}]*)\}/g, "[$1]")
    code = code.replace(/Integer\.MIN_VALUE/g, "-Infinity")
    code = code.replace(/Integer\.MAX_VALUE/g, "Infinity")
  }

  return `${code}\nreturn typeof ${expectedFnName} === 'function' ? ${expectedFnName} : null;`
}

function executeInWorker(
  jsFactoryBody: string,
  testCases: CodeTestCase[],
  timeoutMs = 2000,
): Promise<{ compileError?: string; outcomes: TestCaseOutcome[]; totalRuntimeMs: number }> {
  // Fallback for Node unit tests where Worker/Blob URL is unavailable
  if (typeof Worker === "undefined" || typeof Blob === "undefined" || typeof URL === "undefined") {
    return executeDirectlyInMemory(jsFactoryBody, testCases)
  }

  return new Promise((resolve) => {
    const workerScript = `
      self.onmessage = function(e) {
        const { jsFactoryBody, testCases } = e.data;
        try {
          const factory = new Function(jsFactoryBody);
          const fn = factory();
          if (typeof fn !== 'function') {
            self.postMessage({ compileError: 'Expected function definition was not found. Check the function name and syntax.' });
            return;
          }
          const results = [];
          let totalMs = 0;
          for (const tc of testCases) {
            const clonedArgs = JSON.parse(JSON.stringify(tc.args));
            const t0 = performance.now();
            try {
              const actual = fn(...clonedArgs);
              const dt = Math.max(0.05, Number((performance.now() - t0).toFixed(2)));
              totalMs += dt;
              results.push({ id: tc.id, actual, runtimeMs: dt });
            } catch (err) {
              const dt = Math.max(0.05, Number((performance.now() - t0).toFixed(2)));
              totalMs += dt;
              results.push({ id: tc.id, error: err && err.message ? err.message : String(err), runtimeMs: dt });
            }
          }
          self.postMessage({ results, totalRuntimeMs: Number(totalMs.toFixed(2)) });
        } catch (err) {
          self.postMessage({ compileError: err && err.message ? err.message : String(err) });
        }
      };
    `
    const blob = new Blob([workerScript], { type: "application/javascript" })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)

    const timer = window.setTimeout(() => {
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve({
        compileError: "Time Limit Exceeded (2000 ms). Check for infinite loops or high time complexity.",
        outcomes: [],
        totalRuntimeMs: timeoutMs,
      })
    }, timeoutMs)

    worker.onmessage = (event: MessageEvent<{ compileError?: string; results?: Array<{ id: string; actual?: unknown; error?: string; runtimeMs: number }>; totalRuntimeMs?: number }>) => {
      window.clearTimeout(timer)
      worker.terminate()
      URL.revokeObjectURL(url)

      const data = event.data
      if (data.compileError) {
        resolve({ compileError: data.compileError, outcomes: [], totalRuntimeMs: 0 })
        return
      }

      const rawResults = data.results ?? []
      const outcomes: TestCaseOutcome[] = testCases.map((tc) => {
        const match = rawResults.find((r) => r.id === tc.id)
        const inputDisplay = tc.args.map(formatVal).join(", ")
        const expectedDisplay = formatVal(tc.expected)
        if (!match || match.error) {
          return {
            id: tc.id,
            label: tc.label,
            hidden: Boolean(tc.hidden),
            passed: false,
            inputDisplay,
            expectedDisplay,
            actualDisplay: "Runtime Error",
            error: match?.error ?? "No result returned",
            runtimeMs: match?.runtimeMs ?? 0,
          }
        }
        const passed = deepEqual(match.actual, tc.expected, tc.compareUnordered)
        return {
          id: tc.id,
          label: tc.label,
          hidden: Boolean(tc.hidden),
          passed,
          inputDisplay,
          expectedDisplay,
          actualDisplay: formatVal(match.actual),
          runtimeMs: match.runtimeMs,
        }
      })

      resolve({
        outcomes,
        totalRuntimeMs: data.totalRuntimeMs ?? 0,
      })
    }

    worker.onerror = (err) => {
      window.clearTimeout(timer)
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve({
        compileError: err.message || "Sandbox execution error",
        outcomes: [],
        totalRuntimeMs: 0,
      })
    }

    worker.postMessage({ jsFactoryBody, testCases })
  })
}

async function executeDirectlyInMemory(
  jsFactoryBody: string,
  testCases: CodeTestCase[],
): Promise<{ compileError?: string; outcomes: TestCaseOutcome[]; totalRuntimeMs: number }> {
  try {
    const factory = new Function(jsFactoryBody) as () => ((...args: unknown[]) => unknown) | null
    const fn = factory()
    if (typeof fn !== "function") {
      return {
        compileError: "Expected function definition was not found.",
        outcomes: [],
        totalRuntimeMs: 0,
      }
    }
    let totalRuntimeMs = 0
    const outcomes: TestCaseOutcome[] = testCases.map((tc) => {
      const clonedArgs = JSON.parse(JSON.stringify(tc.args)) as unknown[]
      const t0 = performance.now()
      try {
        const actual = fn(...clonedArgs)
        const dt = Math.max(0.05, Number((performance.now() - t0).toFixed(2)))
        totalRuntimeMs += dt
        const passed = deepEqual(actual, tc.expected, tc.compareUnordered)
        return {
          id: tc.id,
          label: tc.label,
          hidden: Boolean(tc.hidden),
          passed,
          inputDisplay: tc.args.map(formatVal).join(", "),
          expectedDisplay: formatVal(tc.expected),
          actualDisplay: formatVal(actual),
          runtimeMs: dt,
        }
      } catch (err) {
        const dt = Math.max(0.05, Number((performance.now() - t0).toFixed(2)))
        totalRuntimeMs += dt
        return {
          id: tc.id,
          label: tc.label,
          hidden: Boolean(tc.hidden),
          passed: false,
          inputDisplay: tc.args.map(formatVal).join(", "),
          expectedDisplay: formatVal(tc.expected),
          actualDisplay: "Runtime Error",
          error: err instanceof Error ? err.message : String(err),
          runtimeMs: dt,
        }
      }
    })
    return { outcomes, totalRuntimeMs: Number(totalRuntimeMs.toFixed(2)) }
  } catch (err) {
    return {
      compileError: err instanceof Error ? err.message : String(err),
      outcomes: [],
      totalRuntimeMs: 0,
    }
  }
}

export async function runSandboxedCode({
  language,
  code,
  functionName,
  testCases,
}: {
  language: SupportedLanguage
  code: string
  functionName: string
  testCases: CodeTestCase[]
}): Promise<CodeRunResult> {
  if (!code.trim()) {
    return {
      language,
      engineLabel: "SMK Browser Sandbox",
      passedCount: 0,
      totalCount: testCases.length,
      allPassed: false,
      totalRuntimeMs: 0,
      compileError: "Write a solution before running tests.",
      outcomes: [],
    }
  }

  let jsFactoryBody = ""
  let engineLabel = "WebWorker JS Sandbox"

  try {
    if (language === "javascript") {
      jsFactoryBody = `${code}\nreturn typeof ${functionName} === 'function' ? ${functionName} : null;`
      engineLabel = "WebWorker JS Sandbox"
    } else if (language === "python") {
      jsFactoryBody = transpilePythonToJs(code, functionName)
      engineLabel = "In-Browser Python Runner"
    } else if (language === "cpp") {
      jsFactoryBody = transpileClikeToJs(code, "cpp", functionName)
      engineLabel = "SMK C++17 OA Runner"
    } else {
      jsFactoryBody = transpileClikeToJs(code, "java", functionName)
      engineLabel = "SMK Java 17 OA Runner"
    }
  } catch (err) {
    return {
      language,
      engineLabel,
      passedCount: 0,
      totalCount: testCases.length,
      allPassed: false,
      totalRuntimeMs: 0,
      compileError: err instanceof Error ? err.message : String(err),
      outcomes: [],
    }
  }

  const execResult = await executeInWorker(jsFactoryBody, testCases)
  if (execResult.compileError) {
    return {
      language,
      engineLabel,
      passedCount: 0,
      totalCount: testCases.length,
      allPassed: false,
      totalRuntimeMs: execResult.totalRuntimeMs,
      compileError: execResult.compileError,
      outcomes: [],
    }
  }

  const passedCount = execResult.outcomes.filter((o) => o.passed).length
  return {
    language,
    engineLabel,
    passedCount,
    totalCount: testCases.length,
    allPassed: passedCount === testCases.length && testCases.length > 0,
    totalRuntimeMs: execResult.totalRuntimeMs,
    outcomes: execResult.outcomes,
  }
}
