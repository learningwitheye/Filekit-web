"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Moon, Sun, Zap, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/components/theme-provider"
import { categories } from "@/lib/tools-data"
import { cn } from "@/lib/utils"

export function Navbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<{ name: string; slug: string; category: string }[]>([])
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const ref = React.useRef<HTMLDivElement>(null)

  const allTools = categories.flatMap((c) =>
    c.tools.map((t) => ({ name: t.name, slug: t.slug, category: c.name }))
  )

  React.useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return }
    const filtered = allTools.filter((t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6)
    setResults(filtered)
    setOpen(filtered.length > 0)
  }, [query])

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
          <div className="size-7 bg-primary rounded-md flex items-center justify-center">
            <Zap className="size-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-base hidden sm:block tracking-tight">FileKit</span>
        </Link>

        {/* Mobile sidebar toggle */}
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onToggleSidebar}>
          <Menu className="size-4" />
        </Button>

        {/* Search */}
        <div ref={ref} className="flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="pl-9 h-9 bg-muted/50 border-transparent focus:border-primary"
          />
          {open && results.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50">
              {results.map((r) => (
                <button
                  key={r.slug}
                  onClick={() => { router.push(`/tool/${r.slug}`); setOpen(false); setQuery("") }}
                  className="w-full text-left px-4 py-2.5 hover:bg-accent flex items-center justify-between group"
                >
                  <span className="text-sm font-medium">{r.name}</span>
                  <span className="text-xs text-muted-foreground group-hover:text-accent-foreground">{r.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="size-9"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex" nativeButton={false} render={<Link href="/auth" />}>
            Log in
          </Button>
          <Button size="sm" className="hidden sm:flex" nativeButton={false} render={<Link href="/pricing" />}>
            Start Free Trial
          </Button>
        </div>
      </div>
    </header>
  )
}
