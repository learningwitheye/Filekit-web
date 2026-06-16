"use client"

import * as React from "react"
import Link from "next/link"
import { Check, Crown, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase" // Supabase auth check karne ke liye

const freePlan = [
  "Maximum 5 uploads (Basic Tools)",
  "1 Free AI Background Removal",
  "Lossless quality conversions",
  "Max 50MB per file",
  "No sign-up required",
  "Files deleted after 2 hours",
]

const proPlan = [
  "Unlimited uploads",
  "Lossless quality conversions",
  "Unlimited file size",
  "All 50+ tools unlocked",
  "Priority processing speed",
  "Unlimited AI Tools (BG Remover, Upscaler)",
  "Batch processing",
  "No ads",
  "Email support",
]

export function Pricing() {
  const [loading, setLoading] = React.useState(false)

  // Razorpay ka script load karne ka function
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      // 1. Check karo user logged in hai ya nahi
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        toast.error("Login Required", { description: "Please log in to buy the Pro plan." })
        // Google Login Trigger karna
        await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/auth/callback` } })
        return
      }

      // 2. Razorpay ka script load karo
      const res = await loadRazorpayScript()
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?")
        setLoading(false)
        return
      }

      // 3. Backend se 25 Rs ka order banwao
      const orderResponse = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
      
      if (!orderResponse.ok) throw new Error("Network response was not ok")
      const orderData = await orderResponse.json()

      // 4. Razorpay ka Popup kholo
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Tumhari Razorpay Key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "FileKit Pro",
        description: "Unlock Unlimited Access",
        order_id: orderData.id,
        handler: async function (response: any) {
          
          // ✅ Jaadu Yahan Hai: 7 din aage ka time nikal rahe hain
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 7);

          // ✅ Payment successful hote hi database mein is_pro true aur pro_expires_at dal rahe hain
          const { error } = await supabase
            .from('profiles')
            .upsert({ 
              id: session.user.id, 
              email: session.user.email, 
              is_pro: true,
              pro_expires_at: expiryDate.toISOString() // Naya expiry wala time
            });

          if (error) {
            console.error("Pro upgrade failed:", error);
            toast.error("Payment successful, but upgrade failed. Contact support.");
          } else {
            toast.success("Payment Successful! 🎉", { description: "Welcome to FileKit Pro!" });
            // Page ko refresh kar do taaki nayi limits apply ho jayein
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          }
        },
        prefill: {
          name: session.user.user_metadata?.full_name || "User",
          email: session.user.email,
        },
        theme: { color: "#2563eb" },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()
      
    } catch (error) {
      console.error(error)
      toast.error("Payment failed to initiate.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="pricing" className="px-4 py-16 bg-muted/30">
      <div className="max-w-screen-lg mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-sm mt-2">Start free. Upgrade when you need more.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free Plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Free</Badge>
              </div>
              <CardTitle className="text-2xl mt-3">Free Plan</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">₹0</span>
              </div>
              <CardDescription>Everything you need for occasional use, no account required.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="flex flex-col gap-2.5">
                {freePlan.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm">
                    <Check className="size-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" nativeButton={false} render={<Link href="/tool/compress-pdf" />}>
                Get Started Free
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <div className="relative pt-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
              <Badge className="gap-1 px-3 py-1 whitespace-nowrap">
                <Crown className="size-3" />
                Most Popular
              </Badge>
            </div>
            <Card className="flex flex-col border-primary shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                  Pro
                </Badge>
              </div>
              <CardTitle className="text-2xl mt-3">Pro Plan</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">₹25</span>
                <span className="text-muted-foreground text-sm">/ week</span>
              </div>
              <CardDescription>No limits, advanced AI features, and priority support.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="flex flex-col gap-2.5">
                {proPlan.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm">
                    <Check className="size-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full gap-2" onClick={handlePayment} disabled={loading}>
                <Crown className="size-4" />
                {loading ? "Processing..." : "Upgrade to Pro"}
              </Button>
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="size-3.5" />
                Secured by Razorpay
              </p>
            </CardFooter>
            </Card>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Payments are non-refundable. You can cancel your subscription anytime to avoid future charges.
        </p>
      </div>
    </section>
  )
}