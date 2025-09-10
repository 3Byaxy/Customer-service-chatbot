"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Bot, User, AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react"

interface Message {
  id: string
  sender: "user" | "bot" | "agent"
  content: string
  timestamp: string
  metadata?: {
    intent?: string
    language_detected?: string
    model_provider?: string
    escalated?: boolean
    knowledge_used?: boolean
  }
}

interface Session {
  id: string
  business_type: string
  language: string
  status: string
}

export default function EnhancedChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [businessType, setBusinessType] = useState("telecom")
  const [language, setLanguage] = useState("en")
  const [provider, setProvider] = useState("anthropic")
  const [userEmail, setUserEmail] = useState("")
  const [isSessionStarted, setIsSessionStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startSession = async () => {
    if (!userEmail) {
      alert("Please enter your email address")
      return
    }

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          businessType,
          language,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSession({
          id: data.data.sessionId,
          business_type: data.data.businessType,
          language: data.data.language,
          status: "active",
        })
        setIsSessionStarted(true)

        // Add welcome message
        const welcomeMessages = {
          en: `Hello! I'm your AI customer service assistant for ${businessType} services. How can I help you today?`,
          lg: `Webale! Nze mukozi wo w'obuweereza bw'abakasitoma ku nsonga za ${businessType}. Nkuyinza ntya okukuyamba leero?`,
          sw: `Hujambo! Mimi ni msaidizi wako wa huduma kwa wateja wa AI kwa huduma za ${businessType}. Ninawezaje kukusaidia leo?`,
        }

        const welcomeMessage: Message = {
          id: Date.now().toString(),
          sender: "bot",
          content: welcomeMessages[language as keyof typeof welcomeMessages] || welcomeMessages.en,
          timestamp: new Date().toISOString(),
          metadata: {
            intent: "greeting",
            language_detected: language,
            model_provider: provider,
          },
        }

        setMessages([welcomeMessage])
      } else {
        alert("Failed to start session: " + data.error)
      }
    } catch (error) {
      console.error("Session start error:", error)
      alert("Failed to start session")
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !session || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          sessionId: session.id,
          businessType: session.business_type,
          language: session.language,
          provider,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          content: data.data.response,
          timestamp: new Date().toISOString(),
          metadata: {
            intent: data.data.intent,
            language_detected: data.data.language,
            model_provider: data.data.provider,
            escalated: data.data.escalated,
            knowledge_used: data.data.knowledgeUsed,
          },
        }

        setMessages((prev) => [...prev, botMessage])

        // Update session status if escalated
        if (data.data.escalated) {
          setSession((prev) => (prev ? { ...prev, status: "escalated" } : null))
        }
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          content:
            "I apologize, but I'm experiencing technical difficulties. Please try again or contact our support team directly.",
          timestamp: new Date().toISOString(),
          metadata: {
            intent: "error",
            language_detected: language,
          },
        }

        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error("Send message error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        content:
          "I apologize, but I'm experiencing technical difficulties. Please try again or contact our support team directly.",
        timestamp: new Date().toISOString(),
        metadata: {
          intent: "error",
          language_detected: language,
        },
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "escalated":
        return "bg-orange-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getIntentIcon = (intent?: string) => {
    switch (intent) {
      case "escalation":
        return <AlertTriangle className="h-3 w-3" />
      case "knowledge_lookup":
        return <CheckCircle className="h-3 w-3" />
      case "greeting":
        return <CheckCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  if (!isSessionStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Start Customer Service Chat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Business Type</label>
            <Select value={businessType} onValueChange={setBusinessType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="telecom">Telecommunications</SelectItem>
                <SelectItem value="banking">Banking & Finance</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Preferred Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="lg">Luganda</SelectItem>
                <SelectItem value="sw">Swahili</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">AI Provider</label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                <SelectItem value="google">Google Gemini</SelectItem>
                <SelectItem value="groq">Groq Llama</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={startSession} className="w-full">
            Start Chat Session
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Session Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(session?.status || "")}`}></div>
                <span className="text-sm font-medium">
                  Session: {session?.status?.charAt(0).toUpperCase() + session?.status?.slice(1)}
                </span>
              </div>
              <Badge variant="outline">{session?.business_type}</Badge>
              <Badge variant="outline">{session?.language.toUpperCase()}</Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Zap className="h-3 w-3" />
                <span>{provider}</span>
              </Badge>
            </div>
            <div className="text-sm text-gray-500">ID: {session?.id.slice(0, 8)}...</div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>Customer Service Chat</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === "bot" && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      {message.sender === "user" && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            {message.metadata?.intent && (
                              <Badge variant="secondary" className="text-xs flex items-center space-x-1">
                                {getIntentIcon(message.metadata.intent)}
                                <span>{message.metadata.intent}</span>
                              </Badge>
                            )}
                            {message.metadata?.knowledge_used && (
                              <Badge variant="outline" className="text-xs">
                                KB Used
                              </Badge>
                            )}
                            {message.metadata?.escalated && (
                              <Badge variant="destructive" className="text-xs">
                                Escalated
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs opacity-70">{new Date(message.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
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

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
