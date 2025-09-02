"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, MessageSquare, Globe, Clock, ThumbsUp } from "lucide-react"

export default function ConversationAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [timeRange, setTimeRange] = useState("24h")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    // Simulate analytics data (in a real app, this would come from your database)
    const mockData = {
      overview: {
        totalConversations: Math.floor(Math.random() * 1000) + 500,
        totalMessages: Math.floor(Math.random() * 5000) + 2500,
        averageLength: Math.floor(Math.random() * 10) + 5,
        resolutionRate: Math.floor(Math.random() * 20) + 80,
        escalationRate: Math.floor(Math.random() * 10) + 5,
        satisfactionScore: Math.floor(Math.random() * 20) + 80,
      },
      businessTypes: [
        { name: "Telecommunications", count: 450, percentage: 40, icon: "📱" },
        { name: "Banking", count: 280, percentage: 25, icon: "🏦" },
        { name: "Utilities", count: 225, percentage: 20, icon: "⚡" },
        { name: "E-commerce", count: 170, percentage: 15, icon: "🛒" },
      ],
      languages: [
        { code: "en", name: "English", count: 675, percentage: 60, flag: "🇺🇸" },
        { code: "lg", name: "Luganda", count: 280, percentage: 25, flag: "🇺🇬" },
        { code: "sw", name: "Swahili", count: 170, percentage: 15, flag: "🇰🇪" },
      ],
      intents: [
        { name: "Billing Inquiry", count: 320, percentage: 28 },
        { name: "Technical Support", count: 250, percentage: 22 },
        { name: "Account Management", count: 180, percentage: 16 },
        { name: "Product Information", count: 150, percentage: 13 },
        { name: "Complaint", count: 120, percentage: 11 },
        { name: "General Inquiry", count: 105, percentage: 10 },
      ],
      sentiment: {
        positive: 65,
        neutral: 25,
        negative: 10,
      },
      hourlyDistribution: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: Math.floor(Math.random() * 50) + 10,
      })),
      topIssues: [
        { issue: "Data bundle purchase", count: 145, trend: "up" },
        { issue: "Network connectivity", count: 132, trend: "stable" },
        { issue: "Account balance inquiry", count: 98, trend: "down" },
        { issue: "Bill payment", count: 87, trend: "up" },
        { issue: "Service activation", count: 76, trend: "stable" },
      ],
      responseMetrics: {
        averageResponseTime: Math.floor(Math.random() * 500) + 300,
        firstResponseTime: Math.floor(Math.random() * 200) + 100,
        resolutionTime: Math.floor(Math.random() * 1000) + 500,
      },
    }

    setAnalytics(mockData)
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Conversation Analytics</h2>
        <div className="flex gap-2">
          {["1h", "24h", "7d", "30d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === range ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalConversations}</div>
            <p className="text-xs text-muted-foreground">+12% from previous period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.resolutionRate}%</div>
            <Progress value={analytics.overview.resolutionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.responseMetrics.averageResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">-50ms improvement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="intents">Intents</TabsTrigger>
          <TabsTrigger value="issues">Top Issues</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Business Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.businessTypes.map((type: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{type.icon}</span>
                        <span className="font-medium">{type.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{type.count}</span>
                        <span className="text-sm text-gray-600 ml-2">({type.percentage}%)</span>
                      </div>
                    </div>
                    <Progress value={type.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.languages.map((lang: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{lang.count}</span>
                        <span className="text-sm text-gray-600 ml-2">({lang.percentage}%)</span>
                      </div>
                    </div>
                    <Progress value={lang.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
              <CardDescription>Customer sentiment distribution across conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{analytics.sentiment.positive}%</div>
                  <div className="text-sm text-gray-600">Positive</div>
                  <Progress value={analytics.sentiment.positive} className="mt-2 bg-green-100" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600">{analytics.sentiment.neutral}%</div>
                  <div className="text-sm text-gray-600">Neutral</div>
                  <Progress value={analytics.sentiment.neutral} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{analytics.sentiment.negative}%</div>
                  <div className="text-sm text-gray-600">Negative</div>
                  <Progress value={analytics.sentiment.negative} className="mt-2 bg-red-100" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Intent Analysis</CardTitle>
              <CardDescription>Most common customer intents and requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.intents.map((intent: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <span className="font-medium">{intent.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold">{intent.count}</div>
                        <div className="text-sm text-gray-600">{intent.percentage}%</div>
                      </div>
                      <div className="w-24">
                        <Progress value={intent.percentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Customer Issues</CardTitle>
              <CardDescription>Most frequently reported issues and their trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topIssues.map((issue: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-orange-600">{index + 1}</span>
                      </div>
                      <span className="font-medium">{issue.issue}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{issue.count}</span>
                      <div className="flex items-center gap-1">
                        {issue.trend === "up" && <TrendingUp className="h-4 w-4 text-red-600" />}
                        {issue.trend === "down" && <TrendingUp className="h-4 w-4 text-green-600 rotate-180" />}
                        {issue.trend === "stable" && <div className="w-4 h-0.5 bg-gray-400"></div>}
                        <span className="text-sm text-gray-600 capitalize">{issue.trend}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">First Response</span>
                  <span className="font-medium">{analytics.responseMetrics.firstResponseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Response</span>
                  <span className="font-medium">{analytics.responseMetrics.averageResponseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Resolution Time</span>
                  <span className="font-medium">{analytics.responseMetrics.resolutionTime}ms</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Resolution Rate</span>
                  <span className="font-medium text-green-600">{analytics.overview.resolutionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Escalation Rate</span>
                  <span className="font-medium text-orange-600">{analytics.overview.escalationRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Satisfaction Score</span>
                  <span className="font-medium text-blue-600">{analytics.overview.satisfactionScore}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Volume Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Conversations</span>
                  <span className="font-medium">{analytics.overview.totalConversations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Messages</span>
                  <span className="font-medium">{analytics.overview.totalMessages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Length</span>
                  <span className="font-medium">{analytics.overview.averageLength} msgs</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
