import { NextResponse } from "next/server"
import { getDatabaseHealth, testConnection, getQueryCacheStats } from "@/lib/database"

export async function GET() {
  try {
    // Get comprehensive database health information
    const healthInfo = getDatabaseHealth()
    const connectionTest = await testConnection()
    const cacheStats = getQueryCacheStats()

    // Calculate additional metrics
    const uptime = process.uptime()
    const memoryUsage = process.memoryUsage()

    const response = {
      timestamp: new Date().toISOString(),
      database: {
        status: healthInfo.status,
        connection: connectionTest,
        metrics: healthInfo.metrics,
        pool: healthInfo.poolInfo,
        cache: {
          ...healthInfo.cacheInfo,
          details: cacheStats,
        },
      },
      system: {
        uptime: Math.floor(uptime),
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          external: Math.round(memoryUsage.external / 1024 / 1024),
          rss: Math.round(memoryUsage.rss / 1024 / 1024),
        },
        nodeVersion: process.version,
        platform: process.platform,
      },
      performance: {
        averageQueryTime: healthInfo.metrics.averageQueryTime,
        totalQueries: healthInfo.metrics.totalQueries,
        failedQueries: healthInfo.metrics.failedQueries,
        successRate:
          healthInfo.metrics.totalQueries > 0
            ? (
                ((healthInfo.metrics.totalQueries - healthInfo.metrics.failedQueries) /
                  healthInfo.metrics.totalQueries) *
                100
              ).toFixed(2) + "%"
            : "0%",
        cacheHitRate: healthInfo.cacheInfo.hitRate,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Database health check failed:", error)
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: "Failed to get database health",
        details: (error as Error).message,
        database: {
          status: "critical",
          connection: {
            success: false,
            message: "Health check failed",
            details: { error: (error as Error).message },
          },
        },
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json()

    switch (action) {
      case "clear-cache":
        const { clearQueryCache } = await import("@/lib/database")
        clearQueryCache()
        return NextResponse.json({
          success: true,
          message: "Query cache cleared successfully",
        })

      case "test-connection":
        const connectionResult = await testConnection()
        return NextResponse.json(connectionResult)

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Database health action failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Action failed",
        details: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
