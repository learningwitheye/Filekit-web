import { Pricing } from "@/components/home/pricing"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing — FileKit",
  description: "Simple, transparent pricing. Free plan with 50MB limit. Pro plan at ₹350/month with unlimited files and AI features.",
}

export default function PricingPage() {
  return (
    <div className="flex-1 py-12">
      <Pricing />
    </div>
  )
}
