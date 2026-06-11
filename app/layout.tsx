import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppShell } from "@/components/app-shell"
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FileKit — Every Tool You Need, Lightning Fast & Free",
  description:
    "Convert, compress, merge, and transform PDFs and images with 50+ free tools. No installation, no sign-up. Pro plan unlocks unlimited file sizes and AI features.",
  keywords: ["PDF converter", "image converter", "compress PDF", "merge PDF", "background remover"],
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        <ThemeProvider defaultTheme="system">
          <AppShell>{children}</AppShell>
          <Toaster richColors closeButton />
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
