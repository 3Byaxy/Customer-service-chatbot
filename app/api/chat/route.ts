import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

const supabaseUrl = "https://uckvdxvgdfzhzjqdhztz.supabase.co"
const supabaseKey =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVja3ZkeHZnZGZ6aHpqcWRoenR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDk5NDIsImV4cCI6MjA3MzAyNTk0Mn0.-3qr1-HRAm3q1va_2rPQTPg5VSKecDhkK4Rs8JzpMSU"

const supabase = createClient(supabaseUrl, supabaseKey)

// Mock AI responses for different providers
const mockAIResponses = {
  openai: {
    greeting: {
      en: "Hello! I'm here to help you with your customer service needs. What can I assist you with today?",
      lg: "Webale! Ndi wano okukuyamba ku nsonga z'obuweereza bw'abakasitoma. Nkuyinza ntya okukuyamba leero?",
      sw: "Hujambo! Nipo hapa kukusaidia na mahitaji yako ya huduma kwa wateja. Ninawezaje kukusaidia leo?",
    },
    general: {
      en: "I understand your concern. Let me help you with that. Based on our knowledge base, here's what I can tell you:",
      lg: "Ntegeera ekikukwatako. Ka nkuyambe ku ekyo. Okusinziira ku by'amagezi gaffe, kino kye nsobola okukutegeeza:",
      sw: "Naelewa wasiwasi wako. Hebu nikusaidie na hilo. Kulingana na msingi wetu wa maarifa, hiki ndicho ninachoweza kukuambia:",
    },
  },
  anthropic: {
    greeting: {
      en: "Hi there! I'm Claude, your AI assistant for customer service. How may I help you today?",
      lg: "Oli otya! Nze Claude, omuyambi wo ow'obugezi obw'ekyuma ku nsonga z'obuweereza. Nkuyinza ntya okukuyamba leero?",
      sw: "Hujambo! Mimi ni Claude, msaidizi wako wa AI kwa huduma za wateja. Ninawezaje kukusaidia leo?",
    },
    general: {
      en: "Thank you for reaching out. I'm here to provide you with accurate and helpful information. Let me assist you with your inquiry:",
      lg: "Webale okutukiriza. Ndi wano okukuwa obubaka obututufu era obuyamba. Ka nkuyambe ku ky'obuuza:",
      sw: "Asante kwa kuwasiliana nasi. Nipo hapa kukupa habari sahihi na za msaada. Hebu nikusaidie na swali lako:",
    },
  },
  google: {
    greeting: {
      en: "Hello! I'm Gemini, your intelligent customer service assistant. What would you like help with?",
      lg: "Webale! Nze Gemini, omuyambi wo ow'amagezi ku nsonga z'obuweereza. Oyagala nkuyambe ku ki?",
      sw: "Hujambo! Mimi ni Gemini, msaidizi wako mahiri wa huduma za wateja. Ungependa msaada gani?",
    },
    general: {
      en: "I'm processing your request using advanced AI capabilities. Here's the information that should help you:",
      lg: "Nkola ku kusaba kwo ng'enkozesa obuyinza bw'obugezi obw'ekyuma obw'amaanyi. Wano waliwo obubaka obuyinza okukuyamba:",
      sw: "Ninachakata ombi lako kwa kutumia uwezo wa hali ya juu wa AI. Hapa kuna habari inayoweza kukusaidia:",
    },
  },
  groq: {
    greeting: {
      en: "Hey! I'm your fast AI assistant powered by Groq. Ready to help you quickly and efficiently!",
      lg: "Oli otya! Nze omuyambi wo ow'obugezi obw'ekyuma ow'amaanyi nga nkozesebwa Groq. Nteekeddeko okukuyamba amangu era obulungi!",
      sw: "Hujambo! Mimi ni msaidizi wako wa haraka wa AI anayeendeshwa na Groq. Niko tayari kukusaidia haraka na kwa ufanisi!",
    },
    general: {
      en: "Processing at lightning speed! Here's what I found to help with your question:",
      lg: "Nkola ku simu y'eggulu! Wano kye nazuula okuyamba ku kibuuzo kyo:",
      sw: "Ninachakata kwa kasi ya umeme! Hapa ndivyo nilivyopata ili kusaidia na swali lako:",
    },
  },
}

// Intent detection function
function detectIntent(message: string, businessType: string): string {
  const lowerMessage = message.toLowerCase()

  // Escalation keywords
  const escalationKeywords = [
    "speak to human",
    "talk to agent",
    "manager",
    "complaint",
    "angry",
    "frustrated",
    "cancel",
    "refund",
  ]
  if (escalationKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return "escalation"
  }

  // Knowledge lookup keywords by business type
  const knowledgeKeywords = {
    telecom: ["data", "bundle", "network", "signal", "bill", "payment", "airtime", "internet"],
    banking: ["account", "balance", "card", "loan", "transfer", "atm", "mobile banking"],
    utilities: ["power", "electricity", "water", "meter", "outage", "bill", "payment"],
    ecommerce: ["order", "delivery", "return", "refund", "product", "shipping", "payment"],
  }

  const businessKeywords = knowledgeKeywords[businessType as keyof typeof knowledgeKeywords] || []
  if (businessKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return "knowledge_lookup"
  }

  // Greeting keywords
  const greetingKeywords = ["hello", "hi", "hey", "good morning", "good afternoon", "webale", "hujambo"]
  if (greetingKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return "greeting"
  }

  return "general"
}

