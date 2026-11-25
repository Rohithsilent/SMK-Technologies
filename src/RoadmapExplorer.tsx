import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Flag,
  GitBranch,
  HelpCircle,
  Search,
  Sparkles,
  Target,
  Wrench,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFocusTrap } from "@/hooks/useMotion"
import type {
  Program,
  RoadmapPracticeItem,
  RoadmapStage,
  RoadmapTopic,
  TopicTag,
} from "./data/roadmaps"

type Selection =
  | { kind: "topic"; stageIndex: number; topicIndex: number }
  | { kind: "stage"; stageIndex: number }
  | { kind: "practice"; stageIndex: number; practiceIndex: number }
  | null

function tagVariantClass(tag: TopicTag) {
  switch (tag) {
    case "Core":
      return "roadmap-tag--core"
    case "Pattern":
      return "roadmap-tag--pattern"
    case "Architecture":
      return "roadmap-tag--architecture"
    case "Tooling":
      return "roadmap-tag--tooling"
    case "Deep Dive":
      return "roadmap-tag--deep"
  }
}

function practiceVariantClass(kind: RoadmapPracticeItem["kind"]) {
  switch (kind) {
    case "Problem":
      return "roadmap-practice-badge--problem"
    case "Build":
      return "roadmap-practice-badge--build"
    case "Assessment":
      return "roadmap-practice-badge--assessment"
  }
}

