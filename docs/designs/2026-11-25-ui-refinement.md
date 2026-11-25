# SMK TechVora — Production-Grade UI Refinement Design

**Date:** 2026-11-25  
**Status:** Approved  
**Goal:** Elevate every UI component of SMK TechVora to Jasper AI editorial refinement fused with Apple and Netflix production-grade craft, without sacrificing bundle speed or authentic campus-training focus.

---

## 1. Visual Identity & Design System

- **Theme Hierarchy**: Cinematic Dark (`#020624` Midnight Navy) loads by default for Netflix/Apple atmospheric hero depth; Jasper Editorial Light (`#FFFFFF` + `#00063D` Deep Navy + `#FCF6F3` Soft Peach) remains toggleable via `ThemeContext`. Both themes share Coral (`#FA4028`) and Electric Blue (`#0A84FF` / `#1D8CFF`) accents.
- **Pure Jasper Editorial Sharpness**:
  - Keep `0px` sharp corners on `.platform-card` and `4px` on interactive buttons, inputs, tabs, and roadmap nodes.
  - Soften heavy `rgba(0, 6, 61, 0.72)` light-mode card borders into refined `1px` hairlines (`rgba(0, 6, 61, 0.16)` resting, `#FA4028` active/hover) with subtle inner specular highlights (`inset 0 1px 0`) and layered elevation shadows.
  - Remove `text-decoration: underline` from `.platform-card:hover .platform-card-footer p`.
- **Typography & Button Primitives**:
  - Load `Inter:wght@400;500;600;700` alongside `Instrument Serif` in `index.html`.
  - Raise micro-copy floors from `6.5px–10px` to `11px` (`0.6875rem`) minimum for crisp optical rendering.
  - Consolidate `.hero-btn-primary` and `.hero-btn-secondary` into `src/components/ui/button.tsx` CVA variants (removing `!important` overrides) with `active:scale-[0.98]` press physics and optional magnetic pointer micro-tracking.
- **Documentation Alignment**: Update `DESIGN.md` so the documented tokens, dual-theme architecture, and interactive sections match the runtime system.

---

## 2. Navigation, Brand Lockup, Theme Toggle & Hero Cinema

- **Scroll-Reactive `SiteHeader.tsx`**:
  - Start near-transparent at `scrollY < 24` over the hero video; condense smoothly into a `backdrop-blur-xl` frosted bar with a hairline bottom border upon scrolling.
  - Add `Programs` (`#programs`) to the nav alongside `How it works` (`#approach`) and `For colleges` (`#campus`), powered by `IntersectionObserver` scroll-spy on Home and active track awareness on `ProgramPage`.
  - Route Home/Section/Program clicks through client-side SPA navigation (`onNavigate`) rather than full browser reloads.
  - Upgrade the mobile drawer with smooth open/close transitions, dimmed backdrop, outside-click dismissal, `Escape` key handling, and focus management.
- **`BrandSignature.tsx` & `ThemeToggle.tsx`**:
  - Replace sub-pixel `6.5px` tagline text in `BrandSignature` with legible `10px–11px` proportions and SPA-aware navigation.
  - Calm `ThemeToggle` hover states and fix `ThemeContext.tsx` timeout cleanup on unmount.
- **`CelestialAtmosphere.tsx` & Hero Framing**:
  - Add `poster="/night-hero-frame.png"` for instant first-frame paint alongside `poster="/day-time-poster.jpg"`.
  - Render/play only the active theme's `<video>` stream (eliminating simultaneous 14.1 MB + 3.3 MB decoding), and swap to static poster frames when `prefers-reduced-motion: reduce` is active.
  - Add subtle `requestAnimationFrame` scroll-linked parallax on the hero backdrop/copy and a clean bottom scroll-to-explore cue.

---

## 3. Home Experience & Innovative Interactive Sections

- **`#programs` (4 Track Cards)**:
  - Wire SPA `navigateToProgram(slug)` on card clicks so switching to `/programs/:slug` is instant with zero page reload.
  - Keep all 4 SVG technical diagrams **always-on kinetic**, add crisp track metadata strips (duration, drill count, roadmap label), and refine hover glow + magnetic surface polish.
- **`#approach` ("How we teach at SMK" — `ApproachShowcase.tsx`)**:
  - Upgrade the static numbered list into a **clickable 3-stage interactive showcase** (`01 Concept from scratch` → `02 Live hands-on practice` → `03 Interview-ready thinking`):
    - Stage 01: Interactive visual pointer/memory diagram (`Two Sum` / array pointer step-through).
    - Stage 02: Live Brute Force `O(N²)` → Hash Map `O(N)` code & execution diff.
    - Stage 03: Interviewer rubric breakdown (Time, Space, Edge-case checklist).
- **`#campus` ("For colleges" — `CampusBlueprint.tsx`)**:
  - Pair the editorial brief with an interactive **Batch Blueprint Selector** (`2nd Year Foundation` · `3rd Year Placement Prep` · `Final Year Sprint`), dynamically showing tailored tracks, delivery cadence, and outcome focus.
  - `"Discuss this batch"` scrolls smoothly to `#contact` and prefills the enquiry topic and batch note.
- **`#contact` & `SiteFooter.tsx`**:
  - Add inline validation, keep the `mailto:localboy0909@gmail.com` action, and provide a **"Copy enquiry text"** helper button inside the status region after submission so visitors without a desktop mail client can still send easily.
  - Expand the footer into a clean 3-column directory (Brand, Program Roadmaps via SPA nav, Explore links + Back to top).

---

## 4. Program Page & `RoadmapExplorer`

- **SPA Navigation (`ProgramPage.tsx`)**:
  - Route `"All programs"` and `BrandSignature` back to `/` or `/#programs` via SPA state without triggering full browser reloads.
- **Blueprint Canvas & Toolbar (`RoadmapExplorer.tsx`)**:
  - Soften static dashed connector hairlines across the 3-column tree, illuminating only the hovered or selected stage's spine and branches in Coral (`#FA4028`).
  - Add live search match counter (`X matching nodes`) and `IntersectionObserver` active-stage highlighting to the `Stage 01..N` jump pills.
- **Apple-Grade Sheet Drawer**:
  - Animate backdrop fade and drawer slide-in/slide-out (`transform: translateX`).
  - Implement accessible focus trapping inside the dialog, restore focus to the triggering node on close, and support `ArrowLeft` / `ArrowRight` keyboard stepping between topics.
  - Add an **Exploratory Self-Check** toggle inside topic detail views (revealable reflection prompt + mentor takeaway derived from topic keypoints/insight — strictly exploratory with no saved progress or completion bars).

---

## 5. Engineering & Verification Constraints

- **Zero New Runtime Dependencies**: Use native CSS transitions, WAAPI/CSS keyframes, `IntersectionObserver`, and lightweight React hooks (`useScrollParallax`, `useMagneticHover`, `useFocusTrap`) to keep bundle size minimal.
- **Reduced Motion & Accessibility**: Respect `prefers-reduced-motion: reduce` across parallax, magnetic hover, kinetic SVGs, and drawer transitions; preserve keyboard focus rings and ARIA semantics throughout.
- **Verification**: Validate with `npm run build` (`tsc -b && vite build`) and live browser inspection across desktop/mobile viewports and both Dark/Light themes.
