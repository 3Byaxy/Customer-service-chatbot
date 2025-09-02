"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cpu, HardDrive, Wifi, Zap, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"

export default function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<any>(null)
  const [realTimeData, setRealTimeData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 2000) // Update every 2 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Simulate real-time performance data
    const interval = setInterval(() => {
      setRealTimeData({
        timestamp: new Date(),
        cpu: Math.floor(Math.random() * 30) + 15,
        memory: Math.floor(Math.random() * 40) + 30,
        disk: Math.floor(Math.random() * 20) + 60,
        network: Math.floor(Math.random() * 50) + 25,
        responseTime: Math.floor(Math.random() * 200) + 200,
        throughput: Math.floor(Math.random() * 100) + 50,
        activeConnections: Math.floor(Math.random() * 50) + 20,
        queueSize: Math.floor(Math.random() * 10) + 2,
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const fetchMetrics = async () => {
    try {
      // Simulate performance metrics
      const mockMetrics = {
        system: {
          uptime: "99.9%",
          totalRequests: Math.floor(Math.random() * 10000) + 5000,
          successRate: Math.floor(Math.random() * 10) + 90,
          errorRate: Math.floor(Math.random() * 5) + 1,
          averageResponseTime: Math.floor(Math.random() * 200) + 300,
        },
        resources: {
          cpu: {
            current: Math.floor(Math.random() * 30) + 15,
            average: Math.floor(Math.random() * 25) + 20,
            peak: Math.floor(Math.random() * 40) + 60,
          },
          memory: {
            current: Math.floor(Math.random() * 40) + 30,
            average: Math.floor(Math.random() * 35) + 35,
            peak: Math.floor(Math.random() * 50) + 70,
          },
          disk: {
            used: Math.floor(Math.random() * 20) + 60,
            available: "2.1 GB",
            total: "10 GB",
          },
          network: {
            inbound: Math.floor(Math.random() * 50) + 25,
            outbound: Math.floor(Math.random() * 40) + 30,
            bandwidth: "1 Gbps",
          },
        },
        api: {
          endpoints: [
            {
              path: "/api/chat",
              requests: Math.floor(Math.random() * 1000) + 500,
              averageTime: Math.floor(Math.random() * 200) + 300,
              successRate: Math.floor(Math.random() * 10) + 90,
              errors: Math.floor(Math.random() * 20) + 5,
            },
            {
              path: "/api/analyze-question",
              requests: Math.floor(Math.random() * 500) + 200,
              averageTime: Math.floor(Math.random() * 100) + 150,
              successRate: Math.floor(Math.random() * 5) + 95,
              errors: Math.floor(Math.random() * 10) + 2,
            },
            {
              path: "/api/gemini-test",
              requests: Math.floor(Math.random() * 200) + 50,
              averageTime: Math.floor(Math.random() * 300) + 400,
              successRate: Math.floor(Math.random() * 8) + 92,
              errors: Math.floor(Math.random() * 5) + 1,
            },
          ],
        },
        database: {
          connections: {
            active: Math.floor(Math.random() * 15) + 5,
            idle: Math.floor(Math.random() * 10) + 3,
            max: 25,
          },
          queries: {
            total: Math.floor(Math.random() * 5000) + 2000,
            averageTime: Math.floor(Math.random() * 50) + 25,
            slowQueries: Math.floor(Math.random() * 10) + 2,
          },
          cache: {
            hitRate: Math.floor(Math.random() * 15) + 85,
            size: "128 MB",
            entries: Math.floor(Math.random() * 1000) + 500,
          },
        },
        trends: {
          hourly: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            requests: Math.floor(Math.random() * 100) + 50,
            responseTime: Math.floor(Math.random() * 200) + 200,
            errors: Math.floor(Math.random() * 5),
          })),
          daily: Array.from({ length: 7 }, (_, i) => ({
            day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
            requests: Math.floor(Math.random() * 1000) + 500,
            responseTime: Math.floor(Math.random() * 100) + 250,
            uptime: Math.floor(Math.random() * 5) + 95,
          })),
        },
      }

      setMetrics(mockMetrics)
    } catch (error) {
      console.error("Failed to fetch metrics:", error)
    } finally {
      setIsLoading(false)
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
      {/* Real-time System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData?.cpu || 0}%</div>
            <Progress value={realTimeData?.cpu || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Avg: {metrics?.resources?.cpu?.average}% | Peak: {metrics?.resources?.cpu?.peak}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData?.memory || 0}%</div>
            <Progress value={realTimeData?.memory || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Avg: {metrics?.resources?.memory?.average}% | Peak: {metrics?.resources?.memory?.peak}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData?.responseTime || 0}ms</div>
            <div className="flex items-center gap-1 mt-2">
              {(realTimeData?.responseTime || 0) < 400 ? (
                <TrendingDown className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-600" />
              )}
              <span className="text-xs text-muted-foreground">Avg: {metrics?.system?.averageResponseTime}ms</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData?.activeConnections || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Queue: {realTimeData?.queueSize || 0} | Throughput: {realTimeData?.throughput || 0}/min
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="api">API Performance</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Uptime</span>
                  <span className="font-medium text-green-600">{metrics?.system?.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Requests</span>
                  <span className="font-medium">{metrics?.system?.totalRequests?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-medium text-green-600">{metrics?.system?.successRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Error Rate</span>
                  <span className="font-medium text-red-600">{metrics?.system?.errorRate}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Disk Usage</span>
                    <span className="text-sm font-medium">{metrics?.resources?.disk?.used}%</span>
                  </div>
                  <Progress value={metrics?.resources?.disk?.used} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {metrics?.resources?.disk?.available} available of {metrics?.resources?.disk?.total}
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Network In</span>
                    <span className="text-sm font-medium">{metrics?.resources?.network?.inbound}%</span>
                  </div>
                  <Progress value={metrics?.resources?.network?.inbound} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Network Out</span>
                    <span className="text-sm font-medium">{metrics?.resources?.network?.outbound}%</span>
                  </div>
                  <Progress value={metrics?.resources?.network?.outbound} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                API Endpoint Performance
              </CardTitle>
              <CardDescription>Performance metrics for each API endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.api?.endpoints?.map((endpoint: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{endpoint.path}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{endpoint.requests} requests</span>
                        <span className="text-sm font-medium text-green-600">{endpoint.successRate}%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Avg Response</span>
                        <div className="font-medium">{endpoint.averageTime}ms</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Success Rate</span>
                        <div className="font-medium text-green-600">{endpoint.successRate}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Errors</span>
                        <div className="font-medium text-red-600">{endpoint.errors}</div>
                      </div>
                    </div>
                    <Progress value={endpoint.successRate} className="mt-2 h-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Connection Pool</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Connections</span>
                  <span className="font-medium">{metrics?.database?.connections?.active}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Idle Connections</span>
                  <span className="font-medium">{metrics?.database?.connections?.idle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Connections</span>
                  <span className="font-medium">{metrics?.database?.connections?.max}</span>
                </div>
                <Progress
                  value={(metrics?.database?.connections?.active / metrics?.database?.connections?.max) * 100}
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Query Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Queries</span>
                  <span className="font-medium">{metrics?.database?.queries?.total?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Time</span>
                  <span className="font-medium">{metrics?.database?.queries?.averageTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Slow Queries</span>
                  <span className="font-medium text-yellow-600">{metrics?.database?.queries?.slowQueries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cache Hit Rate</span>
                  <span className="font-medium text-green-600">{metrics?.database?.cache?.hitRate}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>24-Hour Trends</CardTitle>
                <CardDescription>Hourly performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics?.trends?.hourly?.slice(0, 6).map((hour: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{hour.hour}:00</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm">{hour.requests} req</span>
                        <span className="text-sm">{hour.responseTime}ms</span>
                        <span className="text-sm text-red-600">{hour.errors} err</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Trends</CardTitle>
                <CardDescription>Daily performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics?.trends?.daily?.map((day: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{day.day}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm">{day.requests} req</span>
                        <span className="text-sm">{day.responseTime}ms</span>
                        <span className="text-sm text-green-600">{day.uptime}% up</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
