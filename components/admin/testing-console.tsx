"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import {
  Send,
  Play,
  Settings,
  MessageSquare,
  Brain,
  Zap,
  CheckCircle,
  AlertTriangle,
  Copy,
  Download,
} from "lucide-react"

export default function TestingConsole() {
  const [testMessage, setTestMessage] = useState("Hello, I need help with my data bundle.")
  const [businessType, setBusinessType] = useState("telecom")
  const [language, setLanguage] = useState("en")
  const [testResults, setTestResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [bulkTestData, setBulkTestData] = useState("")

  const businessTypes = [
    { id: "telecom", name: "Telecommunications", icon: "📱" },
    { id: "banking", name: "Banking", icon: "🏦" },
    { id: "utilities", name: "Utilities", icon: "⚡" },
    { id: "ecommerce", name: "E-commerce", icon: "🛒" },
  ]

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "lg", name: "Luganda", flag: "🇺🇬" },
    { code: "sw", name: "Swahili", flag: "🇰🇪" },
  ]

  const sampleQueries = {
    telecom: [
      "I need to buy a data bundle",
      "My network is not working",
      "How much is my bill this month?",
      "Nfuna obuzibu ku network yange", // Luganda
      "Nahitaji bundles za data", // Swahili
    ],
    banking: [
      "What is my account balance?",
      "I want to transfer money",
      "My card is not working",
      "Njagala okusindika sente", // Luganda
      "Nataka kuhamisha pesa", // Swahili
    ],
    utilities: [
      "There is no power in my area",
      "My water bill is too high",
      "When will the outage be fixed?",
      "Tetulinamasanyu mu kitundu kyaffe", // Luganda
      "Hakuna maji katika eneo langu", // Swahili
    ],
    ecommerce: [
      "Where is my order?",
      "I want to return this item",
      "Payment failed for my purchase",
      "Oda yange eri ludda wa?", // Luganda
      "Nataka kurudisha bidhaa hii", // Swahili
    ],
  }

  const runSingleTest = async () => {
    setIsLoading(true)
    const startTime = Date.now()

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: testMessage }],
          businessType,
          language,
          useAdvancedNLP: true,
        }),
      })

      const endTime = Date.now()
      const responseTime = endTime - startTime

      if (response.ok) {
        const data = await response.json()

        const result = {
          id: Date.now(),
          timestamp: new Date(),
          input: testMessage,
          businessType,
          language,
          responseTime,
          status: "success",
          output: data.content || "Response received",
          analysis: data.analysis,
          provider: response.headers.get("X-Model-Provider") || "unknown",
          escalated: data.escalate || false,
        }

        setTestResults((prev) => [result, ...prev])
      } else {
        const errorData = await response.json()
        const result = {
          id: Date.now(),
          timestamp: new Date(),
          input: testMessage,
          businessType,
          language,
          responseTime,
          status: "error",
          error: errorData.error || "Unknown error",
          provider: "none",
        }

        setTestResults((prev) => [result, ...prev])
      }
    } catch (error) {
      const result = {
        id: Date.now(),
        timestamp: new Date(),
        input: testMessage,
        businessType,
        language,
        responseTime: Date.now() - startTime,
        status: "error",
        error: "Network error",
        provider: "none",
      }

      setTestResults((prev) => [result, ...prev])
    } finally {
      setIsLoading(false)
    }
  }

  const runBulkTest = async () => {
    if (!bulkTestData.trim()) return

    setIsLoading(true)
    const queries = bulkTestData.split("\n").filter((q) => q.trim())

    for (const query of queries) {
      setTestMessage(query.trim())
      await runSingleTest()
      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    setIsLoading(false)
  }

  const runStressTest = async () => {
    setIsLoading(true)
    const queries = sampleQueries[businessType as keyof typeof sampleQueries]

    // Run multiple concurrent requests
    const promises = queries.map(async (query, index) => {
      await new Promise((resolve) => setTimeout(resolve, index * 500)) // Stagger requests
      setTestMessage(query)
      return runSingleTest()
    })

    await Promise.all(promises)
    setIsLoading(false)
  }

  const copyResult = (result: any) => {
    const text = JSON.stringify(result, null, 2)
    navigator.clipboard.writeText(text)
  }

  const exportResults = () => {
    const data = JSON.stringify(testResults, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `test-results-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="single" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="single">Single Test</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Test</TabsTrigger>
          <TabsTrigger value="stress">Stress Test</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Single Message Test
              </CardTitle>
              <CardDescription>Test individual messages with different configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business-type">Business Type</Label>
                  <select
                    id="business-type"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    {businessTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="test-message">Test Message</Label>
                <Textarea
                  id="test-message"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Enter your test message..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Sample Queries</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sampleQueries[businessType as keyof typeof sampleQueries]?.map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setTestMessage(query)}
                      className="text-xs"
                    >
                      {query.length > 30 ? query.substring(0, 30) + "..." : query}
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={runSingleTest} disabled={isLoading || !testMessage.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Testing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Run Test
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Bulk Message Test
              </CardTitle>
              <CardDescription>Test multiple messages at once (one per line)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bulk-data">Test Messages (one per line)</Label>
                <Textarea
                  id="bulk-data"
                  value={bulkTestData}
                  onChange={(e) => setBulkTestData(e.target.value)}
                  placeholder={`Enter multiple test messages, one per line:
I need help with my account
My internet is not working
How do I pay my bill?
Nfuna obuzibu ku network yange`}
                  rows={8}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Business Type</Label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    {businessTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Language</Label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button onClick={runBulkTest} disabled={isLoading || !bulkTestData.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Running Bulk Test...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Bulk Test
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Stress Test
              </CardTitle>
              <CardDescription>Test system performance with concurrent requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Stress Test Warning</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  This will send multiple concurrent requests to test system performance. Use carefully to avoid hitting
                  API rate limits.
                </p>
              </div>

              <div>
                <Label>Business Type for Stress Test</Label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  {businessTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Test Queries to be sent:</h4>
                <ul className="text-sm space-y-1">
                  {sampleQueries[businessType as keyof typeof sampleQueries]?.map((query, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      {query}
                    </li>
                  ))}
                </ul>
              </div>

              <Button onClick={runStressTest} disabled={isLoading} className="w-full" variant="destructive">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Running Stress Test...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Run Stress Test
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Test Results
                </CardTitle>
                <CardDescription>View and analyze test results ({testResults.length} tests)</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportResults}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={() => setTestResults([])}>
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {testResults.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No test results yet. Run some tests to see results here.
                    </div>
                  ) : (
                    testResults.map((result) => (
                      <div key={result.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {result.status === "success" ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            )}
                            <Badge variant="outline">{result.businessType}</Badge>
                            <Badge variant="outline">{result.language}</Badge>
                            <Badge variant="outline">{result.provider}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{result.responseTime}ms</span>
                            <Button variant="ghost" size="sm" onClick={() => copyResult(result)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">Input:</span>
                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-1">{result.input}</p>
                          </div>

                          {result.status === "success" ? (
                            <div>
                              <span className="text-sm font-medium">Output:</span>
                              <p className="text-sm text-gray-700 bg-green-50 p-2 rounded mt-1">{result.output}</p>
                            </div>
                          ) : (
                            <div>
                              <span className="text-sm font-medium">Error:</span>
                              <p className="text-sm text-red-700 bg-red-50 p-2 rounded mt-1">{result.error}</p>
                            </div>
                          )}

                          {result.analysis && (
                            <div>
                              <span className="text-sm font-medium">AI Analysis:</span>
                              <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded mt-1">
                                <div>Intent: {result.analysis.intent}</div>
                                <div>Sentiment: {result.analysis.sentiment?.polarity}</div>
                                <div>Urgency: {result.analysis.urgency}</div>
                              </div>
                            </div>
                          )}

                          {result.escalated && (
                            <div className="flex items-center gap-2 text-orange-600">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-sm font-medium">Escalated to Human</span>
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-gray-500 mt-2">{result.timestamp.toLocaleString()}</div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
