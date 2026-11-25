import { useMemo, useState } from "react"
import {
  ArrowUpRight,
  Download,
  Printer,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react"
import SiteFooter from "@/components/SiteFooter"
import SiteHeader from "@/components/SiteHeader"
import { Button } from "@/components/ui/button"
import {
  computeTierPercentages,
  generateCohortCsv,
  SAMPLE_COHORT_DATA,
  type ReadinessTier,
} from "@/lib/tpoAnalytics"

const TIER_FILTERS: Array<"All" | ReadinessTier> = [
  "All",
  "Product-Tier",
  "Assessment-Ready",
  "Foundation / At-Risk",
]

export default function TpoDashboardPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [tierFilter, setTierFilter] = useState<"All" | ReadinessTier>("All")
  const [exportNote, setExportNote] = useState("")

  const tierPct = useMemo(
    () => computeTierPercentages(SAMPLE_COHORT_DATA.tierDistribution),
    [],
  )

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return SAMPLE_COHORT_DATA.students.filter((stu) => {
      const matchesTier = tierFilter === "All" || stu.tier === tierFilter
      const matchesSearch =
        !q ||
        stu.name.toLowerCase().includes(q) ||
        stu.rollNo.toLowerCase().includes(q) ||
        stu.branch.toLowerCase().includes(q)
      return matchesTier && matchesSearch
    })
  }, [searchQuery, tierFilter])

  function handleDownloadCsv() {
    const csv = generateCohortCsv(filteredStudents)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "smk-techvora-naac-cohort-report.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setExportNote(`Exported ${filteredStudents.length} student records to CSV.`)
    window.setTimeout(() => setExportNote(""), 3500)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="print:hidden">
        <SiteHeader mode="app" activePath="/tpo" onNavigate={onNavigate} />
      </div>

      <main className="mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-8 sm:pt-28 print:pt-4">
        {/* Masthead */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-path-accent">
              Institutional Placement Analytics · Sample Cohort View (120 Students)
            </p>
            <h1 className="mt-2 font-display text-4xl leading-[0.98] tracking-tight sm:text-5xl">
              TPO Cohort <em className="hero-em not-italic">Command Center</em>
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-6 text-muted-foreground">
              Illustrative 120-student B.Tech 3rd Year CSE/IT cohort preview demonstrating NAAC/NBA-compliant readiness stratification, topic bottleneck telemetry, and recruiter-verifiable transcripts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-[#FA4028] hover:text-path-accent cursor-pointer"
            >
              <Download className="size-3.5" aria-hidden="true" />
              Download NAAC CSV
            </button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => window.print()}
              className="cursor-pointer"
            >
              <Printer className="size-3.5" aria-hidden="true" />
              Print PDF Report
            </Button>
          </div>
        </div>

        {exportNote && (
          <p className="mt-4 font-mono text-xs font-medium text-emerald-500" role="status">
            {exportNote}
          </p>
        )}

        {/* 4-Column KPI Strip */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="editorial-panel border p-5">
            <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              <Users className="size-3.5 text-path-accent" aria-hidden="true" />
              Active Cohort Size
            </p>
            <p className="mt-2 font-display text-4xl text-foreground tabular-nums">
              {SAMPLE_COHORT_DATA.totalStudents}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">3rd Year B.Tech · CSE / IT / AI&amp;DS / ECE</p>
          </div>

          <div className="editorial-panel border p-5">
            <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              <TrendingUp className="size-3.5 text-emerald-500" aria-hidden="true" />
              Product-Tier Ready
            </p>
            <p className="mt-2 font-display text-4xl text-foreground tabular-nums">
              {SAMPLE_COHORT_DATA.tierDistribution.productReady}
              <span className="ml-1.5 font-mono text-sm text-emerald-500">
                ({tierPct.productReadyPct}%)
              </span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">≥ 80% OA &amp; Diagnostic benchmark</p>
          </div>

          <div className="editorial-panel border p-5">
            <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-[#0A84FF]" aria-hidden="true" />
              Avg Timed OA Pass Rate
            </p>
            <p className="mt-2 font-display text-4xl text-foreground tabular-nums">
              {SAMPLE_COHORT_DATA.avgOaPassRate}%
            </p>
            <p className="mt-1 text-xs text-muted-foreground">+35% improvement over 6 weeks</p>
          </div>

          <div className="editorial-panel border p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Lab Attendance &amp; Drills
            </p>
            <p className="mt-2 font-display text-4xl text-foreground tabular-nums">
              {SAMPLE_COHORT_DATA.avgAttendancePct}%
            </p>
            <p className="mt-1 text-xs text-muted-foreground">NAAC/NBA auditable log ready</p>
          </div>
        </section>

        {/* Readiness Tier Distribution + Bottleneck Heatmap + 6-Week Trend */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="editorial-panel border p-6">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
              Topic Bottleneck Heatmap
            </p>
            <h2 className="mt-1 font-display text-3xl text-foreground">
              Where This Batch Needs Remedial Labs
            </h2>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Click any bottleneck to jump straight to the corresponding SMK roadmap stage.
            </p>

            <div className="mt-5 grid gap-3">
              {SAMPLE_COHORT_DATA.bottlenecks.map((item) => (
                <a
                  key={item.topic}
                  href={item.roadmapHref}
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate(item.roadmapHref)
                  }}
                  className="group block border border-border/80 bg-background/50 p-3.5 transition-colors hover:border-[#FA4028]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-semibold text-foreground group-hover:text-path-accent">
                        {item.topic}
                      </span>
                      <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                        {item.track}
                      </span>
                    </div>
                    <span className="font-mono font-semibold text-path-accent tabular-nums">
                      {item.passRatePct}% pass · {item.studentsStruggling} struggling
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full bg-border/45">
                    <div
                      className={
                        item.passRatePct < 50 ? "h-full bg-[#FA4028]" : "h-full bg-[#0A84FF]"
                      }
                      style={{ width: `${item.passRatePct}%` }}
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Tier Bar */}
            <div className="editorial-panel border p-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                Batch Stratification
              </p>
              <h2 className="mt-1 font-display text-3xl text-foreground">
                Placement Readiness Tiers
              </h2>
              <div className="mt-5 flex h-4 w-full overflow-hidden border border-border/80 bg-background">
                <div style={{ width: `${tierPct.foundationPct}%` }} className="bg-[#FA4028]" />
                <div style={{ width: `${tierPct.assessmentReadyPct}%` }} className="bg-[#0A84FF]" />
                <div style={{ width: `${tierPct.productReadyPct}%` }} className="bg-emerald-500" />
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-3 font-mono text-xs tabular-nums">
                <div className="border border-border/70 bg-background/40 p-3">
                  <dt className="text-[10px] uppercase text-[#FA4028]">Foundation</dt>
                  <dd className="mt-1 text-lg font-semibold text-foreground">
                    {SAMPLE_COHORT_DATA.tierDistribution.foundation} ({tierPct.foundationPct}%)
                  </dd>
                </div>
                <div className="border border-border/70 bg-background/40 p-3">
                  <dt className="text-[10px] uppercase text-[#0A84FF]">Core Ready</dt>
                  <dd className="mt-1 text-lg font-semibold text-foreground">
                    {SAMPLE_COHORT_DATA.tierDistribution.assessmentReady} ({tierPct.assessmentReadyPct}%)
                  </dd>
                </div>
                <div className="border border-border/70 bg-background/40 p-3">
                  <dt className="text-[10px] uppercase text-emerald-500">Product-Tier</dt>
                  <dd className="mt-1 text-lg font-semibold text-foreground">
                    {SAMPLE_COHORT_DATA.tierDistribution.productReady} ({tierPct.productReadyPct}%)
                  </dd>
                </div>
              </dl>
            </div>

            {/* 6-Week OA Trend */}
            <div className="editorial-panel flex-1 border p-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                Weekly Progression
              </p>
              <h2 className="mt-1 font-display text-3xl text-foreground">
                6-Week Timed OA Pass Rate
              </h2>
              <div className="mt-5 flex h-44 items-end gap-3 border border-border/70 bg-background/50 px-4 pb-3 pt-6">
                {SAMPLE_COHORT_DATA.oaTrend.map((pt) => (
                  <div key={pt.week} className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="font-mono text-[11px] font-semibold text-foreground tabular-nums">
                      {pt.passRatePct}%
                    </span>
                    <div className="flex h-28 w-full items-end bg-border/30">
                      <div
                        className="w-full bg-[#0A84FF]"
                        style={{ height: `${pt.passRatePct}%` }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground">{pt.week}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Student Scoreboard & Attendance Matrix */}
        <section className="editorial-panel mt-6 border p-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-5">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                Student-Level Audit Matrix
              </p>
              <h2 className="mt-1 font-display text-3xl text-foreground">
                OA Scoreboard &amp; Attendance Roster
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 print:hidden">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <label htmlFor="tpo-student-search" className="sr-only">
                  Search student name, roll number, or branch
                </label>
                <input
                  id="tpo-student-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search roll no, name, branch..."
                  className="form-control py-1.5 pl-9 pr-3 text-xs"
                />
              </div>

              <div className="inline-flex flex-wrap rounded-[4px] border border-border p-0.5">
                {TIER_FILTERS.map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setTierFilter(tf)}
                    className={`rounded-[3px] px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                      tierFilter === tf
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="py-3 pr-4">Roll No</th>
                  <th className="py-3 pr-4">Student</th>
                  <th className="py-3 pr-4">Branch</th>
                  <th className="py-3 pr-4">Tier</th>
                  <th className="py-3 pr-4 text-right">Diagnostic</th>
                  <th className="py-3 pr-4 text-right">Verified Topics</th>
                  <th className="py-3 pr-4 text-right">OA Pass</th>
                  <th className="py-3 pr-4 text-right">Attendance</th>
                  <th className="py-3 pr-4">Capstone</th>
                  <th className="py-3 text-right print:hidden">Transcript</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 tabular-nums">
                {filteredStudents.map((stu) => (
                  <tr key={stu.id} className="transition-colors hover:bg-foreground/[0.03]">
                    <td className="py-3 pr-4 font-mono text-muted-foreground">{stu.rollNo}</td>
                    <td className="py-3 pr-4 font-medium text-foreground">{stu.name}</td>
                    <td className="py-3 pr-4 font-mono text-muted-foreground">{stu.branch}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`font-mono text-[11px] font-semibold ${
                          stu.tier === "Product-Tier"
                            ? "text-emerald-500"
                            : stu.tier === "Assessment-Ready"
                              ? "text-[#0A84FF]"
                              : "text-[#FA4028]"
                        }`}
                      >
                        {stu.tier}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono">{stu.diagnosticScore}%</td>
                    <td className="py-3 pr-4 text-right font-mono">{stu.verifiedTopics}</td>
                    <td className="py-3 pr-4 text-right font-mono font-semibold">{stu.oaPassRate}%</td>
                    <td className="py-3 pr-4 text-right font-mono">{stu.attendancePct}%</td>
                    <td className="py-3 pr-4 text-muted-foreground">{stu.capstoneStatus}</td>
                    <td className="py-3 text-right print:hidden">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/verify/${stu.handle}`)}
                        className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-path-accent hover:underline cursor-pointer"
                      >
                        Verify <ArrowUpRight className="size-3" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <div className="print:hidden">
        <SiteFooter mode="app" onNavigate={onNavigate} />
      </div>
    </div>
  )
}
