import { type NextRequest, NextResponse } from "next/server"

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
    const level = searchParams.get("level")
    const component = searchParams.get("component")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    // Generate mock logs (in production, this would query your SQL database)
    let logs = generateMockLogs(limit)

    // Apply filters
    if (level && level !== "all") {
      logs = logs.filter((log) => log.level === level)
    }

    if (component && component !== "all") {
      logs = logs.filter((log) => log.component === component)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      logs = logs.filter(
        (log) =>
          log.message.toLowerCase().includes(searchLower) ||
          log.details.toLowerCase().includes(searchLower) ||
          log.userId.toLowerCase().includes(searchLower) ||
          log.sessionId.toLowerCase().includes(searchLower) ||
          log.endpoint.toLowerCase().includes(searchLower) ||
          log.requestId.toLowerCase().includes(searchLower),
      )
    }

    // Calculate statistics
    const stats = {
      total: logs.length,
      info: logs.filter((log) => log.level === "info").length,
      warning: logs.filter((log) => log.level === "warning").length,
      error: logs.filter((log) => log.level === "error").length,
      success: logs.filter((log) => log.level === "success").length,
      debug: logs.filter((log) => log.level === "debug").length,
    }

    return NextResponse.json({
      logs,
      stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching logs:", error)
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}
