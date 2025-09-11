"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, TestTube, MessageSquare, Settings, BarChart3 } from "lucide-react"
import EnhancedChatInterface from "@/components/enhanced-chat-interface"
import VoiceTestPanel from "@/components/voice-test-panel"
import { getServiceStatus } from "@/lib/api-keys"
import { n8nIntegration } from "@/lib/n8n-integration"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("chat")
  const serviceStatus = getServiceStatus()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bot className="h-8 w-8 text-blue-600" />
                AI Customer Support System
              </h1>
              <p className="text-gray-600 mt-2">Complete voice-enabled customer support with n8n workflow automation</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={serviceStatus.ai_providers.gemini ? "default" : "outline"}>
                Gemini: {serviceStatus.ai_providers.gemini ? "Ready" : "Not configured"}
              </Badge>
              <Badge variant={serviceStatus.voice_services.elevenlabs ? "default" : "outline"}>
                Voice: {serviceStatus.voice_services.elevenlabs ? "Premium" : "Basic"}
              </Badge>
              <Badge variant={n8nIntegration.isConfigured() ? "default" : "outline"}>
                N8n: {n8nIntegration.isConfigured() ? "Connected" : "Not configured"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat Interface
            </TabsTrigger>
            <TabsTrigger value="voice-test" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Voice Test Panel
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <EnhancedChatInterface />
          </TabsContent>

          <TabsContent value="voice-test" className="space-y-4">
            <VoiceTestPanel />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Total Conversations</h3>
                    <p className="text-2xl font-bold text-blue-600">0</p>
                    <p className="text-sm text-muted-foreground">No conversations yet</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Escalations</h3>
                    <p className="text-2xl font-bold text-yellow-600">0</p>
                    <p className="text-sm text-muted-foreground">No escalations yet</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Voice Interactions</h3>
                    <p className="text-2xl font-bold text-green-600">0</p>
                    <p className="text-sm text-muted-foreground">No voice interactions yet</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="font-medium mb-4">N8n Webhook Status</h3>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span>Webhook URL:</span>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{n8nIntegration.getWebhookUrl()}</code>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span>Agent ID:</span>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{n8nIntegration.getAgentId()}</code>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span>Status:</span>
                      <Badge variant={n8nIntegration.isConfigured() ? "default" : "outline"}>
                        {n8nIntegration.isConfigured() ? "Connected" : "Not configured"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">AI Providers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span>Google Gemini</span>
                          <Badge variant={serviceStatus.ai_providers.gemini ? "default" : "outline"}>
                            {serviceStatus.ai_providers.gemini ? "Configured" : "Not configured"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Free tier AI provider for text generation</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span>Anthropic Claude</span>
                          <Badge variant={serviceStatus.ai_providers.anthropic ? "default" : "outline"}>
                            {serviceStatus.ai_providers.anthropic ? "Configured" : "Not configured"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Premium AI provider with advanced reasoning
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Voice Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span>Browser TTS/STT</span>
                          <Badge variant="default">Always Available</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Built-in browser speech recognition and synthesis
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span>ElevenLabs TTS</span>
                          <Badge variant={serviceStatus.voice_services.elevenlabs ? "default" : "outline"}>
                            {serviceStatus.voice_services.elevenlabs ? "Configured" : "Not configured"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Premium text-to-speech with natural voices</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Workflow Automation</h3>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span>N8n Integration</span>
                        <Badge variant={n8nIntegration.isConfigured() ? "default" : "outline"}>
                          {n8nIntegration.isConfigured() ? "Connected" : "Not configured"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Automated workflows for escalations and notifications
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Webhook URL:</span>
                          <br />
                          <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                            {n8nIntegration.getWebhookUrl()}
                          </code>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Agent ID:</span>
                          <br />
                          <code className="text-xs bg-muted px-2 py-1 rounded">{n8nIntegration.getAgentId()}</code>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Database</h3>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span>Supabase</span>
                        <Badge variant={serviceStatus.database.supabase ? "default" : "outline"}>
                          {serviceStatus.database.supabase ? "Connected" : "Not configured"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        PostgreSQL database for storing conversations and analytics
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
