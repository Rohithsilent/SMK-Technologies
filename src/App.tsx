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
                <g className="anim-float">
                  <rect x="26" y="18" width="228" height="136" rx="0" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.5" />
                  <rect x="26" y="18" width="228" height="25" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1.5" />
                  <circle cx="40" cy="30.5" r="3" fill="#FFFFFF" />
                  <circle cx="51" cy="30.5" r="3" fill="#FFFFFF" fillOpacity="0.65" />
                  <circle cx="62" cy="30.5" r="3" fill="#FFFFFF" fillOpacity="0.35" />
                  <text x="76" y="33.5" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="600">solution.py</text>
                  <rect x="184" y="24" width="60" height="13" fill="#FFFFFF" stroke="var(--svg-ink)" strokeWidth="1" />
                  <text x="214" y="33" textAnchor="middle" fill="#00063D" fontSize="7.5" fontFamily="monospace" fontWeight="700">PY 3.12</text>

                  <text x="38" y="61" fill="var(--svg-coral)" fontSize="9.5" fontFamily="monospace" fontWeight="700">def</text>
                  <text x="60" y="61" fill="var(--svg-text)" fontSize="9.5" fontFamily="monospace" fontWeight="600">sort_nums(arr):</text>
                  <text x="48" y="76" fill="var(--svg-muted)" fontSize="8.5" fontFamily="monospace"># O(n log n) clean pass</text>
                  <text x="48" y="91" fill="var(--svg-blue)" fontSize="9.5" fontFamily="monospace" fontWeight="700">return</text>
                  <text x="88" y="91" fill="var(--svg-text)" fontSize="9.5" fontFamily="monospace" fontWeight="600">sorted(arr)</text>

                  <rect x="36" y="102" width="208" height="42" fill="var(--svg-panel-inner)" stroke="var(--svg-ink)" strokeWidth="1.2" />
                  <text x="44" y="117" fill="var(--svg-coral)" fontSize="9" fontFamily="monospace" fontWeight="700">&gt;&gt;&gt;</text>
                  <text x="66" y="117" fill="var(--svg-text)" fontSize="8.5" fontFamily="monospace" fontWeight="600">sort_nums([4, 1, 3])</text>
                  <line x1="178" y1="108" x2="178" y2="119" stroke="var(--svg-coral)" strokeWidth="1.8" className="anim-blink" />

                  <rect x="44" y="124" width="66" height="15" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1" />
                  <text x="77" y="134.5" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontFamily="monospace" fontWeight="700">[1, 3, 4]</text>

                  <rect x="172" y="124" width="64" height="15" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1" />
                  <text x="204" y="134.5" textAnchor="middle" fill="var(--svg-green)" fontSize="8" fontFamily="monospace" fontWeight="700">✔ PASS</text>
                </g>

                <path d="M 18 172 Q 140 186 262 172" stroke="var(--svg-coral)" strokeWidth="1.5" strokeDasharray="6 4" className="anim-py-stream" />
                <circle cx="16" cy="68" r="4.5" fill="var(--svg-coral)" className="anim-float" />
                <circle cx="264" cy="96" r="4" fill="var(--svg-blue)" className="anim-float-delay" />
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
                <line x1="140" y1="36" x2="88" y2="78" stroke="var(--svg-ink)" strokeWidth="1.4" />
                <line x1="140" y1="36" x2="192" y2="78" stroke="var(--svg-coral)" strokeWidth="2" strokeDasharray="4 3" />
                <line x1="88" y1="78" x2="60" y2="120" stroke="var(--svg-ink)" strokeWidth="1.3" />
                <line x1="88" y1="78" x2="116" y2="120" stroke="var(--svg-ink)" strokeWidth="1.3" />
                <line x1="192" y1="78" x2="164" y2="120" stroke="var(--svg-coral)" strokeWidth="2" strokeDasharray="4 3" />
                <line x1="192" y1="78" x2="220" y2="120" stroke="var(--svg-ink)" strokeWidth="1.3" />

                <circle cx="140" cy="36" r="14" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.6" />
                <text x="140" y="40" textAnchor="middle" fill="var(--svg-text)" fontSize="10.5" fontFamily="Inter" fontWeight="700">8</text>

                <circle cx="88" cy="78" r="12" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.5" />
                <text x="88" y="82" textAnchor="middle" fill="var(--svg-text)" fontSize="9.5" fontFamily="Inter" fontWeight="600">4</text>

                <circle cx="192" cy="78" r="12" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1.6" />
                <text x="192" y="82" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontFamily="Inter" fontWeight="700">12</text>

                <circle cx="60" cy="120" r="10.5" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.4" />
                <text x="60" y="123.5" textAnchor="middle" fill="var(--svg-text)" fontSize="8.5" fontFamily="Inter" fontWeight="600">2</text>

                <circle cx="116" cy="120" r="10.5" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.4" />
                <text x="116" y="123.5" textAnchor="middle" fill="var(--svg-text)" fontSize="8.5" fontFamily="Inter" fontWeight="600">6</text>

                <circle cx="164" cy="120" r="12.5" fill="var(--svg-coral)" stroke="var(--svg-ink)" strokeWidth="1.6" />
                <circle cx="164" cy="120" r="17" stroke="var(--svg-coral)" strokeWidth="1.4" fill="none" className="anim-match-ripple" />
                <text x="164" y="124" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontFamily="Inter" fontWeight="700">10</text>

                <circle cx="220" cy="120" r="10.5" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.4" />
                <text x="220" y="123.5" textAnchor="middle" fill="var(--svg-text)" fontSize="8.5" fontFamily="Inter" fontWeight="600">14</text>

                <g className="anim-tree-search">
                  <circle cx="0" cy="0" r="8" fill="none" stroke="var(--svg-blue)" strokeWidth="2" strokeDasharray="3 2" />
                  <circle cx="0" cy="0" r="3" fill="var(--svg-blue)" />
                </g>

                <g>
                  <rect x="26" y="150" width="228" height="26" rx="0" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.4" />
                  <text x="36" y="166.5" fill="var(--svg-text)" fontSize="8" fontFamily="monospace" fontWeight="600">TARGET: 10</text>
                  <text x="142" y="166.5" fill="var(--svg-green)" fontSize="8" fontFamily="monospace" fontWeight="700">FOUND</text>
                  <rect x="192" y="154" width="56" height="18" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1" />
                  <text x="220" y="166" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="700">O(log N)</text>
                </g>

                <circle cx="32" cy="40" r="4.5" fill="var(--svg-coral)" className="anim-float" />
                <circle cx="248" cy="54" r="4" fill="var(--svg-blue)" className="anim-float-delay" />
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
                <rect x="18" y="26" width="84" height="98" rx="0" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.5" />
                <line x1="18" y1="42" x2="102" y2="42" stroke="var(--svg-ink)" strokeWidth="1.2" />
                <circle cx="27" cy="34" r="2.2" fill="var(--svg-coral)" />
                <circle cx="35" cy="34" r="2.2" fill="var(--svg-blue)" />
                <text x="45" y="36.5" fill="var(--svg-text)" fontSize="7" fontFamily="monospace" fontWeight="700">React UI</text>

                <rect x="25" y="49" width="70" height="16" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1" />
                <rect x="25" y="70" width="52" height="4" fill="var(--svg-ink)" fillOpacity="0.25" />

                <rect x="25" y="80" width="40" height="14" fill="var(--svg-coral)" stroke="var(--svg-ink)" strokeWidth="1" />
                <text x="45" y="90" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontFamily="monospace" fontWeight="700">POST</text>

                <g className="anim-float">
                  <polygon points="58,88 67,97 62,98 65,105 61,106 58,99 53,102" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.2" />
                </g>

                <rect x="25" y="102" width="70" height="15" fill="var(--svg-panel-inner)" stroke="var(--svg-ink)" strokeWidth="1" />
                <text x="60" y="112" textAnchor="middle" fill="var(--svg-green)" fontSize="6.8" fontFamily="monospace" fontWeight="700">✔ 200 OK</text>

                <line x1="102" y1="74" x2="122" y2="74" stroke="var(--svg-ink)" strokeWidth="1.5" />

                <rect x="122" y="40" width="62" height="68" rx="0" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1.5" />
                <rect x="122" y="40" width="62" height="16" fill="var(--svg-ink)" />
                <text x="153" y="51" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontFamily="monospace" fontWeight="700">API HUB</text>
                <text x="153" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontFamily="monospace" fontWeight="700">Express</text>
                <text x="153" y="84" textAnchor="middle" fill="#FFFFFF" fillOpacity="0.9" fontSize="6.5" fontFamily="monospace">REST · JWT</text>
                <circle cx="153" cy="98" r="3.5" fill="#FFFFFF" className="anim-blink" />

                <line x1="184" y1="74" x2="210" y2="74" stroke="var(--svg-ink)" strokeWidth="1.5" />

                <g className="anim-float-delay">
                  <rect x="210" y="50" width="46" height="42" fill="var(--svg-blue)" stroke="none" />
                  <ellipse cx="233" cy="50" rx="23" ry="7" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.5" />
                  <line x1="210" y1="50" x2="210" y2="92" stroke="var(--svg-ink)" strokeWidth="1.5" />
                  <line x1="256" y1="50" x2="256" y2="92" stroke="var(--svg-ink)" strokeWidth="1.5" />
                  <path d="M 210 92 A 23 7 0 0 0 256 92" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1.5" />
                  <text x="233" y="76" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="700">DB</text>
                </g>

                <g className="anim-req-flow">
                  <circle cx="102" cy="74" r="4" fill="var(--svg-coral)" stroke="var(--svg-ink)" strokeWidth="1" />
                </g>
                <g className="anim-db-flow">
                  <circle cx="184" cy="74" r="3.5" fill="var(--svg-coral)" stroke="var(--svg-ink)" strokeWidth="1" />
                </g>

                <g>
                  <rect x="18" y="150" width="244" height="26" rx="0" fill="var(--svg-panel)" stroke="var(--svg-ink)" strokeWidth="1.4" />
                  <text x="28" y="166.5" fill="var(--svg-text)" fontSize="7.5" fontFamily="monospace" fontWeight="600">React → Express → MongoDB</text>
                  <rect x="216" y="154" width="38" height="18" fill="var(--svg-blue)" stroke="var(--svg-ink)" strokeWidth="1" />
                  <text x="235" y="166" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontFamily="monospace" fontWeight="700">LIVE</text>
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
