import { useEffect, useRef, useState, type MouseEvent } from "react"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import BrandSignature from "@/components/BrandSignature"
import ThemeToggle from "@/components/ThemeToggle"
import { useFocusTrap } from "@/hooks/useMotion"

type SiteHeaderProps = {
  mode: "home" | "program"
  onNavigate?: (href: string) => void
}

const OBSERVED_SECTIONS = ["home", "programs", "approach", "campus", "contact"] as const

export default function SiteHeader({ mode, onNavigate }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("home")
  const drawerRef = useRef<HTMLElement>(null)

  const prefix = mode === "home" ? "" : "/"

  useFocusTrap(menuOpen, drawerRef, () => setMenuOpen(false))

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (mode !== "home") return
    const elements = OBSERVED_SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.1, 0.35, 0.6],
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [mode])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  const navItems = [
    { id: "home", label: "Home", href: `${prefix}#home`, active: mode === "home" && activeSection === "home" },
    { id: "programs", label: "Programs", href: `${prefix}#programs`, active: mode === "program" || activeSection === "programs" },
    { id: "approach", label: "How it works", href: `${prefix}#approach`, active: mode === "home" && activeSection === "approach" },
    { id: "campus", label: "For colleges", href: `${prefix}#campus`, active: mode === "home" && activeSection === "campus" },
  ]

  const ctaLabel = mode === "home" ? "Explore programs" : "Talk to us"
  const ctaHref = mode === "home" ? "#programs" : "/#contact"

  function handleNavClick(event: MouseEvent<HTMLAnchorElement>, href: string, closeDrawer = false) {
    if (closeDrawer) setMenuOpen(false)
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
    <>
      <header
        className={`site-header fixed inset-x-0 top-0 z-40 w-full ${
          isScrolled || mode === "program" || menuOpen ? "is-scrolled" : ""
        }`}
      >
        <div className="flex h-16 w-full items-center justify-between gap-4 px-5 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-10">
          <div className="justify-self-start">
            <BrandSignature href={`${prefix}#home`} onNavigate={onNavigate} />
          </div>

          <nav
            className="hidden items-center gap-7 justify-self-center lg:flex"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                aria-current={item.active ? "page" : undefined}
                className={`relative py-1 text-sm transition-colors duration-200 hover:text-foreground ${
                  item.active ? "font-medium text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-[2px] bg-[#FA4028] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left ${
                    item.active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 justify-self-end sm:gap-3">
            <ThemeToggle />
            <Button
              asChild
              variant="default"
              className="hidden h-9 px-4 text-xs sm:inline-flex sm:text-sm"
            >
              <a href={ctaHref} onClick={(e) => handleNavClick(e, ctaHref)}>
                {ctaLabel} <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </Button>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-[4px] border border-border text-foreground transition-colors hover:border-[#FA4028] hover:text-[#FA4028] lg:hidden cursor-pointer"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="site-mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Dimmed Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-30 bg-[#020624]/60 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Animated Mobile Sheet */}
      <nav
        ref={drawerRef}
        id="site-mobile-navigation"
        aria-hidden={!menuOpen}
        aria-label="Mobile navigation"
        className={`site-header-drawer fixed inset-x-0 top-16 z-40 border-b border-border px-4 py-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 lg:hidden ${
          menuOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-3 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={(e) => handleNavClick(e, item.href, true)}
              className={`flex min-h-11 items-center justify-between rounded-[4px] px-3 py-2.5 text-sm transition-colors hover:bg-foreground/[0.06] ${
                item.active ? "font-medium text-path-accent" : "text-foreground"
              }`}
            >
              <span>{item.label}</span>
              {item.active && (
                <span className="size-1.5 rounded-full bg-[#FA4028]" aria-hidden="true" />
              )}
            </a>
          ))}
          <a
            href={ctaHref}
            tabIndex={menuOpen ? 0 : -1}
            onClick={(e) => handleNavClick(e, ctaHref, true)}
            className="mt-2 inline-flex min-h-11 items-center justify-between rounded-[4px] bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#FA4028] hover:text-white"
          >
            <span>{ctaLabel}</span>
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </nav>
    </>
  )
}
