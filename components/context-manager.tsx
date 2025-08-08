'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Database, MemoryStickIcon as Memory, Clock, AlertTriangle, Trash2, RefreshCw } from 'lucide-react'

interface ContextData {
  id: string
  type: 'conversation' | 'user_profile' | 'business_data' | 'session'
  data: any
  size: number
  lastAccessed: Date
  priority: 'high' | 'medium' | 'low'
  ttl?: number
}

interface ContextManagerProps {
  businessType: string
}

export default function ContextManager({ businessType }: ContextManagerProps) {
  const [contextData, setContextData] = useState<ContextData[]>([
    {
      id: '1',
      type: 'conversation',
      data: { messages: 15, topics: ['billing', 'data'], language: 'en' },
      size: 2.3,
      lastAccessed: new Date(),
      priority: 'high',
      ttl: 3600
    },
    {
      id: '2',
      type: 'user_profile',
      data: { customerId: 'MTN123456', tier: 'premium', location: 'Kampala' },
      size: 1.1,
      lastAccessed: new Date(Date.now() - 300000),
      priority: 'medium',
      ttl: 86400
    },
    {
      id: '3',
      type: 'business_data',
      data: { products: 25, policies: 8, faqs: 150 },
      size: 15.7,
      lastAccessed: new Date(Date.now() - 600000),
      priority: 'low'
    },
    {
      id: '4',
      type: 'session',
      data: { sessionId: 'sess_789', startTime: new Date(), interactions: 8 },
      size: 0.8,
      lastAccessed: new Date(),
      priority: 'high',
      ttl: 1800
    }
  ])

  const [memoryLimits] = useState({
    total: 100, // MB
    conversation: 20,
    userProfile: 30,
    businessData: 40,
    session: 10
  })

  const getTotalMemoryUsage = () => {
    return contextData.reduce((total, item) => total + item.size, 0)
  }

  const getMemoryByType = (type: string) => {
    return contextData
      .filter(item => item.type === type)
      .reduce((total, item) => total + item.size, 0)
  }

  const clearExpiredContext = () => {
    const now = Date.now()
    setContextData(prev => prev.filter(item => {
      if (!item.ttl) return true
      const expiryTime = item.lastAccessed.getTime() + (item.ttl * 1000)
      return now < expiryTime
    }))
  }

  const clearContextByType = (type: string) => {
    setContextData(prev => prev.filter(item => item.type !== type))
  }

  const contextTypes = [
    {
      type: 'conversation',
      name: 'Conversation History',
      description: 'Chat messages and interaction context',
      icon: '💬',
      limit: memoryLimits.conversation
    },
    {
      type: 'user_profile',
      name: 'User Profiles',
      description: 'Customer information and preferences',
      icon: '👤',
      limit: memoryLimits.userProfile
    },
    {
      type: 'business_data',
      name: 'Business Knowledge',
      description: 'Products, services, and policies',
      icon: '🏢',
      limit: memoryLimits.businessData
    },
    {
      type: 'session',
      name: 'Session Data',
      description: 'Temporary interaction state',
      icon: '⏱️',
      limit: memoryLimits.session
    }
  ]

  const storageGuidelines = {
    conversation: {
      retention: '1 hour for active sessions, 24 hours for completed',
      compression: 'Summarize after 50 messages',
      priority: 'Keep recent interactions, compress older ones'
    },
    userProfile: {
      retention: '30 days for active users, 7 days for inactive',
      compression: 'Store only essential customer data',
      priority: 'Premium customers get higher retention'
    },
    businessData: {
      retention: 'Permanent with periodic updates',
      compression: 'Index frequently accessed items',
      priority: 'Core business info always available'
    },
    session: {
      retention: '30 minutes after last interaction',
      compression: 'Clear on session end',
      priority: 'Essential for current conversation flow'
    }
  }

  return (
    <div className="space-y-6">
      {/* Memory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Memory</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getTotalMemoryUsage().toFixed(1)} MB
            </div>
            <Progress 
              value={(getTotalMemoryUsage() / memoryLimits.total) * 100} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              of {memoryLimits.total} MB limit
            </p>
          </CardContent>
        </Card>

        {contextTypes.slice(0, 3).map((type) => (
          <Card key={type.type}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{type.name}</CardTitle>
              <span className="text-lg">{type.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getMemoryByType(type.type).toFixed(1)} MB
              </div>
              <Progress 
                value={(getMemoryByType(type.type) / type.limit) * 100} 
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                of {type.limit} MB limit
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Context Overview</TabsTrigger>
          <TabsTrigger value="storage">Storage Rules</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Context Data</CardTitle>
                <CardDescription>
                  Current context stored in memory for {businessType} business
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearExpiredContext}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Expired
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contextData.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          item.priority === 'high' ? 'default' : 
                          item.priority === 'medium' ? 'secondary' : 'outline'
                        }>
                          {item.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm font-medium">{item.size.toFixed(1)} MB</span>
                        {item.ttl && (
                          <Badge variant="outline" className="text-xs">
                            TTL: {Math.floor(item.ttl / 60)}m
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {item.lastAccessed.toLocaleTimeString()}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                        {JSON.stringify(item.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contextTypes.map((type) => (
              <Card key={type.type}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">{type.icon}</span>
                    {type.name}
                  </CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Current Usage:</span>
                    <span className="font-medium">
                      {getMemoryByType(type.type).toFixed(1)} / {type.limit} MB
                    </span>
                  </div>
                  <Progress 
                    value={(getMemoryByType(type.type) / type.limit) * 100}
                  />
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Retention:</strong> {storageGuidelines[type.type as keyof typeof storageGuidelines].retention}
                    </div>
                    <div>
                      <strong>Compression:</strong> {storageGuidelines[type.type as keyof typeof storageGuidelines].compression}
                    </div>
                    <div>
                      <strong>Priority:</strong> {storageGuidelines[type.type as keyof typeof storageGuidelines].priority}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => clearContextByType(type.type)}
                  >
                    Clear {type.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guidelines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Context Engineering Guidelines</CardTitle>
              <CardDescription>
                Best practices for managing AI context and memory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Memory className="h-5 w-5" />
                  Memory Management Principles
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Prioritize Recent Context:</strong> Keep the last 10-15 messages in active memory</li>
                  <li>• <strong>Compress Historical Data:</strong> Summarize older conversations to save space</li>
                  <li>• <strong>Use TTL (Time To Live):</strong> Automatically expire old context data</li>
                  <li>• <strong>Context Relevance:</strong> Only store context relevant to current business type</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Storage Limits & Timeouts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-medium">Short-term Memory (Active Session)</h4>
                    <ul className="space-y-1">
                      <li>• Conversation: 20 MB, 1 hour TTL</li>
                      <li>• Session data: 10 MB, 30 min TTL</li>
                      <li>• User preferences: 5 MB, session TTL</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Long-term Memory (Persistent)</h4>
                    <ul className="space-y-1">
                      <li>• User profiles: 30 MB, 30 days TTL</li>
                      <li>• Business data: 40 MB, permanent</li>
                      <li>• Learning patterns: 15 MB, 7 days TTL</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Context Engineering Best Practices
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium">1. Context Layering</h4>
                    <p>Structure context in layers: immediate (current message) → session (conversation) → user (profile) → business (knowledge base)</p>
                  </div>
                  <div>
                    <h4 className="font-medium">2. Dynamic Context Loading</h4>
                    <p>Load context based on conversation needs. Don't load all user history for simple queries.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">3. Context Compression</h4>
                    <p>Summarize long conversations: "User asked about data bundles, resolved with 5GB monthly plan recommendation"</p>
                  </div>
                  <div>
                    <h4 className="font-medium">4. Multi-language Context</h4>
                    <p>Store language preferences and maintain context consistency across language switches</p>
                  </div>
                  <div>
                    <h4 className="font-medium">5. Business Context Isolation</h4>
                    <p>Keep business-specific context separate. Banking context shouldn't mix with telecom context.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
