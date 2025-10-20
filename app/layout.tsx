import Footer from '@/components/footer'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KyakuShien - Uganda\'s Smart Shopping Assistant',
  description: 'One chat connects you to verified, quality businesses across Uganda. Order food, buy electronics, book services—all through one AI assistant that speaks your language.',
  keywords: ['shopping', 'uganda', 'ai-assistant', 'verified-businesses', 'multilingual', 'food-delivery', 'services', 'kyaku-shien'],
  authors: [{ name: 'KyakuShien Team' }],
  creator: 'KyakuShien Team',
  publisher: 'KyakuShien',
  robots: 'index, follow',
  openGraph: {
    title: 'KyakuShien - Uganda\'s Smart Shopping Assistant',
    description: 'One chat connects you to verified, quality businesses across Uganda. Order food, buy electronics, book services—all through one AI assistant.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KyakuShien - Uganda\'s Smart Shopping Assistant',
    description: 'One chat connects you to verified, quality businesses across Uganda. Order food, buy electronics, book services—all through one AI assistant.',
  },
}

import Link from 'next/link'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold text-gray-900">KyakuShien</Link>
            <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
              <Link href="/" className="hover:text-gray-900">Home</Link>
              <Link href="/shop" className="hover:text-gray-900">Shop</Link>
              <Link href="/how-it-works" className="hover:text-gray-900">How It Works</Link>
              <Link href="/for-businesses" className="hover:text-gray-900">For Businesses</Link>
              <Link href="/about" className="hover:text-gray-900">About</Link>
            </nav>
          </div>
        </header>
        {children}
        <Footer />
      </body>
    </html>
  )
}
