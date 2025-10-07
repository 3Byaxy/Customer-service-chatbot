import { elevenLabsAgentService } from "@/backend/services/elevenlabs-agent"

/**
 * POST /api/elevenlabs-agent
 * Start a conversation with ElevenLabs agent
 */
export async function POST(request: Request) {
  try {
    const { message, agentId = 'customer-support-agent', language = 'en', userId } = await request.json()

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    // Start conversation session
    const session = await elevenLabsAgentService.startConversation(agentId, userId)

    // Send message and get response
    const response = await elevenLabsAgentService.sendMessage(session.sessionId, message, language)

    // End conversation (for single-turn conversations)
    await elevenLabsAgentService.endConversation(session.sessionId)

    return Response.json({
      success: true,
      sessionId: session.sessionId,
      response: response.response,
      audioUrl: response.audioUrl,
      confidence: response.confidence,
      language: response.language,
      agentId: response.agentId,
      metadata: response.metadata
    })
  } catch (error) {
    console.error("ElevenLabs agent API error:", error)
    return Response.json(
      {
        error: "Failed to process agent request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

/**
 * GET /api/elevenlabs-agent
 * Get agent information and session stats
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    if (action === 'agents') {
      // Get available agents
      const agents = elevenLabsAgentService.getAvailableAgents()
      return Response.json({ agents })
    }

    if (action === 'stats') {
      // Get session statistics
      const stats = elevenLabsAgentService.getSessionStats()
      return Response.json({ stats })
    }

    // Default: return service status
    return Response.json({
      status: 'active',
      service: 'ElevenLabs Conversational Agent',
      version: '1.0.0'
    })
  } catch (error) {
    console.error("ElevenLabs agent GET error:", error)
    return Response.json(
      {
        error: "Failed to get agent information",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}