import { NextResponse } from "next/server"
import { getDatabaseHealth, testConnection } from "@/environment/database"

export async function GET() {
  try {
    const dbHealth = getDatabaseHealth()
    const connectionTest = await testConnection()

    return NextResponse.json({
      success: true,
      database: {
        status: dbHealth.status,
        connection: {
          success: connectionTest.success,
          message: connectionTest.message,
          details: connectionTest.details,
        },
        metrics: dbHealth.metrics,
        poolInfo: dbHealth.poolInfo,
        cache: dbHealth.cacheInfo,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database health check failed:", error)
    return NextResponse.json(
      {
        success: false,
        database: {
          status: "critical",
          connection: {
            success: false,
            message: "Database health check failed",
            details: { error: (error as Error).message },
          },
          metrics: null,
          poolInfo: null,
          cache: null,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
