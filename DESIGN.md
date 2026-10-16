# SMK Technologies — Public site

## Purpose and audience

This is a public introduction to SMK Technologies for college students and campus groups exploring practical technology training. The home page is a concise introduction: one cinematic statement, short program links, an explained learning loop, a campus-cohort enquiry prompt, and a clear contact form. Dedicated program pages explain the curriculum and its ordered roadmap. Keep detailed explanations on those pages. Use the SMK identity and college context; do not replace it with a generic studio brand or make unsupported placement claims.

## North Star

Open like a quiet film title over moving campus-scale atmosphere: fullscreen footage, one glass navigation rail, and a centered Instrument Serif headline. The video is the only visual depth in the hero. Avoid blobs, gradients, patterned grids, floating cards, and extra overlays. Keep home page copy concise: course rows, an explained loop from concept to practice to reflection, and a campus cohort enquiry that tells colleges what information to bring. Do not use unsupported testimonial or placement-stat sections; collect feedback through the contact form. Program pages express each syllabus as a learning circuit: selectable stages, one focused detail panel, and a short self-check tied to the active stage. The warm gold path marker is the only new accent and echoes the supplied SMK identity.

## Palette

Theme values are CSS HSL components in `src/index.css`:

- `--background`: `201 100% 13%` — deep blue base and video failure fallback.
- `--foreground`: `0 0% 100%` — primary type and navigation emphasis.
- `--muted-foreground`: `240 4% 66%` — secondary type.
- `--primary`: `0 0% 100%`; `--primary-foreground`: `0 0% 4%` — primary action pair.
- `--secondary`, `--muted`, `--accent`: `0 0% 10%` — quiet section and control surfaces.
- `--border`, `--input`: `0 0% 18%` — section dividers and form outlines.
- `--path-accent`: `39 62% 56%` — warm gold for selected roadmap stops and focused emphasis.

Keep the page dark. Glass is reserved for navigation and clear calls to action. Do not add a scrim over the supplied video; use restrained text shadow only to protect headline readability.

## Typography

- Display: `Instrument Serif`, regular, for the hero and section titles.
- Body: `Inter` 400/500, for navigation, paragraphs, and controls.
- Headline emphasis uses muted foreground color in upright `<em>` elements; it is not italic and does not change the serif voice.
- The SMK logo is a serif wordmark with a graduation cap over the S and a rising student figure integrated into the M. Use gold and ivory on dark backgrounds and navy and gold on light backgrounds. Reuse the shared `BrandLockup` component in site chrome and the SVG wordmarks in external materials. Do not add a badge, tagline, or company name to the logo.

## Layout and shape

- Build as a responsive Vite + React + TypeScript site with home and dedicated `/programs/{slug}` pages. Use Tailwind CSS v4 utilities and shadcn-style shared `Button` primitive.
- The hero is a minimum viewport-height section with the video at absolute inset, object cover, and a glass navigation container above centered content.
- Navigation links collapse to an accessible mobile menu. All navigation targets point to actual page sections; use “How it works” and “For colleges” for the two home-page explanatory sections.
- Content below the hero uses a wide editorial grid and horizontal course rows rather than repeated feature cards.
- Course rows link to focused program pages. Each page repeats the cinematic SMK header, then uses editorial sections and an interactive, keyboard-operable learning circuit. Selecting a stage updates one detail panel and its self-check; stage selection is exploratory and must not imply saved or completed student progress. Keep teaching details and outcomes specific to the course rather than using generic repeated cards.
- The contact form uses a browser-native select intentionally: it has a short, fixed topic list, and platform-owned select behavior remains appropriate on desktop and mobile. Its editorial introduction and compact framed form use persistent labels and aligned controls. The form prepares a mailto message; it does not claim a submission was delivered. Do not add a duplicate direct-email fallback under the form.
- Glass controls are rounded and translucent; section content uses hairline dividers and no decorative shadow.

## Motion and accessibility

- The background video is autoplaying, muted, looping, and inline. It is decorative and hidden from assistive technology.
- Animate only the headline, supporting copy, and main CTA with the supplied short fade-and-rise sequence.
- Disable nonessential motion when `prefers-reduced-motion` is active. Preserve readable content if video playback or the remote video URL fails.
- Keep keyboard focus visible, label all form controls, expose form feedback through a live region, and provide an accessible mobile menu button.

## Trust and content

Show DSA, web development, and machine learning as the core learning areas. Feedback is invited from actual students; do not fabricate quotes or employment outcomes. The enquiry and feedback form addresses `localboy0909@gmail.com` through the visitor's mail application. Curriculum sequences are proposed site copy until the training owner approves the syllabus and pacing.

## Runtime mapping

`src/index.css` is the canonical token source. `@theme inline` maps its HSL component variables to Tailwind color utilities. `src/components/ui/button.tsx` is the shared shadcn-style button primitive; `src/App.tsx` owns the home page and contact interaction, `src/ProgramPage.tsx` owns the program data and page, and `src/RoadmapExplorer.tsx` owns the reusable stage interaction. Fonts load from Google Fonts and the supplied video loads from the provided CloudFront URL, so both depend on network access; the page retains its background color and all text if media fails.
