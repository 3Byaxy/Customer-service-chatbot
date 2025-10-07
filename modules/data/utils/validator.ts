/**
 * Environment Configuration Validator
 * Validates all environment variables and API keys
 */

import { defaultConfig } from "./config"
import { apiRouter } from "./api-router"

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  recommendations: string[]
}

export class EnvironmentValidator {
  /**
   * Validate all environment configuration
   */
  async validateEnvironment(): Promise<ValidationResult> {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      recommendations: [],
    }

    // Validate API Keys
    await this.validateAPIKeys(result)

    // Validate Application Settings
    this.validateAppSettings(result)

    // Validate Security Settings
    this.validateSecuritySettings(result)

    // Validate Business Configuration
    this.validateBusinessConfig(result)

    result.valid = result.errors.length === 0

    return result
  }

  private async validateAPIKeys(result: ValidationResult) {
    // Google Gemini (Primary)
    if (!defaultConfig.google.gemini.key || defaultConfig.google.gemini.key === "") {
      result.errors.push("Google Gemini API key is missing")
      result.recommendations.push("Get free API key from https://makersuite.google.com/app/apikey")
    } else {
      try {
        const isValid = await this.testGoogleAPI(defaultConfig.google.gemini.key)
        if (!isValid) {
          result.errors.push("Google Gemini API key is invalid or API is not enabled")
          result.recommendations.push("Check API key and enable Generative AI API in Google Cloud Console")
        }
      } catch (error) {
        result.warnings.push("Could not validate Google Gemini API key - network issue or rate limit")
      }
    }

    // Groq (Secondary)
    if (!defaultConfig.groq.api.key) {
      result.warnings.push("Groq API key not configured - missing fast fallback option")
      result.recommendations.push("Get free API key from https://console.groq.com/keys for faster responses")
    }

    // OpenAI (Tertiary)
    if (!defaultConfig.openai.api.key) {
      result.warnings.push("OpenAI API key not configured - missing premium AI option")
      result.recommendations.push("Get API key from https://platform.openai.com/api-keys for advanced capabilities")
    }

    // Anthropic (Quaternary)
    if (!defaultConfig.anthropic.api.key) {
      result.warnings.push("Anthropic API key not configured - missing safety-focused AI option")
      result.recommendations.push("Get API key from https://console.anthropic.com/ for sensitive topics")
    }

    // Check if at least one AI provider is available
    const availableProviders = [
      defaultConfig.google.gemini.enabled,
      defaultConfig.groq.api.enabled,
      defaultConfig.openai.api.enabled,
      defaultConfig.anthropic.api.enabled,
    ].filter(Boolean).length

    if (availableProviders === 0) {
      result.errors.push("No AI providers configured - chatbot will not work")
    } else if (availableProviders === 1) {
      result.warnings.push("Only one AI provider configured - no fallback available")
      result.recommendations.push("Configure at least 2 AI providers for reliability")
    }
  }

  private validateAppSettings(result: ValidationResult) {
    if (!defaultConfig.app.environment) {
      result.warnings.push("NODE_ENV not set - defaulting to development")
    }

    if (defaultConfig.app.environment === "production" && defaultConfig.app.debug) {
      result.warnings.push("Debug mode enabled in production - consider disabling")
    }

    if (defaultConfig.app.max_requests_per_minute > 1000) {
      result.warnings.push("Very high rate limit set - may cause API quota issues")
    }
  }

  private validateSecuritySettings(result: ValidationResult) {
    if (!defaultConfig.security.jwt_secret) {
      result.warnings.push("JWT secret not configured - authentication may not work")
    } else if (defaultConfig.security.jwt_secret.length < 32) {
      result.warnings.push("JWT secret is too short - use at least 32 characters")
    }

    if (!defaultConfig.security.encryption_key) {
      result.warnings.push("Encryption key not configured - sensitive data not encrypted")
    }

    if (defaultConfig.app.environment === "production") {
      if (
        defaultConfig.security.jwt_secret?.includes("dev") ||
        defaultConfig.security.jwt_secret?.includes("default")
      ) {
        result.errors.push("Using development JWT secret in production")
      }

      if (
        defaultConfig.security.encryption_key?.includes("dev") ||
        defaultConfig.security.encryption_key?.includes("default")
      ) {
        result.errors.push("Using development encryption key in production")
      }
    }
  }

  private validateBusinessConfig(result: ValidationResult) {
    const supportedLangs = ["en", "lg", "sw"]

    if (!supportedLangs.includes(defaultConfig.business.default_language)) {
      result.errors.push(`Invalid default language: ${defaultConfig.business.default_language}`)
    }

    const invalidLangs = defaultConfig.business.supported_languages.filter((lang) => !supportedLangs.includes(lang))

    if (invalidLangs.length > 0) {
      result.errors.push(`Invalid supported languages: ${invalidLangs.join(", ")}`)
    }

    if (defaultConfig.business.escalation_threshold < 0 || defaultConfig.business.escalation_threshold > 1) {
      result.errors.push("Escalation threshold must be between 0 and 1")
    }

    if (defaultConfig.business.context_retention_days < 1 || defaultConfig.business.context_retention_days > 365) {
      result.warnings.push("Context retention days should be between 1 and 365")
    }
  }

  private async testGoogleAPI(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "test" }] }],
          }),
        },
      )
      return response.status !== 401 && response.status !== 403
    } catch {
      return false
    }
  }

  /**
   * Get environment status summary
   */
  getEnvironmentStatus() {
    const stats = apiRouter.getStats()

    return {
      environment: defaultConfig.app.environment,
      debug: defaultConfig.app.debug,
      providers: {
        google: {
          enabled: defaultConfig.google.gemini.enabled,
          key_configured: !!defaultConfig.google.gemini.key,
          key_preview: defaultConfig.google.gemini.key
            ? defaultConfig.google.gemini.key.substring(0, 8) + "..."
            : "Not configured",
        },
        groq: {
          enabled: defaultConfig.groq.api.enabled,
          key_configured: !!defaultConfig.groq.api.key,
        },
        openai: {
          enabled: defaultConfig.openai.api.enabled,
          key_configured: !!defaultConfig.openai.api.key,
        },
        anthropic: {
          enabled: defaultConfig.anthropic.api.enabled,
          key_configured: !!defaultConfig.anthropic.api.key,
        },
      },
      routing: stats,
      security: {
        jwt_configured: !!defaultConfig.security.jwt_secret,
        encryption_configured: !!defaultConfig.security.encryption_key,
        rate_limiting: defaultConfig.security.rate_limiting,
      },
      business: defaultConfig.business,
    }
  }
}

export const environmentValidator = new EnvironmentValidator()
