import test from "node:test"
import assert from "node:assert/strict"
import { runSandboxedCode } from "./codeRunner"
import { computeDiagnosticResult, DIAGNOSTIC_DEBUG_CHALLENGE } from "./diagnosticEngine"
import { OA_PROBLEMS } from "./oaEngine"
import { buildSyllabusBrief, computeTierPercentages, generateCohortCsv, SAMPLE_COHORT_DATA } from "./tpoAnalytics"

test("codeRunner executes Python optimal Two Sum and passes all test cases", async () => {
  const res = await runSandboxedCode({
    language: "python",
    functionName: "two_sum",
    code: `def two_sum(nums, target):
  seen = {}
  for i, num in enumerate(nums):
    need = target - num
    if need in seen:
      return [seen[need], i]
    seen[num] = i
  return []`,
    testCases: DIAGNOSTIC_DEBUG_CHALLENGE.testCases,
  })
  assert.equal(res.compileError, undefined)
  assert.equal(res.allPassed, true)
  assert.equal(res.passedCount, 3)
})

test("codeRunner detects the intentional self-pairing bug in diagnostic Python starter", async () => {
  const res = await runSandboxedCode({
    language: "python",
    functionName: DIAGNOSTIC_DEBUG_CHALLENGE.functionNamePython,
    code: DIAGNOSTIC_DEBUG_CHALLENGE.buggyPython,
    testCases: DIAGNOSTIC_DEBUG_CHALLENGE.testCases,
  })
  assert.equal(res.compileError, undefined)
  assert.equal(res.allPassed, false)
})

test("codeRunner executes every OA problem starter solution across Python, JS, C++, and Java", async () => {
  for (const problem of OA_PROBLEMS) {
    for (const lang of ["python", "javascript", "cpp", "java"] as const) {
      const res = await runSandboxedCode({
        language: lang,
        functionName: problem.functionNames[lang],
        code: problem.starterCode[lang],
        testCases: problem.testCases,
      })
      assert.equal(
        res.compileError,
        undefined,
        `${problem.id} (${lang}) had compileError: ${res.compileError}`,
      )
      assert.equal(
        res.allPassed,
        true,
        `${problem.id} (${lang}) passed ${res.passedCount}/${res.totalCount}`,
      )
    }
  }
})

test("diagnosticEngine computes accurate 4-axis readiness bands and roadmap deep links", () => {
  const high = computeDiagnosticResult({
    btechYear: "3rd Year",
    targetTier: "Product Startup / Engineering",
    answers: {
      "diag-q1-complexity": "b",
      "diag-q2-trace": "b",
      "diag-q4-stack-web": "b",
      "diag-q5-stack-arch": "b",
    },
    debugPassed: true,
    elapsedSeconds: 95,
  })
  assert.equal(high.readinessBand, "Product-Ready")
  assert.ok(high.overallScore >= 85)
  assert.equal(high.studyPlan.length, 3)
  assert.ok(high.studyPlan[0].href.startsWith("/programs/"))

  const low = computeDiagnosticResult({
    btechYear: "2nd Year",
    targetTier: "Service / Mass Recruiter",
    answers: {
      "diag-q1-complexity": "a",
      "diag-q2-trace": "a",
      "diag-q4-stack-web": "a",
      "diag-q5-stack-arch": "a",
    },
    debugPassed: false,
    elapsedSeconds: 300,
  })
  assert.equal(low.readinessBand, "Foundation")
  assert.equal(low.recommendedSlug, "python")
})

test("tpoAnalytics computes tier percentages, escapes CSV, and builds syllabus brief from roadmaps", () => {
  const pct = computeTierPercentages(SAMPLE_COHORT_DATA.tierDistribution)
  assert.equal(pct.foundationPct + pct.assessmentReadyPct + pct.productReadyPct, 100)

  const csv = generateCohortCsv(SAMPLE_COHORT_DATA.students)
  const lines = csv.split("\n")
  assert.equal(lines.length, SAMPLE_COHORT_DATA.students.length + 1)
  assert.ok(lines[0].includes("Readiness Tier"))
  assert.ok(lines[1].includes("Arjun Reddy"))

  const brief = buildSyllabusBrief({
    collegeName: "JNTU Hyderabad",
    batchKey: "third-year",
    batchSize: 180,
    deliveryMode: "Offline Campus Lab",
  })
  assert.equal(brief.collegeName, "JNTU Hyderabad")
  assert.equal(brief.batchSize, 180)
  assert.ok(brief.modules.length >= 4)
})
