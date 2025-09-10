"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Send, Bot, User, Loader2 } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  language?: string
}

interface Session {
  id: string
  email: string
  businessType: string
  language: string
  aiProvider: string
  status: "active" | "escalated" | "completed"
  createdAt: Date
}

function EnhancedChatInterface() {
  const [session, setSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // Session setup form
  const [email, setEmail] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [language, setLanguage] = useState("en")
  const [aiProvider, setAiProvider] = useState("anthropic")

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const createSession = async () => {
    if (!email || !businessType) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          businessType,
          language,
          aiProvider,
        }),
      })

      if (response.ok) {
        const newSession = await response.json()
        setSession(newSession)

        // Add welcome message
        const welcomeMessage: Message = {
          id: "welcome",
          content: getWelcomeMessage(language, businessType),
          role: "assistant",
          timestamp: new Date(),
          language,
        }
        setMessages([welcomeMessage])
      }
    } catch (error) {
      console.error("Failed to create session:", error)
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
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          message: inputMessage,
          language: session.language,
          businessType: session.businessType,
          aiProvider: session.aiProvider,
        }),
      })

      if (response.ok) {
        const data = await response.json()

        const assistantMessage: Message = {
          id: Date.now().toString() + "_assistant",
          content: data.response,
          role: "assistant",
          timestamp: new Date(),
          language: data.detectedLanguage || session.language,
        }

        setMessages((prev) => [...prev, assistantMessage])

        // Update session status if escalated
        if (data.escalated) {
          setSession((prev) => (prev ? { ...prev, status: "escalated" } : null))
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      const errorMessage: Message = {
        id: Date.now().toString() + "_error",
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const getWelcomeMessage = (lang: string, business: string) => {
    const messages = {
      en: `Hello! I'm your AI assistant for ${business} support. How can I help you today?`,
      lg: `Nkulamusizza! Ndi omuyambi wo ku nsonga za ${business}. Nkuyinza kutya okukuyamba leero?`,
      sw: `Hujambo! Mimi ni msaidizi wako wa AI kwa huduma za ${business}. Ninaweza kukusaidiaje leo?`,
    }
    return messages[lang as keyof typeof messages] || messages.en
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "escalated":
        return "bg-yellow-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Start Your Support Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <Label htmlFor="business">Business Type</Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your business type" />
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
              <Label htmlFor="language">Preferred Language</Label>
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
              <Label htmlFor="provider">AI Provider</Label>
              <Select value={aiProvider} onValueChange={setAiProvider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                  <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                  <SelectItem value="google">Google Gemini</SelectItem>
                  <SelectItem value="groq">Groq Llama</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={createSession} disabled={!email || !businessType || isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Session...
                </>
              ) : (
                "Start Chat Session"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex justify-between items-center">
            <CardTitle>AI Support Chat</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{session.businessType}</Badge>
              <Badge variant="outline">{session.language.toUpperCase()}</Badge>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`} />
              <span className="text-sm text-muted-foreground capitalize">{session.status}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">{message.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-gray-200 text-gray-700">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                disabled={isLoading}
              />
              <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EnhancedChatInterface
