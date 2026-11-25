import { useEffect, useMemo, useState, type FormEvent } from "react"
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  FolderGit2,
  KeyRound,
  Lock,
  LogIn,
  LogOut,
  Play,
  RotateCcw,
  ShieldCheck,
  Terminal,
  Timer,
  Unlock,
  X,
} from "lucide-react"
import InlineCodeText from "@/components/InlineCodeText"
import SiteFooter from "@/components/SiteFooter"
import SiteHeader from "@/components/SiteHeader"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { programs } from "@/data/roadmaps"
import { runSandboxedCode, type CodeRunResult, type SupportedLanguage } from "@/lib/codeRunner"
import { PENDING_DIAGNOSTIC_KEY, type DiagnosticResult } from "@/lib/diagnosticEngine"
import { OA_PROBLEMS, type OaProblem } from "@/lib/oaEngine"

type PortalTab = "overview" | "assessments" | "roadmap" | "projects"

function getTabFromPath(pathname: string): PortalTab {
  if (pathname.startsWith("/portal/assessments")) return "assessments"
  if (pathname.startsWith("/portal/roadmap")) return "roadmap"
  if (pathname.startsWith("/portal/projects")) return "projects"
  return "overview"
}

const LANGUAGES: { id: SupportedLanguage; label: string }[] = [
  { id: "python", label: "Python 3" },
  { id: "cpp", label: "C++ 17" },
  { id: "java", label: "Java 17" },
  { id: "javascript", label: "JavaScript" },
]

