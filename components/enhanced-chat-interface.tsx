"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Bot, User, Globe, Building2, Zap, Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { isServiceAvailable } from "@/lib/api-keys"
import { dbHelpers, type ChatSession } from "@/lib/supabase"
import { VoiceManager } from "@/lib/voice-integration"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  language?: string
  escalated?: boolean
  aiProvider?: string
}

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "lg", name: "Luganda", flag: "🇺🇬" },
  { code: "sw", name: "Swahili", flag: "🇰🇪" },
]

const businessTypes = [
  { id: "telecom", name: "Telecommunications", icon: "📱" },
  { id: "banking", name: "Banking & Finance", icon: "🏦" },
  { id: "utilities", name: "Utilities", icon: "⚡" },
  { id: "ecommerce", name: "E-commerce", icon: "🛒" },
  { id: "general", name: "General Support", icon: "💬" },
]

const getAvailableProviders = () => {
  const providers = []

  if (isServiceAvailable("GEMINI")) {
    providers.push({ id: "google", name: "Google Gemini", icon: "✨", status: "free" })
  }

  if (isServiceAvailable("GROQ")) {
    providers.push({ id: "groq", name: "Groq Llama", icon: "⚡", status: "free" })
  }

  if (isServiceAvailable("ANTHROPIC")) {
    providers.push({ id: "anthropic", name: "Anthropic Claude", icon: "🤖", status: "premium" })
  }

  if (isServiceAvailable("OPENAI")) {
    providers.push({ id: "openai", name: "OpenAI GPT", icon: "🧠", status: "premium" })
  }

  if (providers.length === 0) {
    providers.push({ id: "mock", name: "Demo AI", icon: "🎭", status: "demo" })
  }

  return providers
}

