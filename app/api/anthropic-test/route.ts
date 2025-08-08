import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({
        error: 'Anthropic API key not configured',
        setup: 'Add ANTHROPIC_API_KEY to your environment variables'
      }, { status: 400 })
    }

    const result = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt: `You are a helpful customer service AI assistant. Please respond to this customer message in a friendly and professional manner: "${message}"`,
      maxTokens: 500,
    })

    return Response.json({
      success: true,
      response: result.text,
      model: 'claude-3-5-sonnet-20241022',
      provider: 'anthropic'
    })

  } catch (error) {
    console.error('Anthropic API error:', error)
    return Response.json({
      success: false,
      error: 'Failed to connect to Anthropic API',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
