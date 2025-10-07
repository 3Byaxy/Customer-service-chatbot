"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { type VoiceCommand, voiceCommandParser } from "@/lib/voice-commands"
import { Headphones, MessageSquare, Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface VoiceChatProps {
  businessType: string
  language: string
  onTranscript?: (text: string) => void
  onCallEnd?: (summary: string) => void
}

export default function VoiceChatInterface({ businessType, language, onTranscript, onCallEnd }: VoiceChatProps) {
  const [isListening, setIsListening] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false)
  const [currentCallId, setCurrentCallId] = useState<string | null>(null)
  const [transcript, setTranscript] = useState("")
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [callStatus, setCallStatus] = useState<string>("idle")
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [commandFeedback, setCommandFeedback] = useState<string>("")
  const [availableCommands, setAvailableCommands] = useState<VoiceCommand[]>([])
  const [lastCommand, setLastCommand] = useState<string>("")

  const audioRef = useRef<HTMLAudioElement>(null)
  const recognitionRef = useRef<any>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  // Load available commands
  useEffect(() => {
    const commands = voiceCommandParser.getAllCommands()
    setAvailableCommands(commands)
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = language === "lg" ? "lg-UG" : language === "sw" ? "sw-KE" : "en-US"

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        const fullTranscript = finalTranscript || interimTranscript
        setTranscript(fullTranscript)

        // Parse voice commands
        if (finalTranscript) {
          const commandMatch = voiceCommandParser.parseCommand(finalTranscript)
          if (commandMatch) {
            executeVoiceCommand(commandMatch)
          }

          if (onTranscript) {
            onTranscript(finalTranscript)
          }
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [language, onTranscript])

  // Start/stop listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  // Generate voice response
  const generateVoiceResponse = async (text: string) => {
    try {
      const response = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          businessType,
          language,
        }),
      })

      const data = await response.json()

      if (data.success && data.audioUrl) {
        setAudioUrl(data.audioUrl)
        playAudio(data.audioUrl)
      }
    } catch (error) {
      console.error("Voice generation error:", error)
    }
  }

  // Play audio response
  const playAudio = (url: string) => {
    if (audioRef.current) {
      audioRef.current.src = url
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  // Start voice call
  const startVoiceCall = async (phoneNumber?: string) => {
    try {
      setCallStatus("initiating")

      const response = await fetch("/api/voice/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber || "+256700000000", // Default or user input
          businessType,
          language,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setCurrentCallId(data.callId)
        setIsCallActive(true)
        setCallStatus(data.status)

        // Start monitoring call status
        monitorCall(data.callId)
      }
    } catch (error) {
      console.error("Voice call error:", error)
      setCallStatus("error")
    }
  }

  // Monitor call status
  const monitorCall = (callId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/voice/call?callId=${callId}`)
        const data = await response.json()

        setCallStatus(data.status)

        if (data.status === "ended") {
          setIsCallActive(false)
          clearInterval(interval)

          if (data.transcript && onTranscript) {
            onTranscript(data.transcript)
          }

          if (data.summary && onCallEnd) {
            onCallEnd(data.summary)
          }
        }
      } catch (error) {
        console.error("Call monitoring error:", error)
      }
    }, 2000)

    return interval
  }

  // End voice call
  const endVoiceCall = () => {
    setIsCallActive(false)
    setCurrentCallId(null)
    setCallStatus("idle")
  }

  // Toggle voice features
  const toggleVoiceFeatures = () => {
    setVoiceEnabled(!voiceEnabled)
  }

  // Execute voice command
  const executeVoiceCommand = (commandMatch: any) => {
    const { command } = commandMatch
    setLastCommand(command.id)
    setCommandFeedback(`Command recognized: ${command.description}`)

    // Clear feedback after 3 seconds
    setTimeout(() => setCommandFeedback(""), 3000)

    switch (command.action) {
      case 'show_help':
        // Show available commands
        setCommandFeedback(`Available commands: ${availableCommands.map(cmd => cmd.keywords[0]).join(', ')}`)
        break

      case 'end_call':
        if (isCallActive) {
          endVoiceCall()
          generateVoiceResponse("Call ended as requested.")
        } else {
          generateVoiceResponse("No active call to end.")
        }
        break

      case 'stop_listening':
        if (isListening) {
          toggleListening()
          generateVoiceResponse("Stopped listening.")
        }
        break

      case 'start_listening':
        if (!isListening) {
          toggleListening()
          generateVoiceResponse("Started listening.")
        }
        break

      case 'repeat_last':
        if (lastCommand) {
          generateVoiceResponse(`Last command was: ${lastCommand}`)
        } else {
          generateVoiceResponse("No previous command to repeat.")
        }
        break

      case 'increase_volume':
        if (audioRef.current) {
          audioRef.current.volume = Math.min(audioRef.current.volume + 0.2, 1)
          generateVoiceResponse("Volume increased.")
        }
        break

      case 'decrease_volume':
        if (audioRef.current) {
          audioRef.current.volume = Math.max(audioRef.current.volume - 0.2, 0)
          generateVoiceResponse("Volume decreased.")
        }
        break

      case 'transfer_to_human':
        generateVoiceResponse("Transferring to a human agent. Please hold.")
        // In a real implementation, this would trigger escalation
        break

      case 'escalate_issue':
        generateVoiceResponse("Escalating your issue to a supervisor.")
        // In a real implementation, this would trigger escalation
        break

      case 'check_status':
        const status = isCallActive ? "Call in progress" : "Ready for commands"
        generateVoiceResponse(`System status: ${status}`)
        break

      default:
        generateVoiceResponse(`Command "${command.id}" not implemented yet.`)
    }
  }

  return (
    <div className="space-y-4">
      {/* Voice Controls Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Voice Assistant
            <Badge variant={voiceEnabled ? "default" : "secondary"}>{voiceEnabled ? "Enabled" : "Disabled"}</Badge>
          </CardTitle>
          <CardDescription>Speak naturally or make voice calls for instant support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant={voiceEnabled ? "default" : "outline"}
              onClick={toggleVoiceFeatures}
              className="flex items-center gap-2"
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              {voiceEnabled ? "Voice On" : "Voice Off"}
            </Button>

            <Badge variant="outline" className="ml-auto">
              Language: {language.toUpperCase()}
            </Badge>
          </div>

          {voiceEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Speech Recognition */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Voice Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={toggleListening}
                    variant={isListening ? "destructive" : "default"}
                    className="w-full flex items-center gap-2"
                    disabled={isCallActive}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {isListening ? "Stop Listening" : "Start Speaking"}
                  </Button>

                  {isListening && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">Listening...</span>
                      </div>
                      <Progress value={100} className="h-1" />
                    </div>
                  )}

                  {transcript && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <p className="text-sm font-semibold mb-2 text-blue-800">You said:</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{transcript}</p>
                    </div>
                  )}

                  {commandFeedback && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
                      <p className="text-sm font-semibold mb-2 text-green-800 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Voice Command Recognized:
                      </p>
                      <p className="text-sm text-green-700 leading-relaxed">{commandFeedback}</p>
                    </div>
                  )}
        
                  {/* Voice Commands */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Voice Commands
                      </CardTitle>
                      <CardDescription>Say these commands to control the voice assistant</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {availableCommands.slice(0, 8).map((command) => (
                          <div key={command.id} className="p-2 bg-gray-50 rounded text-xs">
                            <div className="font-medium text-gray-800">{command.keywords[0]}</div>
                            <div className="text-gray-600">{command.description}</div>
                          </div>
                        ))}
                      </div>
                      {availableCommands.length > 8 && (
                        <p className="text-xs text-gray-500 mt-2">
                          And {availableCommands.length - 8} more commands...
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Voice Calls */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Voice Call
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => startVoiceCall()}
                    variant={isCallActive ? "destructive" : "default"}
                    className="w-full flex items-center gap-2"
                    disabled={isListening}
                  >
                    {isCallActive ? <PhoneOff className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                    {isCallActive ? "End Call" : "Start Voice Call"}
                  </Button>

                  {isCallActive && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Call Status:</span>
                        <Badge variant={callStatus === "in-progress" ? "default" : "secondary"}>
                          {callStatus.replace("-", " ").toUpperCase()}
                        </Badge>
                      </div>

                      {callStatus === "in-progress" && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-600">Call in progress...</span>
                        </div>
                      )}
                    </div>
                  )}

                  {currentCallId && (
                    <div className="p-2 bg-blue-50 rounded text-xs text-blue-700">Call ID: {currentCallId}</div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audio Player */}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        controls
        className={audioUrl ? "w-full" : "hidden"}
      />

      {/* Real-time Status */}
      {voiceEnabled && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div
                  className={`w-3 h-3 rounded-full mx-auto mb-1 ${isListening ? "bg-red-500 animate-pulse" : "bg-gray-300"}`}
                ></div>
                <span className="text-xs text-gray-600">Speech Recognition</span>
              </div>
              <div>
                <div
                  className={`w-3 h-3 rounded-full mx-auto mb-1 ${isCallActive ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
                ></div>
                <span className="text-xs text-gray-600">Voice Call</span>
              </div>
              <div>
                <div
                  className={`w-3 h-3 rounded-full mx-auto mb-1 ${isPlaying ? "bg-blue-500 animate-pulse" : "bg-gray-300"}`}
                ></div>
                <span className="text-xs text-gray-600">Audio Playback</span>
              </div>
              <div>
                <div
                  className={`w-3 h-3 rounded-full mx-auto mb-1 ${voiceEnabled ? "bg-purple-500" : "bg-gray-300"}`}
                ></div>
                <span className="text-xs text-gray-600">Voice Features</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
