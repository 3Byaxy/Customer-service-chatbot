/**
 * API Key Router - Secure API Key Management and Routing
 * Handles secure routing of API keys to prevent direct exposure
 */

export interface APIKeyRequest {
  service: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  timeout?: number
}

export interface APIKeyResponse {
  success: boolean
  data?: any
  error?: string
  statusCode?: number
  rateLimitRemaining?: number
  rateLimitReset?: number
}

export class APIKeyRouter {
  private rateLimits: Map<string, { count: number; resetTime: number }> = new Map()
  private readonly RATE_LIMIT_WINDOW = 60000 // 1 minute
  private readonly MAX_REQUESTS_PER_MINUTE = 60

  /**
   * Route API request through secure key management
   */
  async routeRequest(request: APIKeyRequest): Promise<APIKeyResponse> {
    try {
      // Check rate limits
      if (!this.checkRateLimit(request.service)) {
        return {
          success: false,
          error: 'Rate limit exceeded',
          statusCode: 429
        }
      }

      // Get API key for the service
      const apiKey = this.getAPIKeyForService(request.service)
      if (!apiKey) {
        return {
          success: false,
          error: `API key not configured for service: ${request.service}`,
          statusCode: 500
        }
      }

      // Make the API call
      const response = await this.makeSecureAPIRequest(request, apiKey)

      // Update rate limit tracking
      this.updateRateLimit(request.service)

      return response
    } catch (error) {
      console.error(`API routing error for ${request.service}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        statusCode: 500
      }
    }
  }

  /**
   * Get API key for a specific service
   */
  private getAPIKeyForService(service: string): string | null {
    // Import API_KEYS dynamically to avoid circular dependencies
    const { API_KEYS } = require('./api-keys')

    switch (service.toLowerCase()) {
      case 'elevenlabs':
        return API_KEYS.ELEVENLABS?.key || null
      case 'elevenlabs-agent':
        return API_KEYS.ELEVENLABS?.key || null
      case 'openai':
        return API_KEYS.OPENAI?.key || null
      case 'anthropic':
        return API_KEYS.ANTHROPIC?.key || null
      case 'groq':
        return API_KEYS.GROQ?.key || null
      case 'gemini':
        return API_KEYS.GEMINI?.key || null
      case 'vapi':
        return API_KEYS.VAPI?.key || null
      case 'voiceflow':
        return API_KEYS.VOICEFLOW?.key || null
      case 'huggingface':
        return API_KEYS.HUGGINGFACE?.key || null
      default:
        return null
    }
  }

  /**
   * Make secure API request with proper headers
   */
  private async makeSecureAPIRequest(request: APIKeyRequest, apiKey: string): Promise<APIKeyResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...request.headers
    }

    // Add service-specific authentication headers
    switch (request.service.toLowerCase()) {
      case 'elevenlabs':
      case 'elevenlabs-agent':
        headers['xi-api-key'] = apiKey
        break
      case 'openai':
        headers['Authorization'] = `Bearer ${apiKey}`
        break
      case 'anthropic':
        headers['x-api-key'] = apiKey
        headers['anthropic-version'] = '2023-06-01'
        break
      case 'groq':
        headers['Authorization'] = `Bearer ${apiKey}`
        break
      case 'gemini':
        // Gemini uses API key in URL or specific header
        break
      case 'vapi':
        headers['Authorization'] = `Bearer ${apiKey}`
        break
      case 'voiceflow':
        headers['Authorization'] = `Bearer ${apiKey}`
        break
      case 'huggingface':
        headers['Authorization'] = `Bearer ${apiKey}`
        break
    }

    try {
      const fetchOptions: RequestInit = {
        method: request.method,
        headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
      }

      // Add timeout if specified
      const controller = new AbortController()
      if (request.timeout) {
        setTimeout(() => controller.abort(), request.timeout)
        fetchOptions.signal = controller.signal
      }

      const response = await fetch(request.endpoint, fetchOptions)

      // Extract rate limit information from headers
      const rateLimitRemaining = response.headers.get('x-ratelimit-remaining')
      const rateLimitReset = response.headers.get('x-ratelimit-reset')

      if (!response.ok) {
        const errorText = await response.text()
        return {
          success: false,
          error: `API request failed: ${response.status} ${response.statusText}`,
          statusCode: response.status,
          rateLimitRemaining: rateLimitRemaining ? parseInt(rateLimitRemaining) : undefined,
          rateLimitReset: rateLimitReset ? parseInt(rateLimitReset) : undefined
        }
      }

      const data = await response.json()

      return {
        success: true,
        data,
        statusCode: response.status,
        rateLimitRemaining: rateLimitRemaining ? parseInt(rateLimitRemaining) : undefined,
        rateLimitReset: rateLimitReset ? parseInt(rateLimitReset) : undefined
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout',
          statusCode: 408
        }
      }

      throw error
    }
  }

  /**
   * Check if request is within rate limits
   */
  private checkRateLimit(service: string): boolean {
    const now = Date.now()
    const key = `${service}_${Math.floor(now / this.RATE_LIMIT_WINDOW)}`
    const limit = this.rateLimits.get(key)

    if (!limit) {
      this.rateLimits.set(key, { count: 1, resetTime: now + this.RATE_LIMIT_WINDOW })
      return true
    }

    if (now > limit.resetTime) {
      this.rateLimits.set(key, { count: 1, resetTime: now + this.RATE_LIMIT_WINDOW })
      return true
    }

    if (limit.count >= this.MAX_REQUESTS_PER_MINUTE) {
      return false
    }

    limit.count++
    return true
  }

  /**
   * Update rate limit tracking
   */
  private updateRateLimit(service: string): void {
    const now = Date.now()
    const key = `${service}_${Math.floor(now / this.RATE_LIMIT_WINDOW)}`
    const limit = this.rateLimits.get(key)

    if (limit) {
      limit.count++
    }
  }

  /**
   * Get rate limit status for a service
   */
  getRateLimitStatus(service: string): { remaining: number; resetTime: number } | null {
    const now = Date.now()
    const key = `${service}_${Math.floor(now / this.RATE_LIMIT_WINDOW)}`
    const limit = this.rateLimits.get(key)

    if (!limit || now > limit.resetTime) {
      return { remaining: this.MAX_REQUESTS_PER_MINUTE, resetTime: now + this.RATE_LIMIT_WINDOW }
    }

    return {
      remaining: Math.max(0, this.MAX_REQUESTS_PER_MINUTE - limit.count),
      resetTime: limit.resetTime
    }
  }

  /**
   * Validate API key configuration
   */
  validateAPIKeys(): { valid: boolean; missing: string[]; warnings: string[] } {
    const { API_KEYS } = require('./api-keys')
    const missing: string[] = []
    const warnings: string[] = []

    const requiredServices = ['ELEVENLABS', 'GEMINI']

    requiredServices.forEach(service => {
      if (!API_KEYS[service]?.key || API_KEYS[service]?.key === `your_${service.toLowerCase()}_key_here`) {
        missing.push(service)
      }
    })

    // Check for placeholder keys
    Object.entries(API_KEYS).forEach(([service, config]: [string, any]) => {
      if (config.key && config.key.includes('your_') && config.key.includes('_here')) {
        warnings.push(`${service} API key appears to be a placeholder`)
      }
    })

    return {
      valid: missing.length === 0,
      missing,
      warnings
    }
  }
}

// Global instance
export const apiKeyRouter = new APIKeyRouter()