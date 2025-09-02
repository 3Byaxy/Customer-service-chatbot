/**
 * Admin Approval System for Chatbot Interactions
 * Handles approval workflows and conversation monitoring
 */

export interface ApprovalRequest {
  id: string
  sessionId: string
  userId: string
  userMessage: string
  suggestedResponse: string
  suggestedAction: string
  priority: "low" | "medium" | "high" | "critical"
  businessType: string
  language: string
  timestamp: Date
  status: "pending" | "approved" | "rejected" | "auto_approved"
  adminId?: string
  adminResponse?: string
  autoApprovalReason?: string
}

export interface ConversationLog {
  id: string
  sessionId: string
  userId: string
  messages: Array<{
    id: string
    type: "user" | "bot" | "system"
    content: string
    timestamp: Date
    language?: string
    requiresApproval?: boolean
    approvalStatus?: "pending" | "approved" | "rejected"
  }>
  businessType: string
  status: "active" | "completed" | "escalated"
  startTime: Date
  lastActivity: Date
  approvalRequests: string[]
}

export class ApprovalSystem {
  private approvalRequests: Map<string, ApprovalRequest> = new Map()
  private conversationLogs: Map<string, ConversationLog> = new Map()
  private autoApprovalRules: Map<string, (request: ApprovalRequest) => boolean> = new Map()

  constructor() {
    this.setupAutoApprovalRules()
  }

