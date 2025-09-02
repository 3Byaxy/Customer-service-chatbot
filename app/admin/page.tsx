"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  BarChart3,
  Database,
  MessageSquare,
  Settings,
  Users,
  Zap,
  TrendingUp,
  Clock,
  Brain,
  Shield,
  RefreshCw,
} from "lucide-react"
import SystemOverview from "@/components/admin/system-overview"
import APIMonitoring from "@/components/admin/api-monitoring"
import ConversationAnalytics from "@/components/admin/conversation-analytics"
import TestingConsole from "@/components/admin/testing-console"
import DatabaseManager from "@/components/admin/database-manager"
import UserManagement from "@/components/admin/user-management"
import SystemLogs from "@/components/admin/system-logs"
import PerformanceMetrics from "@/components/admin/performance-metrics"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    fetchSystemStatus()
    const interval = setInterval(fetchSystemStatus, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch("/api/admin/system-status")
      const data = await response.json()
      setSystemStatus(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Failed to fetch system status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">AI Customer Support System</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${systemStatus?.overall?.status === "healthy" ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <span className="text-sm text-gray-600">System {systemStatus?.overall?.status || "Unknown"}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchSystemStatus}
                className="flex items-center gap-2 bg-transparent"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>

              <div className="text-xs text-gray-500">Last updated: {lastUpdate.toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStatus?.metrics?.totalConversations || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">API Requests Today</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStatus?.metrics?.apiRequestsToday || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStatus?.metrics?.activeUsers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStatus?.metrics?.successRate || 0}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              API Monitor
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Testing
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <SystemOverview systemStatus={systemStatus} />
          </TabsContent>

          <TabsContent value="api">
            <APIMonitoring />
          </TabsContent>

          <TabsContent value="analytics">
            <ConversationAnalytics />
          </TabsContent>

          <TabsContent value="testing">
            <TestingConsole />
          </TabsContent>

          <TabsContent value="database">
            <DatabaseManager />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="logs">
            <SystemLogs />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceMetrics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
