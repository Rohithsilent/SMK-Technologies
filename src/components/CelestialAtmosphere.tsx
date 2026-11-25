import { useEffect, useRef } from "react"
import { useTheme } from "@/context/ThemeContext"
import { useParallaxOffset, usePrefersReducedMotion } from "@/hooks/useMotion"

const NIGHT_VIDEO = "/night-hero.mp4"
const NIGHT_POSTER = "/night-hero-frame.png"
const DAY_VIDEO = "/day-time.mp4"
const DAY_POSTER = "/day-time-poster.jpg"

export default function CelestialAtmosphere() {
  const { theme } = useTheme()
  const isDay = theme === "light"
  const reducedMotion = usePrefersReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useParallaxOffset(containerRef, 0.16, 64)

  useEffect(() => {
    if (reducedMotion || !videoRef.current) return
    videoRef.current.play().catch(() => {
      // Autoplay policy fallback — poster remains visible
    })
  }, [theme, reducedMotion])

  const activeSrc = isDay ? DAY_VIDEO : NIGHT_VIDEO
  const activePoster = isDay ? DAY_POSTER : NIGHT_POSTER

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none"
      aria-hidden="true"
    >
      <div
        ref={containerRef}
        className="hero-parallax-layer absolute -inset-y-12 inset-x-0 will-change-transform"
      >
        {reducedMotion ? (
          <img
            src={activePoster}
            alt=""
            className="h-full w-full object-cover"
            decoding="async"
          />
        ) : (
          <video
            key={theme}
            ref={videoRef}
            poster={activePoster}
            className="hero-video h-full w-full object-cover animate-hero-fade"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
          >
            <source src={activeSrc} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Night Contrast Scrim: Protects white typography & blends seamlessly into Midnight Navy */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-[#020624]/60 via-[#020624]/20 to-background transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDay ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Day Contrast Scrim: High-key architectural wash keeping Deep Navy & Coral legible */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-white/75 via-white/45 to-white transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDay ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  )
}
