"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Shield, Sparkles, Globe, Zap, Users } from "lucide-react"

// Import components
import KyakuShienDashboard from "@/frontend/components/kyaku-shien-dashboard"
import KizunaAIWidget from "@/frontend/components/kizuna-ai-widget"
import BrandShowcase from "@/frontend/components/brand/brand-showcase"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showChatWidget, setShowChatWidget] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-teal-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-6 mb-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl mb-3">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  KyakuShien
                </h2>
                <p className="text-sm text-blue-100">Professional Platform</p>
              </div>

              <div className="text-4xl text-white/60">+</div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-xl mb-3 animate-pulse">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Nunito, sans-serif" }}>
                  KizunaAI
                </h2>
                <p className="text-sm text-blue-100">Friendly Companion</p>
              </div>
            </div>

            <h1
              className="text-4xl sm:text-6xl font-bold text-white mb-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              The Future of
              <span className="block bg-gradient-to-r from-teal-300 to-pink-300 bg-clip-text text-transparent">
                Customer Support
              </span>
            </h1>

            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
              Professional enterprise credibility meets warm human connection. Built on <strong>KyakuShien</strong>,
              powered by <strong>KizunaAI</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                className="bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8 py-3"
                onClick={() => setActiveTab("dashboard")}
              >
                <Shield className="h-5 w-5 mr-2" />
                View Dashboard
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-900 font-semibold px-8 py-3 bg-transparent"
                onClick={() => setShowChatWidget(true)}
              >
                <Bot className="h-5 w-5 mr-2" />
                Try KizunaAI
              </Button>
            </div>

            <div className="mt-8 flex justify-center space-x-4 flex-wrap">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Globe className="h-3 w-3 mr-1" />
                Multi-language Support
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Zap className="h-3 w-3 mr-1" />
                Voice Integration
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Users className="h-3 w-3 mr-1" />
                Admin Approval System
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Real-time Monitoring
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Complete AI Customer Support Solution
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
            Experience the perfect blend of professional enterprise tools and friendly AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span>Enterprise Dashboard</span>
              </CardTitle>
              <CardDescription>Professional monitoring and analytics powered by KyakuShien</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Real-time conversation monitoring</li>
                <li>• Advanced analytics and insights</li>
                <li>• Multi-language support tracking</li>
                <li>• System health monitoring</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-6 w-6 text-teal-600" />
                <span>AI Assistant</span>
              </CardTitle>
              <CardDescription>Friendly and intelligent support powered by KizunaAI</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Natural conversation in 3 languages</li>
                <li>• Voice input and output support</li>
                <li>• Context-aware responses</li>
                <li>• Emotional intelligence</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
                <span>Smart Features</span>
              </CardTitle>
              <CardDescription>Advanced capabilities for modern customer support</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Auto language detection</li>
                <li>• Admin approval workflows</li>
                <li>• Real-time API integrations</li>
                <li>• Comprehensive logging</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Demo Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-transparent">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="brand" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Brand System
              </TabsTrigger>
              <TabsTrigger value="chat" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Chat Demo
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">KyakuShien Dashboard</h3>
              <p className="text-gray-600">Professional monitoring and management interface</p>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-xl">
              <KyakuShienDashboard />
            </div>
          </TabsContent>

          <TabsContent value="brand" className="space-y-4">
            <BrandShowcase />
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <div className="min-h-screen bg-gray-50 py-8">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">KizunaAI Chat Demo</h1>
                  <p className="text-lg text-gray-600">Experience our intelligent customer support companion</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8">
                  <KizunaAIWidget
                    businessType="demo"
                    position="embedded"
                    maxHeight={600}
                    onApprovalRequest={(request) => {
                      console.log("Demo approval request:", request)
                    }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Chat Widget */}
      {showChatWidget && (
        <KizunaAIWidget
          businessType="demo"
          position="bottom-right"
          onApprovalRequest={(request) => console.log("Approval request:", request)}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="text-4xl text-gray-600">+</div>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-pink-400 rounded-xl flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
              KyakuShien × KizunaAI
            </h3>
            <p className="text-gray-400 mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              The complete customer support solution with AI-powered assistance
            </p>

            <div className="flex justify-center space-x-4 flex-wrap mb-6">
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                Multi-language Support
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                Voice Integration
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                Admin Approval System
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                Real-time Monitoring
              </Badge>
            </div>

            <p className="text-gray-500 text-sm">© 2024 KyakuShien. Built with ❤️ for better customer support.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