export default function PortalPage({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate: (href: string) => void
}) {
  const {
    user,
    profile,
    authError,
    isAdmin,
    diagnostics,
    verifiedTopicIds,
    oaSubmissions,
    projectSubmissions,
    scheduledOas,
    signInWithGoogle,
    logout,
    recordOaSubmission,
    submitCapstoneProject,
    redeemInviteCode,
  } = useAuth()

  const activeTab = getTabFromPath(pathname)

  // Load any pending guest diagnostic so students see their carryover right away
  const guestDiagnostic = useMemo<DiagnosticResult | null>(() => {
    try {
      const raw = localStorage.getItem(PENDING_DIAGNOSTIC_KEY)
      return raw ? (JSON.parse(raw) as DiagnosticResult) : null
    } catch {
      return null
    }
  }, [diagnostics])

  // Cohort invite code state
  const [inviteInput, setInviteInput] = useState("")
  const [inviteStatus, setInviteStatus] = useState<{ ok: boolean; message: string } | null>(null)
  const [copiedTranscript, setCopiedTranscript] = useState(false)

  // OA Simulator state
  const [selectedProblem, setSelectedProblem] = useState<OaProblem>(OA_PROBLEMS[0])
  const [language, setLanguage] = useState<SupportedLanguage>("python")
  const [code, setCode] = useState<string>(OA_PROBLEMS[0].starterCode.python)
  const [secondsLeft, setSecondsLeft] = useState<number>(OA_PROBLEMS[0].durationMinutes * 60)
  const [timerRunning, setTimerRunning] = useState<boolean>(false)
  const [oaRunning, setOaRunning] = useState<boolean>(false)
  const [oaResult, setOaResult] = useState<CodeRunResult | null>(null)
  const [oaSubmitMode, setOaSubmitMode] = useState<"sample" | "submit" | null>(null)

  // Capstone form state
  const [capTrack, setCapTrack] = useState<"web-development" | "machine-learning">("web-development")
  const [capTitle, setCapTitle] = useState("")
  const [capRepo, setCapRepo] = useState("")
  const [capLive, setCapLive] = useState("")
  const [capError, setCapError] = useState("")
  const [capSuccess, setCapSuccess] = useState("")
  const [capSubmitting, setCapSubmitting] = useState(false)

  useEffect(() => {
    if (!timerRunning || secondsLeft <= 0) return
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => window.clearInterval(id)
  }, [timerRunning, secondsLeft])

  function selectProblem(problem: OaProblem) {
    setSelectedProblem(problem)
    setCode(problem.starterCode[language])
    setSecondsLeft(problem.durationMinutes * 60)
    setTimerRunning(false)
    setOaResult(null)
    setOaSubmitMode(null)
  }

  function changeLanguage(nextLang: SupportedLanguage) {
    setLanguage(nextLang)
    setCode(selectedProblem.starterCode[nextLang])
    setOaResult(null)
    setOaSubmitMode(null)
  }

  async function executeOa(mode: "sample" | "submit") {
    setOaRunning(true)
    setOaSubmitMode(mode)
    if (!timerRunning) setTimerRunning(true)
    const suite =
      mode === "sample"
        ? selectedProblem.testCases.filter((tc) => !tc.hidden)
        : selectedProblem.testCases

    const res = await runSandboxedCode({
      language,
      code,
      functionName: selectedProblem.functionNames[language],
      testCases: suite,
    })
    setOaResult(res)
    setOaRunning(false)

    if (mode === "submit") {
      const status = res.allPassed ? "passed" : res.passedCount > 0 ? "partial" : "failed"
      await recordOaSubmission({
        assessmentId: selectedProblem.assessmentId,
        problemId: selectedProblem.id,
        language,
        sourceCode: code,
        passedCount: res.passedCount,
        totalCount: res.totalCount,
        runtimeMs: res.totalRuntimeMs,
        status,
      })
    }
  }

  async function handleRedeemInvite(e: FormEvent) {
    e.preventDefault()
    const outcome = await redeemInviteCode(inviteInput)
    setInviteStatus(outcome)
    if (outcome.ok) setInviteInput("")
  }

  async function handleCapstoneSubmit(e: FormEvent) {
    e.preventDefault()
    setCapError("")
    setCapSuccess("")
    const cleanTitle = capTitle.trim()
    const cleanRepo = capRepo.trim()
    const cleanLive = capLive.trim()

    if (cleanTitle.length < 3) {
      setCapError("Enter a clear project title (at least 3 characters).")
      return
    }
    if (!/^https?:\/\/.+/.test(cleanRepo) || !/^https?:\/\/.+/.test(cleanLive)) {
      setCapError("Provide valid https:// links for both your GitHub repository and live deployment.")
      return
    }

    setCapSubmitting(true)
    try {
      await submitCapstoneProject({
        programSlug: capTrack,
        title: cleanTitle,
        repoUrl: cleanRepo,
        liveUrl: cleanLive,
      })
      setCapTitle("")
      setCapRepo("")
      setCapLive("")
      setCapSuccess("Capstone submitted for 3-part mentor rubric verification (Architecture, Edge Cases, Deployment).")
    } finally {
      setCapSubmitting(false)
    }
  }

  const transcriptHandle = profile?.handle ?? "arjun-cse26"
  const latestDiagScore =
    diagnostics[diagnostics.length - 1]?.overallScore ?? guestDiagnostic?.overallScore ?? null
  const passedOaCount = oaSubmissions.filter((s) => s.status === "passed").length
  const totalTopicsAllTracks = useMemo(
    () =>
      programs.reduce(
        (sum, p) => sum + p.stages.reduce((acc, st) => acc + st.topics.length, 0),
        0,
      ),
    [],
  )

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`
  }

  async function copyTranscriptLink() {
    const url = `${window.location.origin}/verify/${transcriptHandle}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedTranscript(true)
      window.setTimeout(() => setCopiedTranscript(false), 2200)
    } catch {
      setCopiedTranscript(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader mode="app" activePath="/portal" onNavigate={onNavigate} />

      <main className="mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-8 sm:pt-28">
        {/* Top Portal Masthead */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-path-accent">
              SMK Mini-LMS · Student Engineering Portal
            </p>
            <h1 className="mt-2 font-display text-4xl leading-[0.98] tracking-tight sm:text-5xl">
              {profile ? `Welcome, ${profile.fullName}` : "Student Portal & OA Lab"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isAdmin && (
              <button
                type="button"
                onClick={() => onNavigate("/mentor")}
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-border px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:border-[#FA4028] hover:text-path-accent cursor-pointer"
              >
                Mentor Studio <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate(`/verify/${transcriptHandle}`)}
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-border px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:border-[#FA4028] hover:text-path-accent cursor-pointer"
            >
              <Award className="size-3.5 text-path-accent" aria-hidden="true" />
              Public Transcript
            </button>
            {user ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => void logout()} className="cursor-pointer">
                <LogOut className="size-3.5" aria-hidden="true" /> Sign Out
              </Button>
            ) : (
              <Button type="button" variant="default" size="sm" onClick={() => void signInWithGoogle()} className="cursor-pointer">
                <LogIn className="size-3.5" aria-hidden="true" /> Sign in with Google
              </Button>
            )}
          </div>
        </div>

        {/* Auth Sync Banner when exploring as guest */}
        {!user && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border border-border bg-secondary/45 px-5 py-3.5 text-xs">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-path-accent" aria-hidden="true" />
              <div>
                <p className="font-medium text-foreground">
                  Interactive Sandbox Active — Sign in with Google to persist scores across devices &amp; publish your verified transcript.
                </p>
                {authError && <p className="mt-1 text-[#FA4028]">{authError}</p>}
              </div>
            </div>
            <button
              type="button"
              onClick={() => void signInWithGoogle()}
              className="shrink-0 rounded-[4px] bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-[#FA4028] hover:text-white cursor-pointer"
            >
              Sync with Google
            </button>
          </div>
        )}

        {/* Sub-navigation Tabs */}
        <nav
          className="mt-6 flex flex-wrap items-center gap-2 border-b border-border/80 pb-4"
          aria-label="Student portal sections"
        >
          {[
            { id: "overview" as PortalTab, label: "Overview", href: "/portal", icon: ShieldCheck },
            { id: "assessments" as PortalTab, label: "Timed OA Simulator", href: "/portal/assessments", icon: Terminal },
            { id: "roadmap" as PortalTab, label: "Verified Roadmap", href: "/portal/roadmap", icon: BookOpen },
            { id: "projects" as PortalTab, label: "Capstone Proof", href: "/portal/projects", icon: FolderGit2 },
          ].map((tab) => {
            const Icon = tab.icon
            const isCurrent = activeTab === tab.id
            return (
              <a
                key={tab.id}
                href={tab.href}
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate(tab.href)
                }}
                aria-current={isCurrent ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-[4px] border px-4 py-2 text-xs font-medium transition-colors ${
                  isCurrent
                    ? "border-[#FA4028] bg-[var(--coral-bg)] text-foreground"
                    : "border-border bg-background/50 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5 text-path-accent" aria-hidden="true" />
                {tab.label}
              </a>
            )
          })}
        </nav>

        {/* ─── TAB 1: OVERVIEW ─── */}
        {activeTab === "overview" && (
          <div className="mt-6 grid gap-6">
            {/* 4 KPI Strip */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="editorial-panel border p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Diagnostic Readiness
                </p>
                <p className="mt-2 font-display text-4xl text-foreground tabular-nums">
                  {latestDiagScore !== null ? `${latestDiagScore}%` : "—"}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate("/diagnostic")}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-path-accent hover:underline cursor-pointer"
                >
                  {latestDiagScore !== null ? "Retake diagnostic" : "Take 5-min diagnostic"}{" "}
                  <ArrowRight className="size-3" aria-hidden="true" />
                </button>
              </div>

              <div className="editorial-panel border p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Verified Roadmap Topics
                </p>
                <p className="mt-2 font-display text-4xl text-foreground tabular-nums">
                  {verifiedTopicIds.size}
                  <span className="text-lg text-muted-foreground">/{totalTopicsAllTracks}</span>
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate("/portal/roadmap")}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-path-accent hover:underline cursor-pointer"
                >
                  Verify more topics <ArrowRight className="size-3" aria-hidden="true" />
                </button>
              </div>

              <div className="editorial-panel border p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Timed OA Rounds Passed
                </p>
                <p className="mt-2 font-display text-4xl text-foreground tabular-nums">
                  {passedOaCount}
                  <span className="text-lg text-muted-foreground">/{OA_PROBLEMS.length}</span>
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate("/portal/assessments")}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-path-accent hover:underline cursor-pointer"
                >
                  Launch OA simulator <ArrowRight className="size-3" aria-hidden="true" />
                </button>
              </div>

              <div className="editorial-panel border p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Verified Skill Transcript
                </p>
                <p className="mt-2 truncate font-mono text-sm font-semibold text-foreground">
                  /verify/{transcriptHandle}
                </p>
                <button
                  type="button"
                  onClick={copyTranscriptLink}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-path-accent hover:underline cursor-pointer"
                >
                  {copiedTranscript ? (
                    <>
                      <Check className="size-3 text-emerald-500" aria-hidden="true" /> Link copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" aria-hidden="true" /> Copy recruiter link
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              {/* Scheduled Campus OAs */}
              <section className="editorial-panel border p-6">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                      Active OA Queue
                    </p>
                    <h2 className="mt-1 font-display text-2xl text-foreground">
                      Scheduled Timed Assessments
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate("/portal/assessments")}
                    className="text-xs font-medium text-path-accent hover:underline cursor-pointer"
                  >
                    Open Simulator →
                  </button>
                </div>

                <div className="mt-5 grid gap-3">
                  {scheduledOas.map((oa) => (
                    <div
                      key={oa.id}
                      className="flex flex-wrap items-center justify-between gap-3 border border-border/80 bg-background/50 p-4"
                    >
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-path-accent">
                          {oa.tier} · {oa.durationMinutes} min
                        </p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{oa.title}</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="default"
                        onClick={() => onNavigate("/portal/assessments")}
                        className="cursor-pointer"
                      >
                        Start Round <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Campus Cohort Invite Code Card */}
              <section className="editorial-panel border p-6">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                  Campus Cohort Onboarding
                </p>
                <h2 className="mt-1 font-display text-2xl text-foreground">
                  Link your College Batch
                </h2>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  Have an invite code from your college TPO? Enter it below (sample code:{" "}
                  <strong className="font-mono text-foreground">SMK-CSE-2026</strong>) to attach your OA scores to your institutional cohort.
                </p>

                {profile?.inviteCode && (
                  <div className="mt-4 border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2.5 font-mono text-xs text-foreground">
                    Linked Cohort Code: <strong className="text-emerald-500">{profile.inviteCode}</strong>
                  </div>
                )}

                <form onSubmit={handleRedeemInvite} className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <label htmlFor="cohort-invite-code" className="sr-only">
                    College batch invite code
                  </label>
                  <input
                    id="cohort-invite-code"
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value)}
                    placeholder="e.g. SMK-CSE-2026"
                    className="form-control flex-1 py-2 font-mono text-xs uppercase"
                  />
                  <Button type="submit" variant="default" className="cursor-pointer shrink-0">
                    <KeyRound className="size-3.5" aria-hidden="true" /> Join Batch
                  </Button>
                </form>

                {inviteStatus && (
                  <p
                    className={`mt-3 text-xs font-medium ${
                      inviteStatus.ok ? "text-emerald-500" : "text-[#FA4028]"
                    }`}
                    role="status"
                  >
                    {inviteStatus.message}
                  </p>
                )}
              </section>
            </div>
          </div>
        )}

        {/* ─── TAB 2: TIMED OA SIMULATOR ─── */}
        {activeTab === "assessments" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
            {/* Left Rail: Problem Selector */}
            <aside className="flex flex-col gap-3">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Select OA Problem ({OA_PROBLEMS.length})
              </p>
              {OA_PROBLEMS.map((prob) => {
                const isSelected = selectedProblem.id === prob.id
                const bestSub = oaSubmissions.find((s) => s.problemId === prob.id && s.status === "passed")
                return (
                  <button
                    key={prob.id}
                    type="button"
                    onClick={() => selectProblem(prob)}
                    className={`editorial-panel border p-4 text-left transition-colors cursor-pointer ${
                      isSelected ? "border-[#FA4028]" : "hover:border-foreground/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
                      <span className="text-path-accent">{prob.tier}</span>
                      <span className="text-muted-foreground">{prob.difficulty}</span>
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-foreground">{prob.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{prob.companyStyle}</p>
                    {bestSub && (
                      <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-500">
                        <CheckCircle2 className="size-3" aria-hidden="true" /> Solved ({bestSub.language})
                      </span>
                    )}
                  </button>
                )
              })}
            </aside>

            {/* Right Main: Statement + Multi-Language Editor + Hidden Test Verdicts */}
            <section className="editorial-panel flex flex-col border">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 px-5 py-4">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-path-accent">
                    {selectedProblem.tier} · {selectedProblem.companyStyle}
                  </p>
                  <h2 className="mt-1 font-display text-2xl text-foreground sm:text-3xl">
                    {selectedProblem.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs tabular-nums">
                  <span className="inline-flex items-center gap-1.5 border border-border bg-background/70 px-3 py-1.5 text-foreground">
                    <Timer className="size-3.5 text-path-accent" aria-hidden="true" />
                    {formatTimer(secondsLeft)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTimerRunning((r) => !r)}
                    className="rounded-[4px] border border-border px-2.5 py-1.5 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {timerRunning ? "Pause" : "Start Timer"}
                  </button>
                </div>
              </div>

              <div className="border-b border-border/80 bg-background/40 px-5 py-4">
                <p className="text-sm leading-6 text-foreground/95">
                  <InlineCodeText text={selectedProblem.statement} />
                </p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-muted-foreground">
                  {selectedProblem.constraints.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
              </div>

              {/* Language & Run Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 px-5 py-3">
                <div className="inline-flex flex-wrap rounded-[4px] border border-border p-0.5" role="group" aria-label="Choose OA language">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => changeLanguage(l.id)}
                      className={`rounded-[3px] px-2.5 py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                        language === l.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCode(selectedProblem.starterCode[language])
                      setOaResult(null)
                    }}
                    className="inline-flex items-center gap-1 rounded-[4px] border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <RotateCcw className="size-3" aria-hidden="true" /> Reset
                  </button>
                  <button
                    type="button"
                    disabled={oaRunning}
                    onClick={() => void executeOa("sample")}
                    className="inline-flex items-center gap-1.5 rounded-[4px] border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-[#FA4028] hover:text-path-accent disabled:opacity-60 cursor-pointer"
                  >
                    <Play className="size-3.5" aria-hidden="true" /> Run Sample Tests
                  </button>
                  <button
                    type="button"
                    disabled={oaRunning}
                    onClick={() => void executeOa("submit")}
                    className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#FA4028] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#e1321c] disabled:opacity-60 cursor-pointer"
                  >
                    <Code2 className="size-3.5" aria-hidden="true" />
                    {oaRunning ? "Grading..." : "Submit Hidden Suite"}
                  </button>
                </div>
              </div>

              {/* Code Editor */}
              <div className="p-5">
                <label htmlFor="oa-code-editor" className="sr-only">
                  OA Solution Code Editor
                </label>
                <textarea
                  id="oa-code-editor"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  rows={12}
                  className="w-full resize-none border border-border bg-background/85 p-4 font-mono text-xs leading-6 text-foreground outline-none focus-visible:border-[#FA4028]"
                />
              </div>

              {/* Grading Output */}
              <div className="border-t border-border/80 bg-background/45 px-5 py-4" aria-live="polite">
                {!oaResult ? (
                  <p className="font-mono text-xs text-muted-foreground">
                    Visible sample tests run on &ldquo;Run Sample Tests&rdquo;. Click &ldquo;Submit Hidden Suite&rdquo; to verify edge cases (duplicates, negatives, empty inputs) and log runtime telemetry.
                  </p>
                ) : oaResult.compileError ? (
                  <div className="border border-[#FA4028]/50 bg-[#FA4028]/10 p-3 font-mono text-xs text-foreground">
                    <strong className="text-[#FA4028]">Execution Error:</strong> {oaResult.compileError}
                  </div>
                ) : (
                  <div className="grid gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                      <span
                        className={`font-semibold ${
                          oaResult.allPassed ? "text-emerald-500" : "text-[#FA4028]"
                        }`}
                      >
                        {oaSubmitMode === "submit" ? "SUBMISSION VERDICT" : "SAMPLE RUN"} ·{" "}
                        {oaResult.passedCount} / {oaResult.totalCount} test cases passed
                      </span>
                      <span className="text-muted-foreground tabular-nums">
                        {oaResult.engineLabel} · {oaResult.totalRuntimeMs} ms
                      </span>
                    </div>

                    <div className="grid gap-1.5 sm:grid-cols-2">
                      {oaResult.outcomes.map((tc) => (
                        <div
                          key={tc.id}
                          className={`flex items-center justify-between gap-2 border px-3 py-2 font-mono text-[11px] ${
                            tc.passed
                              ? "border-emerald-500/35 bg-emerald-500/8 text-foreground"
                              : "border-[#FA4028]/45 bg-[#FA4028]/10 text-foreground"
                          }`}
                        >
                          <span className="inline-flex items-center gap-1.5 truncate">
                            {tc.hidden ? (
                              <Lock className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
                            ) : (
                              <Unlock className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
                            )}
                            <span className="truncate">{tc.label}</span>
                          </span>
                          <span className="shrink-0 font-semibold">
                            {tc.passed ? (
                              <Check className="size-3.5 text-emerald-500" aria-hidden="true" />
                            ) : (
                              <X className="size-3.5 text-[#FA4028]" aria-hidden="true" />
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    {oaSubmitMode === "submit" && (
                      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-secondary/40 px-4 py-3 text-xs">
                        <div>
                          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-path-accent">
                            Optimal Reference · Time {selectedProblem.optimalTime} · Space {selectedProblem.optimalSpace}
                          </p>
                          <p className="mt-1 text-foreground/90">
                            <InlineCodeText text={selectedProblem.complexityNotes} />
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            onNavigate(`/programs/${selectedProblem.roadmapSlug}#${selectedProblem.roadmapStageId}`)
                          }
                          className="shrink-0 inline-flex items-center gap-1 rounded-[4px] border border-border px-3 py-1.5 font-mono text-[11px] font-medium text-foreground hover:border-[#FA4028] hover:text-path-accent cursor-pointer"
                        >
                          Revise {selectedProblem.roadmapTopicLabel}{" "}
                          <ArrowUpRight className="size-3" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ─── TAB 3: VERIFIED ROADMAP MASTERY ─── */}
        {activeTab === "roadmap" && (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {programs.map((prog) => {
              const allTopics = prog.stages.flatMap((s) => s.topics)
              const verified = allTopics.filter((t) => verifiedTopicIds.has(t.id)).length
              const pct = allTopics.length > 0 ? Math.round((verified / allTopics.length) * 100) : 0

              return (
                <section key={prog.slug} className="editorial-panel flex flex-col justify-between border p-6">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-path-accent">
                        {prog.code} · {prog.duration}
                      </span>
                      <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
                        {verified} / {allTopics.length} verified ({pct}%)
                      </span>
                    </div>
                    <h2 className="mt-2 font-display text-3xl text-foreground">{prog.name}</h2>
                    <div className="mt-3 h-2 w-full bg-border/50">
                      <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>

                    <div className="mt-5 grid gap-2">
                      {prog.stages.map((st, idx) => {
                        const stVerified = st.topics.filter((t) => verifiedTopicIds.has(t.id)).length
                        return (
                          <a
                            key={st.id}
                            href={`/programs/${prog.slug}#${st.id}`}
                            onClick={(e) => {
                              e.preventDefault()
                              onNavigate(`/programs/${prog.slug}#${st.id}`)
                            }}
                            className="flex items-center justify-between gap-2 border border-border/70 bg-background/45 px-3.5 py-2.5 text-xs transition-colors hover:border-[#FA4028]"
                          >
                            <span className="truncate font-medium text-foreground">
                              Stage {String(idx + 1).padStart(2, "0")}: {st.title}
                            </span>
                            <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                              {stVerified}/{st.topics.length}
                            </span>
                          </a>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-border/80">
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={() => onNavigate(`/programs/${prog.slug}`)}
                      className="cursor-pointer"
                    >
                      Open {prog.shortName} Roadmap &amp; Verify Checks{" "}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                </section>
              )
            })}
          </div>
        )}

        {/* ─── TAB 4: CAPSTONE PROOF ─── */}
        {activeTab === "projects" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="editorial-panel border p-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                Capstone Verification Pipeline
              </p>
              <h2 className="mt-1 font-display text-3xl text-foreground">
                Submit Your Deployed Capstone
              </h2>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                Mentors grade every Full-Stack and AI capstone on a transparent 3-part rubric: Architecture (0–10), Edge Cases (0–10), and Live Deployment (0–10). Verified projects automatically appear on your shareable SMK Skill Transcript.
              </p>

              <form onSubmit={handleCapstoneSubmit} className="mt-5 grid gap-4" noValidate>
                <div className="grid gap-1.5">
                  <label htmlFor="cap-track" className="text-xs font-medium text-foreground">
                    Program Track
                  </label>
                  <select
                    id="cap-track"
                    value={capTrack}
                    onChange={(e) =>
                      setCapTrack(e.target.value as "web-development" | "machine-learning")
                    }
                    className="form-control py-2 text-xs"
                  >
                    <option value="web-development">Full-Stack Web Development</option>
                    <option value="machine-learning">AI &amp; Machine Learning</option>
                  </select>
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="cap-title" className="text-xs font-medium text-foreground">
                    Project Title
                  </label>
                  <input
                    id="cap-title"
                    value={capTitle}
                    onChange={(e) => setCapTitle(e.target.value)}
                    placeholder="e.g. Campus Placement Tracker with Role-Based API"
                    className="form-control py-2 text-xs"
                  />
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="cap-repo" className="text-xs font-medium text-foreground">
                    GitHub Repository URL
                  </label>
                  <input
                    id="cap-repo"
                    type="url"
                    value={capRepo}
                    onChange={(e) => setCapRepo(e.target.value)}
                    placeholder="https://github.com/your-handle/campus-tracker"
                    className="form-control py-2 text-xs"
                  />
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="cap-live" className="text-xs font-medium text-foreground">
                    Live Deployed URL
                  </label>
                  <input
                    id="cap-live"
                    type="url"
                    value={capLive}
                    onChange={(e) => setCapLive(e.target.value)}
                    placeholder="https://campus-tracker.vercel.app"
                    className="form-control py-2 text-xs"
                  />
                </div>

                {capError && (
                  <p className="text-xs font-medium text-[#FA4028]" role="alert">
                    {capError}
                  </p>
                )}
                {capSuccess && (
                  <p className="text-xs font-medium text-emerald-500" role="status">
                    {capSuccess}
                  </p>
                )}

                <Button type="submit" disabled={capSubmitting} className="cursor-pointer justify-between">
                  {capSubmitting ? "Submitting..." : "Submit for Mentor Verification"}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Button>
              </form>
            </section>

            <section className="editorial-panel border p-6">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                    Your Submissions
                  </p>
                  <h2 className="mt-1 font-display text-3xl text-foreground">
                    Rubric Review History
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate(`/verify/${transcriptHandle}`)}
                  className="text-xs font-medium text-path-accent hover:underline cursor-pointer"
                >
                  Preview Transcript →
                </button>
              </div>

              {projectSubmissions.length === 0 ? (
                <div className="mt-6 border border-border/80 bg-background/45 p-6 text-xs leading-6 text-muted-foreground">
                  No capstone projects submitted yet. Submit your GitHub repository and live deployment URL on the left to enter the Mentor Studio review queue.
                </div>
              ) : (
                <div className="mt-5 grid gap-3.5">
                  {projectSubmissions.map((proj) => (
                    <div key={proj.id} className="border border-border/80 bg-background/50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                          {proj.programSlug === "web-development" ? "Full-Stack Web" : "AI & ML"}
                        </span>
                        <span
                          className={`font-mono text-[11px] font-semibold uppercase ${
                            proj.status === "verified"
                              ? "text-emerald-500"
                              : proj.status === "changes_requested"
                                ? "text-[#FA4028]"
                                : "text-[#0A84FF]"
                          }`}
                        >
                          {proj.status.replace("_", " ")}
                        </span>
                      </div>
                      <h3 className="mt-1.5 text-base font-semibold text-foreground">{proj.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-path-accent">
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 hover:underline"
                        >
                          GitHub Repo <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 hover:underline"
                        >
                          Live App <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                      </div>
                      {proj.status !== "pending" && (
                        <div className="mt-3 border-t border-border/70 pt-3 font-mono text-[11px] text-muted-foreground tabular-nums">
                          Architecture {proj.rubricArchitecture}/10 · Edge Cases {proj.rubricEdgeCases}/10 · Deployment{" "}
                          {proj.rubricDeployment}/10
                          {proj.mentorNotes && (
                            <p className="mt-1.5 font-sans text-xs text-foreground/90">{proj.mentorNotes}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <SiteFooter mode="app" onNavigate={onNavigate} />
    </div>
  )
}
