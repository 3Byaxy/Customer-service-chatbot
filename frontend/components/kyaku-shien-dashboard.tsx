"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Globe,
  Zap,
  Brain,
  Shield,
} from "lucide-react"
import { KYAKU_SHIEN_BRAND } from "../../backend/config/branding-system"

interface DashboardStats {
  totalConversations: number
  activeUsers: number
  resolvedTickets: number
  averageResponseTime: number
  satisfactionScore: number
  aiAccuracy: number
  escalationRate: number
  languageDistribution: { [key: string]: number }
}

interface RecentActivity {
  id: string
  type: "conversation" | "escalation" | "resolution" | "feedback"
  message: string
  timestamp: Date
  priority: "low" | "medium" | "high" | "critical"
  language?: string
}

export default function KyakuShienDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalConversations: 0,
    activeUsers: 0,
    resolvedTickets: 0,
    averageResponseTime: 0,
    satisfactionScore: 0,
    aiAccuracy: 0,
    escalationRate: 0,
    languageDistribution: {},
  })

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      setStats({
        totalConversations: 1247,
        activeUsers: 89,
        resolvedTickets: 1156,
        averageResponseTime: 2.3,
        satisfactionScore: 4.6,
        aiAccuracy: 94.2,
        escalationRate: 7.3,
        languageDistribution: {
          English: 65,
          Luganda: 25,
          Swahili: 10,
        },
      })

      setRecentActivity([
        {
          id: "1",
          type: "conversation",
          message: "New conversation started with customer about data bundle inquiry",
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          priority: "medium",
          language: "English",
        },
        {
          id: "2",
          type: "resolution",
          message: "Billing issue resolved automatically by KizunaAI",
          timestamp: new Date(Date.now() - 12 * 60 * 1000),
          priority: "low",
          language: "Luganda",
        },
        {
          id: "3",
          type: "escalation",
          message: "Complex technical issue escalated to human agent",
          timestamp: new Date(Date.now() - 18 * 60 * 1000),
          priority: "high",
          language: "English",
        },
        {
          id: "4",
          type: "feedback",
          message: "Customer rated interaction 5/5 stars",
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
          priority: "low",
          language: "Swahili",
        },
        {
          id: "5",
          type: "conversation",
          message: "Mobile money transfer assistance completed",
          timestamp: new Date(Date.now() - 32 * 60 * 1000),
          priority: "medium",
          language: "Luganda",
        },
      ])

      setIsLoading(false)
    }

    loadDashboardData()

    // Set up real-time updates
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        totalConversations: prev.totalConversations + Math.floor(Math.random() * 3),
        activeUsers: Math.max(50, prev.activeUsers + Math.floor(Math.random() * 10) - 5),
      }))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return KYAKU_SHIEN_BRAND.colors.danger
      case "high":
        return KYAKU_SHIEN_BRAND.colors.warning
      case "medium":
        return KYAKU_SHIEN_BRAND.colors.primary
      case "low":
        return KYAKU_SHIEN_BRAND.colors.success
      default:
        return KYAKU_SHIEN_BRAND.colors.neutral[400]
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "conversation":
        return MessageSquare
      case "escalation":
        return AlertTriangle
      case "resolution":
        return CheckCircle
      case "feedback":
        return TrendingUp
      default:
        return Activity
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
            style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.primary }}
          >
            <Shield className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2
            className="text-xl font-semibold text-gray-900"
            style={{ fontFamily: KYAKU_SHIEN_BRAND.typography.fontFamily.heading }}
          >
            Loading KyakuShien Dashboard...
          </h2>
          <div className="w-64 mx-auto">
            <Progress value={75} className="h-2" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: KYAKU_SHIEN_BRAND.typography.fontFamily.heading }}
            >
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-1" style={{ fontFamily: KYAKU_SHIEN_BRAND.typography.fontFamily.primary }}>
              Real-time insights into your AI customer support system
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
            <Badge
              variant="outline"
              style={{ borderColor: KYAKU_SHIEN_BRAND.colors.success, color: KYAKU_SHIEN_BRAND.colors.success }}
            >
              All Systems Operational
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalConversations.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% from last week
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${KYAKU_SHIEN_BRAND.colors.primary}20` }}
                >
                  <MessageSquare className="h-6 w-6" style={{ color: KYAKU_SHIEN_BRAND.colors.primary }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
                  <p className="text-sm text-blue-600 flex items-center mt-1">
                    <Users className="h-3 w-3 mr-1" />
                    Currently online
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${KYAKU_SHIEN_BRAND.colors.accent}20` }}
                >
                  <Users className="h-6 w-6" style={{ color: KYAKU_SHIEN_BRAND.colors.accent }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {((stats.resolvedTickets / stats.totalConversations) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {stats.resolvedTickets} resolved
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${KYAKU_SHIEN_BRAND.colors.success}20` }}
                >
                  <CheckCircle className="h-6 w-6" style={{ color: KYAKU_SHIEN_BRAND.colors.success }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.averageResponseTime}s</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    -0.3s improvement
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${KYAKU_SHIEN_BRAND.colors.warning}20` }}
                >
                  <Clock className="h-6 w-6" style={{ color: KYAKU_SHIEN_BRAND.colors.warning }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" style={{ color: KYAKU_SHIEN_BRAND.colors.primary }} />
                <span>AI Performance</span>
              </CardTitle>
              <CardDescription>KizunaAI accuracy and efficiency metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">AI Accuracy</span>
                  <span className="text-sm text-gray-600">{stats.aiAccuracy}%</span>
                </div>
                <Progress value={stats.aiAccuracy} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Customer Satisfaction</span>
                  <span className="text-sm text-gray-600">{stats.satisfactionScore}/5.0</span>
                </div>
                <Progress value={(stats.satisfactionScore / 5) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Escalation Rate</span>
                  <span className="text-sm text-gray-600">{stats.escalationRate}%</span>
                </div>
                <Progress value={stats.escalationRate} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" style={{ color: KYAKU_SHIEN_BRAND.colors.accent }} />
                <span>Language Distribution</span>
              </CardTitle>
              <CardDescription>Conversations by language preference</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(stats.languageDistribution).map(([language, percentage]) => (
                <div key={language}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{language}</span>
                    <span className="text-sm text-gray-600">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" style={{ color: KYAKU_SHIEN_BRAND.colors.primary }} />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest system events and customer interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type)
                  return (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${getPriorityColor(activity.priority)}20` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: getPriorityColor(activity.priority) }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {activity.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {activity.language && (
                            <Badge variant="outline" className="text-xs">
                              {activity.language}
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                            style={{ borderColor: getPriorityColor(activity.priority) }}
                          >
                            {activity.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" style={{ color: KYAKU_SHIEN_BRAND.colors.warning }} />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                style={{ borderColor: KYAKU_SHIEN_BRAND.colors.primary }}
              >
                <MessageSquare className="h-5 w-5" />
                <span className="text-sm">View Conversations</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                style={{ borderColor: KYAKU_SHIEN_BRAND.colors.accent }}
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-sm">Analytics</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                style={{ borderColor: KYAKU_SHIEN_BRAND.colors.success }}
              >
                <Users className="h-5 w-5" />
                <span className="text-sm">User Management</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                style={{ borderColor: KYAKU_SHIEN_BRAND.colors.warning }}
              >
                <Shield className="h-5 w-5" />
                <span className="text-sm">System Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
