import type { NextRequest } from "next/server"
import { voiceIntegration } from "@/environment/voice-integration"

export async function POST(request: NextRequest) {
  try {
    const { text, businessType, language = "en", voiceId } = await request.json()

    if (!text) {
      return Response.json({ error: "Text is required" }, { status: 400 })
    }

    let voiceResponse
    if (businessType) {
      voiceResponse = await voiceIntegration.generateBusinessSpeech(text, businessType, language)
    } else {
      voiceResponse = await voiceIntegration.generateSpeech(text, voiceId, language)
    }

    return Response.json(voiceResponse)
  } catch (error) {
    console.error("TTS API error:", error)
    return Response.json(
      {
        error: "Failed to generate speech",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
