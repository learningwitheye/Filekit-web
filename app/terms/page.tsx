import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service — FileKit",
}

export default function TermsPage() {
  return (
    <div className="flex-1 max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="size-4" /> Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="flex flex-col gap-6 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Acceptance of Terms</h2>
          <p>By using FileKit, you agree to be bound by these Terms of Service. If you do not agree, please discontinue use immediately.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Permitted Use</h2>
          <p>FileKit is provided for personal and professional file conversion use. You agree not to use the service for illegal, harmful, or abusive purposes.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Refund Policy</h2>
          <p className="font-medium text-destructive">Strictly No Refund Policy: Once a payment is processed for the Pro plan, no refunds will be issued under any circumstances. Please ensure you review the plan details before purchasing.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Limitation of Liability</h2>
          <p>FileKit is provided &quot;as is&quot; without warranties. We are not liable for any loss of data or damages arising from the use of this service.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Contact</h2>
          <p>For legal inquiries, contact us at <a href="mailto:learning.witheye@gmail.com" className="text-primary underline">learning.witheye@gmail.com</a>.</p>
        </section>
      </div>
    </div>
  )
}
