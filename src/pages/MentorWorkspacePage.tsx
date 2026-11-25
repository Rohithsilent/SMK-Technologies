import { useState, type FormEvent } from "react"
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  FolderGit2,
  KeyRound,
  LogIn,
  Plus,
  ShieldCheck,
  Terminal,
} from "lucide-react"
import SiteFooter from "@/components/SiteFooter"
import SiteHeader from "@/components/SiteHeader"
import { Button } from "@/components/ui/button"
import { useAuth, type PersistedProjectSubmission } from "@/context/AuthContext"
import type { BtechYear } from "@/lib/diagnosticEngine"

type MentorTab = "cohorts" | "assessments" | "capstones"

const SAMPLE_PENDING_CAPSTONES: PersistedProjectSubmission[] = [
  {
    id: "sample-cap-1",
    userId: "sample-stu-3",
    studentName: "Rohan Deshmukh",
    studentHandle: "rohan-it26",
    programSlug: "web-development",
    title: "Placement Cell Drive Scheduler & Resume Screener",
    repoUrl: "https://github.com/smk-techvora-demo/placement-scheduler",
    liveUrl: "https://placement-scheduler-demo.vercel.app",
    status: "pending",
    rubricArchitecture: 0,
    rubricEdgeCases: 0,
    rubricDeployment: 0,
    mentorNotes: "",
  },
  {
    id: "sample-cap-2",
    userId: "sample-stu-8",
    studentName: "Ananya Iyer",
    studentHandle: "ananya-cse26",
    programSlug: "machine-learning",
    title: "Campus Energy Demand Forecasting Pipeline (Scikit-Learn + FastAPI)",
    repoUrl: "https://github.com/smk-techvora-demo/campus-energy-ml",
    liveUrl: "https://campus-energy-ml.onrender.com",
    status: "pending",
    rubricArchitecture: 0,
    rubricEdgeCases: 0,
    rubricDeployment: 0,
    mentorNotes: "",
  },
]

