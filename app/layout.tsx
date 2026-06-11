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
  title: {
    default: "FileKit | Every Tool You Need, Lightning Fast & Free",
    template: "%s | FileKit",
  },
  description: "Convert, compress, merge, and transform PDFs and images instantly. 100% fast, secure, and free online tools.",
  keywords: [
    "PDF converter", 
    "Image to PDF", 
    "Compress PDF", 
    "Merge PDF", 
    "Background Remover", 
    "Image Resizer", 
    "Free PDF tools", 
    "PDF editor"
  ],
  authors: [{ name: "FileKit" }],
  openGraph: {
    title: "FileKit | Mega Utility & Conversion Platform",
    description: "Lightning fast tools for your PDFs and Images. Convert, compress, and edit in seconds.",
    url: "https://filekitpdfs.online",
    siteName: "FileKit",
    type: "website",
  },
};

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