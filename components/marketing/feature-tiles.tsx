"use client"

import { Bot, Globe, Mic, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function FeatureTiles() {
  const tiles = [
    {
      href: "/features/language",
      title: "Auto Language Detection",
      desc: "Understands English, Luganda, and Swahili with local terms.",
      icon: <Globe className="h-5 w-5" />, color: "from-black to-neutral-800 text-white"
    },
    {
      href: "/features/voice",
      title: "Voice Integration",
      desc: "Speech recognition and TTS with call handoff.",
      icon: <Mic className="h-5 w-5" />, color: "from-red-500 to-rose-600 text-white"
    },
    {
      href: "/features/admin-approval",
      title: "Admin Approval",
      desc: "Gate sensitive actions with human review.",
      icon: <Shield className="h-5 w-5" />, color: "from-neutral-800 to-black text-white"
    },
    {
      href: "/features/realtime",
      title: "Live Monitoring",
      desc: "Dashboard of conversations, complaints, and health.",
      icon: <Zap className="h-5 w-5" />, color: "from-orange-500 to-amber-600 text-white"
    },
  ]

  return (
    <section className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((t) => (
          <Link href={t.href} key={t.href} className="rounded-xl border overflow-hidden group">
            <div className={`px-4 py-3 bg-gradient-to-r ${t.color}`}>
              <div className="flex items-center gap-2 text-sm font-medium">{t.icon}{t.title}</div>
            </div>
            <div className="p-4 text-sm text-gray-700">
              <p>{t.desc}</p>
              <span className="inline-block mt-2 text-blue-600 group-hover:underline">Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
