"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, MicOff, Send, Minimize2, Maximize2, X, Bot, Globe, Clock } from "lucide-react"
import { APP_CONFIG } from "../../backend/config/app-config"

interface Message {
  id: string
  sender: "user" | "kizuna_ai" | "admin"
  content: string
  timestamp: Date
  language?: string
  needsApproval?: boolean
  approvalStatus?: "pending" | "approved" | "rejected"
  suggestions?: string[]
}

interface KizunaAIWidgetProps {
  businessType: string
  position?: "embedded" | "bottom-right" | "bottom-left"
  maxHeight?: number
  onApprovalRequest?: (request: any) => void
}

export default function KizunaAIWidget({
  businessType,
  position = "bottom-right",
  maxHeight = 500,
  onApprovalRequest,
}: KizunaAIWidgetProps) {
  const [isOpen, setIsOpen] = useState(position === "embedded")
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState<any>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId] = useState(`session_${Date.now()}`)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      sender: "kizuna_ai",
      content: `Hello! I'm ${APP_CONFIG.chatbot.name}, your intelligent customer support companion. I can help you in English, Luganda, or Swahili. How can I assist you today?`,
      timestamp: new Date(),
      suggestions: ["I need help with my account", "Technical support", "Billing question", "General information"],
    }
    setMessages([welcomeMessage])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      sender: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      const response = await fetch("/backend/api/kizuna-ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          businessType,
          sessionId,
          userId: "user_123",
        }),
      })

      const data = await response.json()
      setDetectedLanguage(data)

      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        sender: "kizuna_ai",
        content: data.message,
        timestamp: new Date(),
        language: data.language,
        needsApproval: data.needsApproval,
        approvalStatus: data.needsApproval ? "pending" : undefined,
        suggestions: data.suggestions,
      }

      setMessages((prev) => [...prev, aiMessage])

      if (data.needsApproval && onApprovalRequest) {
        onApprovalRequest({
          conversationId: sessionId,
          userMessage: inputMessage,
          suggestedResponse: data.message,
          businessType,
          language: data.language,
        })
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        sender: "kizuna_ai",
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-right":
        return "fixed bottom-4 right-4 z-50"
      case "bottom-left":
        return "fixed bottom-4 left-4 z-50"
      case "embedded":
        return "w-full h-full"
      default:
        return "fixed bottom-4 right-4 z-50"
    }
  }

  const getWidgetSize = () => {
    if (position === "embedded") {
      return { width: "100%", height: `${maxHeight}px` }
    }
    return isMinimized ? { width: "300px", height: "60px" } : { width: "350px", height: "500px" }
  }

  if (position !== "embedded" && !isOpen) {
    return (
      <div className={getPositionClasses()}>
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
      </div>
    )
  }

  return (
    <div className={getPositionClasses()}>
      <Card className="shadow-xl border-0" style={getWidgetSize()}>
        {/* Header */}
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{APP_CONFIG.chatbot.name}</h3>
                <p className="text-xs opacity-90">AI Customer Support</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {detectedLanguage && (
                <Badge variant="secondary" className="text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  {detectedLanguage.language?.toUpperCase()}
                </Badge>
              )}

              {position !== "embedded" && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  >
                    {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" style={{ maxHeight: maxHeight - 120 }}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.sender !== "user" && <Bot className="h-4 w-4 mt-0.5 text-blue-600" />}
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>

                          {message.needsApproval && (
                            <div className="mt-2 flex items-center gap-1 text-xs">
                              <Clock className="h-3 w-3" />
                              <span className="opacity-75">Awaiting approval...</span>
                            </div>
                          )}

                          {message.suggestions && (
                            <div className="mt-2 space-y-1">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-6 mr-1 bg-transparent"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs opacity-75">{message.timestamp.toLocaleTimeString()}</span>
                        {message.language && (
                          <Badge variant="outline" className="text-xs">
                            {message.language.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-blue-600" />
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
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Message ${APP_CONFIG.chatbot.name}...`}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceInput}
                  className={isListening ? "bg-red-100 text-red-600" : ""}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>

                <Button onClick={handleSendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {detectedLanguage && (
                <div className="mt-2 text-xs text-gray-600 flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  <span>
                    Detected: {detectedLanguage.language}({Math.round(detectedLanguage.confidence * 100)}% confidence)
                  </span>
                  {detectedLanguage.localTerms?.length > 0 && (
                    <span className="text-blue-600">
                      • Found local terms: {detectedLanguage.localTerms.slice(0, 2).join(", ")}
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
