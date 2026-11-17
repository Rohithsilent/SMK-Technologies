import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
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
const TRANSITION_DURATION = 1000 // 1s Apple-grade cross-dissolve

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark"
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "light" || saved === "dark") return saved
    return "dark"
  })

  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    if (theme === "light") {
      document.documentElement.classList.add("light")
      document.documentElement.classList.remove("dark")
    } else {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    if (isTransitioning) return

    const nextTheme: Theme = theme === "dark" ? "light" : "dark"
    setIsTransitioning(true)
    setThemeState(nextTheme)
    localStorage.setItem(STORAGE_KEY, nextTheme)

    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, TRANSITION_DURATION)

    return () => clearTimeout(timer)
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
