import { streamText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"
import { z } from "zod"

export async function POST(req: Request) {
  const { messages, businessType, language, useAdvancedNLP = true } = await req.json()

  // First, use a specialized AI to interpret and analyze the user's question
  const lastUserMessage = messages[messages.length - 1]?.content || ""

  let questionAnalysis = null
  if (useAdvancedNLP && lastUserMessage) {
    try {
      // Check if we have API keys available (prioritize free/cheaper options)
      const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "AIzaSyD_kvtPIA2IiE2ncKiJP3FtHCyXWXEV27s"
      const hasGroqKey = process.env.GROQ_API_KEY
      const hasOpenAIKey = process.env.OPENAI_API_KEY
      const hasAnthropicKey = process.env.ANTHROPIC_API_KEY

      if (geminiApiKey) {
        // Try multiple Gemini models for analysis
        const analysisModels = ["gemini-1.5-flash", "gemini-1.5-pro"]

        for (const modelName of analysisModels) {
          try {
            questionAnalysis = await generateObject({
              model: google(modelName, {
                apiKey: geminiApiKey,
              }),
              schema: z.object({
                intent: z.string().describe("Primary intent of the question"),
                subIntent: z.string().describe("Specific sub-category of the intent"),
                entities: z
                  .array(
                    z.object({
                      type: z.string(),
                      value: z.string(),
                      confidence: z.number(),
                    }),
                  )
                  .describe("Named entities found in the question"),
                sentiment: z.object({
                  polarity: z.enum(["positive", "negative", "neutral"]),
                  intensity: z.number().min(0).max(1),
                  emotions: z.array(z.string()),
                }),
                language: z.object({
                  detected: z.string(),
                  confidence: z.number(),
                  localTerms: z.array(z.string()),
                }),
                urgency: z.enum(["low", "medium", "high", "critical"]),
                businessContext: z.object({
                  category: z.string(),
                  specificArea: z.string(),
                  requiresEscalation: z.boolean(),
                }),
                questionType: z.enum(["inquiry", "complaint", "request", "compliment", "emergency"]),
                complexity: z.enum(["simple", "moderate", "complex"]),
                contextNeeded: z.array(z.string()).describe("What context is needed to answer this question"),
              }),
              prompt: `Analyze this customer service question in detail for a ${businessType} business in Uganda.
              
              Question: "${lastUserMessage}"
              
              Consider:
              1. What is the customer really asking for?
              2. What emotions or sentiment are expressed?
              3. What business context is needed?
              4. Are there any local language terms (Luganda: sente=money, simu=phone, bundles=data; Swahili terms)?
              5. How urgent is this request?
              6. What type of response would be most helpful?
              
              For business context, consider these areas:
              - Telecom: data bundles, network, billing, roaming, SIM cards, airtime
              - Banking: accounts, mobile money, loans, cards, security, transfers
              - Utilities: power, water, billing, outages, connections, meter readings
              - E-commerce: orders, delivery, payments, returns, tracking, products`,
            })
            break // Success, exit loop
          } catch (error) {
            console.error(`Analysis model ${modelName} failed:`, error)
            continue // Try next model
          }
        }
      } else if (hasGroqKey) {
        // Use Groq for fast question interpretation
        const { groq } = await import("@ai-sdk/groq")
        questionAnalysis = await generateObject({
          model: groq("llama-3.1-70b-versatile"),
          schema: z.object({
            intent: z.string().describe("Primary intent of the question"),
            subIntent: z.string().describe("Specific sub-category of the intent"),
            entities: z
              .array(
                z.object({
                  type: z.string(),
                  value: z.string(),
                  confidence: z.number(),
                }),
              )
              .describe("Named entities found in the question"),
            sentiment: z.object({
              polarity: z.enum(["positive", "negative", "neutral"]),
              intensity: z.number().min(0).max(1),
              emotions: z.array(z.string()),
            }),
            language: z.object({
              detected: z.string(),
              confidence: z.number(),
              localTerms: z.array(z.string()),
            }),
            urgency: z.enum(["low", "medium", "high", "critical"]),
            businessContext: z.object({
              category: z.string(),
              specificArea: z.string(),
              requiresEscalation: z.boolean(),
            }),
            questionType: z.enum(["inquiry", "complaint", "request", "compliment", "emergency"]),
            complexity: z.enum(["simple", "moderate", "complex"]),
            contextNeeded: z.array(z.string()).describe("What context is needed to answer this question"),
          }),
          prompt: `Analyze this customer service question in detail. The business type is ${businessType}.
          
          Question: "${lastUserMessage}"
          
          Consider:
          1. What is the customer really asking for?
          2. What emotions or sentiment are expressed?
          3. What business context is needed?
          4. Are there any local language terms?
          5. How urgent is this request?
          6. What type of response would be most helpful?
          
          For business context, consider these areas:
          - Telecom: data bundles, network, billing, roaming, SIM cards
          - Banking: accounts, mobile money, loans, cards, security
          - Utilities: power, water, billing, outages, connections
          - E-commerce: orders, delivery, payments, returns, tracking`,
        })
      }

      // If no analysis was successful, use fallback
      if (!questionAnalysis) {
        questionAnalysis = {
          object: generateBasicAnalysis(lastUserMessage, businessType),
        }
      }
    } catch (error) {
      console.error("Question analysis failed:", error)
      // Fallback to basic analysis
      questionAnalysis = {
        object: generateBasicAnalysis(lastUserMessage, businessType),
      }
    }
  }

  // Business-specific context enhanced with AI interpretation
  const businessContexts = {
    telecom: {
      systemPrompt: `You are an advanced AI customer support agent for a telecommunications company in Uganda. 
      You help customers with data bundles, network issues, billing, and mobile services.
      You can communicate in English, Luganda, and Swahili.
      
      ${
        questionAnalysis
          ? `
      QUESTION ANALYSIS:
      - Intent: ${questionAnalysis.object.intent} (${questionAnalysis.object.subIntent})
      - Sentiment: ${questionAnalysis.object.sentiment.polarity} (intensity: ${questionAnalysis.object.sentiment.intensity})
      - Urgency: ${questionAnalysis.object.urgency}
      - Question Type: ${questionAnalysis.object.questionType}
      - Entities Found: ${questionAnalysis.object.entities.map((e) => `${e.type}: ${e.value}`).join(", ")}
      - Local Terms: ${questionAnalysis.object.language.localTerms.join(", ")}
      - Business Area: ${questionAnalysis.object.businessContext.category} - ${questionAnalysis.object.businessContext.specificArea}
      - Context Needed: ${questionAnalysis.object.contextNeeded.join(", ")}
      
      Based on this analysis, provide a highly targeted and contextual response.
      `
          : ""
      }
      
      Local terms to understand:
      - "sente" means money
      - "simu" means phone  
      - "bundles" refers to data packages
      - "airtime" means phone credit
      - "network" can be "netiweki" in Luganda
      
      Common issues: data bundle purchase, network connectivity, billing inquiries, roaming charges, SIM card issues.
      
      Always be helpful, patient, and culturally sensitive. Use the question analysis to provide the most relevant response.`,

      escalationTriggers: ["billing dispute", "network outage", "urgent", "angry", "frustrated", "critical"],
    },

    banking: {
      systemPrompt: `You are an advanced AI customer support agent for a bank in Uganda.
      You help customers with account inquiries, mobile money, loans, and banking services.
      You can communicate in English, Luganda, and Swahili.
      
      ${
        questionAnalysis
          ? `
      QUESTION ANALYSIS:
      - Intent: ${questionAnalysis.object.intent} (${questionAnalysis.object.subIntent})
      - Sentiment: ${questionAnalysis.object.sentiment.polarity} (intensity: ${questionAnalysis.object.sentiment.intensity})
      - Urgency: ${questionAnalysis.object.urgency}
      - Question Type: ${questionAnalysis.object.questionType}
      - Entities Found: ${questionAnalysis.object.entities.map((e) => `${e.type}: ${e.value}`).join(", ")}
      - Local Terms: ${questionAnalysis.object.language.localTerms.join(", ")}
      - Business Area: ${questionAnalysis.object.businessContext.category} - ${questionAnalysis.object.businessContext.specificArea}
      - Context Needed: ${questionAnalysis.object.contextNeeded.join(", ")}
      
      Based on this analysis, provide a highly targeted and contextual response.
      `
          : ""
      }
      
      Local terms to understand:
      - "sente" means money
      - "akawuka" means small money
      - "mobile money" refers to mobile banking
      - "akaunt" means account
      - "loan" can be "looni" in local pronunciation
      
      Common issues: account balance, mobile money transfers, loan applications, card issues, ATM problems.
      
      Always prioritize security and verify customer identity for sensitive requests. Use the analysis to understand the customer's true needs.`,

      escalationTriggers: ["fraud", "security", "unauthorized", "loan application", "dispute", "critical"],
    },

    utilities: {
      systemPrompt: `You are an advanced AI customer support agent for utility services (water and electricity) in Uganda.
      You help customers with outages, billing, meter readings, and service connections.
      You can communicate in English and Luganda.
      
      ${
        questionAnalysis
          ? `
      QUESTION ANALYSIS:
      - Intent: ${questionAnalysis.object.intent} (${questionAnalysis.object.subIntent})
      - Sentiment: ${questionAnalysis.object.sentiment.polarity} (intensity: ${questionAnalysis.object.sentiment.intensity})
      - Urgency: ${questionAnalysis.object.urgency}
      - Question Type: ${questionAnalysis.object.questionType}
      - Entities Found: ${questionAnalysis.object.entities.map((e) => `${e.type}: ${e.value}`).join(", ")}
      - Local Terms: ${questionAnalysis.object.language.localTerms.join(", ")}
      - Business Area: ${questionAnalysis.object.businessContext.category} - ${questionAnalysis.object.businessContext.specificArea}
      - Context Needed: ${questionAnalysis.object.contextNeeded.join(", ")}
      
      Based on this analysis, provide a highly targeted and contextual response.
      `
          : ""
      }
      
      Local terms to understand:
      - "masanyu" means electricity
      - "amazzi" means water
      - "bili" means bill
      - "mita" means meter
      - "outage" can be explained as "no power/water"
      
      Common issues: power outages, water supply problems, billing disputes, meter readings, service connections.
      
      For emergency situations, prioritize quick resolution. Use the analysis to understand the severity and urgency.`,

      escalationTriggers: ["outage", "emergency", "no water", "no power", "urgent", "critical"],
    },

    ecommerce: {
      systemPrompt: `You are an advanced AI customer support agent for an e-commerce platform in Uganda.
      You help customers with orders, deliveries, payments, and returns.
      You can communicate in English, Luganda, and Swahili.
      
      ${
        questionAnalysis
          ? `
      QUESTION ANALYSIS:
      - Intent: ${questionAnalysis.object.intent} (${questionAnalysis.object.subIntent})
      - Sentiment: ${questionAnalysis.object.sentiment.polarity} (intensity: ${questionAnalysis.object.sentiment.intensity})
      - Urgency: ${questionAnalysis.object.urgency}
      - Question Type: ${questionAnalysis.object.questionType}
      - Entities Found: ${questionAnalysis.object.entities.map((e) => `${e.type}: ${e.value}`).join(", ")}
      - Local Terms: ${questionAnalysis.object.language.localTerms.join(", ")}
      - Business Area: ${questionAnalysis.object.businessContext.category} - ${questionAnalysis.object.businessContext.specificArea}
      - Context Needed: ${questionAnalysis.object.contextNeeded.join(", ")}
      
      Based on this analysis, provide a highly targeted and contextual response.
      `
          : ""
      }
      
      Local terms to understand:
      - "boda" means motorcycle taxi (for deliveries)
      - "oda" means order
      - "okusasula" means payment
      - "delivery" can be explained as "bringing items"
      
      Common issues: order tracking, delivery status, payment problems, returns, account issues.
      
      Be helpful with order tracking and delivery updates. Use the analysis to understand what the customer really needs.`,

      escalationTriggers: ["refund", "damaged product", "delivery delay", "payment failed", "critical"],
    },
  }

  const context = businessContexts[businessType as keyof typeof businessContexts] || businessContexts.telecom

  // Enhanced escalation logic using AI analysis
  const shouldEscalate = questionAnalysis
    ? questionAnalysis.object.urgency === "critical" ||
      questionAnalysis.object.businessContext.requiresEscalation ||
      (questionAnalysis.object.sentiment.polarity === "negative" && questionAnalysis.object.sentiment.intensity > 0.7)
    : context.escalationTriggers.some((trigger) => lastUserMessage.toLowerCase().includes(trigger.toLowerCase()))

  if (shouldEscalate) {
    return Response.json({
      escalate: true,
      reason: questionAnalysis
        ? `AI Analysis: ${questionAnalysis.object.urgency} urgency, ${questionAnalysis.object.questionType} type, requires escalation`
        : "Detected escalation trigger in user message",
      analysis: questionAnalysis?.object,
    })
  }

  // Check available API keys and choose model accordingly (prioritize free/cheaper options)
  const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "AIzaSyD_kvtPIA2IiE2ncKiJP3FtHCyXWXEV27s"
  const hasGroqKey = process.env.GROQ_API_KEY
  const hasOpenAIKey = process.env.OPENAI_API_KEY
  const hasAnthropicKey = process.env.ANTHROPIC_API_KEY

  // If no API keys are available, return a helpful error message
  if (!geminiApiKey && !hasGroqKey && !hasOpenAIKey && !hasAnthropicKey) {
    return Response.json({
      error: "No AI API keys configured",
      message: "Please configure at least one AI provider API key to enable AI responses.",
      setup: {
        gemini: "Get free API key from https://makersuite.google.com/app/apikey",
        groq: "Get free API key from https://console.groq.com/keys",
        openai: "Get API key from https://platform.openai.com/api-keys",
        anthropic: "Get API key from https://console.anthropic.com/",
      },
      fallback: true,
      content: generateBasicResponse(lastUserMessage, businessType, language),
      analysis: questionAnalysis?.object,
    })
  }

  // Choose AI model based on availability and complexity (prioritize cost-effective options)
  let selectedModel
  let modelProvider = "fallback"

  try {
    if (geminiApiKey) {
      // Try multiple Gemini models in order of preference
      const modelsToTry = [
        { name: "gemini-2.0-flash-exp", provider: "gemini-2.0-flash" },
        { name: "gemini-1.5-flash", provider: "gemini-flash" },
        { name: "gemini-1.5-pro", provider: "gemini-pro" },
      ]

      let modelSelected = false
      for (const modelInfo of modelsToTry) {
        try {
          if (questionAnalysis && questionAnalysis.object.complexity === "complex" && modelInfo.name.includes("pro")) {
            selectedModel = google(modelInfo.name, { apiKey: geminiApiKey })
            modelProvider = modelInfo.provider
            modelSelected = true
            break
          } else if (!modelInfo.name.includes("pro")) {
            selectedModel = google(modelInfo.name, { apiKey: geminiApiKey })
            modelProvider = modelInfo.provider
            modelSelected = true
            break
          }
        } catch (error) {
          console.error(`Model ${modelInfo.name} not available:`, error)
          continue
        }
      }

      if (!modelSelected) {
        // Fallback to basic flash model
        selectedModel = google("gemini-1.5-flash", { apiKey: geminiApiKey })
        modelProvider = "gemini-flash"
      }
    } else if (hasGroqKey) {
      // Groq is very fast and cost-effective
      const { groq } = await import("@ai-sdk/groq")
      selectedModel = groq("llama-3.1-70b-versatile")
      modelProvider = "groq"
    } else if (
      hasAnthropicKey &&
      (questionAnalysis?.object.questionType === "complaint" ||
        questionAnalysis?.object.sentiment.polarity === "negative")
    ) {
      // Use Claude for complaints and sensitive topics
      selectedModel = anthropic("claude-3-5-sonnet-20241022")
      modelProvider = "anthropic"
    } else if (hasOpenAIKey) {
      if (questionAnalysis && (questionAnalysis.object.complexity === "complex" || businessType === "banking")) {
        selectedModel = openai("gpt-4o") // Use GPT-4 for complex queries and banking
        modelProvider = "openai-gpt4"
      } else {
        selectedModel = openai("gpt-4o-mini") // Use mini for simple queries
        modelProvider = "openai-mini"
      }
    } else {
      // This shouldn't happen due to the check above, but just in case
      return Response.json({
        error: "No suitable AI model available",
        content: generateBasicResponse(lastUserMessage, businessType, language),
        analysis: questionAnalysis?.object,
        fallback: true,
      })
    }
  } catch (error) {
    console.error("Model selection error:", error)
    return Response.json({
      error: "Model selection failed",
      content: generateBasicResponse(lastUserMessage, businessType, language),
      analysis: questionAnalysis?.object,
      fallback: true,
    })
  }

  try {
    const result = await streamText({
      model: selectedModel,
      system:
        context.systemPrompt +
        `\n\nCurrent language preference: ${language}. Respond in ${language === "lg" ? "Luganda" : language === "sw" ? "Swahili" : "English"}.
      
      ${
        questionAnalysis
          ? `
      IMPORTANT: The user's question has been analyzed by AI. Use this analysis to provide the most helpful and contextual response possible. Address their specific intent, acknowledge their sentiment if negative, and provide exactly what they're looking for based on the entities and context identified.
      `
          : ""
      }`,
      messages,
    })

    // Add metadata to the response
    const response = result.toDataStreamResponse()
    response.headers.set("X-Model-Provider", modelProvider)
    response.headers.set("X-Analysis-Available", questionAnalysis ? "true" : "false")
    response.headers.set("X-API-Key-Status", "configured")

    return response
  } catch (error) {
    console.error("Streaming error:", error)

    // Provide detailed error information
    let errorMessage = "AI service temporarily unavailable"
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorMessage = "Invalid or missing API key for the selected AI provider"
      } else if (error.message.includes("quota")) {
        errorMessage = "API quota exceeded for the selected AI provider"
      } else if (error.message.includes("rate limit")) {
        errorMessage = "Rate limit exceeded, please try again in a moment"
      } else if (error.message.includes("404")) {
        errorMessage = "Model not found - trying fallback model"
      }
    }

    return Response.json({
      error: errorMessage,
      content: generateBasicResponse(lastUserMessage, businessType, language),
      analysis: questionAnalysis?.object,
      fallback: true,
      modelProvider: modelProvider,
    })
  }
}

