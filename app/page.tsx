"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ChatInterface from "@/components/chat-interface"
import VoiceChatInterface from "@/components/voice-chat-interface"
import CompactChatbotWidget from "@/components/compact-chatbot-widget"
import AdminApprovalInterface from "@/components/admin-approval-interface"
import RealtimeComplaintsDashboard from "@/components/realtime-complaints-dashboard"
import BusinessConfig from "@/components/business-config"
import { MessageSquare, Mic, Settings, Shield, BarChart3, Zap, Globe, Bot } from "lucide-react"

export default function Home() {
  const [businessType, setBusinessType] = useState("telecom")
  const [approvalRequests, setApprovalRequests] = useState<any[]>([])

  const handleApprovalRequest = (request: any) => {
    setApprovalRequests((prev) => [...prev, request])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🤖 AI Customer Support System</h1>
          <p className="text-xl text-gray-600 mb-6">
            Advanced multilingual customer support with voice capabilities, real-time monitoring, and admin approval
            workflows
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="outline" className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Auto Language Detection
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Mic className="h-3 w-3" />
              Voice Integration
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Admin Approval System
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Real-time Monitoring
            </Badge>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="compact-chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="compact-chat" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Compact Chat
            </TabsTrigger>
            <TabsTrigger value="full-chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Full Chat
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice Chat
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin Panel
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Live Dashboard
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Compact Chatbot Widget */}
          <TabsContent value="compact-chat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Compact Chatbot Widget
                </CardTitle>
                <CardDescription>
                  Small, embeddable chatbot widget with auto language detection and admin approval workflow. Perfect for
                  integration into existing systems.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Business Type Selector */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Business Type:</span>
                    <div className="flex gap-2">
                      {["telecom", "banking", "utilities", "ecommerce"].map((type) => (
                        <Button
                          key={type}
                          variant={businessType === type ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBusinessType(type)}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Widget Demo */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600">
                        This is how the widget appears when embedded in your system
                      </p>
                    </div>
                    <div className="relative h-[500px] bg-white rounded-lg shadow-sm">
                      <CompactChatbotWidget
                        businessType={businessType}
                        position="embedded"
                        maxHeight={480}
                        onApprovalRequest={handleApprovalRequest}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Globe className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                          <h3 className="font-medium">Auto Language Detection</h3>
                          <p className="text-sm text-gray-600">Detects English, Luganda, and Swahili automatically</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
                          <h3 className="font-medium">Admin Approval</h3>
                          <p className="text-sm text-gray-600">Critical requests require admin approval</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Mic className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                          <h3 className="font-medium">Voice Input</h3>
                          <p className="text-sm text-gray-600">Speech recognition for hands-free interaction</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Bot className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
                          <h3 className="font-medium">Smart Suggestions</h3>
                          <p className="text-sm text-gray-600">AI-powered response suggestions</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Full Chat Interface */}
          <TabsContent value="full-chat">
            <Card>
              <CardHeader>
                <CardTitle>Full Chat Interface</CardTitle>
                <CardDescription>
                  Complete chat interface with advanced AI analysis and multilingual support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatInterface businessType={businessType} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voice Chat */}
          <TabsContent value="voice">
            <Card>
              <CardHeader>
                <CardTitle>Voice Chat Interface</CardTitle>
                <CardDescription>Voice-enabled chat with ElevenLabs TTS and Vapi integration</CardDescription>
              </CardHeader>
              <CardContent>
                <VoiceChatInterface businessType={businessType} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Panel */}
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Approval Panel</CardTitle>
                <CardDescription>
                  Monitor and approve chatbot interactions, view conversations in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminApprovalInterface />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Dashboard */}
          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Complaints Dashboard</CardTitle>
                <CardDescription>Live monitoring of complaints, solutions, and system performance</CardDescription>
              </CardHeader>
              <CardContent>
                <RealtimeComplaintsDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Business Configuration</CardTitle>
                <CardDescription>Configure business-specific settings and AI behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessConfig />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Floating Compact Widget Demo */}
        <CompactChatbotWidget
          businessType={businessType}
          position="bottom-right"
          onApprovalRequest={handleApprovalRequest}
        />
      </div>
    </div>
  )
}
