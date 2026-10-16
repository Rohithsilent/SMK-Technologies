import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  BrainCircuit,
  PanelsTopLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import BrandSignature from "@/components/BrandSignature"
import RoadmapExplorer from "./RoadmapExplorer"

export type RoadmapStage = {
  title: string
  focus: string
  practice: string
  outcome: string
}

export type RoadmapCheckpoint = {
  question: string
  options: string[]
  answer: number
  explanation: string
}

type Program = {
  slug: string
  code: string
  name: string
  shortName: string
  icon: typeof Code2
  intro: string
  promise: string
  audience: string
  prerequisites: string
  skills: string[]
  stages: RoadmapStage[]
  checkpoints: RoadmapCheckpoint[]
  project: string
}

const programs: Program[] = [
  {
    slug: "dsa",
    code: "01 / PROBLEM SOLVING",
    name: "Data structures & algorithms",
    shortName: "DSA",
    audience: "Students preparing for coding interviews.",
    prerequisites: "Basic coding: variables, loops, and functions.",
    icon: Code2,
    intro: "Learn to turn a problem you have never seen into one you know how to solve.",
    promise: "Build a repeatable way to reason about problems, choose the right structures, and explain your decisions clearly.",
    skills: ["Reasoning patterns", "Complexity analysis", "Code clarity"],
    stages: [
      { title: "Problem-solving basics", focus: "Read constraints, make examples, and estimate complexity.", practice: "Trace two approaches by hand.", outcome: "Plan before you code." },
      { title: "Arrays, strings & hashing", focus: "Use maps, sets, prefix sums, and two pointers.", practice: "Solve lookup, counting, and window problems.", outcome: "Choose a scan or hash lookup." },
      { title: "Stacks, queues & linked lists", focus: "Learn ordering, traversal, and pointer changes.", practice: "Solve bracket, queue, and list exercises.", outcome: "Match a structure to the task." },
      { title: "Trees, heaps & search", focus: "Explore traversals, binary search, and priority queues.", practice: "Trace a tree and search an ordered range.", outcome: "Break a problem into smaller steps." },
      { title: "Graphs & dynamic programming", focus: "Model connections, paths, states, and subproblems.", practice: "Solve a grid path and a sequence problem.", outcome: "Describe states and transitions." },
      { title: "Interview practice & capstone", focus: "Combine patterns and explain trade-offs.", practice: "Solve a timed set and review your approach.", outcome: "A problem notebook with clear solutions." },
    ],
    checkpoints: [
      { question: "You have a problem prompt and no clear approach yet. What is the best first move?", options: ["Start coding immediately", "Write down inputs, outputs, constraints, and a small example", "Choose the most advanced data structure you know"], answer: 1, explanation: "Small examples and constraints make hidden assumptions visible before implementation." },
      { question: "You need to quickly check whether a value has appeared before. Which tool is a natural fit?", options: ["A hash set", "A stack", "A queue"], answer: 0, explanation: "A hash set is designed for membership checks and is typically constant time on average." },
      { question: "When matching opening and closing brackets, which structure follows the needed order?", options: ["Queue: first in, first out", "Stack: last in, first out", "Array sorted by value"], answer: 1, explanation: "The most recent opening bracket must be matched first, which is last-in, first-out behavior." },
      { question: "What must be true before ordinary binary search can be used?", options: ["The search space is ordered", "Every value is unique", "The input is a linked list"], answer: 0, explanation: "Binary search uses ordering to discard half of the remaining search space each step." },
      { question: "In an unweighted graph, which traversal finds a shortest path by number of edges?", options: ["Depth-first search", "Breadth-first search", "In-order traversal"], answer: 1, explanation: "Breadth-first search explores one distance layer at a time, so the first visit gives the fewest edges." },
      { question: "A solution passes the sample cases. What is a useful next check?", options: ["Stop; sample cases prove it", "Try edge cases and explain its complexity", "Rewrite it in a different language"], answer: 1, explanation: "Edge cases and complexity analysis reveal correctness and performance issues that samples can miss." },
    ],
    project: "A curated problem notebook: each solution includes the idea, complexity, edge cases, and a cleaner second pass.",
  },
  {
    slug: "web-development",
    code: "02 / BUILD FOR THE WEB",
    name: "Web development",
    shortName: "Web Dev",
    audience: "Beginners who want to build web projects.",
    prerequisites: "No prior web development needed.",
    icon: PanelsTopLeft,
    intro: "Go from the first web page to a useful product you can share with someone else.",
    promise: "Learn how the browser turns structure, style, and code into interfaces, then build and refine a complete project.",
    skills: ["Frontend foundations", "Responsive UI", "Project workflow"],
    stages: [
      { title: "Web foundations", focus: "Learn HTML structure, browsers, and accessible landmarks.", practice: "Build a linked profile page.", outcome: "A clear, semantic page." },
      { title: "CSS & responsive layout", focus: "Use typography, Flexbox, Grid, and breakpoints.", practice: "Adapt an event page for phone and desktop.", outcome: "A layout that works across screens." },
      { title: "JavaScript interaction", focus: "Use functions, events, and DOM updates.", practice: "Build a task list with filters.", outcome: "A page that responds to people." },
      { title: "React interfaces", focus: "Compose components, props, and state.", practice: "Make a catalog searchable.", outcome: "A reusable interface." },
      { title: "Data & forms", focus: "Handle input, loading, and empty states.", practice: "Add a validated enquiry form.", outcome: "Clear feedback when data changes." },
      { title: "Polish & publish", focus: "Review access, screen sizes, and deployment.", practice: "Present your capstone project.", outcome: "A project ready to share." },
    ],
    checkpoints: [
      { question: "Which HTML element gives the main content a useful landmark?", options: ["<main>", "<span>", "<b>"], answer: 0, explanation: "The main element identifies the page's primary content for browsers and assistive technology." },
      { question: "Which CSS layout is designed for placing items in rows and columns?", options: ["Grid", "text-align", "font-weight"], answer: 0, explanation: "CSS Grid defines a two-dimensional layout with rows and columns." },
      { question: "What makes a task list respond when someone selects its Add button?", options: ["A click event handler", "A larger heading", "A CSS color token"], answer: 0, explanation: "A click handler runs logic in response to a user's action." },
      { question: "In React, where should a reusable component receive its changing display data?", options: ["Props", "The CSS border", "The browser address bar"], answer: 0, explanation: "Props pass values into a component so the same UI can render different data." },
      { question: "What should a well-designed form do after an invalid submission?", options: ["Clear the entered values", "Explain what needs correction and keep the user's input", "Silently do nothing"], answer: 1, explanation: "Specific guidance and preserved input make recovery straightforward." },
      { question: "What is a valuable final check before sharing a website?", options: ["Check small screens and keyboard navigation", "Only check the designer's monitor", "Remove all link focus styles"], answer: 0, explanation: "Responsive layout and keyboard access catch issues that a single desktop pointer check cannot." },
    ],
    project: "A responsive campus resource hub with searchable content, a useful form, and thoughtful empty and success states.",
  },
  {
    slug: "machine-learning",
    code: "03 / LEARN FROM DATA",
    name: "Machine learning",
    shortName: "Machine Learning",
    audience: "Students curious about data and predictive models.",
    prerequisites: "Python basics; algebra is helpful.",
    icon: BrainCircuit,
    intro: "Understand what a model learns, where it can go wrong, and how to use it thoughtfully.",
    promise: "Build intuition from data and evaluation first, then train and explain a small model with a clear purpose.",
    skills: ["Python & data", "Model intuition", "Evaluation"],
    stages: [
      { title: "Python & data", focus: "Use notebooks, Python basics, and structured data.", practice: "Explore a small public dataset.", outcome: "A notebook that describes the data." },
      { title: "Understand a dataset", focus: "Check distributions, missing values, and features.", practice: "Summarize data and note assumptions.", outcome: "Know what the data can show." },
      { title: "Model fundamentals", focus: "Learn features, labels, training, and prediction.", practice: "Train a simple baseline model.", outcome: "Explain a model’s first predictions." },
      { title: "Evaluate results", focus: "Split data, choose metrics, and spot overfitting.", practice: "Compare predictions with held-out data.", outcome: "Measure performance on unseen examples." },
      { title: "Improve & interpret", focus: "Review errors, features, and model limits.", practice: "Find examples the model gets wrong.", outcome: "Describe strengths and limitations." },
      { title: "Capstone & responsible use", focus: "Connect the question, data, method, and evaluation.", practice: "Present a notebook and one failure case.", outcome: "A documented end-to-end project." },
    ],
    checkpoints: [
      { question: "In a supervised learning dataset, what is the target?", options: ["The value the model is learning to predict", "The notebook's filename", "The row number"], answer: 0, explanation: "The target (or label) is the outcome a supervised model learns to predict." },
      { question: "When should you fit a preprocessing step such as scaling?", options: ["Using training data, then apply it to held-out data", "On all data before splitting", "Only on the test set"], answer: 0, explanation: "Fitting on training data only avoids leaking information from evaluation data into training." },
      { question: "A model predicts whether an image contains a cat or a dog. What kind of task is this?", options: ["Classification", "Sorting", "Clustering by hand"], answer: 0, explanation: "The model chooses among named categories, which is classification." },
      { question: "Why keep a test set out of model training?", options: ["To estimate performance on unseen examples", "To make the dataset larger", "To remove the need for metrics"], answer: 0, explanation: "A held-out test set gives a less biased check of how the trained model may generalize." },
      { question: "A model scores very well on training data and much worse on validation data. What might be happening?", options: ["Overfitting", "Perfect generalization", "The labels disappeared"], answer: 0, explanation: "The model may have learned training-specific patterns that do not generalize." },
      { question: "What belongs in a responsible model presentation?", options: ["Only the best score", "Evaluation, important failure cases, and limitations", "A claim that the model is always correct"], answer: 1, explanation: "A useful presentation makes evidence and limitations clear so results are not overstated." },
    ],
    project: "A documented prediction project with an understandable baseline, evaluation, error review, and limitations.",
  },
]

