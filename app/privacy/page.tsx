import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy — FileKit",
}

export default function PrivacyPage() {
  return (
    <div className="flex-1 max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="size-4" /> Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed flex flex-col gap-6">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Data Collection</h2>
          <p>FileKit does not collect personal data unless you create an account. Uploaded files are processed solely for the purpose of conversion and are never shared with third parties.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">File Storage</h2>
          <p>All uploaded files are automatically and permanently deleted from our servers within 2 hours of upload. We do not retain copies of your files after processing.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Cookies</h2>
          <p>We use minimal, essential cookies for session management and theme preferences. No advertising or tracking cookies are used.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Contact</h2>
          <p>For privacy-related inquiries, contact us at <a href="mailto:learning.witheye@gmail.com" className="text-primary underline">learning.witheye@gmail.com</a>.</p>
        </section>
      </div>
    </div>
  )
}
