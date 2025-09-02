"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Database,
  Brain,
  Globe,
  Zap,
} from "lucide-react"

interface SystemOverviewProps {
  systemStatus: any
}

export default function SystemOverview({ systemStatus }: SystemOverviewProps) {
  const [realTimeData, setRealTimeData] = useState<any>(null)

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRealTimeData({
        timestamp: new Date(),
        activeConnections: Math.floor(Math.random() * 50) + 10,
        memoryUsage: Math.floor(Math.random() * 30) + 40,
        cpuUsage: Math.floor(Math.random() * 20) + 15,
        responseTime: Math.floor(Math.random() * 100) + 200,
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemStatus?.services?.ai?.map((service: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(service.status)}
                  <span className="font-medium">{service.name}</span>
                </div>
                <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
              </div>
            )) || (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Google Gemini</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">API Router</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium">Groq</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">not configured</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Context Storage</span>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Session Manager</span>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">Database</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">not configured</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Network & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">API Gateway</span>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Rate Limiting</span>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">CORS</span>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">configured</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData?.activeConnections || 0}</div>
            <p className="text-xs text-muted-foreground">Real-time connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData?.memoryUsage || 0}%</div>
            <Progress value={realTimeData?.memoryUsage || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData?.cpuUsage || 0}%</div>
            <Progress value={realTimeData?.cpuUsage || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData?.responseTime || 0}ms</div>
            <p className="text-xs text-muted-foreground">Average response time</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
          <CardDescription>Latest events and system changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium">System Health Check Passed</p>
                <p className="text-sm text-gray-600">All services are running normally</p>
              </div>
              <span className="text-sm text-gray-500">2 minutes ago</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium">API Request Spike Detected</p>
                <p className="text-sm text-gray-600">Traffic increased by 45% in the last hour</p>
              </div>
              <span className="text-sm text-gray-500">15 minutes ago</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium">Rate Limit Warning</p>
                <p className="text-sm text-gray-600">Google Gemini API approaching daily limit</p>
              </div>
              <span className="text-sm text-gray-500">1 hour ago</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium">Context Cleanup Completed</p>
                <p className="text-sm text-gray-600">Freed 12.3MB of expired conversation data</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
