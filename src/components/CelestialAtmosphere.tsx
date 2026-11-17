import { useEffect, useRef } from "react"
import { useTheme } from "@/context/ThemeContext"

const NIGHT_VIDEO = "/night-hero.mp4"
const DAY_VIDEO = "/day-time.mp4"
const DAY_POSTER = "/day-time-poster.jpg"

export default function CelestialAtmosphere() {
  const { theme } = useTheme()
  const isDay = theme === "light"
  const nightVideoRef = useRef<HTMLVideoElement>(null)
  const dayVideoRef = useRef<HTMLVideoElement>(null)

  // Ensure both video streams are actively playing and synchronized for seamless crossfading
  useEffect(() => {
    const playSafe = (video: HTMLVideoElement | null) => {
      if (!video) return
      video.play().catch(() => {
        // Autoplay policy fallback
      })
    }
    playSafe(nightVideoRef.current)
    playSafe(dayVideoRef.current)
  }, [])

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
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
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
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
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
