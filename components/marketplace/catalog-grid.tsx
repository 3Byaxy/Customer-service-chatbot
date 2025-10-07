"use client"

import useSWR from "swr"
import TrustedCard from "@/components/marketplace/trusted-card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function CatalogGrid({ q = "" }: { q?: string }) {
  const { data } = useSWR(`/api/search/trusted?q=${encodeURIComponent(q)}`, fetcher)
  const items = data?.results || []

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item: any) => (
        <TrustedCard key={item.id} item={item} />
      ))}
    </div>
  )
}