import { NextRequest, NextResponse } from 'next/server'
import { approveTenant, getTenant } from '@/lib/tenants-store'

export async function POST(req: NextRequest) {
  try {
    const { tenantId } = await req.json()
    if (!tenantId) return NextResponse.json({ error: 'tenantId is required' }, { status: 400 })
    const before = getTenant(tenantId)
    if (!before) return NextResponse.json({ error: 'tenant not found' }, { status: 404 })
    const tenant = approveTenant(tenantId)
    return NextResponse.json({ tenant })
  } catch (e) {
    return NextResponse.json({ error: 'failed to approve tenant' }, { status: 500 })
  }
}