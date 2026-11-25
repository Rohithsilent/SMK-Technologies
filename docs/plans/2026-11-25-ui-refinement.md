# SMK TechVora Production-Grade UI Refinement Plan

**Goal:** Implement the approved Jasper + Apple/Netflix-grade UI refinement across all components of SMK TechVora while keeping zero extra runtime dependencies.

**Architecture:** Extract modular interactive sections (`ApproachShowcase`, `CampusBlueprint`, `SiteFooter`) and lightweight motion/a11y hooks (`src/hooks/useMotion.ts`), unify button and hairline surface tokens in `src/index.css` and `src/components/ui/button.tsx`, fix client-side SPA routing across all links, optimize `CelestialAtmosphere` single-stream video + poster loading, and upgrade `RoadmapExplorer` with softened blueprint connectors, active-stage scroll-spy, animated focus-trapped drawer, and exploratory self-check.

---

### Task 1: Typography, Token Polish & Unified Button Variants

**Files:**
- Modify: `index.html`
- Modify: `src/components/ui/button.tsx`
- Modify: `src/context/ThemeContext.tsx`
- Modify: `src/index.css`

**Step 1: Load Inter `700` weight in `index.html`**
Update Google Fonts `<link>` in `index.html` line 10:
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

**Step 2: Fix `ThemeContext.tsx` timer cleanup**
Replace `useCallback` timer leak in `src/context/ThemeContext.tsx` with a `useRef<number | null>(null)` cleared on unmount and rapid toggles:
```ts
const transitionTimerRef = useRef<number | null>(null)

useEffect(() => {
  return () => {
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current)
    }
  }
}, [])

const toggleTheme = useCallback(() => {
  if (isTransitioning) return
  const nextTheme: Theme = theme === "dark" ? "light" : "dark"
  setIsTransitioning(true)
  setThemeState(nextTheme)
  localStorage.setItem(STORAGE_KEY, nextTheme)
  transitionTimerRef.current = window.setTimeout(() => {
    setIsTransitioning(false)
    transitionTimerRef.current = null
  }, TRANSITION_DURATION)
}, [theme, isTransitioning])
```

**Step 3: Move button styling cleanly into `src/components/ui/button.tsx`**
Refactor `buttonVariants` so `default` and `glass` natively carry the Midnight Navy / White / Coral hover & active press physics (`active:scale-[0.98]`), eliminating `!important` rules in `src/index.css`:
```tsx
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[4px] font-medium transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-transparent hover:-translate-y-px hover:bg-[#FA4028] hover:text-white hover:shadow-[0_10px_26px_-4px_rgba(250,64,40,0.38)]",
        glass:
          "border border-indigo-200/30 bg-[#070D36]/65 text-[#F8FAFC] backdrop-blur-md hover:border-[#FA4028] hover:bg-[#FA4028]/14 hover:text-[#FF8573] light:border-[#00063D]/30 light:bg-white/85 light:text-[#00063D] light:hover:border-[#FA4028] light:hover:bg-[#FEDED0] light:hover:text-[#B82411]",
        ghost: "text-foreground hover:bg-foreground/[0.08]",
      },
      size: {
        default: "h-10 px-5 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "min-h-13 px-8 text-sm sm:px-10 sm:py-4 sm:text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)
```
*(Note: Ensure Tailwind v4 `[data-theme="light"]` CSS rules or `@custom-variant light (&:where([data-theme="light"], [data-theme="light"] *));` are defined in `src/index.css` so `light:` utilities work reliably, or keep `.btn-primary` / `.btn-secondary` non-`!important` classes in `src/index.css`.)*

**Step 4: Refine `.platform-card` hairlines and micro-typography in `src/index.css`**
- Remove `!important` overrides from `.hero-btn-primary` and `.hero-btn-secondary`.
- Keep `.platform-card { border-radius: 0px; }` and replace `[data-theme="light"] .platform-card` border `rgba(0, 6, 61, 0.72)` with crisp `rgba(0, 6, 61, 0.16)`, adding subtle top specular highlight `box-shadow: inset 0 1px 0 rgba(255,255,255,0.85), 0 1px 2px rgba(0,6,61,0.04)` in light mode and `inset 0 1px 0 rgba(255,255,255,0.08)` in dark mode.
- Remove `text-decoration: underline` from `.platform-card:hover .platform-card-footer p`.

**Step 5: Verify build**
Run: `npm run build`
Expected: PASS with zero TypeScript or Vite CSS errors.

---

### Task 2: Lightweight Motion & Accessibility Hooks

**Files:**
- Create: `src/hooks/useMotion.ts`

