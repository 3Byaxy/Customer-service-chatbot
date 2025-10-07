"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, MessageSquare, AlertTriangle, TrendingUp, CheckCircle, XCircle, RefreshCw } from "lucide-react"

interface AnalyticsData {
  timeframe: string
  period: {
    start: string
    end: string
  }
  sessions: {
    total: number
    byStatus: Record<string, number>
    byBusinessType: Record<string, number>
    byLanguage: Record<string, number>
  }
  messages: {
    total: number
    bySender: Record<string, number>
    byProvider: Record<string, number>
    escalated: number
    knowledgeUsed: number
  }
  tickets: {
    total: number
    byStatus: Record<string, number>
    byPriority: Record<string, number>
  }
}

interface Ticket {
  id: string
  title: string
  description: string
  priority: string
  status: string
  created_at: string
  sessions: {
    business_type: string
    language: string
  }
}

export function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("day")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/analytics?timeframe=${timeframe}`)
      const data = await response.json()

      if (data.success) {
        setAnalytics(data.data)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError("Failed to fetch analytics")
      console.error("Analytics fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/tickets")
      const data = await response.json()

      if (data.success) {
        setTickets(data.data.tickets)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError("Failed to fetch tickets")
      console.error("Tickets fetch error:", err)
    }
  }

  useEffect(() => {
    fetchAnalytics()
    fetchTickets()
  }, [timeframe])

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const response = await fetch(`/api/tickets?id=${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (data.success) {
        setTickets((prev) => prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, status } : ticket)))
      } else {
        alert("Failed to update ticket: " + data.error)
      }
    } catch (err) {
      alert("Failed to update ticket")
      console.error("Ticket update error:", err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-500"
      case "in_progress":
        return "bg-yellow-500"
      case "resolved":
        return "bg-green-500"
      case "closed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={timeframe} onValueChange={(value: "day" | "week" | "month") => setTimeframe(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24h</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={fetchAnalytics} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.sessions.total}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Active: {analytics.sessions.byStatus.active || 0} | Escalated:{" "}
                {analytics.sessions.byStatus.escalated || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.messages.total}</div>
              <div className="text-xs text-muted-foreground mt-1">
                User: {analytics.messages.bySender.user || 0} | Bot: {analytics.messages.bySender.bot || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.tickets.byStatus.open || 0}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Total: {analytics.tickets.total} | Resolved: {analytics.tickets.byStatus.resolved || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escalation Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.messages.total > 0
                  ? Math.round((analytics.messages.escalated / analytics.messages.total) * 100)
                  : 0}
                %
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {analytics.messages.escalated} escalated messages
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sessions by Business Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(analytics.sessions.byBusinessType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="capitalize">{type}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Messages by Language</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(analytics.sessions.byLanguage).map(([lang, count]) => (
                      <div key={lang} className="flex items-center justify-between">
                        <span className="uppercase">{lang}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Provider Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(analytics.messages.byProvider).map(([provider, count]) => (
                      <div key={provider} className="flex items-center justify-between">
                        <span className="capitalize">{provider}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Base Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Knowledge Used</span>
                      <Badge variant="outline">{analytics.messages.knowledgeUsed}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Usage Rate</span>
                      <Badge variant="outline">
                        {analytics.messages.total > 0
                          ? Math.round((analytics.messages.knowledgeUsed / analytics.messages.total) * 100)
                          : 0}
                        %
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{ticket.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(ticket.status)}`}></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{ticket.sessions.business_type}</span>
                          <span>•</span>
                          <span>{ticket.sessions.language.toUpperCase()}</span>
                          <span>•</span>
                          <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {ticket.status === "open" && (
                            <Button size="sm" onClick={() => updateTicketStatus(ticket.id, "in_progress")}>
                              Start Work
                            </Button>
                          )}
                          {ticket.status === "in_progress" && (
                            <Button size="sm" onClick={() => updateTicketStatus(ticket.id, "resolved")}>
                              Resolve
                            </Button>
                          )}
                          {ticket.status === "resolved" && (
                            <Button size="sm" variant="outline" onClick={() => updateTicketStatus(ticket.id, "closed")}>
                              Close
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {tickets.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                      <p>No tickets found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Response Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Total Conversations</span>
                      <Badge variant="outline">{analytics.sessions.total}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Successful Resolutions</span>
                      <Badge variant="outline">{analytics.sessions.byStatus.completed || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Escalation Rate</span>
                      <Badge variant="outline">
                        {analytics.messages.total > 0
                          ? Math.round((analytics.messages.escalated / analytics.messages.total) * 100)
                          : 0}
                        %
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ticket Resolution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analytics.tickets.byStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                          <span className="capitalize">{status.replace("_", " ")}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
