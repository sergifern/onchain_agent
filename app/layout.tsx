import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Ethy AI',
  description: 'Bridging AI Agents with Digital Identity',
  openGraph: {
    images: `https://ethyai.xyz/og-new.png`, // TODO
  },
  icons: {
    icon: ['/favicon/favicon.ico?v=4'],
    apple: ['/favicon/apple-touch-icon.png?v=4'],
  },
  manifest: '/favicon/manifest.json',
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="apple-mobile-web-app-title" content="Ethy AI" />
      </head>
      <body className={inter.className}>
        <Providers>
          <main className="flex-1 p-4 overflow-auto">{children}</main>
        </Providers>
      </body>
    </html>
  )
}

