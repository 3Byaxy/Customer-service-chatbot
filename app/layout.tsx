import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KyakuShien - AI Customer Support System',
  description: 'Advanced multilingual customer support with voice capabilities, real-time monitoring, and intelligent admin approval workflows. Supporting English, Luganda, and Swahili.',
  keywords: ['ai', 'customer-support', 'chatbot', 'multilingual', 'voice-support', 'kyaku-shien', 'kizuna-ai'],
  authors: [{ name: 'KyakuShien Team' }],
  creator: 'KyakuShien Team',
  publisher: 'KyakuShien',
  robots: 'index, follow',
  openGraph: {
    title: 'KyakuShien - AI Customer Support System',
    description: 'Advanced multilingual customer support with voice capabilities and real-time monitoring.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KyakuShien - AI Customer Support System',
    description: 'Advanced multilingual customer support with voice capabilities and real-time monitoring.',
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
              <Link href="/features/language" className="hover:text-gray-900">Language</Link>
              <Link href="/catalog" className="hover:text-gray-900">Product Catalog</Link>
              <Link href="/features/voice" className="hover:text-gray-900">Voice</Link>
              <Link href="/features/admin-approval" className="hover:text-gray-900">Admin Approval</Link>
              <Link href="/features/realtime" className="hover:text-gray-900">Monitoring</Link>
              <Link href="/dashboard" className="hover:text-gray-900">User Dashboard</Link>
              <Link href="/admin" className="hover:text-gray-900 font-medium">Admin Dashboard</Link>
              <Link href="/tenants" className="hover:text-gray-900">Tenants (Dev)</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
