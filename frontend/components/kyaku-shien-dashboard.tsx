"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Activity,
  Globe,
  Zap,
} from "lucide-react"
import { KYAKU_SHIEN_BRAND } from "../../backend/config/branding-system"
import KyakuShienHeader from "./brand/kyaku-shien-header"
import KizunaAIWidget from "./kizuna-ai-widget"

interface DashboardStats {
  totalConversations: number
  activeUsers: number
  resolutionRate: number
  avgResponseTime: string
  satisfactionScore: number
  pendingApprovals: number
}

interface RecentActivity {
  id: string
  type: "conversation" | "approval" | "alert"
  message: string
  timestamp: Date
  status: "success" | "warning" | "error" | "info"
}

export default function KyakuShienDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalConversations: 0,
    activeUsers: 0,
    resolutionRate: 0,
    avgResponseTime: "0s",
    satisfactionScore: 0,
    pendingApprovals: 0,
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
        resolutionRate: 94.2,
        avgResponseTime: "2.3s",
        satisfactionScore: 4.7,
        pendingApprovals: 12,
      })

      setRecentActivity([
        {
          id: "1",
          type: "conversation",
          message: "New conversation started with customer #1234",
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          status: "info",
        },
        {
          id: "2",
          type: "approval",
          message: "Response approved for billing inquiry",
          timestamp: new Date(Date.now() - 12 * 60 * 1000),
          status: "success",
        },
        {
          id: "3",
          type: "alert",
          message: "High volume detected - 15 conversations in queue",
          timestamp: new Date(Date.now() - 18 * 60 * 1000),
          status: "warning",
        },
        {
          id: "4",
          type: "conversation",
          message: "Customer satisfaction rating: 5 stars",
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
          status: "success",
        },
        {
          id: "5",
          type: "approval",
          message: "Complex technical query requires approval",
          timestamp: new Date(Date.now() - 32 * 60 * 1000),
          status: "warning",
        },
      ])

      setIsLoading(false)
    }

    loadDashboardData()
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "conversation":
        return <MessageSquare className="h-4 w-4" />
      case "approval":
        return <CheckCircle className="h-4 w-4" />
      case "alert":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-50"
      case "warning":
        return "text-yellow-600 bg-yellow-50"
      case "error":
        return "text-red-600 bg-red-50"
      default:
        return "text-blue-600 bg-blue-50"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <KyakuShienHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <KyakuShienHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                  <p className="text-3xl font-bold" style={{ color: KYAKU_SHIEN_BRAND.colors.primary }}>
                    {stats.totalConversations.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.background }}>
                  <MessageSquare className="h-6 w-6" style={{ color: KYAKU_SHIEN_BRAND.colors.primary }} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold" style={{ color: KYAKU_SHIEN_BRAND.colors.primary }}>
                    {stats.activeUsers}
                  </p>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.background }}>
                  <Users className="h-6 w-6" style={{ color: KYAKU_SHIEN_BRAND.colors.primary }} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Activity className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">Currently online</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                  <p className="text-3xl font-bold" style={{ color: KYAKU_SHIEN_BRAND.colors.primary }}>
                    {stats.resolutionRate}%
                  </p>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.background }}>
                  <CheckCircle className="h-6 w-6" style={{ color: KYAKU_SHIEN_BRAND.colors.primary }} />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={stats.resolutionRate} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                  <p className="text-3xl font-bold" style={{ color: KYAKU_SHIEN_BRAND.colors.primary }}>
                    {stats.avgResponseTime}
                  </p>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.background }}>
                  <Zap className="h-6 w-6" style={{ color: KYAKU_SHIEN_BRAND.colors.primary }} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Clock className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">-0.5s from yesterday</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                        <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">
                            {activity.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
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
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Satisfaction Score */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: KYAKU_SHIEN_BRAND.colors.primary }}>
                    {stats.satisfactionScore}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">out of 5.0</div>
                  <Progress value={stats.satisfactionScore * 20} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Pending Approvals</span>
                  <Badge variant="secondary">{stats.pendingApprovals}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Review Complex Queries
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Globe className="h-4 w-4 mr-2" />
                    Multi-language Responses
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View All Pending
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.primary }}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start New Conversation
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* KizunaAI Widget */}
      <KizunaAIWidget
        businessType="customer-support"
        position="bottom-right"
        onApprovalRequest={(request) => {
          console.log("Approval requested:", request)
        }}
      />
    </div>
  )
}
