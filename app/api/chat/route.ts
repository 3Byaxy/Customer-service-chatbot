import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { openai } from "@ai-sdk/openai"
import { google } from "@ai-sdk/google"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

interface ChatRequest {
  sessionId: string
  message: string
  language: string
  businessType: string
  aiProvider: string
}

const getSystemPrompt = (businessType: string, language: string) => {
  const prompts = {
    telecom: {
      en: "You are a helpful customer service assistant for a telecommunications company. Help customers with billing, technical issues, service plans, and general inquiries. Be professional, empathetic, and solution-focused.",
      lg: "Oli omuyambi w'abakasitoma ku kkampuni y'essimu. Yamba abakasitoma ku nsonga za ssente, ebizibu by'ekikugu, enteekateeka z'obuweereza, n'ebibuuzo ebirala. Beera wa buvunaanyizibwa, okusaasira, era weekolere ku migaso.",
      sw: "Wewe ni msaidizi wa huduma kwa wateja kwa kampuni ya mawasiliano. Saidia wateja na malipo, matatizo ya kiufundi, mipango ya huduma, na maswali ya jumla. Kuwa wa kitaalamu, wa huruma, na wa kulenga suluhu.",
    },
    banking: {
      en: "You are a customer service representative for a bank. Assist customers with account inquiries, transactions, loans, and financial services. Maintain confidentiality and provide accurate information.",
      lg: "Oli omukozi w'obuweereza bw'abakasitoma mu bbanka. Yamba abakasitoma ku bibuuzo ku akawunti, okukola ebintu ku ssente, looni, n'obuweereza bw'ebyensimbi. Kuuma ebyama era owa amawulire amatuufu.",
      sw: "Wewe ni mwakilishi wa huduma kwa wateja kwa benki. Saidia wateja na maswali ya akaunti, miamala, mikopo, na huduma za kifedha. Hifadhi usiri na toa habari sahihi.",
    },
    utilities: {
      en: "You are a customer service agent for a utilities company. Help customers with billing, service outages, meter readings, and service connections. Be helpful and provide clear information.",
      lg: "Oli omukozi w'obuweereza bw'abakasitoma mu kkampuni y'amasanyalaze. Yamba abakasitoma ku nsonga za ssente, okuggwaawo kw'obuweereza, okusoma mita, n'okukwataganya obuweereza. Beera muyambi era owa amawulire agategeerekeka.",
      sw: "Wewe ni wakala wa huduma kwa wateja kwa kampuni ya huduma za umma. Saidia wateja na malipo, kukatika kwa huduma, kusoma mita, na miunganisho ya huduma. Kuwa wa kusaidia na kutoa habari wazi.",
    },
    ecommerce: {
      en: "You are a customer support representative for an e-commerce platform. Assist customers with orders, returns, payments, and product inquiries. Be friendly and solution-oriented.",
      lg: "Oli omukozi w'obuweereza bw'abakasitoma ku mukutu gw'okuguza ku yintaneeti. Yamba abakasitoma ku biragiro, okuddiza, okusasula, n'ebibuuzo ku bintu. Beera mukwano era weekolere ku migaso.",
      sw: "Wewe ni mwakilishi wa msaada wa wateja kwa jukwaa la biashara ya kielektroniki. Saidia wateja na maagizo, kurudi, malipo, na maswali ya bidhaa. Kuwa wa kirafiki na wa kulenga suluhu.",
    },
  }

  const businessPrompts = prompts[businessType as keyof typeof prompts] || prompts.telecom
  return businessPrompts[language as keyof typeof businessPrompts] || businessPrompts.en
}

const detectEscalation = (message: string): boolean => {
  const escalationKeywords = [
    "manager",
    "supervisor",
    "complaint",
    "angry",
    "frustrated",
    "cancel",
    "refund",
    "legal",
    "lawyer",
    "sue",
    "terrible",
    "worst",
    "hate",
    "never again",
    "omukulu",
    "okwemulugunya",
    "nsunguwaze",
    "sente zange",
    "nkwatako",
    "meneja",
    "msimamizi",
    "malalamiko",
    "hasira",
    "sitaki",
    "rudisha pesa",
  ]

  return escalationKeywords.some((keyword) => message.toLowerCase().includes(keyword.toLowerCase()))
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { sessionId, message, language, businessType, aiProvider } = body

    if (!sessionId || !message) {
      return NextResponse.json({ error: "Session ID and message are required" }, { status: 400 })
    }

    const systemPrompt = getSystemPrompt(businessType, language)
    const shouldEscalate = detectEscalation(message)

    // Select AI model based on provider
    let model
    switch (aiProvider) {
      case "openai":
        if (!process.env.OPENAI_API_KEY) {
          throw new Error("OpenAI API key not configured")
        }
        model = openai("gpt-4o-mini")
        break
      case "google":
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
          throw new Error("Google API key not configured")
        }
        model = google("gemini-1.5-flash")
        break
      case "groq":
        if (!process.env.GROQ_API_KEY) {
          throw new Error("Groq API key not configured")
        }
        model = groq("llama-3.1-8b-instant")
        break
      case "anthropic":
      default:
        if (!process.env.ANTHROPIC_API_KEY) {
          throw new Error("Anthropic API key not configured")
        }
        model = anthropic("claude-3-haiku-20240307")
        break
    }

    const { text } = await generateText({
      model,
      system: systemPrompt,
      prompt: message,
      maxTokens: 500,
    })

    const response = {
      response: text,
      sessionId,
      escalated: shouldEscalate,
      detectedLanguage: language,
      provider: aiProvider,
      timestamp: new Date().toISOString(),
    }

    console.log("Chat response:", response)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Chat error:", error)

    // Fallback response
    const fallbackResponses = {
      en: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment or contact our support team directly.",
      lg: "Nsonyiwa, ndi mu buzibu bw'ekikugu. Ddamu okugezaako oluvannyuma oba weekwatagane n'ekibiina kyaffe eky'obuyambi butereevu.",
      sw: "Naomba radhi, lakini nina matatizo ya kiufundi. Tafadhali jaribu tena baada ya muda au wasiliana na timu yetu ya msaada moja kwa moja.",
    }

    const fallbackMessage = fallbackResponses[language as keyof typeof fallbackResponses] || fallbackResponses.en

    return NextResponse.json({
      response: fallbackMessage,
      sessionId: "unknown",
      escalated: true,
      detectedLanguage: language || "en",
      provider: aiProvider || "anthropic",
      timestamp: new Date().toISOString(),
      error: true,
    })
  }
}

export async function GET() {
  return NextResponse.json({ message: "Chat API is working" })
}
