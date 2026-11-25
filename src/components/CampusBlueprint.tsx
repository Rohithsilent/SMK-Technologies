import { useState } from "react"
import { ArrowUpRight, Calendar, Check, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"

type BatchKey = "second-year" | "third-year" | "final-year"

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
  onSelectBatch: (interest: string, note: string) => void
}

export default function CampusBlueprint({ onSelectBatch }: CampusBlueprintProps) {
  const [selectedBatch, setSelectedBatch] = useState<BatchKey>("third-year")
  const active = BATCH_BLUEPRINTS[selectedBatch]

  return (
    <section
      id="campus"
      className="border-t border-border/80 bg-background px-6 py-20 sm:px-10 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
        <div>
          <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-path-accent">
            <span className="h-px w-8 bg-path-accent" aria-hidden="true" />
            For colleges &amp; placement cells
          </p>
          <h2 className="max-w-xl font-display text-5xl font-medium leading-[1.0] tracking-[-0.025em] sm:text-6xl">
            Partner with SMK to
            <br />
            <em className="not-italic text-muted-foreground">train your students.</em>
          </h2>
          <p className="mt-5 max-w-lg text-[15px] font-medium leading-7 text-muted-foreground sm:text-base">
            Whether you need an intensive placement bootcamp, a semester-long DSA track, or a hands-on AI workshop, we tailor the training to your college&apos;s timetable and student skill level.
          </p>

          <ol className="campus-brief mt-8">
            <li>
              <span>01</span>
              <div>
                <h3>Customized for your batch</h3>
                <p>
                  Tailored modules for 2nd, 3rd, or final-year B.Tech students — from complete beginners to advanced coders.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Placement-oriented curriculum</h3>
                <p>
                  Aligned with actual online assessments and technical interview patterns of top tech recruiters.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Flexible campus delivery</h3>
                <p>
                  Hands-on offline bootcamps right on your campus or interactive live online sessions with real-time doubt solving.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Interactive Batch Blueprint Selector */}
        <div className="editorial-panel border">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 px-5 py-4 sm:px-6">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                Batch Blueprint Configurator
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Preview syllabus pacing by student year
              </p>
            </div>
            <div className="inline-flex rounded-[4px] border border-border p-0.5" role="tablist" aria-label="Select college batch year">
              {(Object.keys(BATCH_BLUEPRINTS) as BatchKey[]).map((key) => {
                const isCurrent = selectedBatch === key
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    onClick={() => setSelectedBatch(key)}
                    className={`rounded-[3px] px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {BATCH_BLUEPRINTS[key].tabLabel}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-6 sm:p-8" role="tabpanel" aria-label={active.title}>
            <span className="inline-block rounded-[3px] bg-[var(--coral-bg)] px-2.5 py-1 font-mono text-[11px] font-bold tracking-[0.12em] text-[var(--coral-ink)]">
              {active.yearBadge}
            </span>
            <h3 className="mt-4 font-display text-3xl font-medium leading-tight text-foreground sm:text-4xl">
              {active.title}
            </h3>

            <dl className="mt-6 grid gap-4 border-y border-border/80 py-5 sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <Calendar className="size-3.5 text-path-accent" aria-hidden="true" />
                  Cadence
                </dt>
                <dd className="mt-1.5 text-sm font-semibold leading-relaxed text-foreground">
                  {active.schedule}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <Layers className="size-3.5 text-path-accent" aria-hidden="true" />
                  Track Mix
                </dt>
                <dd className="mt-1.5 text-sm font-semibold leading-relaxed text-foreground">
                  {active.tracks}
                </dd>
              </div>
            </dl>

            <ul className="mt-6 grid gap-3">
              {active.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm font-medium leading-relaxed text-foreground/95 sm:text-[15px]">
                  <Check className="mt-0.5 size-4 shrink-0 text-path-accent" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/80 pt-6">
              <p className="text-xs text-muted-foreground">
                Bring your batch size &amp; preferred academic window.
              </p>
              <Button
                type="button"
                variant="default"
                onClick={() =>
                  onSelectBatch(
                    "Campus training / college collaboration",
                    active.contactNote,
                  )
                }
                className="cursor-pointer px-6"
              >
                Discuss {active.tabLabel} batch <ArrowUpRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
