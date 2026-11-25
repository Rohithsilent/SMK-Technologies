import type { MouseEvent } from "react"

type BrandSignatureProps = {
  href: string
  compact?: boolean
  onNavigate?: (href: string) => void
}

export default function BrandSignature({
  href,
  compact = false,
  onNavigate,
}: BrandSignatureProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
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
    <a
      href={href}
      onClick={handleClick}
      aria-label="SMK TechVora home"
      className="group flex w-fit shrink-0 items-center gap-2.5 text-foreground transition-opacity hover:opacity-90 sm:gap-3"
    >
      <span
        className={`${
          compact ? "text-2xl" : "text-[1.7rem] sm:text-[2.15rem]"
        } font-display leading-none tracking-tight`}
      >
        SMK
      </span>
      <span className="flex flex-col justify-center gap-0.5 border-l border-foreground/30 pl-2.5 sm:pl-3">
        <span className="text-[11px] font-semibold uppercase leading-none tracking-[0.18em]">
          TechVora
        </span>
        {!compact && (
          <span className="hidden whitespace-nowrap text-[10px] font-medium uppercase leading-none tracking-[0.1em] text-foreground/65 sm:block">
            Skills · Mentorship · Knowledge
          </span>
        )}
      </span>
    </a>
  )
}
