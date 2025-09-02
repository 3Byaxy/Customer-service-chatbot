import type { NextRequest } from "next/server"
import { realtimeManager } from "@/environment/realtime-apis"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const sessionId = searchParams.get("sessionId")

  if (!userId || !sessionId) {
    return new Response("Missing userId or sessionId", { status: 400 })
  }

  // Create Server-Sent Events stream
  const stream = realtimeManager.createSSEStream(userId, sessionId)

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const { type, data, userId, sessionId, priority = "medium" } = await request.json()

    const event = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date(),
      data,
      userId,
      sessionId,
      priority,
    }

    realtimeManager.broadcastEvent(event)

    return Response.json({ success: true, eventId: event.id })
  } catch (error) {
    console.error("Realtime API error:", error)
    return Response.json({ error: "Failed to process event" }, { status: 500 })
  }
}
