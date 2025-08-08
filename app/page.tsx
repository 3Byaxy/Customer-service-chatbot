'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageCircle, Settings, Database, Brain, Globe, Building2 } from 'lucide-react'
import ChatInterface from '@/components/chat-interface'
import RulesManager from '@/components/rules-manager'
import ContextManager from '@/components/context-manager'
import BusinessConfig from '@/components/business-config'
import AIProvidersConfig from '@/components/ai-providers-config'
import AnthropicTestPanel from '@/components/anthropic-test-panel'

export default function CustomerSupportDashboard() {
  const [activeTab, setActiveTab] = useState('chat')
  const [selectedBusiness, setSelectedBusiness] = useState('telecom')

  const businessTypes = [
    { id: 'telecom', name: 'Telecommunications', icon: '📱', companies: ['MTN', 'Airtel'] },
    { id: 'banking', name: 'Banking', icon: '🏦', companies: ['Stanbic', 'Centenary'] },
    { id: 'utilities', name: 'Utilities', icon: '⚡', companies: ['NWSC', 'Umeme'] },
    { id: 'ecommerce', name: 'E-commerce', icon: '🛒', companies: ['Jumia', 'SafeBoda'] }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Customer Support System</h1>
              <p className="text-gray-600">Context-aware support for local businesses</p>
            </div>
          </div>
          
          {/* Business Type Selector */}
          <div className="flex gap-2 flex-wrap">
            {businessTypes.map((business) => (
              <Button
                key={business.id}
                variant={selectedBusiness === business.id ? "default" : "outline"}
                onClick={() => setSelectedBusiness(business.id)}
                className="flex items-center gap-2"
              >
                <span>{business.icon}</span>
                {business.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat Interface
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Rules Engine
            </TabsTrigger>
            <TabsTrigger value="context" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Context Manager
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Business Config
            </TabsTrigger>
            <TabsTrigger value="ai-providers" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Providers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <ChatInterface businessType={selectedBusiness} />
          </TabsContent>

          <TabsContent value="rules">
            <RulesManager businessType={selectedBusiness} />
          </TabsContent>

          <TabsContent value="context">
            <ContextManager businessType={selectedBusiness} />
          </TabsContent>

          <TabsContent value="config">
            <BusinessConfig businessType={selectedBusiness} />
          </TabsContent>

          <TabsContent value="ai-providers">
            <div className="space-y-6">
              <AIProvidersConfig />
              <AnthropicTestPanel />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
