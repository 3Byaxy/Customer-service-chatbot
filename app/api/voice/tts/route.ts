import { type NextRequest, NextResponse } from "next/server"
import { API_KEYS, isServiceAvailable } from "@/lib/api-keys"

export async function POST(request: NextRequest) {
  try {
    const { text, language = "en", provider = "elevenlabs" } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    if (provider === "elevenlabs" && isServiceAvailable("ELEVENLABS")) {
      // Use ElevenLabs TTS
      const voiceId = getElevenLabsVoiceId(language)

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": API_KEYS.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      })

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer()

        return new NextResponse(audioBuffer, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Content-Length": audioBuffer.byteLength.toString(),
          },
        })
      } else {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`)
      }
    } else {
      // Fallback: Return instructions for browser TTS
      return NextResponse.json({
        success: false,
        message: "ElevenLabs not available, use browser TTS",
        fallback: {
          provider: "browser",
          instructions: "Use SpeechSynthesisUtterance on the client side",
          text,
          language: getBrowserLanguageCode(language),
        },
      })
    }
  } catch (error) {
    console.error("TTS error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Text-to-speech failed",
        details: error instanceof Error ? error.message : "Unknown error",
        fallback: "Use browser TTS instead",
      },
      { status: 500 },
    )
  }
}

function getElevenLabsVoiceId(language: string): string {
  // ElevenLabs voice IDs for different languages
  switch (language) {
    case "en":
      return "21m00Tcm4TlvDq8ikWAM" // Rachel (English)
    case "sw":
      return "21m00Tcm4TlvDq8ikWAM" // Fallback to English
    case "lg":
      return "21m00Tcm4TlvDq8ikWAM" // Fallback to English
    default:
      return "21m00Tcm4TlvDq8ikWAM" // Default to Rachel
  }
}

function getBrowserLanguageCode(language: string): string {
  switch (language) {
    case "en":
      return "en-US"
    case "sw":
      return "sw-KE"
    case "lg":
      return "en-US" // Fallback to English for Luganda
    default:
      return "en-US"
  }
}