export function getProgramForPath(pathname: string) {
  return programs.find((program) => pathname === `/programs/${program.slug}`)
}

function SiteHeader() {
  return (
    <header className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-8">
      <BrandSignature href="/#home" />
      <nav className="liquid-glass flex items-center justify-center gap-5 rounded-full px-5 py-3 sm:gap-7 sm:px-7" aria-label="Main navigation">
        <a href="/#programs" className="min-h-6 text-center text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm">Programs</a>
        <a href="/#approach" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground lg:inline">How it works</a>
        <a href="/#campus" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground lg:inline">For colleges</a>
      </nav>
      <Button asChild variant="glass" className="hidden rounded-full px-5 lg:inline-flex">
        <a href="/#contact">Talk to us <ArrowUpRight aria-hidden="true" /></a>
      </Button>
    </header>
  )
}

export default function ProgramPage({ program }: { program: Program }) {
  const Icon = program.icon

  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <section className="relative isolate flex min-h-[78svh] flex-col bg-background">
        <video className="hero-video absolute inset-0 z-0 h-full w-full object-cover" autoPlay loop muted playsInline preload="metadata" aria-hidden="true" tabIndex={-1}>
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" type="video/mp4" />
        </video>
        <SiteHeader />
        <div className="hero-copy relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-20 pt-14 sm:px-10">
          <a href="/#programs" className="mb-12 flex w-fit items-center gap-2 text-xs text-foreground/75 transition-colors hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" /> All programs</a>
          <p className="animate-fade-rise mb-5 flex items-center gap-3 font-body text-[10px] uppercase tracking-[.22em] text-foreground/80"><Icon className="size-4" aria-hidden="true" /> {program.code}</p>
          <h1 className="animate-fade-rise max-w-5xl text-[clamp(2.75rem,8vw,6rem)] font-normal leading-[.96] tracking-[-.04em]" style={{ fontFamily: "'Instrument Serif', serif" }}>{program.name}</h1>
          <p className="animate-fade-rise-delay mt-7 max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-lg">{program.intro}</p>
          <div className="animate-fade-rise-delay-2 mt-10 flex flex-wrap items-center gap-3">
            <Button asChild variant="glass" size="lg" className="rounded-full"><a href="#roadmap">Explore the roadmap <ArrowDown aria-hidden="true" /></a></Button>
            <span className="text-[10px] uppercase tracking-[.15em] text-foreground/70">A guided path · Practice at every step</span>
          </div>
        </div>
        <p className="relative z-10 mx-auto mb-6 w-full max-w-7xl px-6 text-[9px] uppercase tracking-[.2em] text-foreground/60 sm:px-10">SMK learning paths <span className="px-2">/</span> {program.shortName}</p>
      </section>

      <section className="border-t border-border/80 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[.8fr_1.2fr] md:gap-20">
          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[.22em] text-muted-foreground">What you’ll build toward</p>
            <h2 className="font-display text-4xl leading-[.98] tracking-tight sm:text-5xl">A skill you can<br /><em className="not-italic text-muted-foreground">take with you.</em></h2>
          </div>
          <div>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground">{program.promise}</p>
            <ul className="mt-8 flex flex-wrap gap-3" aria-label="Skills covered">
              {program.skills.map((skill) => <li key={skill} className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-foreground/85"><Check className="size-3.5 text-muted-foreground" aria-hidden="true" />{skill}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <RoadmapExplorer stages={program.stages} checkpoints={program.checkpoints} programName={program.shortName} audience={program.audience} prerequisites={program.prerequisites} />

      <section className="border-t border-border/80 px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center md:gap-20">
          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[.22em] text-muted-foreground">Put the pieces together</p>
            <h2 className="font-display text-5xl leading-[.98] tracking-tight sm:text-6xl">Finish with<br /><em className="not-italic text-muted-foreground">something real.</em></h2>
          </div>
          <div className="border-l border-border pl-6 sm:pl-8">
            <p className="text-[10px] uppercase tracking-[.2em] text-muted-foreground">Your capstone direction</p>
            <p className="mt-5 text-lg leading-8 text-foreground/90">{program.project}</p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">Use it to connect the concepts, get feedback, and practice explaining the choices you made.</p>
          </div>
        </div>
      </section>

      <section className="border-t border-border/80 bg-secondary/50 px-6 py-20 sm:px-10 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="mb-4 text-[10px] uppercase tracking-[.22em] text-muted-foreground">Curious about {program.shortName}?</p><h2 className="font-display text-4xl leading-tight sm:text-5xl">Find your first step.</h2><p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">Ask about the training, the level, or how the roadmap can fit your college schedule.</p></div>
          <Button asChild variant="glass" size="lg" className="w-fit rounded-full"><a href="/#contact">Start a conversation <ArrowRight aria-hidden="true" /></a></Button>
        </div>
      </section>

      <footer className="flex flex-col gap-4 border-t border-border px-6 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <BrandSignature href="/#home" compact /><a href="/#programs" className="flex items-center gap-2 transition-colors hover:text-foreground"><ArrowLeft className="size-3" aria-hidden="true" />All learning paths</a><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) }} className="transition-colors hover:text-foreground">Back to top ↑</a>
      </footer>
    </main>
  )
}
