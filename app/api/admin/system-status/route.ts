import { NextResponse } from "next/server"
import { getDatabaseHealth, testConnection } from "@/lib/database"

export async function GET() {
  try {
    // Get database health
    const dbHealth = getDatabaseHealth()
    const dbConnection = await testConnection()

    // System metrics
    const uptime = process.uptime()
    const memoryUsage = process.memoryUsage()
    const cpuUsage = process.cpuUsage()

    // Calculate memory percentages
    const memoryUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024)
    const memoryTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024)
    const memoryUsagePercent = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)

    // Mock additional system metrics (in production, you'd get these from actual system monitoring)
    const systemMetrics = {
      cpu: {
        usage: Math.min(95, Math.max(5, 15 + Math.random() * 30)), // Mock CPU usage between 5-45%
        cores: require("os").cpus().length,
        loadAverage: require("os").loadavg(),
      },
      memory: {
        used: memoryUsedMB,
        total: memoryTotalMB,
        percentage: memoryUsagePercent,
        available: memoryTotalMB - memoryUsedMB,
      },
      disk: {
        used: Math.round(45 + Math.random() * 20), // Mock disk usage
        total: 100,
        available: Math.round(35 + Math.random() * 20),
      },
      network: {
        bytesIn: Math.round(Math.random() * 1000000),
        bytesOut: Math.round(Math.random() * 500000),
        connectionsActive: Math.round(10 + Math.random() * 40),
      },
    }

    // API Provider Status (mock data - in production, you'd check actual providers)
    const apiProviders = [
      {
        name: "Google Gemini",
        status: "active",
        responseTime: Math.round(200 + Math.random() * 300),
        successRate: 99.2,
        requestsToday: Math.round(150 + Math.random() * 100),
        rateLimit: {
          used: Math.round(Math.random() * 50),
          total: 60,
          resetTime: new Date(Date.now() + 60000).toISOString(),
        },
      },
      {
        name: "Groq",
        status: process.env.GROQ_API_KEY ? "standby" : "not_configured",
        responseTime: Math.round(150 + Math.random() * 200),
        successRate: 98.8,
        requestsToday: 0,
        rateLimit: {
          used: 0,
          total: 100,
          resetTime: new Date(Date.now() + 60000).toISOString(),
        },
      },
      {
        name: "Anthropic Claude",
        status: process.env.ANTHROPIC_API_KEY ? "active" : "not_configured",
        responseTime: Math.round(300 + Math.random() * 400),
        successRate: 99.5,
        requestsToday: Math.round(Math.random() * 50),
        rateLimit: {
          used: Math.round(Math.random() * 30),
          total: 50,
          resetTime: new Date(Date.now() + 60000).toISOString(),
        },
      },
      {
        name: "OpenAI",
        status: process.env.OPENAI_API_KEY ? "standby" : "not_configured",
        responseTime: Math.round(400 + Math.random() * 300),
        successRate: 99.1,
        requestsToday: 0,
        rateLimit: {
          used: 0,
          total: 40,
          resetTime: new Date(Date.now() + 60000).toISOString(),
        },
      },
    ]

    // Service Status
    const services = [
      {
        name: "API Gateway",
        status: "healthy",
        uptime: uptime,
        lastCheck: new Date().toISOString(),
        responseTime: Math.round(50 + Math.random() * 100),
      },
      {
        name: "Database",
        status: dbHealth.status === "healthy" ? "healthy" : dbHealth.status === "warning" ? "degraded" : "unhealthy",
        uptime: uptime,
        lastCheck: new Date().toISOString(),
        responseTime: dbHealth.metrics.averageQueryTime,
      },
      {
        name: "Context Manager",
        status: "healthy",
        uptime: uptime,
        lastCheck: new Date().toISOString(),
        responseTime: Math.round(30 + Math.random() * 70),
      },
      {
        name: "Analytics Engine",
        status: "healthy",
        uptime: uptime,
        lastCheck: new Date().toISOString(),
        responseTime: Math.round(100 + Math.random() * 200),
      },
      {
        name: "Rate Limiter",
        status: "healthy",
        uptime: uptime,
        lastCheck: new Date().toISOString(),
        responseTime: Math.round(10 + Math.random() * 30),
      },
    ]

    // Overall system status
    const criticalIssues = services.filter((s) => s.status === "unhealthy").length
    const warnings = services.filter((s) => s.status === "degraded").length

    let overallStatus = "healthy"
    if (criticalIssues > 0) {
      overallStatus = "critical"
    } else if (warnings > 0 || dbHealth.status === "warning") {
      overallStatus = "warning"
    }

    // Recent activity summary
    const activitySummary = {
      totalRequests: Math.round(500 + Math.random() * 1000),
      successfulRequests: Math.round(480 + Math.random() * 500),
      failedRequests: Math.round(Math.random() * 20),
      averageResponseTime: Math.round(250 + Math.random() * 200),
      activeUsers: Math.round(20 + Math.random() * 80),
      activeSessions: Math.round(15 + Math.random() * 60),
    }

    const response = {
      timestamp: new Date().toISOString(),
      status: overallStatus,
      uptime: Math.floor(uptime),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",

      system: systemMetrics,
      database: {
        status: dbHealth.status,
        connection: dbConnection.success,
        metrics: dbHealth.metrics,
        pool: dbHealth.poolInfo,
        cache: dbHealth.cacheInfo,
      },

      services,
      apiProviders,
      activity: activitySummary,

      alerts: [
        ...(criticalIssues > 0
          ? [
              {
                level: "critical",
                message: `${criticalIssues} service(s) are unhealthy`,
                timestamp: new Date().toISOString(),
              },
            ]
          : []),
        ...(warnings > 0
          ? [
              {
                level: "warning",
                message: `${warnings} service(s) are degraded`,
                timestamp: new Date().toISOString(),
              },
            ]
          : []),
        ...(dbHealth.status === "warning"
          ? [
              {
                level: "warning",
                message: "Database performance is degraded",
                timestamp: new Date().toISOString(),
              },
            ]
          : []),
        ...(systemMetrics.memory.percentage > 80
          ? [
              {
                level: "warning",
                message: `High memory usage: ${systemMetrics.memory.percentage}%`,
                timestamp: new Date().toISOString(),
              },
            ]
          : []),
      ],
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("System status check failed:", error)
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        status: "critical",
        error: "Failed to get system status",
        details: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
