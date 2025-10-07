import { aiAgentsService } from '@/backend/services/ai-agents'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Test AI agent routing
    const result = await aiAgentsService.routeToAgent(message, 'english') // Default to English for testing

    return NextResponse.json({
      response: result.response,
      language: result.language,
      confidence: result.confidence,
      agentUsed: result.agentUsed,
    })
  } catch (error) {
    console.error('AI Agents test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}