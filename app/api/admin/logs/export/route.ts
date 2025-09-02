import { type NextRequest, NextResponse } from "next/server"

// Helper function to convert logs to CSV format
function convertToCSV(logs: any[]): string {
  if (logs.length === 0) return ""

  // Define CSV headers
  const headers = [
    "timestamp",
    "level",
    "component",
    "message",
    "details",
    "userId",
    "sessionId",
    "duration",
    "ip",
    "endpoint",
    "statusCode",
    "requestId",
    "userAgent",
  ]

  // Create CSV content
  const csvContent = [
    headers.join(","), // Header row
    ...logs.map((log) =>
      headers
        .map((header) => {
          const value = log[header] || ""
          // Escape quotes and wrap in quotes if contains comma or quote
          const stringValue = String(value)
          if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        })
        .join(","),
    ),
  ].join("\n")

  return csvContent
}

// Generate mock logs (same as in logs/route.ts)
function generateMockLogs(count = 100) {
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
      duration: Math.floor(Math.random() * 5000) + 50,
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      endpoint: ["/api/chat", "/api/analyze-question", "/api/anthropic-test", "/api/gemini-test"][
        Math.floor(Math.random() * 4)
      ],
      statusCode:
        level === "error"
          ? [400, 401, 403, 404, 500, 502, 503][Math.floor(Math.random() * 7)]
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
    const format = searchParams.get("format") || "json"
    const level = searchParams.get("level")
    const component = searchParams.get("component")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "1000")

    // Generate logs (in production, query your SQL database)
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

    const timestamp = new Date().toISOString().split("T")[0] // YYYY-MM-DD format

    if (format === "csv") {
      const csvContent = convertToCSV(logs)

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="system-logs-${timestamp}.csv"`,
        },
      })
    } else {
      // JSON format
      const jsonContent = JSON.stringify(
        {
          exportInfo: {
            timestamp: new Date().toISOString(),
            totalLogs: logs.length,
            filters: {
              level: level || "all",
              component: component || "all",
              search: search || "none",
            },
          },
          logs,
        },
        null,
        2,
      )

      return new NextResponse(jsonContent, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="system-logs-${timestamp}.json"`,
        },
      })
    }
  } catch (error) {
    console.error("Error exporting logs:", error)
    return NextResponse.json({ error: "Failed to export logs" }, { status: 500 })
  }
}
