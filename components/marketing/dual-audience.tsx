"use client"

import Link from "next/link"

export default function DualAudience() {
  return (
    <section id="audiences" className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">For Customers</h3>
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
            <li>Voice and Text support with streaming responses</li>
            <li>Auto language detection (English, Luganda, Swahili)</li>
            <li>Fast answers to common service and product questions</li>
            <li>Quality assurance indicators and clear product info</li>
          </ul>
          <div className="mt-4">
            <Link href="/features/language" className="inline-flex">
              <button className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">See Customer Demo</button>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">For Admins</h3>
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
            <li>Human approvals for sensitive actions (refunds, billing)</li>
            <li>Live monitoring: complaints, performance, system health</li>
            <li>Configurable business rules and language settings</li>
            <li>Audit logs and usage analytics per tenant</li>
          </ul>
          <div className="mt-4 flex gap-3">
            <Link href="/features/admin-approval" className="inline-flex">
              <button className="px-4 py-2 rounded-md bg-neutral-900 text-white text-sm hover:bg-neutral-800">See Admin Demo</button>
            </Link>
            <Link href="/admin" className="inline-flex">
              <button className="px-4 py-2 rounded-md bg-white border text-sm hover:bg-gray-50">Open Admin</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}