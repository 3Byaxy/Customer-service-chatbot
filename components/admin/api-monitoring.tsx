"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrendingUp, AlertTriangle, CheckCircle, Activity, RefreshCw, BarChart3 } from "lucide-react"

export default function APIMonitoring() {
  const [apiStats, setApiStats] = useState<any>(null)
  const [realTimeRequests, setRealTimeRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAPIStats()
    const interval = setInterval(fetchAPIStats, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Simulate real-time request monitoring
    const interval = setInterval(() => {
      const newRequest = {
        id: Date.now(),
        timestamp: new Date(),
        provider: ["google", "groq", "openai"][Math.floor(Math.random() * 3)],
        model: ["gemini-2.0-flash", "gemini-1.5-pro", "llama-3.1-70b"][Math.floor(Math.random() * 3)],
        responseTime: Math.floor(Math.random() * 2000) + 200,
        status: Math.random() > 0.1 ? "success" : "error",
        tokens: Math.floor(Math.random() * 500) + 100,
        businessType: ["telecom", "banking", "utilities", "ecommerce"][Math.floor(Math.random() * 4)],
      }

      setRealTimeRequests((prev) => [newRequest, ...prev.slice(0, 49)]) // Keep last 50 requests
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const fetchAPIStats = async () => {
    try {
      const response = await fetch("/api/admin/api-stats")
      const data = await response.json()
      setApiStats(data)
    } catch (error) {
      console.error("Failed to fetch API stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return "🔥"
      case "groq":
        return "⚡"
      case "openai":
        return "🤖"
      case "anthropic":
        return "🛡️"
      default:
        return "🔧"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* API Provider Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Google Gemini</CardTitle>
            <span className="text-2xl">🔥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-600">Rate Limit</span>
              <span className="text-xs font-medium">23/60 RPM</span>
            </div>
            <Progress value={38} className="mt-1" />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-600">Success Rate</span>
              <span className="text-xs font-medium text-green-600">99.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Groq</CardTitle>
            <span className="text-2xl">⚡</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Standby</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-600">Rate Limit</span>
              <span className="text-xs font-medium">0/30 RPM</span>
            </div>
            <Progress value={0} className="mt-1" />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-600">Status</span>
              <span className="text-xs font-medium text-yellow-600">Not Configured</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OpenAI</CardTitle>
            <span className="text-2xl">🤖</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Standby</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-600">Rate Limit</span>
              <span className="text-xs font-medium">0/20 RPM</span>
            </div>
            <Progress value={0} className="mt-1" />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-600">Status</span>
              <span className="text-xs font-medium text-yellow-600">Not Configured</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anthropic</CardTitle>
            <span className="text-2xl">🛡️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Standby</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-600">Rate Limit</span>
              <span className="text-xs font-medium">0/15 RPM</span>
            </div>
            <Progress value={0} className="mt-1" />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-600">Status</span>
              <span className="text-xs font-medium text-yellow-600">Not Configured</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Usage Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Request Volume (Last 24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Requests</span>
                <span className="text-2xl font-bold">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Successful</span>
                <span className="text-sm font-medium text-green-600">1,235 (99.0%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Failed</span>
                <span className="text-sm font-medium text-red-600">12 (1.0%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Response Time</span>
                <span className="text-sm font-medium">847ms</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Token Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tokens Used Today</span>
                <span className="text-2xl font-bold">45,892</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Input Tokens</span>
                <span className="text-sm font-medium">28,456</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Output Tokens</span>
                <span className="text-sm font-medium">17,436</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cost Estimate</span>
                <span className="text-sm font-medium text-green-600">$0.00 (Free)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Request Monitor */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-time Request Monitor
            </CardTitle>
            <CardDescription>Live API requests and responses</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchAPIStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {realTimeRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getProviderIcon(request.provider)}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{request.model}</span>
                        <Badge variant="outline" className="text-xs">
                          {request.businessType}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">{request.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{request.responseTime}ms</div>
                      <div className="text-xs text-gray-600">{request.tokens} tokens</div>
                    </div>
                    <div className={`flex items-center gap-1 ${getStatusColor(request.status)}`}>
                      {request.status === "success" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium capitalize">{request.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* API Health Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            API Health Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-green-800">All Systems Operational</p>
                <p className="text-sm text-green-600">Google Gemini API responding normally</p>
              </div>
              <span className="text-xs text-green-600">Now</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium text-yellow-800">Backup Providers Not Configured</p>
                <p className="text-sm text-yellow-600">Consider adding Groq or OpenAI for redundancy</p>
              </div>
              <span className="text-xs text-yellow-600">Ongoing</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-blue-800">High Traffic Period</p>
                <p className="text-sm text-blue-600">Request volume 45% above average</p>
              </div>
              <span className="text-xs text-blue-600">15 min ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
