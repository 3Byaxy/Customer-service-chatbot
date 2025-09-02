/**
 * Advanced Language Detection System
 * Supports English, Luganda, Swahili with local terms and mixed language detection
 */

export interface LanguageDetectionResult {
  primaryLanguage: "en" | "lg" | "sw" | "mixed"
  confidence: number
  detectedLanguages: Array<{
    language: "en" | "lg" | "sw"
    confidence: number
    words: string[]
  }>
  localTerms: Array<{
    term: string
    meaning: string
    language: "lg" | "sw"
  }>
  suggestedResponse: "en" | "lg" | "sw"
}

export class LanguageDetector {
  private lugandaKeywords = {
    // Common Luganda words and phrases
    greetings: ["oli otya", "webale", "nkulamuse", "siibo", "kale", "bambi"],
    questions: ["ki", "wa", "lwaki", "ddi", "ani", "nga bw'otya"],
    responses: ["nedda", "ye", "simanyi", "kituufu", "nkwagala"],
    business: ["sente", "simu", "bundles", "netiweki", "bili", "akaunt"],
    actions: ["nkwagala", "njagala", "ndi", "nja", "nkola", "ntegeeza"],
    common: ["ku", "mu", "ne", "era", "naye", "oba", "nga", "bw'o", "gw'o"],
  }

  private swahiliKeywords = {
    // Common Swahili words and phrases
    greetings: ["hujambo", "habari", "mambo", "poa", "sawa", "asante"],
    questions: ["nini", "wapi", "lini", "kwa nini", "vipi", "namna gani"],
    responses: ["ndiyo", "hapana", "sijui", "kweli", "nakupenda"],
    business: ["pesa", "simu", "data", "mtandao", "bili", "akaunti"],
    actions: ["nataka", "nina", "nita", "nina", "nafanya", "naelewa"],
    common: ["na", "ya", "wa", "za", "kwa", "au", "lakini", "pia"],
  }

  private localTermsDatabase = {
    // Luganda terms
    sente: { meaning: "money", language: "lg" as const },
    simu: { meaning: "phone", language: "lg" as const },
    bundles: { meaning: "data packages", language: "lg" as const },
    netiweki: { meaning: "network", language: "lg" as const },
    bili: { meaning: "bill", language: "lg" as const },
    akaunt: { meaning: "account", language: "lg" as const },
    masanyu: { meaning: "electricity", language: "lg" as const },
    amazzi: { meaning: "water", language: "lg" as const },
    boda: { meaning: "motorcycle taxi", language: "lg" as const },
    akawuka: { meaning: "small money", language: "lg" as const },
    looni: { meaning: "loan", language: "lg" as const },
    mita: { meaning: "meter", language: "lg" as const },
    oda: { meaning: "order", language: "lg" as const },
    okusasula: { meaning: "payment", language: "lg" as const },

    // Swahili terms
    pesa: { meaning: "money", language: "sw" as const },
    mtandao: { meaning: "network", language: "sw" as const },
    akaunti: { meaning: "account", language: "sw" as const },
    mkopo: { meaning: "loan", language: "sw" as const },
    maji: { meaning: "water", language: "sw" as const },
    umeme: { meaning: "electricity", language: "sw" as const },
    malipo: { meaning: "payment", language: "sw" as const },
    oda: { meaning: "order", language: "sw" as const },
    pikipiki: { meaning: "motorcycle", language: "sw" as const },
  }

