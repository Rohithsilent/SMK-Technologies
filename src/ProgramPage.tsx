import type { MouseEvent } from "react"
import { ArrowLeft, Calendar, Compass, Layers, Target } from "lucide-react"
import CelestialAtmosphere from "@/components/CelestialAtmosphere"
import SiteFooter from "@/components/SiteFooter"
import SiteHeader from "@/components/SiteHeader"
import RoadmapExplorer from "./RoadmapExplorer"
import { getProgramForPath, programs, type Program } from "./data/roadmaps"

export { getProgramForPath, programs }
export type { Program }

export default function ProgramPage({
  program,
  onSelectProgram,
  onNavigate,
}: {
  program: Program
  onSelectProgram?: (slug: string) => void
  onNavigate?: (href: string) => void
}) {
  const Icon = program.icon
  const currentIndex = programs.findIndex((p) => p.slug === program.slug)
  const nextProgram = programs[(currentIndex + 1) % programs.length]

  function handleSpaLink(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (
      !onNavigate ||
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return
    }
    event.preventDefault()
    onNavigate(href)
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHeader mode="program" onNavigate={onNavigate} />

      {/* ─── Streamlined Atmospheric Course Masthead ─── */}
      <section className="program-masthead relative isolate overflow-hidden bg-background pt-16">
        <CelestialAtmosphere />

        <div
          className="program-masthead-fade pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28"
          aria-hidden="true"
        />

        <div className="hero-copy relative z-10 mx-auto w-full max-w-7xl px-5 pb-10 pt-6 sm:px-8 sm:pb-12 sm:pt-8">
          <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <a
              href="/#programs"
              onClick={(e) => handleSpaLink(e, "/#programs")}
              className="inline-flex w-fit items-center gap-2 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              All programs
            </a>

            <nav
              className="track-switcher flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0"
              aria-label="Course roadmaps"
            >
              {programs.map((item, idx) => {
                const isActive = item.slug === program.slug
                return (
                  <a
                    key={item.slug}
                    href={`/programs/${item.slug}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => {
                      if (onSelectProgram) {
                        e.preventDefault()
                        onSelectProgram(item.slug)
                      }
                    }}
                    className={`track-tab ${isActive ? "is-active" : ""}`}
                  >
                    <span className="track-tab-index">{String(idx).padStart(2, "0")}</span>
                    <span>{item.shortName}</span>
                  </a>
                )
              })}
            </nav>
          </div>

          <div className="max-w-4xl">
            <p className="mb-3 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/85">
              <Icon className="size-4 text-path-accent" aria-hidden="true" />
              <span>{program.code} · INTERACTIVE ROADMAP</span>
            </p>

            <h1 className="font-display text-[clamp(2.45rem,6vw,4.5rem)] font-medium leading-[1.0] tracking-[-0.03em] text-foreground">
              {program.name}{" "}
              <em className="hero-em not-italic">Roadmap.</em>
            </h1>

            <p className="mt-4 max-w-2xl text-[15px] font-medium leading-relaxed text-foreground/90 sm:text-base">
              {program.intro}
            </p>
          </div>

          <dl className="program-specs-bar mt-7">
            <div className="program-spec-item">
              <dt>
                <Calendar className="size-3.5 text-path-accent" aria-hidden="true" />
                Duration
              </dt>
              <dd>{program.duration}</dd>
            </div>
            <div className="program-spec-item">
              <dt>
                <Layers className="size-3.5 text-path-accent" aria-hidden="true" />
                Scope
              </dt>
              <dd>{program.problemsCount}</dd>
            </div>
            <div className="program-spec-item">
              <dt>
                <Compass className="size-3.5 text-path-accent" aria-hidden="true" />
                Prerequisites
              </dt>
              <dd>{program.prerequisites}</dd>
            </div>
            <div className="program-spec-item">
              <dt>
                <Target className="size-3.5 text-path-accent" aria-hidden="true" />
                Outcome Target
              </dt>
              <dd>{program.target}</dd>
            </div>
          </dl>
        </div>
      </section>

      <RoadmapExplorer
        program={program}
        nextProgram={nextProgram}
        onSelectProgram={onSelectProgram}
        onNavigate={onNavigate}
      />

      <SiteFooter mode="program" onNavigate={onNavigate} />
    </main>
  )
}
