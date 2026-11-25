import { useState } from "react"
import { ArrowRight, Check, Code2, Cpu, Eye } from "lucide-react"

type StepId = 0 | 1 | 2

const STEPS = [
  {
    id: 0 as StepId,
    index: "01",
    title: "Concept from scratch",
    description:
      "We break down complex logic with visual pointer diagrams and step-by-step memory traces any beginner can follow.",
    badge: "Visual Mental Model",
    icon: Eye,
  },
  {
    id: 1 as StepId,
    index: "02",
    title: "Live hands-on practice",
    description:
      "Write real code in class, compare brute-force against optimal passes, and debug edge cases live with mentor feedback.",
    badge: "Code Transformation",
    icon: Code2,
  },
  {
    id: 2 as StepId,
    index: "03",
    title: "Interview-ready thinking",
    description:
      "Learn how to narrate trade-offs, justify Big-O bounds, and answer follow-up constraints under real interview pressure.",
    badge: "Recruiter Rubric",
    icon: Cpu,
  },
] as const

const POINTER_FRAMES = [
  { left: 0, right: 3, sum: 17, status: "17 > 9 · move R left" },
  { left: 0, right: 2, sum: 13, status: "13 > 9 · move R left" },
  { left: 0, right: 1, sum: 9, status: "2 + 7 = 9 · match found" },
] as const

const ARRAY_VALS = [2, 7, 11, 15]

export default function ApproachShowcase() {
  const [activeStep, setActiveStep] = useState<StepId>(0)
  const [pointerFrame, setPointerFrame] = useState<number>(2)
  const [codeMode, setCodeMode] = useState<"optimal" | "brute">("optimal")

  const currentPointer = POINTER_FRAMES[pointerFrame]

  return (
    <section
      id="approach"
      className="border-t border-border/80 bg-secondary px-6 py-20 sm:px-10 sm:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-path-accent">
              How we teach at SMK
            </p>
            <h2 className="max-w-lg font-display text-4xl leading-[1.0] tracking-tight sm:text-5xl">
              Learn it from scratch.
              <br />
              Code it live.{" "}
              <em className="not-italic text-muted-foreground">Crack the interview.</em>
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground lg:justify-self-end">
            A 100% hands-on learning loop. Select each phase to preview how every SMK topic moves from visual intuition to live code optimization and interview articulation.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
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
                  className={`editorial-step-tab group relative flex flex-col gap-2 border p-5 text-left transition-all duration-200 cursor-pointer ${isSelected ? "is-active" : ""
                    }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                      <span>{step.index}</span>
                      <span className="text-muted-foreground">/</span>
                      <span>{step.badge}</span>
                    </span>
                    <StepIcon
                      className={`size-4 transition-colors ${isSelected ? "text-path-accent" : "text-muted-foreground"
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
            {/* Panel Chrome Header */}
            <div className="flex items-center justify-between border-b border-border/80 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="size-2 bg-[#FA4028]" aria-hidden="true" />
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">
                  {STEPS[activeStep].index} · {STEPS[activeStep].badge}
                </span>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">
                Problem: Two Sum (Sorted)
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
                        className={`rounded-[4px] border px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors cursor-pointer ${pointerFrame === idx
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
                        className={`relative flex flex-col items-center justify-center border py-5 font-mono transition-all duration-300 ${isMatched
                          ? "border-[#FA4028] bg-[#FA4028]/15 text-foreground"
                          : isLeft || isRight
                            ? "border-[#0A84FF] bg-[#0A84FF]/12 text-foreground"
                            : "border-border/80 bg-background/40 text-muted-foreground"
                          }`}
                      >
                        <span className="text-[11px] text-muted-foreground">idx {idx}</span>
                        <span className="mt-1 text-xl font-bold">{val}</span>
                        {(isLeft || isRight) && (
                          <span
                            className={`mt-2 rounded-[3px] px-1.5 py-0.5 text-[10px] font-bold uppercase ${isMatched
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
                  <span className="text-muted-foreground">
                    Sum: <strong className="text-foreground">{currentPointer.sum}</strong>
                  </span>
                  <span className={pointerFrame === 2 ? "font-semibold text-emerald-500" : "text-path-accent"}>
                    {currentPointer.status}
                  </span>
                </div>
              </div>
            )}

            {/* Stage 02: Live Code Optimization Diff */}
            {activeStep === 1 && (
              <div className="flex flex-1 flex-col justify-between gap-5 p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    Compare Approach
                  </span>
                  <div className="inline-flex rounded-[4px] border border-border p-0.5">
                    <button
                      type="button"
                      onClick={() => setCodeMode("brute")}
                      className={`rounded-[3px] px-3 py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer ${codeMode === "brute"
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      Brute · O(N²)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCodeMode("optimal")}
                      className={`rounded-[3px] px-3 py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer ${codeMode === "optimal"
                        ? "bg-[#FA4028] text-white"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      Optimal · O(N)
                    </button>
                  </div>
                </div>

                <pre className="overflow-x-auto border border-border/80 bg-background/70 p-4 font-mono text-xs leading-6 text-foreground">
                  {codeMode === "brute" ? (
                    <code>{`def two_sum(nums, target):
  for i in range(len(nums)):
    for j in range(i + 1, len(nums)):
      if nums[i] + nums[j] == target:
        return [i, j]`}</code>
                  ) : (
                    <code>{`def two_sum(nums, target):
  seen = {}
  for i, num in enumerate(nums):
    need = target - num
    if need in seen:
      return [seen[need], i]
    seen[num] = i`}</code>
                  )}
                </pre>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-4 font-mono text-xs">
                  <span className="text-emerald-500 font-semibold">
                    ✔ 48 / 48 test cases passed
                  </span>
                  <span className="text-muted-foreground">
                    Runtime:{" "}
                    <strong className="text-foreground">
                      {codeMode === "brute" ? "1,420 ms (TLE risk)" : "34 ms (Top 5%)"}
                    </strong>
                  </span>
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

            <div className="flex items-center justify-between border-t border-border/80 bg-background/35 px-5 py-3 text-xs text-muted-foreground">
              <span>Live mentor dry-runs in every session</span>
              <a
                href="#programs"
                className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-path-accent"
              >
                See full tracks <ArrowRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
