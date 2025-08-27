/**
 * Secrets Management
 * Handles encryption and secure storage of sensitive data
 *
 * IMPORTANT: This file should never contain actual secrets in production
 * Use environment variables or secure secret management services
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

      const cipher = crypto.createCipher(algorithm, key)
      let encrypted = cipher.update(text, "utf8", "hex")
      encrypted += cipher.final("hex")

      return iv.toString("hex") + ":" + encrypted
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
      const [ivHex, encrypted] = encryptedText.split(":")
      const iv = Buffer.from(ivHex, "hex")
      const key = crypto.scryptSync(this.encryptionKey, "salt", 32)

      const decipher = crypto.createDecipher(algorithm, key)
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
