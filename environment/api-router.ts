// API routing and load balancing service
export interface APIRoute {
  provider: string
  model: string
  priority: number
  available: boolean
  requestCount: number
  errorCount: number
  rateLimit: number
  currentUsage: number
  lastUsed: Date | null
}

export interface RouterStats {
  routes: APIRoute[]
  totalRequests: number
  lastReset: Date
}

class APIRouter {
  private routes: APIRoute[] = []
  private totalRequests = 0
  private lastReset = new Date()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // Initialize routes based on available API keys
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      this.routes.push({
        provider: 'google',
        model: 'gemini-1.5-flash',
        priority: 1,
        available: true,
        requestCount: 0,
        errorCount: 0,
        rateLimit: 60, // requests per minute
        currentUsage: 0,
        lastUsed: null
      })
      this.routes.push({
        provider: 'google',
        model: 'gemini-1.5-pro',
        priority: 2,
        available: true,
        requestCount: 0,
        errorCount: 0,
        rateLimit: 30,
        currentUsage: 0,
        lastUsed: null
      })
    }

    if (process.env.GROQ_API_KEY) {
      this.routes.push({
        provider: 'groq',
        model: 'llama-3.1-70b-versatile',
        priority: 3,
        available: true,
        requestCount: 0,
        errorCount: 0,
        rateLimit: 100,
        currentUsage: 0,
        lastUsed: null
      })
    }

    if (process.env.ANTHROPIC_API_KEY) {
      this.routes.push({
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-20241022',
        priority: 4,
        available: true,
        requestCount: 0,
        errorCount: 0,
        rateLimit: 50,
        currentUsage: 0,
        lastUsed: null
      })
    }

    if (process.env.OPENAI_API_KEY) {
      this.routes.push({
        provider: 'openai',
        model: 'gpt-4o-mini',
        priority: 5,
        available: true,
        requestCount: 0,
        errorCount: 0,
        rateLimit: 40,
        currentUsage: 0,
        lastUsed: null
      })
      this.routes.push({
        provider: 'openai',
        model: 'gpt-4o',
        priority: 6,
        available: true,
        requestCount: 0,
        errorCount: 0,
        rateLimit: 20,
        currentUsage: 0,
        lastUsed: null
      })
    }
  }

  getNextRoute(requirements?: { complexity?: string; provider?: string }): APIRoute | null {
    // Filter available routes
    let availableRoutes = this.routes.filter(route => 
      route.available && 
      route.currentUsage < route.rateLimit
    )

    // Apply requirements filter
    if (requirements?.provider) {
      availableRoutes = availableRoutes.filter(route => 
        route.provider === requirements.provider
      )
    }

    if (requirements?.complexity === 'complex') {
      // Prefer more powerful models for complex tasks
      availableRoutes = availableRoutes.filter(route => 
        route.model.includes('pro') || 
        route.model.includes('gpt-4o') || 
        route.model.includes('claude')
      )
    }

    if (availableRoutes.length === 0) {
      return null
    }

    // Sort by priority and usage
    availableRoutes.sort((a, b) => {
      // First by priority (lower number = higher priority)
      if (a.priority !== b.priority) {
        return a.priority - b.priority
      }
      // Then by usage (prefer less used routes)
      return a.currentUsage - b.currentUsage
    })

    return availableRoutes[0]
  }

  recordRequest(provider: string, model: string, success: boolean) {
    const route = this.routes.find(r => r.provider === provider && r.model === model)
    if (route) {
      route.requestCount++
      route.currentUsage++
      route.lastUsed = new Date()
      
      if (!success) {
        route.errorCount++
        // Temporarily disable route if error rate is too high
        if (route.errorCount > 5 && route.errorCount / route.requestCount > 0.5) {
          route.available = false
          // Re-enable after 5 minutes
          setTimeout(() => {
            route.available = true
            route.errorCount = 0
          }, 5 * 60 * 1000)
        }
      }
    }
    
    this.totalRequests++
  }

  resetUsageCounters() {
    this.routes.forEach(route => {
      route.currentUsage = 0
    })
    this.lastReset = new Date()
  }

  getStats(): RouterStats {
    return {
      routes: [...this.routes],
      totalRequests: this.totalRequests,
      lastReset: this.lastReset
    }
  }

  getAvailableProviders(): string[] {
    return [...new Set(this.routes.filter(r => r.available).map(r => r.provider))]
  }

  getRoutesByProvider(provider: string): APIRoute[] {
    return this.routes.filter(r => r.provider === provider)
  }
}

// Reset usage counters every minute
const router = new APIRouter()
setInterval(() => {
  router.resetUsageCounters()
}, 60 * 1000)

export const apiRouter = router