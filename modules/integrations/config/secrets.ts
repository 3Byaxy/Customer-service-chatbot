/**
 * Secrets Management & Environment Configuration
 * Handles encryption and secure storage of sensitive data
 *
 * IMPORTANT: This file should never contain actual secrets in production
 * Use environment variables or secure secret management services
 *
 * Environment Variables Required:
 * ===============================
 *
 * AI PROVIDERS:
 * - GOOGLE_GENERATIVE_AI_API_KEY (Gemini) - Free tier available
 * - ANTHROPIC_API_KEY (Claude) - Paid service
 * - OPENAI_API_KEY (GPT models) - Paid service
 * - GROQ_API_KEY (Fast inference) - Free tier available
 *
 * AI AGENTS:
 * - ELEVENLABS_API_KEY (Text-to-Speech) - Free tier available
 * - VAPI_API_KEY (Voice Agents) - Paid service
 * - VOICEFLOW_API_KEY (Dialogue Flows) - Free tier available
 *
 * WORKFLOW AUTOMATION:
 * - N8N_WEBHOOK_URL (n8n instance URL)
 * - N8N_API_KEY (n8n authentication)
 *
 * DATABASE:
 * - DATABASE_URL (PostgreSQL/Neon)
 *
 * SYSTEM:
 * - ENCRYPTION_KEY (For data encryption)
 * - NEXTAUTH_SECRET (For authentication)
 * - NEXTAUTH_URL (For authentication)
 */

import crypto from "crypto"

export class SecretsManager {
  private encryptionKey: string

  constructor() {
    // In production, this should come from a secure key management service
    this.encryptionKey = process.env.ENCRYPTION_KEY || "default-dev-key-change-in-production"
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(text: string): string {
    try {
      const algorithm = "aes-256-gcm"
      const iv = crypto.randomBytes(16)
      const key = crypto.scryptSync(this.encryptionKey, "salt", 32)

      const cipher = crypto.createCipheriv(algorithm, key, iv)
      let encrypted = cipher.update(text, "utf8", "hex")
      encrypted += cipher.final("hex")
      const authTag = cipher.getAuthTag()

      return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted
    } catch (error) {
      console.error("Encryption failed:", error)
      return text // Fallback to plain text in development
    }
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedText: string): string {
    try {
      if (!encryptedText.includes(":")) {
        return encryptedText // Not encrypted
      }

      const algorithm = "aes-256-gcm"
      const [ivHex, authTagHex, encrypted] = encryptedText.split(":") 
      if (!authTagHex) {
        // Legacy format without auth tag - return as-is for compatibility
        return encryptedText
      }
      const iv = Buffer.from(ivHex, "hex")
      const key = crypto.scryptSync(this.encryptionKey, "salt", 32)

      const authTag = Buffer.from(authTagHex, "hex")
      const decipher = crypto.createDecipheriv(algorithm, key, iv)
      decipher.setAuthTag(authTag)
      let decrypted = decipher.update(encrypted, "hex", "utf8")
      decrypted += decipher.final("utf8")

      return decrypted
    } catch (error) {
      console.error("Decryption failed:", error)
      return encryptedText // Return as-is if decryption fails
    }
  }

  /**
   * Generate a secure random API key
   */
  generateAPIKey(length = 32): string {
    return crypto.randomBytes(length).toString("hex")
  }

  /**
   * Hash sensitive data for storage
   */
  hash(data: string): string {
    return crypto.createHash("sha256").update(data).digest("hex")
  }

  /**
   * Verify hashed data
   */
  verifyHash(data: string, hash: string): boolean {
    return this.hash(data) === hash
  }
}

export const secretsManager = new SecretsManager()
