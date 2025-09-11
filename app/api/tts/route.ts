import { type NextRequest, NextResponse } from "next/server"
import { getAPIKey, isServiceAvailable } from "@/lib/api-keys"

export async function POST(request: NextRequest) {
  try {
    const { text, language = "en" } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Check if ElevenLabs is available
    if (!isServiceAvailable("ELEVENLABS")) {
      return NextResponse.json(
        {
          error: "Text-to-speech service not available. Please configure ELEVENLABS_API_KEY.",
        },
        { status: 503 },
      )
    }

    const apiKey = getAPIKey("ELEVENLABS")

    // Voice ID mapping for different languages
    const voiceIds = {
      en: "EXAVITQu4vr4xnSDxMaL", // Bella - English
      lg: "EXAVITQu4vr4xnSDxMaL", // Use English voice for Luganda
      sw: "EXAVITQu4vr4xnSDxMaL", // Use English voice for Swahili
    }

    const voiceId = voiceIds[language as keyof typeof voiceIds] || voiceIds.en

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: text.substring(0, 500), // Limit text length
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("TTS Error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate speech",
      },
      { status: 500 },
    )
  }
}
