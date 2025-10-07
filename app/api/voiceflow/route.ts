import { type NextRequest, NextResponse } from "next/server"
import { getAPIKey, isServiceAvailable, API_KEYS } from "@/lib/api-keys"

export async function POST(request: NextRequest) {
  try {
    const { message, userId, sessionId } = await request.json()

    if (!isServiceAvailable("VOICEFLOW")) {
      return NextResponse.json(
        {
          error: "Voiceflow service not available. Please configure VOICEFLOW_API_KEY.",
        },
        { status: 503 },
      )
    }

    const apiKey = getAPIKey("VOICEFLOW")
    const projectId = API_KEYS.VOICEFLOW.projectId

    // Send message to Voiceflow
    const response = await fetch(`https://general-runtime.voiceflow.com/state/user/${userId}/interact`, {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
        versionID: "production",
      },
      body: JSON.stringify({
        action: {
          type: "text",
          payload: message,
        },
        config: {
          tts: false,
          stripSSML: true,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Voiceflow API error: ${response.status}`)
    }

    const data = await response.json()

    // Extract text responses from Voiceflow
    const textResponses = data
      .filter((item: any) => item.type === "text")
      .map((item: any) => item.payload.message)
      .join(" ")

    return NextResponse.json({
      success: true,
      response: textResponses || "I understand. How can I help you further?",
      voiceflowData: data,
    })
  } catch (error) {
    console.error("Voiceflow Error:", error)
    return NextResponse.json(
      {
        error: "Failed to process with Voiceflow",
      },
      { status: 500 },
    )
  }
}
