import { languageDetector } from '@/backend/services/language-detection'
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

    // Test language detection with agent routing
    const result = await languageDetector.detectAndRoute(message)

    return NextResponse.json({
      primaryLanguage: result.primaryLanguage,
      confidence: result.confidence,
      localTerms: result.localTerms,
      mixedLanguage: result.mixedLanguage,
      supportedLanguages: result.supportedLanguages,
      agentResponse: result.agentResponse ? {
        response: result.agentResponse.response,
        language: result.agentResponse.language,
        confidence: result.agentResponse.confidence,
        agentUsed: result.agentResponse.agentUsed,
      } : null,
    })
  } catch (error) {
    console.error('Language detection test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}