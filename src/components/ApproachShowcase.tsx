import { useState } from "react"
import { ArrowRight, Check, Code2, Cpu, Eye, Play, RotateCcw, X } from "lucide-react"
import { runSandboxedCode, type CodeRunResult, type CodeTestCase } from "@/lib/codeRunner"

type StepId = 0 | 1 | 2
type SandboxLang = "python" | "javascript"

const STEPS = [
  {
    id: 0 as StepId,
    index: "01",
    title: "Concept from scratch",
    description:
      "We break down complex logic with visual pointer diagrams and step-by-step memory traces any beginner can follow.",
    badge: "Visual Mental Model",
    problemTitle: "Problem: Two Sum (Sorted · Two Pointers)",
    icon: Eye,
  },
  {
    id: 1 as StepId,
    index: "02",
    title: "Live hands-on practice",
    description:
      "Edit real code directly in-browser, switch between brute-force and optimal hash passes, and run live test cases immediately.",
    badge: "Live In-Browser Runner",
    problemTitle: "Problem: Two Sum (Unsorted · Hash Map)",
    icon: Code2,
  },
  {
    id: 2 as StepId,
    index: "03",
    title: "Interview-ready thinking",
    description:
      "Learn how to narrate trade-offs, justify Big-O bounds, and answer follow-up constraints under real interview pressure.",
    badge: "Recruiter Rubric",
    problemTitle: "Problem: Two Sum (Unsorted + Sorted Follow-Up)",
    icon: Cpu,
  },
] as const

const POINTER_FRAMES = [
  { left: 0, right: 3, sum: 17, status: "17 > 9 · move R left" },
  { left: 0, right: 2, sum: 13, status: "13 > 9 · move R left" },
  { left: 0, right: 1, sum: 9, status: "2 + 7 = 9 · match found" },
] as const

const ARRAY_VALS = [2, 7, 11, 15]

