import { streamText, generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

export async function POST(req: Request) {
  const { messages, businessType, language, useAdvancedNLP = true } = await req.json()

  // First, use a specialized AI to interpret and analyze the user's question
  const lastUserMessage = messages[messages.length - 1]?.content || ''
  
  let questionAnalysis = null
  if (useAdvancedNLP && lastUserMessage) {
    try {
      // Check if we have API keys available
      const hasGroqKey = process.env.GROQ_API_KEY
      const hasOpenAIKey = process.env.OPENAI_API_KEY
      
      if (hasGroqKey) {
        // Use Groq for fast question interpretation
        const { groq } = await import('@ai-sdk/groq')
        questionAnalysis = await generateObject({
          model: groq('llama-3.1-70b-versatile'),
          schema: z.object({
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
            contextNeeded: z.array(z.string()).describe('What context is needed to answer this question')
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
          - E-commerce: orders, delivery, payments, returns, tracking`
        })
      } else {
        // Fallback to basic analysis without external AI
        questionAnalysis = {
          object: generateBasicAnalysis(lastUserMessage, businessType)
        }
      }
    } catch (error) {
      console.error('Question analysis failed:', error)
      // Fallback to basic analysis
      questionAnalysis = {
        object: generateBasicAnalysis(lastUserMessage, businessType)
      }
    }
  }

  // Business-specific context enhanced with AI interpretation
  const businessContexts = {
    telecom: {
      systemPrompt: `You are an advanced AI customer support agent for a telecommunications company in Uganda. 
      You help customers with data bundles, network issues, billing, and mobile services.
      You can communicate in English, Luganda, and Swahili.
      
      ${questionAnalysis ? `
      QUESTION ANALYSIS:
      - Intent: ${questionAnalysis.object.intent} (${questionAnalysis.object.subIntent})
      - Sentiment: ${questionAnalysis.object.sentiment.polarity} (intensity: ${questionAnalysis.object.sentiment.intensity})
      - Urgency: ${questionAnalysis.object.urgency}
      - Question Type: ${questionAnalysis.object.questionType}
      - Entities Found: ${questionAnalysis.object.entities.map(e => `${e.type}: ${e.value}`).join(', ')}
      - Local Terms: ${questionAnalysis.object.language.localTerms.join(', ')}
      - Business Area: ${questionAnalysis.object.businessContext.category} - ${questionAnalysis.object.businessContext.specificArea}
      - Context Needed: ${questionAnalysis.object.contextNeeded.join(', ')}
      
      Based on this analysis, provide a highly targeted and contextual response.
      ` : ''}
      
      Local terms to understand:
      - "sente" means money
      - "simu" means phone  
      - "bundles" refers to data packages
      - "airtime" means phone credit
      - "network" can be "netiweki" in Luganda
      
      Common issues: data bundle purchase, network connectivity, billing inquiries, roaming charges, SIM card issues.
      
      Always be helpful, patient, and culturally sensitive. Use the question analysis to provide the most relevant response.`,
      
      escalationTriggers: ['billing dispute', 'network outage', 'urgent', 'angry', 'frustrated', 'critical']
    },
    
    banking: {
      systemPrompt: `You are an advanced AI customer support agent for a bank in Uganda.
      You help customers with account inquiries, mobile money, loans, and banking services.
      You can communicate in English, Luganda, and Swahili.
      
      ${questionAnalysis ? `
      QUESTION ANALYSIS:
      - Intent: ${questionAnalysis.object.intent} (${questionAnalysis.object.subIntent})
      - Sentiment: ${questionAnalysis.object.sentiment.polarity} (intensity: ${questionAnalysis.object.sentiment.intensity})
      - Urgency: ${questionAnalysis.object.urgency}
      - Question Type: ${questionAnalysis.object.questionType}
      - Entities Found: ${questionAnalysis.object.entities.map(e => `${e.type}: ${e.value}`).join(', ')}
      - Local Terms: ${questionAnalysis.object.language.localTerms.join(', ')}
      - Business Area: ${questionAnalysis.object.businessContext.category} - ${questionAnalysis.object.businessContext.specificArea}
      - Context Needed: ${questionAnalysis.object.contextNeeded.join(', ')}
      
      Based on this analysis, provide a highly targeted and contextual response.
      ` : ''}
      
      Local terms to understand:
      - "sente" means money
      - "akawuka" means small money
      - "mobile money" refers to mobile banking
      - "akaunt" means account
      - "loan" can be "looni" in local pronunciation
      
      Common issues: account balance, mobile money transfers, loan applications, card issues, ATM problems.
      
      Always prioritize security and verify customer identity for sensitive requests. Use the analysis to understand the customer's true needs.`,
      
      escalationTriggers: ['fraud', 'security', 'unauthorized', 'loan application', 'dispute', 'critical']
    },
    
    utilities: {
      systemPrompt: `You are an advanced AI customer support agent for utility services (water and electricity) in Uganda.
      You help customers with outages, billing, meter readings, and service connections.
      You can communicate in English and Luganda.
      
      ${questionAnalysis ? `
      QUESTION ANALYSIS:
      - Intent: ${questionAnalysis.object.intent} (${questionAnalysis.object.subIntent})
      - Sentiment: ${questionAnalysis.object.sentiment.polarity} (intensity: ${questionAnalysis.object.sentiment.intensity})
      - Urgency: ${questionAnalysis.object.urgency}
      - Question Type: ${questionAnalysis.object.questionType}
      - Entities Found: ${questionAnalysis.object.entities.map(e => `${e.type}: ${e.value}`).join(', ')}
      - Local Terms: ${questionAnalysis.object.language.localTerms.join(', ')}
      - Business Area: ${questionAnalysis.object.businessContext.category} - ${questionAnalysis.object.businessContext.specificArea}
      - Context Needed: ${questionAnalysis.object.contextNeeded.join(', ')}
      
      Based on this analysis, provide a highly targeted and contextual response.
      ` : ''}
      
      Local terms to understand:
      - "masanyu" means electricity
      - "amazzi" means water
      - "bili" means bill
      - "mita" means meter
      - "outage" can be explained as "no power/water"
      
      Common issues: power outages, water supply problems, billing disputes, meter readings, service connections.
      
      For emergency situations, prioritize quick resolution. Use the analysis to understand the severity and urgency.`,
      
      escalationTriggers: ['outage', 'emergency', 'no water', 'no power', 'urgent', 'critical']
    },
    
    ecommerce: {
      systemPrompt: `You are an advanced AI customer support agent for an e-commerce platform in Uganda.
      You help customers with orders, deliveries, payments, and returns.
      You can communicate in English, Luganda, and Swahili.
      
      ${questionAnalysis ? `
      QUESTION ANALYSIS:
      - Intent: ${questionAnalysis.object.intent} (${questionAnalysis.object.subIntent})
      - Sentiment: ${questionAnalysis.object.sentiment.polarity} (intensity: ${questionAnalysis.object.sentiment.intensity})
      - Urgency: ${questionAnalysis.object.urgency}
      - Question Type: ${questionAnalysis.object.questionType}
      - Entities Found: ${questionAnalysis.object.entities.map(e => `${e.type}: ${e.value}`).join(', ')}
      - Local Terms: ${questionAnalysis.object.language.localTerms.join(', ')}
      - Business Area: ${questionAnalysis.object.businessContext.category} - ${questionAnalysis.object.businessContext.specificArea}
      - Context Needed: ${questionAnalysis.object.contextNeeded.join(', ')}
      
      Based on this analysis, provide a highly targeted and contextual response.
      ` : ''}
      
      Local terms to understand:
      - "boda" means motorcycle taxi (for deliveries)
      - "oda" means order
      - "okusasula" means payment
      - "delivery" can be explained as "bringing items"
      
      Common issues: order tracking, delivery status, payment problems, returns, account issues.
      
      Be helpful with order tracking and delivery updates. Use the analysis to understand what the customer really needs.`,
      
      escalationTriggers: ['refund', 'damaged product', 'delivery delay', 'payment failed', 'critical']
    }
  }

  const context = businessContexts[businessType as keyof typeof businessContexts] || businessContexts.telecom

  // Enhanced escalation logic using AI analysis
  const shouldEscalate = questionAnalysis ? 
    (questionAnalysis.object.urgency === 'critical' || 
     questionAnalysis.object.businessContext.requiresEscalation ||
     questionAnalysis.object.sentiment.polarity === 'negative' && questionAnalysis.object.sentiment.intensity > 0.7) :
    context.escalationTriggers.some(trigger => 
      lastUserMessage.toLowerCase().includes(trigger.toLowerCase())
    )

  if (shouldEscalate) {
    return Response.json({
      escalate: true,
      reason: questionAnalysis ? 
        `AI Analysis: ${questionAnalysis.object.urgency} urgency, ${questionAnalysis.object.questionType} type, requires escalation` :
        'Detected escalation trigger in user message',
      analysis: questionAnalysis?.object
    })
  }

  // Choose AI model based on availability and complexity
  let selectedModel = openai('gpt-4o-mini') // Default to mini version

  try {
    if (process.env.ANTHROPIC_API_KEY && (questionAnalysis?.object.questionType === 'complaint' || questionAnalysis?.object.sentiment.polarity === 'negative')) {
      // Use Claude for complaints and sensitive topics
      selectedModel = anthropic('claude-3-5-sonnet-20241022')
    } else if (process.env.OPENAI_API_KEY) {
      if (questionAnalysis && questionAnalysis.object.complexity === 'complex' || businessType === 'banking') {
        selectedModel = openai('gpt-4o') // Use GPT-4 for complex queries and banking
      } else {
        selectedModel = openai('gpt-4o-mini') // Use mini for simple queries
      }
    } else if (process.env.GROQ_API_KEY) {
      // Fallback to Groq if available
      const { groq } = await import('@ai-sdk/groq')
      selectedModel = groq('llama-3.1-70b-versatile')
    } else {
      // If no API keys, return a basic response
      return Response.json({
        content: generateBasicResponse(lastUserMessage, businessType, language),
        analysis: questionAnalysis?.object,
        fallback: true
      })
    }
  } catch (error) {
    console.error('Model selection error:', error)
    return Response.json({
      content: generateBasicResponse(lastUserMessage, businessType, language),
      analysis: questionAnalysis?.object,
      fallback: true
    })
  }

  try {
    const result = await streamText({
      model: selectedModel,
      system: context.systemPrompt + `\n\nCurrent language preference: ${language}. Respond in ${language === 'lg' ? 'Luganda' : language === 'sw' ? 'Swahili' : 'English'}.
      
      ${questionAnalysis ? `
      IMPORTANT: The user's question has been analyzed. Use this analysis to provide the most helpful and contextual response possible. Address their specific intent, acknowledge their sentiment if negative, and provide exactly what they're looking for based on the entities and context identified.
      ` : ''}`,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Streaming error:', error)
    return Response.json({
      content: generateBasicResponse(lastUserMessage, businessType, language),
      analysis: questionAnalysis?.object,
      fallback: true,
      error: 'AI service temporarily unavailable'
    })
  }
}

// Fallback function for basic analysis without external AI
function generateBasicAnalysis(message: string, businessType: string) {
  const lowerMessage = message.toLowerCase()
  
  // Basic keyword-based analysis
  const urgentKeywords = ['urgent', 'emergency', 'help', 'problem', 'issue', 'broken', 'not working']
  const negativeKeywords = ['angry', 'frustrated', 'disappointed', 'terrible', 'awful', 'hate']
  const positiveKeywords = ['thank', 'great', 'good', 'excellent', 'happy', 'satisfied']
  
  // Local terms detection
  const localTerms = []
  if (lowerMessage.includes('sente')) localTerms.push('sente')
  if (lowerMessage.includes('simu')) localTerms.push('simu')
  if (lowerMessage.includes('bundles')) localTerms.push('bundles')
  if (lowerMessage.includes('masanyu')) localTerms.push('masanyu')
  if (lowerMessage.includes('amazzi')) localTerms.push('amazzi')
  if (lowerMessage.includes('boda')) localTerms.push('boda')
  
  // Basic sentiment analysis
  let sentiment = 'neutral'
  let intensity = 0.5
  if (negativeKeywords.some(word => lowerMessage.includes(word))) {
    sentiment = 'negative'
    intensity = 0.8
  } else if (positiveKeywords.some(word => lowerMessage.includes(word))) {
    sentiment = 'positive'
    intensity = 0.7
  }
  
  // Basic urgency detection
  let urgency = 'medium'
  if (urgentKeywords.some(word => lowerMessage.includes(word))) {
    urgency = 'high'
  }
  
  // Basic intent detection based on business type
  let intent = 'general_inquiry'
  let category = 'general'
  
  if (businessType === 'telecom') {
    if (lowerMessage.includes('data') || lowerMessage.includes('bundle')) {
      intent = 'data_inquiry'
      category = 'data_services'
    } else if (lowerMessage.includes('network') || lowerMessage.includes('signal')) {
      intent = 'network_issue'
      category = 'network_services'
    } else if (lowerMessage.includes('bill') || lowerMessage.includes('payment')) {
      intent = 'billing_inquiry'
      category = 'billing'
    }
  }
  
  return {
    intent,
    subIntent: intent,
    entities: [],
    sentiment: {
      polarity: sentiment,
      intensity,
      emotions: sentiment === 'negative' ? ['frustrated'] : sentiment === 'positive' ? ['satisfied'] : ['neutral']
    },
    language: {
      detected: localTerms.length > 0 ? 'mixed' : 'en',
      confidence: 0.8,
      localTerms
    },
    urgency,
    businessContext: {
      category,
      specificArea: category,
      requiresEscalation: urgency === 'high' && sentiment === 'negative'
    },
    questionType: urgency === 'high' ? 'complaint' : 'inquiry',
    complexity: 'moderate',
    contextNeeded: ['business_knowledge', 'customer_history']
  }
}

// Fallback function for basic responses without external AI
function generateBasicResponse(message: string, businessType: string, language: string) {
  const lowerMessage = message.toLowerCase()
  
  // Basic response templates
  const responses = {
    telecom: {
      en: {
        data: "I can help you with data bundles. We have daily, weekly, and monthly options available. What type of bundle are you looking for?",
        network: "I understand you're having network issues. Let me help you troubleshoot this. Can you tell me your location?",
        billing: "I can assist with your billing inquiry. Please provide your account number so I can check your account details.",
        general: "Hello! I'm here to help with your telecommunications needs. How can I assist you today?"
      },
      lg: {
        data: "Nkuyinza okukuyamba ku data bundles. Tulina za daily, weekly ne monthly. Oyagala bundle ki?",
        network: "Ntegeeza nti olina obuzibu ku network. Ka nkuyambe. Wandiiko we oli?",
        billing: "Nkuyinza okukuyamba ku bill yo. Wandiiko account number yo ndabe.",
        general: "Nkulamuse! Ndi wano okukuyamba ku by'essimu. Nkuyambe ntya?"
      }
    },
    banking: {
      en: {
        account: "I can help you with your account inquiry. For security purposes, please provide your account number.",
        mobile_money: "I can assist with mobile money services. What specific transaction do you need help with?",
        general: "Hello! I'm here to help with your banking needs. How can I assist you today?"
      },
      lg: {
        account: "Nkuyinza okukuyamba ku account yo. Olw'obukuumi, wandiiko account number yo.",
        mobile_money: "Nkuyinza okukuyamba ku mobile money. Otya transaction ki gy'oyagala okuyamba?",
        general: "Nkulamuse! Ndi wano okukuyamba ku by'obanka. Nkuyambe ntya?"
      }
    }
  }
  
  // Determine response type
  let responseType = 'general'
  if (lowerMessage.includes('data') || lowerMessage.includes('bundle')) responseType = 'data'
  else if (lowerMessage.includes('network') || lowerMessage.includes('signal')) responseType = 'network'
  else if (lowerMessage.includes('bill') || lowerMessage.includes('payment')) responseType = 'billing'
  else if (lowerMessage.includes('account') || lowerMessage.includes('balance')) responseType = 'account'
  else if (lowerMessage.includes('mobile money')) responseType = 'mobile_money'
  
  const businessResponses = responses[businessType as keyof typeof responses] || responses.telecom
  const langResponses = businessResponses[language as keyof typeof businessResponses] || businessResponses.en
  
  return langResponses[responseType as keyof typeof langResponses] || langResponses.general
}
