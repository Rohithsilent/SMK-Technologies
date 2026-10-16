type BrandSignatureProps = {
  href: string
  compact?: boolean
}

export default function BrandSignature({ href, compact = false }: BrandSignatureProps) {
  return (
    <a href={href} aria-label="SMK Technologies home" className="flex w-fit shrink-0 items-center gap-3 text-foreground">
      <span className={`${compact ? "text-2xl" : "text-4xl"} font-display leading-none tracking-tight`}>SMK</span>
      <span className="flex flex-col justify-center gap-1 border-l border-foreground/35 pl-3">
        <span className={`${compact ? "text-[8px]" : "text-[9px]"} font-medium uppercase leading-none tracking-[.2em]`}>Technologies</span>
        <span className={`${compact ? "text-[7px]" : "text-[8px]"} whitespace-nowrap uppercase leading-none tracking-[.14em] text-foreground/65`}>Skills · Mentorship · Knowledge</span>
      </span>
    </a>
  )
}
