import { type NextRequest, NextResponse } from "next/server"
import { getLogs } from "@/environment/logging"

// Mock log data generator for development
function generateMockLogs(count = 50) {
  const levels = ["info", "warning", "error", "success", "debug"]
  const components = [
    "API Gateway",
    "Database",
    "AI Provider",
    "Authentication",
    "Context Manager",
    "Rate Limiter",
    "Session Manager",
    "Message Router",
    "Analytics Engine",
    "Security Monitor",
  ]

  const messages = {
    info: [
      "Request processed successfully",
      "User session started",
      "Context data saved",
      "Message routed to AI provider",
      "Analytics data updated",
    ],
    warning: [
      "Slow database query detected",
      "Rate limit approaching",
      "High memory usage detected",
      "Context size limit reached",
      "Session timeout warning",
    ],
    error: [
      "API request failed",
      "Database connection lost",
      "AI provider timeout",
      "Authentication failed",
      "Context save failed",
    ],
    success: [
      "User authenticated successfully",
      "Message processed and responded",
      "Database backup completed",
      "Context cleanup completed",
      "Session restored successfully",
    ],
    debug: [
      "Debug: Request headers logged",
      "Debug: Context data structure",
      "Debug: AI response parsing",
      "Debug: Session state change",
      "Debug: Rate limit check",
    ],
  }

  const logs = []

  for (let i = 0; i < count; i++) {
    const level = levels[Math.floor(Math.random() * levels.length)]
    const component = components[Math.floor(Math.random() * components.length)]
    const messageList = messages[level as keyof typeof messages]
    const message = messageList[Math.floor(Math.random() * messageList.length)]

    // Generate timestamp within last 24 hours
    const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)

    const log = {
      id: `log_${Date.now()}_${i}`,
      timestamp: timestamp.toISOString(),
      level,
      component,
      message,
      details:
        level === "error"
          ? `Error details: ${message} - Stack trace available`
          : level === "warning"
            ? `Warning: ${message} - Monitor closely`
            : `Additional info: ${message}`,
      userId: `user_${Math.floor(Math.random() * 1000)}`,
      sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
      duration: Math.floor(Math.random() * 5000) + 50, // 50-5000ms
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      endpoint: ["/api/chat", "/api/analyze-question", "/api/anthropic-test", "/api/gemini-test"][
        Math.floor(Math.random() * 4)
      ],
      statusCode:
        level === "error"
          ? [400, 401, 403, 404, 500, 502, 503][Math.floor(Math.random() * 7)]
          : level === "warning"
            ? [200, 201, 202][Math.floor(Math.random() * 3)]
            : [200, 201, 202][Math.floor(Math.random() * 3)],
      requestId: `req_${Math.random().toString(36).substr(2, 12)}`,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    }

    logs.push(log)
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const options = {
      level: searchParams.get("level") as any,
      component: searchParams.get("component") || undefined,
      search: searchParams.get("search") || undefined,
      limit: Number.parseInt(searchParams.get("limit") || "100"),
      offset: Number.parseInt(searchParams.get("offset") || "0"),
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    }

    const result = await getLogs(options)

    return NextResponse.json({
      success: true,
      logs: result.logs,
      total: result.total,
      stats: result.stats,
    })
  } catch (error) {
    console.error("Failed to fetch logs:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch logs",
        logs: [],
        total: 0,
        stats: { total: 0, info: 0, warning: 0, error: 0, success: 0, debug: 0 },
      },
      { status: 500 },
    )
  }
}
