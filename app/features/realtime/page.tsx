"use client"

import RealtimeComplaintsDashboard from "@/components/realtime-complaints-dashboard"

export default function RealtimeFeaturePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Real-time Monitoring</h1>
      <p className="text-gray-600 mb-6">Track conversations, complaints, and system health live.</p>
      <div className="rounded-xl border bg-white">
        <div className="p-4 border-b bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-t-xl">Live Demo</div>
        <div className="p-4">
          <RealtimeComplaintsDashboard />
        </div>
      </div>
    </div>
  )
}