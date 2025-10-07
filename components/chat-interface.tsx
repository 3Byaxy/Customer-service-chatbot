'use client'

import AIAnalysisPanel from '@/components/ai-analysis-panel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Send, User, Globe, Copy, RefreshCw, Square } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { LanguageDetector, type LanguageDetectionResult } from '@/environment/language-detection'

interface Message {
  id: string
  type: 'user' | 'bot' | 'suggestion'
  content: string
  timestamp: Date
  language?: string
  context?: string[]
  richResults?: Array<{ id: string; name: string; price: string; badges?: string[]; url?: string }>
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

  // New: language detection + streaming controls
  const detectorRef = useRef<LanguageDetector | null>(null)
  const [detection, setDetection] = useState<LanguageDetectionResult | null>(null)
  const [autoLanguage, setAutoLanguage] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

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

  // Initialize detector once
  useEffect(() => {
    if (!detectorRef.current) {
      detectorRef.current = new LanguageDetector()
    }
  }, [])

  // Detect language as user types
  useEffect(() => {
    if (input.trim().length > 2 && detectorRef.current) {
      const result = detectorRef.current.detectLanguage(input)
      setDetection(result)
      if (autoLanguage && result?.suggestedResponse) {
        setSelectedLanguage(result.suggestedResponse)
      }
    } else {
      setDetection(null)
    }
  }, [input, autoLanguage])

  const stopStreaming = () => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
      setIsStreaming(false)
      setIsTyping(false)
    }
  }

  const copyMessage = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {}
  }

  const regenerateLast = async () => {
    const lastUser = [...messages].reverse().find(m => m.type === 'user')
    if (lastUser) {
      setInput(lastUser.content)
      await handleSendMessage(true)
    }
  }

  const handleSendMessage = async (isRegeneration = false) => {
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
      // Abort controller for streaming cancel
      const controller = new AbortController()
      abortRef.current = controller
      setIsStreaming(true)

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
        }),
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Try to peek headers for fallback/metadata
      const provider = response.headers.get('X-Model-Provider')
      const analysisAvailable = response.headers.get('X-Analysis-Available')

      // If it's JSON, handle non-stream path
      const contentType = response.headers.get('Content-Type') || ''
      if (contentType.includes('application/json')) {
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
          setIsStreaming(false)
          abortRef.current = null
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
          setIsStreaming(false)
          abortRef.current = null
          return
        }
      }
      
      // Handle streaming response
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

      // Handle fallback response (when AI services are unavailable) OR trusted results
      if (data.richResults || data.fallback || data.content) {
        if (data.content || data.message) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: data.content || data.message || 'I apologize, but I encountered an issue. Please try again.',
            timestamp: new Date(),
            language: selectedLanguage,
            context: data.fallback ? ['fallback', 'basic_response'] : ['ai_response', businessType]
          }
          setMessages(prev => [...prev, botMessage])
        }

        if (data.richResults && Array.isArray(data.richResults)) {
          const resultsMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: 'suggestion',
            content: 'Trusted results:',
            timestamp: new Date(),
            richResults: data.richResults.map((r: any) => ({ id: r.id, name: r.name, price: r.price, badges: r.badges, url: r.url })),
          }
          setMessages(prev => [...prev, resultsMessage])
        }

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
      setIsStreaming(false)
      abortRef.current = null
    }
  }

  const quickActionsByBusiness: Record<string, string[]> = {
    telecom: ['Check balance', 'Buy bundle', 'View plans'],
    banking: ['Check balance', 'Transfer money', 'Card issues'],
    utilities: ['Report outage', 'Check bill', 'New connection'],
    ecommerce: ['Track order', 'Return item', 'Payment issue']
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
            <div className="flex items-center gap-2">
              {detection && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  Detected: {detection.primaryLanguage.toUpperCase()} ({Math.round(detection.confidence * 100)}%)
                </Badge>
              )}
              <Button
                variant={autoLanguage ? 'default' : 'outline'}
                size="sm"
                className="text-xs"
                onClick={() => setAutoLanguage(v => !v)}
                title="Automatically switch reply language to detected"
              >
                Auto
              </Button>
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
                {messages.map((message, idx) => (
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

                      {/* Trusted results inline */}
                      {message.type === 'suggestion' && message.richResults && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {message.richResults.map((r) => (
                            <div key={r.id} className="border rounded p-2 bg-white text-gray-800">
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-sm line-clamp-1">{r.name}</div>
                                <div className="text-xs text-green-700 font-semibold">{r.price}</div>
                              </div>
                              {r.badges && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {r.badges.slice(0,3).map((b, i) => (
                                    <Badge key={i} variant="outline" className="text-[10px]">{b}</Badge>
                                  ))}
                                </div>
                              )}
                              {r.url && (
                                <div className="mt-2">
                                  <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={()=> window.open(r.url!, '_blank')}>View</Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions for bot messages */}
                      {message.type === 'bot' && (
                        <div className="flex gap-2 mt-2 text-xs">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => copyMessage(message.id, message.content)}
                          >
                            <Copy className="h-3 w-3 mr-1" /> {copiedId === message.id ? 'Copied!' : 'Copy'}
                          </Button>
                          {/* Show Regenerate on last bot message */}
                          {idx === messages.length - 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2"
                              onClick={regenerateLast}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" /> Regenerate
                            </Button>
                          )}
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
            
            {/* Detection info bar */}
            {detection && detection.confidence > 0.5 && (
              <div className="mt-2 text-xs text-gray-600 flex items-center gap-2">
                <Globe className="h-3 w-3" />
                Detected {detection.primaryLanguage.toUpperCase()} ({Math.round(detection.confidence * 100)}%)
                {detection.localTerms.length > 0 && (
                  <div className="flex gap-1 ml-2">
                    {detection.localTerms.slice(0, 2).map((t, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] h-4 px-1">
                        {t.term}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Type your message in ${languages.find(l => l.code === selectedLanguage)?.name}...`}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isTyping}
              />

              {isStreaming ? (
                <Button onClick={stopStreaming} variant="destructive">
                  <Square className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={() => handleSendMessage()} disabled={isTyping || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Quick actions aligned with README */}
            <div className="flex flex-wrap gap-2 mt-2">
              {(quickActionsByBusiness[businessType] || quickActionsByBusiness['telecom']).map((qa) => (
                <Button
                  key={qa}
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs bg-transparent"
                  onClick={() => setInput(qa)}
                >
                  {qa}
                </Button>
              ))}
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