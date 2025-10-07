"use client"

import { Bot, Globe, Mic, Shield } from "lucide-react"

export default function HeroShowcase() {
  return (
    <section className="mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Copy */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm border border-blue-200">
            <Bot className="h-4 w-4" />
            KyakuShien Platform
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Smart, multilingual customer support for local businesses
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Voice and text support with automatic language detection (English, Luganda, Swahili),
            speaker-aware interactions, and an approval-ready dashboard. Embed the widget in minutes
            and manage everything from your tenant dashboard.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Feature icon={<Mic className="h-4 w-4" />} title="Voice input" desc="TTS & speech recognition" color="purple" />
            <Feature icon={<Globe className="h-4 w-4" />} title="Language auto-detect" desc="EN / LG / SW" color="blue" />
            <Feature icon={<Shield className="h-4 w-4" />} title="Admin approvals" desc="Sensitive actions gated" color="green" />
            <Feature icon={<Bot className="h-4 w-4" />} title="AI routing" desc="Cost-aware providers" color="orange" />
          </div>
        </div>
        {/* Right: Visual */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-2xl rounded-3xl" />
          <div className="relative rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Bot className="h-4 w-4" /> Live demo snapshot
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <ChatBubble side="left" name="User">
                  Hello! Nkwagala data bundle ya 1GB.
                </ChatBubble>
                <ChatBubble side="right" name="KizunaAI" badge="LG">
                  Webale! Nsobola okukuyamba ku data bundles. Oyagala ya leero oba wiiki?
                </ChatBubble>
                <ChatBubble side="left" name="User">
                  Also, how is the network in Kampala today?
                </ChatBubble>
                <ChatBubble side="right" name="KizunaAI" badge="EN">
                  Network is stable in Kampala with 4G coverage. Would you like troubleshooting tips?
                </ChatBubble>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Feature({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: "purple"|"blue"|"green"|"orange" }) {
  const colorMap: Record<string, string> = {
    purple: "from-purple-50 to-purple-100 text-purple-800 border-purple-200",
    blue: "from-blue-50 to-blue-100 text-blue-800 border-blue-200",
    green: "from-green-50 to-green-100 text-green-800 border-green-200",
    orange: "from-orange-50 to-orange-100 text-orange-800 border-orange-200",
  }
  return (
    <div className={`rounded-xl border p-3 bg-gradient-to-b ${colorMap[color]} shadow-sm`}>
      <div className="flex items-center gap-2 text-sm font-medium">{icon}{title}</div>
      <div className="text-xs opacity-80 mt-1">{desc}</div>
    </div>
  )
}

function ChatBubble({ side, name, children, badge }: { side: "left" | "right"; name: string; children: React.ReactNode; badge?: string }) {
  const isLeft = side === 'left'
  return (
    <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${isLeft ? 'bg-gray-100 text-gray-900' : 'bg-blue-600 text-white'}`}>
        <div className="flex items-center gap-2 text-xs opacity-80 mb-1">
          <span>{name}</span>
          {badge && <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px]">{badge}</span>}
        </div>
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  )
}
