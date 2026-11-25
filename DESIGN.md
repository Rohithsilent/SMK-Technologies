# SMK TechVora — Public site

## Purpose and audience

This is a public introduction to SMK TechVora for college students and campus groups exploring practical technology training. The home page introduces four structured training tracks, an interactive learning loop showcase, a campus batch blueprint configurator, and an accessible contact enquiry form. Dedicated program pages (`/programs/{slug}`) explain each syllabus through an interactive roadmap and focus-trapped inspector drawer. Use the SMK identity and authentic college context; do not replace it with generic studio branding or unsupported placement claims.

## North Star

Blend Jasper AI's crisp editorial sharpness (`0px` architectural cards, subtle `1px` hairlines, technical vector diagrams) with Apple and Netflix production craft: a full-bleed cinematic hero video with instant poster paint and subtle parallax, a scroll-reactive translucent header with section scroll-spy, tactile `4px` controls, and smooth GPU-composited motion.

## Palette

Theme values are CSS HSL components and semantic surface tokens in `src/index.css`:

- **Dark (default)**: Midnight Navy `#020624` (`--background: 234 90% 7%`), Crisp White `#F8FAFC` (`--foreground`), Periwinkle Slate (`--muted-foreground`), Coral `#FA4028` (`--accent` / `--path-accent`), and Electric Blue `#1D8CFF` (`--svg-blue`).
- **Light (toggleable)**: Pure White `#FFFFFF` (`--background: 0 0% 100%`), Deep Navy `#00063D` (`--foreground`), Soft Peach `#FCF6F3` (`--muted`), Light Blue `#F0F8FF` (`--secondary`), Coral `#FA4028`, and Electric Blue `#0A84FF`.

## Typography

- Display: `Instrument Serif` (regular), for hero headlines, section titles, and editorial card headers.
- Body: `Inter` (`400`, `500`, `600`, `700`), for navigation, paragraphs, technical specs, and controls.
- Keep micro-labels at or above `11px` for crisp legibility across standard and high-DPI displays.

## Layout and shape

- Responsive Vite + React + TypeScript site with client-side SPA routing between `/` and `/programs/{slug}`, built with Tailwind CSS v4 utilities and `src/components/ui/button.tsx` CVA variants.
- **Home**:
  - `CelestialAtmosphere`: mounts only the active theme's video with explicit poster frames (`/night-hero-frame.png`, `/day-time-poster.jpg`), scroll parallax, and static poster fallback under `prefers-reduced-motion`.
  - `#programs`: 4 kinetic SVG platform cards (`0px` sharp geometry, hairline specular borders, magnetic pointer tracking, SPA navigation).
  - `#approach` (`ApproachShowcase`): interactive 3-stage showcase (visual pointer dry-run, brute vs optimal code diff, interview rubric).
  - `#campus` (`CampusBlueprint`): interactive batch configurator (`2nd Year`, `3rd Year`, `Final Year`) that prefills `#contact`.
  - `#contact`: validates fields, prepares a `mailto:localboy0909@gmail.com` message, and offers a one-click copy-enquiry action in the status bar without duplicating raw email text underneath.
- **Program Pages & `RoadmapExplorer`**:
  - Sticky utility toolbar with search match counter and `IntersectionObserver` scroll-spy on stage jump pills.
  - 3-column blueprint matrix with softened resting hairlines that illuminate per hovered/selected stage.
  - Animated, focus-trapped slide-over drawer supporting `Escape` restoration, `ArrowLeft`/`ArrowRight` topic stepping, and an exploratory self-check toggle (never implying saved student progress).
