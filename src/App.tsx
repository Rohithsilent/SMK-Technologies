import { useEffect, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from "react"
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import ApproachShowcase from "@/components/ApproachShowcase"
import CampusBlueprint from "@/components/CampusBlueprint"
import CelestialAtmosphere from "@/components/CelestialAtmosphere"
import SiteFooter from "@/components/SiteFooter"
import SiteHeader from "@/components/SiteHeader"
import { useMagneticHover } from "@/hooks/useMotion"
import ProgramPage, { getProgramForPath } from "./ProgramPage"

function MagneticPlatformCard({
  href,
  onNavigate,
  meta,
  title,
  description,
  children,
}: {
  href: string
  onNavigate: (href: string) => void
  meta: string
  title: ReactNode
  description: string
  children: ReactNode
}) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  useMagneticHover(cardRef, 4)

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
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
    <a
      ref={cardRef}
      href={href}
      onClick={handleClick}
      className="platform-card magnetic-card group"
    >
      <div className="platform-card-header flex-col gap-2">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-path-accent">
          {meta}
        </span>
        <h3>{title}</h3>
      </div>

      <div className="platform-card-illustration">{children}</div>

      <div className="platform-card-footer">
        <p>{description}</p>
        <span className="card-arrow" aria-hidden="true">
          <ArrowRight className="size-4" />
        </span>
      </div>
    </a>
  )
}

