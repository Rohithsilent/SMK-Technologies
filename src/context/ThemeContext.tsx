import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

export type Theme = "dark" | "light"

interface ThemeContextValue {
  theme: Theme
  isTransitioning: boolean
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = "smk-theme-preference"
const TRANSITION_DURATION = 480

function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement
  root.setAttribute("data-theme", theme)
  root.style.colorScheme = theme
  if (theme === "light") {
    root.classList.add("light")
    root.classList.remove("dark")
    document.body.setAttribute("data-theme", "light")
    document.body.style.backgroundColor = "#FFFFFF"
    document.body.style.color = "#00063D"
  } else {
    root.classList.add("dark")
    root.classList.remove("light")
    document.body.setAttribute("data-theme", "dark")
    document.body.style.backgroundColor = "#020624"
    document.body.style.color = "#F8FAFC"
  }
  const metaTheme = document.querySelector('meta[name="theme-color"]')
  if (metaTheme) {
    metaTheme.setAttribute("content", theme === "light" ? "#FFFFFF" : "#020624")
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark"
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "light" || saved === "dark") return saved
    return "dark"
  })

  const [isTransitioning, setIsTransitioning] = useState(false)
  const transitionTimerRef = useRef<number | null>(null)

  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current)
      }
    }
  }, [])

  const toggleTheme = useCallback(() => {
    if (isTransitioning) return

    const nextTheme: Theme = theme === "dark" ? "light" : "dark"
    setIsTransitioning(true)
    setThemeState(nextTheme)
    localStorage.setItem(STORAGE_KEY, nextTheme)

    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current)
    }

    transitionTimerRef.current = window.setTimeout(() => {
      setIsTransitioning(false)
      transitionTimerRef.current = null
    }, TRANSITION_DURATION)
  }, [theme, isTransitioning])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isTransitioning,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
