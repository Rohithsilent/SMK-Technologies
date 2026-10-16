import { useEffect, useState, type FormEvent } from "react"
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  Code2,
  Menu,
  PanelsTopLeft,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import BrandSignature from "@/components/BrandSignature"
import ProgramPage, { getProgramForPath } from "./ProgramPage"

const videoSource =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"

const programs = [
  {
    slug: "dsa",
    name: "Data structures & algorithms",
    code: "DSA",
    icon: Code2,
    description: "Problem-solving patterns, made practical.",
  },
  {
    slug: "web-development",
    name: "Web development",
    code: "WEB",
    icon: PanelsTopLeft,
    description: "From your first page to a finished project.",
  },
  {
    slug: "machine-learning",
    name: "Machine learning",
    code: "ML",
    icon: BrainCircuit,
    description: "Explore data. Understand how models learn.",
  },
]

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
    ? "Feedback or course suggestion"
    : requestedInterest === "campus"
      ? "Campus training / college collaboration"
      : ""

  useEffect(() => {
    document.title = programPage
      ? `${programPage.shortName} learning roadmap | SMK Technologies`
      : "SMK Technologies | Practical tech training for campus"
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
    const subject = `SMK Technologies enquiry — ${String(formData.get("interest"))}`
    const body = [
      `Name: ${String(formData.get("name"))}`,
      `Reply email: ${String(formData.get("email"))}`,
      `Topic: ${String(formData.get("interest"))}`,
      `Message: ${String(formData.get("note") || "(no additional note)")}`,
    ].join("\n")
    setFormMessage("Your email app should open with your enquiry addressed to SMK Technologies.")
    window.location.href = `mailto:localboy0909@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  if (programPage) return <ProgramPage program={programPage} />

  return (
    <main className="overflow-x-clip bg-background text-foreground">
      <section id="home" className="relative isolate flex min-h-svh flex-col bg-background">
        <video
          className="hero-video absolute inset-0 z-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={videoSource} type="video/mp4" />
        </video>

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
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="min-h-11 rounded-xl px-4 py-3 text-sm text-foreground transition-colors hover:bg-white/10"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#programs"
                onClick={() => setMenuOpen(false)}
                className="min-h-11 rounded-xl px-4 py-3 text-sm text-foreground transition-colors hover:bg-white/10"
              >
                Explore programs <ArrowUpRight className="ml-1 inline size-4" aria-hidden="true" />
              </a>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="min-h-11 rounded-xl px-4 py-3 text-sm text-foreground transition-colors hover:bg-white/10"
              >
                Get in touch <ArrowUpRight className="ml-1 inline size-4" aria-hidden="true" />
              </a>
            </nav>
          )}
        </header>

        <div className="hero-copy relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-start px-6 pb-24 pt-[clamp(3rem,10vh,7rem)] text-center sm:px-8 sm:pb-32">
          <p className="animate-fade-rise mb-6 font-body text-[10px] uppercase tracking-[.25em] text-foreground/80 sm:text-xs">
            Practical tech training · Made for campus
          </p>
          <h1
            className="animate-fade-rise max-w-7xl text-[clamp(2.5rem,8.5vw,6rem)] font-normal leading-[.95] tracking-[-.04em] text-foreground"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Where <em className="not-italic text-muted-foreground">curiosity</em><br className="hidden sm:block" /> finds its way into <em className="not-italic text-muted-foreground">code.</em>
          </h1>
          <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Practical training in DSA, web development, and machine learning.
          </p>
        </div>
      </section>

      <section id="programs" className="border-t border-border/80 px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[.22em] text-muted-foreground">Find your path</p>
            <h2 className="font-display text-5xl leading-[.98] tracking-tight sm:text-6xl">Pick a thread.<br /><em className="not-italic text-muted-foreground">Go deeper.</em></h2>
          </div>
          <div>
            {programs.map((program) => {
              const Icon = program.icon
              return (
                <a href={`/programs/${program.slug}`} key={program.code} className="course-row group grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-6 sm:grid-cols-[5rem_1fr_auto] sm:gap-6">
                  <span className="font-body text-[10px] tracking-[.12em] text-muted-foreground">{program.code}</span>
                  <div>
                    <h3 className="font-display text-2xl leading-tight sm:text-3xl">{program.name}</h3>
                    <p className="mt-2 max-w-xl text-xs leading-6 text-muted-foreground sm:text-sm">{program.description}</p>
                  </div>
                  <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-foreground" aria-hidden="true" />
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <section id="approach" className="border-t border-border/80 bg-secondary/40 px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-4 sm:grid-cols-[.8fr_1.2fr] sm:items-end sm:gap-10">
            <div>
              <p className="mb-4 text-[10px] uppercase tracking-[.22em] text-path-accent">How a learning block works</p>
              <h2 className="max-w-md font-display text-4xl leading-[1.02] sm:text-5xl">Understand it.<br />Use it. <em className="not-italic text-muted-foreground">Explain it.</em></h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">Each topic moves from a clear explanation to active practice, then a review of the choices behind the solution.</p>
          </div>
          <ol className="learning-loop">
            <li><span className="learning-loop-index">01 <ArrowRight aria-hidden="true" /></span><h3>Make the idea clear</h3><p>Start with the concept and a worked example you can trace.</p></li>
            <li><span className="learning-loop-index">02 <ArrowRight aria-hidden="true" /></span><h3>Put it to work</h3><p>Try a related problem or build, with room to ask questions.</p></li>
            <li><span className="learning-loop-index">03 <Check aria-hidden="true" /></span><h3>Review the reasoning</h3><p>Check the result, compare approaches, and choose a useful next step.</p></li>
          </ol>
        </div>
      </section>

      <section id="campus" className="border-t border-border/80 bg-background px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-20">
          <div>
            <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[.22em] text-path-accent"><span className="h-px w-8 bg-path-accent" aria-hidden="true" />For colleges & student groups</p>
            <h2 className="max-w-xl font-display text-5xl leading-[.98] tracking-tight sm:text-6xl">Make the path fit<br /><em className="not-italic text-muted-foreground">your campus.</em></h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">Starting a campus conversation? Bring a few details so the training discussion can begin with your students, not a one-size-fits-all pitch.</p>
          </div>
          <div>
            <ol className="campus-brief">
              <li><span>01</span><div><h3>Your cohort</h3><p>Which students, year, or starting level?</p></div></li>
              <li><span>02</span><div><h3>The skill to focus on</h3><p>DSA, web development, machine learning, or another goal?</p></div></li>
              <li><span>03</span><div><h3>Your campus context</h3><p>What schedule or learning priorities should we know about?</p></div></li>
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
            <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[.22em] text-path-accent"><span className="h-px w-8 bg-path-accent" aria-hidden="true" />Start a conversation</p>
            <h2 className="max-w-lg font-display text-5xl leading-[.98] tracking-tight sm:text-6xl">What are you<br />curious <em className="not-italic text-muted-foreground">about?</em></h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">Ask about a learning path, campus training, or share feedback. A little context helps make the first conversation useful.</p>
          </div>
          <form className="contact-form grid gap-x-5 gap-y-5 rounded-3xl border border-white/10 bg-background/55 p-5 sm:grid-cols-2 sm:p-8 lg:p-10" onSubmit={handleSubmit}>
            <div className="contact-form-heading sm:col-span-2">
              <p className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">A few details</p>
              <p className="mt-2 font-display text-3xl leading-tight sm:text-4xl">Let’s make it specific.</p>
            </div>
            <div className="grid gap-2">
              <label htmlFor="student-name" className="text-xs text-foreground/80">Your name</label>
              <input className="form-control" id="student-name" name="name" autoComplete="name" placeholder="e.g. Alex Kumar" required />
            </div>
            <div className="grid gap-2">
              <label htmlFor="student-email" className="text-xs text-foreground/80">Email address</label>
              <input className="form-control" id="student-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <label htmlFor="student-interest" className="text-xs text-foreground/80">What’s on your mind?</label>
              <select className="form-control" id="student-interest" name="interest" defaultValue={defaultInterest} required>
                <option value="" disabled>Choose a topic</option>
                <option value="Data structures & algorithms">Data structures & algorithms</option>
                <option value="Web development">Web development</option>
                <option value="Machine learning">Machine learning</option>
                <option value="Campus training / college collaboration">Campus training / college collaboration</option>
                <option value="Something else">Something else</option>
                <option value="Feedback or course suggestion">Feedback or course suggestion</option>
              </select>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <label htmlFor="student-note" className="text-xs text-foreground/80">A little context <span className="text-muted-foreground">· optional</span></label>
              <textarea className="form-control resize-none" id="student-note" name="note" placeholder="What would you like to learn, build, or improve?" />
            </div>
            <Button type="submit" variant="default" className="w-full justify-between rounded-xl bg-path-accent px-5 py-3 text-background hover:bg-path-accent/90 sm:col-span-2">
              Continue in email <ArrowUpRight aria-hidden="true" />
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
