"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageCircle,
  Send,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Globe,
  Mic,
  MicOff,
} from "lucide-react"
import { languageDetector, type LanguageDetectionResult } from "@/environment/language-detection"

interface Message {
  id: string
  type: "user" | "bot" | "system" | "suggestion"
  content: string
  timestamp: Date
  language?: string
  requiresApproval?: boolean
  approvalStatus?: "pending" | "approved" | "rejected"
  suggestions?: string[]
}

interface CompactChatbotWidgetProps {
  businessType: string
  position?: "bottom-right" | "bottom-left" | "embedded"
  maxHeight?: number
  onApprovalRequest?: (request: any) => void
  adminMode?: boolean
}

export default function CompactChatbotWidget({
  businessType,
  position = "bottom-right",
  maxHeight = 400,
  onApprovalRequest,
  adminMode = false,
}: CompactChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState<LanguageDetectionResult | null>(null)
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [isListening, setIsListening] = useState(false)
  const [pendingApprovals, setPendingApprovals] = useState(0)

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Initialize with greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: Message = {
        id: "1",
        type: "bot",
        content:
          "Hello! I'm your AI assistant. I can help you in English, Luganda, or Swahili. How can I assist you today?",
        timestamp: new Date(),
        language: "en",
      }
      setMessages([greeting])
    }
  }, [])

  // Handle language detection on input change
  useEffect(() => {
    if (input.trim().length > 3) {
      const detection = languageDetector.detectLanguage(input)
      setDetectedLanguage(detection)
    } else {
      setDetectedLanguage(null)
    }
  }, [input])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const detection = languageDetector.detectLanguage(input)

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
      language: detection.suggestedResponse,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      // Send to approval system first
      const response = await fetch("/api/chat-approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userMessage: input,
          businessType,
          language: detection.suggestedResponse,
          detectedLanguage: detection,
        }),
      })

      const data = await response.json()

      if (data.requiresApproval) {
        // Show pending approval message
        const pendingMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "system",
          content:
            detection.suggestedResponse === "lg"
              ? "Nsaba olindawo. Tukebera ekibuuzo kyo..."
              : detection.suggestedResponse === "sw"
                ? "Tafadhali subiri. Tunakagua swali lako..."
                : "Please wait while we review your request...",
          timestamp: new Date(),
          requiresApproval: true,
          approvalStatus: "pending",
        }

        setMessages((prev) => [...prev, pendingMessage])
        setPendingApprovals((prev) => prev + 1)

        // Notify admin if callback provided
        if (onApprovalRequest) {
          onApprovalRequest(data.approvalRequest)
        }
      } else {
        // Auto-approved or direct response
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: data.response,
          timestamp: new Date(),
          language: detection.suggestedResponse,
          suggestions: data.suggestions,
        }

        setMessages((prev) => [...prev, botMessage])

        // Add suggestions if provided
        if (data.suggestions && data.suggestions.length > 0) {
          const suggestionMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: "suggestion",
            content: "Here are some things I can help you with:",
            timestamp: new Date(),
            suggestions: data.suggestions,
          }
          setMessages((prev) => [...prev, suggestionMessage])
        }
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          detection.suggestedResponse === "lg"
            ? "Nsonyiwa, nfunye obuzibu. Ddamu ogezaako."
            : detection.suggestedResponse === "sw"
              ? "Pole, nimepata tatizo. Tafadhali jaribu tena."
              : "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date(),
        language: detection.suggestedResponse,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "fixed bottom-4 left-4 z-50"
      case "bottom-right":
        return "fixed bottom-4 right-4 z-50"
      case "embedded":
        return "relative"
      default:
        return "fixed bottom-4 right-4 z-50"
    }
  }

  const getWidgetSize = () => {
    if (position === "embedded") {
      return "w-full h-full"
    }
    return isMinimized ? "w-80 h-16" : `w-80 h-[${maxHeight}px]`
  }

  // Floating action button when closed
  if (!isOpen && position !== "embedded") {
    return (
      <div className={getPositionClasses()}>
        <Button onClick={() => setIsOpen(true)} className="rounded-full w-14 h-14 shadow-lg relative" size="lg">
          <MessageCircle className="h-6 w-6" />
          {pendingApprovals > 0 && (
            <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
              {pendingApprovals}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className={`${getPositionClasses()} ${getWidgetSize()}`}>
      <Card className="h-full flex flex-col shadow-xl border-2">
        {/* Header */}
        <CardHeader className="pb-2 px-3 py-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Assistant
            {detectedLanguage && (
              <Badge variant="outline" className="text-xs">
                <Globe className="h-3 w-3 mr-1" />
                {detectedLanguage.primaryLanguage.toUpperCase()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-1">
            {pendingApprovals > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {pendingApprovals}
              </Badge>
            )}
            {position !== "embedded" && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)} className="h-6 w-6 p-0">
                  {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
                  ×
                </Button>
              </>
            )}
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="flex-1 p-3 pt-0">
              <ScrollArea className="h-full pr-2" ref={scrollAreaRef}>
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div key={message.id}>
                      <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] rounded-lg p-2 text-sm ${
                            message.type === "user"
                              ? "bg-blue-600 text-white"
                              : message.type === "system"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                : message.type === "suggestion"
                                  ? "bg-gray-50 text-gray-700 border border-gray-200"
                                  : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            {message.type === "user" ? (
                              <User className="h-3 w-3" />
                            ) : message.type === "system" ? (
                              <AlertCircle className="h-3 w-3" />
                            ) : (
                              <Bot className="h-3 w-3" />
                            )}
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {message.language && (
                              <Badge variant="outline" className="text-xs h-4 px-1">
                                {message.language.toUpperCase()}
                              </Badge>
                            )}
                            {message.requiresApproval && (
                              <Badge
                                variant={message.approvalStatus === "approved" ? "default" : "secondary"}
                                className="text-xs h-4 px-1"
                              >
                                {message.approvalStatus === "pending" && <Clock className="h-2 w-2 mr-1" />}
                                {message.approvalStatus === "approved" && <CheckCircle className="h-2 w-2 mr-1" />}
                                {message.approvalStatus || "pending"}
                              </Badge>
                            )}
                          </div>
                          <p className="leading-relaxed">{message.content}</p>
                        </div>
                      </div>

                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.suggestions.map((suggestion, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              className="text-xs h-6 px-2 bg-transparent"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-2 flex items-center gap-2">
                        <Bot className="h-3 w-3" />
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Language Detection Display */}
            {detectedLanguage && detectedLanguage.confidence > 0.5 && (
              <div className="px-3 py-1 border-t bg-gray-50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">
                    Detected: {detectedLanguage.primaryLanguage.toUpperCase()}(
                    {Math.round(detectedLanguage.confidence * 100)}%)
                  </span>
                  {detectedLanguage.localTerms.length > 0 && (
                    <div className="flex gap-1">
                      {detectedLanguage.localTerms.slice(0, 2).map((term, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs h-4 px-1">
                          {term.term}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 pt-2 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isTyping}
                  className="text-sm"
                />
                {recognitionRef.current && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleListening}
                    disabled={isTyping}
                    className={`px-2 ${isListening ? "bg-red-100 text-red-600" : ""}`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
                <Button onClick={handleSendMessage} disabled={isTyping || !input.trim()} size="sm" className="px-3">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
