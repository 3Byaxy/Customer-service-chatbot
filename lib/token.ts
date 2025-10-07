// Demo token signing/verification (NOT for production). Encodes payload in base64.
export type EmbedPayload = { tenantId: string; exp: number }

export function signEmbedToken(payload: EmbedPayload): string {
  const json = JSON.stringify(payload)
  return Buffer.from(json, 'utf8').toString('base64url')
}

export function verifyEmbedToken(token: string): EmbedPayload | null {
  try {
    const json = Buffer.from(token, 'base64url').toString('utf8')
    const payload = JSON.parse(json) as EmbedPayload
    if (!payload.exp || Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}
