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
  const checkpoint = checkpoints[activeStage]

  function selectStage(index: number) {
    setActiveStage(index)
    setAnswer(null)
    setChecked(false)
  }

  const correct = answer === checkpoint.answer

  return (
    <section id="roadmap" className="border-t border-border/80 bg-secondary/35 px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="roadmap-heading mb-7">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[.22em] text-path-accent">{programName} · draft roadmap</p>
            <h2 className="max-w-3xl font-display text-5xl leading-[.98] tracking-tight sm:text-6xl">A path from basics to practice.</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted-foreground">Select a stage to see its focus, exercise, and quick check. Final topics and pace are agreed with each college.</p>
        </div>

        <dl className="roadmap-fit">
          <div><dt>Who it’s for</dt><dd>{audience}</dd></div>
          <div><dt>Prerequisites</dt><dd>{prerequisites}</dd></div>
        </dl>

        <div className="roadmap-explorer">
          <aside className="roadmap-sidebar" aria-label="Roadmap stages">
            <p className="roadmap-sidebar-label">THE ROUTE <span>{String(stages.length).padStart(2, "0")} STAGES</span></p>
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
                    <span className="roadmap-stop-copy"><small>STAGE {String(index + 1).padStart(2, "0")}</small><strong>{item.title}</strong></span>
                  </button>
                )
              })}
            </nav>
            <p className="roadmap-sidebar-note">Select a stage to explore. Progress isn’t saved.</p>
          </aside>

          <article className="roadmap-station">
            <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
              Stage {activeStage + 1} of {stages.length}: {stage.title}
            </p>
            <header className="roadmap-station-header">
              <div className="roadmap-station-counter"><span>SELECTED STAGE</span><span>{String(activeStage + 1).padStart(2, "0")} <i>/</i> {String(stages.length).padStart(2, "0")}</span></div>
              <h3 className="font-display text-4xl leading-[1.02] sm:text-5xl">{stage.title}</h3>
            </header>

            <div className="roadmap-work">
              <div className="roadmap-work-item"><span>LEARN</span><p>{stage.focus}</p></div>
              <div className="roadmap-work-item"><span>TRY</span><p>{stage.practice}</p></div>
              <div className="roadmap-work-item roadmap-work-outcome"><span>TAKE AWAY</span><p>{stage.outcome}</p></div>
            </div>

            <section className="checkpoint" aria-labelledby="checkpoint-title">
              <div className="checkpoint-heading">
                <div className="checkpoint-icon"><HelpCircle aria-hidden="true" /></div>
                <div><p className="checkpoint-eyebrow">QUICK CHECK</p><h4 id="checkpoint-title">Can you spot it?</h4></div>
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
                <Button type="button" variant="glass" size="sm" className="rounded-full" disabled={answer === null} onClick={() => setChecked(true)}>
                  Check answer
                </Button>
                {checked && answer !== null && (
                  <p className={`checkpoint-feedback ${correct ? "is-correct" : "is-retry"}`} role="status">
                    {correct && <Check aria-hidden="true" />}{correct ? "That’s it. " : "Not quite. "}{checkpoint.explanation}
                  </p>
                )}
              </div>
            </section>

            <footer className="roadmap-controls">
              <div>
                <Button type="button" variant="ghost" size="sm" className="rounded-full" disabled={activeStage === 0} onClick={() => selectStage(activeStage - 1)}><ArrowLeft aria-hidden="true" /> Previous</Button>
                <Button type="button" variant="ghost" size="sm" className="rounded-full" disabled={activeStage === stages.length - 1} onClick={() => selectStage(activeStage + 1)}>Next stage <ArrowRight aria-hidden="true" /></Button>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </section>
  )
}
