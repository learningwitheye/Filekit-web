"use client"

import * as React from "react"
// Link import ab use nahi ho raha, par Next.js ke doosre components ke liye safe rakhne ko chhod sakte hain
import Link from "next/link" 
import { usePathname } from "next/navigation"
import {
  FileText, Table, AlignLeft, Code, FileType, File, Image, FileImage, ImageDown,
  ArrowRightLeft, Smartphone, Shapes, Video, Film, Combine, Scissors, PackageMinus,
  Trash2, LayoutGrid, RotateCw, Hash, Stamp, Lock, Unlock, Wrench, PenLine,
  Maximize2, Crop, Sparkles, Circle, Laugh, Wand2, Presentation,
} from "lucide-react"
import { categories } from "@/lib/tools-data"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, Table, AlignLeft, Code, FileType, File, Image, FileImage, ImageDown,
  ArrowRightLeft, Smartphone, Shapes, Video, Film, Combine, Scissors, PackageMinus,
  Trash2, LayoutGrid, RotateCw, Hash, Stamp, Lock, Unlock, Wrench, PenLine,
  Maximize2, Crop, Sparkles, Circle, Laugh, Wand2, Presentation,
}

export function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname()

  const currentCategorySlug = categories.find((c) =>
    c.tools.some((t) => pathname === `/tool/${t.slug}`)
  )?.slug

  // 1. Controlled State: Ab menu hamare control mein hai
  const [openCategories, setOpenCategories] = React.useState<string[]>(
    currentCategorySlug ? [currentCategorySlug] : categories.map((c) => c.slug)
  )

  // 2. Auto-Open Magic: URL badalne par sahi menu apne aap khul jayega
  React.useEffect(() => {
    if (currentCategorySlug && !openCategories.includes(currentCategorySlug)) {
      setOpenCategories((prev) => [...prev, currentCategorySlug])
    }
  }, [currentCategorySlug])

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-14 left-0 bottom-0 z-40 w-64 bg-background border-r border-border overflow-y-auto transition-transform duration-200",
          "lg:translate-x-0 lg:static lg:top-0 lg:z-auto lg:h-full",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <nav className="p-3">
          {/* 🚨 FIX 1: All Tools link ko 'a' tag bana diya */}
          <a
            href="/"
            onClick={onClose}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium mb-1 transition-colors",
              pathname === "/" ? "bg-accent text-accent-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            All Tools
          </a>

          <Accordion
            multiple
            value={openCategories} // defaultValue hatakar value lagaya
            onValueChange={setOpenCategories} // user ke click ko handle karega
            className="space-y-0.5"
          >
            {categories.map((cat) => (
              <AccordionItem key={cat.id} value={cat.slug} className="border-0">
                <AccordionTrigger className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium hover:bg-muted hover:no-underline text-foreground [&[data-state=open]]:text-primary">
                  {cat.name}
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <ul className="space-y-0.5 ml-1">
                    {cat.tools.map((tool) => {
                      const Icon = iconMap[tool.icon]
                      const active = pathname === `/tool/${tool.slug}`
                      return (
                        <li key={tool.slug}>
                          {/* 🚨 FIX 2 (FINAL BOSS): <Link> ki jagah <a> lagaya. Hover karne par ab website freeze nahi hogi! */}
                          <a
                            href={`/tool/${tool.slug}`}
                            onClick={onClose}
                            className={cn(
                              "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                              active
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            {Icon && <Icon className="size-3.5 shrink-0" />}
                            <span className="truncate">{tool.name}</span>
                            {tool.popular && (
                              <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0 shrink-0">Hot</Badge>
                            )}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </nav>
      </aside>
    </>
  )
}