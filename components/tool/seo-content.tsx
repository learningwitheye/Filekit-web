import { CheckCircle, HelpCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface SeoContentProps {
  toolName: string
}

export function SeoContent({ toolName }: SeoContentProps) {
  const steps = [
    { title: "Upload your file", description: `Click the upload area or drag and drop your file into the box. Supports files up to 50MB on the free plan.` },
    { title: `Apply ${toolName} settings`, description: "Choose your quality and output preferences. Pro users can unlock maximum quality and advanced options." },
    { title: "Download your result", description: "Once processing is complete, click the Download button to save your converted file instantly." },
  ]

  const features = [
    "Lightning-fast processing — results in seconds",
    "Secure & private — files deleted after 2 hours",
    "No software installation required",
    "Works on all devices — desktop, tablet, mobile",
    "High-quality output with every conversion",
    "Free tier available with no sign-up required",
  ]

  const faqs = [
    {
      q: `Is ${toolName} free to use?`,
      a: `Yes! ${toolName} is completely free for files up to 50MB. For unlimited file sizes and advanced features, upgrade to our Pro plan at ₹350/month.`,
    },
    {
      q: "Are my files secure?",
      a: "Absolutely. All files are processed over an encrypted HTTPS connection and are automatically deleted from our servers within 2 hours of upload.",
    },
    {
      q: "What's the maximum file size?",
      a: "Free users can upload files up to 50MB. Pro users enjoy unlimited file sizes with priority processing.",
    },
    {
      q: "Can I use this tool on my phone?",
      a: "Yes! FileKit is fully responsive and works on all modern browsers — iOS, Android, desktop, and tablet.",
    },
    {
      q: "Do I need to create an account?",
      a: "No account is required for the free plan. Create a Pro account to unlock unlimited conversions and advanced features.",
    },
  ]

  return (
    <div className="flex flex-col gap-10 mt-12">
      <Separator />

      {/* How to use */}
      <section>
        <h2 className="text-xl font-bold mb-5">How to use {toolName}</h2>
        <ol className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="size-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-sm">{step.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-xl font-bold mb-5">Features</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm">
              <CheckCircle className="size-4 text-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </section>

      {/* FAQs */}
      <section>
        <h2 className="text-xl font-bold mb-5">Frequently Asked Questions</h2>
        <Accordion className="border border-border rounded-xl overflow-hidden">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-0 border-b last:border-b-0 border-border px-4">
              <AccordionTrigger className="text-sm font-medium text-left py-4 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  )
}
