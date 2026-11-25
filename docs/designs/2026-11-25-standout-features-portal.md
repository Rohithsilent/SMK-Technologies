# SMK TechVora — Standout Features & Dual-Funnel Mini-LMS Design

**Date:** 2026-11-25  
**Status:** Validated (Brainstorming & Architecture)  
**Goal:** Differentiate SMK TechVora from Indian B.Tech training competitors (SmartInterviews, Tap Academy, FACE Prep, PrepInsta) through an **Open Engineering Lab + Gated Mini-LMS Portal** that wins both B.Tech students and college TPOs without relying on unverified placement claims.

---

## 1. Strategic Positioning & Decisions

Resolved during the product & technical discovery session:

- **Primary Conversion Target:** **Dual Funnel** — win B.Tech students directly while converting College Training & Placement Officers (TPOs) into institutional cohorts.
- **Proof Posture (Day-1 Launch):** Launching fresh without existing college logos or placement testimonials. Instead of generic marketing claims, credibility is demonstrated live in-browser through interactive coding diagnostics, real execution sandboxes, and transparent institutional tooling.
- **Selected Product Approach:** **Approach A — Live Engineering Lab + Dual Diagnostic Funnel** (zero-login public proof funneling seamlessly into an authenticated mini-LMS and TPO analytics portal).
- **Technical Architecture:**
  - **Frontend:** Existing React 19 + TypeScript + Vite + Tailwind CSS v4 SPA (`src/`).
  - **Backend & Auth:** **Supabase** (Auth, PostgreSQL, Row-Level Security, Edge Functions).
  - **Hybrid Code Execution:**
    - *Public / Zero-Login:* Client-side browser execution (**Pyodide** for Python + sandboxed **WebWorker** for JavaScript) — zero server execution cost and instant feedback for anonymous traffic.
    - *Gated Portal Assessments:* **Judge0 API** proxied through a Supabase Edge Function — supports **Python, C++, and Java** (matching `src/data/roadmaps.ts` DSA prerequisites) with hidden test cases, runtime/memory telemetry, and per-user rate limiting.

---

## 2. Public "Try Before You Trust" Experience (Zero Login)

### 2.1 Five-Minute Placement Readiness Diagnostic (`/diagnostic`)
Entry points from the Home Hero, `#programs` cards, and `SiteHeader`.
- **Flow:**
  1. Student selects their B.Tech year (`2nd Year`, `3rd Year`, `Final Year`) and target hiring tier (`Service / Mass Recruiter`, `Product Startup / Engineering`, `Full-Stack / AI Role`).
  2. Completes a 5-question interactive diagnostic:
     - 2 Big-O / code-trace questions (pointer mechanics, constraint complexity).
     - 1 live editable debugging fix executed directly in-browser (Python via Pyodide or JS via WebWorker).
     - 2 stack/concept readiness checks aligned with `src/data/roadmaps.ts`.
  3. Receives an instant **4-Axis Readiness Snapshot** (`Problem Solving`, `Complexity Intuition`, `Implementation Speed`, `Stack Readiness`) plus a **Personalized Study Plan** deep-linking directly to the exact stages inside `/programs/{slug}`.
- **Portal Hand-off:** Results save temporarily to `localStorage` with a 1-click **"Save Score & Unlock Full OA Suite"** CTA that carries the attempt into the student's Supabase account upon sign-up.

### 2.2 Live Interactive Sandbox in `#approach` & `RoadmapExplorer`
- **Upgrade `src/components/ApproachShowcase.tsx`:**
  - Turn Stage 02 (`Live hands-on practice`) from a static `<pre>` Brute vs. Optimal comparison into a **live editable in-browser runner** where visitors modify code, click **Run Tests**, and see real test cases pass/fail alongside runtime output.
  - Fix the existing content discrepancy where the card header displays `Problem: Two Sum (Sorted)` across all stages while Stages 02–03 switch to the unsorted Hash Map solution.
- **Upgrade `src/RoadmapExplorer.tsx`:**
  - Evolve the drawer's exploratory self-check into an interactive micro-challenge/trace check; when signed in, passing checks unlocks verified topic mastery in Postgres.

### 2.3 Interactive TPO Preview & Custom Syllabus Generator (`#campus`)
- **Upgrade `src/components/CampusBlueprint.tsx`:**
  - Add a **"Preview Live TPO Report"** tab alongside `2nd Year / 3rd Year / Final Year` showing a clearly labeled **Sample Cohort View** (120-student readiness distribution across `Foundation / Core / Product-Ready` tiers, topic mastery heatmap, OA pass-rate trend, and NAAC/NBA-style attendance/assessment matrix).
  - Add a **"Generate Custom Syllabus Brief"** button that outputs a clean print/PDF-ready proposal (`@media print` layout) tailored to the selected year, estimated batch size, and campus delivery mode using real syllabus stages from `src/data/roadmaps.ts`.

### 2.4 Instant Enquiry Capture & Core Site Fixes
- **Upgrade `#contact` (`src/App.tsx`):** Replace raw `mailto:localboy0909@gmail.com` reliance with direct **Supabase persistence** (`campus_enquiries` table) + instant on-page confirmation + optional **WhatsApp / 15-Min Demo Call** action, while retaining `"Copy enquiry text"` as a quick fallback.
- **Baseline Fixes:** Add `/brand/smk-mark.svg` favicon link in `index.html` (eliminating `/favicon.ico` 404) and ensure Light theme surface variables in `src/index.css` / `ThemeContext.tsx` repaint `body` and section backgrounds consistently.

---

## 3. Gated Mini-LMS Student Portal (`/portal`)

