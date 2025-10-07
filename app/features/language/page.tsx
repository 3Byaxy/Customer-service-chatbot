"use client"

import ChatInterface from "@/components/chat-interface"

export default function LanguageFeaturePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Auto Language Detection</h1>
      <p className="text-gray-600 mb-6">Detects English, Luganda, and Swahili automatically and adapts responses and UI accordingly.</p>
      <div className="rounded-xl border bg-white">
        <div className="p-4 border-b bg-gradient-to-r from-black to-neutral-800 text-white rounded-t-xl">Live Demo</div>
        <div className="p-4">
          <ChatInterface businessType="telecom" />
        </div>
      </div>
    </div>
  )
}