**Step 1: Create `src/hooks/useMotion.ts`**
Implement three zero-dependency hooks that automatically respect `prefers-reduced-motion: reduce`:
1. `usePrefersReducedMotion()`: subscribes to `window.matchMedia("(prefers-reduced-motion: reduce)")`.
2. `useScrollY()` / `useParallaxOffset(factor)`: throttled via `requestAnimationFrame` for 60fps hero/section parallax without React state churn (updates CSS custom property `--parallax-y` on a ref element directly!).
3. `useMagneticHover(strength = 6)`: attaches `pointermove` / `pointerleave` to a ref on fine-pointer devices (`matchMedia("(pointer: fine)")`), updating `--mag-x` and `--mag-y` CSS vars cleanly.
4. `useFocusTrap(active, containerRef, onEscape)`: traps `Tab`/`Shift+Tab` inside an open modal/drawer, moves initial focus to the container or close button, handles `Escape`, and restores focus to `document.activeElement` on close.

**Step 2: Verify TypeScript compilation**
Run: `npx tsc --noEmit`
Expected: PASS.

---

### Task 3: Scroll-Reactive `SiteHeader`, Crisp `BrandSignature`, Calmed `ThemeToggle` & Optimized `CelestialAtmosphere`

**Files:**
- Modify: `src/components/SiteHeader.tsx`
- Modify: `src/components/BrandSignature.tsx`
- Modify: `src/components/ThemeToggle.tsx`
- Modify: `src/components/CelestialAtmosphere.tsx`
- Modify: `src/index.css`

**Step 1: Upgrade `BrandSignature.tsx`**
Accept optional `onNavigate?: (path: string) => void`. Raise the sub-label minimum size from `text-[6.5px] sm:text-[8px]` to legible `text-[10px] tracking-[0.14em]` (`TechVora`) and clean up the spacing so it renders crisply on both mobile and retina desktop.

**Step 2: Calm `ThemeToggle.tsx`**
Refine hover feedback so the shuttle keeps clean monochrome/navy contrast without jarring coral/blue icon flashes, preserving the tactile horizon sweep animation.

**Step 3: Upgrade `SiteHeader.tsx`**
- Add `onNavigate?: (path: string) => void` prop for SPA navigation across Home, `#programs`, `#approach`, `#campus`, and `#contact`.
- Track `scrolled` (`window.scrollY > 24`) via passive scroll listener + `activeSection` via `IntersectionObserver` on `["home", "programs", "approach", "campus", "contact"]` when `mode === "home"`.
- Transition `.site-header` from transparent at `y = 0` to `is-scrolled` frosted `backdrop-blur-xl` with a crisp `1px` bottom hairline.
- Replace `{menuOpen && ...}` with an always-mounted animated mobile sheet + dimmed backdrop (`pointer-events-none opacity-0` when closed, smooth slide/fade when open), `Escape` close, outside-click close, and `useFocusTrap`.

**Step 4: Optimize `CelestialAtmosphere.tsx`**
- Add `poster="/night-hero-frame.png"` to the night video and `poster="/day-time-poster.jpg"` to the day video.
- Render **only the active theme's video element** (keyed by theme, or switch `preload` + `pause()` on inactive) unless `prefersReducedMotion` is true, in which case render the static crisp `<img>` poster instead of autoplaying video.
- Apply subtle `--parallax-y` transform from `useParallaxOffset` to the atmosphere container for Netflix/Apple depth on scroll.

**Step 5: Verify build**
Run: `npm run build`
Expected: PASS.

---

### Task 4: Innovative Home Sections (`ApproachShowcase`, `CampusBlueprint`, `SiteFooter`) & Home `App.tsx`

**Files:**
- Create: `src/components/ApproachShowcase.tsx`
- Create: `src/components/CampusBlueprint.tsx`
- Create: `src/components/SiteFooter.tsx`
- Modify: `src/App.tsx`
- Modify: `src/index.css`

**Step 1: Build `src/components/ApproachShowcase.tsx`**
Interactive 3-stage live-loop showcase for `#approach`:
- Left column: clickable 3-step selector (`01 Concept from scratch`, `02 Live hands-on practice`, `03 Interview-ready thinking`) with clear `aria-pressed` / `tablist` semantics and smooth active indicator bar.
- Right column: sharp `0px`-corner architectural preview frame updating smoothly between:
  - Stage 01: Visual array + two-pointer dry-run diagram (`i=0, j=4 → target found`).
  - Stage 02: Interactive Brute Force `O(N²)` vs Hash Map `O(N)` code diff toggle.
  - Stage 03: Interview rubric card (Time complexity, Space trade-off, Edge cases verified).

