"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Users, Search, Filter, MessageSquare, Clock, Globe, TrendingUp, UserCheck, Eye } from "lucide-react"

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // Simulate user data
      const mockUsers = Array.from({ length: 50 }, (_, i) => ({
        id: `user_${i + 1}`,
        sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
        businessType: ["telecom", "banking", "utilities", "ecommerce"][Math.floor(Math.random() * 4)],
        language: ["en", "lg", "sw"][Math.floor(Math.random() * 3)],
        status: ["active", "idle", "resolved"][Math.floor(Math.random() * 3)],
        conversationCount: Math.floor(Math.random() * 10) + 1,
        messageCount: Math.floor(Math.random() * 50) + 5,
        firstSeen: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        lastSeen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        satisfaction: Math.floor(Math.random() * 5) + 1,
        escalated: Math.random() > 0.8,
        location: ["Kampala", "Nairobi", "Lagos", "Cairo", "Accra"][Math.floor(Math.random() * 5)],
        avgResponseTime: Math.floor(Math.random() * 1000) + 200,
        issues: [
          "Data bundle purchase",
          "Network connectivity",
          "Account balance",
          "Bill payment",
          "Service activation",
          "Technical support",
        ].slice(0, Math.floor(Math.random() * 3) + 1),
      }))

      setUsers(mockUsers)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.businessType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || user.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "idle":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolved":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getBusinessIcon = (businessType: string) => {
    switch (businessType) {
      case "telecom":
        return "📱"
      case "banking":
        return "🏦"
      case "utilities":
        return "⚡"
      case "ecommerce":
        return "🛒"
      default:
        return "🏢"
    }
  }

  const getLanguageFlag = (language: string) => {
    switch (language) {
      case "en":
        return "🇺🇸"
      case "lg":
        return "🇺🇬"
      case "sw":
        return "🇰🇪"
      default:
        return "🌐"
    }
  }

  const userStats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    idle: users.filter((u) => u.status === "idle").length,
    resolved: users.filter((u) => u.status === "resolved").length,
    escalated: users.filter((u) => u.escalated).length,
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
      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{userStats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Idle</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{userStats.idle}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{userStats.resolved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalated</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{userStats.escalated}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>Monitor and manage user sessions and conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by session ID, business type, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="idle">Idle</option>
                <option value="resolved">Resolved</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <span className="text-lg">{getBusinessIcon(user.businessType)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.sessionId}</span>
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        {user.escalated && <Badge className="bg-red-100 text-red-800 border-red-200">Escalated</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          {getLanguageFlag(user.language)} {user.language.toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" /> {user.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" /> {user.conversationCount} conversations
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {user.avgResponseTime}ms avg
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{user.messageCount} messages</div>
                      <div className="text-xs text-gray-600">Last seen: {user.lastSeen.toLocaleTimeString()}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {"★".repeat(user.satisfaction)}
                      {"☆".repeat(5 - user.satisfaction)}
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">No users found matching your search criteria.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
