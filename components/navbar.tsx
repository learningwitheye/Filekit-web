"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Moon, Sun, Zap, Menu, Crown, LogOut, Clock, User, LogIn } from "lucide-react" // ✅ Naye Icons add kiye (User, LogIn)
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/components/theme-provider"
import { categories } from "@/lib/tools-data"
import { createClient } from "@/lib/supabase"

export function Navbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<{ name: string; slug: string; category: string }[]>([])
  const [open, setOpen] = React.useState(false)

  const [user, setUser] = React.useState<any>(null)
  const [isPro, setIsPro] = React.useState(false)
  const [timeLeft, setTimeLeft] = React.useState<string | null>(null)
  
  // ✅ Naya State: Profile Dropdown Menu ke liye
  const [profileOpen, setProfileOpen] = React.useState(false)

  const router = useRouter()
  const ref = React.useRef<HTMLDivElement>(null)
  const profileRef = React.useRef<HTMLDivElement>(null) // Dropdown band karne ke liye ref

  React.useEffect(() => {
    const supabase = createClient()

    const getSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('is_pro, pro_expires_at')
          .eq('id', session.user.id)
          .single()
        
        if (data?.is_pro && data?.pro_expires_at) {
          const expiryDate = new Date(data.pro_expires_at)
          const now = new Date()

          if (expiryDate > now) {
            setIsPro(true)
            
            const updateTimer = () => {
              const currentTime = new Date()
              const diff = expiryDate.getTime() - currentTime.getTime()
              
              if (diff <= 0) {
                setIsPro(false)
                setTimeLeft(null)
                return
              }

              const days = Math.floor(diff / (1000 * 60 * 60 * 24))
              const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
              
              if (days > 0) {
                setTimeLeft(`${days}d ${hours}h left`)
              } else {
                 setTimeLeft(`${hours}h left`)
              }
            }

            updateTimer()
            const timerId = setInterval(updateTimer, 60000)
            return () => clearInterval(timerId)
          } else {
             setIsPro(false)
          }
        } else {
          setIsPro(false)
        }
      } else {
        setIsPro(false)
      }
    }
    getSessionAndProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session) {
        setIsPro(false)
        setTimeLeft(null)
        setProfileOpen(false) // Logout par menu band kar do
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`
      }
    })
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

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

  // ✅ Bahar click karne par Search aur Profile Menu dono band ho jayenge
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-screen-xl mx-auto px-3 sm:px-4 h-14 flex items-center gap-2 sm:gap-3">
        {/* Logo */}
        <Link href="/" prefetch={false} className="flex items-center gap-2 shrink-0 sm:mr-2">
          <div className="size-7 bg-primary rounded-md flex items-center justify-center">
            <Zap className="size-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-base hidden sm:block tracking-tight">FileKit</span>
        </Link>

        {/* Mobile sidebar toggle */}
        <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={onToggleSidebar}>
          <Menu className="size-4" />
        </Button>

        {/* Search Bar - Ab mobile par mast stretch hoga */}
        <div ref={ref} className="flex-1 w-full max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="pl-9 h-9 w-full bg-muted/50 border-transparent focus:border-primary text-sm"
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

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          {/* ✅ Desktop Only: Navbar ke bahar ka Badge/Button */}
          <div className="hidden sm:block">
            {isPro ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 rounded-md text-sm border border-amber-200 dark:border-amber-800 shadow-sm cursor-default">
                <div className="flex items-center gap-1 font-semibold">
                  <Crown className="size-4" /> Pro
                </div>
                {timeLeft && (
                  <div className="flex items-center gap-1 text-xs opacity-80 border-l border-amber-300 dark:border-amber-800 pl-2 ml-1">
                    <Clock className="size-3" /> {timeLeft}
                  </div>
                )}
              </div>
            ) : (
              <Button size="sm" className="gap-1.5" nativeButton={false} render={<Link href="/pricing" prefetch={false} />}>
                <Crown className="size-3.5" /> Buy Pro
              </Button>
            )}
          </div>

          {/* ✅ NAYA: Profile Dropdown Menu */}
          <div className="relative shrink-0 ml-1" ref={profileRef}>
            <button 
              onClick={() => setProfileOpen(!profileOpen)} 
              className="focus:outline-none ring-offset-background focus:ring-2 focus:ring-ring rounded-full"
            >
              {user ? (
                <img
                  src={user.user_metadata?.avatar_url || "https://www.gravatar.com/avatar/?d=mp"}
                  alt="Profile"
                  className="size-8 sm:size-9 rounded-full border border-border object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="size-8 sm:size-9 rounded-full border border-border bg-muted flex items-center justify-center hover:bg-accent transition-colors">
                  <User className="size-4 text-foreground/70" />
                </div>
              )}
            </button>

            {/* Dropdown Content */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-lg z-50 flex flex-col p-1.5 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Email dikhao agar logged in hai */}
                {user && (
                  <div className="px-2.5 py-2 text-sm text-muted-foreground truncate border-b border-border mb-1">
                    {user.email}
                  </div>
                )}

                {/* Plan Info Inside Dropdown */}
                <div className="px-2.5 py-2 flex flex-col gap-2">
                  {isPro ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-amber-500 font-semibold text-sm">
                        <Crown className="size-4" /> Pro Member
                      </div>
                      {timeLeft && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="size-3" /> {timeLeft}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="text-sm font-medium">Free Plan</div>
                      {/* Mobile par dropdown ke andar se Upgrade button */}
                      <Button size="sm" className="w-full gap-1.5" nativeButton={false} render={<Link href="/pricing" prefetch={false} onClick={() => setProfileOpen(false)} />}>
                        <Crown className="size-3.5" /> Upgrade to Pro
                      </Button>
                    </div>
                  )}
                </div>

                <div className="h-px bg-border my-1" />

                {/* Login / Logout Options */}
                {user ? (
                  <button onClick={() => { setProfileOpen(false); handleLogout(); }} className="w-full flex items-center gap-2 px-2.5 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-md transition-colors text-left">
                    <LogOut className="size-4" /> Log out
                  </button>
                ) : (
                  <button onClick={() => { setProfileOpen(false); handleGoogleLogin(); }} className="w-full flex items-center gap-2 px-2.5 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors text-left">
                    <LogIn className="size-4" /> Log in / Sign up
                  </button>
                )}

              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}