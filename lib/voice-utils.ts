export class VoiceManager {
  private recognition: any = null
  private synthesis: SpeechSynthesis | null = null
  private isListening = false
  private isSpeaking = false

  constructor() {
    if (typeof window !== "undefined") {
      // Initialize Speech Recognition
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        this.recognition = new SpeechRecognition()
        this.setupRecognition()
      }

      // Initialize Speech Synthesis
      if ("speechSynthesis" in window) {
        this.synthesis = window.speechSynthesis
      }
    }
  }

  private setupRecognition() {
    if (!this.recognition) return

    this.recognition.continuous = false
    this.recognition.interimResults = false
    this.recognition.maxAlternatives = 1
  }

  async startListening(
    language = "en-US",
    onResult: (transcript: string) => void,
    onError: (error: string) => void,
    onStart: () => void,
    onEnd: () => void,
  ): Promise<void> {
    if (!this.recognition) {
      onError("Speech recognition not supported in this browser")
      return
    }

    if (this.isListening) {
      this.stopListening()
      return
    }

    // Set language
    const langMap: { [key: string]: string } = {
      en: "en-US",
      lg: "en-US", // Fallback to English for Luganda
      sw: "sw-KE", // Swahili (Kenya)
    }

    this.recognition.lang = langMap[language] || "en-US"

    this.recognition.onstart = () => {
      this.isListening = true
      onStart()
    }

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
    }

    this.recognition.onerror = (event: any) => {
      onError(`Speech recognition error: ${event.error}`)
    }

    this.recognition.onend = () => {
      this.isListening = false
      onEnd()
    }

    try {
      this.recognition.start()
    } catch (error) {
      onError("Failed to start speech recognition")
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
  }

  async speak(
    text: string,
    language = "en",
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    if (!this.synthesis) {
      onError?.("Speech synthesis not supported in this browser")
      return
    }

    // Stop any current speech
    this.synthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // Set voice based on language
    const voices = this.synthesis.getVoices()
    const voice = voices.find((v) => v.lang.startsWith(language)) || voices[0]
    if (voice) {
      utterance.voice = voice
    }

    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => {
      this.isSpeaking = true
      onStart?.()
    }

    utterance.onend = () => {
      this.isSpeaking = false
      onEnd?.()
    }

    utterance.onerror = (event) => {
      this.isSpeaking = false
      onError?.(`Speech synthesis error: ${event.error}`)
    }

    this.synthesis.speak(utterance)
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
      this.isSpeaking = false
    }
  }

  getIsListening(): boolean {
    return this.isListening
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking
  }

  isSupported(): { recognition: boolean; synthesis: boolean } {
    return {
      recognition: !!this.recognition,
      synthesis: !!this.synthesis,
    }
  }
}

// Singleton instance
let voiceManager: VoiceManager | null = null

export const getVoiceManager = (): VoiceManager => {
  if (!voiceManager) {
    voiceManager = new VoiceManager()
  }
  return voiceManager
}
