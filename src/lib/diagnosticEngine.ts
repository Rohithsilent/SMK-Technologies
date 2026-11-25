import type { CodeTestCase } from "./codeRunner"

export type BtechYear = "2nd Year" | "3rd Year" | "Final Year"
export type TargetHiringTier =
  | "Service / Mass Recruiter"
  | "Product Startup / Engineering"
  | "Full-Stack / AI Role"

export interface DiagnosticMcq {
  id: string
  category: "complexity" | "trace" | "stack"
  axis: "complexityIntuition" | "problemSolving" | "stackReadiness"
  prompt: string
  codeSnippet?: string
  options: { id: string; label: string }[]
  correctOptionId: string
  explanation: string
  roadmapSlug: "python" | "dsa" | "web-development" | "machine-learning"
  stageId: string
}

export interface DiagnosticDebugChallenge {
  id: string
  title: string
  prompt: string
  functionNamePython: string
  functionNameJs: string
  buggyPython: string
  buggyJs: string
  hint: string
  testCases: CodeTestCase[]
}

export interface StudyPlanStep {
  title: string
  reason: string
  programSlug: "python" | "dsa" | "web-development" | "machine-learning"
  stageId: string
  href: string
  priority: "Priority 1" | "Priority 2" | "Priority 3"
}

export interface DiagnosticResult {
  btechYear: BtechYear
  targetTier: TargetHiringTier
  overallScore: number
  readinessBand: "Foundation" | "Assessment-Ready" | "Product-Ready"
  axes: {
    problemSolving: number
    complexityIntuition: number
    implementationSpeed: number
    stackReadiness: number
  }
  recommendedSlug: "python" | "dsa" | "web-development" | "machine-learning"
  recommendedStageId: string
  studyPlan: StudyPlanStep[]
  completedAt: string
}

export const PENDING_DIAGNOSTIC_KEY = "smk_pending_diagnostic_v1"

export const DIAGNOSTIC_MCQS: DiagnosticMcq[] = [
  {
    id: "diag-q1-complexity",
    category: "complexity",
    axis: "complexityIntuition",
    prompt:
      "An online assessment gives N ≤ 2 × 10⁵ integers with a 1-second time limit. Which worst-case time complexity will safely pass without TLE?",
    codeSnippet: "Constraints: 1 <= N <= 200,000 | Time Limit: 1.0s (~10⁸ ops)",
    options: [
      { id: "a", label: "O(N²) nested pair loops" },
      { id: "b", label: "O(N log N) sorting or O(N) hash/two-pointer pass" },
      { id: "c", label: "O(2^N) recursive subset enumeration" },
      { id: "d", label: "O(N³) triple loop with break" },
    ],
    correctOptionId: "b",
    explanation:
      "At N = 2 × 10⁵, N² = 4 × 10¹⁰ operations (guaranteed TLE). O(N log N) is ~3.5 × 10⁶ operations and passes comfortably.",
    roadmapSlug: "dsa",
    stageId: "dsa-s1",
  },
  {
    id: "diag-q2-trace",
    category: "trace",
    axis: "problemSolving",
    prompt:
      "You need to count all contiguous subarrays whose sum equals K, and the input array contains negative numbers. Which pattern is guaranteed to work in O(N)?",
    codeSnippet: "nums = [3, -1, 2, -2, 4], K = 2",
    options: [
      { id: "a", label: "Variable Sliding Window (expand right, shrink left)" },
      { id: "b", label: "Prefix Sum + HashMap storing earlier prefix frequencies" },
      { id: "c", label: "Sort the array first, then apply Two Pointers" },
      { id: "d", label: "Binary search on the array elements" },
    ],
    correctOptionId: "b",
    explanation:
      "Negative numbers break sliding window monotonicity, and sorting destroys contiguous subarray order. Prefix Sum + HashMap handles negatives in O(N).",
    roadmapSlug: "dsa",
    stageId: "dsa-s3",
  },
  {
    id: "diag-q4-stack-web",
    category: "stack",
    axis: "stackReadiness",
    prompt:
      "In a Python / Full-Stack backend API, why is `x in my_set` preferred over `x in my_list` when checking 50,000 blocked tokens per request?",
    options: [
      { id: "a", label: "Sets maintain insertion order automatically" },
      { id: "b", label: "Set membership is average O(1) hash lookup vs O(N) linear scan" },
      { id: "c", label: "Lists cannot store strings longer than 64 bytes" },
      { id: "d", label: "Sets use zero memory on the heap" },
    ],
    correctOptionId: "b",
    explanation:
      "Hash-based sets compute a direct bucket index in O(1) average time, eliminating per-request O(N) scans.",
    roadmapSlug: "python",
    stageId: "py-s3",
  },
  {
    id: "diag-q5-stack-arch",
    category: "stack",
    axis: "stackReadiness",
    prompt:
      "A React dashboard calls `fetch('/api/orders')` inside `useEffect` without a dependency array. What bug happens in production?",
    options: [
      { id: "a", label: "The request never fires on mount" },
      { id: "b", label: "Every state update re-triggers the effect, causing an infinite request loop" },
      { id: "c", label: "React automatically caches the response forever" },
      { id: "d", label: "CORS headers are stripped by the browser" },
    ],
    correctOptionId: "b",
    explanation:
      "Omitting the dependency array runs the effect after every render; setting state from the fetch response immediately schedules another render and fetch.",
    roadmapSlug: "web-development",
    stageId: "web-s2",
  },
]

