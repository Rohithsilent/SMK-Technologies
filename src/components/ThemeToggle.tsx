import { useTheme } from "@/context/ThemeContext"

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, isTransitioning, toggleTheme } = useTheme()
  const isLight = theme === "light"

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Switch to dark night mode" : "Switch to light day mode"}
      title={isLight ? "Switch to Night Mode" : "Switch to Day Mode"}
      className={`theme-switch group relative inline-flex h-9 w-[68px] shrink-0 items-center justify-between overflow-hidden rounded-[4px] p-[3px] cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97] ${
        isLight
          ? "border border-[#00063D]/25 bg-[#F0F6FF] hover:border-[#00063D]/55"
          : "border border-indigo-200/25 bg-[#070D36]/85 hover:border-indigo-200/55"
      } ${isTransitioning ? "is-switching" : ""} ${className}`}
    >
      {/* Horizon Energy Sweep on Toggle */}
      <span
        className="theme-switch-sweep pointer-events-none absolute inset-x-0 bottom-0 h-[2px]"
        aria-hidden="true"
      />

      {/* Sliding 3px Architectural Shuttle */}
      <span
        aria-hidden="true"
        className={`theme-switch-shuttle pointer-events-none absolute left-[3px] top-[3px] bottom-[3px] w-[29px] rounded-[3px] ${
          isLight
            ? "translate-x-[31px] bg-[#00063D] shadow-[0_2px_8px_rgba(0,6,61,0.22)]"
            : "translate-x-0 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
        }`}
      />

      {/* Left Slot: Night Moon */}
      <span
        aria-hidden="true"
        className={`relative z-10 flex h-full w-[29px] items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          !isLight
            ? "scale-100 text-[#00063D]"
            : "scale-90 text-[#00063D]/45 group-hover:text-[#00063D]/80"
        }`}
      >
        <svg
          className={`size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            !isLight ? "rotate-0" : "-rotate-12"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
            fill="currentColor"
            fillOpacity={!isLight ? "0.18" : "0"}
          />
          <path
            d="M19 3v3M17.5 4.5h3"
            stroke={!isLight ? "#FA4028" : "currentColor"}
            strokeWidth="2"
          />
        </svg>
      </span>

      {/* Right Slot: Day Sun */}
      <span
        aria-hidden="true"
        className={`relative z-10 flex h-full w-[29px] items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isLight
            ? "scale-100 text-white"
            : "scale-90 text-indigo-200/55 group-hover:text-white/85"
        }`}
      >
        <svg
          className={`size-3.5 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isLight ? "rotate-0 group-hover:rotate-45" : "-rotate-45 group-hover:rotate-0"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle
            cx="12"
            cy="12"
            r="4"
            fill="currentColor"
            fillOpacity={isLight ? "0.22" : "0"}
          />
          <path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.55 1.55M17.52 17.52l1.55 1.55M2 12h2.2M19.8 12H22M4.93 19.07l1.55-1.55M17.52 6.48l1.55-1.55" />
        </svg>
      </span>
    </button>
  )
}
