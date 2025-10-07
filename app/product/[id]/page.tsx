"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"
import { TRUSTED_ITEMS } from "@/lib/data/trusted"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ProductDetailPage() {
  const params = useParams()
  const item = useMemo(()=> TRUSTED_ITEMS.find(i=> i.id === params?.id), [params])

  if (!item) return <div className="container mx-auto px-4 py-8">Product not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border bg-white">
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">{item.name}</h1>
          <div className="text-green-700 font-semibold">{item.price}</div>
          <p className="text-gray-700">{item.description}</p>
          <div className="flex flex-wrap gap-1">
            {item.badges.map((b) => (<Badge key={b} variant="outline">{b}</Badge>))}
          </div>
          <div className="flex gap-3 pt-2">
            <Button>Add to Cart</Button>
            <Button variant="outline">Contact Seller</Button>
          </div>
        </div>
      </div>
    </div>
  )
}