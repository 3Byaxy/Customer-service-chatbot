import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simulate API statistics
    const apiStats = {
      providers: {
        google: {
          name: "Google Gemini",
          status: "active",
          requestsToday: Math.floor(Math.random() * 1000) + 500,
          successRate: 99.2,
          averageResponseTime: Math.floor(Math.random() * 200) + 300,
          rateLimit: {
            current: Math.floor(Math.random() * 40) + 10,
            max: 60,
            resetTime: new Date(Date.now() + 60 * 1000).toISOString(),
          },
          cost: 0.0,
        },
        groq: {
          name: "Groq",
          status: "standby",
          requestsToday: 0,
          successRate: 0,
          averageResponseTime: 0,
          rateLimit: {
            current: 0,
            max: 30,
            resetTime: new Date(Date.now() + 60 * 1000).toISOString(),
          },
          cost: 0.0,
        },
        openai: {
          name: "OpenAI",
          status: "standby",
          requestsToday: 0,
          successRate: 0,
          averageResponseTime: 0,
          rateLimit: {
            current: 0,
            max: 20,
            resetTime: new Date(Date.now() + 60 * 1000).toISOString(),
          },
          cost: 0.0,
        },
        anthropic: {
          name: "Anthropic",
          status: "standby",
          requestsToday: 0,
          successRate: 0,
          averageResponseTime: 0,
          rateLimit: {
            current: 0,
            max: 15,
            resetTime: new Date(Date.now() + 60 * 1000).toISOString(),
          },
          cost: 0.0,
        },
      },
      usage: {
        totalRequests: Math.floor(Math.random() * 2000) + 1000,
        successfulRequests: Math.floor(Math.random() * 1900) + 950,
        failedRequests: Math.floor(Math.random() * 50) + 10,
        totalTokens: Math.floor(Math.random() * 50000) + 25000,
        inputTokens: Math.floor(Math.random() * 30000) + 15000,
        outputTokens: Math.floor(Math.random() * 20000) + 10000,
        totalCost: 0.0,
      },
      performance: {
        averageResponseTime: Math.floor(Math.random() * 300) + 400,
        p95ResponseTime: Math.floor(Math.random() * 500) + 800,
        p99ResponseTime: Math.floor(Math.random() * 800) + 1200,
        uptime: 99.9,
      },
      errors: [
        {
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          provider: "google",
          error: "Rate limit exceeded",
          count: 3,
        },
        {
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          provider: "google",
          error: "Timeout",
          count: 1,
        },
      ],
    }

    return NextResponse.json(apiStats)
  } catch (error) {
    console.error("Failed to get API stats:", error)
    return NextResponse.json({ error: "Failed to get API stats" }, { status: 500 })
  }
}
