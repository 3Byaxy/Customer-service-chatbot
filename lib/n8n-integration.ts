import { API_KEYS, isServiceAvailable } from "./api-keys"

export interface N8nWebhookPayload {
  agentId: string
  sessionId: string
  userId?: string
  email: string
  businessType: string
  language: string
  escalationType: "complaint" | "technical" | "billing" | "general"
  priority: "low" | "medium" | "high" | "critical"
  customerMessage: string
  aiResponse: string
  timestamp: string
  metadata?: any
}

export interface N8nResponse {
  success: boolean
  message: string
  ticketId?: string
  escalationId?: string
  details?: any
}

class N8nIntegration {
  private webhookUrl: string
  private agentId: string

  constructor() {
    this.webhookUrl = API_KEYS.N8N_WEBHOOK_URL
    this.agentId = API_KEYS.N8N_AGENT_ID
  }

  isConfigured(): boolean {
    return isServiceAvailable("N8N")
  }

  getWebhookUrl(): string {
    return this.webhookUrl
  }

  getAgentId(): string {
    return this.agentId
  }

  async sendEscalation(payload: N8nWebhookPayload): Promise<N8nResponse> {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: "N8n webhook not configured",
      }
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "AI-Customer-Support/1.0",
        },
        body: JSON.stringify({
          ...payload,
          agentId: this.agentId,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          message: "Escalation sent successfully",
          ticketId: data.ticketId,
          escalationId: data.escalationId,
          details: data,
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error("N8n webhook error:", error)
      return {
        success: false,
        message: "Failed to send escalation",
        details: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async testWebhook(): Promise<N8nResponse> {
    const testPayload: N8nWebhookPayload = {
      agentId: this.agentId,
      sessionId: "test_session_" + Date.now(),
      email: "test@example.com",
      businessType: "telecom",
      language: "en",
      escalationType: "complaint",
      priority: "medium",
      customerMessage: "This is a test escalation from the AI customer support system",
      aiResponse: "I understand your concern. Let me escalate this to our human support team.",
      timestamp: new Date().toISOString(),
      metadata: {
        testMode: true,
        source: "voice-test-panel",
      },
    }

    return await this.sendEscalation(testPayload)
  }

  async sendComplaint(
    sessionId: string,
    userId: string | undefined,
    email: string,
    businessType: string,
    language: string,
    customerMessage: string,
    aiResponse: string,
    priority: "low" | "medium" | "high" | "critical" = "medium",
  ): Promise<N8nResponse> {
    const payload: N8nWebhookPayload = {
      agentId: this.agentId,
      sessionId,
      userId,
      email,
      businessType,
      language,
      escalationType: "complaint",
      priority,
      customerMessage,
      aiResponse,
      timestamp: new Date().toISOString(),
      metadata: {
        source: "ai-chat-interface",
        escalationReason: "complaint_detected",
      },
    }

    return await this.sendEscalation(payload)
  }

  async sendTechnicalIssue(
    sessionId: string,
    userId: string | undefined,
    email: string,
    businessType: string,
    language: string,
    customerMessage: string,
    aiResponse: string,
    priority: "low" | "medium" | "high" | "critical" = "high",
  ): Promise<N8nResponse> {
    const payload: N8nWebhookPayload = {
      agentId: this.agentId,
      sessionId,
      userId,
      email,
      businessType,
      language,
      escalationType: "technical",
      priority,
      customerMessage,
      aiResponse,
      timestamp: new Date().toISOString(),
      metadata: {
        source: "ai-chat-interface",
        escalationReason: "technical_issue_detected",
      },
    }

    return await this.sendEscalation(payload)
  }

  detectEscalationType(message: string): "complaint" | "technical" | "billing" | "general" {
    const lowerMessage = message.toLowerCase()

    // Complaint keywords
    const complaintKeywords = [
      "complaint",
      "complain",
      "angry",
      "frustrated",
      "terrible",
      "awful",
      "worst",
      "disappointed",
      "unsatisfied",
      "unacceptable",
      "ridiculous",
      "outrageous",
    ]

    // Technical keywords
    const technicalKeywords = [
      "not working",
      "broken",
      "error",
      "bug",
      "crash",
      "freeze",
      "slow",
      "connection",
      "network",
      "internet",
      "wifi",
      "technical",
      "system",
    ]

    // Billing keywords
    const billingKeywords = [
      "bill",
      "billing",
      "charge",
      "payment",
      "money",
      "refund",
      "cost",
      "price",
      "expensive",
      "overcharge",
      "invoice",
      "account",
    ]

    if (complaintKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      return "complaint"
    }

    if (technicalKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      return "technical"
    }

    if (billingKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      return "billing"
    }

    return "general"
  }

  detectPriority(message: string): "low" | "medium" | "high" | "critical" {
    const lowerMessage = message.toLowerCase()

    // Critical keywords
    const criticalKeywords = [
      "emergency",
      "urgent",
      "critical",
      "immediately",
      "asap",
      "now",
      "can't work",
      "completely broken",
      "total failure",
    ]

    // High priority keywords
    const highKeywords = [
      "important",
      "serious",
      "major",
      "significant",
      "affecting business",
      "losing money",
      "customers complaining",
    ]

    // Low priority keywords
    const lowKeywords = ["minor", "small", "little", "whenever", "no rush", "not urgent"]

    if (criticalKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      return "critical"
    }

    if (highKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      return "high"
    }

    if (lowKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      return "low"
    }

    return "medium"
  }
}

export const n8nIntegration = new N8nIntegration()