// Fallback function for basic analysis without external AI
function generateBasicAnalysis(message: string, businessType: string) {
  const lowerMessage = message.toLowerCase()

  // Basic keyword-based analysis
  const urgentKeywords = ["urgent", "emergency", "help", "problem", "issue", "broken", "not working"]
  const negativeKeywords = ["angry", "frustrated", "disappointed", "terrible", "awful", "hate"]
  const positiveKeywords = ["thank", "great", "good", "excellent", "happy", "satisfied"]

  // Local terms detection
  const localTerms = []
  if (lowerMessage.includes("sente")) localTerms.push("sente")
  if (lowerMessage.includes("simu")) localTerms.push("simu")
  if (lowerMessage.includes("bundles")) localTerms.push("bundles")
  if (lowerMessage.includes("masanyu")) localTerms.push("masanyu")
  if (lowerMessage.includes("amazzi")) localTerms.push("amazzi")
  if (lowerMessage.includes("boda")) localTerms.push("boda")

  // Basic sentiment analysis
  let sentiment = "neutral"
  let intensity = 0.5
  if (negativeKeywords.some((word) => lowerMessage.includes(word))) {
    sentiment = "negative"
    intensity = 0.8
  } else if (positiveKeywords.some((word) => lowerMessage.includes(word))) {
    sentiment = "positive"
    intensity = 0.7
  }

  // Basic urgency detection
  let urgency = "medium"
  if (urgentKeywords.some((word) => lowerMessage.includes(word))) {
    urgency = "high"
  }

  // Basic intent detection based on business type
  let intent = "general_inquiry"
  let category = "general"

  if (businessType === "telecom") {
    if (lowerMessage.includes("data") || lowerMessage.includes("bundle") || lowerMessage.includes("internet")) {
      intent = "data_inquiry"
      category = "data_services"
    } else if (
      lowerMessage.includes("network") ||
      lowerMessage.includes("signal") ||
      lowerMessage.includes("connection")
    ) {
      intent = "network_issue"
      category = "network_services"
    } else if (lowerMessage.includes("bill") || lowerMessage.includes("payment") || lowerMessage.includes("sente")) {
      intent = "billing_inquiry"
      category = "billing"
    } else if (lowerMessage.includes("airtime") || lowerMessage.includes("credit") || lowerMessage.includes("top up")) {
      intent = "airtime"
      category = "airtime_services"
    } else if (
      lowerMessage.includes("roaming") ||
      lowerMessage.includes("travel") ||
      lowerMessage.includes("international")
    ) {
      intent = "roaming"
      category = "roaming_services"
    }
  }

  return {
    intent,
    subIntent: intent,
    entities: [],
    sentiment: {
      polarity: sentiment,
      intensity,
      emotions: sentiment === "negative" ? ["frustrated"] : sentiment === "positive" ? ["satisfied"] : ["neutral"],
    },
    language: {
      detected: localTerms.length > 0 ? "mixed" : "en",
      confidence: 0.8,
      localTerms,
    },
    urgency,
    businessContext: {
      category,
      specificArea: category,
      requiresEscalation: urgency === "high" && sentiment === "negative",
    },
    questionType: urgency === "high" ? "complaint" : "inquiry",
    complexity: "moderate",
    contextNeeded: ["business_knowledge", "customer_history"],
  }
}