export const DIAGNOSTIC_DEBUG_CHALLENGE: DiagnosticDebugChallenge = {
  id: "diag-q3-debug",
  title: "Live Debugging Fix: First Duplicate-Safe Two Sum",
  prompt:
    "The function below tries to return indices [i, j] of two distinct elements that add up to target, but it has a classic bug that allows using the same element twice (e.g., nums=[3, 3], target=6 or nums=[3, 2, 4], target=6). Fix the bug and run tests.",
  functionNamePython: "two_sum",
  functionNameJs: "twoSum",
  buggyPython: `def two_sum(nums, target):
  seen = {}
  for i, num in enumerate(nums):
    seen[num] = i
    need = target - num
    if need in seen:
      return [seen[need], i]
  return []`,
  buggyJs: `function twoSum(nums, target) {
  const seen = {};
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    seen[num] = i;
    const need = target - num;
    if (need in seen) {
      return [seen[need], i];
    }
  }
  return [];
}`,
  hint: "Check whether `need` already exists in `seen` BEFORE storing `seen[num] = i` so index `i` cannot match itself.",
  testCases: [
    { id: "d1", label: "Distinct pair [3, 2, 4], target=6", args: [[3, 2, 4], 6], expected: [1, 2] },
    { id: "d2", label: "Duplicate values [3, 3], target=6", args: [[3, 3], 6], expected: [0, 1] },
    { id: "d3", label: "Negatives [-4, 1, 7, 5], target=3", args: [[-4, 1, 7, 5], 3], expected: [0, 2] },
  ],
}