function EnhancedChatInterface() {
  const [session, setSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Configuration
  const [email, setEmail] = useState("")
  const [language, setLanguage] = useState("en")
  const [businessType, setBusinessType] = useState("general")
  const [aiProvider, setAiProvider] = useState(() => {
    const providers = getAvailableProviders()
    return providers[0]?.id || "mock"
  })

  // Voice features
  const [voiceManager, setVoiceManager] = useState<VoiceManager | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const availableProviders = getAvailableProviders()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (voiceEnabled && !voiceManager) {
      const vm = new VoiceManager({
        enabled: true,
        provider: isServiceAvailable("ELEVENLABS") ? "elevenlabs" : "browser",
        language: language,
      })
      setVoiceManager(vm)
    } else if (voiceManager) {
      voiceManager.updateConfig({ language })
    }
  }, [voiceEnabled, language, voiceManager])

  const initializeSession = async () => {
    if (!email) return

    try {
      setIsLoading(true)

      let user = await dbHelpers.getUserByEmail(email)
      if (!user) {
        user = await dbHelpers.createUser({
          email,
          preferred_language: language,
          business_type: businessType,
        })
      }

      const sessionData = await dbHelpers.createSession({
        user_id: user.id,
        email,
        business_type: businessType,
        language,
        ai_provider: aiProvider,
        status: "active",
        metadata: {
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          voice_enabled: voiceEnabled,
        },
      })

      setSession(sessionData)
      setIsInitialized(true)

      const welcomeMessage: Message = {
        id: "welcome",
        content: getWelcomeMessage(language, businessType),
        role: "assistant",
        timestamp: new Date(),
        language,
        aiProvider,
      }

      setMessages([welcomeMessage])

      await dbHelpers.createMessage({
        session_id: sessionData.id,
        role: "assistant",
        content: welcomeMessage.content,
        language,
        ai_provider: aiProvider,
        metadata: { type: "welcome" },
      })
    } catch (error) {
      console.error("Failed to initialize session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !session || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
      language,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      await dbHelpers.createMessage({
        session_id: session.id,
        role: "user",
        content: userMessage.content,
        language,
        metadata: { timestamp: userMessage.timestamp.toISOString() },
      })

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          message: inputMessage,
          language,
          businessType,
          aiProvider,
          conversationHistory: messages.slice(-10),
        }),
      })

      if (response.ok) {
        const data = await response.json()

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: "assistant",
          timestamp: new Date(),
          language: data.detectedLanguage || language,
          escalated: data.escalated,
          aiProvider: data.aiProvider,
        }

        setMessages((prev) => [...prev, assistantMessage])

        await dbHelpers.createMessage({
          session_id: session.id,
          role: "assistant",
          content: assistantMessage.content,
          language: assistantMessage.language,
          ai_provider: assistantMessage.aiProvider,
          escalated: assistantMessage.escalated,
          metadata: {
            timestamp: assistantMessage.timestamp.toISOString(),
            escalated: assistantMessage.escalated,
          },
        })

        if (data.escalated && session.status !== "escalated") {
          const updatedSession = await dbHelpers.updateSession(session.id, {
            status: "escalated",
          })
          setSession(updatedSession)

          await dbHelpers.createTicket({
            session_id: session.id,
            user_id: session.user_id,
            title: `Escalated Issue - ${businessType}`,
            description: `Customer message: "${inputMessage}"\nAI Response: "${data.response}"`,
            priority: "medium",
            status: "open",
          })
        }

        if (voiceEnabled && voiceManager && assistantMessage.content) {
          speakText(assistantMessage.content)
        }
      } else {
        throw new Error("Failed to get response")
      }
    } catch (error) {
      console.error("Error sending message:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getErrorMessage(language),
        role: "assistant",
        timestamp: new Date(),
        language,
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const speakText = async (text: string) => {
    if (!voiceManager) return

    try {
      setIsSpeaking(true)
      await voiceManager.speak(
        text,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        (error) => {
          console.error("TTS error:", error)
          setIsSpeaking(false)
        },
      )
    } catch (error) {
      console.error("TTS error:", error)
      setIsSpeaking(false)
    }
  }

  const startListening = () => {
    if (!voiceManager) {
      alert("Voice manager not initialized")
      return
    }

    setIsListening(true)
    voiceManager.startListening(
      (text) => {
        setInputMessage(text)
        setIsListening(false)
      },
      (error) => {
        console.error("Speech recognition error:", error)
        setIsListening(false)
      },
    )
  }

  const stopListening = () => {
    if (voiceManager) {
      voiceManager.stopListening()
    }
    setIsListening(false)
  }

  const stopSpeaking = () => {
    if (voiceManager) {
      voiceManager.stopSpeaking()
    }
    setIsSpeaking(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getWelcomeMessage = (lang: string, business: string) => {
    const businessName = businessTypes.find((b) => b.id === business)?.name || "Support"

    switch (lang) {
      case "lg":
        return `Oli otya! Nze AI omuyambi wa ${businessName}. Nsobola kutya okukuyamba leero?`
      case "sw":
        return `Hujambo! Mimi ni msaidizi wa AI wa ${businessName}. Ninaweza kukusaidia vipi leo?`
      default:
        return `Hello! I'm your AI assistant for ${businessName}. How can I help you today?`
    }
  }

  const getErrorMessage = (lang: string) => {
    switch (lang) {
      case "lg":
        return "Nsonyiwa, waliwo obuzibu. Mukuume mugezeeko."
      case "sw":
        return "Samahani, kuna tatizo. Tafadhali jaribu tena."
      default:
        return "Sorry, there was an error. Please try again."
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "escalated":
        return "bg-yellow-500"
      case "resolved":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Bot className="h-6 w-6 text-blue-600" />
                AI Customer Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
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

              <div>
                <label className="text-sm font-medium mb-2 block">Business Type</label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((business) => (
                      <SelectItem key={business.id} value={business.id}>
                        <span className="flex items-center gap-2">
                          <span>{business.icon}</span>
                          {business.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">AI Provider</label>
                <Select value={aiProvider} onValueChange={setAiProvider}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProviders.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        <span className="flex items-center gap-2">
                          <span>{provider.icon}</span>
                          {provider.name}
                          <Badge
                            variant={
                              provider.status === "free"
                                ? "default"
                                : provider.status === "premium"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {provider.status}
                          </Badge>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="voice"
                  checked={voiceEnabled}
                  onChange={(e) => setVoiceEnabled(e.target.checked)}
                />
                <label htmlFor="voice" className="text-sm">
                  Enable voice features
                </label>
              </div>

              <Button onClick={initializeSession} disabled={!email || isLoading} className="w-full">
                {isLoading ? "Starting Session..." : "Start Chat Session"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Session Info */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" />
                <span className="font-medium">AI Support Chat</span>
                {voiceEnabled && (
                  <Badge variant="outline" className="text-xs">
                    <Volume2 className="h-3 w-3 mr-1" />
                    Voice Enabled
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  <Globe className="h-3 w-3 mr-1" />
                  {languages.find((l) => l.code === language)?.name}
                </Badge>
                <Badge variant="outline">
                  <Building2 className="h-3 w-3 mr-1" />
                  {businessTypes.find((b) => b.id === businessType)?.name}
                </Badge>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(session?.status || "active")}`} />
                <span className="text-sm text-muted-foreground capitalize">{session?.status || "active"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col">
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 message-fade-in ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user" ? "bg-blue-600 text-white ml-auto" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.escalated && (
                          <Badge variant="destructive" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Escalated
                          </Badge>
                        )}
                        {message.aiProvider && (
                          <Badge variant="outline" className="text-xs">
                            {availableProviders.find((p) => p.id === message.aiProvider)?.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {message.role === "user" && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white animate-pulse" />
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    language === "lg"
                      ? "Wandiika obubaka bwo..."
                      : language === "sw"
                        ? "Andika ujumbe wako..."
                        : "Type your message..."
                  }
                  disabled={isLoading}
                  className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                  rows={1}
                />

                {voiceEnabled && (
                  <>
                    <Button
                      onClick={isListening ? stopListening : startListening}
                      disabled={isLoading}
                      variant="outline"
                      size="icon"
                    >
                      {isListening ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                    </Button>

                    <Button
                      onClick={isSpeaking ? stopSpeaking : () => {}}
                      disabled={isLoading || !isSpeaking}
                      variant="outline"
                      size="icon"
                    >
                      {isSpeaking ? <VolumeX className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </>
                )}

                <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EnhancedChatInterface
