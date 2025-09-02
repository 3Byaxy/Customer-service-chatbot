"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import KizunaAIWidget from "../components/kizuna-ai-widget"
import KyakuShienDashboard from "../components/kyaku-shien-dashboard"
import { MessageSquare, Bot, BarChart3, Settings, Mic, Shield, Globe, Zap } from "lucide-react"
import { APP_CONFIG } from "../../backend/config/app-config"

export default function KyakuShienApp() {
  const [businessType, setBusinessType] = useState("telecom")
  const [approvalRequests, setApprovalRequests] = useState<any[]>([])

  const handleApprovalRequest = (request: any) => {
    setApprovalRequests((prev) => [...prev, request])
  }

  const businessTypes = [
    { id: "telecom", name: "Telecommunications", icon: "📱", color: "bg-blue-500" },
    { id: "banking", name: "Banking Services", icon: "🏦", color: "bg-green-500" },
    { id: "utilities", name: "Utility Services", icon: "⚡", color: "bg-yellow-500" },
    { id: "ecommerce", name: "E-commerce", icon: "🛒", color: "bg-purple-500" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Bot className="h-10 w-10 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900">{APP_CONFIG.name}</h1>
              <p className="text-xl text-gray-600">Advanced AI Customer Support System</p>
            </div>
          </div>

          <p className="text-lg text-gray-600 mb-6">
            Meet <strong>{APP_CONFIG.chatbot.name}</strong> - Your intelligent multilingual customer support companion
          </p>

          {/* Business Type Selection */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {businessTypes.map((type) => (
              <Button
                key={type.id}
                variant={businessType === type.id ? "default" : "outline"}
                onClick={() => setBusinessType(type.id)}
                className="flex items-center gap-2"
              >
                <span>{type.icon}</span>
                {type.name}
              </Button>
            ))}
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Globe className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="font-medium">Auto Language Detection</p>
                <p className="text-sm text-gray-600">English, Luganda, Swahili</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Bot className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="font-medium">{APP_CONFIG.chatbot.name}</p>
                <p className="text-sm text-gray-600">AI-powered responses</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="font-medium">Admin Approval</p>
                <p className="text-sm text-gray-600">Secure workflows</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Mic className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <p className="font-medium">Voice Support</p>
                <p className="text-sm text-gray-600">Speech recognition</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat Interface
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin Panel
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Chat Interface */}
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  {APP_CONFIG.chatbot.name} - AI Customer Support
                  <Badge variant="secondary">{businessType.toUpperCase()}</Badge>
                </CardTitle>
                <CardDescription>
                  Experience intelligent customer support with auto language detection, voice input, and admin approval
                  workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Embedded Widget Demo */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600">
                        Compact widget perfect for integration into existing systems
                      </p>
                    </div>
                    <div className="relative h-[500px] bg-white rounded-lg shadow-sm">
                      <KizunaAIWidget
                        businessType={businessType}
                        position="embedded"
                        maxHeight={480}
                        onApprovalRequest={handleApprovalRequest}
                      />
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Globe className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                          <h3 className="font-medium">Smart Language Detection</h3>
                          <p className="text-sm text-gray-600">Automatically detects and responds in user's language</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
                          <h3 className="font-medium">Approval Workflow</h3>
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
                          <Zap className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
                          <h3 className="font-medium">Real-time Processing</h3>
                          <p className="text-sm text-gray-600">Instant responses with AI analysis</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboard */}
          <TabsContent value="dashboard">
            <KyakuShienDashboard />
          </TabsContent>

          {/* Admin Panel */}
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Approval Panel</CardTitle>
                <CardDescription>Monitor conversations and approve {APP_CONFIG.chatbot.name} responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvalRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">No pending approval requests</p>
                      <p className="text-sm text-gray-500">
                        Approval requests will appear here when {APP_CONFIG.chatbot.name} needs admin review
                      </p>
                    </div>
                  ) : (
                    approvalRequests.map((request, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">Pending Approval</Badge>
                              <span className="text-sm text-gray-500">{request.businessType}</span>
                            </div>
                            <div>
                              <p className="font-medium">User Message:</p>
                              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{request.userMessage}</p>
                            </div>
                            <div>
                              <p className="font-medium">{APP_CONFIG.chatbot.name} Suggested Response:</p>
                              <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                                {request.suggestedResponse}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Approve
                              </Button>
                              <Button size="sm" variant="outline">
                                Edit & Approve
                              </Button>
                              <Button size="sm" variant="destructive">
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Configure {APP_CONFIG.name} settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Application Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Application Name</label>
                        <p className="text-sm text-gray-600">{APP_CONFIG.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Chatbot Name</label>
                        <p className="text-sm text-gray-600">{APP_CONFIG.chatbot.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Version</label>
                        <p className="text-sm text-gray-600">{APP_CONFIG.version}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Supported Languages</label>
                        <div className="flex gap-1 mt-1">
                          {APP_CONFIG.supportedLanguages.map((lang) => (
                            <Badge key={lang} variant="outline">
                              {lang.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(APP_CONFIG.features).map(([feature, enabled]) => (
                        <div key={feature} className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">
                            {feature.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <Badge variant={enabled ? "default" : "secondary"}>{enabled ? "Enabled" : "Disabled"}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Floating Widget Demo */}
        <KizunaAIWidget businessType={businessType} position="bottom-right" onApprovalRequest={handleApprovalRequest} />
      </div>
    </div>
  )
}
