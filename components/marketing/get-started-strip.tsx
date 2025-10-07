"use client"

import Link from "next/link"

export default function GetStartedStrip() {
  return (
    <section className="mt-10 rounded-2xl border bg-gradient-to-r from-blue-50 to-purple-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-800">
        <Step title="Create Tenant" desc="Sign up and create your business tenant." />
        <Step title="Approve" desc="We approve and issue embed keys and tokens." />
        <Step title="Embed & Monitor" desc="Paste snippet, go live, and watch the dashboard." />
      </div>
      <div className="mt-4 flex gap-3">
        <Link href="/widget/embedded?tenant=demo" className="inline-flex">
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">Try Embedded Demo</button>
        </Link>
        <Link href="/admin" className="inline-flex">
          <button className="px-4 py-2 rounded-md bg-white border text-sm hover:bg-gray-50">Open Admin</button>
        </Link>
      </div>
    </section>
  )
}

function Step({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl bg-white border p-4 shadow-sm">
      <div className="font-medium">{title}</div>
      <div className="text-gray-600 mt-1">{desc}</div>
    </div>
  )
}