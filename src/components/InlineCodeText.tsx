import { Fragment } from "react"

/**
 * Renders plain text with inline `code` backtick spans styled cleanly as monospace tokens
 * without introducing any raw HTML injection.
 */
export default function InlineCodeText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g)
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code
              key={idx}
              className="rounded-[3px] border border-border/70 bg-background/75 px-1 py-0.5 font-mono text-[0.88em] text-foreground"
            >
              {part.slice(1, -1)}
            </code>
          )
        }
        return <Fragment key={idx}>{part}</Fragment>
      })}
    </>
  )
}
