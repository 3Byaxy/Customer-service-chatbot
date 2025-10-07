import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Bot, Mic, Settings, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <Bot className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            Customer Service Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Choose your experience: Start with our simple MVP for quick deployment, or explore the full-featured platform with advanced capabilities.
          </p>
        </div>

        {/* Version Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {/* MVP Version Card */}
          <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                <Zap className="h-3 w-3 mr-1" />
                Quick Start
              </Badge>
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                MVP Version
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Minimal Viable Product - Perfect for getting started quickly with essential features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">Features Included:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-blue-500" />
                    Basic AI Chat Interface
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-500" />
                    Simple Language Detection
                  </li>
                  <li className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-gray-500" />
                    Basic Configuration
                  </li>
                </ul>
              </div>
              
              <div className="pt-4">
                <Link href="/mvp">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
                    Launch MVP Version
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Full Platform Card */}
          <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                <BarChart3 className="h-3 w-3 mr-1" />
                Full Featured
              </Badge>
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                Full Platform
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Complete customer service solution with advanced AI, analytics, and admin features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">Features Included:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-blue-500" />
                    Advanced AI Chat with Analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-purple-500" />
                    Voice Chat Integration
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    Admin Approval System
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-orange-500" />
                    Real-time Analytics Dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-gray-500" />
                    Business Configuration
                  </li>
                </ul>
              </div>
              
              <div className="pt-4">
                <Link href="/app">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
                    Launch Full Platform
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access to Current Version */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Want to see the current integrated version?
          </p>
          <Link href="/">
            <Button variant="outline" className="px-8 py-3 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200">
              View Current Version
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}