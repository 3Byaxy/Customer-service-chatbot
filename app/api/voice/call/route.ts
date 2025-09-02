import type { NextRequest } from "next/server"
import { voiceIntegration } from "@/environment/voice-integration"
import { realtimeManager } from "@/environment/realtime-apis"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, businessType, language = "en" } = await request.json()

    if (!phoneNumber) {
      return Response.json({ error: "Phone number is required" }, { status: 400 })
    }

    // Create business-specific assistant if needed
    let assistantId
    if (businessType) {
      assistantId = await voiceIntegration.createBusinessAssistant(businessType, language)
    }

    // Create the call
    const call = await voiceIntegration.createVapiCall(phoneNumber, assistantId)

    // Send real-time notification
    realtimeManager.sendVoiceCallEvent(call.id, "call_initiated", {
      phoneNumber,
      businessType,
      language,
      assistantId,
    })

    return Response.json({
      success: true,
      callId: call.id,
      status: call.status,
      phoneNumber: call.phoneNumber,
    })
  } catch (error) {
    console.error("Voice call API error:", error)
    return Response.json(
      {
        error: "Failed to initiate call",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const callId = searchParams.get("callId")

  if (!callId) {
    return Response.json({ error: "Call ID is required" }, { status: 400 })
  }

  try {
    const call = await voiceIntegration.getCallStatus(callId)

    if (!call) {
      return Response.json({ error: "Call not found" }, { status: 404 })
    }

    return Response.json(call)
  } catch (error) {
    console.error("Voice call status error:", error)
    return Response.json(
      {
        error: "Failed to get call status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
