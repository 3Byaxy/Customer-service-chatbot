import { type NextRequest, NextResponse } from "next/server"
import { approvalSystem } from "@/environment/approval-system"
import { languageDetector } from "@/environment/language-detection"
import { realtimeManager } from "@/environment/realtime-apis"

export async function POST(req: NextRequest) {
  try {
    const { sessionId, userMessage, businessType, language, detectedLanguage } = await req.json()

    // Generate suggested response and action
    const suggestedResponse = await generateSuggestedResponse(userMessage, businessType, language, detectedLanguage)
    const suggestedAction = determineSuggestedAction(userMessage, businessType)

    // Check if approval is required
    const requiresApproval = shouldRequireApproval(userMessage, suggestedAction, businessType)

    if (requiresApproval) {
      // Create approval request
      const approvalRequest = approvalSystem.createApprovalRequest(
        sessionId,
        `user_${sessionId}`,
        userMessage,
        suggestedResponse,
        suggestedAction,
        businessType,
        language,
      )

      // Send real-time notification to admins
      realtimeManager.sendEscalationAlert(sessionId, "Approval required for user interaction", "medium")

      return NextResponse.json({
        requiresApproval: true,
        approvalRequest,
        message: "Request sent for approval",
      })
    } else {
      // Auto-approved response
      const suggestions = generateSuggestions(businessType, language)

      // Log the conversation
      approvalSystem.addToConversationLog(sessionId, `user_${sessionId}`, userMessage, "user", language)

      approvalSystem.addToConversationLog(sessionId, "bot", suggestedResponse, "bot", language, false, "approved")

      return NextResponse.json({
        requiresApproval: false,
        response: suggestedResponse,
        suggestions,
        autoApproved: true,
      })
    }
  } catch (error) {
    console.error("Chat approval error:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}

async function generateSuggestedResponse(
  userMessage: string,
  businessType: string,
  language: string,
  detectedLanguage: any,
): Promise<string> {
  const lowerMessage = userMessage.toLowerCase()

  // Get appropriate response phrases for the language
  const phrases = languageDetector.getResponsePhrases(language as "en" | "lg" | "sw")

  // Handle greetings
  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hujambo") ||
    lowerMessage.includes("nkulamuse")
  ) {
    return languageDetector.getGreeting(language as "en" | "lg" | "sw")
  }

  // Handle thanks
  if (lowerMessage.includes("thank") || lowerMessage.includes("webale") || lowerMessage.includes("asante")) {
    switch (language) {
      case "lg":
        return "Tewali kuwebaza! Nkuyinza okukuyamba ku kintu kirala?"
      case "sw":
        return "Karibu sana! Je, naweza kukusaidia na kitu kingine?"
      default:
        return "You're welcome! Is there anything else I can help you with?"
    }
  }

  // Business-specific responses
  const businessResponses = {
    telecom: {
      en: {
        data: "I can help you with data bundles. We have daily (500MB - 1000 UGX), weekly (2GB - 5000 UGX), and monthly (10GB - 15000 UGX) options. Which would you prefer?",
        network:
          "I understand you're having network issues. Let me help you troubleshoot. Can you tell me your location and when the issue started?",
        billing:
          "I can assist with your billing inquiry. Please provide your phone number so I can check your account balance and recent transactions.",
        general:
          "I'm here to help with your telecommunications needs. You can ask me about data bundles, network issues, billing, or airtime services.",
      },
      lg: {
        data: "Nkuyinza okukuyamba ku data bundles. Tulina za daily (500MB - 1000 UGX), weekly (2GB - 5000 UGX), ne monthly (10GB - 15000 UGX). Oyagala ki?",
        network: "Ntegeeza nti olina obuzibu ku network. Ka nkuyambe. Wandiiko we oli n'obuzibu bwatandise ddi?",
        billing: "Nkuyinza okukuyamba ku bill yo. Wandiiko namba ya simu yo ndabe balance yo n'ebyafuuse.",
        general:
          "Ndi wano okukuyamba ku by'essimu. Oyinza okubuuza ku data bundles, network problems, billing, oba airtime services.",
      },
      sw: {
        data: "Naweza kukusaidia na data bundles. Tuna za kila siku (500MB - 1000 UGX), wiki (2GB - 5000 UGX), na mwezi (10GB - 15000 UGX). Unataka ipi?",
        network:
          "Naelewa una matatizo ya mtandao. Hebu nikusaidie. Tafadhali niambie uko wapi na tatizo lilianza lini?",
        billing:
          "Naweza kukusaidia na swali la bili. Tafadhali toa nambari ya simu yako ili niangalie salio lako na miamala ya hivi karibuni.",
        general:
          "Nipo hapa kukusaidia na mahitaji ya mawasiliano. Unaweza kuniuliza kuhusu data bundles, matatizo ya mtandao, bili, au huduma za airtime.",
      },
    },
    banking: {
      en: {
        account:
          "I can help you with your account. For security, please provide your account number or customer ID, and I'll check your balance and recent transactions.",
        mobile_money:
          "I can assist with mobile money services. Are you looking to send money, receive money, pay bills, or check your mobile money balance?",
        loan: "For loan services, I can help you understand our loan products: Personal loans (up to 5M UGX), Business loans (up to 20M UGX), and Emergency loans (up to 500K UGX). Which interests you?",
        general:
          "I'm here to help with your banking needs. I can assist with accounts, mobile money, loans, cards, and general banking services.",
      },
      lg: {
        account:
          "Nkuyinza okukuyamba ku account yo. Olw'obukuumi, wandiiko account number yo oba customer ID, nzija kukebera balance yo n'ebyafuuse.",
        mobile_money:
          "Nkuyinza okukuyamba ku mobile money services. Oyagala okutuma sente, okufuna sente, okusasula bills, oba okumanya balance yo?",
        loan: "Ku loan services, nkuyinza okukukutegeeza ku loan products zaffe: Personal loans (okutuuka ku 5M UGX), Business loans (okutuuka ku 20M UGX), ne Emergency loans (okutuuka ku 500K UGX). Ki eky'okwagala?",
        general:
          "Ndi wano okukuyamba ku by'obanka. Nkuyinza okukuyamba ku accounts, mobile money, loans, cards, ne banking services endala.",
      },
    },
    utilities: {
      en: {
        power:
          "I can help with electricity services. Are you experiencing a power outage, need to check your bill, report a meter issue, or apply for a new connection?",
        water:
          "For water services, I can assist with supply issues, billing inquiries, meter readings, or new connection applications. What do you need help with?",
        billing:
          "I can help you understand your utility bill. Please provide your customer number so I can check your account and explain any charges.",
        general: "I'm here to help with utility services including electricity and water. How can I assist you today?",
      },
      lg: {
        power:
          "Nkuyinza okukuyamba ku by'amasanyu. Olina power outage, oyagala okukebera bill yo, okureporta meter problem, oba okusaba connection empya?",
        water:
          "Ku by'amazzi, nkuyinza okukuyamba ku supply issues, billing inquiries, meter readings, oba new connection applications. Nkuyambe ku ki?",
        billing:
          "Nkuyinza okukukutegeeza ku utility bill yo. Wandiiko customer number yo ndabe account yo n'nkutegeeze ku charges.",
        general: "Ndi wano okukuyamba ku utility services nga amasanyu n'amazzi. Nkuyambe ntya leero?",
      },
    },
    ecommerce: {
      en: {
        order:
          "I can help you with your order. Please provide your order number so I can check the status, tracking information, or help with any issues.",
        delivery:
          "For delivery inquiries, I can provide tracking updates, estimated delivery times, and help with address changes. What's your tracking number?",
        payment:
          "I can assist with payment issues including failed transactions, refunds, and payment method updates. What payment issue are you experiencing?",
        general:
          "I'm here to help with your online shopping experience. I can assist with orders, deliveries, payments, returns, and product inquiries.",
      },
      lg: {
        order:
          "Nkuyinza okukuyamba ku order yo. Wandiiko order number yo ndabe status, tracking information, oba nkuyambe ku problems.",
        delivery:
          "Ku delivery inquiries, nkuyinza okuwa tracking updates, estimated delivery times, n'okuyamba ku address changes. Tracking number yo ye ki?",
        payment:
          "Nkuyinza okukuyamba ku payment issues nga failed transactions, refunds, ne payment method updates. Payment problem ki gy'olina?",
        general:
          "Ndi wano okukuyamba ku online shopping experience yo. Nkuyinza okukuyamba ku orders, deliveries, payments, returns, ne product inquiries.",
      },
    },
  }

  // Determine response type
  let responseType = "general"
  if (lowerMessage.includes("data") || lowerMessage.includes("bundle") || lowerMessage.includes("internet")) {
    responseType = "data"
  } else if (lowerMessage.includes("network") || lowerMessage.includes("signal")) {
    responseType = "network"
  } else if (lowerMessage.includes("bill") || lowerMessage.includes("payment") || lowerMessage.includes("sente")) {
    responseType = "billing"
  } else if (lowerMessage.includes("account") || lowerMessage.includes("balance")) {
    responseType = "account"
  } else if (lowerMessage.includes("mobile money") || lowerMessage.includes("transfer")) {
    responseType = "mobile_money"
  } else if (lowerMessage.includes("loan") || lowerMessage.includes("borrow")) {
    responseType = "loan"
  } else if (
    lowerMessage.includes("power") ||
    lowerMessage.includes("electricity") ||
    lowerMessage.includes("masanyu")
  ) {
    responseType = "power"
  } else if (lowerMessage.includes("water") || lowerMessage.includes("amazzi")) {
    responseType = "water"
  } else if (lowerMessage.includes("order") || lowerMessage.includes("purchase")) {
    responseType = "order"
  } else if (lowerMessage.includes("delivery") || lowerMessage.includes("shipping")) {
    responseType = "delivery"
  } else if (lowerMessage.includes("payment") || lowerMessage.includes("pay")) {
    responseType = "payment"
  }

  const businessResponse = businessResponses[businessType as keyof typeof businessResponses]
  if (businessResponse) {
    const langResponse = businessResponse[language as keyof typeof businessResponse]
    if (langResponse) {
      return langResponse[responseType as keyof typeof langResponse] || langResponse.general
    }
  }

  // Fallback response
  return (
    phrases.helping +
    ". " +
    (language === "lg"
      ? "Nnyonnyola ekibuuzo kyo obulungi."
      : language === "sw"
        ? "Tafadhali eleza swali lako vizuri."
        : "Please explain your question in more detail.")
  )
}

function determineSuggestedAction(userMessage: string, businessType: string): string {
  const lowerMessage = userMessage.toLowerCase()

  // Determine action based on message content
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return "GREETING_RESPONSE"
  }

  if (lowerMessage.includes("thank")) {
    return "ACKNOWLEDGMENT"
  }

  if (lowerMessage.includes("data") || lowerMessage.includes("bundle")) {
    return "DATA_BUNDLE_INQUIRY"
  }

  if (lowerMessage.includes("network") || lowerMessage.includes("signal")) {
    return "NETWORK_TROUBLESHOOTING"
  }

  if (lowerMessage.includes("bill") || lowerMessage.includes("payment")) {
    return "BILLING_INQUIRY"
  }

  if (lowerMessage.includes("account") || lowerMessage.includes("balance")) {
    return "ACCOUNT_INQUIRY"
  }

  if (lowerMessage.includes("loan") || lowerMessage.includes("borrow")) {
    return "LOAN_APPLICATION_INFO"
  }

  if (lowerMessage.includes("problem") || lowerMessage.includes("issue") || lowerMessage.includes("not working")) {
    return "TECHNICAL_SUPPORT"
  }

  if (lowerMessage.includes("urgent") || lowerMessage.includes("emergency")) {
    return "URGENT_ESCALATION"
  }

  return "GENERAL_INQUIRY"
}

function shouldRequireApproval(userMessage: string, suggestedAction: string, businessType: string): boolean {
  const lowerMessage = userMessage.toLowerCase()

  // Always require approval for these cases
  const alwaysApprove = [
    "urgent",
    "emergency",
    "critical",
    "fraud",
    "security",
    "hack",
    "stolen",
    "complaint",
    "angry",
    "frustrated",
    "terrible",
    "awful",
    "hate",
    "refund",
    "dispute",
    "legal",
    "court",
    "lawyer",
  ]

  if (alwaysApprove.some((keyword) => lowerMessage.includes(keyword))) {
    return true
  }

  // Require approval for complex technical issues
  if (suggestedAction === "TECHNICAL_SUPPORT" && businessType === "banking") {
    return true
  }

  // Require approval for loan applications
  if (suggestedAction === "LOAN_APPLICATION_INFO" && lowerMessage.includes("apply")) {
    return true
  }

  // Auto-approve simple interactions
  const autoApprove = ["GREETING_RESPONSE", "ACKNOWLEDGMENT", "DATA_BUNDLE_INQUIRY", "GENERAL_INQUIRY"]

  if (autoApprove.includes(suggestedAction)) {
    return false
  }

  // Default to requiring approval for safety
  return true
}

function generateSuggestions(businessType: string, language: string): string[] {
  const suggestions = {
    telecom: {
      en: ["Check data balance", "Buy data bundle", "Network issues", "Bill inquiry", "Airtime services"],
      lg: ["Kebera data balance", "Gula data bundle", "Network problems", "Bill inquiry", "Airtime services"],
      sw: ["Angalia salio la data", "Nunua data bundle", "Matatizo ya mtandao", "Swali la bili", "Huduma za airtime"],
    },
    banking: {
      en: ["Check account balance", "Mobile money transfer", "Loan information", "Card services", "Bill payments"],
      lg: ["Kebera account balance", "Mobile money transfer", "Loan information", "Card services", "Bill payments"],
      sw: ["Angalia salio la akaunti", "Uhamisho wa pesa", "Habari za mkopo", "Huduma za kadi", "Malipo ya bili"],
    },
    utilities: {
      en: ["Report power outage", "Check water supply", "Bill inquiry", "Meter reading", "New connection"],
      lg: ["Reporta power outage", "Kebera water supply", "Bill inquiry", "Meter reading", "Connection empya"],
      sw: ["Ripoti ukosefu wa umeme", "Angalia usambazaji wa maji", "Swali la bili", "Kusoma mita", "Muunganisho mpya"],
    },
    ecommerce: {
      en: ["Track my order", "Delivery status", "Payment issues", "Return item", "Product inquiry"],
      lg: ["Track order yange", "Delivery status", "Payment issues", "Return item", "Product inquiry"],
      sw: ["Fuatilia oda yangu", "Hali ya utoaji", "Matatizo ya malipo", "Rudisha bidhaa", "Swali la bidhaa"],
    },
  }

  const businessSuggestions = suggestions[businessType as keyof typeof suggestions]
  if (businessSuggestions) {
    return businessSuggestions[language as keyof typeof businessSuggestions] || businessSuggestions.en
  }

  return suggestions.telecom.en
}

// Get pending approvals
export async function GET(req: NextRequest) {
  try {
    const pendingApprovals = approvalSystem.getPendingApprovals()
    const stats = approvalSystem.getApprovalStats()

    return NextResponse.json({
      pendingApprovals,
      stats,
    })
  } catch (error) {
    console.error("Error fetching approvals:", error)
    return NextResponse.json({ error: "Failed to fetch approvals" }, { status: 500 })
  }
}
