"use client"

import Link from "next/link"
import { Check, Crown, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const freePlan = [
  "Max 50MB per file",
  "Standard conversion quality",
  "All basic tools",
  "No sign-up required",
  "Files deleted after 2 hours",
  "Up to 2 conversions/hour",
]

const proPlan = [
  "Unlimited file size",
  "Maximum quality conversions",
  "All 50+ tools unlocked",
  "Priority processing speed",
  "AI-powered tools (Upscaler, BG Remover)",
  "Batch processing",
  "No ads",
  "Email support",
]

export function Pricing() {
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
                <span className="text-muted-foreground text-sm">/ month</span>
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
                <Badge variant="outline" className="text-xs gap-1">
                  <Zap className="size-3" />
                  7-Day Free Trial
                </Badge>
              </div>
              <CardTitle className="text-2xl mt-3">Pro Plan</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">₹350</span>
                <span className="text-muted-foreground text-sm">/ month</span>
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
              <Button className="w-full gap-2" nativeButton={false} render={<Link href="/pricing" />}>
                <Crown className="size-4" />
                Start 7-Day Free Trial
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
          Strictly No Refund Policy once payment is processed. Cancel anytime before trial ends.
        </p>
      </div>
    </section>
  )
}
