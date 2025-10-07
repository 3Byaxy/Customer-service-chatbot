// Language detection service
export interface LanguageDetectionResult {
  primaryLanguage: string
  confidence: number
  agentResponse?: {
    agentUsed: string
    response: string
  }
}

class LanguageDetector {
  async detectAndRoute(message: string): Promise<LanguageDetectionResult> {
    const lowerMessage = message.toLowerCase()
    
    // Simple language detection based on keywords
    const lugandaKeywords = ['sente', 'simu', 'netiweki', 'masanyu', 'amazzi', 'okusasula', 'akaunt']
    const swahiliKeywords = ['pesa', 'simu', 'mtandao', 'umeme', 'maji', 'malipo', 'akaunti']
    
    let detectedLanguage = 'en'
    let confidence = 0.8
    
    const lugandaMatches = lugandaKeywords.filter(keyword => lowerMessage.includes(keyword)).length
    const swahiliMatches = swahiliKeywords.filter(keyword => lowerMessage.includes(keyword)).length
    
    if (lugandaMatches > 0) {
      detectedLanguage = 'lg'
      confidence = Math.min(0.95, 0.6 + (lugandaMatches * 0.1))
    } else if (swahiliMatches > 0) {
      detectedLanguage = 'sw'
      confidence = Math.min(0.95, 0.6 + (swahiliMatches * 0.1))
    }
    
    return {
      primaryLanguage: detectedLanguage,
      confidence,
      agentResponse: {
        agentUsed: 'simple-keyword-detector',
        response: `Detected language: ${detectedLanguage} with ${Math.round(confidence * 100)}% confidence`
      }
    }
  }
}

export const languageDetector = new LanguageDetector()