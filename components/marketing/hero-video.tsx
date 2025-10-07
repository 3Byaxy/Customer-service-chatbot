"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

interface HeroVideoProps {
  videoSrc?: string
  posterSrc?: string
  title?: string
  subtitle?: string
}

export default function HeroVideo({
  videoSrc = "/media/hero.mp4",
  posterSrc = "/media/hero.jpg",
  title = "AI Customer Support for Local Businesses",
  subtitle = "Voice + Text • Auto Language Detection (EN/LG/SW) • Admin Approvals • Live Monitoring",
}: HeroVideoProps) {
  const [saveData, setSaveData] = useState(false)

  useEffect(() => {
    try {
      // Prefer poster-only if the user or network requests reduced data
      // @ts-ignore
      const conn = (navigator as any).connection
      if (conn?.saveData) setSaveData(true)
      const mql = window.matchMedia('(prefers-reduced-data: reduce)')
      if (mql.matches) setSaveData(true)
    } catch {}
  }, [])

  return (
    <section className="relative overflow-hidden rounded-3xl border bg-black text-white shadow-xl">
      {/* Background video or poster-only for data saving */}
      <div className="absolute inset-0">
        {saveData ? (
          // Poster fallback only
          <img src={posterSrc} alt="Hero poster" className="h-full w-full object-cover" />
        ) : (
          <video
            className="h-full w-full object-cover"
            autoPlay
            playsInline
            muted
            loop
            poster={posterSrc}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Overlay content */}
      <div className="relative z-10 px-6 py-16 sm:px-10 sm:py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs border border-white/20 backdrop-blur">
            <span className="opacity-90">KyakuShien Platform</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">
            {title}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-white/80 max-w-2xl">
            {subtitle}
          </p>

          {/* Badge row for clarity */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-red-600 text-white">Voice</span>
            <span className="px-2 py-1 rounded bg-black text-white">EN / LG / SW</span>
            <span className="px-2 py-1 rounded bg-neutral-800 text-white">Approvals</span>
            <span className="px-2 py-1 rounded bg-orange-500 text-white">Monitoring</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/features/language" className="inline-flex">
              <button className="px-4 py-2 rounded-md bg-white text-black text-sm font-medium hover:bg-gray-200">Explore Features</button>
            </Link>
            <Link href="/widget/embedded?tenant=demo" className="inline-flex">
              <button className="px-4 py-2 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600">Try Embedded Demo</button>
            </Link>
            <Link href="/admin" className="inline-flex">
              <button className="px-4 py-2 rounded-md bg-neutral-900/70 text-white text-sm font-medium border border-white/10 hover:bg-neutral-800">Open Admin</button>
            </Link>
            <a href="#audiences" className="inline-flex">
              <button className="px-4 py-2 rounded-md bg-white/10 text-white text-sm font-medium border border-white/20 hover:bg-white/20">Learn more</button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