export default function MentorWorkspacePage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const {
    user,
    isAdmin,
    colleges,
    cohorts,
    scheduledOas,
    allProjectsForReview,
    signInWithGoogle,
    createCollege,
    createCohort,
    publishOaAssessment,
    gradeCapstoneProject,
  } = useAuth()

  const [tab, setTab] = useState<MentorTab>("cohorts")
  const [statusNotice, setStatusNotice] = useState("")

  // College & Cohort forms
  const [collegeName, setCollegeName] = useState("")
  const [collegeCity, setCollegeCity] = useState("")
  const [selectedCollegeId, setSelectedCollegeId] = useState(colleges[0]?.id ?? "sample-col-1")
  const [cohortName, setCohortName] = useState("")
  const [cohortYear, setCohortYear] = useState<BtechYear>("3rd Year")
  const [inviteCode, setInviteCode] = useState("")

  // OA Scheduler form
  const [oaTitle, setOaTitle] = useState("")
  const [oaTier, setOaTier] = useState<"Service / Core IT" | "Product Engineering">(
    "Product Engineering",
  )
  const [oaDuration, setOaDuration] = useState(45)
  const [oaCohortId, setOaCohortId] = useState(cohorts[0]?.id ?? "sample-coh-1")

  // Capstone grading local state
  const [localSamples, setLocalSamples] = useState<PersistedProjectSubmission[]>(
    SAMPLE_PENDING_CAPSTONES,
  )
  const [rubricDrafts, setRubricDrafts] = useState<
    Record<string, { arch: number; edge: number; deploy: number; notes: string }>
  >({})

  const reviewQueue = allProjectsForReview.length > 0 ? allProjectsForReview : localSamples

  function flashNotice(msg: string) {
    setStatusNotice(msg)
    window.setTimeout(() => setStatusNotice(""), 3500)
  }

  async function handleAddCollege(e: FormEvent) {
    e.preventDefault()
    if (collegeName.trim().length < 2 || collegeCity.trim().length < 2) return
    await createCollege(collegeName, collegeCity)
    setCollegeName("")
    setCollegeCity("")
    flashNotice("College added to institutional directory.")
  }

  async function handleAddCohort(e: FormEvent) {
    e.preventDefault()
    const col = colleges.find((c) => c.id === selectedCollegeId) ?? colleges[0]
    if (!col || cohortName.trim().length < 2 || inviteCode.trim().length < 4) return
    await createCohort({
      collegeId: col.id,
      collegeName: col.name,
      name: cohortName,
      targetYear: cohortYear,
      inviteCode,
    })
    setCohortName("")
    setInviteCode("")
    flashNotice("Cohort created with active student invite code.")
  }

  async function handlePublishOa(e: FormEvent) {
    e.preventDefault()
    if (oaTitle.trim().length < 3) return
    await publishOaAssessment({
      title: oaTitle,
      tier: oaTier,
      durationMinutes: oaDuration,
      cohortId: oaCohortId,
    })
    setOaTitle("")
    flashNotice("Timed OA assessment published to Student Portal.")
  }

  async function handleGradeProject(
    proj: PersistedProjectSubmission,
    status: "verified" | "changes_requested",
  ) {
    const draft = rubricDrafts[proj.id] ?? {
      arch: 8,
      edge: 8,
      deploy: 9,
      notes: "Clean architecture, solid error handling, and live deployment verified.",
    }
    if (allProjectsForReview.length === 0) {
      setLocalSamples((prev) =>
        prev.map((item) =>
          item.id === proj.id
            ? {
                ...item,
                status,
                rubricArchitecture: draft.arch,
                rubricEdgeCases: draft.edge,
                rubricDeployment: draft.deploy,
                mentorNotes: draft.notes,
              }
            : item,
        ),
      )
      flashNotice(`Sample capstone "${proj.title}" marked as ${status.replace("_", " ")}.`)
      return
    }
    await gradeCapstoneProject({
      projectId: proj.id,
      status,
      rubricArchitecture: draft.arch,
      rubricEdgeCases: draft.edge,
      rubricDeployment: draft.deploy,
      mentorNotes: draft.notes,
    })
    flashNotice(`Capstone "${proj.title}" updated to ${status.replace("_", " ")}.`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader mode="app" activePath="/mentor" onNavigate={onNavigate} />

      <main className="mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-8 sm:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-path-accent">
              SMK Operations · Mentor &amp; Admin Workspace
            </p>
            <h1 className="mt-2 font-display text-4xl leading-[0.98] tracking-tight sm:text-5xl">
              Mentor <em className="hero-em not-italic">Studio</em>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate("/tpo")}
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-border px-3.5 py-2 text-xs font-medium text-foreground hover:border-[#FA4028] hover:text-path-accent cursor-pointer"
            >
              View TPO Analytics <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </button>
            {!user && (
              <Button type="button" size="sm" onClick={() => void signInWithGoogle()} className="cursor-pointer">
                <LogIn className="size-3.5" aria-hidden="true" /> Sign in as Admin
              </Button>
            )}
          </div>
        </div>

        {!isAdmin && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-border bg-secondary/45 px-5 py-3.5 text-xs">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-path-accent" aria-hidden="true" />
              <p className="text-foreground">
                <strong>Interactive Preview Mode:</strong> Changes test locally in-session. Sign in with the authorized SMK Mentor/Admin Google account to write directly to Firestore.
              </p>
            </div>
          </div>
        )}

        {statusNotice && (
          <div
            className="mt-4 border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 font-mono text-xs text-emerald-500"
            role="status"
          >
            {statusNotice}
          </div>
        )}

        {/* Workspace Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-border/80 pb-4" role="tablist">
          {[
            { id: "cohorts" as MentorTab, label: "Colleges & Invite Codes", icon: Building2 },
            { id: "assessments" as MentorTab, label: "Timed OA Scheduler", icon: Terminal },
            { id: "capstones" as MentorTab, label: `Capstone Rubric Queue (${reviewQueue.length})`, icon: FolderGit2 },
          ].map((item) => {
            const Icon = item.icon
            const active = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={`inline-flex items-center gap-2 rounded-[4px] border px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? "border-[#FA4028] bg-[var(--coral-bg)] text-foreground"
                    : "border-border bg-background/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5 text-path-accent" aria-hidden="true" />
                {item.label}
              </button>
            )
          })}
        </div>

        {/* ─── TAB 1: COLLEGES & COHORTS ─── */}
        {tab === "cohorts" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid gap-6">
              <section className="editorial-panel border p-6">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                  Step 01 · Partner Institution
                </p>
                <h2 className="mt-1 font-display text-2xl text-foreground">Register College</h2>
                <form onSubmit={handleAddCollege} className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="College name (e.g. CBIT)"
                    className="form-control py-2 text-xs"
                    required
                  />
                  <input
                    value={collegeCity}
                    onChange={(e) => setCollegeCity(e.target.value)}
                    placeholder="City (e.g. Hyderabad)"
                    className="form-control py-2 text-xs"
                    required
                  />
                  <Button type="submit" size="sm" className="cursor-pointer sm:col-span-2">
                    <Plus className="size-3.5" aria-hidden="true" /> Add College
                  </Button>
                </form>
              </section>

              <section className="editorial-panel border p-6">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                  Step 02 · Batch Onboarding
                </p>
                <h2 className="mt-1 font-display text-2xl text-foreground">
                  Create Cohort &amp; Invite Code
                </h2>
                <form onSubmit={handleAddCohort} className="mt-4 grid gap-3">
                  <select
                    value={selectedCollegeId}
                    onChange={(e) => setSelectedCollegeId(e.target.value)}
                    className="form-control py-2 text-xs"
                  >
                    {colleges.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.city})
                      </option>
                    ))}
                  </select>
                  <input
                    value={cohortName}
                    onChange={(e) => setCohortName(e.target.value)}
                    placeholder="Batch title (e.g. 3rd Year CSE Placement Track)"
                    className="form-control py-2 text-xs"
                    required
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <select
                      value={cohortYear}
                      onChange={(e) => setCohortYear(e.target.value as BtechYear)}
                      className="form-control py-2 text-xs"
                    >
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                    </select>
                    <input
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      placeholder="Invite code (e.g. CBIT-CSE-26)"
                      className="form-control py-2 font-mono text-xs uppercase"
                      required
                    />
                  </div>
                  <Button type="submit" size="sm" className="cursor-pointer">
                    <KeyRound className="size-3.5" aria-hidden="true" /> Create Cohort &amp; Activate Code
                  </Button>
                </form>
              </section>
            </div>

            <section className="editorial-panel border p-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                Active Directory
              </p>
              <h2 className="mt-1 font-display text-3xl text-foreground">
                Live Cohorts &amp; Invite Codes ({cohorts.length})
              </h2>
              <div className="mt-5 grid gap-3">
                {cohorts.map((coh) => (
                  <div
                    key={coh.id}
                    className="flex flex-wrap items-center justify-between gap-3 border border-border/80 bg-background/50 p-4"
                  >
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                        {coh.collegeName} · {coh.targetYear}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{coh.name}</p>
                    </div>
                    <span className="border border-border bg-secondary/50 px-3 py-1 font-mono text-xs font-semibold text-path-accent">
                      {coh.inviteCode}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ─── TAB 2: OA SCHEDULER ─── */}
        {tab === "assessments" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="editorial-panel border p-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                Assessment Authoring
              </p>
              <h2 className="mt-1 font-display text-3xl text-foreground">
                Schedule Timed OA Round
              </h2>
              <form onSubmit={handlePublishOa} className="mt-5 grid gap-4">
                <div className="grid gap-1.5">
                  <label htmlFor="oa-title" className="text-xs font-medium text-foreground">
                    Assessment Title
                  </label>
                  <input
                    id="oa-title"
                    value={oaTitle}
                    onChange={(e) => setOaTitle(e.target.value)}
                    placeholder="e.g. Week 4 Product DSA OA (Sliding Window + Prefix Sum)"
                    className="form-control py-2 text-xs"
                    required
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <label htmlFor="oa-tier" className="text-xs font-medium text-foreground">
                      Hiring Tier
                    </label>
                    <select
                      id="oa-tier"
                      value={oaTier}
                      onChange={(e) =>
                        setOaTier(e.target.value as "Service / Core IT" | "Product Engineering")
                      }
                      className="form-control py-2 text-xs"
                    >
                      <option value="Service / Core IT">Service / Core IT</option>
                      <option value="Product Engineering">Product Engineering</option>
                    </select>
                  </div>
                  <div className="grid gap-1.5">
                    <label htmlFor="oa-duration" className="text-xs font-medium text-foreground">
                      Duration (Minutes)
                    </label>
                    <input
                      id="oa-duration"
                      type="number"
                      min={15}
                      max={120}
                      value={oaDuration}
                      onChange={(e) => setOaDuration(Number(e.target.value) || 45)}
                      className="form-control py-2 text-xs tabular-nums"
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <label htmlFor="oa-cohort" className="text-xs font-medium text-foreground">
                    Target Cohort
                  </label>
                  <select
                    id="oa-cohort"
                    value={oaCohortId}
                    onChange={(e) => setOaCohortId(e.target.value)}
                    className="form-control py-2 text-xs"
                  >
                    {cohorts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.collegeName} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="cursor-pointer">
                  Publish Timed OA to Portal <ArrowUpRight className="size-4" aria-hidden="true" />
                </Button>
              </form>
            </section>

            <section className="editorial-panel border p-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                Published Queue
              </p>
              <h2 className="mt-1 font-display text-3xl text-foreground">
                Active Campus Assessments ({scheduledOas.length})
              </h2>
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
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-500">
                      <CheckCircle2 className="size-3.5" aria-hidden="true" /> Live
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ─── TAB 3: CAPSTONE RUBRIC REVIEW QUEUE ─── */}
        {tab === "capstones" && (
          <div className="mt-6 grid gap-5">
            {reviewQueue.map((proj) => {
              const draft = rubricDrafts[proj.id] ?? {
                arch: proj.rubricArchitecture || 8,
                edge: proj.rubricEdgeCases || 8,
                deploy: proj.rubricDeployment || 9,
                notes:
                  proj.mentorNotes ||
                  "Well-structured repository, clean API validation, and responsive live deployment.",
              }

              const updateDraft = (patch: Partial<typeof draft>) =>
                setRubricDrafts((prev) => ({ ...prev, [proj.id]: { ...draft, ...patch } }))

              return (
                <section key={proj.id} className="editorial-panel border p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/80 pb-4">
                    <div>
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-path-accent">
                        {proj.studentName} (@{proj.studentHandle}) ·{" "}
                        {proj.programSlug === "web-development" ? "Full-Stack Web" : "AI & ML"}
                      </p>
                      <h3 className="mt-1 font-display text-2xl text-foreground">{proj.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-path-accent">
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 hover:underline"
                        >
                          Inspect GitHub <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 hover:underline"
                        >
                          Open Live Build <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                    <span
                      className={`font-mono text-xs font-semibold uppercase ${
                        proj.status === "verified"
                          ? "text-emerald-500"
                          : proj.status === "changes_requested"
                            ? "text-[#FA4028]"
                            : "text-[#0A84FF]"
                      }`}
                    >
                      Status: {proj.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-xs font-medium text-foreground">
                        Architecture (0–10): <strong className="font-mono">{draft.arch}</strong>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        value={draft.arch}
                        onChange={(e) => updateDraft({ arch: Number(e.target.value) })}
                        className="mt-2 w-full accent-[#FA4028]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground">
                        Edge Cases (0–10): <strong className="font-mono">{draft.edge}</strong>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        value={draft.edge}
                        onChange={(e) => updateDraft({ edge: Number(e.target.value) })}
                        className="mt-2 w-full accent-[#FA4028]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground">
                        Live Deployment (0–10): <strong className="font-mono">{draft.deploy}</strong>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        value={draft.deploy}
                        onChange={(e) => updateDraft({ deploy: Number(e.target.value) })}
                        className="mt-2 w-full accent-[#FA4028]"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-xs font-medium text-foreground">Mentor Rubric Feedback</label>
                    <textarea
                      value={draft.notes}
                      onChange={(e) => updateDraft({ notes: e.target.value })}
                      rows={2}
                      className="form-control mt-1.5 min-h-[4rem] py-2 text-xs"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => void handleGradeProject(proj, "changes_requested")}
                      className="rounded-[4px] border border-border px-4 py-2 text-xs font-medium text-foreground hover:border-[#FA4028] hover:text-path-accent cursor-pointer"
                    >
                      Request Revisions
                    </button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => void handleGradeProject(proj, "verified")}
                      className="cursor-pointer"
                    >
                      <CheckCircle2 className="size-3.5" aria-hidden="true" /> Approve &amp; Verify for Transcript
                    </Button>
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </main>

      <SiteFooter mode="app" onNavigate={onNavigate} />
    </div>
  )
}
