import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import {
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Copy,
  Printer,
  ShieldCheck,
} from "lucide-react"
import SiteFooter from "@/components/SiteFooter"
import SiteHeader from "@/components/SiteHeader"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/firebase"
import { SAMPLE_COHORT_DATA } from "@/lib/tpoAnalytics"

interface TranscriptViewModel {
  handle: string
  displayName: string
  btechYear: string
  targetTier: string
  verifiedTopicsCount: number
  oaPassedCount: number
  oaBestRatio: number
  diagnosticOverall: number
  verifiedProjectsCount: number
  isSample: boolean
}

export default function VerifyTranscriptPage({
  handle,
  onNavigate,
}: {
  handle: string
  onNavigate: (href: string) => void
}) {
  const [loading, setLoading] = useState(true)
  const [transcript, setTranscript] = useState<TranscriptViewModel | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      const cleanHandle = handle.toLowerCase().replace(/[^a-z0-9-]/g, "")
      const sampleMatch = SAMPLE_COHORT_DATA.students.find((s) => s.handle === cleanHandle)

      if (sampleMatch) {
        setTranscript({
          handle: sampleMatch.handle,
          displayName: sampleMatch.name,
          btechYear: sampleMatch.year,
          targetTier: sampleMatch.tier,
          verifiedTopicsCount: sampleMatch.verifiedTopics,
          oaPassedCount: sampleMatch.tier === "Product-Tier" ? 4 : 2,
          oaBestRatio: sampleMatch.oaPassRate,
          diagnosticOverall: sampleMatch.diagnosticScore,
          verifiedProjectsCount: sampleMatch.capstoneStatus === "Verified" ? 1 : 0,
          isSample: true,
        })
        setLoading(false)
      } else {
        setLoading(true)
      }

      if (!cleanHandle) {
        if (active) setLoading(false)
        return
      }

      try {
        const snap = await Promise.race([
          getDoc(doc(db, "public_transcripts", cleanHandle)),
          new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 2500)),
        ])
        if (active && snap && snap.exists()) {
          const d = snap.data()
          setTranscript({
            handle: String(d.handle || cleanHandle),
            displayName: String(d.displayName || "SMK Learner"),
            btechYear: String(d.btechYear || "3rd Year"),
            targetTier: String(d.targetTier || "Product Startup / Engineering"),
            verifiedTopicsCount: Number(d.verifiedTopicsCount || 0),
            oaPassedCount: Number(d.oaPassedCount || 0),
            oaBestRatio: Number(d.oaBestRatio || 0),
            diagnosticOverall: Number(d.diagnosticOverall || 0),
            verifiedProjectsCount: Number(d.verifiedProjectsCount || 0),
            isSample: false,
          })
          setLoading(false)
          return
        }
      } catch {
        // Retain sample match if available, otherwise resolve to not-found
      }

      if (active && !sampleMatch) {
        setTranscript(null)
        setLoading(false)
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [handle])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="print:hidden">
        <SiteHeader mode="app" activePath="/verify" onNavigate={onNavigate} />
      </div>

      <main className="mx-auto max-w-4xl px-5 pb-20 pt-24 sm:px-8 sm:pt-28 print:pt-4">
        {loading ? (
          <div className="editorial-panel border p-10 text-center font-mono text-xs text-muted-foreground">
            Verifying SMK credential record for @{handle}...
          </div>
        ) : !transcript ? (
          <div className="editorial-panel border p-10 text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-path-accent">
              Record Not Found
            </p>
            <h1 className="mt-2 font-display text-4xl text-foreground">
              No verified transcript found for @{handle}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Verify a sample graduate transcript or sign in to generate your own shareable skill credential.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                onClick={() => onNavigate("/verify/arjun-cse26")}
                className="cursor-pointer"
              >
                Inspect Sample Transcript (@arjun-cse26) <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="glass"
                onClick={() => onNavigate("/diagnostic")}
                className="cursor-pointer"
              >
                Start 5-Min Diagnostic
              </Button>
            </div>
          </div>
        ) : (
          <article className="editorial-panel border p-6 sm:p-10">
            {/* Credential Masthead */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/80 pb-6">
              <div>
                <p className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-500">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  SMK Verified Skill Transcript {transcript.isSample ? "· Sample Demo Record" : "· Live Record"}
                </p>
                <h1 className="mt-2 font-display text-4xl leading-tight text-foreground sm:text-5xl">
                  {transcript.displayName}
                </h1>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  Handle: @{transcript.handle} · {transcript.btechYear} · Target: {transcript.targetTier}
                </p>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex items-center gap-1.5 rounded-[4px] border border-border px-3 py-2 text-xs font-medium text-foreground hover:border-[#FA4028] hover:text-path-accent cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5 text-emerald-500" aria-hidden="true" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" aria-hidden="true" /> Copy Link
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-[4px] bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground hover:bg-[#FA4028] hover:text-white cursor-pointer"
                >
                  <Printer className="size-3.5" aria-hidden="true" /> Print
                </button>
              </div>
            </div>

            {/* Verified Metric Grid (Zero PII) */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="border border-border/80 bg-background/50 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Diagnostic Score
                </p>
                <p className="mt-1.5 font-display text-4xl text-foreground tabular-nums">
                  {transcript.diagnosticOverall}%
                </p>
              </div>
              <div className="border border-border/80 bg-background/50 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Verified Topics
                </p>
                <p className="mt-1.5 font-display text-4xl text-foreground tabular-nums">
                  {transcript.verifiedTopicsCount}
                </p>
              </div>
              <div className="border border-border/80 bg-background/50 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Best OA Pass Ratio
                </p>
                <p className="mt-1.5 font-display text-4xl text-emerald-500 tabular-nums">
                  {transcript.oaBestRatio}%
                </p>
              </div>
              <div className="border border-border/80 bg-background/50 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Verified Capstones
                </p>
                <p className="mt-1.5 font-display text-4xl text-foreground tabular-nums">
                  {transcript.verifiedProjectsCount}
                </p>
              </div>
            </div>

            {/* Proof-of-Skill Attestation */}
            <div className="mt-6 border border-border/80 bg-background/45 p-5">
              <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-path-accent">
                <Award className="size-4" aria-hidden="true" />
                Assessment Verification Standard
              </div>
              <ul className="mt-3 grid gap-2.5 text-xs leading-6 text-foreground/90">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 size-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
                  <span>
                    Every verified roadmap topic required passing an interactive trace or complexity micro-challenge (never self-checked).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 size-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
                  <span>
                    Timed OA rounds ({transcript.oaPassedCount} cleared) were graded against visible sample cases plus hidden edge-case test suites.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 size-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
                  <span>
                    Privacy-safe public record: displays verified engineering metrics only with zero personal email or phone exposure.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-5 text-xs text-muted-foreground print:hidden">
              <span>Want your own recruiter-verifiable SMK TechVora transcript?</span>
              <button
                type="button"
                onClick={() => onNavigate("/diagnostic")}
                className="inline-flex items-center gap-1 font-medium text-path-accent hover:underline cursor-pointer"
              >
                Take the 5-Minute Diagnostic <ArrowRight className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          </article>
        )}
      </main>

      <div className="print:hidden">
        <SiteFooter mode="app" onNavigate={onNavigate} />
      </div>
    </div>
  )
}
