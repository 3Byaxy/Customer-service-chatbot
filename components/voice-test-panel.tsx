"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Mic,
  MicOff,
  Volume2,
  TestTube,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  RefreshCw,
  Play,
  Square,
} from "lucide-react"
import { VoiceManager } from "@/lib/voice-integration"
import { n8nIntegration } from "@/lib/n8n-integration"

interface TestResult {
  success: boolean
  message: string
  details?: any
  timestamp: string
}

interface TestResults {
  microphone: TestResult | null
  speakers: TestResult | null
  speechRecognition: TestResult | null
  textToSpeech: TestResult | null
  n8nWebhook: TestResult | null
  fullFlow: TestResult | null
}

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "lg", name: "Luganda", flag: "🇺🇬" },
  { code: "sw", name: "Swahili", flag: "🇰🇪" },
]

const testTexts = {
  en: "Hello, this is a test of the voice system. Can you hear me clearly?",
  lg: "Oli otya, kino kigezeso kya sisitemu y'eddoboozi. Onsobola okumpulira bulungi?",
  sw: "Hujambo, hii ni jaribio la mfumo wa sauti. Je, unaweza kunisikia vizuri?",
}

export default function VoiceTestPanel() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [testResults, setTestResults] = useState<TestResults>({
    microphone: null,
    speakers: null,
    speechRecognition: null,
    textToSpeech: null,
    n8nWebhook: null,
    fullFlow: null,
  })
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [voiceManager, setVoiceManager] = useState<VoiceManager | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [recognizedText, setRecognizedText] = useState("")
  const [customTestText, setCustomTestText] = useState("")
  const [testLogs, setTestLogs] = useState<string[]>([])

  useEffect(() => {
    const vm = new VoiceManager({
      enabled: true,
      provider: "browser",
      language: selectedLanguage,
    })
    setVoiceManager(vm)
  }, [selectedLanguage])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setTestLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  const updateTestResult = (testName: keyof TestResults, result: TestResult) => {
    setTestResults((prev) => ({
      ...prev,
      [testName]: result,
    }))
  }

  const testMicrophone = async () => {
    addLog("Testing microphone access...")

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const result: TestResult = {
          success: false,
          message: "Microphone access not supported in this browser",
          timestamp: new Date().toISOString(),
        }
        updateTestResult("microphone", result)
        addLog("❌ Microphone test failed: Not supported")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Test audio levels
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      source.connect(analyser)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      // Check for audio input for 2 seconds
      let hasAudio = false
      const checkAudio = () => {
        analyser.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
        if (average > 10) hasAudio = true
      }

      const interval = setInterval(checkAudio, 100)

      setTimeout(() => {
        clearInterval(interval)
        stream.getTracks().forEach((track) => track.stop())
        audioContext.close()

        const result: TestResult = {
          success: true,
          message: hasAudio
            ? "Microphone working with audio detected"
            : "Microphone access granted (speak to test audio)",
          details: {
            sampleRate: audioContext.sampleRate,
            channels: stream.getAudioTracks()[0]?.getSettings()?.channelCount || 1,
            audioDetected: hasAudio,
          },
          timestamp: new Date().toISOString(),
        }
        updateTestResult("microphone", result)
        addLog(`✅ Microphone test completed: ${result.message}`)
      }, 2000)
    } catch (error) {
      const result: TestResult = {
        success: false,
        message: "Microphone access denied or failed",
        details: error,
        timestamp: new Date().toISOString(),
      }
      updateTestResult("microphone", result)
      addLog(`❌ Microphone test failed: ${result.message}`)
    }
  }

  const testSpeakers = async () => {
    if (!voiceManager) return

    addLog("Testing speakers...")
    const result = await voiceManager.testSpeakers()
    updateTestResult("speakers", {
      ...result,
      timestamp: new Date().toISOString(),
    })
    addLog(`${result.success ? "✅" : "❌"} Speaker test: ${result.message}`)
  }

  const testSpeechRecognition = async () => {
    if (!voiceManager) return

    addLog("Testing speech recognition...")
    const result = await voiceManager.testSpeechRecognition()
    updateTestResult("speechRecognition", {
      ...result,
      timestamp: new Date().toISOString(),
    })
    addLog(`${result.success ? "✅" : "❌"} Speech recognition test: ${result.message}`)
  }

  const testTextToSpeech = async () => {
    addLog("Testing text-to-speech...")

    try {
      const testText = customTestText || testTexts[selectedLanguage as keyof typeof testTexts]

      const response = await fetch("/api/voice-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test_tts",
          data: {
            text: testText,
            language: selectedLanguage,
            provider: "elevenlabs",
          },
        }),
      })

      const result = await response.json()
      updateTestResult("textToSpeech", {
        ...result,
        timestamp: new Date().toISOString(),
      })
      addLog(`${result.success ? "✅" : "❌"} TTS test: ${result.message}`)

      // If successful and using browser TTS, actually speak the text
      if (result.success && result.details?.provider === "browser" && voiceManager) {
        setIsSpeaking(true)
        await voiceManager.speak(
          testText,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false),
          (error) => {
            console.error("TTS playback error:", error)
            setIsSpeaking(false)
          },
        )
      }
    } catch (error) {
      const result: TestResult = {
        success: false,
        message: "TTS test failed",
        details: error,
        timestamp: new Date().toISOString(),
      }
      updateTestResult("textToSpeech", result)
      addLog(`❌ TTS test failed: ${result.message}`)
    }
  }

  const testN8nWebhook = async () => {
    addLog("Testing n8n webhook...")

    try {
      const response = await fetch("/api/voice-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test_n8n_webhook",
        }),
      })

      const result = await response.json()
      updateTestResult("n8nWebhook", {
        ...result,
        timestamp: new Date().toISOString(),
      })
      addLog(`${result.success ? "✅" : "❌"} N8n webhook test: ${result.message}`)
    } catch (error) {
      const result: TestResult = {
        success: false,
        message: "N8n webhook test failed",
        details: error,
        timestamp: new Date().toISOString(),
      }
      updateTestResult("n8nWebhook", result)
      addLog(`❌ N8n webhook test failed: ${result.message}`)
    }
  }

  const runFullVoiceFlow = async () => {
    addLog("Running complete voice system test...")
    setIsRunningTests(true)

    try {
      const response = await fetch("/api/voice-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test_full_voice_flow",
        }),
      })

      const result = await response.json()
      updateTestResult("fullFlow", {
        ...result,
        timestamp: new Date().toISOString(),
      })
      addLog(`${result.success ? "✅" : "❌"} Full voice flow test: ${result.message}`)

      // Update individual test results from the full flow
      if (result.results) {
        Object.entries(result.results).forEach(([testName, testResult]: [string, any]) => {
          updateTestResult(testName as keyof TestResults, {
            ...testResult,
            timestamp: new Date().toISOString(),
          })
        })
      }
    } catch (error) {
      const result: TestResult = {
        success: false,
        message: "Full voice flow test failed",
        details: error,
        timestamp: new Date().toISOString(),
      }
      updateTestResult("fullFlow", result)
      addLog(`❌ Full voice flow test failed: ${result.message}`)
    } finally {
      setIsRunningTests(false)
    }
  }

  const startListening = () => {
    if (!voiceManager) return

    setIsListening(true)
    setRecognizedText("")
    addLog("🎤 Started listening...")

    voiceManager.startListening(
      (text) => {
        setRecognizedText(text)
        setIsListening(false)
        addLog(`🎤 Recognized: "${text}"`)
      },
      (error) => {
        console.error("Speech recognition error:", error)
        setIsListening(false)
        addLog(`❌ Speech recognition error: ${error.message || "Unknown error"}`)
      },
    )
  }

  const stopListening = () => {
    if (voiceManager) {
      voiceManager.stopListening()
    }
    setIsListening(false)
    addLog("🎤 Stopped listening")
  }

  const speakText = async (text: string) => {
    if (!voiceManager || !text) return

    setIsSpeaking(true)
    addLog(`🔊 Speaking: "${text}"`)

    await voiceManager.speak(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      (error) => {
        console.error("TTS error:", error)
        setIsSpeaking(false)
        addLog(`❌ TTS error: ${error.message || "Unknown error"}`)
      },
    )
  }

  const stopSpeaking = () => {
    if (voiceManager) {
      voiceManager.stopSpeaking()
    }
    setIsSpeaking(false)
    addLog("🔊 Stopped speaking")
  }

  const clearLogs = () => {
    setTestLogs([])
  }

  const getStatusIcon = (result: TestResult | null) => {
    if (!result) return <AlertCircle className="h-4 w-4 text-gray-400" />
    return result.success ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    )
  }

  const getStatusBadge = (result: TestResult | null) => {
    if (!result) return <Badge variant="outline">Not Tested</Badge>
    return result.success ? (
      <Badge variant="default" className="bg-green-500">
        Passed
      </Badge>
    ) : (
      <Badge variant="destructive">Failed</Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Voice System Test Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Test Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        {lang.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={runFullVoiceFlow} disabled={isRunningTests} className="bg-blue-600 hover:bg-blue-700">
                {isRunningTests ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                Run All Tests
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">N8n Webhook URL</label>
              <code className="text-xs bg-muted px-2 py-1 rounded block break-all">
                {n8nIntegration.getWebhookUrl()}
              </code>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Agent ID</label>
              <code className="text-xs bg-muted px-2 py-1 rounded block">{n8nIntegration.getAgentId()}</code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hardware Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hardware Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(testResults.microphone)}
                <div>
                  <div className="font-medium">Microphone Access</div>
                  <div className="text-sm text-muted-foreground">
                    {testResults.microphone?.message || "Test microphone permissions"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(testResults.microphone)}
                <Button onClick={testMicrophone} size="sm" variant="outline">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(testResults.speakers)}
                <div>
                  <div className="font-medium">Speaker Output</div>
                  <div className="text-sm text-muted-foreground">
                    {testResults.speakers?.message || "Test audio output"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(testResults.speakers)}
                <Button onClick={testSpeakers} size="sm" variant="outline">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Software Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Software Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(testResults.speechRecognition)}
                <div>
                  <div className="font-medium">Speech Recognition</div>
                  <div className="text-sm text-muted-foreground">
                    {testResults.speechRecognition?.message || "Test speech-to-text"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(testResults.speechRecognition)}
                <Button onClick={testSpeechRecognition} size="sm" variant="outline">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(testResults.textToSpeech)}
                <div>
                  <div className="font-medium">Text-to-Speech</div>
                  <div className="text-sm text-muted-foreground">
                    {testResults.textToSpeech?.message || "Test text-to-speech"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(testResults.textToSpeech)}
                <Button onClick={testTextToSpeech} size="sm" variant="outline">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(testResults.n8nWebhook)}
                <div>
                  <div className="font-medium">N8n Webhook</div>
                  <div className="text-sm text-muted-foreground">
                    {testResults.n8nWebhook?.message || "Test automation webhook"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(testResults.n8nWebhook)}
                <Button onClick={testN8nWebhook} size="sm" variant="outline">
                  <Zap className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Voice Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Interactive Voice Testing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Custom Test Text</label>
            <Textarea
              value={customTestText}
              onChange={(e) => setCustomTestText(e.target.value)}
              placeholder={testTexts[selectedLanguage as keyof typeof testTexts]}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "default"}
              disabled={isSpeaking}
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Listening
                </>
              )}
            </Button>

            <Button
              onClick={() => speakText(customTestText || testTexts[selectedLanguage as keyof typeof testTexts])}
              variant="outline"
              disabled={isListening || isSpeaking}
            >
              <Play className="h-4 w-4 mr-2" />
              Speak Text
            </Button>

            {isSpeaking && (
              <Button onClick={stopSpeaking} variant="destructive" size="sm">
                <Square className="h-4 w-4 mr-2" />
                Stop Speaking
              </Button>
            )}
          </div>

          {recognizedText && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-1">Recognized Speech:</div>
              <div className="text-sm">{recognizedText}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Test Logs
            <Button onClick={clearLogs} size="sm" variant="outline">
              Clear Logs
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 w-full border rounded-lg p-4">
            <div className="space-y-1">
              {testLogs.length === 0 ? (
                <div className="text-muted-foreground text-sm">No logs yet. Run some tests to see results here.</div>
              ) : (
                testLogs.map((log, index) => (
                  <div key={index} className="text-sm font-mono">
                    {log}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
