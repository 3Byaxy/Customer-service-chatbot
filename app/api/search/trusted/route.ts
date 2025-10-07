import { NextRequest, NextResponse } from "next/server"
import { TRUSTED_ITEMS } from "@/lib/data/trusted"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") || "").toLowerCase()
  const category = (searchParams.get("category") || "").toLowerCase()

  let results = TRUSTED_ITEMS
  if (q) {
    results = results.filter(
      (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.category.includes(q) || i.vendor.toLowerCase().includes(q),
    )
  }
  if (category) {
    results = results.filter((i) => i.category === category)
  }

  return NextResponse.json({ results })
}