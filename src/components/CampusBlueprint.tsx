import { useMemo, useState } from "react"
import { ArrowUpRight, BarChart3, Calendar, Check, FileText, Layers, Printer, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  buildSyllabusBrief,
  computeTierPercentages,
  SAMPLE_COHORT_DATA,
  type DeliveryMode,
} from "@/lib/tpoAnalytics"

type BatchKey = "second-year" | "third-year" | "final-year"
type CampusTabKey = BatchKey | "tpo-report"

const BATCH_BLUEPRINTS: Record<
  BatchKey,
  {
    tabLabel: string
    yearBadge: string
    title: string
    schedule: string
    tracks: string
    deliverables: string[]
    contactNote: string
  }
> = {
  "second-year": {
    tabLabel: "2nd Year",
    yearBadge: "FOUNDATION COHORT",
    title: "Programming Foundations & Core DSA",
    schedule: "Semester-aligned · 4 hrs / week or 3-week campus bridge",
    tracks: "Python Programming + Stage 1–3 DSA",
    deliverables: [
      "Zero-to-clean coding fluency with memory & recursion tracing",
      "60+ guided logic & pattern-building problems solved live",
      "Weekly mini-evaluations mapped to university lab schedules",
    ],
    contactNote:
      "Interested in a 2nd Year Foundation cohort (Python + Core DSA). Batch size: ",
  },
  "third-year": {
    tabLabel: "3rd Year",
    yearBadge: "PLACEMENT TRACK",
    title: "Interview DSA + Full-Stack Build Lab",
    schedule: "6–8 Week Campus Track · Offline lab or live hybrid",
    tracks: "Complete DSA + Full-Stack Web or AI/ML",
    deliverables: [
      "150+ assessment-grade DSA drills across trees, graphs & DP",
      "Production-deployed React + API or ML portfolio project",
      "Timed online assessment simulations & code-review feedback",
    ],
    contactNote:
      "Interested in a 3rd Year Placement Prep cohort (DSA + Full-Stack/AI). Batch size: ",
  },
  "final-year": {
    tabLabel: "Final Year",
    yearBadge: "CAMPUS SPRINT",
    title: "Day-1 Placement & OA Bootcamp",
    schedule: "2–3 Week Intensive Bootcamp · Pre-placement window",
    tracks: "High-Frequency DSA Patterns + Mock Technical Rounds",
    deliverables: [
      "Targeted company OA pattern sprints (arrays, sliding window, DP)",
      "Live complexity optimization & debugging under timer pressure",
      "1-on-1 resume project walkthrough & technical interview drills",
    ],
    contactNote:
      "Interested in a Final Year Placement Bootcamp sprint. Target drive date & batch size: ",
  },
}

type CampusBlueprintProps = {
  onSelectBatch: (interest: string, note: string, batchYear?: string) => void
  onNavigate?: (href: string) => void
}

