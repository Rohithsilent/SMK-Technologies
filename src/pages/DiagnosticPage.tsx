import { useEffect, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Code2,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  X,
} from "lucide-react"
import InlineCodeText from "@/components/InlineCodeText"
import SiteFooter from "@/components/SiteFooter"
import SiteHeader from "@/components/SiteHeader"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { runSandboxedCode, type CodeRunResult } from "@/lib/codeRunner"
import {
  computeDiagnosticResult,
  DIAGNOSTIC_DEBUG_CHALLENGE,
  DIAGNOSTIC_MCQS,
  PENDING_DIAGNOSTIC_KEY,
  type BtechYear,
  type DiagnosticResult,
  type TargetHiringTier,
} from "@/lib/diagnosticEngine"

const YEARS: BtechYear[] = ["2nd Year", "3rd Year", "Final Year"]
const TIERS: { value: TargetHiringTier; detail: string }[] = [
  {
    value: "Service / Mass Recruiter",
    detail: "TCS NQT, Infosys SP, Accenture, Cognizant GenC coding & aptitude rounds",
  },
  {
    value: "Product Startup / Engineering",
    detail: "Amazon, Atlassian, Flipkart, Razorpay & high-growth SDE-1 coding OAs",
  },
  {
    value: "Full-Stack / AI Role",
    detail: "End-to-end React/Node backend shipping + Python/ML pipeline roles",
  },
]

type Phase = "setup" | "active" | "results"

// Step order: Q1 (MCQ 0), Q2 (MCQ 1), Q3 (Live Debug), Q4 (MCQ 2), Q5 (MCQ 3)
const TOTAL_STEPS = 5