function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const programPage = getProgramForPath(pathname)

  const requestedInterest = new URLSearchParams(window.location.search).get("interest")
  const initialInterest =
    requestedInterest === "feedback"
      ? "Feedback or course suggestion"
      : requestedInterest === "campus"
        ? "Campus training / college collaboration"
        : ""

  const [interest, setInterest] = useState(initialInterest)
  const [note, setNote] = useState("")
  const [formMessage, setFormMessage] = useState("")
  const [lastEnquiryText, setLastEnquiryText] = useState("")
  const [copied, setCopied] = useState(false)
  const [formError, setFormError] = useState("")
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  function scrollToSection(sectionId: string) {
    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  function navigate(target: string) {
    const url = new URL(target, window.location.origin)
    const nextPath = url.pathname
    const hashId = decodeURIComponent(url.hash.replace(/^#/, ""))

    if (nextPath !== window.location.pathname) {
      window.history.pushState({}, "", `${nextPath}${url.search}${url.hash}`)
      setPathname(nextPath)
      if (hashId) {
        setTimeout(() => scrollToSection(hashId), 40)
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      return
    }

    if (hashId) {
      window.history.replaceState({}, "", `${nextPath}${url.search}${url.hash}`)
      scrollToSection(hashId)
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  function navigateToProgram(slug: string) {
    navigate(`/programs/${slug}`)
  }

  useEffect(() => {
    document.title = programPage
      ? `${programPage.shortName} Roadmap | SMK TechVora`
      : "SMK TechVora | Campus Coding & Placement Training"
  }, [programPage])

  useEffect(() => {
    const sectionId = decodeURIComponent(window.location.hash.slice(1))
    if (!sectionId) return
    scrollToSection(sectionId)
  }, [])

  function handleSelectBatch(batchInterest: string, batchNote: string) {
    setInterest(batchInterest)
    setNote(batchNote)
    setFormError("")
    scrollToSection("contact")
    window.setTimeout(() => {
      nameInputRef.current?.focus({ preventScroll: true })
    }, 450)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const senderName = String(formData.get("name") || "").trim()
    const senderEmail = String(formData.get("email") || "").trim()
    const chosenInterest = String(formData.get("interest") || "").trim()
    const messageNote = String(formData.get("note") || "").trim()

    if (!senderName || !senderEmail || !chosenInterest) {
      setFormError("Please complete your name, email address, and topic before sending.")
      return
    }

    setFormError("")
    const subject = `SMK TechVora enquiry — ${chosenInterest}`
    const body = [
      `Name: ${senderName}`,
      `Reply email: ${senderEmail}`,
      `Topic: ${chosenInterest}`,
      `Message: ${messageNote || "(no additional note)"}`,
    ].join("\n")

    setLastEnquiryText(`Subject: ${subject}\n\n${body}`)
    setCopied(false)
    setFormMessage("Opening your email app with your enquiry ready to send.")
    window.location.href = `mailto:localboy0909@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  async function handleCopyEnquiry() {
    if (!lastEnquiryText || !navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(lastEnquiryText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2400)
    } catch {
      setCopied(false)
    }
  }

  if (programPage) {
    return (
      <ProgramPage
        program={programPage}
        onSelectProgram={navigateToProgram}
        onNavigate={navigate}
      />
    )
  }

  return (
    <main className="overflow-x-clip bg-background text-foreground">
      <SiteHeader mode="home" onNavigate={navigate} />

      {/* ─── Hero Cinema ─── */}
      <section id="home" className="relative isolate flex min-h-svh flex-col bg-background pt-16">
        <CelestialAtmosphere />

        <div className="hero-copy relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 pb-20 pt-10 text-center sm:px-8 sm:pb-24">
          <p className="animate-fade-rise mb-6 font-body text-[11px] font-medium uppercase tracking-[0.24em] text-foreground/80 sm:text-xs">
            Campus Recruitment &amp; Tech Training · Built for B.Tech Colleges
          </p>
          <h1
            className="animate-fade-rise max-w-7xl text-[clamp(2.65rem,8.5vw,6.25rem)] font-normal leading-[0.94] tracking-[-0.04em] text-foreground"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Master <em className="hero-em not-italic">Coding.</em>
            <br className="hidden sm:block" /> Crack <em className="hero-em not-italic">Placements.</em>
          </h1>
          <p className="animate-fade-rise-delay mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Hands-on training in Data Structures, Full-Stack Web Development, and AI. Built to help engineering students master problem-solving and get placed in top companies.
          </p>
          <div className="animate-fade-rise-delay-2 mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="default" className="px-7 py-3 text-sm">
              <a
                href="#programs"
                onClick={(e) => {
                  e.preventDefault()
                  navigate("#programs")
                }}
              >
                Explore Programs <ArrowDown className="size-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="glass" className="px-7 py-3 text-sm">
              <a
                href="#campus"
                onClick={(e) => {
                  e.preventDefault()
                  navigate("#campus")
                }}
              >
                Campus Collaboration <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>

        {/* Subtle Bottom Scroll Anchor */}
        <div className="relative z-10 flex justify-center pb-7">
          <a
            href="#programs"
            onClick={(e) => {
              e.preventDefault()
              navigate("#programs")
            }}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/65 transition-colors hover:text-foreground"
          >
            <span>Scroll to explore</span>
            <ArrowDown className="size-3.5 animate-bounce" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* ─── Curriculum Tracks ─── */}
      <section id="programs" className="border-t border-border/80 bg-background px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-path-accent">
                Explore the platform
              </p>
              <h2 className="font-display text-5xl leading-[0.98] tracking-tight sm:text-6xl">
                Structured training.
                <br />
                Built for <em className="hero-em not-italic">campus hiring.</em>
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-foreground/85 lg:justify-self-end lg:text-right">
              Four focused curriculum tracks — from first-line-of-code to clearing Day-1 company placements. Each track opens an interactive roadmap.
            </p>
          </div>

          <div className="platform-cards">
            {/* Track 01: Python Programming */}
            <MagneticPlatformCard
              href="/programs/python"
              onNavigate={navigate}
              meta="00 · 6 Weeks · 120+ Drills"
              title={
                <>
                  Python
                  <br />
                  Programming
                </>
              }
              description="Master syntax, OOP, automation scripts, and problem-solving fundamentals from scratch."
            >
              <svg viewBox="0 0 280 195" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden="true">
                {/* Crisp IDE Window */}
                <rect x="24" y="16" width="232" height="128" rx="0" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.5" />
                <rect x="24" y="16" width="232" height="24" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1.5" />
                <circle cx="38" cy="28" r="2.8" fill="#FFFFFF" />
                <circle cx="48" cy="28" r="2.8" fill="#FFFFFF" fillOpacity="0.65" />
                <circle cx="58" cy="28" r="2.8" fill="#FFFFFF" fillOpacity="0.35" />
                <text x="71" y="31" fill="#FFFFFF" fontSize="8.8" fontFamily="monospace" fontWeight="600">solution.py</text>
                <rect x="190" y="21.5" width="56" height="13" fill="#FFFFFF" stroke="var(--svg-ink)" strokeWidth="1" />
                <text x="218" y="30.5" textAnchor="middle" fill="#00063D" fontSize="7.2" fontFamily="monospace" fontWeight="700">PY 3.12</text>

                {/* Active Code Line Execution Highlight Bar */}
                <g className="anim-py-line-bar">
                  <rect x="26" y="45" width="228" height="15" fill="var(--svg-blue-soft)" />
                  <rect x="26" y="45" width="3" height="15" fill="var(--svg-coral)" />
                </g>

                {/* Code Lines */}
                <text x="36" y="55.5" fill="var(--svg-coral)" fontSize="9.2" fontFamily="monospace" fontWeight="700">def</text>
                <text x="58" y="55.5" fill="var(--svg-text)" fontSize="9.2" fontFamily="monospace" fontWeight="600">sort_nums(arr):</text>
                <text x="46" y="70.5" fill="var(--svg-muted)" fontSize="8.3" fontFamily="monospace"># O(n log n) clean pass</text>
                <text x="46" y="85.5" fill="var(--svg-blue)" fontSize="9.2" fontFamily="monospace" fontWeight="700">return</text>
                <text x="86" y="85.5" fill="var(--svg-text)" fontSize="9.2" fontFamily="monospace" fontWeight="600">sorted(arr)</text>

                {/* Execution Console Strip */}
                <rect x="34" y="96" width="212" height="40" fill="var(--svg-panel-inner)" stroke="var(--svg-ink)" strokeWidth="1.2" />
                {/* Smooth Execution Progress Sweep Along Console Top */}
                <rect x="34" y="96" width="212" height="2" fill="var(--svg-coral)" className="anim-py-progress" />

                <text x="42" y="111" fill="var(--svg-coral)" fontSize="8.8" fontFamily="monospace" fontWeight="700">&gt;&gt;&gt;</text>
                <text x="64" y="111" fill="var(--svg-muted)" fillOpacity="0.35" fontSize="8.4" fontFamily="monospace" fontWeight="600">sort_nums([4, 1, 3])</text>
                <g className="anim-py-cmd">
                  <text x="64" y="111" fill="var(--svg-text)" fontSize="8.4" fontFamily="monospace" fontWeight="600">sort_nums([4, 1, 3])</text>
                </g>
                <line x1="175" y1="102" x2="175" y2="113" stroke="var(--svg-coral)" strokeWidth="1.8" className="anim-blink" />

                {/* Resting Output Slots + Animated Result Reveal */}
                <rect x="42" y="118" width="66" height="14" fill="var(--svg-panel)" stroke="var(--svg-stroke)" strokeWidth="1" />
                <text x="75" y="128" textAnchor="middle" fill="var(--svg-muted)" fillOpacity="0.45" fontSize="7.6" fontFamily="monospace" fontWeight="600">[ ... ]</text>
                <g className="anim-py-output">
                  <rect x="42" y="118" width="66" height="14" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1" />
                  <text x="75" y="128" textAnchor="middle" fill="#FFFFFF" fontSize="8.2" fontFamily="monospace" fontWeight="700">[1, 3, 4]</text>
                </g>

                <rect x="174" y="118" width="64" height="14" fill="var(--svg-panel)" stroke="var(--svg-stroke)" strokeWidth="1" />
                <text x="206" y="128" textAnchor="middle" fill="var(--svg-muted)" fillOpacity="0.5" fontSize="7.4" fontFamily="monospace" fontWeight="600">RUNNING</text>
                <g className="anim-py-pass">
                  <rect x="174" y="118" width="64" height="14" fill="var(--svg-panel)" stroke="var(--svg-green)" strokeWidth="1.1" />
                  <text x="206" y="128" textAnchor="middle" fill="var(--svg-green)" fontSize="7.8" fontFamily="monospace" fontWeight="700">✔ PASS</text>
                </g>

                {/* Bottom Runtime Telemetry Strip */}
                <g>
                  <rect x="24" y="152" width="232" height="26" rx="0" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.4" />
                  <text x="34" y="168.5" fill="var(--svg-text)" fontSize="7.8" fontFamily="monospace" fontWeight="600">RUNTIME: 0.4ms</text>
                  <rect x="190" y="156" width="58" height="18" fill="var(--svg-panel-inner)" stroke="var(--svg-ink)" strokeWidth="1" />
                  <text x="219" y="168" textAnchor="middle" fill="var(--svg-muted)" fontSize="7.4" fontFamily="monospace" fontWeight="700">RUN PY</text>
                  <g className="anim-py-status-badge">
                    <rect x="190" y="156" width="58" height="18" fill="var(--svg-coral)" stroke="var(--svg-ink)" strokeWidth="1" />
                    <text x="219" y="168" textAnchor="middle" fill="#FFFFFF" fontSize="7.6" fontFamily="monospace" fontWeight="700">EXECUTED</text>
                  </g>
                </g>
              </svg>
            </MagneticPlatformCard>

            {/* Track 02: Data Structures & Algorithms */}
            <MagneticPlatformCard
              href="/programs/dsa"
              onNavigate={navigate}
              meta="01 · 10 Weeks · 250+ Problems"
              title={
                <>
                  Data Structures
                  <br />
                  &amp; Algorithms
                </>
              }
              description="Master algorithmic problem-solving from scratch and crack LeetCode-style interviews."
            >
              <svg viewBox="0 0 280 195" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden="true">
                {/* Base Tree Edges */}
                <line x1="140" y1="36" x2="88" y2="78" stroke="var(--svg-stroke)" strokeWidth="1.4" />
                <line x1="140" y1="36" x2="192" y2="78" stroke="var(--svg-stroke)" strokeWidth="1.4" />
                <line x1="88" y1="78" x2="60" y2="120" stroke="var(--svg-stroke)" strokeWidth="1.3" />
                <line x1="88" y1="78" x2="116" y2="120" stroke="var(--svg-stroke)" strokeWidth="1.3" />
                <line x1="192" y1="78" x2="164" y2="120" stroke="var(--svg-stroke)" strokeWidth="1.3" />
                <line x1="192" y1="78" x2="220" y2="120" stroke="var(--svg-stroke)" strokeWidth="1.3" />

                {/* Sequential Illuminated Traversal Edges */}
                <line x1="140" y1="36" x2="192" y2="78" stroke="var(--svg-blue)" strokeWidth="2.4" className="anim-dsa-edge-1" />
                <line x1="192" y1="78" x2="164" y2="120" stroke="var(--svg-coral)" strokeWidth="2.4" className="anim-dsa-edge-2" />

                {/* Inactive Sibling Leaves */}
                <circle cx="88" cy="78" r="12" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.5" />
                <text x="88" y="82" textAnchor="middle" fill="var(--svg-text)" fontSize="9.5" fontFamily="Inter" fontWeight="600">4</text>

                <circle cx="60" cy="120" r="10.5" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.4" />
                <text x="60" y="123.5" textAnchor="middle" fill="var(--svg-text)" fontSize="8.5" fontFamily="Inter" fontWeight="600">2</text>

                <circle cx="116" cy="120" r="10.5" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.4" />
                <text x="116" y="123.5" textAnchor="middle" fill="var(--svg-text)" fontSize="8.5" fontFamily="Inter" fontWeight="600">6</text>

                <circle cx="220" cy="120" r="10.5" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.4" />
                <text x="220" y="123.5" textAnchor="middle" fill="var(--svg-text)" fontSize="8.5" fontFamily="Inter" fontWeight="600">14</text>

                {/* Step 1 Node: Root 8 (Resting + Sequential Highlight) */}
                <circle cx="140" cy="36" r="14" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.6" />
                <text x="140" y="40" textAnchor="middle" fill="var(--svg-text)" fontSize="10.5" fontFamily="Inter" fontWeight="700">8</text>
                <g className="anim-dsa-node-1">
                  <circle cx="140" cy="36" r="18" fill="none" stroke="var(--svg-blue)" strokeWidth="1.6" strokeOpacity="0.45" />
                  <circle cx="140" cy="36" r="14" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1.6" />
                  <text x="140" y="40" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontFamily="Inter" fontWeight="700">8</text>
                </g>

                {/* Step 2 Node: 12 (Resting + Sequential Highlight) */}
                <circle cx="192" cy="78" r="12" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.6" />
                <text x="192" y="82" textAnchor="middle" fill="var(--svg-text)" fontSize="9.5" fontFamily="Inter" fontWeight="700">12</text>
                <g className="anim-dsa-node-2">
                  <circle cx="192" cy="78" r="16" fill="none" stroke="var(--svg-blue)" strokeWidth="1.6" strokeOpacity="0.45" />
                  <circle cx="192" cy="78" r="12" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1.6" />
                  <text x="192" y="82" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontFamily="Inter" fontWeight="700">12</text>
                </g>

                {/* Step 3 Node: Target 10 (Resting + Coral Match Highlight + Ripple) */}
                <circle cx="164" cy="120" r="12.5" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.6" />
                <text x="164" y="124" textAnchor="middle" fill="var(--svg-text)" fontSize="9.5" fontFamily="Inter" fontWeight="700">10</text>
                <g className="anim-dsa-node-3">
                  <circle cx="164" cy="120" r="17" stroke="var(--svg-coral)" strokeWidth="1.5" fill="none" className="anim-dsa-ripple" />
                  <circle cx="164" cy="120" r="12.5" fill="var(--svg-coral)" stroke="var(--svg-ink)" strokeWidth="1.6" />
                  <text x="164" y="124" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontFamily="Inter" fontWeight="700">10</text>
                </g>

                {/* Bottom Complexity Strip */}
                <g>
                  <rect x="26" y="152" width="228" height="26" rx="0" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.4" />
                  <text x="36" y="168.5" fill="var(--svg-text)" fontSize="8" fontFamily="monospace" fontWeight="600">TARGET: 10</text>
                  <text x="138" y="168.5" fill="var(--svg-green)" fontSize="8" fontFamily="monospace" fontWeight="700" className="anim-dsa-found">FOUND</text>
                  <rect x="192" y="156" width="56" height="18" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1" />
                  <text x="220" y="168" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="700">O(log N)</text>
                </g>
              </svg>
            </MagneticPlatformCard>

            {/* Track 03: Full-Stack Web Development */}
            <MagneticPlatformCard
              href="/programs/web-development"
              onNavigate={navigate}
              meta="02 · 8 Weeks · Live Deploys"
              title={
                <>
                  Full-Stack Web
                  <br />
                  Development
                </>
              }
              description="Build production-ready web apps using React, APIs, and modern deployment."
            >
              <svg viewBox="0 0 280 195" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden="true">
                {/* Base Wires */}
                <line x1="102" y1="74" x2="122" y2="74" stroke="var(--svg-stroke)" strokeWidth="1.6" />
                <line x1="184" y1="74" x2="210" y2="74" stroke="var(--svg-stroke)" strokeWidth="1.6" />

                {/* Active Highlight Wires */}
                <line x1="102" y1="74" x2="122" y2="74" stroke="var(--svg-coral)" strokeWidth="2.4" className="anim-fs-wire-1" />
                <line x1="184" y1="74" x2="210" y2="74" stroke="var(--svg-blue)" strokeWidth="2.4" className="anim-fs-wire-2" />

                {/* Node 1: Client Browser (React UI) */}
                <g className="anim-fs-node-1">
                  <rect x="18" y="26" width="84" height="98" rx="0" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.5" />
                  <rect x="18" y="26" width="84" height="98" rx="0" fill="none" stroke="var(--svg-coral)" strokeWidth="2" className="anim-fs-ring-1" />
                  <line x1="18" y1="42" x2="102" y2="42" stroke="var(--svg-ink)" strokeWidth="1.2" />
                  <circle cx="27" cy="34" r="2.2" fill="var(--svg-coral)" />
                  <circle cx="35" cy="34" r="2.2" fill="var(--svg-blue)" />
                  <text x="45" y="36.5" fill="var(--svg-text)" fontSize="7" fontFamily="monospace" fontWeight="700">React UI</text>

                  <rect x="25" y="49" width="70" height="16" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1" />
                  <rect x="25" y="70" width="52" height="4" fill="var(--svg-ink)" fillOpacity="0.25" />

                  <rect x="25" y="80" width="40" height="14" fill="var(--svg-coral)" stroke="var(--svg-ink)" strokeWidth="1" className="anim-fs-btn-pulse" />
                  <text x="45" y="90" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontFamily="monospace" fontWeight="700">POST</text>

                  <rect x="25" y="102" width="70" height="15" fill="var(--svg-panel-inner)" stroke="var(--svg-stroke)" strokeWidth="1" />
                  <text x="60" y="112" textAnchor="middle" fill="var(--svg-muted)" fillOpacity="0.65" fontSize="6.6" fontFamily="monospace" fontWeight="600">WAITING</text>
                  <g className="anim-fs-ok">
                    <rect x="25" y="102" width="70" height="15" fill="var(--svg-panel-inner)" stroke="var(--svg-green)" strokeWidth="1.3" />
                    <text x="60" y="112" textAnchor="middle" fill="var(--svg-green)" fontSize="6.8" fontFamily="monospace" fontWeight="700">✔ 200 OK</text>
                  </g>
                </g>

                {/* Node 2: API Server Hub (Express) */}
                <g className="anim-fs-node-2">
                  <rect x="122" y="40" width="62" height="68" rx="0" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.5" />
                  <rect x="122" y="40" width="62" height="68" rx="0" fill="var(--svg-blue)" className="anim-fs-ring-2" />
                  <rect x="122" y="40" width="62" height="16" fill="var(--svg-ink)" />
                  <text x="153" y="51" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontFamily="monospace" fontWeight="700">API HUB</text>
                  <text x="153" y="70" textAnchor="middle" fill="var(--svg-text)" fontSize="7" fontFamily="monospace" fontWeight="700">Express</text>
                  <text x="153" y="84" textAnchor="middle" fill="var(--svg-muted)" fontSize="6.5" fontFamily="monospace">REST · JWT</text>
                  <g className="anim-fs-ring-2">
                    <text x="153" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontFamily="monospace" fontWeight="700">Express</text>
                    <text x="153" y="84" textAnchor="middle" fill="#FFFFFF" fillOpacity="0.92" fontSize="6.5" fontFamily="monospace">REST · JWT</text>
                    <rect x="122" y="40" width="62" height="68" rx="0" fill="none" stroke="var(--svg-coral)" strokeWidth="2" />
                  </g>
                  <circle cx="153" cy="98" r="3.5" fill="var(--svg-coral)" className="anim-fs-led" />
                </g>

                {/* Node 3: Database Cylinder (MongoDB) */}
                <g className="anim-fs-node-3">
                  {/* Resting State */}
                  <rect x="210" y="50" width="46" height="42" fill="var(--svg-panel)" stroke="none" />
                  <ellipse cx="233" cy="50" rx="23" ry="7" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.5" />
                  <line x1="210" y1="50" x2="210" y2="92" stroke="var(--svg-ink)" strokeWidth="1.5" />
                  <line x1="256" y1="50" x2="256" y2="92" stroke="var(--svg-ink)" strokeWidth="1.5" />
                  <path d="M 210 92 A 23 7 0 0 0 256 92" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.5" />
                  <text x="233" y="76" textAnchor="middle" fill="var(--svg-text)" fontSize="8" fontFamily="monospace" fontWeight="700">DB</text>

                  {/* Active Highlight Overlay */}
                  <g className="anim-fs-ring-3">
                    <rect x="210" y="50" width="46" height="42" fill="var(--svg-blue)" stroke="none" />
                    <ellipse cx="233" cy="50" rx="23" ry="7" fill="var(--svg-panel)" stroke="var(--svg-coral)" strokeWidth="1.8" />
                    <line x1="210" y1="50" x2="210" y2="92" stroke="var(--svg-coral)" strokeWidth="1.8" />
                    <line x1="256" y1="50" x2="256" y2="92" stroke="var(--svg-coral)" strokeWidth="1.8" />
                    <path d="M 210 92 A 23 7 0 0 0 256 92" fill="var(--svg-blue)" stroke="var(--svg-coral)" strokeWidth="1.8" />
                    <text x="233" y="76" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="700">DB</text>
                  </g>
                </g>

                {/* Bottom Pipeline Telemetry Bar */}
                <g>
                  <rect x="18" y="152" width="244" height="26" rx="0" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.4" />
                  <text x="28" y="168.5" fill="var(--svg-text)" fontSize="7.5" fontFamily="monospace" fontWeight="600">React → Express → MongoDB</text>
                  <rect x="216" y="156" width="38" height="18" fill="var(--svg-panel-inner)" stroke="var(--svg-ink)" strokeWidth="1" />
                  <text x="235" y="168" textAnchor="middle" fill="var(--svg-muted)" fontSize="7.5" fontFamily="monospace" fontWeight="700">SYNC</text>
                  <g className="anim-fs-live-pill">
                    <rect x="216" y="156" width="38" height="18" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1" />
                    <text x="235" y="168" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontFamily="monospace" fontWeight="700">LIVE</text>
                  </g>
                </g>
              </svg>
            </MagneticPlatformCard>

            {/* Track 04: AI & Machine Learning */}
            <MagneticPlatformCard
              href="/programs/machine-learning"
              onNavigate={navigate}
              meta="03 · 8 Weeks · End-to-End ML"
              title={
                <>
                  AI &amp; Machine
                  <br />
                  Learning
                </>
              }
              description="Learn Python, data pipelines, and train real ML models with hands-on projects."
            >
              <svg viewBox="0 0 280 195" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden="true">
                <g>
                  <circle cx="34" cy="48" r="8.5" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.5" />
                  <text x="34" y="51" textAnchor="middle" fill="var(--svg-text)" fontSize="7.5" fontFamily="monospace" fontWeight="700">x1</text>

                  <circle cx="34" cy="85" r="8.5" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.5" />
                  <text x="34" y="88" textAnchor="middle" fill="var(--svg-text)" fontSize="7.5" fontFamily="monospace" fontWeight="700">x2</text>

                  <circle cx="34" cy="122" r="8.5" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.5" />
                  <text x="34" y="125" textAnchor="middle" fill="var(--svg-text)" fontSize="7.5" fontFamily="monospace" fontWeight="700">x3</text>
                </g>

                <line x1="43" y1="48" x2="104" y2="75" stroke="var(--svg-ink)" strokeWidth="1.3" />
                <line x1="43" y1="85" x2="98" y2="85" stroke="var(--svg-ink)" strokeWidth="1.3" />
                <line x1="43" y1="122" x2="104" y2="95" stroke="var(--svg-ink)" strokeWidth="1.3" />

                <g>
                  <line x1="170" y1="85" x2="230" y2="85" stroke="var(--svg-ink)" strokeWidth="1.5" strokeDasharray="4 3" />
                  <circle cx="242" cy="85" r="12" fill="var(--svg-coral)" stroke="var(--svg-ink)" strokeWidth="1.6" />
                  <text x="242" y="89" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontFamily="monospace" fontWeight="700">ŷ</text>
                </g>

                <g id="jasper-attention-engine">
                  <g className="anim-orbital-1">
                    <ellipse cx="135" cy="85" rx="44" ry="25" fill="none" stroke="var(--svg-ink)" strokeWidth="1.35" />
                    <circle cx="179" cy="85" r="4.5" fill="var(--svg-coral)" />
                    <circle cx="91" cy="85" r="4" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1" />
                  </g>

                  <g className="anim-orbital-2">
                    <ellipse cx="135" cy="85" rx="37" ry="37" fill="none" stroke="var(--svg-ink)" strokeWidth="1.2" strokeDasharray="5 3" />
                    <circle cx="135" cy="48" r="4" fill="var(--svg-coral)" />
                    <circle cx="135" cy="122" r="4" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1" />
                  </g>

                  <g className="anim-star-pulse">
                    <path
                      d="M 135 58 Q 135 85 108 85 Q 135 85 135 112 Q 135 85 162 85 Q 135 85 135 58 Z"
                      fill="var(--svg-blue)"
                      stroke="var(--svg-ink)"
                      strokeWidth="1.6"
                    />
                    <circle cx="135" cy="85" r="3.5" fill="#FFFFFF" />
                  </g>
                </g>

                <g>
                  <rect x="26" y="150" width="228" height="26" rx="0" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.4" />
                  <text x="36" y="166.5" fill="var(--svg-text)" fontSize="7.5" fontFamily="monospace" fontWeight="700">PYTORCH MODEL</text>
                  <rect x="190" y="154" width="58" height="18" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1" />
                  <text x="219" y="166" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="700">99.4% ACC</text>
                </g>

                <circle cx="250" cy="36" r="4.5" fill="var(--svg-coral)" className="anim-float" />
                <circle cx="30" cy="142" r="4" fill="var(--svg-blue)" className="anim-float-delay" />
              </svg>
            </MagneticPlatformCard>
          </div>
        </div>
      </section>

      {/* ─── Interactive Learning Loop ─── */}
      <ApproachShowcase />

      {/* ─── Interactive Campus Batch Blueprint ─── */}
      <CampusBlueprint onSelectBatch={handleSelectBatch} />

      {/* ─── Contact / Campus Enquiry ─── */}
      <section id="contact" className="border-t border-border/80 bg-muted px-6 py-20 sm:px-10 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="pt-2 lg:sticky lg:top-24">
            <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-path-accent">
              <span className="h-px w-8 bg-path-accent" aria-hidden="true" />
              Get in touch
            </p>
            <h2 className="max-w-lg font-display text-5xl leading-[0.98] tracking-tight sm:text-6xl">
              Ready to level up
              <br />
              your campus <em className="not-italic text-muted-foreground">training?</em>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">
              Interested in bringing SMK to your college campus or learning more about our training tracks? Fill out the details and our team will get in touch with you.
            </p>
          </div>

          <form
            className="contact-form grid gap-x-5 gap-y-5 p-6 sm:grid-cols-2 sm:p-8 lg:p-10"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="contact-form-heading sm:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-path-accent">
                Quick enquiry
              </p>
              <p className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
                Let’s connect.
              </p>
            </div>

            <div className="grid gap-2">
              <label htmlFor="student-name" className="text-xs font-medium text-foreground/85">
                Your name
              </label>
              <input
                ref={nameInputRef}
                className="form-control"
                id="student-name"
                name="name"
                autoComplete="name"
                placeholder="e.g. Rahul Sharma"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="student-email" className="text-xs font-medium text-foreground/85">
                Email address
              </label>
              <input
                className="form-control"
                id="student-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@college.edu or gmail.com"
                required
              />
            </div>

            <div className="grid gap-2 sm:col-span-2">
              <label htmlFor="student-interest" className="text-xs font-medium text-foreground/85">
                How can we help you?
              </label>
              <select
                className="form-control"
                id="student-interest"
                name="interest"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                required
              >
                <option value="" disabled>
                  Choose a topic
                </option>
                <option value="Campus training / college collaboration">
                  Campus training for our college (TPO / Faculty enquiry)
                </option>
                <option value="Data structures & algorithms">
                  Data Structures &amp; Algorithms (DSA track)
                </option>
                <option value="Web development">Full-Stack Web Development track</option>
                <option value="Machine learning">AI &amp; Machine Learning track</option>
                <option value="Feedback or course suggestion">Feedback or suggestion</option>
                <option value="Something else">General enquiry</option>
              </select>
            </div>

            <div className="grid gap-2 sm:col-span-2">
              <label htmlFor="student-note" className="text-xs font-medium text-foreground/85">
                College name / Message{" "}
                <span className="text-muted-foreground">· optional</span>
              </label>
              <textarea
                className="form-control resize-none"
                id="student-note"
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Tell us your college name, batch size, or what you'd like to learn..."
              />
            </div>

            {formError && (
              <p className="text-xs font-medium text-[#FA4028] sm:col-span-2" role="alert">
                {formError}
              </p>
            )}

            <Button
              type="submit"
              variant="default"
              className="w-full justify-between px-5 py-3 sm:col-span-2 cursor-pointer"
            >
              Send enquiry via email <ArrowUpRight aria-hidden="true" />
            </Button>

            <div
              className="flex flex-wrap items-center justify-between gap-3 min-h-6 text-[11px] leading-5 text-muted-foreground sm:col-span-2"
              role="status"
              aria-live="polite"
            >
              <span>
                {formMessage || "Submitting opens your email app with this message ready to send."}
              </span>
              {lastEnquiryText && (
                <button
                  type="button"
                  onClick={handleCopyEnquiry}
                  className="inline-flex items-center gap-1.5 rounded-[4px] border border-border px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-[#FA4028] hover:text-path-accent cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="size-3 text-emerald-500" aria-hidden="true" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" aria-hidden="true" /> Copy enquiry text
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <SiteFooter mode="home" onNavigate={navigate} />
    </main>
  )
}

export default App