const SANDBOX_PRESETS: Record<SandboxLang, { optimal: string; brute: string }> = {
  python: {
    optimal: `def two_sum(nums, target):
  seen = {}
  for i, num in enumerate(nums):
    need = target - num
    if need in seen:
      return [seen[need], i]
    seen[num] = i
  return []`,
    brute: `def two_sum(nums, target):
  for i in range(len(nums)):
    for j in range(i + 1, len(nums)):
      if nums[i] + nums[j] == target:
        return [i, j]
  return []`,
  },
  javascript: {
    optimal: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) {
      return [seen.get(need), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
    brute: `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}`,
  },
}

const TWO_SUM_TESTS: CodeTestCase[] = [
  { id: "tc-1", label: "Unsorted [11, 2, 15, 7], target 9", args: [[11, 2, 15, 7], 9], expected: [1, 3] },
  { id: "tc-2", label: "Duplicate values [3, 3], target 6", args: [[3, 3], 6], expected: [0, 1] },
  { id: "tc-3", label: "Negative integers [-4, 9, 1, 7], target 3", args: [[-4, 9, 1, 7], 3], expected: [0, 3] },
  { id: "tc-4", label: "Zero target [0, 4, 3, 0], target 0", args: [[0, 4, 3, 0], 0], expected: [0, 3] },
]

export default function ApproachShowcase({
  onNavigate,
}: {
  onNavigate?: (href: string) => void
}) {
  const [activeStep, setActiveStep] = useState<StepId>(1)
  const [pointerFrame, setPointerFrame] = useState<number>(2)
  const [codeMode, setCodeMode] = useState<"optimal" | "brute">("optimal")
  const [language, setLanguage] = useState<SandboxLang>("python")
  const [code, setCode] = useState<string>(SANDBOX_PRESETS.python.optimal)
  const [isRunning, setIsRunning] = useState(false)
  const [runResult, setRunResult] = useState<CodeRunResult | null>(null)

  const currentPointer = POINTER_FRAMES[pointerFrame]

  function switchLanguage(nextLang: SandboxLang) {
    setLanguage(nextLang)
    setCode(SANDBOX_PRESETS[nextLang][codeMode])
    setRunResult(null)
  }

  function switchPreset(nextMode: "optimal" | "brute") {
    setCodeMode(nextMode)
    setCode(SANDBOX_PRESETS[language][nextMode])
    setRunResult(null)
  }

  async function handleRunTests() {
    setIsRunning(true)
    const result = await runSandboxedCode({
      language,
      code,
      functionName: language === "python" ? "two_sum" : "twoSum",
      testCases: TWO_SUM_TESTS,
    })
    setRunResult(result)
    setIsRunning(false)
  }

  return (
    <section
      id="approach"
      className="border-t border-border/80 bg-secondary px-6 py-20 sm:px-10 sm:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-path-accent">
              Open Engineering Lab · Try Live
            </p>
            <h2 className="max-w-lg font-display text-4xl leading-[1.0] tracking-tight sm:text-5xl">
              Learn it from scratch.
              <br />
              Code it live.{" "}
              <em className="not-italic text-muted-foreground">Crack the interview.</em>
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground lg:justify-self-end">
            No marketing fluff — test our teaching engine right here. Step through pointer intuition, edit and execute real Python or JavaScript code in-browser, and inspect the exact recruiter rubric.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          {/* Interactive 3-Step Rail */}
          <div className="flex flex-col gap-3" role="tablist" aria-label="SMK learning loop stages">
            {STEPS.map((step) => {
              const isSelected = activeStep === step.id
              const StepIcon = step.icon
              return (
                <button
                  key={step.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveStep(step.id)}
                  className={`editorial-step-tab group relative flex flex-col gap-2 border p-5 text-left transition-all duration-200 cursor-pointer ${
                    isSelected ? "is-active" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                      <span>{step.index}</span>
                      <span className="text-muted-foreground">/</span>
                      <span>{step.badge}</span>
                    </span>
                    <StepIcon
                      className={`size-4 transition-colors ${
                        isSelected ? "text-path-accent" : "text-muted-foreground"
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-display text-2xl font-normal leading-tight text-foreground sm:text-[1.75rem]">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {step.description}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Interactive Live Preview Canvas */}
          <div
            className="editorial-panel flex flex-col justify-between border"
            role="tabpanel"
            aria-label={STEPS[activeStep].title}
          >
            {/* Panel Chrome Header — accurately synced per stage */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">
                  {STEPS[activeStep].index} · {STEPS[activeStep].badge}
                </span>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">
                {STEPS[activeStep].problemTitle}
              </span>
            </div>

            {/* Stage 01: Visual Pointer Dry-Run */}
            {activeStep === 0 && (
              <div className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Interactive Dry-Run
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      Target = <span className="font-mono text-path-accent">9</span> · Shrink window until sum matches
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {POINTER_FRAMES.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPointerFrame(idx)}
                        className={`rounded-[4px] border px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                          pointerFrame === idx
                            ? "border-[#FA4028] bg-[#FA4028] text-white"
                            : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Step {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 py-4">
                  {ARRAY_VALS.map((val, idx) => {
                    const isLeft = idx === currentPointer.left
                    const isRight = idx === currentPointer.right
                    const isMatched = pointerFrame === 2 && (isLeft || isRight)
                    return (
                      <div
                        key={val}
                        className={`relative flex flex-col items-center justify-center border py-5 font-mono transition-all duration-300 ${
                          isMatched
                            ? "border-[#FA4028] bg-[#FA4028]/15 text-foreground"
                            : isLeft || isRight
                              ? "border-[#0A84FF] bg-[#0A84FF]/12 text-foreground"
                              : "border-border/80 bg-background/40 text-muted-foreground"
                        }`}
                      >
                        <span className="text-[11px] text-muted-foreground">idx {idx}</span>
                        <span className="mt-1 text-xl font-bold tabular-nums">{val}</span>
                        {(isLeft || isRight) && (
                          <span
                            className={`mt-2 rounded-[3px] px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                              isMatched
                                ? "bg-[#FA4028] text-white"
                                : "bg-[#0A84FF] text-white"
                            }`}
                          >
                            {isLeft ? "L" : "R"}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-4 font-mono text-xs">
                  <span className="text-muted-foreground tabular-nums">
                    Sum: <strong className="text-foreground">{currentPointer.sum}</strong>
                  </span>
                  <span className={pointerFrame === 2 ? "font-semibold text-emerald-500" : "text-path-accent"}>
                    {currentPointer.status}
                  </span>
                </div>
              </div>
            )}

            {/* Stage 02: Live Editable In-Browser Code Runner */}
            {activeStep === 1 && (
              <div className="flex flex-1 flex-col justify-between gap-4 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex rounded-[4px] border border-border p-0.5" role="group" aria-label="Choose sandbox language">
                      <button
                        type="button"
                        onClick={() => switchLanguage("python")}
                        className={`rounded-[3px] px-2.5 py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                          language === "python"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Python
                      </button>
                      <button
                        type="button"
                        onClick={() => switchLanguage("javascript")}
                        className={`rounded-[3px] px-2.5 py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                          language === "javascript"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        JavaScript
                      </button>
                    </div>

                    <div className="inline-flex rounded-[4px] border border-border p-0.5" role="group" aria-label="Load solution approach">
                      <button
                        type="button"
                        onClick={() => switchPreset("brute")}
                        className={`rounded-[3px] px-2.5 py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                          codeMode === "brute"
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Brute · O(N²)
                      </button>
                      <button
                        type="button"
                        onClick={() => switchPreset("optimal")}
                        className={`rounded-[3px] px-2.5 py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                          codeMode === "optimal"
                            ? "bg-[#FA4028] text-white"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Optimal · O(N)
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCode(SANDBOX_PRESETS[language][codeMode])
                        setRunResult(null)
                      }}
                      aria-label="Reset sandbox code"
                      className="inline-flex items-center gap-1 rounded-[4px] border border-border px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground cursor-pointer"
                    >
                      <RotateCcw className="size-3" aria-hidden="true" />
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={handleRunTests}
                      disabled={isRunning}
                      className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#FA4028] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#e1321c] disabled:opacity-60 cursor-pointer"
                    >
                      <Play className="size-3.5" aria-hidden="true" />
                      {isRunning ? "Running..." : "Run Tests"}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="approach-code-editor" className="sr-only">
                    Editable Two Sum solution code
                  </label>
                  <textarea
                    id="approach-code-editor"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                    rows={10}
                    className="w-full resize-none border border-border/80 bg-background/80 p-3.5 font-mono text-xs leading-6 text-foreground outline-none focus-visible:border-[#FA4028]"
                  />
                </div>

                {/* Live Execution Output */}
                <div className="border-t border-border/80 pt-3.5" aria-live="polite">
                  {!runResult ? (
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted-foreground">
                      <span>Edit any line above (e.g. try breaking duplicate handling) and click Run Tests.</span>
                      <span className="tabular-nums">4 edge cases ready</span>
                    </div>
                  ) : runResult.compileError ? (
                    <div className="border border-[#FA4028]/50 bg-[#FA4028]/10 p-3 font-mono text-xs text-foreground">
                      <strong className="text-[#FA4028]">Execution Error:</strong> {runResult.compileError}
                    </div>
                  ) : (
                    <div className="grid gap-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                        <span
                          className={`font-semibold ${
                            runResult.allPassed ? "text-emerald-500" : "text-[#FA4028]"
                          }`}
                        >
                          {runResult.allPassed ? "PASS" : "CHECK FAILED"} · {runResult.passedCount} /{" "}
                          {runResult.totalCount} test cases passed
                        </span>
                        <span className="text-muted-foreground tabular-nums">
                          {runResult.engineLabel} · {runResult.totalRuntimeMs} ms
                        </span>
                      </div>
                      <div className="grid gap-1.5 sm:grid-cols-2">
                        {runResult.outcomes.map((tc) => (
                          <div
                            key={tc.id}
                            className={`flex items-center justify-between gap-2 border px-2.5 py-1.5 font-mono text-[11px] ${
                              tc.passed
                                ? "border-emerald-500/35 bg-emerald-500/8 text-foreground"
                                : "border-[#FA4028]/45 bg-[#FA4028]/10 text-foreground"
                            }`}
                          >
                            <span className="truncate">{tc.label}</span>
                            <span className="inline-flex shrink-0 items-center gap-1 font-semibold">
                              {tc.passed ? (
                                <>
                                  <Check className="size-3 text-emerald-500" aria-hidden="true" />
                                  OK
                                </>
                              ) : (
                                <>
                                  <X className="size-3 text-[#FA4028]" aria-hidden="true" />
                                  Got {tc.actualDisplay}
                                </>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stage 03: Interview-Ready Rubric */}
            {activeStep === 2 && (
              <div className="flex flex-1 flex-col justify-between gap-5 p-6 sm:p-8">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    What Interviewers Score
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    Students practice explaining constraints before typing a single line.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="border border-border/80 bg-background/50 p-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-path-accent">
                      Complexity Proof
                    </span>
                    <p className="mt-1.5 font-mono text-sm font-semibold text-foreground">
                      Time O(N) · Space O(N)
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Single linear scan with O(1) average hash lookup per element.
                    </p>
                  </div>
                  <div className="border border-border/80 bg-background/50 p-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#0A84FF]">
                      Follow-Up Ready
                    </span>
                    <p className="mt-1.5 font-mono text-sm font-semibold text-foreground">
                      If input is sorted → O(1) Space
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Switch immediately to two pointers when extra memory is restricted.
                    </p>
                  </div>
                </div>

                <ul className="grid gap-2 border-t border-border/80 pt-4 text-xs text-foreground/90">
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-path-accent" aria-hidden="true" />
                    Duplicate elements handled before inserting current index
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-path-accent" aria-hidden="true" />
                    Negative numbers &amp; zero target verified with dry-run trace
                  </li>
                </ul>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/80 bg-background/35 px-5 py-3 text-xs text-muted-foreground">
              <span>Zero-login sandbox · Same engine powers our 5-minute diagnostic</span>
              <a
                href="/diagnostic"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault()
                    onNavigate("/diagnostic")
                  }
                }}
                className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-path-accent"
              >
                Take 5-min diagnostic <ArrowRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
