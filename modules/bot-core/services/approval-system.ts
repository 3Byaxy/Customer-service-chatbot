export interface ApprovalRequest {
  id: string
  conversationId: string
  userMessage: string
  suggestedResponse: string
  businessType: string
  language: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "approved" | "rejected" | "expired"
  createdAt: Date
  expiresAt: Date
  context: {
    intent?: string
    sentiment?: string
    confidence?: number
  }
}

class ApprovalSystem {
  private approvalRequests: Map<string, ApprovalRequest> = new Map()
  private approvalRules = {
    requiresApproval: [
      "billing dispute",
      "refund request",
      "account closure",
      "technical escalation",
      "complaint escalation",
      "service cancellation",
      "payment issues",
      "security concerns",
    ],
    urgentKeywords: ["urgent", "emergency", "critical", "immediate", "fraud", "security", "hack", "stolen", "lost"],
    highPriorityKeywords: [
      "complaint",
      "dispute",
      "problem",
      "issue",
      "error",
      "not working",
      "broken",
      "failed",
      "wrong",
    ],
  }

  async checkApprovalRequired(message: string, businessType: string): Promise<boolean> {
    const normalizedMessage = message.toLowerCase()

    // Check if message contains keywords that require approval
    const requiresApproval = this.approvalRules.requiresApproval.some((keyword) => normalizedMessage.includes(keyword))

    // Business-specific rules
    const businessSpecificRules = {
      banking: ["transfer", "loan", "credit", "debit", "balance"],
      telecom: ["network", "signal", "coverage", "outage"],
      utilities: ["outage", "meter", "reading", "consumption"],
      ecommerce: ["order", "delivery", "shipping", "return"],
    }

    const businessKeywords = businessSpecificRules[businessType as keyof typeof businessSpecificRules] || []
    const hasBusinessKeyword = businessKeywords.some((keyword) => normalizedMessage.includes(keyword))

    return requiresApproval || (hasBusinessKeyword && this.isComplexRequest(normalizedMessage))
  }

  private isComplexRequest(message: string): boolean {
    const complexityIndicators = [
      "why",
      "how",
      "when",
      "where",
      "explain",
      "details",
      "multiple",
      "several",
      "many",
      "various",
      "different",
    ]

    return complexityIndicators.some((indicator) => message.includes(indicator))
  }

  async createApprovalRequest(data: {
    conversationId: string
    userMessage: string
    suggestedResponse: string
    businessType: string
    language: string
    priority?: string
  }): Promise<ApprovalRequest> {
    const id = `approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const priority = this.determinePriority(data.userMessage)

    const request: ApprovalRequest = {
      id,
      conversationId: data.conversationId,
      userMessage: data.userMessage,
      suggestedResponse: data.suggestedResponse,
      businessType: data.businessType,
      language: data.language,
      priority,
      status: "pending",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + (priority === "urgent" ? 5 * 60 * 1000 : 30 * 60 * 1000)),
      context: {
        intent: this.detectIntent(data.userMessage),
        sentiment: this.detectSentiment(data.userMessage),
        confidence: 0.8,
      },
    }

    this.approvalRequests.set(id, request)

    // Notify admins (in real implementation, this would send notifications)
    console.log(`New approval request: ${id} (Priority: ${priority})`)

    return request
  }

  private determinePriority(message: string): "low" | "medium" | "high" | "urgent" {
    const normalizedMessage = message.toLowerCase()

    if (this.approvalRules.urgentKeywords.some((keyword) => normalizedMessage.includes(keyword))) {
      return "urgent"
    }

    if (this.approvalRules.highPriorityKeywords.some((keyword) => normalizedMessage.includes(keyword))) {
      return "high"
    }

    return "medium"
  }

  private detectIntent(message: string): string {
    const intents = {
      billing: ["bill", "payment", "charge", "cost", "price", "fee"],
      technical: ["not working", "broken", "error", "problem", "issue"],
      account: ["account", "profile", "login", "password", "access"],
      service: ["service", "plan", "package", "upgrade", "downgrade"],
    }

    const normalizedMessage = message.toLowerCase()

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some((keyword) => normalizedMessage.includes(keyword))) {
        return intent
      }
    }

    return "general"
  }

  private detectSentiment(message: string): string {
    const positiveWords = ["good", "great", "excellent", "happy", "satisfied", "thank"]
    const negativeWords = ["bad", "terrible", "awful", "angry", "frustrated", "disappointed"]

    const normalizedMessage = message.toLowerCase()
    const positiveCount = positiveWords.filter((word) => normalizedMessage.includes(word)).length
    const negativeCount = negativeWords.filter((word) => normalizedMessage.includes(word)).length

    if (negativeCount > positiveCount) return "negative"
    if (positiveCount > negativeCount) return "positive"
    return "neutral"
  }

  async getPendingApprovals(): Promise<ApprovalRequest[]> {
    const pending = Array.from(this.approvalRequests.values())
      .filter((request) => request.status === "pending" && request.expiresAt > new Date())
      .sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })

    return pending
  }

  async approveRequest(requestId: string, adminResponse?: string): Promise<boolean> {
    const request = this.approvalRequests.get(requestId)
    if (!request || request.status !== "pending") {
      return false
    }

    request.status = "approved"
    if (adminResponse) {
      request.suggestedResponse = adminResponse
    }

    return true
  }

  async rejectRequest(requestId: string, reason?: string): Promise<boolean> {
    const request = this.approvalRequests.get(requestId)
    if (!request || request.status !== "pending") {
      return false
    }

    request.status = "rejected"
    return true
  }
}

export const approvalSystem = new ApprovalSystem()
