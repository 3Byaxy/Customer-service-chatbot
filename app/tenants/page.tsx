"use client"

import { useEffect, useState } from "react"

interface Tenant { id: string; name: string; status: string; createdAt: string; publicKey: string }

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  async function refresh() {
    const res = await fetch("/api/tenants/provision", { cache: "no-store" })
    const data = await res.json()
    setTenants(data.tenants || [])
  }

  useEffect(() => { refresh() }, [])

  async function createTenant() {
    if (!name.trim()) return
    setLoading(true)
    try {
      await fetch("/api/tenants/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      setName("")
      await refresh()
    } finally { setLoading(false) }
  }

  async function approveTenant(tenantId: string) {
    setLoading(true)
    try {
      await fetch("/api/tenants/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId }),
      })
      await refresh()
    } finally { setLoading(false) }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Tenants (Dev)</h1>

      <div className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tenant name"
          className="px-3 py-2 rounded border w-80"
        />
        <button onClick={createTenant} disabled={loading || !name.trim()} className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
          Create
        </button>
        <button onClick={refresh} className="px-3 py-2 rounded border bg-white">Refresh</button>
      </div>

      <div className="rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">Public Key</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-3">{t.name}</td>
                <td className="p-3">{t.status}</td>
                <td className="p-3 font-mono text-xs">{t.publicKey}</td>
                <td className="p-3">
                  {t.status !== "approved" && (
                    <button onClick={() => approveTenant(t.id)} className="px-3 py-1 rounded bg-neutral-900 text-white text-xs">Approve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}