  // Create approval request
  createApprovalRequest(
    sessionId: string,
    userId: string,
    userMessage: string,
    suggestedResponse: string,
    suggestedAction: string,
    businessType: string,
    language: string,
  ): ApprovalRequest {
    const requestId = `approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const request: ApprovalRequest = {
      id: requestId,
      sessionId,
      userId,
      userMessage,
      suggestedResponse,
      suggestedAction,
      priority: this.calculatePriority(userMessage, suggestedAction),
      businessType,
      language,
      timestamp: new Date(),
      status: "pending",
    }

    // Check for auto-approval
    if (this.shouldAutoApprove(request)) {
      request.status = "auto_approved"
      request.autoApprovalReason = this.getAutoApprovalReason(request)
    }

    this.approvalRequests.set(requestId, request)

    // Add to conversation log
    this.addToConversationLog(sessionId, userId, userMessage, "user", language, true)

    return request
  }

  // Approve request
  approveRequest(requestId: string, adminId: string, adminResponse?: string): boolean {
    const request = this.approvalRequests.get(requestId)
    if (!request || request.status !== "pending") {
      return false
    }

    request.status = "approved"
    request.adminId = adminId
    request.adminResponse = adminResponse

    // Add approved response to conversation log
    this.addToConversationLog(
      request.sessionId,
      "bot",
      adminResponse || request.suggestedResponse,
      "bot",
      request.language,
      false,
      "approved",
    )

    return true
  }

  // Reject request
  rejectRequest(requestId: string, adminId: string, reason: string): boolean {
    const request = this.approvalRequests.get(requestId)
    if (!request || request.status !== "pending") {
      return false
    }

    request.status = "rejected"
    request.adminId = adminId
    request.adminResponse = reason

    // Add rejection notice to conversation log
    this.addToConversationLog(
      request.sessionId,
      "system",
      `Request rejected: ${reason}`,
      "system",
      request.language,
      false,
      "rejected",
    )

    return true
  }

  // Get pending approvals
  getPendingApprovals(): ApprovalRequest[] {
    return Array.from(this.approvalRequests.values())
      .filter((request) => request.status === "pending")
      .sort((a, b) => {
        // Sort by priority and timestamp
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
        if (priorityDiff !== 0) return priorityDiff
        return b.timestamp.getTime() - a.timestamp.getTime()
      })
  }

  // Get conversation log
  getConversationLog(sessionId: string): ConversationLog | undefined {
    return this.conversationLogs.get(sessionId)
  }

  // Get all active conversations
  getActiveConversations(): ConversationLog[] {
    return Array.from(this.conversationLogs.values())
      .filter((log) => log.status === "active")
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
  }

  // Add message to conversation log
  addToConversationLog(
    sessionId: string,
    userId: string,
    content: string,
    type: "user" | "bot" | "system",
    language?: string,
    requiresApproval = false,
    approvalStatus?: "pending" | "approved" | "rejected",
  ) {
    let conversation = this.conversationLogs.get(sessionId)

    if (!conversation) {
      conversation = {
        id: sessionId,
        sessionId,
        userId,
        messages: [],
        businessType: "general",
        status: "active",
        startTime: new Date(),
        lastActivity: new Date(),
        approvalRequests: [],
      }
      this.conversationLogs.set(sessionId, conversation)
    }

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    conversation.messages.push({
      id: messageId,
      type,
      content,
      timestamp: new Date(),
      language,
      requiresApproval,
      approvalStatus,
    })

    conversation.lastActivity = new Date()

    // Update business type if detected
    if (type === "user") {
      const detectedBusinessType = this.detectBusinessType(content)
      if (detectedBusinessType !== "general") {
        conversation.businessType = detectedBusinessType
      }
    }
  }

  // Setup auto-approval rules
  private setupAutoApprovalRules() {
    // Simple greetings
    this.autoApprovalRules.set("greeting", (request) => {
      const greetingKeywords = ["hello", "hi", "hujambo", "nkulamuse", "good morning", "good afternoon"]
      return greetingKeywords.some((keyword) => request.userMessage.toLowerCase().includes(keyword.toLowerCase()))
    })

    // Basic information requests
    this.autoApprovalRules.set("basic_info", (request) => {
      const infoKeywords = ["hours", "location", "contact", "phone number", "address"]
      return (
        infoKeywords.some((keyword) => request.userMessage.toLowerCase().includes(keyword.toLowerCase())) &&
        request.priority === "low"
      )
    })

    // FAQ responses
    this.autoApprovalRules.set("faq", (request) => {
      return request.suggestedAction.includes("FAQ") && request.priority !== "critical"
    })

    // Simple acknowledgments
    this.autoApprovalRules.set("acknowledgment", (request) => {
      const ackKeywords = ["thank", "thanks", "webale", "asante", "ok", "okay"]
      return ackKeywords.some((keyword) => request.userMessage.toLowerCase().includes(keyword.toLowerCase()))
    })
  }

  // Check if request should be auto-approved
  private shouldAutoApprove(request: ApprovalRequest): boolean {
    // Never auto-approve critical priority requests
    if (request.priority === "critical") {
      return false
    }

    // Check auto-approval rules
    for (const [ruleName, rule] of this.autoApprovalRules) {
      if (rule(request)) {
        return true
      }
    }

    return false
  }

  // Get auto-approval reason
  private getAutoApprovalReason(request: ApprovalRequest): string {
    for (const [ruleName, rule] of this.autoApprovalRules) {
      if (rule(request)) {
        switch (ruleName) {
          case "greeting":
            return "Standard greeting response"
          case "basic_info":
            return "Basic information request"
          case "faq":
            return "FAQ response"
          case "acknowledgment":
            return "Simple acknowledgment"
          default:
            return "Automated approval based on rules"
        }
      }
    }
    return "Unknown auto-approval reason"
  }

  // Calculate priority based on message content and suggested action
  private calculatePriority(userMessage: string, suggestedAction: string): "low" | "medium" | "high" | "critical" {
    const lowerMessage = userMessage.toLowerCase()
    const lowerAction = suggestedAction.toLowerCase()

    // Critical keywords
    const criticalKeywords = ["emergency", "urgent", "critical", "fraud", "security", "hack", "stolen"]
    if (criticalKeywords.some((keyword) => lowerMessage.includes(keyword) || lowerAction.includes(keyword))) {
      return "critical"
    }

    // High priority keywords
    const highKeywords = ["problem", "issue", "not working", "broken", "failed", "error", "complaint"]
    if (highKeywords.some((keyword) => lowerMessage.includes(keyword) || lowerAction.includes(keyword))) {
      return "high"
    }

    // Medium priority keywords
    const mediumKeywords = ["help", "support", "question", "how to", "need", "want"]
    if (mediumKeywords.some((keyword) => lowerMessage.includes(keyword) || lowerAction.includes(keyword))) {
      return "medium"
    }

    return "low"
  }

  // Detect business type from message
  private detectBusinessType(message: string): string {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("data") || lowerMessage.includes("network") || lowerMessage.includes("airtime")) {
      return "telecom"
    }
    if (lowerMessage.includes("account") || lowerMessage.includes("bank") || lowerMessage.includes("loan")) {
      return "banking"
    }
    if (lowerMessage.includes("power") || lowerMessage.includes("water") || lowerMessage.includes("electricity")) {
      return "utilities"
    }
    if (lowerMessage.includes("order") || lowerMessage.includes("delivery") || lowerMessage.includes("product")) {
      return "ecommerce"
    }

    return "general"
  }

  // Get approval statistics
  getApprovalStats() {
    const requests = Array.from(this.approvalRequests.values())
    const total = requests.length
    const pending = requests.filter((r) => r.status === "pending").length
    const approved = requests.filter((r) => r.status === "approved").length
    const rejected = requests.filter((r) => r.status === "rejected").length
    const autoApproved = requests.filter((r) => r.status === "auto_approved").length

    return {
      total,
      pending,
      approved,
      rejected,
      autoApproved,
      autoApprovalRate: total > 0 ? (autoApproved / total) * 100 : 0,
      approvalRate: total > 0 ? ((approved + autoApproved) / total) * 100 : 0,
    }
  }
}

export const approvalSystem = new ApprovalSystem()
