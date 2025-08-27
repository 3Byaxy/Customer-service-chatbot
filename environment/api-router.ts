/**
 * API Key Router and Load Balancer
 * Routes requests to available API providers with fallback logic
 * Protects your primary keys by implementing rotation and rate limiting
 */

import { defaultConfig, type APIKeyConfig } from "./config"

export interface APIRoute {
  provider: string
  model: string
  endpoint: string
  key: string
  priority: number
  available: boolean
  lastUsed: Date
  requestCount: number
  errorCount: number
}

export class APIKeyRouter {
  private routes: APIRoute[] = []
  private requestCounts: Map<string, number> = new Map()
  private lastReset: Date = new Date()

  constructor() {
    this.initializeRoutes()
    this.startRateLimitReset()
  }

  private initializeRoutes() {
    // Google Gemini Routes (Primary)
    if (defaultConfig.google.gemini.enabled) {
      this.routes.push({
        provider: "google",
        model: "gemini-2.0-flash-exp",
        endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent",
        key: this.maskKey(defaultConfig.google.gemini.key),
        priority: 1,
        available: true,
        lastUsed: new Date(0),
        requestCount: 0,
        errorCount: 0,
      })

      this.routes.push({
        provider: "google",
        model: "gemini-1.5-flash",
        endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
        key: this.maskKey(defaultConfig.google.gemini.key),
        priority: 2,
        available: true,
        lastUsed: new Date(0),
        requestCount: 0,
        errorCount: 0,
      })

      this.routes.push({
        provider: "google",
        model: "gemini-1.5-pro",
        endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
        key: this.maskKey(defaultConfig.google.gemini.key),
        priority: 3,
        available: true,
        lastUsed: new Date(0),
        requestCount: 0,
        errorCount: 0,
      })
    }

    // Groq Routes (Secondary)
    if (defaultConfig.groq.api.enabled) {
      this.routes.push({
        provider: "groq",
        model: "llama-3.1-70b-versatile",
        endpoint: "https://api.groq.com/openai/v1/chat/completions",
        key: this.maskKey(defaultConfig.groq.api.key),
        priority: 4,
        available: true,
        lastUsed: new Date(0),
        requestCount: 0,
        errorCount: 0,
      })
    }

    // OpenAI Routes (Tertiary)
    if (defaultConfig.openai.api.enabled) {
      this.routes.push({
        provider: "openai",
        model: "gpt-4o-mini",
        endpoint: "https://api.openai.com/v1/chat/completions",
        key: this.maskKey(defaultConfig.openai.api.key),
        priority: 5,
        available: true,
        lastUsed: new Date(0),
        requestCount: 0,
        errorCount: 0,
      })
    }

    // Anthropic Routes (Quaternary)
    if (defaultConfig.anthropic.api.enabled) {
      this.routes.push({
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        endpoint: "https://api.anthropic.com/v1/messages",
        key: this.maskKey(defaultConfig.anthropic.api.key),
        priority: 6,
        available: true,
        lastUsed: new Date(0),
        requestCount: 0,
        errorCount: 0,
      })
    }

    // Sort by priority
    this.routes.sort((a, b) => a.priority - b.priority)
  }

  /**
   * Get the best available API route based on priority, rate limits, and availability
   */
  public getBestRoute(complexity: "simple" | "moderate" | "complex" = "moderate"): APIRoute | null {
    // Filter available routes
    const availableRoutes = this.routes.filter((route) => {
      const config = this.getConfigForProvider(route.provider)
      const currentCount = this.requestCounts.get(route.provider) || 0

      return (
        route.available &&
        route.errorCount < 5 && // Skip routes with too many errors
        currentCount < (config?.rateLimit || 60)
      ) // Respect rate limits
    })

    if (availableRoutes.length === 0) {
      return null
    }

    // For complex queries, prefer more capable models
    if (complexity === "complex") {
      const complexRoutes = availableRoutes.filter(
        (r) => r.model.includes("pro") || r.model.includes("gpt-4") || r.model.includes("claude"),
      )
      if (complexRoutes.length > 0) {
        return complexRoutes[0]
      }
    }

    // For simple queries, prefer faster/cheaper models
    if (complexity === "simple") {
      const simpleRoutes = availableRoutes.filter(
        (r) => r.model.includes("flash") || r.model.includes("mini") || r.model.includes("groq"),
      )
      if (simpleRoutes.length > 0) {
        return simpleRoutes[0]
      }
    }

    // Default: return highest priority available route
    return availableRoutes[0]
  }

  /**
   * Get the actual API key for a provider (unmasked)
   */
  public getAPIKey(provider: string): string {
    switch (provider) {
      case "google":
        return defaultConfig.google.gemini.key
      case "groq":
        return defaultConfig.groq.api.key
      case "openai":
        return defaultConfig.openai.api.key
      case "anthropic":
        return defaultConfig.anthropic.api.key
      case "huggingface":
        return defaultConfig.huggingface.api.key
      default:
        return ""
    }
  }

  /**
   * Record a successful request
   */
  public recordSuccess(provider: string) {
    const currentCount = this.requestCounts.get(provider) || 0
    this.requestCounts.set(provider, currentCount + 1)

    const route = this.routes.find((r) => r.provider === provider)
    if (route) {
      route.lastUsed = new Date()
      route.requestCount++
    }
  }

  /**
   * Record a failed request
   */
  public recordError(provider: string, error: string) {
    const route = this.routes.find((r) => r.provider === provider)
    if (route) {
      route.errorCount++

      // Temporarily disable route if too many errors
      if (route.errorCount >= 5) {
        route.available = false
        // Re-enable after 5 minutes
        setTimeout(
          () => {
            route.available = true
            route.errorCount = 0
          },
          5 * 60 * 1000,
        )
      }
    }
  }

  /**
   * Get routing statistics
   */
  public getStats() {
    return {
      routes: this.routes.map((route) => ({
        provider: route.provider,
        model: route.model,
        priority: route.priority,
        available: route.available,
        requestCount: route.requestCount,
        errorCount: route.errorCount,
        lastUsed: route.lastUsed,
        rateLimit: this.getConfigForProvider(route.provider)?.rateLimit || 0,
        currentUsage: this.requestCounts.get(route.provider) || 0,
      })),
      totalRequests: Array.from(this.requestCounts.values()).reduce((a, b) => a + b, 0),
      lastReset: this.lastReset,
    }
  }

  private maskKey(key: string): string {
    if (!key || key.length < 8) return "***"
    return key.substring(0, 4) + "***" + key.substring(key.length - 4)
  }

  private getConfigForProvider(provider: string): APIKeyConfig | null {
    switch (provider) {
      case "google":
        return defaultConfig.google.gemini
      case "groq":
        return defaultConfig.groq.api
      case "openai":
        return defaultConfig.openai.api
      case "anthropic":
        return defaultConfig.anthropic.api
      case "huggingface":
        return defaultConfig.huggingface.api
      default:
        return null
    }
  }

  private startRateLimitReset() {
    // Reset rate limit counters every minute
    setInterval(() => {
      this.requestCounts.clear()
      this.lastReset = new Date()
    }, 60 * 1000)
  }
}

// Global router instance
export const apiRouter = new APIKeyRouter()
