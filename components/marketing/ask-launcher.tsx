"use client"

import { useState } from "react"
import CompactChatbotWidget from "@/components/compact-chatbot-widget"
import { Bot, MessageCircle } from "lucide-react"

const SUGGESTIONS: { label: string; businessType: string }[] = [
  { label: "Find trusted car dealers", businessType: "ecommerce" },
  { label: "Best data bundle today", businessType: "telecom" },
  { label: "Open a savings account", businessType: "banking" },
  { label: "Report no power / water", businessType: "utilities" },
]

export default function AskLauncher() {
  const [open, setOpen] = useState(false)
  const [businessType, setBusinessType] = useState<string>("telecom")

  return (
    <section className="mt-8">
      {/* Conversational entry */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50">
            <Bot className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-sm text-gray-700">
            Ask anything — we’ll find trusted answers and products for you.
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => { setBusinessType(s.businessType); setOpen(true) }}
              className="px-3 py-1 rounded-full border bg-gray-50 text-xs hover:bg-gray-100"
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            <MessageCircle className="h-4 w-4" /> Chat now
          </button>
        </div>
      </div>

      {/* Sticky FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 h-14 w-14 flex items-center justify-center"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Simple modal with embedded compact widget */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" role="dialog" aria-modal>
          <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl overflow-hidden">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 border hover:bg-white" aria-label="Close"
            >
              ×
            </button>
            <div className="h-[560px]">
              <CompactChatbotWidget businessType={businessType} position="embedded" maxHeight={520} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}