  detectLanguage(text: string): LanguageDetectionResult {
    const normalizedText = text.toLowerCase().trim()
    const words = normalizedText.split(/\s+/)

    // Initialize detection results
    const detectedLanguages: Array<{
      language: "en" | "lg" | "sw"
      confidence: number
      words: string[]
    }> = []

    // Detect local terms
    const localTerms: Array<{
      term: string
      meaning: string
      language: "lg" | "sw"
    }> = []

    words.forEach((word) => {
      if (this.localTermsDatabase[word]) {
        const termInfo = this.localTermsDatabase[word]
        localTerms.push({
          term: word,
          meaning: termInfo.meaning,
          language: termInfo.language,
        })
      }
    })

    // Detect Luganda
    const lugandaMatches = this.countLanguageMatches(words, this.lugandaKeywords)
    if (lugandaMatches.count > 0) {
      detectedLanguages.push({
        language: "lg",
        confidence: Math.min((lugandaMatches.count / words.length) * 2, 1),
        words: lugandaMatches.matches,
      })
    }

    // Detect Swahili
    const swahiliMatches = this.countLanguageMatches(words, this.swahiliKeywords)
    if (swahiliMatches.count > 0) {
      detectedLanguages.push({
        language: "sw",
        confidence: Math.min((swahiliMatches.count / words.length) * 2, 1),
        words: swahiliMatches.matches,
      })
    }

    // Detect English (by elimination and common English patterns)
    const englishConfidence = this.detectEnglish(normalizedText, words)
    if (englishConfidence > 0.3) {
      detectedLanguages.push({
        language: "en",
        confidence: englishConfidence,
        words: words.filter((word) => this.isEnglishWord(word)),
      })
    }

    // Determine primary language
    let primaryLanguage: "en" | "lg" | "sw" | "mixed" = "en"
    let maxConfidence = 0

    if (detectedLanguages.length === 0) {
      // Default to English if no specific language detected
      primaryLanguage = "en"
      maxConfidence = 0.5
    } else if (detectedLanguages.length === 1) {
      primaryLanguage = detectedLanguages[0].language
      maxConfidence = detectedLanguages[0].confidence
    } else {
      // Multiple languages detected
      const sortedLanguages = detectedLanguages.sort((a, b) => b.confidence - a.confidence)

      if (sortedLanguages[0].confidence - sortedLanguages[1].confidence > 0.3) {
        primaryLanguage = sortedLanguages[0].language
        maxConfidence = sortedLanguages[0].confidence
      } else {
        primaryLanguage = "mixed"
        maxConfidence = sortedLanguages[0].confidence
      }
    }

    // Boost confidence if local terms are found
    if (localTerms.length > 0) {
      maxConfidence = Math.min(maxConfidence + localTerms.length * 0.2, 1)

      // If local terms are predominantly from one language, suggest that
      const lgTerms = localTerms.filter((t) => t.language === "lg").length
      const swTerms = localTerms.filter((t) => t.language === "sw").length

      if (lgTerms > swTerms && lgTerms > 0) {
        primaryLanguage = "lg"
      } else if (swTerms > lgTerms && swTerms > 0) {
        primaryLanguage = "sw"
      }
    }

    // Determine suggested response language
    const suggestedResponse: "en" | "lg" | "sw" = primaryLanguage === "mixed" ? "en" : primaryLanguage

    return {
      primaryLanguage,
      confidence: maxConfidence,
      detectedLanguages,
      localTerms,
      suggestedResponse,
    }
  }

  private countLanguageMatches(words: string[], keywords: Record<string, string[]>) {
    let count = 0
    const matches: string[] = []

    Object.values(keywords).forEach((keywordList) => {
      keywordList.forEach((keyword) => {
        if (words.some((word) => word.includes(keyword) || keyword.includes(word))) {
          count++
          matches.push(keyword)
        }
      })
    })

    return { count, matches }
  }

  private detectEnglish(text: string, words: string[]): number {
    // Common English patterns and words
    const englishPatterns = [
      /\b(the|and|or|but|in|on|at|to|for|of|with|by)\b/g,
      /\b(is|are|was|were|have|has|had|do|does|did|will|would|can|could)\b/g,
      /\b(hello|hi|help|please|thank|thanks|sorry|yes|no|ok|okay)\b/g,
      /\b(what|where|when|why|how|who|which)\b/g,
    ]

    let englishScore = 0
    englishPatterns.forEach((pattern) => {
      const matches = text.match(pattern)
      if (matches) {
        englishScore += matches.length
      }
    })

    // Check for English sentence structure
    if (text.includes("?") || text.includes(".") || text.includes("!")) {
      englishScore += 0.5
    }

    return Math.min(englishScore / words.length, 1)
  }

  private isEnglishWord(word: string): boolean {
    // Simple English word detection
    const commonEnglishWords = [
      "the",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "is",
      "are",
      "was",
      "were",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "can",
      "could",
      "should",
      "may",
      "might",
      "must",
      "hello",
      "hi",
      "help",
      "please",
      "thank",
      "thanks",
      "sorry",
      "yes",
      "no",
      "what",
      "where",
      "when",
      "why",
      "how",
      "who",
      "which",
      "data",
      "network",
      "account",
      "money",
      "phone",
      "bill",
      "payment",
      "service",
      "problem",
      "issue",
    ]

    return commonEnglishWords.includes(word.toLowerCase())
  }

  // Get appropriate greeting based on detected language
  getGreeting(language: "en" | "lg" | "sw"): string {
    switch (language) {
      case "lg":
        return "Nkulamuse! Nkuyinza okukuyamba otya?"
      case "sw":
        return "Hujambo! Naweza kukusaidia vipi?"
      default:
        return "Hello! How can I help you today?"
    }
  }

  // Get appropriate response phrases
  getResponsePhrases(language: "en" | "lg" | "sw") {
    switch (language) {
      case "lg":
        return {
          understanding: "Ntegeeza",
          helping: "Ka nkuyambe",
          wait: "Lindawo katono",
          thanks: "Webale",
          sorry: "Nsonyiwa",
        }
      case "sw":
        return {
          understanding: "Naelewa",
          helping: "Hebu nikusaidie",
          wait: "Subiri kidogo",
          thanks: "Asante",
          sorry: "Pole",
        }
      default:
        return {
          understanding: "I understand",
          helping: "Let me help you",
          wait: "Please wait a moment",
          thanks: "Thank you",
          sorry: "I apologize",
        }
    }
  }
}

export const languageDetector = new LanguageDetector()
