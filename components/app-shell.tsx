"use client"

import * as React from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <div className="flex flex-1 relative">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 flex flex-col">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  )
}
