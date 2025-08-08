import { generateObject } from 'ai'
import { groq } from '@ai-sdk/groq'
import { z } from 'zod'

const questionAnalysisSchema = z.object({
  intent: z.string().describe('Primary intent of the question'),
  subIntent: z.string().describe('Specific sub-category of the intent'),
  entities: z.array(z.object({
    type: z.string(),
    value: z.string(),
    confidence: z.number()
  })).describe('Named entities found in the question'),
  sentiment: z.object({
    polarity: z.enum(['positive', 'negative', 'neutral']),
    intensity: z.number().min(0).max(1),
    emotions: z.array(z.string())
  }),
  language: z.object({
    detected: z.string(),
    confidence: z.number(),
    localTerms: z.array(z.string())
  }),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
  businessContext: z.object({
    category: z.string(),
    specificArea: z.string(),
    requiresEscalation: z.boolean()
  }),
  questionType: z.enum(['inquiry', 'complaint', 'request', 'compliment', 'emergency']),
  complexity: z.enum(['simple', 'moderate', 'complex']),
  contextNeeded: z.array(z.string()).describe('What context is needed to answer this question'),
  suggestedActions: z.array(z.string()).describe('Recommended actions based on analysis')
})

export async function POST(req: Request) {
  try {
    const { question, businessType, language } = await req.json()

    if (!question || !businessType) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Define business-specific context for better analysis
    const businessContextMap = {
      telecom: {
        commonTerms: ['data', 'bundles', 'network', 'airtime', 'SIM', 'roaming', 'billing'],
        localTerms: ['sente', 'simu', 'bundles', 'airtime'],
        urgentKeywords: ['no network', 'emergency', 'urgent', 'outage', 'billing dispute'],
        categories: ['data services', 'network issues', 'billing', 'customer service', 'technical support']
      },
      banking: {
        commonTerms: ['account', 'balance', 'transfer', 'loan', 'card', 'mobile money', 'ATM'],
        localTerms: ['sente', 'akawuka', 'mobile money', 'akaunt'],
        urgentKeywords: ['fraud', 'unauthorized', 'security', 'stolen', 'blocked'],
        categories: ['account management', 'transactions', 'loans', 'security', 'mobile banking']
      },
      utilities: {
        commonTerms: ['power', 'electricity', 'water', 'bill', 'meter', 'outage', 'connection'],
        localTerms: ['masanyu', 'amazzi', 'bili', 'mita'],
        urgentKeywords: ['outage', 'no power', 'no water', 'emergency', 'leak'],
        categories: ['power supply', 'water supply', 'billing', 'meter reading', 'service connection']
      },
      ecommerce: {
        commonTerms: ['order', 'delivery', 'payment', 'product', 'return', 'refund', 'tracking'],
        localTerms: ['boda', 'oda', 'okusasula'],
        urgentKeywords: ['damaged', 'wrong item', 'late delivery', 'payment failed'],
        categories: ['order management', 'delivery', 'payments', 'returns', 'customer service']
      }
    }

    const businessContext = businessContextMap[businessType as keyof typeof businessContextMap] || businessContextMap.telecom

    const analysis = await generateObject({
      model: groq('llama-3.1-70b-versatile'),
      schema: questionAnalysisSchema,
      prompt: `You are an advanced AI system that analyzes customer service questions for ${businessType} businesses in Uganda. 

      Analyze this customer question in comprehensive detail:
      "${question}"

      Business Context:
      - Type: ${businessType}
      - Common terms: ${businessContext.commonTerms.join(', ')}
      - Local terms to watch for: ${businessContext.localTerms.join(', ')}
      - Urgent keywords: ${businessContext.urgentKeywords.join(', ')}
      - Business categories: ${businessContext.categories.join(', ')}

      Provide detailed analysis covering:

      1. INTENT ANALYSIS:
         - What is the customer's primary goal?
         - What specific sub-intent within the business domain?

      2. ENTITY EXTRACTION:
         - Extract names, numbers, products, services, dates, locations
         - Provide confidence scores for each entity

      3. SENTIMENT & EMOTION:
         - Overall sentiment polarity and intensity
         - Specific emotions detected (frustrated, happy, confused, angry, etc.)

      4. LANGUAGE ANALYSIS:
         - Detect primary language (en, lg, sw)
         - Identify any local terms used
         - Confidence in language detection

      5. URGENCY ASSESSMENT:
         - How urgent is this request? (low/medium/high/critical)
         - Consider business impact and customer emotion

      6. BUSINESS CONTEXT:
         - Which business category does this fall under?
         - Specific area within that category
         - Does this require human escalation?

      7. QUESTION CLASSIFICATION:
         - Type: inquiry, complaint, request, compliment, emergency
         - Complexity: simple, moderate, complex

      8. CONTEXT REQUIREMENTS:
         - What information is needed to properly answer this?
         - Customer history, product info, account details, etc.

      9. SUGGESTED ACTIONS:
         - What actions should be taken based on this analysis?

      Be thorough and accurate in your analysis. This will be used to route the question to the appropriate AI model and provide the best possible customer service response.`,
      temperature: 0.1 // Low temperature for consistent analysis
    })

    return Response.json({
      success: true,
      analysis: analysis.object,
      processingTime: Date.now(),
      model: 'groq-llama-3.1-70b'
    })

  } catch (error) {
    console.error('Question analysis error:', error)
    return Response.json({
      success: false,
      error: 'Failed to analyze question',
      fallback: {
        intent: 'general_inquiry',
        sentiment: { polarity: 'neutral', intensity: 0.5 },
        urgency: 'medium',
        complexity: 'moderate'
      }
    }, { status: 500 })
  }
}
