import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simulate system status check
    const systemStatus = {
      overall: {
        status: "healthy",
        uptime: "99.9%",
        lastCheck: new Date().toISOString(),
      },
      services: {
        ai: [
          {
            name: "Google Gemini",
            status: "healthy",
            responseTime: Math.floor(Math.random() * 200) + 100,
            lastCheck: new Date().toISOString(),
          },
          {
            name: "API Router",
            status: "healthy",
            responseTime: Math.floor(Math.random() * 50) + 10,
            lastCheck: new Date().toISOString(),
          },
          {
            name: "Context Manager",
            status: "healthy",
            responseTime: Math.floor(Math.random() * 30) + 5,
            lastCheck: new Date().toISOString(),
          },
        ],
        database: [
          {
            name: "Session Storage",
            status: "healthy",
            connections: Math.floor(Math.random() * 20) + 5,
            lastCheck: new Date().toISOString(),
          },
          {
            name: "Context Storage",
            status: "healthy",
            size: "12.3MB",
            lastCheck: new Date().toISOString(),
          },
        ],
      },
      metrics: {
        totalConversations: Math.floor(Math.random() * 1000) + 500,
        apiRequestsToday: Math.floor(Math.random() * 2000) + 1000,
        activeUsers: Math.floor(Math.random() * 100) + 50,
        successRate: Math.floor(Math.random() * 10) + 90,
        averageResponseTime: Math.floor(Math.random() * 300) + 200,
        errorRate: Math.floor(Math.random() * 5) + 1,
      },
      alerts: [
        {
          id: 1,
          type: "info",
          message: "System health check passed",
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          type: "warning",
          message: "API request volume increased by 45%",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          type: "success",
          message: "Context cleanup completed successfully",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
      ],
    }

    return NextResponse.json(systemStatus)
  } catch (error) {
    console.error("Failed to get system status:", error)
    return NextResponse.json({ error: "Failed to get system status" }, { status: 500 })
  }
}
