export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user" | "moderator"
  businessType: string
  language: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface Conversation {
  id: string
  userId: string
  sessionId: string
  businessType: string
  language: string
  detectedLanguage?: string
  languageConfidence?: number
  status: "active" | "completed" | "escalated" | "pending_approval"
  priority: "low" | "medium" | "high" | "urgent"
  createdAt: Date
  updatedAt: Date
  metadata: {
    userAgent?: string
    ipAddress?: string
    referrer?: string
  }
}

export interface Message {
  id: string
  conversationId: string
  sender: "user" | "kizuna_ai" | "admin"
  content: string
  originalLanguage?: string
  translatedContent?: string
  messageType: "text" | "voice" | "image" | "file"
  aiProvider?: string
  confidence?: number
  sentiment?: "positive" | "negative" | "neutral"
  intent?: string
  requiresApproval: boolean
  approvalStatus?: "pending" | "approved" | "rejected"
  approvedBy?: string
  createdAt: Date
  metadata: {
    voiceData?: string
    imageUrl?: string
    fileUrl?: string
    processingTime?: number
  }
}

export interface ApprovalRequest {
  id: string
  conversationId: string
  messageId: string
  requestType: "response" | "action" | "escalation"
  priority: "low" | "medium" | "high" | "urgent"
  description: string
  suggestedResponse?: string
  context: {
    userMessage: string
    conversationHistory: Message[]
    businessType: string
    language: string
  }
  status: "pending" | "approved" | "rejected" | "expired"
  requestedBy: string
  reviewedBy?: string
  reviewedAt?: Date
  createdAt: Date
  expiresAt: Date
}

export interface SystemMetrics {
  id: string
  timestamp: Date
  totalConversations: number
  activeConversations: number
  completedConversations: number
  averageResponseTime: number
  successRate: number
  languageDistribution: Record<string, number>
  businessTypeDistribution: Record<string, number>
  aiProviderUsage: Record<string, number>
  approvalRequestsCount: number
  pendingApprovals: number
}
