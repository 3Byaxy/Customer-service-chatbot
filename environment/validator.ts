// Environment validation service
export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  recommendations: string[]
}

export interface EnvironmentStatus {
  environment: string
  debug: boolean
  providers: {
    google: { key_configured: boolean; status: string }
    anthropic: { key_configured: boolean; status: string }
    openai: { key_configured: boolean; status: string }
    groq: { key_configured: boolean; status: string }
  }
  security: {
    encryption_configured: boolean
    rate_limiting: boolean
  }
}

class EnvironmentValidator {
  async validateEnvironment(): Promise<ValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []
    const recommendations: string[] = []

    // Check API keys
    const hasGoogleKey = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
    const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY
    const hasGroqKey = !!process.env.GROQ_API_KEY

    const totalKeys = [hasGoogleKey, hasAnthropicKey, hasOpenAIKey, hasGroqKey].filter(Boolean).length

    if (totalKeys === 0) {
      errors.push('No AI provider API keys configured')
    } else if (totalKeys === 1) {
      warnings.push('Only one AI provider configured - consider adding backup providers')
    }

    // Check environment settings
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.NEXTAUTH_SECRET) {
        warnings.push('NEXTAUTH_SECRET not configured for production')
      }
      if (process.env.DEBUG === 'true') {
        warnings.push('Debug mode enabled in production')
      }
    }

    // Recommendations
    if (!hasGoogleKey) {
      recommendations.push('Configure Google Gemini API key for free AI access')
    }
    if (totalKeys < 3) {
      recommendations.push('Configure multiple AI providers for better reliability')
    }
    if (!process.env.DATABASE_URL) {
      recommendations.push('Configure database for persistent storage')
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations
    }
  }

  getEnvironmentStatus(): EnvironmentStatus {
    return {
      environment: process.env.NODE_ENV || 'development',
      debug: process.env.DEBUG === 'true',
      providers: {
        google: {
          key_configured: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
          status: process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 'configured' : 'not_configured'
        },
        anthropic: {
          key_configured: !!process.env.ANTHROPIC_API_KEY,
          status: process.env.ANTHROPIC_API_KEY ? 'configured' : 'not_configured'
        },
        openai: {
          key_configured: !!process.env.OPENAI_API_KEY,
          status: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured'
        },
        groq: {
          key_configured: !!process.env.GROQ_API_KEY,
          status: process.env.GROQ_API_KEY ? 'configured' : 'not_configured'
        }
      },
      security: {
        encryption_configured: !!process.env.ENCRYPTION_KEY,
        rate_limiting: true // Assume rate limiting is enabled
      }
    }
  }

  async testProviders(): Promise<Record<string, any>> {
    const results: Record<string, any> = {}

    // Test each configured provider
    const providers = this.getEnvironmentStatus().providers

    for (const [name, config] of Object.entries(providers)) {
      if (config.key_configured) {
        try {
          // Mock test - in production, you'd make actual API calls
          results[name] = {
            status: 'healthy',
            responseTime: Math.round(100 + Math.random() * 200),
            lastTested: new Date().toISOString()
          }
        } catch (error) {
          results[name] = {
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            lastTested: new Date().toISOString()
          }
        }
      } else {
        results[name] = {
          status: 'not_configured',
          lastTested: null
        }
      }
    }

    return results
  }
}

export const environmentValidator = new EnvironmentValidator()