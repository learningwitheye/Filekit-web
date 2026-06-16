import { notFound } from "next/navigation"
import Link from "next/link"
import {
  FileText, Table, AlignLeft, Code, FileType, File, Image, FileImage, ImageDown,
  ArrowRightLeft, Smartphone, Shapes, Video, Film, Combine, Scissors, PackageMinus,
  Trash2, LayoutGrid, RotateCw, Hash, Stamp, Lock, Unlock, Wrench, PenLine,
  Maximize2, Crop, Sparkles, Circle, Laugh, Wand2, Presentation,
} from "lucide-react"
import type { Metadata } from "next"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { UploadZone } from "@/components/tool/upload-zone"
import { SeoContent } from "@/components/tool/seo-content"
import { getToolBySlug, categories } from "@/lib/tools-data"
import { Badge } from "@/components/ui/badge"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, Table, AlignLeft, Code, FileType, File, Image, FileImage, ImageDown,
  ArrowRightLeft, Smartphone, Shapes, Video, Film, Combine, Scissors, PackageMinus,
  Trash2, LayoutGrid, RotateCw, Hash, Stamp, Lock, Unlock, Wrench, PenLine,
  Maximize2, Crop, Sparkles, Circle, Laugh, Wand2, Presentation,
}

export async function generateStaticParams() {
  return categories.flatMap((c) => c.tools.map((t) => ({ slug: t.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return { title: "Tool Not Found" }
  return {
    title: `${tool.name} — FileKit`,
    description: tool.description,
  }
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) notFound()

  const Icon = iconMap[tool.icon] ?? File

  return (
    <div className="flex-1 px-4 py-8 max-w-screen-md mx-auto w-full">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/#${tool.categorySlug}`} />}>
              {tool.category}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{tool.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="size-6 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{tool.name}</h1>
            {tool.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
          </div>
          <p className="text-muted-foreground text-sm mt-1">{tool.description}</p>
        </div>
      </div>

      {/* Top AdSense — 728×90 leaderboard */}
      <div
        className="w-full max-w-[728px] h-[90px] bg-muted/40 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-sm text-muted-foreground mb-6 mx-auto"
        aria-label="Advertisement"
      >
        Ad — 728×90
      </div>

      {/* Upload Zone */}
      <UploadZone toolName={tool.name} slug={slug} />

      {/* SEO Content */}
      <SeoContent toolName={tool.name} />

      {/* Bottom AdSense — 300×250 rectangle */}
      <div className="flex justify-center mt-8 mb-4">
        <div
          className="w-[300px] h-[250px] bg-muted/40 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-sm text-muted-foreground"
          aria-label="Advertisement"
        >
          Ad — 300×250
        </div>
      </div>
    </div>
  )
}