// Language detection function
function detectLanguage(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Luganda keywords
  const lugandaKeywords = ["webale", "oli otya", "nkuyinza", "okuyamba", "leero", "nze", "gwe"]
  if (lugandaKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return "lg"
  }

  // Swahili keywords
  const swahiliKeywords = ["hujambo", "asante", "habari", "msaada", "leo", "mimi", "wewe"]
  if (swahiliKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return "sw"
  }

  return "en" // Default to English
}

// Knowledge base search function
async function searchKnowledgeBase(query: string, businessType: string, language: string) {
  try {
    const { data, error } = await supabase
      .from("knowledge_base")
      .select("*")
      .eq("business_type", businessType)
      .eq("language", language)
      .textSearch("content", query)
      .limit(3)

    if (error) {
      console.error("Knowledge base search error:", error)
      return null
    }

    return data && data.length > 0 ? data[0] : null
  } catch (error) {
    console.error("Knowledge base search error:", error)
    return null
  }
}

// Create ticket function
async function createTicket(sessionId: string, message: string, businessType: string) {
  try {
    const { data, error } = await supabase
      .from("tickets")
      .insert([
        {
          session_id: sessionId,
          status: "open",
          priority: "medium",
          category: businessType,
          description: message,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Ticket creation error:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Ticket creation error:", error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, businessType, language } = await request.json()

    if (!message || !sessionId || !businessType || !language) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Create system prompt based on business type and language
    const systemPrompts = {
      telecom: {
        en: "You are a helpful customer service representative for a telecommunications company. Help customers with billing, technical issues, service plans, and general inquiries. Be professional and empathetic.",
        lg: "Oli mukozi w'obuweereza bw'abakasitoma mu kampuni y'empuliziganya. Yamba abakasitoma ku nsonga z'okusasula, ebizibu by'ekikugu, enteekateeka z'obuweereza, n'ebibuuzo ebirala. Beera wa bulijjo era w'ekisa.",
        sw: "Wewe ni mwakilishi wa huduma kwa wateja wa kampuni ya mawasiliano. Saidia wateja na malipo, matatizo ya kiufundi, mipango ya huduma, na maswali ya jumla. Kuwa wa kitaalamu na wa huruma.",
      },
      banking: {
        en: "You are a professional banking customer service representative. Assist customers with account inquiries, transactions, loans, and financial services. Maintain confidentiality and security.",
        lg: "Oli mukozi w'obuweereza bw'abakasitoma mu bbanka. Yamba abakasitoma ku nsonga z'akawunti, okukola ebintu, looni, n'obuweereza bw'ensimbi. Kuuma ebyama n'obukuumi.",
        sw: "Wewe ni mwakilishi wa huduma kwa wateja wa benki. Saidia wateja na maswali ya akaunti, miamala, mikopo, na huduma za kifedha. Hifadhi usiri na usalama.",
      },
      utilities: {
        en: "You are a customer service representative for a utilities company. Help customers with billing, service connections, outages, and maintenance issues. Be helpful and informative.",
        lg: "Oli mukozi w'obuweereza bw'abakasitoma mu kampuni y'ebikozesebwa. Yamba abakasitoma ku nsonga z'okusasula, okukwataganya obuweereza, okuggwaawo kw'amasannyalaze, n'ebizibu by'okuddaabiriza. Beera muyambi era ow'amawulire.",
        sw: "Wewe ni mwakilishi wa huduma kwa wateja wa kampuni ya huduma za umma. Saidia wateja na malipo, miunganisho ya huduma, kukatika kwa huduma, na masuala ya matengenezo. Kuwa wa kusaidia na wa kutoa habari.",
      },
      ecommerce: {
        en: "You are a customer service representative for an e-commerce platform. Assist customers with orders, returns, payments, and product inquiries. Be friendly and solution-oriented.",
        lg: "Oli mukozi w'obuweereza bw'abakasitoma ku mukutu gw'okuguza ku yintaneeti. Yamba abakasitoma ku nsonga z'oda, okukomyawo, okusasula, n'ebibuuzo ku bintu. Beera mwagalwa era ow'okugonjoola ebizibu.",
        sw: "Wewe ni mwakilishi wa huduma kwa wateja wa jukwaa la biashara mtandaoni. Saidia wateja na maagizo, kurudi, malipo, na maswali ya bidhaa. Kuwa wa kirafiki na wa kutafuta suluhisho.",
      },
    }

    const systemPrompt =
      systemPrompts[businessType as keyof typeof systemPrompts]?.[
        language as keyof (typeof systemPrompts)[keyof typeof systemPrompts]
      ] || systemPrompts.telecom.en

    // Use Anthropic Claude for the response
    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      system: systemPrompt,
      prompt: message,
      maxTokens: 500,
    })

    // Simulate intent detection and other metadata
    const intents = ["billing_inquiry", "technical_support", "general_question", "complaint", "compliment"]
    const randomIntent = intents[Math.floor(Math.random() * intents.length)]

    // Check if escalation is needed (simple keyword detection)
    const escalationKeywords = ["manager", "supervisor", "complaint", "angry", "frustrated", "cancel", "refund"]
    const needsEscalation = escalationKeywords.some((keyword) => message.toLowerCase().includes(keyword))

    const responseData = {
      response: text,
      intent: randomIntent,
      language: language,
      provider: "anthropic",
      escalated: needsEscalation,
      knowledgeUsed: Math.random() > 0.5, // Random for demo
      sessionId,
    }

    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process chat message",
      },
      { status: 500 },
    )
  }
}
