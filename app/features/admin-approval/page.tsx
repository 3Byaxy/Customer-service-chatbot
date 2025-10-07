"use client"

import AdminApprovalInterface from "@/components/admin-approval-interface"

export default function AdminApprovalFeaturePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Admin Approval System</h1>
      <p className="text-gray-600 mb-6">Sensitive actions require human review. Manage approvals and see conversations in real-time.</p>
      <div className="rounded-xl border bg-white">
        <div className="p-4 border-b bg-gradient-to-r from-neutral-800 to-black text-white rounded-t-xl">Live Demo</div>
        <div className="p-4">
          <AdminApprovalInterface />
        </div>
      </div>
    </div>
  )
}