"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "dark" | "light"
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<"dark" | "light">("light")

  React.useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored) setThemeState(stored)
  }, [])

  React.useEffect(() => {
    const root = document.documentElement
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const apply = (t: Theme) => {
      const resolved = t === "system" ? (mediaQuery.matches ? "dark" : "light") : t
      root.classList.remove("dark", "light")
      root.classList.add(resolved)
      setResolvedTheme(resolved)
    }

    apply(theme)
    localStorage.setItem("theme", theme)

    const handler = () => {
      if (theme === "system") apply("system")
    }
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [theme])

  const setTheme = (t: Theme) => setThemeState(t)

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
