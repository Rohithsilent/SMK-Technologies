# Jasper Light Theme & Cinematic Sunrise/Sunset Implementation Plan

**Goal:** Transform the SMK TechVora website with an award-winning Jasper.ai-inspired light theme and an interactive sunrise/sunset transition engine.

**Architecture:** 
1. **Theme State Engine (`useTheme` / `ThemeContext`):** Manages `theme` ('dark' | 'light') and transition phases ('idle' | 'sunrise' | 'sunset') with persistence in `localStorage`.
2. **Atmospheric Canvas (`CelestialAtmosphere`):** GPU-accelerated atmospheric simulation with an ascending/descending radiant sun orb, volumetric god-rays, horizon twilight bloom, and Jasper daylight mist.
3. **Jasper Design Tokens (`src/index.css`):** Exact Jasper palette (Coral `#FA4028`, Soft Peach `#FEDED0`, Electric Purple `#9146FF`, Light Blue `#C5E7FF`, Deep Navy `#00063D`, White `#FFFFFF`) integrated via CSS HSL variables and Tailwind utilities.
4. **Editorial Typography & Jasper Styling:** Hero emphasis in Coral, sharp-edged Jasper platform cards with light-mode matrix styling, square/minimally rounded deep navy buttons with coral hover, and optical frosted glass.
5. **Celestial Toggle Switch (`ThemeToggle`):** Custom celestial orb control in the header and mobile menu with animated sun/moon morphing.

---

### Task 1: Establish Theme Context and State Management

**Files:**
- Create: `src/context/ThemeContext.tsx`
- Modify: `src/main.tsx`

**Details:**
- Provide `theme` ('dark' | 'light'), `isTransitioning`, `transitionPhase` ('idle' | 'sunrise' | 'sunset'), and `toggleTheme()`.
- Listen to system preferences, sync with `localStorage`, and manage `data-theme` attribute on `document.documentElement`.
- Ensure toggle triggers sunrise (1.8s) when going Dark -> Light, and sunset (1.8s) when going Light -> Dark.

---

### Task 2: Build the Jasper Light Theme CSS Design Tokens

**Files:**
- Modify: `src/index.css`

**Details:**
- Add `[data-theme="light"]` token overrides matching Jasper's exact color specification:
  - `--background`: White `#FFFFFF` with warm peach/light-blue sections
  - `--foreground`: Deep Navy `#00063D`
  - `--muted-foreground`: `#4A5568` / deep slate navy
  - `--primary`: Deep Navy `#00063D` (text white, hover coral `#FA4028`)
  - `--path-accent`: Coral `#FA4028`
  - `--border`: `rgba(0, 6, 61, 0.1)`
- Add Jasper utility classes:
  - Coral text/highlights (`text-coral`, `bg-coral`)
  - Soft peach accents (`bg-peach`)
  - Electric purple accents (`text-purple`, `bg-purple`)
  - Light blue hero tints (`bg-light-blue`)
- Adjust `.platform-card`, `.liquid-glass`, `.course-row`, and interactive diagrams for light mode.
- Add smooth CSS transitions for background, color, and border across the document.

---

### Task 3: Build the Celestial Sunrise/Sunset Atmospheric Engine

**Files:**
- Create: `src/components/CelestialAtmosphere.tsx`

**Details:**
- Physical Solar Orb: A radial sun disc with multi-layered solar corona that rises from below the horizon (`translateY(120%)`) up to the morning sky (`translateY(-25vh)`) during sunrise, and sinks during sunset.
- Volumetric Sunbeams / God-Rays: Conical light rays blooming as the sun ascends.
- Horizon Atmospheric Wash: A dynamic color-scattering gradient (Midnight Navy -> Ember Crimson -> Amber Gold -> Azure/Peach Daylight).
- Crossfade with the existing Night Video so the transition is seamless with zero flicker.

---

### Task 4: Build the Celestial Theme Toggle Component

**Files:**
- Create: `src/components/ThemeToggle.tsx`

**Details:**
- Elegant micro-interaction button for both desktop glass nav and mobile nav.
- Celestial icon morphing between glowing crescent moon with star aura and radiant sun with rotating rays.
- Smooth spring transitions and tooltip indicators.

---

### Task 5: Integrate into `App.tsx` and `ProgramPage.tsx`

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/ProgramPage.tsx`
- Modify: `src/components/ui/button.tsx`

**Details:**
- Insert `<CelestialAtmosphere />` in place of the static hero video.
- Mount `<ThemeToggle />` in both `App.tsx` desktop/mobile headers and `ProgramPage.tsx` `<SiteHeader />`.
- Style hero headlines with Jasper Coral emphasis on key words (*Master Coding. Crack Placements.*).
- Ensure buttons match Jasper specs (Deep navy background, white text, minimal radius, coral hover).
- Verify section backgrounds: alternate between clean white, subtle light-blue (`#C5E7FF`), and soft peach (`#FEDED0`).

---

### Task 6: Verification and Polish

**Commands:**
- Run `npm run build` to verify type safety and compilation.
- Verify responsive layout across mobile, tablet, and desktop viewports.
- Verify `prefers-reduced-motion` compliance.
