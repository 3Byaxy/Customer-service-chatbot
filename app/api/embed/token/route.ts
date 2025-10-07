import { NextRequest, NextResponse } from 'next/server'
import { getTenant } from '@/lib/tenants-store'
import { signEmbedToken } from '@/lib/token'

export async function POST(req: NextRequest) {
  try {
    const { tenantId, publicKey } = await req.json()
    if (!tenantId || !publicKey) {
      return NextResponse.json({ error: 'tenantId and publicKey are required' }, { status: 400 })
    }
    const tenant = getTenant(tenantId)
    if (!tenant) return NextResponse.json({ error: 'tenant not found' }, { status: 404 })
    if (tenant.publicKey !== publicKey) return NextResponse.json({ error: 'invalid key' }, { status: 403 })
    if (tenant.status !== 'approved') return NextResponse.json({ error: 'tenant not approved' }, { status: 403 })

    const exp = Date.now() + 1000 * 60 * 15 // 15 minutes
    const token = signEmbedToken({ tenantId, exp })
    return NextResponse.json({ token, exp })
  } catch (e) {
    return NextResponse.json({ error: 'failed to mint token' }, { status: 500 })
  }
}
