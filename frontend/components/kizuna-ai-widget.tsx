"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, MicOff, Send, Minimize2, Maximize2, X, Globe, Clock } from "lucide-react"
import KizunaAIAvatar from "./brand/kizuna-ai-avatar"

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
  className?: string
}

export default function KizunaAIWidget({
  businessType,
  position = "bottom-right",
  maxHeight = 500,
  onApprovalRequest,
  className = "",
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
      content: `Hello! I'm KizunaAI, your intelligent support companion. I can help you in English, Luganda, or Swahili. How can I assist you today? 😊`,
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

      recognition.onend = () => {
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
      // Simulate API call with mock response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        sender: "kizuna_ai",
        content:
          "Thank you for your message! I understand you need assistance. Let me help you with that. Is there anything specific you'd like to know more about?",
        timestamp: new Date(),
        language: "en",
        suggestions: ["Tell me more", "Yes, please help", "I have another question", "Contact human agent"],
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        sender: "kizuna_ai",
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment. 🙏",
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
    return isMinimized ? { width: "320px", height: "70px" } : { width: "380px", height: "600px", maxHeight: "90vh" }
  }

  if (position !== "embedded" && !isOpen) {
    return (
      <div className={getPositionClasses()}>
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-400 hover:to-pink-400 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          <KizunaAIAvatar size="md" variant="orb" isActive={true} />
        </Button>
      </div>
    )
  }

  return (
    <div className={`${getPositionClasses()} ${className}`}>
      <Card
        className="shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-white to-gray-50"
        style={getWidgetSize()}
      >
        {/* Header */}
        <CardHeader className="pb-3 bg-gradient-to-r from-teal-500 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <KizunaAIAvatar size="md" variant="orb" isActive={true} />
              <div>
                <h3 className="font-bold text-lg" style={{ fontFamily: "Nunito, sans-serif" }}>
                  KizunaAI
                </h3>
                <p className="text-xs opacity-90" style={{ fontFamily: "Quicksand, sans-serif" }}>
                  Your support companion
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {detectedLanguage && (
                <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                  <Globe className="h-3 w-3 mr-1" />
                  {detectedLanguage.language?.toUpperCase()}
                </Badge>
              )}

              {position !== "embedded" && (
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" style={{ maxHeight: maxHeight - 140 }}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-teal-500 to-pink-500 text-white ml-4"
                          : "bg-white text-gray-900 border border-gray-100 mr-4"
                      }`}
                      style={{
                        fontFamily: message.sender === "user" ? "Poppins, sans-serif" : "Quicksand, sans-serif",
                      }}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender !== "user" && (
                          <KizunaAIAvatar size="sm" variant="orb" className="mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{message.content}</p>

                          {message.needsApproval && (
                            <div className="mt-2 flex items-center space-x-1 text-xs">
                              <Clock className="h-3 w-3" />
                              <span className="opacity-75">Awaiting approval...</span>
                            </div>
                          )}

                          {message.suggestions && (
                            <div className="mt-3 space-y-1">
                              <p className="text-xs opacity-75 mb-2">Quick replies:</p>
                              <div className="flex flex-wrap gap-1">
                                {message.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-7 px-2 bg-transparent border-current hover:bg-current hover:text-white transition-colors"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-60">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {message.language && (
                          <Badge variant="outline" className="text-xs h-4 px-1 opacity-60">
                            {message.language.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl p-3 max-w-[85%] border border-gray-100 shadow-sm mr-4">
                      <div className="flex items-center space-x-2">
                        <KizunaAIAvatar size="sm" variant="orb" mood="thinking" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
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
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  className="flex-1 rounded-full border-gray-200 focus:border-teal-400 focus:ring-teal-400"
                  style={{ fontFamily: "Quicksand, sans-serif" }}
                  disabled={isTyping}
                />

                {recognitionRef.current && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVoiceInput}
                    className={`rounded-full p-2 ${
                      isListening
                        ? "bg-red-100 text-red-600 border-red-200 animate-pulse"
                        : "hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200"
                    }`}
                    disabled={isTyping}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}

                <Button
                  onClick={handleSendMessage}
                  disabled={isTyping || !inputMessage.trim()}
                  className="rounded-full bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-400 hover:to-pink-400 p-2"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {detectedLanguage && detectedLanguage.confidence > 0.5 && (
                <div className="mt-2 text-xs text-gray-600 flex items-center space-x-2">
                  <Globe className="h-3 w-3" />
                  <span>
                    Detected: {detectedLanguage.language} ({Math.round(detectedLanguage.confidence * 100)}% confidence)
                  </span>
                  {detectedLanguage.localTerms?.length > 0 && (
                    <span className="text-teal-600">
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