export default function CampusBlueprint({ onSelectBatch, onNavigate }: CampusBlueprintProps) {
  const [selectedTab, setSelectedTab] = useState<CampusTabKey>("third-year")
  const [showBriefModal, setShowBriefModal] = useState(false)
  const [collegeName, setCollegeName] = useState("")
  const [batchSize, setBatchSize] = useState(120)
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("Offline Campus Lab")

  const activeBatchKey: BatchKey = selectedTab === "tpo-report" ? "third-year" : selectedTab
  const active = BATCH_BLUEPRINTS[activeBatchKey]
  const tierPct = useMemo(
    () => computeTierPercentages(SAMPLE_COHORT_DATA.tierDistribution),
    [],
  )
  const syllabusBrief = useMemo(
    () =>
      buildSyllabusBrief({
        collegeName,
        batchKey: activeBatchKey,
        batchSize,
        deliveryMode,
      }),
    [collegeName, activeBatchKey, batchSize, deliveryMode],
  )

  return (
    <section
      id="campus"
      className="border-t border-border/80 bg-background px-6 py-20 sm:px-10 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-start lg:gap-16">
        <div>
          <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-path-accent">
            <span className="h-px w-8 bg-path-accent" aria-hidden="true" />
            For colleges &amp; placement cells
          </p>
          <h2 className="max-w-xl font-display text-5xl leading-[0.98] tracking-tight sm:text-6xl">
            Partner with SMK to
            <br />
            <em className="not-italic text-muted-foreground">train your students.</em>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">
            Transparent engineering metrics instead of unverified claims. Preview our live TPO readiness matrix, generate a printable NAAC/NBA-aligned syllabus proposal, and align training to your academic calendar.
          </p>

          <ol className="campus-brief mt-8">
            <li>
              <span>01</span>
              <div>
                <h3>Customized for your batch</h3>
                <p>
                  Tailored modules for 2nd, 3rd, or final-year B.Tech students — from complete beginners to product-tier coders.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Measurable TPO reporting</h3>
                <p>
                  Weekly readiness tier breakdowns, topic bottleneck heatmaps, and NAAC/NBA-ready CSV/PDF assessment logs.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Flexible campus delivery</h3>
                <p>
                  Hands-on offline bootcamps right on your campus or interactive live hybrid cohorts with real-time code grading.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Interactive Batch Blueprint + TPO Sample Report Panel */}
        <div className="editorial-panel border">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 px-5 py-4 sm:px-6">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                Campus Program &amp; TPO Preview
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Configure batch syllabus or inspect a sample 120-student TPO report
              </p>
            </div>
            <div
              className="inline-flex flex-wrap rounded-[4px] border border-border p-0.5"
              role="tablist"
              aria-label="Select college batch year or TPO preview"
            >
              {(Object.keys(BATCH_BLUEPRINTS) as BatchKey[]).map((key) => {
                const isCurrent = selectedTab === key
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    onClick={() => setSelectedTab(key)}
                    className={`rounded-[3px] px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {BATCH_BLUEPRINTS[key].tabLabel}
                  </button>
                )
              })}
              <button
                type="button"
                role="tab"
                aria-selected={selectedTab === "tpo-report"}
                onClick={() => setSelectedTab("tpo-report")}
                className={`inline-flex items-center gap-1.5 rounded-[3px] px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedTab === "tpo-report"
                    ? "bg-[#FA4028] text-white"
                    : "text-path-accent hover:text-foreground"
                }`}
              >
                <BarChart3 className="size-3.5" aria-hidden="true" />
                Preview Live TPO Report
              </button>
            </div>
          </div>

          {selectedTab !== "tpo-report" ? (
            <div className="p-6 sm:p-8" role="tabpanel" aria-label={active.title}>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-path-accent">
                {active.yearBadge}
              </p>
              <h3 className="mt-2 font-display text-3xl leading-tight text-foreground sm:text-4xl">
                {active.title}
              </h3>

              <dl className="mt-6 grid gap-4 border-y border-border/80 py-5 sm:grid-cols-2">
                <div>
                  <dt className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    <Calendar className="size-3.5 text-path-accent" aria-hidden="true" />
                    Cadence
                  </dt>
                  <dd className="mt-1.5 text-xs font-medium leading-relaxed text-foreground sm:text-sm">
                    {active.schedule}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    <Layers className="size-3.5 text-path-accent" aria-hidden="true" />
                    Track Mix
                  </dt>
                  <dd className="mt-1.5 text-xs font-medium leading-relaxed text-foreground sm:text-sm">
                    {active.tracks}
                  </dd>
                </div>
              </dl>

              <ul className="mt-6 grid gap-3">
                {active.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-xs leading-relaxed text-foreground/90 sm:text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-path-accent" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-6">
                <button
                  type="button"
                  onClick={() => setShowBriefModal(true)}
                  className="inline-flex items-center gap-2 rounded-[4px] border border-border px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-[#FA4028] hover:text-path-accent cursor-pointer"
                >
                  <FileText className="size-3.5" aria-hidden="true" />
                  Generate Custom Syllabus Brief
                </button>
                <Button
                  type="button"
                  variant="default"
                  onClick={() =>
                    onSelectBatch(
                      "Campus training / college collaboration",
                      active.contactNote,
                      active.tabLabel,
                    )
                  }
                  className="cursor-pointer px-5"
                >
                  Discuss {active.tabLabel} batch <ArrowUpRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-7" role="tabpanel" aria-label="Sample TPO Cohort Report">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-4">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-path-accent">
                    Sample Cohort View · 120 Students (Illustrative Demo)
                  </p>
                  <h3 className="mt-1 font-display text-2xl text-foreground sm:text-3xl">
                    TPO Placement Readiness Matrix
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate?.("/tpo")}
                  className="inline-flex items-center gap-1.5 rounded-[4px] bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-[#FA4028] hover:text-white cursor-pointer"
                >
                  Open Full TPO Dashboard <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </button>
              </div>

              {/* Tier Distribution Bar */}
              <div className="mt-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-foreground">Cohort Readiness Distribution</span>
                  <span className="font-mono text-muted-foreground tabular-nums">
                    Foundation {tierPct.foundationPct}% · Core {tierPct.assessmentReadyPct}% · Product-Ready {tierPct.productReadyPct}%
                  </span>
                </div>
                <div className="mt-2 flex h-3 w-full overflow-hidden border border-border/80 bg-background">
                  <div
                    style={{ width: `${tierPct.foundationPct}%` }}
                    className="bg-[#FA4028]"
                    title={`Foundation: ${SAMPLE_COHORT_DATA.tierDistribution.foundation} students`}
                  />
                  <div
                    style={{ width: `${tierPct.assessmentReadyPct}%` }}
                    className="bg-[#0A84FF]"
                    title={`Assessment-Ready: ${SAMPLE_COHORT_DATA.tierDistribution.assessmentReady} students`}
                  />
                  <div
                    style={{ width: `${tierPct.productReadyPct}%` }}
                    className="bg-emerald-500"
                    title={`Product-Ready: ${SAMPLE_COHORT_DATA.tierDistribution.productReady} students`}
                  />
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-[11px] text-muted-foreground tabular-nums">
                  <span>Foundation: {SAMPLE_COHORT_DATA.tierDistribution.foundation}</span>
                  <span>Core Ready: {SAMPLE_COHORT_DATA.tierDistribution.assessmentReady}</span>
                  <span>Product-Tier: {SAMPLE_COHORT_DATA.tierDistribution.productReady}</span>
                </div>
              </div>

              {/* Topic Bottleneck Heatmap + OA Trend */}
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Topic Mastery Bottlenecks
                  </p>
                  <div className="mt-2.5 grid gap-2">
                    {SAMPLE_COHORT_DATA.bottlenecks.slice(0, 4).map((b) => (
                      <div key={b.topic} className="border border-border/70 bg-background/50 p-2.5">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="truncate font-medium text-foreground">{b.topic}</span>
                          <span className="font-mono text-[11px] font-semibold text-path-accent tabular-nums">
                            {b.passRatePct}% pass
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full bg-border/50">
                          <div
                            className={b.passRatePct < 50 ? "h-full bg-[#FA4028]" : "h-full bg-[#0A84FF]"}
                            style={{ width: `${b.passRatePct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      6-Week OA Pass-Rate Trend
                    </p>
                    <div className="mt-2.5 flex h-36 items-end gap-2 border border-border/70 bg-background/50 px-3 pb-3 pt-5">
                      {SAMPLE_COHORT_DATA.oaTrend.map((pt) => (
                        <div key={pt.week} className="flex flex-1 flex-col items-center gap-1">
                          <span className="font-mono text-[10px] text-foreground tabular-nums">
                            {pt.passRatePct}%
                          </span>
                          <div className="flex h-20 w-full items-end bg-border/30">
                            <div
                              className="w-full bg-[#0A84FF] transition-all"
                              style={{ height: `${pt.passRatePct}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground">{pt.week}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border border-border/70 bg-background/50 px-3 py-2 text-xs">
                    <span className="text-muted-foreground">NAAC/NBA Attendance &amp; OA Export</span>
                    <span className="font-mono font-semibold text-emerald-500 tabular-nums">
                      {SAMPLE_COHORT_DATA.avgAttendancePct}% Avg
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-5">
                <button
                  type="button"
                  onClick={() => setShowBriefModal(true)}
                  className="inline-flex items-center gap-2 rounded-[4px] border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-[#FA4028] hover:text-path-accent cursor-pointer"
                >
                  <FileText className="size-3.5" aria-hidden="true" />
                  Generate Custom Syllabus Brief
                </button>
                <Button
                  type="button"
                  variant="default"
                  onClick={() => onNavigate?.("/tpo")}
                  className="cursor-pointer px-5"
                >
                  Explore Full TPO Command Center <ArrowUpRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Printable Syllabus Brief Modal */}
      {showBriefModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#020624]/75 p-4 backdrop-blur-[3px] print:static print:bg-white print:p-0"
          role="dialog"
          aria-modal="true"
          aria-labelledby="syllabus-brief-title"
        >
          <div className="editorial-panel flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden border print:max-h-none print:border-0 print:shadow-none">
            <div className="flex items-center justify-between border-b border-border px-6 py-4 print:hidden">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                  Printable Campus Proposal
                </p>
                <h3 id="syllabus-brief-title" className="font-display text-2xl text-foreground">
                  Custom Syllabus Brief Generator
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBriefModal(false)}
                aria-label="Close syllabus brief generator"
                className="inline-flex size-9 items-center justify-center rounded-[4px] border border-border text-foreground hover:border-[#FA4028] hover:text-path-accent cursor-pointer"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* Configurator Controls (Hidden in Print) */}
            <div className="grid gap-3 border-b border-border bg-background/50 px-6 py-4 sm:grid-cols-3 print:hidden">
              <div>
                <label htmlFor="brief-college" className="text-[11px] font-medium text-muted-foreground">
                  College Name
                </label>
                <input
                  id="brief-college"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. JNTU Hyderabad"
                  className="form-control mt-1 py-1.5 text-xs"
                />
              </div>
              <div>
                <label htmlFor="brief-size" className="text-[11px] font-medium text-muted-foreground">
                  Estimated Batch Size
                </label>
                <input
                  id="brief-size"
                  type="number"
                  min={20}
                  max={1000}
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value) || 60)}
                  className="form-control mt-1 py-1.5 text-xs tabular-nums"
                />
              </div>
              <div>
                <label htmlFor="brief-mode" className="text-[11px] font-medium text-muted-foreground">
                  Delivery Mode
                </label>
                <select
                  id="brief-mode"
                  value={deliveryMode}
                  onChange={(e) => setDeliveryMode(e.target.value as DeliveryMode)}
                  className="form-control mt-1 py-1.5 text-xs"
                >
                  <option value="Offline Campus Lab">Offline Campus Lab</option>
                  <option value="Live Hybrid Cohort">Live Hybrid Cohort</option>
                  <option value="Intensive Bootcamp">Intensive Bootcamp</option>
                </select>
              </div>
            </div>

            {/* Printable Proposal Body */}
            <div className="print-proposal flex-1 overflow-y-auto px-6 py-6 text-foreground">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                    SMK TechVora · Institutional Training Proposal
                  </p>
                  <h4 className="mt-1 font-display text-3xl text-foreground">
                    {syllabusBrief.collegeName}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {syllabusBrief.yearLabel} · {syllabusBrief.batchSize} Students · {syllabusBrief.deliveryMode}
                  </p>
                </div>
                <div className="text-right font-mono text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">{syllabusBrief.recommendedDuration}</p>
                  <p>{syllabusBrief.tracksIncluded.join(" + ")}</p>
                </div>
              </div>

              <div className="mt-5">
                <h5 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-path-accent">
                  Syllabus Modules (Mapped from SMK Roadmaps)
                </h5>
                <div className="mt-3 grid gap-3">
                  {syllabusBrief.modules.map((mod, idx) => (
                    <div key={`${mod.programName}-${mod.stageTitle}`} className="border border-border/80 p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium text-sm text-foreground">
                          {String(idx + 1).padStart(2, "0")}. {mod.stageTitle}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {mod.programName} · {mod.duration}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Topics: {mod.topics.join(" · ")}
                      </p>
                      <p className="mt-1 text-xs text-foreground/90">
                        <strong>Exit Outcome:</strong> {mod.outcome}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <h5 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-path-accent">
                  Assessment &amp; NAAC/NBA Documentation Cadence
                </h5>
                <ul className="mt-2.5 grid gap-2 text-xs text-foreground/90">
                  {syllabusBrief.assessmentCadence.map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-path-accent" aria-hidden="true" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background/50 px-6 py-4 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-[4px] border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-[#FA4028] hover:text-path-accent cursor-pointer"
              >
                <Printer className="size-3.5" aria-hidden="true" />
                Print / Save as PDF
              </button>
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  setShowBriefModal(false)
                  onSelectBatch(
                    "Campus training / college collaboration",
                    `Custom Syllabus Brief for ${syllabusBrief.collegeName} (${syllabusBrief.yearLabel}, ~${syllabusBrief.batchSize} students, ${syllabusBrief.deliveryMode}). Tracks: ${syllabusBrief.tracksIncluded.join(" + ")}.`,
                    active.tabLabel,
                  )
                }}
                className="cursor-pointer px-5"
              >
                Send Proposal to Enquiry Form <ArrowUpRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
