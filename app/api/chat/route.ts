import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { anthropic } from "@ai-sdk/anthropic"
import { dbHelpers } from "@/lib/supabase"
import { n8nIntegration } from "@/lib/n8n-integration"
import { isServiceAvailable } from "@/lib/api-keys"

export async function POST(request: NextRequest) {
  try {
    const {
      sessionId,
      message,
      language = "en",
      businessType = "general",
      aiProvider = "google",
      conversationHistory = [],
    } = await request.json()

    if (!sessionId || !message) {
      return NextResponse.json({ error: "Session ID and message are required" }, { status: 400 })
    }

    // Get session details
    const session = await dbHelpers.getSession(sessionId)
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Detect if this is a complaint or escalation
    const escalationType = n8nIntegration.detectEscalationType(message)
    const priority = n8nIntegration.detectPriority(message)
    const shouldEscalate = escalationType === "complaint" || priority === "critical"

    // Generate AI response
    let aiResponse = ""
    let actualProvider = aiProvider
    const detectedLanguage = language

    try {
      // Try the requested AI provider
      aiResponse = await generateAIResponse(message, language, businessType, aiProvider, conversationHistory)
    } catch (error) {
      console.error(`${aiProvider} failed, trying fallback:`, error)

      // Try fallback providers
      if (aiProvider !== "google" && isServiceAvailable("GOOGLE")) {
        try {
          aiResponse = await generateAIResponse(message, language, businessType, "google", conversationHistory)
          actualProvider = "google"
        } catch (fallbackError) {
          console.error("Google fallback failed:", fallbackError)
        }
      }

      // Final fallback to mock response
      if (!aiResponse) {
        aiResponse = generateMockResponse(message, language, businessType)
        actualProvider = "mock"
      }
    }

    // Handle escalation if needed
    let escalationResult = null
    if (shouldEscalate) {
      try {
        escalationResult = await n8nIntegration.sendEscalation({
          agentId: n8nIntegration.getAgentId(),
          sessionId,
          userId: session.user_id,
          email: session.email,
          businessType,
          language,
          escalationType,
          priority,
          customerMessage: message,
          aiResponse,
          timestamp: new Date().toISOString(),
          metadata: {
            originalProvider: aiProvider,
            actualProvider,
            detectedLanguage,
          },
        })

        if (escalationResult.success) {
          // Update session status
          await dbHelpers.updateSession(sessionId, { status: "escalated" })

          // Create support ticket
          await dbHelpers.createTicket({
            session_id: sessionId,
            user_id: session.user_id,
            title: `${escalationType.charAt(0).toUpperCase() + escalationType.slice(1)} - ${businessType}`,
            description: `Customer message: "${message}"\n\nAI Response: "${aiResponse}"`,
            priority,
            status: "open",
          })
        }
      } catch (escalationError) {
        console.error("Escalation failed:", escalationError)
      }
    }

    return NextResponse.json({
      response: aiResponse,
      aiProvider: actualProvider,
      detectedLanguage,
      escalated: shouldEscalate,
      escalationType: shouldEscalate ? escalationType : null,
      priority: shouldEscalate ? priority : null,
      escalationResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        error: "Failed to process message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function generateAIResponse(
  message: string,
  language: string,
  businessType: string,
  provider: string,
  conversationHistory: any[],
): Promise<string> {
  const systemPrompt = getSystemPrompt(language, businessType)
  const contextMessages = conversationHistory.slice(-5).map((msg) => ({
    role: msg.role,
    content: msg.content,
  }))

  let model: any

  switch (provider) {
    case "google":
      if (!isServiceAvailable("GOOGLE")) throw new Error("Google AI not available")
      model = google("gemini-1.5-flash")
      break
    case "anthropic":
      if (!isServiceAvailable("ANTHROPIC")) throw new Error("Anthropic not available")
      model = anthropic("claude-3-haiku-20240307")
      break
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }

  const { text } = await generateText({
    model,
    system: systemPrompt,
    messages: [...contextMessages, { role: "user", content: message }],
    maxTokens: 500,
    temperature: 0.7,
  })

  return text
}

function generateMockResponse(message: string, language: string, businessType: string): string {
  const lowerMessage = message.toLowerCase()

  // Mock responses based on language
  const responses = {
    en: {
      greeting: "Hello! I'm here to help you with your inquiry.",
      complaint:
        "I understand your frustration. Let me escalate this to our human support team who can better assist you.",
      technical:
        "I see you're experiencing a technical issue. Our technical team will be notified to help resolve this.",
      billing: "I understand you have a billing concern. Let me connect you with our billing department.",
      general: "Thank you for your message. I'm here to help you with any questions or concerns you may have.",
    },
    lg: {
      greeting: "Oli otya! Ndi wano okukuyamba n'ekibuuzo kyo.",
      complaint: "Ntegeera obusungu bwo. Ka nkutwale eri abantu baffe abakulu abayinza okukuyamba obulungi.",
      technical: "Ndabye nti olina obuzibu bw'ekikugu. Ttiimu yaffe ey'ekikugu ejja kutegeezebwa okukuyamba.",
      billing: "Ntegeera nti olina ekibuuzo ku nsimbi. Ka nkutuuse ku ttiimu yaffe ey'ensimbi.",
      general: "Webale obubaka bwo. Ndi wano okukuyamba mu bibuuzo byonna.",
    },
    sw: {
      greeting: "Hujambo! Nipo hapa kukusaidia na swali lako.",
      complaint:
        "Naelewa hasira yako. Hebu nikupeleke kwa timu yetu ya binadamu ambao wanaweza kukusaidia vizuri zaidi.",
      technical: "Naona una tatizo la kiufundi. Timu yetu ya kiufundi itajulishwa kukusaidia kutatua hili.",
      billing: "Naelewa una wasiwasi wa malipo. Hebu nikuunganishe na idara yetu ya malipo.",
      general: "Asante kwa ujumbe wako. Nipo hapa kukusaidia na maswali yoyote au wasiwasi.",
    },
  }

  const langResponses = responses[language as keyof typeof responses] || responses.en

  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hujambo") ||
    lowerMessage.includes("oli otya")
  ) {
    return langResponses.greeting
  }

  if (lowerMessage.includes("complaint") || lowerMessage.includes("angry") || lowerMessage.includes("terrible")) {
    return langResponses.complaint
  }

  if (lowerMessage.includes("not working") || lowerMessage.includes("broken") || lowerMessage.includes("error")) {
    return langResponses.technical
  }

  if (lowerMessage.includes("bill") || lowerMessage.includes("payment") || lowerMessage.includes("money")) {
    return langResponses.billing
  }

  return langResponses.general
}

function getSystemPrompt(language: string, businessType: string): string {
  const businessContext = {
    telecom: "telecommunications and mobile services",
    banking: "banking and financial services",
    utilities: "utilities and energy services",
    ecommerce: "e-commerce and online shopping",
    general: "general customer support",
  }

  const context = businessContext[businessType as keyof typeof businessContext] || businessContext.general

  switch (language) {
    case "lg":
      return `Oli omuyambi wa AI mu ${context}. Oyamba abakasitoma mu Luganda. Bw'oba olaba nti omukasitoma alina obuzibu obunene oba okwemulugunya, gamba nti ojja kubatwala eri abantu abakulu. Kozesa empuliziganya ennungi era osanyuke.`

    case "sw":
      return `Wewe ni msaidizi wa AI katika ${context}. Unasaidia wateja kwa Kiswahili. Ikiwa unaona kwamba mteja ana tatizo kubwa au malalamiko, sema utampeleka kwa timu ya binadamu. Tumia lugha nzuri na uwe mpole.`

    default:
      return `You are an AI customer service assistant for ${context}. You help customers in English. If you detect that a customer has a serious issue or complaint, mention that you'll escalate to human support. Be helpful, polite, and professional in all interactions.`
  }
}
