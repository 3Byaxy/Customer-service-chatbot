export interface LanguageDetection {
  primaryLanguage: string
  confidence: number
  localTerms: string[]
  mixedLanguage: boolean
  supportedLanguages: string[]
}

class LanguageDetector {
  private localTerms = {
    luganda: [
      "sente",
      "ssente",
      "bundles",
      "data",
      "airtime",
      "simu",
      "essimu",
      "okukola",
      "nkwagala",
      "webale",
      "gyendi",
      "kiki",
      "otya",
      "wano",
      "leero",
      "enkya",
      "jjuuzi",
      "wiiki",
      "omwezi",
      "omwaka",
      "abantu",
      "omuntu",
      "mukwano",
      "nnyabo",
      "ssebo",
      "maama",
      "taata",
      "mwana",
    ],
    swahili: [
      "pesa",
      "fedha",
      "data",
      "simu",
      "mtandao",
      "huduma",
      "msaada",
      "nataka",
      "ninahitaji",
      "asante",
      "karibu",
      "nini",
      "vipi",
      "hapa",
      "leo",
      "kesho",
      "jana",
      "wiki",
      "mwezi",
      "mwaka",
      "watu",
      "mtu",
      "rafiki",
      "mama",
      "baba",
      "mtoto",
      "ndugu",
      "dada",
    ],
    english: [
      "money",
      "cash",
      "bundle",
      "data",
      "airtime",
      "phone",
      "mobile",
      "service",
      "help",
      "support",
      "want",
      "need",
      "thank",
      "please",
      "today",
      "tomorrow",
      "yesterday",
      "week",
      "month",
      "year",
    ],
  }

  private commonPhrases = {
    luganda: [
      "oli otya",
      "webale nyo",
      "simanyi",
      "nkwagala",
      "gyendi",
      "kiki ekikulu",
      "nsobola",
      "sisobola",
      "ndi bulungi",
    ],
    swahili: [
      "habari yako",
      "asante sana",
      "sijui",
      "nataka",
      "ninahitaji",
      "nini kikuu",
      "ninaweza",
      "siwezi",
      "nzuri sana",
    ],
    english: [
      "how are you",
      "thank you",
      "i dont know",
      "i want",
      "i need",
      "what is",
      "i can",
      "i cannot",
      "very good",
    ],
  }

  detectLanguage(text: string): LanguageDetection {
    const normalizedText = text.toLowerCase().trim()
    const words = normalizedText.split(/\s+/)

    const scores = {
      luganda: 0,
      swahili: 0,
      english: 0,
    }

    const foundTerms: string[] = []
    let totalMatches = 0

    // Check for local terms
    Object.entries(this.localTerms).forEach(([lang, terms]) => {
      terms.forEach((term) => {
        if (normalizedText.includes(term.toLowerCase())) {
          scores[lang as keyof typeof scores] += 2
          foundTerms.push(term)
          totalMatches++
        }
      })
    })

    // Check for common phrases
    Object.entries(this.commonPhrases).forEach(([lang, phrases]) => {
      phrases.forEach((phrase) => {
        if (normalizedText.includes(phrase.toLowerCase())) {
          scores[lang as keyof typeof scores] += 3
          foundTerms.push(phrase)
          totalMatches++
        }
      })
    })

    // Language-specific patterns
    if (/\b(nk|gy|kk|bb|gg)\w+/.test(normalizedText)) {
      scores.luganda += 1
    }

    if (/\b(wa|na|ku|ni|si)\w+/.test(normalizedText)) {
      scores.swahili += 1
    }

    if (/\b(the|and|or|but|with|for)\b/.test(normalizedText)) {
      scores.english += 1
    }

    // Determine primary language
    const maxScore = Math.max(...Object.values(scores))
    const primaryLanguage = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || "english"

    // Calculate confidence
    const confidence = totalMatches > 0 ? Math.min(maxScore / Math.max(words.length * 0.3, 1), 1) : 0.5

    // Check for mixed language
    const languagesWithScore = Object.values(scores).filter((score) => score > 0).length
    const mixedLanguage = languagesWithScore > 1

    return {
      primaryLanguage,
      confidence: Math.round(confidence * 100) / 100,
      localTerms: foundTerms,
      mixedLanguage,
      supportedLanguages: ["english", "luganda", "swahili"],
    }
  }

  getLanguageName(code: string): string {
    const names = {
      en: "English",
      english: "English",
      lg: "Luganda",
      luganda: "Luganda",
      sw: "Swahili",
      swahili: "Swahili",
    }
    return names[code as keyof typeof names] || "Unknown"
  }

  getLanguageFlag(code: string): string {
    const flags = {
      en: "🇺🇸",
      english: "🇺🇸",
      lg: "🇺🇬",
      luganda: "🇺🇬",
      sw: "🇰🇪",
      swahili: "🇰🇪",
    }
    return flags[code as keyof typeof flags] || "🌐"
  }
}

export const languageDetector = new LanguageDetector()