export default function DiagnosticPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const { user, saveDiagnosticAttempt } = useAuth()
  const [phase, setPhase] = useState<Phase>("setup")
  const [btechYear, setBtechYear] = useState<BtechYear>("3rd Year")
  const [targetTier, setTargetTier] = useState<TargetHiringTier>("Product Startup / Engineering")

  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [debugLang, setDebugLang] = useState<"python" | "javascript">("python")
  const [debugCode, setDebugCode] = useState(DIAGNOSTIC_DEBUG_CHALLENGE.buggyPython)
  const [debugRunResult, setDebugRunResult] = useState<CodeRunResult | null>(null)
  const [debugRunning, setDebugRunning] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [result, setResult] = useState<DiagnosticResult | null>(null)
  const [savingToPortal, setSavingToPortal] = useState(false)

  useEffect(() => {
    if (phase !== "active") return
    const id = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [phase])

  function startDiagnostic() {
    setStepIndex(0)
    setAnswers({})
    setDebugLang("python")
    setDebugCode(DIAGNOSTIC_DEBUG_CHALLENGE.buggyPython)
    setDebugRunResult(null)
    setShowHint(false)
    setElapsedSeconds(0)
    setResult(null)
    setPhase("active")
  }

  function switchDebugLanguage(lang: "python" | "javascript") {
    setDebugLang(lang)
    setDebugCode(
      lang === "python"
        ? DIAGNOSTIC_DEBUG_CHALLENGE.buggyPython
        : DIAGNOSTIC_DEBUG_CHALLENGE.buggyJs,
    )
    setDebugRunResult(null)
  }

  async function handleRunDebugTests() {
    setDebugRunning(true)
    const outcome = await runSandboxedCode({
      language: debugLang,
      code: debugCode,
      functionName:
        debugLang === "python"
          ? DIAGNOSTIC_DEBUG_CHALLENGE.functionNamePython
          : DIAGNOSTIC_DEBUG_CHALLENGE.functionNameJs,
      testCases: DIAGNOSTIC_DEBUG_CHALLENGE.testCases,
    })
    setDebugRunResult(outcome)
    setDebugRunning(false)
  }

  async function finishDiagnostic() {
    const computed = computeDiagnosticResult({
      btechYear,
      targetTier,
      answers,
      debugPassed: Boolean(debugRunResult?.allPassed),
      elapsedSeconds,
    })
    setResult(computed)
    localStorage.setItem(PENDING_DIAGNOSTIC_KEY, JSON.stringify(computed))
    setPhase("results")
    if (user) {
      await saveDiagnosticAttempt(computed)
    }
  }

  async function handleUnlockPortal() {
    if (!result) return
    setSavingToPortal(true)
    try {
      await saveDiagnosticAttempt(result)
      onNavigate("/portal")
    } finally {
      setSavingToPortal(false)
    }
  }

  const formatClock = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`
  }

  const currentMcq =
    stepIndex === 0
      ? DIAGNOSTIC_MCQS[0]
      : stepIndex === 1
        ? DIAGNOSTIC_MCQS[1]
        : stepIndex === 3
          ? DIAGNOSTIC_MCQS[2]
          : stepIndex === 4
            ? DIAGNOSTIC_MCQS[3]
            : null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader mode="app" activePath="/diagnostic" onNavigate={onNavigate} />

      <main className="mx-auto max-w-5xl px-5 pb-20 pt-24 sm:px-8 sm:pt-28">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-path-accent">
              Zero-Login Engineering Lab · 5-Minute Baseline
            </p>
            <h1 className="mt-2 font-display text-4xl leading-[0.98] tracking-tight sm:text-5xl">
              Placement Readiness <em className="hero-em not-italic">Diagnostic</em>
            </h1>
          </div>
          {phase === "active" && (
            <div className="flex items-center gap-4 font-mono text-xs tabular-nums">
              <span className="inline-flex items-center gap-1.5 border border-border bg-secondary/40 px-3 py-1.5 text-foreground">
                <Timer className="size-3.5 text-path-accent" aria-hidden="true" />
                {formatClock(elapsedSeconds)}
              </span>
              <span className="text-muted-foreground">
                Question <strong className="text-foreground">{stepIndex + 1}</strong> / {TOTAL_STEPS}
              </span>
            </div>
          )}
        </div>

        {/* ─── PHASE 1: SETUP ─── */}
        {phase === "setup" && (
          <section className="editorial-panel border p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                  Step 01 · Configure Your Profile
                </p>
                <h2 className="mt-2 font-display text-3xl text-foreground">
                  Benchmark your OA readiness in 5 questions.
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  No sign-up required. Answer 2 Big-O / code-trace checks, fix 1 live in-browser Python or JavaScript bug, and clear 2 stack engineering questions to unlock your 4-axis readiness profile.
                </p>

                <div className="mt-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
                    1. Select your B.Tech Year
                  </p>
                  <div className="mt-2.5 grid grid-cols-3 gap-2.5" role="radiogroup" aria-label="B.Tech year">
                    {YEARS.map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setBtechYear(yr)}
                        className={`rounded-[4px] border px-3 py-3 text-xs font-medium transition-colors cursor-pointer sm:text-sm ${
                          btechYear === yr
                            ? "border-[#FA4028] bg-[var(--coral-bg)] text-foreground"
                            : "border-border bg-background/50 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
                    2. Target Hiring Tier
                  </p>
                  <div className="mt-2.5 grid gap-2.5" role="radiogroup" aria-label="Target hiring tier">
                    {TIERS.map((tier) => (
                      <button
                        key={tier.value}
                        type="button"
                        onClick={() => setTargetTier(tier.value)}
                        className={`rounded-[4px] border p-3.5 text-left transition-colors cursor-pointer ${
                          targetTier === tier.value
                            ? "border-[#FA4028] bg-[var(--coral-bg)]"
                            : "border-border bg-background/50 hover:border-foreground/40"
                        }`}
                      >
                        <p className="text-sm font-semibold text-foreground">{tier.value}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{tier.detail}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button type="button" onClick={startDiagnostic} className="cursor-pointer px-7 py-3 text-sm">
                    Start 5-Minute Diagnostic <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                  <button
                    type="button"
                    onClick={() => onNavigate("/portal/assessments")}
                    className="inline-flex items-center gap-1.5 rounded-[4px] border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground cursor-pointer"
                  >
                    Skip to Timed OA Simulator <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <aside className="flex flex-col justify-between border border-border/80 bg-background/55 p-6">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                    What Gets Measured
                  </p>
                  <ul className="mt-4 grid gap-3.5 text-xs leading-6 text-foreground/90">
                    <li className="flex items-start gap-2.5">
                      <Target className="mt-0.5 size-4 shrink-0 text-path-accent" aria-hidden="true" />
                      <span>
                        <strong>Problem Solving:</strong> Pattern selection on unsorted/negative array constraints.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Sparkles className="mt-0.5 size-4 shrink-0 text-path-accent" aria-hidden="true" />
                      <span>
                        <strong>Complexity Intuition:</strong> 10⁵ vs 10⁸ TLE cutoff awareness used in real OAs.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Code2 className="mt-0.5 size-4 shrink-0 text-path-accent" aria-hidden="true" />
                      <span>
                        <strong>Live Implementation Speed:</strong> In-browser Python/JS debugging with edge-case verification.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-path-accent" aria-hidden="true" />
                      <span>
                        <strong>Stack Readiness:</strong> Core Python hashing & React production reliability checks.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 border-t border-border/80 pt-4 text-xs text-muted-foreground">
                  Results save automatically to this browser and carry straight into your SMK Student Portal on sign-in.
                </div>
              </aside>
            </div>
          </section>
        )}

        {/* ─── PHASE 2: ACTIVE QUESTIONS ─── */}
        {phase === "active" && (
          <section className="editorial-panel border">
            {/* Step Progress Rail */}
            <div className="grid grid-cols-5 border-b border-border/80">
              {Array.from({ length: TOTAL_STEPS }).map((_, idx) => {
                const isCurrent = idx === stepIndex
                const isDone =
                  idx === 2
                    ? Boolean(debugRunResult?.allPassed)
                    : Boolean(
                        answers[
                          idx === 0
                            ? DIAGNOSTIC_MCQS[0].id
                            : idx === 1
                              ? DIAGNOSTIC_MCQS[1].id
                              : idx === 3
                                ? DIAGNOSTIC_MCQS[2].id
                                : DIAGNOSTIC_MCQS[3].id
                        ],
                      )
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setStepIndex(idx)}
                    className={`flex items-center justify-center gap-1.5 border-r border-border/80 px-2 py-3 font-mono text-[11px] font-medium transition-colors last:border-r-0 cursor-pointer ${
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : isDone
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-background/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>Q{idx + 1}</span>
                    {idx === 2 && <span className="hidden sm:inline">· Code</span>}
                    {isDone && !isCurrent && <Check className="size-3" aria-hidden="true" />}
                  </button>
                )
              })}
            </div>

            <div className="p-6 sm:p-8">
              {currentMcq ? (
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                    Question 0{stepIndex + 1} · {currentMcq.category.toUpperCase()} CHECK
                  </p>
                  <h2 className="mt-3 text-lg font-medium leading-7 text-foreground sm:text-xl">
                    <InlineCodeText text={currentMcq.prompt} />
                  </h2>

                  {currentMcq.codeSnippet && (
                    <pre className="mt-4 overflow-x-auto border border-border/80 bg-background/80 px-4 py-3 font-mono text-xs text-foreground">
                      <code>{currentMcq.codeSnippet}</code>
                    </pre>
                  )}

                  <div className="mt-6 grid gap-3" role="radiogroup" aria-label={currentMcq.prompt}>
                    {currentMcq.options.map((opt) => {
                      const picked = answers[currentMcq.id] === opt.id
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setAnswers((prev) => ({ ...prev, [currentMcq.id]: opt.id }))
                          }
                          className={`flex items-start gap-3 rounded-[4px] border p-4 text-left text-sm transition-colors cursor-pointer ${
                            picked
                              ? "border-[#FA4028] bg-[var(--coral-bg)] text-foreground"
                              : "border-border bg-background/45 text-foreground/90 hover:border-foreground/40"
                          }`}
                        >
                          <span className="mt-0.5 font-mono text-xs font-bold uppercase text-path-accent">
                            {opt.id}.
                          </span>
                          <span>
                            <InlineCodeText text={opt.label} />
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                /* Step 2 (index 2): Live Debugging Fix */
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                        Question 03 · LIVE IN-BROWSER DEBUGGING FIX
                      </p>
                      <h2 className="mt-1.5 text-lg font-medium text-foreground sm:text-xl">
                        {DIAGNOSTIC_DEBUG_CHALLENGE.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="inline-flex rounded-[4px] border border-border p-0.5">
                        <button
                          type="button"
                          onClick={() => switchDebugLanguage("python")}
                          className={`rounded-[3px] px-2.5 py-1 font-mono text-[11px] font-medium cursor-pointer ${
                            debugLang === "python"
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Python
                        </button>
                        <button
                          type="button"
                          onClick={() => switchDebugLanguage("javascript")}
                          className={`rounded-[3px] px-2.5 py-1 font-mono text-[11px] font-medium cursor-pointer ${
                            debugLang === "javascript"
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          JavaScript
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowHint((h) => !h)}
                        className="rounded-[4px] border border-border px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:border-[#FA4028] hover:text-path-accent cursor-pointer"
                      >
                        {showHint ? "Hide Hint" : "Show Hint"}
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    <InlineCodeText text={DIAGNOSTIC_DEBUG_CHALLENGE.prompt} />
                  </p>

                  {showHint && (
                    <div className="mt-3 border border-border bg-secondary/40 px-4 py-2.5 text-xs text-foreground">
                      <strong className="font-mono text-path-accent">HINT:</strong>{" "}
                      <InlineCodeText text={DIAGNOSTIC_DEBUG_CHALLENGE.hint} />
                    </div>
                  )}

                  <div className="mt-4">
                    <label htmlFor="diagnostic-debug-editor" className="sr-only">
                      Debug code editor
                    </label>
                    <textarea
                      id="diagnostic-debug-editor"
                      value={debugCode}
                      onChange={(e) => setDebugCode(e.target.value)}
                      spellCheck={false}
                      rows={11}
                      className="w-full resize-none border border-border bg-background/85 p-4 font-mono text-xs leading-6 text-foreground outline-none focus-visible:border-[#FA4028]"
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleRunDebugTests}
                        disabled={debugRunning}
                        className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#FA4028] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#e1321c] disabled:opacity-60 cursor-pointer"
                      >
                        <Play className="size-3.5" aria-hidden="true" />
                        {debugRunning ? "Executing..." : "Run Diagnostic Tests"}
                      </button>
                      <button
                        type="button"
                        onClick={() => switchDebugLanguage(debugLang)}
                        className="inline-flex items-center gap-1 rounded-[4px] border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <RotateCcw className="size-3.5" aria-hidden="true" />
                        Reset Buggy Code
                      </button>
                    </div>

                    {debugRunResult && (
                      <span
                        className={`font-mono text-xs font-semibold tabular-nums ${
                          debugRunResult.allPassed ? "text-emerald-500" : "text-[#FA4028]"
                        }`}
                      >
                        {debugRunResult.passedCount} / {debugRunResult.totalCount} passed (
                        {debugRunResult.totalRuntimeMs} ms)
                      </span>
                    )}
                  </div>

                  {debugRunResult && (
                    <div className="mt-4 grid gap-2" aria-live="polite">
                      {debugRunResult.compileError ? (
                        <div className="border border-[#FA4028]/50 bg-[#FA4028]/10 p-3 font-mono text-xs text-foreground">
                          {debugRunResult.compileError}
                        </div>
                      ) : (
                        debugRunResult.outcomes.map((tc) => (
                          <div
                            key={tc.id}
                            className={`flex flex-wrap items-center justify-between gap-2 border px-3 py-2 font-mono text-xs ${
                              tc.passed
                                ? "border-emerald-500/40 bg-emerald-500/8 text-foreground"
                                : "border-[#FA4028]/45 bg-[#FA4028]/10 text-foreground"
                            }`}
                          >
                            <span>{tc.label}</span>
                            <span className="inline-flex items-center gap-1.5">
                              {tc.passed ? (
                                <>
                                  <Check className="size-3.5 text-emerald-500" aria-hidden="true" />
                                  Passed ({tc.actualDisplay})
                                </>
                              ) : (
                                <>
                                  <X className="size-3.5 text-[#FA4028]" aria-hidden="true" />
                                  Expected {tc.expectedDisplay}, got {tc.actualDisplay}
                                </>
                              )}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Step Controls */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => (stepIndex === 0 ? setPhase("setup") : setStepIndex((i) => i - 1))}
                  className="cursor-pointer"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  {stepIndex === 0 ? "Back to Setup" : "Previous"}
                </Button>

                {stepIndex < TOTAL_STEPS - 1 ? (
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => setStepIndex((i) => i + 1)}
                    className="cursor-pointer px-6"
                  >
                    Next Question <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => void finishDiagnostic()}
                    className="cursor-pointer px-6"
                  >
                    Generate Readiness Snapshot <CheckCircle2 className="size-4" aria-hidden="true" />
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ─── PHASE 3: 4-AXIS READINESS SNAPSHOT ─── */}
        {phase === "results" && result && (
          <div className="grid gap-6">
            <section className="editorial-panel border p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-6 border-b border-border/80 pb-6">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                    4-Axis Readiness Snapshot · {result.btechYear} · {result.targetTier}
                  </p>
                  <h2 className="mt-2 font-display text-4xl text-foreground sm:text-5xl">
                    Band: <em className="hero-em not-italic">{result.readinessBand}</em>
                  </h2>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Completed in {formatClock(elapsedSeconds)} · Saved locally for 1-click portal sync
                  </p>
                </div>

                <div className="border border-border bg-background/60 px-6 py-4 text-right">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    Overall Readiness
                  </p>
                  <p className="mt-1 font-display text-5xl font-normal text-foreground tabular-nums">
                    {result.overallScore}
                    <span className="text-xl text-muted-foreground">/100</span>
                  </p>
                </div>
              </div>

              {/* 4 Axis Meters */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Problem Solving", value: result.axes.problemSolving },
                  { label: "Complexity Intuition", value: result.axes.complexityIntuition },
                  { label: "Implementation Speed", value: result.axes.implementationSpeed },
                  { label: "Stack Readiness", value: result.axes.stackReadiness },
                ].map((axis) => (
                  <div key={axis.label} className="border border-border/80 bg-background/50 p-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{axis.label}</span>
                      <span className="font-mono font-semibold text-path-accent tabular-nums">
                        {axis.value}%
                      </span>
                    </div>
                    <div className="mt-2.5 h-2 w-full bg-border/50">
                      <div
                        className={
                          axis.value >= 75
                            ? "h-full bg-emerald-500"
                            : axis.value >= 50
                              ? "h-full bg-[#0A84FF]"
                              : "h-full bg-[#FA4028]"
                        }
                        style={{ width: `${axis.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Hand-off CTA */}
              <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border/80 pt-6">
                <p className="max-w-xl text-xs leading-6 text-muted-foreground">
                  {user
                    ? "Your attempt is saved to your SMK Student Portal. Launch a timed multi-language OA round next."
                    : "Save this score to your SMK account to unlock the timed Python/C++/Java OA simulator and build your shareable Verified Skill Transcript."}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={startDiagnostic}
                    className="inline-flex items-center gap-1.5 rounded-[4px] border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <RotateCcw className="size-3.5" aria-hidden="true" />
                    Retake
                  </button>
                  <Button
                    type="button"
                    onClick={() => void handleUnlockPortal()}
                    disabled={savingToPortal}
                    className="cursor-pointer px-6"
                  >
                    {savingToPortal
                      ? "Opening Portal..."
                      : "Save Score & Unlock Full OA Suite"}{" "}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Personalized Study Plan Deep-Linking to Exact Roadmap Stages */}
            <section className="editorial-panel border p-6 sm:p-8">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                Personalized Roadmap Action Plan
              </p>
              <h3 className="mt-2 font-display text-3xl text-foreground">
                Jump straight to your highest-leverage stages.
              </h3>
              <div className="mt-5 grid gap-3.5 md:grid-cols-3">
                {result.studyPlan.map((step) => (
                  <a
                    key={step.href}
                    href={step.href}
                    onClick={(e) => {
                      e.preventDefault()
                      onNavigate(step.href)
                    }}
                    className="group flex flex-col justify-between border border-border/80 bg-background/50 p-5 transition-colors hover:border-[#FA4028]"
                  >
                    <div>
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-path-accent">
                        {step.priority}
                      </span>
                      <h4 className="mt-2 text-base font-semibold text-foreground group-hover:text-path-accent">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-xs leading-6 text-muted-foreground">
                        <InlineCodeText text={step.reason} />
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground">
                      Open Roadmap Stage <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <SiteFooter mode="app" onNavigate={onNavigate} />
    </div>
  )
}
