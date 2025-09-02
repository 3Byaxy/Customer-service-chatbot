import { type NextRequest, NextResponse } from "next/server"
import { APP_CONFIG } from "../../config/app-config"

export async function GET(request: NextRequest) {
  try {
    // Simulate real dashboard statistics
    const stats = {
      appInfo: {
        name: APP_CONFIG.name,
        chatbotName: APP_CONFIG.chatbot.name,
        version: APP_CONFIG.version,
        uptime: "99.9%",
      },
      realTimeMetrics: {
        activeConversations: Math.floor(Math.random() * 50) + 10,
        totalUsers: Math.floor(Math.random() * 1000) + 500,
        messagesProcessed: Math.floor(Math.random() * 10000) + 5000,
        averageResponseTime: Math.floor(Math.random() * 500) + 200,
        kizunaAiResponses: Math.floor(Math.random() * 8000) + 4000,
        approvalsPending: Math.floor(Math.random() * 15) + 2,
      },
      languageStats: {
        english: Math.floor(Math.random() * 60) + 40,
        luganda: Math.floor(Math.random() * 30) + 20,
        swahili: Math.floor(Math.random() * 20) + 10,
      },
      businessTypeStats: {
        telecom: Math.floor(Math.random() * 40) + 30,
        banking: Math.floor(Math.random() * 30) + 25,
        utilities: Math.floor(Math.random() * 20) + 15,
        ecommerce: Math.floor(Math.random() * 25) + 20,
      },
      aiProviderStats: {
        gemini: Math.floor(Math.random() * 50) + 40,
        anthropic: Math.floor(Math.random() * 30) + 20,
        groq: Math.floor(Math.random() * 20) + 15,
        openai: Math.floor(Math.random() * 15) + 10,
      },
      systemHealth: {
        database: "healthy",
        aiProviders: "healthy",
        voiceServices: "healthy",
        realtimeServices: "healthy",
        overallStatus: "operational",
      },
      recentActivity: [
        {
          id: "1",
          type: "conversation",
          message: "New conversation started in Luganda (Telecom)",
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          severity: "info",
        },
        {
          id: "2",
          type: "approval",
          message: "KizunaAI requested approval for billing dispute resolution",
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          severity: "warning",
        },
        {
          id: "3",
          type: "voice",
          message: "Voice call completed successfully (Banking sector)",
          timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
          severity: "success",
        },
        {
          id: "4",
          type: "language",
          message: "Auto-detected language switch: English → Swahili",
          timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
          severity: "info",
        },
      ],
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 })
  }
}
