// 🚨 NAYA FIX: Link import hata diya gaya hai
import {
  Combine, PackageMinus, FileText, Image, Wand2, ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const tools = [
  {
    name: "Image to PDF",
    slug: "jpg-to-pdf",
    description: "Convert JPG, PNG, BMP or TIFF images into a single PDF document instantly.",
    icon: Image,
    badge: "Free",
    color: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
  },
  {
    name: "Compress PDF",
    slug: "compress-pdf",
    description: "Reduce PDF file size while maintaining maximum quality for easy sharing.",
    icon: PackageMinus,
    badge: "Popular",
    color: "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400",
  },
  {
    name: "PDF to Word",
    slug: "pdf-to-word",
    description: "Convert your PDF to an editable Word document in seconds with high accuracy.",
    icon: FileText,
    badge: "Popular",
    color: "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400",
  },
  {
    name: "Merge PDF",
    slug: "merge-pdf",
    description: "Combine multiple PDF files into one document, in any order you choose.",
    icon: Combine,
    badge: "Free",
    color: "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400",
  },
  {
    name: "Image Compressor",
    slug: "image-compressor",
    description: "Reduce image file size for web without visible quality loss — bulk supported.",
    icon: PackageMinus,
    badge: "Free",
    color: "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400",
  },
  {
    name: "Background Remover",
    slug: "background-remover",
    description: "AI-powered tool to remove image backgrounds instantly. Perfect results every time.",
    icon: Wand2,
    badge: "AI",
    color: "bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400",
  },
]

export function PopularTools() {
  return (
    <section id="tools" className="px-4 py-12">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Popular Tools</h2>
            <p className="text-muted-foreground text-sm mt-1">Most used tools by our community</p>
          </div>
          {/* 🚨 NAYA FIX: <Link> ki jagah <a> tag laga diya */}
          <a href="/tool/compress-pdf" className="text-sm text-primary flex items-center gap-1 hover:underline">
            View all <ArrowRight className="size-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              /* 🚨 NAYA FIX (FINAL BOSS): <Link> ki jagah <a> laga diya. Scroll/Hover par freeze nahi hoga! */
              <a key={tool.slug} href={`/tool/${tool.slug}`}>
                <Card className="h-full hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`size-10 rounded-lg flex items-center justify-center ${tool.color}`}>
                        <Icon className="size-5" />
                      </div>
                      <Badge variant="secondary" className="text-xs">{tool.badge}</Badge>
                    </div>
                    <CardTitle className="text-base mt-3 group-hover:text-primary transition-colors">{tool.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}