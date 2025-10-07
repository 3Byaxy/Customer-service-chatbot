import { type NextRequest, NextResponse } from "next/server"
import { dbHelpers } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = (searchParams.get("timeframe") as "day" | "week" | "month") || "day"

    const analytics = await dbHelpers.getAnalytics(timeframe)

    // Process analytics data
    const processedData = {
      timeframe: analytics.timeframe,
      period: {
        start: analytics.startDate,
        end: analytics.endDate,
      },
      sessions: {
        total: analytics.sessions.length,
        byStatus: analytics.sessions.reduce((acc: any, session: any) => {
          acc[session.status] = (acc[session.status] || 0) + 1
          return acc
        }, {}),
        byBusinessType: analytics.sessions.reduce((acc: any, session: any) => {
          acc[session.business_type] = (acc[session.business_type] || 0) + 1
          return acc
        }, {}),
        byLanguage: analytics.sessions.reduce((acc: any, session: any) => {
          acc[session.language] = (acc[session.language] || 0) + 1
          return acc
        }, {}),
      },
      messages: {
        total: analytics.messages.length,
        bySender: analytics.messages.reduce((acc: any, message: any) => {
          acc[message.sender] = (acc[message.sender] || 0) + 1
          return acc
        }, {}),
        byProvider: analytics.messages.reduce((acc: any, message: any) => {
          if (message.metadata?.model_provider) {
            acc[message.metadata.model_provider] = (acc[message.metadata.model_provider] || 0) + 1
          }
          return acc
        }, {}),
        escalated: analytics.messages.filter((msg: any) => msg.metadata?.escalated).length,
        knowledgeUsed: analytics.messages.filter((msg: any) => msg.metadata?.knowledge_used).length,
      },
      tickets: {
        total: analytics.tickets.length,
        byStatus: analytics.tickets.reduce((acc: any, ticket: any) => {
          acc[ticket.status] = (acc[ticket.status] || 0) + 1
          return acc
        }, {}),
        byPriority: analytics.tickets.reduce((acc: any, ticket: any) => {
          acc[ticket.priority] = (acc[ticket.priority] || 0) + 1
          return acc
        }, {}),
      },
    }

    return NextResponse.json({
      success: true,
      data: processedData,
    })
  } catch (error) {
    console.error("Analytics retrieval error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve analytics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
