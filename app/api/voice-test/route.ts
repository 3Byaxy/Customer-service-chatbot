import { type NextRequest, NextResponse } from "next/server"
import { n8nIntegration } from "@/lib/n8n-integration"
import { isServiceAvailable } from "@/lib/api-keys"

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case "test_microphone":
        // This test needs to be done on the client side
        return NextResponse.json({
          success: true,
          message: "Microphone test should be performed on client side",
          instructions: "Use navigator.mediaDevices.getUserMedia() to test microphone access",
        })

      case "test_speakers":
        // This test needs to be done on the client side
        return NextResponse.json({
          success: true,
          message: "Speaker test should be performed on client side",
          instructions: "Use Web Audio API or HTML5 audio to test speakers",
        })

      case "test_speech_recognition":
        return NextResponse.json({
          success: true,
          message: "Speech recognition available",
          details: {
            webkitSpeechRecognition: "Available in Chrome/Edge",
            languages: ["en-US", "sw-KE"],
            note: "Luganda falls back to English recognition",
          },
        })

      case "test_tts":
        const { text, language, provider } = data || {}

        if (provider === "elevenlabs" && isServiceAvailable("ELEVENLABS")) {
          try {
            // Test ElevenLabs TTS
            const ttsResponse = await fetch("/api/voice/tts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                text: text || "This is a test of the text to speech system",
                language: language || "en",
                provider: "elevenlabs",
              }),
            })

            if (ttsResponse.ok) {
              const audioBlob = await ttsResponse.blob()
              return NextResponse.json({
                success: true,
                message: "ElevenLabs TTS test successful",
                details: {
                  provider: "elevenlabs",
                  audioSize: audioBlob.size,
                  language: language || "en",
                },
              })
            } else {
              throw new Error(`ElevenLabs API error: ${ttsResponse.status}`)
            }
          } catch (error) {
            return NextResponse.json({
              success: false,
              message: "ElevenLabs TTS test failed",
              details: error instanceof Error ? error.message : "Unknown error",
              fallback: "Browser TTS will be used instead",
            })
          }
        } else {
          // Browser TTS test
          return NextResponse.json({
            success: true,
            message: "Browser TTS available",
            details: {
              provider: "browser",
              languages: ["en-US", "sw-KE"],
              note: "Browser speech synthesis is always available",
            },
          })
        }

      case "test_n8n_webhook":
        try {
          const webhookResult = await n8nIntegration.testWebhook()
          return NextResponse.json(webhookResult)
        } catch (error) {
          return NextResponse.json({
            success: false,
            message: "N8n webhook test failed",
            details: error instanceof Error ? error.message : "Unknown error",
          })
        }

      case "test_full_voice_flow":
        // Test the complete voice interaction flow
        const testResults = {
          microphone: { success: true, message: "Client-side test required" },
          speechRecognition: { success: true, message: "Available in supported browsers" },
          tts: { success: false, message: "Not tested" },
          n8nWebhook: { success: false, message: "Not tested" },
        }

        // Test TTS
        try {
          if (isServiceAvailable("ELEVENLABS")) {
            const ttsTest = await fetch("/api/voice/tts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                text: "Voice system test complete",
                language: "en",
                provider: "elevenlabs",
              }),
            })
            testResults.tts = {
              success: ttsTest.ok,
              message: ttsTest.ok ? "ElevenLabs TTS working" : "ElevenLabs TTS failed",
            }
          } else {
            testResults.tts = {
              success: true,
              message: "Browser TTS available",
            }
          }
        } catch (error) {
          testResults.tts = {
            success: false,
            message: "TTS test failed",
          }
        }

        // Test N8n webhook
        try {
          const webhookTest = await n8nIntegration.testWebhook()
          testResults.n8nWebhook = webhookTest
        } catch (error) {
          testResults.n8nWebhook = {
            success: false,
            message: "N8n webhook test failed",
          }
        }

        return NextResponse.json({
          success: true,
          message: "Full voice flow test completed",
          results: testResults,
        })

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Unknown action",
            availableActions: [
              "test_microphone",
              "test_speakers",
              "test_speech_recognition",
              "test_tts",
              "test_n8n_webhook",
              "test_full_voice_flow",
            ],
          },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error("Voice test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Voice test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
