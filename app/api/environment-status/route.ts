import { environmentValidator } from "@/environment/validator"
import { apiRouter } from "@/environment/api-router"

export async function GET() {
  try {
    // Get comprehensive environment status
    const validation = await environmentValidator.validateEnvironment()
    const status = environmentValidator.getEnvironmentStatus()
    const routingStats = apiRouter.getStats()

    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      validation: {
        valid: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
        recommendations: validation.recommendations,
      },
      environment: status,
      routing: {
        totalRoutes: routingStats.routes.length,
        availableRoutes: routingStats.routes.filter((r) => r.available).length,
        totalRequests: routingStats.totalRequests,
        lastReset: routingStats.lastReset,
        routes: routingStats.routes.map((route) => ({
          provider: route.provider,
          model: route.model,
          priority: route.priority,
          available: route.available,
          requestCount: route.requestCount,
          errorCount: route.errorCount,
          rateLimit: route.rateLimit,
          currentUsage: route.currentUsage,
          usagePercentage: route.rateLimit > 0 ? Math.round((route.currentUsage / route.rateLimit) * 100) : 0,
        })),
      },
      security: {
        keysConfigured: Object.keys(status.providers).filter(
          (p) => status.providers[p as keyof typeof status.providers].key_configured,
        ).length,
        encryptionEnabled: status.security.encryption_configured,
        rateLimitingEnabled: status.security.rate_limiting,
      },
      recommendations: [
        ...validation.recommendations,
        routingStats.routes.filter((r) => r.available).length < 2
          ? "Configure additional AI providers for better reliability"
          : null,
        !status.security.encryption_configured ? "Enable encryption for sensitive data protection" : null,
        status.environment === "production" && status.debug ? "Disable debug mode in production" : null,
      ].filter(Boolean),
    })
  } catch (error) {
    console.error("Environment status error:", error)
    return Response.json(
      {
        success: false,
        error: "Failed to get environment status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
