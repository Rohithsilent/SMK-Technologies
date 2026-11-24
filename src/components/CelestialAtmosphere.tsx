import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/context/ThemeContext"

const NIGHT_VIDEO = "/night-hero.mp4"
const DAY_VIDEO = "/day-time.mp4"
const DAY_POSTER = "/day-time-poster.jpg"
const NIGHT_POSTER = "/night-hero-frame.png"
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

export default function CelestialAtmosphere() {
  const { theme } = useTheme()
  const isDay = theme === "light"
  const nightVideoRef = useRef<HTMLVideoElement>(null)
  const dayVideoRef = useRef<HTMLVideoElement>(null)
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION_QUERY).matches,
  )

  useEffect(() => {
    const preference = window.matchMedia(REDUCED_MOTION_QUERY)
    const updatePreference = () => setReducedMotion(preference.matches)
    preference.addEventListener("change", updatePreference)
    return () => preference.removeEventListener("change", updatePreference)
  }, [])

  // Play only the visible theme's video, and keep decorative motion off when requested.
  useEffect(() => {
    const activeVideo = isDay ? dayVideoRef.current : nightVideoRef.current
    const inactiveVideo = isDay ? nightVideoRef.current : dayVideoRef.current
    inactiveVideo?.pause()

    if (reducedMotion) {
      activeVideo?.pause()
      return
    }

    activeVideo?.play().catch(() => {
      // Keep the poster and background color as the autoplay fallback.
    })
  }, [isDay, reducedMotion])

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* ─── Video Layer 1: Night Video ─── */}
      <video
        ref={nightVideoRef}
        className={`hero-video absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDay ? "opacity-0" : "opacity-100"
        }`}
        poster={NIGHT_POSTER}
        autoPlay={!reducedMotion && !isDay}
        loop
        muted
        playsInline
        preload={!reducedMotion && !isDay ? "auto" : "none"}
        tabIndex={-1}
      >
        <source src={NIGHT_VIDEO} type="video/mp4" />
      </video>

      {/* ─── Video Layer 2: Day Video ─── */}
      <video
        ref={dayVideoRef}
        poster={DAY_POSTER}
        className={`hero-video absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDay ? "opacity-100" : "opacity-0"
        }`}
        autoPlay={!reducedMotion && isDay}
        loop
        muted
        playsInline
        preload={!reducedMotion && isDay ? "auto" : "none"}
        tabIndex={-1}
      >
        <source src={DAY_VIDEO} type="video/mp4" />
      </video>

      {/* ─── Apple/Netflix Level Cinematic Contrast Scrims ─── */}
      {/* Night Scrim: Protects white typography & glass header while keeping cosmic atmosphere */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-[#00063D]/40 via-transparent to-background/95 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDay ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Day Scrim: Soft high-key wash ensuring Deep Navy & Coral text is 100% WCAG legible */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDay ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  )
}