export function computeDiagnosticResult({
  btechYear,
  targetTier,
  answers,
  debugPassed,
  elapsedSeconds,
}: {
  btechYear: BtechYear
  targetTier: TargetHiringTier
  answers: Record<string, string>
  debugPassed: boolean
  elapsedSeconds: number
}): DiagnosticResult {
  const q1Correct = answers["diag-q1-complexity"] === "b"
  const q2Correct = answers["diag-q2-trace"] === "b"
  const q4Correct = answers["diag-q4-stack-web"] === "b"
  const q5Correct = answers["diag-q5-stack-arch"] === "b"

  const complexityIntuition = q1Correct ? (q2Correct ? 94 : 78) : q2Correct ? 62 : 34
  const problemSolving = (q2Correct ? 48 : 18) + (debugPassed ? 48 : 16)
  const stackReadiness = (q4Correct ? 48 : 18) + (q5Correct ? 48 : 18)

  // Implementation speed rewards passing the live code fix promptly
  let implementationSpeed = 32
  if (debugPassed) {
    if (elapsedSeconds <= 150) implementationSpeed = 94
    else if (elapsedSeconds <= 260) implementationSpeed = 82
    else implementationSpeed = 70
  } else if (q1Correct || q2Correct) {
    implementationSpeed = 46
  }

  const overallScore = Math.round(
    (problemSolving + complexityIntuition + implementationSpeed + stackReadiness) / 4,
  )

  const readinessBand: DiagnosticResult["readinessBand"] =
    overallScore >= 80 ? "Product-Ready" : overallScore >= 55 ? "Assessment-Ready" : "Foundation"

  const studyPlan: StudyPlanStep[] = []

  if (!q1Correct || !debugPassed) {
    studyPlan.push({
      title: "Complexity Bounds & Hash-Table Lookup Discipline",
      reason: !debugPassed
        ? "Your live Two-Sum debugging check hit an index-reuse edge case — solidify single-pass hashing."
        : "Sharpen constraint-to-complexity intuition (10⁵ vs 10⁸ rule) to prevent TLE in timed OAs.",
      programSlug: btechYear === "2nd Year" && !debugPassed ? "python" : "dsa",
      stageId: btechYear === "2nd Year" && !debugPassed ? "py-s3" : "dsa-s1",
      href:
        btechYear === "2nd Year" && !debugPassed
          ? "/programs/python#py-s3"
          : "/programs/dsa#dsa-s1",
      priority: "Priority 1",
    })
  }

  if (!q2Correct) {
    studyPlan.push({
      title: "Prefix Sum + HashMap & Binary Search on Answers",
      reason: "Negative-value subarray questions frequently separate Service IT rounds from Product interviews.",
      programSlug: "dsa",
      stageId: "dsa-s3",
      href: "/programs/dsa#dsa-s3",
      priority: studyPlan.length === 0 ? "Priority 1" : "Priority 2",
    })
  }

  if (!q4Correct || btechYear === "2nd Year") {
    studyPlan.push({
      title: "Python Collections, Hashing & Speed Drills",
      reason: "Master O(1) dictionary/set workflows and fast I/O for campus screening tests.",
      programSlug: "python",
      stageId: "py-s3",
      href: "/programs/python#py-s3",
      priority: studyPlan.length === 0 ? "Priority 1" : "Priority 2",
    })
  }

  if (!q5Correct || targetTier === "Full-Stack / AI Role") {
    studyPlan.push({
      title:
        targetTier === "Full-Stack / AI Role" && q5Correct
          ? "End-to-End AI & Machine Learning Pipelines"
          : "React State Architecture & REST API Integration",
      reason:
        targetTier === "Full-Stack / AI Role" && q5Correct
          ? "Build a mentor-verified ML capstone for your public SMK skill transcript."
          : "Eliminate React effect-loop bugs and build production-deployed full-stack capstones.",
      programSlug: targetTier === "Full-Stack / AI Role" && q5Correct ? "machine-learning" : "web-development",
      stageId: targetTier === "Full-Stack / AI Role" && q5Correct ? "ml-s2" : "web-s2",
      href:
        targetTier === "Full-Stack / AI Role" && q5Correct
          ? "/programs/machine-learning#ml-s2"
          : "/programs/web-development#web-s2",
      priority: studyPlan.length === 0 ? "Priority 1" : studyPlan.length === 1 ? "Priority 2" : "Priority 3",
    })
  }

  const advancedFallbacks: Omit<StudyPlanStep, "priority">[] = [
    {
      title: "Two Pointers, Sliding Window & Timed OA Drills",
      reason: "Convert conceptual clarity into 20-minute submission speed on unseen array problems.",
      programSlug: "dsa",
      stageId: "dsa-s2",
      href: "/programs/dsa#dsa-s2",
    },
    {
      title: "Binary Trees, Heaps & Dynamic Programming",
      reason: "Master high-weightage Product Engineering interview patterns for Tier-1 campus drives.",
      programSlug: "dsa",
      stageId: "dsa-s5",
      href: "/programs/dsa#dsa-s5",
    },
    {
      title: "Production Full-Stack Deployment & Capstone Proof",
      reason: "Ship a mentor-verified repository + live deployment for your shareable SMK skill transcript.",
      programSlug: "web-development",
      stageId: "web-s4",
      href: "/programs/web-development#web-s4",
    },
  ]

  for (const fallback of advancedFallbacks) {
    if (studyPlan.length >= 3) break
    if (!studyPlan.some((s) => s.href === fallback.href)) {
      const priority: StudyPlanStep["priority"] =
        studyPlan.length === 0 ? "Priority 1" : studyPlan.length === 1 ? "Priority 2" : "Priority 3"
      studyPlan.push({ ...fallback, priority })
    }
  }

  const trimmedPlan = studyPlan.slice(0, 3)
  const primary = trimmedPlan[0]

  return {
    btechYear,
    targetTier,
    overallScore,
    readinessBand,
    axes: {
      problemSolving,
      complexityIntuition,
      implementationSpeed,
      stackReadiness,
    },
    recommendedSlug: primary.programSlug,
    recommendedStageId: primary.stageId,
    studyPlan: trimmedPlan,
    completedAt: new Date().toISOString(),
  }
}
