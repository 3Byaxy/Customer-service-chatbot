"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain,
  MessageSquare,
  Users,
  Building,
  FileText,
  Activity,
  Clock,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  MemoryStick,
  HardDrive,
  Zap,
} from "lucide-react"

interface ContextData {
  type: string
  count: number
  memoryUsage: number
  maxMemory: number
  lastUpdated: string
  ttl: number
  priority: "high" | "medium" | "low"
}

interface ConversationData {
  id: string
  userId: string
  businessType: string
  language: string
  messageCount: number
  memoryUsage: number
  lastActivity: string
  expiresAt: string
  topics: string[]
}

interface UserProfile {
  id: string
  tier: "premium" | "standard" | "basic"
  location: string
  language: string
  profileSize: number
  lastSeen: string
  expiresAt: string
}

export default function ContextManager() {
  const [contextData] = useState<ContextData[]>([
    {
      type: "Conversation History",
      count: 1247,
      memoryUsage: 45.2,
      maxMemory: 100,
      lastUpdated: "2 minutes ago",
      ttl: 3600,
      priority: "high",
    },
    {
      type: "User Profiles",
      count: 892,
      memoryUsage: 28.7,
      maxMemory: 50,
      lastUpdated: "5 minutes ago",
      ttl: 7200,
      priority: "medium",
    },
    {
      type: "Business Knowledge",
      count: 156,
      memoryUsage: 67.3,
      maxMemory: 80,
      lastUpdated: "1 hour ago",
      ttl: 86400,
      priority: "high",
    },
    {
      type: "Session Context",
      count: 234,
      memoryUsage: 12.4,
      maxMemory: 30,
      lastUpdated: "30 seconds ago",
      ttl: 1800,
      priority: "medium",
    },
    {
      type: "Language Models",
      count: 8,
      memoryUsage: 89.1,
      maxMemory: 120,
      lastUpdated: "10 minutes ago",
      ttl: 43200,
      priority: "high",
    },
  ])

  const [conversations] = useState<ConversationData[]>([
    {
      id: "conv_001",
      userId: "user_12345",
      businessType: "telecom",
      language: "en",
      messageCount: 15,
      memoryUsage: 2.3,
      lastActivity: "2 minutes ago",
      expiresAt: "2024-01-15 14:30:00",
      topics: ["data bundles", "network issues", "billing"],
    },
    {
      id: "conv_002",
      userId: "user_67890",
      businessType: "banking",
      language: "lg",
      messageCount: 8,
      memoryUsage: 1.7,
      lastActivity: "5 minutes ago",
      expiresAt: "2024-01-15 14:25:00",
      topics: ["mobile money", "account balance"],
    },
    {
      id: "conv_003",
      userId: "user_11111",
      businessType: "utilities",
      language: "sw",
      messageCount: 23,
      memoryUsage: 3.8,
      lastActivity: "1 hour ago",
      expiresAt: "2024-01-15 13:20:00",
      topics: ["power outage", "billing dispute", "meter reading"],
    },
  ])

  const [userProfiles] = useState<UserProfile[]>([
    {
      id: "user_12345",
      tier: "premium",
      location: "Kampala",
      language: "en",
      profileSize: 4.2,
      lastSeen: "2 minutes ago",
      expiresAt: "2024-01-22 14:30:00",
    },
    {
      id: "user_67890",
      tier: "standard",
      location: "Entebbe",
      language: "lg",
      profileSize: 2.8,
      lastSeen: "5 minutes ago",
      expiresAt: "2024-01-20 14:25:00",
    },
    {
      id: "user_11111",
      tier: "basic",
      location: "Jinja",
      language: "sw",
      profileSize: 1.5,
      lastSeen: "1 hour ago",
      expiresAt: "2024-01-18 13:20:00",
    },
  ])

  const totalMemoryUsed = contextData.reduce((sum, item) => sum + item.memoryUsage, 0)
  const totalMemoryAvailable = contextData.reduce((sum, item) => sum + item.maxMemory, 0)
  const memoryUtilization = (totalMemoryUsed / totalMemoryAvailable) * 100

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-green-600 bg-green-50"
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "premium":
        return "text-purple-600 bg-purple-50"
      case "standard":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Context Manager
          </CardTitle>
          <CardDescription>Manage AI context, memory allocation, and conversation history</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="memory">Total Memory</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="profiles">User Profiles</TabsTrigger>
          <TabsTrigger value="knowledge">Business Knowledge</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* System Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  <div className="text-sm font-medium">System Status</div>
                </div>
                <div className="text-2xl font-bold text-green-600">Online</div>
                <div className="text-xs text-gray-500">All systems operational</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MemoryStick className="h-4 w-4 text-blue-600" />
                  <div className="text-sm font-medium">Memory Usage</div>
                </div>
                <div className="text-2xl font-bold">{totalMemoryUsed.toFixed(1)}MB</div>
                <div className="text-xs text-gray-500">{memoryUtilization.toFixed(1)}% utilized</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                  <div className="text-sm font-medium">Active Contexts</div>
                </div>
                <div className="text-2xl font-bold">{contextData.reduce((sum, item) => sum + item.count, 0)}</div>
                <div className="text-xs text-gray-500">Across all types</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <div className="text-sm font-medium">Efficiency</div>
                </div>
                <div className="text-2xl font-bold">94.2%</div>
                <div className="text-xs text-gray-500">Context hit rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Context Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Context Distribution</CardTitle>
              <CardDescription>Memory usage breakdown by context type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contextData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.type}</span>
                      <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.memoryUsage.toFixed(1)}MB / {item.maxMemory}MB
                    </div>
                  </div>
                  <Progress value={(item.memoryUsage / item.maxMemory) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{item.count} items</span>
                    <span>Updated {item.lastUpdated}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Context optimization completed - saved 12.3MB</span>
                    <span className="text-gray-500 ml-auto">2 min ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                    <span>Business knowledge updated for MTN Uganda</span>
                    <span className="text-gray-500 ml-auto">5 min ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span>High memory usage detected in conversation history</span>
                    <span className="text-gray-500 ml-auto">10 min ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Trash2 className="h-4 w-4 text-red-600" />
                    <span>Expired user profiles cleaned up - freed 8.7MB</span>
                    <span className="text-gray-500 ml-auto">15 min ago</span>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Memory Management
              </CardTitle>
              <CardDescription>Total memory allocation and usage statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Memory Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{totalMemoryUsed.toFixed(1)}MB</div>
                  <div className="text-sm text-gray-600">Used Memory</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {(totalMemoryAvailable - totalMemoryUsed).toFixed(1)}MB
                  </div>
                  <div className="text-sm text-gray-600">Available Memory</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{memoryUtilization.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Utilization</div>
                </div>
              </div>

              {/* Memory Allocation by Type */}
              <div className="space-y-4">
                <h3 className="font-medium">Memory Allocation by Type</h3>
                {contextData.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.type}</span>
                      <span className="text-sm text-gray-600">
                        {item.memoryUsage.toFixed(1)}MB / {item.maxMemory}MB
                      </span>
                    </div>
                    <Progress value={(item.memoryUsage / item.maxMemory) * 100} className="h-3 mb-2" />
                    <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                      <div>Items: {item.count}</div>
                      <div>TTL: {Math.floor(item.ttl / 60)}min</div>
                      <div>Priority: {item.priority}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Memory Management Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Expired Data
                </Button>
                <Button variant="outline" size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Optimize Memory
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Stats
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversation History
              </CardTitle>
              <CardDescription>Active conversations and their memory usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Conversation Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded">
                  <div className="text-xl font-bold">{conversations.length}</div>
                  <div className="text-sm text-gray-600">Active Conversations</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-xl font-bold">
                    {conversations.reduce((sum, conv) => sum + conv.memoryUsage, 0).toFixed(1)}MB
                  </div>
                  <div className="text-sm text-gray-600">Memory Used</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-xl font-bold">
                    {conversations.reduce((sum, conv) => sum + conv.messageCount, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Messages</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-xl font-bold">2.1</div>
                  <div className="text-sm text-gray-600">Avg Messages/Conv</div>
                </div>
              </div>

              {/* Conversation Details */}
              <div className="space-y-3">
                <h3 className="font-medium">Conversation Details</h3>
                {conversations.map((conv, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{conv.id}</span>
                        <Badge variant="outline">{conv.businessType}</Badge>
                        <Badge variant="outline">{conv.language}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">{conv.memoryUsage.toFixed(1)}MB</div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                      <div>User: {conv.userId}</div>
                      <div>Messages: {conv.messageCount}</div>
                      <div>Last: {conv.lastActivity}</div>
                      <div>Expires: {new Date(conv.expiresAt).toLocaleString()}</div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {conv.topics.map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profiles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Profiles
              </CardTitle>
              <CardDescription>Customer profiles and their context data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded">
                  <div className="text-xl font-bold">{userProfiles.length}</div>
                  <div className="text-sm text-gray-600">Active Profiles</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-xl font-bold">{userProfiles.filter((p) => p.tier === "premium").length}</div>
                  <div className="text-sm text-gray-600">Premium Users</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-xl font-bold">
                    {userProfiles.reduce((sum, profile) => sum + profile.profileSize, 0).toFixed(1)}MB
                  </div>
                  <div className="text-sm text-gray-600">Memory Used</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-xl font-bold">7d</div>
                  <div className="text-sm text-gray-600">Avg Retention</div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-3">
                <h3 className="font-medium">Profile Details</h3>
                {userProfiles.map((profile, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{profile.id}</span>
                        <Badge className={getTierColor(profile.tier)}>{profile.tier}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">{profile.profileSize.toFixed(1)}MB</div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>Location: {profile.location}</div>
                      <div>Language: {profile.language}</div>
                      <div>Last Seen: {profile.lastSeen}</div>
                      <div>Expires: {new Date(profile.expiresAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Business Knowledge
              </CardTitle>
              <CardDescription>Business-specific context and knowledge base</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Knowledge Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded">
                  <div className="text-xl font-bold">1,247</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-xl font-bold">892</div>
                  <div className="text-sm text-gray-600">Policies</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-xl font-bold">2,156</div>
                  <div className="text-sm text-gray-600">FAQs</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-xl font-bold">67.3MB</div>
                  <div className="text-sm text-gray-600">Memory Used</div>
                </div>
              </div>

              {/* Business Context by Type */}
              <div className="space-y-3">
                <h3 className="font-medium">Business Context by Type</h3>
                {["telecom", "banking", "utilities", "ecommerce"].map((businessType, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{businessType}</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>Products: {Math.floor(Math.random() * 500) + 100}</div>
                      <div>Policies: {Math.floor(Math.random() * 200) + 50}</div>
                      <div>Memory: {(Math.random() * 20 + 5).toFixed(1)}MB</div>
                    </div>
                    <div className="mt-2">
                      <Progress value={Math.random() * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Context Isolation */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Context Isolation</h4>
                <p className="text-sm text-blue-700">
                  Business contexts are isolated to prevent cross-contamination. Each business type maintains separate
                  knowledge bases, ensuring accurate and relevant responses.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidelines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Context Management Guidelines
              </CardTitle>
              <CardDescription>Best practices and configuration guidelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Memory Management Principles */}
              <div>
                <h3 className="font-medium mb-3">Memory Management Principles</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>
                      <strong>Layered Context:</strong> Use hierarchical context layers (session → user → business →
                      global)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>
                      <strong>Smart Compression:</strong> Compress older context while preserving key information
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>
                      <strong>Priority-based Retention:</strong> Keep high-priority context longer than low-priority
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>
                      <strong>Automatic Cleanup:</strong> Implement TTL-based cleanup for expired context
                    </span>
                  </div>
                </div>
              </div>

              {/* Storage Limits and TTL */}
              <div>
                <h3 className="font-medium mb-3">Storage Limits and TTL</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded">
                    <h4 className="font-medium text-sm mb-2">Session Context</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Max Size: 30MB</div>
                      <div>TTL: 30 minutes</div>
                      <div>Cleanup: Automatic</div>
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium text-sm mb-2">User Profiles</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Max Size: 50MB</div>
                      <div>TTL: 7 days</div>
                      <div>Cleanup: Scheduled</div>
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium text-sm mb-2">Conversation History</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Max Size: 100MB</div>
                      <div>TTL: 1 hour</div>
                      <div>Cleanup: Rolling</div>
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium text-sm mb-2">Business Knowledge</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Max Size: 120MB</div>
                      <div>TTL: 24 hours</div>
                      <div>Cleanup: Manual</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engineering Best Practices */}
              <div>
                <h3 className="font-medium mb-3">Engineering Best Practices</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <h4 className="font-medium text-sm mb-1">Context Layering</h4>
                    <p className="text-xs text-gray-600">
                      Implement context in layers: immediate (current conversation) → recent (last hour) → historical
                      (last day) → archived (older than day)
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <h4 className="font-medium text-sm mb-1">Compression Strategy</h4>
                    <p className="text-xs text-gray-600">
                      Use semantic compression for older messages, keeping key entities and intent while reducing
                      verbosity. Maintain full context for recent interactions.
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <h4 className="font-medium text-sm mb-1">Multi-language Support</h4>
                    <p className="text-xs text-gray-600">
                      Store context with language metadata. Use language-specific compression and retrieval strategies
                      for optimal performance across English, Luganda, and Swahili.
                    </p>
                  </div>
                </div>
              </div>

              {/* Context Type Guidelines */}
              <div>
                <h3 className="font-medium mb-3">Context Type Guidelines</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Conversation Context
                    </h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• Store full message history for active conversations</div>
                      <div>• Compress messages older than 1 hour</div>
                      <div>• Maintain topic threads and entity references</div>
                      <div>• Auto-expire after conversation ends</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      User Profile Context
                    </h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• Store preferences, language, location</div>
                      <div>• Track interaction patterns and satisfaction</div>
                      <div>• Maintain across sessions for personalization</div>
                      <div>• Respect privacy and data retention policies</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Business Context
                    </h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• Isolate by business type (telecom, banking, etc.)</div>
                      <div>• Update regularly with new products/policies</div>
                      <div>• Version control for knowledge updates</div>
                      <div>• Optimize for fast retrieval during conversations</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Session Context
                    </h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• Temporary context for current session only</div>
                      <div>• Store UI state, preferences, selections</div>
                      <div>• Clear on session end or timeout</div>
                      <div>• Minimal memory footprint</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Optimization */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Performance Optimization Tips
                </h4>
                <div className="text-sm text-yellow-700 space-y-1">
                  <div>• Use lazy loading for large context objects</div>
                  <div>• Implement context caching with Redis or similar</div>
                  <div>• Monitor memory usage and set up alerts</div>
                  <div>• Regular cleanup of expired and unused context</div>
                  <div>• Use compression for long-term storage</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
