import { type NextRequest, NextResponse } from "next/server"
import { APP_CONFIG } from "../../config/app-config"
import { languageDetector } from "../../services/language-detection"
import { approvalSystem } from "../../services/approval-system"

export async function POST(request: NextRequest) {
  try {
    const { message, businessType, sessionId, userId } = await request.json()

    // Detect language
    const languageDetection = languageDetector.detectLanguage(message)

    // Check if approval is needed
    const needsApproval = await approvalSystem.checkApprovalRequired(message, businessType)

    // Generate KizunaAI response
    const aiResponse = await generateKizunaResponse({
      message,
      businessType,
      language: languageDetection.primaryLanguage,
      needsApproval,
    })

    const response = {
      chatbot: APP_CONFIG.chatbot.name,
      message: aiResponse.content,
      language: languageDetection.primaryLanguage,
      confidence: languageDetection.confidence,
      detectedTerms: languageDetection.localTerms,
      needsApproval,
      suggestions: aiResponse.suggestions,
      metadata: {
        processingTime: aiResponse.processingTime,
        aiProvider: aiResponse.provider,
        sentiment: aiResponse.sentiment,
        intent: aiResponse.intent,
      },
    }

    if (needsApproval) {
      // Create approval request
      await approvalSystem.createApprovalRequest({
        conversationId: sessionId,
        userMessage: message,
        suggestedResponse: aiResponse.content,
        businessType,
        language: languageDetection.primaryLanguage,
        priority: aiResponse.priority,
      })

      response.message = `Hi! I'm ${APP_CONFIG.chatbot.name}. I understand your request, but I need to get approval from our team to provide the best response. Please wait a moment while I connect you with a specialist.`
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("KizunaAI chat error:", error)
    return NextResponse.json(
      {
        error: "KizunaAI is temporarily unavailable",
        chatbot: APP_CONFIG.chatbot.name,
        message: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
      },
      { status: 500 },
    )
  }
}

async function generateKizunaResponse({ message, businessType, language, needsApproval }: any) {
  const startTime = Date.now()

  // Simulate AI processing
  await new Promise((resolve) => setTimeout(resolve, 500))

  const responses = {
    telecom: {
      en: "I can help you with your telecommunications needs. What specific service are you looking for?",
      lg: "Nsobola okukuyamba ku nsonga za simu. Kiki ekikulu ky'oneetaaga?",
      sw: "Ninaweza kukusaidia na mahitaji yako ya mawasiliano. Unahitaji huduma gani?",
    },
    banking: {
      en: "I'm here to assist with your banking inquiries. How can I help you today?",
      lg: "Ndi wano okukuyamba ku nsonga za bbanka. Nkuyambe ntya leero?",
      sw: "Nipo hapa kukusaidia na maswali yako ya benki. Ninaweza kukusaidiaje leo?",
    },
    utilities: {
      en: "I can help you with utility services. What do you need assistance with?",
      lg: "Nsobola okukuyamba ku nsonga z'amasanyalaze. Kiki ky'oneetaaga?",
      sw: "Ninaweza kukusaidia na huduma za umeme na maji. Unahitaji msaada gani?",
    },
    ecommerce: {
      en: "Welcome! I'm here to help with your shopping needs. What are you looking for?",
      lg: "Tusanyuse! Ndi wano okukuyamba ku nsonga z'okugula. Kiki ky'onoonya?",
      sw: "Karibu! Nipo hapa kukusaidia na mahitaji yako ya ununuzi. Unatafuta nini?",
    },
  }

  const content = responses[businessType]?.[language] || responses[businessType]?.en || "How can I help you today?"

  return {
    content,
    suggestions: [
      "Tell me more about your services",
      "I need technical support",
      "Billing information",
      "Speak to a human agent",
    ],
    processingTime: Date.now() - startTime,
    provider: "gemini",
    sentiment: "neutral",
    intent: "general_inquiry",
    priority: needsApproval ? "high" : "medium",
  }
}
