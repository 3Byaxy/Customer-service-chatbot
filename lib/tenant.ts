// Minimal tenant resolver stub (development)
// Replace with real session/API key/token checks when wiring multi-tenancy.
import { headers } from 'next/headers'

export type TenantContext = {
  tenantId: string
  authType: 'user' | 'embed' | 'api-key' | 'dev'
}

export async function resolveTenant(): Promise<TenantContext | null> {
  const h = headers()

  // Dev override: allow a plain header
  const devTenant = h.get('x-kyaku-tenant')
  if (devTenant) {
    return { tenantId: devTenant, authType: 'dev' }
  }

  // TODO: Read from authenticated session or embed token / api key
  return null
}
