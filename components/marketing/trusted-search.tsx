"use client"

import { useState } from "react"
import CatalogGrid from "@/components/marketplace/catalog-grid"

export default function TrustedSearch() {
  const [q, setQ] = useState("")
  const [submitted, setSubmitted] = useState("")

  return (
    <section className="mt-8">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="text-sm text-gray-700 mb-2">Search trusted results</div>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g., washing machine, car dealer, data bundle"
            className="flex-1 px-3 py-2 rounded border"
          />
          <button onClick={() => setSubmitted(q)} className="px-4 py-2 rounded bg-blue-600 text-white text-sm">Search</button>
        </div>
      </div>

      {submitted && (
        <div className="mt-4">
          <CatalogGrid q={submitted} />
        </div>
      )}
    </section>
  )
}