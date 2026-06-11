import Link from "next/link"
import { Zap, Mail, Shield, Clock } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="size-7 bg-primary rounded-md flex items-center justify-center">
                <Zap className="size-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-base">FileKit</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every tool you need for files and images — fast, free, and secure.
            </p>
          </div>

          {/* Tools */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Popular Tools</h3>
            <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
              <li><Link href="/tool/compress-pdf" className="hover:text-foreground transition-colors">Compress PDF</Link></li>
              <li><Link href="/tool/merge-pdf" className="hover:text-foreground transition-colors">Merge PDF</Link></li>
              <li><Link href="/tool/pdf-to-word" className="hover:text-foreground transition-colors">PDF to Word</Link></li>
              <li><Link href="/tool/jpg-to-pdf" className="hover:text-foreground transition-colors">JPG to PDF</Link></li>
              <li><Link href="/tool/background-remover" className="hover:text-foreground transition-colors">Background Remover</Link></li>
              <li><Link href="/tool/image-compressor" className="hover:text-foreground transition-colors">Image Compressor</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Security & Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Security & Support</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="size-4 shrink-0 mt-0.5" />
                <a href="mailto:learning.witheye@gmail.com" className="hover:text-foreground transition-colors break-all">
                  learning.witheye@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Clock className="size-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Files are automatically deleted from our servers after 2 hours for your privacy.</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Shield className="size-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Files are processed securely with end-to-end encryption.</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FileKit. All rights reserved.</p>
          <p className="text-center sm:text-right">
            <span className="font-medium text-destructive">Strictly No Refund Policy</span>
            {" "}once payment is processed. Secured by{" "}
            <span className="font-medium text-foreground">Razorpay</span>.
          </p>
        </div>
      </div>
    </footer>
  )
}
