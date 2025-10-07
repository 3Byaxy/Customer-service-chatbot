// In-memory tenant store for development/demo only.
export type TenantStatus = 'pending' | 'approved' | 'suspended'
export type Tenant = { id: string; name: string; status: TenantStatus; createdAt: string; publicKey: string }

const tenants = new Map<string, Tenant>()

export function createTenant(name: string): Tenant {
  const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const t: Tenant = { id, name, status: 'pending', createdAt: new Date().toISOString(), publicKey: `pub_${Math.random().toString(36).slice(2, 10)}` }
  tenants.set(id, t)
  return t
}

export function approveTenant(id: string) {
  const t = tenants.get(id)
  if (t) { t.status = 'approved'; tenants.set(id, t) }
  return t
}

export function getTenant(id: string) { return tenants.get(id) || null }

export function listTenants() { return Array.from(tenants.values()) }
