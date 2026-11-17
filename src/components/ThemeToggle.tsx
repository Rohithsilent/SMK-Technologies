import { useTheme } from "@/context/ThemeContext"

interface ThemeToggleProps {
  compact?: boolean
  className?: string
}

export default function ThemeToggle({ compact = false, className = "" }: ThemeToggleProps) {
  const { theme, isTransitioning, toggleTheme } = useTheme()
  const isLight = theme === "light"

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={isTransitioning}
      aria-label={
        isLight
          ? "Switch to Night Mode"
          : "Switch to Day Mode"
      }
      title={isLight ? "Switch to Night Mode" : "Switch to Day Mode"}
      className={`group relative flex items-center justify-between rounded-full p-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 active:scale-95 disabled:pointer-events-none ${
        isLight
          ? "bg-black/[0.06] border border-black/10 hover:border-black/20"
          : "bg-white/[0.08] border border-white/15 hover:border-white/25"
      } ${compact ? "w-14 h-8" : "w-16 h-8.5"} ${className}`}
    >
      {/* Sliding Pill Indicator with spring curve */}
      <span
        className={`pointer-events-none flex size-6.5 items-center justify-center rounded-full shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isLight
            ? "translate-x-7 sm:translate-x-7.5 bg-white text-[#00063D] shadow-[0_2px_8px_rgba(0,6,61,0.15)]"
            : "translate-x-0.5 bg-[#00063D]/90 text-amber-200 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
        }`}
      >
        {isLight ? (
          /* Apple-style minimalist Sun icon */
          <svg
            className="size-3.5 transition-transform duration-500 group-hover:rotate-45"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          /* Minimalist Moon icon */
          <svg
            className="size-3.5 text-amber-200/90 transition-transform duration-500 group-hover:-rotate-12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" fillOpacity="0.25" />
          </svg>
        )}
      </span>

      {/* Subtle background icons for the inactive side */}
      <span className="pointer-events-none absolute left-2 text-[10px] text-muted-foreground/60">
        {!isLight && (
          <svg className="size-3 text-muted-foreground/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4" />
          </svg>
        )}
      </span>
      <span className="pointer-events-none absolute right-2 text-[10px] text-muted-foreground/60">
        {isLight && (
          <svg className="size-3 text-muted-foreground/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </span>
    </button>
  )
}
