import "./globals.css"
import type { Metadata } from "next"
import { Inter, Hanken_Grotesk } from "next/font/google"
import localFont from 'next/font/local';
import { Providers } from "./providers"
import type React from "react" // Added import for React
import '@coinbase/onchainkit/styles.css';
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], style: ["normal", "italic"] })


const hansengrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: '--font-hansengrotesk',
})


const funnelDisplay = localFont({
  src: 'fonts/FunnelDisplay.ttf', 
  weight: '400',
  style: 'normal',
  variable: '--font-funnel',
});

export const metadata: Metadata = {
  title: 'Ethy AI',
  description: 'Bridging AI Agents with Digital Identity',
  openGraph: {
    images: `https://chat.ethyai.app/img/og-v3.png`,
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="apple-mobile-web-app-title" content="Ethy AI" />
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-CW15Z8E7K5`}
        />

        <Script id="tab-manager">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-CW15Z8E7K5');
        `}
        </Script>

        <Script id="twitter-pixel">
          {`
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            twq('config','p0d9v');
          `}
        </Script>
      </head>
      <body className={`${inter.className} ${funnelDisplay.variable} ${hansengrotesk.variable}`}>
        <Providers>
          <main className="flex-1">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