// Enhanced fallback function for basic responses without external AI
function generateBasicResponse(message: string, businessType: string, language: string) {
  const lowerMessage = message.toLowerCase()

  // Basic response templates with more comprehensive coverage
  const responses = {
    telecom: {
      en: {
        data: "I can help you with data bundles. We have daily, weekly, and monthly options available. What type of bundle are you looking for?",
        network:
          "I understand you're having network issues. Let me help you troubleshoot this. Can you tell me your location and the specific problem you're experiencing?",
        billing:
          "I can assist with your billing inquiry. Please provide your account number so I can check your account details.",
        airtime:
          "I can help you with airtime purchases and balance inquiries. What specific airtime service do you need?",
        roaming:
          "For roaming services, I can provide information about international rates and activation. Which country are you traveling to?",
        general: "Hello! I'm here to help with your telecommunications needs. How can I assist you today?",
      },
      lg: {
        data: "Nkuyinza okukuyamba ku data bundles. Tulina za daily, weekly ne monthly. Oyagala bundle ki?",
        network:
          "Ntegeeza nti olina obuzibu ku network. Ka nkuyambe. Wandiiko we oli n'obuzibu ki obw'enjawulo bw'olina?",
        billing: "Nkuyinza okukuyamba ku bill yo. Wandiiko account number yo ndabe ebikukwatako.",
        airtime: "Nkuyinza okukuyamba ku kugula airtime n'okumanya balance yo. Oyagala airtime service ki?",
        roaming:
          "Ku roaming services, nkuyinza okukuwa obubaka ku international rates n'activation. Ogenda mu ggwanga ki?",
        general: "Nkulamuse! Ndi wano okukuyamba ku by'essimu. Nkuyambe ntya?",
      },
      sw: {
        data: "Naweza kukusaidia na data bundles. Tuna za kila siku, wiki na mwezi. Unataka bundle gani?",
        network: "Naelewa una matatizo ya mtandao. Hebu nikusaidie. Uko wapi na ni tatizo gani hasa unalo?",
        billing:
          "Naweza kukusaidia na swali lako la bili. Tafadhali toa nambari ya akaunti yako ili niweze kuangalia maelezo yako.",
        airtime: "Naweza kukusaidia na ununuzi wa airtime na kuangalia salio lako. Unahitaji huduma gani ya airtime?",
        roaming: "Kwa huduma za roaming, naweza kutoa habari kuhusu bei za kimataifa na uwezesha. Unasafiri nchi gani?",
        general: "Hujambo! Nipo hapa kukusaidia na mahitaji yako ya mawasiliano. Naweza kukusaidia vipi?",
      },
    },
    banking: {
      en: {
        account:
          "I can help you with your account inquiry. For security purposes, please provide your account number or customer ID.",
        mobile_money:
          "I can assist with mobile money services including transfers, payments, and balance inquiries. What specific transaction do you need help with?",
        loan: "For loan inquiries, I can provide information about our loan products, application process, and requirements. What type of loan are you interested in?",
        card: "I can help with card-related issues including activation, blocking, PIN reset, and transaction disputes. What card issue are you experiencing?",
        security:
          "For security concerns, I take this very seriously. Please describe the issue and I'll escalate it to our security team immediately.",
        general: "Hello! I'm here to help with your banking needs. How can I assist you today?",
      },
      lg: {
        account: "Nkuyinza okukuyamba ku account yo. Olw'obukuumi, wandiiko account number yo oba customer ID.",
        mobile_money:
          "Nkuyinza okukuyamba ku mobile money nga transfers, payments ne balance inquiries. Transaction ki gy'oyagala okuyamba?",
        loan: "Ku loan inquiries, nkuyinza okukuwa obubaka ku loan products zaffe, application process ne requirements. Loan ya kika ki gy'oyagala?",
        card: "Nkuyinza okukuyamba ku card issues nga activation, blocking, PIN reset ne transaction disputes. Card problem ki gy'olina?",
        security:
          "Ku security concerns, nkikwata nnyo ku mutima. Nnyonnyola obuzibu bwo nzija kukitwala ku security team amangu ddala.",
        general: "Nkulamuse! Ndi wano okukuyamba ku by'obanka. Nkuyambe ntya?",
      },
    },
    utilities: {
      en: {
        power:
          "I can help with electricity-related issues including outages, billing, meter readings, and new connections. What power issue are you experiencing?",
        water:
          "For water services, I can assist with supply issues, billing inquiries, meter problems, and service applications. How can I help with your water service?",
        billing:
          "I can help you understand your utility bill, payment options, and resolve billing disputes. Which utility bill do you need help with?",
        outage:
          "I understand you're experiencing a service outage. Let me help you report this and get an estimated restoration time. Can you provide your location and meter number?",
        connection:
          "For new service connections, I can guide you through the application process and requirements. What type of connection do you need?",
        general:
          "Hello! I'm here to help with your utility services including electricity and water. How can I assist you today?",
      },
      lg: {
        power:
          "Nkuyinza okukuyamba ku by'amasanyu nga outages, billing, meter readings ne connections empya. Obuzibu ki obw'amasanyu bw'olina?",
        water:
          "Ku by'amazzi, nkuyinza okukuyamba ku supply issues, billing inquiries, meter problems ne service applications. Nkuyambe ntya ku by'amazzi?",
        billing:
          "Nkuyinza okukuyamba okutegeera bill yo, payment options n'okugonjoola billing disputes. Bill ya utility ki gy'oyagala okuyamba?",
        outage:
          "Ntegeeza nti tolina service. Ka nkuyambe okureporta kino n'okufuna estimated restoration time. Oyinza okuwa location yo ne meter number?",
        connection:
          "Ku connections empya, nkuyinza okukukulembera mu application process ne requirements. Connection ya kika ki gy'oyagala?",
        general: "Nkulamuse! Ndi wano okukuyamba ku utility services nga amasanyu n'amazzi. Nkuyambe ntya?",
      },
    },
    ecommerce: {
      en: {
        order:
          "I can help you track your order, modify details, or resolve order issues. Please provide your order number or email address.",
        delivery:
          "For delivery inquiries, I can provide tracking information, delivery schedules, and address changes. What's your tracking number?",
        payment:
          "I can assist with payment issues including failed transactions, refunds, and payment method updates. What payment issue are you experiencing?",
        return:
          "For returns and exchanges, I can guide you through our return policy and process. What item would you like to return?",
        product:
          "I can help you find products, check availability, compare options, and answer product questions. What are you looking for?",
        general: "Hello! I'm here to help with your online shopping experience. How can I assist you today?",
      },
      lg: {
        order:
          "Nkuyinza okukuyamba ku order yo, okukyusa ebintu, oba okugonjoola order problems. Wandiiko order number yo oba email address.",
        delivery:
          "Ku delivery inquiries, nkuyinza okuwa tracking information, delivery schedules ne address changes. Tracking number yo ye ki?",
        payment:
          "Nkuyinza okukuyamba ku payment issues nga failed transactions, refunds ne payment method updates. Payment problem ki gy'olina?",
        return:
          "Ku returns ne exchanges, nkuyinza okukukulembera mu return policy yaffe ne process. Kintu ki ky'oyagala okuddiza?",
        product:
          "Nkuyinza okukuyamba okunoonya products, okukebera availability, okugeraageranya options n'okuddamu product questions. Onoonya ki?",
        general: "Nkulamuse! Ndi wano okukuyamba ku online shopping experience yo. Nkuyambe ntya?",
      },
    },
  }

  // Determine response type with more comprehensive matching
  let responseType = "general"
  if (lowerMessage.includes("data") || lowerMessage.includes("bundle") || lowerMessage.includes("internet"))
    responseType = "data"
  else if (lowerMessage.includes("network") || lowerMessage.includes("signal") || lowerMessage.includes("connection"))
    responseType = "network"
  else if (lowerMessage.includes("bill") || lowerMessage.includes("payment") || lowerMessage.includes("sente"))
    responseType = "billing"
  else if (lowerMessage.includes("airtime") || lowerMessage.includes("credit") || lowerMessage.includes("top up"))
    responseType = "airtime"
  else if (
    lowerMessage.includes("roaming") ||
    lowerMessage.includes("travel") ||
    lowerMessage.includes("international")
  )
    responseType = "roaming"
  else if (lowerMessage.includes("account") || lowerMessage.includes("balance") || lowerMessage.includes("akaunt"))
    responseType = "account"
  else if (
    lowerMessage.includes("mobile money") ||
    lowerMessage.includes("transfer") ||
    lowerMessage.includes("send money")
  )
    responseType = "mobile_money"
  else if (lowerMessage.includes("loan") || lowerMessage.includes("credit") || lowerMessage.includes("borrow"))
    responseType = "loan"
  else if (lowerMessage.includes("card") || lowerMessage.includes("atm") || lowerMessage.includes("visa"))
    responseType = "card"
  else if (lowerMessage.includes("security") || lowerMessage.includes("fraud") || lowerMessage.includes("hack"))
    responseType = "security"
  else if (lowerMessage.includes("power") || lowerMessage.includes("electricity") || lowerMessage.includes("masanyu"))
    responseType = "power"
  else if (lowerMessage.includes("water") || lowerMessage.includes("amazzi") || lowerMessage.includes("supply"))
    responseType = "water"
  else if (lowerMessage.includes("outage") || lowerMessage.includes("no power") || lowerMessage.includes("no water"))
    responseType = "outage"
  else if (
    lowerMessage.includes("connection") ||
    lowerMessage.includes("install") ||
    lowerMessage.includes("new service")
  )
    responseType = "connection"
  else if (lowerMessage.includes("order") || lowerMessage.includes("purchase") || lowerMessage.includes("buy"))
    responseType = "order"
  else if (lowerMessage.includes("delivery") || lowerMessage.includes("shipping") || lowerMessage.includes("boda"))
    responseType = "delivery"
  else if (lowerMessage.includes("return") || lowerMessage.includes("exchange") || lowerMessage.includes("refund"))
    responseType = "return"
  else if (lowerMessage.includes("product") || lowerMessage.includes("item") || lowerMessage.includes("search"))
    responseType = "product"

  const businessResponses = responses[businessType as keyof typeof responses] || responses.telecom
  const langResponses = businessResponses[language as keyof typeof businessResponses] || businessResponses.en

  return langResponses[responseType as keyof typeof langResponses] || langResponses.general
}
