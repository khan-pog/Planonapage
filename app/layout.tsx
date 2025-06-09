import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { HelpBar } from "@/components/help-bar"
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Project Gallery",
  description: "Track and manage all company projects in one place",
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#ffffff',
  viewport: 'width=device-width, initial-scale=1',
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
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
