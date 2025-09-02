/**
 * ElevenLabs and Vapi Integration
 * Text-to-Speech and Voice AI Capabilities
 */

export interface VoiceConfig {
  elevenLabs: {
    apiKey: string
    voiceId: string
    model: string
    stability: number
    similarityBoost: number
  }
  vapi: {
    apiKey: string
    assistantId: string
    phoneNumber?: string
  }
}

export interface VoiceResponse {
  audioUrl?: string
  audioBuffer?: Buffer
  duration?: number
  text: string
  voiceId: string
  success: boolean
  error?: string
}

export interface VapiCall {
  id: string
  status: "queued" | "ringing" | "in-progress" | "forwarding" | "ended"
  phoneNumber: string
  assistantId: string
  startedAt?: Date
  endedAt?: Date
  duration?: number
  transcript?: string
  summary?: string
}

export class VoiceIntegration {
  private config: VoiceConfig
  private activeCalls: Map<string, VapiCall> = new Map()

  constructor() {
    this.config = {
      elevenLabs: {
        apiKey: process.env.ELEVENLABS_API_KEY || "",
        voiceId: process.env.ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL", // Bella voice
        model: "eleven_multilingual_v2",
        stability: 0.5,
        similarityBoost: 0.8,
      },
      vapi: {
        apiKey: process.env.VAPI_API_KEY || "",
        assistantId: process.env.VAPI_ASSISTANT_ID || "",
        phoneNumber: process.env.VAPI_PHONE_NUMBER || "",
      },
    }
  }

