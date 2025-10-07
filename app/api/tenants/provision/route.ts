import { NextRequest, NextResponse } from 'next/server'
import { createTenant, listTenants } from '@/lib/tenants-store'

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json()
    if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 })
    const tenant = createTenant(name)
    return NextResponse.json({ tenant })
  } catch (e) {
    return NextResponse.json({ error: 'failed to provision tenant' }, { status: 500 })
  }
}

export async function GET() {
  // Dev helper: list in-memory tenants
  return NextResponse.json({ tenants: listTenants() })
}
