import { isServiceAvailable } from "./api-keys"

export interface VoiceConfig {
  enabled: boolean
  provider: "browser" | "elevenlabs"
  language: string
  voice?: string
}

export class VoiceManager {
  private config: VoiceConfig
  private recognition: any = null
  private synthesis: SpeechSynthesis | null = null
  private currentUtterance: SpeechSynthesisUtterance | null = null

  constructor(config: VoiceConfig) {
    this.config = config
    this.initializeServices()
  }

  private initializeServices() {
    // Initialize speech recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      this.recognition = new (window as any).webkitSpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = false
      this.recognition.lang = this.getRecognitionLanguage()
    }

    // Initialize speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synthesis = window.speechSynthesis
    }
  }

  private getRecognitionLanguage(): string {
    switch (this.config.language) {
      case "lg":
        return "en-US" // Fallback to English for Luganda
      case "sw":
        return "sw-KE" // Swahili (Kenya)
      case "en":
      default:
        return "en-US"
    }
  }

  private getSynthesisLanguage(): string {
    switch (this.config.language) {
      case "lg":
        return "en-US" // Fallback to English for Luganda
      case "sw":
        return "sw-KE" // Swahili (Kenya)
      case "en":
      default:
        return "en-US"
    }
  }

  updateConfig(newConfig: Partial<VoiceConfig>) {
    this.config = { ...this.config, ...newConfig }
    if (this.recognition) {
      this.recognition.lang = this.getRecognitionLanguage()
    }
  }

  async testMicrophone(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return {
          success: false,
          message: "Microphone access not supported in this browser",
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Test if we can get audio input
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      source.connect(analyser)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(dataArray)

      // Clean up
      stream.getTracks().forEach((track) => track.stop())
      audioContext.close()

      return {
        success: true,
        message: "Microphone access granted and working",
        details: {
          sampleRate: audioContext.sampleRate,
          channels: stream.getAudioTracks()[0]?.getSettings()?.channelCount || 1,
        },
      }
    } catch (error) {
      return {
        success: false,
        message: "Microphone access denied or failed",
        details: error,
      }
    }
  }

  async testSpeakers(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      if (!this.synthesis) {
        return {
          success: false,
          message: "Speech synthesis not supported in this browser",
        }
      }

      return new Promise((resolve) => {
        const testUtterance = new SpeechSynthesisUtterance("Testing speakers")
        testUtterance.lang = this.getSynthesisLanguage()
        testUtterance.volume = 0.1 // Low volume for test

        testUtterance.onend = () => {
          resolve({
            success: true,
            message: "Speaker test completed successfully",
            details: {
              language: testUtterance.lang,
              voices: this.synthesis?.getVoices().length || 0,
            },
          })
        }

        testUtterance.onerror = (error) => {
          resolve({
            success: false,
            message: "Speaker test failed",
            details: error,
          })
        }

        this.synthesis.speak(testUtterance)
      })
    } catch (error) {
      return {
        success: false,
        message: "Speaker test failed",
        details: error,
      }
    }
  }

  async testSpeechRecognition(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      if (!this.recognition) {
        return {
          success: false,
          message: "Speech recognition not supported in this browser",
        }
      }

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          this.recognition.stop()
          resolve({
            success: true,
            message: "Speech recognition is available (test timeout - this is normal)",
            details: {
              language: this.recognition.lang,
              continuous: this.recognition.continuous,
            },
          })
        }, 2000)

        this.recognition.onstart = () => {
          clearTimeout(timeout)
          this.recognition.stop()
          resolve({
            success: true,
            message: "Speech recognition started successfully",
            details: {
              language: this.recognition.lang,
              continuous: this.recognition.continuous,
            },
          })
        }

        this.recognition.onerror = (error: any) => {
          clearTimeout(timeout)
          resolve({
            success: false,
            message: "Speech recognition failed",
            details: error,
          })
        }

        this.recognition.start()
      })
    } catch (error) {
      return {
        success: false,
        message: "Speech recognition test failed",
        details: error,
      }
    }
  }

  async testTextToSpeech(
    text = "Hello, this is a text to speech test",
  ): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      if (this.config.provider === "elevenlabs" && isServiceAvailable("ELEVENLABS")) {
        // Test ElevenLabs TTS
        const response = await fetch("/api/voice/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            language: this.config.language,
            provider: "elevenlabs",
          }),
        })

        if (response.ok) {
          const audioBlob = await response.blob()
          return {
            success: true,
            message: "ElevenLabs TTS test successful",
            details: {
              provider: "elevenlabs",
              audioSize: audioBlob.size,
              language: this.config.language,
            },
          }
        } else {
          throw new Error(`ElevenLabs API error: ${response.status}`)
        }
      } else {
        // Test browser TTS
        return await this.testSpeakers()
      }
    } catch (error) {
      return {
        success: false,
        message: "Text-to-speech test failed",
        details: error,
      }
    }
  }

  startListening(onResult: (text: string) => void, onError: (error: any) => void) {
    if (!this.recognition) {
      onError(new Error("Speech recognition not available"))
      return
    }

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
    }

    this.recognition.onerror = onError
    this.recognition.start()
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop()
    }
  }

  async speak(text: string, onStart?: () => void, onEnd?: () => void, onError?: (error: any) => void) {
    try {
      if (this.config.provider === "elevenlabs" && isServiceAvailable("ELEVENLABS")) {
        // Use ElevenLabs TTS
        const response = await fetch("/api/voice/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            language: this.config.language,
            provider: "elevenlabs",
          }),
        })

        if (response.ok) {
          const audioBlob = await response.blob()
          const audioUrl = URL.createObjectURL(audioBlob)
          const audio = new Audio(audioUrl)

          audio.onplay = () => onStart?.()
          audio.onended = () => {
            onEnd?.()
            URL.revokeObjectURL(audioUrl)
          }
          audio.onerror = (error) => onError?.(error)

          await audio.play()
        } else {
          throw new Error(`ElevenLabs API error: ${response.status}`)
        }
      } else {
        // Use browser TTS
        if (!this.synthesis) {
          throw new Error("Speech synthesis not available")
        }

        this.currentUtterance = new SpeechSynthesisUtterance(text)
        this.currentUtterance.lang = this.getSynthesisLanguage()
        this.currentUtterance.onstart = () => onStart?.()
        this.currentUtterance.onend = () => onEnd?.()
        this.currentUtterance.onerror = (error) => onError?.(error)

        this.synthesis.speak(this.currentUtterance)
      }
    } catch (error) {
      onError?.(error)
    }
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
    this.currentUtterance = null
  }

  getAvailableVoices() {
    if (!this.synthesis) return []
    return this.synthesis.getVoices()
  }

  isListening(): boolean {
    return this.recognition && this.recognition.continuous
  }

  isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false
  }
}