  // ElevenLabs Text-to-Speech
  async generateSpeech(text: string, voiceId?: string, language = "en"): Promise<VoiceResponse> {
    if (!this.config.elevenLabs.apiKey) {
      return {
        text,
        voiceId: voiceId || this.config.elevenLabs.voiceId,
        success: false,
        error: "ElevenLabs API key not configured",
      }
    }

    try {
      // Optimize text for speech
      const optimizedText = this.optimizeTextForSpeech(text, language)

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || this.config.elevenLabs.voiceId}`,
        {
          method: "POST",
          headers: {
            Accept: "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": this.config.elevenLabs.apiKey,
          },
          body: JSON.stringify({
            text: optimizedText,
            model_id: this.config.elevenLabs.model,
            voice_settings: {
              stability: this.config.elevenLabs.stability,
              similarity_boost: this.config.elevenLabs.similarityBoost,
              style: 0.0,
              use_speaker_boost: true,
            },
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`)
      }

      const audioBuffer = Buffer.from(await response.arrayBuffer())

      // Create temporary audio URL (in production, save to cloud storage)
      const audioUrl = await this.saveAudioBuffer(audioBuffer)

      return {
        audioUrl,
        audioBuffer,
        duration: this.estimateAudioDuration(optimizedText),
        text: optimizedText,
        voiceId: voiceId || this.config.elevenLabs.voiceId,
        success: true,
      }
    } catch (error) {
      console.error("ElevenLabs TTS error:", error)
      return {
        text,
        voiceId: voiceId || this.config.elevenLabs.voiceId,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Generate speech for different business contexts
  async generateBusinessSpeech(text: string, businessType: string, language = "en"): Promise<VoiceResponse> {
    // Select appropriate voice based on business type
    const voiceMap = {
      banking: "EXAVITQu4vr4xnSDxMaL", // Professional female voice
      telecom: "ErXwobaYiN019PkySvjV", // Friendly male voice
      utilities: "VR6AewLTigWG4xSOukaG", // Calm female voice
      ecommerce: "pNInz6obpgDQGcFmaJgB", // Energetic female voice
    }

    const voiceId = voiceMap[businessType as keyof typeof voiceMap] || this.config.elevenLabs.voiceId

    // Add business-specific context to speech
    const contextualText = this.addBusinessContext(text, businessType, language)

    return this.generateSpeech(contextualText, voiceId, language)
  }

  // Vapi Voice AI Integration
  async createVapiCall(phoneNumber: string, assistantId?: string): Promise<VapiCall> {
    if (!this.config.vapi.apiKey) {
      throw new Error("Vapi API key not configured")
    }

    try {
      const response = await fetch("https://api.vapi.ai/call", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.vapi.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          assistantId: assistantId || this.config.vapi.assistantId,
          metadata: {
            source: "ai-customer-support",
            timestamp: new Date().toISOString(),
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Vapi API error: ${response.status}`)
      }

      const callData = await response.json()

      const vapiCall: VapiCall = {
        id: callData.id,
        status: callData.status,
        phoneNumber,
        assistantId: assistantId || this.config.vapi.assistantId,
        startedAt: new Date(),
      }

      this.activeCalls.set(callData.id, vapiCall)

      return vapiCall
    } catch (error) {
      console.error("Vapi call creation error:", error)
      throw error
    }
  }

  // Create custom Vapi assistant for business type
  async createBusinessAssistant(businessType: string, language = "en"): Promise<string> {
    if (!this.config.vapi.apiKey) {
      throw new Error("Vapi API key not configured")
    }

    const assistantConfig = this.getBusinessAssistantConfig(businessType, language)

    try {
      const response = await fetch("https://api.vapi.ai/assistant", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.vapi.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assistantConfig),
      })

      if (!response.ok) {
        throw new Error(`Vapi assistant creation error: ${response.status}`)
      }

      const assistant = await response.json()
      return assistant.id
    } catch (error) {
      console.error("Vapi assistant creation error:", error)
      throw error
    }
  }

  // Get call status and transcript
  async getCallStatus(callId: string): Promise<VapiCall | null> {
    if (!this.config.vapi.apiKey) {
      return null
    }

    try {
      const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
        headers: {
          Authorization: `Bearer ${this.config.vapi.apiKey}`,
        },
      })

      if (!response.ok) {
        return null
      }

      const callData = await response.json()

      const updatedCall: VapiCall = {
        id: callData.id,
        status: callData.status,
        phoneNumber: callData.phoneNumber,
        assistantId: callData.assistantId,
        startedAt: callData.startedAt ? new Date(callData.startedAt) : undefined,
        endedAt: callData.endedAt ? new Date(callData.endedAt) : undefined,
        duration: callData.duration,
        transcript: callData.transcript,
        summary: callData.summary,
      }

      this.activeCalls.set(callId, updatedCall)
      return updatedCall
    } catch (error) {
      console.error("Vapi call status error:", error)
      return null
    }
  }

  // Get available voices from ElevenLabs
  async getAvailableVoices(): Promise<any[]> {
    if (!this.config.elevenLabs.apiKey) {
      return []
    }

    try {
      const response = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: {
          "xi-api-key": this.config.elevenLabs.apiKey,
        },
      })

      if (!response.ok) {
        return []
      }

      const data = await response.json()
      return data.voices || []
    } catch (error) {
      console.error("ElevenLabs voices error:", error)
      return []
    }
  }

  // Private helper methods
  private optimizeTextForSpeech(text: string, language: string): string {
    let optimized = text

    // Remove markdown formatting
    optimized = optimized.replace(/\*\*(.*?)\*\*/g, "$1")
    optimized = optimized.replace(/\*(.*?)\*/g, "$1")
    optimized = optimized.replace(/`(.*?)`/g, "$1")

    // Replace numbers with words for better pronunciation
    optimized = optimized.replace(/\b(\d+)\b/g, (match, num) => {
      return this.numberToWords(Number.parseInt(num))
    })

    // Add pauses for better speech flow
    optimized = optimized.replace(/\n\n/g, ". ")
    optimized = optimized.replace(/\n/g, ", ")

    // Language-specific optimizations
    if (language === "lg") {
      // Luganda pronunciation helpers
      optimized = optimized.replace(/sente/g, "sen-te")
      optimized = optimized.replace(/simu/g, "si-mu")
    }

    return optimized
  }

  private addBusinessContext(text: string, businessType: string, language: string): string {
    const greetings = {
      banking: {
        en: "Thank you for calling our banking support. ",
        lg: "Webale okutukubira ku banking support yaffe. ",
      },
      telecom: {
        en: "Hello, this is your telecommunications support. ",
        lg: "Nkulamuse, ono gwe telecommunications support wo. ",
      },
      utilities: {
        en: "Thank you for contacting utility services. ",
        lg: "Webale okutukubira ku utility services. ",
      },
      ecommerce: {
        en: "Hi there! This is your shopping support assistant. ",
        lg: "Nkulamuse! Ono gwe shopping support assistant wo. ",
      },
    }

    const greeting =
      greetings[businessType as keyof typeof greetings]?.[language as keyof typeof greetings.banking] || ""
    return greeting + text
  }

  private getBusinessAssistantConfig(businessType: string, language: string) {
    const baseConfig = {
      name: `${businessType.charAt(0).toUpperCase() + businessType.slice(1)} Support Assistant`,
      voice: {
        provider: "elevenlabs",
        voiceId: this.config.elevenLabs.voiceId,
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        temperature: 0.7,
      },
      firstMessage: `Hello! I'm your ${businessType} support assistant. How can I help you today?`,
      systemMessage: `You are a helpful customer support assistant for a ${businessType} company in Uganda. 
      You can communicate in English, Luganda, and Swahili. 
      Be professional, empathetic, and solution-focused.
      Always try to resolve issues quickly and escalate when necessary.`,
      functions: [
        {
          name: "escalate_to_human",
          description: "Escalate the call to a human agent",
          parameters: {
            type: "object",
            properties: {
              reason: { type: "string" },
              priority: { type: "string", enum: ["low", "medium", "high", "critical"] },
            },
          },
        },
        {
          name: "create_ticket",
          description: "Create a support ticket",
          parameters: {
            type: "object",
            properties: {
              issue: { type: "string" },
              category: { type: "string" },
              priority: { type: "string" },
            },
          },
        },
      ],
    }

    // Business-specific customizations
    if (businessType === "banking") {
      baseConfig.systemMessage += " Always prioritize security and verify customer identity for sensitive requests."
    } else if (businessType === "utilities") {
      baseConfig.systemMessage +=
        " For outages and emergencies, escalate immediately and provide estimated resolution times."
    }

    return baseConfig
  }

  private async saveAudioBuffer(buffer: Buffer): Promise<string> {
    // In production, save to cloud storage (AWS S3, Google Cloud, etc.)
    // For now, return a placeholder URL
    const filename = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp3`

    // This would be implemented with your preferred cloud storage
    // For local development, you might save to public/audio/ folder

    return `/api/audio/${filename}`
  }

  private estimateAudioDuration(text: string): number {
    // Rough estimate: 150 words per minute, average 5 characters per word
    const wordsPerMinute = 150
    const charactersPerWord = 5
    const estimatedWords = text.length / charactersPerWord
    const durationMinutes = estimatedWords / wordsPerMinute
    return Math.ceil(durationMinutes * 60) // Return seconds
  }

  private numberToWords(num: number): string {
    // Simple number to words conversion (extend as needed)
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
    const teens = [
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ]
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

    if (num < 10) return ones[num]
    if (num < 20) return teens[num - 10]
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "")
    if (num < 1000)
      return ones[Math.floor(num / 100)] + " hundred" + (num % 100 ? " " + this.numberToWords(num % 100) : "")

    return num.toString() // Fallback for larger numbers
  }
}

// Global voice integration instance
export const voiceIntegration = new VoiceIntegration()
