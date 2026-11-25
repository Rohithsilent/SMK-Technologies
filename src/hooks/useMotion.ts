import { useEffect, useState, type RefObject } from "react"

/**
 * Subscribe to the user's reduced-motion OS preference cleanly.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  })

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduced(media.matches)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  return reduced
}

/**
 * Drives GPU-composited `--parallax-y` on a target element without React re-render churn.
 */
export function useParallaxOffset<T extends HTMLElement>(
  ref: RefObject<T | null>,
  factor = 0.18,
  maxOffset = 72,
) {
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (reducedMotion) {
      node.style.setProperty("--parallax-y", "0px")
      return
    }

    let frameId = 0

    const update = () => {
      frameId = 0
      const offset = Math.min(maxOffset, Math.max(-maxOffset, window.scrollY * factor))
      node.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`)
    }

    const onScroll = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [ref, factor, maxOffset, reducedMotion])
}

/**
 * Subtle magnetic pointer tracking on fine-pointer devices (`--mag-x`, `--mag-y`).
 */
export function useMagneticHover<T extends HTMLElement>(
  ref: RefObject<T | null>,
  strength = 5,
) {
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node || reducedMotion) return
    if (!window.matchMedia("(pointer: fine)").matches) return

    let frameId = 0
    let targetX = 0
    let targetY = 0

    const commit = () => {
      frameId = 0
      node.style.setProperty("--mag-x", `${targetX.toFixed(2)}px`)
      node.style.setProperty("--mag-y", `${targetY.toFixed(2)}px`)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const relX = (event.clientX - rect.left) / rect.width - 0.5
      const relY = (event.clientY - rect.top) / rect.height - 0.5
      targetX = relX * strength * 2
      targetY = relY * strength * 2
      if (!frameId) frameId = window.requestAnimationFrame(commit)
    }

    const onPointerLeave = () => {
      targetX = 0
      targetY = 0
      if (!frameId) frameId = window.requestAnimationFrame(commit)
    }

    node.addEventListener("pointermove", onPointerMove)
    node.addEventListener("pointerleave", onPointerLeave)

    return () => {
      node.removeEventListener("pointermove", onPointerMove)
      node.removeEventListener("pointerleave", onPointerLeave)
      if (frameId) window.cancelAnimationFrame(frameId)
      node.style.removeProperty("--mag-x")
      node.style.removeProperty("--mag-y")
    }
  }, [ref, strength, reducedMotion])
}

/**
 * Traps keyboard focus inside an open modal/drawer and restores focus on close.
 */
export function useFocusTrap<T extends HTMLElement>(
  active: boolean,
  containerRef: RefObject<T | null>,
  onEscape?: () => void,
) {
  useEffect(() => {
    if (!active) return
    const previousFocus = document.activeElement as HTMLElement | null
    const container = containerRef.current
    if (!container) return

    const getFocusable = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement)

    const initialTarget = getFocusable()[0] ?? container
    const frameId = window.requestAnimationFrame(() => {
      initialTarget.focus({ preventScroll: true })
    })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onEscape) {
        event.preventDefault()
        onEscape()
        return
      }
      if (event.key !== "Tab") return

      const focusables = getFocusable()
      if (focusables.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener("keydown", onKeyDown)
      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus({ preventScroll: true })
      }
    }
  }, [active, containerRef, onEscape])
}