### 3.1 Authentication & Cohort Onboarding
- **Supabase Auth:** Email/Magic Link and Google OAuth.
- **Optional Batch Invite Code:** Campus students can enter a college invite code (e.g., `SMK-CSE-2026`) during onboarding to link their profile to their institution/cohort; independent learners proceed without a code.
- **Diagnostic Carryover:** On first login, any anonymous `/diagnostic` attempt stored in `localStorage` is persisted to `diagnostic_attempts`.

### 3.2 Multi-Language Timed OA Simulator (`/portal/assessments`)
- **Company-Tier Tracks:** Timed 30–60 minute online assessments patterned after **Service / Core IT** (TCS NQT / Infosys / Accenture style) and **Product Engineering** (sliding window, trees, graphs, DP) hiring drives.
- **Execution Engine (Judge0 via Supabase Edge Function):**
  - Supports **Python, C++, and Java**.
  - Runs visible sample tests on `"Run Code"` and hidden edge-case suites on `"Submit"`.
  - Records execution time, memory, test pass ratio, and post-submission optimal complexity breakdown linked back to the relevant `RoadmapExplorer` topic nodes.

### 3.3 Verified Roadmap Mastery & Capstone Proof (`/portal/roadmap`, `/portal/projects`, `/verify/:handle`)
- **Verified Mastery:** Roadmap nodes mark complete only when the student passes the topic's micro-check or linked OA problem (preventing hollow self-check progress).
- **Capstone Proof Pipeline:** For Full-Stack Web and AI/ML tracks, students submit a **GitHub Repository URL + Live Deployed URL**. Mentors review against a 3-part rubric (*Architecture*, *Edge Cases*, *Deployment*), generating a shareable public **SMK Verified Skill Transcript** at `/verify/:handle` for resumes and recruiters.

---

## 4. Gated TPO & Mentor Command Center (`/tpo` & `/mentor`)

### 4.1 Live TPO Cohort Dashboard (`/tpo`)
- Strictly scoped via Supabase RLS to the TPO's `college_id`.
- **Views & Metrics:**
  - **Batch Readiness Tiers:** Live counts and percentages in *Foundation / At-Risk*, *Assessment-Ready*, and *Product-Tier*.
  - **Topic Bottleneck Heatmap:** Identifies exact roadmap topics dragging cohort pass rates down (e.g., recursion, sliding window, REST auth).
  - **Timed OA Scoreboards & Attendance/Practice Consistency:** Per-student and per-batch logs.
  - **1-Click Exports:** CSV and print-formatted PDF cohort reports structured for NAAC / NBA placement-training documentation.

### 4.2 Mentor Workspace (`/mentor`)
- Create colleges, batch cohorts, and student invite codes.
- Schedule/publish timed OA assessments, inspect student code submissions, and submit rubric grades on Full-Stack/AI capstone projects.

---

## 5. Supabase Data Model & Security Boundaries

Core tables (protected with Row-Level Security based on `profiles.role` in `'student' | 'tpo' | 'mentor' | 'admin'`):
- `colleges` (`id`, `name`, `city`, `created_at`)
- `cohorts` (`id`, `college_id`, `name`, `target_year`, `invite_code`, `active`)
- `profiles` (`id`, `full_name`, `email`, `role`, `college_id`, `cohort_id`, `handle`, `btech_year`)
- `diagnostic_attempts` (`id`, `user_id`, `target_tier`, `answers`, `axis_scores`, `recommended_slug`, `created_at`)
- `topic_mastery` (`user_id`, `program_slug`, `topic_id`, `status`, `verified_at`)
- `oa_assessments` (`id`, `title`, `tier`, `duration_minutes`, `problems`, `cohort_id`, `published`)
- `oa_submissions` (`id`, `assessment_id`, `user_id`, `language`, `source_code`, `passed_count`, `total_count`, `runtime_ms`, `submitted_at`)
- `project_submissions` (`id`, `user_id`, `program_slug`, `repo_url`, `live_url`, `rubric_scores`, `mentor_notes`, `verified_at`)
- `campus_enquiries` (`id`, `name`, `email`, `interest`, `batch_year`, `note`, `created_at`)

**Security Rules:**
- Students read/write only their own attempts, mastery, and submissions.
- TPOs read aggregate and per-student rows only where `college_id` matches their assigned institution.
- Judge0 API keys live exclusively inside a Supabase Edge Function (`run-assessment-code`) with JWT verification and rate limiting.

---

## 6. Phased Delivery Plan

1. **Phase 1 — Public Engineering Lab & TPO Funnel (Immediate Standout Upgrade):**
   - Fix favicon + Light-mode background painting + `#approach` Two-Sum header/code mismatch.
   - Add live Pyodide/WebWorker code runner inside `#approach` and `RoadmapExplorer` drawers.
   - Build `/diagnostic` 5-minute Placement Readiness Diagnostic with personalized roadmap links.
   - Add Interactive TPO Sample Report preview & printable Custom Syllabus Brief generator in `#campus`.
   - Upgrade `#contact` to persist enquiries to Supabase (with graceful fallback) + WhatsApp/demo option.
2. **Phase 2 — Supabase Auth & Student Mini-LMS Portal:**
   - Wire Supabase Auth + invite-code cohort onboarding + diagnostic carryover.
   - Ship `/portal/roadmap` verified mastery persistence and `/portal/assessments` timed Python/C++/Java OA simulator via Judge0 Edge Function.
3. **Phase 3 — TPO Command Center, Mentor Studio & Verified Transcripts:**
   - Ship `/tpo` institutional analytics + CSV/PDF NAAC-ready exports.
   - Ship `/mentor` capstone rubric review flow and `/verify/:handle` public skill transcripts.