export default function RoadmapExplorer({
  program,
  nextProgram,
  onSelectProgram,
  onNavigate,
}: {
  program: Program
  nextProgram?: Program
  onSelectProgram?: (slug: string) => void
  onNavigate?: (href: string) => void
}) {
  const [selection, setSelection] = useState<Selection>(null)
  const [renderedSelection, setRenderedSelection] = useState<Selection>(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [query, setQuery] = useState("")
  const [activeStageId, setActiveStageId] = useState<string>(program.stages[0]?.id ?? "")
  const [hoveredStageId, setHoveredStageId] = useState<string | null>(null)
  const [showSelfCheck, setShowSelfCheck] = useState(false)

  const drawerRef = useRef<HTMLElement>(null)
  const closeDrawerTimerRef = useRef<number | null>(null)

  const closeDrawer = useCallback(() => {
    setSelection(null)
  }, [])

  useFocusTrap(drawerVisible, drawerRef, closeDrawer)

  // Reset open drawer, filter, and scroll-spy when switching tracks
  useEffect(() => {
    setSelection(null)
    setRenderedSelection(null)
    setDrawerVisible(false)
    setQuery("")
    setShowSelfCheck(false)
    setActiveStageId(program.stages[0]?.id ?? "")
  }, [program.slug, program.stages])

  // Smooth open/close transition for the inspector drawer
  useEffect(() => {
    if (closeDrawerTimerRef.current !== null) {
      window.clearTimeout(closeDrawerTimerRef.current)
      closeDrawerTimerRef.current = null
    }

    if (selection) {
      setRenderedSelection(selection)
      setShowSelfCheck(false)
      const frameId = window.requestAnimationFrame(() => {
        setDrawerVisible(true)
      })
      return () => window.cancelAnimationFrame(frameId)
    }

    setDrawerVisible(false)
    closeDrawerTimerRef.current = window.setTimeout(() => {
      setRenderedSelection(null)
      closeDrawerTimerRef.current = null
    }, 260)

    return () => {
      if (closeDrawerTimerRef.current !== null) {
        window.clearTimeout(closeDrawerTimerRef.current)
      }
    }
  }, [selection])

  // Lock background scroll while drawer is open
  useEffect(() => {
    if (!selection) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selection])

  // Flatten all topics for linear Prev/Next traversal inside the drawer
  const flatTopics = useMemo(() => {
    const list: { stageIndex: number; topicIndex: number; topic: RoadmapTopic; stage: RoadmapStage }[] = []
    program.stages.forEach((stage, stageIndex) => {
      stage.topics.forEach((topic, topicIndex) => {
        list.push({ stageIndex, topicIndex, topic, stage })
      })
    })
    return list
  }, [program])

  const totalTopics = flatTopics.length
  const totalPractice = useMemo(
    () => program.stages.reduce((acc, s) => acc + s.practice.length, 0),
    [program],
  )

  const normalizedQuery = query.trim().toLowerCase()

  const filteredStages = useMemo(() => {
    if (!normalizedQuery) {
      return program.stages.map((stage, originalIndex) => ({
        stage,
        originalIndex,
        matchingTopicIds: new Set<string>(),
        matchingPracticeIds: new Set<string>(),
      }))
    }

    return program.stages
      .map((stage, originalIndex) => {
        const stageTextMatch =
          stage.title.toLowerCase().includes(normalizedQuery) ||
          stage.summary.toLowerCase().includes(normalizedQuery) ||
          stage.outcome.toLowerCase().includes(normalizedQuery)

        const matchingTopicIds = new Set(
          stage.topics
            .filter(
              (t) =>
                t.title.toLowerCase().includes(normalizedQuery) ||
                t.brief.toLowerCase().includes(normalizedQuery) ||
                t.tag.toLowerCase().includes(normalizedQuery) ||
                t.keyPoints.some((kp) => kp.toLowerCase().includes(normalizedQuery)),
            )
            .map((t) => t.id),
        )

        const matchingPracticeIds = new Set(
          stage.practice
            .filter(
              (p) =>
                p.title.toLowerCase().includes(normalizedQuery) ||
                p.detail.toLowerCase().includes(normalizedQuery) ||
                p.kind.toLowerCase().includes(normalizedQuery),
            )
            .map((p) => p.id),
        )

        if (stageTextMatch || matchingTopicIds.size > 0 || matchingPracticeIds.size > 0) {
          return {
            stage,
            originalIndex,
            matchingTopicIds,
            matchingPracticeIds,
          }
        }
        return null
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
  }, [program.stages, normalizedQuery])

  const totalMatches = useMemo(() => {
    if (!normalizedQuery) return 0
    return filteredStages.reduce(
      (acc, entry) => acc + entry.matchingTopicIds.size + entry.matchingPracticeIds.size,
      0,
    )
  }, [filteredStages, normalizedQuery])

  // Track currently visible stage for toolbar scroll-spy pills
  useEffect(() => {
    const ids = filteredStages.map((entry) => entry.stage.id)
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActiveStageId(visible[0].target.id)
        }
      },
      {
        rootMargin: "-28% 0px -50% 0px",
        threshold: [0.15, 0.45],
      },
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [filteredStages])

  function jumpToStage(stageId: string) {
    setActiveStageId(stageId)
    const el = document.getElementById(stageId)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  // Active drawer content lookup from `renderedSelection` so exit animation retains content
  const activeStage = renderedSelection ? program.stages[renderedSelection.stageIndex] : null
  const activeTopic =
    renderedSelection?.kind === "topic"
      ? activeStage?.topics[renderedSelection.topicIndex] ?? null
      : null
  const activePractice =
    renderedSelection?.kind === "practice"
      ? activeStage?.practice[renderedSelection.practiceIndex] ?? null
      : null

  const activeFlatIndex =
    renderedSelection?.kind === "topic"
      ? flatTopics.findIndex(
          (item) =>
            item.stageIndex === renderedSelection.stageIndex &&
            item.topicIndex === renderedSelection.topicIndex,
        )
      : -1

  // Keyboard ArrowLeft / ArrowRight stepping inside an open topic drawer
  useEffect(() => {
    if (selection?.kind !== "topic" || activeFlatIndex < 0) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return
      }
      if (event.key === "ArrowLeft" && activeFlatIndex > 0) {
        const prev = flatTopics[activeFlatIndex - 1]
        if (prev) {
          setSelection({ kind: "topic", stageIndex: prev.stageIndex, topicIndex: prev.topicIndex })
        }
      } else if (event.key === "ArrowRight" && activeFlatIndex < totalTopics - 1) {
        const next = flatTopics[activeFlatIndex + 1]
        if (next) {
          setSelection({ kind: "topic", stageIndex: next.stageIndex, topicIndex: next.topicIndex })
        }
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [selection, activeFlatIndex, flatTopics, totalTopics])

  return (
    <section id="roadmap" className="roadmap-section relative border-t border-border/80">
      {/* ─── Roadmap Utility Toolbar (Legend, Search, Phase Jump) ─── */}
      <div className="roadmap-toolbar">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs" aria-label="Roadmap legend">
            <span className="inline-flex items-center gap-2 font-medium text-foreground">
              <span className="roadmap-legend-dot roadmap-legend-dot--milestone" aria-hidden="true" />
              Milestone ({program.stages.length})
            </span>
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <span className="roadmap-legend-dot roadmap-legend-dot--topic" aria-hidden="true" />
              Topic Node ({totalTopics})
            </span>
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <span className="roadmap-legend-dot roadmap-legend-dot--practice" aria-hidden="true" />
              Practice / Build ({totalPractice})
            </span>
            <span className="hidden items-center gap-1.5 text-[11px] text-muted-foreground/85 xl:inline-flex">
              <Sparkles className="size-3.5 text-path-accent" aria-hidden="true" />
              Click any node to inspect notes
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
            <div className="flex items-center gap-2">
              <div className="roadmap-search-wrap relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <label htmlFor="roadmap-topic-search" className="sr-only">
                  Filter roadmap topics
                </label>
                <input
                  id="roadmap-topic-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Filter ${program.shortName} topics...`}
                  className="roadmap-search-input"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear topic filter"
                    className="absolute right-2.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-[4px] text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
              {normalizedQuery.length > 0 && (
                <span className="shrink-0 rounded-[4px] border border-border bg-background/70 px-2 py-1 font-mono text-[11px] font-medium text-path-accent tabular-nums">
                  {totalMatches > 0 ? `${totalMatches} matches` : `${filteredStages.length} stages`}
                </span>
              )}
            </div>

            <nav className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0" aria-label="Jump to stage">
              <span className="mr-1 shrink-0 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Stage
              </span>
              {program.stages.map((stage, idx) => {
                const isStageInView = activeStageId === stage.id
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => jumpToStage(stage.id)}
                    aria-current={isStageInView ? "true" : undefined}
                    title={`Jump to Stage ${String(idx + 1).padStart(2, "0")}: ${stage.title}`}
                    className={`roadmap-jump-pill cursor-pointer ${isStageInView ? "is-active" : ""}`}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* ─── Architectural Blueprint Matrix Canvas ─── */}
      <div className="roadmap-canvas relative px-4 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 hidden lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(16.5rem,0.9fr)_minmax(0,1.05fr)] lg:items-center lg:px-2">
            <div className="flex items-center justify-end gap-2 pr-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <BookOpen className="size-3.5 text-path-accent" aria-hidden="true" />
              <span>Concepts &amp; Topics to Learn</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-path-accent">
              <GitBranch className="size-3.5" aria-hidden="true" />
              <span>Progression Spine</span>
            </div>
            <div className="flex items-center gap-2 pl-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Wrench className="size-3.5 text-path-accent" aria-hidden="true" />
              <span>Practice, Builds &amp; Outcome</span>
            </div>
          </div>

          <div className="roadmap-entry-wrap">
            <div className="roadmap-entry-node">
              <span className="roadmap-entry-badge">
                <Compass className="size-3.5" aria-hidden="true" />
                START · ENTRY POINT
              </span>
              <p className="roadmap-entry-text">
                <strong>Prerequisites:</strong> {program.prerequisites}
              </p>
            </div>
          </div>

          {filteredStages.length === 0 ? (
            <div className="roadmap-empty-state mx-auto my-12 max-w-lg p-8 text-center">
              <p className="font-display text-2xl text-foreground">No matching roadmap nodes</p>
              <p className="mt-2 text-sm text-muted-foreground">
                No topics or projects matched &ldquo;{query}&rdquo; in {program.shortName}.
              </p>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => setQuery("")}
                className="mt-5 cursor-pointer"
              >
                Show Full {program.shortName} Roadmap
              </Button>
            </div>
          ) : (
            <div className="roadmap-flow" role="list" aria-label={`${program.name} learning roadmap`}>
              {filteredStages.map(({ stage, originalIndex, matchingTopicIds, matchingPracticeIds }) => {
                const stageNumber = String(originalIndex + 1).padStart(2, "0")
                const isStageSelected =
                  selection?.kind === "stage" && selection.stageIndex === originalIndex
                const isStageIlluminated =
                  hoveredStageId === stage.id || selection?.stageIndex === originalIndex

                return (
                  <article
                    key={stage.id}
                    id={stage.id}
                    role="listitem"
                    onMouseEnter={() => setHoveredStageId(stage.id)}
                    onMouseLeave={() => setHoveredStageId((prev) => (prev === stage.id ? null : prev))}
                    className={`roadmap-stage-row scroll-mt-36 ${isStageIlluminated ? "is-stage-active" : ""}`}
                  >
                    <div className="roadmap-rail-marker lg:hidden" aria-hidden="true">
                      <span>{stageNumber}</span>
                    </div>

                    {/* LEFT BRANCH: Core Concept Nodes */}
                    <div className="roadmap-branch-left order-2 lg:order-1">
                      <div className="roadmap-branch-label lg:hidden">
                        <BookOpen className="size-3.5 text-path-accent" aria-hidden="true" />
                        <span>Core Concepts ({stage.topics.length})</span>
                      </div>

                      <div className="roadmap-topic-stack">
                        {stage.topics.map((topic, topicIndex) => {
                          const isSelected =
                            selection?.kind === "topic" &&
                            selection.stageIndex === originalIndex &&
                            selection.topicIndex === topicIndex
                          const isSearchHit = normalizedQuery.length > 0 && matchingTopicIds.has(topic.id)
                          const isDimmed =
                            normalizedQuery.length > 0 &&
                            matchingTopicIds.size > 0 &&
                            !matchingTopicIds.has(topic.id)

                          return (
                            <button
                              key={topic.id}
                              type="button"
                              onClick={() =>
                                setSelection({
                                  kind: "topic",
                                  stageIndex: originalIndex,
                                  topicIndex,
                                })
                              }
                              aria-expanded={isSelected}
                              className={`roadmap-topic-node cursor-pointer ${isSelected ? "is-selected" : ""} ${
                                isSearchHit ? "is-match" : ""
                              } ${isDimmed ? "is-dimmed" : ""}`}
                            >
                              <div className="roadmap-topic-node-head">
                                <span className="roadmap-topic-index">
                                  {stageNumber}.{topicIndex + 1}
                                </span>
                                <span className={`roadmap-tag ${tagVariantClass(topic.tag)}`}>
                                  {topic.tag}
                                </span>
                                <ChevronRight className="roadmap-node-chevron size-3.5" aria-hidden="true" />
                              </div>
                              <h4 className="roadmap-topic-title">{topic.title}</h4>
                              <p className="roadmap-topic-brief">{topic.brief}</p>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* CENTER SPINE: Milestone Node */}
                    <div className="roadmap-spine-center order-1 lg:order-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSelection({ kind: "stage", stageIndex: originalIndex })
                        }
                        aria-expanded={isStageSelected}
                        className={`roadmap-milestone-node cursor-pointer ${
                          isStageSelected ? "is-selected" : ""
                        }`}
                      >
                        <div className="roadmap-milestone-top">
                          <span className="roadmap-milestone-code">STAGE {stageNumber}</span>
                          <span className="roadmap-milestone-duration">
                            <Clock className="size-3" aria-hidden="true" />
                            {stage.duration}
                          </span>
                        </div>

                        <h3 className="roadmap-milestone-title">{stage.title}</h3>
                        <p className="roadmap-milestone-summary">{stage.summary}</p>

                        <div className="roadmap-milestone-foot">
                          <span>
                            {stage.topics.length} topics · {stage.practice.length} builds
                          </span>
                          <span className="roadmap-milestone-inspect">
                            Overview <ArrowRight className="size-3" aria-hidden="true" />
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* RIGHT BRANCH: Practice, Builds & Stage Outcome */}
                    <div className="roadmap-branch-right order-3">
                      <div className="roadmap-branch-label">
                        <Wrench className="size-3.5 text-path-accent" aria-hidden="true" />
                        <span>{stage.practiceLabel}</span>
                      </div>

                      <div className="roadmap-practice-stack">
                        {stage.practice.map((item, practiceIndex) => {
                          const isSelected =
                            selection?.kind === "practice" &&
                            selection.stageIndex === originalIndex &&
                            selection.practiceIndex === practiceIndex
                          const isSearchHit =
                            normalizedQuery.length > 0 && matchingPracticeIds.has(item.id)

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() =>
                                setSelection({
                                  kind: "practice",
                                  stageIndex: originalIndex,
                                  practiceIndex,
                                })
                              }
                              aria-expanded={isSelected}
                              className={`roadmap-practice-node cursor-pointer ${
                                isSelected ? "is-selected" : ""
                              } ${isSearchHit ? "is-match" : ""}`}
                            >
                              <div className="roadmap-practice-head">
                                <span className={`roadmap-practice-badge ${practiceVariantClass(item.kind)}`}>
                                  {item.kind}
                                </span>
                                <ArrowUpRight className="roadmap-node-chevron size-3.5" aria-hidden="true" />
                              </div>
                              <strong className="roadmap-practice-title">{item.title}</strong>
                              <span className="roadmap-practice-detail">{item.detail}</span>
                            </button>
                          )
                        })}
                      </div>

                      <div className="roadmap-outcome-node">
                        <span className="roadmap-outcome-label">
                          <CheckCircle2 className="size-3.5" aria-hidden="true" />
                          Stage Outcome
                        </span>
                        <p>{stage.outcome}</p>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {/* Terminal Destination Node */}
          <div className="roadmap-destination-wrap">
            <div className="roadmap-destination-node">
              <span className="roadmap-destination-badge">
                <Flag className="size-3.5" aria-hidden="true" />
                DESTINATION · ROADMAP COMPLETE
              </span>
              <h3 className="roadmap-destination-title">{program.destinationTitle}</h3>
              <p className="roadmap-destination-summary">{program.destinationSummary}</p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                {nextProgram && onSelectProgram && (
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => onSelectProgram(nextProgram.slug)}
                    className="cursor-pointer px-5 py-2.5 text-xs sm:text-sm"
                  >
                    Next Track: {nextProgram.shortName} <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                )}
                <Button asChild variant="glass" className="px-5 py-2.5 text-xs sm:text-sm">
                  <a
                    href="/#contact"
                    onClick={(e) => {
                      if (onNavigate) {
                        e.preventDefault()
                        onNavigate("/#contact")
                      }
                    }}
                  >
                    Bring to Your Campus <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Animated Focus-Trapped Inspector Drawer ─── */}
      {renderedSelection && activeStage && (
        <div
          className={`roadmap-drawer-backdrop ${drawerVisible ? "is-open" : ""}`}
          onClick={closeDrawer}
          role="presentation"
        >
          <aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="roadmap-drawer-title"
            tabIndex={-1}
            className={`roadmap-drawer ${drawerVisible ? "is-open" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="roadmap-drawer-topbar">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
                <span>{program.shortName}</span>
                <span>/</span>
                <span>Stage {String(renderedSelection.stageIndex + 1).padStart(2, "0")}</span>
                {renderedSelection.kind === "topic" && (
                  <>
                    <span>/</span>
                    <span>Topic {String(renderedSelection.topicIndex + 1).padStart(2, "0")}</span>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close topic explanation"
                className="roadmap-drawer-close cursor-pointer"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="roadmap-drawer-body">
              {renderedSelection.kind === "topic" && activeTopic && (
                <>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={`roadmap-tag ${tagVariantClass(activeTopic.tag)}`}>
                      {activeTopic.tag}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3.5 text-path-accent" aria-hidden="true" />
                      {activeStage.duration}
                    </span>
                  </div>

                  <h3 id="roadmap-drawer-title" className="roadmap-drawer-title">
                    {activeTopic.title}
                  </h3>
                  <p className="roadmap-drawer-lead">{activeTopic.brief}</p>

                  <div className="roadmap-drawer-block">
                    <h4 className="roadmap-drawer-heading">
                      <BookOpen className="size-3.5 text-path-accent" aria-hidden="true" />
                      How it works &amp; why it matters
                    </h4>
                    <p className="text-sm leading-7 text-foreground/90">{activeTopic.explanation}</p>
                  </div>

                  <div className="roadmap-drawer-block">
                    <h4 className="roadmap-drawer-heading">
                      <Target className="size-3.5 text-path-accent" aria-hidden="true" />
                      Key concepts to master
                    </h4>
                    <ul className="roadmap-drawer-list">
                      {activeTopic.keyPoints.map((point) => (
                        <li key={point}>
                          <Check className="mt-0.5 size-4 shrink-0 text-path-accent" aria-hidden="true" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="roadmap-drawer-tip">
                    <span className="roadmap-drawer-tip-label">
                      <Sparkles className="size-3.5" aria-hidden="true" />
                      Mentor &amp; Interview Insight
                    </span>
                    <p>{activeTopic.practicalTip}</p>
                  </div>

                  {/* Exploratory Self-Check (No saved progress) */}
                  <div className="roadmap-drawer-block">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="roadmap-drawer-heading">
                        <HelpCircle className="size-3.5 text-path-accent" aria-hidden="true" />
                        Exploratory Self-Check
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowSelfCheck((v) => !v)}
                        aria-expanded={showSelfCheck}
                        className="rounded-[4px] border border-border px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-[#FA4028] hover:text-path-accent cursor-pointer"
                      >
                        {showSelfCheck ? "Hide answer" : "Test your understanding"}
                      </button>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Before moving on, can you explain <strong className="text-foreground">{activeTopic.title}</strong> and verify: <em>{activeTopic.keyPoints[0]}</em>?
                    </p>
                    {showSelfCheck && (
                      <div className="mt-1 rounded-[4px] border border-border bg-background/60 p-3.5 text-xs leading-6 text-foreground/90">
                        <strong className="font-mono text-[11px] uppercase tracking-[0.12em] text-path-accent">
                          Key Check:
                        </strong>{" "}
                        {activeTopic.practicalTip}
                      </div>
                    )}
                  </div>

                  <div className="roadmap-drawer-block">
                    <h4 className="roadmap-drawer-heading">
                      <Wrench className="size-3.5 text-path-accent" aria-hidden="true" />
                      Applied in Stage {String(renderedSelection.stageIndex + 1).padStart(2, "0")}
                    </h4>
                    <div className="grid gap-2.5">
                      {activeStage.practice.map((p, idx) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() =>
                            setSelection({
                              kind: "practice",
                              stageIndex: renderedSelection.stageIndex,
                              practiceIndex: idx,
                            })
                          }
                          className="roadmap-drawer-sublink cursor-pointer"
                        >
                          <div className="min-w-0">
                            <span className={`roadmap-practice-badge ${practiceVariantClass(p.kind)}`}>
                              {p.kind}
                            </span>
                            <p className="mt-1.5 text-sm font-medium text-foreground">{p.title}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{p.detail}</p>
                          </div>
                          <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {renderedSelection.kind === "stage" && (
                <>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="roadmap-milestone-code">
                      STAGE {String(renderedSelection.stageIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3.5 text-path-accent" aria-hidden="true" />
                      {activeStage.duration}
                    </span>
                  </div>

                  <h3 id="roadmap-drawer-title" className="roadmap-drawer-title">
                    {activeStage.title}
                  </h3>
                  <p className="roadmap-drawer-lead">{activeStage.summary}</p>

                  <div className="roadmap-drawer-block">
                    <h4 className="roadmap-drawer-heading">
                      <BookOpen className="size-3.5 text-path-accent" aria-hidden="true" />
                      Topics in this stage ({activeStage.topics.length})
                    </h4>
                    <div className="grid gap-2.5">
                      {activeStage.topics.map((topic, tIdx) => (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() =>
                            setSelection({
                              kind: "topic",
                              stageIndex: renderedSelection.stageIndex,
                              topicIndex: tIdx,
                            })
                          }
                          className="roadmap-drawer-sublink cursor-pointer"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="roadmap-topic-index">
                                {String(renderedSelection.stageIndex + 1).padStart(2, "0")}.{tIdx + 1}
                              </span>
                              <span className={`roadmap-tag ${tagVariantClass(topic.tag)}`}>
                                {topic.tag}
                              </span>
                            </div>
                            <p className="mt-1.5 text-sm font-medium text-foreground">{topic.title}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{topic.brief}</p>
                          </div>
                          <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="roadmap-drawer-block">
                    <h4 className="roadmap-drawer-heading">
                      <Wrench className="size-3.5 text-path-accent" aria-hidden="true" />
                      {activeStage.practiceLabel}
                    </h4>
                    <div className="grid gap-2.5">
                      {activeStage.practice.map((p, pIdx) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() =>
                            setSelection({
                              kind: "practice",
                              stageIndex: renderedSelection.stageIndex,
                              practiceIndex: pIdx,
                            })
                          }
                          className="roadmap-drawer-sublink cursor-pointer"
                        >
                          <div className="min-w-0">
                            <span className={`roadmap-practice-badge ${practiceVariantClass(p.kind)}`}>
                              {p.kind}
                            </span>
                            <p className="mt-1.5 text-sm font-medium text-foreground">{p.title}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{p.detail}</p>
                          </div>
                          <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="roadmap-drawer-tip">
                    <span className="roadmap-drawer-tip-label">
                      <CheckCircle2 className="size-3.5" aria-hidden="true" />
                      Stage Exit Outcome
                    </span>
                    <p>{activeStage.outcome}</p>
                  </div>
                </>
              )}

              {renderedSelection.kind === "practice" && activePractice && (
                <>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={`roadmap-practice-badge ${practiceVariantClass(activePractice.kind)}`}>
                      {activePractice.kind}
                    </span>
                    <span className="text-xs text-muted-foreground">{activeStage.title}</span>
                  </div>

                  <h3 id="roadmap-drawer-title" className="roadmap-drawer-title">
                    {activePractice.title}
                  </h3>
                  <p className="roadmap-drawer-lead">{activePractice.detail}</p>

                  <div className="roadmap-drawer-tip">
                    <span className="roadmap-drawer-tip-label">
                      <Target className="size-3.5" aria-hidden="true" />
                      Core Engineering Focus
                    </span>
                    <p>{activePractice.focus}</p>
                  </div>

                  <div className="roadmap-drawer-block">
                    <h4 className="roadmap-drawer-heading">
                      <BookOpen className="size-3.5 text-path-accent" aria-hidden="true" />
                      Prerequisite Concepts in Stage {String(renderedSelection.stageIndex + 1).padStart(2, "0")}
                    </h4>
                    <div className="grid gap-2.5">
                      {activeStage.topics.map((topic, tIdx) => (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() =>
                            setSelection({
                              kind: "topic",
                              stageIndex: renderedSelection.stageIndex,
                              topicIndex: tIdx,
                            })
                          }
                          className="roadmap-drawer-sublink cursor-pointer"
                        >
                          <div className="min-w-0">
                            <span className={`roadmap-tag ${tagVariantClass(topic.tag)}`}>{topic.tag}</span>
                            <p className="mt-1.5 text-sm font-medium text-foreground">{topic.title}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{topic.brief}</p>
                          </div>
                          <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="roadmap-drawer-footer">
              {renderedSelection.kind === "topic" && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={activeFlatIndex <= 0}
                    onClick={() => {
                      const prev = flatTopics[activeFlatIndex - 1]
                      if (prev) setSelection({ kind: "topic", stageIndex: prev.stageIndex, topicIndex: prev.topicIndex })
                    }}
                    className="cursor-pointer"
                  >
                    <ArrowLeft className="size-3.5" aria-hidden="true" /> Previous Topic
                  </Button>
                  <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
                    {activeFlatIndex + 1} / {totalTopics}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={activeFlatIndex >= totalTopics - 1}
                    onClick={() => {
                      const next = flatTopics[activeFlatIndex + 1]
                      if (next) setSelection({ kind: "topic", stageIndex: next.stageIndex, topicIndex: next.topicIndex })
                    }}
                    className="cursor-pointer"
                  >
                    Next Topic <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Button>
                </>
              )}

              {renderedSelection.kind === "stage" && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={renderedSelection.stageIndex <= 0}
                    onClick={() => setSelection({ kind: "stage", stageIndex: renderedSelection.stageIndex - 1 })}
                    className="cursor-pointer"
                  >
                    <ArrowLeft className="size-3.5" aria-hidden="true" /> Previous Stage
                  </Button>
                  <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
                    Stage {renderedSelection.stageIndex + 1} / {program.stages.length}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={renderedSelection.stageIndex >= program.stages.length - 1}
                    onClick={() => setSelection({ kind: "stage", stageIndex: renderedSelection.stageIndex + 1 })}
                    className="cursor-pointer"
                  >
                    Next Stage <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Button>
                </>
              )}

              {renderedSelection.kind === "practice" && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelection({ kind: "stage", stageIndex: renderedSelection.stageIndex })}
                    className="cursor-pointer"
                  >
                    <ArrowLeft className="size-3.5" aria-hidden="true" /> Stage Overview
                  </Button>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Stage {renderedSelection.stageIndex + 1} Practice
                  </span>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </section>
  )
}
