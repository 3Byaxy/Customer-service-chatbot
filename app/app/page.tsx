import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, BarChart3, Bot } from 'lucide-react'
import Link from 'next/link'

export default function FullAppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/landing">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Full Platform</h1>
                <p className="text-sm text-gray-600">Complete Customer Service Solution</p>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
            <BarChart3 className="h-3 w-3 mr-1" />
            Full Featured
          </Badge>
        </div>

        {/* Redirect Notice */}
        <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3">
              <Bot className="h-6 w-6" />
              Full Platform Access
            </CardTitle>
            <CardDescription className="text-blue-100">
              You're being redirected to the complete customer service platform with all features enabled.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-6">
              The full platform includes all advanced features like voice chat, admin panels, real-time analytics, and business configuration tools.
            </p>
            
            <div className="space-y-4">
              <Link href="/">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 rounded-lg shadow-lg">
                  Launch Full Platform
                </Button>
              </Link>
              
              <p className="text-sm text-gray-500">
                This will take you to the main application with all features enabled.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/60 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Full Platform Features:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-700">Chat & AI</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Advanced AI Analysis</li>
                    <li>• Multi-language Support</li>
                    <li>• Context Management</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-700">Voice & Audio</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Voice Chat Interface</li>
                    <li>• Speech Recognition</li>
                    <li>• Text-to-Speech</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-700">Admin & Analytics</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Admin Approval System</li>
                    <li>• Real-time Dashboard</li>
                    <li>• Business Configuration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}