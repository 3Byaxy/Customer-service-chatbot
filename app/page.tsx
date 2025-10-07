"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Bot, Globe, MessageSquare, Mic, Settings, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { lazy, Suspense, useState } from "react"
import HeroVideo from "@/components/marketing/hero-video"
import FeatureTiles from "@/components/marketing/feature-tiles"
import PeekGallery from "@/components/marketing/peek-gallery"
import DualAudience from "@/components/marketing/dual-audience"
import GetStartedStrip from "@/components/marketing/get-started-strip"
import AskLauncher from "@/components/marketing/ask-launcher"
import TrustedSearch from "@/components/marketing/trusted-search"

// Lazy load heavy components
const AdminApprovalInterface = lazy(() => import("@/components/admin-approval-interface"))
const BusinessConfig = lazy(() => import("@/components/business-config"))
const ChatInterface = lazy(() => import("@/components/chat-interface"))
const RealtimeComplaintsDashboard = lazy(() => import("@/components/realtime-complaints-dashboard"))
const VoiceChatInterface = lazy(() => import("@/components/voice-chat-interface"))

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
)

export default function Home() {
  const [businessType, setBusinessType] = useState("telecom")
  const [approvalRequests, setApprovalRequests] = useState<any[]>([])


  const handleApprovalRequest = (request: any) => {
    setApprovalRequests((prev) => [...prev, request])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <Bot className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            AI Customer Support System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Advanced multilingual customer support with voice capabilities, real-time monitoring, and intelligent admin approval workflows
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/features/language" className="flex">
              <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 bg-black text-white border border-black/10 shadow-sm hover:opacity-90">
                <Globe className="h-4 w-4 text-white" />
                Auto Language Detection
              </Badge>
            </Link>
            <Link href="/features/voice" className="flex">
              <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white border border-red-700/10 shadow-sm hover:opacity-90">
                <Mic className="h-4 w-4 text-white" />
                Voice Integration
              </Badge>
            </Link>
            <Link href="/features/admin-approval" className="flex">
              <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-amber-50 border border-amber-800/10 shadow-sm hover:opacity-90">
                <Shield className="h-4 w-4 text-amber-50" />
                Admin Approval System
              </Badge>
            </Link>
            <Link href="/features/realtime" className="flex">
              <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white border border-orange-600/10 shadow-sm hover:opacity-90">
                <Zap className="h-4 w-4 text-white" />
                Real-time Monitoring
              </Badge>
            </Link>
          </div>
        </div>

        {/* Hero with background video (assets in public/media) */}
        <HeroVideo />
        <PeekGallery />
        <DualAudience />
        <AskLauncher />
        <TrustedSearch />
        <FeatureTiles />
        <GetStartedStrip />


      </div>
    </div>
  )
}
