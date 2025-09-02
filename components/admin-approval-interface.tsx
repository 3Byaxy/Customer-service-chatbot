"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, MessageSquare, User, Bot, Globe, Phone, Eye, ThumbsUp } from "lucide-react"

interface ApprovalRequest {
  id: string
  sessionId: string
  userId: string
  userMessage: string
  suggestedResponse: string
  suggestedAction: string
  priority: "low" | "medium" | "high" | "critical"
  businessType: string
  language: string
  timestamp: Date
  status: "pending" | "approved" | "rejected" | "auto_approved"
}

interface ConversationLog {
  id: string
  sessionId: string
  userId: string
  messages: Array<{
    id: string
    type: "user" | "bot" | "system"
    content: string
    timestamp: Date
    language?: string
    requiresApproval?: boolean
    approvalStatus?: "pending" | "approved" | "rejected"
  }>
  businessType: string
  status: "active" | "completed" | "escalated"
  startTime: Date
  lastActivity: Date
}

export default function AdminApprovalInterface() {
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>([])
  const [activeConversations, setActiveConversations] = useState<ConversationLog[]>([])
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<ConversationLog | null>(null)
  const [customResponse, setCustomResponse] = useState("")
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    autoApproved: 0,
    autoApprovalRate: 0,
    approvalRate: 0,
  })

  // Load data on component mount and set up polling
  useEffect(() => {
    loadApprovalData()
    loadConversations()

    const interval = setInterval(() => {
      loadApprovalData()
      loadConversations()
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const loadApprovalData = async () => {
    try {
      const response = await fetch("/api/chat-approval")
      if (response.ok) {
        const data = await response.json()
        setPendingApprovals(data.pendingApprovals || [])
        setStats(data.stats || stats)
      }
    } catch (error) {
      console.error("Error loading approval data:", error)
    }
  }

  const loadConversations = async () => {
    try {
      const response = await fetch("/api/admin/conversations")
      if (response.ok) {
        const data = await response.json()
        setActiveConversations(data.conversations || [])
      }
    } catch (error) {
      console.error("Error loading conversations:", error)
    }
  }

  const handleApprove = async (approvalId: string, useCustomResponse = false) => {
    try {
      const response = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvalId,
          action: "approve",
          customResponse: useCustomResponse ? customResponse : undefined,
          adminId: "admin_user", // In real app, get from auth
        }),
      })

      if (response.ok) {
        loadApprovalData()
        setSelectedApproval(null)
        setCustomResponse("")
      }
    } catch (error) {
      console.error("Error approving request:", error)
    }
  }

  const handleReject = async (approvalId: string, reason: string) => {
    try {
      const response = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvalId,
          action: "reject",
          reason,
          adminId: "admin_user",
        }),
      })

      if (response.ok) {
        loadApprovalData()
        setSelectedApproval(null)
      }
    } catch (error) {
      console.error("Error rejecting request:", error)
    }
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

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.autoApproved}</p>
              <p className="text-sm text-gray-600">Auto-Approved</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{stats.autoApprovalRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Auto Rate</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-600">{stats.approvalRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Approvals ({pendingApprovals.length})
            </CardTitle>
            <CardDescription>Requests waiting for admin approval</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {pendingApprovals.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p>No pending approvals</p>
                    <p className="text-sm">All requests are handled!</p>
                  </div>
                ) : (
                  pendingApprovals.map((approval) => (
                    <Card
                      key={approval.id}
                      className={`cursor-pointer transition-colors ${
                        selectedApproval?.id === approval.id ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setSelectedApproval(approval)}
                    >
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getPriorityColor(approval.priority)}`}></div>
                              <Badge variant={getPriorityBadgeColor(approval.priority) as any}>
                                {approval.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                <Globe className="h-3 w-3 mr-1" />
                                {approval.language.toUpperCase()}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {approval.businessType}
                              </Badge>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium">User Message:</p>
                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded line-clamp-2">
                              {approval.userMessage}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium">Suggested Action:</p>
                            <Badge variant="outline" className="text-xs">
                              {approval.suggestedAction}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{approval.timestamp.toLocaleTimeString()}</span>
                            <span>Session: {approval.sessionId.slice(-8)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Approval Details & Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {selectedApproval ? "Approval Details" : "Select an Approval"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedApproval ? (
              <div className="space-y-6">
                {/* Request Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">User Message:</p>
                    <div className="bg-blue-50 p-3 rounded border">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium">Customer</span>
                        <Badge variant="outline" className="text-xs">
                          {selectedApproval.language.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm">{selectedApproval.userMessage}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Suggested Response:</p>
                    <div className="bg-gray-50 p-3 rounded border">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-4 w-4" />
                        <span className="text-sm font-medium">AI Assistant</span>
                        <Badge variant="secondary" className="text-xs">
                          {selectedApproval.suggestedAction}
                        </Badge>
                      </div>
                      <p className="text-sm">{selectedApproval.suggestedResponse}</p>
                    </div>
                  </div>
                </div>

                {/* Custom Response */}
                <div>
                  <p className="text-sm font-medium mb-2">Custom Response (Optional):</p>
                  <Textarea
                    value={customResponse}
                    onChange={(e) => setCustomResponse(e.target.value)}
                    placeholder="Enter a custom response or leave empty to use the suggested response..."
                    className="min-h-[100px]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Priority: {selectedApproval.priority}</Badge>
                    <Badge variant="outline">Business: {selectedApproval.businessType}</Badge>
                    <Badge variant="outline">Time: {selectedApproval.timestamp.toLocaleString()}</Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedApproval.id, "Request rejected by admin")}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleApprove(selectedApproval.id, false)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Approve Suggested
                    </Button>

                    <Button
                      onClick={() => handleApprove(selectedApproval.id, true)}
                      disabled={!customResponse.trim()}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve Custom
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Select an approval request</p>
                <p className="text-sm">Choose a pending approval from the list to review and take action</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Conversations Monitor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Active Conversations ({activeConversations.length})
          </CardTitle>
          <CardDescription>Monitor ongoing conversations between users and the chatbot</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active Chats</TabsTrigger>
              <TabsTrigger value="details">Conversation Details</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeConversations.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No active conversations</p>
                  </div>
                ) : (
                  activeConversations.map((conversation) => (
                    <Card
                      key={conversation.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{conversation.businessType}</Badge>
                            <Badge variant={conversation.status === "active" ? "default" : "secondary"}>
                              {conversation.status}
                            </Badge>
                          </div>

                          <div>
                            <p className="text-sm font-medium">Latest Message:</p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {conversation.messages[conversation.messages.length - 1]?.content || "No messages"}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Messages: {conversation.messages.length}</span>
                            <span>Last: {new Date(conversation.lastActivity).toLocaleTimeString()}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <Phone className="h-3 w-3 mr-1" />
                              Call User
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Join Chat
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-4">
              {selectedConversation ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Conversation Details - {selectedConversation.sessionId.slice(-8)}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{selectedConversation.businessType}</Badge>
                      <Badge variant={selectedConversation.status === "active" ? "default" : "secondary"}>
                        {selectedConversation.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Started: {new Date(selectedConversation.startTime).toLocaleString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {selectedConversation.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.type === "user"
                                  ? "bg-blue-600 text-white"
                                  : message.type === "system"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                {message.type === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                                <span className="text-xs opacity-70">
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                                {message.language && (
                                  <Badge variant="outline" className="text-xs h-4 px-1">
                                    {message.language.toUpperCase()}
                                  </Badge>
                                )}
                                {message.requiresApproval && (
                                  <Badge variant="secondary" className="text-xs h-4 px-1">
                                    {message.approvalStatus || "pending"}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm">{message.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm">Choose an active conversation to view details</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
