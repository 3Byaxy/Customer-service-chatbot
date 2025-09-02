"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Activity,
  Bot,
  Users,
  MessageSquare,
  Globe,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Shield,
  BarChart3,
  RefreshCw,
} from "lucide-react"
import { APP_CONFIG } from "../../backend/config/app-config"

interface DashboardStats {
  appInfo: {
    name: string
    chatbotName: string
    version: string
    uptime: string
  }
  realTimeMetrics: {
    activeConversations: number
    totalUsers: number
    messagesProcessed: number
    averageResponseTime: number
    kizunaAiResponses: number
    approvalsPending: number
  }
  languageStats: {
    english: number
    luganda: number
    swahili: number
  }
  businessTypeStats: {
    telecom: number
    banking: number
    utilities: number
    ecommerce: number
  }
  aiProviderStats: {
    gemini: number
    anthropic: number
    groq: number
    openai: number
  }
  systemHealth: {
    database: string
    aiProviders: string
    voiceServices: string
    realtimeServices: string
    overallStatus: string
  }
  recentActivity: Array<{
    id: string
    type: string
    message: string
    timestamp: string
    severity: string
  }>
}

export default function KyakuShienDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    fetchDashboardStats()
    const interval = setInterval(fetchDashboardStats, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/backend/api/admin/dashboard-stats")
      const data = await response.json()
      setStats(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "operational":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {APP_CONFIG.name} Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Dashboard Unavailable</h3>
            <p className="text-gray-600 mb-4">Unable to load dashboard statistics</p>
            <Button onClick={fetchDashboardStats}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{stats.appInfo.name}</h1>
                <p className="text-gray-600">
                  Powered by {stats.appInfo.chatbotName} • Version {stats.appInfo.version}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${stats.systemHealth.overallStatus === "operational" ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span className="text-sm font-medium">System {stats.systemHealth.overallStatus}</span>
                </div>
                <p className="text-xs text-gray-500">Uptime: {stats.appInfo.uptime}</p>
              </div>

              <Button variant="outline" onClick={fetchDashboardStats}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Conversations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.realTimeMetrics.activeConversations}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{APP_CONFIG.chatbot.name} Responses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.realTimeMetrics.kizunaAiResponses}</p>
                </div>
                <Bot className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.realTimeMetrics.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.realTimeMetrics.approvalsPending}</p>
                </div>
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="business">Business Types</TabsTrigger>
            <TabsTrigger value="ai-providers">AI Providers</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>Real-time system metrics and health status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Response Time</span>
                    <span className="text-sm text-gray-600">{stats.realTimeMetrics.averageResponseTime}ms</span>
                  </div>
                  <Progress value={Math.min(stats.realTimeMetrics.averageResponseTime / 10, 100)} />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Messages Processed</span>
                    <span className="text-sm text-gray-600">{stats.realTimeMetrics.messagesProcessed}</span>
                  </div>
                  <Progress value={Math.min(stats.realTimeMetrics.messagesProcessed / 100, 100)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Status of all system components</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(stats.systemHealth).map(([component, status]) => (
                    <div key={component} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {component.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <Badge variant={status === "healthy" || status === "operational" ? "default" : "destructive"}>
                        {status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="languages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language Distribution
                </CardTitle>
                <CardDescription>Usage statistics by language</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.languageStats).map(([language, percentage]) => (
                    <div key={language} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{language}</span>
                        <span className="text-sm text-gray-600">{percentage}%</span>
                      </div>
                      <Progress value={percentage} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Business Type Distribution
                </CardTitle>
                <CardDescription>Usage by business sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.businessTypeStats).map(([type, percentage]) => (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{type}</span>
                        <span className="text-sm text-gray-600">{percentage}%</span>
                      </div>
                      <Progress value={percentage} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-providers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI Provider Usage
                </CardTitle>
                <CardDescription>Distribution of AI provider usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.aiProviderStats).map(([provider, percentage]) => (
                    <div key={provider} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{provider}</span>
                        <span className="text-sm text-gray-600">{percentage}%</span>
                      </div>
                      <Progress value={percentage} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest system events and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {stats.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        {getSeverityIcon(activity.severity)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">
            🤖 {APP_CONFIG.name} • Powered by {APP_CONFIG.chatbot.name} • Last updated:{" "}
            {lastUpdate.toLocaleTimeString()}
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="outline">Multi-language Support</Badge>
            <Badge variant="outline">Voice Integration</Badge>
            <Badge variant="outline">Admin Approval System</Badge>
            <Badge variant="outline">Real-time Monitoring</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
