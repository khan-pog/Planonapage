import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { HelpBar } from "@/components/help-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Project Gallery",
  description: "Track and manage all company projects in one place",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <main className="pb-12">{children}</main>
          <HelpBar />
        </ThemeProvider>
      </body>
    </html>
  )
}
