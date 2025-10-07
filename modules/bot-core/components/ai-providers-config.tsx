"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Zap, MessageSquare, Settings, CheckCircle, AlertCircle, ExternalLink, Gift } from "lucide-react"

interface AIProvider {
  id: string
  name: string
  description: string
  strengths: string[]
  useCase: string
  speed: "fast" | "medium" | "slow"
  accuracy: "high" | "medium" | "low"
  cost: "free" | "low" | "medium" | "high"
  enabled: boolean
  icon: string
  setupUrl: string
  freeCredits?: string
}

export default function AIProvidersConfig() {
  const [providers, setProviders] = useState<AIProvider[]>([
    {
      id: "gemini-flash",
      name: "Google Gemini Flash",
      description: "Fast, free, and highly capable AI model from Google",
      strengths: ["Completely free", "Very fast", "Excellent reasoning", "Multi-language support"],
      useCase: "Perfect for all queries - fast, free, and reliable",
      speed: "fast",
      accuracy: "high",
      cost: "free",
      enabled: true,
      icon: "🔥",
      setupUrl: "https://makersuite.google.com/app/apikey",
      freeCredits: "Completely free with generous rate limits",
    },
    {
      id: "gemini-pro",
      name: "Google Gemini Pro",
      description: "Advanced reasoning for complex queries",
      strengths: ["Free tier available", "Advanced reasoning", "Long context", "Multi-modal"],
      useCase: "Complex queries, detailed analysis, multi-step reasoning",
      speed: "medium",
      accuracy: "high",
      cost: "free",
      enabled: true,
      icon: "🧠",
      setupUrl: "https://makersuite.google.com/app/apikey",
      freeCredits: "Free tier with pay-as-you-go for heavy usage",
    },
    {
      id: "groq-llama",
      name: "Groq Llama 3.1 70B",
      description: "Ultra-fast inference for real-time responses",
      strengths: ["Lightning fast", "Good reasoning", "Free tier", "Open source"],
      useCase: "Quick responses, simple queries, real-time analysis",
      speed: "fast",
      accuracy: "high",
      cost: "free",
      enabled: true,
      icon: "⚡",
      setupUrl: "https://console.groq.com/keys",
      freeCredits: "Free tier with generous limits",
    },
    {
      id: "openai-gpt4",
      name: "OpenAI GPT-4o",
      description: "Advanced reasoning and complex problem solving",
      strengths: ["Complex reasoning", "Multi-language support", "Context understanding"],
      useCase: "Complex queries, banking security, detailed explanations",
      speed: "medium",
      accuracy: "high",
      cost: "high",
      enabled: false,
      icon: "🤖",
      setupUrl: "https://platform.openai.com/api-keys",
      freeCredits: "$5 free credits for new accounts",
    },
    {
      id: "anthropic-claude",
      name: "Anthropic Claude",
      description: "Excellent for nuanced understanding and safety",
      strengths: ["Safety focused", "Nuanced understanding", "Ethical reasoning"],
      useCase: "Sensitive topics, complaint handling, ethical decisions",
      speed: "medium",
      accuracy: "high",
      cost: "medium",
      enabled: false,
      icon: "🛡️",
      setupUrl: "https://console.anthropic.com/",
      freeCredits: "$5 free credits for new accounts",
    },
    {
      id: "huggingface",
      name: "Hugging Face Inference",
      description: "Free access to open-source models",
      strengths: ["Completely free", "Many models", "Open source", "No credit card needed"],
      useCase: "Fallback option, experimentation, cost-sensitive applications",
      speed: "medium",
      accuracy: "medium",
      cost: "free",
      enabled: false,
      icon: "🤗",
      setupUrl: "https://huggingface.co/settings/tokens",
      freeCredits: "Completely free with rate limits",
    },
  ])

  const toggleProvider = (id: string) => {
    setProviders((prev) =>
      prev.map((provider) => (provider.id === id ? { ...provider, enabled: !provider.enabled } : provider)),
    )
  }

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case "fast":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      default:
        return "text-red-600"
    }
  }

  const getAccuracyColor = (accuracy: string) => {
    switch (accuracy) {
      case "high":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      default:
        return "text-red-600"
    }
  }

  const getCostColor = (cost: string) => {
    switch (cost) {
      case "free":
        return "text-green-600"
      case "low":
        return "text-blue-600"
      case "medium":
        return "text-yellow-600"
      default:
        return "text-red-600"
    }
  }

  const freeProviders = providers.filter((p) => p.cost === "free")
  const paidProviders = providers.filter((p) => p.cost !== "free")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Providers Configuration
          </CardTitle>
          <CardDescription>
            Configure AI providers with priority on free options. Google Gemini is recommended as the primary provider.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="free" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="free">Free Providers</TabsTrigger>
          <TabsTrigger value="paid">Paid Providers</TabsTrigger>
          <TabsTrigger value="setup">Quick Setup</TabsTrigger>
          <TabsTrigger value="testing">Test APIs</TabsTrigger>
        </TabsList>

        <TabsContent value="free" className="space-y-4">
          {/* Recommended Setup */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Gift className="h-5 w-5" />
                Recommended Free Setup
              </CardTitle>
              <CardDescription className="text-green-700">
                Get started immediately with these completely free AI providers. No credit card required!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-green-800">
                <h4 className="font-medium mb-2">Priority Order (Recommended):</h4>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>
                    <strong>Google Gemini Flash</strong> - Primary (completely free, very fast)
                  </li>
                  <li>
                    <strong>Google Gemini Pro</strong> - Complex queries (free tier)
                  </li>
                  <li>
                    <strong>Groq Llama 3.1</strong> - Backup (free tier, ultra-fast)
                  </li>
                  <li>
                    <strong>Hugging Face</strong> - Fallback (free with rate limits)
                  </li>
                </ol>
              </div>
              <div className="p-3 bg-green-100 border border-green-300 rounded text-sm text-green-800">
                <strong>💡 Pro Tip:</strong> Start with Google Gemini - it's completely free, has generous rate limits,
                and performs excellently for customer support use cases.
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freeProviders.map((provider) => (
              <Card key={provider.id} className={`relative ${provider.enabled ? "ring-2 ring-green-200" : ""}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="text-2xl">{provider.icon}</span>
                      {provider.name}
                      <Badge className="bg-green-100 text-green-800 border-green-200">FREE</Badge>
                    </CardTitle>
                    <Switch checked={provider.enabled} onCheckedChange={() => toggleProvider(provider.id)} />
                  </div>
                  <CardDescription>{provider.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className={`font-medium ${getSpeedColor(provider.speed)}`}>
                        {provider.speed.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">Speed</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-medium ${getAccuracyColor(provider.accuracy)}`}>
                        {provider.accuracy.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-medium ${getCostColor(provider.cost)}`}>FREE</div>
                      <div className="text-xs text-gray-500">Cost</div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Strengths:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {provider.strengths.map((strength, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Best for:</Label>
                    <p className="text-sm text-gray-600 mt-1">{provider.useCase}</p>
                  </div>

                  {provider.freeCredits && (
                    <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                      <strong>Free Credits:</strong> {provider.freeCredits}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => window.open(provider.setupUrl, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Get Free API Key
                  </Button>

                  {provider.enabled && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Active
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paid" className="space-y-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Settings className="h-5 w-5" />
                Premium AI Providers
              </CardTitle>
              <CardDescription className="text-blue-700">
                These providers offer advanced capabilities but require payment. Consider these after exhausting free
                options.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paidProviders.map((provider) => (
              <Card key={provider.id} className={`relative ${provider.enabled ? "ring-2 ring-blue-200" : ""}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="text-2xl">{provider.icon}</span>
                      {provider.name}
                    </CardTitle>
                    <Switch checked={provider.enabled} onCheckedChange={() => toggleProvider(provider.id)} />
                  </div>
                  <CardDescription>{provider.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className={`font-medium ${getSpeedColor(provider.speed)}`}>
                        {provider.speed.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">Speed</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-medium ${getAccuracyColor(provider.accuracy)}`}>
                        {provider.accuracy.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-medium ${getCostColor(provider.cost)}`}>{provider.cost.toUpperCase()}</div>
                      <div className="text-xs text-gray-500">Cost</div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Strengths:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {provider.strengths.map((strength, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Best for:</Label>
                    <p className="text-sm text-gray-600 mt-1">{provider.useCase}</p>
                  </div>

                  {provider.freeCredits && (
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                      <strong>Free Trial:</strong> {provider.freeCredits}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => window.open(provider.setupUrl, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Get API Key
                  </Button>

                  {provider.enabled && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Active
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Setup Guide
              </CardTitle>
              <CardDescription>Get your AI customer support system running in 5 minutes with free APIs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">
                      1
                    </span>
                    Google Gemini (Recommended - Completely Free)
                  </h3>
                  <div className="space-y-2 text-sm ml-8">
                    <div>
                      1. Visit{" "}
                      <a
                        href="https://makersuite.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Google AI Studio
                      </a>
                    </div>
                    <div>2. Sign in with your Google account</div>
                    <div>3. Click "Create API Key" → "Create API key in new project"</div>
                    <div>4. Copy the API key</div>
                    <div>
                      5. Add to your environment:{" "}
                      <code className="bg-gray-100 px-1 rounded">GOOGLE_GENERATIVE_AI_API_KEY=your_key_here</code>
                    </div>
                    <div className="p-2 bg-green-50 border border-green-200 rounded text-green-700">
                      ✅ <strong>Completely free</strong> with generous rate limits - perfect for production use!
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                      2
                    </span>
                    Groq (Backup - Free & Fast)
                  </h3>
                  <div className="space-y-2 text-sm ml-8">
                    <div>
                      1. Visit{" "}
                      <a
                        href="https://console.groq.com/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Groq Console
                      </a>
                    </div>
                    <div>2. Sign up with email or Google</div>
                    <div>3. Go to API Keys → Create API Key</div>
                    <div>4. Copy the API key</div>
                    <div>
                      5. Add to your environment:{" "}
                      <code className="bg-gray-100 px-1 rounded">GROQ_API_KEY=your_key_here</code>
                    </div>
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded text-blue-700">
                      ⚡ <strong>Ultra-fast inference</strong> with free tier - great for real-time responses!
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">
                      3
                    </span>
                    Hugging Face (Fallback - Free)
                  </h3>
                  <div className="space-y-2 text-sm ml-8">
                    <div>
                      1. Visit{" "}
                      <a
                        href="https://huggingface.co/settings/tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Hugging Face Tokens
                      </a>
                    </div>
                    <div>2. Sign up with email or Google</div>
                    <div>3. Click "New token" → "Read" access</div>
                    <div>4. Copy the token</div>
                    <div>
                      5. Add to your environment:{" "}
                      <code className="bg-gray-100 px-1 rounded">HUGGINGFACE_API_KEY=your_token_here</code>
                    </div>
                    <div className="p-2 bg-purple-50 border border-purple-200 rounded text-purple-700">
                      🤗 <strong>Open source models</strong> - completely free with rate limits
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Environment Variables Setup</h4>
                <div className="text-sm text-yellow-700 space-y-1">
                  <div>Create a `.env.local` file in your project root:</div>
                  <div className="bg-yellow-100 p-2 rounded font-mono text-xs">
                    GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key_here
                    <br />
                    GROQ_API_KEY=your_groq_key_here
                    <br />
                    HUGGINGFACE_API_KEY=your_hf_token_here
                  </div>
                  <div>Restart your development server after adding the keys</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Test Your API Connections
              </CardTitle>
              <CardDescription>Test all configured AI providers to ensure they're working correctly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">🔥 Test Google Gemini</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GeminiTestPanel />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">🆓 Test Free APIs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FreeAPIsTestPanel />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Gemini Test Component
function GeminiTestPanel() {
  const [testMessage, setTestMessage] = useState("Hello, I need help with my data bundle.")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)
  const [errorDetails, setErrorDetails] = useState("")

  const testGemini = async () => {
    setIsLoading(true)
    setTestResult(null)
    setErrorDetails("")
    setResponse("")

    try {
      const res = await fetch("/api/gemini-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: testMessage }),
      })

      const data = await res.json()

      if (data.success) {
        setTestResult("success")
        setResponse(data.response)
      } else {
        setTestResult("error")
        setErrorDetails(data.error + (data.details ? `: ${data.details}` : ""))
      }
    } catch (error) {
      setTestResult("error")
      setErrorDetails("Network error: Could not connect to API")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Test Message</Label>
        <input
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          placeholder="Enter a test message..."
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <Button onClick={testGemini} disabled={isLoading || !testMessage.trim()} className="w-full">
        {isLoading ? "Testing..." : "Test Gemini"}
      </Button>

      {testResult === "success" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">Success!</span>
            <Badge variant="secondary">FREE</Badge>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">{response}</div>
        </div>
      )}

      {testResult === "error" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Error</span>
          </div>
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">{errorDetails}</div>
        </div>
      )}
    </div>
  )
}

// Free APIs Test Component
function FreeAPIsTestPanel() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const testFreeAPIs = async () => {
    setIsLoading(true)
    setResults([])

    try {
      const res = await fetch("/api/free-apis-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Hello, test message" }),
      })

      const data = await res.json()
      setResults(data.results || [])
    } catch (error) {
      setResults([
        {
          name: "Test Failed",
          status: "error",
          error: "Could not run API tests",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={testFreeAPIs} disabled={isLoading} className="w-full">
        {isLoading ? "Testing All Free APIs..." : "Test Free APIs"}
      </Button>

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((result, index) => (
            <div key={index} className="p-3 border rounded text-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{result.name}</span>
                <Badge variant={result.status === "success" ? "default" : "destructive"} className="text-xs">
                  {result.status}
                </Badge>
              </div>
              {result.status === "success" && <div className="text-green-600">✅ Working correctly</div>}
              {result.status === "error" && <div className="text-red-600">❌ {result.error}</div>}
              {result.status === "missing_key" && <div className="text-yellow-600">⚠️ API key not configured</div>}
              {result.setup && <div className="text-xs text-gray-500 mt-1">{result.setup}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
