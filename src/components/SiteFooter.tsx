import type { MouseEvent } from "react"
import { ArrowUpRight } from "lucide-react"
import BrandSignature from "@/components/BrandSignature"
import { programs } from "@/data/roadmaps"

type SiteFooterProps = {
  mode: "home" | "program"
  onNavigate?: (href: string) => void
}

export default function SiteFooter({ mode, onNavigate }: SiteFooterProps) {
  const prefix = mode === "home" ? "" : "/"

  function handleLinkClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (
      !onNavigate ||
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return
    }
    event.preventDefault()
    onNavigate(href)
  }

  return (
    <footer className="border-t border-border bg-background px-6 py-12 text-sm text-muted-foreground sm:px-10 sm:py-14">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.35fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <BrandSignature href={`${prefix}#home`} compact onNavigate={onNavigate} />
          <p className="max-w-xs text-sm font-medium leading-6 text-muted-foreground">
            Hands-on campus coding, DSA, Full-Stack Web, and AI training engineered for B.Tech students and placement cells.
          </p>
        </div>

        <div>
          <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">
            Program Roadmaps
          </p>
          <ul className="grid gap-2.5">
            {programs.map((program) => {
              const href = `/programs/${program.slug}`
              return (
                <li key={program.slug}>
                  <a
                    href={href}
                    onClick={(e) => handleLinkClick(e, href)}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                  >
                    <span>{program.shortName}</span>
                    <ArrowUpRight className="size-3 opacity-60" aria-hidden="true" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">
            Explore
          </p>
          <ul className="grid gap-2.5">
            <li>
              <a
                href={`${prefix}#programs`}
                onClick={(e) => handleLinkClick(e, `${prefix}#programs`)}
                className="transition-colors hover:text-foreground"
              >
                Training Tracks
              </a>
            </li>
            <li>
              <a
                href={`${prefix}#approach`}
                onClick={(e) => handleLinkClick(e, `${prefix}#approach`)}
                className="transition-colors hover:text-foreground"
              >
                How it works
              </a>
            </li>
            <li>
              <a
                href={`${prefix}#campus`}
                onClick={(e) => handleLinkClick(e, `${prefix}#campus`)}
                className="transition-colors hover:text-foreground"
              >
                For colleges
              </a>
            </li>
            <li>
              <a
                href={`${prefix}#contact`}
                onClick={(e) => handleLinkClick(e, `${prefix}#contact`)}
                className="transition-colors hover:text-foreground"
              >
                Campus enquiry
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} SMK TechVora · Skills · Mentorship · Knowledge</p>
        <a
          href={`${prefix}#home`}
          onClick={(e) => {
            e.preventDefault()
            if (mode === "program" && onNavigate) {
              window.scrollTo({ top: 0, behavior: "smooth" })
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          }}
          className="w-fit font-medium text-foreground/80 transition-colors hover:text-path-accent"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
