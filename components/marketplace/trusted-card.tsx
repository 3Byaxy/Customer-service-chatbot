"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function TrustedCard({ item }: { item: any }) {
  return (
    <div className="rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative aspect-[4/3]">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{item.name}</h3>
          <span className="text-sm text-green-700 font-semibold">{item.price}</span>
        </div>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {item.badges?.slice(0,3).map((b: string, idx: number) => (
            <Badge key={idx} variant="outline" className="text-[10px]">{b}</Badge>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Badge variant="secondary" className="text-[10px] bg-blue-600 text-white border-blue-700">Trusted</Badge>
          <Button size="sm" className="h-8 px-3">Add to Cart</Button>
        </div>
      </div>
    </div>
  )
}