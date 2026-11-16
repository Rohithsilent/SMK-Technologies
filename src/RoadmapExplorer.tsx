import { useState } from "react"
import { ArrowLeft, ArrowRight, Check, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { RoadmapCheckpoint, RoadmapStage } from "./ProgramPage"

export default function RoadmapExplorer({
  stages,
  checkpoints,
  programName,
  audience,
  prerequisites,
}: {
  stages: RoadmapStage[]
  checkpoints: RoadmapCheckpoint[]
  programName: string
  audience: string
  prerequisites: string
}) {
  const [activeStage, setActiveStage] = useState(0)
  const [answer, setAnswer] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const stage = stages[activeStage]
  const checkpoint = checkpoints[activeStage] || checkpoints[0]

  function selectStage(index: number) {
    setActiveStage(index)
    setAnswer(null)
    setChecked(false)
  }

  const correct = checkpoint && answer === checkpoint.answer

  return (
    <section id="roadmap" className="border-t border-border/80 bg-secondary/35 px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="roadmap-heading mb-7">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[.22em] text-path-accent">{programName} · detailed curriculum</p>
            <h2 className="max-w-3xl font-display text-5xl leading-[.98] tracking-tight sm:text-6xl">
              Module-by-module syllabus.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted-foreground">
            Select any module below to inspect the exact topics taught, problems solved, and placement outcomes. Schedules are customized per college.
          </p>
        </div>

        <dl className="roadmap-fit">
          <div>
            <dt>Who it’s for</dt>
            <dd>{audience}</dd>
          </div>
          <div>
            <dt>Prerequisites</dt>
            <dd>{prerequisites}</dd>
          </div>
        </dl>

        <div className="roadmap-explorer">
          <aside className="roadmap-sidebar" aria-label="Roadmap stages">
            <p className="roadmap-sidebar-label">
              SYLLABUS <span>{String(stages.length).padStart(2, "0")} MODULES</span>
            </p>
            <nav className="roadmap-track" aria-label={`${programName} learning stages`}>
              {stages.map((item, index) => {
                const active = activeStage === index
                return (
                  <button
                    type="button"
                    key={item.title}
                    className={`roadmap-stop ${active ? "is-active" : ""}`}
                    aria-current={active ? "step" : undefined}
                    onClick={() => selectStage(index)}
                  >
                    <span className="roadmap-stop-marker">{active ? <span /> : String(index + 1).padStart(2, "0")}</span>
                    <span className="roadmap-stop-copy">
                      <small className="flex items-center gap-1.5">
                        MODULE {String(index + 1).padStart(2, "0")}
                        {item.duration && <span className="opacity-75">· {item.duration.split("·")[0].trim()}</span>}
                      </small>
                      <strong>{item.title}</strong>
                    </span>
                  </button>
                )
              })}
            </nav>
            <p className="roadmap-sidebar-note">Click any module to inspect topics and interview questions.</p>
          </aside>

          <article className="roadmap-station">
            <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
              Module {activeStage + 1} of {stages.length}: {stage.title}
            </p>
            
            <header className="roadmap-station-header">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="roadmap-station-counter mb-0">
                  <span>MODULE {String(activeStage + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}</span>
                </div>
                {stage.duration && (
                  <span className="inline-flex items-center rounded-full border border-path-accent/40 bg-path-accent/10 px-3 py-1 text-[11px] font-medium text-path-accent">
                    {stage.duration}
                  </span>
                )}
              </div>
              <h3 className="font-display text-3xl leading-[1.05] sm:text-4xl text-foreground">{stage.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stage.summary}</p>
            </header>

            <div className="roadmap-work">
              <div className="roadmap-work-item">
                <span className="font-medium text-path-accent">CORE TOPICS COVERED</span>
                <ul className="roadmap-work-list">
                  {stage.topics.map((topic, i) => (
                    <li key={i}>
                      <Check className="size-3.5 text-path-accent shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="roadmap-work-item">
                <span className="font-medium text-path-accent">
                  {stage.practiceLabel || "PRACTICE & INTERVIEW QUESTIONS"}
                </span>
                <ul className="roadmap-problem-list">
                  {stage.practice.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="roadmap-work-item roadmap-work-outcome">
                <span className="font-medium text-path-accent">INTERVIEW READINESS</span>
                <p className="mt-2 text-xs leading-relaxed text-foreground/90 font-medium sm:text-sm">
                  {stage.outcome}
                </p>
              </div>
            </div>

            {checkpoint && (
              <section className="checkpoint" aria-labelledby="checkpoint-title">
                <div className="checkpoint-heading">
                  <div className="checkpoint-icon"><HelpCircle aria-hidden="true" /></div>
                  <div>
                    <p className="checkpoint-eyebrow">QUICK CONCEPT CHECK</p>
                    <h4 id="checkpoint-title">Test your understanding</h4>
                  </div>
                  <span className="checkpoint-time">1 MIN</span>
                </div>
                <fieldset className="checkpoint-fieldset">
                  <legend>{checkpoint.question}</legend>
                  <div className="checkpoint-options">
                    {checkpoint.options.map((option, index) => (
                      <label className="checkpoint-option" key={option}>
                        <input
                          type="radio"
                          name={`checkpoint-${activeStage}`}
                          value={index}
                          checked={answer === index}
                          onChange={() => { setAnswer(index); setChecked(false) }}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="checkpoint-actions">
                  <Button
                    type="button"
                    variant="glass"
                    size="sm"
                    className="rounded-full"
                    disabled={answer === null}
                    onClick={() => setChecked(true)}
                  >
                    Check answer
                  </Button>
                  {checked && answer !== null && (
                    <p className={`checkpoint-feedback ${correct ? "is-correct" : "is-retry"}`} role="status">
                      {correct && <Check aria-hidden="true" />}
                      {correct ? "Correct! " : "Not quite. "}
                      {checkpoint.explanation}
                    </p>
                  )}
                </div>
              </section>
            )}

            <footer className="roadmap-controls">
              <span className="text-xs text-muted-foreground">
                Showing Module {activeStage + 1} of {stages.length}
              </span>
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  disabled={activeStage === 0}
                  onClick={() => selectStage(activeStage - 1)}
                >
                  <ArrowLeft aria-hidden="true" /> Previous Module
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  disabled={activeStage === stages.length - 1}
                  onClick={() => selectStage(activeStage + 1)}
                >
                  Next Module <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </section>
  )
}
