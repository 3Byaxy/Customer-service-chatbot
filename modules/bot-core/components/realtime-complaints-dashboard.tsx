"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, CheckCircle, Clock, Phone, MessageSquare, TrendingUp, Users, Zap } from "lucide-react"

interface ComplaintData {
  id: string
  userId: string
  complaint: string
  businessType: string
  status: string
  priority: "low" | "medium" | "high" | "critical"
  timestamp: Date
  estimatedTime?: string
  solution?: any
}

interface RealtimeStats {
  totalComplaints: number
  resolvedToday: number
  averageResponseTime: number
  escalationRate: number
  satisfactionScore: number
  activeAgents: number
}

export default function RealtimeComplaintsDashboard() {
  const [complaints, setComplaints] = useState<ComplaintData[]>([])
  const [stats, setStats] = useState<RealtimeStats>({
    totalComplaints: 0,
    resolvedToday: 0,
    averageResponseTime: 0,
    escalationRate: 0,
    satisfactionScore: 0,
    activeAgents: 0,
  })
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>("all")
  const [isConnected, setIsConnected] = useState(false)

  // Real-time connection
  useEffect(() => {
    const userId = "admin_dashboard"
    const sessionId = `dashboard_${Date.now()}`

    // Connect to real-time events
    const eventSource = new EventSource(`/api/realtime?userId=${userId}&sessionId=${sessionId}`)

    eventSource.onopen = () => {
      setIsConnected(true)
      console.log("Real-time connection established")
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === "realtime_event") {
          handleRealtimeEvent(data.data)
        }
      } catch (error) {
        console.error("Error parsing real-time event:", error)
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
      console.error("Real-time connection error")
    }

    // Load initial data
    loadInitialData()

    return () => {
      eventSource.close()
    }
  }, [])

  const handleRealtimeEvent = (event: any) => {
    switch (event.type) {
      case "complaint":
        if (event.data.action === "status_update") {
          updateComplaintStatus(event.data.complaintId, event.data.status, event.data.details)
        }
        break
      case "solution":
        if (event.data.action === "solution_provided") {
          addSolutionToComplaint(event.userId, event.data.solution)
        }
        break
      case "escalation":
        if (event.data.action === "escalation_required") {
          handleEscalation(event.sessionId, event.data.reason, event.priority)
        }
        break
    }

    // Update stats
    updateStats()
  }

  const loadInitialData = async () => {
    try {
      // Load recent complaints
      const complaintsResponse = await fetch("/api/complaints")
      if (complaintsResponse.ok) {
        const complaintsData = await complaintsResponse.json()
        setComplaints(complaintsData.complaints?.slice(0, 20) || [])
      }

      // Update stats
      updateStats()
    } catch (error) {
      console.error("Error loading initial data:", error)
    }
  }

  const updateComplaintStatus = (complaintId: string, status: string, details: any) => {
    setComplaints((prev) =>
      prev.map((complaint) => (complaint.id === complaintId ? { ...complaint, status, ...details } : complaint)),
    )
  }

  const addSolutionToComplaint = (userId: string, solution: any) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.userId === userId ? { ...complaint, solution, status: "solution_provided" } : complaint,
      ),
    )
  }

  const handleEscalation = (sessionId: string, reason: string, priority: "high" | "critical") => {
    // Add escalation to complaints list
    const escalationComplaint: ComplaintData = {
      id: `escalation_${Date.now()}`,
      userId: "system",
      complaint: `Escalation Required: ${reason}`,
      businessType: "system",
      status: "escalated",
      priority,
      timestamp: new Date(),
      estimatedTime: priority === "critical" ? "15 minutes" : "1 hour",
    }

    setComplaints((prev) => [escalationComplaint, ...prev])
  }

  const updateStats = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const todayComplaints = complaints.filter((c) => c.timestamp >= today)
    const resolvedToday = todayComplaints.filter(
      (c) => c.status === "resolved" || c.status === "solution_provided",
    ).length
    const escalated = complaints.filter((c) => c.status === "escalated").length

    setStats({
      totalComplaints: complaints.length,
      resolvedToday,
      averageResponseTime: Math.floor(Math.random() * 300) + 60, // Simulated
      escalationRate: complaints.length > 0 ? (escalated / complaints.length) * 100 : 0,
      satisfactionScore: 4.2 + Math.random() * 0.6, // Simulated
      activeAgents: Math.floor(Math.random() * 10) + 5, // Simulated
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "text-green-600"
      case "solution_provided":
        return "text-blue-600"
      case "escalated":
        return "text-red-600"
      case "in_progress":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const filteredComplaints =
    selectedBusinessType === "all" ? complaints : complaints.filter((c) => c.businessType === selectedBusinessType)

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              ></div>
              <span className="font-medium">{isConnected ? "Real-time Connected" : "Connection Lost"}</span>
            </div>
            <Badge variant={isConnected ? "default" : "destructive"}>{isConnected ? "Live" : "Offline"}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold">{stats.totalComplaints}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolvedToday}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold">{stats.averageResponseTime}s</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Escalation Rate</p>
                <p className="text-2xl font-bold">{stats.escalationRate.toFixed(1)}%</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                <p className="text-2xl font-bold">{stats.satisfactionScore.toFixed(1)}/5</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold">{stats.activeAgents}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complaints Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Real-time Complaints & Solutions
          </CardTitle>
          <CardDescription>Live monitoring of customer complaints and AI-generated solutions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedBusinessType} onValueChange={setSelectedBusinessType}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="telecom">Telecom</TabsTrigger>
              <TabsTrigger value="banking">Banking</TabsTrigger>
              <TabsTrigger value="utilities">Utilities</TabsTrigger>
              <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedBusinessType} className="mt-6">
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredComplaints.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No complaints found for the selected filter</div>
                  ) : (
                    filteredComplaints.map((complaint) => (
                      <Card key={complaint.id} className="relative">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${getPriorityColor(complaint.priority)}`}></div>
                              <div>
                                <Badge variant="outline" className="mb-1">
                                  {complaint.businessType.toUpperCase()}
                                </Badge>
                                <p className="text-sm text-gray-600">{complaint.timestamp.toLocaleTimeString()}</p>
                              </div>
                            </div>
                            <Badge
                              variant={complaint.status === "resolved" ? "default" : "secondary"}
                              className={getStatusColor(complaint.status)}
                            >
                              {complaint.status.replace("_", " ").toUpperCase()}
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="font-medium text-sm mb-1">Complaint:</p>
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{complaint.complaint}</p>
                            </div>

                            {complaint.solution && (
                              <div>
                                <p className="font-medium text-sm mb-1">AI Solution:</p>
                                <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
                                  <p className="font-medium text-blue-800 mb-2">
                                    {complaint.solution.category} - {complaint.solution.subcategory}
                                  </p>
                                  <p className="line-clamp-3">{complaint.solution.solution}</p>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
                                    <span>Priority: {complaint.solution.priority}</span>
                                    <span>ETA: {complaint.solution.estimatedTime}</span>
                                    {complaint.solution.escalationRequired && (
                                      <Badge variant="destructive" className="text-xs">
                                        Escalation Required
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {complaint.estimatedTime && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>Estimated resolution: {complaint.estimatedTime}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Phone className="h-4 w-4 mr-1" />
                                Call Customer
                              </Button>
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Send Update
                              </Button>
                            </div>
                            <div className="text-xs text-gray-500">ID: {complaint.id}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
