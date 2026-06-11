import Link from "next/link"
import { ArrowRight, Zap, Shield, Infinity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="px-4 py-16 md:py-24 text-center">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs font-medium">
          <Zap className="size-3" />
          50+ Free Tools. No Sign-up Required.
        </Badge>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-tight">
          Every Tool You Need,{" "}
          <span className="text-primary">Lightning Fast</span>{" "}
          &amp; Free
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl leading-relaxed text-pretty">
          Convert, compress, merge, and transform PDFs and images — all in your browser.
          No installations, no sign-ups, no limits on the free plan.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" nativeButton={false} render={<Link href="#tools" />} className="gap-2">
            Explore All Tools <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" size="lg" nativeButton={false} render={<Link href="/pricing" />}>
            View Pro Plan
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="size-4 text-primary" />
            Files deleted after 2 hours
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="size-4 text-primary" />
            Processed in seconds
          </div>
          <div className="flex items-center gap-1.5">
            <Infinity className="size-4 text-primary" />
            Pro: unlimited files
          </div>
        </div>
      </div>
    </section>
  )
}
