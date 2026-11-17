import { useEffect, useState, type FormEvent } from "react"
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import BrandSignature from "@/components/BrandSignature"
import ProgramPage, { getProgramForPath } from "./ProgramPage"
import CelestialAtmosphere from "@/components/CelestialAtmosphere"
import ThemeToggle from "@/components/ThemeToggle"

const navItems = [
  { label: "Home", href: "#home" },
  { label: "How it works", href: "#approach" },
  { label: "For colleges", href: "#campus" },
]

function App() {
  const programPage = getProgramForPath(window.location.pathname)
  const [menuOpen, setMenuOpen] = useState(false)
  const [formMessage, setFormMessage] = useState("")
  const requestedInterest = new URLSearchParams(window.location.search).get("interest")
  const defaultInterest = requestedInterest === "feedback"
    ? "Feedback or suggestion"
    : requestedInterest === "campus"
      ? "Campus training / college collaboration"
      : ""

  useEffect(() => {
    document.title = programPage
      ? `${programPage.shortName} training roadmap | SMK TechVora`
      : "SMK TechVora | Campus Coding & Placement Training"
  }, [programPage])

  useEffect(() => {
    const sectionId = decodeURIComponent(window.location.hash.slice(1))
    if (!sectionId) return

    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ block: "start" })
    })
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const subject = `SMK TechVora enquiry — ${String(formData.get("interest"))}`
    const body = [
      `Name: ${String(formData.get("name"))}`,
      `Reply email: ${String(formData.get("email"))}`,
      `Topic: ${String(formData.get("interest"))}`,
      `Message: ${String(formData.get("note") || "(no additional note)")}`,
    ].join("\n")
    setFormMessage("Your email app should open with your enquiry addressed to SMK TechVora.")
    window.location.href = `mailto:localboy0909@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  if (programPage) return <ProgramPage program={programPage} />

  return (
    <main className="overflow-x-clip bg-background text-foreground">
      <section id="home" className="relative isolate flex min-h-svh flex-col bg-background">
        <CelestialAtmosphere />

        <header className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-8">
          <BrandSignature href="#home" />

          <nav className="liquid-glass hidden items-center gap-7 rounded-full px-7 py-3 lg:flex" aria-label="Main navigation">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={index === 0 ? "page" : undefined}
                className={`text-sm transition-colors hover:text-foreground ${index === 0 ? "text-foreground" : "text-muted-foreground"}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="glass" className="hidden rounded-full px-6 py-2.5 text-sm sm:inline-flex">
              <a href="#programs">Explore programs <ArrowUpRight aria-hidden="true" /></a>
            </Button>
            <Button
              type="button"
              variant="glass"
              size="icon"
              className="size-11 rounded-full lg:hidden"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </Button>
          </div>

          {menuOpen && (
            <nav
              id="mobile-navigation"
              className="mobile-navigation liquid-glass absolute left-4 right-4 top-[calc(100%-8px)] z-20 flex flex-col gap-1 rounded-2xl p-3 sm:left-6 sm:right-6 lg:hidden"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-foreground/10">
                <span className="text-xs font-medium text-muted-foreground">Appearance</span>
                <ThemeToggle />
              </div>
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="min-h-11 rounded-xl px-4 py-3 text-sm text-foreground transition-colors hover:bg-foreground/10"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#programs"
                onClick={() => setMenuOpen(false)}
                className="min-h-11 rounded-xl px-4 py-3 text-sm text-foreground transition-colors hover:bg-foreground/10"
              >
                Explore programs <ArrowUpRight className="ml-1 inline size-4" aria-hidden="true" />
              </a>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="min-h-11 rounded-xl px-4 py-3 text-sm text-foreground transition-colors hover:bg-foreground/10"
              >
                Get in touch <ArrowUpRight className="ml-1 inline size-4" aria-hidden="true" />
              </a>
            </nav>
          )}
        </header>

        <div className="hero-copy relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-start px-6 pb-24 pt-[clamp(3rem,10vh,7rem)] text-center sm:px-8 sm:pb-32">
          <p className="animate-fade-rise mb-6 font-body text-[10px] uppercase tracking-[.25em] text-foreground/80 sm:text-xs">
            Campus Recruitment & Tech Training · Built for B.Tech Colleges
          </p>
          <h1
            className="animate-fade-rise max-w-7xl text-[clamp(2.5rem,8.5vw,6rem)] font-normal leading-[.95] tracking-[-.04em] text-foreground"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Master <em className="hero-em not-italic">Coding.</em><br className="hidden sm:block" /> Crack <em className="hero-em not-italic">Placements.</em>
          </h1>
          <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Hands-on training in Data Structures, Full-Stack Web Development, and AI. Built to help engineering students master problem-solving and get placed in top companies.
          </p>
          <div className="animate-fade-rise-delay-2 mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="default" className="hero-btn-primary px-7 py-3 text-sm font-medium">
              <a href="#programs">Explore Programs <ArrowDown className="size-4" aria-hidden="true" /></a>
            </Button>
            <Button asChild variant="glass" className="hero-btn-secondary px-7 py-3 text-sm font-medium">
              <a href="#campus">Campus Collaboration <ArrowRight className="size-4" aria-hidden="true" /></a>
            </Button>
          </div>
        </div>
      </section>

      <section id="programs" className="border-t border-border/80 px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="mb-14 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <p className="mb-5 text-[10px] uppercase tracking-[.22em] text-path-accent">Explore the platform</p>
              <h2 className="font-display text-5xl leading-[.98] tracking-tight sm:text-6xl">
                Structured training.<br />
                <em className="not-italic text-muted-foreground">Built for campus hiring.</em>
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-muted-foreground lg:text-right">
              Four focused curriculum tracks — from first-line-of-code to clearing Day-1 company placements. Each track is an interactive deep-dive.
            </p>
          </div>

          {/* Jasper-style animated platform cards (Sharp edges, Matrix background, Always-active animations) */}
          <div className="platform-cards">
            {/* ─── Track 01: Python Programming ─── */}
            <a href="/programs/python" className="platform-card group">
              <div className="platform-card-header">
                <h3>Python<br />Programming</h3>
              </div>

              <div className="platform-card-illustration">
                <svg viewBox="0 0 280 195" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
                  {/* IDE Terminal Window Frame */}
                  <g className="anim-float">
                    <rect x="25" y="20" width="230" height="135" rx="0" fill="rgba(0, 0, 0, 0.45)" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
                    {/* Title bar */}
                    <line x1="25" y1="42" x2="255" y2="42" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
                    <circle cx="38" cy="31" r="3" fill="#ff5f56" />
                    <circle cx="48" cy="31" r="3" fill="#ffbd2e" />
                    <circle cx="58" cy="31" r="3" fill="#27c93f" />
                    <text x="75" y="34" fill="rgba(255, 255, 255, 0.5)" fontSize="8.5" fontFamily="monospace">solution.py</text>
                    <rect x="185" y="27" width="58" height="10" fill="rgba(212, 154, 61, 0.15)" stroke="hsl(39 62% 56%)" strokeWidth="0.6" />
                    <text x="214" y="34" textAnchor="middle" fill="hsl(39 62% 56%)" fontSize="7" fontFamily="monospace">PYTHON 3.12</text>

                    {/* Code Lines */}
                    <text x="36" y="58" fill="#d49a3d" fontSize="9" fontFamily="monospace">def</text>
                    <text x="56" y="58" fill="#e0e0e0" fontSize="9" fontFamily="monospace">sort_array(nums):</text>
                    <text x="48" y="72" fill="#758296" fontSize="8" fontFamily="monospace"># In-place optimal logic</text>
                    <text x="48" y="86" fill="#88c0d0" fontSize="9" fontFamily="monospace">return</text>
                    <text x="82" y="86" fill="#eceff4" fontSize="9" fontFamily="monospace">sorted(nums)</text>

                    {/* Animated Execution Data Flow */}
                    <rect x="36" y="98" width="208" height="42" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.8" />
                    
                    {/* Prompt with Blinking Cursor */}
                    <text x="44" y="112" fill="#27c93f" fontSize="8.5" fontFamily="monospace">&gt;&gt;&gt;</text>
                    <text x="64" y="112" fill="rgba(255, 255, 255, 0.9)" fontSize="8.5" fontFamily="monospace">sort_array([4, 1, 3])</text>
                    <line x1="168" y1="104" x2="168" y2="114" stroke="hsl(39 62% 56%)" strokeWidth="1.5" className="anim-blink" />

                    {/* Result Output */}
                    <text x="44" y="128" fill="rgba(255, 255, 255, 0.4)" fontSize="8" fontFamily="monospace">Result:</text>
                    <text x="82" y="128" fill="#d49a3d" fontSize="8.5" fontFamily="monospace" fontWeight="600">[1, 3, 4]</text>
                    
                    {/* Pass badge */}
                    <rect x="168" y="120" width="66" height="13" fill="rgba(39, 201, 63, 0.15)" stroke="rgba(39, 201, 63, 0.4)" strokeWidth="0.8" />
                    <text x="201" y="129" textAnchor="middle" fill="#27c93f" fontSize="7.5" fontFamily="monospace" fontWeight="600">✔ PASS (0.02ms)</text>
                  </g>

                  {/* Interlocking animated data particle stream */}
                  <path d="M 15 170 Q 140 185 265 170" stroke="hsl(39 62% 56%)" strokeWidth="1" strokeDasharray="6 4" className="anim-py-stream" />
                  
                  {/* Floating accent dots */}
                  <circle cx="16" cy="70" r="3.5" fill="hsl(39 62% 56%)" className="anim-float" />
                  <circle cx="264" cy="95" r="3" fill="#88c0d0" className="anim-float-delay" />
                </svg>
              </div>

              <div className="platform-card-footer">
                <p>Master syntax, OOP, automation scripts, and problem-solving fundamentals from scratch.</p>
                <span className="card-arrow"><ArrowRight className="size-3.5" /></span>
              </div>
            </a>

            {/* ─── Track 02: DSA Card ─── */}
            <a href="/programs/dsa" className="platform-card group">
              <div className="platform-card-header">
                <h3>Data Structures<br />& Algorithms</h3>
              </div>

              <div className="platform-card-illustration">
                <svg viewBox="0 0 280 195" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
                  {/* Binary Tree Structure */}
                  {/* Tree Path Lines (rendered first so circles sit cleanly on top) */}
                  <line x1="140" y1="38" x2="90" y2="78" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1.2" />
                  <line x1="140" y1="38" x2="190" y2="78" stroke="rgba(212, 154, 61, 0.7)" strokeWidth="1.5" strokeDasharray="3 2" />
                  
                  <line x1="90" y1="78" x2="65" y2="120" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
                  <line x1="90" y1="78" x2="115" y2="120" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
                  
                  <line x1="190" y1="78" x2="165" y2="120" stroke="rgba(212, 154, 61, 0.7)" strokeWidth="1.5" strokeDasharray="3 2" />
                  <line x1="190" y1="78" x2="215" y2="120" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />

                  {/* Level 0: Root 8 - Solid opaque fill blocks lines inside */}
                  <circle cx="140" cy="38" r="13" fill="#002235" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.5" />
                  <text x="140" y="42" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontFamily="Inter" fontWeight="600">8</text>

                  {/* Level 1: Node 4 & Node 12 */}
                  <circle cx="90" cy="78" r="11" fill="#002235" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.2" />
                  <text x="90" y="82" textAnchor="middle" fill="rgba(255, 255, 255, 0.7)" fontSize="9" fontFamily="Inter" fontWeight="500">4</text>

                  <circle cx="190" cy="78" r="11" fill="#002235" stroke="hsl(39 62% 56%)" strokeWidth="1.5" />
                  <text x="190" y="82" textAnchor="middle" fill="hsl(39 62% 56%)" fontSize="9" fontFamily="Inter" fontWeight="600">12</text>

                  {/* Level 2: Leaves (2, 6, 10, 14) */}
                  <circle cx="65" cy="120" r="9" fill="#002235" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
                  <text x="65" y="123" textAnchor="middle" fill="rgba(255, 255, 255, 0.5)" fontSize="7.5" fontFamily="Inter">2</text>

                  <circle cx="115" cy="120" r="9" fill="#002235" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
                  <text x="115" y="123" textAnchor="middle" fill="rgba(255, 255, 255, 0.5)" fontSize="7.5" fontFamily="Inter">6</text>

                  {/* Target Node: 10 with Match Glow & Ripple */}
                  <circle cx="165" cy="120" r="11" fill="#002235" stroke="hsl(39 62% 56%)" strokeWidth="2" />
                  <circle cx="165" cy="120" r="15" stroke="hsl(39 62% 56%)" strokeWidth="1" fill="none" className="anim-match-ripple" />
                  <text x="165" y="124" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="Inter" fontWeight="700">10</text>

                  <circle cx="215" cy="120" r="9" fill="#002235" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
                  <text x="215" y="123" textAnchor="middle" fill="rgba(255, 255, 255, 0.5)" fontSize="7.5" fontFamily="Inter">14</text>

                  {/* Continuous Active Binary Search Scanner Pointer - Centered at (0,0) */}
                  <g className="anim-tree-search">
                    <circle cx="0" cy="0" r="7" fill="none" stroke="hsl(39 62% 56%)" strokeWidth="1.5" strokeDasharray="2 2" />
                    <circle cx="0" cy="0" r="2.5" fill="hsl(39 62% 56%)" />
                  </g>

                  {/* Binary Search Metric Bar at bottom */}
                  <g>
                    <rect x="25" y="152" width="230" height="24" rx="0" fill="rgba(0, 0, 0, 0.4)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.8" />
                    <text x="35" y="167" fill="rgba(255, 255, 255, 0.45)" fontSize="7.5" fontFamily="monospace">SEARCH TARGET: 10</text>
                    <text x="145" y="167" fill="#27c93f" fontSize="7.5" fontFamily="monospace">FOUND</text>
                    <rect x="195" y="156" width="52" height="15" fill="rgba(212, 154, 61, 0.15)" stroke="hsl(39 62% 56%)" strokeWidth="0.6" />
                    <text x="221" y="167" textAnchor="middle" fill="hsl(39 62% 56%)" fontSize="7.5" fontFamily="monospace" fontWeight="600">O(log N)</text>
                  </g>

                  {/* Floating accent dots */}
                  <circle cx="35" cy="40" r="3.5" fill="hsl(39 62% 56%)" className="anim-float" />
                  <circle cx="245" cy="55" r="3" fill="#27c93f" className="anim-float-delay" />
                </svg>
              </div>

              <div className="platform-card-footer">
                <p>Master algorithmic problem-solving from scratch and crack LeetCode-style interviews.</p>
                <span className="card-arrow"><ArrowRight className="size-3.5" /></span>
              </div>
            </a>

            {/* ─── Track 03: Web Dev Card ─── */}
            <a href="/programs/web-development" className="platform-card group">
              <div className="platform-card-header">
                <h3>Full-Stack Web<br />Development</h3>
              </div>

              <div className="platform-card-illustration">
                <svg viewBox="0 0 280 195" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
                  {/* Client Window (Left) */}
                  <rect x="20" y="28" width="82" height="96" rx="0" fill="rgba(0, 0, 0, 0.45)" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
                  <line x1="20" y1="42" x2="102" y2="42" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
                  <circle cx="27" cy="35" r="2" fill="#ff5f56" />
                  <circle cx="34" cy="35" r="2" fill="#ffbd2e" />
                  <circle cx="41" cy="35" r="2" fill="#27c93f" />
                  <text x="50" y="37" fill="rgba(255, 255, 255, 0.45)" fontSize="6" fontFamily="monospace">React UI</text>
                  
                  {/* Browser content wireframe */}
                  <rect x="26" y="48" width="40" height="6" fill="hsl(39 62% 56%)" opacity="0.4" />
                  <rect x="26" y="58" width="55" height="4" fill="rgba(255, 255, 255, 0.1)" />
                  <rect x="26" y="66" width="48" height="4" fill="rgba(255, 255, 255, 0.06)" />
                  
                  {/* Clickable button with click cursor */}
                  <rect x="26" y="78" width="36" height="12" fill="rgba(212, 154, 61, 0.2)" stroke="hsl(39 62% 56%)" strokeWidth="0.8" />
                  <text x="44" y="87" textAnchor="middle" fill="hsl(39 62% 56%)" fontSize="6.5" fontFamily="monospace" fontWeight="600">POST</text>
                  
                  {/* Cursor Click Pointer */}
                  <g className="anim-float">
                    <polygon points="56,86 64,94 60,95 62,102 59,103 57,96 52,99" fill="#ffffff" stroke="#000000" strokeWidth="0.6" />
                  </g>
                  
                  {/* Status Tag on Client */}
                  <rect x="26" y="100" width="70" height="14" fill="rgba(39, 201, 63, 0.15)" stroke="rgba(39, 201, 63, 0.3)" strokeWidth="0.6" />
                  <text x="61" y="110" textAnchor="middle" fill="#27c93f" fontSize="6" fontFamily="monospace">✔ 200 OK (14ms)</text>

                  {/* Backend API Server (Middle) */}
                  <rect x="122" y="42" width="60" height="68" rx="0" fill="rgba(0, 0, 0, 0.5)" stroke="rgba(212, 154, 61, 0.4)" strokeWidth="1" />
                  <rect x="122" y="42" width="60" height="14" fill="rgba(212, 154, 61, 0.15)" />
                  <text x="152" y="52" textAnchor="middle" fill="hsl(39 62% 56%)" fontSize="6.5" fontFamily="monospace" fontWeight="700">API GATEWAY</text>
                  <text x="152" y="68" textAnchor="middle" fill="rgba(255, 255, 255, 0.7)" fontSize="6" fontFamily="monospace">Node / Express</text>
                  <line x1="130" y1="78" x2="174" y2="78" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
                  <text x="152" y="90" textAnchor="middle" fill="#88c0d0" fontSize="6" fontFamily="monospace">REST &amp; JWT</text>
                  <circle cx="152" cy="102" r="3" fill="#27c93f" className="anim-blink" />

                  {/* PostgreSQL Database (Right) */}
                  <g className="anim-float-delay">
                    {/* Top ellipse */}
                    <ellipse cx="230" cy="52" rx="20" ry="6" fill="rgba(0, 0, 0, 0.6)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                    {/* Middle cylinder body */}
                    <rect x="210" y="52" width="40" height="38" fill="rgba(0, 0, 0, 0.4)" stroke="none" />
                    <line x1="210" y1="52" x2="210" y2="90" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                    <line x1="250" y1="52" x2="250" y2="90" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                    {/* Ring discs */}
                    <ellipse cx="230" cy="65" rx="20" ry="5.5" fill="none" stroke="rgba(212, 154, 61, 0.3)" strokeWidth="0.8" />
                    <ellipse cx="230" cy="78" rx="20" ry="5.5" fill="none" stroke="rgba(212, 154, 61, 0.3)" strokeWidth="0.8" />
                    <ellipse cx="230" cy="90" rx="20" ry="6" fill="rgba(0, 0, 0, 0.6)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                    <text x="230" y="73" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="monospace" fontWeight="600">SQL</text>
                  </g>

                  {/* Network Cables connecting components */}
                  <line x1="102" y1="72" x2="122" y2="72" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
                  <line x1="182" y1="72" x2="210" y2="72" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />

                  {/* Active Animated Data Packet Flows */}
                  {/* Request packet Client -> Server */}
                  <g className="anim-req-flow">
                    <circle cx="102" cy="72" r="3" fill="hsl(39 62% 56%)" />
                  </g>
                  
                  {/* DB query packet Server -> DB */}
                  <g className="anim-db-flow">
                    <circle cx="182" cy="72" r="2.5" fill="#88c0d0" />
                  </g>

                  {/* Full-Stack Status Bar at bottom */}
                  <g>
                    <rect x="20" y="148" width="240" height="26" rx="0" fill="rgba(0, 0, 0, 0.4)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.8" />
                    <text x="30" y="164" fill="rgba(255, 255, 255, 0.45)" fontSize="7" fontFamily="monospace">PIPELINE:</text>
                    <text x="76" y="164" fill="hsl(39 62% 56%)" fontSize="7.5" fontFamily="monospace">Next.js 15 → Express → Postgres</text>
                    <rect x="220" y="152" width="34" height="16" fill="rgba(39, 201, 63, 0.15)" stroke="#27c93f" strokeWidth="0.6" />
                    <text x="237" y="163" textAnchor="middle" fill="#27c93f" fontSize="7" fontFamily="monospace" fontWeight="600">LIVE</text>
                  </g>
                </svg>
              </div>

              <div className="platform-card-footer">
                <p>Build production-ready web apps using React, APIs, and modern deployment.</p>
                <span className="card-arrow"><ArrowRight className="size-3.5" /></span>
              </div>
            </a>

            {/* ─── Track 04: AI & Machine Learning Card ─── */}
            <a href="/programs/machine-learning" className="platform-card group">
              <div className="platform-card-header">
                <h3>AI & Machine<br />Learning</h3>
              </div>

              <div className="platform-card-illustration">
                <svg viewBox="0 0 280 195" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
                  {/* Input Data Nodes (Left) */}
                  <g>
                    <circle cx="35" cy="50" r="7" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                    <text x="35" y="53" textAnchor="middle" fill="rgba(255, 255, 255, 0.6)" fontSize="6" fontFamily="monospace">x1</text>
                    
                    <circle cx="35" cy="85" r="7" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                    <text x="35" y="88" textAnchor="middle" fill="rgba(255, 255, 255, 0.6)" fontSize="6" fontFamily="monospace">x2</text>
                    
                    <circle cx="35" cy="120" r="7" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                    <text x="35" y="123" textAnchor="middle" fill="rgba(255, 255, 255, 0.6)" fontSize="6" fontFamily="monospace">x3</text>
                  </g>

                  {/* Synaptic connection rays leading to center */}
                  <line x1="42" y1="50" x2="105" y2="75" stroke="rgba(212, 154, 61, 0.35)" strokeWidth="0.8" strokeDasharray="2 2" />
                  <line x1="42" y1="85" x2="100" y2="85" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.8" />
                  <line x1="42" y1="120" x2="105" y2="95" stroke="rgba(212, 154, 61, 0.35)" strokeWidth="0.8" strokeDasharray="2 2" />

                  {/* Output Layer (Right) */}
                  <g>
                    <circle cx="240" cy="85" r="10" fill="rgba(212, 154, 61, 0.2)" stroke="hsl(39 62% 56%)" strokeWidth="1.5" />
                    <text x="240" y="88" textAnchor="middle" fill="hsl(39 62% 56%)" fontSize="7.5" fontFamily="monospace" fontWeight="700">ŷ</text>
                    <line x1="170" y1="85" x2="230" y2="85" stroke="hsl(39 62% 56%)" strokeWidth="1.2" strokeDasharray="3 2" />
                  </g>

                  {/* Central Attention Transformer Core (Jasper-Style Rotating Star & Orbital Context Rings) */}
                  <g id="jasper-attention-engine">
                    {/* Outer Orbital Ring 1 */}
                    <g className="anim-orbital-1">
                      <ellipse cx="135" cy="85" rx="42" ry="24" fill="none" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1" strokeDasharray="4 3" />
                      <circle cx="177" cy="85" r="3.5" fill="hsl(39 62% 56%)" />
                      <circle cx="93" cy="85" r="2.5" fill="#88c0d0" />
                    </g>

                    {/* Outer Orbital Ring 2 (Tilted & Reverse) */}
                    <g className="anim-orbital-2">
                      <ellipse cx="135" cy="85" rx="36" ry="36" fill="none" stroke="rgba(212, 154, 61, 0.25)" strokeWidth="0.8" />
                      <circle cx="135" cy="49" r="3" fill="#ff5f56" />
                      <circle cx="135" cy="121" r="3" fill="#27c93f" />
                    </g>

                    {/* Central 4-Point Jasper-Style Spark / Attention Star */}
                    <g className="anim-star-pulse">
                      <path
                        d="M 135 62 Q 135 85 112 85 Q 135 85 135 108 Q 135 85 158 85 Q 135 85 135 62 Z"
                        fill="rgba(212, 154, 61, 0.25)"
                        stroke="hsl(39 62% 56%)"
                        strokeWidth="1.6"
                      />
                      <circle cx="135" cy="85" r="3" fill="#ffffff" />
                    </g>
                  </g>

                  {/* Model Confidence Metric at bottom */}
                  <g>
                    <rect x="25" y="152" width="230" height="24" rx="0" fill="rgba(0, 0, 0, 0.4)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.8" />
                    <text x="35" y="167" fill="rgba(255, 255, 255, 0.45)" fontSize="7" fontFamily="monospace">INFERENCE:</text>
                    <text x="92" y="167" fill="#88c0d0" fontSize="7" fontFamily="monospace">TRANSFORMER ATTENTION</text>
                    <rect x="195" y="156" width="52" height="15" fill="rgba(39, 201, 63, 0.15)" stroke="#27c93f" strokeWidth="0.6" />
                    <text x="221" y="167" textAnchor="middle" fill="#27c93f" fontSize="7" fontFamily="monospace" fontWeight="600">99.4% ACC</text>
                  </g>

                  {/* Floating accent dots */}
                  <circle cx="250" cy="40" r="3" fill="hsl(39 62% 56%)" className="anim-float" />
                  <circle cx="30" cy="145" r="3" fill="#88c0d0" className="anim-float-delay" />
                </svg>
              </div>

              <div className="platform-card-footer">
                <p>Learn Python, data pipelines, and train real ML models with hands-on projects.</p>
                <span className="card-arrow"><ArrowRight className="size-3.5" /></span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section id="approach" className="border-t border-border/80 bg-secondary/40 px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-4 sm:grid-cols-[.8fr_1.2fr] sm:items-end sm:gap-10">
            <div>
              <p className="mb-4 text-[10px] uppercase tracking-[.22em] text-path-accent">How we teach at SMK</p>
              <h2 className="max-w-md font-display text-4xl leading-[1.02] sm:text-5xl">Learn it from scratch.<br />Code it live. <em className="not-italic text-muted-foreground">Crack the interview.</em></h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">A 100% hands-on learning loop. No dry theory lectures — every topic moves from simple visual explanations to live coding and interview-level practice.</p>
          </div>
          <ol className="learning-loop">
            <li><span className="learning-loop-index">01 <ArrowRight aria-hidden="true" /></span><h3>Concept from scratch</h3><p>We break down complex logic with simple diagrams and step-by-step examples that any beginner can follow.</p></li>
            <li><span className="learning-loop-index">02 <ArrowRight aria-hidden="true" /></span><h3>Live hands-on practice</h3><p>Write real code in class, solve contest problems, and fix bugs live with mentor guidance.</p></li>
            <li><span className="learning-loop-index">03 <Check aria-hidden="true" /></span><h3>Interview-ready thinking</h3><p>Learn how to explain your approach, optimize time complexity, and confidently answer recruiter questions.</p></li>
          </ol>
        </div>
      </section>

      <section id="campus" className="border-t border-border/80 bg-background px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-20">
          <div>
            <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[.22em] text-path-accent"><span className="h-px w-8 bg-path-accent" aria-hidden="true" />For colleges & placement cells</p>
            <h2 className="max-w-xl font-display text-5xl leading-[.98] tracking-tight sm:text-6xl">Partner with SMK to<br /><em className="not-italic text-muted-foreground">train your students.</em></h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">Whether you need an intensive placement bootcamp, a semester-long DSA track, or a hands-on AI workshop, we tailor the training to your college's timetable and student skill level.</p>
          </div>
          <div>
            <ol className="campus-brief">
              <li><span>01</span><div><h3>Customized for your batch</h3><p>Tailored modules for 2nd, 3rd, or final-year B.Tech students — from complete beginners to advanced coders.</p></div></li>
              <li><span>02</span><div><h3>Placement-oriented curriculum</h3><p>Aligned with actual online assessments and technical interview patterns of top tech recruiters.</p></div></li>
              <li><span>03</span><div><h3>Flexible campus delivery</h3><p>Hands-on offline bootcamps right on your campus or interactive live online sessions with real-time doubt solving.</p></div></li>
            </ol>
            <Button asChild variant="glass" className="mt-7 rounded-full px-6">
              <a href="/?interest=campus#contact">Discuss campus training <ArrowUpRight aria-hidden="true" /></a>
            </Button>
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-border/80 bg-secondary/60 px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div className="pt-2 lg:sticky lg:top-10">
            <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[.22em] text-path-accent"><span className="h-px w-8 bg-path-accent" aria-hidden="true" />Get in touch</p>
            <h2 className="max-w-lg font-display text-5xl leading-[.98] tracking-tight sm:text-6xl">Ready to level up<br />your campus <em className="not-italic text-muted-foreground">training?</em></h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">Interested in bringing SMK to your college campus or learning more about our training tracks? Fill out the details and our team will get in touch with you.</p>
          </div>
          <form className="contact-form grid gap-x-5 gap-y-5 rounded-3xl border border-white/10 bg-background/55 p-5 sm:grid-cols-2 sm:p-8 lg:p-10" onSubmit={handleSubmit}>
            <div className="contact-form-heading sm:col-span-2">
              <p className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">Quick enquiry</p>
              <p className="mt-2 font-display text-3xl leading-tight sm:text-4xl">Let’s connect.</p>
            </div>
            <div className="grid gap-2">
              <label htmlFor="student-name" className="text-xs text-foreground/80">Your name</label>
              <input className="form-control" id="student-name" name="name" autoComplete="name" placeholder="e.g. Rahul Sharma" required />
            </div>
            <div className="grid gap-2">
              <label htmlFor="student-email" className="text-xs text-foreground/80">Email address</label>
              <input className="form-control" id="student-email" name="email" type="email" autoComplete="email" placeholder="you@college.edu or gmail.com" required />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <label htmlFor="student-interest" className="text-xs text-foreground/80">How can we help you?</label>
              <select className="form-control" id="student-interest" name="interest" defaultValue={defaultInterest} required>
                <option value="" disabled>Choose a topic</option>
                <option value="Campus training / college collaboration">Campus training for our college (TPO / Faculty enquiry)</option>
                <option value="Data structures & algorithms">Data Structures & Algorithms (DSA track)</option>
                <option value="Web development">Full-Stack Web Development track</option>
                <option value="Machine learning">AI & Machine Learning track</option>
                <option value="Feedback or course suggestion">Feedback or suggestion</option>
                <option value="Something else">General enquiry</option>
              </select>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <label htmlFor="student-note" className="text-xs text-foreground/80">College name / Message <span className="text-muted-foreground">· optional</span></label>
              <textarea className="form-control resize-none" id="student-note" name="note" placeholder="Tell us your college name, batch size, or what you'd like to learn..." />
            </div>
            <Button type="submit" variant="default" className="w-full justify-between rounded-xl bg-path-accent px-5 py-3 text-background hover:bg-path-accent/90 sm:col-span-2">
              Send enquiry via email <ArrowUpRight aria-hidden="true" />
            </Button>
            <p className="min-h-5 text-[10px] leading-5 text-muted-foreground sm:col-span-2" role="status" aria-live="polite">
              {formMessage || "Submitting opens your email app with this message ready to send."}
            </p>
          </form>
        </div>
      </section>

      <footer className="flex flex-col gap-4 border-t border-border px-6 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <BrandSignature href="#home" compact />
        <a href="#home" className="transition-colors hover:text-foreground">Back to top ↑</a>
      </footer>
    </main>
  )
}

export default App