**Step 2: Build `src/components/CampusBlueprint.tsx`**
Interactive Batch Blueprint Selector for `#campus`:
- Accept `onSelectBatch: (batchLabel: string) => void`.
- Tabs for `2nd Year Foundation`, `3rd Year Placement Prep`, and `Final Year Sprint`.
- Displays batch focus tracks, recommended schedule format, and practical deliverables inside a crisp `0px` architectural panel, plus a `"Discuss this batch"` CTA button that scrolls to `#contact` and prefills the contact form.

**Step 3: Build `src/components/SiteFooter.tsx`**
Clean 3-column directory footer:
- Col 1: `BrandSignature` + concise campus training statement.
- Col 2: Direct SPA links to all 4 programs (`Python`, `DSA`, `Full-Stack Web`, `AI & ML`).
- Col 3: Home section links (`Programs`, `How it works`, `For colleges`, `Contact`) + `Back to top ↑`.

**Step 4: Wire everything in `src/App.tsx`**
- Add unified `navigate(to: string)` helper handling both `/programs/:slug` and `/#section` / `/?...#contact` without full-page reloads.
- Wire `navigateToProgram` onto all 4 `.platform-card` elements + add magnetic hover refs and concise track metadata strips (`Duration · Scope`).
- Add a clean bottom `"Scroll to explore"` cue in the Hero (`#home`).
- Connect `ApproachShowcase`, `CampusBlueprint` (passing prefill state to `#contact`), and `SiteFooter`.
- Enhance `#contact` form with inline validation feedback and a **"Copy enquiry text"** button in the status bar after submit.

**Step 5: Verify build**
Run: `npm run build`
Expected: PASS.

---

### Task 5: `ProgramPage` SPA Polish & `RoadmapExplorer` Apple Sheet Drawer

**Files:**
- Modify: `src/ProgramPage.tsx`
- Modify: `src/RoadmapExplorer.tsx`
- Modify: `src/index.css`

**Step 1: Fix SPA navigation in `src/ProgramPage.tsx`**
Accept `onNavigate: (path: string) => void` and pass it to `SiteHeader`, `BrandSignature`, `"All programs"` link, and `RoadmapExplorer` so returning home or jumping to `#contact` never triggers a hard reload.

**Step 2: Soften Blueprint Connectors & Add Toolbar Scroll-Spy in `src/RoadmapExplorer.tsx` & `src/index.css`**
- Mute resting connector hairlines (`--connector-line`, `--spine-line`) and remove constant bright `#FA4028` dashed crossbars; add `.is-stage-active` / `:hover` illumination so only the focused stage path lights up in Coral `#FA4028`.
- Add `IntersectionObserver` tracking `activeStageId` so the toolbar `Stage 01..N` jump pills highlight the stage currently on screen.
- Display live search match count badge (`X matching nodes`) beside the search input when `query.trim().length > 0`.

**Step 3: Animate & Accessible-Harden the Inspector Drawer**
- Keep the drawer mounted or manage `isClosing` state so backdrop fade + `translateX` slide transition play cleanly on both open and close.
- Attach `useFocusTrap(Boolean(selection), drawerRef, () => setSelection(null))` and store/restore focus to the clicked node.
- Add `ArrowLeft` / `ArrowRight` keyboard listeners inside the open topic drawer to step between `Previous Topic` and `Next Topic`.
- Add an **Exploratory Self-Check** collapsible card inside the topic view (`"Quick Self-Check"` button revealing a reflection prompt + key verification answer derived from `activeTopic.keyPoints[0]` and `activeTopic.practicalTip`, with zero saved progress or checkboxes).

**Step 4: Update `DESIGN.md`**
Update `DESIGN.md` to document the finalized Jasper + Apple/Netflix dual-theme tokens, sharp card/control geometry, interactive `#approach` and `#campus` sections, and exploratory drawer behavior.

**Step 5: Final Build & Browser Verification**
1. Run `npm run build` (`tsc -b && vite build`) — verify zero errors.
2. Start `npm run preview` (or `npm run dev`) and inspect in browser across Desktop (`1440×900`) and Mobile (`390×844`) in both **Dark** and **Light** modes:
   - Verify instant hero poster paint + single active video stream.
   - Verify scroll-reactive header, scroll-spy, and magnetic card hover.
   - Test SPA navigation from Home cards → `/programs/dsa` → `"All programs"` → Home without page reload.
   - Test `ApproachShowcase` tabs, `CampusBlueprint` selector → `"Discuss this batch"` prefill into `#contact`, and `"Copy enquiry text"`.
   - Test `RoadmapExplorer` search match counter, stage scroll-spy, drawer slide animation, focus trap, `ArrowLeft`/`ArrowRight` stepping, `Escape` focus restoration, and exploratory self-check toggle.
