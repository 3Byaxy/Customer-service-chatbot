"use client"

import VoiceChatInterface from "@/components/voice-chat-interface"

export default function VoiceFeaturePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Voice Integration</h1>
      <p className="text-gray-600 mb-6">Speech recognition and text-to-speech with call handoff support.</p>
      <div className="rounded-xl border bg-white">
        <div className="p-4 border-b bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-t-xl">Live Demo</div>
        <div className="p-4">
          <VoiceChatInterface businessType="telecom" language="en" />
        </div>
      </div>
    </div>
  )
}