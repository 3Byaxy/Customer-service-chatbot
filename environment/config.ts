/**
 * Environment Configuration Management
 * Centralized configuration for all API keys and sensitive data
 *
 * SECURITY NOTES:
 * - Never commit actual API keys to version control
 * - Use environment variables in production
 * - Rotate keys regularly
 * - Monitor API usage for unusual activity
 */

export interface APIKeyConfig {
  key: string
  enabled: boolean
  rateLimit?: number
  quotaLimit?: number
  region?: string
  notes?: string
}

export interface EnvironmentConfig {
  // AI Providers
  google: {
    gemini: APIKeyConfig
    backup_key?: string
  }
  groq: {
    api: APIKeyConfig
  }
  openai: {
    api: APIKeyConfig
  }
  anthropic: {
    api: APIKeyConfig
  }
  huggingface: {
    api: APIKeyConfig
  }

  // Database & Storage
  database: {
    url?: string
    ssl?: boolean
  }

  // Application Settings
  app: {
    environment: "development" | "staging" | "production"
    debug: boolean
    cors_origins: string[]
    max_requests_per_minute: number
  }

  // Business Configuration
  business: {
    default_language: string
    supported_languages: string[]
    escalation_threshold: number
    context_retention_days: number
  }

  // Security Settings
  security: {
    jwt_secret?: string
    encryption_key?: string
    allowed_origins: string[]
    rate_limiting: boolean
  }
}

// Default configuration with your current setup
export const defaultConfig: EnvironmentConfig = {
  google: {
    gemini: {
      key: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "AIzaSyD_kvtPIA2IiE2ncKiJP3FtHCyXWXEV27s",
      enabled: true,
      rateLimit: 60, // requests per minute
      quotaLimit: 1000000, // tokens per day
      region: "global",
      notes: "Primary AI provider - completely free with generous limits",
    },
    backup_key: process.env.GOOGLE_BACKUP_API_KEY,
  },

  groq: {
    api: {
      key: process.env.GROQ_API_KEY || "",
      enabled: !!process.env.GROQ_API_KEY,
      rateLimit: 30,
      quotaLimit: 14400, // requests per day
      notes: "Fast inference - free tier available",
    },
  },

  openai: {
    api: {
      key: process.env.OPENAI_API_KEY || "",
      enabled: !!process.env.OPENAI_API_KEY,
      rateLimit: 20,
      quotaLimit: 10000, // tokens per minute
      notes: "Premium AI - requires payment after free credits",
    },
  },

  anthropic: {
    api: {
      key: process.env.ANTHROPIC_API_KEY || "",
      enabled: !!process.env.ANTHROPIC_API_KEY,
      rateLimit: 15,
      quotaLimit: 4000, // requests per day
      notes: "Safety-focused AI - good for sensitive topics",
    },
  },

  huggingface: {
    api: {
      key: process.env.HUGGINGFACE_API_KEY || "",
      enabled: !!process.env.HUGGINGFACE_API_KEY,
      rateLimit: 10,
      notes: "Open source models - completely free with rate limits",
    },
  },

  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production",
  },

  app: {
    environment: (process.env.NODE_ENV as any) || "development",
    debug: process.env.NODE_ENV !== "production",
    cors_origins: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3000"],
    max_requests_per_minute: Number.parseInt(process.env.MAX_REQUESTS_PER_MINUTE || "100"),
  },

  business: {
    default_language: "en",
    supported_languages: ["en", "lg", "sw"],
    escalation_threshold: 0.7,
    context_retention_days: 30,
  },

  security: {
    jwt_secret: process.env.JWT_SECRET,
    encryption_key: process.env.ENCRYPTION_KEY,
    allowed_origins: process.env.ALLOWED_ORIGINS?.split(",") || ["localhost"],
    rate_limiting: true,
  },
}
