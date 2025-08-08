'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User, Globe, Clock } from 'lucide-react'
import AIAnalysisPanel from '@/components/ai-analysis-panel'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  language?: string
  context?: string[]
}

interface ChatInterfaceProps {
  businessType: string
}

export default function ChatInterface({ businessType }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI customer support assistant. I can help you in English, Luganda, or Swahili. How can I assist you today?',
      timestamp: new Date(),
      language: 'en',
      context: ['greeting', 'multilingual']
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const [questionAnalysis, setQuestionAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'lg', name: 'Luganda', flag: '🇺🇬' },
    { code: 'sw', name: 'Swahili', flag: '🇰🇪' }
  ]

  const businessContexts = {
    telecom: {
      commonIssues: ['data bundles', 'network coverage', 'billing', 'roaming'],
      localTerms: { 'bundles': 'data packages', 'airtime': 'credit' }
    },
    banking: {
      commonIssues: ['account balance', 'mobile money', 'loan application', 'card issues'],
      localTerms: { 'mobile money': 'mobile banking', 'sente': 'money' }
    },
    utilities: {
      commonIssues: ['power outage', 'water supply', 'billing', 'meter reading'],
      localTerms: { 'masanyu': 'electricity', 'amazzi': 'water' }
    },
    ecommerce: {
      commonIssues: ['order tracking', 'delivery', 'payment', 'returns'],
      localTerms: { 'boda': 'motorcycle taxi', 'delivery': 'bringing items' }
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
      language: selectedLanguage
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    setIsAnalyzing(true)

    try {
      // Call the enhanced API with AI analysis
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content
          })),
          businessType,
          language: selectedLanguage,
          useAdvancedNLP: true
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Check if escalation is needed
      if (data.escalate) {
        const escalationMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: `I understand this requires special attention. Let me connect you with a human agent who can better assist you. Reason: ${data.reason}`,
          timestamp: new Date(),
          language: selectedLanguage,
          context: ['escalation', 'human_agent']
        }
        setMessages(prev => [...prev, escalationMessage])
        setQuestionAnalysis(data.analysis)
        setIsAnalyzing(false)
        setIsTyping(false)
        return
      }

      // Handle fallback response (when AI services are unavailable)
      if (data.fallback || data.content) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: data.content || data.message || 'I apologize, but I encountered an issue. Please try again.',
          timestamp: new Date(),
          language: selectedLanguage,
          context: data.fallback ? ['fallback', 'basic_response'] : ['ai_response', businessType]
        }
        setMessages(prev => [...prev, botMessage])
        setQuestionAnalysis(data.analysis)
        setIsAnalyzing(false)
        setIsTyping(false)
        return
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      let botResponse = ''
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: '',
        timestamp: new Date(),
        language: selectedLanguage,
        context: ['ai_response', businessType]
      }
      
      setMessages(prev => [...prev, botMessage])
      setIsAnalyzing(false)

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = new TextDecoder().decode(value)
          botResponse += chunk
          
          setMessages(prev => prev.map(msg => 
            msg.id === botMessage.id 
              ? { ...msg, content: botResponse }
              : msg
          ))
        }
      }
      
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: selectedLanguage === 'lg' 
          ? 'Nsonyiwa, nfunye obuzibu. Ddamu ogezaako.'
          : 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
        timestamp: new Date(),
        language: selectedLanguage,
        context: ['error', 'fallback']
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
      setIsAnalyzing(false)
    }
  }

  const generateContextualResponse = (query: string, business: string, language: string) => {
    const context = businessContexts[business as keyof typeof businessContexts]
    const lowerQuery = query.toLowerCase()
    
    // Context-aware response generation
    let response = ''
    let contextTags: string[] = []

    if (lowerQuery.includes('data') || lowerQuery.includes('bundle')) {
      response = language === 'lg' 
        ? 'Nkutegeeza ku data bundles. Oyagala bundle ki? Tulina za daily, weekly ne monthly.'
        : 'I can help you with data bundles. What type of bundle do you need? We have daily, weekly, and monthly options.'
      contextTags = ['data', 'bundles', business]
    } else if (lowerQuery.includes('bill') || lowerQuery.includes('payment')) {
      response = language === 'lg'
        ? 'Nkuyinza okukuyamba ku bill yo. Wandiiko account number yo ndabe.'
        : 'I can help you with your bill. Please provide your account number so I can check.'
      contextTags = ['billing', 'payment', business]
    } else {
      response = language === 'lg'
        ? 'Nkutegeeza. Nnyonnyola ekibuuzo kyo obulungi ndyoke nkuyambe.'
        : 'I understand. Please explain your question in more detail so I can help you better.'
      contextTags = ['general', business]
    }

    return { content: response, context: contextTags }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Area */}
      <div className="lg:col-span-2">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Customer Support Chat
            </CardTitle>
            <div className="flex gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={selectedLanguage === lang.code ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLanguage(lang.code)}
                  className="flex items-center gap-1"
                >
                  <span>{lang.flag}</span>
                  {lang.name}
                </Button>
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.type === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.language && (
                          <Badge variant="secondary" className="text-xs">
                            {languages.find(l => l.code === message.language)?.flag}
                          </Badge>
                        )}
                      </div>
                      <p>{message.content}</p>
                      {message.context && (
                        <div className="flex gap-1 mt-2">
                          {message.context.map((ctx, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ctx}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex gap-2 mt-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Type your message in ${languages.find(l => l.code === selectedLanguage)?.name}...`}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isTyping}
              />
              <Button onClick={handleSendMessage} disabled={isTyping || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Context Panel */}
      <div className="space-y-4">
        <AIAnalysisPanel 
          analysis={questionAnalysis} 
          isAnalyzing={isAnalyzing}
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="outline">Business: {businessType}</Badge>
              <Badge variant="outline">Language: {selectedLanguage}</Badge>
              <Badge variant="outline">Session: Active</Badge>
              {questionAnalysis && (
                <Badge variant="outline">AI: Enhanced</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Common Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {businessContexts[businessType as keyof typeof businessContexts]?.commonIssues.map((issue, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => setInput(`I need help with ${issue}`)}
                >
                  {issue}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
