export interface VoiceCommand {
  id: string
  keywords: string[]
  action: string
  description: string
  category: 'control' | 'communication' | 'support'
}

export interface CommandMatch {
  command: VoiceCommand
  confidence: number
  matchedText: string
}

export class VoiceCommandParser {
  private commands: VoiceCommand[] = [
    // Control commands
    {
      id: 'help',
      keywords: ['help', 'assist', 'support', 'aid', 'guide'],
      action: 'show_help',
      description: 'Get help and available commands',
      category: 'control'
    },
    {
      id: 'end_call',
      keywords: ['end call', 'hang up', 'disconnect', 'bye', 'goodbye'],
      action: 'end_call',
      description: 'End the current voice call',
      category: 'control'
    },
    {
      id: 'stop_listening',
      keywords: ['stop listening', 'pause', 'quiet', 'shh', 'be quiet'],
      action: 'stop_listening',
      description: 'Stop voice recognition',
      category: 'control'
    },
    {
      id: 'start_listening',
      keywords: ['start listening', 'listen', 'speak', 'talk'],
      action: 'start_listening',
      description: 'Start voice recognition',
      category: 'control'
    },

    // Communication commands
    {
      id: 'repeat',
      keywords: ['repeat', 'say again', 'what did you say', 'again'],
      action: 'repeat_last',
      description: 'Repeat the last response',
      category: 'communication'
    },
    {
      id: 'louder',
      keywords: ['louder', 'volume up', 'increase volume', 'speak up'],
      action: 'increase_volume',
      description: 'Increase audio volume',
      category: 'communication'
    },
    {
      id: 'quieter',
      keywords: ['quieter', 'volume down', 'decrease volume', 'speak down'],
      action: 'decrease_volume',
      description: 'Decrease audio volume',
      category: 'communication'
    },

    // Support commands
    {
      id: 'transfer_human',
      keywords: ['transfer to human', 'speak to agent', 'human agent', 'real person'],
      action: 'transfer_to_human',
      description: 'Transfer to a human agent',
      category: 'support'
    },
    {
      id: 'escalate',
      keywords: ['escalate', 'urgent', 'emergency', 'important'],
      action: 'escalate_issue',
      description: 'Escalate the current issue',
      category: 'support'
    },
    {
      id: 'status',
      keywords: ['status', 'how are you', 'what\'s up', 'check status'],
      action: 'check_status',
      description: 'Check system status',
      category: 'support'
    }
  ]

  // Parse transcript and find matching commands
  parseCommand(transcript: string): CommandMatch | null {
    const lowerTranscript = transcript.toLowerCase().trim()

    let bestMatch: CommandMatch | null = null
    let highestConfidence = 0

    for (const command of this.commands) {
      for (const keyword of command.keywords) {
        const keywordLower = keyword.toLowerCase()

        // Exact match
        if (lowerTranscript.includes(keywordLower)) {
          const confidence = this.calculateConfidence(lowerTranscript, keywordLower)
          if (confidence > highestConfidence) {
            highestConfidence = confidence
            bestMatch = {
              command,
              confidence,
              matchedText: keyword
            }
          }
        }

        // Fuzzy match for partial words
        if (this.isPartialMatch(lowerTranscript, keywordLower)) {
          const confidence = 0.7 // Lower confidence for partial matches
          if (confidence > highestConfidence) {
            highestConfidence = confidence
            bestMatch = {
              command,
              confidence,
              matchedText: keyword
            }
          }
        }
      }
    }

    // Only return if confidence is above threshold
    return bestMatch && bestMatch.confidence > 0.6 ? bestMatch : null
  }

  // Get all available commands
  getAllCommands(): VoiceCommand[] {
    return this.commands
  }

  // Get commands by category
  getCommandsByCategory(category: VoiceCommand['category']): VoiceCommand[] {
    return this.commands.filter(cmd => cmd.category === category)
  }

  // Calculate confidence score for a match
  private calculateConfidence(transcript: string, keyword: string): number {
    const transcriptWords = transcript.split(' ')
    const keywordWords = keyword.split(' ')

    let matchCount = 0
    for (const kwWord of keywordWords) {
      if (transcriptWords.some(tWord => this.wordsSimilar(tWord, kwWord))) {
        matchCount++
      }
    }

    return keywordWords.length > 0 ? matchCount / keywordWords.length : 0
  }

  // Check if words are similar (simple fuzzy match)
  private wordsSimilar(word1: string, word2: string): boolean {
    if (word1 === word2) return true

    // Check if one word contains the other
    if (word1.includes(word2) || word2.includes(word1)) return true

    // Simple edit distance for short words
    if (Math.abs(word1.length - word2.length) <= 1) {
      let differences = 0
      const maxLen = Math.max(word1.length, word2.length)
      for (let i = 0; i < maxLen; i++) {
        if (word1[i] !== word2[i]) differences++
        if (differences > 1) break
      }
      return differences <= 1
    }

    return false
  }

  // Check for partial matches
  private isPartialMatch(transcript: string, keyword: string): boolean {
    const words = transcript.split(' ')
    return words.some(word => word.length > 2 && keyword.includes(word))
  }
}

// Global instance
export const voiceCommandParser = new VoiceCommandParser()