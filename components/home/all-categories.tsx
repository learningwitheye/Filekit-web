import * as React from "react"
// 🚨 NAYA FIX: Link import hata diya gaya hai
import {
  FileText, Table, AlignLeft, Code, FileType, File, Image, FileImage, ImageDown,
  ArrowRightLeft, Smartphone, Shapes, Video, Film, Combine, Scissors, PackageMinus,
  Trash2, LayoutGrid, RotateCw, Hash, Stamp, Lock, Unlock, Wrench, PenLine,
  Maximize2, Crop, Sparkles, Circle, Laugh, Wand2, Presentation,
} from "lucide-react"
import { categories } from "@/lib/tools-data"
import { Badge } from "@/components/ui/badge"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, Table, AlignLeft, Code, FileType, File, Image, FileImage, ImageDown,
  ArrowRightLeft, Smartphone, Shapes, Video, Film, Combine, Scissors, PackageMinus,
  Trash2, LayoutGrid, RotateCw, Hash, Stamp, Lock, Unlock, Wrench, PenLine,
  Maximize2, Crop, Sparkles, Circle, Laugh, Wand2, Presentation,
}

export function AllCategories() {
  return (
    <section className="px-4 py-12">
      <div className="max-w-screen-lg mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">All Tool Categories</h2>
          <p className="text-muted-foreground text-sm mt-1">Browse every tool we offer</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="border border-border rounded-xl p-5">
              <h3 className="font-semibold text-sm text-primary mb-3">{cat.name}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.tools.map((tool) => {
                  const Icon = iconMap[tool.icon]
                  return (
                    /* 🚨 NAYA FIX: <Link> ki jagah <a> tag laga diya */
                    <a
                      key={tool.slug}
                      href={`/tool/${tool.slug}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-accent hover:text-accent-foreground rounded-md text-sm transition-colors"
                    >
                      {Icon && <Icon className="size-3.5 shrink-0" />}
                      {tool.name}
                      {tool.popular && <Badge variant="secondary" className="text-[9px] px-1 py-0 ml-0.5">Hot</Badge>}
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}