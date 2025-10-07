"use client"

import TrustedSearch from "@/components/marketing/trusted-search"
import CatalogGrid from "@/components/marketplace/catalog-grid"
import { useState } from "react"

export default function CatalogPage() {
  const [q, setQ] = useState("")
  const [submitted, setSubmitted] = useState("")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Product Catalog</h1>
      <p className="text-gray-600 mb-4">Browse trusted goods and services with quality badges.</p>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex gap-2 flex-wrap items-center">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search products" className="px-3 py-2 rounded border flex-1 min-w-[240px]" />
          <select className="px-3 py-2 rounded border">
            <option value="">All Categories</option>
            <option value="appliances">Appliances</option>
            <option value="outdoor">Outdoor</option>
            <option value="cars">Cars</option>
          </select>
          <button onClick={()=>setSubmitted(q)} className="px-4 py-2 rounded bg-blue-600 text-white text-sm">Search</button>
        </div>
      </div>

      <div className="mt-6">
        {submitted ? <CatalogGrid q={submitted} /> : <TrustedSearch />}
      </div>
    </div>
  )
}