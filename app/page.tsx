"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Bot, Zap, Globe, Users, BarChart3, MessageSquare, Settings } from "lucide-react"

// Import components
import KyakuShienHeader from "@/frontend/components/brand/kyaku-shien-header"
import KyakuShienDashboard from "@/frontend/components/kyaku-shien-dashboard"
import KizunaAIWidget from "@/frontend/components/kizuna-ai-widget"
import BrandShowcase from "@/frontend/components/brand/brand-showcase"
import RealtimeComplaintsDashboard from "@/components/realtime-complaints-dashboard"
import AdminApprovalInterface from "@/components/admin-approval-interface"
import EnhancedChatInterface from "@/components/enhanced-chat-interface"

// Import branding
import { KYAKU_SHIEN_BRAND, KIZUNA_AI_BRAND } from "@/backend/config/branding-system"

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [activeTab, setActiveTab] = useState("overview")

  const handleNavigation = (page: string) => {
    setCurrentPage(page)
  }

  const handleApprovalRequest = (request: any) => {
    console.log("Approval request received:", request)
    // Handle approval request logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Customer Support System</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience next-generation customer service with our AI-powered support system. Get instant help with
            multi-language support and intelligent escalation.
          </p>
        </div>

        <EnhancedChatInterface />

        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">Multi-Language</h3>
              <p className="text-sm text-gray-600">English, Luganda, Swahili</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600">Always available to help</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">Smart Routing</h3>
              <p className="text-sm text-gray-600">Automatic escalation when needed</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">Industry Specific</h3>
              <p className="text-sm text-gray-600">Telecom, Banking, Utilities, E-commerce</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <KyakuShienHeader
        currentPage={currentPage}
        onNavigate={handleNavigation}
        showNotifications={true}
        notificationCount={3}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="complaints" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Live</span>
            </TabsTrigger>
            <TabsTrigger value="approvals" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Approvals</span>
            </TabsTrigger>
            <TabsTrigger value="brand" className="flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Brand</span>
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Demo</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Welcome Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-6 w-6" style={{ color: KYAKU_SHIEN_BRAND.colors.primary }} />
                    <span style={{ fontFamily: KYAKU_SHIEN_BRAND.typography.fontFamily.heading }}>
                      Welcome to {KYAKU_SHIEN_BRAND.name}
                    </span>
                  </CardTitle>
                  <CardDescription>{KYAKU_SHIEN_BRAND.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">System Status</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">All systems operational</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4" style={{ color: KIZUNA_AI_BRAND.colors.primary }} />
                        <span className="text-sm text-gray-600">KizunaAI is online</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">Quick Stats</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Active Conversations:</span>
                          <span className="font-medium">89</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Response Time:</span>
                          <span className="font-medium">2.3s</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Satisfaction:</span>
                          <span className="font-medium">4.6/5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.success }}>Enterprise Ready</Badge>
                    <Badge style={{ backgroundColor: KIZUNA_AI_BRAND.colors.primary }}>AI Powered</Badge>
                    <Badge style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.accent }}>Multi-Language</Badge>
                    <Badge style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.warning }}>Real-time</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* KizunaAI Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5" style={{ color: KIZUNA_AI_BRAND.colors.primary }} />
                    <span style={{ fontFamily: KIZUNA_AI_BRAND.typography.fontFamily.heading }}>
                      Meet {KIZUNA_AI_BRAND.name}
                    </span>
                  </CardTitle>
                  <CardDescription>{KIZUNA_AI_BRAND.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div
                        className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3"
                        style={{ background: KIZUNA_AI_BRAND.colors.gradient.primary }}
                      >
                        <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Your friendly AI companion ready to help customers in English, Luganda, and Swahili
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Capabilities:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Multi-language support</li>
                        <li>• Real-time responses</li>
                        <li>• Context awareness</li>
                        <li>• Escalation handling</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dashboard Content */}
            <KyakuShienDashboard />
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Chat Interface Demo</CardTitle>
                    <CardDescription>Experience KizunaAI in action with different business scenarios</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <Button
                        variant="outline"
                        className="h-16 flex flex-col items-center justify-center space-y-1 bg-transparent"
                      >
                        <Globe className="h-5 w-5" />
                        <span className="text-sm">Telecom Support</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-16 flex flex-col items-center justify-center space-y-1 bg-transparent"
                      >
                        <Users className="h-5 w-5" />
                        <span className="text-sm">Banking Support</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-16 flex flex-col items-center justify-center space-y-1 bg-transparent"
                      >
                        <Zap className="h-5 w-5" />
                        <span className="text-sm">Utilities Support</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-16 flex flex-col items-center justify-center space-y-1 bg-transparent"
                      >
                        <MessageSquare className="h-5 w-5" />
                        <span className="text-sm">E-commerce Support</span>
                      </Button>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-2">Select a business type above to start chatting</p>
                      <Badge variant="outline">Demo Mode</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <KizunaAIWidget
                  businessType="telecom"
                  position="embedded"
                  maxHeight={600}
                  onApprovalRequest={handleApprovalRequest}
                />
              </div>
            </div>
          </TabsContent>

          {/* Live Complaints Tab */}
          <TabsContent value="complaints">
            <RealtimeComplaintsDashboard />
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals">
            <AdminApprovalInterface />
          </TabsContent>

          {/* Brand Tab */}
          <TabsContent value="brand">
            <BrandShowcase />
          </TabsContent>

          {/* Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Architecture Demo</CardTitle>
                <CardDescription>Complete customer service chatbot stack implementation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Shield className="h-8 w-8 mx-auto mb-2" style={{ color: KYAKU_SHIEN_BRAND.colors.primary }} />
                      <h3 className="font-semibold">Backend</h3>
                      <p className="text-sm text-gray-600">Vercel deployment ready</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Bot className="h-8 w-8 mx-auto mb-2" style={{ color: KIZUNA_AI_BRAND.colors.primary }} />
                      <h3 className="font-semibold">AI Brain</h3>
                      <p className="text-sm text-gray-600">OpenAI & Hugging Face</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2" style={{ color: KYAKU_SHIEN_BRAND.colors.accent }} />
                      <h3 className="font-semibold">Database</h3>
                      <p className="text-sm text-gray-600">Supabase integration</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Zap className="h-8 w-8 mx-auto mb-2" style={{ color: KYAKU_SHIEN_BRAND.colors.warning }} />
                      <h3 className="font-semibold">Automation</h3>
                      <p className="text-sm text-gray-600">n8n workflows</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Deployment Ready Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">✅ Core Features</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Multi-language chat interface</li>
                        <li>• Real-time conversation handling</li>
                        <li>• Admin approval system</li>
                        <li>• Live complaints dashboard</li>
                        <li>• Brand system integration</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">🚀 Ready for Production</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Vercel deployment configuration</li>
                        <li>• Environment variables setup</li>
                        <li>• API routes optimized</li>
                        <li>• Mobile responsive design</li>
                        <li>• Error handling & fallbacks</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating Chat Widget */}
      <KizunaAIWidget businessType="telecom" position="bottom-right" onApprovalRequest={handleApprovalRequest} />
    </div>
  )
}
